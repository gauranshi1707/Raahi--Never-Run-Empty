'use client'

import { Button } from '@/components/ui/button'

interface LanguageStepProps {
  onNext: (language: string) => void
}

export default function LanguageStep({ onNext }: LanguageStepProps) {
  return (
    <div className="text-center">
      <h2 className="text-3xl font-bold mb-2">Welcome to Raahi</h2>
      <p className="text-muted-foreground mb-8">Select your preferred language</p>

      <div className="space-y-3 max-w-xs mx-auto">
        <Button
          onClick={() => onNext('english')}
          className="w-full bg-accent hover:bg-accent/90 text-accent-foreground h-12 text-lg"
        >
          English
        </Button>
        <Button
          onClick={() => onNext('hindi')}
          className="w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground h-12 text-lg"
        >
          हिंदी
        </Button>
      </div>
    </div>
  )
}
