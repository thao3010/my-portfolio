# Portfolio Builder (monorepo)

Self-hosted portfolio platform: NestJS API, CMS (Vite), public site (Next.js), mobile (React Native) — phased delivery.

**Current milestone: M0 + M1** (tooling, Docker, auth, users, roles, migrations).

## Repository layout

| Path | Purpose |
|------|---------|
| `apps/api` | REST API (NestJS + TypeORM + PostgreSQL) |
| `apps/cms` | Admin CMS (Vite + React) — login, register, dashboard |
| `apps/web` | Public site (Next.js) — `/{locale}/{username}` routes |
| `packages/shared` | Shared constants (`UserRole`, locales, username rules) |
| `docker-compose.yml` | PostgreSQL + MinIO for local dev |
| `docs/public-urls.md` | Contract for `/{locale}/{username}` public URLs |

## Prerequisites

- Node.js 20+
- pnpm 9+
- Docker (for Postgres & MinIO)

## Quick start

```bash
cp .env.example .env   # Windows: copy .env.example .env
pnpm install
pnpm db:up             # Postgres only (enough for API/CMS/Web). MinIO: pnpm db:up:all
pnpm migration:run
pnpm dev:stack         # API + CMS + Web in one terminal (Turbo)
```

After pulling new API changes, run `pnpm migration:run` again if new migrations were added.

**Or three terminals** (same order):

```bash
pnpm --filter @portfolio/shared build
pnpm --filter @portfolio/api dev
pnpm --filter @portfolio/cms dev
pnpm --filter @portfolio/web dev
```

Optional: copy `apps/cms/.env.example` → `apps/cms/.env` and `apps/web/.env.example` → `apps/web/.env`.

| App | URL |
|-----|-----|
| API | `http://localhost:3847/api/v1/health` |
| Swagger UI | `http://localhost:3847/api/docs` |
| CMS | `http://localhost:5173` |
| Web | `http://localhost:3000` |

### Auth endpoints (M1)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/auth/register` | Self-register (`email`, `password`, `username`, optional `preferredLocale`) |
| POST | `/api/v1/auth/login` | Login |
| POST | `/api/v1/auth/refresh` | Body: `{ "refreshToken" }` |
| POST | `/api/v1/auth/logout` | Bearer access token |
| GET | `/api/v1/auth/me` | Bearer access token |
| GET/PUT | `/api/v1/me/portfolio` | User portfolio editor (JWT) |
| GET | `/api/v1/public/portfolios/:username` | Published portfolio (public) |
| GET/PATCH | `/api/v1/admin/users` | Admin user management |

### Create an admin (manual, until admin CMS exists)

```sql
UPDATE users SET role = 'admin' WHERE email = 'you@example.com';
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Turbo dev (all packages with a `dev` script) |
| `pnpm dev:stack` | Build shared, then API + CMS + Web together |
| `pnpm build` | Build all packages |
| `pnpm test` | Run tests |
| `pnpm db:up` / `pnpm db:down` | Docker services |

## Public URL (planned Next.js)

`https://your-domain.com/en/username` — see [docs/public-urls.md](./docs/public-urls.md).
