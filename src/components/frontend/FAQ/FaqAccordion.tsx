'use client'
import React, { useRef } from 'react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

interface FaqAccordionProps {
  faq: {
    question?: string | null
    answer?: string | null
    id?: string | null
  }[]
}

export default function FaqAccordion({ faq }: FaqAccordionProps) {
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
        containerRef.current.querySelectorAll('.faq-accordion-item'),
        {
          autoAlpha: 0,
          y: 50,
        },
        {
          autoAlpha: 1,
          stagger: 0.08,
          ease: 'power2.inOut',
          y: 0,
        },
      )
    },
    {
      scope: containerRef,
    },
  )

  return (
    <Accordion ref={containerRef} type="single" collapsible className="faq-accordion">
      {faq.map((item, index) => (
        <AccordionItem
          className="faq-accordion-item my-4 px-4 md:px-6 md:py-4 border-none rounded-lg"
          value={`item-${index}`}
          key={`faq-${index}`}
        >
          <AccordionTrigger className="uppercase font-instrument text-white md:text-lg">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="font-instrument text-gray-400 md:text-base">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
