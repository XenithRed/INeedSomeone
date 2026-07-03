import type { GameState, Player, Card, StatusEffect, GlobalEvent, GlobalEventType } from '../types/game'
import { createShuffledDeck } from './cards'

const DEALER_COMMENTS = {
  green: ['¡La suerte te sonríe!', 'Una bendición...', 'El destino está contigo.'],
  yellow: ['Algo interesante sucede...', 'El universo se mueve...', '*risa del Dealer*'],
  red: ['La muerte llama...', 'Alguien va a sufrir.', 'El dolor es inevitable.'],
  black: ['¡OH! Esto es peligroso...', '*silencio incómodo*', 'La carta maldita...'],
  items: ['Usas tu objeto sabiamente...', 'Buena elección.', 'Veamos qué tienes...'],
  ghost: ['Los muertos se agitan...', 'Uh... un fantasma.', 'Los caídos nunca descansan.'],
  event: ['¡EVENTO GLOBAL!', 'La mesa tiembla...', 'Todo cambia ahora...']
}

export function getDealerComment(type: keyof typeof DEALER_COMMENTS): string {
  const comments = DEALER_COMMENTS[type]
  return comments[Math.floor(Math.random() * comments.length)]
}

export function initializeGame(players: Player[]): GameState {
  const deck = createShuffledDeck()

  const gamePlayers: Player[] = players.map(player => ({
    ...player,
    lives: 5,
    maxLives: 5,
    tempMaxLives: 0,
    items: [null, null, null],
    shield: false,
    reflect: false,
    isGhost: false,
    isCurrentTurn: false,
    skippedTurns: 0,
    effects: [],
    hasContract: false,
    comboCount: 0,
    riskMeter: 0
  }))

  gamePlayers[0].isCurrentTurn = true

  return {
    id: crypto.randomUUID(),
    players: gamePlayers,
    deck,
    discardPile: [],
    currentPlayerIndex: 0,
    turnDirection: 1,
    round: 1,
    phase: 'draw',
    gamePhase: 'playing',
    ghostCardQueue: [],
    lastActions: []
  }
}

export function drawCard(game: GameState): Card | null {
  if (game.deck.length === 0) {
    if (game.discardPile.length === 0) return null
    game.deck = [...game.discardPile]
    game.discardPile = []
    shuffleArray(game.deck)
  }
  const card = game.deck.pop()
  return card || null
}

export function applyCardEffect(
  game: GameState,
  card: Card,
  playerId: string,
  targetId?: string
): string[] {
  const messages: string[] = []

  card.effect(game, playerId, targetId)
  messages.push(`¡${card.name}!`)

  // Process ghost card queue
  const now = game.round
  const activated = game.ghostCardQueue.filter(q => q.activationRound <= now)
  game.ghostCardQueue = game.ghostCardQueue.filter(q => q.activationRound > now)

  activated.forEach(q => {
    q.card.effect(game, q.ownerId)
    messages.push(`¡Carta Fantasma activada!`)
  })

  // Process status effects
  processStatusEffects(game)

  // Apply risk meter
  const player = game.players.find(p => p.id === playerId)
  if (player) {
    player.riskMeter = Math.max(0, player.riskMeter - 1)
  }

  // Process global event
  if (game.globalEvent && game.round % game.globalEvent.duration === 0) {
    game.globalEvent = undefined
    messages.push('El evento global ha terminado.')
  }

  return messages
}

export function processStatusEffects(game: GameState): void {
  game.players.forEach(player => {
    if (player.isGhost) return

    player.effects = player.effects.filter(effect => {
      switch (effect.type) {
        case 'poison':
          player.lives -= effect.stacks || 1
          break
        case 'burn':
        case 'on_fire':
          player.lives--
          break
        case 'bleeding':
          player.lives--
          break
        case 'decay':
          player.maxLives = Math.max(1, player.maxLives - 1)
          player.lives = Math.min(player.lives, player.maxLives)
          break
      }
      effect.duration--
      return effect.duration > 0
    })
  })
}

export function applyDamage(target: Player, damage: number, ignoreShield = false): boolean {
  if (target.isGhost) return false

  if (target.reflect) {
    return false
  }

  if (target.shield && !ignoreShield) {
    target.shield = false
    return false
  }

  target.lives -= damage
  if (target.lives <= 0) {
    target.lives = 0
    if (target.hasContract) {
      target.lives = 1
      target.hasContract = false
      return false
    }
    target.isGhost = true
    return true
  }
  return false
}

export function hasActiveEffect(player: Player, effectType: string): boolean {
  return player.effects.some(e => e.type === effectType)
}

export function addEffect(player: Player, effect: StatusEffect): void {
  const existing = player.effects.find(e => e.type === effect.type)
  if (existing) {
    existing.duration = Math.max(existing.duration, effect.duration)
    if (effect.stacks) {
      existing.stacks = (existing.stacks || 1) + effect.stacks
    }
  } else {
    player.effects.push({ ...effect })
  }
}

export function nextTurn(game: GameState): void {
  const current = game.players[game.currentPlayerIndex]
  current.isCurrentTurn = false

  if (current.skippedTurns > 0) {
    current.skippedTurns--
    // Skip this player again
  }

  // Apply turn direction
  const totalPlayers = game.players.length
  let nextIndex = game.currentPlayerIndex + game.turnDirection

  if (nextIndex < 0) nextIndex = totalPlayers - 1
  if (nextIndex >= totalPlayers) nextIndex = 0

  game.currentPlayerIndex = nextIndex

  // Ghost players
  let safety = 0
  while (
    (game.players[game.currentPlayerIndex].isGhost ||
     game.players[game.currentPlayerIndex].skippedTurns > 0) &&
    safety < totalPlayers
  ) {
    nextIndex = game.currentPlayerIndex + game.turnDirection
    if (nextIndex < 0) nextIndex = totalPlayers - 1
    if (nextIndex >= totalPlayers) nextIndex = 0
    game.currentPlayerIndex = nextIndex
    safety++
  }

  if (safety >= totalPlayers) {
    checkGameOver(game)
    return
  }

  game.players[game.currentPlayerIndex].isCurrentTurn = true
  game.phase = 'draw'

  // New round
  if (game.currentPlayerIndex === 0) {
    game.round++
    triggerGlobalEvent(game)
  }
}

