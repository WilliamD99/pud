export const fetchTechByService = async (serviceId: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/technicians/techsByService/${serviceId}`,
      {
        method: 'GET',
      },
    )

    const data = await response.json()

    // // Delay the response to simulate a slow network
    // await new Promise((resolve) => setTimeout(resolve, 1000))
    return data
  } catch (_error) {
    return {
      data: [],
      status: 500,
    }
  }
}

export const fetchTechAvailabilityWithDate = async (techId: string, date: string) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/appointments/${techId}/availability?date=${date}`,
      {
        method: 'GET',
      },
    )
    const data = await response.json()
    return data
  } catch (error) {
    console.log(error)
    return {
      data: [],
      status: 500,
    }
  }
}

// Helper to extract error messages from Payload CMS API responses
function extractPayloadError(errorData: unknown): string | null {
  if (!errorData || typeof errorData !== 'object') return null

  const data = errorData as Record<string, unknown>

  // Payload returns errors in format: { errors: [{ message: "...", path: "..." }] }
  if (Array.isArray(data.errors) && data.errors.length > 0) {
    const messages = data.errors.map((err: { message?: string }) => err.message).filter(Boolean)
    if (messages.length > 0) return messages.join(', ')
  }

  // Fallback to message field
  if (typeof data.message === 'string') return data.message

  return null
}

export interface CreateAppointmentPayload {
  time: string
  customer: {
    name: string
    email: string
    phone: string
    notes?: string
  }
  job: {
    service: string
    technician: string
    notes?: string
  }
}

export const createAppointment = async (payload: CreateAppointmentPayload) => {
  try {
    // Step 0: Look up the service Payload ID from servicesId
    const serviceSearchResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/services?where[servicesId][equals]=${encodeURIComponent(payload.job.service)}`,
      { method: 'GET' },
    )
    const serviceSearchData = await serviceSearchResponse.json()

    if (!serviceSearchData.docs || serviceSearchData.docs.length === 0) {
      throw new Error('Service not found')
    }

    const servicePayloadId = serviceSearchData.docs[0].id

    // Step 1: Check if customer exists by email, or create new one
    const customerSearchResponse = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/customers?where[email][equals]=${encodeURIComponent(payload.customer.email)}`,
      { method: 'GET' },
    )
    const customerSearchData = await customerSearchResponse.json()

    let customerId: number

    if (customerSearchData.docs && customerSearchData.docs.length > 0) {
      // Customer exists
      customerId = customerSearchData.docs[0].id
    } else {
      // Create new customer
      const customerResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: payload.customer.name,
          email: payload.customer.email,
          phone: payload.customer.phone,
        }),
      })

      if (!customerResponse.ok) {
        const errorData = await customerResponse.json()
        const errorMessage = extractPayloadError(errorData) || 'Failed to create customer'
        throw new Error(errorMessage)
      }

      const customerData = await customerResponse.json()
      customerId = customerData.doc.id
    }

    // Step 2: Create the job (using the Payload IDs)
    const jobResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service: servicePayloadId,
        technician: payload.job.technician,
        notes: payload.job.notes || '',
      }),
    })

    if (!jobResponse.ok) {
      const errorData = await jobResponse.json()
      const errorMessage = extractPayloadError(errorData) || 'Failed to create job'
      throw new Error(errorMessage)
    }

    const jobData = await jobResponse.json()
    const jobId = jobData.doc.id

    // Step 3: Create the appointment
    const appointmentResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        time: payload.time,
        customer: customerId,
        jobs: [jobId],
        notes: payload.customer.notes || '',
      }),
    })

    if (!appointmentResponse.ok) {
      const errorData = await appointmentResponse.json()
      const errorMessage = extractPayloadError(errorData) || 'Failed to create appointment'
      throw new Error(errorMessage)
    }

    const appointmentData = await appointmentResponse.json()

    return {
      success: true,
      data: appointmentData.doc,
      status: 201,
    }
  } catch (error) {
    console.error('Error creating appointment:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create appointment',
      status: 500,
    }
  }
}
