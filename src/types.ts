import { LucideIcon } from 'lucide-react';

export type SceneId =
  | 'cockpit'
  | 'customer-pool'
  | 'asset-pool'
  | 'product-approval'
  | 'risk-monitor'
  | 'post-loan'
  | 'partner-management';

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
