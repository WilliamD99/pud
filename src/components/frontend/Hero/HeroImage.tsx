'use client'
import { cn } from '@/lib/utils'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Image from 'next/image'
import React, { useRef } from 'react'

export default function HeroImage({
  src,
  alt,
  className,
}: {
  src: string
  alt: string
  className?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const overlayLeftRef = useRef<HTMLDivElement>(null)
  const overlayRightRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (containerRef.current) {
        let tl = gsap.timeline({
          delay: 0.2,
        })
        tl.fromTo(
          overlayLeftRef.current,
          {
            scaleX: 1,
          },
          {
            scaleX: 0,
            ease: 'power4.inOut',
            duration: 1.5,
          },
        )
        tl.fromTo(
          overlayRightRef.current,
          {
            scaleX: 1,
          },
          {
            scaleX: 0,
            ease: 'power4.inOut',
            duration: 1.5,
          },
          '<',
        )
      }
    },
    {
      scope: containerRef,
    },
  )

  return (
    <div ref={containerRef} className={cn('flex w-full col-span-1', className)}>
      <div className="relative overflow-hidden h-28 w-40 md:h-48 md:w-64 lg:h-56 lg:w-72 xl:h-72 xl:w-96 2xl:h-96 2xl:w-[40%]">
        <Image src={src} fill alt={alt} className="object-cover" loading="eager" />
        <div className="absolute inset-0 z-20 overflow-hidden">
          <div
            ref={overlayLeftRef}
            className="overlay-left absolute inset-y-0 -left-px w-[calc(50%+2px)] bg-black origin-left"
          ></div>
          <div
            ref={overlayRightRef}
            className="overlay-right absolute inset-y-0 -right-px w-[calc(50%+2px)] bg-black origin-right"
          ></div>
        </div>
      </div>
    </div>
  )
}
