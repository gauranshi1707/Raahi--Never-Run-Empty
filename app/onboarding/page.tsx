'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import LanguageStep from '@/components/onboarding/language-step'
import UserDetailsStep from '@/components/onboarding/user-details-step'
import RoleSelectionStep from '@/components/onboarding/role-selection-step'

type OnboardingStep = 'language' | 'details' | 'role'

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState<OnboardingStep>('language')
  const [userData, setUserData] = useState({
    language: '',
    name: '',
    phone: '',
    role: '',
  })

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
    // Redirect to appropriate dashboard
    router.push(`/${role}`)
  }

  const handleBackFromDetails = () => {
    setStep('language')
  }

  const handleBackFromRole = () => {
    setStep('details')
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-2xl">
        <div className="mb-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-accent">Raahi</h1>
            <p className="text-muted-foreground mt-2">Connecting Drivers & Shippers</p>
          </div>

          {/* Progress indicator */}
          <div className="flex items-center justify-center gap-2">
            <div className={`w-3 h-3 rounded-full transition-colors ${step === 'language' ? 'bg-accent' : 'bg-secondary'}`} />
            <div className={`w-3 h-3 rounded-full transition-colors ${step === 'details' ? 'bg-accent' : 'bg-secondary'}`} />
            <div className={`w-3 h-3 rounded-full transition-colors ${step === 'role' ? 'bg-accent' : 'bg-secondary'}`} />
          </div>
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
        </div>
      </div>
    </div>
  )
}
