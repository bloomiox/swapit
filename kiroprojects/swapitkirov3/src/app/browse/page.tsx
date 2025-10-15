'use client'

import * as React from 'react'
import { Footer } from '@/components/layout/Footer'
import { ItemCard } from '@/components/ui/ItemCard'
import { Button } from '@/components/ui/Button'
import { OpenStreetMap } from '@/components/ui/OpenStreetMap'
import { Search, ChevronDown, List, Map, Locate, X, Check } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { LocationPicker } from '@/components/ui/LocationPicker'

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
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = React.useState(false)
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>([]) // No filters by default
  const [searchQuery, setSearchQuery] = React.useState('')
  const [currentLocation, setCurrentLocation] = React.useState({
    name: 'St. Gallen, Switzerland',
    coordinates: { lat: 47.4245, lng: 9.3767 }
  })
  const [isInitialized, setIsInitialized] = React.useState(false)

  // Helper functions and computed values
  const handleCategoryToggle = (categoryId: string) => {
    if (categoryId === 'all') {
      setSelectedCategories(selectedCategories.length === categoryData.length - 1 ? [] : categoryData.slice(1).map(c => c.id))
    } else {
      setSelectedCategories((prev: string[]) => 
        prev.includes(categoryId) 
          ? prev.filter((id: string) => id !== categoryId)
          : [...prev, categoryId]
      )
    }
  }

  const resetCategories = () => {
    setSelectedCategories([])
  }

  const clearAllFilters = () => {
    setSelectedCategories([])
    setSearchQuery('')
    // Clear from localStorage as well
    if (typeof window !== 'undefined') {
      localStorage.removeItem('browse-categories')
      localStorage.removeItem('browse-search-query')
    }
  }

  const handleLocationChange = (location: { name: string; coordinates: { lat: number; lng: number } }) => {
    setCurrentLocation(location)
    // Save location to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('browse-location', JSON.stringify(location))
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

  const isAllSelected = selectedCategories.length === categoryData.length - 1
  const isIndeterminate = selectedCategories.length > 0 && selectedCategories.length < categoryData.length - 1
  const hasActiveFilters = selectedCategories.length > 0 || searchQuery.length > 0

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (isCategoryDropdownOpen && !target.closest('.category-dropdown')) {
        setIsCategoryDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isCategoryDropdownOpen])

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
              {/* Category Filter with Dropdown */}
              <div className="relative category-dropdown">
                <button
                  onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  className="flex items-center gap-1 px-2 py-1.5 h-8 border rounded-lg text-caption-medium hover:border-primary transition-colors"
                  style={{ 
                    backgroundColor: selectedCategories.length > 0 ? '#D8F7D7' : 'var(--bg-card)',
                    borderColor: selectedCategories.length > 0 ? '#416B40' : 'var(--border-color)',
                    color: selectedCategories.length > 0 ? '#416B40' : 'var(--text-primary)'
                  }}
                >
                  {selectedCategories.length > 0 
                    ? selectedCategories.length === 1 
                      ? categoryData.find(c => c.id === selectedCategories[0])?.name 
                      : `${categoryData.find(c => c.id === selectedCategories[0])?.name}+${selectedCategories.length - 1}`
                    : 'Category'
                  }
                  <ChevronDown className="w-4 h-4" />
                </button>

              {/* Category Dropdown */}
              {isCategoryDropdownOpen && (
                <div 
                  className="absolute top-full left-0 mt-1 w-[390px] border rounded-3xl shadow-lg z-50"
                  style={{ 
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                    boxShadow: '0px 16px 40px 0px rgba(23, 34, 99, 0.4)'
                  }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
                    <button
                      onClick={() => setIsCategoryDropdownOpen(false)}
                      className="w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity"
                    >
                      <X className="w-4 h-4" style={{ color: 'var(--text-primary)' }} />
                    </button>
                    <h3 className="text-h6 font-bold" style={{ color: 'var(--text-primary)' }}>
                      Category
                    </h3>
                    <button
                      onClick={resetCategories}
                      className="text-body-small-bold text-primary hover:opacity-80 transition-opacity"
                    >
                      Reset
                    </button>
                  </div>

                  {/* Category List */}
                  <div className="py-2">
                    {categoryData.map((category, index) => (
                      <div key={category.id}>
                        <button
                          onClick={() => handleCategoryToggle(category.id)}
                          className="w-full flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors"
                        >
                          {/* Icon */}
                          {category.id !== 'all' && (
                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg">
                              {category.icon}
                            </div>
                          )}
                          
                          {/* Text */}
                          <div className="flex-1 text-left">
                            <span className="text-body-medium" style={{ color: 'var(--text-primary)' }}>
                              {category.name}
                            </span>
                          </div>

                          {/* Checkbox */}
                          <div className="w-5 h-5 border-2 rounded flex items-center justify-center"
                            style={{ 
                              borderColor: category.id === 'all' 
                                ? (isAllSelected || isIndeterminate ? 'var(--primary)' : 'var(--text-secondary)')
                                : (selectedCategories.includes(category.id) ? 'var(--primary)' : 'var(--text-secondary)'),
                              backgroundColor: category.id === 'all'
                                ? (isAllSelected || isIndeterminate ? 'var(--primary)' : 'transparent')
                                : (selectedCategories.includes(category.id) ? 'var(--primary)' : 'transparent')
                            }}
                          >
                            {category.id === 'all' ? (
                              isIndeterminate ? (
                                <div className="w-2 h-0.5 bg-white" />
                              ) : isAllSelected ? (
                                <Check className="w-3 h-3 text-white" />
                              ) : null
                            ) : selectedCategories.includes(category.id) ? (
                              <Check className="w-3 h-3 text-white" />
                            ) : null}
                          </div>
                        </button>
                        
                        {/* Divider */}
                        {index === 0 && (
                          <div className="mx-4 h-px" style={{ backgroundColor: 'var(--border-color)' }} />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Apply Button */}
                  <div className="p-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                    <Button 
                      variant="primary" 
                      size="large" 
                      className="w-full"
                      onClick={() => setIsCategoryDropdownOpen(false)}
                    >
                      Apply
                    </Button>
                  </div>
                </div>
              )}
            </div>

              {/* Other Filter Chips */}
              {['Condition', 'Distance', 'Oldest First', 'Free'].map((filter) => (
                <button
                  key={filter}
                  className="flex items-center gap-1 px-2 py-1.5 h-8 border rounded-lg text-caption-medium hover:border-primary transition-colors"
                  style={{ 
                    backgroundColor: 'var(--bg-card)',
                    borderColor: 'var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                >
                  {filter}
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
    </main>
  )
}