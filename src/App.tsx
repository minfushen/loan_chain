import React, { useCallback, useEffect, useState } from 'react';
import { SCENES } from './constants';
import { SceneId } from './types';
import { cn } from '@/lib/utils';
import {
  Bell,
  Command,
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
import { SampleSwitcher } from './components/ProductPrimitives';
import CockpitScene from './components/scenes/CockpitScene';
import CustomerPoolScene from './components/scenes/CustomerPoolScene';
import AssetPoolScene from './components/scenes/AssetPoolScene';
import ProductApprovalScene from './components/scenes/ProductApprovalScene';
import RiskMonitorScene from './components/scenes/RiskMonitorScene';
import PostLoanScene from './components/scenes/PostLoanScene';
import PartnerManagementScene from './components/scenes/PartnerManagementScene';

function AppShell() {
  const [activeScene, setActiveScene] = useState<SceneId>('cockpit');
  const [activeModule, setActiveModule] = useState<string>('overview');
  const { setNavigate, active: demoActive, stage, currentSample, selectSample, selectedSampleId } = useDemo();

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
    switch (activeScene) {
      case 'cockpit':
        return <CockpitScene activeModule={activeModule} onModuleChange={setActiveModule} />;
      case 'customer-pool':
        return <CustomerPoolScene activeModule={activeModule} onModuleChange={setActiveModule} />;
      case 'asset-pool':
        return <AssetPoolScene activeModule={activeModule} onModuleChange={setActiveModule} />;
      case 'product-approval':
        return <ProductApprovalScene activeModule={activeModule} onModuleChange={setActiveModule} />;
      case 'risk-monitor':
        return <RiskMonitorScene activeModule={activeModule} onModuleChange={setActiveModule} />;
      case 'post-loan':
        return <PostLoanScene activeModule={activeModule} onModuleChange={setActiveModule} />;
      case 'partner-management':
        return <PartnerManagementScene activeModule={activeModule} onModuleChange={setActiveModule} />;
      default:
        return <CockpitScene activeModule={activeModule} onModuleChange={setActiveModule} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col font-sans text-[#1E293B]">
      {/* ─── Header ─────────────────────────────────────────── */}
      <header className="h-12 bg-[#0F172A] flex items-center justify-between px-5 sticky top-0 z-50">
        {/* Left: brand + status */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-7 h-7 rounded-md bg-[#2563EB] flex items-center justify-center text-white">
            <LayoutDashboard size={14} />
          </div>
          <span className="font-semibold text-[13px] text-white tracking-wide">普惠资产引擎</span>
          <div className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] ml-0.5" title="系统运行正常" />
        </div>

        {/* Center: scene nav */}
        <nav className="hidden md:flex items-center gap-0.5 absolute left-1/2 -translate-x-1/2">
          {SCENES.map((scene) => (
            <button
              key={scene.id}
              onClick={() => handleSceneChange(scene.id)}
              className={cn(
                'px-3 py-1.5 rounded-md transition-all duration-200 flex items-center gap-1.5 text-[12px] font-medium whitespace-nowrap',
                activeScene === scene.id
                  ? 'text-white bg-white/15'
                  : 'text-[#94A3B8] hover:text-white hover:bg-white/10',
              )}
            >
              <scene.icon size={13} />
              {scene.title}
            </button>
          ))}
        </nav>

        {/* Right: controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {demoActive && (
            <div className="hidden lg:flex items-center gap-1.5 rounded-md bg-white/8 border border-white/10 px-2 py-1 text-[10px] text-[#CBD5E1] font-medium">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: currentSample.uiState.badgeTone === 'blue' ? '#60A5FA' : currentSample.uiState.badgeTone === 'green' ? '#4ADE80' : currentSample.uiState.badgeTone === 'amber' ? '#FBBF24' : currentSample.uiState.badgeTone === 'red' ? '#F87171' : '#94A3B8' }} />
              {currentSample.shortName} · {currentSample.approvalStatus}
            </div>
          )}
          {demoActive && (
            <div className="hidden lg:flex items-center gap-1.5 rounded-md bg-[#2563EB]/20 border border-[#2563EB]/30 px-2.5 py-1 text-[10px] text-[#60A5FA] font-medium">
              <span className="w-1.5 h-1.5 bg-[#60A5FA] rounded-full animate-pulse" />
              Agent 辅助中
            </div>
          )}

          <div className="relative hidden md:block">
            <Command className="absolute left-2 top-1/2 -translate-y-1/2 text-[#64748B]" size={12} />
            <Input
              placeholder="⌘K 搜索场景、规则、客户…"
              className="pl-7 h-7 w-48 text-[11px] bg-white/10 border-white/10 text-white placeholder:text-[#64748B] focus-visible:ring-1 focus-visible:ring-[#2563EB] focus-visible:bg-white/15"
            />
          </div>

          <Button variant="ghost" size="icon" className="relative text-[#94A3B8] hover:text-white w-7 h-7 hover:bg-white/10">
            <Bell size={14} />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#60A5FA] rounded-full" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 pl-1 pr-1 h-7 hover:bg-white/10">
                <Avatar className="w-6 h-6">
                  <AvatarImage src="https://picsum.photos/seed/product-owner/200" />
                  <AvatarFallback className="text-[9px] bg-[#2563EB] text-white">王</AvatarFallback>
                </Avatar>
                <div className="text-left hidden lg:block">
                  <p className="text-[11px] font-medium text-white leading-tight">王敏</p>
                </div>
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

      {/* ─── Main ───────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeScene}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="flex-1 flex flex-col overflow-hidden"
          >
            {renderScene()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ─── Footer: system status bar ──────────────────────── */}
      <footer className="h-7 bg-[#0F172A] flex items-center justify-between px-5 text-[10px] text-[#64748B] shrink-0">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#4ADE80] rounded-full" />
            <span className="text-[#94A3B8]">引擎正常</span>
          </span>
          <span>采集: {new Date().toLocaleTimeString('zh-CN', { hour12: false })}</span>
          {demoActive && <span className="text-[#60A5FA]">案例模式: {currentSample.chainName} · {currentSample.shortName}</span>}
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
