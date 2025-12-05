'use client'

import React from 'react'
import { MenuIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Header() {
  return (
    <div
      id="header"
      className="py-6 px-4 md:mt-6 md:mx-10 md:rounded-2xl sticky top-0 md:top-4 z-50"
    >
      <div className="relative flex flex-row items-center md:justify-between w-full mx-auto">
        <p className="md:block pl-2">BRINGU</p>

        <Button className="md:hidden absolute -right-0">
          <MenuIcon />
        </Button>

        <div className="hidden md:flex flex-row items-center justify-between">
          <div className="flex flex-row gap-x-1 pr-4">
            <Button asChild>
              <Link
                className="font-instrument uppercase text-gray-400 hover:text-white transition duration-300"
                href="/"
              >
                About
              </Link>
            </Button>
            <Button asChild>
              <Link
                className="font-instrument uppercase text-gray-400 hover:text-white transition duration-300"
                href="/"
              >
                Services
              </Link>
            </Button>
            <Button asChild>
              <Link
                className="font-instrument uppercase text-gray-400 hover:text-white transition duration-300"
                href="/"
              >
                Gallery
              </Link>
            </Button>
          </div>

          <div className="bg-white hover:bg-gray-300 transition duration-300 h-10 flex items-center justify-center px-4 rounded-md">
            <Link href="/" className="font-instrument font-medium uppercase text-black">
              Book Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
