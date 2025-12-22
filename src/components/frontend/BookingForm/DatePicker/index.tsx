import { Label } from '@/components/ui/label'
import React, { useState } from 'react'
import TimeSlotPicker from './TimeSlotPicker'
import CalendarPicker from './CalendarPicker'
import { StoreSetting, Technician } from '@/payload-types'

interface DatePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
  selectedTime: string | null
  setSelectedTime: (time: string | null) => void
  operatingDays: StoreSetting['operatingHours']
  selectedTechnician: Technician | null
}

const weekdayMap = {
  sunday: '0',
  monday: '1',
  tuesday: '2',
  wednesday: '3',
  thursday: '4',
  friday: '5',
  saturday: '6',
}

export default function DatePicker({
  date,
  setDate,
  selectedTime,
  setSelectedTime,
  operatingDays,
  selectedTechnician,
}: DatePickerProps) {
  const [dateIndex, setDateIndex] = useState<number | null>(null)
  if (!operatingDays || !selectedTechnician)
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-sm text-muted-foreground font-instrument tracking-wide">
          Please select a technician first to view available dates and times
        </p>
      </div>
    )

  const techAvailability = selectedTechnician.weeklyAvailability || []
  const techAvailabilityByDay = techAvailability.map((day) => {
    return day.dayOfWeek
  })
  const openWeekdays = operatingDays.map(
    (d) => weekdayMap[d.day.toLowerCase() as keyof typeof weekdayMap],
  )

  // Only show the date that is both is in the techAvailabilityByDay and is in the operatingDays
  const availableDates = techAvailabilityByDay.filter((day) => openWeekdays.includes(day))
  const availableTimeRanges =
    techAvailability.find((day) => day.dayOfWeek === dateIndex?.toString())?.timeRanges || []
  return (
    <div className="grid gap-6 md:grid-cols-2 relative">
      <div className="w-full relative h-full flex flex-col">
        <Label className="mb-2 block text-sm font-medium text-muted-foreground">Select Date</Label>
        <CalendarPicker
          date={date}
          setDate={setDate}
          setDateIndex={setDateIndex}
          selectedTechnician={selectedTechnician}
          openWeekdays={availableDates}
          disabled={!selectedTechnician}
        />
      </div>
      <div className="relative w-full h-full flex flex-col">
        <Label className="mb-2 block text-sm font-medium text-muted-foreground">Select Time</Label>
        <TimeSlotPicker
          selectedTime={selectedTime}
          onSelectTime={setSelectedTime}
          disabled={!date}
          techAvailability={availableTimeRanges}
          techId={selectedTechnician?.techniciansId}
          date={date}
        />
      </div>
    </div>
  )
}
