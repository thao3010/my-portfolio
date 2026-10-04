import { UserRole } from '@portfolio/shared';
import { motion } from 'motion/react';
import { MotionPressable } from '../components/MotionPressable';
import { fadeUp, staggerContainer } from '../motion/presets';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const WEB_ORIGIN = import.meta.env.VITE_WEB_URL ?? 'http://localhost:3000';

export function DashboardPage() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  const publicUrl = `${WEB_ORIGIN}/${user.preferredLocale}/${user.username}`;
  const isAdmin = user.role === UserRole.ADMIN;

  return (
    <motion.div
      className="card dashboard-card"
      variants={staggerContainer}
      initial="hidden"
      animate="show"
    >
      <motion.h1 variants={fadeUp}>Dashboard</motion.h1>
      <motion.p variants={fadeUp}>
        {isAdmin
          ? 'Admin workspace — manage users or edit your public portfolio.'
          : 'Update your portfolio content and publish when ready.'}
      </motion.p>
      <motion.dl className="dashboard-grid" variants={staggerContainer}>
        {[
          ['Email', user.email],
          ['Username', user.username],
          ['Role', user.role],
          [
            'Public URL',
            <a href={publicUrl} target="_blank" rel="noreferrer">{publicUrl}</a>,
          ],
        ].map(([label, value]) => (
          <motion.div key={String(label)} variants={fadeUp}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </motion.div>
        ))}
      </motion.dl>
      <motion.div className="dashboard-actions" variants={fadeUp}>
        <Link className="btn btn-primary" to="/portfolio">
          Portfolio
        </Link>
        <Link className="btn btn-secondary" to="/content/experiences">
          Content
        </Link>
        {isAdmin ? (
          <Link className="btn btn-secondary" to="/admin/users">
            Manage users
          </Link>
        ) : null}
        <MotionPressable
          className="btn btn-ghost-inline"
          type="button"
          onClick={() => void logout()}
        >
          Sign out
        </MotionPressable>
      </motion.div>
    </motion.div>
  );
}
