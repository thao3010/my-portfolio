'use client';

import { motion } from 'motion/react';
import { fadeUpBlur, staggerContainer } from '../lib/motion-presets';

export function EmptyPortfolioState({
  username,
  locale,
  reason = 'not_found',
}: {
  username: string;
  locale: string;
  reason?: 'not_found' | 'error';
}) {
  const message =
    reason === 'error'
      ? 'Could not reach the API. Start the API (port 3847) and set NEXT_PUBLIC_API_URL in apps/web/.env if needed.'
      : 'This portfolio is not public yet. In the CMS: fill your profile, add work & experience, then click Publish.';

  return (
    <motion.section
      className="empty-state"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      <motion.h1 variants={fadeUpBlur}>@{username}</motion.h1>
      <motion.p variants={fadeUpBlur}>{message}</motion.p>
      <motion.p variants={fadeUpBlur} className="empty-meta">
        URL: <code>/{locale}/{username}</code>
      </motion.p>
      <motion.div
        className="empty-orb"
        aria-hidden
        animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.section>
  );
}
