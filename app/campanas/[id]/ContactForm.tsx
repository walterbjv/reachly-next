'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

const EASE = [0.23, 1, 0.32, 1] as const

interface Props {
  campanaTitulo: string
  marca: string
}

export function ContactForm({ campanaTitulo, marca }: Props) {
  const { isLoggedIn, user, isLoading } = useAuth()
  const [open, setOpen] = useState(false)
  const [asunto, setAsunto] = useState(`Postulación a ${campanaTitulo}`)
  const [mensaje, setMensaje] = useState('')
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // TODO: integrar con tabla messages o RPC send_application
    console.log('Mensaje a marca', { marca, asunto, mensaje })
    setSent(true)
    setTimeout(() => {
      setOpen(false)
      setSent(false)
      setMensaje('')
    }, 1800)
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        disabled={isLoading}
        className="block w-full text-center bg-brand-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-brand-500 transition-colors disabled:opacity-50"
      >
        Postularme a esta campaña
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center px-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => !sent && setOpen(false)}
            />
            <motion.div
              className="relative bg-card border border-border rounded-2xl p-6 w-full max-w-[480px] shadow-xl"
              initial={{ y: 20, opacity: 0, scale: 0.97 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 10, opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>

              {!isLoggedIn ? (
                <div className="text-center py-4">
                  <h3 className="text-lg font-bold text-foreground mb-2">Inicia sesión para postularte</h3>
                  <p className="text-sm text-muted-foreground mb-5">
                    Necesitas una cuenta de influencer para enviar mensajes a las marcas.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Link
                      href="/login"
                      className="bg-brand-600 text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-brand-500 transition-colors"
                    >
                      Iniciar sesión
                    </Link>
                    <Link
                      href="/registro"
                      className="border border-border text-foreground font-medium text-sm px-5 py-2.5 rounded-xl hover:border-brand-300 transition-colors"
                    >
                      Crear cuenta
                    </Link>
                  </div>
                </div>
              ) : sent ? (
                <div className="text-center py-6">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mx-auto mb-3 text-xl">✓</div>
                  <h3 className="text-lg font-bold text-foreground mb-1">Mensaje enviado</h3>
                  <p className="text-sm text-muted-foreground">{marca} recibirá tu postulación.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <h3 className="text-lg font-bold text-foreground mb-1">Contactar a {marca}</h3>
                  <p className="text-sm text-muted-foreground mb-5">Cuéntale por qué encajas con esta campaña.</p>

                  <div className="space-y-3 mb-5">
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">Asunto</label>
                      <input
                        type="text"
                        value={asunto}
                        onChange={(e) => setAsunto(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:border-brand-400"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-foreground mb-1">Mensaje</label>
                      <textarea
                        value={mensaje}
                        onChange={(e) => setMensaje(e.target.value)}
                        required
                        rows={5}
                        placeholder="Hola, soy creador de contenido especializado en…"
                        className="w-full px-3 py-2 rounded-lg border border-border bg-background text-sm text-foreground focus:outline-none focus:border-brand-400 resize-none"
                      />
                    </div>
                    {user && (
                      <p className="text-xs text-muted-foreground">Enviando como <span className="text-foreground font-medium">{user.nombre}</span></p>
                    )}
                  </div>

                  <div className="flex gap-3 justify-end">
                    <button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="border border-border text-foreground font-medium text-sm px-4 py-2 rounded-xl hover:border-brand-300 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="bg-brand-600 text-white font-semibold text-sm px-5 py-2 rounded-xl hover:bg-brand-500 transition-colors"
                    >
                      Enviar mensaje
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
