import { createTechOrCustomerHook } from '@/hooks/afterChangeHooks'
import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: {
    maxLoginAttempts: 5,
  },
  hooks: {
    afterChange: [createTechOrCustomerHook],
  },
  fields: [
    // Email added by default
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      options: ['admin', 'staff', 'customer'],
      defaultValue: 'staff',
      required: true,
      admin: {
        description:
          'Creating a new user will also create a record either in the Technician Schema or the Customer Schema',
      },
      access: {
        update: ({ req }) => req.user?.role === 'admin',
      },
    },
  ],
}
