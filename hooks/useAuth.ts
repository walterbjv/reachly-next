'use client'
import { useEffect, useState } from 'react'
import type { Session } from '@supabase/supabase-js'
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
  const clearStoreUser = useUserStore((s) => s.clearUser)

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

    async function syncFromSession(session: Session) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('nombre, avatar_url, tipo')
        .eq('id', session.user.id)
        .single()

      if (cancelled) return

      const nombre = profile?.nombre ?? session.user.user_metadata?.nombre ?? 'Usuario'
      const tipo: Role = profile?.tipo ?? session.user.user_metadata?.tipo ?? 'influencer'
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
    }

    // onAuthStateChange dispara INITIAL_SESSION en mount con la sesión actual
    // y luego SIGNED_IN / SIGNED_OUT / TOKEN_REFRESHED / USER_UPDATED.
    // Centralizar todo en el listener (sin getUser() inicial separado) evita
    // race conditions entre un fetch inicial y los eventos del listener.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (cancelled) return

        if (event === 'SIGNED_OUT') {
          setUser(null)
          clearStoreUser()
          setIsLoading(false)
          return
        }

        // INITIAL_SESSION sin sesión = arranque sin login. No llamamos
        // clearStoreUser para preservar flags persistidos como onboardingDone.
        if (!session?.user) {
          setUser(null)
          setIsLoading(false)
          return
        }

        void syncFromSession(session)
      },
    )

    return () => {
      cancelled = true
      subscription.unsubscribe()
    }
  }, [setStoreUser, clearStoreUser])

  return {
    isLoggedIn: user !== null,
    role: user?.tipo ?? null,
    user,
    isLoading,
  }
}
