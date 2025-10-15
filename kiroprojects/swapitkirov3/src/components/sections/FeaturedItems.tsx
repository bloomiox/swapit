import { Button } from '@/components/ui/Button'
import { ItemCard } from '@/components/ui/ItemCard'

const featuredItems = [
  {
    id: '1',
    title: 'iPhone',
    location: 'Berkeley CA · 9.3km',
    image: '/api/placeholder/170/220',
    isFree: false,
  },
  {
    id: '2',
    title: 'Office Bag',
    location: 'Berkeley CA · 9.3km',
    image: '/api/placeholder/170/220',
    isFree: true,
  },
  {
    id: '3',
    title: 'Wooden table with stool',
    location: 'Berkeley CA · 9.3km',
    image: '/api/placeholder/170/220',
    isFree: false,
  },
  {
    id: '4',
    title: 'Original Airpods 2',
    location: 'Berkeley CA · 9.3km',
    image: '/api/placeholder/170/220',
    isFree: false,
  },
  // Show fewer items on mobile
  ...Array(4).fill(null).map((_, i) => ({
    id: `${i + 5}`,
    title: 'Original Airpods 2',
    location: 'Berkeley CA · 9.3km',
    image: '/api/placeholder/170/220',
    isFree: false,
  })),
]

export function FeaturedItems() {
  return (
    <section 
      className="flex flex-col items-center gap-6 lg:gap-10 px-4 md:px-6 lg:px-[165px] py-section-mobile md:py-section-tablet lg:py-10"
      style={{ backgroundColor: 'var(--bg-primary)' }}
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

      {/* Items Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 w-full">
        {featuredItems.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>

      {/* View All Button */}
      <Button variant="primary" size="large" className="w-full sm:w-auto">
        View All Items
      </Button>
    </section>
  )
}