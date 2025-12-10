import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import React from 'react'
import TimeSlotPicker from './TimeSlotPicker'
import { StoreSetting } from '@/payload-types'

interface BookingDatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  selectedTime: string | null
  setSelectedTime: (time: string | null) => void
  operatingDays: StoreSetting['operatingHours']
}

const weekdayMap = {
  sunday: 0,
  monday: 1,
  tuesday: 2,
  wednesday: 3,
  thursday: 4,
  friday: 5,
  saturday: 6,
}

export default function BookingDatePicker({
  date,
  setDate,
  selectedTime,
  setSelectedTime,
  operatingDays,
}: BookingDatePickerProps) {
  if (!operatingDays) return null
  const openWeekdays = operatingDays.map(
    (d) => weekdayMap[d.day.toLowerCase() as keyof typeof weekdayMap],
  )
  return (
    <div className="grid gap-6 md:grid-cols-2 relative">
      <div className="w-full relative h-full flex flex-col">
        <Label className="mb-2 block text-sm font-medium text-muted-foreground">Select Date</Label>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          disabled={(date) => {
            const day = date.getDay()
            return !openWeekdays.includes(day)
          }}
          className="rounded-lg border border-border w-full"
        />
      </div>
      <div className="relative w-full h-full flex flex-col">
        <Label className="mb-2 block text-sm font-medium text-muted-foreground">Select Time</Label>
        <TimeSlotPicker
          selectedTime={selectedTime}
          onSelectTime={setSelectedTime}
          disabled={!date}
        />
      </div>
    </div>
  )
}
