# CRM Dashboard Foundation

## Overview

This repository contains the frontend foundation for a CRM dashboard built with React and Vite.

The project currently provides a polished dashboard-style interface and a validated frontend setup that is ready to evolve into a full CRM application. The current focus is to move from a static presentation layer into a real product with routing, state management, forms, data integration, authentication, and operational workflows.

## Main Purpose

The goal of this project is to become a professional CRM dashboard that helps teams manage:

- sales pipeline visibility
- account and customer health
- revenue performance
- task and activity tracking
- future operational workflows such as leads, deals, contacts, and reporting

At this stage, the project serves as a clean starting point for engineering work rather than a complete CRM system.

## Tech Stack

- React
- Vite
- JavaScript
- React Router DOM
- Zustand
- React Hook Form
- Zod
- Recharts
- DnD Kit
- Lucide React
- date-fns
- clsx
- ESLint

## Available Scripts

The main scripts defined in [package.json](./package.json) are:

- `npm install` installs project dependencies
- `npm run dev` starts the local development server
- `npm run build` creates the production build
- `npm run preview` serves the production build locally
- `npm run lint` runs the lint rules for the project

## Getting Started

### Prerequisites

- Node.js 20+ recommended
- npm 10+ recommended

### Local Setup

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open the local Vite URL shown in the terminal, typically:

```text
http://localhost:5173
```

4. Build for production when needed:

```bash
npm run build
```

5. Preview the production build:

```bash
npm run preview
```

## Current Status

The project is currently in an early frontend foundation stage.

What exists today:

- Vite-based React application configured and validated
- responsive CRM-style dashboard shell
- project dependencies installed for routing, forms, validation, charts, drag-and-drop, icons, and utilities
- lint and build workflow working correctly
- cleaned repository structure with improved `.gitignore`

What does not exist yet:

- real CRM routing structure
- modular feature architecture
- API integration layer
- authentication and authorization
- persistent global application state
- production-grade forms and CRUD flows
- automated unit and integration testing setup

## Planned Architecture Direction

The expected evolution of the project is:

1. Introduce application routing and a shared layout shell.
2. Break the current single-file dashboard into reusable components and feature modules.
3. Add domain areas such as accounts, contacts, leads, deals, tasks, and settings.
4. Add a data layer for API integration and async state handling.
5. Implement authentication, protected routes, and user roles.
6. Add validated forms using React Hook Form and Zod.
7. Add charts, drag-and-drop workflows, filters, and table interactions.
8. Add tests, reporting, and CI-oriented quality controls.

## Next Steps

Recommended immediate next steps for this repository:

- create a scalable folder structure for app, routes, features, components, and services
- add `react-router-dom` routing in the application entry flow
- move dashboard data out of `App.jsx` into dedicated modules
- create reusable UI primitives for cards, tables, sections, and layout
- define the first CRM entities and mock service layer
- introduce a testing strategy with unit and end-to-end coverage

## Repository Scope

This repository is focused on the frontend application layer. It should remain clean, readable, and ready for iterative engineering work as the CRM evolves.
