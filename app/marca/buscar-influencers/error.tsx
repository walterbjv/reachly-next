'use client'

interface Props {
  error: Error & { digest?: string }
  reset: () => void
}

export default function BuscarInfluencersError({ reset }: Props) {
  return (
    <div className="max-w-[1100px] mx-auto px-[5%] py-10">
      <div className="bg-card border border-border rounded-2xl p-10 text-center">
        <div className="text-sm text-foreground font-medium mb-1">
          No pudimos cargar la búsqueda en este momento.
        </div>
        <div className="text-xs text-muted-foreground mb-4">
          Es probable que sea temporal.
        </div>
        <button
          onClick={reset}
          className="inline-flex items-center text-sm font-semibold text-brand-600 dark:text-brand-300 hover:underline"
        >
          Reintentar
        </button>
      </div>
    </div>
  )
}
