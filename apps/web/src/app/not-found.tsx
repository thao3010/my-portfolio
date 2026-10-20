import { SiteProblemState } from '../components/site-problem-state';

export default function NotFound() {
  return (
    <main className="page problem-page">
      <SiteProblemState kind="route_404" />
    </main>
  );
}
