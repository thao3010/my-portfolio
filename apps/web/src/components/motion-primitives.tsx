'use client';

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  type HTMLMotionProps,
} from 'motion/react';
import Link from 'next/link';
import type { ComponentProps } from 'react';

const tap = { scale: 0.97 };
const hoverLift = { y: -3, scale: 1.02 };

export function MotionButton({
  className,
  children,
  ...props
}: HTMLMotionProps<'button'>) {
  return (
    <motion.button
      className={className}
      whileHover={hoverLift}
      whileTap={tap}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export function MotionAnchor({
  className,
  children,
  href,
  ...props
}: HTMLMotionProps<'a'>) {
  return (
    <motion.a
      className={className}
      href={href}
      whileHover={hoverLift}
      whileTap={tap}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      {...props}
    >
      {children}
    </motion.a>
  );
}

export function MotionPillLink({
  className,
  children,
  href,
}: {
  className?: string;
  children: React.ReactNode;
  href: string;
}) {
  return (
    <motion.div whileHover={{ scale: 1.06 }} whileTap={tap}>
      <Link className={className} href={href}>
        {children}
      </Link>
    </motion.div>
  );
}

/** Subtle cursor-follow glow on cards (desktop). */
export function GlowCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 260, damping: 30 });
  const sy = useSpring(y, { stiffness: 260, damping: 30 });
  const background = useMotionTemplate`radial-gradient(420px circle at ${sx}px ${sy}px, var(--glow), transparent 55%)`;

  return (
    <motion.div
      className={className}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left);
        y.set(e.clientY - rect.top);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
      style={{ position: 'relative', overflow: 'hidden' }}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
    >
      <motion.div
        aria-hidden
        className="glow-card-layer"
        style={{ background }}
      />
      {children}
    </motion.div>
  );
}
