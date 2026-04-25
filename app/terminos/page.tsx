import type { Metadata } from 'next'
import { LegalAccordion, type LegalItem } from '@/app/_components/LegalAccordion'

export const metadata: Metadata = { title: 'Términos de uso — Reachly' }

const ITEMS: LegalItem[] = [
  {
    q: '1. Aceptación de los términos',
    a: (
      <p>Al acceder y usar Reachly, aceptas quedar vinculado por estos Términos de Uso. Si no estás de acuerdo con alguna parte de estos términos, no puedes usar nuestros servicios.</p>
    ),
  },
  {
    q: '2. Descripción del servicio',
    a: (
      <p>Reachly es una plataforma que conecta influencers con marcas para facilitar colaboraciones comerciales. Actuamos como intermediarios y no somos parte de los contratos entre influencers y marcas.</p>
    ),
  },
  {
    q: '3. Cuentas de usuario',
    a: (
      <p>Para usar ciertas funciones, debes crear una cuenta. Eres responsable de mantener la confidencialidad de tu contraseña y de toda actividad que ocurra en tu cuenta. Debes notificarnos inmediatamente ante cualquier uso no autorizado.</p>
    ),
  },
  {
    q: '4. Contenido del usuario',
    a: (
      <p>Al publicar contenido en Reachly, otorgas una licencia no exclusiva, mundial, libre de regalías para usar, reproducir y distribuir ese contenido en conexión con el servicio. Eres responsable de que el contenido que publicas sea legal y no infrinja derechos de terceros.</p>
    ),
  },
  {
    q: '5. Conducta prohibida',
    a: (
      <ul className="list-disc pl-5 space-y-1">
        <li>Publicar información falsa o engañosa</li>
        <li>Hacerse pasar por otra persona o entidad</li>
        <li>Usar la plataforma para actividades ilegales</li>
        <li>Intentar acceder sin autorización a otros sistemas</li>
        <li>Publicar contenido de spam o publicidad no solicitada</li>
      </ul>
    ),
  },
  {
    q: '6. Limitación de responsabilidad',
    a: (
      <p>Reachly no será responsable de daños indirectos, incidentales, especiales, consecuentes o punitivos que resulten del uso o la imposibilidad de usar el servicio.</p>
    ),
  },
  {
    q: '7. Cambios en los términos',
    a: (
      <p>Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios entran en vigor al publicarlos en esta página. El uso continuado del servicio implica la aceptación de los nuevos términos.</p>
    ),
  },
  {
    q: '8. Contacto',
    a: (
      <p>Para consultas sobre estos términos: <span className="text-brand-400">legal@reachly.app</span></p>
    ),
  },
]

export default function TerminosPage() {
  return (
    <LegalAccordion
      eyebrow="Legal"
      title="Términos de uso"
      intro="Las reglas que rigen el uso de Reachly. Léelos antes de empezar a usar la plataforma."
      lastUpdated="1 de enero de 2025"
      items={ITEMS}
    />
  )
}
