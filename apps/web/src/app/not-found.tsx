import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="page">
      <h1>404</h1>
      <p>This page could not be found.</p>
      <p>
        <Link href="/">Go home</Link>
      </p>
    </main>
  );
}
