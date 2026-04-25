'use client'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'

interface Props {
  className?: string
  imgClassName?: string
  variant?: 'white' | 'dark'
}

export function ReachlyLogoLink({ className, imgClassName, variant = 'white' }: Props) {
  const { isLoggedIn } = useAuth()
  const href = isLoggedIn ? '/' : '/landing'
  const src = variant === 'white' ? '/logo-reachly-white.svg' : '/logo-reachly.svg'

  return (
    <Link href={href} className={cn('hover:opacity-90 transition-opacity flex-shrink-0', className)}>
      <img src={src} alt="Reachly" className={cn('h-9 w-auto', imgClassName)} />
    </Link>
  )
}
