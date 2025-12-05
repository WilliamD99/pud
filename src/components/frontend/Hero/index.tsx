import React from 'react'
import HeroContent from './HeroContent'
import HeroImage from './HeroImage'

export default function Hero() {
  return (
    <div className="hero-container max-h-screen h-[60vh] w-full relative">
      <div className="hero relative h-full flex justify-center items-center">
        <div className="hero-background grid grid-cols-1 gap-y-5 absolute z-10 w-full">
          <HeroImage src="/hero_1.avif" alt="Hero Background 1" className="justify-end" />
          <HeroImage src="/hero_2.avif" alt="Hero Background 2" className="justify-start" />
        </div>
        <HeroContent />
      </div>
    </div>
  )
}
