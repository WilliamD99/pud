'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import ServiceSelector from './Service/ServiceSelector'
import { TechnicianSelector } from './TechnicianSelector'
import { Service, StoreSetting, Technician } from '@/payload-types'
import CustomerInformation from './CustomerInformation'
import DatePicker from './DatePicker'
import { BookingSchema, combineDateAndTime } from '@/lib/zod/booking-schema'
import { createAppointment } from '@/lib/fetchClient'

export interface GroupedServices {
  category: string
  services: Service[]
}

interface BookingFormProps {
  services: GroupedServices[]
  operatingHours: StoreSetting['operatingHours']
}

interface FormErrors {
  service?: string
  technician?: string
  date?: string
  time?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
}

export default function BookingForm({ services, operatingHours }: BookingFormProps) {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  // Selected Service state
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)

  // Selected Technician State
  const [selectedTech, setSelectedTech] = useState<Technician | null>(null)

  // Customer Information state
  const [customerData, setCustomerData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    notes: '',
  })

  // Form state
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [submitMessage, setSubmitMessage] = useState('')

  const handleServiceSelect = (serviceId: string, variantId: string | null) => {
    setSelectedService(serviceId)
    setSelectedVariant(variantId)
    // Clear service error when user selects
    if (errors.service) {
      setErrors((prev) => ({ ...prev, service: undefined }))
    }
  }

  const handleTechSelect = (tech: Technician | null) => {
    setSelectedTech(tech)
    // Clear technician error when user selects
    if (errors.technician) {
      setErrors((prev) => ({ ...prev, technician: undefined }))
    }
  }

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate)
    setSelectedTime(null) // Reset time when date changes
    if (errors.date) {
      setErrors((prev) => ({ ...prev, date: undefined }))
    }
  }

  const handleTimeSelect = (time: string | null) => {
    setSelectedTime(time)
    if (errors.time) {
      setErrors((prev) => ({ ...prev, time: undefined }))
    }
  }

  const handleCustomerChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setCustomerData((prev) => ({ ...prev, [name]: value }))
    // Clear error for the field being changed
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrors({})
    setSubmitStatus('idle')

    // Build the form data object
    const formData = {
      service: selectedService || '',
      variant: selectedVariant,
      technician: selectedTech?.id?.toString() || '',
      date: date,
      time: selectedTime || '',
      firstName: customerData.firstName,
      lastName: customerData.lastName,
      email: customerData.email,
      phone: customerData.phone,
      notes: customerData.notes,
    }

    // Validate with Zod
    const result = BookingSchema.safeParse(formData)

    if (!result.success) {
      // Map Zod errors to our error state
      const newErrors: FormErrors = {}
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof FormErrors
        newErrors[field] = err.message
      })
      setErrors(newErrors)
      return
    }

    // Submit the form
    setIsSubmitting(true)

    try {
      // Combine date and time
      const appointmentTime = combineDateAndTime(result.data.date, result.data.time)

      // Get the actual service ID to use (variant if selected, otherwise parent service)
      const serviceToBook = result.data.variant || result.data.service

      // Find the technician's Payload ID (not techniciansId)
      const techPayloadId = selectedTech?.id

      if (!techPayloadId) {
        throw new Error('Technician not found')
      }

      const response = await createAppointment({
        time: appointmentTime.toISOString(),
        customer: {
          name: `${result.data.firstName} ${result.data.lastName}`,
          email: result.data.email,
          phone: result.data.phone,
          notes: result.data.notes,
        },
        job: {
          service: serviceToBook,
          technician: techPayloadId.toString(),
          notes: result.data.notes,
        },
      })

      if (response.success) {
        setSubmitStatus('success')
        setSubmitMessage('Your appointment has been booked successfully!')
        // Reset form
        setSelectedService(null)
        setSelectedVariant(null)
        setSelectedTech(null)
        setDate(undefined)
        setSelectedTime(null)
        setCustomerData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          notes: '',
        })
      } else {
        setSubmitStatus('error')
        setSubmitMessage(response.error || 'Failed to book appointment. Please try again.')
      }
    } catch (error) {
      console.error('Booking error:', error)
      setSubmitStatus('error')
      setSubmitMessage('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-6 lg-grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Service Selector */}
          <Card className="border-border shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                  1
                </span>
                <CardTitle className="text-lg">Select Your Service</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ServiceSelector
                groupedServices={services}
                selectedService={selectedService}
                selectedVariant={selectedVariant}
                onSelectService={handleServiceSelect}
              />
              {errors.service && <p className="mt-2 text-sm text-red-500">{errors.service}</p>}
            </CardContent>
          </Card>

          {/* Technician Selector */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                  2
                </span>
                <CardTitle className="text-lg">Choose Your Technician</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {selectedService ? (
                <>
                  <TechnicianSelector
                    selectedService={selectedService}
                    selectedTechnician={selectedTech}
                    onSelectTechnician={handleTechSelect}
                  />
                  {errors.technician && (
                    <p className="mt-2 text-sm text-red-500">{errors.technician}</p>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-muted-foreground">Please select a service first</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Date picker */}
          <Card className="border-border shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                  3
                </span>
                <CardTitle className="text-lg">Pick Date & Time</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {operatingHours && (
                <>
                  <DatePicker
                    date={date}
                    setDate={handleDateChange}
                    selectedTime={selectedTime}
                    setSelectedTime={handleTimeSelect}
                    operatingDays={operatingHours}
                    selectedTechnician={selectedTech}
                  />
                  {(errors.date || errors.time) && (
                    <div className="mt-2 space-y-1">
                      {errors.date && <p className="text-sm text-red-500">{errors.date}</p>}
                      {errors.time && <p className="text-sm text-red-500">{errors.time}</p>}
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Customer Information */}
          <CustomerInformation
            formData={customerData}
            onChange={handleCustomerChange}
            errors={{
              firstName: errors.firstName,
              lastName: errors.lastName,
              email: errors.email,
              phone: errors.phone,
            }}
          />

          {/* Submit Button */}
          <Card className="border-border shadow-sm">
            <CardContent className="pt-6">
              {submitStatus === 'success' && (
                <div className="mb-4 rounded-lg bg-green-50 border border-green-200 p-4">
                  <p className="text-green-800 font-medium">{submitMessage}</p>
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-4">
                  <p className="text-red-800 font-medium">{submitMessage}</p>
                </div>
              )}
              <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                {isSubmitting ? 'Booking...' : 'Book Appointment'}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Booking Summary */}
      </div>
    </form>
  )
}
