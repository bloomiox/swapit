'use client'

import React, { useState } from 'react'
import { X, EyeOff, Info } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'

interface DeactivateItemModalProps {
  isOpen: boolean
  onClose: () => void
  itemTitle: string
  onConfirmDeactivate: (reason: string) => Promise<void>
}

export function DeactivateItemModal({
  isOpen,
  onClose,
  itemTitle,
  onConfirmDeactivate
}: DeactivateItemModalProps) {
  const [reason, setReason] = useState('')
  const [isDeactivating, setIsDeactivating] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!reason.trim()) {
      setError('Please provide a reason for deactivating this item')
      return
    }

    if (reason.trim().length < 10) {
      setError('Please provide a more detailed reason (at least 10 characters)')
      return
    }

    try {
      setIsDeactivating(true)
      setError('')
      await onConfirmDeactivate(reason.trim())
      handleClose()
    } catch (error) {
      console.error('Error deactivating item:', error)
      setError('Failed to deactivate item. Please try again.')
    } finally {
      setIsDeactivating(false)
    }
  }

  const handleClose = () => {
    if (!isDeactivating) {
      setReason('')
      setError('')
      onClose()
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div 
        className="w-full max-w-md mx-auto p-6 rounded-3xl border"
        style={{
          backgroundColor: 'var(--bg-primary)',
          borderColor: 'var(--border-color)'
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#FEF3CD' }}
            >
              <EyeOff className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 
                className="text-h6 font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                Deactivate Item
              </h2>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isDeactivating}
            className="w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity disabled:opacity-50"
          >
            <X 
              className="w-5 h-5" 
              style={{ color: 'var(--text-primary)' }}
              strokeWidth={1.5}
            />
          </button>
        </div>

        {/* Info */}
        <div 
          className="flex items-start gap-3 p-4 rounded-2xl mb-6"
          style={{ backgroundColor: '#EBF8FF' }}
        >
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div>
            <p 
              className="text-body-small font-medium mb-1"
              style={{ color: '#1E40AF' }}
            >
              Item will be hidden from public view
            </p>
            <p 
              className="text-body-small"
              style={{ color: '#1E40AF' }}
            >
              "{itemTitle}" will no longer appear in search results or browse pages. You can reactivate it later from your profile.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label 
              htmlFor="deactivate-reason"
              className="block text-body-small-bold mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Reason for deactivation *
            </label>
            <textarea
              id="deactivate-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please explain why you're deactivating this item (e.g., temporarily unavailable, need to update details, etc.)"
              className="w-full h-24 px-4 py-3 rounded-2xl border resize-none text-body-small"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: error ? '#EF4444' : 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
              disabled={isDeactivating}
              maxLength={500}
            />
            <div className="flex justify-between items-center mt-1">
              {error && (
                <p className="text-caption text-red-500">{error}</p>
              )}
              <p 
                className="text-caption ml-auto"
                style={{ color: 'var(--text-secondary)' }}
              >
                {reason.length}/500
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outlined"
              size="default"
              onClick={handleClose}
              disabled={isDeactivating}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="default"
              disabled={isDeactivating || !reason.trim()}
              className="flex-1 bg-amber-500 hover:bg-amber-600 border-amber-500"
            >
              {isDeactivating ? 'Deactivating...' : 'Deactivate Item'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}