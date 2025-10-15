'use client'

import * as React from 'react'
import { Footer } from '@/components/layout/Footer'
import { ItemCard } from '@/components/ui/ItemCard'
import { Button } from '@/components/ui/Button'
import { OpenStreetMap } from '@/components/ui/OpenStreetMap'
import { Search, ChevronDown, List, Map, Locate, X } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { LocationPicker } from '@/components/ui/LocationPicker'
import { FilterModal } from '@/components/modals/FilterModal'

// Mock data for demonstration
const mockItems = [
  {
    id: '1',
    title: 'Vintage Leather Jacket',
    location: 'Downtown, City Center',
    image: '/placeholder.jpg',
    isFree: false
  },
  {
    id: '2',
    title: 'Wooden Coffee Table',
    location: 'Suburbs, North District',
    image: '/placeholder.jpg',
    isFree: true
  },
  {
    id: '3',
    title: 'Mountain Bike',
    location: 'East Side, Park Area',
    image: '/placeholder.jpg',
    isFree: false
  },
  {
    id: '4',
    title: 'Books Collection',
    location: 'University District',
    image: '/placeholder.jpg',
    isFree: true
  },
  {
    id: '5',
    title: 'Gaming Console',
    location: 'Tech Quarter',
    image: '/placeholder.jpg',
    isFree: false
  },
  {
    id: '6',
    title: 'Plant Collection',
    location: 'Garden District',
    image: '/placeholder.jpg',
    isFree: true
  }
]

const categoryData = [
  { id: 'all', name: 'All Categories', icon: '📦' },
  { id: 'books', name: 'Books', icon: '📚' },
  { id: 'clothing', name: 'Clothing', icon: '👕' },
  { id: 'electronics', name: 'Electronics', icon: '📱' },
  { id: 'decor', name: 'Decor', icon: '🏠' },
  { id: 'sports', name: 'Sports & Fitness', icon: '⚽' },
  { id: 'games', name: 'Toys & Games', icon: '🎮' }
]

