'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { InfluencerCard } from '@/components/influencer/InfluencerCard'
import { useFavoritosStore } from '@/store/useFavoritosStore'
import { fetchInfluencers } from '@/lib/api'
import type { Influencer } from '@/types/influencer'

export default function MarcaFavoritosPage() {
  const { influencers: favInfIds } = useFavoritosStore()
  const [allInf, setAllInf] = useState<Influencer[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchInfluencers().then((infs) => {
      setAllInf(infs)
      setLoading(false)
    })
  }, [])

  const favInfs = allInf.filter((i) => favInfIds.includes(i.id))

  return (
    <div className="max-w-[1100px] mx-auto px-[5%] py-12">
      <h1 className="text-2xl font-bold text-foreground mb-1">Guardados</h1>
      <p className="text-muted-foreground text-sm mb-7">
        {favInfs.length} {favInfs.length === 1 ? 'influencer guardado' : 'influencers guardados'}
      </p>

      {loading ? (
        <div className="text-center py-16 text-muted-foreground text-sm">Cargando...</div>
      ) : favInfs.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {favInfs.map((inf, i) => (
            <InfluencerCard key={inf.id} influencer={inf} index={i} />
          ))}
        </div>
      )}
    </div>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-20">
      <div className="w-12 h-12 rounded-full bg-muted mx-auto mb-4" />
      <h3 className="text-base font-semibold text-foreground mb-2">Sin influencers guardados</h3>
      <p className="text-sm text-muted-foreground mb-6">Explora y guarda los que más te interesen.</p>
      <Link
        href="/"
        className="inline-block bg-brand-600 text-white font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-brand-500 transition-colors"
      >
        Explorar influencers
      </Link>
    </div>
  )
}
