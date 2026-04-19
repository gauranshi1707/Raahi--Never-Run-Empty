'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { locations, goodsTypes } from '@/lib/mock-data'

interface PostLoadFormProps {
  onSubmit?: (data: any) => void
}

export default function PostLoadForm({ onSubmit }: PostLoadFormProps) {
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      from: '',
      to: '',
      weight: '',
      goodsType: '',
      price: '',
    },
  })

  const [fromLocation, setFromLocation] = useState('')
  const [toLocation, setToLocation] = useState('')
  const [goodsType, setGoodsType] = useState('')

  const handleFormSubmit = (data: any) => {
    const formData = {
      ...data,
      from: fromLocation,
      to: toLocation,
      goodsType: goodsType,
    }
    onSubmit?.(formData)
    setFromLocation('')
    setToLocation('')
    setGoodsType('')
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-card border border-border rounded-lg p-6 mb-8">
      <h3 className="text-xl font-bold mb-6">Post a New Load</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Label htmlFor="from" className="mb-2 block">
            From Location
          </Label>
          <Select value={fromLocation} onValueChange={setFromLocation}>
            <SelectTrigger id="from" className="border-border">
              <SelectValue placeholder="Select pickup location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="to" className="mb-2 block">
            To Location
          </Label>
          <Select value={toLocation} onValueChange={setToLocation}>
            <SelectTrigger id="to" className="border-border">
              <SelectValue placeholder="Select destination" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((loc) => (
                <SelectItem key={loc} value={loc}>
                  {loc}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <Label htmlFor="weight" className="mb-2 block">
            Weight (tons)
          </Label>
          <Input
            id="weight"
            type="number"
            placeholder="Enter weight"
            className="border-border focus:ring-accent focus:border-accent"
            {...register('weight', { required: 'Weight is required' })}
          />
        </div>

        <div>
          <Label htmlFor="goodsType" className="mb-2 block">
            Goods Type
          </Label>
          <Select value={goodsType} onValueChange={setGoodsType}>
            <SelectTrigger id="goodsType" className="border-border">
              <SelectValue placeholder="Select goods type" />
            </SelectTrigger>
            <SelectContent>
              {goodsTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-6">
        <Label htmlFor="price" className="mb-2 block">
          Price (₹)
        </Label>
        <Input
          id="price"
          type="number"
          placeholder="Enter quote amount"
          className="border-border focus:ring-accent focus:border-accent"
          {...register('price', { required: 'Price is required' })}
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
      >
        POST LOAD
      </Button>
    </form>
  )
}
