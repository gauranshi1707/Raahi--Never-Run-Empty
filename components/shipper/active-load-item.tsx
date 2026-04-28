'use client'

import { Badge } from '@/components/ui/badge'
import { ArrowRight } from 'lucide-react'

interface ActiveLoadItemProps {
  id: string
  from: string
  to: string
  weight: string
  price: string
  status: 'Pending' | 'In Transit' | 'Delivered'
  postedAt: string
}

export default function ActiveLoadItem({
  id,
  from,
  to,
  weight,
  price,
  status,
  postedAt,
}: ActiveLoadItemProps) {
  const statusColors = {
    Pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    'In Transit': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    Delivered: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  }

  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:border-accent/50 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <p className="text-xs text-muted-foreground font-mono">ID: {id}</p>
        <Badge className={statusColors[status]}>{status}</Badge>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="font-semibold">{from}</span>
        <ArrowRight className="h-4 w-4 text-muted-foreground" />
        <span className="font-semibold">{to}</span>
      </div>

      <div className="flex items-center justify-between mb-2">
        <div className="text-sm">
          <p className="text-muted-foreground text-xs">Weight</p>
          <p className="font-semibold">{weight}</p>
        </div>
        <div className="text-sm">
          <p className="text-muted-foreground text-xs">Price</p>
          <p className="text-lg font-bold text-accent">{price}</p>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">Posted {postedAt}</p>
    </div>
  )
}
