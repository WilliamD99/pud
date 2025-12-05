'use client'
import React, { useRef } from 'react'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(SplitText)

export default function HeroContent() {
  const containerRef = useRef<HTMLDivElement>(null)
  const title1Ref = useRef<HTMLParagraphElement>(null)
  const title2Ref = useRef<HTMLParagraphElement>(null)
  const title3Ref = useRef<HTMLParagraphElement>(null)

  useGSAP(
    () => {
      let split1 = SplitText.create(title1Ref.current, { type: 'chars' })
      let split2 = SplitText.create(title2Ref.current, { type: 'chars' })

      let tl = gsap.timeline()
      tl.fromTo(
        split1.chars,
        {
          autoAlpha: 0,
          y: 20,
        },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.01,
          duration: 1,
          ease: 'power2.out',
          onStart: () => {
            gsap.set(title1Ref.current, { visibility: 'visible' })
          },
        },
      )
      tl.fromTo(
        split2.chars,
        {
          autoAlpha: 0,
          y: 20,
        },
        {
          autoAlpha: 1,
          y: 0,
          stagger: 0.01,
          duration: 1,
          ease: 'power2.out',
          onStart: () => {
            gsap.set(title2Ref.current, { visibility: 'visible' })
          },
        },
        '<0.15',
      )
      tl.fromTo(
        title3Ref.current,
        {
          autoAlpha: 0,
        },
        {
          autoAlpha: 1,
        },
        '<0.5',
      )
    },
    {
      scope: containerRef,
    },
  )

  return (
    <div ref={containerRef} className="hero-content z-20 relative">
      <h1
        ref={title1Ref}
        className="text-center font-semibold text-6xl md:text-8xl xl:text-9xl uppercase font-instrument tracking-tighter xl:tracking-normal"
      >
        Makeup
      </h1>
      <h1
        ref={title2Ref}
        className="text-center font-semibold text-6xl md:text-8xl xl:text-9xl uppercase font-instrument tracking-tighter xl:tracking-normal"
      >
        Studio
      </h1>
      <p
        ref={title3Ref}
        className="subtitle text-center font-semibold absolute -bottom-28 md:-bottom-20 left-1/2 -translate-x-1/2 uppercase font-instrument tracking-wide xl:tracking-wider text-gray-400 text-nowrap"
      >
        Vancouver City
      </p>
    </div>
  )
}
