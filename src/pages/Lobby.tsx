import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Users, Lock, Unlock, Play, Swords } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { useRooms, createRoom } from '../hooks/useRoom'

export default function Lobby() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { rooms } = useRooms()
  const [showCreate, setShowCreate] = useState(false)
  const [name, setName] = useState('')
  const [maxPlayers, setMaxPlayers] = useState(8)
  const [isPrivate, setIsPrivate] = useState(false)
  const [creating, setCreating] = useState(false)

  const handleCreate = () => {
    if (!name.trim() || !user) return
    setCreating(true)
    const id = createRoom(name.trim(), maxPlayers, isPrivate, user.id, user.username, user.avatar)
    setShowCreate(false)
    navigate(`/room/${id}`)
  }

  return (
    <div className="min-h-screen bg-surface relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-brand/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-accent-pink/20 blur-3xl" />
        <div className="absolute top-24 left-8 w-72 h-72 rounded-full bg-accent-teal/10 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between mb-10">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.35em] text-accent-teal/80 font-semibold">Salas de Juego</p>
            <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary tracking-tight">Encuentra tu partida</h1>
            <p className="max-w-2xl text-text-secondary text-sm leading-6">Crea una sala, comparte el código y empieza a jugar con tus amigos en segundos.</p>
          </div>

          <button onClick={() => setShowCreate(true)} className="btn-primary inline-flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Crear Sala
          </button>
        </div>

        <div className="glass rounded-[2rem] p-8 shadow-card">
          <div className="flex flex-col gap-10">
            {rooms.length === 0 ? (
              <div className="flex flex-col items-center gap-8 rounded-[1.75rem] border border-border bg-surface-card p-12 shadow-card-hover">
                <div className="w-24 h-24 rounded-3xl bg-brand/10 text-brand flex items-center justify-center text-3xl shadow-sm">
                  <Swords className="w-10 h-10" />
                </div>
                <div className="space-y-3 text-center">
                  <h3 className="text-2xl font-bold text-text-primary">La sala está vacía</h3>
                  <p className="text-text-secondary">Crea una sala para que tus amigos se unan y empieza la partida.</p>
                </div>
                <button onClick={() => setShowCreate(true)} className="btn-primary inline-flex items-center gap-2">
                  <Plus className="w-5 h-5" />
                  Crear Sala
                </button>
              </div>
            ) : (
              <div className="grid gap-5">
                <AnimatePresence>
                  {rooms.map((room, i) => (
                    <motion.div
                      key={room.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                    >
                      <Link
                        to={`/room/${room.id}`}
                        className="group block rounded-[1.75rem] border border-border bg-white shadow-card transition-transform duration-200 hover:-translate-y-1 hover:shadow-card-hover"
                      >
                        <div className="flex flex-col lg:flex-row items-center gap-5 p-6 lg:px-8 lg:py-6">
                          <div className="flex items-center justify-center w-16 h-16 rounded-3xl bg-brand/10 text-brand">
                            <Users className="w-7 h-7" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-3">
                              <h3 className="text-xl font-bold text-text-primary truncate">{room.name}</h3>
                              {room.is_private && (
                                <span className="badge bg-accent-red/10 text-accent-red border border-accent-red/20">Privada</span>
                              )}
                            </div>
                            <p className="text-text-secondary text-sm mt-1 truncate">
                              Anfitrión: <span className="text-text-primary font-semibold">{room.host_name}</span>
                            </p>
                          </div>
                          <div className="flex items-center gap-5 rounded-3xl bg-surface hover:bg-surface-hover px-4 py-3">
                            <div className="text-right">
                              <p className="text-2xl font-extrabold text-text-primary">{room.player_count}</p>
                              <p className="text-sm text-text-secondary">/{room.max_players}</p>
                            </div>
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand transition group-hover:bg-brand/20">
                              <Play className="w-5 h-5" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Modal */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 modal-backdrop flex items-center justify-center p-4"
            onClick={() => setShowCreate(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="glass rounded-4xl p-8 max-w-md w-full"
            >
              <h2 className="text-2xl font-extrabold text-white mb-6">Crear Sala</h2>
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-secondary">Nombre de la sala</label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} className="input-field" placeholder="Ej: La Maldición" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-text-secondary">Máximo de jugadores</label>
                  <div className="flex gap-2">
                    {[2, 4, 6, 8].map(n => (
                      <button key={n} onClick={() => setMaxPlayers(n)}
                        className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
                          maxPlayers === n ? 'bg-gradient-to-br from-brand to-accent-pink text-white shadow-glow-sm' : 'bg-surface-lighter text-text-secondary border border-border hover:border-border-hover'
                        }`}>
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
                <button onClick={() => setIsPrivate(!isPrivate)}
                  className={`flex items-center gap-3 w-full p-4 rounded-2xl border transition-all ${
                    isPrivate ? 'bg-accent-amber/10 border-accent-amber/30' : 'bg-surface-lighter border-border'
                  }`}>
                  {isPrivate ? <Lock className="w-5 h-5 text-accent-amber" /> : <Unlock className="w-5 h-5 text-text-tertiary" />}
                  <div className="text-left">
                    <p className="text-sm font-medium text-white">Sala Privada</p>
                    <p className="text-xs text-text-tertiary">Solo jugadores invitados pueden unirse</p>
                  </div>
                </button>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowCreate(false)} className="btn-secondary flex-1">Cancelar</button>
                  <button onClick={handleCreate} disabled={creating || !name.trim()} className="btn-primary flex-1">
                    {creating ? 'Creando...' : 'Crear Sala'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
