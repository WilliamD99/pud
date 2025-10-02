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
      label: 'Services Provided',
      name: 'services',
      type: 'relationship',
      relationTo: 'services',
      hasMany: true,
    },
  ],
}
