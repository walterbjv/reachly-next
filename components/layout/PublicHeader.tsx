'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Moon, Sun, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useThemeStore } from '@/store/useThemeStore'
import { useAuth } from '@/hooks/useAuth'
import { ReachlyLogoLink } from '@/components/layout/ReachlyLogoLink'
import { PUBLIC_NAV_LINKS } from '@/components/layout/nav-links'

const EASE = [0.23, 1, 0.32, 1] as const

export function PublicHeader() {
  const { isDark, toggle } = useThemeStore()
  const { isLoggedIn } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      <nav
        className={cn(
          'sticky top-0 z-50 h-16 flex items-center justify-between px-[5%]',
          'bg-brand-600 dark:bg-card',
          scrolled && 'shadow-[0_4px_28px_rgba(74,31,168,.4)]',
        )}
        style={{ transition: 'box-shadow 250ms cubic-bezier(0.23, 1, 0.32, 1)' }}
      >
        <ReachlyLogoLink />

        <div className="hidden md:flex items-center gap-7">
          {PUBLIC_NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-base text-white/70 hover:text-white transition-colors duration-150"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/12 active:scale-[0.97] transition-all"
            aria-label="Cambiar tema"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={isDark ? 'sun' : 'moon'}
                initial={{ opacity: 0, rotate: -30, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 30, scale: 0.8 }}
                transition={{ duration: 0.2, ease: EASE }}
                className="flex"
              >
                {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </motion.span>
            </AnimatePresence>
          </button>

          {isLoggedIn ? (
            <Link
              href="/"
              className="hidden sm:inline-flex items-center text-sm text-white font-medium hover:text-brand-200 transition-colors duration-150 px-3"
            >
              Plataforma →
            </Link>
          ) : (
            <Link
              href="/registro"
              className="hidden sm:inline-flex items-center bg-white text-brand-600 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-brand-50 transition-colors duration-150"
            >
              Registrarse
            </Link>
          )}

          <button
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/12 active:scale-[0.97] transition-all"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={menuOpen ? 'x' : 'menu'}
                initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
                animate={{ opacity: 1, rotate: 0, scale: 1 }}
                exit={{ opacity: 0, rotate: 45, scale: 0.8 }}
                transition={{ duration: 0.18, ease: EASE }}
                className="flex"
              >
                {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </motion.span>
            </AnimatePresence>
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="md:hidden fixed top-16 inset-x-0 z-40 bg-brand-600 dark:bg-card border-t border-white/10 shadow-lg animate-slide-down">
          <div className="flex flex-col gap-1 p-5">
            {PUBLIC_NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                className="text-base py-2 px-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
              >
                {label}
              </Link>
            ))}

            {isLoggedIn ? (
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="mt-3 text-center text-white font-medium py-2.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                Plataforma →
              </Link>
            ) : (
              <Link
                href="/registro"
                onClick={() => setMenuOpen(false)}
                className="mt-3 text-center bg-white text-brand-600 font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-brand-50 transition-colors"
              >
                Registrarse
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  )
}
