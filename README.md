# SBL - Ask a Website (monorepo)

A small Turborepo monorepo that contains a Next.js web UI, an API, worker/service packages and a tiny shared UI package used by the app.

This README documents how to run and test the project locally, how the web form validation behaves, and a short note about the UI improvements applied.

## Repository layout

Top-level folders you will interact with:

- `apps/web` — Next.js app (React) that contains the main UI. The page at `/` lets you enter a website URL and a question.
- `apps/api` — API server that exposes `/task` endpoints used by the web app.
- `services/worker` — background worker used to process scraping/AI jobs.
- `packages/ui` — shared presentational React components (button, card, spinner, loading overlay, etc).
- `packages/db`, `packages/ai`, etc — helper packages used by services and apps.

This monorepo uses Turborepo for task orchestration.

## Requirements

- Node.js >= 18
- npm (the repo uses the `packageManager` field, you can also use `pnpm` or `yarn` if you prefer)

## Quick setup

From the repository root:

## SBL - Ask a Website (monorepo)

This repository is a Turborepo monorepo that implements a simple full-stack application: a Next.js frontend that submits tasks to an API and processes them with background workers.

### Top-level layout

- `apps/web` — Next.js (React) frontend application
- `apps/api` — Node.js + Express API server
- `services/worker` — background worker(s) for processing jobs
- `packages/ui` — shared React UI components
- `packages/*` — additional shared packages: `db`, `queue`, `scrapper`, `ai`, `config`, etc.

### Core technologies

- Monorepo/tooling: Turborepo
- Language: TypeScript
- Frontend: Next.js (React 19), Tailwind CSS, PostCSS
- UI: React components, `lucide-react` for icons
- API: Node.js + Express
- Background queue: BullMQ + Redis
- Scraping: Playwright (headless browser)
- AI integrations: Google GenAI SDK (or other AI client libraries)
- Database: PostgreSQL via Drizzle ORM (`drizzle-orm` + `drizzle-kit` for migrations)
- Dev tools: ESLint, Prettier, TypeScript compiler

### Quick start

1. Install dependencies:

```bash
npm install
```

2. Run the dev environment (runs apps via Turbo):

```bash
npm run dev
```

You can run an individual app from the repo root as well. Example:

```bash
npm --prefix ./apps/web run dev
```

### Environment

- `apps/web` expects `NEXT_PUBLIC_API_URL` to be set to the API base URL (for example `http://localhost:3001`).
- Other services may require environment variables for DB connection, Redis, and API keys.

### Useful scripts (repo root)

- `npm run dev` — run all apps in development using Turbo
- `npm run build` — build all packages and apps
- `npm run lint` — run ESLint across the repo
- `npm run check-types` — run TypeScript checks

### Notes for reviewers

This project demonstrates a modern TypeScript full-stack setup with a modular monorepo layout, separating UI, API, worker and shared packages. It is suitable for extension with CI, deployment, and additional integration tests.


project completed