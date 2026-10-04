import type {
  ContactItem,
  ExperienceItem,
  PortfolioSectionId,
  ProjectItem,
  SkillItem,
  SurfaceLayout,
} from '@portfolio/shared';
import { normalizeSectionOrder } from '@portfolio/shared';
import { useEffect, useRef, useState } from 'react';

export type SectionIdsKey =
  | 'experienceIds'
  | 'projectIds'
  | 'contactIds'
  | 'skillIds';

export const SECTION_ID_TO_KEY: Record<PortfolioSectionId, SectionIdsKey> = {
  contact: 'contactIds',
  experience: 'experienceIds',
  projects: 'projectIds',
  skills: 'skillIds',
};

const SECTION_BLOCK_LABELS: Record<PortfolioSectionId, string> = {
  contact: 'Contact',
  experience: 'Experience',
  projects: 'Projects',
  skills: 'Skills',
};

export type LayoutLibrary = {
  experiences: ExperienceItem[];
  projects: ProjectItem[];
  contacts: ContactItem[];
  skills: SkillItem[];
};

function labelForId(key: SectionIdsKey, id: string, library: LayoutLibrary): string {
  switch (key) {
    case 'experienceIds': {
      const row = library.experiences.find((e) => e.id === id);
      return row ? `${row.title} @ ${row.company}` : id;
    }
    case 'projectIds': {
      const row = library.projects.find((p) => p.id === id);
      return row?.title ?? id;
    }
    case 'contactIds': {
      const row = library.contacts.find((c) => c.id === id);
      return row?.label ?? id;
    }
    case 'skillIds': {
      const row = library.skills.find((s) => s.id === id);
      return row?.title ?? id;
    }
    default:
      return id;
  }
}

function libraryForKey(
  key: SectionIdsKey,
  library: LayoutLibrary,
): { id: string; label: string }[] {
  switch (key) {
    case 'experienceIds':
      return library.experiences.map((e) => ({
        id: e.id,
        label: `${e.title} @ ${e.company}`,
      }));
    case 'projectIds':
      return library.projects.map((p) => ({ id: p.id, label: p.title }));
    case 'contactIds':
      return library.contacts.map((c) => ({ id: c.id, label: c.label }));
    case 'skillIds':
      return library.skills.map((s) => ({ id: s.id, label: s.title }));
    default:
      return [];
  }
}

function reorderIds(ids: string[], fromIndex: number, toIndex: number): string[] {
  if (fromIndex === toIndex) {
    return ids;
  }
  const next = [...ids];
  const [item] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, item);
  return next;
}

type ItemDragState = { section: SectionIdsKey; index: number } | null;

type Props = {
  layout: SurfaceLayout;
  library: LayoutLibrary;
  onChange: (layout: SurfaceLayout) => void;
  onRequestCreate: (sectionId: PortfolioSectionId) => void;
};

function DragHandleIcon() {
  return (
    <svg
      className="layout-drag-handle"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      aria-hidden
    >
      <circle cx="5" cy="4" r="1.25" fill="currentColor" />
      <circle cx="11" cy="4" r="1.25" fill="currentColor" />
      <circle cx="5" cy="8" r="1.25" fill="currentColor" />
      <circle cx="11" cy="8" r="1.25" fill="currentColor" />
      <circle cx="5" cy="12" r="1.25" fill="currentColor" />
      <circle cx="11" cy="12" r="1.25" fill="currentColor" />
    </svg>
  );
}

function RemoveIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden>
      <path
        d="M3 3l8 8M11 3L3 11"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

