'use client'

import { cn } from '@/lib/utils'
import { Clock } from 'lucide-react'

const timeSlots = [
  '9:00 AM',
  '9:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '1:00 PM',
  '1:30 PM',
  '2:00 PM',
  '2:30 PM',
  '3:00 PM',
  '3:30 PM',
  '4:00 PM',
  '4:30 PM',
  '5:00 PM',
  '5:30 PM',
]

interface TimeSlotPickerProps {
  selectedTime: string | null
  onSelectTime: (time: string) => void
  disabled?: boolean
}

export default function TimeSlotPicker({
  selectedTime,
  onSelectTime,
  disabled,
}: TimeSlotPickerProps) {
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
    <div className="grid h-full grid-cols-3 gap-2 overflow-y-auto rounded-lg border border-border p-3">
      {timeSlots.map((time) => {
        const isSelected = selectedTime === time
        // Simulate some unavailable slots
        const isUnavailable = time === '12:00 PM' || time === '2:30 PM'
        return (
          <button
            key={time}
            type="button"
            // onClick={() => !isUnavailable && onSelectTime(time)}
            disabled={isUnavailable}
            className={cn(
              'rounded-md px-2 py-2 text-sm font-medium transition-all',
              isSelected
                ? 'bg-primary text-primary-foreground'
                : isUnavailable
                  ? 'cursor-not-allowed bg-muted text-muted-foreground line-through'
                  : 'bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary',
            )}
          >
            {time}
          </button>
        )
      })}
    </div>
  )
}
