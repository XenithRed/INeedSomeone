-- Death Deck - Supabase Schema
-- Ejecuta esto en el SQL Editor de tu proyecto Supabase

-- 1. Habilitar Realtime en las tablas
-- Ve a Database > Replication y habilita Realtime para `rooms` y `room_players`

-- 2. Tabla de usuarios (se crea automáticamente con auth.users, esta es la extensión)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  username TEXT NOT NULL,
  avatar TEXT DEFAULT '',
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  xp_to_next_level INTEGER DEFAULT 100,
  coins INTEGER DEFAULT 0,
  crystals INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  total_games INTEGER DEFAULT 0,
  total_play_time INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own data"
  ON public.users FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own data"
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 3. Salas
CREATE TABLE IF NOT EXISTS public.rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  host_id UUID NOT NULL REFERENCES public.users(id),
  host_name TEXT NOT NULL,
  max_players INTEGER NOT NULL DEFAULT 8,
  is_private BOOLEAN DEFAULT false,
  game_mode TEXT DEFAULT 'classic',
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'playing', 'ended')),
  player_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.rooms ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read rooms"
  ON public.rooms FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create rooms"
  ON public.rooms FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- 4. Jugadores en sala
CREATE TABLE IF NOT EXISTS public.room_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID NOT NULL REFERENCES public.rooms(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id),
  username TEXT NOT NULL,
  avatar TEXT DEFAULT '',
  is_host BOOLEAN DEFAULT false,
  is_ready BOOLEAN DEFAULT false,
  joined_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.room_players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read room players"
  ON public.room_players FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can join rooms"
  ON public.room_players FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- 5. Estadísticas de partidas
CREATE TABLE IF NOT EXISTS public.game_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.rooms(id),
  winner_id UUID REFERENCES public.users(id),
  duration_seconds INTEGER DEFAULT 0,
  total_rounds INTEGER DEFAULT 0,
  total_players INTEGER DEFAULT 0,
  mode TEXT DEFAULT 'classic',
  played_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.game_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read game stats"
  ON public.game_stats FOR SELECT
  USING (true);

-- 6. Índices
CREATE INDEX IF NOT EXISTS idx_rooms_status ON public.rooms(status);
CREATE INDEX IF NOT EXISTS idx_rooms_created ON public.rooms(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_room_players_room ON public.room_players(room_id);
CREATE INDEX IF NOT EXISTS idx_users_level ON public.users(level DESC);

-- 7. Función para actualizar player_count
CREATE OR REPLACE FUNCTION public.update_room_player_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.rooms SET player_count = player_count + 1 WHERE id = NEW.room_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.rooms SET player_count = GREATEST(player_count - 1, 0) WHERE id = OLD.room_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_room_player_insert ON public.room_players;
CREATE TRIGGER on_room_player_insert
  AFTER INSERT ON public.room_players
  FOR EACH ROW EXECUTE FUNCTION public.update_room_player_count();

DROP TRIGGER IF EXISTS on_room_player_delete ON public.room_players;
CREATE TRIGGER on_room_player_delete
  AFTER DELETE ON public.room_players
  FOR EACH ROW EXECUTE FUNCTION public.update_room_player_count();
