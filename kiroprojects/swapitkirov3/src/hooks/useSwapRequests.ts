'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export interface SwapRequest {
  id: string
  requester_id: string
  owner_id: string
  requested_item_id: string
  offered_item_id: string | null
  message: string | null
  status: 'pending' | 'accepted' | 'rejected' | 'completed' | 'cancelled'
  is_claim_request: boolean
  meetup_location: string | null
  meetup_coordinates: any | null
  meetup_time: string | null
  created_at: string
  updated_at: string
  completed_at: string | null
  // Joined data
  requester: {
    id: string
    full_name: string | null
    avatar_url: string | null
  }
  owner: {
    id: string
    full_name: string | null
    avatar_url: string | null
  }
  requested_item: {
    id: string
    title: string
    images: string[]
    is_free: boolean
  }
  offered_item: {
    id: string
    title: string
    images: string[]
  } | null
}

export interface CreateSwapRequestData {
  requested_item_id: string
  offered_item_id?: string
  message?: string
  is_claim_request?: boolean
}

// Hook for fetching received swap requests (requests for current user's items)
export function useReceivedSwapRequests() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<SwapRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRequests = async () => {
    if (!user) {
      setRequests([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('swap_requests')
        .select(`
          *,
          requester:users!swap_requests_requester_id_fkey(
            id,
            full_name,
            avatar_url
          ),
          owner:users!swap_requests_owner_id_fkey(
            id,
            full_name,
            avatar_url
          ),
          requested_item:items!swap_requests_requested_item_id_fkey(
            id,
            title,
            images,
            is_free
          ),
          offered_item:items!swap_requests_offered_item_id_fkey(
            id,
            title,
            images
          )
        `)
        .eq('owner_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setRequests(data || [])
    } catch (err) {
      console.error('Error fetching received swap requests:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [user])

  return {
    requests,
    loading,
    error,
    refetch: fetchRequests
  }
}

// Hook for fetching sent swap requests (requests current user has made)
export function useSentSwapRequests() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<SwapRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRequests = async () => {
    if (!user) {
      setRequests([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('swap_requests')
        .select(`
          *,
          requester:users!swap_requests_requester_id_fkey(
            id,
            full_name,
            avatar_url
          ),
          owner:users!swap_requests_owner_id_fkey(
            id,
            full_name,
            avatar_url
          ),
          requested_item:items!swap_requests_requested_item_id_fkey(
            id,
            title,
            images,
            is_free
          ),
          offered_item:items!swap_requests_offered_item_id_fkey(
            id,
            title,
            images
          )
        `)
        .eq('requester_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setRequests(data || [])
    } catch (err) {
      console.error('Error fetching sent swap requests:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [user])

  return {
    requests,
    loading,
    error,
    refetch: fetchRequests
  }
}

// Hook for swap request actions
export function useSwapRequestActions() {
  const { user } = useAuth()

  const createSwapRequest = async (data: CreateSwapRequestData) => {
    if (!user) throw new Error('User not authenticated')

    // First, get the owner of the requested item
    const { data: itemData, error: itemError } = await supabase
      .from('items')
      .select('user_id, is_free')
      .eq('id', data.requested_item_id)
      .single()

    if (itemError) throw itemError
    if (!itemData) throw new Error('Item not found')

    // Determine if this is a claim request (for free items)
    const isClaimRequest = data.is_claim_request || itemData.is_free

    const { error } = await supabase
      .from('swap_requests')
      .insert({
        requester_id: user.id,
        owner_id: itemData.user_id,
        requested_item_id: data.requested_item_id,
        offered_item_id: data.offered_item_id || null,
        message: data.message || null,
        is_claim_request: isClaimRequest
      })

    if (error) throw error
  }

  const acceptSwapRequest = async (requestId: string) => {
    if (!user) throw new Error('User not authenticated')

    // First, get the swap request details to know which items to deactivate
    const { data: swapRequest, error: fetchError } = await supabase
      .from('swap_requests')
      .select(`
        requested_item_id, 
        offered_item_id, 
        is_claim_request,
        requester_id,
        requested_item:items!swap_requests_requested_item_id_fkey(title),
        offered_item:items!swap_requests_offered_item_id_fkey(title)
      `)
      .eq('id', requestId)
      .eq('owner_id', user.id)
      .single()

    if (fetchError) throw fetchError
    if (!swapRequest) throw new Error('Swap request not found')

    // Start a transaction to update both the request and items
    const { error } = await supabase.rpc('accept_swap_request', {
      request_id: requestId,
      requested_item_id: swapRequest.requested_item_id,
      offered_item_id: swapRequest.offered_item_id,
      is_claim_request: swapRequest.is_claim_request
    })

    if (error) {
      // Fallback to manual updates if RPC doesn't exist
      console.warn('RPC function not found, using manual updates')
      
      // Update swap request status
      const { error: updateError } = await supabase
        .from('swap_requests')
        .update({ 
          status: 'accepted',
          updated_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .eq('owner_id', user.id)

      if (updateError) throw updateError

      // Deactivate the requested item (owner's item)
      const { error: deactivateRequestedError } = await supabase
        .from('items')
        .update({ 
          is_available: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', swapRequest.requested_item_id)

      if (deactivateRequestedError) throw deactivateRequestedError

      // Deactivate the offered item (if it exists - not for claim requests)
      if (swapRequest.offered_item_id && !swapRequest.is_claim_request) {
        const { error: deactivateOfferedError } = await supabase
          .from('items')
          .update({ 
            is_available: false,
            updated_at: new Date().toISOString()
          })
          .eq('id', swapRequest.offered_item_id)

        if (deactivateOfferedError) throw deactivateOfferedError
      }
    }

    // Create notifications for both parties
    try {
      // Notify the requester that their request was accepted
      await supabase
        .from('notifications')
        .insert({
          user_id: swapRequest.requester_id,
          type: 'swap_request',
          title: 'Swap Request Accepted!',
          message: `Your ${swapRequest.is_claim_request ? 'claim' : 'swap'} request for "${swapRequest.requested_item?.title}" has been accepted.`,
          data: { swap_request_id: requestId }
        })

      // Notify the owner that their item has been deactivated
      await supabase
        .from('notifications')
        .insert({
          user_id: user.id,
          type: 'system',
          title: 'Item Deactivated',
          message: `Your item "${swapRequest.requested_item?.title}" has been deactivated due to an accepted ${swapRequest.is_claim_request ? 'claim' : 'swap'} request.`,
          data: { item_id: swapRequest.requested_item_id }
        })
    } catch (notificationError) {
      console.warn('Failed to create notifications:', notificationError)
      // Don't throw here as the main operation succeeded
    }
  }

  const rejectSwapRequest = async (requestId: string) => {
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('swap_requests')
      .update({ 
        status: 'rejected',
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId)
      .eq('owner_id', user.id) // Ensure user owns the requested item

    if (error) throw error
  }

  const cancelSwapRequest = async (requestId: string) => {
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('swap_requests')
      .update({ 
        status: 'cancelled',
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId)
      .eq('requester_id', user.id) // Ensure user made the request

    if (error) throw error
  }

  const completeSwapRequest = async (requestId: string) => {
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('swap_requests')
      .update({ 
        status: 'completed',
        completed_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('id', requestId)

    if (error) throw error
  }

  return {
    createSwapRequest,
    acceptSwapRequest,
    rejectSwapRequest,
    cancelSwapRequest,
    completeSwapRequest
  }
}

// Hook for dropzone requests (free items)
export function useDropzoneRequests() {
  const { user } = useAuth()
  const [requests, setRequests] = useState<SwapRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRequests = async () => {
    if (!user) {
      setRequests([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('swap_requests')
        .select(`
          *,
          requester:users!swap_requests_requester_id_fkey(
            id,
            full_name,
            avatar_url
          ),
          owner:users!swap_requests_owner_id_fkey(
            id,
            full_name,
            avatar_url
          ),
          requested_item:items!swap_requests_requested_item_id_fkey(
            id,
            title,
            images,
            is_free
          )
        `)
        .eq('requester_id', user.id)
        .eq('is_claim_request', true)
        .order('created_at', { ascending: false })

      if (error) throw error

      setRequests(data || [])
    } catch (err) {
      console.error('Error fetching dropzone requests:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [user])

  return {
    requests,
    loading,
    error,
    refetch: fetchRequests
  }
}