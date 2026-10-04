'use client';

import { motion, useScroll, useTransform } from 'motion/react';
import Link from 'next/link';
import { ThemeToggle } from './theme-toggle';

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:5173';

export function SiteHeader() {
  const { scrollY } = useScroll();
  const headerShadow = useTransform(
    scrollY,
    [0, 80],
    ['0px 0px 0px transparent', '0px 12px 40px rgba(15, 23, 42, 0.12)'],
  );
  const backdrop = useTransform(scrollY, [0, 60], [0.65, 0.92]);
  const backgroundColor = useTransform(
    backdrop,
    (v) =>
      `color-mix(in srgb, var(--surface) ${Math.round(v * 100)}%, transparent)`,
  );

  return (
    <motion.header
      className="site-header"
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
      style={{
        boxShadow: headerShadow,
        backgroundColor,
      }}
    >
      <Link href="/" className="brand">
        <motion.span
          whileHover={{ scale: 1.02 }}
          transition={{ type: 'spring', stiffness: 500, damping: 28 }}
        >
          Portfolio Builder
        </motion.span>
      </Link>
      <nav>
        <NavLink href={CMS_URL} external>CMS</NavLink>
        <ThemeToggle />
      </nav>
    </motion.header>
  );
}

function NavLink({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const className = 'nav-link';
  const inner = (
    <>
      {children}
      <motion.span
        className="nav-link-line"
        layoutId={external ? 'nav-cms' : undefined}
        transition={{ type: 'spring', stiffness: 500, damping: 34 }}
      />
    </>
  );

  if (external) {
    return (
      <motion.a
        className={className}
        href={href}
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
      >
        {inner}
      </motion.a>
    );
  }

  return (
    <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
      <Link className={className} href={href}>{inner}</Link>
    </motion.div>
  );
}
