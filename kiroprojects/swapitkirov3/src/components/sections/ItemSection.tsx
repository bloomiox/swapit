'use client'

import React from 'react'
import Link from 'next/link'
import { ItemCard } from '@/components/ui/ItemCard'
import { Button } from '@/components/ui/Button'
import { ArrowRight } from 'lucide-react'
import { Item } from '@/hooks/useItems'

interface ItemSectionProps {
  title: string
  description: string
  items: Item[]
  loading: boolean
  error: string | null
  showViewAll?: boolean
  viewAllHref?: string
  viewAllText?: string
  emptyMessage?: string
  className?: string
}

export function ItemSection({
  title,
  description,
  items,
  loading,
  error,
  showViewAll = true,
  viewAllHref = '/browse',
  viewAllText = 'View All',
  emptyMessage = 'No items available yet.',
  className = ''
}: ItemSectionProps) {
  if (error) {
    return (
      <section className={`py-8 ${className}`}>
        <div className="px-4 md:px-6 lg:px-[165px]">
          <div className="text-center">
            <p className="text-body-large" style={{ color: 'var(--text-secondary)' }}>
              Unable to load {title.toLowerCase()}. Please try again later.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className={`py-8 ${className}`}>
      <div className="px-4 md:px-6 lg:px-[165px]">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex-1">
            <h2 
              className="text-h4 font-bold mb-2"
              style={{ color: 'var(--text-primary)' }}
            >
              {title}
            </h2>
            <p 
              className="text-body-normal"
              style={{ color: 'var(--text-secondary)' }}
            >
              {description}
            </p>
          </div>
          
          {showViewAll && items.length > 0 && (
            <Link href={viewAllHref}>
              <Button 
                variant="outlined" 
                size="default"
                className="flex items-center gap-2 hover:gap-3 transition-all"
              >
                {viewAllText}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          )}
        </div>

        {/* Items Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="aspect-[170/220] bg-gray-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : emptyMessage ? (
          <div className="text-center py-12">
            <p className="text-body-large" style={{ color: 'var(--text-secondary)' }}>
              {emptyMessage}
            </p>
          </div>
        ) : null}
      </div>
    </section>
  )
}