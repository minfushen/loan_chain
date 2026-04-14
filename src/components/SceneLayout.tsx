import React from 'react';
import { Module } from '../types';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { PanelLeftClose, PanelLeftOpen, ChevronRight, Brain } from 'lucide-react';
import { DEMO_DISCLAIMER } from '../demo/chainLoan/data';

const DEFAULT_MODULE_SUBTITLE =
  '围绕当前对象与状态推进作业：左侧切换模块，在主区完成查看、判断与下一步动作。';

interface SceneLayoutProps {
  title: string;
  modules: Module[];
  activeModule: string;
  onModuleChange: (id: string) => void;
  /** 案件条 / 主链阶段等全局上下文，置于面包屑与标题之间 */
  contextSlot?: React.ReactNode;
  sampleBar?: React.ReactNode;
  aiPanel?: React.ReactNode;
  children: React.ReactNode;
  /** 覆盖当前模块副标题（否则使用 constants 中 module.description） */
  pageSubtitleOverride?: string;
  /** KPI 摘要层（3～5 个指标），插在定位层之下、主滚动区之上 */
  kpiSlot?: React.ReactNode;
  /** 固定动作层：贴主内容区底部，与滚动区并列，保证主动作始终可见 */
  stickyActionSlot?: React.ReactNode;
}

/** 二级菜单略加宽，减少与主区的视觉挤压（约 208px ≈ 26×8pt） */
const SIDEBAR_W = 208;
const SIDEBAR_COLLAPSED_W = 0;

