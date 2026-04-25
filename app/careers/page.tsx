import type { Metadata } from 'next'
import { CareersClient } from './CareersClient'

export const metadata: Metadata = { title: 'Careers — Reachly' }

const JOBS = [
  { titulo: 'Senior Full-Stack Engineer', area: 'Tecnología', tipo: 'Full-time', lugar: 'Remoto LATAM', descripcion: 'Trabaja en el core de la plataforma con Next.js, Node.js y PostgreSQL.' },
  { titulo: 'Product Designer', area: 'Diseño', tipo: 'Full-time', lugar: 'Santiago / Remoto', descripcion: 'Diseña experiencias para miles de influencers y marcas en toda LATAM.' },
  { titulo: 'Growth Marketing Manager', area: 'Marketing', tipo: 'Full-time', lugar: 'Remoto LATAM', descripcion: 'Lidera la estrategia de adquisición y retención en múltiples mercados.' },
  { titulo: 'Customer Success (Influencers)', area: 'Operaciones', tipo: 'Full-time', lugar: 'Santiago', descripcion: 'Ayuda a influencers a sacar el máximo provecho de Reachly.' },
  { titulo: 'Data Analyst', area: 'Datos', tipo: 'Part-time', lugar: 'Remoto', descripcion: 'Transforma datos de campañas en insights accionables para el equipo.' },
]

const PERKS = [
  { titulo: '100% remoto', desc: 'Trabaja desde donde quieras en LATAM.' },
  { titulo: 'Budget de aprendizaje', desc: '$500 USD/año para cursos y libros.' },
  { titulo: 'Seguro médico', desc: 'Cobertura médica para ti y tu familia.' },
  { titulo: 'Equipamiento', desc: 'Laptop + setup para trabajar cómodo.' },
  { titulo: 'Horario flexible', desc: 'Resultados sobre horas en pantalla.' },
  { titulo: 'Equity', desc: 'Opciones de participación en la empresa.' },
]

export default function CareersPage() {
  return <CareersClient jobs={JOBS} perks={PERKS} />
}
