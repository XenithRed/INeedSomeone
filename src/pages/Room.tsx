import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Users, Play, Crown, Copy, Check, Skull, MessageSquare, Send } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { useRoom } from '../hooks/useRoom'

export default function Room() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { room, players, joinRoom, toggleReady, startGame, isHost } = useRoom(id)
  const [chatMessages, setChatMessages] = useState<{ user: string; message: string }[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [copied, setCopied] = useState(false)
  const joined = useRef(false)

  useEffect(() => {
    if (user && id && !joined.current) {
      const exists = players.find(p => p.id === user.id)
      if (!exists) joinRoom()
      joined.current = true
    }
  }, [user, id, players, joinRoom])

  useEffect(() => {
    if (room?.status === 'playing' && id) navigate(`/game/${id}`)
  }, [room?.status, id, navigate])

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() && user) {
      setChatMessages(prev => [...prev, { user: user.username, message: newMessage }])
      setNewMessage('')
    }
  }

  const copyRoomCode = () => {
    if (id) {
      navigator.clipboard.writeText(id)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="min-h-screen bg-surface relative overflow-hidden">

      {/* Grid bg */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[40%] bg-brand/6 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage: `linear-gradient(rgba(196,0,0,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(196,0,0,0.6) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/lobby" className="btn-ghost !pl-0 text-sm">
            <ArrowLeft className="w-4 h-4" />
            Salas
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 border border-brand/40 bg-brand/10 flex items-center justify-center">
              <Skull className="w-4 h-4 text-brand-light animate-flicker" />
            </div>
            <div>
              <h1 className="font-heading tracking-widest text-base uppercase text-text-primary">{room?.name || 'Sala'}</h1>
              <p className="text-text-tertiary text-xs">{players.length}/{room?.max_players || 8} jugadores</p>
            </div>
          </div>
          <button onClick={copyRoomCode} className="btn-ghost !px-3 !py-2 text-xs">
            {copied ? <Check className="w-4 h-4 text-accent-gold" /> : <Copy className="w-4 h-4" />}
            {copied ? 'Copiado' : 'Código'}
          </button>
        </div>

        {!room ? (
          <div className="glass p-16 text-center">
            <div className="w-12 h-12 border border-brand/30 bg-brand/8 flex items-center justify-center mx-auto mb-4">
              <Skull className="w-6 h-6 text-brand/60 animate-pulse" />
            </div>
            <p className="text-text-tertiary text-sm tracking-widest">Cargando sala...</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-5">

            {/* Players panel */}
            <div className="lg:col-span-2">
              <div className="glass p-7 relative">
                <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-brand/25" />
                <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-brand/25" />
                <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-brand/25" />
                <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-brand/25" />

                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-heading text-lg tracking-widest uppercase text-text-primary flex items-center gap-2">
                    <Users className="w-4 h-4 text-brand/70" />
                    Jugadores
                  </h2>
                  <span className="badge border border-white/[0.08] bg-surface-lighter text-text-secondary">
                    {players.filter(p => p.is_ready).length}/{players.length} listos
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {players.map((player) => (
                    <motion.div
                      key={player.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`relative border p-4 text-center transition-all ${
                        player.is_ready
                          ? 'border-accent-gold/30 bg-accent-gold/5'
                          : 'border-white/[0.06] bg-surface-lighter/50'
                      }`}
                    >
                      <div className="relative inline-block mb-3">
                        <div className={`w-16 h-16 overflow-hidden border-2 ${
                          player.is_ready ? 'border-accent-gold/40' : 'border-white/[0.08]'
                        }`}>
                          <img
                            src={player.avatar}
                            alt={player.username}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.username}` }}
                          />
                        </div>
                        {player.is_host && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-accent-gold flex items-center justify-center">
                            <Crown className="w-3 h-3 text-surface" />
                          </div>
                        )}
                        {player.is_ready && !player.is_host && (
                          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-accent-gold/80 flex items-center justify-center">
                            <Check className="w-3 h-3 text-surface" />
                          </div>
                        )}
                      </div>
                      <p className="font-semibold text-text-primary text-xs truncate">{player.username}</p>
                      <p className={`text-[10px] mt-0.5 tracking-wider ${
                        player.is_ready ? 'text-accent-gold' : 'text-text-tertiary'
                      }`}>
                        {player.is_ready ? '— LISTO —' : 'Esperando'}
                      </p>
                    </motion.div>
                  ))}

                  {[...Array(Math.max(0, (room?.max_players || 8) - players.length))].map((_, idx) => (
                    <div
                      key={`empty-${idx}`}
                      className="border border-dashed border-white/[0.05] bg-surface-lighter/20 p-4 flex items-center justify-center"
                    >
                      <p className="text-text-tertiary text-xs tracking-widest">···</p>
                    </div>
                  ))}
                </div>

                {/* Room code & actions */}
                <div className="mt-7 pt-6 border-t border-white/[0.05] flex flex-col items-center gap-4">
                  <button
                    onClick={copyRoomCode}
                    className="flex items-center gap-3 border border-white/[0.07] bg-surface-lighter/50 px-5 py-2.5 hover:border-white/15 transition-colors"
                  >
                    <span className="text-text-tertiary text-[10px] tracking-[0.25em] uppercase">Código de sala</span>
                    <span className="text-text-primary font-mono font-bold text-sm tracking-[0.3em]">{id}</span>
                    {copied ? <Check className="w-3.5 h-3.5 text-accent-gold" /> : <Copy className="w-3.5 h-3.5 text-text-tertiary" />}
                  </button>

                  {!isHost ? (
                    <button
                      onClick={toggleReady}
                      className={`px-10 py-3 text-sm font-bold tracking-[0.15em] uppercase transition-all border ${
                        players.find(p => p.id === user?.id)?.is_ready
                          ? 'border-accent-gold/40 bg-accent-gold/10 text-accent-gold'
                          : 'btn-primary'
                      }`}
                    >
                      {players.find(p => p.id === user?.id)?.is_ready ? '✓ Listo' : 'Estoy Listo'}
                    </button>
                  ) : (
                    <button
                      onClick={startGame}
                      disabled={players.length < 2}
                      className="btn-primary !px-10 !py-3 text-sm disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Play className="w-4 h-4 fill-current" />
                      {players.length < 2 ? 'Esperando jugadores...' : 'Iniciar Partida'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Chat */}
            <div>
              <div className="glass p-5 flex flex-col relative" style={{ minHeight: '420px' }}>
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-brand/25" />
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-brand/25" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-brand/25" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-brand/25" />

                <h2 className="font-heading tracking-widest text-base uppercase text-text-primary mb-4 flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-brand/60" />
                  Chat
                </h2>

                <div className="flex-1 overflow-y-auto mb-4 space-y-2">
                  {chatMessages.length === 0 && (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-text-tertiary text-xs tracking-widest">Sin mensajes aún</p>
                    </div>
                  )}
                  {chatMessages.map((msg, i) => (
                    <div key={i} className="border border-white/[0.05] bg-surface-lighter/40 px-3 py-2">
                      <p className="text-brand-light/80 font-semibold text-[10px] tracking-widest uppercase">{msg.user}</p>
                      <p className="text-text-secondary text-xs mt-0.5">{msg.message}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={sendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Escribe..."
                    className="input-field !py-2.5 !text-xs flex-1"
                  />
                  <button type="submit" className="btn-primary !p-2.5 flex-shrink-0">
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
