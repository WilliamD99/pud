'use client'

import React from 'react'
import { MenuIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
export default function Header() {
  return (
    <div className="container mx-auto py-4 px-4 fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="relative flex flex-row items-center md:justify-between">
        <MenuIcon />
        <p className="absolute left-1/2 -translate-x-1/2 md:block">BRINGU</p>
        <Button
          className="hidden md:block cursor-pointer"
          onClick={() => console.log('book an appointment')}
        >
          Book an appointment
        </Button>
      </div>
    </div>
  )
}
