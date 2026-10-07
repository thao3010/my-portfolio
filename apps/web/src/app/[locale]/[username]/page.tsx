import { RESERVED_USERNAMES } from '@portfolio/shared';

import { notFound } from 'next/navigation';

import { EmptyPortfolioState } from '../../../components/empty-portfolio-state';

import { PublicPortfolioView } from '../../../components/public-portfolio-view';

import { normalizePublicPortfolio } from '../../../lib/normalize-public-portfolio';



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

  params: Promise<{ locale: string; username: string }>;

}) {

  const { locale, username } = await params;

  const slug = username.toLowerCase();



  if (RESERVED_USERNAMES.has(slug)) {

    notFound();

  }



  const result = await fetchPublicPortfolio(slug);



  if (result.status !== 'ok') {

    return (

      <main className="page">

        <EmptyPortfolioState

          username={slug}

          locale={locale}

          reason={result.status}

        />

      </main>

    );

  }



  const portfolio = normalizePublicPortfolio(result.data, locale);



  return (

    <main className="page portfolio-layout">

      <PublicPortfolioView data={portfolio} />

    </main>

  );

}


