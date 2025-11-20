import type { CollectionConfig, Validate } from 'payload'

export const Technicians: CollectionConfig = {
  slug: 'technicians',
  admin: {
    useAsTitle: 'name',
  },
  disableDuplicate: true,
  hooks: {},
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
                  label: 'Service Provided',
                  name: 'service',
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
              name: 'weeklyAvailability',
              type: 'array',
              label: 'Weekly Availability',
              admin: {
                description: 'Set default availability for the technician',
              },
              fields: [
                {
                  name: 'id',
                  type: 'text',
                  admin: { readOnly: true, hidden: true },
                  required: true,
                  hooks: {
                    beforeChange: [({ value }) => value || crypto.randomUUID()],
                  },
                },
                {
                  name: 'dayOfWeek',
                  type: 'select',
                  required: true,
                  options: [
                    { label: 'Monday', value: '1' },
                    { label: 'Tuesday', value: '2' },
                    { label: 'Wednesday', value: '3' },
                    { label: 'Thursday', value: '4' },
                    { label: 'Friday', value: '5' },
                    { label: 'Saturday', value: '6' },
                    { label: 'Sunday', value: '0' },
                  ],
                  admin: {
                    width: '30%',
                  },
                },
                {
                  name: 'timeRanges',
                  type: 'array',
                  label: 'Working Hours',
                  admin: {
                    description:
                      'Add one or more work periods (e.g., 9–12 and 1–5). Leave empty = Day off.',
                  },
                  fields: [
                    {
                      name: 'id',
                      type: 'text',
                      admin: { readOnly: true, hidden: true },
                      required: true,
                      hooks: {
                        beforeChange: [({ value }) => value || crypto.randomUUID()],
                      },
                    },
                    {
                      name: 'start',
                      type: 'date',
                      required: true,
                      admin: {
                        date: {
                          pickerAppearance: 'timeOnly',
                          displayFormat: 'h:mm a',
                        },
                      },
                      validate: ((_, ctx) => {
                        // Validate that the start time is before the end time
                        let start = new Date(ctx.siblingData.start)
                        let end = new Date(ctx.siblingData.end)
                        if (start > end) {
                          return 'Start time must be before end time'
                        }
                        return true
                      }) as Validate,
                    },
                    {
                      name: 'end',
                      type: 'date',
                      required: true,
                      admin: {
                        date: {
                          pickerAppearance: 'timeOnly',
                          displayFormat: 'h:mm a',
                        },
                      },
                    },
                  ],
                  validate: ((val) => {
                    // Enforce that time ranges can't be the same or overlap
                    if (!val || !Array.isArray(val)) return true

                    // Sort ranges by start time
                    const ranges = val
                      .map((item) => ({
                        start: new Date(item.start).getTime(),
                        end: new Date(item.end).getTime(),
                      }))
                      .sort((a, b) => a.start - b.start)

                    for (let i = 0; i < ranges.length; i++) {
                      const { start, end } = ranges[i]

                      // Check if start is before end
                      if (start >= end) {
                        return `Time range ${i + 1} has start time after or equal to end time.`
                      }

                      // Check for duplicates
                      for (let j = i + 1; j < ranges.length; j++) {
                        if (start === ranges[j].start && end === ranges[j].end) {
                          return `Duplicate time range detected: ${formatTime(start)} - ${formatTime(end)}.`
                        }
                      }

                      // Check for overlap with next range
                      if (i < ranges.length - 1) {
                        const next = ranges[i + 1]
                        if (end > next.start) {
                          return `Time range ${formatTime(start)} - ${formatTime(end)} overlaps with ${formatTime(next.start)} - ${formatTime(next.end)}.`
                        }
                      }
                    }

                    return true
                  }) as Validate,
                },
              ],
              validate: ((val) => {
                // No duplicate days of the week
                if (!val) return true
                const seen = new Set<string | number>()
                for (const item of val) {
                  if (seen.has(item.dayOfWeek)) {
                    return "Can't have duplicate days of the week"
                  }
                  seen.add(item.dayOfWeek)
                }
                return true
              }) as Validate,
            },
          ],
        },
      ],
    },
  ],
}

// Helper to format time nicely
function formatTime(timestamp: number) {
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
