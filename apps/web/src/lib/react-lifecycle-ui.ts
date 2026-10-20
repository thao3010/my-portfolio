/** Hardcoded React lifecycle demo copy — web only, not stored in CMS/API. */

export const LIFECYCLE_PHASE_IDS = [
  'render',
  'reconcile',
  'commit',
  'layout',
  'paint',
  'effect',
  'update',
  'cleanup',
] as const;

export type LifecyclePhaseId = (typeof LIFECYCLE_PHASE_IDS)[number];

export type LifecyclePhaseCopy = {
  title: string;
  detail: string;
  code: string;
};

export type LifecyclePanelUi = {
  panelTitle: string;
  versionPill: string;
  codePhaseComment: string;
  demoComponentLabel: string;
  demoRenderPrefix: string;
  demoLayoutFlag: string;
  demoEffectFlag: string;
  phases: LifecyclePhaseCopy[];
};

const DEFAULT_LIFECYCLE_PHASE_COPY: LifecyclePhaseCopy[] = [
  {
    title: 'Render',
    detail: 'Component function runs · JSX → React elements',
    code: 'return <Banner />',
  },
  {
    title: 'Reconcile',
    detail: 'Fiber diff · schedule updates',
    code: 'beginWork() → completeWork()',
  },
  {
    title: 'Commit',
    detail: 'Apply DOM mutations',
    code: 'commitMutationEffects()',
  },
  {
    title: 'useLayoutEffect',
    detail: 'Sync after DOM, before paint',
    code: 'useLayoutEffect(fn, deps)',
  },
  {
    title: 'Paint',
    detail: 'Browser compositor',
    code: 'requestAnimationFrame',
  },
  {
    title: 'useEffect',
    detail: 'Subscriptions · fetch · timers',
    code: 'useEffect(fn, deps)',
  },
  {
    title: 'Update',
    detail: 'setState / dispatch → re-render',
    code: 'dispatch({ type: "tick" })',
  },
  {
    title: 'Cleanup',
    detail: 'Effect teardown · unmount',
    code: 'return () => cleanup()',
  },
];

export const WEB_LIFECYCLE_PANEL_UI: LifecyclePanelUi = {
  panelTitle: 'react-lifecycle.flow',
  versionPill: 'React 19',
  codePhaseComment: '// phase',
  demoComponentLabel: '<Hero />',
  demoRenderPrefix: 'render #',
  demoLayoutFlag: 'layout',
  demoEffectFlag: 'effect',
  phases: DEFAULT_LIFECYCLE_PHASE_COPY.map((phase) => ({ ...phase })),
};

export const SIMPLE_LIFECYCLE_STEP_IDS = [
  'render',
  'dom',
  'effects',
  'update',
  'unmount',
] as const;

export type SimpleLifecycleStepId =
  (typeof SIMPLE_LIFECYCLE_STEP_IDS)[number];

export type SimpleLifecycleDiagramStepCopy = {
  label: string;
  hint: string;
};

export type SimpleLifecycleDiagramUi = {
  title: string;
  titleAccent: string;
  loopFromLabel: string;
  loopToLabel: string;
  updateBackLabel: string;
  ariaSummaryLabel: string;
  steps: SimpleLifecycleDiagramStepCopy[];
};

const DEFAULT_SIMPLE_LIFECYCLE_DIAGRAM_STEPS: SimpleLifecycleDiagramStepCopy[] =
  [
    {
      label: 'Render',
      hint: 'Component function runs · build UI',
    },
    {
      label: 'DOM',
      hint: 'React commits nodes to the browser',
    },
    {
      label: 'Effects',
      hint: 'useEffect · fetch, listeners…',
    },
    {
      label: 'Update',
      hint: 'State changes → re-render',
    },
    {
      label: 'Unmount',
      hint: 'Remove component · cleanup',
    },
  ];

export const WEB_SIMPLE_LIFECYCLE_DIAGRAM_UI: SimpleLifecycleDiagramUi = {
  title: 'Lifecycle diagram',
  titleAccent: 'React',
  loopFromLabel: 'Update',
  loopToLabel: 'Render',
  updateBackLabel: '→ Render',
  ariaSummaryLabel: 'React lifecycle summary',
  steps: DEFAULT_SIMPLE_LIFECYCLE_DIAGRAM_STEPS.map((step) => ({ ...step })),
};

export type SimpleLifecycleStepWithId = SimpleLifecycleDiagramStepCopy & {
  id: SimpleLifecycleStepId;
};

export function simpleLifecycleStepsWithIds(
  diagram: SimpleLifecycleDiagramUi,
): SimpleLifecycleStepWithId[] {
  return SIMPLE_LIFECYCLE_STEP_IDS.map((id, index) => ({
    id,
    ...diagram.steps[index],
  }));
}

export type LifecyclePhaseWithId = LifecyclePhaseCopy & {
  id: LifecyclePhaseId;
};

export function lifecyclePhasesWithIds(
  panel: LifecyclePanelUi,
): LifecyclePhaseWithId[] {
  return LIFECYCLE_PHASE_IDS.map((id, index) => ({
    id,
    ...panel.phases[index],
  }));
}
