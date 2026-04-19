'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Header from '@/components/layout/header'
import OptimalRouteCard from '@/components/driver/optimal-route-card'
import LoadCard from '@/components/driver/load-card'
import { mockDriverLoads } from '@/lib/mock-data'

export default function DriverDashboard() {
  const [activeTab, setActiveTab] = useState('all')

  const filteredLoads = mockDriverLoads.filter(load => {
    if (activeTab === 'all') return true
    if (activeTab === 'near') return load.tag === 'Near Me'
    if (activeTab === 'premium') return load.tag === 'Premium'
    return true
  })

  return (
    <div className="min-h-screen bg-background">
      <Header userRole="driver" />
      
      <main className="max-w-7xl mx-auto px-4 py-6">
        <OptimalRouteCard />

        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-4">Available Loads</h2>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="all">All Loads</TabsTrigger>
              <TabsTrigger value="near">Near Me</TabsTrigger>
              <TabsTrigger value="premium">Premium</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="space-y-4">
              {filteredLoads.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredLoads.map((load) => (
                    <LoadCard
                      key={load.id}
                      {...load}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No loads available in this category</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
