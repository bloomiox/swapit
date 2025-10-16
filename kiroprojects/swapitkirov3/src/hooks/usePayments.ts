import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { getStripe, BoostType, Currency, PaymentMetadata } from '@/lib/stripe';

// Types
export interface PaymentMethod {
  id: string;
  user_id: string;
  provider: 'stripe' | 'payrexx';
  provider_payment_method_id: string;
  type: string;
  last_four?: string;
  brand?: string;
  exp_month?: number;
  exp_year?: number;
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  item_id?: string;
  provider: 'stripe' | 'payrexx';
  provider_transaction_id: string;
  amount: number;
  currency: Currency;
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'canceled' | 'refunded';
  description?: string;
  metadata: Record<string, any>;
  payment_method_id?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
}

export interface Boost {
  id: string;
  item_id: string;
  user_id: string;
  transaction_id?: string;
  boost_type: BoostType;
  duration_days: number;
  amount_paid: number;
  currency: Currency;
  starts_at: string;
  expires_at: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export const usePayments = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Create payment intent for boost
  const createBoostPayment = async (
    itemId: string,
    boostType: BoostType,
    currency: Currency = 'USD',
    duration: number = 7
  ) => {
    if (!user) throw new Error('User not authenticated');

    setLoading(true);
    setError(null);

    try {
      console.log('Invoking create-stripe-payment Edge Function...');
      
      // Get the current session to ensure we have the latest token
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        throw new Error('No valid session found. Please sign in again.');
      }

      console.log('Session found, invoking function with auth...');
      
      const { data, error } = await supabase.functions.invoke('create-stripe-payment', {
        body: {
          type: 'boost',
          itemId,
          boostType,
          currency,
          duration,
          metadata: {
            userId: user.id,
            itemId,
            boostType,
            duration,
            source: 'web',
          } as PaymentMetadata,
        },
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      console.log('Edge Function response:', { data, error });
      console.log('Edge Function data details:', data);
      console.log('Edge Function error details:', error);

      if (error) {
        console.error('Edge Function error:', error);
        console.error('Error message:', error.message);
        console.error('Error details:', error.details);
        console.error('Full error object:', JSON.stringify(error, null, 2));
        throw new Error(error.message || error.details || 'Edge Function failed');
      }

      if (!data) {
        console.error('No data returned from Edge Function');
        throw new Error('No data returned from Edge Function');
      }

      console.log('Returning payment data:', data);
      return data;
    } catch (err) {
      console.error('createBoostPayment error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create payment';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Process payment with Stripe
  const processStripePayment = async (
    clientSecret: string,
    paymentMethodId?: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const stripe = await getStripe();
      if (!stripe) throw new Error('Stripe not loaded');

      const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
        clientSecret,
        confirmParams: {
          payment_method: paymentMethodId,
          return_url: `${window.location.origin}/payment/success`,
        },
        redirect: 'if_required',
      });

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      return paymentIntent;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Payment failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get user's payment methods
  const getPaymentMethods = async (): Promise<PaymentMethod[]> => {
    if (!user) return [];

    const { data, error } = await supabase
      .from('payment_methods')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  };

  // Get user's transactions
  const getTransactions = async (): Promise<Transaction[]> => {
    if (!user) return [];

    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  };

  // Get user's boosts
  const getBoosts = async (): Promise<Boost[]> => {
    if (!user) return [];

    const { data, error } = await supabase
      .from('boosts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  };

  // Get active boosts for an item
  const getItemBoosts = async (itemId: string): Promise<Boost[]> => {
    const { data, error } = await supabase
      .from('boosts')
      .select('*')
      .eq('item_id', itemId)
      .eq('is_active', true)
      .gt('expires_at', new Date().toISOString());

    if (error) throw error;
    return data || [];
  };

  // Save payment method
  const savePaymentMethod = async (
    provider: 'stripe' | 'payrexx',
    providerPaymentMethodId: string,
    details: Partial<PaymentMethod>
  ) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('payment_methods')
      .insert({
        user_id: user.id,
        provider,
        provider_payment_method_id: providerPaymentMethodId,
        ...details,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  // Delete payment method
  const deletePaymentMethod = async (paymentMethodId: string) => {
    const { error } = await supabase
      .from('payment_methods')
      .delete()
      .eq('id', paymentMethodId)
      .eq('user_id', user?.id);

    if (error) throw error;
  };

  // Set default payment method
  const setDefaultPaymentMethod = async (paymentMethodId: string) => {
    if (!user) throw new Error('User not authenticated');

    // First, unset all other default payment methods
    await supabase
      .from('payment_methods')
      .update({ is_default: false })
      .eq('user_id', user.id);

    // Then set the new default
    const { error } = await supabase
      .from('payment_methods')
      .update({ is_default: true })
      .eq('id', paymentMethodId)
      .eq('user_id', user.id);

    if (error) throw error;
  };

  return {
    loading,
    error,
    createBoostPayment,
    processStripePayment,
    getPaymentMethods,
    getTransactions,
    getBoosts,
    getItemBoosts,
    savePaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod,
  };
};

// Hook for managing payment methods
export const usePaymentMethods = () => {
  const { user } = useAuth();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPaymentMethods = async () => {
    if (!user) {
      setPaymentMethods([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPaymentMethods(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch payment methods');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentMethods();
  }, [user]);

  return {
    paymentMethods,
    loading,
    error,
    refetch: fetchPaymentMethods,
  };
};

// Hook for managing transactions
export const useTransactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = async () => {
    if (!user) {
      setTransactions([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTransactions(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [user]);

  return {
    transactions,
    loading,
    error,
    refetch: fetchTransactions,
  };
};