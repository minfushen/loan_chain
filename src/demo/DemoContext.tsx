import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { DemoStage, CHAIN_LOAN_STAGE_LABELS, SAMPLES, type ChainLoanSample, SAMPLE_YUTONG } from './chainLoan/data';
import { SceneId } from '../types';

const STAGE_ORDER: DemoStage[] = [
  'ecosystem',
  'identified',
  'pre_credit',
  'manual_review',
  'approved',
  'risk_alert',
  'post_loan_recovery',
];

const STAGE_SCENE_MAP: Record<DemoStage, { sceneId: SceneId; moduleId: string }> = {
  ecosystem: { sceneId: 'smart-identify', moduleId: 'file-import' },
  identified: { sceneId: 'smart-identify', moduleId: 'feed' },
  pre_credit: { sceneId: 'smart-due-diligence', moduleId: 'material' },
  manual_review: { sceneId: 'smart-approval', moduleId: 'review' },
  approved: { sceneId: 'smart-approval', moduleId: 'summary' },
  risk_alert: { sceneId: 'smart-monitor', moduleId: 'warning' },
  post_loan_recovery: { sceneId: 'smart-operation', moduleId: 'operations' },
};

type SampleStateMap = Record<string, { stage: DemoStage; riskSimulated: boolean; recoveryComplete: boolean }>;

function buildInitialSampleStates(): SampleStateMap {
  const map: SampleStateMap = {};
  for (const s of SAMPLES) {
    map[s.id] = { stage: s.stage as DemoStage, riskSimulated: false, recoveryComplete: false };
  }
  return map;
}

interface DemoState {
  active: boolean;
  stage: DemoStage;
  selectedSampleId: string;
  evidenceDrawerOpen: boolean;
  sampleStates: SampleStateMap;
}

type NavigateFn = (sceneId: SceneId, moduleId?: string) => void;

interface DemoContextValue {
  active: boolean;
  stage: DemoStage;
  selectedSampleId: string;
  evidenceDrawerOpen: boolean;
  stageIndex: number;
  stageLabel: string;

  currentSample: ChainLoanSample;

  /** Per-sample state accessors */
  riskSimulated: boolean;
  recoveryComplete: boolean;
  currentStage: DemoStage;
  stageBySample: (sampleId: string) => DemoStage;
  riskSimulatedBySample: (sampleId: string) => boolean;
  recoveryCompleteBySample: (sampleId: string) => boolean;

  selectSample: (sampleId: string) => void;
  startDemo: () => void;
  advanceStage: () => void;
  advanceCurrentSampleStage: () => void;
  setStage: (stage: DemoStage) => void;
  toggleEvidenceDrawer: () => void;
  simulateRisk: () => void;
  simulateRiskForCurrentSample: () => void;
  completeRecovery: () => void;
  completeRecoveryForCurrentSample: () => void;
  resetDemo: () => void;
  setNavigate: (fn: NavigateFn) => void;
  navigate: (sceneId: SceneId, moduleId?: string) => void;
}

