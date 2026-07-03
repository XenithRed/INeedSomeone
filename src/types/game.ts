export type CardColor = 'green' | 'yellow' | 'red' | 'black'

export type CardRarity = 'common' | 'rare' | 'legendary'

export type StatusEffectType =
  | 'poison' | 'burn' | 'frozen' | 'electrified' | 'asleep'
  | 'silenced' | 'confused' | 'cursed' | 'bleeding' | 'blinded'
  | 'insanity' | 'reflect' | 'invulnerable' | 'fragile' | 'weak'
  | 'fortified' | 'invisible' | 'marked' | 'stolen' | 'blocked'
  | 'sealed' | 'on_fire' | 'hypnosis' | 'paralysis' | 'fear'
  | 'slowed' | 'hasted' | 'magic_shield' | 'physical_shield'
  | 'divine_protection' | 'life_steal' | 'thorns' | 'decay'
  | 'corruption' | 'purified'

export type GlobalEventType =
  | 'storm' | 'darkness' | 'earthquake' | 'fire' | 'gravity'
  | 'rain' | 'fog' | 'dealer_angry' | 'dealer_happy'
  | 'duplicate_cards' | 'free_items' | 'all_draw' | 'all_lose_life'
  | 'inverted_deck' | 'chaos_mode' | 'silent_round'

export interface StatusEffect {
  type: StatusEffectType
  name: string
  description: string
  duration: number
  stacks?: number
}

export interface ComboEffect {
  name: string
  description: string
  cards: string[]
  effect: (game: GameState, playerId: string) => void
}

export interface Card {
  id: string
  name: string
  color: CardColor
  rarity: CardRarity
  description: string
  damage?: number
  heal?: number
  effect: (game: GameState, playerId: string, targetId?: string) => void
}

export type ItemRarity = 'common' | 'rare' | 'legendary'

export interface Item {
  id: string
  name: string
  rarity: ItemRarity
  description: string
  animation?: string
  sound?: string
  duration?: number
  cooldown?: number
  combos?: string[]
  counters?: string[]
  counteredBy?: string[]
  effect: (game: GameState, playerId: string, targetId?: string) => void
}

export interface Player {
  id: string
  name: string
  avatar: string
  lives: number
  maxLives: number
  tempMaxLives: number
  items: (Item | null)[]
  shield: boolean
  reflect: boolean
  isGhost: boolean
  isCurrentTurn: boolean
  skippedTurns: number
  effects: StatusEffect[]
  hasContract: boolean
  comboCount: number
  riskMeter: number
}

export interface GameState {
  id: string
  players: Player[]
  deck: Card[]
  discardPile: Card[]
  currentPlayerIndex: number
  turnDirection: 1 | -1
  round: number
  phase: 'waiting' | 'draw' | 'action' | 'ended'
  gamePhase: 'waiting' | 'playing' | 'ended'
  winnerId?: string
  globalEvent?: GlobalEvent
  ghostCardQueue: { card: Card; activationRound: number; ownerId: string }[]
  lastActions: string[]
}

export interface GlobalEvent {
  type: GlobalEventType
  name: string
  description: string
  duration: number
}

export interface GameRoom {
  id: string
  name: string
  hostId: string
  maxPlayers: number
  players: string[]
  gameState?: GameState
  isPrivate: boolean
  createdAt: Date
}

export interface PlayerStats {
  wins: number
  losses: number
  totalGames: number
  totalPlayTime: number
  damageDealt: number
  damageTaken: number
  cardsDrawn: number
  cardsPlayed: number
  itemsUsed: number
  highestStreak: number
  eliminations: number
}
