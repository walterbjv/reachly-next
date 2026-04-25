import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const type = searchParams.get('type')
  const next = searchParams.get('next')

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=auth`)
  }

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)
  if (error || !data.session) {
    return NextResponse.redirect(`${origin}/login?error=auth`)
  }

  if (type === 'recovery') {
    return NextResponse.redirect(`${origin}/auth/reset`)
  }

  if (next) {
    return NextResponse.redirect(`${origin}${next}`)
  }

  const userId = data.session.user.id
  const metaTipo = data.session.user.user_metadata?.tipo as 'influencer' | 'marca' | undefined

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, tipo')
    .eq('id', userId)
    .single()

  const tipo = profile?.tipo ?? metaTipo
  if (!profile || !tipo) {
    return NextResponse.redirect(`${origin}/onboarding`)
  }

  const dashboard = tipo === 'marca' ? '/dashboard/marca' : '/dashboard/influencer'
  return NextResponse.redirect(`${origin}${dashboard}`)
}