const DemoContext = createContext<DemoContextValue | null>(null);

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DemoState>({
    active: false,
    stage: 'ecosystem',
    selectedSampleId: SAMPLE_YUTONG.id,
    evidenceDrawerOpen: false,
    sampleStates: buildInitialSampleStates(),
  });

  const [navigateFn, setNavigateFn] = useState<{ fn: NavigateFn } | null>(null);

  const setNavigate = useCallback((fn: NavigateFn) => {
    setNavigateFn({ fn });
  }, []);

  const navigate = useCallback(
    (sceneId: SceneId, moduleId?: string) => {
      navigateFn?.fn(sceneId, moduleId);
    },
    [navigateFn],
  );

  const currentSample = SAMPLES.find((s) => s.id === state.selectedSampleId) ?? SAMPLE_YUTONG;
  const currentSampleState = state.sampleStates[state.selectedSampleId] ?? { stage: 'ecosystem' as DemoStage, riskSimulated: false, recoveryComplete: false };
  const riskSimulated = currentSampleState.riskSimulated;
  const recoveryComplete = currentSampleState.recoveryComplete;
  const currentStage = currentSampleState.stage;

  const stage = currentSampleState.stage;
  const stageIndex = STAGE_ORDER.indexOf(stage);
  const stageLabel = CHAIN_LOAN_STAGE_LABELS[stage];

  const stageBySample = useCallback((sampleId: string): DemoStage => {
    return state.sampleStates[sampleId]?.stage ?? 'ecosystem';
  }, [state.sampleStates]);

  const riskSimulatedBySample = useCallback((sampleId: string): boolean => {
    return state.sampleStates[sampleId]?.riskSimulated ?? false;
  }, [state.sampleStates]);

  const recoveryCompleteBySample = useCallback((sampleId: string): boolean => {
    return state.sampleStates[sampleId]?.recoveryComplete ?? false;
  }, [state.sampleStates]);

  const selectSample = useCallback((sampleId: string) => {
    setState((prev) => {
      const sampleState = prev.sampleStates[sampleId];
      const syncedStage = sampleState?.stage ?? 'ecosystem';
      return { ...prev, selectedSampleId: sampleId, stage: syncedStage };
    });
  }, []);

  const startDemo = useCallback(() => {
    setState((prev) => {
      const newSampleStates = { ...prev.sampleStates };
      newSampleStates[SAMPLE_YUTONG.id] = { stage: 'ecosystem', riskSimulated: false, recoveryComplete: false };
      return { ...prev, active: true, stage: 'ecosystem', selectedSampleId: SAMPLE_YUTONG.id, sampleStates: newSampleStates };
    });
  }, []);

  const advanceStage = useCallback(() => {
    setState((prev) => {
      const idx = STAGE_ORDER.indexOf(prev.stage);
      const nextStage = STAGE_ORDER[idx + 1];
      if (!nextStage) return prev;

      const newSampleStates = { ...prev.sampleStates };
      const sid = prev.selectedSampleId;
      const ss = { ...(newSampleStates[sid] ?? { stage: prev.stage, riskSimulated: false, recoveryComplete: false }) };
      ss.stage = nextStage;
      if (nextStage === 'risk_alert') ss.riskSimulated = true;
      if (nextStage === 'post_loan_recovery') ss.recoveryComplete = false;
      newSampleStates[sid] = ss;

      const target = STAGE_SCENE_MAP[nextStage];
      setTimeout(() => navigate(target.sceneId, target.moduleId), 0);

      return { ...prev, stage: nextStage, sampleStates: newSampleStates };
    });
  }, [navigate]);

  const advanceCurrentSampleStage = useCallback(() => {
    setState((prev) => {
      const sid = prev.selectedSampleId;
      const ss = { ...(prev.sampleStates[sid] ?? { stage: 'ecosystem' as DemoStage, riskSimulated: false, recoveryComplete: false }) };
      const idx = STAGE_ORDER.indexOf(ss.stage);
      const nextStage = STAGE_ORDER[idx + 1];
      if (!nextStage) return prev;
      ss.stage = nextStage;
      if (nextStage === 'risk_alert') ss.riskSimulated = true;
      if (nextStage === 'post_loan_recovery') ss.recoveryComplete = false;
      return { ...prev, sampleStates: { ...prev.sampleStates, [sid]: ss } };
    });
  }, []);

  const setStage = useCallback(
    (stage: DemoStage) => {
      setState((prev) => ({ ...prev, active: true, stage }));
      const target = STAGE_SCENE_MAP[stage];
      navigate(target.sceneId, target.moduleId);
    },
    [navigate],
  );

  const toggleEvidenceDrawer = useCallback(() => {
    setState((prev) => ({ ...prev, evidenceDrawerOpen: !prev.evidenceDrawerOpen }));
  }, []);

  const simulateRisk = useCallback(() => {
    setState((prev) => {
      const sid = prev.selectedSampleId;
      const newSampleStates = { ...prev.sampleStates };
      newSampleStates[sid] = { ...(newSampleStates[sid] ?? { stage: 'risk_alert' as DemoStage, riskSimulated: false, recoveryComplete: false }), riskSimulated: true, stage: 'risk_alert' };
      return { ...prev, stage: 'risk_alert', sampleStates: newSampleStates };
    });
  }, []);

  const simulateRiskForCurrentSample = useCallback(() => {
    setState((prev) => {
      const sid = prev.selectedSampleId;
      const newSampleStates = { ...prev.sampleStates };
      const ss = { ...(newSampleStates[sid] ?? { stage: 'risk_alert' as DemoStage, riskSimulated: false, recoveryComplete: false }) };
      ss.riskSimulated = true;
      ss.stage = 'risk_alert';
      newSampleStates[sid] = ss;
      return { ...prev, sampleStates: newSampleStates };
    });
  }, []);

  const completeRecovery = useCallback(() => {
    setState((prev) => {
      const sid = prev.selectedSampleId;
      const newSampleStates = { ...prev.sampleStates };
      newSampleStates[sid] = { ...(newSampleStates[sid] ?? { stage: 'post_loan_recovery' as DemoStage, riskSimulated: true, recoveryComplete: false }), recoveryComplete: true, stage: 'post_loan_recovery' };
      return { ...prev, stage: 'post_loan_recovery', sampleStates: newSampleStates };
    });
  }, []);

  const completeRecoveryForCurrentSample = useCallback(() => {
    setState((prev) => {
      const sid = prev.selectedSampleId;
      const newSampleStates = { ...prev.sampleStates };
      const ss = { ...(newSampleStates[sid] ?? { stage: 'post_loan_recovery' as DemoStage, riskSimulated: true, recoveryComplete: false }) };
      ss.recoveryComplete = true;
      ss.stage = 'post_loan_recovery';
      newSampleStates[sid] = ss;
      return { ...prev, sampleStates: newSampleStates };
    });
  }, []);

  const resetDemo = useCallback(() => {
    setState({
      active: false,
      stage: 'ecosystem',
      selectedSampleId: SAMPLE_YUTONG.id,
      evidenceDrawerOpen: false,
      sampleStates: buildInitialSampleStates(),
    });
  }, []);

  const value = useMemo<DemoContextValue>(
    () => ({
      active: state.active,
      stage: state.stage,
      selectedSampleId: state.selectedSampleId,
      evidenceDrawerOpen: state.evidenceDrawerOpen,
      stageIndex,
      stageLabel,
      currentSample,
      riskSimulated,
      recoveryComplete,
      currentStage,
      stageBySample,
      riskSimulatedBySample,
      recoveryCompleteBySample,
      selectSample,
      startDemo,
      advanceStage,
      advanceCurrentSampleStage,
      setStage,
      toggleEvidenceDrawer,
      simulateRisk,
      simulateRiskForCurrentSample,
      completeRecovery,
      completeRecoveryForCurrentSample,
      resetDemo,
      setNavigate,
      navigate,
    }),
    [state, stageIndex, stageLabel, currentSample, riskSimulated, recoveryComplete, currentStage, stageBySample, riskSimulatedBySample, recoveryCompleteBySample, selectSample, startDemo, advanceStage, advanceCurrentSampleStage, setStage, toggleEvidenceDrawer, simulateRisk, simulateRiskForCurrentSample, completeRecovery, completeRecoveryForCurrentSample, resetDemo, setNavigate, navigate],
  );

  return <DemoContext.Provider value={value}>{children}</DemoContext.Provider>;
}

export function useDemo(): DemoContextValue {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo must be used within DemoProvider');
  return ctx;
}

export { STAGE_ORDER, STAGE_SCENE_MAP };
