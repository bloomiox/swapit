import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@14.21.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Boost pricing configuration
const BOOST_PRICES = {
  premium: {
    USD: 299, // $2.99
    EUR: 299, // €2.99
    CHF: 400, // CHF 4.00
    GBP: 249, // £2.49
  },
  featured: {
    USD: 499, // $4.99
    EUR: 499, // €4.99
    CHF: 700, // CHF 7.00
    GBP: 399, // £3.99
  },
  urgent: {
    USD: 799, // $7.99
    EUR: 799, // €7.99
    CHF: 1100, // CHF 11.00
    GBP: 649, // £6.49
  },
}

interface CreatePaymentRequest {
  type: 'boost' | 'subscription'
  itemId?: string
  boostType?: 'premium' | 'featured' | 'urgent'
  currency?: 'USD' | 'EUR' | 'CHF' | 'GBP'
  duration?: number
  subscriptionPlan?: string
  metadata?: Record<string, any>
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('=== Payment Function Started (Stripe Only) ===')
    
    // Initialize Stripe
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY environment variable not set')
      throw new Error('Stripe configuration error')
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    })
    console.log('✅ Stripe initialized')

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      console.error('No authorization header provided')
      throw new Error('No authorization header')
    }

    // Verify the JWT token using the regular supabase client
    const token = authHeader.replace('Bearer ', '')
    console.log('🔐 Attempting to verify user token...')
    
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError) {
      console.error('Auth error:', authError)
      throw new Error(`Authentication failed: ${authError.message}`)
    }
    
    if (!user) {
      console.error('No user found from token')
      throw new Error('Invalid authentication - no user found')
    }

    console.log('✅ User authenticated successfully:', user.id, user.email)

    // Parse request body
    const body: CreatePaymentRequest = await req.json()
    console.log('📝 Request body:', JSON.stringify(body, null, 2))
    
    const { type, itemId, boostType, currency = 'USD', duration = 7, metadata = {} } = body

    if (type !== 'boost') {
      throw new Error('Only boost payments are currently supported')
    }

    if (!itemId || !boostType) {
      throw new Error('itemId and boostType are required for boost payments')
    }

    // Calculate price based on duration
    const basePrice = BOOST_PRICES[boostType][currency]
    let amount: number
    
    if (duration === 1) {
      amount = Math.round(basePrice * 0.4) // 40% of base price for 1 day
    } else if (duration === 3) {
      amount = Math.round(basePrice * 0.6) // 60% of base price for 3 days
    } else if (duration === 5) {
      amount = basePrice // Base price for 5 days
    } else if (duration === 7) {
      amount = Math.round(basePrice * 1.4) // 140% for 7 days
    } else if (duration === 14) {
      amount = Math.round(basePrice * 2.5) // 250% for 14 days
    } else {
      amount = Math.round(basePrice * (duration / 5)) // Scale based on 5-day base
    }
    
    const description = `${boostType.charAt(0).toUpperCase() + boostType.slice(1)} boost for item ${itemId} (${duration} days)`
    
    const paymentMetadata: Record<string, string> = {
      userId: user.id,
      type,
      itemId,
      boostType,
      duration: duration.toString(),
      source: 'web',
      ...metadata,
    }

    console.log('💰 Payment details:', { amount, currency, description })

    // Create Stripe PaymentIntent
    console.log('🔄 Creating Stripe PaymentIntent...')
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: currency.toLowerCase(),
      description,
      metadata: paymentMetadata,
      automatic_payment_methods: {
        enabled: true,
      },
    })
    console.log('✅ PaymentIntent created:', paymentIntent.id)

    // Create transaction record in database
    console.log('🗄️ Creating transaction record...')
    let transactionId = null
    
    try {
      const { data: transaction, error: transactionError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          item_id: itemId,
          payment_provider: 'stripe',
          provider_transaction_id: paymentIntent.id,
          amount,
          currency,
          status: 'pending',
          description,
          metadata: paymentMetadata,
        })
        .select()
        .single()

      if (transactionError) {
        console.error('❌ Failed to create transaction record:', transactionError)
        console.error('Transaction error details:', JSON.stringify(transactionError, null, 2))
      } else {
        console.log('✅ Transaction record created:', transaction?.id)
        transactionId = transaction?.id
        
        // Create boost record
        console.log('🚀 Creating boost record...')
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + duration)
        
        const { data: boost, error: boostError } = await supabase
          .from('boosts')
          .insert({
            item_id: itemId,
            user_id: user.id,
            transaction_id: transaction.id,
            boost_type: boostType,
            duration_days: duration,
            amount_paid: amount,
            currency,
            starts_at: new Date().toISOString(),
            expires_at: expiresAt.toISOString(),
            is_active: true, // Activate immediately for testing (normally done by webhook)
          })
          .select()
          .single()

        if (boostError) {
          console.error('❌ Failed to create boost record:', boostError)
        } else {
          console.log('✅ Boost record created and activated:', boost?.id)
          
          // Also update the item directly to ensure boost badge shows
          console.log('🏷️ Updating item boost status...')
          const { error: itemUpdateError } = await supabase
            .from('items')
            .update({
              is_boosted: true,
              boost_type: boostType,
              boost_expires_at: expiresAt.toISOString(),
            })
            .eq('id', itemId)

          if (itemUpdateError) {
            console.error('❌ Failed to update item boost status:', itemUpdateError)
          } else {
            console.log('✅ Item boost status updated successfully')
          }
        }
      }
    } catch (dbError) {
      console.error('❌ Database error:', dbError)
    }

    // Return success response
    const response = {
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      transactionId,
      amount,
      currency,
      description,
      success: true,
    }

    console.log('✅ Returning success response:', JSON.stringify(response, null, 2))

    return new Response(
      JSON.stringify(response),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('❌ Error creating payment:', error)
    const errorMessage = error instanceof Error ? error.message : 'An error occurred while creating the payment'
    console.error('Full error details:', error)
    
    const errorResponse = {
      error: errorMessage,
      details: error instanceof Error ? error.stack : 'Unknown error type',
      success: false,
    }

    console.log('❌ Returning error response:', JSON.stringify(errorResponse, null, 2))
    
    return new Response(
      JSON.stringify(errorResponse),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})