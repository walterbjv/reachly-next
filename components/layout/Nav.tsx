'use client'
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useThemeStore } from '@/store/useThemeStore'
import { fetchInfluencers, fetchCampanas } from '@/lib/api'
import type { Influencer } from '@/types/influencer'
import type { Campana } from '@/types/campana'
import { InfluencerAvatar } from '@/components/ui/InfluencerAvatar'
import { cn } from '@/lib/utils'
import { Search, Moon, Sun, Menu, X, LogOut, User, LayoutDashboard } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { LANDING_NAV_LINKS } from '@/components/layout/nav-links'
import { useAuth } from '@/hooks/useAuth'

const EASE = [0.23, 1, 0.32, 1] as const

const NAV_LINKS_MARCA = [
  { href: '/', label: 'Explorar' },
  { href: '/campanas', label: 'Campañas' },
  { href: '/marca/tendencias', label: 'Tendencias' },
  { href: '/marca/comparador', label: 'Comparador' },
  { href: '/marca/mensajes', label: 'Mensajes' },
  { href: '/favoritos', label: 'Guardados' },
]

const NAV_LINKS_INFLUENCER = [
  { href: '/', label: 'Explorar' },
  { href: '/campanas', label: 'Campañas' },
  { href: '/influencer/mensajes', label: 'Mensajes' },
  { href: '/favoritos', label: 'Guardados' },
]

export function Nav() {
  const pathname = usePathname()
  const router = useRouter()
  const { isDark, toggle } = useThemeStore()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<{ influencers: Influencer[]; campanas: Campana[] }>({
    influencers: [],
    campanas: [],
  })
  const [allInfluencers, setAllInfluencers] = useState<Influencer[]>([])
  const [allCampanas, setAllCampanas] = useState<Campana[]>([])
  const [activeIdx, setActiveIdx] = useState(-1)
  const { user: authUser } = useAuth()
  const navLinks = authUser?.tipo === 'marca' ? NAV_LINKS_MARCA : NAV_LINKS_INFLUENCER
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
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

  // Preload data when search opens
  useEffect(() => {
    if (searchOpen && allInfluencers.length === 0) {
      Promise.all([fetchInfluencers(), fetchCampanas()]).then(([infs, camps]) => {
        setAllInfluencers(infs)
        setAllCampanas(camps)
      })
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [searchOpen, allInfluencers.length])

  // Keyboard shortcut Cmd/Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setSearchOpen(true)
      }
      if (e.key === 'Escape') setSearchOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])

  function handleSearch(q: string) {
    setQuery(q)
    setActiveIdx(-1)
    if (!q || q.length < 2) {
      setResults({ influencers: [], campanas: [] })
      return
    }
    const lower = q.toLowerCase()
    setResults({
      influencers: allInfluencers
        .filter(i => i.nombre.toLowerCase().includes(lower) || i.categoria.toLowerCase().includes(lower))
        .slice(0, 5),
      campanas: allCampanas
        .filter(c => c.titulo.toLowerCase().includes(lower) || c.marca.toLowerCase().includes(lower))
        .slice(0, 4),
    })
  }

  const allResults = [
    ...results.influencers.map(i => ({ type: 'influencer' as const, id: i.id, name: i.nombre, sub: i.categoria, iniciales: i.iniciales, categoria: i.categoria })),
    ...results.campanas.map(c => ({ type: 'campana' as const, id: c.id, name: c.titulo, sub: c.marca, iniciales: c.iniciales, categoria: c.categoria })),
  ]

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(i + 1, allResults.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIdx(i => Math.max(i - 1, 0)) }
    if (e.key === 'Enter' && activeIdx >= 0) {
      const r = allResults[activeIdx]
      if (r) navigate(r)
    }
  }

  function navigate(r: typeof allResults[number]) {
    setSearchOpen(false)
    setQuery('')
    router.push(r.type === 'influencer' ? `/u/${r.id}` : `/campanas/${r.id}`)
  }

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
          {isLanding && (
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
          {/* Search trigger — only on non-landing */}
          {!isLanding && (
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
                      href="/perfil"
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
                  href="/perfil"
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

      {/* Search modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[100] flex justify-center pt-[min(20vh,140px)] bg-brand-950/60 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) setSearchOpen(false) }}
        >
          <div className="w-[90%] max-w-[560px] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden max-h-[70vh] flex flex-col animate-scale-in">
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border">
              <Search className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => handleSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Buscar influencers, campañas..."
                className="flex-1 bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground outline-none"
              />
              <kbd className="text-[10px] border border-border text-muted-foreground px-1.5 py-0.5 rounded">ESC</kbd>
            </div>

            <div className="overflow-y-auto p-2">
              {query.length < 2 ? (
                <p className="text-center text-muted-foreground text-sm py-8">Escribe para buscar en toda la plataforma</p>
              ) : allResults.length === 0 ? (
                <p className="text-center text-muted-foreground text-sm py-8">Sin resultados para &ldquo;{query}&rdquo;</p>
              ) : (
                <>
                  {results.influencers.length > 0 && (
                    <>
                      <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Influencers</p>
                      {results.influencers.map((inf, idx) => (
                        <button
                          key={inf.id}
                          onClick={() => navigate({ type: 'influencer', id: inf.id, name: inf.nombre, sub: inf.categoria, iniciales: inf.iniciales, categoria: inf.categoria })}
                          className={cn(
                            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors',
                            activeIdx === idx ? 'bg-accent' : 'hover:bg-accent/50'
                          )}
                        >
                          <InfluencerAvatar iniciales={inf.iniciales} categoria={inf.categoria} size="sm" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{inf.nombre}</p>
                            <p className="text-xs text-muted-foreground">{inf.categoria} · {inf.seguidores.toLocaleString()} seg.</p>
                          </div>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-brand-50 text-brand-600">Influencer</span>
                        </button>
                      ))}
                    </>
                  )}
                  {results.campanas.length > 0 && (
                      <>
                        <p className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mt-1">Campañas</p>
                        {results.campanas.map((c, idx) => {
                          const globalIdx = results.influencers.length + idx
                          return (
                            <button
                              key={c.id}
                              onClick={() => navigate({ type: 'campana', id: c.id, name: c.titulo, sub: c.marca, iniciales: c.iniciales, categoria: c.categoria })}
                              className={cn(
                                'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left min-h-[48px]',
                                activeIdx === globalIdx ? 'bg-accent' : 'hover:bg-accent/50'
                              )}
                              style={{ transition: 'background-color 100ms ease' }}
                            >
                              <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-sm font-bold text-blue-800 dark:text-blue-300 flex-shrink-0">
                                {c.iniciales}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-foreground truncate">{c.titulo}</p>
                                <p className="text-xs text-muted-foreground">{c.marca} · {c.categoria}</p>
                              </div>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">Campaña</span>
                            </button>
                          )
                        })}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
    </>
  )
}