export default function BrowsePage() {
  const [viewMode, setViewMode] = React.useState<'list' | 'map'>('list') // Default to List view
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]) // Keep for backward compatibility
  const [searchQuery, setSearchQuery] = React.useState('')
  const [currentLocation, setCurrentLocation] = React.useState({
    name: 'St. Gallen, Switzerland',
    coordinates: { lat: 47.4245, lng: 9.3767 }
  })
  const [isInitialized, setIsInitialized] = React.useState(false)
  
  // Filter states
  const [activeFilterModal, setActiveFilterModal] = React.useState<'condition' | 'distance' | 'sorting' | 'type' | 'category' | null>(null)
  const [filters, setFilters] = React.useState({
    condition: 'all',
    distance: 50,
    sorting: 'newest',
    type: 'all',
    category: [] as string[]
  })

  // Helper functions and computed values

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSearchQuery('')
    setFilters({
      condition: 'all',
      distance: 50,
      sorting: 'newest',
      type: 'all',
      category: []
    })
    // Clear from localStorage as well
    if (typeof window !== 'undefined') {
      localStorage.removeItem('browse-categories')
      localStorage.removeItem('browse-search-query')
      localStorage.removeItem('browse-filters')
    }
  }

  const handleLocationChange = (location: { name: string; coordinates: { lat: number; lng: number } }) => {
    setCurrentLocation(location)
    // Save location to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('browse-location', JSON.stringify(location))
    }
  }

  const handleFilterApply = (type: 'condition' | 'distance' | 'sorting' | 'type' | 'category', value: any) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }))
    
    // Also update selectedCategories for backward compatibility
    if (type === 'category') {
      setSelectedCategories(value)
    }
  }

  const getFilterLabel = (type: 'condition' | 'distance' | 'sorting' | 'type' | 'category') => {
    switch (type) {
      case 'condition':
        return filters.condition === 'all' ? 'Condition' : 
               filters.condition === 'new' ? 'Like New' :
               filters.condition === 'good' ? 'Good' :
               filters.condition === 'fair' ? 'Fair' : 'Poor'
      case 'distance':
        return `${filters.distance} km`
      case 'sorting':
        return filters.sorting === 'newest' ? 'Newest First' :
               filters.sorting === 'oldest' ? 'Oldest First' :
               filters.sorting === 'distance' ? 'Distance' : 'A-Z'
      case 'type':
        return filters.type === 'all' ? 'All Items' :
               filters.type === 'free' ? 'Free Only' : 'Swap Only'
      case 'category':
        if (!filters.category || filters.category.length === 0) return 'Category'
        if (filters.category.length === 1) {
          const category = categoryData.find(c => c.id === filters.category[0])
          return category?.name || 'Category'
        }
        const firstCategory = categoryData.find(c => c.id === filters.category[0])
        return `${firstCategory?.name}+${filters.category.length - 1}`
      default:
        return ''
    }
  }

  const isFilterActive = (type: 'condition' | 'distance' | 'sorting' | 'type' | 'category') => {
    switch (type) {
      case 'condition':
        return filters.condition !== 'all'
      case 'distance':
        return filters.distance !== 50
      case 'sorting':
        return filters.sorting !== 'newest'
      case 'type':
        return filters.type !== 'all'
      case 'category':
        return filters.category && filters.category.length > 0
      default:
        return false
    }
  }

  // Load saved state from localStorage on component mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        // Load view mode
        const savedViewMode = localStorage.getItem('browse-view-mode')
        if (savedViewMode && (savedViewMode === 'list' || savedViewMode === 'map')) {
          setViewMode(savedViewMode)
        }

        // Load selected categories
        const savedCategories = localStorage.getItem('browse-categories')
        if (savedCategories) {
          const categories = JSON.parse(savedCategories)
          if (Array.isArray(categories)) {
            setSelectedCategories(categories)
          }
        }

        // Load search query
        const savedSearchQuery = localStorage.getItem('browse-search-query')
        if (savedSearchQuery) {
          setSearchQuery(savedSearchQuery)
        }

        // Load location
        const savedLocation = localStorage.getItem('browse-location')
        if (savedLocation) {
          const location = JSON.parse(savedLocation)
          if (location && location.name && location.coordinates) {
            setCurrentLocation(location)
          }
        }

        // Load filters
        const savedFilters = localStorage.getItem('browse-filters')
        if (savedFilters) {
          const parsedFilters = JSON.parse(savedFilters)
          if (parsedFilters) {
            // Ensure all filter properties exist with defaults
            setFilters({
              condition: parsedFilters.condition || 'all',
              distance: parsedFilters.distance || 50,
              sorting: parsedFilters.sorting || 'newest',
              type: parsedFilters.type || 'all',
              category: parsedFilters.category || []
            })
            // Also update selectedCategories for backward compatibility
            if (parsedFilters.category) {
              setSelectedCategories(parsedFilters.category)
            }
          }
        }
      } catch (error) {
        console.error('Error loading saved browse state:', error)
      }
    }
    setIsInitialized(true)
  }, [])

  // Save state to localStorage when it changes
  React.useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem('browse-view-mode', viewMode)
    }
  }, [viewMode, isInitialized])

  React.useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem('browse-categories', JSON.stringify(selectedCategories))
    }
  }, [selectedCategories, isInitialized])

  React.useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem('browse-search-query', searchQuery)
    }
  }, [searchQuery, isInitialized])

  React.useEffect(() => {
    if (isInitialized && typeof window !== 'undefined') {
      localStorage.setItem('browse-filters', JSON.stringify(filters))
    }
  }, [filters, isInitialized])


  const hasActiveFilters = searchQuery.length > 0 || 
    filters.condition !== 'all' ||
    filters.distance !== 50 ||
    filters.sorting !== 'newest' ||
    filters.type !== 'all' ||
    (filters.category && filters.category.length > 0)



  return (
    <main className="min-h-screen">
      <Navbar />
      
      {/* Search Container */}
      <nav 
        className="border-b"
        style={{ 
          backgroundColor: 'var(--bg-primary)', 
          borderColor: 'var(--border-color)'
        }}
      >
        <div className="flex items-center gap-4 px-4 md:px-6 lg:px-[165px] py-4">
          {/* Location Selector */}
          <LocationPicker onLocationChange={handleLocationChange} />

          {/* Search Bar */}
          <div className="flex items-center gap-3 px-4 py-2.5 border rounded-xl bg-white flex-1"
            style={{ 
              borderColor: 'var(--border-color)',
              backgroundColor: 'var(--bg-card)'
            }}
          >
            <Search className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e: any) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-body-small"
              style={{ color: 'var(--text-primary)' }}
            />
          </div>
        </div>
      </nav>
      
      {/* Content Section */}
      <section style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="px-4 md:px-6 lg:px-[165px] py-6">
          {/* Section Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1">
              <h1 
                className="text-h3 mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                {searchQuery ? `Search for "${searchQuery}"` : 'Browse All Items'}
              </h1>
              <p 
                className="text-body-large"
                style={{ color: 'var(--text-secondary)' }}
              >
                Find exactly what are you looking for
              </p>
            </div>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center justify-between gap-4 mb-5">
            <div className="flex items-center gap-1">
              {/* Clear All Button - Only show when filters are active */}
              {hasActiveFilters && (
                <div className="flex items-center gap-2 pr-4">
                  <button
                    onClick={clearAllFilters}
                    className="w-6 h-6 flex items-center justify-center rounded-lg hover:opacity-80 transition-opacity"
                    style={{ backgroundColor: '#FDE1E0' }}
                  >
                    <X className="w-4 h-4" style={{ color: '#FD5F59' }} />
                  </button>
                  <div className="w-px h-5" style={{ backgroundColor: 'var(--border-color)' }} />
                </div>
              )}
              {/* Category Filter Chip */}
              <button
                onClick={() => setActiveFilterModal('category')}
                className="flex items-center gap-1 px-2 py-1.5 h-8 border rounded-lg text-caption-medium hover:border-primary transition-colors"
                style={{ 
                  backgroundColor: isFilterActive('category') ? '#D8F7D7' : 'var(--bg-card)',
                  borderColor: isFilterActive('category') ? '#416B40' : 'var(--border-color)',
                  color: isFilterActive('category') ? '#416B40' : 'var(--text-primary)'
                }}
              >
                {getFilterLabel('category')}
                <ChevronDown className="w-4 h-4" />
              </button>

              {/* Other Filter Chips */}
              {[
                { key: 'condition', label: getFilterLabel('condition') },
                { key: 'distance', label: getFilterLabel('distance') },
                { key: 'sorting', label: getFilterLabel('sorting') },
                { key: 'type', label: getFilterLabel('type') }
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilterModal(filter.key as any)}
                  className="flex items-center gap-1 px-2 py-1.5 h-8 border rounded-lg text-caption-medium hover:border-primary transition-colors"
                  style={{ 
                    backgroundColor: isFilterActive(filter.key as any) ? '#D8F7D7' : 'var(--bg-card)',
                    borderColor: isFilterActive(filter.key as any) ? '#416B40' : 'var(--border-color)',
                    color: isFilterActive(filter.key as any) ? '#416B40' : 'var(--text-primary)'
                  }}
                >
                  {filter.label}
                  <ChevronDown className="w-4 h-4" />
                </button>
              ))}
            </div>

            {/* View Switcher */}
            <div 
              className="flex items-center p-1 border rounded-full"
              style={{ 
                backgroundColor: 'var(--bg-card)',
                borderColor: 'var(--border-color)'
              }}
            >
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-body-small-bold transition-all ${
                  viewMode === 'list' 
                    ? 'bg-primary text-white' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <List className="w-5 h-5" />
                List
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-body-small-bold transition-all ${
                  viewMode === 'map' 
                    ? 'bg-primary text-white' 
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Map className="w-5 h-5" />
                  Map
                </button>
              </div>
          </div>
        </div>
      </section>

      {/* Content Area */}
      <section style={{ backgroundColor: 'var(--bg-primary)' }}>
        <div className="px-4 md:px-6 lg:px-[165px] pb-12">
          {viewMode === 'list' ? (
            /* List View */
            <div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {mockItems.map((item) => (
                  <ItemCard key={item.id} item={item} />
                ))}
              </div>
              
              {/* Load More Button */}
              <div className="text-center mt-12">
                <Button variant="outlined" size="large">
                  Load More Items
                </Button>
              </div>
            </div>
          ) : (
            /* Map View */
            <div className="relative">
              {/* Map Container */}
              <div 
                className="relative w-full h-[600px] rounded-2xl overflow-hidden"
                style={{ backgroundColor: 'var(--bg-secondary)' }}
              >
                <OpenStreetMap
                  latitude={currentLocation.coordinates.lat}
                  longitude={currentLocation.coordinates.lng}
                  zoom={12}
                  className="rounded-2xl"
                  markers={[
                    { lat: currentLocation.coordinates.lat, lng: currentLocation.coordinates.lng, title: 'Vintage Leather Jacket' },
                    { lat: currentLocation.coordinates.lat + 0.004, lng: currentLocation.coordinates.lng + 0.003, title: 'Wooden Coffee Table' },
                    { lat: currentLocation.coordinates.lat - 0.0045, lng: currentLocation.coordinates.lng - 0.0067, title: 'Mountain Bike' },
                    { lat: currentLocation.coordinates.lat + 0.0055, lng: currentLocation.coordinates.lng + 0.0083, title: 'Books Collection' },
                    { lat: currentLocation.coordinates.lat - 0.0065, lng: currentLocation.coordinates.lng - 0.0047, title: 'Gaming Console' },
                    { lat: currentLocation.coordinates.lat + 0.0075, lng: currentLocation.coordinates.lng + 0.0013, title: 'Plant Collection' }
                  ]}
                  showUserLocation={true}
                />
                
                {/* Floating Location Button */}
                <button 
                  className="absolute bottom-16 right-16 w-10 h-10 bg-primary rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors z-10"
                  style={{ boxShadow: '0px 16px 40px 0px rgba(23, 34, 99, 0.4)' }}
                >
                  <Locate className="w-5 h-5 text-white" />
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />

      {/* Filter Modals */}
      {activeFilterModal && (
        <FilterModal
          isOpen={true}
          onClose={() => setActiveFilterModal(null)}
          type={activeFilterModal}
          currentValue={filters[activeFilterModal]}
          onApply={(value) => handleFilterApply(activeFilterModal, value)}
        />
      )}
    </main>
  )
}