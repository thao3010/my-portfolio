import { UserRole } from '@portfolio/shared';
import { motion } from 'motion/react';
import { LoadingPulse } from '../components/LoadingPulse';
import { useEffect, useState } from 'react';
import * as api from '../api/client';
import type { AuthUser } from '../api/types';
import { loadTokens } from '../auth/storage';

export function AdminUsersPage() {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const tokens = loadTokens();
    if (!tokens) {
      setLoading(false);
      return;
    }
    void api
      .fetchAdminUsers(tokens.accessToken)
      .then(setUsers)
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Failed to load users');
      })
      .finally(() => setLoading(false));
  }, []);

  async function updateUser(
    userId: string,
    patch: { role?: string; isActive?: boolean },
  ) {
    const tokens = loadTokens();
    if (!tokens) {
      return;
    }
    try {
      const updated = await api.patchAdminUser(tokens.accessToken, userId, patch);
      setUsers((list) =>
        list.map((user) => (user.id === updated.id ? updated : user)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Update failed');
    }
  }

  if (loading) {
    return <LoadingPulse label="Loading users…" />;
  }

  return (
    <motion.div
      className="editor-shell wide"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <header className="editor-header">
        <h1>User management</h1>
        <p>Admin-only: roles and account status.</p>
      </header>
      {error ? <div className="alert-error">{error}</div> : null}
      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Username</th>
              <th>Role</th>
              <th>Active</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) =>
                      void updateUser(user.id, { role: e.target.value })
                    }
                  >
                    <option value={UserRole.USER}>user</option>
                    <option value={UserRole.ADMIN}>admin</option>
                  </select>
                </td>
                <td>
                  <input
                    type="checkbox"
                    checked={user.isActive ?? true}
                    onChange={(e) =>
                      void updateUser(user.id, { isActive: e.target.checked })
                    }
                  />
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
