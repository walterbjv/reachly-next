import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isUnauthenticatedRoute, isRoleRoute, type Role } from '@/lib/routes'

const KNOWN_ROLES: readonly Role[] = ['marca', 'influencer']

// Subpaths bajo /marca/* e /influencer/* que pertenecen a las áreas
// privadas. Los segmentos que NO estén aquí se tratan como IDs de
// perfiles públicos legacy y se redirigen a /m/ o /u/.
const RESERVED_SUBPATHS = new Set([
  'dashboard', 'swipe', 'postulaciones', 'mensajes',
  'perfil', 'campanas', 'comparador', 'tendencias', 'pagos', 'favoritos',
])

function isKnownRole(t: unknown): t is Role {
  return typeof t === 'string' && KNOWN_ROLES.includes(t as Role)
}

function enforceRoleArea(
  pathname: string,
  expectedRole: Role,
  tipo: unknown,
  request: NextRequest,
): NextResponse | null {
  if (!isRoleRoute(pathname, expectedRole)) return null

  if (!isKnownRole(tipo)) {
    return NextResponse.redirect(new URL('/onboarding', request.url))
  }
  if (tipo !== expectedRole) {
    return NextResponse.redirect(new URL(`/${tipo}/dashboard`, request.url))
  }
  return null
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Redirect legacy public profile URLs before any auth check.
  // Matches /influencer/<segment> and /marca/<segment> where <segment>
  // is not a reserved private-area subpath.
  const legacyMatch = pathname.match(/^\/(influencer|marca)\/([^/]+)$/)
  if (legacyMatch) {
    const [, area, segment] = legacyMatch
    if (!RESERVED_SUBPATHS.has(segment)) {
      const target = area === 'influencer' ? `/u/${segment}` : `/m/${segment}`
      return NextResponse.redirect(new URL(target, request.url), { status: 308 })
    }
  }

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

  const tipo = session.user.user_metadata?.tipo

  const marcaGate = enforceRoleArea(pathname, 'marca', tipo, request)
  if (marcaGate) return marcaGate

  const influencerGate = enforceRoleArea(pathname, 'influencer', tipo, request)
  if (influencerGate) return influencerGate

  if (pathname === '/') {
    if (!isKnownRole(tipo)) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }
    return NextResponse.redirect(new URL(`/${tipo}/dashboard`, request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.ico).*)',
  ],
}
