'use client';

import React, { useState } from 'react';
import { BoostPaymentModal } from '@/components/modals/BoostPaymentModal';
import { Button } from '@/components/ui/Button';
import { CreditCard, TestTube, User, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function TestPaymentPage() {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { user, signIn, signOut, loading } = useAuth();

  // Mock item data for testing
  const mockItem = {
    id: '123e4567-e89b-12d3-a456-426614174000',
    title: 'Test Item for Payment',
  };

  const handlePaymentSuccess = () => {
    console.log('Payment successful callback triggered!');
    // Don't show alert immediately to avoid interfering with success message
    setTimeout(() => {
      alert('Payment successful! This is just a test.');
    }, 500);
  };

  const handleTestSignIn = async () => {
    try {
      await signIn('test@example.com', 'testpassword123');
    } catch (error) {
      console.error('Sign in error:', error);
      alert('Failed to sign in. Please check console for details.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <TestTube className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Payment Integration Test
            </h1>
            <p className="text-gray-600">
              Test the Stripe payment integration for item boosts
            </p>
          </div>

          {/* Authentication Status */}
          <div className={`border rounded-lg p-4 mb-8 ${user ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <div className="flex items-start space-x-3">
              <User className={`w-5 h-5 mt-0.5 ${user ? 'text-green-600' : 'text-red-600'}`} />
              <div className="flex-1">
                <h3 className={`font-medium ${user ? 'text-green-900' : 'text-red-900'}`}>
                  Authentication Status
                </h3>
                {user ? (
                  <div>
                    <p className="text-sm text-green-700 mt-1">
                      ✅ Signed in as: {user.email}
                    </p>
                    <p className="text-sm text-green-700">
                      User ID: {user.id}
                    </p>
                    <Button
                      onClick={signOut}
                      variant="outline"
                      size="sm"
                      className="mt-2"
                    >
                      Sign Out
                    </Button>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-red-700 mt-1">
                      ❌ Not signed in. Payment testing requires authentication.
                    </p>
                    <Button
                      onClick={handleTestSignIn}
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      disabled={loading}
                    >
                      <LogIn className="w-4 h-4 mr-2" />
                      Sign In as Test User
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <div className="flex items-start space-x-3">
              <TestTube className="w-5 h-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-900">Test Environment</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  This page is for testing payment integration. Use Stripe test card numbers:
                </p>
                <ul className="text-sm text-yellow-700 mt-2 space-y-1">
                  <li>• <strong>Success:</strong> 4242 4242 4242 4242</li>
                  <li>• <strong>Decline:</strong> 4000 0000 0000 0002</li>
                  <li>• <strong>3D Secure:</strong> 4000 0025 0000 3155</li>
                </ul>
                <p className="text-sm text-yellow-700 mt-2">
                  Use any future expiry date, any 3-digit CVC, and any postal code.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Test Item Card */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Test Item</h2>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-600">Item ID:</span>
                  <p className="text-sm text-gray-900 font-mono">{mockItem.id}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Title:</span>
                  <p className="text-sm text-gray-900">{mockItem.title}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Status:</span>
                  <p className="text-sm text-green-600">Active</p>
                </div>
              </div>
            </div>

            {/* Payment Test Controls */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Test</h2>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Click the button below to test the boost payment flow with Stripe integration.
                </p>
                
                <div className="space-y-3">
                  <Button
                    onClick={() => setShowPaymentModal(true)}
                    className="w-full"
                    disabled={!user}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Test Modal Payment
                  </Button>
                  
                  <Button
                    onClick={() => {
                      const checkoutUrl = `/checkout?itemId=${encodeURIComponent(mockItem.id)}&itemTitle=${encodeURIComponent(mockItem.title)}&boostType=premium&currency=USD`;
                      window.location.href = checkoutUrl;
                    }}
                    variant="outline"
                    className="w-full"
                    disabled={!user}
                  >
                    <CreditCard className="w-4 h-4 mr-2" />
                    Test Checkout Page
                  </Button>
                </div>

                <div className="text-xs text-gray-500 space-y-1">
                  <p>• {user ? 'This will open the payment modal with boost type selection' : 'Sign in first to enable payment testing'}</p>
                  <p>• Select boost type: Premium (CHF 4), Featured (CHF 7), or Urgent (CHF 11)</p>
                  <p>• Choose duration: 1, 3, or 5 days with different pricing</p>
                  <p>• Use test card numbers for payment</p>
                  <p>• Check browser console for debug info</p>
                </div>
              </div>
            </div>
          </div>

          {/* Environment Info */}
          <div className="mt-8 bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Environment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Stripe Publishable Key:</span>
                <p className="text-gray-900 font-mono text-xs break-all">
                  {process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? 
                    `${process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.substring(0, 20)}...` : 
                    'Not configured'
                  }
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Supabase URL:</span>
                <p className="text-gray-900 font-mono text-xs break-all">
                  {process.env.NEXT_PUBLIC_SUPABASE_URL ? 
                    `${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 30)}...` : 
                    'Not configured'
                  }
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Environment:</span>
                <p className="text-gray-900">{process.env.NODE_ENV || 'development'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">App URL:</span>
                <p className="text-gray-900 font-mono text-xs break-all">
                  {process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}
                </p>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-medium text-blue-900 mb-4">Testing Instructions</h3>
            <ol className="text-sm text-blue-800 space-y-2">
              <li>1. Make sure you have configured your Stripe test keys in the environment variables</li>
              <li>2. Ensure Supabase Edge Functions are deployed and accessible</li>
              <li>3. Click "Test Boost Payment" to open the payment modal</li>
              <li>4. Select a boost type and proceed to payment</li>
              <li>5. Use Stripe test card numbers to simulate different scenarios</li>
              <li>6. Check the browser console and network tab for debugging information</li>
              <li>7. Verify database records are created in the transactions and boosts tables</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <BoostPaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        itemId={mockItem.id}
        itemTitle={mockItem.title}
        onSuccess={handlePaymentSuccess}
      />
    </div>
  );
}