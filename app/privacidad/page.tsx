import type { Metadata } from 'next'
import { LegalAccordion, type LegalItem } from '@/app/_components/LegalAccordion'

export const metadata: Metadata = { title: 'Política de privacidad — Reachly' }

const ITEMS: LegalItem[] = [
  {
    q: '1. Información que recopilamos',
    a: (
      <>
        <p>Recopilamos información que nos proporcionas directamente:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Datos de registro (nombre, email, tipo de cuenta)</li>
          <li>Información de perfil (bio, ubicación, redes sociales)</li>
          <li>Datos de uso de la plataforma</li>
          <li>Comunicaciones a través de nuestra plataforma</li>
        </ul>
      </>
    ),
  },
  {
    q: '2. Cómo usamos tu información',
    a: (
      <ul className="list-disc pl-5 space-y-1">
        <li>Para proveer y mejorar nuestros servicios</li>
        <li>Para facilitar conexiones entre influencers y marcas</li>
        <li>Para enviarte notificaciones relevantes (con tu consentimiento)</li>
        <li>Para análisis internos y mejora del producto</li>
        <li>Para cumplir obligaciones legales</li>
      </ul>
    ),
  },
  {
    q: '3. Compartir información',
    a: (
      <>
        <p>No vendemos tu información personal. La compartimos solo con:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Otras partes del acuerdo de colaboración (con tu consentimiento)</li>
          <li>Proveedores de servicios que nos ayudan a operar la plataforma</li>
          <li>Autoridades cuando sea requerido por ley</li>
        </ul>
      </>
    ),
  },
  {
    q: '4. Tus derechos',
    a: (
      <>
        <p>Tienes derecho a:</p>
        <ul className="list-disc pl-5 space-y-1">
          <li>Acceder a tus datos personales</li>
          <li>Corregir información incorrecta</li>
          <li>Solicitar la eliminación de tus datos</li>
          <li>Oponerte al procesamiento de tus datos</li>
          <li>Portabilidad de datos</li>
        </ul>
      </>
    ),
  },
  {
    q: '5. Seguridad',
    a: (
      <p>Implementamos medidas de seguridad técnicas y organizacionales para proteger tu información contra acceso no autorizado, pérdida o divulgación.</p>
    ),
  },
  {
    q: '6. Cookies',
    a: (
      <p>Usamos cookies para mejorar tu experiencia. Puedes gestionar tus preferencias en nuestra <span className="text-brand-400">Política de cookies</span>.</p>
    ),
  },
  {
    q: '7. Contacto',
    a: (
      <p>Para ejercer tus derechos o consultas de privacidad: <span className="text-brand-400">privacidad@reachly.app</span></p>
    ),
  },
]

export default function PrivacidadPage() {
  return (
    <LegalAccordion
      eyebrow="Privacidad"
      title="Política de privacidad"
      intro="Cómo recopilamos, usamos y protegemos tu información en Reachly. Si tienes dudas, escríbenos."
      lastUpdated="1 de enero de 2025"
      items={ITEMS}
    />
  )
}
