import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Users, Play, Crown, Copy, Check, Skull, MessageSquare } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { useRoom } from '../hooks/useRoom'

const itemAnim = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } }
}

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
      if (!exists) {
        joinRoom()
      }
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
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(circle, rgba(168,85,247,0.3) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/lobby" className="btn-ghost !pl-0">
            <ArrowLeft className="w-5 h-5" />
            Salas
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-glow-sm">
              <Skull className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-extrabold text-white">{room?.name || 'Sala'}</h1>
              <p className="text-text-tertiary text-xs">{players.length}/{room?.max_players || 8} jugadores</p>
            </div>
          </div>
          <button onClick={copyRoomCode} className="btn-ghost !px-3 !py-2">
            {copied ? <Check className="w-4 h-4 text-accent-emerald" /> : <Copy className="w-4 h-4" />}
            <span className="text-xs">{copied ? 'Copiado' : 'Código'}</span>
          </button>
        </div>

        {!room ? (
          <div className="glass rounded-4xl p-16 text-center">
            <p className="text-text-tertiary">Cargando sala...</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Players */}
            <div className="lg:col-span-2">
              <div className="glass rounded-4xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Users className="w-5 h-5 text-brand-light" />
                    Jugadores
                  </h2>
                  <span className="badge bg-brand/10 text-brand-light border border-brand/20">
                    {players.filter(p => p.is_ready).length}/{players.length} listos
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {players.map((player) => (
                    <motion.div
                      key={player.id}
                      variants={itemAnim}
                      initial="hidden"
                      animate="show"
                      className={`relative rounded-2xl border-2 p-5 text-center transition-all ${
                        player.is_ready
                          ? 'border-accent-emerald/40 bg-accent-emerald/5'
                          : 'border-border bg-surface-lighter/50'
                      }`}
                    >
                      <div className="relative inline-block mb-3">
                        <div className={`w-20 h-20 rounded-full overflow-hidden ring-2 ${
                          player.is_ready ? 'ring-accent-emerald/40' : 'ring-border'
                        }`}>
                          <img
                            src={player.avatar}
                            alt={player.username}
                            className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.username}` }}
                          />
                        </div>
                        {player.is_host && (
                          <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-gradient-brand flex items-center justify-center shadow-glow-sm">
                            <Crown className="w-4 h-4 text-white" />
                          </div>
                        )}
                        {player.is_ready && (
                          <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-accent-emerald flex items-center justify-center">
                            <Check className="w-3.5 h-3.5 text-white" />
                          </div>
                        )}
                      </div>
                      <p className="font-bold text-white text-sm truncate">{player.username}</p>
                      <p className={`text-xs font-medium mt-1 ${
                        player.is_ready ? 'text-accent-emerald' : 'text-text-tertiary'
                      }`}>
                        {player.is_ready ? 'Listo' : 'Esperando...'}
                      </p>
                    </motion.div>
                  ))}

                  {[...Array((room?.max_players || 8) - players.length)].map((_, idx) => (
                    <motion.div
                      key={`empty-${idx}`}
                      variants={itemAnim}
                      initial="hidden"
                      animate="show"
                      className="rounded-2xl border-2 border-dashed border-border bg-surface-lighter/20 p-5 flex items-center justify-center"
                    >
                      <p className="text-text-tertiary text-sm">Esperando...</p>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 flex flex-col items-center gap-4">
                  {/* Room code */}
                  <div className="flex items-center gap-2 bg-surface-lighter/50 rounded-2xl px-5 py-3 border border-border">
                    <span className="text-text-tertiary text-xs font-medium">CÓDIGO DE SALA</span>
                    <span className="text-white font-mono font-bold text-sm tracking-widest">{id}</span>
                    <button onClick={copyRoomCode} className="ml-2 text-text-tertiary hover:text-white transition-colors">
                      {copied ? <Check className="w-4 h-4 text-accent-emerald" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Action buttons */}
                  {!isHost ? (
                    <button onClick={toggleReady} className={`px-12 py-4 text-lg font-bold rounded-2xl transition-all ${
                      players.find(p => p.id === user?.id)?.is_ready
                        ? 'bg-accent-emerald text-white shadow-lg hover:bg-accent-emerald/90'
                        : 'btn-primary'
                    }`}>
                      {players.find(p => p.id === user?.id)?.is_ready ? '¡Listo!' : 'Estoy Listo'}
                    </button>
                  ) : (
                    <button
                      onClick={startGame}
                      disabled={players.length < 2}
                      className="btn-primary text-lg !px-12 !py-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:transform-none"
                    >
                      <Play className="w-5 h-5 fill-current" />
                      {players.length < 2 ? 'Esperando jugadores...' : 'Iniciar Partida'}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Chat */}
            <div>
              <div className="glass rounded-4xl p-6 flex flex-col" style={{ minHeight: '400px' }}>
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-brand-light" />
                  Chat
                </h2>
                <div className="flex-1 overflow-y-auto mb-4 space-y-3">
                  {chatMessages.map((msg, i) => (
                    <div key={i} className="bg-surface-lighter/50 rounded-2xl px-4 py-3">
                      <p className="text-brand-light font-semibold text-xs">{msg.user}</p>
                      <p className="text-text-secondary text-sm">{msg.message}</p>
                    </div>
                  ))}
                  {chatMessages.length === 0 && (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-text-tertiary text-sm">Sin mensajes aún</p>
                    </div>
                  )}
                </div>
                <form onSubmit={sendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Escribe..."
                    className="input-field !py-3 !text-sm flex-1"
                  />
                  <button type="submit" className="btn-primary !p-3 !rounded-xl">
                    <Play className="w-4 h-4 fill-current rotate-180" />
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
