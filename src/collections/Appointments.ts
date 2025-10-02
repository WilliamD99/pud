import {
  appointmentConfirmationEmailHook,
  syncJobsToAppointmentHook,
} from '@/hooks/afterChangeHooks'
import { generateIdHook, validateDuplicateServiceHook } from '@/hooks/beforeChangeHooks'
import type { CollectionConfig } from 'payload'

export const Appointments: CollectionConfig = {
  slug: 'appointments',
  admin: {
    useAsTitle: 'appointmentsId',
  },
  access: {
    read: () => {
      return true
    },
  },
  disableDuplicate: true,
  hooks: {
    beforeChange: [generateIdHook, validateDuplicateServiceHook],
    afterOperation: [syncJobsToAppointmentHook],
  },
  fields: [
    {
      name: 'appointmentsId',
      type: 'text',
      admin: {
        readOnly: true,
        hidden: true,
      },
    },
    {
      name: 'time',
      type: 'date',
      required: true,
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      validate: (val) => {
        if (!val) return 'Time is required'
        const selected = new Date(val)
        const today = new Date()

        if (selected < today) {
          return 'Cant select time in the past'
        }

        return true
      },
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        {
          label: 'Pending',
          value: 'pending',
        },
        {
          label: 'Confirmed',
          value: 'confirmed',
        },
        {
          label: 'Cancelled',
          value: 'cancelled',
        },
        {
          label: 'Completed',
          value: 'completed',
        },
      ],
    },
    {
      name: 'notes',
      type: 'text',
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      // required: true,
    },
    {
      name: 'jobs',
      type: 'array',
      fields: [
        {
          name: 'job',
          type: 'relationship',
          relationTo: 'jobs',
        },
      ],
      validate: async (val, ctx) => {
        const jobs = val as { id: string; job: number }[]
        for (const job of jobs) {
          const jobData = await ctx.req.payload.findByID({
            collection: 'jobs',
            id: job.job as number,
          })
          if (jobData.appointment !== null) return 'This job is already assigned to an appointment'
          else return true
        }
        return true
      },
      required: true,
    },
  ],
}
