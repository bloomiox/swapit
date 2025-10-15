'use client'

import React, { useState, useEffect } from 'react'
import { MapPin, ChevronDown, Locate, X, Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface Location {
  name: string
  coordinates: {
    lat: number
    lng: number
  }
}

interface LocationPickerProps {
  onLocationChange: (location: Location) => void
  className?: string
}

// Popular cities for quick selection
const popularCities: Location[] = [
  { name: 'Zurich, Switzerland', coordinates: { lat: 47.3769, lng: 8.5417 } },
  { name: 'Geneva, Switzerland', coordinates: { lat: 46.2044, lng: 6.1432 } },
  { name: 'Basel, Switzerland', coordinates: { lat: 47.5596, lng: 7.5886 } },
  { name: 'Bern, Switzerland', coordinates: { lat: 46.9481, lng: 7.4474 } },
  { name: 'Lausanne, Switzerland', coordinates: { lat: 46.5197, lng: 6.6323 } },
  { name: 'St. Gallen, Switzerland', coordinates: { lat: 47.4245, lng: 9.3767 } },
  { name: 'Lucerne, Switzerland', coordinates: { lat: 47.0502, lng: 8.3093 } },
  { name: 'Winterthur, Switzerland', coordinates: { lat: 47.5022, lng: 8.7247 } }
]

export function LocationPicker({ onLocationChange, className = '' }: LocationPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<Location>({
    name: 'Select Location',
    coordinates: { lat: 47.4245, lng: 9.3767 }
  })
  const [isDetecting, setIsDetecting] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Filter cities based on search query
  const filteredCities = popularCities.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Auto-detect user location
  const detectLocation = async () => {
    setIsDetecting(true)
    
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.')
      setIsDetecting(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        
        try {
          // Use reverse geocoding to get city name
          // For demo purposes, we'll use a simple approximation
          const detectedLocation: Location = {
            name: `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
            coordinates: { lat: latitude, lng: longitude }
          }
          
          setCurrentLocation(detectedLocation)
          onLocationChange(detectedLocation)
          setIsOpen(false)
        } catch (error) {
          console.error('Error getting location name:', error)
          const detectedLocation: Location = {
            name: `Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
            coordinates: { lat: latitude, lng: longitude }
          }
          
          setCurrentLocation(detectedLocation)
          onLocationChange(detectedLocation)
          setIsOpen(false)
        }
        
        setIsDetecting(false)
      },
      (error) => {
        console.error('Error getting location:', error)
        alert('Unable to detect your location. Please select a city manually.')
        setIsDetecting(false)
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  }

  // Handle city selection
  const selectCity = (city: Location) => {
    setCurrentLocation(city)
    onLocationChange(city)
    setIsOpen(false)
    setSearchQuery('')
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (isOpen && !target.closest('.location-picker')) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  return (
    <div className={`relative location-picker ${className}`}>
      {/* Location Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 px-4 py-2.5 border rounded-xl bg-white min-w-[320px] hover:border-primary transition-colors"
        style={{ 
          borderColor: isOpen ? 'var(--primary-color)' : 'var(--border-color)',
          backgroundColor: 'var(--bg-card)'
        }}
      >
        <MapPin className="w-5 h-5 text-primary" />
        <span 
          className="text-body-small flex-1 text-left"
          style={{ color: 'var(--text-primary)' }}
        >
          {currentLocation.name}
        </span>
        <ChevronDown 
          className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          style={{ color: 'var(--text-primary)' }} 
        />
      </button>

      {/* Location Dropdown */}
      {isOpen && (
        <div 
          className="absolute top-full left-0 mt-1 w-full border rounded-2xl shadow-lg max-h-[400px] overflow-hidden"
          style={{ 
            zIndex: 9999,
            backgroundColor: 'var(--bg-card)',
            borderColor: 'var(--border-color)',
            boxShadow: '0px 16px 40px 0px rgba(23, 34, 99, 0.4)'
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <h3 className="text-h6 font-bold" style={{ color: 'var(--text-primary)' }}>
              Select Location
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="w-6 h-6 flex items-center justify-center hover:opacity-70 transition-opacity"
            >
              <X className="w-4 h-4" style={{ color: 'var(--text-primary)' }} />
            </button>
          </div>

          {/* Auto-detect Location */}
          <div className="p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <Button 
              variant="outlined" 
              size="default" 
              className="w-full"
              onClick={detectLocation}
              disabled={isDetecting}
            >
              <Locate className="w-4 h-4 mr-2" />
              {isDetecting ? 'Detecting...' : 'Use Current Location'}
            </Button>
          </div>

          {/* Search */}
          <div className="p-4 border-b" style={{ borderColor: 'var(--border-color)' }}>
            <input
              type="text"
              placeholder="Search cities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              style={{ 
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--border-color)',
                color: 'var(--text-primary)'
              }}
            />
          </div>

          {/* Cities List */}
          <div className="max-h-[200px] overflow-y-auto">
            {filteredCities.length > 0 ? (
              filteredCities.map((city, index) => (
                <button
                  key={index}
                  onClick={() => selectCity(city)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-body-medium flex-1" style={{ color: 'var(--text-primary)' }}>
                    {city.name}
                  </span>
                  {currentLocation.name === city.name && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </button>
              ))
            ) : (
              <div className="p-4 text-center">
                <span className="text-body-medium" style={{ color: 'var(--text-secondary)' }}>
                  No cities found
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}