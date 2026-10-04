import type { SkillIconPreset, SkillItem } from '@portfolio/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { useCallback, useEffect, useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as api from '../api/client';
import { loadTokens } from '../auth/storage';
import { SkillContentFields } from '../components/content-forms';
import { ContentEntryRow } from '../components/ContentEntryRow';
import { ContentFormModal } from '../components/ContentFormModal';
import { ContentSectionNav } from '../components/ContentSectionNav';
import { Form } from '../components/form';
import { LoadingPulse } from '../components/LoadingPulse';
import { Button } from '../components/ui/Button';
import {
  skillFormDefaults,
  skillFormSchema,
  type SkillFormValues,
} from '../schemas/content.schema';

export function SkillsPage() {
  const formId = useId();
  const [skills, setSkills] = useState<SkillItem[]>([]);
  const [presets, setPresets] = useState<SkillIconPreset[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const form = useForm<SkillFormValues>({
    resolver: zodResolver(skillFormSchema),
    defaultValues: skillFormDefaults,
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const loadData = useCallback(async () => {
    const tokens = loadTokens();
    if (!tokens) {
      setLoading(false);
      return;
    }
    setError(null);
    try {
      const [list, iconPresets] = await Promise.all([
        api.fetchMySkills(tokens.accessToken),
        api.fetchSkillIconPresets(tokens.accessToken),
      ]);
      setSkills(list);
      setPresets(iconPresets);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load skills');
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
      const skill = skills.find((row) => row.id === editingId);
      if (skill) {
        form.reset({
          title: skill.title,
          description: skill.description,
          icon: skill.icon,
        });
      }
    } else {
      form.reset(skillFormDefaults);
    }
  }, [modalOpen, editingId, skills, form]);

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
    form.reset(skillFormDefaults);
  }

  function openAdd() {
    setEditingId(null);
    setModalOpen(true);
  }

  function openEdit(skill: SkillItem) {
    setEditingId(skill.id);
    setModalOpen(true);
  }

  async function onValidSubmit(values: SkillFormValues) {
    const tokens = loadTokens();
    if (!tokens) {
      return;
    }
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const payload = {
        title: values.title.trim(),
        description: values.description.trim(),
        icon: values.icon.trim(),
      };
      if (editingId) {
        const updated = await api.updateSkill(
          tokens.accessToken,
          editingId,
          payload,
        );
        setSkills((list) =>
          list.map((s) => (s.id === updated.id ? updated : s)),
        );
        setMessage('Skill updated');
      } else {
        const created = await api.createSkill(tokens.accessToken, payload);
        setSkills((list) => [...list, created]);
        setMessage('Skill added');
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
    if (!tokens || !window.confirm('Delete this skill?')) {
      return;
    }
    setError(null);
    try {
      await api.deleteSkill(tokens.accessToken, id);
      setSkills((list) => list.filter((s) => s.id !== id));
      if (editingId === id) {
        closeModal();
      }
      setMessage('Skill deleted');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Delete failed');
    }
  }

  async function uploadIcon(file: File) {
    const tokens = loadTokens();
    if (!tokens) {
      throw new Error('Not signed in');
    }
    const { url } = await api.uploadSkillIcon(tokens.accessToken, file);
    return url;
  }

  if (loading) {
    return <LoadingPulse label="Loading skills…" />;
  }

  return (
    <motion.div
      className="editor-shell wide"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <header className="editor-header">
        <h1>Skills</h1>
        <p>Add skills with icon, title, and description for your portfolio.</p>
      </header>
      <ContentSectionNav />
      {error ? <div className="alert-error">{error}</div> : null}
      {message ? <div className="alert-success">{message}</div> : null}

      <section className="content-page">
        <div className="content-list-header">
          <h2>All ({skills.length})</h2>
          <Button type="button" onClick={openAdd}>+ Add</Button>
        </div>
        {skills.length === 0 ? (
          <p className="muted">No skills yet.</p>
        ) : (
          <ul className="content-entry-list">
            {skills.map((skill) => (
              <ContentEntryRow
                key={skill.id}
                className="content-entry-card--skill"
                onEdit={() => openEdit(skill)}
                onDelete={() => void handleDelete(skill.id)}
                deleteLabel={`Delete ${skill.title}`}
              >
                <img src={skill.icon} alt="" className="skill-card__icon" />
                <div>
                  <h3>{skill.title}</h3>
                  <p className="muted">
                    {skill.description || 'No description'}
                  </p>
                </div>
              </ContentEntryRow>
            ))}
          </ul>
        )}
      </section>

      <ContentFormModal
        open={modalOpen}
        title={editingId ? 'Edit skill' : 'Add skill'}
        onClose={closeModal}
        formId={formId}
        saving={saving}
        submitLabel={editingId ? 'Save changes' : 'Add skill'}
      >
        <Form form={form} id={formId} onSubmit={onValidSubmit}>
          <SkillContentFields
            presets={presets}
            onUpload={uploadIcon}
            saving={saving}
          />
        </Form>
      </ContentFormModal>
    </motion.div>
  );
}
