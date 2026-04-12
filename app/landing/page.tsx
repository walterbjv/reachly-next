import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Bienvenido a Reachly',
  description: 'La plataforma #1 de influencer marketing en LATAM. Conecta marcas con creadores.',
}

const stats = [
  { num: '12.4K', label: 'Influencers' },
  { num: '3.2K', label: 'Marcas' },
  { num: '89K', label: 'Matches' },
  { num: '98%', label: 'Satisfacción' },
]

const features = [
  {
    icon: '🔍',
    title: 'Explorador inteligente',
    desc: 'Filtrá por categoría, seguidores, engagement y más. Encontrá el influencer perfecto en segundos.',
  },
  {
    icon: '🤝',
    title: 'Match automático',
    desc: 'Nuestro algoritmo conecta marcas con creadores basándose en audiencia, valores y objetivos.',
  },
  {
    icon: '📊',
    title: 'Analytics en tiempo real',
    desc: 'Métricas detalladas de campañas, engagement y ROI desde tu dashboard.',
  },
  {
    icon: '💬',
    title: 'Mensajes integrados',
    desc: 'Coordiná campañas directamente desde la plataforma. Sin emails, sin intermediarios.',
  },
  {
    icon: '🏆',
    title: 'Ranking de tendencias',
    desc: 'Descubrí quiénes son los influencers que más crecen cada semana.',
  },
  {
    icon: '🛡️',
    title: 'Contratos seguros',
    desc: 'Acuerdos transparentes con pagos protegidos para ambas partes.',
  },
]

const testimonials = [
  {
    quote: 'Reachly nos ayudó a triplicar el ROI de nuestras campañas de influencers en solo 3 meses.',
    name: 'Ana Martínez',
    role: 'Marketing Manager, Nike Chile',
    initials: 'AM',
    color: '#4A1FA8',
  },
  {
    quote: 'Encontré 5 contratos nuevos en mi primer mes. La plataforma es increíblemente fácil de usar.',
    name: 'Lucas Fernández',
    role: 'Influencer de Tech · 180K seguidores',
    initials: 'LF',
    color: '#185FA5',
  },
  {
    quote: 'El sistema de match nos ahorró semanas de búsqueda manual. Altamente recomendado.',
    name: 'Valeria Torres',
    role: 'Directora de Marca, Adidas LATAM',
    initials: 'VT',
    color: '#1D9E75',
  },
]

export default function LandingPage() {
  return (
    <div className="bg-background">
      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-br from-[#4A1FA8] to-[#2E1270] overflow-hidden text-center px-[5%] py-20 md:py-28">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse at 65% 40%, rgba(123,82,212,.3) 0%, transparent 60%)' }} />
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-block bg-white/10 border border-white/18 rounded-full px-5 py-1.5 text-xs text-[#C4AEFA] mb-5 tracking-wide">
            🚀 Plataforma #1 de influencer marketing en LATAM
          </div>
          <h1 className="text-white text-4xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-4">
            Conecta marcas<br />con creadores
          </h1>
          <p className="text-white/60 text-lg max-w-lg mx-auto mb-8 leading-relaxed">
            La plataforma donde influencers y empresas encuentran su match perfecto para campañas que impactan.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/registro"
              className="bg-white text-[#4A1FA8] font-bold text-sm px-8 py-3.5 rounded-xl hover:bg-[#F0E8FF] transition-colors shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-150"
            >
              Soy influencer
            </Link>
            <Link
              href="/registro"
              className="text-white border border-white/30 font-medium text-sm px-8 py-3.5 rounded-xl hover:border-white/65 hover:bg-white/8 transition-all duration-150"
            >
              Soy una marca
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="bg-[#1A0A3D] py-8">
        <div className="max-w-[1100px] mx-auto px-[5%] flex justify-center flex-wrap gap-8 md:gap-0">
          {stats.map((s, i) => (
            <div key={s.label} className={`text-center px-10 md:px-14 ${i > 0 ? 'border-l border-white/9' : ''}`}>
              <div className="text-white text-3xl font-bold tracking-tight">{s.num}</div>
              <div className="text-white/40 text-xs uppercase tracking-widest mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section className="max-w-[1100px] mx-auto px-[5%] py-20">
        <div className="text-center mb-14">
          <div className="text-xs font-semibold text-[#7B52D4] uppercase tracking-widest mb-3">Por qué Reachly</div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">Todo lo que necesitás en un lugar</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="bg-card border border-border rounded-2xl p-7 hover:border-[#B89EF0] hover:shadow-[0_6px_24px_rgba(74,31,168,.09)] hover:-translate-y-0.5 transition-all duration-200 animate-fade-up"
              style={{ animationDelay: `${i * 0.07}s` }}
            >
              <div className="w-11 h-11 rounded-xl bg-[#F0E8FF] dark:bg-[#2A1F45] flex items-center justify-center text-xl mb-4">
                {f.icon}
              </div>
              <h3 className="text-base font-bold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="bg-card border-y border-border py-20">
        <div className="max-w-[1100px] mx-auto px-[5%]">
          <div className="text-center mb-12">
            <div className="text-xs font-semibold text-[#7B52D4] uppercase tracking-widest mb-3">Testimonios</div>
            <h2 className="text-3xl font-bold text-foreground tracking-tight">Lo que dicen nuestros usuarios</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className="bg-background border border-border rounded-2xl p-7 animate-fade-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <p className="text-sm text-foreground leading-relaxed mb-5 italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex-shrink-0 overflow-hidden">
                    <svg width="40" height="40" viewBox="0 0 40 40">
                      <circle cx="20" cy="20" r="20" fill={t.color} />
                      <text x="20" y="20" textAnchor="middle" dominantBaseline="central" fill="white" fontSize="14" fontWeight="600" fontFamily="sans-serif">{t.initials}</text>
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-gradient-to-br from-[#4A1FA8] to-[#2E1270] text-center px-[5%] py-20">
        <h2 className="text-white text-3xl md:text-4xl font-bold mb-4 tracking-tight">Empezá hoy, gratis</h2>
        <p className="text-white/60 text-base mb-8 max-w-md mx-auto">
          Más de 12.000 influencers y 3.000 marcas ya confían en Reachly.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/registro"
            className="bg-white text-[#4A1FA8] font-bold text-sm px-8 py-3.5 rounded-xl hover:bg-[#F0E8FF] transition-colors shadow-lg"
          >
            Crear cuenta gratis
          </Link>
          <Link
            href="/"
            className="text-white border border-white/30 font-medium text-sm px-8 py-3.5 rounded-xl hover:border-white/65 hover:bg-white/8 transition-all"
          >
            Explorar influencers →
          </Link>
        </div>
      </section>
    </div>
  )
}
