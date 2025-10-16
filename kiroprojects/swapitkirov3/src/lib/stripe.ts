import { loadStripe, Stripe } from '@stripe/stripe-js';

// Stripe configuration
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  throw new Error('Missing NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY environment variable');
}

// Singleton pattern for Stripe instance
let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(stripePublishableKey);
  }
  return stripePromise;
};

// Stripe server-side configuration (for Edge Functions)
export const stripeConfig = {
  secretKey: process.env.STRIPE_SECRET_KEY,
  webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
  publishableKey: stripePublishableKey,
};

// Payment amount configurations (in cents)
export const BOOST_PRICES = {
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
} as const;

export type BoostType = keyof typeof BOOST_PRICES;
export type Currency = keyof typeof BOOST_PRICES.premium;

// Helper function to get boost price
export const getBoostPrice = (boostType: BoostType, currency: Currency = 'USD'): number => {
  return BOOST_PRICES[boostType][currency];
};

// Helper function to format currency
export const formatCurrency = (amount: number, currency: Currency): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  });
  
  return formatter.format(amount / 100); // Convert from cents
};

// Stripe payment method types
export const SUPPORTED_PAYMENT_METHODS = [
  'card',
  'sepa_debit',
  'ideal',
  'bancontact',
  'giropay',
  'sofort',
] as const;

export type PaymentMethodType = typeof SUPPORTED_PAYMENT_METHODS[number];

// Error handling
export class StripeError extends Error {
  constructor(
    message: string,
    public code?: string,
    public type?: string
  ) {
    super(message);
    this.name = 'StripeError';
  }
}

// Payment intent metadata interface
export interface PaymentMetadata {
  userId: string;
  itemId?: string;
  boostType?: BoostType;
  duration?: number;
  source: 'web' | 'mobile';
}

// Subscription plan configurations
export const SUBSCRIPTION_PLANS = {
  premium_monthly: {
    name: 'Premium Monthly',
    prices: {
      USD: 999, // $9.99/month
      EUR: 999, // €9.99/month
      CHF: 1099, // CHF 10.99/month
      GBP: 799, // £7.99/month
    },
    features: [
      'Unlimited item listings',
      'Priority customer support',
      'Advanced analytics',
      'Featured profile badge',
      'Early access to new features',
    ],
  },
  premium_yearly: {
    name: 'Premium Yearly',
    prices: {
      USD: 9999, // $99.99/year (2 months free)
      EUR: 9999, // €99.99/year
      CHF: 10999, // CHF 109.99/year
      GBP: 7999, // £79.99/year
    },
    features: [
      'All Premium Monthly features',
      '2 months free',
      'Priority listing placement',
      'Custom profile themes',
      'Bulk item management tools',
    ],
  },
} as const;

export type SubscriptionPlan = keyof typeof SUBSCRIPTION_PLANS;