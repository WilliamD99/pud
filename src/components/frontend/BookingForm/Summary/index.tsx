'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Service, Technician } from '@/payload-types'
import { format } from 'date-fns'
import { Calendar, Clock, Scissors, User } from 'lucide-react'
import React from 'react'

interface SummaryProps {
  selectedService: Service | null
  selectedTechnician: Technician | null
  date: Date | undefined
  time: string | null
  isSubmitting?: boolean
}

export default function Summary({
  selectedService,
  selectedTechnician,
  date,
  time,
  isSubmitting = false,
}: SummaryProps) {
  // Check if this is a parent service with sub-services (show price range)
  const isParentService = selectedService?.isParent && selectedService?.subServices?.length

  // Get price display
  const minPrice = selectedService?.priceRange?.min ?? 0
  const maxPrice = selectedService?.priceRange?.max ?? 0
  const hasPriceRange = isParentService && minPrice !== maxPrice && maxPrice > 0

  // Format price display
  const priceDisplay = hasPriceRange ? `$${minPrice} - $${maxPrice}` : `$${minPrice || maxPrice}`
  const totalPrice = isParentService ? null : minPrice || maxPrice

  // Get technician's duration for this service if available
  const getTechnicianDuration = (): number | null => {
    if (!selectedTechnician || !selectedService) return null

    const techService = selectedTechnician.services?.find((s) => {
      const serviceId = typeof s.service === 'object' ? s.service?.id : s.service
      return serviceId === selectedService.id
    })

    return techService?.duration ?? null
  }

  const duration = getTechnicianDuration()

  const isReadyToBook = selectedService && selectedTechnician && date && time

  return (
    <Card className="border-border shadow-lg h-fit sticky right-0 top-32">
      <CardHeader className="">
        <CardTitle className="text-sm font-instrument uppercase tracking-wide">
          Booking Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 -mt-3">
          {/* Services */}
          <div className="flex items-start gap-3">
            <Scissors className="mt-0.5 h-4 w-4 text-primary" />
            <div className="flex-1">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Your Service</p>
              {!selectedService ? (
                <p className="text-xs text-muted-foreground">Not selected</p>
              ) : (
                <div className="mt-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium font-instrument tracking-wide text-foreground text-xs">
                      {selectedService.name}
                    </span>
                    <span className="text-muted-foreground font-instrument tracking-wide text-xs">
                      {priceDisplay}
                    </span>
                  </div>

                  {duration && (
                    <p className="text-xs text-muted-foreground font-instrument tracking-wide">
                      Est. duration: {duration} min
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Technician */}
          <div className="flex items-start gap-3">
            <User className="mt-0.5 h-4 w-4 text-primary" />
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Technician</p>
              <p className="text-xs font-medium font-instrument tracking-wide text-foreground">
                {selectedTechnician?.name || 'Not selected'}
              </p>
            </div>
          </div>

          {/* Date */}
          <div className="flex items-start gap-3">
            <Calendar className="mt-0.5 h-4 w-4 text-primary" />
            <div className="space-y-1">
              <p className="text-xs uppercase font-instrument tracking-wide text-muted-foreground">
                Date
              </p>
              <p className="text-xs font-medium font-instrument tracking-wide text-foreground">
                {date ? format(date, 'EEEE, MMMM d, yyyy') : 'Not selected'}
              </p>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-4 w-4 text-primary" />
            <div className="space-y-1">
              <p className="text-xs uppercase font-instrument tracking-wide text-muted-foreground">
                Time
              </p>
              <p className="text-xs font-medium font-instrument tracking-wide text-foreground">
                {time || 'Not selected'}
              </p>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-2 pt-2 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground text-xs font-instrument tracking-wide">
                {selectedService ? '1 service' : '0 services'}
              </span>
              <span className="text-foreground text-xs font-instrument tracking-wide">
                {selectedService ? priceDisplay : '$0'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-xs font-instrument tracking-wide">
                Total
              </span>
              <span className="text-xs font-semibold font-instrument tracking-wide text-primary">
                {totalPrice !== null ? `$${totalPrice}` : priceDisplay}
              </span>
            </div>
          </div>

          <p className="text-xs italic text-muted-foreground">You won&apos;t be charged yet</p>

          <Button
            type="submit"
            className={cn(
              'w-fit mt-4 bg-white text-black',
              !isReadyToBook && 'opacity-50 cursor-not-allowed',
              isReadyToBook && 'opacity-100 cursor-pointer',
            )}
            size="lg"
            disabled={isSubmitting || !isReadyToBook}
          >
            {isSubmitting ? 'Booking...' : 'Confirm Booking'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
