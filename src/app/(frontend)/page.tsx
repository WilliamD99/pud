import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import config from '@/payload.config'
import Hero from '@/components/frontend/Hero'
import AboutUs from '@/components/frontend/About'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const fileURL = `vscode://file/${fileURLToPath(import.meta.url)}`

  return (
    <div className="home bg-black">
      <Hero />
      <AboutUs />
      <div className="content flex justify-center items-center">{/* <TestComponent /> */}</div>
    </div>
  )
}
