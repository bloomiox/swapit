import { MapPin, Eye, Star, User, Calendar, TrendingUp, Zap } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { Item } from '@/hooks/useItems'


interface ItemCardProps {
  item: Item | {
    id: string
    title: string
    location: string
    image: string
    isFree: boolean
  }
}

const conditionLabels = {
  like_new: 'Like New',
  good: 'Good',
  fair: 'Fair',
  poor: 'Poor'
}

const conditionColors = {
  like_new: 'bg-green-100 text-green-800',
  good: 'bg-blue-100 text-blue-800',
  fair: 'bg-yellow-100 text-yellow-800',
  poor: 'bg-red-100 text-red-800'
}

export function ItemCard({ item }: ItemCardProps) {
  // Handle both Item interface and legacy interface
  const isRealItem = 'images' in item
  const imageUrl = isRealItem ? item.images?.[0] : item.image
  const location = isRealItem ? item.location_name || 'Location not set' : item.location
  const isFree = isRealItem ? item.is_free : item.isFree
  const isBoosted = isRealItem ? item.is_boosted : false
  const boostType = isRealItem ? item.boost_type : null
  
  // Get category name directly from the item (no need for separate lookup)
  const categoryName = isRealItem && item.category ? item.category.name : null



  // Format date with more detailed relative time
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    if (diffDays <= 14) return 'Last week'
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  return (
    <Link href={`/item/${item.id}`}>
      <div 
        className={`flex flex-col w-full border rounded-2xl overflow-hidden hover:shadow-cards transition-all duration-200 cursor-pointer hover:scale-[1.02] ${isBoosted ? 'border-2' : ''}`}
        style={{ 
          backgroundColor: 'var(--bg-card)',
          borderColor: isBoosted ? 'rgb(17, 156, 33)' : 'var(--border-color)',
          minHeight: '400px' // Ensure consistent height for larger cards
        }}
      >
        {/* Image Container - Larger */}
        <div className="flex flex-col p-2">
          <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={item.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-sm">No Image</span>
              </div>
            )}
            
            {/* Swap/Drop Label - Top Right with distinct colors */}
            <div className="absolute top-3 right-3">
              <div className={`px-3 py-1.5 rounded-full font-bold text-sm shadow-lg ${
                isFree 
                  ? 'bg-green-500 text-white' // Green for Drop
                  : 'bg-blue-500 text-white'  // Blue for Swap
              }`}>
                {isFree ? 'DROP' : 'SWAP'}
              </div>
            </div>
            
            {/* Boost Badge - Top Left */}
            {isBoosted && (
              <div className="absolute top-3 left-3">
                {boostType === 'premium' && (
                  <div className="bg-blue-500 text-white px-3 py-1.5 rounded-full backdrop-blur-sm flex items-center gap-1.5 shadow-lg">
                    <Star className="w-4 h-4" />
                    <span className="text-sm font-bold">PREMIUM</span>
                  </div>
                )}
                {boostType === 'featured' && (
                  <div className="bg-green-500 text-white px-3 py-1.5 rounded-full backdrop-blur-sm flex items-center gap-1.5 shadow-lg">
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-bold">FEATURED</span>
                  </div>
                )}
                {boostType === 'urgent' && (
                  <div className="bg-orange-500 text-white px-3 py-1.5 rounded-full backdrop-blur-sm flex items-center gap-1.5 shadow-lg">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm font-bold">URGENT</span>
                  </div>
                )}
                {!boostType && (
                  <div className="text-white px-3 py-1.5 rounded-full backdrop-blur-sm flex items-center gap-1.5 shadow-lg" style={{ backgroundColor: 'rgb(17, 156, 33)' }}>
                    <TrendingUp className="w-4 h-4" />
                    <span className="text-sm font-bold">BOOSTED</span>
                  </div>
                )}
              </div>
            )}


          </div>
        </div>

        {/* Content - More spacious */}
        <div className="flex flex-col gap-4 p-4 flex-1">
          {/* Item Name - Larger and more prominent */}
          <h3 className="text-lg font-bold line-clamp-2 leading-tight" style={{ color: 'var(--text-primary)' }}>
            {item.title}
          </h3>
          
          {/* Location - More prominent */}
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-secondary)' }} />
            <span className="text-sm font-medium truncate" style={{ color: 'var(--text-secondary)' }}>
              {location}
            </span>
          </div>

          {/* Condition and Category - Combined like in the design */}
          {isRealItem && (
            <div className="flex items-center gap-2">
              <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                {item.condition && conditionLabels[item.condition]}
                {item.condition && categoryName && ' | '}
                {categoryName}
              </span>
            </div>
          )}

          {/* Looking for section - Item swap preferences */}
          {isRealItem && !isFree && item.looking_for && (
            <div className="flex flex-col gap-2">
              <p className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>Looking for:</p>
              <div className="flex gap-2 flex-wrap">
                {item.looking_for.split(', ').slice(0, 3).map((preference, index) => (
                  <div 
                    key={index}
                    className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-primary-light dark:bg-primary/30 pl-3 pr-3"
                  >
                    <p className="text-primary dark:text-primary-light text-sm font-medium">
                      {preference.trim()}
                    </p>
                  </div>
                ))}
                {item.looking_for.split(', ').length > 3 && (
                  <div className="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg bg-gray-100 dark:bg-gray-800 pl-3 pr-3">
                    <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                      +{item.looking_for.split(', ').length - 3} more
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* User Profile & Post Date */}
          {isRealItem && (
            <div className="flex items-center justify-between gap-3 mt-auto">
              {/* User Profile */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                {item.user?.avatar_url ? (
                  <Image
                    src={item.user.avatar_url}
                    alt={item.user.full_name || 'User'}
                    width={32}
                    height={32}
                    className="rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
                    {item.user?.full_name || 'Anonymous'}
                  </span>
                  {item.user?.rating_average && item.user.rating_average > 0 && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                        {item.user.rating_average.toFixed(1)} rating
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Post Date */}
              <div className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <Calendar className="w-4 h-4" />
                <span className="font-medium">{formatDate(item.created_at)}</span>
              </div>
            </div>
          )}

          {/* View Count - If available */}
          {isRealItem && item.view_count > 0 && (
            <div className="flex items-center gap-1.5 text-sm" style={{ color: 'var(--text-secondary)' }}>
              <Eye className="w-4 h-4" />
              <span>{item.view_count} views</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}