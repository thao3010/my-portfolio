'use client';

import type { PortfolioProject } from '@portfolio/shared';
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useTransform,
  type MotionValue,
} from 'motion/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { RichHtml } from './rich-html';

type ProjectsCarousel3DProps = {
  items: PortfolioProject[];
};

const SPIN_SPRING = {
  type: 'spring' as const,
  stiffness: 34,
  damping: 24,
  mass: 1.2,
  restDelta: 0.002,
};

function positiveMod(value: number, count: number) {
  return ((value % count) + count) % count;
}

function readCarouselStep(containerWidth: number) {
  const card = Math.min(340, containerWidth * 0.88);
  const maxStep = (containerWidth - card * 0.82) / 2 - 12;
  return Math.max(132, Math.min(220, maxStep));
}

/** 0 at center, 1 when |offset| >= 1 — smooth blend to side pose */
function sideBlend(distance: number) {
  const t = Math.min(Math.max(distance, 0), 1);
  return t * t * (3 - 2 * t);
}

/** Cancels .carousel-3d-stage rotateX so the focused card faces the viewer flat */
const STAGE_TILT_DEG = 11;

function CarouselCard({
  virtualIndex,
  rotation,
  step,
  item,
  onSelect,
}: {
  virtualIndex: number;
  rotation: MotionValue<number>;
  step: MotionValue<number>;
  item: PortfolioProject;
  onSelect: (virtualIndex: number) => void;
}) {
  const offset = useTransform(rotation, (value) => virtualIndex - value);
  const x = useTransform([offset, step], ([currentOffset, currentStep]) => {
    return (currentOffset as number) * (currentStep as number);
  });
  const z = useTransform(offset, (current) => {
    const distance = Math.abs(current);
    const blend = sideBlend(distance);
    return 220 * (1 - blend) - 110 * blend;
  });
  const rotateY = useTransform(offset, (current) => {
    const blend = sideBlend(Math.abs(current));
    const sign = current < 0 ? 1 : current > 0 ? -1 : 0;
    return sign * 62 * blend;
  });
  const rotateX = useTransform(offset, (current) => {
    const distance = Math.abs(current);
    const blend = sideBlend(distance);
    const sign = current < 0 ? 1 : current > 0 ? -1 : 0;
    const flat = -STAGE_TILT_DEG * (1 - blend);
    const sideTilt = sign * 9 * blend;
    return flat + sideTilt;
  });
  const scale = useTransform(offset, (current) => {
    const blend = sideBlend(Math.abs(current));
    return 1.14 - blend * 0.38;
  });
  const opacity = useTransform(offset, (current) => {
    const distance = Math.abs(current);
    if (distance >= 2.85) {
      return 0;
    }
    if (distance <= 1.05) {
      const blend = sideBlend(distance);
      return 1 - blend * 0.32;
    }
    return Math.max(0.28, 0.82 - (distance - 1.05) * 0.38);
  });
  const zIndex = useTransform(offset, (current) => Math.round(20 - Math.abs(current) * 8));
  const focus = useTransform(offset, (current) => 1 - Math.min(Math.abs(current) / 0.48, 1));
  const cursor = useTransform(offset, (current) =>
    Math.abs(current) < 0.2 ? 'default' : 'pointer',
  );
  const linkPointer = useTransform(focus, (value) => (value > 0.85 ? 'auto' : 'none'));

  return (
    <motion.article
      className="carousel-3d-card project-card"
      style={{
        x,
        z,
        rotateY,
        rotateX,
        scale,
        opacity,
        zIndex,
        cursor,
        ['--card-focus' as string]: focus,
      }}
      onClick={() => onSelect(virtualIndex)}
    >
      <h3>{item.title}</h3>
      <RichHtml html={item.description} />
      {item.url ? (
        <motion.a
          href={item.url}
          target="_blank"
          rel="noreferrer"
          style={{ pointerEvents: linkPointer }}
        >
          Visit project
        </motion.a>
      ) : null}
      <div className="tech-row">
        {item.tech.map((tech) => (
          <span key={tech} className="tech-pill">{tech}</span>
        ))}
      </div>
    </motion.article>
  );
}

