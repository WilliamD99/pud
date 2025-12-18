import { Calendar } from '@/components/ui/calendar'
import React from 'react'
import { Technician } from '@/payload-types'

interface CalendarPickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  selectedTechnician: Technician | null
  openWeekdays: string[]
  disabled: boolean
  setDateIndex: (index: number | null) => void
}

export default function CalendarPicker({
  date,
  setDate,
  openWeekdays,
  disabled,
  setDateIndex,
}: CalendarPickerProps) {
  return (
    <div className="relative w-full h-full">
      {disabled && (
        <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center">
          <p className="text-white text-center font-instrument">
            Please select a technician first.
          </p>
        </div>
      )}
      {openWeekdays.length === 0 && (
        <div className="absolute inset-0 bg-black/50 z-10 flex items-center justify-center">
          <p className="text-white text-center font-instrument">
            This technician schedules is not available at the moment.
          </p>
        </div>
      )}
      <Calendar
        mode="single"
        selected={date}
        onSelect={(date) => {
          setDate(date)
          setDateIndex(date?.getDay() || null)
        }}
        disabled={(date) => {
          if (disabled) return true
          const day = date.getDay()
          return !openWeekdays.includes(day.toString())
        }}
        className="rounded-lg border border-border w-full [&_button[data-selected-single=true]]:bg-blue-500 [&_button[data-selected-single=true]]:text-white"
      />
    </div>
  )
}
