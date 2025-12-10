import React from 'react'
import './styles/styles.css'
import Header from '@/components/frontend/Header'

import { Instrument_Sans } from 'next/font/google'
import { cn } from '@/lib/utils'
import QueryClientWrapper from '@/components/frontend/QueryProvider/query-client-provider'

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-instrument-sans',
})

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body className={cn('', instrumentSans.variable)}>
        <div className="container mx-auto relative">
          <Header />
          <main>
            <QueryClientWrapper>{children}</QueryClientWrapper>
          </main>
        </div>
      </body>
    </html>
  )
}
