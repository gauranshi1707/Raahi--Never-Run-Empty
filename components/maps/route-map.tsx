'use client'

import { useEffect, useMemo, useRef } from 'react'
import dynamic from 'next/dynamic'
import { MapPin, Navigation, Flag } from 'lucide-react'
import L from 'leaflet'

// City coordinates lookup for Indian cities
const cityCoordinates: Record<string, [number, number]> = {
  // Maharashtra
  'Mumbai': [19.0760, 72.8777],
  'Mumbai, MH': [19.0760, 72.8777],
  'Pune': [18.5204, 73.8567],
  'Pune, MH': [18.5204, 73.8567],
  'Nashik': [19.9975, 73.7898],
  'Nashik, MH': [19.9975, 73.7898],
  'Nagpur': [21.1458, 79.0882],
  'Nagpur, MH': [21.1458, 79.0882],
  'Aurangabad': [19.8762, 75.3433],
  'Thane': [19.2183, 72.9781],
  'Kolhapur': [16.7050, 74.2433],
  
  // Gujarat
  'Ahmedabad': [23.0225, 72.5714],
  'Ahmedabad, GJ': [23.0225, 72.5714],
  'Surat': [21.1702, 72.8311],
  'Surat, GJ': [21.1702, 72.8311],
  'Vadodara': [22.3072, 73.1812],
  'Rajkot': [22.3039, 70.8022],
  
  // Karnataka
  'Bangalore': [12.9716, 77.5946],
  'Bengaluru': [12.9716, 77.5946],
  'Mysore': [12.2958, 76.6394],
  'Hubli': [15.3647, 75.1240],
  
  // Tamil Nadu
  'Chennai': [13.0827, 80.2707],
  'Chennai, TN': [13.0827, 80.2707],
  'Coimbatore': [11.0168, 76.9558],
  'Madurai': [9.9252, 78.1198],
  
  // Telangana / Andhra Pradesh
  'Hyderabad': [17.3850, 78.4867],
  'Hyderabad, TS': [17.3850, 78.4867],
  'Visakhapatnam': [17.6868, 83.2185],
  'Vijayawada': [16.5062, 80.6480],
  
  // North India
  'Delhi': [28.7041, 77.1025],
  'New Delhi': [28.6139, 77.2090],
  'Jaipur': [26.9124, 75.7873],
  'Jaipur, RJ': [26.9124, 75.7873],
  'Lucknow': [26.8467, 80.9462],
  'Kanpur': [26.4499, 80.3319],
  'Agra': [27.1767, 78.0081],
  'Chandigarh': [30.7333, 76.7794],
  'Amritsar': [31.6340, 74.8723],
  
  // West Bengal / East India
  'Kolkata': [22.5726, 88.3639],
  'Kolkata, WB': [22.5726, 88.3639],
  'Patna': [25.5941, 85.1376],
  'Ranchi': [23.3441, 85.3096],
  'Bhubaneswar': [20.2961, 85.8245],
  
  // Madhya Pradesh
  'Indore': [22.7196, 75.8577],
  'Indore, MP': [22.7196, 75.8577],
  'Bhopal': [23.2599, 77.4126],
  'Gwalior': [26.2183, 78.1828],
  
  // Kerala / Goa
  'Kochi': [9.9312, 76.2673],
  'Thiruvananthapuram': [8.5241, 76.9366],
  'Goa': [15.2993, 74.1240],
  'Panaji': [15.4909, 73.8278],
}

// Get coordinates for a city name (with fuzzy matching)
function getCoordinates(cityName: string): [number, number] {
  // Direct match
  if (cityCoordinates[cityName]) {
    return cityCoordinates[cityName]
  }
  
  // Try without state suffix
  const cityOnly = cityName.split(',')[0].trim()
  if (cityCoordinates[cityOnly]) {
    return cityCoordinates[cityOnly]
  }
  
  // Fuzzy match - find city that starts with the input
  const lowerCity = cityOnly.toLowerCase()
  for (const [key, coords] of Object.entries(cityCoordinates)) {
    if (key.toLowerCase().startsWith(lowerCity) || lowerCity.startsWith(key.toLowerCase().split(',')[0])) {
      return coords
    }
  }
  
  // Default to Mumbai if not found
  return [19.0760, 72.8777]
}

// Create custom marker icons
function createIcon(color: string, label: string) {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        background: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      ">
        <span style="
          transform: rotate(45deg);
          color: white;
          font-weight: bold;
          font-size: 14px;
        ">${label}</span>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  })
}

interface RouteMapProps {
  origin: string
  destination: string
  nextStop?: string
  isDarkMode?: boolean
}

// Dynamically import MapContainer to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)

const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)

const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)

const Popup = dynamic(
  () => import('react-leaflet').then((mod) => mod.Popup),
  { ssr: false }
)

const Polyline = dynamic(
  () => import('react-leaflet').then((mod) => mod.Polyline),
  { ssr: false }
)

