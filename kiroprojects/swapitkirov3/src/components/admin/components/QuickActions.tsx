'use client'

import { 
  UserPlus, 
  Package, 
  Flag, 
  Settings, 
  Mail, 
  TrendingUp,
  Shield,
  FileText
} from 'lucide-react'

const quickActions = [
  {
    id: 'add-user',
    title: 'Add User',
    description: 'Create new user account',
    icon: UserPlus,
    color: 'bg-blue-500 hover:bg-blue-600'
  },
  {
    id: 'moderate-content',
    title: 'Moderate Content',
    description: 'Review reported items',
    icon: Flag,
    color: 'bg-red-500 hover:bg-red-600'
  },
  {
    id: 'send-announcement',
    title: 'Send Announcement',
    description: 'Notify all users',
    icon: Mail,
    color: 'bg-green-500 hover:bg-green-600'
  },
  {
    id: 'view-analytics',
    title: 'View Analytics',
    description: 'Platform insights',
    icon: TrendingUp,
    color: 'bg-purple-500 hover:bg-purple-600'
  },
  {
    id: 'security-check',
    title: 'Security Check',
    description: 'Run security audit',
    icon: Shield,
    color: 'bg-yellow-500 hover:bg-yellow-600'
  },
  {
    id: 'export-data',
    title: 'Export Data',
    description: 'Download reports',
    icon: FileText,
    color: 'bg-gray-500 hover:bg-gray-600'
  }
]

export function QuickActions() {
  const handleAction = (actionId: string) => {
    // Handle quick actions
    console.log(`Executing action: ${actionId}`)
    // You can implement specific actions here
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Quick Actions
      </h3>
      
      <div className="space-y-3">
        {quickActions.map((action) => {
          const Icon = action.icon
          
          return (
            <button
              key={action.id}
              onClick={() => handleAction(action.id)}
              className="w-full flex items-center space-x-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors group"
            >
              <div className={`p-2 rounded-lg ${action.color} transition-colors`}>
                <Icon className="w-4 h-4 text-white" />
              </div>
              
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400">
                  {action.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {action.description}
                </p>
              </div>
            </button>
          )
        })}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <button className="w-full text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium py-2">
          View all actions
        </button>
      </div>
    </div>
  )
}