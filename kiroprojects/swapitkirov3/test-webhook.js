// Test script to verify webhook endpoint
const WEBHOOK_URL = 'https://ecoynjjagkobmngpaaqx.supabase.co/functions/v1/stripe-webhook';

async function testWebhook() {
  console.log('Testing webhook endpoint...');
  
  try {
    // Test with a simple POST request (this will fail signature verification, but should show the endpoint is reachable)
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ test: 'data' })
    });
    
    const result = await response.text();
    console.log('Response status:', response.status);
    console.log('Response body:', result);
    
    if (response.status === 400 && result.includes('No Stripe signature found')) {
      console.log('✅ Webhook endpoint is reachable and working correctly!');
      console.log('The 400 error is expected because we didn\'t include a Stripe signature.');
    } else {
      console.log('❌ Unexpected response from webhook endpoint');
    }
    
  } catch (error) {
    console.error('❌ Error testing webhook:', error.message);
  }
}

testWebhook();