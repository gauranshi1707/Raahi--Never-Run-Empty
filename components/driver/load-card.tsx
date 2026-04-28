'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'

interface LoadCardProps {
  id: string
  from: string
  to: string
  distance: string
  weight: string
  goodsType: string
  price: string
  timeEstimate: string
  tag: string
  onAccept?: () => void
}

export default function LoadCard({
  id,
  from,
  to,
  distance,
  weight,
  goodsType,
  price,
  timeEstimate,
  tag,
  onAccept,
}: LoadCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:border-accent/50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs text-muted-foreground font-mono">ID: {id}</p>
        <Badge variant="outline" className="text-xs">{tag}</Badge>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="font-semibold">{from}</span>
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
        <span className="font-semibold">{to}</span>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3 text-sm">
        <div>
          <p className="text-muted-foreground text-xs mb-1">Distance</p>
          <p className="font-semibold">{distance}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs mb-1">Weight</p>
          <p className="font-semibold">{weight}</p>
        </div>
        <div>
          <p className="text-muted-foreground text-xs mb-1">Type</p>
          <p className="font-semibold">{goodsType}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-3 pb-3 border-t border-border">
        <div>
          <p className="text-muted-foreground text-xs mb-1">Price</p>
          <p className="text-xl font-bold text-accent">{price}</p>
        </div>
        <div className="text-right">
          <p className="text-muted-foreground text-xs mb-1">Time Est.</p>
          <p className="font-semibold">{timeEstimate}</p>
        </div>
      </div>

      <Button 
        onClick={onAccept}
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
      >
        Accept Load
      </Button>
    </div>
  )
}
