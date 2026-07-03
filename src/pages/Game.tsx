import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Heart, Skull, Shield, MessageSquare, Play, X, RotateCcw, Ghost, Sparkles, ChevronDown, ChevronUp, Crown, Volume2, VolumeX, Send } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'
import { useGame } from '../hooks/useGame'
import type { Card, Player as PlayerType, GlobalEvent } from '../types/game'
import { drawCard, applyCardEffect, nextTurn, checkGameOver, getDealerComment, applyGhostAction, checkCombo } from '../utils/gameLogic'

export default function Game() {
  useParams<{ id: string }>()
  const navigate = useNavigate()
  const auth = useAuth()
  const user = auth.user

  const { game, setGame, gameRef, initGame } = useGame()
  const [currentCard, setCurrentCard] = useState<Card | null>(null)
  const [dealerMessage, setDealerMessage] = useState('Cargando...')
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null)
  const [showChat, setShowChat] = useState(false)
  const [chatMessages, setChatMessages] = useState<{ user: string; message: string }[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [gameLog, setGameLog] = useState<string[]>([])
  const [showLog, setShowLog] = useState(false)
  const [showGlobalEvent, setShowGlobalEvent] = useState(false)
  const [currentEvent, setCurrentEvent] = useState<GlobalEvent | null>(null)
  const [comboNotification, setComboNotification] = useState<{ name: string; desc: string } | null>(null)
  const [soundEnabled, setSoundEnabled] = useState(true)

  useEffect(() => {
    if (!user || game) return
    initGame([
      {
        id: user.id, name: user.username, avatar: user.avatar,
        lives: 5, maxLives: 5, tempMaxLives: 0,
        items: [null, null, null], shield: false, reflect: false,
        isGhost: false, isCurrentTurn: true,
        skippedTurns: 0, effects: [], hasContract: false, comboCount: 0, riskMeter: 0
      },
      {
        id: '2', name: 'ElDealer666',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ElDealer666',
        lives: 5, maxLives: 5, tempMaxLives: 0,
        items: [null, null, null], shield: false, reflect: false,
        isGhost: false, isCurrentTurn: false,
        skippedTurns: 0, effects: [], hasContract: false, comboCount: 0, riskMeter: 0
      },
      {
        id: '3', name: 'DarkSoul',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=DarkSoul',
        lives: 5, maxLives: 5, tempMaxLives: 0,
        items: [null, null, null], shield: false, reflect: true,
        isGhost: false, isCurrentTurn: false,
        skippedTurns: 0, effects: [], hasContract: false, comboCount: 0, riskMeter: 0
      },
      {
        id: '4', name: 'GhostPlayer',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=GhostPlayer',
        lives: 5, maxLives: 5, tempMaxLives: 0,
        items: [null, null, null], shield: false, reflect: false,
        isGhost: false, isCurrentTurn: false,
        skippedTurns: 0, effects: [], hasContract: false, comboCount: 0, riskMeter: 0
      }
    ])
    setDealerMessage('Bienvenidos a Death Deck. ¡Que comience el juego!')
  }, [user])

  useEffect(() => {
    if (game?.globalEvent) {
      setCurrentEvent(game.globalEvent)
      setShowGlobalEvent(true)
      setDealerMessage(`Evento: ${game.globalEvent.name}! ${game.globalEvent.description}`)
      setTimeout(() => setShowGlobalEvent(false), 3000)
    }
  }, [game?.globalEvent])

  const addLog = useCallback((msg: string) => {
    setGameLog(prev => [...prev.slice(-49), msg])
  }, [])

  const handleDraw = useCallback(() => {
    const g = gameRef.current
    if (!g || g.gamePhase !== 'playing' || g.phase !== 'draw') return
    const p = g.players[g.currentPlayerIndex]
    if (p.id !== user?.id) return
    const card = drawCard(g)
    if (!card) return
    setCurrentCard(card)
    g.phase = 'action'
    setGame({ ...g })
    setDealerMessage(getDealerComment(card.color))
    addLog(`Robaste: ${card.name}`)
  }, [user, addLog])

  const handlePlay = useCallback(() => {
    const g = gameRef.current
    if (!g || !currentCard || g.phase !== 'action') return
    const p = g.players[g.currentPlayerIndex]
    if (p.id !== user?.id) return
    if (currentCard.color === 'red' && !selectedTarget) {
      setDealerMessage('Selecciona un objetivo primero')
      return
    }
    const msgs = applyCardEffect(g, currentCard, user.id, selectedTarget || undefined)
    msgs.forEach(m => addLog(m))
    const combo = checkCombo(g.players[g.currentPlayerIndex], g.discardPile.slice(-2).map(c => c.id))
    if (combo) {
      setComboNotification({ name: combo.name, desc: combo.description })
      setTimeout(() => setComboNotification(null), 2000)
    }
    nextTurn(g)
    const over = checkGameOver(g)
    if (over) {
      g.gamePhase = 'ended'
      g.phase = 'ended'
      const w = g.players.find(pl => pl.id === g.winnerId)
      setDealerMessage(`${w?.name || 'Alguien'} ha ganado la partida!`)
      addLog(`${w?.name} GANA!`)
    } else {
      setDealerMessage(`Turno de ${g.players[g.currentPlayerIndex].name}`)
    }
    setCurrentCard(null)
    setSelectedTarget(null)
    setGame({ ...g })
  }, [currentCard, selectedTarget, user, addLog])

  const handleGhostAction = useCallback(() => {
    const g = gameRef.current
    if (!g) return
    const msg = applyGhostAction(g, user?.id || '')
    setDealerMessage(msg)
    addLog(msg)
  }, [user, addLog])

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() && user) {
      setChatMessages(prev => [...prev, { user: user.username, message: newMessage }])
      setNewMessage('')
    }
  }

  /* ── Loading ── */
  if (!game) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border border-brand/40 bg-brand/10 flex items-center justify-center mx-auto mb-5"
            style={{ boxShadow: '0 0 24px rgba(196,0,0,0.25)' }}>
            <Skull className="w-8 h-8 text-brand-light animate-flicker" />
          </div>
          <p className="font-heading text-xl tracking-[0.2em] uppercase text-text-secondary animate-pulse">Cargando partida</p>
        </div>
      </div>
    )
  }

  /* ── Game Over ── */
  if (game.gamePhase === 'ended') {
    const winner = game.players.find(p => p.id === game.winnerId)
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md w-full">
          <div className="glass p-10 relative">
            <div className="absolute top-0 left-0 w-6 h-6 border-t border-l border-accent-gold/40" />
            <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-accent-gold/40" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b border-l border-accent-gold/40" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b border-r border-accent-gold/40" />
            <div className="w-20 h-20 border border-accent-gold/40 bg-accent-gold/8 flex items-center justify-center mx-auto mb-6"
              style={{ boxShadow: '0 0 30px rgba(201,150,12,0.2)' }}>
              <Crown className="w-10 h-10 text-accent-gold" />
            </div>
            <h1 className="font-heading text-4xl tracking-[0.12em] uppercase text-text-primary mb-2">{winner?.name} Gana</h1>
            <p className="text-text-secondary text-sm mb-8">Sobreviviste a la Death Deck</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => navigate('/lobby')} className="btn-primary">Volver al Lobby</button>
              <button onClick={() => window.location.reload()} className="btn-secondary">
                <RotateCcw className="w-4 h-4" />
                Revancha
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  const currentPlayer = game.players[game.currentPlayerIndex]
  const myPlayer = game.players.find(p => p.id === user?.id)
  const isGhost = myPlayer?.isGhost || false
  const isMyTurn = currentPlayer?.id === user?.id
  const me = game.players[0]

  /* ── Card color styles ── */
  const cardStyle = (color: string) => {
    switch (color) {
      case 'green': return 'border-brand-dark/60 bg-surface-card shadow-[0_0_20px_rgba(196,0,0,0.15)]'
      case 'yellow': return 'border-accent-gold/50 bg-surface-card shadow-[0_0_20px_rgba(201,150,12,0.15)]'
      case 'red': return 'border-brand/60 bg-brand/10 shadow-[0_0_24px_rgba(196,0,0,0.3)]'
      default: return 'border-white/10 bg-surface-card'
    }
  }

  const cardIcon = (color: string) => {
    switch (color) {
      case 'red': return 'text-brand-light'
      case 'yellow': return 'text-accent-gold'
      default: return 'text-text-secondary'
    }
  }

  return (
    <div className="min-h-screen bg-surface overflow-hidden relative flex flex-col">

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[40%] bg-brand/5 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `linear-gradient(rgba(196,0,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(196,0,0,0.5) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Combo notification */}
      <AnimatePresence>
        {comboNotification && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 border border-brand-light/40 bg-brand/20 backdrop-blur-sm px-10 py-6 text-center"
            style={{ boxShadow: '0 0 40px rgba(196,0,0,0.4)' }}
          >
            <Sparkles className="w-7 h-7 text-brand-light mx-auto mb-2" />
            <p className="font-heading text-2xl tracking-[0.2em] uppercase text-text-primary">COMBO!</p>
            <p className="text-brand-light text-sm mt-1">{comboNotification.name}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Event */}
      <AnimatePresence>
        {showGlobalEvent && currentEvent && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 z-40 border border-brand/40 bg-brand/15 backdrop-blur-sm px-7 py-3"
            style={{ boxShadow: '0 0 24px rgba(196,0,0,0.3)' }}
          >
            <p className="font-heading tracking-widest uppercase text-text-primary">{currentEvent.name}</p>
            <p className="text-text-secondary text-xs mt-0.5">{currentEvent.description}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top bar */}
      <div className="relative z-20 flex items-center justify-between" style={{ padding: '14px 28px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>

        {/* Round */}
        <div style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(15,15,19,0.9)', padding: '8px 18px', textAlign: 'center', minWidth: '72px' }}>
          <p style={{ color: '#38363E', fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '2px' }}>Ronda</p>
          <p className="font-heading" style={{ fontSize: '1.5rem', color: '#FF2A2A', lineHeight: 1 }}>{game.round}</p>
        </div>

        {/* Dealer message — CRT style */}
        <div style={{
          border: '1px solid rgba(196,0,0,0.2)', background: 'rgba(8,8,9,0.85)',
          padding: '10px 20px', flex: 1, margin: '0 20px',
          boxShadow: 'inset 0 0 30px rgba(196,0,0,0.05)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <Skull style={{ width: '14px', height: '14px', color: '#C40000' }} className="animate-flicker" />
            <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(196,0,0,0.8)' }}>El Dealer</span>
            {game.turnDirection === -1 && <RotateCcw style={{ width: '11px', height: '11px', color: '#C9960C' }} />}
          </div>
          <p style={{ fontSize: '0.875rem', color: '#6E6A75', fontFamily: 'monospace' }}>{dealerMessage}</p>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {[
            { icon: soundEnabled ? <Volume2 style={{ width: '15px', height: '15px' }} /> : <VolumeX style={{ width: '15px', height: '15px', color: '#38363E' }} />, onClick: () => setSoundEnabled(!soundEnabled), active: false },
            { icon: <MessageSquare style={{ width: '15px', height: '15px', color: showChat ? '#FF2A2A' : undefined }} />, onClick: () => setShowChat(!showChat), active: showChat },
            { icon: showLog ? <ChevronDown style={{ width: '15px', height: '15px' }} /> : <ChevronUp style={{ width: '15px', height: '15px' }} />, onClick: () => setShowLog(!showLog), active: showLog },
          ].map((btn, i) => (
            <button key={i} onClick={btn.onClick} style={{
              border: btn.active ? '1px solid rgba(196,0,0,0.4)' : '1px solid rgba(255,255,255,0.06)',
              background: btn.active ? 'rgba(196,0,0,0.08)' : 'rgba(15,15,19,0.8)',
              padding: '10px', color: '#6E6A75', cursor: 'pointer', transition: 'all 0.15s',
            }}>
              {btn.icon}
            </button>
          ))}
        </div>
      </div>

      {/* Ghost indicator */}
      {isGhost && (
        <div className="relative z-20 flex justify-center mb-2">
          <div className="border border-brand/30 bg-brand/8 px-5 py-1.5 inline-flex items-center gap-2">
            <Ghost className="w-4 h-4 text-brand-light" />
            <span className="text-brand-light text-xs tracking-[0.15em] uppercase font-semibold">Eres fantasma — molesta a los vivos</span>
          </div>
        </div>
      )}

      {/* Main game area */}
      <div className="relative z-10 flex-1 flex items-center justify-center" style={{ padding: '0 28px' }}>
        {/* Subtle table oval */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '55%', height: '65%', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(196,0,0,0.04) 0%, transparent 70%)', border: '1px solid rgba(196,0,0,0.06)', pointerEvents: 'none' }} />
        <div className="relative w-full max-w-5xl" style={{ aspectRatio: '16/9' }}>

          {/* Opponents */}
          {game.players[1] && (
            <PlayerMini
              player={game.players[1]}
              isCurrent={game.players[1].isCurrentTurn}
              position="top"
              selectable={!!(currentCard?.color === 'red' && !game.players[1].isGhost)}
              selected={selectedTarget === game.players[1].id}
              onSelect={() => setSelectedTarget(game.players[1].id)}
            />
          )}
          {game.players[2] && (
            <PlayerMini
              player={game.players[2]}
              isCurrent={game.players[2].isCurrentTurn}
              position="left"
              selectable={!!(currentCard?.color === 'red' && !game.players[2].isGhost)}
              selected={selectedTarget === game.players[2].id}
              onSelect={() => setSelectedTarget(game.players[2].id)}
            />
          )}
          {game.players[3] && (
            <PlayerMini
              player={game.players[3]}
              isCurrent={game.players[3].isCurrentTurn}
              position="right"
              selectable={!!(currentCard?.color === 'red' && !game.players[3].isGhost)}
              selected={selectedTarget === game.players[3].id}
              onSelect={() => setSelectedTarget(game.players[3].id)}
            />
          )}

          {/* Center — deck & current card */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex flex-col items-center gap-4">

              {/* Draw button */}
              {!currentCard && isMyTurn && game.phase === 'draw' && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDraw}
                  className="w-32 h-48 border border-brand/50 bg-brand/10 flex items-center justify-center relative overflow-hidden"
                  style={{ boxShadow: '0 0 30px rgba(196,0,0,0.3)' }}
                >
                  <div className="absolute inset-2 border border-brand/20 pointer-events-none" />
                  <div className="text-center">
                    <Skull className="w-12 h-12 text-brand-light mx-auto mb-2 animate-flicker" />
                    <span className="font-heading text-lg tracking-[0.2em] uppercase text-text-primary">Robar</span>
                  </div>
                </motion.button>
              )}

              {/* Deck back (waiting) */}
              {!currentCard && (!isMyTurn || game.phase !== 'draw') && (
                <div className="w-32 h-48 border border-white/[0.08] bg-surface-card flex items-center justify-center relative">
                  <div className="absolute inset-2 border border-white/[0.04] pointer-events-none" />
                  <div className="text-center">
                    <Skull className="w-9 h-9 text-text-tertiary mx-auto mb-1" />
                    <span className="font-heading text-sm tracking-widest text-text-tertiary">{game.deck.length}</span>
                  </div>
                </div>
              )}

              {/* Current card drawn */}
              <AnimatePresence>
                {currentCard && (
                  <motion.div
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: -180 }}
                    className={`w-32 h-48 border-2 flex flex-col relative overflow-hidden ${cardStyle(currentCard.color)}`}
                  >
                    <div className="absolute inset-2 border border-white/[0.04] pointer-events-none" />
                    <div className="flex-1 flex items-center justify-center">
                      <Skull className={`w-9 h-9 ${cardIcon(currentCard.color)}`} />
                    </div>
                    <div className="border-t border-white/[0.06] px-3 py-2 text-center">
                      <p className="font-heading text-sm tracking-widest uppercase text-text-primary leading-tight">
                        {currentCard.name}
                      </p>
                      <p className="text-[10px] text-text-tertiary mt-0.5 leading-tight">
                        {currentCard.description}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Play button */}
              {currentCard && isMyTurn && game.phase === 'action' && (
                <motion.button
                  initial={{ y: 8, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  onClick={handlePlay}
                  className="btn-primary text-xs !py-2.5 !px-7"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Jugar
                </motion.button>
              )}
            </div>
          </div>

          {/* My player */}
          {me && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
              <motion.div
                animate={{ scale: me.isCurrentTurn ? 1.03 : 1 }}
                style={{
                  border: me.isCurrentTurn ? '1px solid rgba(196,0,0,0.45)' : '1px solid rgba(255,255,255,0.07)',
                  background: 'rgba(13,13,16,0.95)',
                  padding: '14px 20px',
                  boxShadow: me.isCurrentTurn ? '0 0 24px rgba(196,0,0,0.18), 0 0 0 1px rgba(196,0,0,0.08)' : 'none',
                  opacity: isGhost ? 0.5 : 1,
                  display: 'flex', alignItems: 'center', gap: '16px',
                }}
              >
                {/* Avatar */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: '48px', height: '48px', overflow: 'hidden', border: me.isCurrentTurn ? '2px solid rgba(196,0,0,0.5)' : '2px solid rgba(255,255,255,0.08)' }}>
                    <img src={me.avatar} alt={me.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  {isGhost && (
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,8,9,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Ghost style={{ width: '22px', height: '22px', color: 'rgba(196,0,0,0.7)' }} />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                    <p className="font-heading" style={{ fontSize: '0.875rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#EAE0D0' }}>{me.name}</p>
                    {me.isCurrentTurn && (
                      <span style={{ fontSize: '8px', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#FF2A2A', border: '1px solid rgba(196,0,0,0.3)', background: 'rgba(196,0,0,0.1)', padding: '2px 7px', fontWeight: 700 }}>Tu turno</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex', gap: '3px' }}>
                      {[...Array(Math.min(8, me.maxLives))].map((_, i) => (
                        <Heart key={i} style={{ width: '13px', height: '13px', color: i < me.lives ? '#C40000' : '#38363E', fill: i < me.lives ? '#C40000' : 'none' }} />
                      ))}
                    </div>
                    {me.shield && <Shield style={{ width: '13px', height: '13px', color: '#C9960C' }} />}
                    {me.reflect && <RotateCcw style={{ width: '13px', height: '13px', color: '#6E6A75' }} />}
                    {me.hasContract && <Crown style={{ width: '13px', height: '13px', color: '#C9960C' }} />}
                  </div>
                  {me.effects.length > 0 && (
                    <div style={{ display: 'flex', gap: '4px', marginTop: '5px' }}>
                      {me.effects.slice(0, 3).map((e, i) => (
                        <span key={i} style={{ fontSize: '8px', border: '1px solid rgba(196,0,0,0.2)', background: 'rgba(196,0,0,0.08)', color: '#FF2A2A', padding: '2px 6px', fontWeight: 600 }}>{e.name}</span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* Item bar / Ghost */}
      <div className="relative z-20 flex justify-center" style={{ padding: '12px 28px 20px' }}>
        {myPlayer && !isGhost && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(255,255,255,0.06)', background: 'rgba(13,13,16,0.9)', padding: '12px 20px' }}>
            <span style={{ fontSize: '9px', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#38363E', marginRight: '4px', fontWeight: 600 }}>Objetos</span>
            {[0, 1, 2].map(i => {
              const itm = myPlayer.items[i]
              return (
                <div key={i} style={{
                  width: '52px', height: '68px',
                  border: itm ? '1px solid rgba(196,0,0,0.35)' : '1px dashed rgba(255,255,255,0.06)',
                  background: itm ? 'rgba(196,0,0,0.08)' : 'transparent',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: '4px', transition: 'all 0.15s',
                }}>
                  {itm ? (
                    <span style={{ fontSize: '8px', fontWeight: 700, color: '#FF2A2A', textAlign: 'center', padding: '0 4px', lineHeight: 1.3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{itm.name}</span>
                  ) : (
                    <span style={{ fontSize: '10px', color: '#38363E', fontFamily: 'monospace' }}>{i + 1}</span>
                  )}
                </div>
              )
            })}
          </div>
        )}
        {isGhost && (
          <button
            onClick={handleGhostAction}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', border: '1px solid rgba(196,0,0,0.35)', background: 'rgba(196,0,0,0.08)', padding: '14px 32px', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(196,0,0,0.15)'; e.currentTarget.style.borderColor = 'rgba(196,0,0,0.55)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(196,0,0,0.08)'; e.currentTarget.style.borderColor = 'rgba(196,0,0,0.35)' }}
          >
            <Ghost style={{ width: '16px', height: '16px', color: '#FF2A2A' }} />
            <span className="font-heading" style={{ letterSpacing: '0.2em', textTransform: 'uppercase', color: '#FF2A2A', fontSize: '0.875rem' }}>Molestar</span>
          </button>
        )}
      </div>

      {/* Game Log */}
      <AnimatePresence>
        {showLog && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="absolute bottom-20 left-4 z-30 border border-white/[0.07] bg-surface-card/90 backdrop-blur-sm p-4 w-64 max-h-48 overflow-y-auto"
          >
            <p className="text-[10px] tracking-[0.2em] uppercase text-brand/70 font-semibold mb-2">Bitácora</p>
            {gameLog.slice(-8).map((msg, i) => (
              <p key={i} className="text-xs text-text-secondary mb-1 leading-relaxed font-mono">{msg}</p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            className="absolute right-0 top-0 bottom-0 w-72 z-30 border-l border-white/[0.06] bg-surface-card/95 backdrop-blur-sm p-5 flex flex-col"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-heading tracking-widest uppercase text-text-primary">Chat</h3>
              <button onClick={() => setShowChat(false)} className="p-1.5 hover:bg-surface-lighter transition-colors">
                <X className="w-4 h-4 text-text-tertiary" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 mb-4">
              {chatMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-text-tertiary text-xs tracking-widest">Sin mensajes</p>
                </div>
              ) : chatMessages.map((msg, i) => (
                <div key={i} className="border border-white/[0.05] bg-surface-lighter/50 px-3 py-2">
                  <p className="text-brand-light/80 font-bold text-[10px] tracking-widest uppercase">{msg.user}</p>
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ── PlayerMini component ── */
function PlayerMini({
  player, isCurrent, position, selectable, selected, onSelect
}: {
  player: PlayerType; isCurrent: boolean; position: 'top' | 'left' | 'right'
  selectable?: boolean; selected?: boolean; onSelect?: () => void
}) {
  const posStyle =
    position === 'top'
      ? { top: 0, left: '50%', transform: 'translateX(-50%)' }
      : position === 'left'
        ? { left: 0, top: '50%', transform: 'translateY(-50%)' }
        : { right: 0, top: '50%', transform: 'translateY(-50%)' }

  const borderColor = selected
    ? 'rgba(196,0,0,0.6)'
    : isCurrent
      ? 'rgba(196,0,0,0.45)'
      : selectable
        ? 'rgba(255,255,255,0.1)'
        : player.isGhost
          ? 'rgba(255,255,255,0.03)'
          : 'rgba(255,255,255,0.07)'

  const bgColor = selected
    ? 'rgba(196,0,0,0.1)'
    : isCurrent
      ? 'rgba(13,13,16,0.95)'
      : 'rgba(13,13,16,0.88)'

  return (
    <motion.div
      style={{ position: 'absolute', ...posStyle }}
      animate={{ scale: isCurrent ? 1.05 : 1 }}
    >
      <div
        onClick={selectable && onSelect ? onSelect : undefined}
        style={{
          border: `1px solid ${borderColor}`,
          background: bgColor,
          padding: '12px 16px',
          cursor: selectable ? 'pointer' : 'default',
          opacity: player.isGhost && !selectable ? 0.4 : 1,
          transition: 'all 0.2s',
          position: 'relative',
          boxShadow: isCurrent ? '0 0 16px rgba(196,0,0,0.18)' : 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Avatar */}
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{
              width: '38px', height: '38px', overflow: 'hidden',
              border: isCurrent ? '1px solid rgba(196,0,0,0.5)' : '1px solid rgba(255,255,255,0.08)',
            }}>
              <img
                src={player.avatar}
                alt={player.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.name}` }}
              />
            </div>
            {player.isGhost && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(8,8,9,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Ghost style={{ width: '14px', height: '14px', color: 'rgba(196,0,0,0.6)' }} />
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="font-heading" style={{ fontSize: '0.75rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#EAE0D0', whiteSpace: 'nowrap', marginBottom: '4px' }}>
              {player.name}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[...Array(Math.min(5, player.maxLives))].map((_, i) => (
                  <Heart key={i} style={{ width: '10px', height: '10px', color: i < player.lives ? '#C40000' : '#38363E', fill: i < player.lives ? '#C40000' : 'none' }} />
                ))}
              </div>
              {player.shield && <Shield style={{ width: '10px', height: '10px', color: '#C9960C' }} />}
              {player.reflect && <RotateCcw style={{ width: '10px', height: '10px', color: '#6E6A75' }} />}
            </div>
            {player.effects.length > 0 && (
              <div style={{ display: 'flex', gap: '3px', marginTop: '4px' }}>
                {player.effects.slice(0, 2).map((e, i) => (
                  <span key={i} style={{ fontSize: '8px', border: '1px solid rgba(196,0,0,0.2)', color: '#FF2A2A', padding: '1px 5px', fontWeight: 600 }}>{e.name}</span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Turn pulse indicator */}
        {isCurrent && (
          <motion.div
            animate={{ opacity: [1, 0.25, 1] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            style={{
              position: 'absolute', top: '-6px', right: '-6px',
              width: '14px', height: '14px',
              background: '#C40000', border: '1px solid rgba(255,42,42,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 10px rgba(196,0,0,0.7)',
            }}
          >
            <Play style={{ width: '7px', height: '7px', color: '#EAE0D0', fill: '#EAE0D0', marginLeft: '1px' }} />
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
