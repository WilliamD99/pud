import React from 'react'
import BookingForm from './BookingForm'
import { fetchServices, fetchStoreSettings } from '@/lib/fetchServer'

export default async function BookingFormWrapper() {
  const { data: services } = await fetchServices()
  const data = await fetchStoreSettings()
  const operatingHours = data.data?.operatingHours

  return <BookingForm services={services} operatingHours={operatingHours} />
}
