'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Service } from '@/payload-types'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface ServiceSelectorProps {
  services: Service[]
  selectedService: string | null
  selectedVariant: string | null
  onSelectService: (serviceId: string, variantId: string | null) => void
  compact?: boolean
}

export default function ServiceSelector({
  selectedService,
  selectedVariant,
  onSelectService,
  services,
}: ServiceSelectorProps) {
  const [expandedService, setExpandedService] = useState<string | null>(selectedService)

  useEffect(() => {
    if (selectedService) {
      setExpandedService(selectedService)
    }
  }, [selectedService])

  const handleServiceClick = (serviceId: string) => {
    const service = services.find((s) => s.servicesId === serviceId)
    if (service?.subServices && service.subServices.length > 0) {
      setExpandedService(expandedService === serviceId ? null : serviceId)
      // Also select the parent service to trigger technician fetch
      onSelectService(serviceId, null)
    } else {
      onSelectService(serviceId, null)
    }
  }

  const handleVariantClick = (serviceId: string, variantId: string) => {
    onSelectService(serviceId, variantId)
  }

  return (
    <Accordion type="single" collapsible className="space-y-3">
      {services.map((service) => {
        const isServiceSelected = selectedService === service.servicesId
        return (
          <AccordionItem
            value={service.servicesId || ''}
            key={service.id}
            className="space-y-2 border-none"
          >
            <AccordionTrigger
              onClick={() => handleServiceClick(service.servicesId || '')}
              className={cn(
                'flex w-full flex-row items-start rounded-lg border-2 p-4 text-left transition-all hover:border-primary/50 cursor-pointer hover:no-underline',
                selectedService === service.servicesId
                  ? 'border-blue-500 bg-primary/5'
                  : 'border-border bg-card hover:bg-accent/50',
              )}
            >
              <div className="flex flex-col w-[98%]">
                <div className="flex w-full items-end justify-end">
                  {service.subServices && service.subServices.length > 0 ? (
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-sm text-muted-foreground">Select option</span>
                    </div>
                  ) : (
                    <span className="text-lg font-semibold text-primary">
                      {service.priceRange?.min}
                    </span>
                  )}
                </div>
                <div className="flex flex-col space-y-2">
                  <h3 className="mt-3 text-lg font-medium text-foreground font-instrument">
                    {service.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-400 font-instrument ">
                    {service.description}
                  </p>
                </div>
              </div>
            </AccordionTrigger>

            {service.subServices && service.subServices.length > 0 && (
              <AccordionContent className="ml-4 grid gap-2 sm:grid-cols-2">
                {service.subServices.map((variant) => {
                  const isVariantSelected =
                    isServiceSelected &&
                    selectedVariant ===
                      (typeof variant.subService === 'object' && variant.subService?.servicesId)
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      onClick={() =>
                        handleVariantClick(
                          service.servicesId || '',
                          (typeof variant.subService === 'object' &&
                            variant.subService?.servicesId) ||
                            '',
                        )
                      }
                      className={cn(
                        'flex items-center justify-between rounded-lg border-2 px-4 py-3 text-left transition-all hover:border-primary/50 cursor-pointer',
                        isVariantSelected
                          ? 'border-blue-500 bg-primary/5'
                          : 'border-border bg-card hover:bg-accent/50',
                      )}
                    >
                      <div>
                        <span className="font-medium text-foreground">
                          {typeof variant.subService === 'object' && variant.subService?.name}
                        </span>
                        {/* <span className="ml-2 text-sm text-muted-foreground">
                            {variant.duration}
                          </span> */}
                      </div>
                      <span className="text-lg font-semibold text-primary">
                        $
                        {typeof variant.subService === 'object' &&
                          variant.subService?.priceRange?.min}
                      </span>
                    </button>
                  )
                })}
              </AccordionContent>
            )}
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
