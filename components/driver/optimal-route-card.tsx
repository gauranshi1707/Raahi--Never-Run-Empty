'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'

export default function OptimalRouteCard() {
  return (
    <div className="bg-card border-2 border-accent rounded-lg p-6 mb-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm text-muted-foreground mb-1">Optimal Route for You</h3>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold">Mumbai</span>
            <ArrowRight className="h-5 w-5 text-accent" />
            <span className="text-lg font-semibold">Pune</span>
          </div>
        </div>
        <Badge className="bg-accent text-accent-foreground">Return Trip Assured</Badge>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <div>
          <p className="text-sm text-muted-foreground mb-1">Earnings</p>
          <p className="text-2xl font-bold text-accent">₹8,500</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground mb-1">Distance</p>
          <p className="text-2xl font-bold">148 km</p>
        </div>
      </div>

      <div className="text-sm text-muted-foreground mb-4">
        Estimated time: <span className="font-medium text-foreground">4-5 hours</span>
      </div>

      <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
        Accept Next Load
      </Button>
    </div>
  )
}
