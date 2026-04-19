'use client'

import { MapPin, Radio } from 'lucide-react'
import ThemeToggle from './theme-toggle'
import Link from 'next/link'

interface HeaderProps {
  userRole?: 'driver' | 'shipper'
}

export default function Header({ userRole = 'driver' }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href={userRole === 'driver' ? '/driver' : '/shipper'} className="flex items-center gap-2">
          <div className="text-2xl font-bold text-accent">Raahi</div>
        </Link>
        
        {userRole === 'driver' && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-accent" />
              <span>Mumbai, MH</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Radio className="h-3 w-3 text-green-500 animate-pulse" />
              <span>Online</span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-2">
          <Link
            href={userRole === 'driver' ? '/shipper' : '/driver'}
            className="text-sm px-3 py-2 rounded-lg hover:bg-secondary transition-colors"
          >
            {userRole === 'driver' ? 'Shipper' : 'Driver'}
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
