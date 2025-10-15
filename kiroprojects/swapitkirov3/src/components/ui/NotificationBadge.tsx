'use client'

import React from 'react'

interface NotificationBadgeProps {
  count: number
  maxCount?: number
  className?: string
  size?: 'small' | 'medium'
  color?: 'red' | 'blue' | 'green'
}

export function NotificationBadge({ 
  count, 
  maxCount = 99, 
  className = '',
  size = 'medium',
  color = 'red'
}: NotificationBadgeProps) {
  // Don't render if count is 0 or negative
  if (!count || count <= 0) return null

  const sizeClasses = {
    small: 'w-3 h-3 text-xs min-w-[12px]',
    medium: 'w-4 h-4 text-xs min-w-[16px]'
  }

  const colorClasses = {
    red: 'bg-red-500',
    blue: 'bg-blue-500', 
    green: 'bg-green-500'
  }

  const displayCount = count > maxCount ? `${maxCount}+` : count.toString()

  return (
    <div 
      className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full flex items-center justify-center ${className}`}
      style={{ 
        minWidth: size === 'small' ? '12px' : '16px',
        height: size === 'small' ? '12px' : '16px'
      }}
    >
      <span className="text-white font-medium leading-none text-center">
        {displayCount}
      </span>
    </div>
  )
}