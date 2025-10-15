'use client'

import { useState, useEffect } from 'react'
import { 
  Shield, 
  AlertTriangle, 
  Lock, 
  Eye, 
  UserX,
  Activity,
  Globe,
  Key,
  FileText,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'
import { StatsCard } from '../components/StatsCard'

interface SecurityEvent {
  id: string
  type: 'login_attempt' | 'suspicious_activity' | 'data_breach' | 'policy_violation'
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  user_email?: string
  ip_address?: string
  timestamp: string
  status: 'active' | 'resolved' | 'investigating'
}

export function Security() {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all')

  useEffect(() => {
    fetchSecurityEvents()
  }, [])

  const fetchSecurityEvents = async () => {
    // Mock security events data
    const mockEvents: SecurityEvent[] = [
      {
        id: '1',
        type: 'login_attempt',
        severity: 'medium',
        description: 'Multiple failed login attempts detected',
        user_email: 'suspicious@example.com',
        ip_address: '192.168.1.100',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'active'
      },
      {
        id: '2',
        type: 'suspicious_activity',
        severity: 'high',
        description: 'Unusual item posting pattern detected',
        user_email: 'user@example.com',
        ip_address: '10.0.0.50',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        status: 'investigating'
      },
      {
        id: '3',
        type: 'policy_violation',
        severity: 'low',
        description: 'User reported for inappropriate content',
        user_email: 'reported@example.com',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        status: 'resolved'
      }
    ]
    
    setSecurityEvents(mockEvents)
    setLoading(false)
  }

  const filteredEvents = securityEvents.filter(event => 
    filterSeverity === 'all' || event.severity === filterSeverity
  )

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'critical':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'investigating':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'login_attempt':
        return <Key className="w-4 h-4" />
      case 'suspicious_activity':
        return <AlertTriangle className="w-4 h-4" />
      case 'data_breach':
        return <Shield className="w-4 h-4" />
      case 'policy_violation':
        return <FileText className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const stats = {
    activeThreats: securityEvents.filter(e => e.status === 'active').length,
    resolvedThreats: securityEvents.filter(e => e.status === 'resolved').length,
    criticalEvents: securityEvents.filter(e => e.severity === 'critical').length,
    investigating: securityEvents.filter(e => e.status === 'investigating').length
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Security Center
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Monitor security events, threats, and manage platform security settings.
        </p>
      </div>

      {/* Security Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Active Threats"
          value={stats.activeThreats}
          subtitle="Require attention"
          icon={AlertTriangle}
          color="red"
          loading={loading}
        />
        
        <StatsCard
          title="Investigating"
          value={stats.investigating}
          subtitle="Under review"
          icon={Eye}
          color="yellow"
          loading={loading}
        />
        
        <StatsCard
          title="Resolved"
          value={stats.resolvedThreats}
          subtitle="This month"
          icon={CheckCircle}
          color="green"
          loading={loading}
        />
        
        <StatsCard
          title="Critical Events"
          value={stats.criticalEvents}
          subtitle="High priority"
          icon={Shield}
          color="red"
          loading={loading}
        />
      </div>

      {/* Security Settings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Security Policies */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Lock className="w-5 h-5 mr-2" />
            Security Policies
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Two-Factor Authentication</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Require 2FA for admin accounts</p>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm text-green-600 dark:text-green-400">Enabled</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Password Policy</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Minimum 8 characters, mixed case</p>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm text-green-600 dark:text-green-400">Enabled</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Session Timeout</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">Auto-logout after 24 hours</p>
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm text-green-600 dark:text-green-400">Enabled</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white">Rate Limiting</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">API request limits</p>
              </div>
              <div className="flex items-center">
                <XCircle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-sm text-red-600 dark:text-red-400">Disabled</span>
              </div>
            </div>
          </div>
        </div>

        {/* Access Control */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <UserX className="w-5 h-5 mr-2" />
            Access Control
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Admin Users</span>
              <span className="text-sm text-gray-900 dark:text-white">3 active</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Blocked IPs</span>
              <span className="text-sm text-gray-900 dark:text-white">12 addresses</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Suspended Users</span>
              <span className="text-sm text-gray-900 dark:text-white">5 accounts</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Failed Logins (24h)</span>
              <span className="text-sm text-red-600 dark:text-red-400">23 attempts</span>
            </div>
            
            <button className="w-full mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              View Blocked Users
            </button>
          </div>
        </div>
      </div>

      {/* Security Events */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Security Events</h3>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Severities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredEvents.map((event) => (
            <div key={event.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                    {getTypeIcon(event.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(event.severity)}`}>
                        {event.severity.toUpperCase()}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(event.status)}`}>
                        {event.status}
                      </span>
                    </div>
                    
                    <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                      {event.description}
                    </p>
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400 space-x-4">
                      {event.user_email && <span>User: {event.user_email}</span>}
                      {event.ip_address && <span>IP: {event.ip_address}</span>}
                      <span>{new Date(event.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200">
                    Investigate
                  </button>
                  <button className="px-3 py-1 text-xs font-medium rounded bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-200">
                    Resolve
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredEvents.length === 0 && (
          <div className="text-center py-8">
            <Shield className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No security events</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              No events match your current filter.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}