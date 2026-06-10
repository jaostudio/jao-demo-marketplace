import { NextResponse } from 'next/server'
import { createListing } from '@/lib/actions/orders'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const result = await createListing(formData)
    return NextResponse.json(result)
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 400 })
  }
}
