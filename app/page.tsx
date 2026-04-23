import type { Metadata } from 'next'
import { ExplorerClient } from './ExplorerClient'
import { fetchInfluencers } from '@/lib/api'

export const metadata: Metadata = {
  title: 'Explorar influencers',
  description: 'Descubre los mejores influencers de LATAM. Filtra por categoría, seguidores y engagement.',
}

export default async function HomePage() {
  const influencers = await fetchInfluencers()
  return <ExplorerClient initialInfluencers={influencers} />
}
