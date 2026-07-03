import { Link } from 'react-router-dom'
import { ArrowLeft, Skull, Trophy, Flame, Clock, Gamepad2, Sword, Heart, User as UserIcon, Zap } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'

export default function Profile() {
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-game-black via-game-dark to-game-black flex items-center justify-center">
        <div className="text-center">
          <Skull className="w-20 h-20 text-game-purple mx-auto mb-4 animate-pulse" />
          <p className="text-2xl text-gray-400 mb-4">Debes iniciar sesión</p>
          <Link to="/login" className="px-8 py-3 bg-gradient-to-r from-game-purple to-game-pink text-white font-bold rounded-xl">
            Iniciar Sesión
          </Link>
        </div>
      </div>
    )
  }

  const stats = [
    { icon: <Trophy className="w-6 h-6" />, label: 'Victorias', value: user.wins, color: 'text-game-yellow' },
    { icon: <Skull className="w-6 h-6" />, label: 'Derrotas', value: user.losses, color: 'text-game-red' },
    { icon: <Gamepad2 className="w-6 h-6" />, label: 'Partidas', value: user.totalGames, color: 'text-game-purple' },
    { icon: <Flame className="w-6 h-6" />, label: 'Racha', value: user.streak, color: 'text-game-pink' },
    { icon: <Clock className="w-6 h-6" />, label: 'Tiempo', value: `${Math.floor(user.totalPlayTime / 60)}h`, color: 'text-game-blue' },
    { icon: <Sword className="w-6 h-6" />, label: 'Nivel', value: user.level, color: 'text-game-green' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-game-black via-game-dark to-game-black p-6">
      <div className="max-w-4xl mx-auto">
        <Link to="/" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-6 h-6" />
          <span>Volver</span>
        </Link>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
        >
          {/* Profile Header */}
          <div className="bg-game-gray/50 backdrop-blur-sm border border-game-purple/30 rounded-3xl p-8 mb-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-24 h-24 rounded-full border-4 border-game-purple"
                />
                <div className="absolute -bottom-2 -right-2 bg-game-purple rounded-full p-2">
                  <UserIcon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-game text-white text-shadow mb-2">{user.username}</h1>
                <div className="flex items-center gap-4">
                  <div className="bg-game-purple/20 px-4 py-2 rounded-xl">
                    <span className="text-game-purple font-bold">Nivel {user.level}</span>
                  </div>
                  <div className="bg-game-green/20 px-4 py-2 rounded-xl">
                    <span className="text-game-green font-bold">{user.xp}/{user.xpToNextLevel} XP</span>
                  </div>
                </div>
                {/* XP Bar */}
                <div className="mt-3 bg-game-dark rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(user.xp / user.xpToNextLevel) * 100}%` }}
                    className="h-full bg-gradient-to-r from-game-purple to-game-pink rounded-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="bg-game-gray/50 backdrop-blur-sm border border-game-purple/30 rounded-2xl p-6 text-center"
              >
                <div className={`${stat.color} mb-3 flex justify-center`}>{stat.icon}</div>
                <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                <p className="text-gray-400 text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Achievements / Badges */}
          <div className="bg-game-gray/50 backdrop-blur-sm border border-game-purple/30 rounded-3xl p-8">
            <h2 className="text-2xl font-game text-white mb-6 flex items-center gap-2">
              <Zap className="w-6 h-6 text-game-yellow" />
              Logros
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Primera Sangre', desc: 'Gana tu primera partida', icon: <Sword />, unlocked: user.wins > 0 },
                { name: 'Superviviente', desc: 'Sobrevive 10 rondas', icon: <Heart />, unlocked: user.totalGames > 5 },
                { name: 'Imparable', desc: 'Racha de 5 victorias', icon: <Flame />, unlocked: user.streak >= 5 },
                { name: 'Veterano', desc: 'Juega 50 partidas', icon: <Trophy />, unlocked: user.totalGames >= 50 }
              ].map((badge, i) => (
                <motion.div
                  key={badge.name}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className={`p-4 rounded-2xl border-2 text-center ${
                    badge.unlocked
                      ? 'border-game-yellow bg-game-yellow/10'
                      : 'border-gray-700 bg-game-dark/50 opacity-50'
                  }`}
                >
                  <div className={`text-3xl mb-2 ${badge.unlocked ? 'text-game-yellow' : 'text-gray-600'}`}>
                    {badge.icon}
                  </div>
                  <p className="font-bold text-white text-sm">{badge.name}</p>
                  <p className="text-xs text-gray-400">{badge.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
