import type {
  ContactItem,
  ExperienceItem,
  PortfolioSectionId,
  ProjectItem,
  SkillIconPreset,
  SkillItem,
} from '@portfolio/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useId, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as api from '../api/client';
import { loadTokens } from '../auth/storage';
import {
  contactFormDefaults,
  contactFormSchema,
  contactFormValuesToPayload,
  experienceFormDefaults,
  experienceFormSchema,
  projectFormDefaults,
  projectFormSchema,
  projectFormValuesToPayload,
  skillFormDefaults,
  skillFormSchema,
  type ContactFormValues,
  type ExperienceFormValues,
  type ProjectFormValues,
  type SkillFormValues,
} from '../schemas/content.schema';
import {
  ContactContentFields,
  ExperienceContentFields,
  ProjectContentFields,
  SkillContentFields,
} from './content-forms';
import { ContentFormModal } from './ContentFormModal';
import { Form } from './form';

type CreatedItem =
  | ExperienceItem
  | ProjectItem
  | ContactItem
  | SkillItem;

const SECTION_TITLES: Record<PortfolioSectionId, string> = {
  contact: 'Add contact',
  experience: 'Add experience',
  projects: 'Add project',
  skills: 'Add skill',
};

const SECTION_SUBMIT: Record<PortfolioSectionId, string> = {
  contact: 'Add contact',
  experience: 'Add experience',
  projects: 'Add project',
  skills: 'Add skill',
};

type Props = {
  sectionId: PortfolioSectionId | null;
  onClose: () => void;
  onCreated: (sectionId: PortfolioSectionId, item: CreatedItem) => void;
};

export function LayoutContentCreateModal({
  sectionId,
  onClose,
  onCreated,
}: Props) {
  const formId = useId();
  const [saving, setSaving] = useState(false);
  const open = sectionId !== null;

  if (!sectionId) {
    return null;
  }

  function handleClose() {
    setSaving(false);
    onClose();
  }

  return (
    <ContentFormModal
      open={open}
      title={SECTION_TITLES[sectionId]}
      onClose={handleClose}
      formId={formId}
      saving={saving}
      submitLabel={SECTION_SUBMIT[sectionId]}
    >
      <LayoutSectionCreateForm
        key={sectionId}
        sectionId={sectionId}
        formId={formId}
        saving={saving}
        setSaving={setSaving}
        onClose={handleClose}
        onCreated={onCreated}
      />
    </ContentFormModal>
  );
}

function LayoutSectionCreateForm({
  sectionId,
  formId,
  saving,
  setSaving,
  onClose,
  onCreated,
}: {
  sectionId: PortfolioSectionId;
  formId: string;
  saving: boolean;
  setSaving: (value: boolean) => void;
  onClose: () => void;
  onCreated: (sectionId: PortfolioSectionId, item: CreatedItem) => void;
}) {
  const [apiError, setApiError] = useState<string | null>(null);
  const [skillPresets, setSkillPresets] = useState<SkillIconPreset[]>([]);

  const experienceForm = useForm<ExperienceFormValues>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: experienceFormDefaults,
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const projectForm = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: projectFormDefaults,
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const contactForm = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: contactFormDefaults,
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  const skillForm = useForm<SkillFormValues>({
    resolver: zodResolver(skillFormSchema),
    defaultValues: skillFormDefaults,
    mode: 'onTouched',
    reValidateMode: 'onChange',
  });

  useEffect(() => {
    if (sectionId !== 'skills') {
      return;
    }
    const tokens = loadTokens();
    if (!tokens) {
      return;
    }
    void api.fetchSkillIconPresets(tokens.accessToken).then(setSkillPresets);
  }, [sectionId]);

  useEffect(() => {
    setApiError(null);
    experienceForm.reset(experienceFormDefaults);
    projectForm.reset(projectFormDefaults);
    contactForm.reset(contactFormDefaults);
    skillForm.reset(skillFormDefaults);
  }, [sectionId, experienceForm, projectForm, contactForm, skillForm]);

  async function uploadSkillIcon(file: File) {
    const tokens = loadTokens();
    if (!tokens) {
      throw new Error('Not signed in');
    }
    const { url } = await api.uploadSkillIcon(tokens.accessToken, file);
    return url;
  }

  async function submitExperience(values: ExperienceFormValues) {
    const tokens = loadTokens();
    if (!tokens) {
      setApiError('Not signed in');
      return;
    }
    setSaving(true);
    setApiError(null);
    try {
      const created = await api.createExperience(tokens.accessToken, {
        company: values.company.trim(),
        title: values.title.trim(),
        period: values.period.trim(),
        description: values.description,
      });
      onCreated('experience', created);
      onClose();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function submitProject(values: ProjectFormValues) {
    const tokens = loadTokens();
    if (!tokens) {
      setApiError('Not signed in');
      return;
    }
    setSaving(true);
    setApiError(null);
    try {
      const created = await api.createProject(
        tokens.accessToken,
        projectFormValuesToPayload(values),
      );
      onCreated('projects', created);
      onClose();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function submitContact(values: ContactFormValues) {
    const tokens = loadTokens();
    if (!tokens) {
      setApiError('Not signed in');
      return;
    }
    setSaving(true);
    setApiError(null);
    try {
      const created = await api.createContact(
        tokens.accessToken,
        contactFormValuesToPayload(values),
      );
      onCreated('contact', created);
      onClose();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function submitSkill(values: SkillFormValues) {
    const tokens = loadTokens();
    if (!tokens) {
      setApiError('Not signed in');
      return;
    }
    setSaving(true);
    setApiError(null);
    try {
      const created = await api.createSkill(tokens.accessToken, {
        title: values.title.trim(),
        description: values.description.trim(),
        icon: values.icon.trim(),
      });
      onCreated('skills', created);
      onClose();
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  const errorBanner = apiError ? (
    <div className="alert-error content-modal-error">{apiError}</div>
  ) : null;

  switch (sectionId) {
    case 'experience':
      return (
        <>
          {errorBanner}
          <Form
            form={experienceForm}
            id={formId}
            onSubmit={submitExperience}
          >
            <ExperienceContentFields />
          </Form>
        </>
      );
    case 'projects':
      return (
        <>
          {errorBanner}
          <Form form={projectForm} id={formId} onSubmit={submitProject}>
            <ProjectContentFields />
          </Form>
        </>
      );
    case 'contact':
      return (
        <>
          {errorBanner}
          <Form form={contactForm} id={formId} onSubmit={submitContact}>
            <ContactContentFields />
          </Form>
        </>
      );
    case 'skills':
      return (
        <>
          {errorBanner}
          <Form form={skillForm} id={formId} onSubmit={submitSkill}>
            <SkillContentFields
              presets={skillPresets}
              onUpload={uploadSkillIcon}
              saving={saving}
            />
          </Form>
        </>
      );
    default:
      return null;
  }
}
