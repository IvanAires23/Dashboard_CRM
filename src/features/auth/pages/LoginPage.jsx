import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  TrendingUp,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import './LoginPage.css'

function LoginPage() {
  return (
    <section className="cover-page">
      <div className="cover-page__glow" aria-hidden="true" />

      <div className="cover-page__content">
        <div className="cover-hero">
          <span className="cover-hero__chip">
            <Sparkles size={16} />
            Projeto em destaque
          </span>

          <h1>CRM Dashboard para equipes que vivem de meta batida.</h1>

          <p>
            Uma tela de entrada pensada para portfolio: identidade forte, proposta clara e acesso
            direto a demonstracao do produto.
          </p>

          <div className="cover-hero__metrics">
            <article>
              <small>Leads qualificados</small>
              <strong>+38%</strong>
            </article>
            <article>
              <small>Tempo de resposta</small>
              <strong>-27%</strong>
            </article>
            <article>
              <small>Conversao mensal</small>
              <strong>24,6%</strong>
            </article>
          </div>

          <ul className="cover-hero__highlights">
            <li>
              <CheckCircle2 size={16} />
              Pipeline visual em tempo real com foco em decisoes rapidas.
            </li>
            <li>
              <ShieldCheck size={16} />
              Acesso seguro por perfil para operacoes comerciais.
            </li>
            <li>
              <BarChart3 size={16} />
              Indicadores de performance em um unico painel.
            </li>
          </ul>
        </div>

        <aside className="cover-login">
          <div className="cover-login__header">
            <span>CRM Pulse</span>
            <TrendingUp size={18} />
          </div>

          <h2>Acessar ambiente</h2>
          <p>Use qualquer e-mail para visualizar a experiencia do dashboard.</p>

          <form
            className="cover-login__form"
            onSubmit={(event) => {
              event.preventDefault()
            }}
          >
            <label htmlFor="email">E-mail</label>
            <input id="email" name="email" type="email" placeholder="vendas@empresa.com" />

            <label htmlFor="password">Senha</label>
            <input id="password" name="password" type="password" placeholder="********" />

            <button type="submit">
              Entrar
              <ArrowRight size={16} />
            </button>
          </form>

          <Link className="cover-login__demo-link" to="/dashboard">
            Ver dashboard completo
          </Link>

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
