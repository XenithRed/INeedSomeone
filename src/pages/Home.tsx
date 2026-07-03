import { Link } from 'react-router-dom'
import { Skull, Play, Zap, Users, Trophy, Flame, ChevronRight, Sparkles, Crown, Sword, Ghost } from 'lucide-react'
import { motion } from 'framer-motion'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12 }
  }
}

const item = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } }
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-surface relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-[-20%] left-[-10%] w-[40%] h-[40%] bg-brand/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[40%] h-[40%] bg-accent-pink/10 rounded-full blur-[120px]" />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle, rgba(168,85,247,0.3) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />
      </div>

      {/* Nav */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-brand flex items-center justify-center shadow-glow-sm">
            <Skull className="w-6 h-6 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white">Death Deck</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login" className="btn-ghost text-sm !px-4 !py-2">Iniciar Sesión</Link>
          <Link to="/signup" className="btn-primary !py-2 !px-5 text-sm">Registrarse</Link>
        </div>
      </div>

      {/* Hero */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="relative z-10 max-w-6xl mx-auto px-6 pt-16 pb-20"
      >
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div className="space-y-8">
            <motion.div variants={item} className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-brand/10 border border-brand/20 rounded-full px-4 py-1.5">
                <Sparkles className="w-4 h-4 text-brand-light" />
                <span className="text-sm font-medium text-brand-light">Juego de cartas PvP en tiempo real</span>
              </div>
              <h1 className="text-hero font-black text-white leading-[0.95] tracking-tight">
                Nunca sabes si la{' '}
                <span className="text-gradient">próxima carta</span>
                <br />
                te salvará...
              </h1>
              <p className="text-body-lg text-text-secondary max-w-lg leading-relaxed">
                o terminará la partida. Estrategia, azar controlado y terror psicológico en partidas de 5-12 minutos.
              </p>
            </motion.div>

            <motion.div variants={item} className="flex flex-wrap gap-4">
              <Link to="/signup" className="btn-primary text-lg !px-10 !py-5 shadow-glow">
                <Play className="w-6 h-6 fill-current" />
                Jugar Ahora
              </Link>
              <Link to="/lobby" className="btn-secondary text-lg !px-10 !py-5">
                Ver Salas
                <ChevronRight className="w-5 h-5" />
              </Link>
            </motion.div>

            <motion.div variants={item} className="flex items-center gap-8">
              {[
                { icon: <Users className="w-5 h-5" />, label: '2-8 jugadores' },
                { icon: <Zap className="w-5 h-5" />, label: 'Partidas rápidas' },
                { icon: <Trophy className="w-5 h-5" />, label: 'Modo competitivo' },
              ].map((stat) => (
                <div key={stat.label} className="flex items-center gap-2 text-text-tertiary text-sm">
                  <span className="text-brand-light">{stat.icon}</span>
                  {stat.label}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right - Character/Visual */}
          <motion.div variants={item} className="relative flex items-center justify-center">
            <div className="relative w-80 h-80">
              {/* Glow behind */}
              <div className="absolute inset-0 bg-gradient-brand rounded-full blur-[80px] opacity-20 animate-pulse-glow" />

              {/* Card stack */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ rotate: -8, y: -8 }}
                  className="absolute w-48 h-64 rounded-2xl bg-gradient-to-br from-accent-red/80 to-accent-red border-2 border-accent-red/50 shadow-xl"
                >
                  <div className="px-4 py-5 h-full flex flex-col">
                    <div className="flex-1 flex items-center justify-center">
                      <Skull className="w-16 h-16 text-white/80" />
                    </div>
                    <p className="text-white font-bold text-sm">Muerte</p>
                    <p className="text-white/60 text-xs">Instantánea</p>
                  </div>
                </motion.div>
                <motion.div
                  animate={{ rotate: 4, y: 4 }}
                  className="absolute w-48 h-64 rounded-2xl bg-gradient-to-br from-accent-emerald/80 to-accent-emerald border-2 border-accent-emerald/50 shadow-xl"
                >
                  <div className="px-4 py-5 h-full flex flex-col">
                    <div className="flex-1 flex items-center justify-center">
                      <Crown className="w-16 h-16 text-white/80" />
                    </div>
                    <p className="text-white font-bold text-sm">Curación</p>
                    <p className="text-white/60 text-xs">+1 vida</p>
                  </div>
                </motion.div>
                <motion.div
                  animate={{ rotate: 0, y: 0 }}
                  className="relative w-48 h-64 rounded-2xl bg-gradient-to-br from-accent-amber/80 to-accent-amber border-2 border-accent-amber/50 shadow-2xl z-10"
                >
                  <div className="px-4 py-5 h-full flex flex-col">
                    <div className="flex-1 flex items-center justify-center">
                      <Sword className="w-16 h-16 text-white/80" />
                    </div>
                    <p className="text-white font-bold text-sm">Evento</p>
                    <p className="text-white/60 text-xs">Global</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Features */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid md:grid-cols-3 gap-5"
        >
          {[
            {
              icon: <Ghost className="w-7 h-7" />,
              title: 'Terror Psicológico',
              desc: 'El Dealer tiene personalidad. Comenta, miente y se ríe mientras juegas.',
              color: 'from-accent-pink/20 to-accent-pink/5',
              border: 'border-accent-pink/20',
              iconColor: 'text-accent-pink'
            },
            {
              icon: <Zap className="w-7 h-7" />,
              title: 'Azar Controlado',
              desc: '120 cartas, objetos estratégicos y combos que premian la habilidad.',
              color: 'from-accent-amber/20 to-accent-amber/5',
              border: 'border-accent-amber/20',
              iconColor: 'text-accent-amber'
            },
            {
              icon: <Flame className="w-7 h-7" />,
              title: 'Solo uno vive',
              desc: 'Al morir te conviertes en fantasma y puedes molestar a los vivos.',
              color: 'from-accent-teal/20 to-accent-teal/5',
              border: 'border-accent-teal/20',
              iconColor: 'text-accent-teal'
            }
          ].map((feature) => (
            <div
              key={feature.title}
              className={`glass glass-hover rounded-3xl p-8 ${feature.border}`}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 ${feature.iconColor}`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
              <p className="text-text-secondary text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* CTA */}
      <div className="relative z-10 border-t border-border">
        <div className="max-w-6xl mx-auto px-6 py-12 flex items-center justify-between">
          <div>
            <p className="text-text-tertiary text-sm">¿Listo para jugar?</p>
            <p className="text-white font-bold text-lg">Únete a la Death Deck</p>
          </div>
          <Link to="/signup" className="btn-primary">
            Comenzar Ahora
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
