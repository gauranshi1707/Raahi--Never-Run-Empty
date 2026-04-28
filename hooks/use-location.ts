'use client'

import { useState, useEffect } from 'react'

interface LocationState {
  city: string
  state: string
  loading: boolean
  error: string | null
  coordinates: { lat: number; lng: number } | null
}

const LOCATION_STORAGE_KEY = 'raahi_user_location'
const COORDS_STORAGE_KEY = 'raahi_user_coords'

export function useLocation() {
  const [location, setLocation] = useState<LocationState>({
    city: '',
    state: '',
    loading: true,
    error: null,
    coordinates: null,
  })

  useEffect(() => {
    // Check localStorage first
    const storedLocation = localStorage.getItem(LOCATION_STORAGE_KEY)
    const storedCoords = localStorage.getItem(COORDS_STORAGE_KEY)
    
    if (storedLocation && storedCoords) {
      const parsed = JSON.parse(storedLocation)
      const coords = JSON.parse(storedCoords)
      setLocation({
        city: parsed.city,
        state: parsed.state,
        loading: false,
        error: null,
        coordinates: coords,
      })
      return
    }

    // Request geolocation
    if (!navigator.geolocation) {
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: 'Geolocation not supported',
      }))
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        const coords = { lat: latitude, lng: longitude }
        
        try {
          // Reverse geocode using Google Maps API
          const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
          
          if (!apiKey) {
            // Fallback: use coordinates to estimate location
            setLocation({
              city: 'Location detected',
              state: '',
              loading: false,
              error: null,
              coordinates: coords,
            })
            localStorage.setItem(COORDS_STORAGE_KEY, JSON.stringify(coords))
            return
          }

          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${apiKey}`
          )
          const data = await response.json()

          if (data.status === 'OK' && data.results.length > 0) {
            const addressComponents = data.results[0].address_components
            let city = ''
            let state = ''

            for (const component of addressComponents) {
              if (component.types.includes('locality')) {
                city = component.long_name
              }
              if (component.types.includes('administrative_area_level_1')) {
                state = component.short_name
              }
            }

            const locationData = { city, state }
            localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(locationData))
            localStorage.setItem(COORDS_STORAGE_KEY, JSON.stringify(coords))

            setLocation({
              city,
              state,
              loading: false,
              error: null,
              coordinates: coords,
            })
          } else {
            setLocation({
              city: 'Location detected',
              state: '',
              loading: false,
              error: null,
              coordinates: coords,
            })
            localStorage.setItem(COORDS_STORAGE_KEY, JSON.stringify(coords))
          }
        } catch {
          setLocation({
            city: 'Location detected',
            state: '',
            loading: false,
            error: null,
            coordinates: coords,
          })
          localStorage.setItem(COORDS_STORAGE_KEY, JSON.stringify(coords))
        }
      },
      (error) => {
        let errorMessage = 'Location unavailable'
        if (error.code === error.PERMISSION_DENIED) {
          errorMessage = 'Location unavailable'
        }
        setLocation({
          city: '',
          state: '',
          loading: false,
          error: errorMessage,
          coordinates: null,
        })
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 600000, // Cache for 10 minutes
      }
    )
  }, [])

  const displayLocation = location.error
    ? location.error
    : location.city && location.state
    ? `${location.city}, ${location.state}`
    : location.city
    ? location.city
    : 'Detecting...'

  return {
    ...location,
    displayLocation,
  }
}
