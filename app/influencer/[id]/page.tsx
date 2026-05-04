import { permanentRedirect } from 'next/navigation'

export default async function InfluencerProfileLegacy({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  permanentRedirect(`/u/${id}`)
}
