'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useThemeStore } from '@/store/useThemeStore'
import { cn } from '@/lib/utils'
import { Search, Moon, Sun, Menu, X, LogOut, User, LayoutDashboard } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { LANDING_NAV_LINKS } from '@/components/layout/nav-links'
import { useAuth } from '@/hooks/useAuth'
import { CommandPalette } from '@/components/layout/CommandPalette'

const EASE = [0.23, 1, 0.32, 1] as const

const NAV_LINKS_MARCA = [
  { href: '/marca/buscar-influencers', label: 'Buscar influencers' },
  { href: '/campanas', label: 'Campañas' },
  { href: '/marca/tendencias', label: 'Tendencias' },
  { href: '/marca/comparador', label: 'Comparador' },
  { href: '/marca/mensajes', label: 'Mensajes' },
  { href: '/marca/favoritos', label: 'Guardados' },
]

const NAV_LINKS_INFLUENCER = [
  { href: '/', label: 'Explorar' },
  { href: '/campanas', label: 'Campañas' },
  { href: '/influencer/mensajes', label: 'Mensajes' },
]

export function Nav() {
  const pathname = usePathname()
  const router = useRouter()
  const { isDark, toggle } = useThemeStore()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const { user: authUser } = useAuth()
  const navLinks = authUser?.tipo === 'marca' ? NAV_LINKS_MARCA : NAV_LINKS_INFLUENCER
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Close user menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function handleLogout() {
    setUserMenuOpen(false)
    await supabase.auth.signOut()
    router.push('/landing')
  }

  const isLanding = pathname === '/landing'
  const activeLinks = isLanding ? LANDING_NAV_LINKS : navLinks

  return (
    <>
      <nav
        className={cn(
          'sticky top-0 z-50 h-16 flex items-center justify-between px-[5%]',
          'bg-brand-600 dark:bg-card',
          scrolled && 'shadow-[0_4px_28px_rgba(74,31,168,.4)]'
        )}
        style={{ transition: 'box-shadow 250ms cubic-bezier(0.23, 1, 0.32, 1)' }}
      >
        {/* Brand */}
        <Link href={authUser ? '/' : '/landing'} className="hover:opacity-90 transition-opacity flex-shrink-0">
          <img src="/logo-reachly-white.svg" alt="Reachly" className="h-9 w-auto" />
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {isLanding && authUser?.tipo === 'marca' && (
            <button
              onClick={() => setSearchOpen(true)}
              className="text-white/70 hover:text-white transition-colors"
              aria-label="Buscar"
            >
              <Search className="w-4 h-4" />
            </button>
          )}

          {activeLinks.map(({ href, label }) => (
            isLanding ? (
              <a
                key={href}
                href={href}
                className="text-base text-white/70 hover:text-white transition-colors duration-150"
              >
                {label}
              </a>
            ) : (
              <Link
                key={href}
                href={href}
                className={cn(
                  'text-base transition-colors duration-150',
                  pathname === href ? 'text-white font-medium' : 'text-white/70 hover:text-white'
                )}
              >
                {label}
              </Link>
            )
          ))}

          {isLanding && authUser && (
            <Link
              href="/"
              className="text-sm text-white font-medium hover:text-brand-200 transition-colors duration-150"
            >
              Plataforma →
            </Link>
          )}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Search trigger — sólo marca, fuera de landing (palette de influencer pendiente) */}
          {!isLanding && authUser?.tipo === 'marca' && (
            <>
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden sm:flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white/70 hover:text-white border border-white/15 rounded-lg px-3 py-1.5 text-sm transition-all duration-150"
                aria-label="Buscar"
              >
                <Search className="w-3.5 h-3.5" />
                <span className="text-xs hidden lg:inline">Buscar</span>
                <kbd className="hidden lg:inline text-[10px] bg-white/10 px-1.5 py-0.5 rounded">⌘K</kbd>
              </button>
              <button
                onClick={() => setSearchOpen(true)}
                className="sm:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/12 transition-colors"
              >
                <Search className="w-4 h-4" />
              </button>
            </>
          )}

          {/* Theme toggle */}
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

          {/* Auth: user dropdown or login button */}
          {authUser ? (
            <div className="relative hidden sm:block" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuOpen(v => !v)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-white/10 transition-colors"
              >
                {authUser.avatar_url ? (
                  <img
                    src={authUser.avatar_url}
                    alt={authUser.nombre}
                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
                    {authUser.iniciales}
                  </div>
                )}
                <span className="text-sm text-white font-medium hidden lg:block max-w-[100px] truncate">
                  {authUser.nombre.split(' ')[0]}
                </span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-52 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50 animate-scale-in">
                  <div className="px-4 py-3 border-b border-border">
                    <p className="text-sm font-semibold text-foreground truncate">{authUser.nombre}</p>
                    <p className="text-xs text-muted-foreground capitalize">{authUser.tipo}</p>
                  </div>
                  <div className="p-1.5">
                    <Link
                      href={authUser.tipo === 'marca' ? '/marca/perfil' : '/influencer/perfil'}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground rounded-lg hover:bg-accent transition-colors"
                    >
                      <User className="w-4 h-4 text-muted-foreground" />
                      Mi perfil
                    </Link>
                    <Link
                      href={authUser.tipo === 'marca' ? '/marca/dashboard' : '/influencer/dashboard'}
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground rounded-lg hover:bg-accent transition-colors"
                    >
                      <LayoutDashboard className="w-4 h-4 text-muted-foreground" />
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-500 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Cerrar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center bg-white text-brand-600 font-semibold text-sm px-4 py-2 rounded-lg hover:bg-brand-50 transition-colors duration-150"
            >
              {isLanding ? 'Iniciar sesión' : 'Registrarse'}
            </Link>
          )}

          {/* Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-white hover:bg-white/12 active:scale-[0.97] transition-all"
            onClick={() => setMenuOpen(v => !v)}
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

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden fixed top-16 inset-x-0 z-40 bg-brand-600 dark:bg-card border-t border-white/10 shadow-lg animate-slide-down">
          <div className="flex flex-col gap-1 p-5">
            {authUser && (
              <div className="flex items-center gap-3 px-3 py-3 mb-2 border-b border-white/10">
                {authUser.avatar_url ? (
                  <img src={authUser.avatar_url} alt={authUser.nombre} className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm font-bold text-white">
                    {authUser.iniciales}
                  </div>
                )}
                <div>
                  <p className="text-sm font-semibold text-white">{authUser.nombre}</p>
                  <p className="text-xs text-white/60 capitalize">{authUser.tipo}</p>
                </div>
              </div>
            )}

            {activeLinks.map(({ href, label }) => (
              isLanding ? (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="text-base py-2 px-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  {label}
                </a>
              ) : (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={cn(
                    'text-base py-2 px-3 rounded-lg transition-colors',
                    pathname === href ? 'text-white bg-white/15 font-medium' : 'text-white/80 hover:text-white hover:bg-white/10'
                  )}
                >
                  {label}
                </Link>
              )
            ))}

            {isLanding && authUser && (
              <Link
                href="/"
                onClick={() => setMenuOpen(false)}
                className="text-base py-2 px-3 rounded-lg text-white font-medium hover:bg-white/10 transition-colors"
              >
                Plataforma →
              </Link>
            )}

            {authUser ? (
              <>
                <Link
                  href={authUser.tipo === 'marca' ? '/marca/perfil' : '/influencer/perfil'}
                  onClick={() => setMenuOpen(false)}
                  className="text-base py-2 px-3 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                >
                  Mi perfil
                </Link>
                <button
                  onClick={handleLogout}
                  className="mt-2 text-center text-red-300 text-sm py-2.5 rounded-lg hover:bg-white/10 transition-colors"
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link
                href={isLanding ? '/login' : '/registro'}
                onClick={() => setMenuOpen(false)}
                className="mt-3 text-center bg-white text-brand-600 font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-brand-50 transition-colors"
              >
                {isLanding ? 'Iniciar sesión' : 'Registrarse'}
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Command palette — sólo marca por ahora (palette de influencer pendiente) */}
      {authUser?.tipo === 'marca' && (
        <CommandPalette open={searchOpen} onOpenChange={setSearchOpen} role="marca" userId={authUser?.id ?? null} />
      )}
    </>
  )
}
