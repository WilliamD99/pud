import React from 'react'
import ServiceBoxList from './ServiceBoxList'
import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'
import { fetchParentServices } from '@/lib/fetchServer'

export default async function AboutUs() {
  let fetchedServices = await fetchParentServices()
  // console.log(fetchedServices)
  if ('error' in fetchedServices) {
    fetchedServices = []
  }
  return (
    <div className="about-container space-y-8 md:space-y-16">
      <div className="about-content flex flex-col md:flex-row space-y-2">
        <div className="flex flex-col space-y-2 md:basis-3/5">
          <p className="text-base md:text-xl font-instrument text-gray-400 uppercase">About Us</p>
          <h1 className="text-4xl md:text-5xl uppercase font-instrument font-semibold tracking-tight">
            Based in Vancouver city
          </h1>
        </div>
        <p className="text-base md:text-xl pt-4 font-instrument text-gray-400 md:basis-2/5 md:pt-10">
          At Makeup Studio, our professional artists are dedicated to enhancing your natural beauty
          with tailored makeup looks for every occasion.
        </p>
      </div>
      <ServiceBoxList services={fetchedServices} />
    </div>
  )
}
