'use client'

import { Button } from '@/components/ui/button'
import { fetchTechAvailabilityWithDate } from '@/lib/fetchClient'
import { cn } from '@/lib/utils'
import { Technician } from '@/payload-types'
import { useQuery } from '@tanstack/react-query'
import { Clock } from 'lucide-react'
import React, { useEffect, useState } from 'react'

function generateTimeSlots(startHour: number, endHour: number) {
  const timeSlots = []

  for (let hour = startHour; hour <= endHour; hour++) {
    for (let min of [0, 30]) {
      let suffix = hour >= 12 ? 'PM' : 'AM'
      let displayHour = hour % 12 === 0 ? 12 : hour % 12
      let displayMin = min === 0 ? '00' : '30'
      timeSlots.push(`${displayHour}:${displayMin} ${suffix}`)
    }
  }

  return timeSlots
}

function isTimeAvailable(timeString: string, bookings: { time: string; duration: number }[]) {
  if (!bookings) return true
  const SLOT_SIZE = 10
  // Convert "2:00 PM" → minutes since midnight
  function timeStringToMinutes(str: string) {
    const [time, modifier] = str.trim().split(' ')
    let [hours, minutes] = time.split(':').map(Number)

    if (modifier === 'PM' && hours !== 12) hours += 12
    if (modifier === 'AM' && hours === 12) hours = 0

    return hours * 60 + minutes
  }

  const slotStart = timeStringToMinutes(timeString)
  const slotEnd = slotStart + SLOT_SIZE

  for (const booking of bookings) {
    const start = new Date(booking.time)

    // booking range
    const bookingStart = start.getHours() * 60 + start.getMinutes()
    const bookingEnd = bookingStart + booking.duration

    const overlaps = slotStart <= bookingEnd && slotEnd > bookingStart

    if (overlaps) return false
  }

  return true
}

interface TimeSlotPickerProps {
  selectedTime: string | null
  onSelectTime: (time: string) => void
  disabled?: boolean
  techAvailability: NonNullable<Technician['weeklyAvailability']>[number]['timeRanges']
  techId: string | undefined | null
  date: Date | undefined
}

export default function TimeSlotPicker({
  selectedTime,
  onSelectTime,
  disabled,
  techAvailability,
  techId,
  date,
}: TimeSlotPickerProps) {
  const [bookingTakenState, setBookingTakenState] = useState<
    | {
        duration: number
        time: string
      }[]
    | null
  >(null)

  const { data: bookings, isFetching: isFetchingBookings } = useQuery({
    queryKey: ['appointment', techId, date?.toISOString()],
    queryFn: ({ queryKey }) =>
      fetchTechAvailabilityWithDate(queryKey[1] as string, queryKey[2] as string),
    enabled: !!techId && !!date,
  })

  useEffect(() => {
    if (bookings) setBookingTakenState(bookings.data)
  }, [bookings])

  if (disabled) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 text-center">
        <Clock className="mb-2 h-8 w-8 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          Please select a date first to view available times
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-4 overflow-y-auto rounded-lg border border-border p-3">
      {techAvailability &&
        techAvailability.map((timeRange) => {
          const start = parseInt(timeRange.start)
          const end = parseInt(timeRange.end)
          const timeSlots = generateTimeSlots(start, end)
          const availableSlots = timeSlots.filter((time) =>
            isTimeAvailable(time, bookingTakenState || []),
          )

          return (
            <React.Fragment key={timeRange.id}>
              {availableSlots.map((time) => (
                <Button
                  key={time}
                  variant="outline"
                  onClick={() => onSelectTime(time)}
                  disabled={isFetchingBookings}
                  className={cn(
                    'rounded-md px-2 py-2 text-sm font-medium transition-all border-none',
                    selectedTime === time &&
                      'bg-blue-500 text-primary-foreground hover:bg-primary/90',
                  )}
                  type="button"
                >
                  {time}
                </Button>
              ))}
            </React.Fragment>
          )
        })}
    </div>
  )
}
