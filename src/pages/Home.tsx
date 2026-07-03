import { Link } from 'react-router-dom'
import { Skull, Play, Zap, Users, Trophy, Flame, ChevronRight, Crown, Sword, Ghost } from 'lucide-react'
import { motion } from 'framer-motion'

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as [number, number, number, number] } }
}

export default function Home() {
  return (
    <div className="min-h-screen bg-surface relative overflow-hidden">

      {/* Atmospheric background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[55%] bg-brand/10 blur-[160px]" />
        <div className="absolute bottom-0 right-0 w-[35%] h-[35%] bg-brand-dark/8 blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(196,0,0,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(196,0,0,0.5) 1px,transparent 1px)',
            backgroundSize: '40px 40px'
          }} />
      </div>

      {/* ── Nav ── */}
      <nav style={{ padding: '24px 60px' }} className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 border border-brand/50 bg-brand/10 flex items-center justify-center">
            <Skull className="w-5 h-5 text-brand-light animate-flicker" />
          </div>
          <span className="font-heading text-2xl tracking-[0.15em]">DEATH DECK</span>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/login" className="btn-ghost text-sm">Iniciar Sesión</Link>
          <Link to="/signup" className="btn-primary !py-2.5 !px-5 text-sm">Registrarse</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <motion.section
        variants={container}
        initial="hidden"
        animate="show"
        style={{ padding: '32px 60px 48px' }}
        className="relative z-10"
      >
        <div className="flex flex-col lg:flex-row lg:items-center gap-12">

          {/* Left — copy */}
          <div className="flex-1 space-y-7">

            {/* Tag */}
            <motion.div variants={item} className="inline-flex items-center gap-2 border border-brand/30 bg-brand/8 px-3 py-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-brand-light animate-pulse" />
              <span className="text-xs font-semibold tracking-[0.18em] uppercase text-brand-light">
                Juego de cartas PvP en tiempo real
              </span>
            </motion.div>

            {/* Title */}
            <motion.h1 variants={item}
              className="font-heading uppercase text-text-primary leading-none"
              style={{ fontSize: 'clamp(3rem, 4.5vw, 5.5rem)', letterSpacing: '0.03em' }}
            >
              Nunca sabes<br />
              si la <span className="text-gradient">próxima<br />carta</span><br />
              te salvará
            </motion.h1>

            <motion.p variants={item} className="text-text-secondary text-base leading-relaxed" style={{ maxWidth: '440px' }}>
              o terminará la partida. Estrategia, azar controlado y terror psicológico en partidas de 5–12 minutos.
            </motion.p>

            {/* CTA buttons */}
            <motion.div variants={item} className="flex flex-wrap gap-3">
              <Link to="/signup" className="btn-primary !py-4 !px-9">
                <Play className="w-4 h-4 fill-current" />
                Jugar Ahora
              </Link>
              <Link to="/lobby" className="btn-secondary !py-4 !px-9">
                Ver Salas
                <ChevronRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Stats bar */}
            <motion.div variants={item} className="flex gap-6">
              {[
                { icon: <Users className="w-3.5 h-3.5" />, label: '2–8 jugadores' },
                { icon: <Zap className="w-3.5 h-3.5" />, label: 'Partidas rápidas' },
                { icon: <Trophy className="w-3.5 h-3.5" />, label: 'Modo competitivo' },
              ].map((s, i) => (
                <div key={s.label} className="flex items-center gap-2 text-text-tertiary text-xs">
                  {i > 0 && <span className="text-text-tertiary/30 mr-2">·</span>}
                  <span className="text-brand/60">{s.icon}</span>
                  <span className="tracking-wider whitespace-nowrap">{s.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — card fan */}
          <motion.div variants={item} className="flex-shrink-0 flex items-center justify-center" style={{ width: '340px', height: '380px', position: 'relative' }}>

            {/* Glow */}
            <div style={{ position: 'absolute', inset: '40px', background: 'radial-gradient(ellipse, rgba(196,0,0,0.18) 0%, transparent 70%)', filter: 'blur(30px)' }} />

            {/* Card — Muerte (back-left, red tint) */}
            <motion.div
              animate={{ rotate: -12, x: -52, y: -14 }}
              style={{
                position: 'absolute', width: '180px', height: '250px',
                background: 'linear-gradient(160deg, #1a0808 0%, #0e0e13 100%)',
                border: '1px solid rgba(196,0,0,0.35)',
                boxShadow: '0 0 24px rgba(196,0,0,0.15)',
              }}
            >
              <div style={{ position: 'absolute', inset: '6px', border: '1px solid rgba(196,0,0,0.15)' }} />
              {/* Card number corner */}
              <div style={{ position: 'absolute', top: '10px', left: '12px' }}>
                <span className="font-heading text-xl text-brand/50">A</span>
              </div>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
                <Skull style={{ width: '52px', height: '52px', color: 'rgba(196,0,0,0.4)' }} />
              </div>
              <div style={{ position: 'absolute', bottom: '12px', left: '0', right: '0', textAlign: 'center' }}>
                <span className="font-heading text-sm tracking-widest uppercase" style={{ color: 'rgba(196,0,0,0.5)' }}>Muerte</span>
              </div>
            </motion.div>

            {/* Card — Curación (back-right, gold tint) */}
            <motion.div
              animate={{ rotate: 8, x: 52, y: 10 }}
              style={{
                position: 'absolute', width: '180px', height: '250px',
                background: 'linear-gradient(160deg, #141008 0%, #0e0e13 100%)',
                border: '1px solid rgba(201,150,12,0.3)',
                boxShadow: '0 0 20px rgba(201,150,12,0.1)',
              }}
            >
              <div style={{ position: 'absolute', inset: '6px', border: '1px solid rgba(201,150,12,0.1)' }} />
              <div style={{ position: 'absolute', top: '10px', left: '12px' }}>
                <span className="font-heading text-xl" style={{ color: 'rgba(201,150,12,0.45)' }}>K</span>
              </div>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
                <Crown style={{ width: '52px', height: '52px', color: 'rgba(201,150,12,0.38)' }} />
              </div>
              <div style={{ position: 'absolute', bottom: '12px', left: '0', right: '0', textAlign: 'center' }}>
                <span className="font-heading text-sm tracking-widest uppercase" style={{ color: 'rgba(201,150,12,0.45)' }}>Curación</span>
              </div>
            </motion.div>

            {/* Card — Evento (front, neutral) */}
            <motion.div
              animate={{ rotate: -1, x: 0, y: 0 }}
              style={{
                position: 'absolute', width: '180px', height: '250px',
                background: 'linear-gradient(160deg, #181820 0%, #0f0f14 100%)',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 28px 60px rgba(0,0,0,0.85), inset 0 0 0 1px rgba(255,255,255,0.04)',
                zIndex: 10,
              }}
            >
              <div style={{ position: 'absolute', inset: '6px', border: '1px solid rgba(255,255,255,0.05)' }} />
              {/* Top corners */}
              <div style={{ position: 'absolute', top: '10px', left: '12px' }}>
                <span className="font-heading text-xl text-text-secondary/40">7</span>
              </div>
              <div style={{ position: 'absolute', top: '10px', right: '12px', transform: 'rotate(180deg)' }}>
                <span className="font-heading text-xl text-text-secondary/40">7</span>
              </div>
              {/* Center icon */}
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}>
                <Sword style={{ width: '56px', height: '56px', color: 'rgba(234,224,208,0.35)' }} />
              </div>
              {/* Bottom label */}
              <div style={{ position: 'absolute', bottom: '12px', left: '0', right: '0', textAlign: 'center' }}>
                <span className="font-heading text-sm tracking-widest uppercase text-text-tertiary/70">Evento</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Divider */}
      <div style={{ padding: '0 60px' }} className="relative z-10">
        <div className="h-px bg-gradient-to-r from-transparent via-brand/20 to-transparent" />
      </div>

      {/* ── Features ── */}
      <section style={{ padding: '56px 60px' }} className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-center text-xs tracking-[0.3em] uppercase text-brand/55 font-semibold mb-10">
            Por qué vas a perder el sueño
          </p>

          <div className="grid md:grid-cols-3 gap-px" style={{ background: 'rgba(255,255,255,0.04)' }}>
            {[
              {
                icon: <Ghost className="w-6 h-6" />,
                title: 'Terror Psicológico',
                desc: 'El Dealer tiene personalidad. Comenta, miente y se ríe mientras juegas.',
                accentColor: 'rgba(196,0,0,0.5)',
                glow: 'rgba(196,0,0,0.08)',
              },
              {
                icon: <Zap className="w-6 h-6" />,
                title: 'Azar Controlado',
                desc: '120 cartas, objetos estratégicos y combos que premian la habilidad.',
                accentColor: 'rgba(201,150,12,0.6)',
                glow: 'rgba(201,150,12,0.07)',
              },
              {
                icon: <Flame className="w-6 h-6" />,
                title: 'Solo Uno Vive',
                desc: 'Al morir te conviertes en fantasma y puedes molestar a los vivos.',
                accentColor: 'rgba(234,224,208,0.35)',
                glow: 'rgba(255,255,255,0.02)',
              },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-surface-card group hover:bg-surface-hover transition-colors duration-300"
                style={{ padding: '40px 36px', boxShadow: `inset 0 0 60px ${f.glow}` }}
              >
                <div
                  className="w-11 h-11 border border-white/[0.07] flex items-center justify-center mb-6 group-hover:border-white/15 transition-colors"
                  style={{ color: f.accentColor }}
                >
                  {f.icon}
                </div>
                <h3 className="font-heading text-xl tracking-[0.1em] uppercase text-text-primary mb-4"
                  style={{ letterSpacing: '0.08em' }}>
                  {f.title}
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── CTA ── */}
      <div className="relative z-10 border-t border-white/[0.05]">
        <div style={{ padding: '32px 60px' }} className="flex items-center justify-between gap-6">
          <div>
            <p className="text-text-tertiary text-xs tracking-[0.22em] uppercase mb-1">¿Listo para jugar?</p>
            <p className="font-heading text-[1.75rem] tracking-[0.08em] uppercase text-text-primary">
              Únete a la Death Deck
            </p>
          </div>
          <Link to="/signup" className="btn-primary flex-shrink-0">
            Comenzar Ahora
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  )
}
