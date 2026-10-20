import { RESERVED_USERNAMES } from '@portfolio/shared';

import { SiteProblemState } from '../../components/site-problem-state';

import { PublicPortfolioView } from '../../components/public-portfolio-view';

import { normalizePublicPortfolio } from '../../lib/normalize-public-portfolio';

const API_BASE =
  process.env.API_INTERNAL_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  'http://127.0.0.1:3847';

export const dynamic = 'force-dynamic';

async function fetchPublicPortfolio(username: string) {
  const url = `${API_BASE}/api/v1/public/portfolios/${encodeURIComponent(username)}`;

  try {
    const response = await fetch(url, { cache: 'no-store' });

    if (response.status === 404) {
      return { status: 'not_found' as const };
    }

    if (!response.ok) {
      return { status: 'error' as const };
    }

    const data = (await response.json()) as Record<string, unknown>;

    return { status: 'ok' as const, data };
  } catch {
    return { status: 'error' as const };
  }
}

export default async function PublicPortfolioPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const slug = username.toLowerCase();

  if (RESERVED_USERNAMES.has(slug)) {
    return (
      <main className="page problem-page">
        <SiteProblemState kind="reserved_slug" username={slug} />
      </main>
    );
  }

  const result = await fetchPublicPortfolio(slug);

  if (result.status !== 'ok') {
    return (
      <main className="page problem-page">
        <SiteProblemState
          kind={
            result.status === 'error' ? 'portfolio_error' : 'portfolio_missing'
          }
          username={slug}
        />
      </main>
    );
  }

  const portfolio = normalizePublicPortfolio(result.data);

  return (
    <main className="page portfolio-layout">
      <PublicPortfolioView data={portfolio} />
    </main>
  );
}
