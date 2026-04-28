'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, Fuel, MapPin, IndianRupee } from 'lucide-react'

interface NextLoadCardProps {
  id: string
  from: string
  to: string
  distance: string
  emptyDistanceValue: number
  fuelCost: number
  priceValue: number
  timeEstimate: string
  onAccept?: () => void
}

export default function NextLoadCard({
  id,
  from,
  to,
  distance,
  emptyDistanceValue,
  fuelCost,
  priceValue,
  timeEstimate,
  onAccept,
}: NextLoadCardProps) {
  const netEarnings = priceValue - fuelCost;

  return (
    <div className="bg-card border-2 border-accent/30 rounded-lg p-5 hover:border-accent transition-colors relative overflow-hidden">
      <div className="absolute top-0 right-0 bg-accent text-accent-foreground text-[10px] font-bold px-2 py-1 rounded-bl-lg uppercase tracking-wider">
        Best Match
      </div>

      <div className="flex items-start justify-between mb-4 mt-2">
        <div>
          <p className="text-xs text-muted-foreground font-mono mb-1">RECOMMENDED LOAD</p>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-lg">{from}</span>
            <ArrowRight className="h-5 w-5 text-accent" />
            <span className="font-semibold text-lg">{to}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-border/50">
        <div className="flex items-start gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-xs text-muted-foreground">Empty Run to Pickup</p>
            <p className="font-medium text-sm">{emptyDistanceValue} km</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <Fuel className="h-4 w-4 text-destructive mt-0.5" />
          <div>
            <p className="text-xs text-muted-foreground">Est. Fuel Cost (Empty)</p>
            <p className="font-medium text-sm text-destructive">₹{fuelCost.toLocaleString('en-IN')}</p>
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between mb-5">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Net Earning Potential</p>
          <div className="flex items-center gap-1">
            <IndianRupee className="h-5 w-5 text-green-500" />
            <span className="text-2xl font-bold text-green-500">{netEarnings.toLocaleString('en-IN')}</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">₹{priceValue.toLocaleString('en-IN')} - ₹{fuelCost.toLocaleString('en-IN')} (Fuel)</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground mb-1">Total Trip Distance</p>
          <p className="font-medium">{distance}</p>
        </div>
      </div>

      <Button 
        onClick={onAccept}
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
      >
        Accept Next Trip
      </Button>
    </div>
  )
}
