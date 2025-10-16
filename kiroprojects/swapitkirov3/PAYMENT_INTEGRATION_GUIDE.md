# SwapIt Payment Integration Guide

## Overview

This document outlines the comprehensive payment integration for SwapIt, supporting both Stripe (global) and Payrexx (Swiss market) payment processors.

## 🏗️ Architecture

### Database Schema
- **payment_methods**: Store user payment methods
- **transactions**: Track all payment transactions
- **boosts**: Manage item boost purchases
- **subscriptions**: Handle premium subscriptions (future)
- **payment_webhooks**: Log webhook events for debugging

### Edge Functions
- **create-stripe-payment**: Initialize Stripe payment intents
- **stripe-webhook**: Handle Stripe webhook events
- **create-payrexx-payment**: Initialize Payrexx payments (future)
- **payrexx-webhook**: Handle Payrexx webhook events (future)

## 💳 Stripe Integration

### Features Implemented
✅ Payment intent creation for item boosts
✅ Webhook handling for payment status updates
✅ Secure payment processing with RLS policies
✅ Transaction logging and audit trail
✅ Boost activation on successful payment
✅ Payment method storage and management
✅ Multi-currency support (USD, EUR, CHF, GBP)

### Boost Pricing
- **Premium Boost**: $2.99 (7 days) - Highlight with premium badge
- **Featured Boost**: $4.99 (7 days) - Top of search results
- **Urgent Boost**: $7.99 (7 days) - Priority placement with urgent badge

### Test Cards
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **3D Secure**: 4000 0025 0000 3155

## 🔧 Setup Instructions

### 1. Environment Variables ✅ COMPLETED
```bash
# Stripe Configuration (CONFIGURED)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Supabase Configuration (CONFIGURED)
NEXT_PUBLIC_SUPABASE_URL=https://ecoynjjagkobmngpaaqx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### 2. Stripe Dashboard Setup
1. ✅ Stripe test account configured with provided keys
2. ⚠️ **NEXT STEP**: Set up webhooks in Stripe Dashboard:
   - Go to: https://dashboard.stripe.com/test/webhooks
   - Click "Add endpoint"
   - URL: `https://ecoynjjagkobmngpaaqx.supabase.co/functions/v1/stripe-webhook`
   - Events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `payment_intent.canceled`
   - Copy the webhook signing secret and update STRIPE_WEBHOOK_SECRET

### 3. Dependencies ✅ COMPLETED
```bash
npm install @stripe/stripe-js @stripe/react-stripe-js stripe
```

### 4. Database Migrations ✅ COMPLETED
```bash
npx supabase db push
```

### 5. Deploy Edge Functions ✅ COMPLETED
```bash
npx supabase functions deploy create-stripe-payment
npx supabase functions deploy stripe-webhook
npx supabase secrets set STRIPE_SECRET_KEY=sk_test_...
```

## 🧪 Testing

### Test Payment Flow
1. Navigate to `/test-payment`
2. Click "Test Boost Payment"
3. Select a boost type
4. Use test card numbers
5. Verify database records

### Webhook Testing
1. Use Stripe CLI for local testing:
```bash
stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook
```

## 📊 Admin Dashboard

### Payment Analytics
- Total revenue and transaction counts
- Success/failure rates
- Active boosts tracking
- Payment method usage statistics
- Revenue trends over time

### Transaction Management
- View all transactions with user details
- Filter by status, date range, payment provider
- Export transaction data
- Refund handling (future)

## 🔒 Security Features

### Row Level Security (RLS)
- Users can only access their own payment data
- Admins have full access to payment analytics
- Webhook events are admin-only accessible

### Payment Security
- All sensitive operations use Supabase Edge Functions
- Payment intents created server-side
- Webhook signature verification
- Secure token handling

## 🚀 Usage Examples

### 1. Quick Modal Payment (Simple)
```typescript
import { BoostPaymentModal } from '@/components/modals/BoostPaymentModal';

<BoostPaymentModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  itemId="item-uuid"
  itemTitle="My Item"
  onSuccess={() => console.log('Payment successful!')}
/>
```

### 2. Full Checkout Flow (Recommended)
```typescript
// Redirect to checkout page
const checkoutUrl = `/checkout?itemId=${itemId}&itemTitle=${itemTitle}&boostType=premium&currency=USD`;
window.location.href = checkoutUrl;
```

