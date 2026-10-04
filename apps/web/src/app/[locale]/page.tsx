import Link from 'next/link';

export default async function LocaleHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <main className="page">
      <section className="hero">
        <h1>Locale: {locale}</h1>
        <p>
          Visit a portfolio at <code>/{locale}/username</code>. Content API
          integration is planned for M2+.
        </p>
      </section>
      <p>
        <Link href="/">← Home</Link>
      </p>
    </main>
  );
}
