import {
  appointmentConfirmationEmailHook,
  syncJobsToAppointmentHook,
} from '@/hooks/afterChangeHooks'
import { generateIdHook, validateDuplicateServiceHook } from '@/hooks/beforeChangeHooks'
import type { CollectionConfig, Validate } from 'payload'

export const Appointments: CollectionConfig = {
  slug: 'appointments',
  disableDuplicate: true,
  hooks: {
    // beforeChange: [validateDuplicateServiceHook],
    // afterOperation: [syncJobsToAppointmentHook],
  },
  access: {
    read: () => true,
    create: () => true,
  },
  fields: [
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
      type: 'relationship',
      relationTo: 'jobs',
      hasMany: true,
      admin: {
        allowCreate: true,
      },
      required: true,
      // type: 'array',
      // fields: [
      //   {
      //     name: 'job',
      //     type: 'relationship',
      //     relationTo: 'jobs',
      //   },
      // ],
    },
  ],
  endpoints: [
    {
      method: 'get',
      path: '/:techId/availability',
      handler: async (req) => {
        try {
          const { payload, routeParams } = req
          const dateString = req.query.date as string
          const date = new Date(dateString)
          const techId = routeParams?.techId as string

          // Start of day (UTC)
          const startOfDay = new Date(
            Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0),
          )
          // End of day (UTC)
          const endOfDay = new Date(
            Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999),
          )

          const data = await payload.find({
            collection: 'appointments',
            where: {
              time: {
                greater_than_equal: startOfDay,
                less_than_equal: endOfDay,
              },
            },
            depth: 2,
            select: {
              jobs: true,
              time: true,
            },
          })
          const timeSlots = []
          if (data.docs.length > 0) {
            for (const appointment of data.docs) {
              for (const job of appointment.jobs) {
                if (typeof job === 'object') {
                  if (
                    typeof job.technician === 'object' &&
                    job.technician.techniciansId === techId
                  ) {
                    timeSlots.push({
                      duration: job.duration,
                      time: appointment.time,
                    })
                  }
                }
              }
            }
          }

          return Response.json({
            data: timeSlots,
            status: 200,
          })
        } catch (error) {
          console.log(error)
          return Response.json({
            data: [],
            status: 500,
          })
        }
      },
    },
  ],
}