export function ProjectsCarousel3D({ items }: ProjectsCarousel3DProps) {
  const count = items.length;
  const viewportRef = useRef<HTMLDivElement>(null);
  const rotation = useMotionValue(0);
  const step = useMotionValue(200);
  const [active, setActive] = useState(0);
  const [target, setTarget] = useState(0);
  const [span, setSpan] = useState({ min: -3, max: 3 });
  const spinGeneration = useRef(0);
  const spinControls = useRef<ReturnType<typeof animate> | null>(null);

  const syncStep = useCallback(() => {
    const width = viewportRef.current?.clientWidth;
    if (!width) {
      return;
    }
    step.set(readCarouselStep(width));
  }, [step]);

  const spinTo = useCallback((next: number) => {
    if (count <= 1 || Math.abs(next - rotation.get()) < 0.01) {
      return;
    }
    const from = rotation.get();
    setActive(positiveMod(Math.round(next), count));
    setSpan((current) => ({
      min: Math.min(current.min, Math.floor(Math.min(from, next)) - 3),
      max: Math.max(current.max, Math.ceil(Math.max(from, next)) + 3),
    }));
    setTarget(next);
  }, [count, rotation]);

  const go = useCallback((dir: -1 | 1) => {
    spinTo(rotation.get() + dir);
  }, [rotation, spinTo]);

  const selectIndex = useCallback((index: number) => {
    const current = positiveMod(Math.round(rotation.get()), count);
    let delta = index - current;
    if (delta > count / 2) {
      delta -= count;
    }
    if (delta < -count / 2) {
      delta += count;
    }
    if (delta === 0) {
      return;
    }
    spinTo(rotation.get() + delta);
  }, [count, rotation, spinTo]);

  useEffect(() => {
    syncStep();
    window.addEventListener('resize', syncStep);
    return () => window.removeEventListener('resize', syncStep);
  }, [syncStep]);

  useEffect(() => {
    if (count <= 1 || Math.abs(rotation.get() - target) < 0.001) {
      return;
    }

    spinControls.current?.stop();
    const generation = ++spinGeneration.current;

    spinControls.current = animate(rotation, target, {
      ...SPIN_SPRING,
      onComplete: () => {
        if (spinGeneration.current !== generation) {
          return;
        }
        const settled = Math.round(rotation.get());
        setSpan((current) => ({
          min: Math.min(current.min, settled - 3),
          max: Math.max(current.max, settled + 3),
        }));
      },
    });
  }, [count, rotation, target]);

  useEffect(() => {
    if (count <= 1) {
      return;
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        go(-1);
      }
      if (event.key === 'ArrowRight') {
        go(1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [count, go]);

  if (!count) {
    return null;
  }

  const project = items[active];
  const virtualIndexes = count === 1
    ? [0]
    : Array.from({ length: span.max - span.min + 1 }, (_, index) => span.min + index);

  return (
    <div className="carousel-3d" aria-roledescription="carousel">
      <div ref={viewportRef} className="carousel-3d-viewport">
        <div className="carousel-3d-stage">
          <div className="carousel-3d-ring">
            {virtualIndexes.map((virtualIndex) => {
              const index = positiveMod(virtualIndex, count);
              const item = items[index];
              return (
                <CarouselCard
                  key={`${item.id}:${virtualIndex}`}
                  virtualIndex={virtualIndex}
                  rotation={rotation}
                  step={step}
                  item={item}
                  onSelect={(next) => {
                    if (Math.abs(next - rotation.get()) < 0.35) {
                      return;
                    }
                    spinTo(next);
                  }}
                />
              );
            })}
          </div>
          <div className="carousel-3d-floor" aria-hidden />
        </div>

        <div className="carousel-3d-chrome">
          <div className="carousel-3d-controls">
            <button
              type="button"
              className="carousel-3d-btn"
              onClick={() => go(-1)}
              aria-label="Previous project"
            >
              ←
            </button>
            <div className="carousel-3d-dots" role="tablist">
              {items.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={index === active}
                  aria-label={item.title}
                  className={`carousel-3d-dot${index === active ? ' is-active' : ''}`}
                  onClick={() => selectIndex(index)}
                />
              ))}
            </div>
            <button
              type="button"
              className="carousel-3d-btn"
              onClick={() => go(1)}
              aria-label="Next project"
            >
              →
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.p
              key={project.id}
              className="carousel-3d-caption"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
            >
              {active + 1} / {count} — {project.title}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
