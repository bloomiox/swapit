'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Elements } from '@stripe/react-stripe-js';
import { getStripe } from '@/lib/stripe';
import { CheckoutForm } from '@/components/checkout/CheckoutForm';
import { OrderSummary } from '@/components/checkout/OrderSummary';
import { useAuth } from '@/contexts/AuthContext';
import { usePayments } from '@/hooks/usePayments';
import { BoostType, Currency } from '@/lib/stripe';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { createBoostPayment } = usePayments();
  
  const [clientSecret, setClientSecret] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get parameters from URL
  const itemId = searchParams.get('itemId');
  const itemTitle = searchParams.get('itemTitle') || 'Unknown Item';
  const boostType = searchParams.get('boostType') as BoostType;
  const currency = (searchParams.get('currency') as Currency) || 'USD';

  useEffect(() => {
    if (!user || !itemId || !boostType) {
      setLoading(false);
      return;
    }

    const initializePayment = async () => {
      try {
        setLoading(true);
        const paymentData = await createBoostPayment(itemId, boostType, currency);
        
        if (paymentData.clientSecret) {
          setClientSecret(paymentData.clientSecret);
        } else {
          throw new Error('Failed to initialize payment');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to initialize payment');
      } finally {
        setLoading(false);
      }
    };

    initializePayment();
  }, [user, itemId, boostType, currency, createBoostPayment]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h1>
          <p className="text-gray-600 mb-6">Please sign in to continue with your purchase.</p>
          <Link href="/auth/signin" className="text-blue-600 hover:text-blue-700">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (!itemId || !boostType) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Invalid Checkout</h1>
          <p className="text-gray-600 mb-6">Missing required parameters for checkout.</p>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Initializing payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Payment Error</h1>
          <p className="text-red-600 mb-6">{error}</p>
          <Link href="/" className="text-blue-600 hover:text-blue-700">
            Return Home
          </Link>
        </div>
      </div>
    );
  }

  const stripePromise = getStripe();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to SwapIt
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Complete your boost purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="order-2 lg:order-1">
            <OrderSummary
              itemTitle={itemTitle}
              boostType={boostType}
              currency={currency}
            />
          </div>

          {/* Payment Form */}
          <div className="order-1 lg:order-2">
            {clientSecret && (
              <Elements 
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: '#2563eb',
                      colorBackground: '#ffffff',
                      colorText: '#1f2937',
                      colorDanger: '#dc2626',
                      fontFamily: 'system-ui, sans-serif',
                      spacingUnit: '4px',
                      borderRadius: '8px',
                    },
                  },
                }}
              >
                <CheckoutForm
                  itemId={itemId}
                  itemTitle={itemTitle}
                  boostType={boostType}
                  currency={currency}
                />
              </Elements>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}