import Image from 'next/image'
import React, { forwardRef } from 'react'

import { ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Service } from '@/payload-types'

const ServiceBox = forwardRef<HTMLDivElement, { service: Service }>(({ service }, ref) => {
  return (
    <div ref={ref} className="service-box relative w-full h-64 md:h-80 lg:h-[600px]">
      <Image
        className="object-cover brightness-90 absolute inset-0 top-0 left-0 z-10"
        src="/service1.avif"
        alt=""
        fill
      />
      <div className="relative z-20 flex items-end h-full px-4 pb-4 md:px-6 md:pb-8">
        <div className="flex flex-row justify-between items-center w-full">
          <p className="uppercase text-base md:text-lg font-instrument font-medium">
            {service.name}
          </p>
          <Link href="#">
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
})

ServiceBox.displayName = 'ServiceBox'

export default ServiceBox
