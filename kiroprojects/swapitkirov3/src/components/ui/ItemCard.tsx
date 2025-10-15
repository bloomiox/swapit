import { MapPin } from 'lucide-react'
import Link from 'next/link'

interface ItemCardProps {
  item: {
    id: string
    title: string
    location: string
    image: string
    isFree: boolean
  }
}

export function ItemCard({ item }: ItemCardProps) {
  return (
    <Link href={`/item/${item.id}`}>
      <div 
        className="flex flex-col w-full border rounded-2xl overflow-hidden hover:shadow-cards transition-shadow cursor-pointer"
        style={{ 
          backgroundColor: 'var(--bg-card)',
          borderColor: 'var(--border-color)'
        }}
      >
      {/* Image Container */}
      <div className="flex flex-col p-1">
        <div className="relative aspect-[170/220] rounded-xl overflow-hidden">
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-500 text-xs sm:text-sm">Image</span>
          </div>
          
          {/* Free Badge */}
          {item.isFree && (
            <div className="absolute top-1 right-1 bg-primary text-general-white px-2 py-1 rounded-full">
              <span className="text-caption-medium">FREE</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex items-center gap-2 sm:gap-4 p-2 sm:p-3">
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          {/* Location */}
          <div className="flex items-center gap-0.5">
            <MapPin className="w-3 h-3 flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />
            <span className="text-caption truncate" style={{ color: 'var(--text-secondary)' }}>
              {item.location}
            </span>
          </div>
          
          {/* Title */}
          <h3 className="text-body-small-bold line-clamp-2 min-h-[2.5rem] flex items-start" style={{ color: 'var(--text-primary)' }}>
            {item.title}
          </h3>
        </div>
      </div>
      </div>
    </Link>
  )
}