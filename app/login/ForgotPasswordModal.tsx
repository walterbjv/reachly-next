'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'

const EASE = [0.23, 1, 0.32, 1] as const

interface Props {
  open: boolean
  onClose: () => void
}

export function ForgotPasswordModal({ open, onClose }: Props) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset`,
    })
    setLoading(false)
    setSent(true)
  }

  function handleClose() {
    onClose()
    setTimeout(() => {
      setEmail('')
      setSent(false)
    }, 200)
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={handleClose} />
          <motion.div
            className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-[420px] shadow-xl"
            initial={{ y: 20, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 10, opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            {sent ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mx-auto mb-3 text-xl">✓</div>
                <h3 className="text-lg font-bold text-foreground mb-1">Revisa tu email</h3>
                <p className="text-sm text-muted-foreground mb-5">
                  Si <span className="text-foreground font-medium">{email}</span> está registrado, recibirás un link para crear una contraseña nueva.
                </p>
                <button
                  onClick={handleClose}
                  className="w-full bg-brand-600 text-white font-semibold text-sm py-2.5 rounded-xl hover:bg-brand-500 transition-colors"
                >
                  Entendido
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 className="text-lg font-bold text-foreground mb-1">Recuperar contraseña</h3>
                <p className="text-sm text-muted-foreground mb-5">
                  Ingresa tu email y te enviaremos un link para crear una contraseña nueva.
                </p>
                <label className="block text-xs font-semibold text-foreground mb-1.5">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/10 transition-all mb-5"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className={cn(
                    'w-full bg-brand-600 text-white font-semibold text-sm py-3 rounded-xl transition-all',
                    loading ? 'opacity-70 cursor-wait' : 'hover:bg-brand-500'
                  )}
                >
                  {loading ? 'Enviando...' : 'Enviar link'}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
