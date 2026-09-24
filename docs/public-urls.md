# Public URL contract (`domain.com/{locale}/{username}`)

## Pattern

| Part | Example | Rules |
|------|---------|--------|
| Locale | `en`, `vi` | Must be in `SUPPORTED_LOCALES` (`packages/shared`) |
| Username | `jane-doe` | Same as `users.username` in API (unique, URL-safe) |

Example: `https://portfolio.example.com/en/jane-doe`

## Responsibilities by app (roadmap)

| Layer | Responsibility |
|-------|----------------|
| **Next.js (M5)** | Route `app/[locale]/[username]/page.tsx`, validate locale, 404 if user unpublished |
| **API** | `GET /api/v1/public/portfolios/:username?locale=en` (M2+) — locale affects **translated** fields |
| **CMS** | User picks `preferredLocale`; optional content translations later |

## Why locale is in the path

- SEO: one canonical URL per language version
- Shareable links keep language context
- Aligns with `next-intl` middleware (`/en/...`, `/vi/...`)

## Reserved usernames

Usernames cannot equal locale codes or system paths (`en`, `vi`, `admin`, `api`, …) — see `RESERVED_USERNAMES` in `@portfolio/shared`.
