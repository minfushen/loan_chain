import React from 'react';
import PartnerManagementScene from './PartnerManagementScene';

interface Props { activeModule: string; onModuleChange: (id: string) => void }

export default function StrategyConfigScene({ activeModule, onModuleChange }: Props) {
  return <PartnerManagementScene activeModule={activeModule} onModuleChange={onModuleChange} sceneOverride="strategy-config" />;
}
