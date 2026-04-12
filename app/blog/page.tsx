import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Blog — Reachly' }

const POSTS = [
  {
    id: 1,
    titulo: 'Cómo elegir el influencer perfecto para tu campaña',
    extracto: 'El engagement rate importa más que los seguidores. Te explicamos por qué y cómo calcularlo correctamente.',
    categoria: 'Guías',
    fecha: '8 Apr 2025',
    minutos: 5,
    emoji: '🎯',
  },
  {
    id: 2,
    titulo: 'Tendencias del marketing de influencers en LATAM 2025',
    extracto: 'TikTok sigue creciendo, micro-influencers son los reyes, y el contenido auténtico gana. El reporte completo.',
    categoria: 'Tendencias',
    fecha: '2 Apr 2025',
    minutos: 8,
    emoji: '📊',
  },
  {
    id: 3,
    titulo: '5 errores que cometen las marcas al hacer influencer marketing',
    extracto: 'Desde no definir KPIs hasta pagar por seguidores falsos. Evitá estos errores comunes con nuestra guía.',
    categoria: 'Consejos',
    fecha: '28 Mar 2025',
    minutos: 4,
    emoji: '⚠️',
  },
  {
    id: 4,
    titulo: 'Micro vs macro influencers: ¿cuál es mejor para tu marca?',
    extracto: 'Analizamos datos de 500 campañas para responder esta pregunta de una vez por todas.',
    categoria: 'Análisis',
    fecha: '20 Mar 2025',
    minutos: 6,
    emoji: '🔬',
  },
  {
    id: 5,
    titulo: 'Cómo negociar tu primer contrato de marca siendo influencer',
    extracto: 'Desde el brief hasta el pago. Todo lo que necesitás saber para no dejar plata en la mesa.',
    categoria: 'Para influencers',
    fecha: '15 Mar 2025',
    minutos: 7,
    emoji: '💼',
  },
  {
    id: 6,
    titulo: 'El ROI real del influencer marketing en e-commerce',
    extracto: 'Casos de estudio de marcas argentinas que multiplicaron sus ventas con las campañas correctas.',
    categoria: 'Casos de éxito',
    fecha: '10 Mar 2025',
    minutos: 9,
    emoji: '💰',
  },
]

const CATEGORIAS = ['Todas', 'Guías', 'Tendencias', 'Consejos', 'Análisis', 'Para influencers', 'Casos de éxito']

export default function BlogPage() {
  return (
    <div className="max-w-[1100px] mx-auto px-[5%] py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-foreground mb-2">Blog de Reachly</h1>
        <p className="text-muted-foreground">Recursos, tendencias y guías para influencers y marcas.</p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIAS.map(c => (
          <span key={c} className={`text-sm px-4 py-1.5 rounded-full font-medium cursor-pointer transition-colors ${c === 'Todas' ? 'bg-[#4A1FA8] text-white' : 'bg-card border border-border text-muted-foreground hover:border-[#C4AEFA] hover:text-foreground'}`}>
            {c}
          </span>
        ))}
      </div>

      {/* Featured post */}
      <div className="bg-gradient-to-br from-[#4A1FA8] to-[#2E1270] rounded-2xl p-8 text-white mb-8">
        <span className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">{POSTS[0].categoria}</span>
        <h2 className="text-2xl font-bold mt-4 mb-3">{POSTS[0].titulo}</h2>
        <p className="text-white/70 mb-5">{POSTS[0].extracto}</p>
        <div className="flex items-center justify-between">
          <span className="text-white/60 text-sm">{POSTS[0].fecha} · {POSTS[0].minutos} min lectura</span>
          <Link href={`/blog/${POSTS[0].id}`} className="bg-white text-[#4A1FA8] font-semibold text-sm px-5 py-2 rounded-xl hover:bg-[#F0E8FF] transition-colors">
            Leer artículo
          </Link>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {POSTS.slice(1).map(post => (
          <Link key={post.id} href={`/blog/${post.id}`} className="bg-card border border-border rounded-xl p-6 hover:border-[#B89EF0] transition-colors group">
            <div className="text-3xl mb-4">{post.emoji}</div>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#7B52D4]">{post.categoria}</span>
            <h3 className="text-base font-bold text-foreground mt-2 mb-2 group-hover:text-[#4A1FA8] dark:group-hover:text-[#B89EF0] transition-colors leading-snug">{post.titulo}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{post.extracto}</p>
            <p className="text-xs text-muted-foreground">{post.fecha} · {post.minutos} min</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
