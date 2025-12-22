import { Service } from '@/payload-types'
import { GroupedServices } from '../BookingForm'

// Find the actual service objects by servicesId (UUID string)
export function findServiceByServicesId(
  servicesId: string | null,
  services: GroupedServices[],
): Service | null {
  if (!servicesId) return null

  for (const group of services) {
    for (const service of group.services) {
      // Match by servicesId (UUID string)
      if (service.servicesId === servicesId) {
        return service
      }
      // Check sub-services
      if (service.subServices) {
        for (const sub of service.subServices) {
          const subService = typeof sub.subService === 'object' ? sub.subService : null
          if (subService && subService.servicesId === servicesId) {
            return subService
          }
        }
      }
    }
  }

  return null
}

// Get the service to display (variant takes priority over parent)
export function getDisplayService(
  selectedService: string | null,
  selectedVariant: string | null,
  services: GroupedServices[],
): Service | null {
  if (selectedVariant) {
    return findServiceByServicesId(selectedVariant, services)
  }
  return findServiceByServicesId(selectedService, services)
}
