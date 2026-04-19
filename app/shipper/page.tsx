'use client'

import { useState, useEffect } from 'react'
import Header from '@/components/layout/header'
import PostLoadForm from '@/components/shipper/post-load-form'
import ActiveLoadItem from '@/components/shipper/active-load-item'

export default function ShipperDashboard() {
  const [loads, setLoads] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchLoads = async () => {
    try {
      const res = await fetch('/api/loads')
      const data = await res.json()
      // Filter for shipper loads we posted here or just show all for demo
      setLoads(data)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLoads()
    const interval = setInterval(fetchLoads, 5000) // Poll every 5s for real-time feel
    return () => clearInterval(interval)
  }, [])

  const handlePostLoad = async (data: any) => {
    try {
      const res = await fetch('/api/loads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        fetchLoads() // Refresh
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="shipper" />

      <main className="max-w-7xl mx-auto px-4 py-6">
        <PostLoadForm onSubmit={handlePostLoad} />

        <div>
          <h2 className="text-2xl font-bold mb-6">Active Loads</h2>

          {isLoading ? (
            <div className="text-center py-12"><p className="text-muted-foreground">Loading...</p></div>
          ) : loads.length > 0 ? (
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
