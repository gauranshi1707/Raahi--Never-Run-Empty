'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useTheme } from 'next-themes'
import Header from '@/components/layout/header'
import NextLoadCard from '@/components/driver/next-load-card'
import RouteMap from '@/components/maps/route-map'
import { MapPin, Navigation, Truck, Loader2 } from 'lucide-react'

// Mock simple distance calculation on client side if needed, or we just rely on store logic but since we fetch from API:
function estimateEmptyDistance(cityA: string, cityB: string) {
  // Rough fallback since actual logic is in store.ts
  if (cityA === cityB) return 0;
  return Math.abs(cityA.charCodeAt(0) - cityB.charCodeAt(0)) * 50 + 100;
}

function ActiveTripContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const loadId = searchParams.get('loadId')
  const { resolvedTheme } = useTheme()
  
  const [activeTrip, setActiveTrip] = useState<any>(null)
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the accepted load
        const allRes = await fetch('/api/loads')
        const allLoads = await allRes.json()
        
        let currentLoad = allLoads.find((l: any) => l.id === loadId)
        
        // Fallback: If no load is specified or it wasn't found, find any accepted load
        if (!currentLoad) {
           currentLoad = allLoads.find((l: any) => l.status === 'accepted')
        }

        if (currentLoad) {
          setActiveTrip(currentLoad)
          
          // Find recommendations (Pending loads originating near destination)
          const pendingLoads = allLoads.filter((l: any) => l.status === 'pending')
          
          const loadsWithFuelCalc = pendingLoads.map((l: any) => {
            // Ideally we'd have a distance matrix on client, or from API. Using simple fallback:
            const emptyDist = l.from === currentLoad.to ? 0 : estimateEmptyDistance(currentLoad.to, l.from)
            const fuelCost = emptyDist * 6 // ₹6/km
            return {
              ...l,
              emptyDistanceValue: emptyDist,
              fuelCost: fuelCost
            }
          }).sort((a: any, b: any) => {
            // Sort by lowest fuel cost / highest net earnings
            const netA = a.priceValue - a.fuelCost;
            const netB = b.priceValue - b.fuelCost;
            return netB - netA; // Descending
          })
          
          setRecommendations(loadsWithFuelCalc.slice(0, 2)) // Top 2 recommendations
        }
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [loadId])

  const handleAcceptNext = async (id: string) => {
    try {
      const res = await fetch('/api/load/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loadId: id, driverId: 'driver_current' })
      })
      if (res.ok) {
        window.location.href = `/driver/active?loadId=${id}`; // Force reload to new trip
      }
    } catch (e) {
      console.error(e)
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="animate-spin text-accent h-8 w-8" />
      </div>
    )
  }

  if (!activeTrip) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-semibold mb-4">No Active Trip Found</h2>
        <button onClick={() => router.push('/driver')} className="text-accent underline">
          Return to Dashboard
        </button>
      </div>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-6">
      
      <div className="mb-8 p-6 bg-card border border-border rounded-lg shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Navigation className="text-accent h-6 w-6" />
            Active Trip
          </h1>
          <span className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-sm font-medium">
            In Progress
          </span>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-6">
          <div className="flex-1 w-full text-center md:text-left bg-muted/30 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1 uppercase tracking-wider">Origin</p>
            <p className="text-2xl font-bold flex items-center justify-center md:justify-start gap-2">
              <MapPin className="h-5 w-5 text-accent" />
              {activeTrip.from}
            </p>
          </div>
          
          <div className="hidden md:flex flex-col items-center flex-1">
            <div className="h-px bg-border w-full relative">
              <Truck className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground h-6 w-6 bg-card px-1" />
            </div>
            <p className="text-xs text-muted-foreground mt-3">{activeTrip.distance}</p>
          </div>

          <div className="flex-1 w-full text-center md:text-right bg-muted/30 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground mb-1 uppercase tracking-wider">Destination</p>
            <p className="text-2xl font-bold flex items-center justify-center md:justify-end gap-2">
              <MapPin className="h-5 w-5 text-destructive" />
              {activeTrip.to}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-border pt-6">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Time Estimate</p>
            <p className="font-medium">{activeTrip.timeEstimate}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Goods Type</p>
            <p className="font-medium">{activeTrip.goodsType}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Weight</p>
            <p className="font-medium">{activeTrip.weight}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-1">Price</p>
            <p className="font-medium text-accent">{activeTrip.price}</p>
          </div>
        </div>
      </div>

      {/* Route Map */}
      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <MapPin className="h-5 w-5 text-accent" />
          Route Map
        </h2>
        <RouteMap
          origin={activeTrip.from}
          destination={activeTrip.to}
          nextStop={recommendations[0]?.from}
          isDarkMode={resolvedTheme === 'dark'}
        />
      </div>

      {recommendations.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-xl font-bold">Intelligent Suggestions: Best Next Load</h2>
            <span className="text-xs bg-amber-500/20 text-amber-600 px-2 py-0.5 rounded-full font-medium">To avoid empty return</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map(load => (
              <NextLoadCard
                key={load.id}
                {...load}
                onAccept={() => handleAcceptNext(load.id)}
              />
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-8 text-center">
        <button onClick={() => router.push('/driver')} className="text-sm text-muted-foreground hover:text-foreground">
          Back to Dashboard
        </button>
      </div>

    </main>
  )
}

export default function ActiveTripPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header userRole="driver" />
      <Suspense fallback={<div className="flex justify-center items-center h-[60vh]"><Loader2 className="animate-spin h-8 w-8 text-accent"/></div>}>
        <ActiveTripContent />
      </Suspense>
    </div>
  )
}
