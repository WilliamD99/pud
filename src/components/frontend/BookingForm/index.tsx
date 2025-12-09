import React from 'react'
import BookingForm from './BookingForm'
import { fetchServices } from '@/lib/fetchServer'

export default async function BookingFormWrapper() {
  const { data: services, status } = await fetchServices()
  return <BookingForm services={services} />
}
