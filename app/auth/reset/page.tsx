'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ReachlyLogoLink } from '@/components/layout/ReachlyLogoLink'
import { cn } from '@/lib/utils'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        setReady(true)
      }
    })

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true)
    })

    return () => {
      subscription.subscription.unsubscribe()
    }
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    setSuccess(true)
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-[400px]">
        <div className="text-center mb-8">
          <ReachlyLogoLink variant="dark" imgClassName="h-8 mx-auto mb-2" className="inline-block" />
          <h1 className="text-xl font-bold text-foreground">Nueva contraseña</h1>
          <p className="text-muted-foreground text-sm mt-1">Elige una contraseña segura</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8">
          {success ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mx-auto mb-3 text-xl">✓</div>
              <h2 className="text-lg font-bold text-foreground mb-1">Contraseña actualizada</h2>
              <p className="text-sm text-muted-foreground">Te redirigimos al login…</p>
            </div>
          ) : !ready ? (
            <div className="text-center py-6">
              <p className="text-sm text-muted-foreground">Verificando link…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">Nueva contraseña</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/10 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1.5">Confirmar contraseña</label>
                <input
                  type="password"
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repite la contraseña"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/10 transition-all"
                />
              </div>
              {error && <p className="text-xs text-red-500 text-center">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className={cn(
                  'w-full bg-brand-600 text-white font-semibold text-sm py-3 rounded-xl transition-all mt-2',
                  loading ? 'opacity-70 cursor-wait' : 'hover:bg-brand-500'
                )}
              >
                {loading ? 'Guardando...' : 'Guardar contraseña'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
