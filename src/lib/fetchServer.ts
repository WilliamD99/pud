import { getPayload } from 'payload'
import payloadConfig from '@/payload.config'
import { unstable_cache as cache } from 'next/cache'

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
      console.log(data.docs)
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
