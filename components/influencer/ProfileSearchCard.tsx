import { InfluencerAvatar } from '@/components/ui/InfluencerAvatar'
import { CATEGORIA_COLORS } from '@/types/influencer'
import type { InfluencerProfile } from '@/types/influencer-profile'

interface Props {
  profile: InfluencerProfile
}

function getIniciales(nombre: string): string {
  return nombre.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase() || '?'
}

export function ProfileSearchCard({ profile }: Props) {
  const categoria = profile.categorias[0]
  const colors = categoria
    ? CATEGORIA_COLORS[categoria] ?? { bg: 'var(--color-brand-50)', text: 'var(--color-brand-600)' }
    : null

  return (
    <div className="bg-card border border-border rounded-[18px] p-[22px]">
      <div className="flex items-start gap-3 mb-3">
        <InfluencerAvatar
          iniciales={getIniciales(profile.nombre)}
          categoria={categoria}
          size="md"
        />
        <div className="min-w-0 flex-1">
          <div className="text-[15px] font-bold text-card-foreground tracking-tight truncate">
            {profile.nombre}
          </div>
          {profile.ubicacion && (
            <div className="text-xs text-muted-foreground mt-0.5 truncate">
              {profile.ubicacion}
            </div>
          )}
        </div>
      </div>

      {categoria && colors && (
        <div className="mb-3">
          <span
            className="inline-flex text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
            style={{ background: colors.bg, color: colors.text }}
          >
            {categoria}
          </span>
        </div>
      )}

      <div className="pt-3 border-t border-border">
        <span className="inline-flex items-center text-[11px] font-medium text-muted-foreground bg-accent px-2.5 py-1 rounded-full">
          Perfil en construcción
        </span>
      </div>
    </div>
  )
}
