import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  await supabase.auth.getSession()
  
  res.headers.set('X-Robots-Tag', 'index, follow')
  res.headers.set('Cache-Control', 'public, max-age=3600')
  
  return res
}

export const config = {
  matcher: [
    '/review-requests/:path*',
    '/api/protected/:path*'
  ]
}