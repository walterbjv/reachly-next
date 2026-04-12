import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Sobre nosotros — Reachly' }

const TEAM = [
  { nombre: 'Sofía Ramírez', rol: 'CEO & Co-fundadora', iniciales: 'SR' },
  { nombre: 'Lucas Mendoza', rol: 'CTO & Co-fundador', iniciales: 'LM' },
  { nombre: 'Valentina Torres', rol: 'Head of Growth', iniciales: 'VT' },
  { nombre: 'Matías Pérez', rol: 'Lead Designer', iniciales: 'MP' },
]

const VALUES = [
  { icon: '🤝', titulo: 'Autenticidad', desc: 'Creemos en conexiones reales entre marcas e influencers que comparten valores genuinos.' },
  { icon: '🚀', titulo: 'Innovación', desc: 'Usamos datos e inteligencia para hacer matchmaking más inteligente cada día.' },
  { icon: '🌍', titulo: 'LATAM First', desc: 'Construimos específicamente para el mercado latinoamericano, con su cultura y particularidades.' },
  { icon: '📊', titulo: 'Transparencia', desc: 'Métricas claras, precios justos y procesos honestos para todos.' },
]

export default function SobreNosotrosPage() {
  return (
    <div className="max-w-[1100px] mx-auto px-[5%] py-12">
      {/* Hero */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-foreground mb-4">La plataforma que conecta<br />el talento con las marcas</h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Reachly nació en 2023 con una misión clara: hacer que la colaboración entre influencers y marcas en LATAM sea simple, transparente y efectiva.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {[
          { valor: '10K+', label: 'Influencers activos' },
          { valor: '500+', label: 'Marcas registradas' },
          { valor: '2.4M', label: 'Alcance combinado' },
          { valor: '12', label: 'Países en LATAM' },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-[#4A1FA8]">{s.valor}</div>
            <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Historia */}
      <div className="bg-gradient-to-br from-[#4A1FA8] to-[#2E1270] rounded-2xl p-8 text-white mb-16">
        <h2 className="text-2xl font-bold mb-4">Nuestra historia</h2>
        <p className="text-white/80 leading-relaxed mb-4">
          Todo empezó cuando nuestra fundadora, Sofía, era gerente de marketing en una startup y pasaba semanas buscando influencers manualmente en Instagram. Cada campaña era un caos de DMs, hojas de cálculo y negociaciones interminables.
        </p>
        <p className="text-white/80 leading-relaxed">
          En 2023 decidimos que había una mejor forma. Reachly fue construido para eliminar la fricción y darle a ambos lados de la ecuación — influencers y marcas — las herramientas que necesitan para conectar de forma profesional.
        </p>
      </div>

      {/* Valores */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Nuestros valores</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {VALUES.map(v => (
            <div key={v.titulo} className="bg-card border border-border rounded-xl p-6">
              <div className="text-3xl mb-3">{v.icon}</div>
              <h3 className="font-bold text-foreground mb-2">{v.titulo}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Equipo */}
      <div className="mb-16">
        <h2 className="text-2xl font-bold text-foreground mb-8 text-center">El equipo</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {TEAM.map(m => (
            <div key={m.nombre} className="bg-card border border-border rounded-xl p-6 text-center">
              <div className="w-16 h-16 rounded-full mx-auto mb-4 overflow-hidden">
                <svg width="64" height="64" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="32" fill="#4A1FA8" />
                  <text x="32" y="32" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="20" fontWeight="700" fontFamily="sans-serif">{m.iniciales}</text>
                </svg>
              </div>
              <p className="font-bold text-foreground text-sm">{m.nombre}</p>
              <p className="text-xs text-muted-foreground mt-1">{m.rol}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center bg-card border border-border rounded-2xl p-10">
        <h2 className="text-xl font-bold text-foreground mb-3">¿Querés sumarte?</h2>
        <p className="text-muted-foreground text-sm mb-6">Somos influencer, marca o simplemente creés en lo que hacemos.</p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/registro" className="bg-[#4A1FA8] text-white font-semibold text-sm px-6 py-3 rounded-xl hover:bg-[#6C3BF5] transition-colors">
            Crear cuenta gratis
          </Link>
          <Link href="/careers" className="border border-border text-foreground font-medium text-sm px-6 py-3 rounded-xl hover:bg-accent transition-colors">
            Ver posiciones abiertas
          </Link>
        </div>
      </div>
    </div>
  )
}
