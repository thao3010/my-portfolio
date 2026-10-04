import { motion, type HTMLMotionProps } from 'motion/react';

export function MotionPressable({
  className,
  children,
  ...props
}: HTMLMotionProps<'button'>) {
  return (
    <motion.button
      className={className}
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 500, damping: 28 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
