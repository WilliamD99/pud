import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'
import { unstable_cache as cache } from 'next/cache'

// Get main services
export const fetchParentServices = cache(
  async () => {
    try {
      const payload = await getPayload({
        config: payloadConfig,
      })
      const data = await payload.find({
        collection: 'services',
        where: {
          and: [
            {
              isSubService: {
                equals: false,
              },
            },
            {
              disabled: {
                equals: false,
              },
            },
          ],
        },
      })
      return { data: data.docs, status: 200 }
    } catch (error) {
      console.log(error)
      return {
        data: [],
        status: 500,
      }
    }
  },
  [],
  {
    tags: ['parent-services'],
  },
)

// Get services (with sub services) - grouped by category
export const fetchServices = cache(
  async () => {
    try {
      const payload = await getPayload({ config: payloadConfig })

      const data = await payload.find({
        collection: 'services',
        where: {
          or: [
            {
              and: [
                {
                  isParent: {
                    equals: false,
                  },
                },
                {
                  isSubService: {
                    equals: false,
                  },
                },
                {
                  disabled: {
                    equals: false,
                  },
                },
              ],
            },
            {
              and: [
                {
                  isParent: {
                    equals: true,
                  },
                },
                {
                  disabled: {
                    equals: false,
                  },
                },
              ],
            },
          ],
        },
      })

      // Group services by category
      const groupedServices = data.docs.reduce(
        (acc, service) => {
          const category = service.category || 'uncategorized'
          const existingGroup = acc.find((g) => g.category === category)

          if (existingGroup) {
            existingGroup.services.push(service)
          } else {
            acc.push({ category, services: [service] })
          }

          return acc
        },
        [] as { category: string; services: typeof data.docs }[],
      )

      return {
        data: groupedServices,
        status: 200,
      }
    } catch (error) {
      console.log(error)
      return {
        data: [],
        status: 500,
      }
    }
  },
  [],
  {
    tags: ['services'],
  },
)

// Get frequently asked questions
export const fetchStoreSettings = cache(
  async () => {
    try {
      const payload = await getPayload({
        config: payloadConfig,
      })
      const data = await payload.findGlobal({
        slug: 'store-settings',
        depth: 2,
      })
      // console.log(data)
      return {
        data: data,
        status: 200,
      }
    } catch (error) {
      console.log(error)
      return {
        data: null,
        status: 500,
      }
    }
  },
  [],
  {
    tags: ['store-settings'],
  },
)

//
