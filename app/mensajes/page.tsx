'use client'
import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { cn } from '@/lib/utils'
import { Send, Loader2, MessageSquare } from 'lucide-react'

interface Profile {
  id: string
  nombre: string
  avatar_url: string | null
}

interface Message {
  id: string
  sender_id: string
  receiver_id: string
  content: string
  read: boolean
  created_at: string
}

interface Conversation {
  partner: Profile
  lastMessage: Message
  unreadCount: number
}

function Avatar({ profile, size = 'md' }: { profile: Profile; size?: 'sm' | 'md' }) {
  const iniciales = profile.nombre.split(' ').slice(0, 2).map(p => p[0]).join('').toUpperCase() || '?'
  const dim = size === 'sm' ? 'w-9 h-9 text-xs' : 'w-10 h-10 text-sm'
  return profile.avatar_url ? (
    <img src={profile.avatar_url} alt={profile.nombre} className={cn(dim, 'rounded-full object-cover flex-shrink-0')} />
  ) : (
    <div className={cn(dim, 'rounded-full bg-brand-600 text-white font-bold flex items-center justify-center flex-shrink-0')}>
      {iniciales}
    </div>
  )
}

function formatTime(iso: string) {
  const d = new Date(iso)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 60000) return 'ahora'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m`
  if (diff < 86400000) return d.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' })
  return d.toLocaleDateString('es-CL', { day: 'numeric', month: 'short' })
}

export default function MensajesPage() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-64px)] flex items-center justify-center"><Loader2 className="w-5 h-5 animate-spin text-muted-foreground" /></div>}>
      <MensajesContent />
    </Suspense>
  )
}

function MensajesContent() {
  const searchParams = useSearchParams()
  const withParam = searchParams.get('with')

  const [myId, setMyId] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activePartnerId, setActivePartnerId] = useState<string | null>(null)
  const [activePartner, setActivePartner] = useState<Profile | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Init: get current user and load conversations
  useEffect(() => {
    async function init() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setMyId(user.id)
      await loadConversations(user.id)

      // If ?with= param present, open that conversation
      if (withParam) {
        const { data: partner } = await supabase
          .from('profiles')
          .select('id, nombre, avatar_url')
          .eq('id', withParam)
          .single()
        if (partner) {
          setActivePartnerId(withParam)
          setActivePartner(partner)
          setShowSidebar(false)
        }
      }
      setLoading(false)
    }
    init()
  }, [withParam])

  async function loadConversations(userId: string) {
    const { data: msgs } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .order('created_at', { ascending: false })

    if (!msgs || msgs.length === 0) return

    const partnerIds = [...new Set(msgs.map(m =>
      m.sender_id === userId ? m.receiver_id : m.sender_id
    ))]

    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, nombre, avatar_url')
      .in('id', partnerIds)

    const profileMap = new Map((profiles ?? []).map((p: Profile) => [p.id, p]))

    const convMap = new Map<string, Conversation>()
    for (const msg of msgs) {
      const partnerId = msg.sender_id === userId ? msg.receiver_id : msg.sender_id
      if (!convMap.has(partnerId)) {
        const partner = profileMap.get(partnerId)
        if (partner) {
          convMap.set(partnerId, { partner, lastMessage: msg, unreadCount: 0 })
        }
      }
      if (msg.receiver_id === userId && !msg.read) {
        const conv = convMap.get(msg.sender_id)
        if (conv) conv.unreadCount++
      }
    }

    setConversations(Array.from(convMap.values()))
  }

  // Load messages when active partner changes
  useEffect(() => {
    if (!myId || !activePartnerId) return

    let channel: ReturnType<typeof supabase.channel>

    async function loadMessages() {
      const { data } = await supabase
        .from('messages')
        .select('*')
        .or(
          `and(sender_id.eq.${myId},receiver_id.eq.${activePartnerId}),` +
          `and(sender_id.eq.${activePartnerId},receiver_id.eq.${myId})`
        )
        .order('created_at', { ascending: true })

      setMessages(data ?? [])

      // Mark received messages as read
      await supabase.from('messages')
        .update({ read: true })
        .eq('receiver_id', myId)
        .eq('sender_id', activePartnerId)
        .eq('read', false)

      // Update unread count in sidebar
      setConversations(prev => prev.map(c =>
        c.partner.id === activePartnerId ? { ...c, unreadCount: 0 } : c
      ))
    }

    loadMessages()

    // Real-time subscription
    channel = supabase
      .channel(`msgs-${[myId, activePartnerId].sort().join('-')}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        const msg = payload.new as Message
        const isRelevant =
          (msg.sender_id === myId && msg.receiver_id === activePartnerId) ||
          (msg.sender_id === activePartnerId && msg.receiver_id === myId)
        if (isRelevant) {
          setMessages(prev => {
            if (prev.find(m => m.id === msg.id)) return prev
            return [...prev, msg]
          })
          // Mark as read if I'm the receiver
          if (msg.receiver_id === myId) {
            supabase.from('messages').update({ read: true }).eq('id', msg.id)
          }
        }
      })
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [myId, activePartnerId])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function sendMessage() {
    if (!input.trim() || !myId || !activePartnerId || sending) return
    const content = input.trim()
    setInput('')
    setSending(true)

    const { data: newMsg } = await supabase.from('messages').insert({
      sender_id: myId,
      receiver_id: activePartnerId,
      content,
      read: false,
    }).select().single()

    if (newMsg) {
      setMessages(prev => prev.find(m => m.id === newMsg.id) ? prev : [...prev, newMsg])
      setConversations(prev => {
        const exists = prev.find(c => c.partner.id === activePartnerId)
        if (exists) {
          return prev.map(c => c.partner.id === activePartnerId ? { ...c, lastMessage: newMsg } : c)
        } else if (activePartner) {
          return [{ partner: activePartner, lastMessage: newMsg, unreadCount: 0 }, ...prev]
        }
        return prev
      })
    }
    setSending(false)
  }

  function openConversation(conv: Conversation) {
    setActivePartnerId(conv.partner.id)
    setActivePartner(conv.partner)
    setShowSidebar(false)
  }

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
        <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="max-w-[1100px] mx-auto px-[5%] py-8">
      <h1 className="text-xl font-bold text-foreground mb-5">Mensajes</h1>

      <div className="bg-card border border-border rounded-2xl overflow-hidden" style={{ height: 580 }}>
        <div className="flex h-full">

          {/* Sidebar — conversaciones */}
          <div className={cn(
            'w-full sm:w-72 border-r border-border flex-shrink-0 flex flex-col',
            !showSidebar && 'hidden sm:flex'
          )}>
            <div className="p-4 border-b border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Conversaciones</p>
            </div>

            <div className="flex-1 overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <MessageSquare className="w-8 h-8 text-muted-foreground mb-3" />
                  <p className="text-sm font-medium text-foreground mb-1">Sin mensajes</p>
                  <p className="text-xs text-muted-foreground">Visitá el perfil de un influencer y hacé click en "Mensaje directo" para iniciar.</p>
                </div>
              ) : (
                conversations.map(conv => (
                  <button
                    key={conv.partner.id}
                    onClick={() => openConversation(conv)}
                    className={cn(
                      'w-full flex items-center gap-3 p-4 border-b border-border text-left hover:bg-accent transition-colors',
                      activePartnerId === conv.partner.id && 'bg-accent'
                    )}
                  >
                    <Avatar profile={conv.partner} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-0.5">
                        <span className="text-sm font-semibold text-foreground truncate">{conv.partner.nombre}</span>
                        <span className="text-[10px] text-muted-foreground flex-shrink-0 ml-2">{formatTime(conv.lastMessage.created_at)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{conv.lastMessage.content}</p>
                    </div>
                    {conv.unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat */}
          <div className={cn('flex-1 flex flex-col min-w-0', showSidebar && 'hidden sm:flex')}>
            {!activePartnerId ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-8">
                <MessageSquare className="w-10 h-10 text-muted-foreground mb-3" />
                <h3 className="text-base font-semibold text-foreground mb-1">Selecciona una conversación</h3>
                <p className="text-sm text-muted-foreground">O inicia una nueva desde el perfil de un influencer.</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="p-4 border-b border-border flex items-center gap-3 flex-shrink-0">
                  <button
                    className="sm:hidden text-muted-foreground hover:text-foreground mr-1"
                    onClick={() => setShowSidebar(true)}
                  >
                    ←
                  </button>
                  {activePartner && <Avatar profile={activePartner} size="sm" />}
                  <div>
                    <div className="text-sm font-semibold text-foreground">{activePartner?.nombre}</div>
                    <div className="text-xs text-emerald-500">● Activo</div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages.length === 0 && (
                    <p className="text-center text-xs text-muted-foreground py-8">
                      Iniciá la conversación con {activePartner?.nombre.split(' ')[0]}
                    </p>
                  )}
                  {messages.map(m => {
                    const isMe = m.sender_id === myId
                    return (
                      <div key={m.id} className={cn('flex', isMe ? 'justify-end' : 'justify-start')}>
                        <div className={cn(
                          'max-w-[72%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed',
                          isMe
                            ? 'bg-brand-600 text-white rounded-br-sm'
                            : 'bg-muted text-foreground rounded-bl-sm'
                        )}>
                          {m.content}
                          <div className={cn(
                            'text-[10px] mt-1 text-right',
                            isMe ? 'text-white/50' : 'text-muted-foreground'
                          )}>
                            {formatTime(m.created_at)}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t border-border flex gap-2 flex-shrink-0">
                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    placeholder="Escribe un mensaje..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm placeholder:text-muted-foreground outline-none focus:border-brand-400 transition-colors"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!input.trim() || sending}
                    className="w-10 h-10 rounded-xl bg-brand-600 hover:bg-brand-500 text-white flex items-center justify-center transition-colors flex-shrink-0 disabled:opacity-50"
                  >
                    {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
