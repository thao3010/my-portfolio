import type { Transition, Variants } from 'motion/react';

export const easeOutExpo = [0.16, 1, 0.3, 1] as const;

export const springSnappy: Transition = {
  type: 'spring',
  stiffness: 420,
  damping: 32,
  mass: 0.85,
};

export const springSoft: Transition = {
  type: 'spring',
  stiffness: 260,
  damping: 26,
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.04 },
  },
};

export const fadeUpBlur: Variants = {
  hidden: { opacity: 0, y: 36, filter: 'blur(10px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: springSnappy,
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: {
    opacity: 1,
    y: 0,
    transition: springSoft,
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  show: {
    opacity: 1,
    scale: 1,
    transition: springSnappy,
  },
};

export const revealSection = (index: number): Variants => ({
  hidden: { opacity: 0, y: 48 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      ...springSoft,
      delay: index * 0.06,
    },
  },
});

export const wordStagger: Variants = {
  hidden: { opacity: 0, y: '1.1em', rotateX: -28 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: springSnappy,
  },
};
