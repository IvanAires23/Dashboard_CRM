import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import FormFeedback from '../../../lib/forms/FormFeedback.jsx'
import { useAsyncFormSubmission } from '../../../lib/forms/submission.js'
import { useToast } from '../../../lib/toast/useToast.js'
import { useZodForm } from '../../../lib/forms/useZodForm.js'
import { loginDefaultValues, loginSchema } from '../schemas/loginSchema.js'
import { useAuth } from '../useAuth.js'
import './LoginPage.css'

function LoginPage() {
  const { signIn, isLoading } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    getFieldError,
    formState: { isSubmitting },
  } = useZodForm({
    schema: loginSchema,
    defaultValues: loginDefaultValues,
    mode: 'onSubmit',
    reValidateMode: 'onChange',
  })

  const emailError = getFieldError('email')
  const passwordError = getFieldError('password')
  const {
    isSubmittingAsync,
    errorMessage,
    executeSubmission,
  } = useAsyncFormSubmission({
    successMessage: 'Signed in successfully.',
    defaultErrorMessage: 'Unable to sign in right now. Please try again.',
    onSuccess: ({ message }) => {
      toast.success(message || 'Signed in successfully.')
    },
    onError: ({ message }) => {
      toast.error(message || 'Unable to sign in right now. Please try again.')
    },
  })
  const isFormBusy = isLoading || isSubmitting || isSubmittingAsync

  const onSubmit = async (values) => {
    await executeSubmission(async () => {
      await signIn(values)
      navigate('/dashboard', { replace: true })
    })
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

          <form className="cover-login__form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="email@email.com"
              autoComplete="email"
              aria-invalid={emailError ? 'true' : 'false'}
              {...register('email')}
            />
            {emailError ? <p className="cover-login__error">{emailError}</p> : null}

            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="123456"
              autoComplete="current-password"
              aria-invalid={passwordError ? 'true' : 'false'}
              {...register('password')}
            />
            {passwordError ? <p className="cover-login__error">{passwordError}</p> : null}

            <FormFeedback
              isLoading={isFormBusy}
              loadingText="Signing in..."
              errorMessage={errorMessage}
            />

            <button type="submit" disabled={isFormBusy}>
              {isFormBusy ? 'Signing in...' : 'Sign in'}
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
