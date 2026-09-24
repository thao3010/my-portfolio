# Portfolio Builder (monorepo)

Self-hosted portfolio platform: NestJS API, CMS (Vite), public site (Next.js), mobile (React Native) — phased delivery.

**Current milestone: M0 + M1** (tooling, Docker, auth, users, roles, migrations).

## Repository layout

| Path | Purpose |
|------|---------|
| `apps/api` | REST API (NestJS + TypeORM + PostgreSQL) |
| `packages/shared` | Shared constants (`UserRole`, locales, username rules) |
| `docker-compose.yml` | PostgreSQL + MinIO for local dev |
| `docs/public-urls.md` | Contract for `/{locale}/{username}` public URLs |

## Prerequisites

- Node.js 20+
- pnpm 9+
- Docker (for Postgres & MinIO)

## Quick start

```bash
cp .env.example .env
pnpm install
pnpm db:up
pnpm --filter @portfolio/shared build
pnpm migration:run
pnpm --filter @portfolio/api dev
```

API: `http://localhost:3847/api/v1/health`

### Auth endpoints (M1)

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/auth/register` | Self-register (`email`, `password`, `username`, optional `preferredLocale`) |
| POST | `/api/v1/auth/login` | Login |
| POST | `/api/v1/auth/refresh` | Body: `{ "refreshToken" }` |
| POST | `/api/v1/auth/logout` | Bearer access token |
| GET | `/api/v1/auth/me` | Bearer access token |

### Create an admin (manual, until admin CMS exists)

```sql
UPDATE users SET role = 'admin' WHERE email = 'you@example.com';
```

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Turbo dev (API when configured) |
| `pnpm build` | Build all packages |
| `pnpm test` | Run tests |
| `pnpm db:up` / `pnpm db:down` | Docker services |

## Public URL (planned Next.js)

`https://your-domain.com/en/username` — see [docs/public-urls.md](./docs/public-urls.md).
