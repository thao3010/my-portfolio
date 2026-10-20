'use client';

import { motion } from 'motion/react';
import { fadeUpBlur, staggerContainer } from '../lib/motion-presets';
import { MotionPillLink } from './motion-primitives';

const CMS_URL = process.env.NEXT_PUBLIC_CMS_URL ?? 'http://localhost:5173';

export type SiteProblemKind =
  | 'route_404'
  | 'portfolio_missing'
  | 'portfolio_error'
  | 'reserved_slug';

type ProblemCopy = {
  code: string;
  eyebrow: string;
  title: string;
  lead: string;
  reasons: string[];
};

function copyFor(kind: SiteProblemKind, username?: string): ProblemCopy {
  const at = username ? `@${username}` : null;
  const path = username ? `/${username}` : null;

  switch (kind) {
    case 'route_404':
      return {
        code: '404',
        eyebrow: 'Something went off-route',
        title: 'Page not found',
        lead: 'This URL does not match any page on the site.',
        reasons: [
          'The link may be mistyped or outdated.',
          'The page was removed or never created.',
          'Public portfolios live at /username — double-check the path.',
        ],
      };
    case 'reserved_slug':
      return {
        code: '—',
        eyebrow: 'Reserved path',
        title: 'Not a portfolio page',
        lead: at
          ? `${path} is reserved for the platform (admin, auth, API, etc.).`
          : 'This path is reserved for the platform.',
        reasons: [
          `"${username}" is on the reserved username list.`,
          'Pick a different username for a public portfolio.',
        ],
      };
    case 'portfolio_error':
      return {
        code: '!',
        eyebrow: 'Could not load data',
        title: 'Portfolio unavailable right now',
        lead: at
          ? `We could not load a public portfolio for ${at}.`
          : 'We could not load portfolio data from the API.',
        reasons: [
          'The API may be stopped or still starting (default port 3847).',
          'Check NEXT_PUBLIC_API_URL or API_INTERNAL_URL in apps/web.',
          'A temporary network issue — try refreshing in a moment.',
        ],
      };
    case 'portfolio_missing':
    default:
      return {
        code: '∅',
        eyebrow: 'Nothing to show yet',
        title: at ? `Portfolio ${at} is not available` : 'Portfolio not available',
        lead: at
          ? `There is no public portfolio at ${path} right now.`
          : 'This portfolio is not public or the username does not exist.',
        reasons: [
          'The username is not registered.',
          'The owner has not published from the CMS yet.',
          'The portfolio was unpublished or the username changed.',
        ],
      };
  }
}

export function SiteProblemState({
  kind,
  username,
}: {
  kind: SiteProblemKind;
  username?: string;
}) {
  const copy = copyFor(kind, username);

  return (
    <motion.section
      className="problem-state"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      aria-labelledby="problem-state-title"
    >
      <div className="problem-state-aurora" aria-hidden>
        <motion.span
          className="problem-orb problem-orb-a"
          animate={{
            x: [0, 18, -8, 0],
            y: [0, -12, 8, 0],
            scale: [1, 1.08, 0.96, 1],
          }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.span
          className="problem-orb problem-orb-b"
          animate={{
            x: [0, -14, 10, 0],
            y: [0, 10, -6, 0],
            opacity: [0.35, 0.55, 0.4, 0.35],
          }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.span
          className="problem-orb problem-orb-c"
          animate={{ rotate: [0, 180, 360] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        />
      </div>

      <div className="problem-state-inner">
        <motion.div className="problem-state-badge" variants={fadeUpBlur}>
          <span className="problem-state-code" aria-hidden>{copy.code}</span>
          <span className="eyebrow problem-state-eyebrow">{copy.eyebrow}</span>
        </motion.div>

        <motion.h1
          id="problem-state-title"
          className="problem-state-title"
          variants={fadeUpBlur}
        >
          {copy.title}
        </motion.h1>

        <motion.p className="problem-state-lead" variants={fadeUpBlur}>
          {copy.lead}
        </motion.p>

        {username ? (
          <motion.p className="problem-state-path" variants={fadeUpBlur}>
            Current path: <code>/{username}</code>
          </motion.p>
        ) : null}

        <motion.div className="problem-reason-card" variants={fadeUpBlur}>
          <h2 className="problem-reason-heading">Why you are seeing this</h2>
          <ul className="problem-reason-list">
            {copy.reasons.map((reason) => (
              <li key={reason}>{reason}</li>
            ))}
          </ul>
        </motion.div>

        <motion.div className="problem-state-actions" variants={fadeUpBlur}>
          <MotionPillLink className="btn btn-primary" href="/">
            ← Back to home
          </MotionPillLink>
          <MotionPillLink className="btn btn-secondary" href={CMS_URL}>
            Open CMS
          </MotionPillLink>
        </motion.div>
      </div>
    </motion.section>
  );
}
