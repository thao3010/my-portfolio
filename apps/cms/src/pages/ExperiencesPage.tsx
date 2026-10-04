import type { ExperienceItem } from '@portfolio/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { useCallback, useEffect, useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as api from '../api/client';
import { loadTokens } from '../auth/storage';
import { ExperienceContentFields } from '../components/content-forms';
import { ContentEntryRow } from '../components/ContentEntryRow';
import { ContentFormModal } from '../components/ContentFormModal';
import { ContentSectionNav } from '../components/ContentSectionNav';
import { Form } from '../components/form';
import { LoadingPulse } from '../components/LoadingPulse';
import { Button } from '../components/ui/Button';
import {
  experienceFormDefaults,
  experienceFormSchema,
  type ExperienceFormValues,
} from '../schemas/content.schema';

export function ExperiencesPage() {
  const formId = useId();
  const [items, setItems] = useState<ExperienceItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const form = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: experienceFormDefaults,
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
      setItems(await api.fetchMyExperiences(tokens.accessToken));
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
          company: item.company,
          title: item.title,
          period: item.period,
          description: item.description,
        });
      }
    } else {
      form.reset(experienceFormDefaults);
    }
  }, [modalOpen, editingId, items, form]);

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
    form.reset(experienceFormDefaults);
  }

  function openAdd() {
    setEditingId(null);
    setModalOpen(true);
  }

  function openEdit(item: ExperienceItem) {
    setEditingId(item.id);
    setModalOpen(true);
  }

  async function onValidSubmit(values: ExperienceFormValues) {
    const tokens = loadTokens();
    if (!tokens) {
      return;
    }
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const payload = {
        company: values.company.trim(),
        title: values.title.trim(),
        period: values.period.trim(),
        description: values.description,
      };
      if (editingId) {
        const updated = await api.updateExperience(
          tokens.accessToken,
          editingId,
          payload,
        );
        setItems((list) =>
          list.map((row) => (row.id === updated.id ? updated : row)),
        );
        setMessage('Experience updated');
      } else {
        const created = await api.createExperience(tokens.accessToken, payload);
        setItems((list) => [...list, created]);
        setMessage('Experience added');
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
    if (!tokens || !window.confirm('Delete this experience?')) {
      return;
    }
    try {
      await api.deleteExperience(tokens.accessToken, id);
      setItems((list) => list.filter((row) => row.id !== id));
      if (editingId === id) {
        closeModal();
      }
      setMessage('Experience deleted');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  }

  if (loading) {
    return <LoadingPulse label="Loading experiences…" />;
  }

  return (
    <motion.div
      className="editor-shell wide"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <header className="editor-header">
        <h1>Experience</h1>
        <p>Add work history, then choose what to show under Portfolio → Display.</p>
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
          <p className="muted">No experiences yet.</p>
        ) : (
          <ul className="content-entry-list">
            {items.map((item) => (
              <ContentEntryRow
                key={item.id}
                onEdit={() => openEdit(item)}
                onDelete={() => void handleDelete(item.id)}
                deleteLabel={`Delete ${item.title}`}
              >
                <h3>{item.title} @ {item.company}</h3>
                <p className="muted">{item.period || 'No period'}</p>
              </ContentEntryRow>
            ))}
          </ul>
        )}
      </section>

      <ContentFormModal
        open={modalOpen}
        title={editingId ? 'Edit experience' : 'Add experience'}
        onClose={closeModal}
        formId={formId}
        saving={saving}
        submitLabel={editingId ? 'Save changes' : 'Add experience'}
      >
        <Form form={form} id={formId} onSubmit={onValidSubmit}>
          <ExperienceContentFields />
        </Form>
      </ContentFormModal>
    </motion.div>
  );
}
