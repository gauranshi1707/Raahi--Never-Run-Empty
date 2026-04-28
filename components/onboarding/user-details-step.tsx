'use client'

import { useState, useRef, useEffect, KeyboardEvent } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'

interface UserDetailsStepProps {
  onNext: (data: { name: string; phone: string }) => void
  onBack: () => void
}

type FormStep = 'details' | 'otp'

export default function UserDetailsStep({ onNext, onBack }: UserDetailsStepProps) {
  const [formStep, setFormStep] = useState<FormStep>('details')
  const [generatedOtp, setGeneratedOtp] = useState<string>('')
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', ''])
  const [otpError, setOtpError] = useState<string>('')
  const [isSendingOtp, setIsSendingOtp] = useState(false)
  const [savedDetails, setSavedDetails] = useState<{ name: string; phone: string } | null>(null)
  
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([])

  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    watch,
    setValue,
    setError,
    clearErrors
  } = useForm<{ name: string; phone: string }>()

  const phoneValue = watch('phone', '')

  // Handle phone input - only allow digits, max 10
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10)
    setValue('phone', value)
    if (value.length === 10) {
      clearErrors('phone')
    }
  }

  // Generate random 4-digit OTP
  const generateOtp = () => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString()
    setGeneratedOtp(otp)
    console.log('[v0] Generated OTP:', otp)
    return otp
  }

  // Handle details submission - send OTP
  const onDetailsSubmit = async (data: { name: string; phone: string }) => {
    // Validate phone is exactly 10 digits
    if (data.phone.length !== 10) {
      setError('phone', { 
        type: 'manual', 
        message: 'Phone number must be exactly 10 digits' 
      })
      return
    }

    setIsSendingOtp(true)
    setSavedDetails(data)
    
    // Simulate OTP sending delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    generateOtp()
    setIsSendingOtp(false)
    setFormStep('otp')
    setOtpValues(['', '', '', ''])
    setOtpError('')
  }

  // Focus first OTP input when entering OTP step
  useEffect(() => {
    if (formStep === 'otp' && otpInputRefs.current[0]) {
      otpInputRefs.current[0].focus()
    }
  }, [formStep])

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    // Only allow single digit
    const digit = value.replace(/\D/g, '').slice(-1)
    
    const newOtpValues = [...otpValues]
    newOtpValues[index] = digit
    setOtpValues(newOtpValues)
    setOtpError('')

    // Auto-focus next input
    if (digit && index < 3) {
      otpInputRefs.current[index + 1]?.focus()
    }
  }

  // Handle OTP keydown for backspace navigation
  const handleOtpKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus()
    }
  }

  // Handle OTP paste
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
    if (pastedData.length === 4) {
      const digits = pastedData.split('')
      setOtpValues(digits)
      otpInputRefs.current[3]?.focus()
    }
  }

  // Verify OTP
  const verifyOtp = () => {
    const enteredOtp = otpValues.join('')
    
    if (enteredOtp.length !== 4) {
      setOtpError('Please enter complete 4-digit OTP')
      return
    }

    if (enteredOtp !== generatedOtp) {
      setOtpError('Invalid OTP. Please try again.')
      return
    }

    // OTP verified successfully
    if (savedDetails) {
      onNext(savedDetails)
    }
  }

  // Resend OTP
  const resendOtp = async () => {
    setIsSendingOtp(true)
    await new Promise(resolve => setTimeout(resolve, 800))
    generateOtp()
    setOtpValues(['', '', '', ''])
    setOtpError('')
    setIsSendingOtp(false)
    otpInputRefs.current[0]?.focus()
  }

  // Back from OTP to details
  const backToDetails = () => {
    setFormStep('details')
    setOtpValues(['', '', '', ''])
    setOtpError('')
  }

  if (formStep === 'otp') {
    return (
      <div className="max-w-md mx-auto">
        <h2 className="text-3xl font-bold mb-2">Verify OTP</h2>
        <p className="text-muted-foreground mb-2">
          Enter the 4-digit code sent to
        </p>
        <p className="text-foreground font-medium mb-8">+91 {savedDetails?.phone}</p>

        <div className="flex justify-center gap-3 mb-6">
          {otpValues.map((value, index) => (
            <Input
              key={index}
              ref={(el) => { otpInputRefs.current[index] = el }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={value}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(index, e)}
              onPaste={index === 0 ? handleOtpPaste : undefined}
              className="w-14 h-14 text-center text-2xl font-bold border-border focus:ring-accent focus:border-accent"
            />
          ))}
        </div>

        {otpError && (
          <p className="text-destructive text-sm text-center mb-4">{otpError}</p>
        )}

        <div className="text-center mb-6">
          <button
            type="button"
            onClick={resendOtp}
            disabled={isSendingOtp}
            className="text-accent hover:underline text-sm disabled:opacity-50"
          >
            {isSendingOtp ? 'Sending...' : 'Resend OTP'}
          </button>
        </div>

        <p className="text-xs text-muted-foreground text-center mb-6">
          (Check browser console for OTP - demo only)
        </p>

        <div className="flex gap-3">
          <Button
            type="button"
            onClick={backToDetails}
            variant="outline"
            className="flex-1"
          >
            Back
          </Button>
          <Button
            type="button"
            onClick={verifyOtp}
            className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            Verify
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-3xl font-bold mb-2">Your Details</h2>
      <p className="text-muted-foreground mb-8">Let us know who you are</p>

      <form onSubmit={handleSubmit(onDetailsSubmit)} className="space-y-6">
        <div>
          <Label htmlFor="name" className="mb-2 block">
            Full Name
          </Label>
          <Input
            id="name"
            placeholder="Enter your name"
            className="border-border focus:ring-accent focus:border-accent"
            {...register('name', { 
              required: 'Name is required',
              minLength: { value: 2, message: 'Name must be at least 2 characters' }
            })}
          />
          {errors.name && (
            <p className="text-destructive text-sm mt-1">{String(errors.name.message)}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone" className="mb-2 block">
            Phone Number
          </Label>
          <div className="flex gap-2">
            <div className="flex items-center px-3 bg-secondary rounded-lg border border-border">
              <span className="text-muted-foreground">+91</span>
            </div>
            <Input
              id="phone"
              type="tel"
              inputMode="numeric"
              placeholder="10-digit number"
              className="border-border focus:ring-accent focus:border-accent flex-1"
              value={phoneValue}
              {...register('phone', { 
                required: 'Phone number is required',
                validate: (value) => value.length === 10 || 'Phone number must be exactly 10 digits'
              })}
              onChange={handlePhoneChange}
            />
          </div>
          {errors.phone && (
            <p className="text-destructive text-sm mt-1">{String(errors.phone.message)}</p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {phoneValue.length}/10 digits
          </p>
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
            disabled={isSendingOtp}
            className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            {isSendingOtp ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending OTP...
              </>
            ) : (
              'Send OTP'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
