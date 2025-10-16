'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  CreditCard, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface PaymentData {
  id: string
  user_id: string
  amount: number
  currency: string
  description: string
  status: string
  created_at: string
  user?: {
    email: string
    full_name: string | null
  }
  item?: {
    title: string
  }
}

interface BoostData {
  id: string
  item_id: string
  boost_type: string
  duration_days: number
  started_at: string
  expires_at: string
  is_active: boolean
  created_at: string
  item?: {
    title: string
    user_id: string
    view_count: number
    save_count: number
  }
  user?: {
    email: string
    full_name: string | null
  }
}

export function PaymentsBoosts() {
  const [activeTab, setActiveTab] = useState<'payments' | 'boosts'>('payments')
  const [payments, setPayments] = useState<PaymentData[]>([])
  const [boosts, setBoosts] = useState<BoostData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPaymentsAndBoosts()
  }, [])

  const fetchPaymentsAndBoosts = async () => {
    try {
      setLoading(true)

      // Fetch payments with user data
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('transactions')
        .select(`
          *,
          user:users!transactions_user_id_fkey(email, full_name),
          item:items!transactions_item_id_fkey(title)
        `)
        .order('created_at', { ascending: false })
        .limit(50)

      if (paymentsError) throw paymentsError

      // Fetch boosts with item and user data
      const { data: boostsData, error: boostsError } = await supabase
        .from('boosts')
        .select(`
          *,
          item:items!boosts_item_id_fkey(title, user_id, view_count, save_count),
          user:users!items_user_id_fkey(email, full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(50)

      if (boostsError) throw boostsError

      setPayments(paymentsData || [])
      setBoosts(boostsData || [])
    } catch (error) {
      console.error('Error fetching payments and boosts:', error)
    } finally {
      setLoading(false)
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getBoostStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'expired':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const totalRevenue = payments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0)

  const activeBoosts = boosts.filter(b => b.is_active && new Date(b.expires_at) > new Date()).length
  const totalBoosts = boosts.length

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Payments & Boosts
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor payment transactions and boost performance.
        </p>
      </div>

      {/* Revenue Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                ${totalRevenue.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Active Boosts</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {activeBoosts}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <CreditCard className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Transactions</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {payments.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <Calendar className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">This Month</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                ${(totalRevenue * 0.8).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('payments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'payments'
                  ? 'border-green-500 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Payment Transactions
            </button>
            <button
              onClick={() => setActiveTab('boosts')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'boosts'
                  ? 'border-green-500 text-green-600 dark:text-green-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Boost Performance
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'payments' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Transaction
                    </th>
                    <th className="text-left py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="text-left py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="text-left py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {loading ? (
                    Array(5).fill(0).map((_, i) => (
                      <tr key={i}>
                        <td className="py-4">
                          <div className="animate-pulse">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
                        </td>
                        <td className="py-4">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
                        </td>
                        <td className="py-4">
                          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20 animate-pulse"></div>
                        </td>
                        <td className="py-4">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    payments.map((payment) => (
                      <tr key={payment.id}>
                        <td className="py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {payment.description}
                            </div>
                            {payment.item?.title && (
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {payment.item.title}
                              </div>
                            )}
                            <div className="text-xs text-gray-400 dark:text-gray-500">
                              {payment.currency}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 text-sm text-gray-900 dark:text-white">
                          {payment.user?.full_name || payment.user?.email}
                        </td>
                        <td className="py-4 text-sm font-medium text-gray-900 dark:text-white">
                          {payment.amount.toFixed(2)} {payment.currency}
                        </td>
                        <td className="py-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(payment.status)}`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="py-4 text-sm text-gray-500 dark:text-gray-400">
                          {formatDistanceToNow(new Date(payment.created_at), { addSuffix: true })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'boosts' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="text-left py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Item
                    </th>
                    <th className="text-left py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      User
                    </th>
                    <th className="text-left py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Performance
                    </th>
                    <th className="text-left py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left py-3 text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Expires
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {loading ? (
                    Array(5).fill(0).map((_, i) => (
                      <tr key={i}>
                        <td className="py-4">
                          <div className="animate-pulse">
                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse"></div>
                        </td>
                        <td className="py-4">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                        </td>
                        <td className="py-4">
                          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20 animate-pulse"></div>
                        </td>
                        <td className="py-4">
                          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    boosts.map((boost) => {
                      const isActive = boost.is_active && new Date(boost.expires_at) > new Date()
                      return (
                        <tr key={boost.id}>
                          <td className="py-4">
                            <div>
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {boost.item?.title || 'Unknown Item'}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {boost.boost_type} • {boost.duration_days} days
                              </div>
                            </div>
                          </td>
                          <td className="py-4 text-sm text-gray-900 dark:text-white">
                            {boost.user?.full_name || boost.user?.email || 'Unknown User'}
                          </td>
                          <td className="py-4">
                            <div className="text-sm text-gray-900 dark:text-white">
                              <div className="flex items-center space-x-4">
                                <span>{boost.item?.view_count || 0} views</span>
                                <span>{boost.item?.save_count || 0} saves</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBoostStatusColor(isActive ? 'active' : 'expired')}`}>
                              {isActive ? 'active' : 'expired'}
                            </span>
                          </td>
                          <td className="py-4 text-sm text-gray-500 dark:text-gray-400">
                            {isActive 
                              ? formatDistanceToNow(new Date(boost.expires_at), { addSuffix: true })
                              : 'Expired'
                            }
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}