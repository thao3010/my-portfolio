'use client';

import { motion } from 'motion/react';

export const SIMPLE_LIFECYCLE_STEPS = [
  {
    id: 'render',
    label: 'Render',
    hint: 'Hàm component chạy · tạo UI',
  },
  {
    id: 'dom',
    label: 'DOM',
    hint: 'React gắn node lên trình duyệt',
  },
  {
    id: 'effects',
    label: 'Effects',
    hint: 'useEffect · fetch, listener…',
  },
  {
    id: 'update',
    label: 'Update',
    hint: 'State đổi → render lại',
  },
  {
    id: 'unmount',
    label: 'Unmount',
    hint: 'Gỡ component · cleanup',
  },
] as const;

/** Node centers in SVG viewBox (0–1000). */
const NODE_X = [100, 300, 500, 700, 900] as const;
const RAIL_Y = 42;
const LOOP_PATH =
  `M ${NODE_X[3]} ${RAIL_Y} L ${NODE_X[3]} 78 C ${NODE_X[3]} 96 520 102 120 102 L ${NODE_X[0]} 102 L ${NODE_X[0]} ${RAIL_Y + 4}`;

export type SimpleLifecycleStepId =
  (typeof SIMPLE_LIFECYCLE_STEPS)[number]['id'];

export type DetailedLifecyclePhase =
  | 'render'
  | 'reconcile'
  | 'commit'
  | 'layout'
  | 'paint'
  | 'effect'
  | 'update'
  | 'cleanup';

export function mapPhaseToSimpleStep(
  phase: DetailedLifecyclePhase,
): SimpleLifecycleStepId {
  switch (phase) {
    case 'render':
    case 'reconcile':
      return 'render';
    case 'commit':
    case 'layout':
    case 'paint':
      return 'dom';
    case 'effect':
      return 'effects';
    case 'update':
      return 'update';
    case 'cleanup':
      return 'unmount';
    default:
      return 'render';
  }
}

type Props = {
  activeStep: SimpleLifecycleStepId;
  reduceMotion?: boolean;
};

export function ReactLifecycleSimpleDiagram({
  activeStep,
  reduceMotion = false,
}: Props) {
  const activeIndex = SIMPLE_LIFECYCLE_STEPS.findIndex(
    (s) => s.id === activeStep,
  );
  const active = SIMPLE_LIFECYCLE_STEPS[activeIndex] ?? SIMPLE_LIFECYCLE_STEPS[0];
  const loopActive = activeStep === 'update' || activeStep === 'render';

  return (
    <div
      className="react-lifecycle-simple"
      role="img"
      aria-label={`Vòng đời React: ${SIMPLE_LIFECYCLE_STEPS.map((s) => s.label).join(', ')}`}
    >
      <p className="react-lifecycle-simple-title">
        Sơ đồ vòng đời <span>React</span> (tóm tắt)
      </p>

      <div className="react-lifecycle-simple-flow">
        <svg
          className="react-lifecycle-simple-wires"
          viewBox="0 0 1000 112"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <marker
              id="lifecycle-arrow-render"
              markerWidth="10"
              markerHeight="10"
              refX="8"
              refY="5"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 Z" fill="currentColor" />
            </marker>
            <linearGradient id="lifecycle-wire-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#61dafb" />
              <stop offset="100%" stopColor="var(--accent-2, #22d3ee)" />
            </linearGradient>
          </defs>

          {NODE_X.slice(0, -1).map((x1, i) => {
            const x2 = NODE_X[i + 1];
            const lit = i < activeIndex || (i === activeIndex && activeIndex < 4);
            const isCurrentEdge = i === activeIndex;
            return (
              <motion.line
                key={`edge-${i}`}
                x1={x1}
                y1={RAIL_Y}
                x2={x2}
                y2={RAIL_Y}
                stroke="url(#lifecycle-wire-gradient)"
                strokeWidth={isCurrentEdge ? 3 : 2}
                strokeLinecap="round"
                initial={false}
                animate={{
                  opacity: lit || isCurrentEdge ? 1 : 0.22,
                }}
                transition={{ duration: 0.35 }}
              />
            );
          })}

          <motion.path
            d={LOOP_PATH}
            fill="none"
            stroke="currentColor"
            strokeWidth={loopActive ? 2.5 : 1.75}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="8 6"
            markerEnd="url(#lifecycle-arrow-render)"
            initial={false}
            animate={{
              opacity: loopActive ? 0.95 : 0.35,
              strokeDashoffset: reduceMotion ? 0 : [0, -28],
            }}
            transition={{
              opacity: { duration: 0.35 },
              strokeDashoffset: {
                duration: 2.2,
                repeat: reduceMotion ? 0 : Infinity,
                ease: 'linear',
              },
            }}
          />

          {!reduceMotion && activeStep === 'update' ? (
            <circle r={5} fill="#fff" style={{ filter: 'drop-shadow(0 0 6px #61dafb)' }}>
              <animateMotion
                dur="2.4s"
                repeatCount="indefinite"
                path={LOOP_PATH}
              />
            </circle>
          ) : null}
        </svg>

        <p className="react-lifecycle-simple-loop-caption" aria-hidden>
          <span className="react-lifecycle-simple-loop-from">Update</span>
          <span className="react-lifecycle-simple-loop-arrow">↩</span>
          <span className="react-lifecycle-simple-loop-to">Render</span>
        </p>

        <div className="react-lifecycle-simple-track">
          {SIMPLE_LIFECYCLE_STEPS.map((step, i) => {
            const isActive = step.id === activeStep;
            const isPast = i < activeIndex;
            const isUpdate = step.id === 'update';

            return (
              <div
                key={step.id}
                className="react-lifecycle-simple-col"
                data-update={isUpdate ? 'true' : 'false'}
              >
                <motion.div
                  className="react-lifecycle-simple-node"
                  data-active={isActive ? 'true' : 'false'}
                  data-past={isPast ? 'true' : 'false'}
                  animate={
                    isActive && !reduceMotion
                      ? {
                          scale: [1, 1.05, 1],
                          boxShadow: [
                            '0 0 0 0 rgba(97, 218, 251, 0)',
                            '0 0 22px 3px rgba(97, 218, 251, 0.4)',
                            '0 0 0 0 rgba(97, 218, 251, 0)',
                          ],
                        }
                      : { scale: 1 }
                  }
                  transition={{
                    duration: 1.4,
                    repeat: isActive && !reduceMotion ? Infinity : 0,
                    ease: 'easeInOut',
                  }}
                >
                  <span className="react-lifecycle-simple-node-num">{i + 1}</span>
                  <span className="react-lifecycle-simple-node-label">
                    {step.label}
                  </span>
                  {isUpdate ? (
                    <span className="react-lifecycle-simple-node-back" aria-hidden>
                      → Render
                    </span>
                  ) : null}
                </motion.div>
              </div>
            );
          })}
        </div>
      </div>

      <motion.p
        key={active.id}
        className="react-lifecycle-simple-hint"
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <strong>{active.label}:</strong> {active.hint}
      </motion.p>
    </div>
  );
}
