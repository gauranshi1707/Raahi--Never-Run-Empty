'use client'

import { useState, useCallback, useEffect } from 'react'
import {
  GoogleMap,
  useJsApiLoader,
  DirectionsRenderer,
  Marker,
  InfoWindow,
} from '@react-google-maps/api'
import { Fuel, Utensils, Hotel, Loader2, MapPin } from 'lucide-react'

const libraries: ('places')[] = ['places']

const mapContainerStyle = {
  width: '100%',
  height: '100%',
}

const defaultCenter = {
  lat: 19.076,
  lng: 72.8777,
}

// Map styles for light mode
const lightMapStyles: google.maps.MapTypeStyle[] = []

// Map styles for dark mode
const darkMapStyles: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
  {
    featureType: 'administrative.locality',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry',
    stylers: [{ color: '#263c3f' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#6b9a76' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#38414e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#212a37' }],
  },
  {
    featureType: 'road',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9ca5b3' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#746855' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#1f2835' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#f3d19c' }],
  },
  {
    featureType: 'transit',
    elementType: 'geometry',
    stylers: [{ color: '#2f3948' }],
  },
  {
    featureType: 'transit.station',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#d59563' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#17263c' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#515c6d' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.stroke',
    stylers: [{ color: '#17263c' }],
  },
]

interface POI {
  id: string
  name: string
  location: google.maps.LatLngLiteral
  type: 'fuel' | 'restaurant' | 'hotel'
  address?: string
  rating?: number
}

interface RouteMapProps {
  origin: string
  destination: string
  isDarkMode?: boolean
}

export default function RouteMap({ origin, destination, isDarkMode = false }: RouteMapProps) {
  const [directions, setDirections] = useState<google.maps.DirectionsResult | null>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [pois, setPois] = useState<POI[]>([])
  const [activePOIType, setActivePOIType] = useState<'fuel' | 'restaurant' | 'hotel' | null>(null)
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null)
  const [isLoadingPOI, setIsLoadingPOI] = useState(false)

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey || '',
    libraries,
  })

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

  // Calculate route when component mounts or origin/destination changes
  useEffect(() => {
    if (!isLoaded || !origin || !destination) return

    const directionsService = new google.maps.DirectionsService()

    directionsService.route(
      {
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK && result) {
          setDirections(result)
        }
      }
    )
  }, [isLoaded, origin, destination])

  // Search for POIs along the route
  const searchPOIs = useCallback(
    (type: 'fuel' | 'restaurant' | 'hotel') => {
      if (!map || !directions) return

      // Toggle off if same type clicked
      if (activePOIType === type) {
        setActivePOIType(null)
        setPois([])
        setSelectedPOI(null)
        return
      }

      setIsLoadingPOI(true)
      setActivePOIType(type)
      setPois([])
      setSelectedPOI(null)

      const route = directions.routes[0]
      if (!route) {
        setIsLoadingPOI(false)
        return
      }

      // Get points along the route to search
      const path = route.overview_path
      const searchPoints: google.maps.LatLng[] = []

      // Sample points along the route (every ~50km)
      const totalDistance = route.legs.reduce((acc, leg) => acc + (leg.distance?.value || 0), 0)
      const interval = Math.max(1, Math.floor(path.length / Math.ceil(totalDistance / 50000)))

      for (let i = 0; i < path.length; i += interval) {
        searchPoints.push(path[i])
      }

      const placesService = new google.maps.places.PlacesService(map)
      const typeMapping = {
        fuel: 'gas_station',
        restaurant: 'restaurant',
        hotel: 'lodging',
      }

      const allResults: POI[] = []
      let completedSearches = 0

      searchPoints.forEach((point) => {
        const request: google.maps.places.PlaceSearchRequest = {
          location: point,
          radius: 5000,
          type: typeMapping[type],
        }

        placesService.nearbySearch(request, (results, status) => {
          completedSearches++

          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            results.slice(0, 3).forEach((place) => {
              if (place.place_id && place.geometry?.location) {
                const poi: POI = {
                  id: place.place_id,
                  name: place.name || 'Unknown',
                  location: {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng(),
                  },
                  type,
                  address: place.vicinity,
                  rating: place.rating,
                }

                // Avoid duplicates
                if (!allResults.find((p) => p.id === poi.id)) {
                  allResults.push(poi)
                }
              }
            })
          }

          if (completedSearches === searchPoints.length) {
            setPois(allResults)
            setIsLoadingPOI(false)
          }
        })
      })
    },
    [map, directions, activePOIType]
  )

  const getMarkerIcon = (type: 'fuel' | 'restaurant' | 'hotel') => {
    const colors = {
      fuel: '#ef4444',
      restaurant: '#f97316',
      hotel: '#3b82f6',
    }
    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: colors[type],
      fillOpacity: 1,
      strokeColor: '#ffffff',
      strokeWeight: 2,
      scale: 8,
    }
  }

  // Fallback UI when API key is missing
  if (!apiKey) {
    return (
      <div className="flex flex-col gap-4">
        <div className="relative w-full h-64 bg-muted rounded-xl overflow-hidden flex items-center justify-center">
          <div className="text-center p-6">
            <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground text-sm">
              Google Maps API key not configured
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable maps
            </p>
            <div className="mt-4 p-3 bg-card rounded-lg text-left">
              <p className="text-sm font-medium">{origin}</p>
              <p className="text-xs text-muted-foreground">to</p>
              <p className="text-sm font-medium">{destination}</p>
            </div>
          </div>
        </div>
        <POIButtons
          activePOIType={null}
          isLoadingPOI={false}
          onSearch={() => {}}
          disabled
        />
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="w-full h-64 bg-muted rounded-xl flex items-center justify-center">
        <p className="text-muted-foreground">Error loading maps</p>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-64 bg-muted rounded-xl flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative w-full h-64 rounded-xl overflow-hidden">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={defaultCenter}
          zoom={10}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{
            styles: isDarkMode ? darkMapStyles : lightMapStyles,
            disableDefaultUI: true,
            zoomControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          }}
        >
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                suppressMarkers: false,
                polylineOptions: {
                  strokeColor: '#d97706',
                  strokeWeight: 5,
                  strokeOpacity: 0.8,
                },
              }}
            />
          )}

          {pois.map((poi) => (
            <Marker
              key={poi.id}
              position={poi.location}
              icon={getMarkerIcon(poi.type)}
              onClick={() => setSelectedPOI(poi)}
            />
          ))}

          {selectedPOI && (
            <InfoWindow
              position={selectedPOI.location}
              onCloseClick={() => setSelectedPOI(null)}
            >
              <div className="p-1 text-foreground">
                <p className="font-semibold text-sm">{selectedPOI.name}</p>
                {selectedPOI.address && (
                  <p className="text-xs text-muted-foreground mt-1">{selectedPOI.address}</p>
                )}
                {selectedPOI.rating && (
                  <p className="text-xs text-accent mt-1">Rating: {selectedPOI.rating}/5</p>
                )}
              </div>
            </InfoWindow>
          )}
        </GoogleMap>

        {isLoadingPOI && (
          <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        )}
      </div>

      <POIButtons
        activePOIType={activePOIType}
        isLoadingPOI={isLoadingPOI}
        onSearch={searchPOIs}
      />
    </div>
  )
}

interface POIButtonsProps {
  activePOIType: 'fuel' | 'restaurant' | 'hotel' | null
  isLoadingPOI: boolean
  onSearch: (type: 'fuel' | 'restaurant' | 'hotel') => void
  disabled?: boolean
}

function POIButtons({ activePOIType, isLoadingPOI, onSearch, disabled = false }: POIButtonsProps) {
  const buttons = [
    { type: 'fuel' as const, label: 'Fuel Stations', icon: Fuel, color: 'text-red-500' },
    { type: 'restaurant' as const, label: 'Restaurants', icon: Utensils, color: 'text-orange-500' },
    { type: 'hotel' as const, label: 'Hotels', icon: Hotel, color: 'text-blue-500' },
  ]

  return (
    <div className="flex gap-2 flex-wrap">
      {buttons.map(({ type, label, icon: Icon, color }) => (
        <button
          key={type}
          onClick={() => onSearch(type)}
          disabled={disabled || isLoadingPOI}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activePOIType === type
              ? 'bg-accent text-accent-foreground'
              : 'bg-secondary hover:bg-secondary/80 text-secondary-foreground'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <Icon className={`h-4 w-4 ${activePOIType === type ? '' : color}`} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  )
}
