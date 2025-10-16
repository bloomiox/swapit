'use client'

import React, { useState } from 'react'
import { X, Trash2, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'

interface DeleteItemModalProps {
  isOpen: boolean
  onClose: () => void
  itemTitle: string
  onConfirmDelete: (reason: string) => Promise<void>
}

export function DeleteItemModal({
  isOpen,
  onClose,
  itemTitle,
  onConfirmDelete
}: DeleteItemModalProps) {
  const [reason, setReason] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!reason.trim()) {
      setError('Please provide a reason for deleting this item')
      return
    }

    if (reason.trim().length < 10) {
      setError('Please provide a more detailed reason (at least 10 characters)')
      return
    }

    try {
      setIsDeleting(true)
      setError('')
      await onConfirmDelete(reason.trim())
      handleClose()
    } catch (error) {
      console.error('Error deleting item:', error)
      setError('Failed to delete item. Please try again.')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleClose = () => {
    if (!isDeleting) {
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
              style={{ backgroundColor: '#FEE2E2' }}
            >
              <Trash2 className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h2 
                className="text-h6 font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                Delete Item
              </h2>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isDeleting}
            className="w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity disabled:opacity-50"
          >
            <X 
              className="w-5 h-5" 
              style={{ color: 'var(--text-primary)' }}
              strokeWidth={1.5}
            />
          </button>
        </div>

        {/* Warning */}
        <div 
          className="flex items-start gap-3 p-4 rounded-2xl mb-6"
          style={{ backgroundColor: '#FEF3CD' }}
        >
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p 
              className="text-body-small font-medium mb-1"
              style={{ color: '#92400E' }}
            >
              This action cannot be undone
            </p>
            <p 
              className="text-body-small"
              style={{ color: '#92400E' }}
            >
              You are about to permanently delete "{itemTitle}". This will remove the item and all associated data.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label 
              htmlFor="delete-reason"
              className="block text-body-small-bold mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Reason for deletion *
            </label>
            <textarea
              id="delete-reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please explain why you're deleting this item (e.g., item sold elsewhere, no longer available, etc.)"
              className="w-full h-24 px-4 py-3 rounded-2xl border resize-none text-body-small"
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderColor: error ? '#EF4444' : 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
              disabled={isDeleting}
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
              disabled={isDeleting}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="default"
              disabled={isDeleting || !reason.trim()}
              className="flex-1 bg-red-500 hover:bg-red-600 border-red-500"
            >
              {isDeleting ? 'Deleting...' : 'Delete Item'}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  )
}