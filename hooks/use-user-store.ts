'use client'

import { useState, useEffect, useCallback } from 'react'

export interface UserData {
  name: string
  phone: string
  role: 'driver' | 'shipper' | ''
  language: string
  licenseUploaded: boolean
  isOnboarded: boolean
}

const STORAGE_KEY = 'raahi_user_data'

const defaultUserData: UserData = {
  name: '',
  phone: '',
  role: '',
  language: '',
  licenseUploaded: false,
  isOnboarded: false,
}

export function useUserStore() {
  const [userData, setUserData] = useState<UserData>(defaultUserData)
  const [isLoading, setIsLoading] = useState(true)

  // Load user data from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as UserData
        setUserData(parsed)
      }
    } catch (error) {
      console.error('Failed to load user data:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save user data to localStorage
  const saveUserData = useCallback((data: Partial<UserData>) => {
    setUserData(prev => {
      const newData = { ...prev, ...data }
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
      } catch (error) {
        console.error('Failed to save user data:', error)
      }
      return newData
    })
  }, [])

  // Clear user data (for logout)
  const clearUserData = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY)
      setUserData(defaultUserData)
    } catch (error) {
      console.error('Failed to clear user data:', error)
    }
  }, [])

  // Get display name (fallback if not set)
  const getDisplayName = useCallback(() => {
    return userData.name || 'User'
  }, [userData.name])

  return {
    userData,
    isLoading,
    saveUserData,
    clearUserData,
    getDisplayName,
    isOnboarded: userData.isOnboarded,
  }
}
