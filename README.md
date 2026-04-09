# CRM Dashboard

Frontend de um CRM moderno construído com React + Vite, com foco em experiência visual, navegação modular e base escalável para evolução de produto.

## Live Demo

- Produção: **https://dashboard-crm-nu.vercel.app/#/login**

Credenciais de demonstração:

- Email: `email@email.com`
- Senha: `123456`

## Objetivo do Projeto

Este projeto serve como base para um painel CRM com estrutura pronta para evoluir para fluxos reais de negócio, incluindo:

- gestão de pipeline de vendas
- visão de contas e contatos
- organização de tarefas e agenda
- permissões por perfil de usuário
- integração progressiva com APIs

## Stack Tecnológica

- React 19
- Vite
- React Router DOM
- Zustand
- TanStack Query
- React Hook Form + Zod
- Recharts
- DnD Kit
- ESLint

## Scripts

- `npm run dev`: inicia ambiente local de desenvolvimento
- `npm run build`: gera build de produção
- `npm run preview`: executa preview local da build
- `npm run lint`: valida padrão de código

## Setup Local

### Pré-requisitos

- Node.js 20+
- npm 10+

### Instalação

```bash
npm install
```

### Variáveis de Ambiente

Crie o arquivo `.env.local` com base no `.env.example`.

Exemplo:

```env
VITE_API_URL=http://localhost:3000/api
VITE_AUTH_MOCK=true
```

### Executar Localmente

```bash
npm run dev
```

Aplicação local (padrão): `http://localhost:5173`

## Build e Deploy

Build de produção:

```bash
npm run build
```

Preview da build:

```bash
npm run preview
```

Deploy recomendado: Vercel (preset `Vite`, output `dist`).

## Estrutura de Alto Nível

```text
src/
  app/          # shell, layout e providers globais
  routes/       # configuração e proteção de rotas
  features/     # módulos de domínio (dashboard, accounts, deals, etc.)
  services/     # camada de acesso HTTP/API
  components/   # componentes reutilizáveis de UI/layout
  store/        # estado global (auth)
```

## Status Atual

O projeto está em estágio funcional de frontend, com:

- interface e navegação principais implementadas
- autenticação mock para fluxo de demonstração
- módulos iniciais de CRM organizados por feature
- pipeline de build/lint validado

## Roadmap

- persistência de sessão e auth real
- integração completa com backend
- CRUDs por módulo (accounts, contacts, deals, tasks)
- testes automatizados (unitários e e2e)
- observabilidade e hardening para produção
