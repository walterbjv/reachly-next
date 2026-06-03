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
  const categoriasVisibles = profile.categorias.slice(0, 2)
  const excedente = profile.categorias.length - 2

  return (
    <div className="bg-card border border-border rounded-[18px] p-[22px]">
      <div className="flex items-start gap-3 mb-3">
        <InfluencerAvatar
          iniciales={getIniciales(profile.nombre)}
          categoria={profile.categorias[0]}
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

      {categoriasVisibles.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {categoriasVisibles.map((cat) => {
            const c = CATEGORIA_COLORS[cat] ?? { bg: 'var(--color-brand-50)', text: 'var(--color-brand-600)' }
            return (
              <span
                key={cat}
                className="inline-flex text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                style={{ background: c.bg, color: c.text }}
              >
                {cat}
              </span>
            )
          })}
          {excedente > 0 && (
            <span className="inline-flex items-center text-[11px] font-medium text-muted-foreground bg-accent px-2.5 py-0.5 rounded-full">
              +{excedente} más
            </span>
          )}
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
