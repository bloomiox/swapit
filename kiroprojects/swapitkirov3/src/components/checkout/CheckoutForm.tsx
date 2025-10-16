'use client';

import React, { useState } from 'react';
import {
  useStripe,
  useElements,
  PaymentElement,
  AddressElement,
} from '@stripe/react-stripe-js';
import { Button } from '@/components/ui/Button';
import { CreditCard, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { BoostType, Currency } from '@/lib/stripe';
import { useRouter } from 'next/navigation';

interface CheckoutFormProps {
  itemId: string;
  itemTitle: string;
  boostType: BoostType;
  currency: Currency;
}

export const CheckoutForm: React.FC<CheckoutFormProps> = ({
  itemId,
  itemTitle,
  boostType,
  currency,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        throw new Error(submitError.message);
      }

      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success?itemId=${itemId}&boostType=${boostType}`,
        },
        redirect: 'if_required',
      });

      if (confirmError) {
        throw new Error(confirmError.message);
      }

      // Payment succeeded
      setSuccess(true);
      
      // Redirect to success page after a short delay
      setTimeout(() => {
        router.push(`/payment/success?itemId=${itemId}&boostType=${boostType}`);
      }, 2000);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
          <p className="text-gray-600 mb-4">
            Your {boostType} boost for "{itemTitle}" is now active.
          </p>
          <p className="text-sm text-gray-500">
            Redirecting you to the success page...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-8">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Payment Details</h2>
        <p className="text-gray-600">
          Complete your purchase to boost your item's visibility.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Payment Element */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Payment Method
          </label>
          <div className="border border-gray-300 rounded-lg p-4">
            <PaymentElement
              options={{
                layout: 'tabs',
                paymentMethodOrder: ['card', 'apple_pay', 'google_pay'],
              }}
            />
          </div>
        </div>

        {/* Address Element */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Billing Address
          </label>
          <div className="border border-gray-300 rounded-lg p-4">
            <AddressElement
              options={{
                mode: 'billing',
                allowedCountries: ['US', 'CA', 'GB', 'DE', 'FR', 'CH', 'AT'],
              }}
            />
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-900">Payment Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <CreditCard className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-medium text-blue-900">Secure Payment</h3>
              <p className="text-sm text-blue-700 mt-1">
                Your payment information is encrypted and secure. We use Stripe for payment processing.
              </p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!stripe || processing}
          className="w-full py-3"
          size="lg"
        >
          {processing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing Payment...
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5 mr-2" />
              Complete Purchase
            </>
          )}
        </Button>

        {/* Terms */}
        <p className="text-xs text-gray-500 text-center">
          By completing this purchase, you agree to our{' '}
          <a href="/terms" className="text-blue-600 hover:text-blue-700">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-blue-600 hover:text-blue-700">
            Privacy Policy
          </a>
          .
        </p>
      </form>
    </div>
  );
};