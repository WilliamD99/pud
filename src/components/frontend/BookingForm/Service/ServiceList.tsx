import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { cn } from '@/lib/utils'
import { Service } from '@/payload-types'
import React from 'react'

interface ServiceListProps {
  services: Service[]
  selectedService: string | null
  selectedVariant: string | null
  onSelectService: (serviceId: string) => void
  onSelectVariant: (serviceId: string, variantId: string) => void
}

export default function ServiceList({
  services,
  selectedService,
  selectedVariant,
  onSelectService,
  onSelectVariant,
}: ServiceListProps) {
  const handleServiceClick = (serviceId: string) => {
    onSelectService(serviceId)
  }
  const handleVariantClick = (serviceId: string, variantId: string) => {
    onSelectVariant(serviceId, variantId)
  }
  return (
    <>
      <Accordion type="single" collapsible className="space-y-3">
        {services.map((service: Service) => {
          const isServiceSelected = selectedService === service.servicesId
          const isParentService = service.isParent
          return (
            <React.Fragment key={service.id}>
              {isParentService && (
                <AccordionItem value={service.servicesId || ''} className="space-y-2 border-none">
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
                            (typeof variant.subService === 'object' &&
                              variant.subService?.servicesId)
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
              )}
              {!isParentService && (
                <div>
                  <button
                    type="button"
                    onClick={() => handleServiceClick(service.servicesId || '')}
                    className={cn(
                      'flex w-full flex-row justify-between items-start rounded-lg border-2 p-4 text-left transition-all hover:border-primary/50 cursor-pointer hover:no-underline',
                      selectedService === service.servicesId
                        ? 'border-blue-500 bg-primary/5'
                        : 'border-border bg-card hover:bg-accent/50',
                    )}
                  >
                    <div className="flex flex-col space-y-2">
                      <h3 className="mt-3 text-lg font-medium text-foreground font-instrument">
                        {service.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-400 font-instrument ">
                        {service.description}
                      </p>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <span className="text-lg font-semibold text-primary">
                        ${service.priceRange?.min}
                      </span>
                    </div>
                  </button>
                </div>
              )}
            </React.Fragment>
          )
        })}
      </Accordion>
    </>
  )
}
