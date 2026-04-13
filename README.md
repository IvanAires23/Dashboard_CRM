# CRM Dashboard

Frontend de CRM construido com React + Vite, com foco em uso operacional real:
pipeline visual, CRUD completo, dashboard com KPIs, filtros, busca global, testes e CI.

## Live Demo

- Producao: **https://dashboard-crm-nu.vercel.app/#/login**

Credenciais demo:

- Email: `email@email.com`
- Senha: `123456`

## Destaques

- Dashboard orientado a dados com KPIs e graficos (Recharts)
- Pipeline de deals com drag and drop (DnD Kit)
- CRUD de Leads, Deals, Accounts, Contacts e Tasks
- Formularios padronizados com React Hook Form + Zod
- Filtros reutilizaveis, busca global e tabelas com ordenacao/paginacao
- Estados de loading/empty/error padronizados
- Toaster, confirm dialogs e Error Boundary global
- Tratamento global de erros para services, queries e UI
- Modo demo-first com dados mock persistidos em `localStorage`
- Acao de reset dos dados demo em `Settings`

## Arquitetura

Estrutura de alto nivel:

```text
src/
  app/          # shell, layout e providers globais
  routes/       # roteamento e protecao de acesso
  features/     # modulos de dominio (dashboard, deals, leads, etc.)
  services/     # camada HTTP + fallback demo/mock
  components/   # UI reutilizavel (forms, table, feedback, filters)
  lib/          # utilitarios (errors, forms, search, filters, table)
  store/        # estado global (auth)
```

## Stack Tecnologica

- React 19
- Vite
- React Router DOM
- Zustand
- TanStack Query
- React Hook Form + Zod
- Recharts
- DnD Kit
- Vitest + Testing Library
- Playwright
- ESLint
- GitHub Actions (CI)

## Scripts

- `npm run dev`: inicia ambiente local
- `npm run build`: gera build de producao
- `npm run preview`: preview local da build
- `npm run lint`: validacao de codigo
- `npm run test`: modo watch dos testes (Vitest)
- `npm run test:run`: execucao unica de testes unit/component
- `npm run e2e`: testes E2E (Playwright)
- `npm run e2e:headed`: E2E com navegador visivel
- `npm run e2e:ui`: runner UI do Playwright

## Setup Local

### Pre-requisitos

- Node.js 20+
- npm 10+

### Instalacao

```bash
npm install
```

### Variaveis de ambiente

Crie um `.env.local` baseado no `.env.example`.

Exemplo recomendado para demo local:

```env
VITE_API_URL=http://localhost:3000/api
VITE_AUTH_MOCK=true
VITE_CRM_MOCK=true
VITE_DASHBOARD_MOCK=true
```

### Rodar local

```bash
npm run dev
```

Aplicacao local padrao: `http://localhost:5173`

## Testes e Qualidade

- Unit/component: Vitest + Testing Library
- E2E: Playwright (fluxos criticos de auth, navegacao e leads)
- CI automatica em GitHub Actions:
  - install
  - lint
  - test:run
  - build

Workflow: `.github/workflows/ci.yml`

## Modo Demo

O projeto esta preparado para apresentacao sem backend:

- `VITE_CRM_MOCK=true` ativa dados demo para entidades CRM
- dados demo persistem no navegador
- botao de reset em `Settings` restaura o dataset inicial

Se quiser forcar API real:

- configure `VITE_CRM_MOCK=false`
- mantenha `VITE_API_URL` apontando para seu backend

## Estado Atual

Projeto pronto para demonstracao profissional de frontend CRM, com:

- UX completa de operacao (dashboard, pipeline, CRUD, filtros, busca)
- padroes reutilizaveis de formulario e validacao
- padroes globais de erro e feedback
- cobertura automatizada (unit/component + E2E)
- pipeline de CI para validacao continua

## Proximos passos sugeridos

- Integrar autenticacao real e persistencia de sessao
- Conectar backend de producao com dados reais
- Adicionar telemetria e monitoramento de erros em producao
- Evoluir suite E2E para fluxos completos por entidade

