'use client'

import { Button } from '@/components/ui/Button'
import { ItemCard } from '@/components/ui/ItemCard'
import { useItems } from '@/hooks/useItems'
import Link from 'next/link'

export function FeaturedItems() {
  const { items, loading, error } = useItems()
  
  // Get featured items (first 8 items, prioritize boosted items)
  const featuredItems = items
    .sort((a, b) => {
      // Prioritize boosted items
      if (a.is_boosted && !b.is_boosted) return -1
      if (!a.is_boosted && b.is_boosted) return 1
      // Then by creation date (newest first)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
    .slice(0, 8)

  if (error) {
    return (
      <section 
        className="flex flex-col items-center gap-6 lg:gap-10 px-4 md:px-6 lg:px-[165px] py-section-mobile md:py-section-tablet lg:py-10"
        style={{ backgroundColor: 'var(--bg-secondary)' }}
      >
        <div className="text-center">
          <p className="text-body-large" style={{ color: 'var(--text-secondary)' }}>
            Unable to load featured items. Please try again later.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section 
      className="flex flex-col items-center gap-6 lg:gap-10 px-4 md:px-6 lg:px-[165px] py-section-mobile md:py-section-tablet lg:py-10"
      style={{ backgroundColor: 'var(--bg-secondary)' }}
    >
      {/* Section Header */}
      <div className="flex flex-col items-center gap-6 w-full">
        <div className="flex flex-col items-center gap-1 w-full text-center max-w-2xl">
          <h2 className="text-h2" style={{ color: 'var(--text-primary)' }}>
            Featured Items
          </h2>
          <p className="text-body-large" style={{ color: 'var(--text-secondary)' }}>
            Discover amazing items from our community
          </p>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 w-full">
          {Array(8).fill(0).map((_, i) => (
            <div key={i} className="aspect-[170/220] bg-gray-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full">
            {featuredItems.length > 0 ? (
              featuredItems.map((item) => (
                <ItemCard key={item.id} item={item} />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-body-large" style={{ color: 'var(--text-secondary)' }}>
                  No items available yet. Be the first to add an item!
                </p>
              </div>
            )}
          </div>

          {/* View All Button */}
          {featuredItems.length > 0 && (
            <Link href="/browse">
              <Button variant="primary" size="large" className="w-full sm:w-auto">
                View All Items
              </Button>
            </Link>
          )}
        </>
      )}
    </section>
  )
}