import { useState, useCallback, useEffect } from 'react'

export interface AppUser {
  id: string;
  email: string;
  username: string;
  avatar: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  coins: number;
  crystals: number;
  wins: number;
  losses: number;
  totalGames: number;
  totalPlayTime: number;
  streak: number;
  createdAt: string;
}

function getLocalUser(): AppUser | null {
  try {
    const stored = localStorage.getItem('dc_user')
    if (stored) return JSON.parse(stored)
  } catch {}
  return null
}

function saveLocalUser(user: AppUser) {
  localStorage.setItem('dc_user', JSON.stringify(user))
}

function createGuest(): AppUser {
  const id = crypto.randomUUID()
  const username = `Jugador_${id.slice(0, 4)}`
  const user = {
    id,
    email: `${username}@local.game`,
    username,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    level: 1, xp: 0, xpToNextLevel: 100,
    coins: 0, crystals: 0,
    wins: 0, losses: 0, totalGames: 0, totalPlayTime: 0, streak: 0,
    createdAt: new Date().toISOString(),
  }
  saveLocalUser(user)
  return user
}

export function useAuth() {
  const [user, setUser] = useState<AppUser | null>(() => getLocalUser() || createGuest())

  useEffect(() => {
    if (!getLocalUser()) {
      const guest = createGuest()
      setUser(guest)
    }
  }, [])

  const signIn = useCallback((email: string, _password: string) => {
    const existing = getLocalUser()
    const u = createUser(existing?.id || crypto.randomUUID(), email.split('@')[0], email)
    saveLocalUser(u)
    setUser(u)
  }, [])

  const signUp = useCallback((email: string, _password: string, username: string) => {
    const existing = getLocalUser()
    const u = createUser(existing?.id || crypto.randomUUID(), username, email)
    saveLocalUser(u)
    setUser(u)
  }, [])

  const signOut = useCallback(() => {
    localStorage.removeItem('dc_user')
    setUser(null)
  }, [])

  return { user, signIn, signUp, signOut }
}

function createUser(id: string, username: string, email: string): AppUser {
  return {
    id,
    email,
    username,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
    level: 1, xp: 0, xpToNextLevel: 100,
    coins: 0, crystals: 0,
    wins: 0, losses: 0, totalGames: 0, totalPlayTime: 0, streak: 0,
    createdAt: new Date().toISOString(),
  }
}
