'use client'

import { useState } from 'react'
import Header from '@/components/layout/header'
import PostLoadForm from '@/components/shipper/post-load-form'
import ActiveLoadItem from '@/components/shipper/active-load-item'
import { mockShipperLoads } from '@/lib/mock-data'

export default function ShipperDashboard() {
  const [loads, setLoads] = useState(mockShipperLoads)

  const handlePostLoad = (data: any) => {
    const newLoad = {
      id: `SL${String(loads.length + 1).padStart(3, '0')}`,
      from: data.from,
      to: data.to,
      weight: `${data.weight} tons`,
      price: `₹${data.price}`,
      status: 'Pending' as const,
      postedAt: 'Just now',
    }
    setLoads([newLoad, ...loads])
  }

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="shipper" />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <PostLoadForm onSubmit={handlePostLoad} />

        <div>
          <h2 className="text-2xl font-bold mb-6">Active Loads</h2>

          {loads.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loads.map((load) => (
                <ActiveLoadItem
                  key={load.id}
                  {...load}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No active loads. Post one to get started!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
