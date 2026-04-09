import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../useAuth.js'
import './LoginPage.css'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { signIn, isLoading } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      await signIn({
        email,
        password,
      })
      setError('')
      navigate('/dashboard', { replace: true })
    } catch (loginError) {
      setError(loginError?.message || 'Unable to sign in right now. Please try again.')
    }
  }

  return (
    <section className="cover-page">
      <div className="cover-page__glow" aria-hidden="true" />

      <div className="cover-page__content">
        <div className="cover-hero">
          <span className="cover-hero__chip">
            <Sparkles size={16} />
            Featured Project
          </span>

          <h1>Close bigger deals. Lead with absolute clarity.</h1>

          <p>
            A portfolio-first entry screen crafted to feel premium, strategic, and conversion-ready
            from the very first click.
          </p>

          <div className="cover-hero__metrics">
            <article>
              <small>Qualified leads</small>
              <strong>+38%</strong>
            </article>
            <article>
              <small>Response time</small>
              <strong>-27%</strong>
            </article>
            <article>
              <small>Monthly conversion</small>
              <strong>24,6%</strong>
            </article>
          </div>

          <ul className="cover-hero__highlights">
            <li>
              <CheckCircle2 size={16} />
              Real-time pipeline visibility that turns data into confident action.
            </li>
            <li>
              <ShieldCheck size={16} />
              Secure role-based access designed for high-performance revenue teams.
            </li>
            <li>
              <BarChart3 size={16} />
              Every critical performance signal in one command center.
            </li>
          </ul>
        </div>

        <aside className="cover-login">
          <div className="cover-login__header">
            <span>CRM Pulse</span>
            <TrendingUp size={18} />
          </div>

          <h2>Access your workspace</h2>
          <p>Where top-performing teams turn pipeline into predictable growth.</p>

          <form className="cover-login__form" onSubmit={handleSubmit}>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="email@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />

            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="123456"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />

            {error ? <p className="cover-login__error">{error}</p> : null}

            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
              <ArrowRight size={16} />
            </button>
          </form>

          <p className="cover-login__hint">Credentials: email@email.com / 123456</p>

          <div className="cover-login__mini-panel" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </aside>
      </div>
    </section>
  )
}

export default LoginPage
