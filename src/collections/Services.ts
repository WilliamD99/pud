import { generateIdHook } from '@/hooks/beforeChangeHooks'
import type { CollectionBeforeChangeHook, CollectionConfig } from 'payload'

const revalidateOnUpDateAfterChangeHook: CollectionBeforeChangeHook = async ({ data }) => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/revalidate-service`, {
      method: 'POST',
    })
    const data = await response.json()
    console.log(data)
  } catch (err) {
    console.error(err)
  }
  return data
}

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'servicePicture'],
    listSearchableFields: ['name', 'category'],
    baseFilter: () => {
      return {
        isSubService: {
          equals: false,
        },
      }
    },
  },
  disableDuplicate: true,
  hooks: {
    beforeChange: [generateIdHook],
    afterChange: [revalidateOnUpDateAfterChangeHook],
  },
  fields: [
    {
      name: 'servicesId',
      type: 'text',
      admin: {
        readOnly: true,
        hidden: true,
      },
    },
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'description',
      type: 'richText',
    },
    {
      name: 'servicePicture',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'category',
      type: 'select',
      options: [
        {
          label: 'Skincare Services',
          value: 'skincare',
        },
        {
          label: 'Hair Services',
          value: 'hair',
        },
        {
          label: 'Nails Services',
          value: 'nails',
        },
        {
          label: 'Makeup Services',
          value: 'makeup',
        },
        {
          label: 'Lashes Services',
          value: 'lashes',
        },
      ],
    },
    {
      name: 'isParent',
      label: 'Has Sub Services',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Set to true if this service has sub services',
      },
    },
    {
      name: 'subServices',
      label: 'Sub Services',
      type: 'array',
      validate: (items) => {
        // Prevent duplicate sub services
        if (!items) return true
        const ids = items.map((i: any) => i.subService)
        const hasDuplicate = ids.some((id, i) => ids.indexOf(id) !== i)

        return hasDuplicate ? 'Duplicate sub-services are not allowed.' : true
      },
      admin: {
        condition: (_, siblingData) => siblingData.isParent,
      },
      hooks: {
        beforeChange: [
          // Auto sync lookup the min and max price of sub services, then put it to the parent price
          async ({ siblingData, value, req }) => {
            let price = []
            if (value.length > 0) {
              for (const subService of value) {
                try {
                  let subServiceData = await req.payload.findByID({
                    collection: 'services',
                    id: subService.subService as number,
                  })
                  let subServicePriceMin = subServiceData.priceRange?.min || 0
                  let subServicePriceMax = subServiceData.priceRange?.max || 0

                  if (subServicePriceMin !== 0) price.push(subServicePriceMin)
                  if (subServicePriceMax !== 0) price.push(subServicePriceMax)

                  // Mark the sub service as a sub service
                  if (!subServiceData.isSubService) {
                    await req.payload.update({
                      collection: 'services',
                      id: subService.subService as number,
                      data: {
                        isSubService: true,
                      },
                    })
                  }
                } catch (error) {
                  continue
                }
              }
              let min = Math.min(...price)
              let max = Math.max(...price)
              siblingData.priceRange = { min, max }
            }
            return value
          },
        ],
      },
      fields: [
        {
          name: 'subService',
          type: 'relationship',
          relationTo: 'services',
          filterOptions: ({ data }) => {
            // Prevent selecting its own
            if (data?.id) {
              return {
                id: {
                  not_equals: data.id,
                },
              }
            }
            return true
          },
        },
      ],
    },
    {
      name: 'priceRange',
      label: 'Price Range',
      admin: {
        description: 'You can set only the min or max price if the service has one price',
      },
      type: 'group',
      hooks: {
        beforeChange: [
          ({ value }) => {
            if (typeof value.min === 'number' && value.max === null) {
              value.max = value.min // auto-sync max with min
            } else if (typeof value.max === 'number' && value.min === null) {
              value.min = value.max // auto-sync min with max
            }
            return value
          },
        ],
      },
      fields: [
        {
          name: 'min',
          type: 'number',
          min: 0,
        },
        {
          name: 'max',
          type: 'number',
        },
      ],
    },
    {
      name: 'isSubService',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'disabled',
      label: 'Disabled',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Use this to disable the service from the frontend.',
      },
    },
  ],
}
