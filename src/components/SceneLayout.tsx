import React from 'react';
import { Module } from '../types';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { PanelLeftClose, PanelLeftOpen, ChevronRight } from 'lucide-react';
import { DEMO_DISCLAIMER } from '../demo/chainLoan/data';

interface SceneLayoutProps {
  title: string;
  modules: Module[];
  activeModule: string;
  onModuleChange: (id: string) => void;
  sampleBar?: React.ReactNode;
  aiPanel?: React.ReactNode;
  children: React.ReactNode;
}

const SIDEBAR_W = 192;
const SIDEBAR_COLLAPSED_W = 0;

export default function SceneLayout({
  title,
  modules,
  activeModule,
  onModuleChange,
  sampleBar,
  aiPanel,
  children,
}: SceneLayoutProps) {
  const [collapsed, setCollapsed] = React.useState(false);

  const groupedModules = React.useMemo(() => {
    const groups: { [key: string]: Module[] } = {};
    const noCategory: Module[] = [];
    modules.forEach((module) => {
      if (module.category) {
        if (!groups[module.category]) groups[module.category] = [];
        groups[module.category].push(module);
      } else {
        noCategory.push(module);
      }
    });
    return { groups, noCategory };
  }, [modules]);

  const currentModule = modules.find((m) => m.id === activeModule);

  const renderModuleButton = (module: Module) => (
    <button
      key={module.id}
      onClick={() => onModuleChange(module.id)}
      className={cn(
        'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[12px] font-medium transition-all duration-200',
        activeModule === module.id
          ? 'bg-primary text-primary-foreground shadow-sm'
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
      )}
    >
      {module.icon && <module.icon size={13} />}
      <span className="truncate">{module.title}</span>
    </button>
  );

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* ─── Sidebar ─────────────────────────────────── */}
      <motion.aside
        initial={false}
        animate={{ width: collapsed ? SIDEBAR_COLLAPSED_W : SIDEBAR_W }}
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className="bg-card border-r border-border flex flex-col overflow-hidden shrink-0"
      >
        <AnimatePresence>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex flex-col flex-1 min-w-0"
            >
              <div className="px-4 py-4 border-b border-border/50 flex items-center justify-between">
                <h2 className="text-[13px] font-semibold text-foreground truncate">{title}</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-foreground shrink-0"
                  onClick={() => setCollapsed(true)}
                >
                  <PanelLeftClose size={14} />
                </Button>
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
                      <h3 className="px-3 pt-1 text-[10px] font-medium text-muted-foreground/70 uppercase tracking-wider">
                        {category}
                      </h3>
                      {(categoryModules as Module[]).map(renderModuleButton)}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>

      {/* ─── Content ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-card border-b border-border shrink-0">
          <div className="h-10 flex items-center gap-2 px-4">
            {collapsed && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0"
                onClick={() => setCollapsed(false)}
              >
                <PanelLeftOpen size={14} />
              </Button>
            )}
            <nav className="flex items-center gap-1.5 text-[12px]">
              <span className="text-muted-foreground">{title}</span>
              <ChevronRight size={11} className="text-muted-foreground/40" />
              <span className="font-medium text-foreground">{currentModule?.title || '概览'}</span>
            </nav>
          </div>
          {sampleBar && (
            <div className="px-4 pb-2.5">{sampleBar}</div>
          )}
        </header>

        <div className="flex-1 flex overflow-hidden">
          <ScrollArea className="flex-1 bg-muted/40">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeModule}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                className="p-5"
              >
                {children}
                <Separator className="my-6" />
                <p className="text-center text-[10px] text-muted-foreground/60 pb-2">{DEMO_DISCLAIMER}</p>
              </motion.div>
            </AnimatePresence>
          </ScrollArea>

          {aiPanel && (
            <motion.aside
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 288, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="bg-card border-l border-border shrink-0 overflow-auto"
            >
              <div className="p-4 space-y-3">{aiPanel}</div>
            </motion.aside>
          )}
        </div>
      </div>
    </div>
  );
}
