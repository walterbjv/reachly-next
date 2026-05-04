import type { Metadata } from 'next'
import Link from 'next/link'
import { fetchInfluencers, fetchCampanas } from '@/lib/api'
import { InfluencerCard } from '@/components/influencer/InfluencerCard'
import { createSupabaseServer } from '@/lib/supabase-server'

export const metadata: Metadata = { title: 'Dashboard — Marca' }

function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(0)}K`
  return n.toString()
}

export default async function DashboardMarcaPage() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('nombre, ubicacion')
    .eq('id', user!.id)
    .single()

  const nombre = profile?.nombre ?? user?.user_metadata?.nombre ?? 'tu marca'

  const { data: brandRow } = await supabase
    .from('brands')
    .select('id')
    .eq('profile_id', user!.id)
    .single()

  const influencers = await fetchInfluencers()
  const campanas = await fetchCampanas()

  const myBrandId = brandRow?.id
  const misCampanas = myBrandId
    ? campanas.filter(c => c.brandId === myBrandId)
    : campanas.slice(0, 3)

  const activas = misCampanas.filter(c => c.estado === 'activa')
  const alcanceTotal = influencers.slice(0, 8).reduce((sum, i) => sum + i.seguidores, 0)
  const matches = influencers.filter(i => i.estado === 'disponible').slice(0, 4)

  const stats = [
    { label: 'Influencers activos', value: Math.min(influencers.length, 8).toString() },
    { label: 'Campañas activas', value: activas.length.toString() },
    { label: 'Alcance total', value: formatFollowers(alcanceTotal) },
    // TODO: derivar de tabla campaign_results cuando exista
    { label: 'ROI promedio', value: '4.8x' },
  ]

  const estadoLabel: Record<string, string> = { activa: 'Activa', borrador: 'Borrador', cerrada: 'Cerrada' }

  return (
    <div className="max-w-[1100px] mx-auto px-[5%] py-10">
      {/* Welcome */}
      <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl p-7 mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-white text-2xl font-bold mb-1">Hola, {nombre}</h1>
          <p className="text-white/60 text-sm">{profile?.ubicacion ? `${profile.ubicacion} · ` : ''}Encuentra los mejores influencers para tus campañas.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/campanas" className="bg-white/15 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-white/25 transition-colors">
            Ver campañas
          </Link>
          <Link href="/" className="bg-brand-400 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-brand-500 transition-colors">
            Buscar influencers
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-5">
            <div className="text-xs text-muted-foreground mb-2">{s.label}</div>
            <div className="text-2xl font-bold text-foreground">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Campaigns */}
        <div className="lg:col-span-2">
          <h2 className="text-base font-bold text-foreground mb-4">Mis campañas</h2>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            {misCampanas.length === 0 ? (
              <div className="p-6 text-center text-sm text-muted-foreground">
                Aún no tienes campañas. <Link href="/campanas" className="text-brand-400 hover:text-brand-600">Crear una →</Link>
              </div>
            ) : misCampanas.map(c => (
              <Link
                key={c.id}
                href={`/campanas/${c.id}`}
                className="flex items-center justify-between p-4 border-b border-border last:border-0 hover:bg-accent transition-colors"
              >
                <div>
                  <div className="text-sm font-semibold text-foreground">{c.titulo}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{c.categoria} · {c.presupuesto}</div>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  c.estado === 'activa' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' :
                  c.estado === 'borrador' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {c.estado ? (estadoLabel[c.estado] ?? c.estado) : '—'}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent matches */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-base font-bold text-foreground mb-4">Matches recientes</h2>
          <div className="space-y-3">
            {influencers.slice(0, 4).map(inf => (
              <Link key={inf.id} href={`/u/${inf.id}`} className="flex items-center gap-3 py-1.5 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                  <svg width="32" height="32" viewBox="0 0 32 32">
                    <circle cx="16" cy="16" r="16" fill="var(--color-brand-600)" />
                    <text x="16" y="16" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="11" fontWeight="600" fontFamily="sans-serif">{inf.iniciales}</text>
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-foreground truncate">{inf.nombre}</div>
                  <div className="text-[10px] text-muted-foreground">{inf.categoria}</div>
                </div>
                <span className="text-[10px] text-emerald-600 font-semibold">{inf.engagement}%</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Suggested influencers */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-foreground">Influencers disponibles para tu campaña</h2>
          <Link href="/" className="text-sm text-brand-400 hover:text-brand-600 transition-colors">Ver todos →</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {matches.map((inf, i) => <InfluencerCard key={inf.id} influencer={inf} index={i} />)}
        </div>
      </div>
    </div>
  )
}
