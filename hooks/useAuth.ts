'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useUserStore } from '@/store/useUserStore'

type Role = 'influencer' | 'marca'

export interface AuthUser {
  nombre: string
  iniciales: string
  avatar_url: string | null
  tipo: Role
}

export interface UseAuthResult {
  isLoggedIn: boolean
  role: Role | null
  user: AuthUser | null
  isLoading: boolean
}

function toIniciales(nombre: string): string {
  return (
    nombre
      .split(' ')
      .slice(0, 2)
      .map((p) => p[0])
      .join('')
      .toUpperCase() || '?'
  )
}

export function useAuth(): UseAuthResult {
  const storeUser = useUserStore((s) => s.user)
  const setStoreUser = useUserStore((s) => s.setUser)

  const [user, setUser] = useState<AuthUser | null>(() =>
    storeUser
      ? {
          nombre: storeUser.nombre,
          iniciales: storeUser.iniciales ?? toIniciales(storeUser.nombre),
          avatar_url: null,
          tipo: storeUser.tipo,
        }
      : null,
  )
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    supabase.auth.getUser().then(async ({ data }) => {
      if (cancelled) return
      if (!data.user) {
        setUser(null)
        setIsLoading(false)
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('nombre, avatar_url, tipo')
        .eq('id', data.user.id)
        .single()

      if (cancelled) return

      const nombre = profile?.nombre ?? data.user.user_metadata?.nombre ?? 'Usuario'
      const tipo: Role = profile?.tipo ?? data.user.user_metadata?.tipo ?? 'influencer'
      const iniciales = toIniciales(nombre)

      const authUser: AuthUser = {
        nombre,
        iniciales,
        avatar_url: profile?.avatar_url ?? null,
        tipo,
      }

      setUser(authUser)
      setStoreUser({ nombre, tipo, iniciales })
      setIsLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [setStoreUser])

  return {
    isLoggedIn: user !== null,
    role: user?.tipo ?? null,
    user,
    isLoading,
  }
}
