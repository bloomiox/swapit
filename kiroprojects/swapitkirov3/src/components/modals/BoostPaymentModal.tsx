'use client';

import React, { useState } from 'react';
import { X, Loader2, CheckCircle, Star, Zap, TrendingUp, ArrowLeft, ArrowRight } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { usePayments } from '@/hooks/usePayments';
import { BoostType, Currency, getBoostPrice, formatCurrency } from '@/lib/stripe';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { getStripe } from '@/lib/stripe';

interface BoostPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
  itemTitle: string;
  onSuccess?: () => void;
}

// Boost type options
const BOOST_TYPE_OPTIONS = [
  {
    type: 'premium' as BoostType,
    name: 'Premium',
    description: 'Higher visibility in search results',
    icon: Star,
    color: 'blue',
    popular: false,
  },
  {
    type: 'featured' as BoostType,
    name: 'Featured',
    description: 'Appears at the top of listings',
    icon: TrendingUp,
    color: 'green',
    popular: true,
  },
  {
    type: 'urgent' as BoostType,
    name: 'Urgent',
    description: 'Maximum visibility and priority placement',
    icon: Zap,
    color: 'orange',
    popular: false,
  },
];

// Duration options matching Figma design
const DURATION_OPTIONS = [
  { days: 1, label: '1 Day', popular: false },
  { days: 3, label: '3 Days', popular: true },
  { days: 5, label: '5 Days', popular: false },
];

