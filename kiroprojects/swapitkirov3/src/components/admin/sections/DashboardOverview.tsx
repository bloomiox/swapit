'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Users, 
  Package, 
  MessageSquare, 
  TrendingUp, 
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react'
import { StatsCard } from '../components/StatsCard'
import { RecentActivity } from '../components/RecentActivity'
import { QuickActions } from '../components/QuickActions'

interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalItems: number
  activeItems: number
  totalSwaps: number
  completedSwaps: number
  pendingReports: number
  totalRevenue: number
}

export function DashboardOverview() {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeUsers: 0,
    totalItems: 0,
    activeItems: 0,
    totalSwaps: 0,
    completedSwaps: 0,
    pendingReports: 0,
    totalRevenue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      // Fetch user stats
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })

      const { count: activeUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)

      // Fetch item stats
      const { count: totalItems } = await supabase
        .from('items')
        .select('*', { count: 'exact', head: true })

      const { count: activeItems } = await supabase
        .from('items')
        .select('*', { count: 'exact', head: true })
        .eq('is_available', true)

      // Fetch swap stats
      const { count: totalSwaps } = await supabase
        .from('swap_requests')
        .select('*', { count: 'exact', head: true })

      const { count: completedSwaps } = await supabase
        .from('swap_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'completed')

      setStats({
        totalUsers: totalUsers || 0,
        activeUsers: activeUsers || 0,
        totalItems: totalItems || 0,
        activeItems: activeItems || 0,
        totalSwaps: totalSwaps || 0,
        completedSwaps: completedSwaps || 0,
        pendingReports: 0, // Will implement when reports table exists
        totalRevenue: 0 // Will implement when payments are integrated
      })
    } catch (error) {
      console.error('Error fetching dashboard stats:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Dashboard Overview
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Welcome to the SwapIt admin panel. Here's what's happening on your platform.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Users"
          value={stats.totalUsers}
          subtitle={`${stats.activeUsers} active`}
          icon={Users}
          trend="+12%"
          trendUp={true}
          loading={loading}
        />
        
        <StatsCard
          title="Total Items"
          value={stats.totalItems}
          subtitle={`${stats.activeItems} available`}
          icon={Package}
          trend="+8%"
          trendUp={true}
          loading={loading}
        />
        
        <StatsCard
          title="Swap Requests"
          value={stats.totalSwaps}
          subtitle={`${stats.completedSwaps} completed`}
          icon={MessageSquare}
          trend="+15%"
          trendUp={true}
          loading={loading}
        />
        
        <StatsCard
          title="Revenue"
          value={`$${stats.totalRevenue}`}
          subtitle="From boosts & premium"
          icon={DollarSign}
          trend="+23%"
          trendUp={true}
          loading={loading}
        />
      </div>

      {/* Secondary Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Completion Rate"
          value={stats.totalSwaps > 0 ? `${Math.round((stats.completedSwaps / stats.totalSwaps) * 100)}%` : '0%'}
          subtitle="Successful swaps"
          icon={CheckCircle}
          color="green"
          loading={loading}
        />
        
        <StatsCard
          title="Pending Reports"
          value={stats.pendingReports}
          subtitle="Need attention"
          icon={AlertTriangle}
          color="yellow"
          loading={loading}
        />
        
        <StatsCard
          title="Avg. Response Time"
          value="2.3h"
          subtitle="Support tickets"
          icon={Clock}
          color="blue"
          loading={loading}
        />
        
        <StatsCard
          title="Platform Health"
          value="99.9%"
          subtitle="Uptime this month"
          icon={TrendingUp}
          color="green"
          loading={loading}
        />
      </div>

      {/* Dashboard Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity />
        </div>
        
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  )
}