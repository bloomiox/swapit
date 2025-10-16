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
  userGrowth: { date: string; count: number; cumulative: number }[]
  itemsByCategory: { category: string; count: number; percentage: number }[]
  swapsByStatus: { status: string; count: number; percentage: number }[]
  dailyActivity: { date: string; users: number; items: number; swaps: number; total_activity: number }[]
  summaryStats: {
    total_users: number
    active_users: number
    total_items: number
    active_items: number
    total_swaps: number
    completed_swaps: number
    success_rate: number
    avg_response_time_hours: number
    recent_signups_7d: number
    recent_items_7d: number
    recent_swaps_7d: number
  }
  performanceMetrics: {
    platform_health: {
      uptime_percentage: number
      avg_response_time_ms: number
      error_rate_percentage: number
    }
    user_engagement: {
      daily_active_users: number
      weekly_active_users: number
      avg_items_per_user: number
      avg_swaps_per_user: number
    }
    content_metrics: {
      total_views: number
      total_saves: number
      avg_views_per_item: number
      most_viewed_category: string
    }
  }
}

export function Analytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    userGrowth: [],
    itemsByCategory: [],
    swapsByStatus: [],
    dailyActivity: [],
    summaryStats: {
      total_users: 0,
      active_users: 0,
      total_items: 0,
      active_items: 0,
      total_swaps: 0,
      completed_swaps: 0,
      success_rate: 0,
      avg_response_time_hours: 0,
      recent_signups_7d: 0,
      recent_items_7d: 0,
      recent_swaps_7d: 0
    },
    performanceMetrics: {
      platform_health: {
        uptime_percentage: 0,
        avg_response_time_ms: 0,
        error_rate_percentage: 0
      },
      user_engagement: {
        daily_active_users: 0,
        weekly_active_users: 0,
        avg_items_per_user: 0,
        avg_swaps_per_user: 0
      },
      content_metrics: {
        total_views: 0,
        total_saves: 0,
        avg_views_per_item: 0,
        most_viewed_category: ''
      }
    }
  })
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d')

  useEffect(() => {
    fetchAnalytics()
  }, [timeRange])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      
      const daysBack = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90

      // Fetch comprehensive analytics
      const { data: analyticsData, error: analyticsError } = await supabase
        .rpc('get_comprehensive_analytics', { days_back: daysBack })

      if (analyticsError) throw analyticsError

      // Fetch performance metrics
      const { data: performanceData, error: performanceError } = await supabase
        .rpc('get_performance_metrics')

      if (performanceError) throw performanceError

      setAnalytics({
        userGrowth: analyticsData.user_growth || [],
        itemsByCategory: analyticsData.items_by_category || [],
        swapsByStatus: analyticsData.swap_status || [],
        dailyActivity: analyticsData.daily_activity || [],
        summaryStats: analyticsData.summary_stats || {},
        performanceMetrics: performanceData || {}
      })
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

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
          value={analytics.summaryStats.total_users}
          subtitle={`${analytics.summaryStats.active_users} active`}
          icon={Users}
          trend={`+${analytics.summaryStats.recent_signups_7d} this week`}
          trendUp={analytics.summaryStats.recent_signups_7d > 0}
          loading={loading}
          color="blue"
        />
        
        <StatsCard
          title="Total Items"
          value={analytics.summaryStats.total_items}
          subtitle={`${analytics.summaryStats.active_items} available`}
          icon={Package}
          trend={`+${analytics.summaryStats.recent_items_7d} this week`}
          trendUp={analytics.summaryStats.recent_items_7d > 0}
          loading={loading}
          color="green"
        />
        
        <StatsCard
          title="Total Swaps"
          value={analytics.summaryStats.total_swaps}
          subtitle={`${analytics.summaryStats.completed_swaps} completed`}
          icon={MessageSquare}
          trend={`+${analytics.summaryStats.recent_swaps_7d} this week`}
          trendUp={analytics.summaryStats.recent_swaps_7d > 0}
          loading={loading}
          color="purple"
        />
        
        <StatsCard
          title="Success Rate"
          value={`${analytics.summaryStats.success_rate || 0}%`}
          subtitle="Swap completion"
          icon={TrendingUp}
          trend={`${analytics.summaryStats.avg_response_time_hours || 0}h avg response`}
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
            {analytics.userGrowth.slice(-7).map((day, index) => {
              const maxCount = Math.max(...analytics.userGrowth.map(d => d.count), 1)
              return (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {new Date(day.date).toLocaleDateString()}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${(day.count / maxCount) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white w-8">
                      {day.count}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Items by Category */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Items by Category</h3>
            <PieChart className="w-5 h-5 text-gray-400" />
          </div>
          
          <div className="space-y-3">
            {analytics.itemsByCategory.slice(0, 6).map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {category.category}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${category.percentage}%` }}
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
                'completed': 'bg-green-500',
                'pending': 'bg-yellow-500',
                'rejected': 'bg-red-500',
                'cancelled': 'bg-gray-500',
                'approved': 'bg-blue-500'
              }
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {status.status.charAt(0).toUpperCase() + status.status.slice(1)}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className={`${colors[status.status as keyof typeof colors] || 'bg-gray-500'} h-2 rounded-full`}
                        style={{ width: `${status.percentage}%` }}
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
            {analytics.dailyActivity.slice(-5).map((day, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {new Date(day.date).toLocaleDateString()}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 space-x-4">
                  <span>{day.users} users</span>
                  <span>{day.items} items</span>
                  <span>{day.swaps} swaps</span>
                  <span className="font-medium">({day.total_activity} total)</span>
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
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">Platform Health</h4>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
              {analytics.performanceMetrics.platform_health?.uptime_percentage || 99.9}%
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">uptime</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <Clock className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">Avg. Response Time</h4>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              {analytics.summaryStats.avg_response_time_hours || 0}h
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">to swap requests</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <h4 className="font-medium text-gray-900 dark:text-white mb-1">Weekly Active Users</h4>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">
              {analytics.performanceMetrics.user_engagement?.weekly_active_users || 0}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">this week</p>
          </div>
        </div>
        
        {/* Additional Metrics */}
        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Views</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {analytics.performanceMetrics.content_metrics?.total_views?.toLocaleString() || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Saves</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {analytics.performanceMetrics.content_metrics?.total_saves?.toLocaleString() || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Avg Items/User</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {analytics.performanceMetrics.user_engagement?.avg_items_per_user || 0}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Top Category</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {analytics.performanceMetrics.content_metrics?.most_viewed_category || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}