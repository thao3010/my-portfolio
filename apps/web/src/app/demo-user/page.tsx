import type { Metadata } from 'next';

import { PublicPortfolioView } from '../../components/public-portfolio-view';
import { DEMO_PORTFOLIO_DATA } from '../../lib/demo-portfolio-data';

export const metadata: Metadata = {
  title: 'Demo portfolio · Alex Rivera',
  description:
    'Sample public portfolio page with experience, 3D projects carousel, skills, and contact.',
};

export default function DemoUserPortfolioPage() {
  return (
    <main className="page portfolio-layout">
      <PublicPortfolioView data={DEMO_PORTFOLIO_DATA} />
    </main>
  );
}
