import { AnimatePresence, motion } from 'motion/react';

import type { ReactNode } from 'react';

import { fadeUp, staggerContainer } from '../../motion/presets';



type AuthLayoutProps = {

  mode: 'login' | 'register';

  title: string;

  subtitle: string;

  error: string | null;

  footer: ReactNode;

  children: ReactNode;

};



const PANEL_COPY = {

  login: {

    eyebrow: 'Welcome back',

    headline: 'Ship your portfolio with motion & clarity.',

    bullets: ['Edit work & experience', 'Publish in one click', 'Locale-aware URLs'],

  },

  register: {

    eyebrow: 'Join the builder',

    headline: 'Claim your public URL and tell your story.',

    bullets: ['Unique username', 'CMS + public site', 'Role-based access'],

  },

};



export function AuthLayout({

  mode,

  title,

  subtitle,

  error,

  footer,

  children,

}: AuthLayoutProps) {

  const panel = PANEL_COPY[mode];



  return (

    <div className="auth-scene">

      <motion.aside

        className="auth-panel"

        initial={{ opacity: 0, y: 12 }}

        animate={{ opacity: 1, y: 0 }}

        transition={{ type: 'spring', stiffness: 280, damping: 28, delay: 0.05 }}

      >

        <p className="auth-eyebrow">{panel.eyebrow}</p>

        <h2 className="auth-headline">{panel.headline}</h2>

        <ul className="auth-bullets">

          {panel.bullets.map((item, i) => (

            <motion.li

              key={item}

              initial={{ opacity: 0, y: 8 }}

              animate={{ opacity: 1, y: 0 }}

              transition={{

                delay: 0.12 + i * 0.07,

                type: 'spring',

                stiffness: 320,

                damping: 26,

              }}

            >

              <span className="auth-bullet-dot" aria-hidden />

              {item}

            </motion.li>

          ))}

        </ul>

      </motion.aside>



      <div className="auth-divider" aria-hidden />



      <motion.div

        layoutId="auth-form-panel"

        className="auth-form-column"

        variants={staggerContainer}

        initial="hidden"

        animate="show"

      >

        <motion.h1 variants={fadeUp}>{title}</motion.h1>

        <motion.p className="auth-subtitle" variants={fadeUp}>

          {subtitle}

        </motion.p>



        <AnimatePresence mode="wait">

          {error ? (

            <motion.div

              key={error}

              className="alert-error auth-alert"

              role="alert"

              initial={{ opacity: 0, y: -8, height: 0, marginBottom: 0 }}

              animate={{ opacity: 1, y: 0, height: 'auto', marginBottom: 12 }}

              exit={{ opacity: 0, y: -6, height: 0, marginBottom: 0 }}

              transition={{ type: 'spring', stiffness: 400, damping: 32 }}

            >

              {error}

            </motion.div>

          ) : null}

        </AnimatePresence>



        <div className="auth-form-wrap">{children}</div>



        <motion.p className="auth-footer" variants={fadeUp}>

          {footer}

        </motion.p>

      </motion.div>

    </div>

  );

}


