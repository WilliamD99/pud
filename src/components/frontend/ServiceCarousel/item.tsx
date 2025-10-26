import { Card, CardContent } from '@/components/ui/card'
import { CarouselItem } from '@/components/ui/carousel'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import Image from 'next/image'
import { forwardRef, useImperativeHandle, useRef } from 'react'

type ChildProps = {
  index: number
}

export interface CarouselItemHandle {
  setProgress: (value: number) => void
  getContainerRef: () => HTMLDivElement | null
  itemWidth: number
}

const CarouselCustomItem = forwardRef<CarouselItemHandle, ChildProps>(({ index }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const tweenRef = useRef<gsap.core.Tween>(null)

  useGSAP(
    () => {
      tweenRef.current = gsap.to(containerRef.current?.querySelector('.test') as HTMLElement, {
        x: '+=50',
        ease: 'none',
        duration: 2,
        modifiers: {
          // x: gsap.utils.unitize((x) => parseFloat(x) % 1000),
        },

        paused: true,
      })
    },
    {
      scope: containerRef,
    },
  )

  useImperativeHandle(ref, () => {
    const itemWidth = containerRef.current?.clientWidth || 0
    return {
      setProgress: (value: number) => tweenRef.current?.progress(value),
      getContainerRef: () => containerRef.current,
      test: (value: number) => tweenRef.current?.progress(value),
      itemWidth: itemWidth,
    }
  }, [])

  return (
    <CarouselItem
      ref={containerRef}
      key={index}
      className="pl-1 md:basis-1/2 lg:basis-1/3 relative"
    >
      <div className="p-1 item">
        <Card className="relative border-none overflow-hidden">
          <CardContent className="flex aspect-square items-center justify-center p-6">
            <span className="text-2xl font-semibold z-50">{index + 1}</span>
            <div className="absolute top-0 left-0 w-full h-full">
              <div
                className="w-[200%] h-full relative test"
                style={{ transform: 'translateX(-50%)' }}
              >
                <Image src={`https://picsum.photos/id/${index + 10}/700/600/`} fill alt="service" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </CarouselItem>
  )
})

CarouselCustomItem.displayName = 'CarouselCustomItem'
export default CarouselCustomItem
