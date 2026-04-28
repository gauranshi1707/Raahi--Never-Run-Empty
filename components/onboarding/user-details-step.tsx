'use client'

import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface UserDetailsStepProps {
  onNext: (data: { name: string; phone: string }) => void
  onBack: () => void
}

export default function UserDetailsStep({ onNext, onBack }: UserDetailsStepProps) {
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = (data: any) => {
    onNext(data)
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-3xl font-bold mb-2">Your Details</h2>
      <p className="text-muted-foreground mb-8">Let us know who you are</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="name" className="mb-2 block">
            Full Name
          </Label>
          <Input
            id="name"
            placeholder="Enter your name"
            className="border-border focus:ring-accent focus:border-accent"
            {...register('name', { required: 'Name is required' })}
          />
          {errors.name && (
            <p className="text-destructive text-sm mt-1">{String(errors.name.message)}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone" className="mb-2 block">
            Phone Number
          </Label>
          <Input
            id="phone"
            placeholder="+91 XXXXXXXXXX"
            className="border-border focus:ring-accent focus:border-accent"
            {...register('phone', { required: 'Phone is required' })}
          />
          {errors.phone && (
            <p className="text-destructive text-sm mt-1">{String(errors.phone.message)}</p>
          )}
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            onClick={onBack}
            variant="outline"
            className="flex-1"
          >
            Back
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  )
}
