'use client'

import { useRef } from 'react'
import ServiceBox from './ServiceBox'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { Service } from '@/payload-types'
gsap.registerPlugin(ScrollTrigger)

interface ServiceBoxListProps {
  services: Service[]
}

export default function ServiceBoxList({ services }: ServiceBoxListProps) {
  const serviceBoxRefs = useRef<(HTMLDivElement | null)[]>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!containerRef.current) return
      let tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top bottom-=25%',
          end: 'bottom bottom',
        },
      })
      tl.fromTo(
        serviceBoxRefs.current,
        {
          autoAlpha: 0,
          y: 50,
        },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.03,
          ease: 'power2.inOut',
        },
      )
    },
    {
      scope: containerRef,
    },
  )

  return (
    <div
      ref={containerRef}
      className="about-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {services.map((service, index) => (
        <ServiceBox
          service={service}
          key={index}
          ref={(el: HTMLDivElement | null) => {
            serviceBoxRefs.current[index] = el
          }}
        />
      ))}
    </div>
  )
}
