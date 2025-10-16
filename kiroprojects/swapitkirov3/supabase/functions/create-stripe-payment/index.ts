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
    // Initialize Stripe
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    if (!stripeSecretKey) {
      console.error('STRIPE_SECRET_KEY environment variable not set')
      throw new Error('Stripe configuration error')
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2023-10-16',
    })

    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Verify the JWT token using the regular supabase client
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    
    if (authError || !user) {
      throw new Error('Invalid authentication')
    }

    // Parse request body
    const body: CreatePaymentRequest = await req.json()
    const { type, itemId, boostType, currency = 'USD', duration = 7, subscriptionPlan, metadata = {} } = body

    let amount: number
    let description: string
    let paymentMetadata: Record<string, string> = {
      userId: user.id,
      type,
      ...metadata,
    }

    if (type === 'boost') {
      if (!itemId || !boostType) {
        throw new Error('itemId and boostType are required for boost payments')
      }

      // Verify the item exists and belongs to the user
      const { data: item, error: itemError } = await supabase
        .from('items')
        .select('id, user_id, title')
        .eq('id', itemId)
        .eq('user_id', user.id)
        .single()

      if (itemError || !item) {
        throw new Error('Item not found or access denied')
      }

      // Calculate price based on duration
      const basePrice = BOOST_PRICES[boostType][currency]
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
      
      description = `${boostType.charAt(0).toUpperCase() + boostType.slice(1)} boost for "${item.title}" (${duration} days)`
      
      paymentMetadata = {
        ...paymentMetadata,
        itemId,
        boostType,
        duration: duration.toString(),
        itemTitle: item.title,
      }
    } else if (type === 'subscription') {
      // Handle subscription payments (future implementation)
      throw new Error('Subscription payments not yet implemented')
    } else {
      throw new Error('Invalid payment type')
    }

    // Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: currency.toLowerCase(),
      description,
      metadata: paymentMetadata,
      automatic_payment_methods: {
        enabled: true,
      },
    })

    // Create transaction record in database
    console.log('Creating transaction record for user:', user.id, 'item:', itemId)
    const { data: transaction, error: transactionError } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        item_id: itemId,
        payment_provider: 'stripe', // Fixed: use payment_provider instead of provider
        provider_transaction_id: paymentIntent.id,
        amount,
        currency,
        status: 'pending', // Fixed: use pending instead of succeeded
        description,
        metadata: paymentMetadata,
      })
      .select()
      .single()

    if (transactionError) {
      console.error('Failed to create transaction record:', transactionError)
      // Don't throw here, as the PaymentIntent was already created
    } else {
      console.log('Transaction record created successfully:', transaction?.id)
    }

    // If this is a boost payment, create the boost record
    if (type === 'boost' && transaction) {
      console.log('Creating boost record for transaction:', transaction.id)
      const { error: boostError } = await supabase
        .from('boosts')
        .insert({
          item_id: itemId,
          user_id: user.id,
          transaction_id: transaction.id,
          boost_type: boostType,
          duration_days: duration,
          amount_paid: amount,
          currency,
          is_active: false, // Will be activated when payment succeeds
        })

      if (boostError) {
        console.error('Failed to create boost record:', boostError)
      } else {
        console.log('Boost record created successfully')
      }
    } else if (type === 'boost' && !transaction) {
      console.error('Cannot create boost record: transaction creation failed')
    }

    return new Response(
      JSON.stringify({
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
        transactionId: transaction?.id,
        amount,
        currency,
        description,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error creating payment:', error)
    
    return new Response(
      JSON.stringify({
        error: error.message || 'An error occurred while creating the payment',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})