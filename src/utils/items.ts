import type { Item, GameState } from '../types/game'

export const ALL_ITEMS: Item[] = [
  {
    id: 'magnifying_glass',
    name: 'Lupa',
    rarity: 'common',
    description: 'Miras las próximas 3 cartas',
    animation: 'peek',
    sound: 'glass',
    effect: (game: GameState, playerId: string) => {
      const topCards = game.deck.slice(-3)
      const player = game.players.find(p => p.id === playerId)
      if (!player) return
      game.lastActions.push(`${player.name} usó Lupa y vio: ${topCards.map(c => c.name).join(', ')}`)
    }
  },
  {
    id: 'lock',
    name: 'Candado',
    rarity: 'common',
    description: 'Bloquea un ataque',
    duration: 1,
    cooldown: 2,
    effect: (game: GameState, playerId: string) => {
      const player = game.players.find(p => p.id === playerId)
      if (player) player.shield = true
    }
  },
  {
    id: 'bandage',
    name: 'Venda',
    rarity: 'common',
    description: 'Recupera 1 vida',
    effect: (game: GameState, playerId: string) => {
      const player = game.players.find(p => p.id === playerId)
      if (player && player.lives < player.maxLives) player.lives++
    }
  },
  {
    id: 'gloves',
    name: 'Guantes',
    rarity: 'common',
    description: 'Robas un objeto de otro jugador',
    animation: 'steal',
    effect: (game: GameState, playerId: string, targetId?: string) => {
      if (!targetId) return
      const target = game.players.find(p => p.id === targetId)
      const player = game.players.find(p => p.id === playerId)
      if (!target || !player) return

      const itemIndex = target.items.findIndex(i => i !== null)
      if (itemIndex >= 0) {
        const emptySlot = player.items.findIndex(i => i === null)
        if (emptySlot >= 0) {
          player.items[emptySlot] = target.items[itemIndex]
          target.items[itemIndex] = null
        }
      }
    }
  },
  {
    id: 'knife',
    name: 'Cuchillo',
    rarity: 'common',
    description: 'Destruye un escudo',
    counters: ['shield'],
    effect: (game: GameState, _playerId: string, targetId?: string) => {
      if (!targetId) return
      const target = game.players.find(p => p.id === targetId)
      if (target) target.shield = false
    }
  },
  {
    id: 'mirror',
    name: 'Espejo',
    rarity: 'rare',
    description: 'Devuelve el daño al atacante',
    animation: 'reflect',
    duration: 2,
    effect: (game: GameState, playerId: string) => {
      const player = game.players.find(p => p.id === playerId)
      if (player) player.reflect = true
    }
  },
  {
    id: 'magnet',
    name: 'Imán',
    rarity: 'rare',
    description: 'Robas la mejor carta del descarte',
    effect: (game: GameState, _playerId: string) => {
      if (game.discardPile.length === 0) return
      const bestCard = game.discardPile.reduce((best, c) =>
        c.rarity === 'legendary' ? c :
        c.rarity === 'rare' && best.rarity !== 'legendary' ? c : best
      )
      game.discardPile = game.discardPile.filter(c => c.id !== bestCard.id)
      game.deck.push(bestCard)
    }
  },
  {
    id: 'scale',
    name: 'Balanza',
    rarity: 'rare',
    description: 'Intercambia vidas con otro jugador',
    animation: 'swap',
    effect: (game: GameState, playerId: string, targetId?: string) => {
      if (!targetId) return
      const target = game.players.find(p => p.id === targetId)
      const player = game.players.find(p => p.id === playerId)
      if (!target || !player || target.isGhost) return

      const tempLives = player.lives
      player.lives = target.lives
      target.lives = tempLives
    }
  },
  {
    id: 'clock',
    name: 'Reloj',
    rarity: 'rare',
    description: 'Juegas de nuevo después de tu turno',
    animation: 'time',
    effect: (game: GameState, playerId: string) => {
      const player = game.players.find(p => p.id === playerId)
      if (player) {
        player.skippedTurns = 0
        game.currentPlayerIndex = game.players.indexOf(player)
      }
    }
  },
  {
    id: 'bomb',
    name: 'Bomba',
    rarity: 'rare',
    description: 'Todos reciben 1 daño',
    animation: 'explosion',
    sound: 'explosion',
    effect: (game: GameState, playerId: string) => {
      game.players.forEach(player => {
        if (player.id !== playerId && !player.isGhost) {
          if (player.reflect) {
            player.reflect = false
          } else if (player.shield) {
            player.shield = false
          } else {
            player.lives--
          }
        }
      })
    }
  },
  {
    id: 'contract',
    name: 'Contrato',
    rarity: 'legendary',
    description: 'Si mueres, revives con 1 vida',
    animation: 'contract',
    effect: (game: GameState, playerId: string) => {
      const player = game.players.find(p => p.id === playerId)
      if (player) player.hasContract = true
    }
  },
  {
    id: 'cursed_deck',
    name: 'Baraja Maldita',
    rarity: 'legendary',
    description: 'Reordena las próximas 10 cartas a tu favor',
    effect: (game: GameState, _playerId: string) => {
      const top10 = game.deck.slice(-10)
      const rest = game.deck.slice(0, -10)
      top10.sort((a, b) => {
        const order: Record<string, number> = { green: 0, yellow: 1, red: 2, black: 3 }
        return order[a.color] - order[b.color]
      })
      game.deck = [...rest, ...top10]
    }
  },
  {
    id: 'dealer_eye',
    name: 'Ojo del Dealer',
    rarity: 'legendary',
    description: 'Ver todo el mazo por 10 segundos',
    effect: () => {}
  },
  {
    id: 'crown',
    name: 'Corona',
    rarity: 'legendary',
    description: 'Ganas 1 vida cada vez que alguien muere',
    effect: (game: GameState, playerId: string) => {
      const player = game.players.find(p => p.id === playerId)
      if (!player) return

      const recentlyDied = game.players.filter(p => p.isGhost)
      recentlyDied.forEach(() => {
        if (player.lives < player.maxLives) player.lives++
      })
    }
  }
]

export function getRandomItem(rarity?: 'common' | 'rare' | 'legendary'): Item | null {
  let pool = ALL_ITEMS

  if (rarity) {
    pool = ALL_ITEMS.filter(i => i.rarity === rarity)
  } else {
    const roll = Math.random()
    if (roll < 0.65) pool = ALL_ITEMS.filter(i => i.rarity === 'common')
    else if (roll < 0.9) pool = ALL_ITEMS.filter(i => i.rarity === 'rare')
    else pool = ALL_ITEMS.filter(i => i.rarity === 'legendary')
  }

  if (pool.length === 0) return null
  return pool[Math.floor(Math.random() * pool.length)]
}
