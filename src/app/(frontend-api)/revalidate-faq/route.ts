import { revalidateTag } from 'next/cache'

export async function POST(request: Request) {
  try {
    const { secret } = await request.json()
    if (secret !== process.env.PAYLOAD_SECRET) {
      return Response.json({ message: 'Invalid secret' }, { status: 401 })
    }
    revalidateTag('faq')
    return Response.json({ message: 'Service revalidated' })
  } catch (err) {
    return Response.json({ message: 'Failed to revalidate service' }, { status: 500 })
  }
}
