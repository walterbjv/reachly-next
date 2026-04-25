'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const EASE = [0.23, 1, 0.32, 1] as const

export interface LegalItem {
  q: string
  a: ReactNode
}

interface Props {
  eyebrow: string
  title: string
  intro: string
  lastUpdated: string
  items: LegalItem[]
}

export function LegalAccordion({ eyebrow, title, intro, lastUpdated, items }: Props) {
  const [open, setOpen] = useState<number | null>(0)

  return (
    <section className="py-16 px-[5%]">
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-12 lg:gap-16">
        {/* Left */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: EASE }}
        >
          <p className="text-xs font-semibold uppercase tracking-[.12em] text-brand-400 mb-3">{eyebrow}</p>
          <h1 className="text-[clamp(22px,2.8vw,32px)] font-bold text-foreground leading-tight mb-4">
            {title}
          </h1>
          <p className="text-[15px] text-muted-foreground leading-relaxed mb-3">{intro}</p>
          <p className="text-xs text-muted-foreground mb-7">Última actualización: {lastUpdated}</p>
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
          {items.map((item, i) => (
            <div key={i} className="border-b border-border last:border-0">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between py-4 text-left text-sm font-semibold text-foreground hover:text-brand-600 gap-3 min-h-[48px]"
                style={{ transition: 'color 180ms ease' }}
              >
                <span>{item.q}</span>
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
                    <div className="pb-4 pr-4 text-sm text-muted-foreground leading-relaxed space-y-2">
                      {item.a}
                    </div>
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
