'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/useUserStore'
import { cn } from '@/lib/utils'
import { supabase } from '@/lib/supabase'

type Tipo = 'influencer' | 'marca'
type Step = 1 | 2 | 3

const TIPOS = [
  {
    id: 'influencer' as Tipo,
    title: 'Soy influencer',
    desc: 'Quiero conectar con marcas y conseguir campañas pagas.',
  },
  {
    id: 'marca' as Tipo,
    title: 'Soy una marca',
    desc: 'Quiero encontrar creadores para mis campañas de marketing.',
  },
]

export default function RegistroPage() {
  const router = useRouter()
  const { setUser } = useUserStore()
  const [step, setStep] = useState<Step>(1)
  const [tipo, setTipo] = useState<Tipo | null>(null)
  const [form, setForm] = useState({ nombre: '', email: '', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState('')

  function validate() {
    const e: Record<string, string> = {}
    if (!form.nombre.trim()) e.nombre = 'El nombre es requerido'
    if (!form.email.trim()) e.email = 'El email es requerido'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email inválido'
    if (!form.password) e.password = 'La contraseña es requerida'
    else if (form.password.length < 8) e.password = 'Mínimo 8 caracteres'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  async function handleSubmit() {
    if (!validate()) return
    setLoading(true)
    setServerError('')

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          nombre: form.nombre,
          tipo: tipo,
        },
      },
    })

    setLoading(false)

    if (error) {
      setServerError(error.message)
      return
    }

    setUser({
      nombre: form.nombre,
      email: form.email,
      tipo: tipo!,
    })

    // Si hay sesión activa (sin confirmación de email), ir al onboarding
    if (data.session) {
      router.push('/onboarding')
      return
    }

    // Si requiere confirmación de email, mostrar pantalla de éxito
    setStep(3)
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-5 py-12">
      <div className="w-full max-w-[480px]">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {[1, 2, 3].map(s => (
            <div key={s} className={cn(
              'w-2 h-2 rounded-full transition-all',
              step === s ? 'bg-brand-600 w-6' : step > s ? 'bg-brand-600' : 'bg-border'
            )} />
          ))}
        </div>

        <div className="bg-card border border-border rounded-2xl p-8">
          {/* Step 1: Type selection */}
          {step === 1 && (
            <div className="animate-fade-up">
              <h1 className="text-2xl font-bold text-foreground mb-2">Crear cuenta</h1>
              <p className="text-muted-foreground text-sm mb-7">¿Cómo quieres usar Reachly?</p>
              <div className="space-y-3 mb-8">
                {TIPOS.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setTipo(t.id)}
                    className={cn(
                      'w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all duration-150',
                      tipo === t.id
                        ? 'border-brand-600 bg-brand-50 dark:bg-brand-900'
                        : 'border-border hover:border-brand-300 hover:bg-accent'
                    )}
                  >
                    <div>
                      <div className="text-sm font-semibold text-foreground">{t.title}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{t.desc}</div>
                    </div>
                  </button>
                ))}
              </div>
              <button
                onClick={() => tipo && setStep(2)}
                disabled={!tipo}
                className="w-full bg-brand-600 text-white font-semibold text-sm py-3 rounded-xl hover:bg-brand-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continuar →
              </button>
            </div>
          )}

          {/* Step 2: Form */}
          {step === 2 && (
            <div className="animate-fade-up">
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {tipo === 'influencer' ? 'Crea tu perfil' : 'Perfil de tu marca'}
              </h1>
              <p className="text-muted-foreground text-sm mb-5">
                {tipo === 'influencer' ? 'Completa tus datos para conectar con marcas.' : 'Completa los datos de tu empresa.'}
              </p>

              <button
                type="button"
                onClick={handleGoogle}
                className="w-full flex items-center justify-center gap-3 border border-border rounded-xl py-3 text-sm font-medium text-foreground hover:bg-accent transition-colors mb-4"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
                Continuar con Google
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground">o con email</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <div className="space-y-4 mb-7">
                {[
                  { id: 'nombre', label: tipo === 'influencer' ? 'Nombre completo' : 'Nombre de la marca', type: 'text', placeholder: tipo === 'influencer' ? 'Tu nombre' : 'Nombre de tu empresa' },
                  { id: 'email', label: 'Email', type: 'email', placeholder: 'tu@email.com' },
                  { id: 'password', label: 'Contraseña', type: 'password', placeholder: 'Mínimo 8 caracteres' },
                ].map(f => (
                  <div key={f.id}>
                    <label className="text-xs font-semibold text-foreground block mb-1.5">{f.label}</label>
                    <input
                      type={f.type}
                      placeholder={f.placeholder}
                      value={form[f.id as keyof typeof form]}
                      onChange={e => setForm(prev => ({ ...prev, [f.id]: e.target.value }))}
                      className={cn(
                        'w-full px-4 py-3 rounded-xl border text-sm bg-background text-foreground placeholder:text-muted-foreground outline-none transition-all',
                        errors[f.id] ? 'border-red-400 focus:border-red-400' : 'border-border focus:border-brand-400 focus:ring-2 focus:ring-brand-400/10'
                      )}
                    />
                    {errors[f.id] && <p className="text-xs text-red-500 mt-1">{errors[f.id]}</p>}
                  </div>
                ))}
              </div>
              {serverError && (
                <p className="text-xs text-red-500 mb-4 text-center">{serverError}</p>
              )}
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="px-5 py-3 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-xl hover:bg-accent">
                  Atrás
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-brand-600 text-white font-semibold text-sm py-3 rounded-xl hover:bg-brand-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmar email */}
          {step === 3 && (
            <div className="animate-fade-up text-center py-4">
              <div className="w-16 h-16 rounded-full bg-brand-50 dark:bg-brand-900 flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" /></svg>
              </div>
              <h2 className="text-xl font-bold text-foreground mb-2">
                Revisa tu email
              </h2>
              <p className="text-muted-foreground text-sm mb-2">
                Enviamos un link de confirmación a
              </p>
              <p className="text-brand-600 font-semibold text-sm mb-6">{form.email}</p>
              <p className="text-muted-foreground text-xs mb-6">
                Haz clic en el link del email para activar tu cuenta e ingresar a la plataforma.
              </p>
              <Link
                href="/login"
                className="block w-full border border-border text-muted-foreground text-sm py-3 rounded-xl hover:border-brand-300 transition-colors"
              >
                Ir al login
              </Link>
            </div>
          )}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-5">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-brand-400 hover:text-brand-600 font-medium transition-colors">
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  )
}
