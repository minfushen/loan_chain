import React from 'react';
import { Module } from '../types';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'motion/react';
import { DEMO_DISCLAIMER } from '../demo/chainLoan/data';

interface SceneLayoutProps {
  title: string;
  modules: Module[];
  activeModule: string;
  onModuleChange: (id: string) => void;
  /** Sticky bar rendered below breadcrumb — for SelectedSampleSummary or SampleSwitcher */
  sampleBar?: React.ReactNode;
  /** Optional right-side panel for AI insights */
  aiPanel?: React.ReactNode;
  children: React.ReactNode;
}

export default function SceneLayout({
  title,
  modules,
  activeModule,
  onModuleChange,
  sampleBar,
  aiPanel,
  children,
}: SceneLayoutProps) {
  const groupedModules = React.useMemo(() => {
    const groups: { [key: string]: Module[] } = {};
    const noCategory: Module[] = [];

    modules.forEach(module => {
      if (module.category) {
        if (!groups[module.category]) {
          groups[module.category] = [];
        }
        groups[module.category].push(module);
      } else {
        noCategory.push(module);
      }
    });

    return { groups, noCategory };
  }, [modules]);

  const currentModule = modules.find(m => m.id === activeModule);

  const renderModuleButton = (module: Module) => (
    <button
      key={module.id}
      onClick={() => onModuleChange(module.id)}
      className={cn(
        'w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[12px] font-medium transition-all duration-150',
        activeModule === module.id
          ? 'bg-[#2563EB] text-white shadow-sm'
          : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#334155]',
      )}
    >
      {module.icon && <module.icon size={13} />}
      <span className="truncate">{module.title}</span>
    </button>
  );

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* ─── Sidebar ─────────────────────────────────── */}
      <aside className="w-48 bg-white border-r border-[#E5E7EB] flex flex-col">
        <div className="px-4 py-4 border-b border-[#F1F5F9]">
          <h2 className="text-[13px] font-semibold text-[#0F172A]">{title}</h2>
        </div>

        <ScrollArea className="flex-1 px-2">
          <div className="space-y-3 py-2 pb-4">
            {groupedModules.noCategory.length > 0 && (
              <div className="space-y-0.5">
                {groupedModules.noCategory.map(renderModuleButton)}
              </div>
            )}

            {Object.entries(groupedModules.groups).map(([category, categoryModules]) => (
              <div key={category} className="space-y-0.5">
                <h3 className="px-3 pt-1 text-[10px] font-medium text-[#94A3B8] uppercase tracking-wider">
                  {category}
                </h3>
                {(categoryModules as Module[]).map(renderModuleButton)}
              </div>
            ))}
          </div>
        </ScrollArea>
      </aside>

      {/* ─── Content ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-[#E5E7EB] shrink-0">
          <div className="h-10 flex items-center px-5">
            <div className="flex items-center gap-2 text-[12px]">
              <span className="text-[#94A3B8]">{title}</span>
              <span className="text-[#CBD5E1]">/</span>
              <span className="font-medium text-[#0F172A]">{currentModule?.title || '概览'}</span>
            </div>
          </div>
          {sampleBar && (
            <div className="px-5 pb-2.5">{sampleBar}</div>
          )}
        </header>

        <div className="flex-1 flex overflow-hidden">
          <ScrollArea className={cn('flex-1 bg-[#F1F5F9]', aiPanel ? '' : '')}>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.12 }}
              className="p-5"
            >
              {children}
              <div className="mt-6 text-center text-[10px] text-[#94A3B8] pb-2">{DEMO_DISCLAIMER}</div>
            </motion.div>
          </ScrollArea>

          {aiPanel && (
            <aside className="w-72 bg-white border-l border-[#E5E7EB] shrink-0 overflow-auto">
              <div className="p-4 space-y-3">{aiPanel}</div>
            </aside>
          )}
        </div>
      </div>
    </div>
  );
}
