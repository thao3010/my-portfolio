import {
  createEmptySurfaceLayout,
  type ContactItem,
  type ExperienceItem,
  type PortfolioSectionId,
  type ProjectItem,
  type SkillItem,
  type SurfaceLayout,
} from '@portfolio/shared';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router-dom';
import * as api from '../api/client';
import { loadTokens } from '../auth/storage';
import { EditorSection } from '../components/EditorSection';
import { LoadingPulse } from '../components/LoadingPulse';
import { LayoutContentCreateModal } from '../components/LayoutContentCreateModal';
import {
  SECTION_ID_TO_KEY,
  SurfaceLayoutEditor,
  type LayoutLibrary,
} from '../components/SurfaceLayoutEditor';
import {
  Form,
  RhfCheckbox,
  RhfInput,
  RhfRichText,
} from '../components/form';
import { Button } from '../components/ui/Button';
import {
  portfolioFormSchema,
  type PortfolioFormValues,
} from '../schemas/portfolio.schema';
import { usePortfolioEditorStore } from '../stores/portfolio-editor.store';

type PortfolioTab = 'header' | 'display' | 'cv';

const TAB_QUERY: Record<PortfolioTab, string> = {
  header: 'header',
  display: 'display',
  cv: 'cv',
};

function tabFromSearch(params: URLSearchParams): PortfolioTab {
  const raw = params.get('tab');
  if (raw === 'display' || raw === 'cv' || raw === 'layout') {
    return raw === 'cv' ? 'cv' : 'display';
  }
  return 'header';
}

