'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
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
import { formatDistanceToNow } from 'date-fns'

interface SecurityEvent {
  id: string
  event_type: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  title: string
  description: string | null
  user_email: string | null
  ip_address: string | null
  created_at: string
  status: 'active' | 'resolved' | 'investigating' | 'dismissed'
}

interface SecurityStats {
  active_threats: number
  investigating: number
  resolved_today: number
  critical_events: number
  failed_logins_24h: number
  suspicious_activities_7d: number
  blocked_ips: number
  admin_accesses_today: number
}

interface SecuritySettings {
  setting_key: string
  setting_value: any
  description: string
  is_active: boolean
}

export function Security() {
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([])
  const [securityStats, setSecurityStats] = useState<SecurityStats>({
    active_threats: 0,
    investigating: 0,
    resolved_today: 0,
    critical_events: 0,
    failed_logins_24h: 0,
    suspicious_activities_7d: 0,
    blocked_ips: 0,
    admin_accesses_today: 0
  })
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings[]>([])
  const [loading, setLoading] = useState(true)
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'low' | 'medium' | 'high' | 'critical'>('all')

  useEffect(() => {
    fetchSecurityData()
  }, [filterSeverity])

  const fetchSecurityData = async () => {
    try {
      setLoading(true)

      // Fetch security dashboard stats
      const { data: statsData, error: statsError } = await supabase
        .rpc('get_security_dashboard_stats')

      if (statsError) throw statsError
      setSecurityStats(statsData || {})

      // Fetch recent security events
      const { data: eventsData, error: eventsError } = await supabase
        .rpc('get_recent_security_events', { 
          p_limit: 50, 
          p_severity: filterSeverity === 'all' ? 'all' : filterSeverity 
        })

      if (eventsError) throw eventsError
      setSecurityEvents(eventsData || [])

      // Fetch security settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('security_settings')
        .select('*')
        .eq('is_active', true)
        .order('setting_key')

      if (settingsError) throw settingsError
      setSecuritySettings(settingsData || [])

    } catch (error) {
      console.error('Error fetching security data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleEventAction = async (eventId: string, action: 'investigate' | 'resolve' | 'dismiss') => {
    try {
      const status = action === 'investigate' ? 'investigating' : 
                    action === 'resolve' ? 'resolved' : 'dismissed'
      
      const { error } = await supabase
        .from('security_events')
        .update({ 
          status,
          resolved_at: action === 'resolve' ? new Date().toISOString() : null,
          updated_at: new Date().toISOString()
        })
        .eq('id', eventId)

      if (error) throw error

      // Update local state
      setSecurityEvents(prev => prev.map(event => 
        event.id === eventId 
          ? { ...event, status: status as any }
          : event
      ))
    } catch (error) {
      console.error('Error updating security event:', error)
    }
  }

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
      case 'failed_login':
        return <Key className="w-4 h-4" />
      case 'suspicious_activity':
        return <AlertTriangle className="w-4 h-4" />
      case 'data_breach':
        return <Shield className="w-4 h-4" />
      case 'policy_violation':
        return <FileText className="w-4 h-4" />
      case 'admin_access':
        return <Eye className="w-4 h-4" />
      case 'account_lockout':
        return <UserX className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const getSecuritySettingStatus = (key: string) => {
    const setting = securitySettings.find(s => s.setting_key === key)
    if (!setting) return { enabled: false, value: null }
    
    if (typeof setting.setting_value === 'boolean') {
      return { enabled: setting.setting_value, value: setting.setting_value }
    }
    if (typeof setting.setting_value === 'string') {
      return { enabled: setting.setting_value === 'true', value: setting.setting_value }
    }
    return { enabled: true, value: setting.setting_value }
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
          value={securityStats.active_threats}
          subtitle="Require attention"
          icon={AlertTriangle}
          color="red"
          loading={loading}
        />
        
        <StatsCard
          title="Investigating"
          value={securityStats.investigating}
          subtitle="Under review"
          icon={Eye}
          color="yellow"
          loading={loading}
        />
        
        <StatsCard
          title="Resolved Today"
          value={securityStats.resolved_today}
          subtitle="Today"
          icon={CheckCircle}
          color="green"
          loading={loading}
        />
        
        <StatsCard
          title="Critical Events"
          value={securityStats.critical_events}
          subtitle="Last 30 days"
          icon={Shield}
          color="red"
          loading={loading}
        />
      </div>

      {/* Additional Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatsCard
          title="Failed Logins"
          value={securityStats.failed_logins_24h}
          subtitle="Last 24 hours"
          icon={Key}
          color="yellow"
          loading={loading}
        />
        
        <StatsCard
          title="Suspicious Activity"
          value={securityStats.suspicious_activities_7d}
          subtitle="Last 7 days"
          icon={AlertTriangle}
          color="red"
          loading={loading}
        />
        
        <StatsCard
          title="Blocked IPs"
          value={securityStats.blocked_ips}
          subtitle="Last 30 days"
          icon={UserX}
          color="red"
          loading={loading}
        />
        
        <StatsCard
          title="Admin Access"
          value={securityStats.admin_accesses_today}
          subtitle="Today"
          icon={Shield}
          color="blue"
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
            {[
              { key: 'require_2fa_admin', title: 'Two-Factor Authentication', desc: 'Require 2FA for admin accounts' },
              { key: 'password_min_length', title: 'Password Policy', desc: 'Minimum password requirements' },
              { key: 'session_timeout_hours', title: 'Session Timeout', desc: 'Auto-logout configuration' },
              { key: 'rate_limit_requests_per_minute', title: 'Rate Limiting', desc: 'API request limits' }
            ].map((policy) => {
              const setting = getSecuritySettingStatus(policy.key)
              const isEnabled = policy.key === 'password_min_length' ? 
                (setting.value && parseInt(setting.value) >= 8) :
                policy.key === 'session_timeout_hours' ?
                (setting.value && parseInt(setting.value) <= 24) :
                setting.enabled

              return (
                <div key={policy.key} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{policy.title}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {policy.desc}
                      {setting.value && policy.key !== 'require_2fa_admin' && (
                        <span className="ml-2 font-mono">({setting.value})</span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {isEnabled ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                        <span className="text-sm text-green-600 dark:text-green-400">Enabled</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-red-500 mr-2" />
                        <span className="text-sm text-red-600 dark:text-red-400">Disabled</span>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
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
              <span className="text-sm text-gray-900 dark:text-white">
                {loading ? '...' : `${securityStats.admin_accesses_today} today`}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Blocked IPs</span>
              <span className="text-sm text-gray-900 dark:text-white">
                {loading ? '...' : `${securityStats.blocked_ips} addresses`}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Suspicious Activities</span>
              <span className="text-sm text-gray-900 dark:text-white">
                {loading ? '...' : `${securityStats.suspicious_activities_7d} this week`}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Failed Logins (24h)</span>
              <span className={`text-sm ${securityStats.failed_logins_24h > 10 ? 'text-red-600 dark:text-red-400' : 'text-gray-900 dark:text-white'}`}>
                {loading ? '...' : `${securityStats.failed_logins_24h} attempts`}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Critical Events</span>
              <span className={`text-sm ${securityStats.critical_events > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}>
                {loading ? '...' : `${securityStats.critical_events} this month`}
              </span>
            </div>
            
            <button className="w-full mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              View Security Logs
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
          {securityEvents.map((event) => (
            <div key={event.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                    {getTypeIcon(event.event_type)}
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
                      {event.title}
                    </p>
                    
                    {event.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {event.description}
                      </p>
                    )}
                    
                    <div className="text-xs text-gray-500 dark:text-gray-400 space-x-4">
                      {event.user_email && <span>User: {event.user_email}</span>}
                      {event.ip_address && <span>IP: {event.ip_address}</span>}
                      <span>{formatDistanceToNow(new Date(event.created_at), { addSuffix: true })}</span>
                    </div>
                  </div>
                </div>
                
                {event.status === 'active' && (
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => handleEventAction(event.id, 'investigate')}
                      className="px-3 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200"
                    >
                      Investigate
                    </button>
                    <button 
                      onClick={() => handleEventAction(event.id, 'resolve')}
                      className="px-3 py-1 text-xs font-medium rounded bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-200"
                    >
                      Resolve
                    </button>
                    <button 
                      onClick={() => handleEventAction(event.id, 'dismiss')}
                      className="px-3 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200"
                    >
                      Dismiss
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {securityEvents.length === 0 && (
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