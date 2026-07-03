import { useState, useEffect, useCallback } from 'react'
import { useAuth } from './useAuth'

export interface RoomData {
  id: string
  name: string
  host_id: string
  host_name: string
  max_players: number
  is_private: boolean
  game_mode: string
  status: 'waiting' | 'playing' | 'ended'
  created_at: string
  player_count: number
}

export interface RoomPlayer {
  id: string
  username: string
  avatar: string
  is_host: boolean
  is_ready: boolean
}

// In-memory store
let roomsStore: RoomData[] = []
let playersStore: Record<string, RoomPlayer[]> = {}
const listeners: Set<() => void> = new Set()

function notifyListeners() {
  listeners.forEach(fn => fn())
}

export function useRooms() {
  const [rooms, setRooms] = useState<RoomData[]>([])

  useEffect(() => {
    setRooms([...roomsStore])
    const handler = () => setRooms([...roomsStore])
    listeners.add(handler)
    return () => { listeners.delete(handler) }
  }, [])

  return { rooms, loading: false, error: null, refetch: () => setRooms([...roomsStore]) }
}

export function useRoom(roomId: string | undefined) {
  const { user } = useAuth()
  const [room, setRoom] = useState<RoomData | null>(
    () => roomId ? roomsStore.find(r => r.id === roomId) || null : null
  )
  const [players, setPlayers] = useState<RoomPlayer[]>(
    () => roomId ? (playersStore[roomId] || []) : []
  )

  useEffect(() => {
    if (!roomId) return
    const found = roomsStore.find(r => r.id === roomId) || null
    setRoom(found)
    setPlayers(playersStore[roomId] || [])

    const handler = () => {
      const found = roomsStore.find(r => r.id === roomId) || null
      setRoom(found)
      setPlayers([...(playersStore[roomId] || [])])
    }
    listeners.add(handler)
    return () => { listeners.delete(handler) }
  }, [roomId])

  const joinRoom = useCallback(() => {
    if (!user || !roomId) return
    const current = playersStore[roomId] || []
    if (current.find(p => p.id === user.id)) return

    playersStore[roomId] = [...current, {
      id: user.id,
      username: user.username,
      avatar: user.avatar,
      is_host: false,
      is_ready: false
    }]

    const r = roomsStore.find(r => r.id === roomId)
    if (r) r.player_count = playersStore[roomId].length

    setPlayers([...playersStore[roomId]])
    notifyListeners()
  }, [user, roomId])

  const leaveRoom = useCallback(() => {
    if (!user || !roomId) return
    playersStore[roomId] = (playersStore[roomId] || []).filter(p => p.id !== user.id)
    const r = roomsStore.find(r => r.id === roomId)
    if (r) r.player_count = playersStore[roomId].length
    setPlayers([...(playersStore[roomId] || [])])
    notifyListeners()
  }, [user, roomId])

  const toggleReady = useCallback(() => {
    if (!user || !roomId) return
    playersStore[roomId] = (playersStore[roomId] || []).map(p =>
      p.id === user.id ? { ...p, is_ready: !p.is_ready } : p
    )
    setPlayers([...playersStore[roomId]])
    notifyListeners()
  }, [user, roomId])

  const startGame = useCallback(() => {
    if (!roomId) return
    const r = roomsStore.find(r => r.id === roomId)
    if (r) {
      r.status = 'playing'
      setRoom({ ...r })
      notifyListeners()
    }
  }, [roomId])

  return {
    room,
    players,
    joinRoom,
    leaveRoom,
    toggleReady,
    startGame,
    isHost: user ? players.find(p => p.id === user.id)?.is_host ?? false : false,
  }
}

export function createRoom(
  name: string,
  maxPlayers: number,
  isPrivate: boolean,
  userId: string,
  username: string,
  avatar: string
): string {
  const id = crypto.randomUUID()
  const room: RoomData = {
    id,
    name,
    host_id: userId,
    host_name: username,
    max_players: maxPlayers,
    is_private: isPrivate,
    game_mode: 'classic',
    status: 'waiting',
    created_at: new Date().toISOString(),
    player_count: 1
  }

  roomsStore = [room, ...roomsStore]
  playersStore[id] = [{
    id: userId,
    username,
    avatar,
    is_host: true,
    is_ready: false
  }]

  notifyListeners()
  return id
}

