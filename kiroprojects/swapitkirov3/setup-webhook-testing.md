# Quick Webhook Testing Setup

## Step 1: Start Your Development Server
```bash
npm run dev
```

## Step 2: Set Up Stripe Webhook (Choose One Option)

### Option A: Use Stripe CLI (Recommended for Testing)
1. Install Stripe CLI if you haven't:
   ```bash
   # Windows (using Chocolatey)
   choco install stripe-cli
   
   # Or download from: https://github.com/stripe/stripe-cli/releases
   ```

2. Login to Stripe:
   ```bash
   stripe login
   ```

3. Forward webhooks to your deployed Supabase function:
   ```bash
   stripe listen --forward-to https://ecoynjjagkobmngpaaqx.supabase.co/functions/v1/stripe-webhook --headers="apikey=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjb3luamphZ2tvYm1uZ3BhYXF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NjcwMDUsImV4cCI6MjA3NjA0MzAwNX0.nRJ0A5yM804bO925-OkJ9-zANng1UXkr_pUREvdR4jg,Authorization=Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjb3luamphZ2tvYm1uZ3BhYXF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NjcwMDUsImV4cCI6MjA3NjA0MzAwNX0.nRJ0A5yM804bO925-OkJ9-zANng1UXkr_pUREvdR4jg"
   ```

4. Copy the webhook signing secret (starts with `whsec_`) and update your `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_your_new_secret_here
   ```

### Option B: Configure Stripe Dashboard Webhook
1. Go to [Stripe Dashboard → Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Click "Add endpoint"
3. URL: `https://ecoynjjagkobmngpaaqx.supabase.co/functions/v1/stripe-webhook`
4. Add these headers:
   - `apikey`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjb3luamphZ2tvYm1uZ3BhYXF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NjcwMDUsImV4cCI6MjA3NjA0MzAwNX0.nRJ0A5yM804bO925-OkJ9-zANng1UXkr_pUREvdR4jg`
   - `Authorization`: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjb3luamphZ2tvYm1uZ3BhYXF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NjcwMDUsImV4cCI6MjA3NjA0MzAwNX0.nRJ0A5yM804bO925-OkJ9-zANng1UXkr_pUREvdR4jg`
5. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`, `payment_intent.canceled`

## Step 3: Test the Payment Flow
1. Go to: http://localhost:3000/test-payment
2. Sign in as test user (button provided)
3. Click "Test Modal Payment"
4. Select boost type and duration
5. Use test card: `4242 4242 4242 4242`
6. Complete payment

## Step 4: Monitor Results
- Check browser console for logs
- Check Stripe CLI output for webhook events
- Check Supabase logs: https://supabase.com/dashboard/project/ecoynjjagkobmngpaaqx/functions
- Check database tables: `transactions`, `boosts`, `payment_webhooks`

## Test Cards
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **3D Secure**: 4000 0025 0000 3155

Use any future expiry, any 3-digit CVC, any postal code.