'use client'

import { useState } from 'react'
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

// Mock data for payments and boosts
const mockPayments = [
  {
    id: '1',
    user_email: 'john@example.com',
    amount: 4.99,
    type: 'boost',
    status: 'completed',
    item_title: 'Vintage Camera',
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    payment_method: 'Credit Card'
  },
  {
    id: '2',
    user_email: 'jane@example.com',
    amount: 9.99,
    type: 'premium',
    status: 'completed',
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    payment_method: 'PayPal'
  },
  {
    id: '3',
    user_email: 'mike@example.com',
    amount: 4.99,
    type: 'boost',
    status: 'failed',
    item_title: 'Gaming Console',
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    payment_method: 'Credit Card'
  }
]

const mockBoosts = [
  {
    id: '1',
    item_title: 'Vintage Camera',
    user_email: 'john@example.com',
    amount_paid: 4.99,
    boost_duration: 7,
    started_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    views_gained: 156,
    saves_gained: 23
  },
  {
    id: '2',
    item_title: 'Designer Handbag',
    user_email: 'sarah@example.com',
    amount_paid: 4.99,
    boost_duration: 7,
    started_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    expires_at: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'active',
    views_gained: 89,
    saves_gained: 12
  },
  {
    id: '3',
    item_title: 'Bicycle',
    user_email: 'tom@example.com',
    amount_paid: 4.99,
    boost_duration: 7,
    started_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    expires_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'expired',
    views_gained: 234,
    saves_gained: 45
  }
]

export function PaymentsBoosts() {
  const [activeTab, setActiveTab] = useState<'payments' | 'boosts'>('payments')

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

  const totalRevenue = mockPayments
    .filter(p => p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0)

  const activeBoosts = mockBoosts.filter(b => b.status === 'active').length
  const totalBoosts = mockBoosts.length

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
                {mockPayments.length}
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
                  {mockPayments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {payment.type === 'boost' ? 'Item Boost' : 'Premium Subscription'}
                          </div>
                          {payment.item_title && (
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {payment.item_title}
                            </div>
                          )}
                          <div className="text-xs text-gray-400 dark:text-gray-500">
                            {payment.payment_method}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-gray-900 dark:text-white">
                        {payment.user_email}
                      </td>
                      <td className="py-4 text-sm font-medium text-gray-900 dark:text-white">
                        ${payment.amount.toFixed(2)}
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
                  ))}
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
                  {mockBoosts.map((boost) => (
                    <tr key={boost.id}>
                      <td className="py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {boost.item_title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            ${boost.amount_paid} • {boost.boost_duration} days
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-gray-900 dark:text-white">
                        {boost.user_email}
                      </td>
                      <td className="py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          <div className="flex items-center space-x-4">
                            <span>{boost.views_gained} views</span>
                            <span>{boost.saves_gained} saves</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getBoostStatusColor(boost.status)}`}>
                          {boost.status}
                        </span>
                      </td>
                      <td className="py-4 text-sm text-gray-500 dark:text-gray-400">
                        {boost.status === 'active' 
                          ? formatDistanceToNow(new Date(boost.expires_at), { addSuffix: true })
                          : 'Expired'
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}