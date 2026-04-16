import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { fetchInfluencer, fetchInfluencers } from '@/lib/api'
import { StatusBadge } from '@/components/ui/StatusBadge'
import { FollowButton } from '@/components/influencer/FollowButton'
import { CATEGORIA_COLORS } from '@/types/influencer'
import { formatSeguidores } from '@/lib/utils'

export const dynamicParams = true

export async function generateStaticParams() {
  const influencers = await fetchInfluencers()
  return influencers.map(i => ({ id: String(i.id) }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const inf = await fetchInfluencer(Number(id))
  if (!inf) return { title: 'Perfil no encontrado' }
  return {
    title: inf.nombre,
    description: `${inf.nombre} · ${inf.categoria} · ${formatSeguidores(inf.seguidores)} seguidores`,
  }
}

export default async function InfluencerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const inf = await fetchInfluencer(Number(id))
  if (!inf) notFound()

  const colors = CATEGORIA_COLORS[inf.categoria] ?? { bg: '#F0E8FF', text: '#4A1FA8' }
  const redesFilled = Object.entries(inf.redes ?? {}).filter(([, v]) => v)

  const stats = [
    { label: 'Seguidores', value: formatSeguidores(inf.seguidores) },
    { label: 'Engagement', value: `${inf.engagement}%` },
    { label: 'Categoría', value: inf.categoria },
    { label: 'Estado', value: inf.estado === 'disponible' ? 'Disponible' : inf.estado === 'top' ? 'Top Creator' : 'En campaña' },
  ]

  return (
    <div className="max-w-[900px] mx-auto px-[5%] py-12">
      <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 inline-flex items-center gap-1">
        ← Volver al explorador
      </Link>

      {/* Profile header */}
      <div className="bg-gradient-to-br from-[#4A1FA8] to-[#2E1270] rounded-2xl p-8 mb-5 mt-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
            {inf.avatar_url ? (
              <img src={inf.avatar_url} alt={inf.nombre} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold" style={{ background: colors.avatar ?? '#4A1FA8' }}>
                {inf.iniciales}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-white text-2xl md:text-3xl font-bold mb-2">{inf.nombre}</h1>
            <div className="flex flex-wrap gap-2 mb-3">
              <StatusBadge estado={inf.estado} />
              <span
                className="inline-flex text-xs font-semibold px-2.5 py-0.5 rounded-full"
                style={{ background: colors.bg, color: colors.text }}
              >
                {inf.categoria}
              </span>
            </div>
            {inf.ubicacion && (
              <p className="text-white/50 text-sm">{inf.ubicacion}</p>
            )}
          </div>

          {/* Follow button — client component */}
          {inf.profile_id && (
            <FollowButton targetProfileId={inf.profile_id} variant="dark" />
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-5 text-center">
            <div className="text-xl font-bold text-[#4A1FA8] dark:text-[#B89EF0] tracking-tight">{s.value}</div>
            <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="md:col-span-2 space-y-5">
          {/* Bio */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-base font-bold text-foreground mb-3">Sobre {inf.nombre.split(' ')[0]}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {inf.bio ?? `Creador de contenido especializado en ${inf.categoria.toLowerCase()} con ${formatSeguidores(inf.seguidores)} seguidores y un engagement del ${inf.engagement}%.`}
            </p>
          </div>

          {/* Redes sociales */}
          {redesFilled.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-base font-bold text-foreground mb-4">Redes sociales</h2>
              <div className="space-y-3">
                {redesFilled.map(([red, handle]) => (
                  <div key={red} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                    <div>
                      <div className="text-sm font-semibold text-foreground capitalize">{red}</div>
                      <div className="text-xs text-muted-foreground">@{handle}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-5">
          {/* Contacto */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-base font-bold text-foreground mb-4">Contacto</h2>
            <Link
              href="/campanas"
              className="block text-center w-full bg-[#4A1FA8] text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-[#6C3BF5] transition-colors mb-3"
            >
              Ver campañas
            </Link>
            <Link
              href="/mensajes"
              className="block text-center w-full border border-border text-muted-foreground font-medium text-sm px-4 py-2.5 rounded-xl hover:border-[#B89EF0] transition-colors"
            >
              Mensaje directo
            </Link>
          </div>

          {/* Categoría */}
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-base font-bold text-foreground mb-4">Categoría</h2>
            <span
              className="inline-flex text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{ background: colors.bg, color: colors.text }}
            >
              {inf.categoria}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