function LayoutAddButton({
  options,
  sectionLabel,
  onAdd,
  onCreateNew,
}: {
  options: { id: string; label: string }[];
  sectionLabel: string;
  onAdd: (id: string) => void;
  onCreateNew: () => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }
    function onDocumentClick(event: MouseEvent) {
      if (
        rootRef.current &&
        !rootRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', onDocumentClick);
    return () => document.removeEventListener('mousedown', onDocumentClick);
  }, [open]);

  return (
    <div className="layout-add" ref={rootRef}>
      <button
        type="button"
        className="layout-add-btn"
        aria-label={`Add ${sectionLabel}`}
        aria-expanded={open}
        aria-haspopup="listbox"
        onClick={() => setOpen((value) => !value)}
      >
        +
      </button>
      {open ? (
        <ul className="layout-add-menu" role="listbox">
          <li role="presentation">
            <button
              type="button"
              role="option"
              className="layout-add-menu-item layout-add-menu-item--create"
              onClick={() => {
                setOpen(false);
                onCreateNew();
              }}
            >
              Create new…
            </button>
          </li>
          {options.length > 0 ? (
            <li className="layout-add-menu-divider" role="separator" />
          ) : null}
          {options.map((option) => (
            <li key={option.id} role="presentation">
              <button
                type="button"
                role="option"
                className="layout-add-menu-item"
                onClick={() => {
                  onAdd(option.id);
                  setOpen(false);
                }}
              >
                {option.label}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export function SurfaceLayoutEditor({
  layout,
  library,
  onChange,
  onRequestCreate,
}: Props) {
  const [draggingItem, setDraggingItem] = useState<ItemDragState>(null);
  const [dropItem, setDropItem] = useState<ItemDragState>(null);
  const [draggingBlock, setDraggingBlock] = useState<number | null>(null);
  const [dropBlock, setDropBlock] = useState<number | null>(null);

  const sectionOrder = normalizeSectionOrder(layout.sectionOrder);

  function updateSection(key: SectionIdsKey, ids: string[]) {
    onChange({ ...layout, sectionOrder, [key]: ids });
  }

  function reorderBlocks(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) {
      return;
    }
    const next = [...sectionOrder];
    const [item] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, item);
    onChange({ ...layout, sectionOrder: next });
  }

  function handleItemDrop(section: SectionIdsKey, toIndex: number) {
    if (!draggingItem || draggingItem.section !== section) {
      setDraggingItem(null);
      setDropItem(null);
      return;
    }
    updateSection(
      section,
      reorderIds(layout[section], draggingItem.index, toIndex),
    );
    setDraggingItem(null);
    setDropItem(null);
  }

  return (
    <div className="layout-editor">
      <header className="layout-editor-intro">
        <h3>Section order on page</h3>
        <p className="muted layout-block-order-hint">
          Drag a section by its handle to move the whole block. Inside each
          block, add items and drag rows to set their order.
        </p>
      </header>

      <ul className="layout-section-blocks">
        {sectionOrder.map((sectionId, blockIndex) => {
          const key = SECTION_ID_TO_KEY[sectionId];
          const selected = layout[key];
          const allInLibrary = libraryForKey(key, library);
          const options = allInLibrary.filter((o) => !selected.includes(o.id));
          const blockDragging = draggingBlock === blockIndex;
          const blockDropTarget = dropBlock === blockIndex;

          return (
            <li
              key={sectionId}
              className={`layout-section-block card-panel${blockDragging ? ' is-block-dragging' : ''}${blockDropTarget ? ' is-block-drop-target' : ''}`}
              onDragOver={(e) => {
                if (draggingBlock === null) {
                  return;
                }
                e.preventDefault();
                setDropBlock(blockIndex);
              }}
              onDrop={(e) => {
                if (draggingBlock === null) {
                  return;
                }
                e.preventDefault();
                reorderBlocks(draggingBlock, blockIndex);
                setDraggingBlock(null);
                setDropBlock(null);
              }}
            >
              <div
                className="layout-section-block-header"
                draggable
                onDragStart={() => setDraggingBlock(blockIndex)}
                onDragEnd={() => {
                  setDraggingBlock(null);
                  setDropBlock(null);
                }}
              >
                <DragHandleIcon />
                <h4>{SECTION_BLOCK_LABELS[sectionId]}</h4>
                <LayoutAddButton
                  sectionLabel={SECTION_BLOCK_LABELS[sectionId].toLowerCase()}
                  options={options}
                  onAdd={(optionId) =>
                    updateSection(key, [...selected, optionId])
                  }
                  onCreateNew={() => onRequestCreate(sectionId)}
                />
              </div>

              <div className="layout-section-block-body">
                {selected.length === 0 ? (
                  <p className="muted layout-section-empty">
                    {allInLibrary.length === 0
                      ? 'No items yet — use + and choose Create new.'
                      : 'Nothing selected — use + to add or create.'}
                    <button
                      type="button"
                      className="layout-section-create-link"
                      onClick={() => onRequestCreate(sectionId)}
                    >
                      Create new {SECTION_BLOCK_LABELS[sectionId].toLowerCase()}
                    </button>
                  </p>
                ) : (
                  <ul className="layout-order-list">
                    {selected.map((id, index) => {
                      const isDragging =
                        draggingItem?.section === key &&
                        draggingItem.index === index;
                      const isDropTarget =
                        dropItem?.section === key && dropItem.index === index;

                      return (
                        <li
                          key={id}
                          className={`layout-order-row${isDragging ? ' is-dragging' : ''}${isDropTarget ? ' is-drop-target' : ''}`}
                          draggable
                          onDragStart={(e) => {
                            e.stopPropagation();
                            setDraggingItem({ section: key, index });
                          }}
                          onDragEnd={() => {
                            setDraggingItem(null);
                            setDropItem(null);
                          }}
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDropItem({ section: key, index });
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleItemDrop(key, index);
                          }}
                        >
                          <DragHandleIcon />
                          <span className="layout-order-label">
                            {labelForId(key, id, library)}
                          </span>
                          <button
                            type="button"
                            className="layout-row-remove"
                            aria-label={`Remove ${labelForId(key, id, library)}`}
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={() =>
                              updateSection(
                                key,
                                selected.filter((itemId) => itemId !== id),
                              )
                            }
                          >
                            <RemoveIcon />
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
