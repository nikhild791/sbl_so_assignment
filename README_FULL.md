## SBL - Ask a Website (Full Project Overview)

This document describes the full monorepo: technologies, architecture, runtime flow, important files, development and deployment instructions, and operational notes.

### Project purpose

SBL is a small full-stack prototype that lets a user ask a question about a website. The frontend collects a URL and a question, the backend enqueues a job, a worker scrapes the page, sends the extracted text to an AI model, and stores the AI answer in the database.

## High-level architecture

- Frontend: `apps/web` — Next.js (React) UI for submitting tasks and viewing results.
- API server: `apps/api` — Express-based API that accepts tasks and enqueues them.
- Worker: `services/worker` — Background worker that pulls jobs from the queue, scrapes sites and calls AI.
- Shared packages: `packages/*` — modular libraries used across apps. Notable packages:
  - `@repo/ui` — shared React components used by the frontend.
  - `@repo/queue` — BullMQ queue wrapper and helpers.
  - `@repo/scrapper` — Playwright-based scraper.
  - `@repo/db` — Drizzle ORM bindings and migration scripts.
  - `@repo/ai` — AI integration (Google GenAI in this project).
  - `@repo/config` — env validation using zod.

The repo is orchestrated with Turborepo (`turbo.json`) and uses workspaces for local package linking.

## Core technologies

- Node.js (>=18) and TypeScript
- Turborepo for monorepo task orchestration
- Frontend: Next.js (v16), React (v19), Tailwind CSS, PostCSS
- Backend: Express (apps/api)
- Worker/Queue: BullMQ + ioredis (Redis as backing store)
- Scraping: Playwright (headless Chromium)
- AI: Google GenAI SDK (`@google/genai`) used by `@repo/ai`
- Database: PostgreSQL with Drizzle ORM and `drizzle-kit` for migrations
- Dev tools: ESLint, Prettier, TypeScript
- Containers: Docker + docker-compose (development / local orchestration)

## End-to-end flow

1. User enters a website URL and a question in the UI (`apps/web`).
2. The UI calls the API (e.g., `POST /api/task`) to create a task.
3. The API enqueues the job on the BullMQ queue (`@repo/queue`).
4. A worker (`services/worker`) picks up the job and:
   - Scrapes the page content with Playwright (`@repo/scrapper`).
   - Sends page text + question to the AI client (`@repo/ai`) to get an answer.
   - Persists the result (and status) to the PostgreSQL DB via `@repo/db` (Drizzle).
   - Updates job progress on the queue so the API/UI can show progress.
5. The frontend polls or reads task status/result from the API and displays the AI answer.

## Important files and folders

- `package.json` (repo root) — top-level npm scripts (dev/build/lint). Uses workspaces.
- `turbo.json` — turborepo configuration for task orchestration.
- `apps/web` — Next.js app (see `package.json` inside for scripts: `dev`, `build`, `start`).
- `apps/api` — Express API server (`scripts`: `dev`, `build`, `start`).
- `services/worker` — worker process entry (`src/index.ts`).
- `packages/queue` — queue helpers built on BullMQ and ioredis.
- `packages/scrapper` — Playwright scraping logic.
- `packages/db` — Drizzle ORM schema, migrations and DB helpers.
- `packages/config` — central environment variable schema and validation.
- `docker-compose.yml` — local compose file for `api`, `web`, `worker`, `postgres`, `redis`.
- `docker/Dockerfile.*` — Dockerfiles for each service.

## Environment variables

The repo requires several environment variables. The `packages/config` package validates these with zod. Minimum variables used across the project:

