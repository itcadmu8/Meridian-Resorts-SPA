import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, Lock, User } from 'lucide-react'

import { useAuth } from '../../hooks/useAuth'
import heroImage from '../../assets/hero.png'

function StaffLogin() {
  const { loginStaff } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('ops@meridian.com')
  const [password, setPassword] = useState('meridian123')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    try {
      setIsSubmitting(true)
      setMessage('')
      await loginStaff({ email, password })
      navigate('/staff/dashboard', { replace: true })
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to sign in.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="staff-login-shell">
      <div className="login-visual" style={{ '--login-visual-image': `url(${heroImage})` }}>
        <div className="login-visual-top">
          <span className="login-visual-badge">Enterprise Operations Auth</span>
          <span>6 Properties &bull; 1 Console</span>
        </div>
        <div className="login-visual-bottom">
          <p className="login-visual-eyebrow">Meridian Operations</p>
          <h2 className="login-visual-headline">Run The Floor.<br />Every Property.</h2>
          <p className="login-visual-copy">
            Arrivals, spa schedules and F&amp;B covers across every Meridian resort, in one operations console.
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
            <span className="pill neutral">Staff Portal</span>
          </div>

          <h1>Operations Login</h1>
          <p className="login-card-subtext">Sign in with your staff credentials to access the operations console.</p>

          <form onSubmit={handleSubmit}>
            <label className="form-field">
              Staff email
              <div className="form-field-input-wrap">
                <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" required />
                <User size={16} />
              </div>
            </label>
            <label className="form-field">
              Password
              <div className="form-field-input-wrap">
                <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" required />
                <Eye size={16} />
              </div>
            </label>

            <button className="primary-btn full-btn" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign In to Staff Portal'} <ArrowRight size={16} />
            </button>

            {message ? <div className="message-box">{message}</div> : null}
          </form>

          <hr className="login-divider" />

          <div className="inline-row">
            <span style={{ fontSize: '12px', color: '#6b7280' }}>Guest experience portal</span>
            <Link to="/guest/login" style={{ fontSize: '12px', fontWeight: 700 }}>Guest Login</Link>
          </div>

          <p className="login-trust-note"><Lock size={12} /> 256-bit Encrypted Staff Session &bull; Meridian Data Trust</p>
        </div>
      </div>
    </div>
  )
}

export default StaffLogin
