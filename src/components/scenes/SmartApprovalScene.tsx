import React from 'react';
import ProductApprovalScene from './ProductApprovalScene';

interface Props { activeModule: string; onModuleChange: (id: string) => void }

export default function SmartApprovalScene({ activeModule, onModuleChange }: Props) {
  return <ProductApprovalScene activeModule={activeModule} onModuleChange={onModuleChange} sceneOverride="smart-approval" />;
}
