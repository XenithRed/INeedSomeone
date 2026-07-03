import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Users, Lock, Unlock, Swords, ChevronRight, Skull, ArrowLeft } from 'lucide-react'
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
    <div style={{ minHeight: '100vh', background: '#080809', position: 'relative', overflow: 'hidden' }}>

      {/* Atmospheric bg */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '70%', height: '40%', background: 'rgba(196,0,0,0.07)', filter: 'blur(140px)' }} />
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '40%', height: '40%', background: 'rgba(122,0,0,0.08)', filter: 'blur(100px)' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.018, backgroundImage: 'linear-gradient(rgba(196,0,0,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(196,0,0,0.6) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 10 }}>

        {/* ── Nav ── */}
        <nav style={{ padding: '24px 60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{ width: '36px', height: '36px', border: '1px solid rgba(196,0,0,0.45)', background: 'rgba(196,0,0,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Skull style={{ width: '18px', height: '18px', color: '#FF2A2A' }} />
            </div>
            <span className="font-heading" style={{ fontSize: '1.25rem', letterSpacing: '0.15em', color: '#EAE0D0' }}>DEATH DECK</span>
          </Link>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#38363E', fontSize: '0.8125rem', textDecoration: 'none', letterSpacing: '0.05em' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#EAE0D0')}
            onMouseLeave={e => (e.currentTarget.style.color = '#38363E')}
          >
            <ArrowLeft style={{ width: '14px', height: '14px' }} />
            Inicio
          </Link>
        </nav>

        {/* ── Content ── */}
        <div style={{ padding: '48px 60px' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: '24px', marginBottom: '40px', flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: '0.7rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(196,0,0,0.7)', fontWeight: 600, marginBottom: '10px' }}>
                Salas de Juego
              </p>
              <h1 className="font-heading" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', letterSpacing: '0.08em', color: '#EAE0D0', lineHeight: 1, marginBottom: '12px' }}>
                ENCUENTRA TU PARTIDA
              </h1>
              <p style={{ color: '#6E6A75', fontSize: '0.9rem', maxWidth: '460px', lineHeight: 1.6 }}>
                Crea una sala, comparte el código y empieza a jugar con tus amigos en segundos.
              </p>
            </div>
            <button
              onClick={() => setShowCreate(true)}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                background: '#C40000', border: 'none', padding: '14px 28px',
                color: '#EAE0D0', fontSize: '0.8rem', fontWeight: 700,
                letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer',
                transition: 'background 0.2s', flexShrink: 0,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#e00000')}
              onMouseLeave={e => (e.currentTarget.style.background = '#C40000')}
            >
              <Plus style={{ width: '16px', height: '16px' }} />
              Crear Sala
            </button>
          </div>

          {/* Rooms panel */}
          <div style={{
            background: '#0D0D10',
            border: '1px solid rgba(255,255,255,0.06)',
            position: 'relative',
          }}>
            {/* corner accents */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '24px', height: '24px', borderTop: '1px solid rgba(196,0,0,0.3)', borderLeft: '1px solid rgba(196,0,0,0.3)' }} />
            <div style={{ position: 'absolute', top: 0, right: 0, width: '24px', height: '24px', borderTop: '1px solid rgba(196,0,0,0.3)', borderRight: '1px solid rgba(196,0,0,0.3)' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '24px', height: '24px', borderBottom: '1px solid rgba(196,0,0,0.3)', borderLeft: '1px solid rgba(196,0,0,0.3)' }} />
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '24px', height: '24px', borderBottom: '1px solid rgba(196,0,0,0.3)', borderRight: '1px solid rgba(196,0,0,0.3)' }} />

            <div style={{ padding: '32px' }}>
              {rooms.length === 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px', padding: '64px 0' }}>
                  <div style={{ width: '72px', height: '72px', border: '1px solid rgba(255,255,255,0.06)', background: '#131317', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Swords style={{ width: '32px', height: '32px', color: '#38363E' }} />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <h3 className="font-heading" style={{ fontSize: '1.5rem', letterSpacing: '0.2em', color: '#EAE0D0', textTransform: 'uppercase', marginBottom: '8px' }}>
                      La sala está vacía
                    </h3>
                    <p style={{ color: '#6E6A75', fontSize: '0.875rem' }}>
                      Crea una sala para que tus amigos se unan y empieza la partida.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowCreate(true)}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: '8px',
                      background: '#C40000', border: 'none', padding: '14px 28px',
                      color: '#EAE0D0', fontSize: '0.8rem', fontWeight: 700,
                      letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer',
                    }}
                  >
                    <Plus style={{ width: '16px', height: '16px' }} />
                    Crear Sala
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <AnimatePresence>
                    {rooms.map((room, i) => (
                      <motion.div
                        key={room.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                      >
                        <Link
                          to={`/room/${room.id}`}
                          style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '20px', padding: '20px 24px', border: '1px solid rgba(255,255,255,0.05)', background: '#0F0F13', transition: 'all 0.2s' }}
                          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(196,0,0,0.25)'; (e.currentTarget as HTMLElement).style.background = '#18181D' }}
                          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.05)'; (e.currentTarget as HTMLElement).style.background = '#0F0F13' }}
                        >
                          <div style={{ width: '44px', height: '44px', border: '1px solid rgba(255,255,255,0.07)', background: '#131317', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Users style={{ width: '18px', height: '18px', color: '#38363E' }} />
                          </div>

                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              <h3 className="font-heading" style={{ fontSize: '1rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#EAE0D0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {room.name}
                              </h3>
                              {room.is_private && (
                                <span style={{ fontSize: '0.65rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#FF2A2A', border: '1px solid rgba(196,0,0,0.3)', padding: '2px 8px', background: 'rgba(196,0,0,0.08)', flexShrink: 0 }}>
                                  Privada
                                </span>
                              )}
                            </div>
                            <p style={{ color: '#38363E', fontSize: '0.75rem' }}>
                              Anfitrión: <span style={{ color: '#6E6A75' }}>{room.host_name}</span>
                            </p>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexShrink: 0 }}>
                            <div style={{ textAlign: 'right' }}>
                              <span className="font-heading" style={{ fontSize: '1.4rem', color: '#EAE0D0' }}>{room.player_count}</span>
                              <span style={{ color: '#6E6A75', fontSize: '0.875rem' }}>/{room.max_players}</span>
                            </div>
                            <div style={{ width: '32px', height: '32px', border: '1px solid rgba(255,255,255,0.07)', background: '#131317', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <ChevronRight style={{ width: '14px', height: '14px', color: '#38363E' }} />
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
      </div>

      {/* ── Create Room Modal ── */}
      <AnimatePresence>
        {showCreate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
            onClick={() => setShowCreate(false)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 8 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 8 }}
              onClick={e => e.stopPropagation()}
              style={{ background: '#0D0D10', border: '1px solid rgba(255,255,255,0.08)', width: '100%', maxWidth: '520px', position: 'relative' }}
            >
              {/* Corner accents */}
              <div style={{ position: 'absolute', top: 0, left: 0, width: '24px', height: '24px', borderTop: '1px solid rgba(196,0,0,0.45)', borderLeft: '1px solid rgba(196,0,0,0.45)' }} />
              <div style={{ position: 'absolute', top: 0, right: 0, width: '24px', height: '24px', borderTop: '1px solid rgba(196,0,0,0.45)', borderRight: '1px solid rgba(196,0,0,0.45)' }} />
              <div style={{ position: 'absolute', bottom: 0, left: 0, width: '24px', height: '24px', borderBottom: '1px solid rgba(196,0,0,0.45)', borderLeft: '1px solid rgba(196,0,0,0.45)' }} />
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: '24px', height: '24px', borderBottom: '1px solid rgba(196,0,0,0.45)', borderRight: '1px solid rgba(196,0,0,0.45)' }} />

              {/* Modal header strip */}
              <div style={{ padding: '28px 40px 24px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <p style={{ fontSize: '0.65rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(196,0,0,0.65)', fontWeight: 600, marginBottom: '6px' }}>
                  Nueva partida
                </p>
                <h2 className="font-heading" style={{ fontSize: '2rem', letterSpacing: '0.08em', color: '#EAE0D0', textTransform: 'uppercase', lineHeight: 1 }}>
                  Crear Sala
                </h2>
              </div>

              {/* Modal body */}
              <div style={{ padding: '32px 40px 36px', display: 'flex', flexDirection: 'column', gap: '28px' }}>

                {/* Room name */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6E6A75', marginBottom: '12px' }}>
                    Nombre de la sala
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Ej: La Maldición"
                    style={{ width: '100%', boxSizing: 'border-box', background: '#080809', border: '1px solid rgba(255,255,255,0.07)', padding: '15px 16px', color: '#EAE0D0', fontSize: '1rem', outline: 'none', transition: 'border-color 0.2s' }}
                    onFocus={e => (e.target.style.borderColor = 'rgba(196,0,0,0.5)')}
                    onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.07)')}
                  />
                </div>

                {/* Max players */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6E6A75', marginBottom: '12px' }}>
                    Jugadores máximos
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                    {[2, 4, 6, 8].map(n => (
                      <button
                        key={n}
                        onClick={() => setMaxPlayers(n)}
                        style={{
                          padding: '16px 0',
                          fontSize: '1.1rem', fontWeight: 700, letterSpacing: '0.05em',
                          border: maxPlayers === n ? '1px solid rgba(196,0,0,0.55)' : '1px solid rgba(255,255,255,0.07)',
                          background: maxPlayers === n ? 'rgba(196,0,0,0.18)' : '#131317',
                          color: maxPlayers === n ? '#EAE0D0' : '#6E6A75',
                          cursor: 'pointer', transition: 'all 0.15s',
                        }}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div style={{ height: '1px', background: 'rgba(255,255,255,0.04)' }} />

                {/* Private toggle */}
                <button
                  onClick={() => setIsPrivate(!isPrivate)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '16px', width: '100%', padding: '18px 20px',
                    border: isPrivate ? '1px solid rgba(201,150,12,0.35)' : '1px solid rgba(255,255,255,0.07)',
                    background: isPrivate ? 'rgba(201,150,12,0.06)' : '#131317',
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', boxSizing: 'border-box',
                  }}
                >
                  <div style={{
                    width: '36px', height: '36px', flexShrink: 0,
                    border: isPrivate ? '1px solid rgba(201,150,12,0.4)' : '1px solid rgba(255,255,255,0.07)',
                    background: isPrivate ? 'rgba(201,150,12,0.1)' : '#0D0D10',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {isPrivate
                      ? <Lock style={{ width: '15px', height: '15px', color: '#C9960C' }} />
                      : <Unlock style={{ width: '15px', height: '15px', color: '#38363E' }} />
                    }
                  </div>
                  <div>
                    <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#EAE0D0', marginBottom: '3px' }}>Sala Privada</p>
                    <p style={{ fontSize: '0.78rem', color: '#6E6A75', lineHeight: 1.4 }}>Solo jugadores con invitación pueden unirse</p>
                  </div>
                  {/* Active indicator */}
                  {isPrivate && (
                    <div style={{ marginLeft: 'auto', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#C9960C', fontWeight: 600, flexShrink: 0 }}>
                      Activo
                    </div>
                  )}
                </button>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '12px', paddingTop: '4px' }}>
                  <button
                    onClick={() => setShowCreate(false)}
                    style={{ flex: 1, padding: '16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', color: '#6E6A75', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.22)'; e.currentTarget.style.color = '#EAE0D0' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#6E6A75' }}
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleCreate}
                    disabled={creating || !name.trim()}
                    style={{
                      flex: 2, padding: '16px',
                      background: (creating || !name.trim()) ? '#7A0000' : '#C40000',
                      border: 'none', color: '#EAE0D0',
                      fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
                      cursor: (creating || !name.trim()) ? 'not-allowed' : 'pointer',
                      opacity: (creating || !name.trim()) ? 0.45 : 1, transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { if (!creating && name.trim()) e.currentTarget.style.background = '#e00000' }}
                    onMouseLeave={e => { if (!creating && name.trim()) e.currentTarget.style.background = '#C40000' }}
                  >
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
