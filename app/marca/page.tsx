import { redirect } from 'next/navigation'

// Punto de entrada al área de marca. Hoy redirige al dashboard.
// Si en el futuro construimos una "home" distinta para marca,
// cambiar el destino.
export default function MarcaRoot() {
  redirect('/marca/dashboard')
}