// Component to fit bounds after map loads
function FitBoundsComponent({ bounds }: { bounds: L.LatLngBoundsExpression }) {
  const map = useMapRef()
  
  useEffect(() => {
    if (map) {
      map.fitBounds(bounds, { padding: [50, 50] })
    }
  }, [map, bounds])
  
  return null
}

// Hook to get map reference
function useMapRef() {
  const mapRef = useRef<L.Map | null>(null)
  
  useEffect(() => {
    // Access map through the container
    const container = document.querySelector('.leaflet-container')
    if (container && (container as any)._leaflet_map) {
      mapRef.current = (container as any)._leaflet_map
    }
  }, [])
  
  return mapRef.current
}

// Inner map component that uses the map hooks
const MapContent = dynamic(
  () => Promise.resolve(({ 
    originCoords, 
    destCoords, 
    nextStopCoords,
    origin,
    destination,
    nextStop,
    isDarkMode
  }: {
    originCoords: [number, number]
    destCoords: [number, number]
    nextStopCoords?: [number, number]
    origin: string
    destination: string
    nextStop?: string
    isDarkMode: boolean
  }) => {
    const { useMap } = require('react-leaflet')
    
    function FitBounds() {
      const map = useMap()
      
      useEffect(() => {
        const points: [number, number][] = [originCoords, destCoords]
        if (nextStopCoords) points.push(nextStopCoords)
        
        const bounds = L.latLngBounds(points.map(p => L.latLng(p[0], p[1])))
        map.fitBounds(bounds, { padding: [50, 50] })
      }, [map])
      
      return null
    }
    
    // Create route path
    const routePath: [number, number][] = nextStopCoords 
      ? [originCoords, destCoords, nextStopCoords]
      : [originCoords, destCoords]
    
    // Create icons
    const originIcon = createIcon('#22c55e', 'A')
    const destIcon = createIcon('#ef4444', 'B')
    const nextIcon = createIcon('#3b82f6', 'C')
    
    return (
      <>
        <FitBounds />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url={isDarkMode 
            ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
            : 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          }
        />
        
        {/* Route polyline */}
        <Polyline
          positions={routePath}
          pathOptions={{
            color: '#d97706',
            weight: 4,
            opacity: 0.8,
            dashArray: '10, 10',
          }}
        />
        
        {/* Origin marker */}
        <Marker position={originCoords} icon={originIcon}>
          <Popup>
            <div className="text-sm">
              <p className="font-semibold text-green-600">A - Origin</p>
              <p>{origin}</p>
            </div>
          </Popup>
        </Marker>
        
        {/* Destination marker */}
        <Marker position={destCoords} icon={destIcon}>
          <Popup>
            <div className="text-sm">
              <p className="font-semibold text-red-600">B - Destination</p>
              <p>{destination}</p>
            </div>
          </Popup>
        </Marker>
        
        {/* Next stop marker (if provided) */}
        {nextStopCoords && nextStop && (
          <Marker position={nextStopCoords} icon={nextIcon}>
            <Popup>
              <div className="text-sm">
                <p className="font-semibold text-blue-600">C - Next Load</p>
                <p>{nextStop}</p>
              </div>
            </Popup>
          </Marker>
        )}
      </>
    )
  }),
  { ssr: false }
)

export default function RouteMap({ origin, destination, nextStop, isDarkMode = false }: RouteMapProps) {
  const originCoords = useMemo(() => getCoordinates(origin), [origin])
  const destCoords = useMemo(() => getCoordinates(destination), [destination])
  const nextStopCoords = useMemo(() => nextStop ? getCoordinates(nextStop) : undefined, [nextStop])
  
  // Calculate center point
  const center = useMemo((): [number, number] => {
    const lat = (originCoords[0] + destCoords[0]) / 2
    const lng = (originCoords[1] + destCoords[1]) / 2
    return [lat, lng]
  }, [originCoords, destCoords])
  
  return (
    <div className="flex flex-col gap-4">
      {/* Map container */}
      <div className="relative w-full h-[400px] rounded-xl overflow-hidden border border-border shadow-sm">
        <MapContainer
          center={center}
          zoom={7}
          scrollWheelZoom={true}
          className="w-full h-full z-0"
          style={{ background: isDarkMode ? '#1a1a2e' : '#f5f5f5' }}
        >
          <MapContent
            originCoords={originCoords}
            destCoords={destCoords}
            nextStopCoords={nextStopCoords}
            origin={origin}
            destination={destination}
            nextStop={nextStop}
            isDarkMode={isDarkMode}
          />
        </MapContainer>
      </div>
      
      {/* Route legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">A</span>
          </div>
          <span className="text-muted-foreground">Origin: {origin}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">B</span>
          </div>
          <span className="text-muted-foreground">Destination: {destination}</span>
        </div>
        {nextStop && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-white text-xs font-bold">C</span>
            </div>
            <span className="text-muted-foreground">Next Load: {nextStop}</span>
          </div>
        )}
      </div>
    </div>
  )
}
