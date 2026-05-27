'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  initialQuery: string
  initialCategoria: string
  initialUbicacion: string
  categorias: readonly string[]
}

export function SearchClient({
  initialQuery,
  initialCategoria,
  initialUbicacion,
  categorias,
}: Props) {
  const router = useRouter()
  const [query, setQuery] = useState(initialQuery)
  const [categoria, setCategoria] = useState(initialCategoria)
  const [ubicacion, setUbicacion] = useState(initialUbicacion)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    const timeout = setTimeout(() => {
      const params = new URLSearchParams()
      if (query) params.set('q', query)
      if (categoria) params.set('categoria', categoria)
      if (ubicacion) params.set('ubicacion', ubicacion)
      const qs = params.toString()
      router.replace(qs ? `/marca/buscar-influencers?${qs}` : '/marca/buscar-influencers')
    }, 300)
    return () => clearTimeout(timeout)
  }, [query, categoria, ubicacion, router])

  const hasFilters = Boolean(query || categoria || ubicacion)

  function clearAll() {
    setQuery('')
    setCategoria('')
    setUbicacion('')
  }

  return (
    <div className="bg-card border border-border rounded-2xl p-5 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar por nombre"
          className="w-full text-sm px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand-400"
        />
        <select
          value={categoria}
          onChange={e => setCategoria(e.target.value)}
          className="w-full text-sm px-4 py-2.5 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:border-brand-400"
        >
          <option value="">Todas las categorías</option>
          {categorias.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <input
          type="text"
          value={ubicacion}
          onChange={e => setUbicacion(e.target.value)}
          placeholder="Ubicación"
          className="w-full text-sm px-4 py-2.5 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-brand-400"
        />
      </div>
      {hasFilters && (
        <div className="mt-3 flex justify-end">
          <button
            onClick={clearAll}
            className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      )}
    </div>
  )
}
