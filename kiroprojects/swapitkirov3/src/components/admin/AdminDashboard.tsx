'use client'

import { DashboardOverview } from './sections/DashboardOverview'
import { UserManagement } from './sections/UserManagement'
import { ItemManagement } from './sections/ItemManagement'
import { SwapManagement } from './sections/SwapManagement'
import { ReportsModeration } from './sections/ReportsModeration'
import { PaymentsBoosts } from './sections/PaymentsBoosts'
import { Analytics } from './sections/Analytics'
import { Security } from './sections/Security'
import { ContentManagement } from './sections/ContentManagement'
import { SystemSettings } from './sections/SystemSettings'

interface AdminDashboardProps {
  activeSection: string
}

export function AdminDashboard({ activeSection }: AdminDashboardProps) {
  const renderSection = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardOverview />
      case 'users':
        return <UserManagement />
      case 'items':
        return <ItemManagement />
      case 'swaps':
        return <SwapManagement />
      case 'reports':
        return <ReportsModeration />
      case 'payments':
        return <PaymentsBoosts />
      case 'analytics':
        return <Analytics />
      case 'security':
        return <Security />
      case 'content':
        return <ContentManagement />
      case 'settings':
        return <SystemSettings />
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="space-y-6">
      {renderSection()}
    </div>
  )
}