import { generateIdHook } from '@/hooks/beforeChangeHooks'
import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'name',
  },
  disableDuplicate: true,
  hooks: {
    beforeChange: [generateIdHook],
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
      type: 'text',
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
      ],
    },
    {
      name: 'price',
      type: 'number',
      min: 0,
      required: true,
    },
    {
      name: 'jobs',
      type: 'relationship',
      relationTo: 'jobs',
      hasMany: true,
    },
  ],
}
