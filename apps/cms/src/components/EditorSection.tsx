import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { fadeUp } from '../motion/presets';

export function EditorSection({
  title,
  action,
  children,
  index = 0,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  index?: number;
}) {
  return (
    <motion.section
      className="editor-section"
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
      transition={{ delay: index * 0.05 }}
    >
      {action ? (
        <div className="section-row">
          <h2>{title}</h2>
          {action}
        </div>
      ) : (
        <h2>{title}</h2>
      )}
      {children}
    </motion.section>
  );
}
