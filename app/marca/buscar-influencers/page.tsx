import type { Metadata } from 'next'
import Link from 'next/link'
import { searchInfluencerProfiles } from '@/lib/api'
import { CATEGORIAS } from '@/types/influencer'
import { ProfileSearchCard } from '@/components/influencer/ProfileSearchCard'
import { SearchClient } from './SearchClient'

export const metadata: Metadata = { title: 'Buscar influencers — Reachly' }

interface PageProps {
  searchParams: Promise<{ q?: string; categoria?: string; ubicacion?: string }>
}

export default async function BuscarInfluencersPage({ searchParams }: PageProps) {
  const { q = '', categoria = '', ubicacion = '' } = await searchParams

  const profiles = await searchInfluencerProfiles({
    query: q || undefined,
    categoria: categoria || undefined,
    ubicacion: ubicacion || undefined,
  })

  const hasFilters = Boolean(q || categoria || ubicacion)

  return (
    <div className="max-w-[1100px] mx-auto px-[5%] py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">
          Buscar influencers
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Encuentra creadores reales registrados en Reachly.
        </p>
      </div>

      <SearchClient
        initialQuery={q}
        initialCategoria={categoria}
        initialUbicacion={ubicacion}
        categorias={CATEGORIAS}
      />

      {profiles.length > 0 ? (
        <>
          <div className="text-xs text-muted-foreground mb-4">
            {profiles.length} {profiles.length === 1 ? 'influencer encontrado' : 'influencers encontrados'}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profiles.map(p => (
              <ProfileSearchCard key={p.id} profile={p} />
            ))}
          </div>
        </>
      ) : hasFilters ? (
        <div className="bg-card border border-border rounded-2xl p-10 text-center">
          <div className="text-sm text-foreground font-medium mb-1">
            No encontramos influencers con esos filtros.
          </div>
          <div className="text-xs text-muted-foreground mb-4">
            Probá relajar los filtros o limpiar la búsqueda.
          </div>
          <Link
            href="/marca/buscar-influencers"
            className="inline-flex items-center text-sm font-semibold text-brand-600 dark:text-brand-300 hover:underline"
          >
            Limpiar filtros
          </Link>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl p-10 text-center">
          <div className="text-sm text-foreground font-medium mb-1">
            Aún no hay influencers registrados en Reachly.
          </div>
          <div className="text-xs text-muted-foreground">
            En cuanto se registren, vas a poder encontrarlos acá.
          </div>
        </div>
      )}
    </div>
  )
}
