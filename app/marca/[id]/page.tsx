import { permanentRedirect } from 'next/navigation'

export default async function MarcaProfileLegacy({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  permanentRedirect(`/m/${id}`)
}
