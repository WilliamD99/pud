import { generateJobNameHook, updateJobDurationHook } from '@/hooks/beforeChangeHooks'
import { Technician } from '@/payload-types'
import type { CollectionConfig } from 'payload'

export const Jobs: CollectionConfig = {
  slug: 'jobs',
  admin: {
    useAsTitle: 'name',
  },
  disableDuplicate: true,
  hooks: {
    beforeChange: [generateJobNameHook, updateJobDurationHook],
  },
  access: {
    read: () => true,
    create: () => true,
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
      filterOptions: () => {
        return {
          isSubService: {
            equals: false,
          },
        }
      },
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

        const tech: Technician = await req.payload.findByID({
          collection: 'technicians',
          id: techId,
        })
        if (!tech || !tech.services) return 'Technician not found'
        const serviceIDs = tech.services.map((service) =>
          typeof service.service === 'object' ? service.service?.id : service.service,
        )

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
    {
      name: 'duration',
      label: 'Job Duration',
      type: 'number',
      admin: {
        description:
          'Duration in minutes (This is automatically calculated based on setting duration at the technician level)',
        readOnly: true,
      },
    },
  ],
}
