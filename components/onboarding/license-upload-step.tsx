'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Upload, FileText, X, CheckCircle, Shield } from 'lucide-react'

interface LicenseUploadStepProps {
  onNext: (uploaded: boolean) => void
  onBack: () => void
}

export default function LicenseUploadStep({ onNext, onBack }: LicenseUploadStepProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
    if (!validTypes.includes(file.type)) {
      alert('Please upload an image (JPEG, PNG, WebP) or PDF file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    setSelectedFile(file)

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleContinue = () => {
    onNext(!!selectedFile)
  }

  const handleSkip = () => {
    onNext(false)
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-3xl font-bold mb-2">Driving License</h2>
      <p className="text-muted-foreground mb-6">Upload your license for verification (optional)</p>

      <Card className="p-6 mb-6 border-2 border-dashed border-border hover:border-accent/50 transition-colors">
        {selectedFile ? (
          <div className="space-y-4">
            {preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="License preview"
                  className="w-full h-48 object-contain rounded-lg bg-secondary"
                />
                <button
                  onClick={removeFile}
                  className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 p-4 bg-secondary rounded-lg">
                <FileText className="h-10 w-10 text-accent" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(selectedFile.size / 1024).toFixed(1)} KB
                  </p>
                </div>
                <button
                  onClick={removeFile}
                  className="p-1 hover:bg-destructive/10 rounded-full"
                >
                  <X className="h-5 w-5 text-destructive" />
                </button>
              </div>
            )}
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle className="h-5 w-5" />
              <span className="text-sm font-medium">File selected</span>
            </div>
          </div>
        ) : (
          <label className="cursor-pointer block">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              onChange={handleFileSelect}
              className="sr-only"
            />
            <div className="flex flex-col items-center py-8">
              <Upload className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="font-medium mb-1">Upload Driving License</p>
              <p className="text-sm text-muted-foreground text-center">
                JPEG, PNG, WebP or PDF (max 5MB)
              </p>
            </div>
          </label>
        )}
      </Card>

      <div className="flex items-start gap-3 p-4 bg-accent/10 rounded-lg mb-6">
        <Shield className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
        <p className="text-sm text-muted-foreground">
          Verified drivers may get more load opportunities and build trust with shippers.
        </p>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          onClick={onBack}
          variant="outline"
          className="flex-1"
        >
          Back
        </Button>
        {selectedFile ? (
          <Button
            type="button"
            onClick={handleContinue}
            className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground"
          >
            Continue
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSkip}
            variant="secondary"
            className="flex-1"
          >
            Skip for Now
          </Button>
        )}
      </div>
    </div>
  )
}
