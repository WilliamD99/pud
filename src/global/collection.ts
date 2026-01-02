import { GlobalConfig } from 'payload'

export const AppointmentsCollectionConfig: GlobalConfig = {
  slug: 'collectionConfig',
  access: {
    read: ({ req }) => req.user?.role === 'admin',
    update: ({ req }) => req.user?.role === 'admin',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          name: 'appointmentconfig',
          label: 'Appointment Config',
          fields: [
            {
              name: 'allowDuplicate',
              label: 'Allow Duplicate Service Within Appointment',
              type: 'checkbox',
              defaultValue: true,
              admin: {
                description:
                  'If checked, the same service can be added multiple times to an appointment',
              },
            },
          ],
        },
        {
          name: 'jobConfig',
          label: 'Job Config',
          fields: [],
        },
      ],
    },
  ],
}
