'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  TrendingUp, 
  Users, 
  Package, 
  MessageSquare, 
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Globe,
  Clock
} from 'lucide-react'
import { StatsCard } from '../components/StatsCard'

interface AnalyticsData {
  userGrowth: { date: string; count: number }[]
  itemsByCategory: { category: string; count: number }[]
  swapsByStatus: { status: string; count: number }[]
  dailyActivity: { date: string; users: number; items: number; swaps: number }[]
}

export function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    userGrowth: [],
    itemsByCategory: [],
    swapsByStatus: [],
    dailyActivity: []
  })
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      // Mock analytics data - in real implementation, you'd fetch from database
      const mockData: AnalyticsData = {
        userGrowth: [
          { date: '2024-10-01', count: 45 },
          { date: '2024-10-02', count: 52 },
          { date: '2024-10-03', count: 48 },
          { date: '2024-10-04', count: 61 },
          { date: '2024-10-05', count: 55 },
          { date: '2024-10-06', count: 67 },
          { date: '2024-10-07', count: 73 }
        ],
        itemsByCategory: [
          { category: 'Electronics', count: 156 },
          { category: 'Clothing', count: 234 },
          { category: 'Books', count: 89 },
          { category: 'Home & Garden', count: 123 },
          { category: 'Sports', count: 67 }
        ],
        swapsByStatus: [
          { status: 'Completed', count: 89 },
          { status: 'Pending', count: 34 },
          { status: 'Declined', count: 12 },
          { status: 'Cancelled', count: 8 }
        ],
        dailyActivity: [
          { date: '2024-10-01', users: 45, items: 23, swaps: 12 },
          { date: '2024-10-02', users: 52, items: 31, swaps: 18 },
          { date: '2024-10-03', users: 48, items: 27, swaps: 15 },
          { date: '2024-10-04', users: 61, items: 35, swaps: 22 },
          { date: '2024-10-05', users: 55, items: 29, swaps: 19 }
        ]
      }
      
      setAnalytics(mockData)
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const totalUsers = analytics.userGrowth.reduce((sum, day) => sum + day.count, 0)
  const totalItems = analytics.itemsByCategory.reduce((sum, cat) => sum + cat.count, 0)
  const totalSwaps = analytics.swapsByStatus.reduce((sum, status) => sum + status.count, 0)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Analytics Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Comprehensive insights into platform performance and user behavior.
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={totalUsers}
          subtitle="Active users"
          icon={Users}
          trend="+12%"
          trendUp={true}
          loading={loading}
          color="blue"
        />
        
        <StatsCard
          title="Total Items"
          value={totalItems}
          subtitle="Listed items"
          icon={Package}
          trend="+8%"
          trendUp={true}
          loading={loading}
          color="green"
        />
        
        <StatsCard
          title="Total Swaps"
          value={totalSwaps}
          subtitle="All time"
          icon={MessageSquare}
          trend="+15%"
          trendUp={true}
          loading={loading}
          color="purple"
        />
        
        <StatsCard
          title="Success Rate"
          value="89%"
          subtitle="Swap completion"
          icon={TrendingUp}
          trend="+3%"
          trendUp={true}
          loading={loading}
          color="green"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Growth</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {analytics.userGrowth.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {new Date(day.date).toLocaleDateString()}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full" 
                      style={{ width: `${(day.count / 80) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-8">
                    {day.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Items by Category */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Items by Category</h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {analytics.itemsByCategory.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {category.category}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${(category.count / 250) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 dark:text-white w-12">
                    {category.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Swap Status Distribution */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Swap Status</h3>
            <Activity className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {analytics.swapsByStatus.map((status, index) => {
              const colors = {
                'Completed': 'bg-green-500',
                'Pending': 'bg-yellow-500',
                'Declined': 'bg-red-500',
                'Cancelled': 'bg-gray-500'
              }
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {status.status}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`${colors[status.status as keyof typeof colors]} h-2 rounded-full`}
                        style={{ width: `${(status.count / 100) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-8">
                      {status.count}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Daily Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Daily Activity</h3>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {analytics.dailyActivity.map((day, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {new Date(day.date).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 space-x-4">
                  <span>{day.users} users</span>
                  <span>{day.items} items</span>
                  <span>{day.swaps} swaps</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Insights */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance Insights</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">Growth Rate</h4>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">+23%</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">vs last month</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">Avg. Response Time</h4>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">2.3h</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">to swap requests</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <Globe className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">Geographic Reach</h4>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">12</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">countries</p>
          </div>
        </div>
      </div>
    </div>
  )
}