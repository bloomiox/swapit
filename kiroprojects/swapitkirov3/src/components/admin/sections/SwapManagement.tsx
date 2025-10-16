'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertTriangle,
  Eye,
  Filter,
  Search,
  RefreshCw,
  User,
  Package,
  Calendar,
  MapPin,
  ArrowRight,
  MoreHorizontal
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface SwapRequest {
  id: string
  requester_id: string
  owner_id: string
  requested_item_id: string
  offered_item_id: string | null
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled'
  message: string | null
  created_at: string
  updated_at: string
  completed_at: string | null
  requester: {
    full_name: string | null
    email: string
    avatar_url?: string | null
  }
  owner: {
    full_name: string | null
    email: string
    avatar_url?: string | null
  }
  requested_item: {
    title: string
    images: string[] | null
    location_name: string | null
  }
  offered_item?: {
    title: string
    images: string[] | null
    location_name: string | null
  } | null
}

export function SwapManagement() {
  const [swapRequests, setSwapRequests] = useState<SwapRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRequest, setSelectedRequest] = useState<SwapRequest | null>(null)
  const [showDetails, setShowDetails] = useState(false)

  useEffect(() => {
    fetchSwapRequests()
  }, [selectedStatus])

  const fetchSwapRequests = async () => {
    try {
      setLoading(true)
      
      let query = supabase
        .from('swap_requests')
        .select(`
          *,
          requester:users!swap_requests_requester_id_fkey(full_name, email, avatar_url),
          owner:users!swap_requests_owner_id_fkey(full_name, email, avatar_url),
          requested_item:items!swap_requests_requested_item_id_fkey(title, images, location_name),
          offered_item:items!swap_requests_offered_item_id_fkey(title, images, location_name)
        `)
        .order('created_at', { ascending: false })

      if (selectedStatus !== 'all') {
        query = query.eq('status', selectedStatus)
      }

      const { data, error } = await query

      if (error) throw error
      setSwapRequests(data || [])
    } catch (error) {
      console.error('Error fetching swap requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-gray-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full"
    switch (status) {
      case 'pending':
        return `${baseClasses} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200`
      case 'approved':
        return `${baseClasses} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200`
      case 'rejected':
        return `${baseClasses} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200`
      case 'completed':
        return `${baseClasses} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200`
      case 'cancelled':
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200`
      default:
        return `${baseClasses} bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200`
    }
  }

  const filteredRequests = swapRequests.filter(request => {
    const matchesStatus = selectedStatus === 'all' || request.status === selectedStatus
    const matchesSearch = searchTerm === '' || 
      (request.requester.full_name && request.requester.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      request.requester.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.owner.full_name && request.owner.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      request.owner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requested_item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.offered_item && request.offered_item.title.toLowerCase().includes(searchTerm.toLowerCase()))
    
    return matchesStatus && matchesSearch
  })

  const handleStatusChange = async (requestId: string, newStatus: string) => {
    try {
      const updateData: any = { 
        status: newStatus, 
        updated_at: new Date().toISOString() 
      }
      
      // If completing the swap, set completed_at
      if (newStatus === 'completed') {
        updateData.completed_at = new Date().toISOString()
      }

      const { error } = await supabase
        .from('swap_requests')
        .update(updateData)
        .eq('id', requestId)

      if (error) throw error

      // Update local state
      setSwapRequests(prev => 
        prev.map(req => 
          req.id === requestId 
            ? { ...req, ...updateData }
            : req
        )
      )
    } catch (error) {
      console.error('Error updating swap request:', error)
    }
  }



  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Swap Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and manage swap requests between users.
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Swap Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and manage swap requests between users.
          </p>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {filteredRequests.length} of {swapRequests.length} requests
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Pending', count: swapRequests.filter(r => r.status === 'pending').length, color: 'yellow' },
          { label: 'Approved', count: swapRequests.filter(r => r.status === 'approved').length, color: 'green' },
          { label: 'Completed', count: swapRequests.filter(r => r.status === 'completed').length, color: 'blue' },
          { label: 'Rejected', count: swapRequests.filter(r => r.status === 'rejected').length, color: 'red' }
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.count}</p>
              </div>
              <div className={`p-2 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900`}>
                {getStatusIcon(stat.label.toLowerCase())}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by user or item name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Swap Requests List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No swap requests found</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {searchTerm || selectedStatus !== 'all' ? 'Try adjusting your filters' : 'No swap requests have been made yet'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredRequests.map((request) => (
              <div key={request.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-2">
                        {request.requester.avatar_url ? (
                          <img
                            src={request.requester.avatar_url}
                            alt={request.requester.full_name || request.requester.email}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {request.requester.full_name || 'No name'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {request.requester.email}
                          </p>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                      <div className="flex items-center gap-2">
                        {request.owner.avatar_url ? (
                          <img
                            src={request.owner.avatar_url}
                            alt={request.owner.full_name || request.owner.email}
                            className="w-8 h-8 rounded-full"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                            <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {request.owner.full_name || 'No name'}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {request.owner.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mb-4">
                      {request.offered_item ? (
                        <div className="flex items-center gap-3">
                          {request.offered_item.images && request.offered_item.images.length > 0 ? (
                            <img
                              src={request.offered_item.images[0]}
                              alt={request.offered_item.title}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-lg bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                              <Package className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              {request.offered_item.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Offered • {request.offered_item.location_name || 'No location'}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                            <Package className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              No item offered
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Direct request
                            </p>
                          </div>
                        </div>
                      )}
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                      <div className="flex items-center gap-3">
                        {request.requested_item.images && request.requested_item.images.length > 0 ? (
                          <img
                            src={request.requested_item.images[0]}
                            alt={request.requested_item.title}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                            <Package className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {request.requested_item.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            Requested • {request.requested_item.location_name || 'No location'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {request.message && (
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 mb-4">
                        <p className="text-sm text-gray-700 dark:text-gray-300">
                          "{request.message}"
                        </p>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                      </div>
                      {request.updated_at !== request.created_at && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Updated {formatDistanceToNow(new Date(request.updated_at), { addSuffix: true })}
                        </div>
                      )}
                      {request.completed_at && (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Completed {formatDistanceToNow(new Date(request.completed_at), { addSuffix: true })}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className={getStatusBadge(request.status)}>
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                    
                    {request.status === 'pending' && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleStatusChange(request.id, 'approved')}
                          className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900 rounded-lg transition-colors"
                          title="Approve"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleStatusChange(request.id, 'rejected')}
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                          title="Reject"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                    
                    <button
                      onClick={() => {
                        setSelectedRequest(request)
                        setShowDetails(true)
                      }}
                      className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Details Modal */}
      {showDetails && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Swap Request Details
                </h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <span className={getStatusBadge(selectedRequest.status)}>
                  {selectedRequest.status.charAt(0).toUpperCase() + selectedRequest.status.slice(1)}
                </span>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  ID: {selectedRequest.id}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Requester</h4>
                  <div className="flex items-center gap-3">
                    {selectedRequest.requester.avatar_url ? (
                      <img
                        src={selectedRequest.requester.avatar_url}
                        alt={selectedRequest.requester.full_name || selectedRequest.requester.email}
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedRequest.requester.full_name || 'No name'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedRequest.requester.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Owner</h4>
                  <div className="flex items-center gap-3">
                    {selectedRequest.owner.avatar_url ? (
                      <img
                        src={selectedRequest.owner.avatar_url}
                        alt={selectedRequest.owner.full_name || selectedRequest.owner.email}
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                        <User className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedRequest.owner.full_name || 'No name'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedRequest.owner.email}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Items</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedRequest.offered_item ? (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Offered</p>
                      <div className="flex items-center gap-3">
                        {selectedRequest.offered_item.images && selectedRequest.offered_item.images.length > 0 ? (
                          <img
                            src={selectedRequest.offered_item.images[0]}
                            alt={selectedRequest.offered_item.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-lg bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                            <Package className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {selectedRequest.offered_item.title}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {selectedRequest.offered_item.location_name || 'No location'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Offered</p>
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-16 rounded-lg bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            No item offered
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Direct request
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">Requested</p>
                    <div className="flex items-center gap-3">
                      {selectedRequest.requested_item.images && selectedRequest.requested_item.images.length > 0 ? (
                        <img
                          src={selectedRequest.requested_item.images[0]}
                          alt={selectedRequest.requested_item.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-lg bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                          <Package className="w-8 h-8 text-gray-500 dark:text-gray-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">
                          {selectedRequest.requested_item.title}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {selectedRequest.requested_item.location_name || 'No location'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {selectedRequest.message && (
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Message</h4>
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <p className="text-gray-700 dark:text-gray-300">
                      {selectedRequest.message}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Created</p>
                  <p className="text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(new Date(selectedRequest.created_at), { addSuffix: true })}
                  </p>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Last Updated</p>
                  <p className="text-gray-500 dark:text-gray-400">
                    {formatDistanceToNow(new Date(selectedRequest.updated_at), { addSuffix: true })}
                  </p>
                </div>
                {selectedRequest.completed_at && (
                  <div className="col-span-2">
                    <p className="font-medium text-gray-900 dark:text-white">Completed</p>
                    <p className="text-gray-500 dark:text-gray-400">
                      {formatDistanceToNow(new Date(selectedRequest.completed_at), { addSuffix: true })}
                    </p>
                  </div>
                )}
              </div>

              {selectedRequest.status === 'pending' && (
                <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => {
                      handleStatusChange(selectedRequest.id, 'approved')
                      setShowDetails(false)
                    }}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Approve Swap
                  </button>
                  <button
                    onClick={() => {
                      handleStatusChange(selectedRequest.id, 'rejected')
                      setShowDetails(false)
                    }}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Reject Swap
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}