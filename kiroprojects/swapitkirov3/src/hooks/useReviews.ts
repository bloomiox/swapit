'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'

export interface Review {
  id: string
  swap_request_id: string
  reviewer_id: string
  reviewee_id: string
  rating: number
  comment: string | null
  created_at: string
  // Joined data
  reviewer: {
    id: string
    full_name: string | null
    avatar_url: string | null
  }
  reviewee: {
    id: string
    full_name: string | null
    avatar_url: string | null
  }
  swap_request: {
    id: string
    requested_item: {
      id: string
      title: string
      images: string[]
    }
    offered_item: {
      id: string
      title: string
      images: string[]
    } | null
  }
}

export interface CreateReviewData {
  swap_request_id: string
  reviewee_id: string
  rating: number
  comment?: string
}

// Hook for fetching reviews for a specific user
export function useUserReviews(userId: string) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReviews = async () => {
    if (!userId) {
      setReviews([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          reviewer:users!reviews_reviewer_id_fkey(
            id,
            full_name,
            avatar_url
          ),
          reviewee:users!reviews_reviewee_id_fkey(
            id,
            full_name,
            avatar_url
          ),
          swap_request:swap_requests(
            id,
            requested_item:items!swap_requests_requested_item_id_fkey(
              id,
              title,
              images
            ),
            offered_item:items!swap_requests_offered_item_id_fkey(
              id,
              title,
              images
            )
          )
        `)
        .eq('reviewee_id', userId)
        .order('created_at', { ascending: false })

      if (error) throw error

      setReviews(data || [])
    } catch (err) {
      console.error('Error fetching user reviews:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch reviews')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [userId])

  return {
    reviews,
    loading,
    error,
    refetch: fetchReviews
  }
}

// Hook for fetching reviews written by current user
export function useMyReviews() {
  const { user } = useAuth()
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchReviews = async () => {
    if (!user) {
      setReviews([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          reviewer:users!reviews_reviewer_id_fkey(
            id,
            full_name,
            avatar_url
          ),
          reviewee:users!reviews_reviewee_id_fkey(
            id,
            full_name,
            avatar_url
          ),
          swap_request:swap_requests(
            id,
            requested_item:items!swap_requests_requested_item_id_fkey(
              id,
              title,
              images
            ),
            offered_item:items!swap_requests_offered_item_id_fkey(
              id,
              title,
              images
            )
          )
        `)
        .eq('reviewer_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setReviews(data || [])
    } catch (err) {
      console.error('Error fetching my reviews:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch reviews')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [user])

  return {
    reviews,
    loading,
    error,
    refetch: fetchReviews
  }
}

// Hook for review actions
export function useReviewActions() {
  const { user } = useAuth()

  const createReview = async (data: CreateReviewData) => {
    if (!user) throw new Error('User not authenticated')

    // Get reviewer's name for the notification
    const { data: reviewerData } = await supabase
      .from('users')
      .select('full_name')
      .eq('id', user.id)
      .single()

    const reviewerName = reviewerData?.full_name || 'Someone'

    const { error } = await supabase
      .from('reviews')
      .insert({
        swap_request_id: data.swap_request_id,
        reviewer_id: user.id,
        reviewee_id: data.reviewee_id,
        rating: data.rating,
        comment: data.comment || null
      })

    if (error) {
      console.error('Failed to create review:', error)
      throw error
    }

    // Create a notification for the reviewee
    try {
      const { error: notificationError } = await supabase
        .from('notifications')
        .insert({
          user_id: data.reviewee_id,
          type: 'review',
          title: 'New Review Received',
          message: `${reviewerName} left you a ${data.rating}-star review for your recent swap.`,
          data: { 
            review_rating: data.rating, 
            swap_request_id: data.swap_request_id,
            reviewer_id: user.id,
            reviewer_name: reviewerName
          }
        })

      if (notificationError) {
        console.error('Failed to create review notification:', notificationError)
        // Don't throw here as the review was created successfully
      }
    } catch (notificationError) {
      console.error('Failed to create review notification:', notificationError)
      // Don't throw here as the review was created successfully
    }
  }

  const updateReview = async (reviewId: string, updates: Partial<CreateReviewData>) => {
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('reviews')
      .update({
        rating: updates.rating,
        comment: updates.comment || null
      })
      .eq('id', reviewId)
      .eq('reviewer_id', user.id) // Ensure user owns the review

    if (error) throw error
  }

  const deleteReview = async (reviewId: string) => {
    if (!user) throw new Error('User not authenticated')

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId)
      .eq('reviewer_id', user.id) // Ensure user owns the review

    if (error) throw error
  }

  const checkIfReviewExists = async (swapRequestId: string): Promise<boolean> => {
    if (!user) return false

    const { data, error } = await supabase
      .from('reviews')
      .select('id')
      .eq('swap_request_id', swapRequestId)
      .eq('reviewer_id', user.id)
      .single()

    return !error && !!data
  }

  return {
    createReview,
    updateReview,
    deleteReview,
    checkIfReviewExists
  }
}

// Hook for getting review statistics for a user
export function useReviewStats(userId: string) {
  const [stats, setStats] = useState<{
    total_reviews: number
    average_rating: number
    rating_distribution: { [key: number]: number }
  }>({
    total_reviews: 0,
    average_rating: 0,
    rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    if (!userId) {
      setStats({
        total_reviews: 0,
        average_rating: 0,
        rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      })
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('reviews')
        .select('rating')
        .eq('reviewee_id', userId)

      if (error) throw error

      const reviews = data || []
      const totalReviews = reviews.length
      
      if (totalReviews === 0) {
        setStats({
          total_reviews: 0,
          average_rating: 0,
          rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        })
      } else {
        const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
        const averageRating = totalRating / totalReviews

        const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        reviews.forEach(review => {
          ratingDistribution[review.rating as keyof typeof ratingDistribution]++
        })

        setStats({
          total_reviews: totalReviews,
          average_rating: averageRating,
          rating_distribution: ratingDistribution
        })
      }
    } catch (err) {
      console.error('Error fetching review stats:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch review stats')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [userId])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  }
}

// Hook for getting pending reviews (accepted swaps that need reviews)
export function usePendingReviews() {
  const { user } = useAuth()
  const [pendingReviews, setPendingReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPendingReviews = async () => {
    if (!user) {
      setPendingReviews([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Get accepted swap requests where user is involved
      const { data: swapData, error: swapError } = await supabase
        .from('swap_requests')
        .select(`
          id,
          requester_id,
          owner_id,
          status,
          created_at,
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
            images
          ),
          offered_item:items!swap_requests_offered_item_id_fkey(
            id,
            title,
            images
          )
        `)
        .eq('status', 'accepted')
        .or(`requester_id.eq.${user.id},owner_id.eq.${user.id}`)

      if (swapError) throw swapError

      // Get all reviews by current user
      const { data: userReviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('swap_request_id')
        .eq('reviewer_id', user.id)

      if (reviewsError) throw reviewsError

      const reviewedSwapIds = new Set(userReviews?.map(r => r.swap_request_id) || [])

      // Filter out swaps where user has already left a review
      const pendingReviewsData = (swapData || [])
        .filter(swap => !reviewedSwapIds.has(swap.id))
        .map(swap => {
          // Determine who the user should review (the other party)
          const revieweeId = swap.requester_id === user.id ? swap.owner_id : swap.requester_id
          
          return {
            ...swap,
            reviewee_id: revieweeId,
            reviewee: swap.requester_id === user.id ? swap.owner : swap.requester
          }
        })

      setPendingReviews(pendingReviewsData)
    } catch (err) {
      console.error('Error fetching pending reviews:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch pending reviews')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPendingReviews()
  }, [user])

  return {
    pendingReviews,
    loading,
    error,
    refetch: fetchPendingReviews
  }
}