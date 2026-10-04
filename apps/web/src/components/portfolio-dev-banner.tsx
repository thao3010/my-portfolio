'use client';

import { useEffect, useLayoutEffect, useReducer, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { fadeUpBlur, staggerContainer } from '../lib/motion-presets';
import { RichHtml } from './rich-html';
import {
  mapPhaseToSimpleStep,
  ReactLifecycleSimpleDiagram,
} from './react-lifecycle-simple-diagram';

const REACT_CYAN = '#61dafb';

/** Modern function-component lifecycle (React 18/19 mental model). */
const LIFECYCLE_PHASES = [
  {
    id: 'render',
    title: 'Render',
    detail: 'Component function runs · JSX → React elements',
    code: 'return <Banner />',
  },
  {
    id: 'reconcile',
    title: 'Reconcile',
    detail: 'Fiber diff · schedule updates',
    code: 'beginWork() → completeWork()',
  },
  {
    id: 'commit',
    title: 'Commit',
    detail: 'Apply DOM mutations',
    code: 'commitMutationEffects()',
  },
  {
    id: 'layout',
    title: 'useLayoutEffect',
    detail: 'Sync after DOM, before paint',
    code: 'useLayoutEffect(fn, deps)',
  },
  {
    id: 'paint',
    title: 'Paint',
    detail: 'Browser compositor',
    code: 'requestAnimationFrame',
  },
  {
    id: 'effect',
    title: 'useEffect',
    detail: 'Subscriptions · fetch · timers',
    code: 'useEffect(fn, deps)',
  },
  {
    id: 'update',
    title: 'Update',
    detail: 'setState / dispatch → re-render',
    code: 'dispatch({ type: "tick" })',
  },
  {
    id: 'cleanup',
    title: 'Cleanup',
    detail: 'Effect teardown · unmount',
    code: 'return () => cleanup()',
  },
] as const;

type PhaseId = (typeof LIFECYCLE_PHASES)[number]['id'];

function lifecycleReducer(
  state: { count: number; phase: PhaseId },
  action: { type: 'advance' },
) {
  if (action.type !== 'advance') {
    return state;
  }
  const idx = LIFECYCLE_PHASES.findIndex((p) => p.id === state.phase);
  const next = LIFECYCLE_PHASES[(idx + 1) % LIFECYCLE_PHASES.length];
  const bumped = next.id === 'update' ? state.count + 1 : state.count;
  return { count: bumped, phase: next.id };
}

function LifecycleDemoChip({ renderCount }: { renderCount: number }) {
  const [layoutRan, setLayoutRan] = useState(false);
  const [effectRan, setEffectRan] = useState(false);

  useLayoutEffect(() => {
    setLayoutRan(true);
    const t = window.setTimeout(() => setLayoutRan(false), 900);
    return () => window.clearTimeout(t);
  }, [renderCount]);

  useEffect(() => {
    setEffectRan(true);
    const t = window.setTimeout(() => setEffectRan(false), 900);
    return () => {
      window.clearTimeout(t);
      setEffectRan(false);
    };
  }, [renderCount]);

  return (
    <motion.div
      className="lifecycle-demo-chip"
      initial={{ opacity: 0, scale: 0.6, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.5, filter: 'blur(6px)' }}
      transition={{ type: 'spring', stiffness: 420, damping: 26 }}
    >
      <span className="lifecycle-demo-chip-label">&lt;Hero /&gt;</span>
      <span className="lifecycle-demo-chip-meta">render #{renderCount}</span>
      <span
        className="lifecycle-demo-flag"
        data-on={layoutRan ? 'true' : 'false'}
      >
        layout
      </span>
      <span
        className="lifecycle-demo-flag"
        data-on={effectRan ? 'true' : 'false'}
      >
        effect
      </span>
    </motion.div>
  );
}

export type PortfolioDevBannerProps = {
  locale: string;
  username: string;
  displayName: string;
  headline: string;
  summary: string;
  cvDownloadUrl?: string;
};

export function PortfolioDevBanner({
  locale,
  username,
  displayName,
  headline,
  summary,
  cvDownloadUrl,
}: PortfolioDevBannerProps) {
  const name = displayName || username;
  const [{ phase, count }, dispatch] = useReducer(lifecycleReducer, {
    count: 1,
    phase: 'render',
  });
  const [demoMounted, setDemoMounted] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (reduceMotion) {
      return;
    }
    const ms = phase === 'cleanup' ? 1400 : 2000;
    const id = window.setInterval(() => dispatch({ type: 'advance' }), ms);
    return () => window.clearInterval(id);
  }, [phase, reduceMotion]);

  useEffect(() => {
    if (phase !== 'cleanup' || reduceMotion) {
      return;
    }
    setDemoMounted(false);
    const id = window.setTimeout(() => setDemoMounted(true), 700);
    return () => window.clearTimeout(id);
  }, [phase, reduceMotion]);

  const activeIndex = LIFECYCLE_PHASES.findIndex((p) => p.id === phase);
  const active = LIFECYCLE_PHASES[activeIndex] ?? LIFECYCLE_PHASES[0];

  return (
    <motion.section
      className="portfolio-dev-banner"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      aria-label="Portfolio introduction"
    >
      <div className="portfolio-dev-banner-grid">
        <div className="portfolio-dev-banner-copy">
          <motion.div className="portfolio-dev-banner-badges" variants={fadeUpBlur}>
            <span className="portfolio-dev-badge portfolio-dev-badge-react">
              <ReactAtomIcon />
              Frontend · React
            </span>
            <span className="portfolio-dev-badge portfolio-dev-badge-route">
              /{locale}/{username}
            </span>
          </motion.div>

          <motion.h1 variants={fadeUpBlur}>{name}</motion.h1>

          {headline ? (
            <motion.p className="portfolio-dev-headline" variants={fadeUpBlur}>
              {headline}
            </motion.p>
          ) : null}

          {summary ? (
            <motion.div className="portfolio-dev-summary" variants={fadeUpBlur}>
              <RichHtml html={summary} />
            </motion.div>
          ) : null}

          {cvDownloadUrl ? (
            <motion.div className="portfolio-dev-actions" variants={fadeUpBlur}>
              <a
                className="portfolio-cv-download"
                href={cvDownloadUrl}
                download="cv.pdf"
              >
                Download CV (PDF)
              </a>
            </motion.div>
          ) : null}
        </div>

        <motion.div
          className="react-lifecycle-panel"
          variants={fadeUpBlur}
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="react-lifecycle-panel-header">
            <span className="react-lifecycle-dots" aria-hidden>
              <span />
              <span />
              <span />
            </span>
            <span className="react-lifecycle-panel-title">
              react-lifecycle.flow
            </span>
            <span className="react-lifecycle-panel-pill">React 19</span>
          </div>

          <div className="react-lifecycle-body">
            <ol className="react-lifecycle-steps">
              {LIFECYCLE_PHASES.map((step, i) => {
                const isActive = step.id === phase;
                const isPast = i < activeIndex;
                return (
                  <li
                    key={step.id}
                    className="react-lifecycle-step"
                    data-active={isActive ? 'true' : 'false'}
                    data-past={isPast ? 'true' : 'false'}
                  >
                    <span className="react-lifecycle-step-rail" aria-hidden>
                      <motion.span
                        className="react-lifecycle-step-pulse"
                        animate={
                          isActive && !reduceMotion
                            ? { scale: [1, 1.35, 1], opacity: [0.5, 1, 0.5] }
                            : { scale: 1, opacity: isPast ? 0.35 : 0.15 }
                        }
                        transition={{
                          duration: 1.2,
                          repeat: isActive ? Infinity : 0,
                          ease: 'easeInOut',
                        }}
                      />
                    </span>
                    <div className="react-lifecycle-step-content">
                      <span className="react-lifecycle-step-title">
                        {step.title}
                      </span>
                      <span className="react-lifecycle-step-detail">
                        {step.detail}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ol>

            <div className="react-lifecycle-stage">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active.id}
                  className="react-lifecycle-code"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                >
                  <span className="react-lifecycle-code-comment">// phase</span>
                  <code>{active.code}</code>
                </motion.div>
              </AnimatePresence>

              <div className="react-lifecycle-demo-mount" aria-hidden>
                <AnimatePresence mode="wait">
                  {demoMounted ? (
                    <LifecycleDemoChip key="hero-chip" renderCount={count} />
                  ) : null}
                </AnimatePresence>
              </div>

              {!reduceMotion ? (
                <motion.div
                  className="react-lifecycle-fiber-ring"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 18,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                  aria-hidden
                >
                  <span style={{ color: REACT_CYAN }} />
                </motion.div>
              ) : null}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="portfolio-dev-banner-diagram"
        variants={fadeUpBlur}
      >
        <ReactLifecycleSimpleDiagram
          activeStep={mapPhaseToSimpleStep(phase)}
          reduceMotion={reduceMotion}
        />
      </motion.div>
    </motion.section>
  );
}

function ReactAtomIcon() {
  return (
    <svg
      className="react-atom-icon"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      aria-hidden
    >
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <ellipse
        cx="12"
        cy="12"
        rx="10"
        ry="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <ellipse
        cx="12"
        cy="12"
        rx="10"
        ry="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        transform="rotate(60 12 12)"
      />
      <ellipse
        cx="12"
        cy="12"
        rx="10"
        ry="4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        transform="rotate(-60 12 12)"
      />
    </svg>
  );
}
