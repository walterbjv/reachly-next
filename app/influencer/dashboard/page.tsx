import type { Metadata } from 'next'
import Link from 'next/link'
import { fetchCampanas } from '@/lib/api'
import { CampanaCard } from '@/components/campanas/CampanaCard'
import { createSupabaseServer } from '@/lib/supabase-server'

export const metadata: Metadata = { title: 'Dashboard — Influencer' }

function formatFollowers(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`
  return n.toString()
}

export default async function DashboardInfluencerPage() {
  const supabase = await createSupabaseServer()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('nombre, bio, ubicacion, categorias')
    .eq('id', user!.id)
    .single()

  const nombre = profile?.nombre ?? user?.user_metadata?.nombre ?? 'Usuario'
  const primerNombre = nombre.split(' ')[0]

  const { data: influencerRow } = await supabase
    .from('influencers')
    .select('followers_count, engagement_rate')
    .eq('profile_id', user!.id)
    .single()

  const campanas = await fetchCampanas()
  const suggested = campanas.slice(0, 4)
  const activas = campanas.filter(c => c.estado === 'activa')

  const followers = influencerRow?.followers_count ?? 87500
  const engagement = influencerRow?.engagement_rate ?? 6.4

  const stats = [
    { label: 'Seguidores', value: formatFollowers(followers) },
    { label: 'Engagement', value: `${engagement.toFixed(1)}%` },
    { label: 'Campañas activas', value: activas.length.toString() },
    // TODO: derivar de tabla earnings cuando exista
    { label: 'Ingresos este mes', value: '$4.2K' },
  ]

  // TODO: derivar de tabla applications cuando exista
  const pipeline = [
    { stage: 'Postulaciones', items: suggested.slice(0, 2).map(c => `${c.marca} — ${c.titulo}`) },
    { stage: 'En negociación', items: suggested.slice(2, 3).map(c => `${c.marca} — ${c.titulo}`) },
    { stage: 'Activas', items: activas.slice(0, 1).map(c => `${c.marca} — ${c.titulo}`) },
    { stage: 'Completadas', items: campanas.filter(c => c.estado === 'cerrada').slice(0, 2).map(c => `${c.marca} — ${c.titulo}`) },
  ]

  return (
    <div className="max-w-[1100px] mx-auto px-[5%] py-10">
      {/* Welcome */}
      <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl p-7 mb-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-white text-2xl font-bold mb-1">Hola, {primerNombre}</h1>
          <p className="text-white/60 text-sm">{profile?.ubicacion ? `${profile.ubicacion} · ` : ''}Explora las campañas disponibles para ti.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/influencer/perfil" className="bg-white/15 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-white/25 transition-colors">
            Editar perfil
          </Link>
          <Link href="/campanas" className="bg-brand-400 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-brand-500 transition-colors">
            Explorar campañas
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pipeline */}
        <div className="lg:col-span-2">
          <h2 className="text-base font-bold text-foreground mb-4">Pipeline de campañas</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 overflow-x-auto">
            {pipeline.map(col => (
              <div key={col.stage} className="bg-card border border-border rounded-xl p-4 min-w-[140px]">
                <div className="text-xs font-semibold text-muted-foreground mb-3">{col.stage}</div>
                <div className="space-y-2">
                  {col.items.length === 0 ? (
                    <div className="text-[10px] text-muted-foreground italic">Sin items</div>
                  ) : col.items.map(item => (
                    <div key={item} className="bg-muted rounded-lg p-2.5 text-xs text-foreground leading-snug">
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications — TODO: derivar de tabla notifications */}
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-base font-bold text-foreground mb-4">Notificaciones</h2>
          <div className="space-y-3">
            {[
              { icon: '!', msg: 'Nike Chile aceptó tu postulación', time: '5 min' },
              { icon: '+', msg: 'Nueva campaña en tu categoría', time: '1h' },
              { icon: 'i', msg: 'Adidas vio tu perfil', time: '3h' },
            ].map((n, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-border last:border-0">
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm flex-shrink-0">{n.icon}</div>
                <div className="flex-1">
                  <p className="text-xs text-foreground">{n.msg}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Suggested campaigns */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-foreground">Campañas sugeridas para ti</h2>
          <Link href="/campanas" className="text-sm text-brand-400 hover:text-brand-600 transition-colors">Ver todas →</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {suggested.map((c, i) => <CampanaCard key={c.id} campana={c} index={i} />)}
        </div>
      </div>
    </div>
  )
}
