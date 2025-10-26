'use client'
import { Card, CardContent } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import Image from 'next/image'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { type CarouselApi } from '@/components/ui/carousel'

import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

function throttle<T extends (...args: any[]) => void>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let lastCall = 0
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    const now = Date.now()
    const remaining = delay - (now - lastCall)

    if (remaining <= 0) {
      if (timeoutId) {
        clearTimeout(timeoutId)
        timeoutId = null
      }
      lastCall = now
      func.apply(this, args)
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastCall = Date.now()
        timeoutId = null
        func.apply(this, args)
      }, remaining)
    }
  }
}

export default function ServiceCarousel() {
  const [api, setApi] = useState<CarouselApi>()
  const carouselRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])
  const { contextSafe } = useGSAP({ scope: carouselRef })

  const setItemRef = (index: number) => (el: HTMLDivElement | null) => {
    itemsRef.current[index] = el
  }

  const handleScroll = contextSafe(
    useCallback((api: CarouselApi) => {
      const scrollProgress = api?.scrollProgress() || 0 // 0 to 1

      const slidesInView = api?.slidesInView()
      const slidesNotInView = api?.slidesNotInView()

      slidesInView?.forEach((slideIndex: number) => {
        gsap.set(itemsRef.current[slideIndex], {
          x: `${scrollProgress * 25}%`,
          ease: 'none',
        })
      })

      slidesNotInView?.forEach((slideIndex: number) => {
        gsap.set(itemsRef.current[slideIndex], {
          x: 0,
          ease: 'none',
        })
      })
    }, []),
  )

  useEffect(() => {
    if (!api) return

    const throttledHandleScroll = throttle(handleScroll, 100)
    api.on('scroll', throttledHandleScroll)

    return () => {
      api.off('scroll', throttledHandleScroll)
    }
  }, [api, handleScroll])

  return (
    <>
      <Carousel
        ref={carouselRef}
        className="w-full"
        opts={{
          skipSnaps: true,
          loop: true,
        }}
        setApi={setApi}
      >
        <CarouselContent className="-ml-1">
          {Array.from({ length: 7 }).map((_, index) => (
            <CarouselItem key={index} className="pl-1 md:basis-1/2 lg:basis-1/5">
              <div className="p-1">
                <Card className="relative w-full max-w-sm overflow-hidden">
                  <CardContent className="overflow-hidden flex aspect-square items-center justify-center p-6">
                    <span className="text-2xl text-red-300 z-50 font-semibold">{index + 1}</span>
                    <div className="w-[180%] h-full absolute top-0 left-0 -translate-x-1/5">
                      <Image
                        ref={setItemRef(index)}
                        src="/service.avif"
                        fill
                        alt="Service"
                        className="object-cover test pointer-events-none"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </>
  )
}
