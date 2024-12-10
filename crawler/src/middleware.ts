import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const API_KEYS = process.env.API_KEYS?.split(',') || []

export async function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith('/api')) {
    return NextResponse.next()
  }

  const apiKey = request.headers.get('x-api-key')

  if (!apiKey || !API_KEYS.includes(apiKey)) {
    return new NextResponse(JSON.stringify({ error: 'Invalid API key' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    })
  }

  return NextResponse.next()
}
