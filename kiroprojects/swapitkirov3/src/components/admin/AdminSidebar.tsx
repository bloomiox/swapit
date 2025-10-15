'use client'

import { 
  BarChart3, 
  Users, 
  Package, 
  MessageSquare, 
  Flag, 
  CreditCard, 
  TrendingUp,
  Shield,
  Settings,
  FileText
} from 'lucide-react'

interface AdminSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'items', label: 'Item Management', icon: Package },
  { id: 'swaps', label: 'Swap Requests', icon: MessageSquare },
  { id: 'reports', label: 'Reports & Moderation', icon: Flag },
  { id: 'payments', label: 'Payments & Boosts', icon: CreditCard },
  { id: 'analytics', label: 'Analytics', icon: TrendingUp },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'content', label: 'Content Management', icon: FileText },
  { id: 'settings', label: 'System Settings', icon: Settings },
]

export function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen">
      <nav className="p-4 space-y-2">
        {sidebarItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                isActive
                  ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          )
        })}
      </nav>
    </aside>
  )
}