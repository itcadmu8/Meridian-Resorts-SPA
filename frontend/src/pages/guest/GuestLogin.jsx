import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, Lock, User } from 'lucide-react'

import { useAuth } from '../../hooks/useAuth'
import heroImage from '../../assets/hero.png'

function GuestLogin() {
  const { loginGuest } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('sophia.hartwell@meridian.com')
  const [password, setPassword] = useState('guestpass123')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      setIsSubmitting(true)
      setMessage('')
      await loginGuest({ email, password })
      const shouldExpandAi = Boolean(location.state?.expandAiWidget)
      const destination = location.state?.from?.pathname || '/'
      navigate(destination, {
        replace: true,
        state: shouldExpandAi ? { expandAiWidget: true } : null,
      })
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to sign in.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="guest-login-shell">
      <div className="login-visual" style={{ '--login-visual-image': `url(${heroImage})` }}>
        <div className="login-visual-top">
          <span className="login-visual-badge">Guest Experience Portal</span>
          <span>6 Luxury Coastal Destinations</span>
        </div>
        <div className="login-visual-bottom">
          <p className="login-visual-eyebrow">Meridian Hospitality</p>
          <h2 className="login-visual-headline">Your Stay.<br />Your Meridian.</h2>
          <p className="login-visual-copy">
            Discover personalized resort dining, restorative spa treatments, and seamless AI assistance across all
            Meridian properties.
          </p>
          <p className="login-visual-properties">
            Maldives Beach &bull; Lake Como &bull; Aspen Mountain &bull; Singapore City &bull; Dubai Desert &bull; Bali Forest
          </p>
        </div>
      </div>
      <div className="login-panel">
        <div className="login-card">
          <div className="brand-row">
            <div className="brand-row-left">
              <div className="logo-mark">≈</div>
              <span style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.08em' }}>MERIDIAN RESORTS &amp; SPA</span>
            </div>
            <span className="pill neutral">Guest Portal</span>
          </div>

          <h1>Welcome to Meridian</h1>
          <p className="login-card-subtext">Sign in to access your personalized stay and interactive concierge.</p>

          <form onSubmit={handleSubmit}>
            <label className="form-field">
              Email or reservation id
              <div className="form-field-input-wrap">
                <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
                <User size={16} />
              </div>
            </label>
            <label className="form-field">
              <div className="form-field-row">
                <span>Password</span>
                <a href="#forgot-password" onClick={(event) => event.preventDefault()}>Forgot password?</a>
              </div>
              <div className="form-field-input-wrap">
                <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required />
                <Eye size={16} />
              </div>
            </label>

            <label className="checkbox-row">
              <input type="checkbox" defaultChecked /> Remember me on this browser
            </label>

            <button className="primary-btn full-btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign In to Meridian'} <ArrowRight size={16} />
            </button>
            <button className="secondary-btn full-btn" type="button" onClick={() => navigate('/')}>
              Continue as Guest <ArrowRight size={16} />
            </button>

            {message ? <div className="message-box">{message}</div> : null}
          </form>

          <hr className="login-divider" />

          <div className="inline-row">
            <span style={{ fontSize: '12px', color: '#6b7280' }}>Resort team or management?</span>
            <Link to="/staff/login" style={{ fontSize: '12px', fontWeight: 700 }}>Staff Portal Login</Link>
          </div>

          <p className="login-trust-note"><Lock size={12} /> 256-bit Encrypted Guest Session &bull; Meridian Data Trust</p>
        </div>
      </div>
    </div>
  )
}

export default GuestLogin
