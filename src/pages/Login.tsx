import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Skull, Mail, Lock, ArrowLeft, Sword, Crown } from 'lucide-react'
import { motion } from 'framer-motion'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signIn(email, password)
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#080809' }}>

      {/* ── Left panel — atmospheric branding ── */}
      <div style={{
        flex: 1,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '60px',
      }}>
        {/* Background glows */}
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 30%, rgba(196,0,0,0.14) 0%, transparent 70%)' }} />
        <div style={{
          position: 'absolute', inset: 0, opacity: 0.025,
          backgroundImage: 'linear-gradient(rgba(196,0,0,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(196,0,0,0.6) 1px,transparent 1px)',
          backgroundSize: '40px 40px',
        }} />

        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '64px', textDecoration: 'none' }}>
          <div style={{
            width: '40px', height: '40px',
            border: '1px solid rgba(196,0,0,0.5)',
            background: 'rgba(196,0,0,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Skull style={{ width: '22px', height: '22px', color: '#FF2A2A' }} />
          </div>
          <span className="font-heading" style={{ fontSize: '1.5rem', letterSpacing: '0.15em', color: '#EAE0D0' }}>DEATH DECK</span>
        </Link>

        {/* Decorative card fan */}
        <div style={{ position: 'relative', width: '220px', height: '280px', marginBottom: '56px' }}>
          {/* Card left */}
          <div style={{
            position: 'absolute', width: '150px', height: '210px',
            top: '35px', left: '-10px',
            background: 'linear-gradient(150deg,#1a0808,#0e0e13)',
            border: '1px solid rgba(196,0,0,0.3)',
            transform: 'rotate(-12deg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 20px rgba(196,0,0,0.12)',
          }}>
            <Skull style={{ width: '44px', height: '44px', color: 'rgba(196,0,0,0.35)' }} />
          </div>
          {/* Card right */}
          <div style={{
            position: 'absolute', width: '150px', height: '210px',
            top: '35px', right: '-10px',
            background: 'linear-gradient(150deg,#14100a,#0e0e13)',
            border: '1px solid rgba(201,150,12,0.25)',
            transform: 'rotate(10deg)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 18px rgba(201,150,12,0.08)',
          }}>
            <Crown style={{ width: '44px', height: '44px', color: 'rgba(201,150,12,0.35)' }} />
          </div>
          {/* Card center (front) */}
          <div style={{
            position: 'absolute', width: '150px', height: '210px',
            top: '35px', left: '50%', transform: 'translateX(-50%)',
            background: 'linear-gradient(150deg,#181820,#0f0f14)',
            border: '1px solid rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 24px 56px rgba(0,0,0,0.8)',
            zIndex: 2,
          }}>
            <div style={{ position: 'absolute', inset: '5px', border: '1px solid rgba(255,255,255,0.04)' }} />
            <Sword style={{ width: '48px', height: '48px', color: 'rgba(234,224,208,0.3)' }} />
          </div>
        </div>

        {/* Tagline */}
        <div style={{ textAlign: 'center', maxWidth: '300px' }}>
          <h2 className="font-heading" style={{ fontSize: '2rem', letterSpacing: '0.06em', color: '#EAE0D0', marginBottom: '12px', lineHeight: 1.1 }}>
            LA MESA<br />TE ESPERA
          </h2>
          <p style={{ color: '#6E6A75', fontSize: '0.875rem', lineHeight: 1.6 }}>
            Cada partida es diferente. Cada decisión puede costarte la vida.
          </p>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <motion.div
        initial={{ opacity: 0, x: 24 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          width: '480px',
          flexShrink: 0,
          background: '#0D0D10',
          borderLeft: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 52px',
          position: 'relative',
        }}
      >
        {/* Top-left corner accent */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '32px', height: '32px', borderTop: '1px solid rgba(196,0,0,0.3)', borderLeft: '1px solid rgba(196,0,0,0.3)' }} />
        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '32px', height: '32px', borderBottom: '1px solid rgba(196,0,0,0.3)', borderRight: '1px solid rgba(196,0,0,0.3)' }} />

        {/* Back link */}
        <Link to="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          color: '#38363E', fontSize: '0.8125rem', textDecoration: 'none',
          marginBottom: '48px', transition: 'color 0.2s',
          letterSpacing: '0.05em',
        }}
          onMouseEnter={e => (e.currentTarget.style.color = '#EAE0D0')}
          onMouseLeave={e => (e.currentTarget.style.color = '#38363E')}
        >
          <ArrowLeft style={{ width: '14px', height: '14px' }} />
          Volver al inicio
        </Link>

        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <p style={{ color: 'rgba(196,0,0,0.7)', fontSize: '0.7rem', letterSpacing: '0.25em', fontWeight: 600, textTransform: 'uppercase', marginBottom: '10px' }}>
            Bienvenido de vuelta
          </p>
          <h1 className="font-heading" style={{ fontSize: '2.8rem', letterSpacing: '0.06em', color: '#EAE0D0', lineHeight: 1, marginBottom: '8px' }}>
            INICIAR SESIÓN
          </h1>
          <p style={{ color: '#6E6A75', fontSize: '0.875rem' }}>
            ¿No tienes cuenta?{' '}
            <Link to="/signup" style={{ color: '#FF2A2A', fontWeight: 600, textDecoration: 'none' }}>
              Registrarse
            </Link>
          </p>
        </div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              border: '1px solid rgba(196,0,0,0.35)',
              background: 'rgba(196,0,0,0.08)',
              padding: '12px 16px',
              marginBottom: '24px',
            }}
          >
            <p style={{ color: '#FF2A2A', fontSize: '0.875rem' }}>{error}</p>
          </motion.div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

          {/* Email */}
          <div>
            <label style={{
              display: 'block', fontSize: '0.7rem', fontWeight: 600,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: '#38363E', marginBottom: '10px',
            }}>
              Correo electrónico
            </label>
            <div style={{ position: 'relative' }}>
              <Mail style={{
                position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                width: '16px', height: '16px', color: '#38363E',
              }} />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: '#080809',
                  border: '1px solid rgba(255,255,255,0.07)',
                  padding: '14px 14px 14px 44px',
                  color: '#EAE0D0', fontSize: '0.9375rem',
                  outline: 'none', transition: 'border-color 0.2s',
                }}
                onFocus={e => (e.target.style.borderColor = 'rgba(196,0,0,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.07)')}
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label style={{
              display: 'block', fontSize: '0.7rem', fontWeight: 600,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: '#38363E', marginBottom: '10px',
            }}>
              Contraseña
            </label>
            <div style={{ position: 'relative' }}>
              <Lock style={{
                position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)',
                width: '16px', height: '16px', color: '#38363E',
              }} />
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                style={{
                  width: '100%', boxSizing: 'border-box',
                  background: '#080809',
                  border: '1px solid rgba(255,255,255,0.07)',
                  padding: '14px 14px 14px 44px',
                  color: '#EAE0D0', fontSize: '0.9375rem',
                  outline: 'none', transition: 'border-color 0.2s',
                }}
                onFocus={e => (e.target.style.borderColor = 'rgba(196,0,0,0.5)')}
                onBlur={e => (e.target.style.borderColor = 'rgba(255,255,255,0.07)')}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? '#7A0000' : '#C40000',
              border: 'none',
              padding: '16px',
              color: '#EAE0D0',
              fontSize: '0.8125rem',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              marginTop: '8px',
            }}
            onMouseEnter={e => { if (!loading) (e.currentTarget.style.background = '#e00000') }}
            onMouseLeave={e => { if (!loading) (e.currentTarget.style.background = '#C40000') }}
          >
            {loading ? (
              <>
                <span style={{
                  width: '16px', height: '16px', border: '2px solid rgba(234,224,208,0.3)',
                  borderTopColor: '#EAE0D0', borderRadius: '50%', animation: 'spin 0.7s linear infinite',
                  display: 'inline-block',
                }} />
                Entrando...
              </>
            ) : 'Iniciar Sesión'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}
