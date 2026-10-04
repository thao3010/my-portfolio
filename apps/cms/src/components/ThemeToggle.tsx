import { motion } from 'motion/react';
import { useTheme } from '../theme/ThemeContext';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      type="button"
      className="theme-toggle"
      onClick={toggleTheme}
      whileTap={{ scale: 0.92 }}
      whileHover={{ scale: 1.04 }}
      aria-label="Toggle dark mode"
    >
      {theme === 'dark' ? '☀' : '☾'}
    </motion.button>
  );
}
