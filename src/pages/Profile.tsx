import { Link } from 'react-router-dom'
import { ArrowLeft, Skull, Trophy, Flame, Clock, Gamepad2, Sword, Heart, User as UserIcon, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'

export default function Profile() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-center">
          <Skull className="w-16 h-16 text-brand/40 mx-auto mb-4 animate-pulse" />
          <p className="text-text-secondary mb-6 text-sm tracking-widest">Debes iniciar sesión</p>
          <Link to="/login" className="btn-primary">Iniciar Sesión</Link>
        </div>
      </div>
    )
  }

  const stats = [
    { icon: <Trophy className="w-5 h-5" />, label: 'Victorias', value: user.wins, color: 'text-accent-gold' },
    { icon: <Skull className="w-5 h-5" />, label: 'Derrotas', value: user.losses, color: 'text-brand-light' },
    { icon: <Gamepad2 className="w-5 h-5" />, label: 'Partidas', value: user.totalGames, color: 'text-text-secondary' },
    { icon: <Flame className="w-5 h-5" />, label: 'Racha', value: user.streak, color: 'text-brand-light' },
    { icon: <Clock className="w-5 h-5" />, label: 'Tiempo', value: `${Math.floor(user.totalPlayTime / 60)}h`, color: 'text-text-secondary' },
    { icon: <Sword className="w-5 h-5" />, label: 'Nivel', value: user.level, color: 'text-accent-gold' },
  ]

  return (
    <div className="min-h-screen bg-surface relative overflow-hidden p-6">

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[40%] bg-brand/6 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage: `linear-gradient(rgba(196,0,0,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(196,0,0,0.6) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <Link to="/" className="inline-flex items-center gap-2 text-text-tertiary hover:text-text-primary transition-colors mb-8 text-sm">
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Link>

        <motion.div initial={{ y: 16, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="space-y-5">

          {/* Profile header */}
          <div className="glass p-7 relative">
            <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-brand/30" />
            <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-brand/30" />
            <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-brand/30" />
            <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-brand/30" />

            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-20 h-20 border-2 border-brand/40 overflow-hidden"
                  style={{ boxShadow: '0 0 20px rgba(196,0,0,0.2)' }}>
                  <img src={user.avatar} alt={user.username} className="w-full h-full object-cover" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-brand/20 border border-brand/40 flex items-center justify-center">
                  <UserIcon className="w-3.5 h-3.5 text-brand-light" />
                </div>
              </div>

              <div className="flex-1">
                <h1 className="font-heading text-3xl tracking-[0.12em] uppercase text-text-primary mb-2">{user.username}</h1>
                <div className="flex items-center gap-3 mb-3">
                  <span className="badge border border-brand/30 bg-brand/8 text-brand-light">Nivel {user.level}</span>
                  <span className="badge border border-white/[0.08] bg-surface-lighter text-text-secondary">{user.xp}/{user.xpToNextLevel} XP</span>
                </div>

                {/* XP Bar */}
                <div className="h-1.5 bg-surface-lighter border border-white/[0.05] overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (user.xp / user.xpToNextLevel) * 100)}%` }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full bg-gradient-to-r from-brand to-brand-light"
                    style={{ boxShadow: '0 0 8px rgba(196,0,0,0.6)' }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-white/[0.04]">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className="bg-surface-card p-6 text-center"
              >
                <div className={`${stat.color} mb-3 flex justify-center`}>{stat.icon}</div>
                <p className="font-heading text-3xl tracking-wide text-text-primary mb-1">{stat.value}</p>
                <p className="text-text-tertiary text-xs tracking-[0.18em] uppercase">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Achievements */}
          <div className="glass p-7 relative">
            <div className="absolute top-0 left-0 w-5 h-5 border-t border-l border-brand/30" />
            <div className="absolute top-0 right-0 w-5 h-5 border-t border-r border-brand/30" />
            <div className="absolute bottom-0 left-0 w-5 h-5 border-b border-l border-brand/30" />
            <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r border-brand/30" />

            <h2 className="font-heading text-xl tracking-widest uppercase text-text-primary mb-5 flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent-gold" />
              Logros
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { name: 'Primera Sangre', desc: 'Gana tu primera partida', icon: <Sword className="w-6 h-6" />, unlocked: user.wins > 0 },
                { name: 'Superviviente', desc: 'Sobrevive 10 rondas', icon: <Heart className="w-6 h-6" />, unlocked: user.totalGames > 5 },
                { name: 'Imparable', desc: 'Racha de 5 victorias', icon: <Flame className="w-6 h-6" />, unlocked: user.streak >= 5 },
                { name: 'Veterano', desc: 'Juega 50 partidas', icon: <Trophy className="w-6 h-6" />, unlocked: user.totalGames >= 50 },
              ].map((badge, i) => (
                <motion.div
                  key={badge.name}
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.08 }}
                  className={`p-4 border text-center transition-all ${
                    badge.unlocked
                      ? 'border-accent-gold/35 bg-accent-gold/5'
                      : 'border-white/[0.05] bg-surface-lighter/30 opacity-40'
                  }`}
                >
                  <div className={`mb-2 flex justify-center ${badge.unlocked ? 'text-accent-gold' : 'text-text-tertiary'}`}>
                    {badge.icon}
                  </div>
                  <p className="font-heading text-sm tracking-widest uppercase text-text-primary">{badge.name}</p>
                  <p className="text-xs text-text-tertiary mt-0.5">{badge.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  )
}
