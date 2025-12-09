'use client'

import { cn } from '@/lib/utils'
import { Star } from 'lucide-react'
import Image from 'next/image'

const technicians = [
  {
    id: 'emma',
    name: 'Emma Johnson',
    role: 'Senior Lash Artist',
    rating: 4.9,
    reviews: 128,
    image: '/professional-woman-lash-artist-portrait.jpg',
  },
  {
    id: 'sophia',
    name: 'Sophia Chen',
    role: 'Volume Specialist',
    rating: 4.8,
    reviews: 95,
    image: '/asian-woman-beauty-technician-portrait.jpg',
  },
  {
    id: 'olivia',
    name: 'Olivia Martinez',
    role: 'Lash Artist',
    rating: 4.7,
    reviews: 67,
    image: '/latina-woman-esthetician-portrait.jpg',
  },
]

interface TechnicianSelectorProps {
  selectedTechnician: string | null
  onSelectTechnician: (technician: string) => void
}

export function TechnicianSelector({
  selectedTechnician,
  onSelectTechnician,
}: TechnicianSelectorProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {technicians.map((tech) => {
        const isSelected = selectedTechnician === tech.id
        return (
          <button
            key={tech.id}
            type="button"
            // onClick={() => onSelectTechnician(tech.id)}
            className={cn(
              'flex flex-col items-center rounded-lg border-2 p-4 text-center transition-all hover:border-primary/50',
              isSelected
                ? 'border-primary bg-primary/5'
                : 'border-border bg-card hover:bg-accent/50',
            )}
          >
            <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-border">
              <Image
                src={tech.image || '/placeholder.svg'}
                alt={tech.name}
                fill
                className="object-cover"
              />
            </div>
            <h3 className="mt-3 font-medium text-foreground">{tech.name}</h3>
            <p className="text-xs text-muted-foreground">{tech.role}</p>
            <div className="mt-2 flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              <span className="text-sm font-medium text-foreground">{tech.rating}</span>
              <span className="text-xs text-muted-foreground">({tech.reviews})</span>
            </div>
          </button>
        )
      })}
    </div>
  )
}
