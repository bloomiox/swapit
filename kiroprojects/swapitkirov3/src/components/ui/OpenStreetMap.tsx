'use client'

import React, { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'

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
    id?: string
    imageUrl?: string
    isFree?: boolean
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
        // Import Leaflet
        const L = (await import('leaflet')).default
        
        // Fix for default markers not showing
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        })

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
            let leafletMarker
            
            if (marker.imageUrl) {
              // Create custom image marker with circular styling
              const markerHtml = `
                <div class="item-marker-container" style="
                  position: relative;
                  width: 60px;
                  height: 60px;
                  cursor: pointer;
                  transition: transform 0.2s ease;
                " onmouseover="this.style.transform='scale(1.1)'" onmouseout="this.style.transform='scale(1)'">
                  <div style="
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    border: 4px solid ${marker.isFree ? '#10B981' : '#3B82F6'};
                    background: white;
                    box-shadow: 0 6px 20px rgba(0,0,0,0.25);
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                  ">
                    <img 
                      src="${marker.imageUrl}" 
                      alt="${marker.title || 'Item'}"
                      style="
                        width: 52px;
                        height: 52px;
                        border-radius: 50%;
                        object-fit: cover;
                      "
                      onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                    />
                    <div style="
                      display: none;
                      width: 52px;
                      height: 52px;
                      border-radius: 50%;
                      background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
                      align-items: center;
                      justify-content: center;
                      font-size: 24px;
                    ">📦</div>
                  </div>
                  <div style="
                    position: absolute;
                    top: -6px;
                    right: -6px;
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: ${marker.isFree ? '#10B981' : '#3B82F6'};
                    color: white;
                    font-size: 11px;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 3px 8px rgba(0,0,0,0.3);
                    border: 2px solid white;
                  ">
                    ${marker.isFree ? 'D' : 'S'}
                  </div>
                </div>
              `
              
              leafletMarker = L.marker([marker.lat, marker.lng], {
                icon: L.divIcon({
                  className: 'custom-item-marker',
                  html: markerHtml,
                  iconSize: [60, 60],
                  iconAnchor: [30, 30],
                  popupAnchor: [0, -30]
                })
              })
            } else {
              // Fallback to default marker
              leafletMarker = L.marker([marker.lat, marker.lng])
            }
            
            if (marker.title) {
              const popupContent = `
                <div style="text-align: center; min-width: 180px; max-width: 220px;">
                  ${marker.imageUrl ? `
                    <div style="margin-bottom: 12px;">
                      <img 
                        src="${marker.imageUrl}" 
                        alt="${marker.title}"
                        style="
                          width: 80px;
                          height: 80px;
                          border-radius: 12px;
                          object-fit: cover;
                          border: 2px solid ${marker.isFree ? '#10B981' : '#3B82F6'};
                        "
                      />
                    </div>
                  ` : ''}
                  <div style="
                    font-weight: bold; 
                    margin-bottom: 8px; 
                    font-size: 14px;
                    line-height: 1.3;
                    color: #1f2937;
                  ">${marker.title}</div>
                  <div style="
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    background: ${marker.isFree ? '#dcfce7' : '#dbeafe'};
                    color: ${marker.isFree ? '#166534' : '#1e40af'};
                    margin-bottom: 12px;
                  ">
                    <span style="
                      width: 8px;
                      height: 8px;
                      border-radius: 50%;
                      background: ${marker.isFree ? '#10B981' : '#3B82F6'};
                    "></span>
                    ${marker.isFree ? 'Free Drop' : 'For Swap'}
                  </div>
                  ${marker.id ? `
                    <div>
                      <a 
                        href="/item/${marker.id}" 
                        style="
                          display: inline-block;
                          padding: 8px 16px;
                          background: ${marker.isFree ? '#10B981' : '#3B82F6'};
                          color: white;
                          text-decoration: none;
                          border-radius: 8px;
                          font-size: 12px;
                          font-weight: 600;
                          transition: opacity 0.2s ease;
                        "
                        onmouseover="this.style.opacity='0.9'"
                        onmouseout="this.style.opacity='1'"
                      >
                        View Details →
                      </a>
                    </div>
                  ` : ''}
                </div>
              `
              leafletMarker.bindPopup(popupContent, {
                maxWidth: 250,
                className: 'custom-popup'
              })
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