import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { fadeUp } from '../../motion/presets';

type AuthFieldProps = {
  label: string;
  htmlFor: string;
  hint?: string;
  children: ReactNode;
};

export function AuthField({ label, htmlFor, hint, children }: AuthFieldProps) {
  return (
    <motion.div className="form-field auth-field" variants={fadeUp}>
      <label htmlFor={htmlFor}>{label}</label>
      <div className="auth-input-shell">{children}</div>
      {hint ? <span className="auth-hint">{hint}</span> : null}
    </motion.div>
  );
}
