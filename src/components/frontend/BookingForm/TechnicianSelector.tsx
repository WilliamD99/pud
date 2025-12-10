'use client'

import { fetchTechByService } from '@/lib/fetchClient'
import { cn } from '@/lib/utils'
import { Technician } from '@/payload-types'
import { useQuery } from '@tanstack/react-query'
import { Loader2, Star } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'

interface TechnicianSelectorProps {
  selectedTechnician: string | null
  onSelectTechnician: (technician: string) => void
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
    onSelectTechnician('')
  }, [selectedService])

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {techList.length > 0 &&
        techList.map((tech: Technician) => {
          const isSelected = selectedTechnician === tech.id.toString()
          return (
            <button
              key={tech.id}
              type="button"
              onClick={() => onSelectTechnician(tech.id.toString())}
              className={cn(
                'flex flex-col items-center rounded-lg border-2 p-4 text-center transition-all hover:border-primary/50',
                isSelected
                  ? 'border-primary bg-blue-500/5'
                  : 'border-border bg-card hover:bg-accent/50',
              )}
            >
              <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-border">
                {/* <Image
                src={tech.image || '/placeholder.svg'}
                alt={tech.name}
                fill
                className="object-cover"
              /> */}
              </div>
              <h3 className="mt-3 font-medium text-foreground">{tech.name}</h3>
              {/* <p className="text-xs text-muted-foreground">{tech.role}</p> */}
              <div className="mt-2 flex items-center gap-1">
                <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                {/* <span className="text-sm font-medium text-foreground">{tech.rating}</span> */}
                {/* <span className="text-xs text-muted-foreground">({tech.reviews})</span> */}
              </div>
            </button>
          )
        })}
      {isFetching && (
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      )}
    </div>
  )
}
