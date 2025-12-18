import { Service } from '@/payload-types'
import { nanoid } from 'nanoid'
import { CollectionBeforeChangeHook } from 'payload'

// Use this hook for generating a unique id for each collection
export const generateIdHook: CollectionBeforeChangeHook = async ({
  data,
  collection,
  operation,
}) => {
  if (operation === 'create') {
    if (!data[`${collection.slug}Id`]) {
      data[`${collection.slug}Id`] = `${collection.slug}${nanoid(10)}`
    }
  }
  return data
}

// Use this hook for generating a name for each JOB collection
export const generateJobNameHook: CollectionBeforeChangeHook = async ({ data, req, operation }) => {
  const techData = await req.payload.findByID({
    collection: 'technicians',
    id: data.technician,
  })
  const serviceData = await req.payload.findByID({
    collection: 'services',
    id: data.service,
  })
  const jobId = operation === 'create' ? 'New' : data.id

  data.name = `${techData.name} - ${serviceData.name} (${jobId})`

  return data
}

// Use this hook to validate no duplicate service within an appointment
export const validateDuplicateServiceHook: CollectionBeforeChangeHook = async ({ req, data }) => {
  const collectionConfig = await req.payload.findGlobal({
    slug: 'collectionConfig',
  })
  if (!collectionConfig.appointmentconfig?.allowDuplicate) {
    return data
  }
  const jobs = data.jobs
  const services = new Set<number>()

  for (const job of jobs) {
    const jobData = await req.payload.findByID({
      collection: 'jobs',
      id: job.job,
    })
    const serviceId = (jobData.service as Service).id

    if (services.has(serviceId)) {
      throw new Error('Duplicate service found')
    }
    services.add(serviceId)
  }
  return data
}

export const updateJobDurationHook: CollectionBeforeChangeHook = async ({ req, data }) => {
  try {
    // Get the duration of the job from the technician
    const technician = await req.payload.findByID({
      collection: 'technicians',
      id: data.technician,
      req,
    })
    const techServices = technician?.services
    const duration = techServices?.find((service) =>
      typeof service.service === 'object'
        ? service.service?.id === data.service
        : service.service === data.service,
    )?.duration

    return {
      ...data,
      duration: duration,
    }
  } catch (error) {
    console.log(error)
    return data
  }
}
