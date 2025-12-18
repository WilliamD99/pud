'use client'

import { fetchTechByService } from '@/lib/fetchClient'
import { cn } from '@/lib/utils'
import { Technician } from '@/payload-types'
import { useQuery } from '@tanstack/react-query'
import { Skeleton } from '@/components/ui/skeleton'
import { Star } from 'lucide-react'
import Image from 'next/image'
import { useEffect } from 'react'

interface TechnicianSelectorProps {
  selectedTechnician: Technician | null
  onSelectTechnician: (technician: Technician | null) => void
  selectedService: string
}

export function TechnicianSelector({
  selectedTechnician,
  onSelectTechnician,
  selectedService,
}: TechnicianSelectorProps) {
  const { data: techList, isFetching } = useQuery({
    queryKey: ['techs', selectedService],
    queryFn: ({ queryKey }) => fetchTechByService(queryKey[1] as string).then((res) => res.data),
    enabled: !!selectedService,
    initialData: [],
  })

  useEffect(() => {
    // Clear selected technician when service changes
    onSelectTechnician(null)
  }, [selectedService])

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {techList.length > 0 &&
        techList.map((tech: Technician) => {
          const isSelected = selectedTechnician?.id === tech.id
          // Get the selected service duration for the selected technician
          const selectedServiceDuration = tech.services?.find((service) => {
            if (typeof service.service === 'object') {
              let serviceId = service.service?.servicesId
              return serviceId?.toString() === selectedService
            }
            return false
          })?.duration

          const profilePicture =
            typeof tech.profilePicture === 'object' ? tech.profilePicture?.url : null

          return (
            <button
              key={tech.id}
              type="button"
              onClick={() => onSelectTechnician(tech)}
              className={cn(
                'flex flex-col items-center rounded-lg border-2 p-4 text-center transition-all hover:border-primary/50 cursor-pointer',
                isSelected
                  ? 'border-primary bg-blue-500/5'
                  : 'border-border bg-card hover:bg-accent/50',
              )}
            >
              <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-border">
                {profilePicture && (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_APP_URL}${profilePicture}`}
                    alt={tech.name}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <h3 className="mt-3 font-medium text-foreground">{tech.name}</h3>
              {/* <p className="text-xs text-muted-foreground">{tech.role}</p> */}
              <div className="mt-2 flex items-center gap-1">
                {/* <Star className="h-3.5 w-3.5 fill-primary text-primary" /> */}
                <span className="text-sm font-medium text-foreground">
                  {selectedServiceDuration} minutes
                </span>
                {/* <span className="text-xs text-muted-foreground">({tech.reviews})</span> */}
              </div>
            </button>
          )
        })}
      {!!isFetching &&
        Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center rounded-lg border-2 border-border bg-card p-4"
          >
            <Skeleton className="h-16 w-16 rounded-full bg-white" />
            <Skeleton className="mt-4 h-4 w-20 bg-white" />
            <Skeleton className="mt-4 h-4 w-16 bg-white" />
          </div>
        ))}
    </div>
  )
}
