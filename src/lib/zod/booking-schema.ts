import * as z from 'zod'

export const BookingSchema = z.object({
  // Service selection
  service: z.string().min(1, 'Please select a service'),
  variant: z.string().nullable(),

  // Technician selection
  technician: z.string().min(1, 'Please select a technician'),

  // Date and time
  date: z.date({ message: 'Please select a date' }),
  time: z.string().min(1, 'Please select a time slot'),

  // Customer information
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.email('Please enter a valid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  notes: z.string().optional(),
})

export type BookingFormData = z.infer<typeof BookingSchema>

// Helper function to combine date and time into a single Date object
export function combineDateAndTime(date: Date, timeString: string): Date {
  // Parse time string like "2:00 PM" or "10:30 AM"
  const [time, modifier] = timeString.trim().split(' ')
  const [hoursStr, minutesStr] = time.split(':')
  let hours = Number(hoursStr)
  const minutes = Number(minutesStr)

  if (modifier === 'PM' && hours !== 12) hours += 12
  if (modifier === 'AM' && hours === 12) hours = 0

  const combined = new Date(date)
  combined.setHours(hours, minutes, 0, 0)

  return combined
}
