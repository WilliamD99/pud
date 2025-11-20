import { generateJobNameHook } from '@/hooks/beforeChangeHooks'
import type { CollectionConfig } from 'payload'

export const Jobs: CollectionConfig = {
  slug: 'jobs',
  admin: {
    useAsTitle: 'name',
  },
  disableDuplicate: true,
  hooks: {
    beforeChange: [generateJobNameHook],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      admin: {
        readOnly: true,
        hidden: true,
      },
    },
    {
      name: 'service',
      label: 'Service',
      type: 'relationship',
      relationTo: 'services',
      required: true,
    },
    {
      name: 'technician',
      label: 'Technician',
      type: 'relationship',
      relationTo: 'technicians',
      required: true,
      validate: async (val: any, { data, req }: { data: any; req: any }) => {
        if (!val || !data?.service) return 'Service and Technician are required'

        const techId = typeof val === 'string' || typeof val === 'number' ? val : val.id

        const tech = await req.payload.findByID({
          collection: 'technicians',
          id: techId,
        })
        const serviceIDs = tech.services.map((service: any) => service.service.id)
        if (!serviceIDs.includes(data.service))
          return 'This Technician does not provide this service'
        else return true
      },
    },
    {
      name: 'status',
      label: 'Status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'In Progress',
          value: 'in_progress',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
        {
          label: 'Cancelled',
          value: 'cancelled',
        },
      ],
    },
    {
      name: 'notes',
      label: 'Notes',
      type: 'text',
    },
  ],
}
