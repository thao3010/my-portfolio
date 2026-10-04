import { HomeHero } from '../components/home-hero';
import { HomeShowcase } from '../components/home-showcase';

export default function HomePage() {
  return (
    <main className="page">
      <HomeHero />
      <HomeShowcase />
    </main>
  );
}
