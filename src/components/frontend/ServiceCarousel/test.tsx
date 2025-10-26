'use client'

import React, { useEffect, useRef } from 'react'
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { throttle } from '@/lib/utils'
import CarouselCustomItem, { CarouselItemHandle } from './item'

export default function ParallaxCarousel() {
  const [api, setApi] = React.useState<CarouselApi>()
  const carouselContentRef = useRef<HTMLDivElement>(null)
  const carouselItemRefs = useRef<(CarouselItemHandle | null)[]>([])

  const setItemRef = (el: CarouselItemHandle | null, index: number) => {
    carouselItemRefs.current[index] = el
  }

  const handleScroll = throttle(() => {
    if (!carouselContentRef.current || !api) return

    const slidesInView = api.slidesInView()

    const scrollProgress = api?.scrollProgress() // 0 to 1
    carouselItemRefs.current.forEach((item, index) => {
      if (slidesInView?.includes(index)) {
        item?.setProgress((scrollProgress * 2) % 1)
      } else {
        item?.setProgress(0)
      }
    })
  }, 1)

  useEffect(() => {
    if (!api) return

    api.on('scroll', handleScroll)

    return () => {
      api.off('scroll', handleScroll)
    }
  }, [api])

  return (
    <div className="service-carousel h-screen w-full flex justify-center items-center bg-slate-500">
      <Carousel
        className="w-full max-w-4xl"
        opts={{
          loop: true,
          dragFree: true,
          align: 'start',
        }}
        setApi={setApi}
      >
        <CarouselContent ref={carouselContentRef} className="-ml-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <CarouselCustomItem key={index} index={index} ref={(el) => setItemRef(el, index)} />
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  )
}
