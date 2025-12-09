import { GlobalConfig, Validate } from 'payload'

export const StoreSettings: GlobalConfig = {
  slug: 'store-settings',
  label: 'Store Settings',
  access: {
    update: ({ req }) => !!req.user && req.user?.role === 'admin',
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General Information',
          fields: [
            {
              name: 'operatingHours',
              label: 'Operating Hours',
              type: 'array',
              labels: {
                singular: 'Operating Day',
                plural: 'Operating Days',
              },

              admin: {
                description:
                  'Set the operating day and time for the store. Leave empty to set as day off.',
              },
              hooks: {},
              validate: ((value) => {
                if (!value || value.length <= 0) return true
                const seen = new Set()

                for (const entry of value) {
                  if (!entry.day) continue

                  if (seen.has(entry.day)) {
                    return `You already added "${entry.day}". Duplicate days are not allowed.`
                  }

                  seen.add(entry.day)
                }
                return true
              }) as Validate,

              fields: [
                {
                  name: 'day',
                  label: 'Day',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Monday', value: 'monday' },
                    { label: 'Tuesday', value: 'tuesday' },
                    { label: 'Wednesday', value: 'wednesday' },
                    { label: 'Thursday', value: 'thursday' },
                    { label: 'Friday', value: 'friday' },
                    { label: 'Saturday', value: 'saturday' },
                    { label: 'Sunday', value: 'sunday' },
                  ],
                },
                {
                  name: 'open',
                  label: 'Open Time',
                  type: 'text',
                  required: true,
                  admin: {
                    placeholder: '10:00',
                    description: 'Enter the open time in 24-hour format (e.g., 10 for 10:00)',
                  },
                  validate: ((value) => {
                    if (!value) return 'Open time is required'

                    // Force input to not have any text except numbers and colons
                    // The time should be in between 00:00 and 23:59
                    const cleaned = value.replace(/[^0-9:]/g, '')
                    if (cleaned !== value) {
                      return 'Open time must be in 24-hour format (e.g., 10:00)'
                    }

                    const [hours, minutes] = value.split(':').map(Number)
                    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
                      return 'Open time must be between 00:00 and 23:59'
                    }

                    return true
                  }) as Validate,
                },
                {
                  name: 'close',
                  label: 'Close Time',
                  type: 'text',
                  required: true,
                  validate: ((value, ctx) => {
                    if (!value) return 'Close time is required'

                    // Force input to not have any text except numbers and colons
                    const cleaned = value.replace(/[^0-9:]/g, '')
                    if (cleaned !== value) {
                      return 'Open time must be in 24-hour format (e.g., 10:00)'
                    }
                    // The time should be in between 00:00 and 23:59
                    const [hours, minutes] = value.split(':').map(Number)
                    if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
                      return 'Open time must be between 00:00 and 23:59'
                    }
                    // Close time should be after open time
                    if (ctx.siblingData.open && ctx.siblingData.open >= value) {
                      return 'Close time must be after open time.'
                    }

                    return true
                  }) as Validate,
                  admin: {
                    placeholder: '20:00',
                    description: 'Enter the close time in 24-hour format (e.g., 20 for 20:00)',
                  },
                },
              ],
            },
            {
              name: 'socials',
              label: 'Social Media List',
              type: 'array',
              validate: ((value) => {
                if (!value || value.length <= 0) return true
                const seen = new Set()

                for (const entry of value) {
                  if (!entry.platform) continue

                  if (seen.has(entry.platform)) {
                    return `You already added "${entry.platform}". Duplicate platforms are not allowed.`
                  }

                  seen.add(entry.platform)
                }
                return true
              }) as Validate,
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  options: [
                    'facebook',
                    'instagram',
                    'twitter',
                    'youtube',
                    'linkedin',
                    'tiktok',
                    'website',
                  ],
                },
                {
                  name: 'url',
                  type: 'text',
                  required: true,
                  admin: {
                    placeholder: 'https://www.facebook.com/your-page',
                  },
                },
              ],
            },
          ],
        },
        {
          label: 'Frequently Asked Questions',
          hooks: {
            afterChange: [
              async ({ data }) => {
                try {
                  await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/revalidate-faq`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'applicaion/json',
                    },
                    body: JSON.stringify({
                      secret: process.env.PAYLOAD_SECRET,
                    }),
                  })
                } catch (err) {
                  console.error(err)
                }
                return data
              },
            ],
          },
          fields: [
            {
              name: 'questions',
              type: 'array',
              fields: [
                {
                  name: 'question',
                  type: 'text',
                },
                {
                  name: 'answer',
                  type: 'textarea',
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
