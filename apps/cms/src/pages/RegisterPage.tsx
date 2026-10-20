import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'motion/react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { AuthLayout } from '../components/auth/AuthLayout';
import { Form, RhfInput } from '../components/form';
import { Button } from '../components/ui/Button';
import { fadeUp } from '../motion/presets';
import { registerSchema, type RegisterFormValues } from '../schemas/auth.schema';
import { notify } from '../lib/notify';

export function RegisterPage() {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      username: '',
    },
  });

  const submitting = form.formState.isSubmitting;

  async function onSubmit(values: RegisterFormValues) {
    try {
      await registerUser(values);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      notify.error(err instanceof Error ? err.message : 'Registration failed');
    }
  }

  return (
    <AuthLayout
      mode="register"
      title="Create account"
      subtitle="Pick a username for your public portfolio URL."
      footer={
        <>
          Already have an account?{' '}
          <Link className="auth-link" to="/login">
            Sign in
          </Link>
        </>
      }
    >
      <Form form={form} onSubmit={onSubmit} className="auth-form">
        <RhfInput name="email" label="Email" type="email" autoComplete="email" shell="auth" />
        <RhfInput
          name="username"
          label="Username"
          autoComplete="username"
          hint="Lowercase, numbers, hyphens · 3–30 chars"
          shell="auth"
        />
        <RhfInput
          name="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          hint="At least 8 characters"
          shell="auth"
        />
        <motion.div variants={fadeUp} initial="hidden" animate="show">
          <Button type="submit" className="auth-submit" loading={submitting}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={submitting ? 'loading' : 'idle'}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {submitting ? 'Creating…' : 'Create account'}
              </motion.span>
            </AnimatePresence>
          </Button>
        </motion.div>
      </Form>
    </AuthLayout>
  );
}
