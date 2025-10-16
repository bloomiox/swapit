// Test script to verify webhook endpoint with Supabase auth
const WEBHOOK_URL = 'https://ecoynjjagkobmngpaaqx.supabase.co/functions/v1/stripe-webhook';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVjb3luamphZ2tvYm1uZ3BhYXF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA0NjcwMDUsImV4cCI6MjA3NjA0MzAwNX0.nRJ0A5yM804bO925-OkJ9-zANng1UXkr_pUREvdR4jg';

async function testWebhookWithAuth() {
  console.log('Testing webhook endpoint with Supabase auth...');
  
  try {
    // Test with Supabase auth headers
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': ANON_KEY,
        'Authorization': `Bearer ${ANON_KEY}`,
      },
      body: JSON.stringify({ test: 'data' })
    });
    
    const result = await response.text();
    console.log('Response status:', response.status);
    console.log('Response body:', result);
    
    if (response.status === 400 && result.includes('No Stripe signature found')) {
      console.log('✅ Webhook endpoint is reachable and working correctly!');
      console.log('The 400 error is expected because we didn\'t include a Stripe signature.');
    } else if (response.status === 401) {
      console.log('❌ Still getting 401 - authentication issue persists');
    } else {
      console.log('❓ Different response - check the details above');
    }
    
  } catch (error) {
    console.error('❌ Error testing webhook:', error.message);
  }
}

testWebhookWithAuth();