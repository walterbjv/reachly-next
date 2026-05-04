import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { fetchMarca, fetchMarcas, fetchCampanas, CATEGORIA_COLORS } from '@/lib/api'

export const dynamicParams = true

export async function generateStaticParams() {
  const marcas = await fetchMarcas()
  return marcas.map(m => ({ id: String(m.id) }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const marca = await fetchMarca(Number(id))
  if (!marca) return { title: 'Marca no encontrada' }
  return {
    title: marca.nombre,
    description: marca.descripcion ?? `Perfil de ${marca.nombre} en Reachly.`,
  }
}

export default async function MarcaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [marca, todasCampanas] = await Promise.all([
    fetchMarca(Number(id)),
    fetchCampanas(),
  ])
  if (!marca) notFound()

  const campanasMarca = todasCampanas.filter(c => c.brandId === marca.id)
  const categoriaPrincipal = marca.categorias?.[0] ?? 'General'
  const colors = CATEGORIA_COLORS[categoriaPrincipal] ?? { bg: 'var(--color-brand-50)', text: 'var(--color-brand-600)' }

  const stats = [
    { label: 'Campañas activas', value: String(campanasMarca.filter(c => c.estado === 'activa').length) },
    { label: 'Total campañas', value: String(campanasMarca.length) },
    { label: 'Categorías', value: String(marca.categorias?.length ?? 0) },
    { label: 'Ubicación', value: marca.ubicacion ?? '—' },
  ]

  return (
    <div className="max-w-[900px] mx-auto px-[5%] py-12">
      <Link href="/campanas" className="text-sm text-muted-foreground hover:text-foreground transition-colors mb-6 inline-flex items-center gap-1">
        ← Volver a campañas
      </Link>

      {/* Profile header */}
      <div className="bg-gradient-to-br from-brand-600 to-brand-800 rounded-2xl p-8 mb-5 mt-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl flex-shrink-0 flex items-center justify-center text-white text-2xl font-bold" style={{ background: 'rgba(255,255,255,0.15)' }}>
            {marca.iniciales}
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="text-white text-2xl md:text-3xl font-bold mb-2">{marca.nombre}</h1>
            <div className="flex flex-wrap gap-2 mb-3">
              <span
                className="inline-flex text-xs font-semibold px-2.5 py-0.5 rounded-full"
                style={{ background: colors.bg, color: colors.text }}
              >
                Marca
              </span>
              {marca.categorias?.slice(0, 2).map(c => (
                <span key={c} className="inline-flex text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/15 text-white">
                  {c}
                </span>
              ))}
            </div>
            {marca.ubicacion && (
              <p className="text-white/50 text-sm">{marca.ubicacion}</p>
            )}
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
            <h2 className="text-base font-bold text-foreground mb-3">Sobre {marca.nombre}</h2>
            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {marca.descripcion ?? `${marca.nombre} colabora con creadores en Reachly. Aún no compartió una descripción pública.`}
            </p>
          </div>

          {marca.categorias && marca.categorias.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-base font-bold text-foreground mb-4">Categorías de interés</h2>
              <div className="flex flex-wrap gap-2">
                {marca.categorias.map(cat => {
                  const c = CATEGORIA_COLORS[cat] ?? { bg: 'var(--color-brand-50)', text: 'var(--color-brand-600)' }
                  return (
                    <span
                      key={cat}
                      className="inline-flex text-xs font-semibold px-3 py-1.5 rounded-full"
                      style={{ background: c.bg, color: c.text }}
                    >
                      {cat}
                    </span>
                  )
                })}
              </div>
            </div>
          )}

          {campanasMarca.length > 0 && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="text-base font-bold text-foreground mb-4">Campañas activas</h2>
              <div className="space-y-1">
                {campanasMarca.slice(0, 5).map(c => (
                  <Link
                    key={c.id}
                    href={`/campanas/${c.id}`}
                    className="flex items-center justify-between gap-3 py-3 px-3 -mx-3 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-foreground truncate">{c.titulo}</div>
                      <div className="text-xs text-muted-foreground">{c.categoria} · {c.presupuesto}</div>
                    </div>
                    <span className="text-brand-400 text-sm flex-shrink-0">→</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="bg-card border border-border rounded-2xl p-6">
            <h2 className="text-base font-bold text-foreground mb-4">Contacto</h2>
            <Link
              href="/campanas"
              className="block text-center w-full bg-brand-600 text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:bg-brand-500 transition-colors mb-3"
            >
              Ver campañas
            </Link>
            {marca.profile_id && (
              <Link
                href={`/mensajes?with=${marca.profile_id}`}
                className="block text-center w-full border border-border text-muted-foreground font-medium text-sm px-4 py-2.5 rounded-xl hover:border-brand-300 transition-colors"
              >
                Mensaje directo
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
