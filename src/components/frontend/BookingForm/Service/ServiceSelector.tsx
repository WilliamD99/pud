'use client'

import React from 'react'
import { Service } from '@/payload-types'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import ServiceList from './ServiceList'

interface GroupedServices {
  category: string
  services: Service[]
}

interface ServiceSelectorProps {
  groupedServices: GroupedServices[]
  selectedService: string | null
  selectedVariant: string | null
  onSelectService: (serviceId: string, variantId: string | null) => void
  compact?: boolean
}

// Category label mapping for display
const categoryLabels: Record<string, string> = {
  skincare: 'Skincare Services',
  hair: 'Hair Services',
  nails: 'Nails Services',
  makeup: 'Makeup Services',
  lashes: 'Lashes Services',
  uncategorized: 'Other Services',
}

export default function ServiceSelector({
  selectedService,
  selectedVariant,
  onSelectService,
  groupedServices,
}: ServiceSelectorProps) {
  return (
    <Accordion type="multiple" defaultValue={groupedServices.map((group) => group.category)}>
      {groupedServices.length > 1 &&
        groupedServices.map((group) => (
          <AccordionItem value={group.category} key={group.category} className="border-none">
            <AccordionTrigger className="cursor-pointer justify-start text-sm w-fit font-semibold text-muted-foreground uppercase tracking-wide mb-3 hover:no-underline">
              {categoryLabels[group.category] || group.category}
            </AccordionTrigger>
            <AccordionContent>
              <ServiceList
                services={group.services}
                selectedService={selectedService}
                selectedVariant={selectedVariant}
                onSelectService={(serviceId: string) => onSelectService(serviceId, null)}
                onSelectVariant={(serviceId: string, variantId: string) =>
                  onSelectService(serviceId, variantId)
                }
              />
            </AccordionContent>
          </AccordionItem>
        ))}
      {groupedServices.length === 1 && (
        <ServiceList
          services={groupedServices[0].services}
          selectedService={selectedService}
          selectedVariant={selectedVariant}
          onSelectService={(serviceId: string) => onSelectService(serviceId, null)}
          onSelectVariant={(serviceId: string, variantId: string) =>
            onSelectService(serviceId, variantId)
          }
        />
      )}
    </Accordion>
  )
}
