import type { CollectionConfig } from 'payload'
import { generateIdHook } from '@/hooks/beforeChangeHooks'

export const Technicians: CollectionConfig = {
  slug: 'technicians',
  admin: {
    useAsTitle: 'name',
  },
  disableDuplicate: true,
  hooks: {
    beforeChange: [generateIdHook],
  },
  access: {
    read: () => true,
    update: ({ req }) => !!req.user,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Basic Information',
          admin: {
            description: 'You can update the basic information of the technician here',
          },
          fields: [
            {
              name: 'techniciansId',
              type: 'text',
              unique: true,
              admin: {
                hidden: true,
                readOnly: true,
              },
              index: true,
            },
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'profilePicture',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'email',
              type: 'email',
              required: true,
              access: {
                read: ({ req }) => !!req.user,
              },
            },
            {
              name: 'phone',
              type: 'text',
            },
            {
              name: 'address',
              type: 'text',
              access: {
                read: ({ req }) => !!req.user,
              },
            },
            {
              name: 'services',
              label: 'Service Provided',
              type: 'array',
              fields: [
                {
                  label: 'Services Provided',
                  name: 'services',
                  type: 'relationship',
                  relationTo: 'services',
                },
                {
                  label: 'Duration',
                  name: 'duration',
                  type: 'number',
                  admin: {
                    description: 'Duration in minutes',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Availability',
          admin: {
            description: 'You can update the availability of the technician here',
          },
          fields: [
            {
              name: 'calendar',
              type: 'date',
              admin: {
                date: {
                  pickerAppearance: 'dayOnly',
                  displayFormat: 'd MMM yyy',
                },
              },
            },
          ],
        },
      ],
    },
  ],
}
