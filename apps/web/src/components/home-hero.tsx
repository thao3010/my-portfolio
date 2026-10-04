'use client';

import { SUPPORTED_LOCALES } from '@portfolio/shared';
import { motion } from 'motion/react';
import {
  fadeUpBlur,
  staggerContainer,
  wordStagger,
} from '../lib/motion-presets';
import { MotionAnchor, MotionPillLink } from './motion-primitives';

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:5173';

const TITLE =
  'Build a portfolio that moves like a senior product engineer.'.split(' ');

const wordContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.035, delayChildren: 0.12 },
  },
};

export function HomeHero() {
  return (
    <motion.section
      className="hero-block"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      <motion.p className="eyebrow" variants={fadeUpBlur}>
        Frontend craft · 4 years · motion-first
      </motion.p>

      <motion.h1 variants={fadeUpBlur} aria-label={TITLE.join(' ')}>
        <motion.span
          className="hero-title-words"
          variants={wordContainer}
          initial="hidden"
          animate="show"
        >
          {TITLE.map((word, i) => (
            <motion.span
              key={`${word}-${i}`}
              className="hero-word"
              variants={wordStagger}
            >
              {word}
            </motion.span>
          ))}
        </motion.span>
      </motion.h1>

      <motion.p className="hero-copy" variants={fadeUpBlur}>
        Self-hosted platform with CMS editing, role-based access, and public
        pages at <code>/{'{locale}'}/{'{username}'}</code>.
      </motion.p>

      <motion.div className="hero-cta" variants={fadeUpBlur}>
        <MotionAnchor className="btn btn-primary" href={CMS_URL}>
          Open CMS
        </MotionAnchor>
        <MotionAnchor className="btn btn-secondary" href="/en/demo-user">
          View demo route
        </MotionAnchor>
      </motion.div>

      <motion.div className="locale-row" variants={fadeUpBlur}>
        {SUPPORTED_LOCALES.map((locale, i) => (
          <motion.div
            key={locale}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              delay: 0.35 + i * 0.05,
              type: 'spring',
              stiffness: 400,
              damping: 22,
            }}
          >
            <MotionPillLink className="pill" href={`/${locale}`}>
              /{locale}
            </MotionPillLink>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="hero-glow hero-glow-a"
        aria-hidden
        animate={{ scale: [1, 1.12, 1], x: [0, 24, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="hero-glow hero-glow-b"
        aria-hidden
        animate={{ scale: [1.05, 0.95, 1.05], rotate: [0, -12, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="hero-grid"
        aria-hidden
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.35 }}
        transition={{ duration: 1.2 }}
      />
    </motion.section>
  );
}
