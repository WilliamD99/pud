import { sendEmail } from '@/email/config'
import { Appointment } from '@/payload-types'
import type { CollectionAfterChangeHook, CollectionAfterOperationHook } from 'payload'

// Use this hook for sending email to technicians when an appointment is created
export const appointmentConfirmationEmailHook: CollectionAfterChangeHook = async ({
  req,
  doc,
  operation,
}) => {
  console.log(doc)
  const thisAppointment = await req.payload
    .findByID({
      collection: 'appointments',
      id: doc.id,
      depth: 2,
    })
    .catch((error) => {
      console.error(error)
      return
    })
  if (!thisAppointment) return
  const jobs = thisAppointment.job || []
  const technicians = jobs.map((job: any) => job.technician).filter(Boolean)
  const emails = [...new Set(technicians.map((t: any) => t.email))]
  for (const email of emails) {
    if (operation === 'create') {
      await sendEmail(
        req,
        email,
        'Appointment Confirmation',
        `
              <h1>Appointment Confirmation</h1>
              <p>You have a new appointment on ${new Date(thisAppointment.time).toLocaleDateString()}</p>
              <p>Please be on time for your appointment.</p>
            `,
      ).catch((error) => {
        console.error(error)
      })
    } else if (operation === 'update') {
      await sendEmail(
        req,
        email,
        'Appointment Modified',
        `
            <h1>Appointment Modified</h1>
            <p>The appointment on ${new Date(thisAppointment.time).toLocaleDateString()} has been modified.</p>
            <p>Please be on time for your appointment.</p>
          `,
      ).catch((error) => {
        console.error(error)
      })
    }
  }
}

// Use this hook for syncing jobs to an appointment when an appointment is created
export const syncJobsToAppointmentHook: CollectionAfterOperationHook = async ({
  req,
  result,
  // doc,
  operation,
}) => {
  if (operation === 'create') {
    const typedResult = result as Appointment
    const jobsToUpdate = typedResult.jobs || []

    for (const job of jobsToUpdate) {
      // Won't work because the appointment is not created yet
      await req.payload
        .update({
          collection: 'jobs',
          id: job.job as number,
          data: {
            appointment: typedResult.id,
          },
          req,
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }
}

// Use this hook to create a record in the Tech/Customer Schema when a user is created
export const createTechOrCustomerHook: CollectionAfterChangeHook = async ({
  req,
  doc,
  operation,
  data,
}) => {
  if (operation === 'create') {
    const dataRole = data.role
    if (dataRole === 'staff') {
      await req.payload
        .create({
          collection: 'technicians',
          data: {
            email: data.email,
            name: data.name ?? 'John Doe',
          },
          req,
        })
        .catch((error) => {
          console.error(error)
        })
      return doc
    } else if (dataRole === 'customer') {
      await req.payload
        .create({
          collection: 'customers',
          data: {
            email: data.email,
            name: data.name ?? 'John Doe',
          },
          req,
        })
        .catch((error) => {
          console.error(error)
        })
      return doc
    }
  } else return doc
}
