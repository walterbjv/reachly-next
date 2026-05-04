import { redirect } from 'next/navigation'

// TEMPORAL: redirige a dashboard porque /influencer/swipe (feed
// estilo Tinder) aún no existe. Cuando se construya el swipe
// (BACKLOG), cambiar este redirect a /influencer/swipe.
export default function InfluencerRoot() {
  redirect('/influencer/dashboard')
}
