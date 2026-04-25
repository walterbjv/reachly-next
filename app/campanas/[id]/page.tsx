import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { fetchCampana, fetchCampanas, CATEGORIA_COLORS } from '@/lib/api'
import { formatSeguidores } from '@/lib/utils'
import { ContactForm } from './ContactForm'

export async function generateStaticParams() {
  const campanas = await fetchCampanas()
  return campanas.map(c => ({ id: String(c.id) }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const campana = await fetchCampana(Number(id))
  if (!campana) return { title: 'Campaña no encontrada' }
  return { title: campana.titulo, description: campana.descripcion }
}

export default async function CampanaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const campana = await fetchCampana(Number(id))
  if (!campana) notFound()

  const colors = CATEGORIA_COLORS[campana.categoria] ?? { bg: 'var(--color-brand-50)', text: 'var(--color-brand-600)' }
  const estadoLabel = campana.estado === 'cerrada' ? 'Cerrada' : campana.estado === 'borrador' ? 'Borrador' : 'Activa'

  const stats = [
    { label: 'Presupuesto', value: campana.presupuesto },
    { label: 'Categoría', value: campana.categoria },
    { label: 'Seguidores mín.', value: campana.seguidoresMin ? formatSeguidores(campana.seguidoresMin) : '—' },
    { label: 'Estado', value: estadoLabel },
  ]

  return (
    <div className="max-w-[900px] mx-auto px-[5%] py-12">
      <Link href="/campanas" className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 inline-flex items-center gap-1">
        ← Volver a campañas
      </Link>

      {/* Header */}
      <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl p-8 mb-5 mt-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.15)', color: '#fff' }}
          >
            {campana.iniciales}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white/70 text-sm mb-1">
              {campana.brandId ? (
                <Link href={`/marca/${campana.brandId}`} className="hover:text-white transition-colors">
                  {campana.marca} →
                </Link>
              ) : (
                campana.marca
              )}
            </div>
            <h1 className="text-white text-2xl md:text-3xl font-bold mb-3">{campana.titulo}</h1>
            <div className="flex flex-wrap gap-2">
              <span
                className="inline-flex text-xs font-semibold px-2.5 py-0.5 rounded-full"
                style={{ background: colors.bg, color: colors.text }}
              >
                {campana.categoria}
              </span>
              <span className="inline-flex text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/15 text-white">
                {estadoLabel}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-5 text-center">
            <div className="text-xl font-bold text-brand-600 dark:text-brand-300 tracking-tight">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 space-y-5">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-base font-bold text-foreground mb-3">Sobre la campaña</h2>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">{campana.descripcion}</p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-base font-bold text-foreground mb-3">Requisitos</h2>
            {campana.seguidoresMin || campana.engagementMin ? (
              <ul className="space-y-2 text-sm text-muted-foreground">
                {campana.seguidoresMin && (
                  <li className="flex items-start gap-2">
                    <span className="text-brand-500 mt-0.5">•</span>
                    <span>Mínimo <span className="font-semibold text-foreground">{formatSeguidores(campana.seguidoresMin)}</span> seguidores</span>
                  </li>
                )}
                {campana.engagementMin && (
                  <li className="flex items-start gap-2">
                    <span className="text-brand-500 mt-0.5">•</span>
                    <span>Engagement mínimo del <span className="font-semibold text-foreground">{campana.engagementMin}%</span></span>
                  </li>
                )}
                <li className="flex items-start gap-2">
                  <span className="text-brand-500 mt-0.5">•</span>
                  <span>Contenido alineado con la categoría <span className="font-semibold text-foreground">{campana.categoria}</span></span>
                </li>
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">La marca evaluará postulaciones caso a caso.</p>
            )}
            {/* TODO: añadir columna requirements (text[]) en campaigns para listar requisitos específicos por marca */}
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-base font-bold text-foreground mb-3">Plazo</h2>
            <p className="text-sm text-muted-foreground">A coordinar con la marca tras la postulación.</p>
            {/* TODO: añadir columna deadline (date) en campaigns para mostrar fecha de cierre */}
          </div>
        </div>

        <div className="space-y-5">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-base font-bold text-foreground mb-4">Postular</h2>
            <ContactForm campanaTitulo={campana.titulo} marca={campana.marca} />
            <p className="text-xs text-muted-foreground mt-3 text-center">
              Tu mensaje llegará directo a la marca.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-base font-bold text-foreground mb-4">Marca</h2>
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-base font-bold flex-shrink-0"
                style={{ background: colors.bg, color: colors.text }}
              >
                {campana.iniciales}
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold text-foreground truncate">{campana.marca}</div>
                <div className="text-xs text-muted-foreground">{campana.categoria}</div>
              </div>
            </div>
            {campana.brandId && (
              <Link
                href={`/marca/${campana.brandId}`}
                className="block text-center w-full border border-border text-muted-foreground font-medium text-sm px-4 py-2 rounded-xl hover:border-brand-300 hover:text-foreground transition-colors"
              >
                Ver perfil →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
