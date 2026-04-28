import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isUnauthenticatedRoute, pathMatches } from '@/lib/routes'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (isUnauthenticatedRoute(pathname)) return NextResponse.next()

  const response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => {
          cookies.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('next', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Usamos pathMatches en vez de isRoleRoute('marca') porque ROLE_ROUTES.marca
  // incluye '/marca', que hoy contiene perfiles públicos /marca/[id]. La
  // unificación con isRoleRoute se hará en el punto 5 cuando esos perfiles
  // se muevan a /m/[id].
  if (pathMatches(pathname, ['/dashboard/marca'])) {
    const tipo = session.user.user_metadata?.tipo
    if (tipo === 'influencer') {
      return NextResponse.redirect(new URL('/dashboard/influencer', request.url))
    }
    if (tipo !== 'marca') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  // Redirigir al dashboard correcto según el rol
  if (pathname === '/') {
    const tipo = session.user.user_metadata?.tipo ?? 'influencer'
    const dashboard = tipo === 'marca' ? '/dashboard/marca' : '/dashboard/influencer'
    return NextResponse.redirect(new URL(dashboard, request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.ico).*)',
  ],
}
