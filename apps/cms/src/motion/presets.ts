import type { Transition, Variants } from 'motion/react';

export const springSnappy: Transition = {
  type: 'spring',
  stiffness: 420,
  damping: 32,
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(6px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: springSnappy,
  },
};

export const cardEnter: Variants = {
  hidden: { opacity: 0, y: 24, rotateX: 10, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: springSnappy,
  },
};
