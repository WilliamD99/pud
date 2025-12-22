import { generateIdHook } from '@/hooks/beforeChangeHooks'
import type { CollectionConfig } from 'payload'

export const Customers: CollectionConfig = {
  slug: 'customers',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    read: async ({ req, data }) => {
      const currentUser = req.user
      if (currentUser?.role === 'admin') return true

      if (currentUser?.role === 'staff') {
        // return true for now
        // Can work on something like only show if customer associated with the staff via job
        return true
      } else if (currentUser?.role === 'customer') {
        const customerEmail = currentUser?.email
        if (customerEmail === data?.email) return true
        else return false
      }

      return false
    },
    update: ({ req }) => req.user?.role === 'admin',
    create: () => true,
  },
  disableDuplicate: true,
  hooks: {
    beforeChange: [generateIdHook],
  },
  fields: [
    {
      name: 'customersId',
      type: 'text',
      admin: {
        readOnly: true,
        hidden: true,
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'notes',
      type: 'richText',
    },
  ],
}
