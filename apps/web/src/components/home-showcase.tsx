'use client';

import { motion } from 'motion/react';
import {
  easeOutExpo,
  fadeUp,
  staggerContainer,
} from '../lib/motion-presets';
import { GlowCard } from './motion-primitives';

const FEATURES = [
  {
    title: 'Motion-native UI',
    body: 'Spring physics, staggered reveals, and scroll-driven sections — not generic fade-ins.',
    tag: 'Framer Motion',
  },
  {
    title: 'CMS → Public sync',
    body: 'Edit work, experience, and contact once; publish to a locale-aware public route.',
    tag: 'Full stack',
  },
  {
    title: 'Roles that scale',
    body: 'Creators ship content; admins govern users without touching the editor flow.',
    tag: 'RBAC',
  },
];

const MARQUEE = [
  'React',
  'TypeScript',
  'Next.js',
  'Motion',
  'NestJS',
  'Design systems',
  'Accessibility',
  'Performance',
  'Dark mode',
  '4+ years craft',
];

export function HomeShowcase() {
  return (
    <div className="showcase-wrap">
      <motion.section
        className="showcase-intro"
        variants={staggerContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
      >
        <motion.p className="eyebrow" variants={fadeUp}>
          Why this stack
        </motion.p>
        <motion.h2 variants={fadeUp}>
          Sharp motion, clear information architecture.
        </motion.h2>
      </motion.section>

      <div className="showcase-grid">
        {FEATURES.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 40, rotateX: 12 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{
              delay: i * 0.08,
              duration: 0.65,
              ease: easeOutExpo,
            }}
            style={{ transformPerspective: 1200 }}
          >
            <GlowCard className="showcase-card">
              <span className="showcase-tag">{feature.tag}</span>
              <h3>{feature.title}</h3>
              <p>{feature.body}</p>
            </GlowCard>
          </motion.div>
        ))}
      </div>

      <div className="marquee-shell" aria-hidden>
        <motion.div
          className="marquee-track"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        >
          {[...MARQUEE, ...MARQUEE].map((label, i) => (
            <span key={`${label}-${i}`} className="marquee-item">
              {label}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
