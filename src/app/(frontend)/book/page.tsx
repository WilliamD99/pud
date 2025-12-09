import BookingForm from '@/components/frontend/BookingForm'
import React from 'react'

export default function BookingPage() {
  return (
    <>
      <main className="min-h-screen bg-background py-8 px-4 md:py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
              Luxe Lash Studio
            </h1>
            <p className="mt-2 text-muted-foreground">
              Book your appointment and enhance your natural beauty
            </p>
          </div>
          <BookingForm />
        </div>
      </main>
    </>
  )
}
