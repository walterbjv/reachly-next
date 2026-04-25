'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

const EASE = [0.23, 1, 0.32, 1] as const

interface Props {
  open: boolean
  posicion: string | null
  onClose: () => void
}

export function CareersApplyModal({ open, posicion, onClose }: Props) {
  const [form, setForm] = useState({ nombre: '', email: '', link: '', mensaje: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (open) {
      setSent(false)
      setForm({ nombre: '', email: '', link: '', mensaje: '' })
    }
  }, [open])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    // TODO: integrar con tabla applications o endpoint /api/careers/apply
    console.log('Aplicación a careers', { posicion, ...form })
    setTimeout(() => {
      setLoading(false)
      setSent(true)
    }, 600)
  }

  return (
    <AnimatePresence>
      {open && posicion && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !loading && onClose()} />
          <motion.div
            className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-[480px] shadow-xl max-h-[90vh] overflow-y-auto"
            initial={{ y: 20, opacity: 0, scale: 0.97 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 10, opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            {sent ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mx-auto mb-3 text-xl">✓</div>
                <h3 className="text-lg font-bold text-foreground mb-1">Aplicación enviada</h3>
                <p className="text-sm text-muted-foreground mb-5">
                  Recibimos tu postulación a <span className="text-foreground font-medium">{posicion}</span>. Si encajas, te contactamos pronto.
                </p>
                <button
                  onClick={onClose}
                  className="w-full bg-brand-600 text-white font-semibold text-sm py-2.5 rounded-xl hover:bg-brand-500 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <h3 className="text-lg font-bold text-foreground mb-1">Aplicar a {posicion}</h3>
                <p className="text-sm text-muted-foreground mb-5">Completa tus datos y revisamos tu perfil.</p>

                <div className="space-y-3 mb-5">
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Nombre completo</label>
                    <input
                      type="text"
                      required
                      value={form.nombre}
                      onChange={(e) => setForm(p => ({ ...p, nombre: e.target.value }))}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:border-brand-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Email</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="tu@email.com"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:border-brand-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">LinkedIn o link a tu CV</label>
                    <input
                      type="url"
                      required
                      value={form.link}
                      onChange={(e) => setForm(p => ({ ...p, link: e.target.value }))}
                      placeholder="https://linkedin.com/in/…"
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:border-brand-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-foreground mb-1">Mensaje</label>
                    <textarea
                      value={form.mensaje}
                      onChange={(e) => setForm(p => ({ ...p, mensaje: e.target.value }))}
                      required
                      rows={4}
                      placeholder="Cuéntanos por qué encajas con el rol y qué te entusiasma de Reachly."
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:border-brand-400 resize-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <button
                    type="button"
                    onClick={onClose}
                    className="border border-border text-foreground font-medium text-sm px-4 py-2 rounded-xl hover:border-brand-300 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className={cn(
                      'bg-brand-600 text-white font-semibold text-sm px-5 py-2 rounded-xl transition-colors',
                      loading ? 'opacity-70 cursor-wait' : 'hover:bg-brand-500'
                    )}
                  >
                    {loading ? 'Enviando…' : 'Enviar aplicación'}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
