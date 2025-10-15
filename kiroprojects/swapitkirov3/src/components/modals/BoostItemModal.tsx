'use client'

import React, { useState } from 'react'
import { CreditCard, Lock } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'

interface BoostItemModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
  itemTitle?: string
}

interface PaymentData {
  duration: '1' | '3' | '5'
  cardNumber: string
  expiry: string
  cvc: string
}

const boostOptions = [
  { duration: '1', days: '1 Day', price: 2.99, popular: false },
  { duration: '3', days: '3 Days', price: 6.99, popular: true },
  { duration: '5', days: '5 Days', price: 9.99, popular: false }
] as const

export function BoostItemModal({ 
  isOpen, 
  onClose, 
  onSuccess,
  itemTitle = "Your Item"
}: BoostItemModalProps) {
  const [paymentData, setPaymentData] = useState<PaymentData>({
    duration: '3',
    cardNumber: '',
    expiry: '',
    cvc: ''
  })

  const selectedOption = boostOptions.find(option => option.duration === paymentData.duration)!

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!paymentData.cardNumber.trim()) {
      alert('Please enter your card number')
      return
    }
    
    if (!paymentData.expiry.trim()) {
      alert('Please enter expiry date')
      return
    }
    
    if (!paymentData.cvc.trim()) {
      alert('Please enter CVC')
      return
    }
    
    console.log('Boost payment submitted:', paymentData)
    
    // Simulate payment processing
    setTimeout(() => {
      onSuccess?.()
      onClose()
      alert(`Item boosted for ${selectedOption.days}! Your item will appear at the top of search results.`)
    }, 1000)
  }

  const formatCardNumber = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '')
    // Add spaces every 4 digits
    return digits.replace(/(\d{4})(?=\d)/g, '$1 ')
  }

  const formatExpiry = (value: string) => {
    // Remove all non-digits
    const digits = value.replace(/\D/g, '')
    // Add slash after 2 digits
    if (digits.length >= 2) {
      return digits.slice(0, 2) + ' / ' + digits.slice(2, 4)
    }
    return digits
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="w-full max-w-[600px] mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 
            className="text-h4 font-bold mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            Boost Item
          </h2>
          <p 
            className="text-body-normal"
            style={{ color: 'var(--text-secondary)' }}
          >
            Get more visibility and appear at the top of search results
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Duration Selection */}
          <div>
            <label 
              className="text-body-normal font-bold block mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Select Duration
            </label>
            <div className="grid grid-cols-3 gap-1">
              {boostOptions.map((option) => (
                <button
                  key={option.duration}
                  type="button"
                  onClick={() => setPaymentData(prev => ({ ...prev, duration: option.duration }))}
                  className={`relative p-6 rounded-2xl border text-center transition-colors ${
                    paymentData.duration === option.duration 
                      ? 'border-primary-dark' 
                      : 'border-general-stroke'
                  }`}
                  style={{
                    backgroundColor: paymentData.duration === option.duration ? '#D8F7D7' : 'var(--bg-primary)',
                    borderColor: paymentData.duration === option.duration ? '#416B40' : 'var(--border-color)'
                  }}
                >
                  {option.popular && (
                    <div 
                      className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-2 py-1 rounded-full"
                      style={{ backgroundColor: '#119C21' }}
                    >
                      <span className="text-caption-medium text-white">
                        Popular
                      </span>
                    </div>
                  )}
                  <div 
                    className="text-body-normal font-medium mb-2"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {option.days}
                  </div>
                  <div 
                    className="text-h5 font-bold"
                    style={{ 
                      color: paymentData.duration === option.duration ? '#416B40' : 'var(--text-primary)' 
                    }}
                  >
                    ${option.price}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Card Number */}
          <div>
            <label 
              className="text-body-normal font-bold block mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              Card Number
            </label>
            <div className="relative">
              <input
                type="text"
                value={paymentData.cardNumber}
                onChange={(e) => setPaymentData(prev => ({ 
                  ...prev, 
                  cardNumber: formatCardNumber(e.target.value) 
                }))}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className="w-full p-3 pl-12 rounded-2xl border"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
                required
              />
              <CreditCard 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" 
                style={{ color: 'var(--text-secondary)' }}
                strokeWidth={1.5}
              />
            </div>
          </div>

          {/* Expiry and CVC */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label 
                className="text-body-normal font-bold block mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                Expiry
              </label>
              <input
                type="text"
                value={paymentData.expiry}
                onChange={(e) => setPaymentData(prev => ({ 
                  ...prev, 
                  expiry: formatExpiry(e.target.value) 
                }))}
                placeholder="MM / YY"
                maxLength={7}
                className="w-full p-3 rounded-2xl border"
                style={{
                  backgroundColor: 'var(--bg-primary)',
                  borderColor: 'var(--border-color)',
                  color: 'var(--text-primary)'
                }}
                required
              />
            </div>
            <div>
              <label 
                className="text-body-normal font-bold block mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                CVC
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={paymentData.cvc}
                  onChange={(e) => setPaymentData(prev => ({ 
                    ...prev, 
                    cvc: e.target.value.replace(/\D/g, '').slice(0, 4) 
                  }))}
                  placeholder="123"
                  maxLength={4}
                  className="w-full p-3 pr-12 rounded-2xl border"
                  style={{
                    backgroundColor: 'var(--bg-primary)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                  required
                />
                <Lock 
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4" 
                  style={{ color: 'var(--text-secondary)' }}
                  strokeWidth={1.5}
                />
              </div>
            </div>
          </div>

          {/* Security Notice */}
          <div 
            className="flex items-center gap-2 p-3 rounded-xl border"
            style={{ 
              backgroundColor: 'var(--bg-primary)',
              borderColor: 'var(--border-color)'
            }}
          >
            <Lock 
              className="w-4 h-4 flex-shrink-0" 
              style={{ color: 'var(--text-secondary)' }}
              strokeWidth={1.5}
            />
            <p 
              className="text-body-small"
              style={{ color: 'var(--text-secondary)' }}
            >
              Your payment information is secure and encrypted
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="primary"
            size="large"
            className="w-full"
            disabled={
              !paymentData.cardNumber.trim() || 
              !paymentData.expiry.trim() || 
              !paymentData.cvc.trim()
            }
          >
            Pay ${selectedOption.price}
          </Button>
        </form>
      </div>
    </Modal>
  )
}