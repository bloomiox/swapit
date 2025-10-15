'use client'

import React, { useState } from 'react'
import { X, AlertTriangle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface ReportUserModalProps {
  isOpen: boolean
  onClose: () => void
  reportedUser: {
    name: string
    initials: string
  }
  onSubmitReport: (report: {
    reason: string
    description: string
    blockUser: boolean
  }) => void
}

const reportReasons = [
  { id: 'inappropriate', label: 'Inappropriate Behavior' },
  { id: 'fraud', label: 'Fraud or Scam' },
  { id: 'spam', label: 'Spam or Fake Listings' },
  { id: 'harassment', label: 'Harassment' },
  { id: 'other', label: 'Other' }
]

export function ReportUserModal({ 
  isOpen, 
  onClose, 
  reportedUser,
  onSubmitReport 
}: ReportUserModalProps) {
  const [selectedReason, setSelectedReason] = useState('')
  const [description, setDescription] = useState('')
  const [blockUser, setBlockUser] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedReason) return
    
    onSubmitReport({
      reason: selectedReason,
      description: description.trim(),
      blockUser
    })
    
    // Reset form
    setSelectedReason('')
    setDescription('')
    setBlockUser(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div 
        className="relative w-full max-w-[500px] max-h-[95vh] overflow-y-auto rounded-3xl p-6"
        style={{ 
          backgroundColor: 'var(--bg-card)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity z-10"
        >
          <X className="w-4 h-4" style={{ color: 'var(--text-primary)' }} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          <h2 
            className="text-h4 font-bold mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            Report User
          </h2>
          <p 
            className="text-body-medium"
            style={{ color: 'var(--text-secondary)' }}
          >
            Help us keep SwapIt safe by reporting {reportedUser.name}
          </p>
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl" style={{ backgroundColor: 'var(--bg-secondary)' }}>
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center text-body-medium font-bold"
            style={{ 
              backgroundColor: '#D8F7D7',
              color: '#119C21'
            }}
          >
            {reportedUser.initials}
          </div>
          <div>
            <div 
              className="text-body-medium font-semibold"
              style={{ color: 'var(--text-primary)' }}
            >
              {reportedUser.name}
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Reason Selection */}
          <div className="mb-6">
            <label 
              className="text-body-medium font-semibold block mb-3"
              style={{ color: 'var(--text-primary)' }}
            >
              Reason for reporting *
            </label>
            <div className="space-y-2">
              {reportReasons.map((reason) => (
                <label
                  key={reason.id}
                  className="flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors hover:bg-gray-50"
                  style={{ borderColor: 'var(--border-color)' }}
                >
                  <input
                    type="radio"
                    name="reason"
                    value={reason.id}
                    checked={selectedReason === reason.id}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="w-4 h-4 text-primary"
                  />
                  <span 
                    className="text-body-medium"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {reason.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label 
              className="text-body-medium font-semibold block mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Additional Details (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-2xl border text-body-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 resize-none"
              style={{ 
                backgroundColor: 'var(--bg-input)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
              placeholder="Please provide more details about the issue..."
              maxLength={500}
            />
          </div>

          {/* Block User Option */}
          <div className="mb-6">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={blockUser}
                onChange={(e) => setBlockUser(e.target.checked)}
                className="w-4 h-4 mt-1 text-primary"
              />
              <div>
                <div 
                  className="text-body-medium font-semibold"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Block this user
                </div>
                <div 
                  className="text-body-small"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  You won't see their items or receive messages from them
                </div>
              </div>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button 
              type="button"
              variant="outlined" 
              size="large" 
              className="flex-1"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              variant="primary" 
              size="large" 
              className="flex-1 bg-red-600 hover:bg-red-700"
              disabled={!selectedReason}
            >
              Submit Report
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}