export function PortfolioEditorPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = tabFromSearch(searchParams);

  const { loading, saving, error, message, setLoading, setSaving, setError, setMessage, clearFeedback } =
    usePortfolioEditorStore();

  const [portfolioLayout, setPortfolioLayout] = useState<SurfaceLayout>(
    createEmptySurfaceLayout(),
  );
  const [cvLayout, setCvLayout] = useState<SurfaceLayout>(
    createEmptySurfaceLayout(),
  );
  const [library, setLibrary] = useState<LayoutLibrary>({
    experiences: [],
    projects: [],
    contacts: [],
    skills: [],
  });
  const [layoutSaving, setLayoutSaving] = useState(false);
  const [layoutMessage, setLayoutMessage] = useState<string | null>(null);
  const [layoutError, setLayoutError] = useState<string | null>(null);
  const [createSection, setCreateSection] =
    useState<PortfolioSectionId | null>(null);
  const [createLayoutTarget, setCreateLayoutTarget] = useState<
    'portfolio' | 'cv'
  >('portfolio');

  const form = useForm<PortfolioFormValues>({
    resolver: zodResolver(portfolioFormSchema),
    defaultValues: {
      displayName: '',
      headline: '',
      summary: '',
      isPublished: false,
    },
  });

  const loadAll = useCallback(async () => {
    const tokens = loadTokens();
    if (!tokens) {
      setLoading(false);
      return;
    }
    try {
      const [portfolio, experiences, projects, contacts, skills] =
        await Promise.all([
          api.fetchMyPortfolio(tokens.accessToken),
          api.fetchMyExperiences(tokens.accessToken),
          api.fetchMyProjects(tokens.accessToken),
          api.fetchMyContacts(tokens.accessToken),
          api.fetchMySkills(tokens.accessToken),
        ]);
      form.reset({
        displayName: portfolio.displayName,
        headline: portfolio.headline,
        summary: portfolio.summary,
        isPublished: portfolio.isPublished,
      });
      setPortfolioLayout(portfolio.portfolioLayout);
      setCvLayout(portfolio.cvLayout);
      setLibrary({ experiences, projects, contacts, skills });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load portfolio');
    } finally {
      setLoading(false);
    }
  }, [form, setError, setLoading]);

  useEffect(() => {
    void loadAll();
  }, [loadAll]);

  function setTab(tab: PortfolioTab) {
    setSearchParams(tab === 'header' ? {} : { tab: TAB_QUERY[tab] });
  }

  function openCreateForSection(
    sectionId: PortfolioSectionId,
    target: 'portfolio' | 'cv',
  ) {
    setCreateLayoutTarget(target);
    setCreateSection(sectionId);
  }

  function appendCreatedToLayout(
    sectionId: PortfolioSectionId,
    itemId: string,
    target: 'portfolio' | 'cv',
  ) {
    const key = SECTION_ID_TO_KEY[sectionId];
    if (target === 'portfolio') {
      setPortfolioLayout((layout) => {
        const ids = layout[key];
        if (ids.includes(itemId)) {
          return layout;
        }
        return { ...layout, [key]: [...ids, itemId] };
      });
    } else {
      setCvLayout((layout) => {
        const ids = layout[key];
        if (ids.includes(itemId)) {
          return layout;
        }
        return { ...layout, [key]: [...ids, itemId] };
      });
    }
  }

  function handleLayoutContentCreated(
    sectionId: PortfolioSectionId,
    item: ExperienceItem | ProjectItem | ContactItem | SkillItem,
  ) {
    setLibrary((lib) => {
      switch (sectionId) {
        case 'experience':
          return {
            ...lib,
            experiences: [...lib.experiences, item as ExperienceItem],
          };
        case 'projects':
          return {
            ...lib,
            projects: [...lib.projects, item as ProjectItem],
          };
        case 'contact':
          return {
            ...lib,
            contacts: [...lib.contacts, item as ContactItem],
          };
        case 'skills':
          return { ...lib, skills: [...lib.skills, item as SkillItem] };
        default:
          return lib;
      }
    });
    appendCreatedToLayout(sectionId, item.id, createLayoutTarget);
    setCreateSection(null);
  }

  async function onSubmitHeader(values: PortfolioFormValues) {
    const tokens = loadTokens();
    if (!tokens) {
      return;
    }
    setSaving(true);
    clearFeedback();
    try {
      await api.saveMyPortfolio(tokens.accessToken, values);
      setMessage('Portfolio header saved.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setSaving(false);
    }
  }

  async function saveLayout(surface: 'portfolio' | 'cv') {
    const tokens = loadTokens();
    if (!tokens) {
      return;
    }
    setLayoutSaving(true);
    setLayoutError(null);
    setLayoutMessage(null);
    try {
      await api.saveMyPortfolio(tokens.accessToken, {
        ...(surface === 'portfolio'
          ? { portfolioLayout }
          : { cvLayout }),
      });
      setLayoutMessage(
        surface === 'portfolio' ? 'Portfolio display saved.' : 'CV layout saved.',
      );
    } catch (err) {
      setLayoutError(err instanceof Error ? err.message : 'Save failed');
    } finally {
      setLayoutSaving(false);
    }
  }

  if (loading) {
    return <LoadingPulse label="Loading portfolio…" />;
  }

  return (
    <motion.div
      className="editor-shell"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 320, damping: 28 }}
    >
      <header className="editor-header">
        <h1>Portfolio</h1>
        <p>
          Header, display order, and CV — create items under{' '}
          <Link to="/content/experiences">Content</Link>.
        </p>
      </header>

      <div className="portfolio-tabs" role="tablist" aria-label="Portfolio sections">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'header'}
          className={`portfolio-tab${activeTab === 'header' ? ' is-active' : ''}`}
          onClick={() => setTab('header')}
        >
          Header
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'display'}
          className={`portfolio-tab${activeTab === 'display' ? ' is-active' : ''}`}
          onClick={() => setTab('display')}
        >
          Display
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'cv'}
          className={`portfolio-tab${activeTab === 'cv' ? ' is-active' : ''}`}
          onClick={() => setTab('cv')}
        >
          CV
        </button>
      </div>

      {error ? <div className="alert-error">{error}</div> : null}
      {message ? <div className="alert-success">{message}</div> : null}
      {layoutError ? <div className="alert-error">{layoutError}</div> : null}
      {layoutMessage ? <div className="alert-success">{layoutMessage}</div> : null}

      {activeTab === 'header' ? (
        <Form form={form} onSubmit={onSubmitHeader} className="editor-form">
          <EditorSection title="Profile (public header)" index={0}>
            <RhfInput name="displayName" label="Display name" />
            <RhfInput name="headline" label="Headline" />
            <RhfRichText name="summary" label="Summary" placeholder="Short bio…" />
            <RhfCheckbox name="isPublished" label="Publish portfolio publicly" />
          </EditorSection>
          <Button type="submit" loading={saving}>
            {saving ? 'Saving…' : 'Save header'}
          </Button>
        </Form>
      ) : null}

      {activeTab === 'display' ? (
        <div className="editor-form">
          <EditorSection title="Public portfolio sections" index={0}>
            <p className="muted layout-hint">
              Each block is one section on your site — drag the block handle to
              reorder sections, or drag rows inside a block. Use{' '}
              <span className="layout-hint-x" aria-hidden>×</span> to remove an
              item from display (it stays in Content).
            </p>
            <SurfaceLayoutEditor
              layout={portfolioLayout}
              library={library}
              onChange={setPortfolioLayout}
              onRequestCreate={(sectionId) =>
                openCreateForSection(sectionId, 'portfolio')
              }
            />
          </EditorSection>
          <Button
            type="button"
            loading={layoutSaving}
            onClick={() => void saveLayout('portfolio')}
          >
            {layoutSaving ? 'Saving…' : 'Save display'}
          </Button>
        </div>
      ) : null}

      {activeTab === 'cv' ? (
        <div className="editor-form">
          <EditorSection title="CV sections" index={0}>
            <p className="muted layout-hint">
              Same drag-and-drop controls as portfolio display; saved separately
              for CV export later.
            </p>
            <SurfaceLayoutEditor
              layout={cvLayout}
              library={library}
              onChange={setCvLayout}
              onRequestCreate={(sectionId) =>
                openCreateForSection(sectionId, 'cv')
              }
            />
          </EditorSection>
          <Button
            type="button"
            loading={layoutSaving}
            onClick={() => void saveLayout('cv')}
          >
            {layoutSaving ? 'Saving…' : 'Save CV layout'}
          </Button>
        </div>
      ) : null}

      <LayoutContentCreateModal
        sectionId={createSection}
        onClose={() => setCreateSection(null)}
        onCreated={handleLayoutContentCreated}
      />
    </motion.div>
  );
}