export default function SceneLayout({
  title,
  modules,
  activeModule,
  onModuleChange,
  contextSlot,
  sampleBar,
  aiPanel,
  children,
  pageSubtitleOverride,
  kpiSlot,
  stickyActionSlot,
}: SceneLayoutProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [aiPanelOpen, setAiPanelOpen] = React.useState(false);

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
  const pageSubtitle = pageSubtitleOverride ?? currentModule?.description ?? DEFAULT_MODULE_SUBTITLE;

  const renderModuleButton = (module: Module) => {
    const active = activeModule === module.id;
    return (
      <button
        key={module.id}
        type="button"
        aria-current={active ? 'page' : undefined}
        title={module.description ? `${module.title} — ${module.description}` : module.title}
        onClick={() => onModuleChange(module.id)}
        className={cn(
          'w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-200',
          // 二级菜单：12px regular，比一级菜单(13px medium)小一档
          'text-[12px] font-normal',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 focus-visible:ring-offset-1 focus-visible:ring-offset-background',
          'active:scale-[0.99] motion-reduce:active:scale-100',
          active
            ? 'bg-primary text-primary-foreground shadow-sm font-medium'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
        )}
      >
        {module.icon && <module.icon size={13} className="shrink-0 opacity-90" aria-hidden />}
        <span className="truncate text-left">{module.title}</span>
      </button>
    );
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* ─── Sidebar：二级功能菜单（状态化工作流入口）──────────────── */}
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
              <div className="px-5 py-3.5 border-b border-border/50 flex items-center justify-between gap-2">
                <h2 className="text-[13px] font-semibold text-foreground truncate" title={title}>
                  {title}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 text-muted-foreground hover:text-foreground shrink-0 focus-visible:ring-2 focus-visible:ring-ring/30"
                  onClick={() => setCollapsed(true)}
                  aria-label="收起二级菜单"
                >
                  <PanelLeftClose size={14} />
                </Button>
              </div>
              <ScrollArea className="flex-1 px-2.5">
                <nav className="space-y-3 py-3 pb-5" aria-label={`${title} 二级功能`}>
                  {groupedModules.noCategory.length > 0 && (
                    <div className="space-y-0.5">{groupedModules.noCategory.map(renderModuleButton)}</div>
                  )}
                  {Object.entries(groupedModules.groups).map(([category, categoryModules]) => (
                    <div key={category} className="space-y-0.5">
                      <h3 className="px-3 pt-1 text-[10px] font-medium text-muted-foreground/70 uppercase tracking-wider">
                        {category}
                      </h3>
                      {(categoryModules as Module[]).map(renderModuleButton)}
                    </div>
                  ))}
                </nav>
              </ScrollArea>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>

      {/* ─── Content：定位层 + 摘要层 + 主工作区 + 固定动作层 ───────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="bg-card border-b border-border shrink-0">
          {/* 定位层：面包屑（高度与水平内边距对齐 Figma Header 呼吸感） */}
          <div className="h-10 flex items-center gap-2 px-6 border-b border-border/40">
            {collapsed && (
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-foreground shrink-0 focus-visible:ring-2 focus-visible:ring-ring/30"
                onClick={() => setCollapsed(false)}
                aria-label="展开二级菜单"
              >
                <PanelLeftOpen size={14} />
              </Button>
            )}
            <nav className="flex items-center gap-1.5 text-[11px] min-w-0" aria-label="面包屑">
              <span className="text-muted-foreground/70 truncate">{title}</span>
              <ChevronRight size={10} className="text-muted-foreground/30 shrink-0" aria-hidden />
              <span className="font-medium text-muted-foreground truncate">{currentModule?.title || '概览'}</span>
            </nav>
          </div>

          {contextSlot ? <div className="px-6 pb-3 border-b border-border/40">{contextSlot}</div> : null}

          {/* 定位层：页面标题 + 副标题 */}
          <div className="px-6 pt-3 pb-3 space-y-1">
            <h1 className="text-[15px] font-semibold text-foreground tracking-tight leading-snug">
              {currentModule?.title || '概览'}
            </h1>
            <p className="text-[12px] text-muted-foreground leading-relaxed max-w-4xl">{pageSubtitle}</p>
          </div>

          {/* 摘要层：KPI（可选，由各场景传入） */}
          {kpiSlot ? <div className="px-6 pb-4">{kpiSlot}</div> : null}

          {sampleBar ? <div className="px-6 pb-3">{sampleBar}</div> : null}
        </header>

        <div className="flex-1 flex overflow-hidden min-h-0 min-w-0">
          <div className="flex-1 flex flex-col min-h-0 min-w-0 overflow-hidden bg-muted/40 rounded-xl border border-border/40 mx-5">
            <ScrollArea className="flex-1 min-h-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeModule}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.18, ease: 'easeOut' }}
                  className="p-6 max-w-[min(100%,1400px)] mx-auto w-full"
                >
                  {children}
                  <Separator className="my-6" />
                  <p className="text-center text-[10px] text-muted-foreground/60 pb-2">{DEMO_DISCLAIMER}</p>
                </motion.div>
              </AnimatePresence>
            </ScrollArea>

            {stickyActionSlot ? (
              <div className="shrink-0 border-t border-border bg-card/95 backdrop-blur-md px-6 py-3.5 shadow-[0_-4px_12px_rgba(0,0,0,0.06)] z-10">
                {stickyActionSlot}
              </div>
            ) : null}
          </div>

          {/* ─── AI Copilot 浮动面板 ─────────────────────────────────── */}
          {aiPanel && (
            <>
              {/* 浮动触发按钮 */}
              <button
                type="button"
                onClick={() => setAiPanelOpen((v) => !v)}
                className={cn(
                  'fixed z-50 flex items-center justify-center',
                  'w-11 h-11 rounded-full shadow-lg',
                  'bg-primary text-primary-foreground',
                  'hover:scale-105 active:scale-95 transition-transform duration-150',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40',
                  'right-5 bottom-8',
                )}
                aria-label={aiPanelOpen ? '收起 AI 助手' : '展开 AI 助手'}
              >
                <Brain size={20} />
              </button>

              {/* 悬浮侧边栏 */}
              <AnimatePresence>
                {aiPanelOpen && (
                  <>
                    {/* 半透明遮罩 */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="fixed inset-0 z-40 bg-black/20"
                      onClick={() => setAiPanelOpen(false)}
                    />
                    <motion.aside
                      initial={{ x: 380, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 380, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 360, damping: 32 }}
                      className="fixed right-0 top-0 bottom-0 z-50 w-[380px] bg-card/98 backdrop-blur-xl border-l border-border shadow-[-8px_0_24px_rgba(0,0,0,0.08)] flex flex-col"
                    >
                      <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
                        <div className="flex items-center gap-2">
                          <Brain size={16} className="text-primary" />
                          <span className="text-[13px] font-semibold text-foreground">AI 助手</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-muted-foreground hover:text-foreground"
                          onClick={() => setAiPanelOpen(false)}
                          aria-label="关闭 AI 助手"
                        >
                          <PanelLeftClose size={14} />
                        </Button>
                      </div>
                      <ScrollArea className="flex-1">
                        <div className="p-5 space-y-4">{aiPanel}</div>
                      </ScrollArea>
                    </motion.aside>
                  </>
                )}
              </AnimatePresence>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