- DATABASE_URL — Postgres connection string (postgres://user:pass@host:port/db)
- REDIS_URL — Redis connection string (example in `.env`: `redis://redis:6379`)
- GOOGLE_API_KEY — API key for the Google GenAI (or whatever AI provider config is used)
- NEXT_PUBLIC_API_URL — For the Next frontend to call the API in non-local environments

An example `.env` (already present in the repo root) contains at least `REDIS_URL=redis://redis:6379` for local compose. Do NOT commit secrets to git.

## Scripts (quick reference)

At repo root (workspaces):

- npm run dev — runs `turbo run dev` and starts apps in development mode
- npm run build — runs `turbo run build` (build all workspaces)
- npm run lint — runs ESLint across workspaces
- npm run check-types — runs TypeScript checks

Per-app shortcuts:

- `npm --prefix ./apps/web run dev` — run only the Next.js frontend locally
- `npm --prefix ./apps/api run dev` — build & run the API

DB package scripts (inside `packages/db`):

- `drizzle:generate`, `drizzle:migrate`, `drizzle:studio` — use `drizzle-kit` for migrations and schema generation.

## Docker / docker-compose

`docker-compose.yml` defines services for local integration testing:

- api: built from `docker/Dockerfile.api`, exposed at host port 3001
- web: built from `docker/Dockerfile.web`, exposed at host port 3000
- worker: built from `docker/Dockerfile.worker` (Playwright Docker image is used in the worker image)
- postgres: official Postgres image with a mapped volume
- redis: official Redis image

Important compose notes:

- The worker image in `docker/Dockerfile.worker` uses the Playwright base (`mcr.microsoft.com/playwright:...`) to avoid complicated Chrome installs in Docker.
- For local runs with `docker-compose`, ensure `.env` contains valid `DATABASE_URL`/`REDIS_URL` and `POSTGRES_PASSWORD` matches compose config or override it.

## Running locally (recommended)

1. Install dependencies from repo root:

   npm install

2. Start the monorepo in dev mode (Turborepo will run workspace dev tasks):

   npm run dev

3. Alternatively run services individually:

   npm --prefix ./apps/web run dev
   npm --prefix ./apps/api run dev
   npm --prefix ./services/worker run start

4. To use Docker compose (local integration with Postgres + Redis):

   docker compose up --build

   (or use Docker Desktop on Windows to launch `docker-compose.yml`)

## Database migrations

Use the `packages/db` scripts to run migrations and to generate schema artifacts via `drizzle-kit`:

cd packages/db
npm run drizzle:migrate

You can also run `drizzle-kit studio` to inspect the dev database if you prefer.

## Tests & Playwright

- `packages/scrapper` contains Playwright config and optionally Playwright tests. Playwright is also used programmatically by the worker to scrape sites.
- When running Playwright in Docker, use the official Playwright image (which this repo already references for the worker) to ensure browser dependencies are present.

## Operational concerns and recommendations

- Scraping: scraping arbitrary sites can be brittle. The current scraper grabs `document.body.innerText`. For production, consider smarter extraction (readability, heuristics, or site-specific selectors).
- AI usage & cost: sending entire page text to an LLM can be costly (and can hit token limits). Consider:
  - Truncating or summarizing text before sending to the AI.
  - Chunking the page and using retrieval + chain-of-thought style prompts.
- Security: sanitize and validate incoming URLs. Avoid SSRF by restricting allowed domains or using a safe browsing proxy.
- Rate limiting: add rate limits on the API to prevent abuse.
- Secrets: keep `GOOGLE_API_KEY` and DB credentials in a secrets manager in production.

## Troubleshooting

- Playwright fails in Docker: ensure worker uses the Playwright base image (it does in `docker/Dockerfile.worker`).
- Redis connection errors: check `.env` and `REDIS_URL`. When using Docker compose, the service name `redis` is used so `redis://redis:6379` is valid inside the compose network.
- Database: If migrations fail, check `DATABASE_URL` and Postgres container logs. Postgres is exposed on port 5432 in compose.

## Next steps / suggested improvements

- Add CI (lint, typecheck, unit tests, e2e smoke tests). Run `npm run lint` and `npm run check-types` in CI.
- Add API docs / OpenAPI schema for the `apps/api` server endpoints.
- Add monitoring/metrics for worker progress and job failures.
- Improve scraping (use Readability, content heuristics, or site-specific adapters).
- Add authentication & rate limiting to the API.

## Where to look for implementation details

- Worker flow: `services/worker/src/index.ts` — shows scraping, AI call, DB insert and progress updates.
- Scraper: `packages/scrapper/src/index.ts` — Playwright based scraping function.
- Queue: `packages/queue/src/index.ts` — BullMQ queue and connection using `ioredis`.
- Config/validation: `packages/config/src/index.ts` — zod schema for required env vars.
- DB migrations: `packages/db/drizzle` + `packages/db/src/migrate.ts`.

## License & contribution

This README doesn't set a license. If you plan to open source the repo, add a `LICENSE` file (MIT or similar) and a `CONTRIBUTING.md` to describe workflows.

---

If you want, I can also:

- add short README sections inside `apps/api` and `apps/web` describing their local run commands,
- add example `.env.example` with required variables,
- or open a PR with CI (GitHub Actions) that runs lint + typecheck on push.

Generated on: 2025-11-12