export function triggerGlobalEvent(game: GameState): void {
  if (game.round % 4 !== 0) return

  const events: GlobalEventType[] = [
    'storm', 'darkness', 'earthquake', 'fire', 'rain', 'fog',
    'dealer_angry', 'dealer_happy', 'duplicate_cards', 'all_draw',
    'all_lose_life', 'inverted_deck', 'silent_round'
  ]

  const type = events[Math.floor(Math.random() * events.length)]
  const event = createGlobalEvent(type)

  game.globalEvent = event

  switch (type) {
    case 'storm':
      game.players.forEach(p => {
        if (!p.isGhost) {
          if (Math.random() < 0.3) {
            p.lives = Math.max(0, p.lives - 1)
          }
        }
      })
      break
    case 'darkness':
      // UI handles this - hide player info
      break
    case 'earthquake':
      shuffleArray(game.deck)
      break
    case 'all_lose_life':
      game.players.forEach(p => {
        if (!p.isGhost) p.lives = Math.max(0, p.lives - 1)
      })
      break
    case 'inverted_deck':
      game.turnDirection = game.turnDirection === 1 ? -1 : 1
      break
    case 'dealer_angry':
      const target = game.players[Math.floor(Math.random() * game.players.length)]
      if (!target.isGhost) target.lives = Math.max(0, target.lives - 1)
      break
    case 'dealer_happy':
      game.players.forEach(p => {
        if (!p.isGhost) p.lives = Math.min(p.lives + 1, p.maxLives)
      })
      break
  }
}

export function createGlobalEvent(type: GlobalEventType): GlobalEvent {
  const eventData: Record<GlobalEventType, { name: string; description: string }> = {
    storm: { name: 'Tormenta', description: '30% de probabilidad de recibir daño' },
    darkness: { name: 'Oscuridad', description: 'No puedes ver las cartas de los demás' },
    earthquake: { name: 'Terremoto', description: 'El mazo se ha mezclado' },
    fire: { name: 'Incendio', description: 'Cartas quemadas al azar' },
    gravity: { name: 'Gravedad Alterada', description: 'Las cartas pesan más' },
    rain: { name: 'Lluvia', description: 'Las cartas resbalan' },
    fog: { name: 'Niebla', description: 'Todo es confuso' },
    dealer_angry: { name: 'Dealer Enojado', description: 'El Dealer ataca al azar' },
    dealer_happy: { name: 'Dealer Feliz', description: 'El Dealer regala vida' },
    duplicate_cards: { name: 'Cartas Duplicadas', description: 'Las cartas se duplican' },
    free_items: { name: 'Objetos Gratis', description: 'Todos obtienen un objeto' },
    all_draw: { name: 'Robo Colectivo', description: 'Todos roban una carta' },
    all_lose_life: { name: 'Sacrificio', description: 'Todos pierden 1 vida' },
    inverted_deck: { name: 'Mazo Invertido', description: 'El orden del turno se invierte' },
    chaos_mode: { name: 'Modo Caótico', description: 'Todo es aleatorio' },
    silent_round: { name: 'Ronda Silenciosa', description: 'No se permiten objetos' }
  }

  const data = eventData[type]
  return {
    type,
    name: data.name,
    description: data.description,
    duration: 2
  }
}

export function checkGameOver(game: GameState): boolean {
  const alivePlayers = game.players.filter(p => !p.isGhost && p.lives > 0)

  if (alivePlayers.length <= 1) {
    game.gamePhase = 'ended'
    game.phase = 'ended'
    if (alivePlayers.length === 1) {
      game.winnerId = alivePlayers[0].id
    }
    return true
  }

  return false
}

export function applyGhostAction(_game: GameState, _ghostPlayerId: string): string {
  const actions = [
    'apagar_luces',
    'mover_carta',
    'hacer_ruido',
    'susurrar'
  ]

  const action = actions[Math.floor(Math.random() * actions.length)]

  switch (action) {
    case 'apagar_luces':
      return 'Un fantasma apagó las luces...'
    case 'mover_carta':
      return 'Una carta se movió sola...'
    case 'hacer_ruido':
      return 'Se escuchó un golpe en la mesa...'
    case 'susurrar':
      return 'Un susurro recorre la sala...'
    default:
      return 'Algo sobrenatural sucede...'
  }
}

export function checkCombo(_player: Player, cards: string[]): { name: string; description: string } | null {
  const combos = [
    {
      name: 'Escudo Sagrado',
      description: 'Curación + Escudo = Vida adicional',
      triggers: ['heal_1', 'shield'],
      effect: (p: Player) => { p.lives = Math.min(p.lives + 1, p.maxLives) }
    },
    {
      name: 'Doble Golpe',
      description: 'Ataque + Ataque = Daño doble',
      triggers: ['attack_1', 'attack_1'],
      effect: undefined
    },
    {
      name: 'Explosión Reflectante',
      description: 'Bomba + Espejo = Todos reciben daño menos tú',
      triggers: ['explosion', 'mirror'],
      effect: undefined
    }
  ]

  for (const combo of combos) {
    if (combo.triggers.every(t => cards.includes(t))) {
      return { name: combo.name, description: combo.description }
    }
  }

  return null
}

function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}