// Step 1: Boost Type Selection
const BoostTypeStep: React.FC<{
  selectedBoostType: BoostType;
  setSelectedBoostType: (type: BoostType) => void;
  onNext: () => void;
}> = ({ selectedBoostType, setSelectedBoostType, onNext }) => {
  const currency: Currency = 'CHF';

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-base font-semibold text-gray-900 mb-3">
          Select Boost Type
        </label>
        <div className="grid grid-cols-1 gap-3">
          {BOOST_TYPE_OPTIONS.map((option) => {
            const IconComponent = option.icon;
            const isSelected = selectedBoostType === option.type;

            return (
              <div
                key={option.type}
                className={`relative p-4 rounded-2xl border cursor-pointer transition-all ${isSelected
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                onClick={() => setSelectedBoostType(option.type)}
              >
                {option.popular && (
                  <div className="absolute -top-2 right-4 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Popular
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${option.color === 'blue' ? 'bg-blue-100' :
                    option.color === 'green' ? 'bg-green-100' :
                      'bg-orange-100'
                    }`}>
                    <IconComponent className={`w-6 h-6 ${option.color === 'blue' ? 'text-blue-600' :
                      option.color === 'green' ? 'text-green-600' :
                        'text-orange-600'
                      }`} />
                  </div>
                  <div className="flex-1">
                    <h3 className={`text-lg font-bold ${isSelected ? 'text-green-700' : 'text-gray-900'
                      }`}>
                      {option.name}
                    </h3>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                  <div className={`text-xl font-bold ${isSelected ? 'text-green-700' : 'text-gray-900'
                    }`}>
                    {formatCurrency(getBoostPrice(option.type, currency), currency)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Button onClick={onNext} className="w-full py-3 text-base font-semibold" size="lg">
        Next: Select Duration
        <ArrowRight className="w-5 h-5 ml-2" />
      </Button>
    </div>
  );
};

// Step 2: Duration and Payment
const PaymentStep: React.FC<{
  selectedDuration: number;
  setSelectedDuration: (duration: number) => void;
  selectedBoostType: BoostType;
  itemId: string;
  onSuccess: () => void;
  onBack: () => void;
}> = ({ selectedDuration, setSelectedDuration, selectedBoostType, itemId, onSuccess, onBack }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { createBoostPayment } = usePayments();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currency: Currency = 'CHF';
  const basePrice = getBoostPrice(selectedBoostType, currency);

  let totalPrice;
  if (selectedDuration === 1) {
    totalPrice = Math.round(basePrice * 0.4);
  } else if (selectedDuration === 3) {
    totalPrice = Math.round(basePrice * 0.6);
  } else if (selectedDuration === 5) {
    totalPrice = Math.round(basePrice * 1.0);
  } else {
    totalPrice = Math.round(basePrice * (selectedDuration / 7));
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError('Payment system not ready. Please try again.');
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      console.log('Creating boost payment:', { itemId, selectedBoostType, currency, selectedDuration });
      const paymentData = await createBoostPayment(itemId, selectedBoostType, currency, selectedDuration);
      console.log('Payment data received:', paymentData);
      console.log('Client secret:', paymentData.clientSecret);

      if (!paymentData.clientSecret) {
        throw new Error('Failed to create payment intent');
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      console.log('Confirming card payment with Stripe...');
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
        paymentData.clientSecret,
        {
          payment_method: {
            card: cardElement,
          },
        }
      );

      console.log('Stripe response:', { stripeError, paymentIntent });

      if (stripeError) {
        console.error('Stripe error:', stripeError);
        throw new Error(stripeError.message);
      }

      if (paymentIntent?.status === 'succeeded') {
        console.log('Payment intent succeeded, calling onSuccess');
        onSuccess();
      } else {
        console.log('Payment intent status:', paymentIntent?.status);
        console.log('Full payment intent:', paymentIntent);
      }

    } catch (err) {
      console.error('Payment error:', err);
      setError(err instanceof Error ? err.message : 'Payment failed');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Duration Selection */}
      <div>
        <label className="block text-base font-semibold text-gray-900 mb-2">
          Select Duration
        </label>
        <div className="grid grid-cols-3 gap-1">
          {DURATION_OPTIONS.map((option) => {
            let price;
            if (option.days === 1) {
              price = Math.round(basePrice * 0.4);
            } else if (option.days === 3) {
              price = Math.round(basePrice * 0.6);
            } else if (option.days === 5) {
              price = Math.round(basePrice * 1.0);
            } else {
              price = Math.round(basePrice * (option.days / 7));
            }

            return (
              <div
                key={option.days}
                className={`relative p-6 rounded-2xl border text-center cursor-pointer transition-all ${selectedDuration === option.days
                  ? 'border-green-600 bg-green-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                onClick={() => setSelectedDuration(option.days)}
              >
                {option.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                    Popular
                  </div>
                )}
                <div className="text-base font-medium text-gray-600 mb-2">
                  {option.label}
                </div>
                <div className={`text-2xl font-bold ${selectedDuration === option.days ? 'text-green-700' : 'text-gray-900'
                  }`}>
                  {formatCurrency(price, currency)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Card Details */}
      <div>
        <label className="block text-base font-semibold text-gray-900 mb-2">
          Card Details
        </label>
        <div className="border border-gray-200 rounded-2xl p-4 bg-white">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#6E6D7A',
                  fontFamily: 'DM Sans, sans-serif',
                  '::placeholder': {
                    color: '#6E6D7A',
                  },
                },
              },
              hidePostalCode: true,
            }}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          className="flex-1 py-3 text-base font-semibold"
          size="lg"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>
        <Button
          type="submit"
          disabled={!stripe || processing}
          className="flex-1 py-3 text-base font-semibold"
          size="lg"
        >
          {processing ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay ${formatCurrency(totalPrice, currency)}`
          )}
        </Button>
      </div>
    </form>
  );
};

// Success message component with boost badge
const SuccessMessage: React.FC<{
  itemTitle: string;
  selectedDuration: number;
  selectedBoostType: BoostType;
  onClose: () => void;
}> = ({ itemTitle, selectedDuration, selectedBoostType, onClose }) => {
  const boostTypeOption = BOOST_TYPE_OPTIONS.find(option => option.type === selectedBoostType);
  const IconComponent = boostTypeOption?.icon || TrendingUp;

  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <CheckCircle className="w-8 h-8 text-green-600" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Payment Successful!
      </h3>
      <p className="text-gray-600 mb-4">
        Your item "{itemTitle}" has been boosted for {selectedDuration} days.
      </p>

      {/* Show the boost badge */}
      <div className="flex justify-center mb-6">
        <div className={`px-4 py-2 rounded-full flex items-center gap-2 shadow-lg ${selectedBoostType === 'premium' ? 'bg-blue-500 text-white' :
          selectedBoostType === 'featured' ? 'bg-green-500 text-white' :
            'bg-orange-500 text-white'
          }`}>
          <IconComponent className="w-5 h-5" />
          <span className="text-sm font-bold">
            {boostTypeOption?.name.toUpperCase()}
          </span>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-6">
        Your item will now appear with this badge and have enhanced visibility on the platform.
      </p>

      <Button onClick={onClose} className="w-full">
        Done
      </Button>
    </div>
  );
};



export const BoostPaymentModal: React.FC<BoostPaymentModalProps> = ({
  isOpen,
  onClose,
  itemId,
  itemTitle,
  onSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [selectedDuration, setSelectedDuration] = useState<number>(3);
  const [selectedBoostType, setSelectedBoostType] = useState<BoostType>('featured');
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePaymentSuccess = () => {
    console.log('Payment successful, showing success message');
    setShowSuccess(true);
    // Don't call onSuccess immediately to prevent page reload
    // onSuccess?.();
  };

  const handleClose = () => {
    console.log('Closing modal, showSuccess:', showSuccess);
    const wasSuccessful = showSuccess;
    setShowSuccess(false);
    setCurrentStep(1);
    setSelectedDuration(3);
    setSelectedBoostType('featured');
    onClose();
    // Call onSuccess only when closing after successful payment
    if (wasSuccessful) {
      setTimeout(() => {
        onSuccess?.();
      }, 100); // Small delay to ensure modal is closed first
    }
  };

  const handleNextStep = () => {
    setCurrentStep(2);
  };

  const handleBackStep = () => {
    setCurrentStep(1);
  };

  // Reset state when modal closes
  React.useEffect(() => {
    if (!isOpen) {
      setShowSuccess(false);
      setCurrentStep(1);
      setSelectedDuration(3);
      setSelectedBoostType('featured');
    }
  }, [isOpen]);

  const stripePromise = getStripe();

  return (
    <Modal isOpen={isOpen} onClose={handleClose} className="max-w-[600px]">
      <ErrorBoundary>
        <div className="relative p-6">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-6 right-6 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {showSuccess ? (
            <SuccessMessage
              itemTitle={itemTitle}
              selectedDuration={selectedDuration}
              selectedBoostType={selectedBoostType}
              onClose={handleClose}
            />
          ) : (
            <>
              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= 1 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                    1
                  </div>
                  <div className={`flex-1 h-1 rounded ${currentStep >= 2 ? 'bg-green-600' : 'bg-gray-200'
                    }`} />
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep >= 2 ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                    2
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {currentStep === 1 ? 'Choose Boost Type' : 'Duration & Payment'}
                </h2>
                <p className="text-base text-gray-600">
                  {currentStep === 1
                    ? 'Select the type of boost for your item'
                    : 'Choose duration and complete payment'
                  }
                </p>
              </div>

              {/* Step Content */}
              {currentStep === 1 ? (
                <BoostTypeStep
                  selectedBoostType={selectedBoostType}
                  setSelectedBoostType={setSelectedBoostType}
                  onNext={handleNextStep}
                />
              ) : (
                <Elements stripe={stripePromise} key={`payment-step-${isOpen}`}>
                  <PaymentStep
                    selectedDuration={selectedDuration}
                    setSelectedDuration={setSelectedDuration}
                    selectedBoostType={selectedBoostType}
                    itemId={itemId}
                    onSuccess={handlePaymentSuccess}
                    onBack={handleBackStep}
                  />
                </Elements>
              )}
            </>
          )}
        </div>
      </ErrorBoundary>
    </Modal>
  );
};