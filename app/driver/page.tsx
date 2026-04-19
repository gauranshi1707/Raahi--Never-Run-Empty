'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Header from '@/components/layout/header'
import OptimalRouteCard from '@/components/driver/optimal-route-card'
import LoadCard from '@/components/driver/load-card'

export default function DriverDashboard() {
  const [activeTab, setActiveTab] = useState('all')
  const [loads, setLoads] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const fetchLoads = async () => {
    try {
      const res = await fetch('/api/loads?status=pending')
      const data = await res.json()
      setLoads(data)
    } catch (e) {
      console.error(e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLoads()
    const interval = setInterval(fetchLoads, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleAcceptLoad = async (id: string) => {
    try {
      const res = await fetch('/api/load/accept', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loadId: id, driverId: 'driver_current' })
      })
      if (res.ok) {
        // Successful acceptance, redirect to active trip page
        router.push(`/driver/active?loadId=${id}`)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const filteredLoads = loads.filter(load => {
    if (activeTab === 'all') return true
    if (activeTab === 'near') return load.tag === 'Near Me'
    if (activeTab === 'premium') return load.tag === 'Premium'
    return true
  })

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="driver" />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <OptimalRouteCard loads={loads} currentLocation="Mumbai" onAcceptRoute={handleAcceptLoad} />

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Available Loads</h2>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="all">All Loads</TabsTrigger>
              <TabsTrigger value="near">Near Me</TabsTrigger>
              <TabsTrigger value="premium">Premium</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {isLoading ? (
                 <div className="text-center py-12"><p className="text-muted-foreground">Loading...</p></div>
              ) : filteredLoads.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredLoads.map((load) => (
                    <LoadCard
                      key={load.id}
                      {...load}
                      onAccept={() => handleAcceptLoad(load.id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No pending loads available.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
