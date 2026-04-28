'use client'

import { MapPin, Radio, User, Settings, LogOut, Truck, Package } from 'lucide-react'
import ThemeToggle from './theme-toggle'
import Link from 'next/link'
import Image from 'next/image'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface HeaderProps {
  userRole?: 'driver' | 'shipper'
}

export default function Header({ userRole = 'driver' }: HeaderProps) {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href={userRole === 'driver' ? '/driver' : '/shipper'} className="flex items-center gap-2">
          {/* Light mode logo */}
          <Image
            src="/images/raahi-logo-light.jpeg"
            alt="Raahi"
            width={44}
            height={44}
            className="block dark:hidden rounded-lg object-contain"
          />
          {/* Dark mode logo */}
          <Image
            src="/images/raahi-logo-dark.png"
            alt="Raahi"
            width={44}
            height={44}
            className="hidden dark:block rounded-lg object-contain"
          />
          <span className="text-2xl font-bold text-accent">Raahi</span>
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
          <ThemeToggle />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/10 hover:bg-accent/20 transition-colors">
                <User className="h-5 w-5 text-accent" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium">Rajesh Kumar</p>
                  <p className="text-xs text-muted-foreground">
                    {userRole === 'driver' ? 'Driver' : 'Shipper'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link 
                  href={userRole === 'driver' ? '/shipper' : '/driver'} 
                  className="flex items-center gap-2 cursor-pointer"
                >
                  {userRole === 'driver' ? (
                    <>
                      <Package className="h-4 w-4" />
                      <span>Switch to Shipper</span>
                    </>
                  ) : (
                    <>
                      <Truck className="h-4 w-4" />
                      <span>Switch to Driver</span>
                    </>
                  )}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/settings" className="flex items-center gap-2 cursor-pointer">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/onboarding" className="flex items-center gap-2 cursor-pointer text-destructive">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
