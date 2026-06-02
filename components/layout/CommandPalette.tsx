'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Search,
  Megaphone,
  TrendingUp,
  Scale,
  MessageSquare,
  Bookmark,
  User,
  type LucideIcon,
} from 'lucide-react'
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command'
import { searchInfluencerProfiles, searchCampanasByOwner } from '@/lib/api'
import type { InfluencerProfile } from '@/types/influencer-profile'
import type { Campana } from '@/types/campana'

type Role = 'marca' | 'influencer'

interface Shortcut {
  label: string
  href: string
  icon: LucideIcon
}

const SHORTCUTS_MARCA: Shortcut[] = [
  { label: 'Dashboard', href: '/marca/dashboard', icon: LayoutDashboard },
  { label: 'Buscar influencers', href: '/marca/buscar-influencers', icon: Search },
  { label: 'Campañas', href: '/campanas', icon: Megaphone },
  { label: 'Tendencias', href: '/marca/tendencias', icon: TrendingUp },
  { label: 'Comparador', href: '/marca/comparador', icon: Scale },
  { label: 'Mensajes', href: '/marca/mensajes', icon: MessageSquare },
  { label: 'Guardados', href: '/marca/favoritos', icon: Bookmark },
  { label: 'Perfil', href: '/marca/perfil', icon: User },
]

// Placeholder: el palette de influencer se construye en un commit futuro.
const SHORTCUTS_INFLUENCER: Shortcut[] = []

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  role?: Role | null
  userId?: string | null
}

function estadoLabel(e?: Campana['estado']) {
  return e === 'cerrada' ? 'Cerrada' : e === 'borrador' ? 'Borrador' : 'Activa'
}

export function CommandPalette({ open, onOpenChange, role, userId }: Props) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [influencers, setInfluencers] = useState<InfluencerProfile[]>([])
  const [loading, setLoading] = useState(false)
  const [campanas, setCampanas] = useState<Campana[]>([])
  const [loadingCampanas, setLoadingCampanas] = useState(false)

  const shortcuts = role === 'marca' ? SHORTCUTS_MARCA : SHORTCUTS_INFLUENCER

  // Atajo global Cmd/Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        onOpenChange(true)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onOpenChange])

  // Limpiar estado al cerrar
  useEffect(() => {
    if (!open) {
      setQuery('')
      setInfluencers([])
      setLoading(false)
      setCampanas([])
      setLoadingCampanas(false)
    }
  }, [open])

  // Búsqueda en vivo de influencers (debounce ~300ms)
  useEffect(() => {
    const term = query.trim()
    if (term.length < 2) {
      setInfluencers([])
      setLoading(false)
      return
    }

    setLoading(true)
    let cancelled = false
    const timeout = setTimeout(async () => {
      try {
        const results = await searchInfluencerProfiles({ query: term })
        if (!cancelled) setInfluencers(results.slice(0, 6))
      } catch (err) {
        console.error('[CommandPalette] searchInfluencerProfiles:', err)
        if (!cancelled) setInfluencers([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }, 300)

    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [query])

  // Búsqueda en vivo de campañas propias de la marca (debounce ~300ms)
  useEffect(() => {
    const term = query.trim()
    if (!userId || term.length < 2) {
      setCampanas([])
      setLoadingCampanas(false)
      return
    }

    setLoadingCampanas(true)
    let cancelled = false
    const timeout = setTimeout(async () => {
      try {
        const results = await searchCampanasByOwner(term, userId)
        if (!cancelled) setCampanas(results)
      } catch (err) {
        console.error('[CommandPalette] searchCampanasByOwner:', err)
        if (!cancelled) setCampanas([])
      } finally {
        if (!cancelled) setLoadingCampanas(false)
      }
    }, 300)

    return () => {
      cancelled = true
      clearTimeout(timeout)
    }
  }, [query, userId])

  const lower = query.trim().toLowerCase()
  const filteredShortcuts = lower
    ? shortcuts.filter(s => s.label.toLowerCase().includes(lower))
    : shortcuts

  function goShortcut(href: string) {
    onOpenChange(false)
    router.push(href)
  }

  function goInfluencer(nombre: string) {
    onOpenChange(false)
    router.push(`/marca/buscar-influencers?q=${encodeURIComponent(nombre)}`)
  }

  function goCampana(id: number) {
    onOpenChange(false)
    router.push(`/campanas/${id}`)
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <Command shouldFilter={false}>
        <CommandInput
          placeholder="Buscar páginas, influencers..."
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
        {filteredShortcuts.length === 0 && influencers.length === 0 && !loading &&
          campanas.length === 0 && !loadingCampanas && !(userId && lower.length >= 2) && (
          <CommandEmpty>Sin resultados.</CommandEmpty>
        )}

        {filteredShortcuts.length > 0 && (
          <CommandGroup heading="Ir a">
            {filteredShortcuts.map(({ label, href, icon: Icon }) => (
              <CommandItem
                key={href}
                value={`page:${label}`}
                onSelect={() => goShortcut(href)}
              >
                <Icon className="text-muted-foreground" />
                <span>{label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {influencers.length > 0 && (
          <CommandGroup heading="Influencers">
            {influencers.map(inf => (
              <CommandItem
                key={inf.id}
                value={`influencer:${inf.id}`}
                onSelect={() => goInfluencer(inf.nombre)}
              >
                <User className="text-muted-foreground" />
                <div className="flex min-w-0 flex-1 flex-col">
                  <span className="truncate">{inf.nombre}</span>
                  {(inf.categorias[0] || inf.ubicacion) && (
                    <span className="truncate text-xs text-muted-foreground">
                      {[inf.categorias[0], inf.ubicacion].filter(Boolean).join(' · ')}
                    </span>
                  )}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {userId && lower.length >= 2 && (
          <CommandGroup heading="Mis campañas">
            {campanas.length > 0 ? (
              campanas.map(c => (
                <CommandItem
                  key={c.id}
                  value={`campana:${c.id}`}
                  onSelect={() => goCampana(c.id)}
                >
                  <Megaphone className="text-muted-foreground" />
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate">{c.titulo}</span>
                    <span className="truncate text-xs text-muted-foreground">{estadoLabel(c.estado)}</span>
                  </div>
                </CommandItem>
              ))
            ) : (
              !loadingCampanas && (
                <div className="px-2 py-1.5 text-xs text-muted-foreground">
                  No hay campañas creadas todavía
                </div>
              )
            )}
          </CommandGroup>
        )}
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
