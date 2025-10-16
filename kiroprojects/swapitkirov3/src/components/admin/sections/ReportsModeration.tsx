'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  Flag, 
  User, 
  Package, 
  MessageSquare, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Ban,
  Trash2
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface ReportData {
  id: string
  reporter_id: string
  reported_id?: string
  reported_item_id?: string
  report_type: 'user' | 'item' | 'message'
  category: string
  description: string | null
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed'
  created_at: string
  updated_at: string
  reporter?: {
    full_name: string | null
    email: string
  }
  reported_user?: {
    full_name: string | null
    email: string
  }
  reported_item?: {
    title: string
  }
}

export function ReportsModeration() {
  const [reports, setReports] = useState<ReportData[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'reviewed' | 'resolved' | 'dismissed'>('all')
  const [filterType, setFilterType] = useState<'all' | 'user' | 'item' | 'message'>('all')

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      setLoading(true)
      
      const { data, error } = await supabase
        .from('user_reports')
        .select(`
          *,
          reporter:users!user_reports_reporter_id_fkey(full_name, email),
          reported_user:users!user_reports_reported_id_fkey(full_name, email),
          reported_item:items!user_reports_reported_item_id_fkey(title)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error

      setReports(data || [])
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredReports = reports.filter(report => {
    if (filterStatus !== 'all' && report.status !== filterStatus) return false
    if (filterType !== 'all' && report.report_type !== filterType) return false
    return true
  })

  const handleReportAction = async (action: string, reportId: string) => {
    try {
      const { error } = await supabase
        .from('user_reports')
        .update({ 
          status: action,
          updated_at: new Date().toISOString()
        })
        .eq('id', reportId)

      if (error) throw error

      // Update local state
      setReports(prev => prev.map(report => 
        report.id === reportId 
          ? { ...report, status: action as any, updated_at: new Date().toISOString() }
          : report
      ))
      
      console.log(`Report ${reportId} marked as ${action}`)
    } catch (error) {
      console.error('Error updating report:', error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'reviewed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'dismissed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'user':
        return <User className="w-4 h-4" />
      case 'item':
        return <Package className="w-4 h-4" />
      case 'message':
        return <MessageSquare className="w-4 h-4" />
      default:
        return <Flag className="w-4 h-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'fraud':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'inappropriate behavior':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'inappropriate content':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'spam':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Reports & Moderation
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Review and moderate user reports to maintain platform safety.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {reports.filter(r => r.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Reviewed</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {reports.filter(r => r.status === 'reviewed').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Resolved</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {reports.filter(r => r.status === 'resolved').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <XCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Dismissed</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white">
                {reports.filter(r => r.status === 'dismissed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Status:</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="reviewed">Reviewed</option>
              <option value="resolved">Resolved</option>
              <option value="dismissed">Dismissed</option>
            </select>
          </div>
          
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Type:</label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Types</option>
              <option value="user">User Reports</option>
              <option value="item">Item Reports</option>
              <option value="message">Message Reports</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredReports.map((report) => (
            <div key={report.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
                      {getTypeIcon(report.report_type)}
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCategoryColor(report.category)}`}>
                        {report.category}
                      </span>
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDistanceToNow(new Date(report.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    
                    <div className="mb-2">
                      <p className="text-sm text-gray-900 dark:text-white">
                        <span className="font-medium">Reporter:</span> {report.reporter?.full_name || report.reporter?.email}
                      </p>
                      <p className="text-sm text-gray-900 dark:text-white">
                        <span className="font-medium">Reported:</span>{' '}
                        {report.report_type === 'user' && report.reported_user && (
                          <span>{report.reported_user.full_name || report.reported_user.email}</span>
                        )}
                        {report.report_type === 'item' && report.reported_item && (
                          <span>Item: {report.reported_item.title}</span>
                        )}
                        {report.report_type === 'message' && (
                          <span>Message in conversation</span>
                        )}
                      </p>
                    </div>
                    
                    {report.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {report.description}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {report.status === 'pending' && (
                    <>
                      <button
                        onClick={() => handleReportAction('reviewed', report.id)}
                        className="px-3 py-1 text-xs font-medium rounded bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900 dark:text-blue-200"
                      >
                        Mark Reviewed
                      </button>
                      <button
                        onClick={() => handleReportAction('resolved', report.id)}
                        className="px-3 py-1 text-xs font-medium rounded bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-200"
                      >
                        Resolve
                      </button>
                      <button
                        onClick={() => handleReportAction('dismissed', report.id)}
                        className="px-3 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200"
                      >
                        Dismiss
                      </button>
                    </>
                  )}
                  
                  {report.status === 'reviewed' && (
                    <>
                      <button
                        onClick={() => handleReportAction('resolved', report.id)}
                        className="px-3 py-1 text-xs font-medium rounded bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900 dark:text-green-200"
                      >
                        Resolve
                      </button>
                      <button
                        onClick={() => handleReportAction('dismissed', report.id)}
                        className="px-3 py-1 text-xs font-medium rounded bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200"
                      >
                        Dismiss
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {filteredReports.length === 0 && (
          <div className="text-center py-8">
            <Flag className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No reports found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              No reports match your current filters.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}