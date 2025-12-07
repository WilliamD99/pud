import { revalidateTag } from 'next/cache'

export async function POST(request: Request) {
  //   const body = await request.json()
  try {
    revalidateTag('parent-services', 'max')
    return Response.json({ message: 'Service revalidated' })
  } catch (err) {
    return Response.json({ message: 'Failed to revalidate service' }, { status: 500 })
  }
}
