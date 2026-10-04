import { motion } from 'motion/react';

export function LoadingPulse({ label = 'Loading…' }: { label?: string }) {
  return (
    <motion.div
      className="editor-shell"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      aria-busy
    >
      <p>{label}</p>
      <div className="loading-pulse">
        <span style={{ width: '72%' }} />
        <span style={{ width: '100%' }} />
        <span style={{ width: '88%' }} />
      </div>
    </motion.div>
  );
}
