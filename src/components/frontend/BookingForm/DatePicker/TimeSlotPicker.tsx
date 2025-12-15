'use client'

import { Button } from '@/components/ui/button'
import { fetchTechAvailabilityWithDate } from '@/lib/fetchClient'
import { cn } from '@/lib/utils'
import { Technician } from '@/payload-types'
import { useQuery } from '@tanstack/react-query'
import { Clock } from 'lucide-react'
import { useEffect, useState } from 'react'

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
  // Convert "2:00 PM" → minutes since midnight
  function timeStringToMinutes(str: string) {
    const [time, modifier] = str.trim().split(' ')
    let [hours, minutes] = time.split(':').map(Number)

    if (modifier === 'PM' && hours !== 12) hours += 12
    if (modifier === 'AM' && hours === 12) hours = 0

    return hours * 60 + minutes
  }

  const candidateMinutes = timeStringToMinutes(timeString)

  for (const booking of bookings) {
    const start = new Date(booking.time)

    // Convert booking time to minutes since midnight (LOCAL time)
    const startMinutes = start.getHours() * 60 + start.getMinutes()

    const endMinutes = startMinutes + booking.duration

    // If candidate falls inside booked range → NOT available
    if (candidateMinutes >= startMinutes && candidateMinutes < endMinutes) {
      return false
    }
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
    <div className="h-full overflow-y-auto rounded-lg border border-border p-3">
      {techAvailability &&
        techAvailability.map((timeRange) => {
          const start = parseInt(timeRange.start)
          const end = parseInt(timeRange.end)
          const timeSlots = generateTimeSlots(start, end)
          // const isSelected = selectedTime === time
          // // Simulate some unavailable slots
          // const isUnavailable = time === '12:00 PM' || time === '2:30 PM'
          return (
            <div key={timeRange.id} className="grid grid-cols-3 gap-2">
              {timeSlots.map((time) => {
                const isAvailable = isTimeAvailable(time, bookingTakenState || [])
                return (
                  <Button
                    key={time}
                    variant="outline"
                    // onClick={() => !isUnavailable && onSelectTime(time)}
                    disabled={isFetchingBookings || !isAvailable}
                    className={cn(
                      'rounded-md px-2 py-2 text-sm font-medium transition-all',
                      // isSelected
                      //   ? 'bg-primary text-primary-foreground'
                      //   : isUnavailable
                      //     ? 'cursor-not-allowed bg-muted text-muted-foreground line-through'
                      //     : 'bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary',
                    )}
                  >
                    {time}
                  </Button>
                )
              })}
            </div>
          )
        })}
    </div>
  )
}
