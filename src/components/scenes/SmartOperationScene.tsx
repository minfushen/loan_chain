import React from 'react';
import PostLoanScene from './PostLoanScene';

interface Props { activeModule: string; onModuleChange: (id: string) => void }

export default function SmartOperationScene({ activeModule, onModuleChange }: Props) {
  return <PostLoanScene activeModule={activeModule} onModuleChange={onModuleChange} sceneOverride="smart-operation" />;
}