### 3. Direct Payment Hook Usage
```typescript
import { usePayments } from '@/hooks/usePayments';

const { createBoostPayment } = usePayments();

// Create payment intent
const paymentData = await createBoostPayment(
  itemId, 
  'premium', 
  'USD', 
  7
);
```

### 4. Test Payment Flow
- Visit: http://localhost:3003/test-payment
- Click "Test Checkout Page" 
- Use test card: 4242 4242 4242 4242

## 🇨🇭 Payrexx Integration (Future)

### Planned Features
- Swiss payment methods (PostFinance, TWINT)
- CHF currency support
- Region-based payment provider selection
- Swiss compliance features

### Implementation Plan
1. Set up Payrexx account and API credentials
2. Create Payrexx Edge Functions
3. Implement multi-provider payment routing
4. Add Swiss-specific payment methods
5. Test with Swiss payment scenarios

## 📈 Analytics & Reporting

### Available Metrics
- Revenue by time period (day/week/month)
- Transaction success rates
- Popular boost types
- User payment behavior
- Payment method preferences

### Database Functions
- `get_payment_stats(days)`: Overall payment statistics
- `get_revenue_by_period(period, days)`: Revenue trends
- `get_top_boosted_items(limit)`: Most boosted items
- `get_user_payment_stats(user_id)`: User-specific stats

## 🔄 Webhook Events

### Stripe Events Handled
- `payment_intent.succeeded`: Activate boost, update transaction
- `payment_intent.payment_failed`: Mark transaction as failed
- `payment_intent.canceled`: Mark transaction as canceled
- `payment_method.attached`: Save payment method (future)

### Event Processing
1. Verify webhook signature
2. Log event in payment_webhooks table
3. Process event based on type
4. Update relevant database records
5. Send notifications to users
6. Mark webhook as processed

## 🛠️ Troubleshooting

### Common Issues
1. **Payment fails**: Check Stripe test keys and webhook configuration
2. **Edge Function errors**: Verify environment variables in Supabase dashboard
3. **Database errors**: Ensure migrations are applied correctly
4. **Webhook not received**: Check Stripe webhook URL and events

### Debug Tools
- Browser console for client-side errors
- Supabase Edge Function logs
- Stripe dashboard event logs
- Database query logs

## 📋 Next Steps

### Immediate Tasks
1. Set up Stripe test account and configure keys
2. Test payment flow end-to-end
3. Verify webhook handling
4. Test admin dashboard analytics

### Future Enhancements
1. Payrexx integration for Swiss market
2. Subscription handling for premium features
3. Refund management system
4. Advanced fraud detection
5. Payment method management UI
6. Automated boost expiration handling

## 🔗 Resources

- [Stripe Documentation](https://stripe.com/docs)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Payrexx API Documentation](https://developers.payrexx.com/)
- [SwapIt Payment Test Page](/test-payment)

## 🎯 Current Implementation Status

### ✅ Completed Features
- [x] Stripe client-side integration with React Elements
- [x] Payment intent creation Edge Function
- [x] Webhook handling Edge Function  
- [x] Database schema for payments, transactions, boosts
- [x] Comprehensive checkout flow with OrderSummary
- [x] Payment success page with animations
- [x] Test payment page for development
- [x] Environment variables configured
- [x] Dependencies installed
- [x] Edge Functions deployed

### 🔄 Next Steps Required
1. **Set up Stripe webhook endpoint** (5 minutes):
   - Go to Stripe Dashboard → Webhooks
   - Add endpoint: `https://ecoynjjagkobmngpaaqx.supabase.co/functions/v1/stripe-webhook`
   - Copy webhook secret to environment variables

2. **Test the payment flow**:
   - Visit: http://localhost:3003/test-payment
   - Click "Test Checkout Page"
   - Use test card: 4242 4242 4242 4242

### 🎉 Ready to Use
The payment system is fully implemented and ready for testing! The checkout flow includes:
- Professional checkout page with order summary
- Secure Stripe Elements integration
- Real-time payment processing
- Success page with boost activation confirmation
- Comprehensive error handling

---

**Status**: ✅ **PAYMENT SYSTEM READY FOR TESTING**
**Test URL**: http://localhost:3003/test-payment
**Next**: Set up Stripe webhook and test end-to-end flow