import React, { useCallback, useEffect, useState } from 'react';
import { SCENES } from './constants';
import { SceneId } from './types';
import { cn } from '@/lib/utils';
import {
  Bell,
  Command,
  History,
  LayoutDashboard,
  Search,
  Settings2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'motion/react';
import { DemoProvider, useDemo } from './demo/DemoContext';
import { EvidenceDrawer } from './demo/DemoComponents';
import CockpitScene from './components/scenes/CockpitScene';
import SmartIdentifyScene from './components/scenes/SmartIdentifyScene';
import SmartDueDiligenceScene from './components/scenes/SmartDueDiligenceScene';
import SmartApprovalScene from './components/scenes/SmartApprovalScene';
import AssetPoolScene from './components/scenes/AssetPoolScene';
import SmartMonitorScene from './components/scenes/SmartMonitorScene';
import SmartOperationScene from './components/scenes/SmartOperationScene';
import StrategyConfigScene from './components/scenes/StrategyConfigScene';

function AppShell() {
  const [activeScene, setActiveScene] = useState<SceneId>('cockpit');
  const [activeModule, setActiveModule] = useState<string>('overview');
  const { setNavigate, active: demoActive, currentSample } = useDemo();

  const handleSceneChange = useCallback((id: SceneId) => {
    setActiveScene(id);
    const scene = SCENES.find((item) => item.id === id);
    setActiveModule(scene?.modules[0]?.id ?? '');
  }, []);

  const navigateToScene = useCallback(
    (sceneId: SceneId, moduleId?: string) => {
      setActiveScene(sceneId);
      if (moduleId) {
        setActiveModule(moduleId);
      } else {
        const scene = SCENES.find((item) => item.id === sceneId);
        setActiveModule(scene?.modules[0]?.id ?? '');
      }
    },
    [],
  );

  useEffect(() => {
    setNavigate(navigateToScene);
  }, [setNavigate, navigateToScene]);

  const renderScene = () => {
    const props = { activeModule, onModuleChange: setActiveModule };
    switch (activeScene) {
      case 'cockpit':
        return <CockpitScene {...props} />;
      case 'smart-identify':
        return <SmartIdentifyScene {...props} />;
      case 'smart-due-diligence':
        return <SmartDueDiligenceScene {...props} />;
      case 'smart-approval':
        return <SmartApprovalScene {...props} />;
      case 'asset-pool':
        return <AssetPoolScene {...props} />;
      case 'smart-monitor':
        return <SmartMonitorScene {...props} />;
      case 'smart-operation':
        return <SmartOperationScene {...props} />;
      case 'strategy-config':
        return <StrategyConfigScene {...props} />;
      default:
        return <CockpitScene {...props} />;
    }
  };

  return (
    <div className="min-h-screen bg-muted/40 flex flex-col font-sans text-foreground">
      {/* ─── Top Global Bar ──────────────────────────────── */}
      <header className="h-11 bg-[#0F172A] flex items-center justify-between px-4 sticky top-0 z-50">
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-6 h-6 rounded-md bg-[#2563EB] flex items-center justify-center text-white">
            <LayoutDashboard size={12} />
          </div>
          <span className="font-semibold text-[10px] sm:text-[11px] text-white tracking-wide leading-tight max-w-[11rem] sm:max-w-none" title="百慧 - 信贷 AI 作业中台">
            百慧 - 信贷 AI 作业中台
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] ml-0.5" title="系统运行正常" />
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {demoActive && (
            <div className="hidden lg:flex items-center gap-1.5 rounded-md bg-white/8 border border-white/10 px-2 py-0.5 text-[10px] text-[#CBD5E1] font-medium">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentSample.uiState.badgeTone === 'blue' ? '#60A5FA' : currentSample.uiState.badgeTone === 'green' ? '#4ADE80' : currentSample.uiState.badgeTone === 'amber' ? '#FBBF24' : currentSample.uiState.badgeTone === 'red' ? '#F87171' : '#94A3B8' }} />
              {currentSample.shortName} · {currentSample.approvalStatus}
            </div>
          )}
          {demoActive && (
            <div className="hidden lg:flex items-center gap-1.5 rounded-md bg-[#2563EB]/20 border border-[#2563EB]/30 px-2 py-0.5 text-[10px] text-[#60A5FA] font-medium">
              <span className="w-1.5 h-1.5 bg-[#60A5FA] rounded-full animate-pulse" />
              Agent 辅助中
            </div>
          )}

          <div className="relative hidden md:block">
            <Command className="absolute left-2 top-1/2 -translate-y-1/2 text-[#64748B]" size={11} />
            <Input
              placeholder="⌘K 搜索场景、规则、客户…"
              className="pl-6 h-6 w-44 text-[10px] bg-white/10 border-white/10 text-white placeholder:text-[#64748B] focus-visible:ring-1 focus-visible:ring-[#2563EB] focus-visible:bg-white/15 rounded-md"
            />
          </div>

          <Button variant="ghost" size="icon" className="relative text-[#94A3B8] hover:text-white w-6 h-6 hover:bg-white/10">
            <Bell size={13} />
            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-[#60A5FA] rounded-full" />
          </Button>

          <Button variant="ghost" size="icon" className="text-[#94A3B8] hover:text-white w-6 h-6 hover:bg-white/10">
            <History size={13} />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-1.5 pl-1 pr-1 h-7 hover:bg-white/10">
                <Avatar className="w-5 h-5">
                  <AvatarImage src="https://picsum.photos/seed/product-owner/200" />
                  <AvatarFallback className="text-[8px] bg-[#2563EB] text-white">王</AvatarFallback>
                </Avatar>
                <span className="text-[10px] font-medium text-white hidden lg:inline">王敏</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuLabel>工作台</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>我的客户</DropdownMenuItem>
              <DropdownMenuItem>待办任务</DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2"><Settings2 size={12} /> 系统设置</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* ─── Body: Left Nav + Content ────────────────────── */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left primary navigation */}
        <nav className="w-[148px] bg-[#F8FAFC] border-r border-[#E2E8F0] flex flex-col shrink-0">
          <div className="flex-1 py-2 space-y-0.5 px-1.5">
            {SCENES.map((scene) => {
              const isActive = activeScene === scene.id;
              return (
                <button
                  key={scene.id}
                  onClick={() => handleSceneChange(scene.id)}
                  className={cn(
                    'w-full flex items-center gap-2 px-2.5 py-2 rounded-lg transition-all duration-150',
                    'text-[13px] font-medium',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
                    isActive
                      ? 'bg-[#2563EB] text-white shadow-sm'
                      : 'text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#0F172A]',
                  )}
                >
                  <scene.icon size={15} className={isActive ? 'text-white' : 'text-[#94A3B8]'} />
                  <span className="truncate">{scene.title}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Main content area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScene}
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              {renderScene()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* ─── Footer: system status bar ──────────────────── */}
      <footer className="h-6 bg-[#0F172A] flex items-center justify-between px-4 text-[9px] text-[#64748B] shrink-0">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#4ADE80] rounded-full" />
            <span className="text-[#94A3B8]">引擎正常</span>
          </span>
          <span>采集: {new Date().toLocaleTimeString('zh-CN', { hour12: false })}</span>
          {demoActive && <span className="text-[#60A5FA]">案例: {currentSample.chainName} · {currentSample.shortName}</span>}
        </div>
        <div className="flex items-center gap-4">
          <span>规则 v2.4.1</span>
          <span>数据 v3.1.0</span>
        </div>
      </footer>

      <EvidenceDrawer />
    </div>
  );
}

export default function App() {
  return (
    <DemoProvider>
      <AppShell />
    </DemoProvider>
  );
}
