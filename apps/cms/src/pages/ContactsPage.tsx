import type { ContactItem } from '@portfolio/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { useCallback, useEffect, useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as api from '../api/client';
import { loadTokens } from '../auth/storage';
import { ContactContentFields } from '../components/content-forms';
import { ContentEntryRow } from '../components/ContentEntryRow';
import { ContentFormModal } from '../components/ContentFormModal';
import { ContentSectionNav } from '../components/ContentSectionNav';
import { Form } from '../components/form';
import { LoadingPulse } from '../components/LoadingPulse';
import { Button } from '../components/ui/Button';
import {
  contactFormDefaults,
  contactFormSchema,
  contactFormValuesToPayload,
  type ContactFormValues,
} from '../schemas/content.schema';

export function ContactsPage() {
  const formId = useId();
  const [items, setItems] = useState<ContactItem[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: contactFormDefaults,
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
      setItems(await api.fetchMyContacts(tokens.accessToken));
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
          label: item.label,
          email: item.email ?? '',
          phone: item.phone ?? '',
          github: item.github ?? '',
          linkedin: item.linkedin ?? '',
          website: item.website ?? '',
          location: item.location ?? '',
        });
      }
    } else {
      form.reset(contactFormDefaults);
    }
  }, [modalOpen, editingId, items, form]);

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
    form.reset(contactFormDefaults);
  }

  function openAdd() {
    setEditingId(null);
    setModalOpen(true);
  }

  function openEdit(item: ContactItem) {
    setEditingId(item.id);
    setModalOpen(true);
  }

  async function onValidSubmit(values: ContactFormValues) {
    const tokens = loadTokens();
    if (!tokens) {
      return;
    }
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const payload = contactFormValuesToPayload(values);
      if (editingId) {
        const updated = await api.updateContact(
          tokens.accessToken,
          editingId,
          payload,
        );
        setItems((list) =>
          list.map((row) => (row.id === updated.id ? updated : row)),
        );
        setMessage('Contact updated');
      } else {
        const created = await api.createContact(tokens.accessToken, payload);
        setItems((list) => [...list, created]);
        setMessage('Contact added');
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
    if (!tokens || !window.confirm('Delete this contact profile?')) {
      return;
    }
    try {
      await api.deleteContact(tokens.accessToken, id);
      setItems((list) => list.filter((row) => row.id !== id));
      if (editingId === id) {
        closeModal();
      }
      setMessage('Contact deleted');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  }

  if (loading) {
    return <LoadingPulse label="Loading contacts…" />;
  }

  return (
    <motion.div
      className="editor-shell wide"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <header className="editor-header">
        <h1>Contact</h1>
        <p>Store contact profiles, then choose which to show on Portfolio → Display.</p>
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
          <p className="muted">No contact profiles yet.</p>
        ) : (
          <ul className="content-entry-list">
            {items.map((item) => (
              <ContentEntryRow
                key={item.id}
                onEdit={() => openEdit(item)}
                onDelete={() => void handleDelete(item.id)}
                deleteLabel={`Delete ${item.label}`}
              >
                <h3>{item.label}</h3>
                <p className="muted">
                  {item.email || item.phone || 'No email/phone'}
                </p>
              </ContentEntryRow>
            ))}
          </ul>
        )}
      </section>

      <ContentFormModal
        open={modalOpen}
        title={editingId ? 'Edit contact' : 'Add contact'}
        onClose={closeModal}
        formId={formId}
        saving={saving}
        submitLabel={editingId ? 'Save changes' : 'Add contact'}
      >
        <Form form={form} id={formId} onSubmit={onValidSubmit}>
          <ContactContentFields />
        </Form>
      </ContentFormModal>
    </motion.div>
  );
}
