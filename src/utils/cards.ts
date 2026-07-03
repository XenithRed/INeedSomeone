import type { Card } from '../types/game'

export const ALL_CARDS: Card[] = [
  // Cartas Verdes (Curación/Defensa)
  {
    id: 'heal_1',
    name: 'Curación',
    color: 'green',
    rarity: 'common',
    description: '+1 vida',
    effect: (game, playerId) => {
      const player = game.players.find(p => p.id === playerId)
      if (player && player.lives < player.maxLives) {
        player.lives++
      }
    }
  },
  {
    id: 'max_life_2',
    name: 'Vida Máxima Temporal',
    color: 'green',
    rarity: 'rare',
    description: '+2 vidas máximas temporales',
    effect: (game, playerId) => {
      const player = game.players.find(p => p.id === playerId)
      if (player) {
        player.maxLives += 2
        player.lives += 2
      }
    }
  },
  {
    id: 'shield',
    name: 'Escudo',
    color: 'green',
    rarity: 'common',
    description: 'Ignora el próximo daño',
    effect: (game, playerId) => {
      const player = game.players.find(p => p.id === playerId)
      if (player) {
        player.shield = true
      }
    }
  },
  {
    id: 'duplicate_item',
    name: 'Duplicar Objeto',
    color: 'green',
    rarity: 'rare',
    description: 'Obtienes copia del siguiente objeto',
    effect: () => {}
  },
  {
    id: 'steal_card',
    name: 'Robo',
    color: 'green',
    rarity: 'common',
    description: 'Robas otra carta',
    effect: () => {}
  },

  // Cartas Amarillas (Eventos)
  {
    id: 'all_lose_1',
    name: 'Maldición Colectiva',
    color: 'yellow',
    rarity: 'common',
    description: 'Todos pierden 1 vida',
    effect: (game) => {
      game.players.forEach(player => {
        if (!player.isGhost && player.lives > 0) {
          player.lives--
        }
      })
    }
  },
  {
    id: 'swap_items',
    name: 'Intercambio',
    color: 'yellow',
    rarity: 'rare',
    description: 'Todos cambian objetos',
    effect: () => {
      // Implementación en el juego
    }
  },
  {
    id: 'shuffle_deck',
    name: 'Mezcla del Dealer',
    color: 'yellow',
    rarity: 'common',
    description: 'El Dealer mezcla el mazo',
    effect: (game) => {
      shuffleArray(game.deck)
    }
  },
  {
    id: 'all_draw',
    name: 'Regalo del Dealer',
    color: 'yellow',
    rarity: 'rare',
    description: 'Todos roban otra carta',
    effect: () => {
      // Implementación en el juego
    }
  },
  {
    id: 'reverse_order',
    name: 'Inversión',
    color: 'yellow',
    rarity: 'common',
    description: 'Se invierte el orden',
    effect: () => {
      // Implementación en el juego
    }
  },

  // Cartas Rojas (Ataques)
  {
    id: 'attack_1',
    name: 'Golpe',
    color: 'red',
    rarity: 'common',
    description: '1 daño a un jugador',
    effect: (game, _playerId, targetId) => {
      if (!targetId) return
      const target = game.players.find(p => p.id === targetId)
      if (target && !target.isGhost) {
        if (target.shield) {
          target.shield = false
        } else {
          target.lives--
        }
      }
    }
  },
  {
    id: 'attack_2',
    name: 'Golpe Fuerte',
    color: 'red',
    rarity: 'rare',
    description: '2 daño a un jugador',
    effect: (game, _playerId, targetId) => {
      if (!targetId) return
      const target = game.players.find(p => p.id === targetId)
      if (target && !target.isGhost) {
        if (target.shield) {
          target.shield = false
          target.lives--
        } else {
          target.lives -= 2
        }
      }
    }
  },
  {
    id: 'steal_item',
    name: 'Robo de Objeto',
    color: 'red',
    rarity: 'rare',
    description: 'Robas un objeto a un jugador',
    effect: () => {}
  },
  {
    id: 'break_shield',
    name: 'Destructor de Escudos',
    color: 'red',
    rarity: 'common',
    description: 'Rompe el escudo de un jugador',
    effect: (game, _playerId, targetId) => {
      if (!targetId) return
      const target = game.players.find(p => p.id === targetId)
      if (target) {
        target.shield = false
      }
    }
  },
  {
    id: 'block_turn',
    name: 'Congelar',
    color: 'red',
    rarity: 'rare',
    description: 'Bloquea el siguiente turno de un jugador',
    effect: () => {}
  },

  // Cartas Negras (Muy raras)
  {
    id: 'instant_death',
    name: 'Muerte Instantánea',
    color: 'black',
    rarity: 'legendary',
    description: 'Muerte instantánea (se puede evitar)',
    effect: (game, _playerId, targetId) => {
      if (!targetId) return
      const target = game.players.find(p => p.id === targetId)
      if (target && !target.isGhost && !target.shield) {
        target.lives = 0
        target.isGhost = true
      }
    }
  },
  {
    id: 'curse',
    name: 'Maldición',
    color: 'black',
    rarity: 'legendary',
    description: 'Pierdes 1 vida cada ronda',
    effect: () => {
      // Implementación en el juego
    }
  },
  {
    id: 'ghost_card',
    name: 'Carta Fantasma',
    color: 'black',
    rarity: 'legendary',
    description: 'Se activa 3 rondas después',
    effect: () => {
      // Implementación en el juego
    }
  },
  {
    id: 'explosion',
    name: 'Explosión',
    color: 'black',
    rarity: 'legendary',
    description: 'Todos reciben 1 daño',
    effect: (game, _playerId) => {
      game.players.forEach(player => {
        if (player.id !== _playerId && !player.isGhost) {
          if (player.shield) {
            player.shield = false
          } else {
            player.lives--
          }
        }
      })
    }
  }
]

function shuffleArray<T>(array: T[]): void {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
}

export function createShuffledDeck(): Card[] {
  const deck: Card[] = []
  
  // Añadir múltiples copias de cada carta para hacer un mazo de 120 cartas
  ALL_CARDS.forEach(card => {
    let copies = 1
    switch (card.rarity) {
      case 'common': copies = 8; break
      case 'rare': copies = 4; break
      case 'legendary': copies = 2; break
    }
    for (let i = 0; i < copies; i++) {
      deck.push({ ...card, id: `${card.id}_${i}` })
    }
  })
  
  shuffleArray(deck)
  return deck
}
