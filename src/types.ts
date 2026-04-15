import { LucideIcon } from 'lucide-react';

export type SceneId =
  | 'cockpit'
  | 'smart-identify'
  | 'smart-due-diligence'
  | 'smart-approval'
  | 'asset-pool'
  | 'smart-monitor'
  | 'smart-operation'
  | 'strategy-config'
  | 'agent-workbench';

export interface Module {
  id: string;
  title: string;
  icon?: LucideIcon;
  description?: string;
  category?: string;
}

export interface Scene {
  id: SceneId;
  title: string;
  icon: LucideIcon;
  modules: Module[];
}
