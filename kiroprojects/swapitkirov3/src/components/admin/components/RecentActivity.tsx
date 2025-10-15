'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { formatDistanceToNow } from 'date-fns'
import { 
  User, 
  Package, 
  MessageSquare, 
  Flag, 
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'

interface ActivityItem {
  id: string
  type: 'user_joined' | 'item_added' | 'swap_completed' | 'report_submitted'
  description: string
  timestamp: string
  user?: {
    full_name: string | null
    email: string
  }
}

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRecentActivity()
  }, [])

  const fetchRecentActivity = async () => {
    try {
      // Fetch recent users
      const { data: recentUsers } = await supabase
        .from('users')
        .select('id, full_name, email, created_at')
        .order('created_at', { ascending: false })
        .limit(5)

      // Fetch recent items
      const { data: recentItems } = await supabase
        .from('items')
        .select(`
          id, 
          title, 
          created_at,
          users!items_user_id_fkey (full_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(5)

      // Fetch recent completed swaps
      const { data: recentSwaps } = await supabase
        .from('swap_requests')
        .select(`
          id, 
          completed_at,
          users!swap_requests_requester_id_fkey (full_name, email)
        `)
        .eq('status', 'completed')
        .order('completed_at', { ascending: false })
        .limit(5)

      // Combine and format activities
      const allActivities: ActivityItem[] = []

      // Add user activities
      recentUsers?.forEach(user => {
        allActivities.push({
          id: `user-${user.id}`,
          type: 'user_joined',
          description: `${user.full_name || user.email} joined SwapIt`,
          timestamp: user.created_at,
          user: {
            full_name: user.full_name,
            email: user.email
          }
        })
      })

      // Add item activities
      recentItems?.forEach(item => {
        allActivities.push({
          id: `item-${item.id}`,
          type: 'item_added',
          description: `New item "${item.title}" was listed`,
          timestamp: item.created_at,
          user: item.users
        })
      })

      // Add swap activities
      recentSwaps?.forEach(swap => {
        if (swap.completed_at) {
          allActivities.push({
            id: `swap-${swap.id}`,
            type: 'swap_completed',
            description: `Swap completed successfully`,
            timestamp: swap.completed_at,
            user: swap.users
          })
        }
      })

      // Sort by timestamp and take most recent
      allActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      setActivities(allActivities.slice(0, 10))

    } catch (error) {
      console.error('Error fetching recent activity:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'user_joined':
        return <User className="w-4 h-4 text-blue-500" />
      case 'item_added':
        return <Package className="w-4 h-4 text-green-500" />
      case 'swap_completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'report_submitted':
        return <Flag className="w-4 h-4 text-red-500" />
      default:
        return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Recent Activity
      </h3>
      
      <div className="space-y-4">
        {activities.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">
            No recent activity
          </p>
        ) : (
          activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                {getActivityIcon(activity.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900 dark:text-white">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium">
          View all activity →
        </button>
      </div>
    </div>
  )
}