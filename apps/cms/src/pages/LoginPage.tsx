import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { AuthLayout } from '../components/auth/AuthLayout';
import { Form, RhfInput } from '../components/form';
import { Button } from '../components/ui/Button';
import { fadeUp } from '../motion/presets';
import { loginSchema, type LoginFormValues } from '../schemas/auth.schema';
import { useState } from 'react';

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const submitting = form.formState.isSubmitting;

  async function onSubmit(values: LoginFormValues) {
    setError(null);
    try {
      await login(values.email, values.password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    }
  }

  return (
    <AuthLayout
      mode="login"
      title="Sign in"
      subtitle="Manage your portfolio in the CMS."
      error={error}
      footer={
        <>
          No account?{' '}
          <Link className="auth-link" to="/register">
            Register
          </Link>
        </>
      }
    >
      <Form form={form} onSubmit={onSubmit} className="auth-form">
        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <RhfInput
            name="email"
            label="Email"
            type="email"
            autoComplete="email"
            shell="auth"
          />
        </motion.div>
        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <RhfInput
            name="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            shell="auth"
          />
        </motion.div>
        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <Button
            type="submit"
            className="auth-submit"
            loading={submitting}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={submitting ? 'loading' : 'idle'}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {submitting ? 'Signing in…' : 'Sign in'}
              </motion.span>
            </AnimatePresence>
          </Button>
        </motion.div>
      </Form>
    </AuthLayout>
  );
}
