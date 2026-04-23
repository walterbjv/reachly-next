'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import { FAQS } from '../_data'

const EASE = [0.23, 1, 0.32, 1] as const

export function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-24 px-[5%] bg-white dark:bg-card">
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-16">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <p className="text-xs font-semibold uppercase tracking-[.12em] text-brand-400 mb-3">FAQ</p>
          <h3 className="text-[clamp(22px,2.8vw,32px)] font-bold text-foreground leading-tight mb-4">
            Preguntas frecuentes
          </h3>
          <p className="text-[15px] text-muted-foreground leading-relaxed mb-7">
            ¿No encuentras lo que buscas? Escríbenos directamente y te respondemos en menos de 24 horas.
          </p>
          <Link
            href="/contacto"
            className="inline-block border border-brand-600 text-brand-600 font-medium text-sm px-5 py-2.5 rounded-xl hover:bg-brand-50 active:scale-[0.97] transition-all"
            style={{ transition: 'all 200ms cubic-bezier(0.23, 1, 0.32, 1)' }}
          >
            Contactar soporte →
          </Link>
        </motion.div>

        {/* Right — accordion */}
        <motion.div
          className="space-y-1"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: EASE, delay: 0.1 }}
        >
          {FAQS.map((f, i) => (
            <div key={i} className="border-b border-border last:border-0">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between py-4 text-left text-sm font-medium text-foreground hover:text-brand-600 gap-3 min-h-[48px]"
                style={{ transition: 'color 180ms ease' }}
              >
                <span>{f.q}</span>
                <motion.span
                  animate={{ rotate: open === i ? 180 : 0 }}
                  transition={{ type: 'spring', duration: 0.3, bounce: 0.15 }}
                  className="text-muted-foreground flex-shrink-0"
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.span>
              </button>

              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{
                      height: { duration: 0.3, ease: EASE },
                      opacity: { duration: 0.2, ease: 'linear' },
                    }}
                    style={{ overflow: 'hidden' }}
                  >
                    <p className="pb-4 text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
