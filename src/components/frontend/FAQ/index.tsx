import { fetchFAQ } from '@/lib/fetchServer'
import React from 'react'
import FaqAccordion from './FaqAccordion'

export default async function FAQ() {
  const faq = await fetchFAQ()
  if (!faq.data) return null
  return (
    <div className="faq-container space-y-8 md:space-y-10 p-8 md:p-16">
      <div className="flex flex-col space-y-1 items-center">
        <p className="text-base md:text-xl font-instrument text-gray-400 uppercase">FAQ</p>
        <h1 className="text-4xl md:text-5xl uppercase font-instrument font-semibold tracking-tight">
          Questions
        </h1>
        <p className="pt-5 text-center text-base md:text-xl font-instrument text-gray-400 md:max-w-2xl">
          Have questions? We&apos;ve complied a list of frequently asked questions to help you get
          the most out of your visit.
        </p>
      </div>
      <div className="md:max-w-4xl mx-auto">
        <FaqAccordion faq={faq.data} />
      </div>
    </div>
  )
}
