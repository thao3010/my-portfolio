import { UserRole } from '@portfolio/shared';
import { AnimatePresence, motion } from 'motion/react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './auth/AuthContext';
import { AdminRoute } from './components/AdminRoute';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ThemeToggle } from './components/ThemeToggle';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { ContactsPage } from './pages/ContactsPage';
import { ExperiencesPage } from './pages/ExperiencesPage';
import { PortfolioEditorPage } from './pages/PortfolioEditorPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { RegisterPage } from './pages/RegisterPage';
import { SkillsPage } from './pages/SkillsPage';
function HeaderNavLink({ href, children }: { href: string; children: string }) {
  return (
    <motion.a
      href={href}
      className="header-nav-link"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.97 }}
    >
      {children}
      <span className="header-nav-underline" />
    </motion.a>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -12, filter: 'blur(6px)' }}
        transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
        className="route-shell"
      >
        <Routes location={location}>
          <Route
            path="/"
            element={
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/portfolio"
            element={
              <ProtectedRoute>
                <PortfolioEditorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/portfolio/layout"
            element={<Navigate to="/portfolio?tab=display" replace />}
          />
          <Route
            path="/cv/layout"
            element={<Navigate to="/portfolio?tab=cv" replace />}
          />
          <Route
            path="/content/experiences"
            element={
              <ProtectedRoute>
                <ExperiencesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/content/projects"
            element={
              <ProtectedRoute>
                <ProjectsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/content/contacts"
            element={
              <ProtectedRoute>
                <ContactsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/content/skills"
            element={
              <ProtectedRoute>
                <SkillsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/skills" element={<Navigate to="/content/skills" replace />} />
          <Route
            path="/admin/users"
            element={
              <AdminRoute>
                <AdminUsersPage />
              </AdminRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}

export function App() {
  const { user } = useAuth();
  const isAdmin = user?.role === UserRole.ADMIN;
  const location = useLocation();
  const isAuthRoute =
    location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className={`app-shell${isAuthRoute ? ' app-shell--auth' : ''}`}>
      <motion.header
        className={`app-header${isAuthRoute ? ' app-header--auth' : ''}`}
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      >
        <motion.strong layoutId="brand">Portfolio CMS</motion.strong>
        <nav>
          {user ? (
            <>
              <HeaderNavLink href="/dashboard">Dashboard</HeaderNavLink>
              <HeaderNavLink href="/portfolio">Portfolio</HeaderNavLink>
              <HeaderNavLink href="/content/experiences">Content</HeaderNavLink>
              {isAdmin ? (
                <HeaderNavLink href="/admin/users">Users</HeaderNavLink>
              ) : null}
            </>
          ) : (
            <>
              <HeaderNavLink href="/login">Sign in</HeaderNavLink>
              <HeaderNavLink href="/register">Register</HeaderNavLink>
            </>
          )}
          <ThemeToggle />
        </nav>
      </motion.header>
      <main
        className={`app-main app-main-wide${isAuthRoute ? ' app-main--auth' : ''}`}
      >
        {isAuthRoute ? <div className="auth-backdrop" aria-hidden /> : null}
        <AnimatedRoutes />
      </main>
    </div>
  );
}
