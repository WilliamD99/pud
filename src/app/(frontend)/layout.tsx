import React from 'react'
import './styles/styles.css'
import Header from '@/components/frontend/Header'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body className="bg-black">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  )
}
