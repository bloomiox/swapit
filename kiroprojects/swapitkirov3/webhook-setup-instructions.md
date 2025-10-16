# Stripe Webhook Setup for Local Development

## Problem
Your Stripe webhook is failing with a 401 "Missing authorization header" error because Stripe can't reach your local Supabase Edge Function.

## Solution 1: Use Stripe CLI (Recommended for Development)

### 1. Install Stripe CLI
```bash
# Windows (using Chocolatey)
choco install stripe-cli

# Or download from: https://github.com/stripe/stripe-cli/releases
```

### 2. Login to Stripe
```bash
stripe login
```

### 3. Forward webhooks to your local Supabase function
```bash
stripe listen --forward-to http://127.0.0.1:54321/functions/v1/stripe-webhook
```

This will:
- Create a temporary webhook endpoint in Stripe
- Forward all webhook events to your local Supabase function
- Give you a webhook signing secret (starts with `whsec_`)

### 4. Update your .env.local with the new webhook secret
Replace your current `STRIPE_WEBHOOK_SECRET` with the one provided by the CLI.

## Solution 2: Use ngrok for Public URL

### 1. Install ngrok
```bash
# Download from: https://ngrok.com/download
```

### 2. Expose your local Supabase
```bash
ngrok http 54321
```

### 3. Update Stripe webhook URL
Use the ngrok URL: `https://your-ngrok-url.ngrok.io/functions/v1/stripe-webhook`

## Current Webhook URL Should Be
For production: `https://ecoynjjagkobmngpaaqx.supabase.co/functions/v1/stripe-webhook`
For local with Stripe CLI: `http://127.0.0.1:54321/functions/v1/stripe-webhook`