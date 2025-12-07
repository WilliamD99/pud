import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'
import { cacheTag } from 'next/cache'

// Fetch all parent services
export const fetchParentServices = async () => {
  'use cache'
  cacheTag('parent-services')
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
    console.log(data.docs)
    return data.docs
  } catch (error) {
    return {
      error: 'Failed to fetch parent services',
    }
  }
}
