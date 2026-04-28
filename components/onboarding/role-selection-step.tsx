'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Truck, Package } from 'lucide-react'

interface RoleSelectionStepProps {
  onSelectRole: (role: 'driver' | 'shipper') => void
  onBack: () => void
}

export default function RoleSelectionStep({ onSelectRole, onBack }: RoleSelectionStepProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold mb-2 text-center">What&apos;s Your Role?</h2>
      <p className="text-muted-foreground mb-8 text-center">Choose how you want to use Raahi</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card
          onClick={() => onSelectRole('driver')}
          className="p-6 cursor-pointer hover:border-accent transition-colors border-2 hover:bg-accent/5"
        >
          <div className="flex flex-col items-center text-center">
            <Truck className="h-12 w-12 text-accent mb-4" />
            <h3 className="text-xl font-bold mb-2">Driver</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Find and accept loads to transport goods
            </p>
            <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              Continue as Driver
            </Button>
          </div>
        </Card>

        <Card
          onClick={() => onSelectRole('shipper')}
          className="p-6 cursor-pointer hover:border-accent transition-colors border-2 hover:bg-accent/5"
        >
          <div className="flex flex-col items-center text-center">
            <Package className="h-12 w-12 text-accent mb-4" />
            <h3 className="text-xl font-bold mb-2">Shipper</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Post loads and connect with available drivers
            </p>
            <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
              Continue as Shipper
            </Button>
          </div>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={onBack}
          variant="outline"
          className="w-full md:w-auto"
        >
          Back
        </Button>
      </div>
    </div>
  )
}
