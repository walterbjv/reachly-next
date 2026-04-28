'use client'
import { usePathname } from 'next/navigation'
import { Nav } from '@/components/layout/Nav'
import { PublicHeader } from '@/components/layout/PublicHeader'
import { useAuth } from '@/hooks/useAuth'
import { shouldShowPublicHeader } from '@/lib/routes'

export function Header() {
  const pathname = usePathname()
  const { isLoggedIn } = useAuth()

  if (pathname && shouldShowPublicHeader(pathname)) return <PublicHeader />
  if (!isLoggedIn) return <PublicHeader />
  return <Nav />
}
