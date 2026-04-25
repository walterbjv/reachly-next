'use client'

import { useState } from 'react'
import { CareersApplyModal } from './CareersApplyModal'

interface Job {
  titulo: string
  area: string
  tipo: string
  lugar: string
  descripcion: string
}

interface Perk {
  titulo: string
  desc: string
}

interface Props {
  jobs: Job[]
  perks: Perk[]
}

export function CareersClient({ jobs, perks }: Props) {
  const [posicion, setPosicion] = useState<string | null>(null)

  return (
    <div className="max-w-[900px] mx-auto px-[5%] py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-foreground mb-3">Construye el futuro del marketing de influencers</h1>
        <p className="text-muted-foreground max-w-xl mx-auto">Somos un equipo chico con gran impacto. Buscamos personas que quieran resolver problemas reales para millones de creadores en LATAM.</p>
      </div>

      {/* Perks */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-12">
        {perks.map(p => (
          <div key={p.titulo} className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm font-bold text-foreground">{p.titulo}</p>
            <p className="text-xs text-muted-foreground mt-1">{p.desc}</p>
          </div>
        ))}
      </div>

      {/* Positions */}
      <h2 className="text-xl font-bold text-foreground mb-5">Posiciones abiertas</h2>
      <div className="space-y-3 mb-12">
        {jobs.map(job => (
          <div key={job.titulo} className="bg-card border border-border rounded-xl p-5 flex flex-wrap items-start justify-between gap-4 hover:border-brand-300 transition-colors">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <span className="text-base font-bold text-foreground">{job.titulo}</span>
                <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-brand-50 dark:bg-brand-900 text-brand-600 dark:text-brand-300">{job.area}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{job.tipo} · {job.lugar}</p>
              <p className="text-sm text-muted-foreground">{job.descripcion}</p>
            </div>
            <button
              onClick={() => setPosicion(job.titulo)}
              className="bg-brand-600 text-white text-sm font-semibold px-5 py-2 rounded-xl hover:bg-brand-500 transition-colors flex-shrink-0"
            >
              Aplicar
            </button>
          </div>
        ))}
      </div>

      {/* Open application */}
      <div className="bg-card border border-border rounded-2xl p-8 text-center">
        <h2 className="text-lg font-bold text-foreground mb-2">¿No encuentras tu rol?</h2>
        <p className="text-muted-foreground text-sm mb-5">Mándanos tu perfil de todas formas. Si hay fit, te contactamos.</p>
        <button
          onClick={() => setPosicion('Postulación general')}
          className="inline-block bg-brand-600 text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-brand-500 transition-colors"
        >
          Enviar postulación abierta
        </button>
      </div>

      <CareersApplyModal
        open={posicion !== null}
        posicion={posicion}
        onClose={() => setPosicion(null)}
      />
    </div>
  )
}
