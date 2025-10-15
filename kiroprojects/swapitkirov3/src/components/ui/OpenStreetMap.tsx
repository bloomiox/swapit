'use client'

import React, { useEffect, useRef } from 'react'

interface MapProps {
  latitude?: number
  longitude?: number
  zoom?: number
  className?: string
  markers?: Array<{
    lat: number
    lng: number
    title?: string
    color?: string
  }>
  showUserLocation?: boolean
}

export function OpenStreetMap({ 
  latitude = 47.4245, 
  longitude = 9.3767, 
  zoom = 13,
  className = '',
  markers = [],
  showUserLocation = false
}: MapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)

  useEffect(() => {
    // Dynamically import Leaflet to avoid SSR issues
    const initMap = async () => {
      if (typeof window === 'undefined') return

      try {
        const L = (await import('leaflet')).default
        
        // Import CSS dynamically
        if (!document.querySelector('link[href*="leaflet.css"]')) {
          const link = document.createElement('link')
          link.rel = 'stylesheet'
          link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
          link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
          link.crossOrigin = ''
          document.head.appendChild(link)
        }

        // Add custom CSS to control Leaflet z-index
        if (!document.querySelector('#leaflet-z-index-fix')) {
          const style = document.createElement('style')
          style.id = 'leaflet-z-index-fix'
          style.textContent = `
            .leaflet-container {
              z-index: 1 !important;
            }
            .leaflet-pane {
              z-index: auto !important;
            }
            .leaflet-tile-pane {
              z-index: 1 !important;
            }
            .leaflet-overlay-pane {
              z-index: 2 !important;
            }
            .leaflet-shadow-pane {
              z-index: 3 !important;
            }
            .leaflet-marker-pane {
              z-index: 4 !important;
            }
            .leaflet-tooltip-pane {
              z-index: 5 !important;
            }
            .leaflet-popup-pane {
              z-index: 6 !important;
            }
            .leaflet-control-container {
              z-index: 7 !important;
            }
          `
          document.head.appendChild(style)
        }

        if (mapRef.current && !mapInstanceRef.current) {
          // Initialize map
          mapInstanceRef.current = L.map(mapRef.current, {
            zoomControl: true,
            attributionControl: true
          }).setView([latitude, longitude], zoom)

          // Add OpenStreetMap tiles
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          }).addTo(mapInstanceRef.current)

          // Add markers
          markers.forEach(marker => {
            const leafletMarker = L.marker([marker.lat, marker.lng])
            if (marker.title) {
              leafletMarker.bindPopup(marker.title)
            }
            leafletMarker.addTo(mapInstanceRef.current)
          })

          // Add user location marker if requested
          if (showUserLocation) {
            const userMarker = L.marker([latitude, longitude], {
              icon: L.divIcon({
                className: 'user-location-marker',
                html: '<div style="background: #4285F4; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>',
                iconSize: [20, 20],
                iconAnchor: [10, 10]
              })
            })
            userMarker.addTo(mapInstanceRef.current)
          }
        }
      } catch (error) {
        console.error('Error loading map:', error)
        // Fallback to static map representation with location info
        if (mapRef.current) {
          mapRef.current.innerHTML = `
            <div style="
              width: 100%; 
              height: 100%; 
              background: linear-gradient(135deg, #e8f5e8 0%, #d4f4d4 100%);
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              color: #666;
              font-size: 14px;
              position: relative;
            ">
              <div style="
                width: 40px;
                height: 40px;
                background: #4285F4;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 8px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
              ">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                </svg>
              </div>
              <div>Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}</div>
              <div style="font-size: 12px; margin-top: 4px; opacity: 0.7;">Interactive map loading...</div>
            </div>
          `
        }
      }
    }

    initMap()

    // Cleanup
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [latitude, longitude, zoom, markers, showUserLocation])

  return (
    <div 
      ref={mapRef} 
      className={`w-full h-full ${className}`}
      style={{ 
        minHeight: '200px',
        position: 'relative',
        zIndex: 1
      }}
    />
  )
}