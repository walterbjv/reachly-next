// Fuente única de verdad para listas de rutas usadas en control de acceso
// (middleware) y decisiones de chrome (Header). No incluye datos de menú
// de navegación — esos viven en components/layout/nav-links.ts.

export const PUBLIC_ROUTES = [
  '/landing',
  '/sobre-nosotros',
  '/contacto',
  '/terminos',
  '/privacidad',
  '/cookies',
  '/gdpr',
  '/blog',
  '/prensa',
  '/careers',
  '/u',
  '/m',
] as const

export const AUTH_ROUTES = [
  '/login',
  '/registro',
  '/auth',
] as const

// Rutas privadas (con sesión) que renderean header público porque el
// usuario aún no entró a la app.
export const ONBOARDING_ROUTES = [
  '/onboarding',
] as const

// Rutas restringidas por rol. Cada rol ocupa su propio namespace.
export const ROLE_ROUTES = {
  marca: ['/marca'],
  influencer: ['/influencer'],
} as const

export type Role = keyof typeof ROLE_ROUTES

export function pathMatches(pathname: string, routes: readonly string[]): boolean {
  return routes.some((r) => pathname === r || pathname.startsWith(r + '/'))
}

export function isPublicRoute(pathname: string): boolean {
  return pathMatches(pathname, PUBLIC_ROUTES)
}

export function isAuthRoute(pathname: string): boolean {
  return pathMatches(pathname, AUTH_ROUTES)
}

export function isOnboardingRoute(pathname: string): boolean {
  return pathMatches(pathname, ONBOARDING_ROUTES)
}

// Para middleware: rutas que no requieren sesión.
export function isUnauthenticatedRoute(pathname: string): boolean {
  return isPublicRoute(pathname) || isAuthRoute(pathname)
}

// Para Header.tsx: rutas donde mostrar PublicHeader en vez de Nav.
export function shouldShowPublicHeader(pathname: string): boolean {
  return isPublicRoute(pathname) || isAuthRoute(pathname) || isOnboardingRoute(pathname)
}

export function isRoleRoute(pathname: string, role: Role): boolean {
  return pathMatches(pathname, ROLE_ROUTES[role])
}
