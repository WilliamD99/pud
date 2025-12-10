import type { CollectionConfig, Validate, Where } from 'payload'

// Map day names to numbers for comparison between StoreSettings and Technicians
const dayNameToNumber: Record<string, string> = {
  monday: '1',
  tuesday: '2',
  wednesday: '3',
  thursday: '4',
  friday: '5',
  saturday: '6',
  sunday: '0',
}

const dayNumberToName: Record<string, string> = {
  '1': 'Monday',
  '2': 'Tuesday',
  '3': 'Wednesday',
  '4': 'Thursday',
  '5': 'Friday',
  '6': 'Saturday',
  '0': 'Sunday',
}

// Helper to convert time string (HH:mm) to minutes since midnight
function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + (minutes || 0)
}

// Helper to extract HH:mm from a Date object
function extractTimeFromDate(date: Date | string): string {
  const d = new Date(date)
  return d.toTimeString().slice(0, 5) // Returns "HH:mm"
}

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
                  filterOptions: ({ data, siblingData }) => {
                    // Get all currently selected service IDs from the array
                    const selectedServices = (data?.services || []).map((item: any) => {
                      const id = typeof item.service === 'object' ? item.service?.id : item.service
                      return id
                    })
                    const filteredServices = selectedServices.filter(
                      (id: string) => id && id !== (siblingData as any)?.service,
                    ) // Exclude current row's selection

                    // Only show parent services (isSubService = false)
                    if (filteredServices.length === 0) {
                      return {
                        isSubService: { equals: false },
                      } as Where
                    }

                    return {
                      and: [
                        { id: { not_in: filteredServices } },
                        { isSubService: { equals: false } },
                      ],
                    } as Where
                  },
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
              validate: (async (val, { req }) => {
                // No duplicate days of the week
                if (!val) return true
                const seen = new Set<string | number>()
                for (const item of val) {
                  if (seen.has(item.dayOfWeek)) {
                    return "Can't have duplicate days of the week"
                  }
                  seen.add(item.dayOfWeek)
                }

                // Fetch store settings to validate against operating hours
                const storeSettings = await req.payload.findGlobal({
                  slug: 'store-settings',
                })

                const operatingHours = storeSettings?.operatingHours || []

                // If no operating hours are set, skip validation
                if (operatingHours.length === 0) return true

                // Build a map of store hours by day number
                const storeHoursByDay = new Map<string, { open: string; close: string }>()
                for (const entry of operatingHours) {
                  if (entry.day) {
                    storeHoursByDay.set(dayNameToNumber[entry.day], {
                      open: entry.open,
                      close: entry.close,
                    })
                  }
                }

                // Validate each availability entry
                for (const item of val) {
                  const dayOfWeek = item.dayOfWeek
                  const dayName = dayNumberToName[dayOfWeek]

                  // Check if store is open on this day
                  if (!storeHoursByDay.has(dayOfWeek)) {
                    return `Store is not open on ${dayName}. Please select a day when the store operates.`
                  }

                  const storeHours = storeHoursByDay.get(dayOfWeek)!
                  const storeOpenMinutes = timeToMinutes(storeHours.open)
                  const storeCloseMinutes = timeToMinutes(storeHours.close)

                  // Check each time range is within store hours
                  for (const range of item.timeRanges || []) {
                    const startTime = extractTimeFromDate(range.start)
                    const endTime = extractTimeFromDate(range.end)
                    const startMinutes = timeToMinutes(startTime)
                    const endMinutes = timeToMinutes(endTime)

                    if (startMinutes < storeOpenMinutes) {
                      return `${dayName}: Start time ${startTime} is before store opens at ${storeHours.open}.`
                    }

                    if (endMinutes > storeCloseMinutes) {
                      return `${dayName}: End time ${endTime} is after store closes at ${storeHours.close}.`
                    }
                  }
                }

                return true
              }) as Validate,
            },
          ],
        },
      ],
    },
  ],
  endpoints: [
    {
      path: '/techsByService/:serviceId',
      method: 'get',
      handler: async (req) => {
        try {
          const serviceId = req.routeParams?.serviceId
          const data = await req.payload.find({
            collection: 'technicians',
            where: {
              'services.service.servicesId': {
                equals: serviceId,
              },
            },
          })

          return Response.json({
            data: data.docs,
            status: 200,
          })
        } catch (error) {
          return Response.json({
            data: [],
            status: 500,
          })
        }
      },
    },
  ],
}

// Helper to format time nicely
function formatTime(timestamp: number) {
  const date = new Date(timestamp)
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}
