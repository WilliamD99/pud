import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import config from '@/payload.config'
import './styles.css'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { Card, CardContent } from '@/components/ui/card'
import ServiceCarousel from '@/components/frontend/ServiceCarousel'
import TestComponent from '@/components/frontend/ServiceCarousel/test'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  return (
    <div className="home">
      <div className="content flex justify-center items-center">
        <TestComponent />
      </div>
      <div className="footer">
        <p>Update this page by editing</p>
        <a className="codeLink" href={fileURL}>
          <code>app/(frontend)/page.tsx</code>
        </a>
      </div>
    </div>
  )
}

{
  /* <div
className="w-full h-full relative"
style={{
  backgroundImage:
  'linear-gradient(180deg, transparent 37%, #7a6047 66%), radial-gradient(circle farthest-corner at 50% 0%, #0e0a0780 19%, transparent), url("/background.avif")',
  backgroundSize: 'auto, auto, cover',
  backgroundPosition: '0 0, 0 0, 50% 100%',
  backgroundRepeat: 'no-repeat',
}}
>
Section Header
<div className="h-screen"></div>
Section Slider
<div className="min-h-screen relative bg-gray-400">
  <div className="h-full mx-0 my-[10rem] flex justify-center items-center">
    <ServiceCarousel />
  </div>
</div>
</div> */
}
