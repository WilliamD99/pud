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
    // await new Promise((resolve) => setTimeout(resolve, 2000))
    return data
  } catch (error) {
    return {
      data: [],
      status: 500,
    }
  }
}
