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

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 10)
    setValue('phone', value)
    if (value.length === 10) clearErrors('phone')
  }

  const generateOtp = () => {
    const otp = Math.floor(1000 + Math.random() * 9000).toString()
    setGeneratedOtp(otp)
    console.log('OTP:', otp)
    return otp
  }

  const onDetailsSubmit = async (data: { name: string; phone: string }) => {
    if (data.phone.length !== 10) {
      setError('phone', { type: 'manual', message: 'Phone number must be exactly 10 digits' })
      return
    }

    setIsSendingOtp(true)
    setSavedDetails(data)
    await new Promise(res => setTimeout(res, 800))

    generateOtp()
    setIsSendingOtp(false)
    setFormStep('otp')
    setOtpValues(['', '', '', ''])
    setOtpError('')
  }

  useEffect(() => {
    if (formStep === 'otp') otpInputRefs.current[0]?.focus()
  }, [formStep])

  const handleOtpChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1)
    const newOtp = [...otpValues]
    newOtp[index] = digit
    setOtpValues(newOtp)
    setOtpError('')
    if (digit && index < 3) otpInputRefs.current[index + 1]?.focus()
  }

  const handleOtpKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus()
    }
  }

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4)
    if (pasted.length === 4) {
      setOtpValues(pasted.split(''))
      otpInputRefs.current[3]?.focus()
    }
  }

  const verifyOtp = () => {
    const entered = otpValues.join('')
    if (entered.length !== 4) return setOtpError('Enter complete OTP')
    if (entered !== generatedOtp) return setOtpError('Invalid OTP')
    if (savedDetails) onNext(savedDetails)
  }

  const resendOtp = async () => {
    setIsSendingOtp(true)
    await new Promise(res => setTimeout(res, 800))
    generateOtp()
    setOtpValues(['', '', '', ''])
    setOtpError('')
    setIsSendingOtp(false)
  }

  if (formStep === 'otp') {
    return (
      <div className="max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Verify OTP</h2>
        <p className="mb-6">+91 {savedDetails?.phone}</p>

        <div className="flex gap-3 justify-center mb-4">
          {otpValues.map((v, i) => (
            <Input
              key={i}
              ref={el => (otpInputRefs.current[i] = el)}
              value={v}
              onChange={e => handleOtpChange(i, e.target.value)}
              onKeyDown={e => handleOtpKeyDown(i, e)}
              onPaste={i === 0 ? handleOtpPaste : undefined}
              maxLength={1}
              className="w-12 h-12 text-center"
            />
          ))}
        </div>

        {otpError && <p className="text-red-500 text-center">{otpError}</p>}

        <div className="flex gap-2 mt-4">
          <Button onClick={() => setFormStep('details')} variant="outline" className="flex-1">
            Back
          </Button>
          <Button onClick={verifyOtp} className="flex-1">
            Verify
          </Button>
        </div>

        <button onClick={resendOtp} className="text-sm mt-3 underline w-full">
          Resend OTP
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto">
      <form onSubmit={handleSubmit(onDetailsSubmit)} className="space-y-4">
        <div>
          <Label>Name</Label>
          <Input {...register('name', { required: true })} />
        </div>

        <div>
          <Label>Phone</Label>
          <Input
            value={phoneValue}
            {...register('phone')}
            onChange={handlePhoneChange}
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={onBack} type="button" variant="outline" className="flex-1">
            Back
          </Button>
          <Button type="submit" className="flex-1">
            {isSendingOtp ? <Loader2 className="animate-spin" /> : 'Send OTP'}
          </Button>
        </div>
      </form>
    </div>
  )
}