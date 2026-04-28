'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, AlertCircle, TrendingUp, IndianRupee, Fuel } from 'lucide-react'
import { getDistance } from '@/lib/utils'

interface OptimalRouteCardProps {
  loads?: any[]
  currentLocation?: string
  onAcceptRoute?: (loadId: string) => void
}

export default function OptimalRouteCard({ loads = [], currentLocation = 'Mumbai', onAcceptRoute }: OptimalRouteCardProps) {
  // 1-step lookahead route matching logic
  // Returns { bestLoad1, bestLoad2, score, totalEarnings, fuelCost, routeText }
  const findBestRoute = () => {
    if (!loads || loads.length === 0) return null

    let bestScore = -Infinity
    let bestMatch = null

    // Find all loads from 'currentLocation' (A -> B)
    const availableLoad1s = loads.filter(l => l.from === currentLocation)

    // If no loads from current location, we could fallback to any load, but requirements say "From current location A"
    if (availableLoad1s.length === 0) return null

    availableLoad1s.forEach(load1 => {
      // Look ahead to next loads (C -> D) where C could be anywhere, but ideally B
      const availableLoad2s = loads.filter(l => l.id !== load1.id)

      if (availableLoad2s.length === 0) {
        // Only 1 load available overall
        const score = load1.priceValue
        if (score > bestScore) {
          bestScore = score
          bestMatch = {
            load1,
            load2: null,
            score,
            totalEarnings: load1.priceValue,
            fuelCost: 0,
            routeText: `${load1.from} -> ${load1.to}`
          }
        }
        return
      }

      availableLoad2s.forEach(load2 => {
        // Calculate earnings
        const totalEarnings = load1.priceValue + load2.priceValue
        
        // Calculate empty run fuel cost from B (load1.to) to C (load2.from)
        // Ensure distance is at least 0
        const emptyDistance = load1.to === load2.from ? 0 : getDistance(load1.to, load2.from)
        const fuelCost = emptyDistance * 6 // ₹6/km

        const score = totalEarnings - fuelCost

        if (score > bestScore) {
          bestScore = score
          
          let routeText = `${load1.from} -> ${load1.to}`
          if (load1.to === load2.from) {
             routeText += ` -> ${load2.to}`
          } else {
             routeText += ` (empty to ${load2.from}) -> ${load2.to}`
          }

          bestMatch = {
            load1,
            load2,
            score,
            totalEarnings,
            fuelCost,
            routeText
          }
        }
      })
    })

    return bestMatch
  }

  const bestRoute = findBestRoute()

  if (!bestRoute) {
    return (
      <div className="bg-card border-2 border-border dashed rounded-lg p-6 mb-6 flex flex-col items-center justify-center text-center">
        <AlertCircle className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No optimal routes currently available from {currentLocation}.</p>
      </div>
    )
  }

  const { load1, load2, totalEarnings, fuelCost, score, routeText } = bestRoute

  // If there's an empty run, format nicely
  const parts = routeText.split('->').map(p => p.trim())

  return (
    <div className="bg-card border-2 border-emerald-500/50 rounded-lg p-6 mb-6 relative overflow-hidden shadow-sm hover:border-emerald-500 transition-colors">
      <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider flex items-center gap-1">
        <TrendingUp className="h-3 w-3" /> Recommended Route
      </div>

      <div className="flex flex-col md:flex-row md:items-start justify-between mb-5 mt-2 gap-4">
        <div className="flex-1">
          <h3 className="text-xs text-muted-foreground font-mono mb-2 uppercase tracking-wider">High Profit Multi-Step Journey</h3>
          
          <div className="flex flex-wrap items-center gap-2 text-lg font-bold">
            <span className="text-foreground">{load1.from}</span>
            <ArrowRight className="h-5 w-5 text-emerald-500" />
            <span className="text-foreground">{load1.to}</span>
            
            {load2 && (
              <>
                {load1.to !== load2.from ? (
                   <div className="flex items-center gap-1 px-2 py-0.5 bg-muted rounded text-xs font-medium text-muted-foreground mx-1">
                     <Fuel className="h-3 w-3" /> empty to {load2.from}
                   </div>
                ) : (
                   <ArrowRight className="h-5 w-5 text-emerald-500" />
                )}
                {load1.to !== load2.from && <ArrowRight className="h-5 w-5 text-emerald-500" />}
                <span className="text-foreground">{load2.to}</span>
              </>
            )}
          </div>
        </div>
        
        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-none">
          Optimized match
        </Badge>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-5 p-4 bg-muted/30 rounded-lg border border-border/50">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Total Earnings</p>
          <p className="text-xl font-bold">₹{totalEarnings.toLocaleString('en-IN')}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Est. Fuel Cost (Empty)</p>
          <p className="text-xl font-bold text-destructive">₹{fuelCost.toLocaleString('en-IN')}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Net Profit</p>
          <p className="text-2xl font-bold text-emerald-600 flex items-center gap-1">
            <IndianRupee className="h-5 w-5" />
            {score.toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      <div className="flex md:items-center flex-col md:flex-row justify-between gap-4">
        <div className="text-xs text-muted-foreground">
          Accepting this route will immediately lock in the first leg: <span className="font-semibold">{load1.from} → {load1.to}</span>
        </div>
        <Button 
          onClick={() => onAcceptRoute && onAcceptRoute(load1.id)}
          className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 text-white shadow-md font-semibold"
        >
          Accept Route First Leg
        </Button>
      </div>
    </div>
  )
}
