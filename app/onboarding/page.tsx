'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LanguageStep from '@/components/onboarding/language-step'
import UserDetailsStep from '@/components/onboarding/user-details-step'
import RoleSelectionStep from '@/components/onboarding/role-selection-step'
import LicenseUploadStep from '@/components/onboarding/license-upload-step'
import { useUserStore } from '@/hooks/use-user-store'

type OnboardingStep = 'language' | 'details' | 'role' | 'license'

export default function OnboardingPage() {
  const router = useRouter()
  const { saveUserData, clearUserData } = useUserStore()
  
  const [step, setStep] = useState<OnboardingStep>('language')
  const [userData, setUserData] = useState({
    language: '',
    name: '',
    phone: '',
    role: '' as 'driver' | 'shipper' | '',
  })

  // Clear any existing user data when arriving at onboarding (logout scenario)
  useEffect(() => {
    clearUserData()
  }, [clearUserData])

  const handleLanguageSelect = (language: string) => {
    setUserData(prev => ({ ...prev, language }))
    setStep('details')
  }

  const handleUserDetailsSubmit = (data: { name: string; phone: string }) => {
    setUserData(prev => ({ ...prev, ...data }))
    setStep('role')
  }

  const handleRoleSelect = (role: 'driver' | 'shipper') => {
    setUserData(prev => ({ ...prev, role }))
    
    // If driver, show license upload step
    if (role === 'driver') {
      setStep('license')
    } else {
      // Shipper - complete onboarding directly
      saveUserData({
        name: userData.name,
        phone: userData.phone,
        role: role,
        language: userData.language,
        licenseUploaded: false,
        isOnboarded: true,
      })
      router.push('/shipper')
    }
  }

  const handleLicenseUpload = (uploaded: boolean) => {
    // Save all user data to localStorage
    saveUserData({
      name: userData.name,
      phone: userData.phone,
      role: userData.role as 'driver' | 'shipper',
      language: userData.language,
      licenseUploaded: uploaded,
      isOnboarded: true,
    })
    
    // Redirect to driver dashboard
    router.push('/driver')
  }

  const handleBackFromDetails = () => {
    setStep('language')
  }

  const handleBackFromRole = () => {
    setStep('details')
  }

  const handleBackFromLicense = () => {
    setStep('role')
  }

  // Calculate progress step number
  const getStepNumber = () => {
    switch (step) {
      case 'language': return 1
      case 'details': return 2
      case 'role': return 3
      case 'license': return 4
      default: return 1
    }
  }

  const totalSteps = userData.role === 'driver' || step === 'license' ? 4 : 3

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <div className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-accent">Raahi</h1>
            <p className="text-muted-foreground font-medium">
  Never Run Empty
</p>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div 
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index + 1 === getStepNumber() 
                    ? 'bg-accent' 
                    : index + 1 < getStepNumber()
                    ? 'bg-accent/50'
                    : 'bg-secondary'
                }`} 
              />
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-2">
            Step {getStepNumber()} of {totalSteps}
          </p>
        </div>

        {/* Step content */}
        <div className="bg-card border border-border rounded-lg p-8">
          {step === 'language' && (
            <LanguageStep onNext={handleLanguageSelect} />
          )}
          {step === 'details' && (
            <UserDetailsStep
              onNext={handleUserDetailsSubmit}
              onBack={handleBackFromDetails}
            />
          )}
          {step === 'role' && (
            <RoleSelectionStep
              onSelectRole={handleRoleSelect}
              onBack={handleBackFromRole}
            />
          )}
          {step === 'license' && (
            <LicenseUploadStep
              onNext={handleLicenseUpload}
              onBack={handleBackFromLicense}
            />
          )}
        </div>
      </div>
    </div>
  )
}
