# M0 & M1 — what was built and why

## M0 — Foundation

| Item | Why |
|------|-----|
| **pnpm monorepo + Turbo** | One repo for API, CMS, web, mobile later; shared types without copy-paste |
| **`packages/shared`** | Single source for roles, locales (`en`/`vi`), username rules — used by API now and Next/CMS later |
| **Docker Compose (Postgres + MinIO)** | Postgres for M1 data; MinIO ready for file/CV upload in M2 |
| **`.env.example`** | Same variables for all developers and Cloud Agent |
| **GitHub Actions CI** | Install → build shared → lint/test/build API on every push |
| **`docs/public-urls.md`** | Documents `/{locale}/{username}` before Next.js exists |

## M1 — Auth & users

| Item | Why |
|------|-----|
| **`users` table + migration** | Versioned schema (no `synchronize: true` in production) |
| **Self-register** | `POST /auth/register` with validated `username` |
| **JWT access + refresh** | CMS/mobile can stay logged in safely; refresh rotated and hashed in DB |
| **Roles `admin` \| `user`** | `RolesGuard` ready for admin routes in M4 |
| **`preferredLocale`** | Aligns user default with public URL locale |
| **Google-ready fields** | `google_id`, `auth_provider` — OAuth flow lands in M2 |

Google login is **not wired yet**; env placeholders exist in `.env.example`.
