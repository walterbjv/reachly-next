'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { UserPlus, UserCheck, Loader2 } from 'lucide-react'

interface Props {
  targetProfileId: string
  variant?: 'dark' | 'light'
}

export function FollowButton({ targetProfileId, variant = 'dark' }: Props) {
  const [following, setFollowing] = useState(false)
  const [myProfileId, setMyProfileId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }
      setMyProfileId(user.id)

      const [followRow, countRow] = await Promise.all([
        supabase
          .from('follows')
          .select('id')
          .eq('follower_id', user.id)
          .eq('following_id', targetProfileId)
          .maybeSingle(),
        supabase
          .from('follows')
          .select('id', { count: 'exact', head: true })
          .eq('following_id', targetProfileId),
      ])

      setFollowing(!!followRow.data)
      setCount(countRow.count ?? 0)
      setLoading(false)
    }
    init()
  }, [targetProfileId])

  async function toggle() {
    if (!myProfileId) return
    setLoading(true)
    if (following) {
      await supabase.from('follows')
        .delete()
        .eq('follower_id', myProfileId)
        .eq('following_id', targetProfileId)
      setFollowing(false)
      setCount(c => (c ?? 1) - 1)
    } else {
      await supabase.from('follows')
        .insert({ follower_id: myProfileId, following_id: targetProfileId })
      setFollowing(true)
      setCount(c => (c ?? 0) + 1)
    }
    setLoading(false)
  }

  // No mostrar si es el propio perfil o no está logueado
  if (!myProfileId || myProfileId === targetProfileId) return null

  return (
    <div className="flex items-center gap-3">
      {count !== null && (
        <span className={cn('text-sm', variant === 'dark' ? 'text-white/60' : 'text-muted-foreground')}>
          <span className={cn('font-bold', variant === 'dark' ? 'text-white' : 'text-foreground')}>{count}</span> seguidores
        </span>
      )}
      <button
        onClick={toggle}
        disabled={loading}
        className={cn(
          'flex items-center gap-2 font-semibold text-sm px-5 py-2.5 rounded-xl transition-all duration-150 disabled:opacity-60',
          variant === 'dark'
            ? following
              ? 'bg-white/15 text-white border border-white/30 hover:bg-red-500/20 hover:border-red-400/40 hover:text-red-300'
              : 'bg-white text-[#4A1FA8] hover:bg-[#F0E8FF]'
            : following
              ? 'border border-border text-muted-foreground hover:bg-red-50 hover:text-red-500 hover:border-red-200 dark:hover:bg-red-900/20'
              : 'bg-[#4A1FA8] text-white hover:bg-[#6C3BF5]'
        )}
      >
        {loading
          ? <Loader2 className="w-4 h-4 animate-spin" />
          : following
            ? <UserCheck className="w-4 h-4" />
            : <UserPlus className="w-4 h-4" />
        }
        {following ? 'Siguiendo' : 'Seguir'}
      </button>
    </div>
  )
}
