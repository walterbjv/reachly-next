import { createClient } from '@supabase/supabase-js'
import type { Influencer } from '@/types/influencer'
import type { Campana } from '@/types/campana'
import type { Marca } from '@/types/marca'
import { CATEGORIAS, CATEGORIA_COLORS } from '@/types/influencer'
import { MOCK_INFLUENCERS, MOCK_CAMPANAS, MOCK_MARCAS } from '@/lib/mocks'

function logFallback(scope: string) {
  if (process.env.NODE_ENV !== 'production') {
    console.log(`[mocks] ${scope}: Supabase empty, using fallback data`)
  }
}

// Cliente público (anon key) — funciona server y client side para datos públicos
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function getIniciales(nombre: string): string {
  return nombre.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase() || '?'
}

function getEstado(id: number, engagement: number): Influencer['estado'] {
  if (engagement >= 6) return 'top'
  if (id % 2 === 0) return 'en-campaña'
  return 'disponible'
}

function mapInfluencer(row: any, profile?: any): Influencer {
  const cats: string[] = profile?.categorias ?? []
  const categoria = cats[0] ?? 'Lifestyle'
  const engagement = parseFloat((row.engagement_rate ?? 0).toFixed(1))
  return {
    id: row.id,
    nombre: row.full_name ?? 'Sin nombre',
    categoria,
    seguidores: row.followers_count ?? 0,
    engagement,
    iniciales: getIniciales(row.full_name ?? ''),
    estado: getEstado(row.id, engagement),
    bio: row.bio ?? undefined,
    ubicacion: row.location ?? undefined,
    avatar_url: row.avatar_url ?? undefined,
    profile_id: row.profile_id,
    redes: profile?.redes ?? undefined,
  }
}

export async function fetchInfluencers(): Promise<Influencer[]> {
  const { data, error } = await supabase
    .from('influencers')
    .select('id, full_name, bio, location, followers_count, engagement_rate, avatar_url, profile_id')
    .order('followers_count', { ascending: false })

  if (error || !data || data.length === 0) {
    logFallback('fetchInfluencers')
    return MOCK_INFLUENCERS
  }

  // Fetch profiles separately to avoid FK join issues
  const profileIds = data.map((r: any) => r.profile_id).filter(Boolean)
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, categorias, redes')
    .in('id', profileIds)

  const profileMap = new Map((profiles ?? []).map((p: any) => [p.id, p]))

  return data.map((row: any) => mapInfluencer(row, profileMap.get(row.profile_id)))
}

export async function fetchInfluencer(id: number): Promise<Influencer | null> {
  const { data, error } = await supabase
    .from('influencers')
    .select('id, full_name, bio, location, followers_count, engagement_rate, avatar_url, profile_id')
    .eq('id', id)
    .single()

  if (error || !data) {
    const mock = MOCK_INFLUENCERS.find(i => i.id === id)
    if (mock) logFallback(`fetchInfluencer(${id})`)
    return mock ?? null
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, categorias, redes')
    .eq('id', (data as any).profile_id)
    .single()

  return mapInfluencer(data, profile)
}

function mapCampana(row: any): Campana {
  const marca = row.brands?.profiles?.nombre ?? row.brands?.company_name ?? 'Marca'
  const categoria = row.campaign_categories?.name ?? 'General'
  return {
    id: row.id,
    marca,
    titulo: row.title ?? '',
    descripcion: row.description ?? '',
    categoria,
    presupuesto: row.budget_range ?? 'A convenir',
    iniciales: marca.split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase(),
    estado: (row.status as 'activa' | 'cerrada' | 'borrador') ?? 'activa',
    seguidoresMin: row.min_followers ?? undefined,
    brandId: row.brands?.id ?? undefined,
  }
}

export async function fetchCampanas(): Promise<Campana[]> {
  const { data, error } = await supabase
    .from('campaigns')
    .select(`
      id, title, description, budget_range, status, min_followers,
      brands(id, company_name, profiles(nombre)),
      campaign_categories(name)
    `)
    .order('created_at', { ascending: false })

  if (error || !data || data.length === 0) {
    logFallback('fetchCampanas')
    return MOCK_CAMPANAS
  }
  return data.map(mapCampana)
}

export async function fetchCampana(id: number): Promise<Campana | null> {
  const { data, error } = await supabase
    .from('campaigns')
    .select(`
      id, title, description, budget_range, status, min_followers,
      brands(id, company_name, profiles(nombre)),
      campaign_categories(name)
    `)
    .eq('id', id)
    .single()

  if (error || !data) {
    const mock = MOCK_CAMPANAS.find(c => c.id === id)
    if (mock) logFallback(`fetchCampana(${id})`)
    return mock ?? null
  }
  return mapCampana(data)
}

function mapMarca(row: any, profile?: any): Marca {
  const nombre = profile?.nombre ?? row.company_name ?? 'Marca'
  return {
    id: row.id,
    nombre,
    descripcion: row.description ?? undefined,
    ubicacion: profile?.ubicacion ?? undefined,
    iniciales: nombre.split(' ').slice(0, 2).map((p: string) => p[0]).join('').toUpperCase() || '?',
    categorias: profile?.categorias ?? undefined,
    profile_id: row.profile_id,
  }
}

export async function fetchMarcas(): Promise<Marca[]> {
  const { data, error } = await supabase
    .from('brands')
    .select('id, profile_id, company_name, description')
    .order('id', { ascending: false })

  if (error || !data || data.length === 0) {
    logFallback('fetchMarcas')
    return MOCK_MARCAS
  }

  const profileIds = data.map((r: any) => r.profile_id).filter(Boolean)
  const { data: profiles } = await supabase
    .from('profiles')
    .select('id, nombre, ubicacion, categorias')
    .in('id', profileIds)

  const profileMap = new Map((profiles ?? []).map((p: any) => [p.id, p]))
  return data.map((row: any) => mapMarca(row, profileMap.get(row.profile_id)))
}

export async function fetchMarca(id: number): Promise<Marca | null> {
  const { data, error } = await supabase
    .from('brands')
    .select('id, profile_id, company_name, description')
    .eq('id', id)
    .single()

  if (error || !data) {
    const mock = MOCK_MARCAS.find(m => m.id === id)
    if (mock) logFallback(`fetchMarca(${id})`)
    return mock ?? null
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, nombre, ubicacion, categorias')
    .eq('id', (data as any).profile_id)
    .single()

  return mapMarca(data, profile)
}

export { CATEGORIA_COLORS }
