import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Log request details for debugging
    console.log('Webhook request method:', req.method)
    console.log('Webhook request headers:', Object.fromEntries(req.headers.entries()))

    // Initialize Stripe
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')

    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY environment variable not set')
      return new Response(
        JSON.stringify({ error: 'Stripe configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    if (!webhookSecret) {
      console.error('STRIPE_WEBHOOK_SECRET environment variable not set')
      return new Response(
        JSON.stringify({ error: 'Webhook configuration error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Initialize Supabase client with service role key
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    })

    // Get the raw body and signature
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    console.log('Stripe signature present:', !!signature)

    if (!signature) {
      console.error('No Stripe signature found in headers')
      return new Response(
        JSON.stringify({ error: 'No Stripe signature found' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Verify the webhook signature
    let event: Stripe.Event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
      console.log('Webhook signature verified successfully')
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      console.error('Webhook signature verification failed:', errorMessage)
      return new Response(
        JSON.stringify({ error: 'Webhook signature verification failed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Log the webhook event
    console.log(`Received webhook: ${event.type}`)

    // Store webhook event for tracking
    try {
      await supabase
        .from('payment_webhooks')
        .insert({
          provider: 'stripe',
          event_id: event.id,
          event_type: event.type,
          data: event.data,
          processed: false,
        })
      console.log('Webhook event stored successfully')
    } catch (dbError) {
      console.error('Failed to store webhook event:', dbError)
      // Continue processing even if storage fails
    }

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent, supabase)
        break

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent, supabase)
        break

      case 'payment_intent.canceled':
        await handlePaymentIntentCanceled(event.data.object as Stripe.PaymentIntent, supabase)
        break

      case 'payment_method.attached':
        await handlePaymentMethodAttached(event.data.object as Stripe.PaymentMethod, supabase)
        break

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        // Handle subscription events (future implementation)
        console.log(`Subscription event: ${event.type}`)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    // Mark webhook as processed
    try {
      await supabase
        .from('payment_webhooks')
        .update({ processed: true, processed_at: new Date().toISOString() })
        .eq('event_id', event.id)
      console.log('Webhook marked as processed')
    } catch (dbError) {
      console.error('Failed to mark webhook as processed:', dbError)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Webhook error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent, supabase: any) {
  console.log('Payment succeeded:', paymentIntent.id)

  try {
    // Update transaction status
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .update({
        status: 'completed',
        completed_at: new Date().toISOString(),
      })
      .eq('provider_transaction_id', paymentIntent.id)
      .select()
      .single()

    if (transactionError) {
      console.error('Failed to update transaction:', transactionError)
      return
    }

    // If this was a boost payment, activate the boost
    if (transaction && paymentIntent.metadata.type === 'boost') {
      const { error: boostError } = await supabase
        .from('boosts')
        .update({
          is_active: true,
          starts_at: new Date().toISOString(),
        })
        .eq('transaction_id', transaction.id)

      if (boostError) {
        console.error('Failed to activate boost:', boostError)
      } else {
        console.log('Boost activated for transaction:', transaction.id)
      }

      // Create notification for successful boost
      await supabase
        .from('notifications')
        .insert({
          user_id: transaction.user_id,
          type: 'boost_activated',
          title: 'Boost Activated!',
          message: `Your ${paymentIntent.metadata.boostType} boost is now active.`,
          metadata: {
            itemId: paymentIntent.metadata.itemId,
            boostType: paymentIntent.metadata.boostType,
            transactionId: transaction.id,
          },
        })
    }

    console.log('Payment processing completed successfully')

  } catch (error) {
    console.error('Error handling payment success:', error)
  }
}

async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent, supabase: any) {
  console.log('Payment failed:', paymentIntent.id)

  try {
    // Update transaction status
    await supabase
      .from('transactions')
      .update({
        status: 'failed',
        completed_at: new Date().toISOString(),
      })
      .eq('provider_transaction_id', paymentIntent.id)

    // Create notification for failed payment
    if (paymentIntent.metadata.userId) {
      await supabase
        .from('notifications')
        .insert({
          user_id: paymentIntent.metadata.userId,
          type: 'payment_failed',
          title: 'Payment Failed',
          message: 'Your payment could not be processed. Please try again.',
          metadata: {
            paymentIntentId: paymentIntent.id,
            reason: paymentIntent.last_payment_error?.message || 'Unknown error',
          },
        })
    }

  } catch (error) {
    console.error('Error handling payment failure:', error)
  }
}

async function handlePaymentIntentCanceled(paymentIntent: Stripe.PaymentIntent, supabase: any) {
  console.log('Payment canceled:', paymentIntent.id)

  try {
    // Update transaction status
    await supabase
      .from('transactions')
      .update({
        status: 'failed',
        completed_at: new Date().toISOString(),
      })
      .eq('provider_transaction_id', paymentIntent.id)

  } catch (error) {
    console.error('Error handling payment cancellation:', error)
  }
}

async function handlePaymentMethodAttached(paymentMethod: Stripe.PaymentMethod, supabase: any) {
  console.log('Payment method attached:', paymentMethod.id)

  try {
    // If the payment method has a customer, save it to our database
    if (paymentMethod.customer && typeof paymentMethod.customer === 'string') {
      console.log('Payment method attached to customer:', paymentMethod.customer)
    }

  } catch (error) {
    console.error('Error handling payment method attachment:', error)
  }
}