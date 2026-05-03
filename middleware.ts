import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { isUnauthenticatedRoute, pathMatches, type Role } from '@/lib/routes'

const KNOWN_ROLES: readonly Role[] = ['marca', 'influencer']

function isKnownRole(t: unknown): t is Role {
  return typeof t === 'string' && KNOWN_ROLES.includes(t as Role)
}

// Si el path es el área privada de un rol específico, decide qué hacer:
// - tipo desconocido o ausente → redirige a /onboarding (mismo
//   comportamiento que app/auth/callback/route.ts).
// - tipo es el otro rol conocido → redirige al dashboard correcto.
// - tipo coincide con expectedRole → null (deja pasar).
//
// Usamos pathMatches con la ruta literal /dashboard/[rol] en vez de
// isRoleRoute() porque ROLE_ROUTES también incluye /[rol], que hoy contiene
// perfiles públicos /marca/[id] y /influencer/[id]. La unificación con
// isRoleRoute se hará en el punto 5 cuando esos perfiles se muevan a
// /m/[id] y /u/[id].
function enforceRoleArea(
  pathname: string,
  expectedRole: Role,
  tipo: unknown,
  request: NextRequest,
): NextResponse | null {
  if (!pathMatches(pathname, [`/dashboard/${expectedRole}`])) return null

  if (!isKnownRole(tipo)) {
    return NextResponse.redirect(new URL('/onboarding', request.url))
  }
  if (tipo !== expectedRole) {
    return NextResponse.redirect(new URL(`/dashboard/${tipo}`, request.url))
  }
  return null
}

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

  const tipo = session.user.user_metadata?.tipo

  const marcaGate = enforceRoleArea(pathname, 'marca', tipo, request)
  if (marcaGate) return marcaGate

  const influencerGate = enforceRoleArea(pathname, 'influencer', tipo, request)
  if (influencerGate) return influencerGate

  // Redirigir al dashboard correcto desde la home. Sin rol seteado,
  // mandamos a /onboarding en vez de asumir un default.
  if (pathname === '/') {
    if (!isKnownRole(tipo)) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }
    return NextResponse.redirect(new URL(`/dashboard/${tipo}`, request.url))
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.svg|.*\\.png|.*\\.jpg|.*\\.ico).*)',
  ],
}
