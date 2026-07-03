import { useState, useCallback, useRef } from 'react'
import type { GameState, Player } from '../types/game'
import { initializeGame } from '../utils/gameLogic'

export function useGame() {
  const [game, setGame] = useState<GameState | null>(null)
  const gameRef = useRef<GameState | null>(null)

  const initGame = useCallback((players: Player[]) => {
    const g = initializeGame(players)
    g.gamePhase = 'playing'
    g.phase = 'draw'
    gameRef.current = g
    setGame({ ...g })
  }, [])

  const syncGame = useCallback(() => {
    const g = gameRef.current
    if (g) setGame({ ...g })
  }, [])

  return { game, setGame, gameRef, initGame, syncGame }
}
