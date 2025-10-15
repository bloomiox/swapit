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
import { useItems, ItemFilters } from '@/hooks/useItems'
import { useCategories } from '@/hooks/useCategories'
import { useAuth } from '@/contexts/AuthContext'
import { useFeaturedItemsForYou, useRecommendedItems, useTrendingItems, useExploreMoreItems } from '@/hooks/useBrowseRecommendations'
import { useProfileCompletion } from '@/hooks/useProfileCompletion'
import { ItemSection } from '@/components/sections/ItemSection'

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

  // Auth and data hooks
  const { user } = useAuth()
  const { categories } = useCategories()
  const { isProfileComplete, hasInterests, loading: profileLoading } = useProfileCompletion()
  
  // Recommendation hooks for authenticated users
  const { items: featuredForYou, loading: featuredLoading } = useFeaturedItemsForYou()
  const { items: recommendedItems, loading: recommendedLoading } = useRecommendedItems()
  const { items: trendingItems, loading: trendingLoading } = useTrendingItems()
  
  // Collect IDs from other sections to avoid duplicates in Explore More
  const excludeItemIds = React.useMemo(() => {
    const ids = new Set<string>()
    featuredForYou.forEach(item => ids.add(item.id))
    recommendedItems.forEach(item => ids.add(item.id))
    trendingItems.forEach(item => ids.add(item.id))
    return Array.from(ids)
  }, [featuredForYou, recommendedItems, trendingItems])
  
  const { items: exploreItems, loading: exploreLoading } = useExploreMoreItems(excludeItemIds)
  
  // Build item filters from current state
  const itemFilters: ItemFilters = React.useMemo(() => {
    const filterObj: ItemFilters = {}
    
    if (filters.category.length > 0) {
      filterObj.category_ids = filters.category
    }
    
    if (filters.condition !== 'all') {
      filterObj.condition = filters.condition as 'like_new' | 'good' | 'fair' | 'poor'
    }
    
    if (filters.type === 'free') {
      filterObj.is_free = true
    } else if (filters.type === 'swap') {
      filterObj.is_free = false
    }
    
    if (searchQuery.trim()) {
      filterObj.search_query = searchQuery.trim()
    }
    
    return filterObj
  }, [filters, searchQuery])
  
  const { items, loading, error } = useItems(itemFilters)
  
  // Check if there are active filters
  const hasActiveFilters = searchQuery.length > 0 || 
    filters.condition !== 'all' ||
    filters.distance !== 50 ||
    filters.sorting !== 'newest' ||
    filters.type !== 'all' ||
    (filters.category && filters.category.length > 0)
  
  // Show personalized sections only when user is authenticated and no active filters/search
  const showPersonalizedSections = user && !searchQuery && !hasActiveFilters

  // Create category data with real categories
  const categoryData = React.useMemo(() => {
    const allCategory = { id: 'all', name: 'All Categories', icon: '📦' }
    const realCategories = categories.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      icon: cat.icon || '📦'
    }))
    return [allCategory, ...realCategories]
  }, [categories])

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
          try {
            const categories = JSON.parse(savedCategories)
            if (Array.isArray(categories)) {
              setSelectedCategories(categories)
            }
          } catch (error) {
            console.error('Error parsing saved categories:', error)
            localStorage.removeItem('browse-categories')
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
          try {
            const location = JSON.parse(savedLocation)
            if (location && location.name && location.coordinates) {
              setCurrentLocation(location)
            }
          } catch (error) {
            console.error('Error parsing saved location:', error)
            localStorage.removeItem('browse-location')
          }
        }

        // Load filters
        const savedFilters = localStorage.getItem('browse-filters')
        if (savedFilters) {
          try {
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
          } catch (error) {
            console.error('Error parsing saved filters:', error)
            localStorage.removeItem('browse-filters')
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

      {/* Personalized Sections for Authenticated Users - Only show in list view */}
      {showPersonalizedSections && viewMode === 'list' && (
        <div style={{ backgroundColor: 'var(--bg-primary)' }}>
          {/* Featured Items for You */}
          <ItemSection
            title="Featured Items for You"
            description="Popular items in your area"
            items={featuredForYou}
            loading={featuredLoading}
            error={null}
            emptyMessage="No featured items in your area yet."
            className="border-b border-gray-200"
          />

          {/* Recommended Items */}
          <ItemSection
            title="Recommended for You"
            description="Items based on your interests"
            items={recommendedItems}
            loading={recommendedLoading || profileLoading}
            error={null}
            emptyMessage={
              !isProfileComplete || !hasInterests
                ? "Complete your profile and select interests to get personalized recommendations."
                : "No items match your interests yet. Check back later!"
            }
            className="border-b border-gray-200"
          />

          {/* Trending Items */}
          <ItemSection
            title="Trending Items"
            description="Most viewed and requested items"
            items={trendingItems}
            loading={trendingLoading}
            error={null}
            emptyMessage="No trending items right now."
            className="border-b border-gray-200"
          />

          {/* Explore More */}
          <ItemSection
            title="Explore More"
            description="Discover all available items"
            items={exploreItems}
            loading={exploreLoading}
            error={null}
            emptyMessage=""
            showViewAll={true}
            viewAllText="View All"
            viewAllHref="/browse"
          />
        </div>
      )}

      {/* Content Area */}
      {viewMode === 'list' ? (
        <section style={{ backgroundColor: 'var(--bg-primary)' }}>
          <div className="px-4 md:px-6 lg:px-[165px] pb-12">
            {loading ? (
              /* Loading State */
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {Array(10).fill(0).map((_, i) => (
                  <div key={i} className="aspect-[170/220] bg-gray-200 rounded-2xl animate-pulse" />
                ))}
              </div>
            ) : error ? (
              /* Error State */
              <div className="text-center py-12">
                <p className="text-body-large mb-4" style={{ color: 'var(--text-secondary)' }}>
                  Unable to load items. Please try again.
                </p>
                <Button variant="outlined" onClick={() => window.location.reload()}>
                  Retry
                </Button>
              </div>
            ) : items.length === 0 ? (
              /* Empty State */
              <div className="text-center py-12">
                <p className="text-body-large mb-2" style={{ color: 'var(--text-secondary)' }}>
                  {searchQuery || hasActiveFilters ? 'No items match your search criteria.' : 'No items available yet.'}
                </p>
                {(searchQuery || hasActiveFilters) && (
                  <Button variant="outlined" onClick={clearAllFilters}>
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              /* Items Grid */
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {items.map((item) => (
                    <ItemCard key={item.id} item={item} />
                  ))}
                </div>
                
                {/* Results Info */}
                <div className="text-center mt-8">
                  <p className="text-body-small" style={{ color: 'var(--text-secondary)' }}>
                    Showing {items.length} item{items.length !== 1 ? 's' : ''}
                    {searchQuery && ` for "${searchQuery}"`}
                  </p>
                </div>
              </>
            )}
          </div>
        </section>
      ) : (
        /* Map View - Full Page */
        <section className="relative" style={{ backgroundColor: 'var(--bg-primary)' }}>
          {/* Map Container - Full width and height */}
          <div 
            className="relative w-full"
            style={{ 
              backgroundColor: 'var(--bg-secondary)',
              height: 'calc(100vh - 200px)',
              minHeight: '600px'
            }}
          >
            {loading ? (
              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Loading map...</span>
              </div>
            ) : (
              <OpenStreetMap
                latitude={currentLocation.coordinates.lat}
                longitude={currentLocation.coordinates.lng}
                zoom={12}
                className="w-full h-full"
                markers={items
                  .filter(item => item.location_coordinates)
                  .map(item => ({
                    lat: item.location_coordinates.lat || currentLocation.coordinates.lat,
                    lng: item.location_coordinates.lng || currentLocation.coordinates.lng,
                    title: item.title,
                    id: item.id,
                    imageUrl: item.images?.[0] || undefined,
                    isFree: item.is_free
                  }))
                }
                showUserLocation={true}
              />
            )}
            
            {/* Floating Location Button */}
            <button 
              className="absolute bottom-6 right-6 w-12 h-12 bg-primary rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-colors z-10"
              style={{ boxShadow: '0px 16px 40px 0px rgba(23, 34, 99, 0.4)' }}
            >
              <Locate className="w-6 h-6 text-white" />
            </button>
            
            {/* Map Results Info - Floating */}
            {!loading && (
              <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                <p className="text-body-small" style={{ color: 'var(--text-primary)' }}>
                  Showing {items.length} item{items.length !== 1 ? 's' : ''} on map
                  {searchQuery && ` for "${searchQuery}"`}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

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