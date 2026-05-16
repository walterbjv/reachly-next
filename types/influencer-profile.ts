export interface InfluencerProfile {
  id: string
  nombre: string
  categorias: string[]
  ubicacion?: string
  avatar_url?: string
  redes?: {
    instagram?: string
    tiktok?: string
    youtube?: string
    twitter?: string
  }
}
