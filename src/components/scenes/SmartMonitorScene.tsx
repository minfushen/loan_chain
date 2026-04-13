import React from 'react';
import RiskMonitorScene from './RiskMonitorScene';

interface Props { activeModule: string; onModuleChange: (id: string) => void }

export default function SmartMonitorScene({ activeModule, onModuleChange }: Props) {
  return <RiskMonitorScene activeModule={activeModule} onModuleChange={onModuleChange} sceneOverride="smart-monitor" />;
}
