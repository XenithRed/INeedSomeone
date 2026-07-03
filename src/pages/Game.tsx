import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Heart, Skull, Shield, MessageSquare, Play, X, RotateCcw, Ghost, Sparkles, ChevronDown, ChevronUp, Crown, Volume2, VolumeX } from 'lucide-react'
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
        items: [null, null, null], shield: true, reflect: false,
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

  // --- Loading ---
  if (!game) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-brand to-accent-pink flex items-center justify-center mx-auto mb-6 shadow-glow-sm">
            <Skull className="w-10 h-10 text-white" />
          </div>
          <p className="text-lg font-medium text-text-secondary animate-pulse">Cargando partida...</p>
        </div>
      </div>
    )
  }

  // --- Game Over ---
  if (game.gamePhase === 'ended') {
    const winner = game.players.find(p => p.id === game.winnerId)
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center p-6">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md w-full">
          <div className="glass rounded-4xl p-10">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-accent-amber/30 to-accent-amber/10 flex items-center justify-center mx-auto mb-6">
              <Crown className="w-12 h-12 text-accent-amber" />
            </div>
            <h1 className="text-4xl font-extrabold text-white mb-2">{winner?.name} Gana!</h1>
            <p className="text-text-secondary mb-8">Sobreviviste a la Death Deck</p>
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

  return (
    <div className="min-h-screen bg-surface overflow-hidden relative flex flex-col">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[30%] h-[30%] bg-brand/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[30%] bg-accent-pink/5 rounded-full blur-[100px]" />
      </div>

      {/* Combo notification */}
      <AnimatePresence>
        {comboNotification && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
            className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 z-40 bg-gradient-to-br from-brand to-accent-pink rounded-4xl px-10 py-6 shadow-glow-lg text-center">
            <Sparkles className="w-8 h-8 text-white mx-auto mb-2" />
            <p className="font-extrabold text-2xl text-white">COMBO!</p>
            <p className="text-white/90 font-bold">{comboNotification.name}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Event */}
      <AnimatePresence>
        {showGlobalEvent && currentEvent && (
          <motion.div initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -60, opacity: 0 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 z-40 bg-gradient-to-br from-brand to-accent-pink rounded-2xl px-8 py-4 shadow-glow">
            <p className="font-extrabold text-white text-lg">{currentEvent.name}</p>
            <p className="text-white/70 text-sm">{currentEvent.description}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top bar */}
      <div className="relative z-20 flex items-center justify-between px-5 py-4">
        <div className="glass rounded-2xl px-4 py-2.5 text-center min-w-[72px]">
          <p className="text-text-tertiary text-xs font-medium">RONDA</p>
          <p className="text-xl font-extrabold text-brand-light">{game.round}</p>
        </div>

        <div className="glass rounded-2xl px-5 py-3 max-w-md flex-1 mx-4">
          <div className="flex items-center gap-2 mb-1">
            <Skull className="w-5 h-5 text-accent-pink" />
            <span className="text-xs font-bold text-accent-pink uppercase tracking-wider">Dealer</span>
            {game.turnDirection === -1 && <RotateCcw className="w-3.5 h-3.5 text-accent-amber" />}
          </div>
          <p className="text-sm text-text-primary">{dealerMessage}</p>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setSoundEnabled(!soundEnabled)} className="glass rounded-2xl p-3">
            {soundEnabled ? <Volume2 className="w-5 h-5 text-text-secondary" /> : <VolumeX className="w-5 h-5 text-text-tertiary" />}
          </button>
          <button onClick={() => setShowChat(!showChat)} className="glass rounded-2xl p-3">
            <MessageSquare className="w-5 h-5 text-text-secondary" />
          </button>
          <button onClick={() => setShowLog(!showLog)} className="glass rounded-2xl p-3">
            {showLog ? <ChevronDown className="w-5 h-5 text-text-secondary" /> : <ChevronUp className="w-5 h-5 text-text-secondary" />}
          </button>
        </div>
      </div>

      {/* Ghost indicator */}
      {isGhost && (
        <div className="relative z-20 flex justify-center mb-2">
          <div className="bg-accent-pink/10 border border-accent-pink/20 rounded-full px-5 py-1.5 inline-flex items-center gap-2">
            <Ghost className="w-4 h-4 text-accent-pink" />
            <span className="text-accent-pink text-xs font-bold">Eres fantasma — molesta a los vivos</span>
          </div>
        </div>
      )}

      {/* Main game area */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6">
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

          {/* Center */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex flex-col items-center gap-4">
              {!currentCard && isMyTurn && game.phase === 'draw' && (
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleDraw}
                  className="w-36 h-52 rounded-2xl bg-gradient-to-br from-brand to-accent-pink shadow-glow flex items-center justify-center"
                >
                  <div className="text-center">
                    <Skull className="w-14 h-14 text-white/90 mx-auto mb-2" />
                    <span className="font-extrabold text-lg text-white">ROBAR</span>
                  </div>
                </motion.button>
              )}
              {!currentCard && (!isMyTurn || game.phase !== 'draw') && (
                <div className="w-36 h-52 rounded-2xl bg-surface-lighter/80 border border-border flex items-center justify-center">
                  <div className="text-center">
                    <Skull className="w-10 h-10 text-text-tertiary mx-auto mb-1" />
                    <span className="font-bold text-text-tertiary">{game.deck.length}</span>
                  </div>
                </div>
              )}

              <AnimatePresence>
                {currentCard && (
                  <motion.div
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: -180 }}
                    className={`w-36 h-52 rounded-2xl border-2 shadow-xl flex flex-col p-4 ${
                      currentCard.color === 'green' ? 'bg-gradient-to-br from-accent-emerald/90 to-accent-emerald/70 border-accent-emerald/50' :
                      currentCard.color === 'yellow' ? 'bg-gradient-to-br from-accent-amber/90 to-accent-amber/70 border-accent-amber/50' :
                      currentCard.color === 'red' ? 'bg-gradient-to-br from-accent-red/90 to-accent-red/70 border-accent-red/50' :
                      'bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700'
                    }`}
                  >
                    <div className="flex-1 flex items-center justify-center">
                      <Skull className={`w-10 h-10 ${currentCard.color === 'yellow' ? 'text-black/60' : 'text-white/80'}`} />
                    </div>
                    <div className="text-center">
                      <p className={`font-extrabold text-base leading-tight ${currentCard.color === 'yellow' ? 'text-black' : 'text-white'}`}>
                        {currentCard.name}
                      </p>
                      <p className={`text-[11px] mt-0.5 ${currentCard.color === 'yellow' ? 'text-black/60' : 'text-white/60'}`}>
                        {currentCard.description}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {currentCard && isMyTurn && game.phase === 'action' && (
                <motion.button initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                  onClick={handlePlay} className="btn-primary !py-3 !px-8 text-sm">
                  <Play className="w-4 h-4 fill-current" />
                  Jugar
                </motion.button>
              )}
            </div>
          </div>

          {/* My player */}
          {me && (
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2">
              <motion.div animate={{ scale: me.isCurrentTurn ? 1.05 : 1 }}
                className={`glass rounded-2xl px-6 py-4 border-2 ${me.isCurrentTurn ? 'border-accent-amber/50 shadow-glow-sm' : 'border-border'} ${isGhost ? 'opacity-50' : ''}`}>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className={`w-14 h-14 rounded-full overflow-hidden ring-2 ${me.isCurrentTurn ? 'ring-accent-amber/40' : 'ring-border'}`}>
                      <img src={me.avatar} alt={me.name} className="w-full h-full object-cover" />
                    </div>
                    {isGhost && <div className="absolute inset-0 rounded-full bg-surface/60 flex items-center justify-center"><Ghost className="w-7 h-7 text-accent-pink" /></div>}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-extrabold text-white">{me.name}</p>
                      <span className="badge bg-brand/10 text-brand-light border border-brand/20 text-[10px]">T</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex gap-0.5">
                        {[...Array(Math.min(8, me.maxLives))].map((_, i) => (
                          <Heart key={i} className={`w-4 h-4 ${i < me.lives ? 'text-accent-red fill-accent-red' : 'text-text-tertiary'}`} />
                        ))}
                      </div>
                      {me.shield && <Shield className="w-4 h-4 text-accent-teal" />}
                      {me.reflect && <RotateCcw className="w-4 h-4 text-brand-light" />}
                      {me.hasContract && <Crown className="w-4 h-4 text-accent-amber" />}
                    </div>
                    {me.effects.length > 0 && (
                      <div className="flex gap-1 mt-1">
                        {me.effects.slice(0, 3).map((e, i) => (
                          <span key={i} className="text-[10px] bg-accent-red/15 text-accent-red px-1.5 py-0.5 rounded-full font-medium">{e.name}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>

      {/* Item bar / Ghost */}
      <div className="relative z-20 flex justify-center pb-4">
        {myPlayer && !isGhost && (
          <div className="glass rounded-2xl px-5 py-3 flex items-center gap-3">
            <span className="text-text-tertiary text-xs font-medium uppercase tracking-wider">Objetos</span>
            {[0, 1, 2].map(i => {
              const item = myPlayer.items[i]
              return (
                <div key={i} className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center transition-all ${
                  item ? 'border-brand/30 bg-brand/5' : 'border-dashed border-border bg-surface-lighter/30'
                }`}>
                  {item ? (
                    <span className="text-xs font-bold text-brand-light text-center px-1 leading-tight">{item.name}</span>
                  ) : (
                    <span className="text-text-tertiary text-[10px]">{i + 1}</span>
                  )}
                </div>
              )
            })}
          </div>
        )}
        {isGhost && (
          <button onClick={handleGhostAction} className="glass rounded-2xl px-6 py-3 border-accent-pink/30 hover:border-accent-pink/60 transition-all flex items-center gap-2">
            <Ghost className="w-5 h-5 text-accent-pink" />
            <span className="font-bold text-accent-pink text-sm">Molestar</span>
          </button>
        )}
      </div>

      {/* Log */}
      <AnimatePresence>
        {showLog && (
          <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }}
            className="absolute bottom-20 left-4 z-30 glass rounded-2xl p-4 w-64 max-h-48 overflow-y-auto">
            <p className="text-xs font-bold text-brand-light uppercase tracking-wider mb-2">Bitácora</p>
            {gameLog.slice(-8).map((msg, i) => (
              <p key={i} className="text-xs text-text-secondary mb-1 leading-relaxed">{msg}</p>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat */}
      <AnimatePresence>
        {showChat && (
          <motion.div initial={{ x: 320 }} animate={{ x: 0 }} exit={{ x: 320 }}
            className="absolute right-0 top-0 bottom-0 w-80 z-30 glass rounded-l-3xl p-5 flex flex-col border-l border-border">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-white">Chat</h3>
              <button onClick={() => setShowChat(false)} className="p-1.5 rounded-lg hover:bg-surface-lighter transition-colors">
                <X className="w-4 h-4 text-text-tertiary" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2 mb-4">
              {chatMessages.length === 0 ? (
                <div className="flex items-center justify-center h-full"><p className="text-text-tertiary text-sm">Sin mensajes</p></div>
              ) : chatMessages.map((msg, i) => (
                <div key={i} className="bg-surface-lighter/50 rounded-xl px-3 py-2">
                  <p className="text-brand-light font-bold text-xs">{msg.user}</p>
                  <p className="text-text-secondary text-sm">{msg.message}</p>
                </div>
              ))}
            </div>
            <form onSubmit={sendMessage} className="flex gap-2">
              <input type="text" value={newMessage} onChange={e => setNewMessage(e.target.value)} placeholder="Escribe..." className="input-field !py-2.5 !text-sm flex-1" />
              <button type="submit" className="btn-primary !p-2.5 !rounded-xl"><Play className="w-4 h-4 fill-current rotate-180" /></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function PlayerMini({
  player, isCurrent, position, selectable, selected, onSelect
}: {
  player: PlayerType; isCurrent: boolean; position: 'top' | 'left' | 'right'
  selectable?: boolean; selected?: boolean; onSelect?: () => void
}) {
  const posClass = position === 'top' ? 'top-0 left-1/2 -translate-x-1/2' :
    position === 'left' ? 'left-0 top-1/2 -translate-y-1/2' :
    'right-0 top-1/2 -translate-y-1/2'

  return (
    <motion.div className={`absolute ${posClass}`} animate={{ scale: isCurrent ? 1.08 : 1 }}>
      <div onClick={selectable && onSelect ? onSelect : undefined}
        className={`glass rounded-2xl px-4 py-3 border-2 transition-all cursor-default ${
          isCurrent ? 'border-accent-amber/50 shadow-glow-sm' :
          selected ? 'border-accent-red/50' :
          selectable ? 'border-brand/30 cursor-pointer hover:border-accent-red/50' :
          player.isGhost ? 'border-border/50 opacity-50' : 'border-border'
        }`}>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-10 h-10 rounded-full overflow-hidden ring-2 ${isCurrent ? 'ring-accent-amber/40' : 'ring-border'}`}>
              <img src={player.avatar} alt={player.name} className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${player.name}` }}
              />
            </div>
            {player.isGhost && <div className="absolute inset-0 rounded-full bg-surface/60 flex items-center justify-center"><Ghost className="w-5 h-5 text-accent-pink" /></div>}
          </div>
          <div>
            <p className="font-bold text-white text-sm whitespace-nowrap">{player.name}</p>
            <div className="flex items-center gap-1.5">
              <div className="flex gap-0.5">
                {[...Array(Math.min(5, player.maxLives))].map((_, i) => (
                  <Heart key={i} className={`w-3 h-3 ${i < player.lives ? 'text-accent-red fill-accent-red' : 'text-text-tertiary'}`} />
                ))}
              </div>
              {player.shield && <Shield className="w-3 h-3 text-accent-teal" />}
              {player.reflect && <RotateCcw className="w-3 h-3 text-brand-light" />}
            </div>
            {player.effects.length > 0 && (
              <div className="flex gap-1 mt-1">
                {player.effects.slice(0, 2).map((e, i) => (
                  <span key={i} className="text-[10px] bg-accent-red/15 text-accent-red px-1.5 py-0.5 rounded-full font-medium">{e.name}</span>
                ))}
              </div>
            )}
          </div>
        </div>
        {isCurrent && (
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-accent-amber flex items-center justify-center shadow-glow-sm">
            <Play className="w-3 h-3 text-white fill-white ml-0.5" />
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}
