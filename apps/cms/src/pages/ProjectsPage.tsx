import type { ProjectItem } from '@portfolio/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { useCallback, useEffect, useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as api from '../api/client';
import { loadTokens } from '../auth/storage';
import { ProjectContentFields } from '../components/content-forms';
import { ContentEntryRow } from '../components/ContentEntryRow';
import { ContentFormModal } from '../components/ContentFormModal';
import { ContentSectionNav } from '../components/ContentSectionNav';
import { Form } from '../components/form';
import { LoadingPulse } from '../components/LoadingPulse';
import { Button } from '../components/ui/Button';
import {
  projectFormDefaults,
  projectFormSchema,
  projectFormValuesToPayload,
  type ProjectFormValues,
} from '../schemas/content.schema';

export function ProjectsPage() {
  const formId = useId();
  const [items, setItems] = useState<ProjectItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: projectFormDefaults,
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const loadData = useCallback(async () => {
    const tokens = loadTokens();
    if (!tokens) {
      setLoading(false);
      return;
    }
    try {
      setItems(await api.fetchMyProjects(tokens.accessToken));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  useEffect(() => {
    if (!modalOpen) {
      return;
    }
    if (editingId) {
      const item = items.find((row) => row.id === editingId);
      if (item) {
        form.reset({
          title: item.title,
          url: item.url ?? '',
          description: item.description,
          tech: item.tech.join(', '),
        });
      }
    } else {
      form.reset(projectFormDefaults);
    }
  }, [modalOpen, editingId, items, form]);

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
    form.reset(projectFormDefaults);
  }

  function openAdd() {
    setEditingId(null);
    setModalOpen(true);
  }

  function openEdit(item: ProjectItem) {
    setEditingId(item.id);
    setModalOpen(true);
  }

  async function onValidSubmit(values: ProjectFormValues) {
    const tokens = loadTokens();
    if (!tokens) {
      return;
    }
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const payload = projectFormValuesToPayload(values);
      if (editingId) {
        const updated = await api.updateProject(
          tokens.accessToken,
          editingId,
          payload,
        );
        setItems((list) =>
          list.map((row) => (row.id === updated.id ? updated : row)),
        );
        setMessage('Project updated');
      } else {
        const created = await api.createProject(tokens.accessToken, payload);
        setItems((list) => [...list, created]);
        setMessage('Project added');
      }
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const tokens = loadTokens();
    if (!tokens || !window.confirm('Delete this project?')) {
      return;
    }
    try {
      await api.deleteProject(tokens.accessToken, id);
      setItems((list) => list.filter((row) => row.id !== id));
      if (editingId === id) {
        closeModal();
      }
      setMessage('Project deleted');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  }

  if (loading) {
    return <LoadingPulse label="Loading projects…" />;
  }

  return (
    <motion.div
      className="editor-shell wide"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <header className="editor-header">
        <h1>Projects</h1>
        <p>Manage portfolio projects, then pick them on Portfolio → Display.</p>
      </header>
      <ContentSectionNav />
      {error ? <div className="alert-error">{error}</div> : null}
      {message ? <div className="alert-success">{message}</div> : null}

      <section className="content-page">
        <div className="content-list-header">
          <h2>All ({items.length})</h2>
          <Button type="button" onClick={openAdd}>+ Add</Button>
        </div>
        {items.length === 0 ? (
          <p className="muted">No projects yet.</p>
        ) : (
          <ul className="content-entry-list">
            {items.map((item) => (
              <ContentEntryRow
                key={item.id}
                onEdit={() => openEdit(item)}
                onDelete={() => void handleDelete(item.id)}
                deleteLabel={`Delete ${item.title}`}
              >
                <h3>{item.title}</h3>
                {item.tech.length ? (
                  <p className="muted">{item.tech.join(' · ')}</p>
                ) : null}
              </ContentEntryRow>
            ))}
          </ul>
        )}
      </section>

      <ContentFormModal
        open={modalOpen}
        title={editingId ? 'Edit project' : 'Add project'}
        onClose={closeModal}
        formId={formId}
        saving={saving}
        submitLabel={editingId ? 'Save changes' : 'Add project'}
      >
        <Form form={form} id={formId} onSubmit={onValidSubmit}>
          <ProjectContentFields />
        </Form>
      </ContentFormModal>
    </motion.div>
  );
}
