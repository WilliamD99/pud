'use client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import React, { useState } from 'react'
import ServiceSelector from './ServiceSelector'
import { TechnicianSelector } from './TechnicianSelector'
import { Service, StoreSetting, Technician } from '@/payload-types'
import CustomerInformation from './CustomerInformation'
import DatePicker from './DatePicker'

interface BookingFormProps {
  services: Service[]
  operatingHours: StoreSetting['operatingHours']
}

export default function BookingForm({ services, operatingHours }: BookingFormProps) {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  // Selected Service state
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null)

  // Selected Technician State
  const [selectedTech, setSelectedTech] = useState<Technician | null>(null)

  const handleServiceSelect = (serviceId: string, variantId: string | null) => {
    setSelectedService(serviceId)
    setSelectedVariant(variantId)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
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
                services={services}
                selectedService={selectedService}
                selectedVariant={selectedVariant}
                onSelectService={handleServiceSelect}
              />
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
                <TechnicianSelector
                  selectedService={selectedService}
                  selectedTechnician={selectedTech}
                  onSelectTechnician={setSelectedTech}
                />
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
                <DatePicker
                  date={date}
                  setDate={setDate}
                  selectedTime={selectedTime}
                  setSelectedTime={setSelectedTime}
                  operatingDays={operatingHours}
                  selectedTechnician={selectedTech}
                />
              )}
            </CardContent>
          </Card>

          {/* Customer Information */}
          <CustomerInformation />
        </div>

        {/* Booking Summary */}
      </div>
    </form>
  )
}
