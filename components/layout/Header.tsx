'use client'
import { usePathname } from 'next/navigation'
import { Nav } from '@/components/layout/Nav'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { useAuth } from '@/hooks/useAuth'

const PUBLIC_PATHS = [
  '/landing',
  '/blog',
  '/careers',
  '/contacto',
  '/cookies',
  '/gdpr',
  '/prensa',
  '/privacidad',
  '/sobre-nosotros',
  '/terminos',
  '/registro',
  '/login',
  '/onboarding',
]

function isPublicPath(pathname: string | null): boolean {
  if (!pathname) return false
  return PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + '/'))
}

export function Header() {
  const pathname = usePathname()
  const { isLoggedIn } = useAuth()

  if (isPublicPath(pathname)) return <PublicHeader />
  if (!isLoggedIn) return <PublicHeader />
  return <Nav />
}
