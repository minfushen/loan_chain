import React from 'react';
import { Brain, ChevronDown, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

/** 短句轮换，营造「正在处理」感，避免整页流式 */
export function MicroPulse({ lines, className }: { lines: string[]; className?: string }) {
  const [i, setI] = React.useState(0);
  React.useEffect(() => {
    if (lines.length <= 1) return;
    const t = window.setInterval(() => setI((n) => (n + 1) % lines.length), 2800);
    return () => window.clearInterval(t);
  }, [lines.length]);
  return (
    <p className={cn('text-[10px] text-muted-foreground font-mono tabular-nums', className)} aria-live="polite">
      <span className="inline-flex items-center gap-1.5">
        <span className="size-1.5 rounded-full bg-primary/70 animate-pulse shrink-0" />
        {lines[i % lines.length]}
      </span>
    </p>
  );
}

/** 展开后逐字显示；折叠时仅展示 preview */
export function TypewriterText({ text, active, className }: { text: string; active: boolean; className?: string }) {
  const [shown, setShown] = React.useState(0);
  React.useEffect(() => {
    setShown(0);
  }, [text, active]);
  React.useEffect(() => {
    if (!active) return;
    if (shown >= text.length) return;
    const id = window.setTimeout(() => setShown((n) => Math.min(n + 2, text.length)), 22);
    return () => window.clearTimeout(id);
  }, [active, text, shown]);
  const slice = active ? text.slice(0, shown) : '';
  return (
    <p className={cn('text-[11px] text-foreground/90 leading-relaxed whitespace-pre-wrap', className)}>
      {slice}
      {active && shown < text.length && <span className="inline-block w-0.5 h-3 ml-0.5 bg-primary align-middle animate-pulse" />}
    </p>
  );
}

const VARIANT_RING: Record<string, string> = {
  convergence: 'from-violet-500/20 to-primary/15 border-primary/25',
  threshold: 'from-amber-500/15 to-primary/15 border-amber-500/25',
  boundary: 'from-rose-500/15 to-violet-500/10 border-rose-500/20',
  adjudication: 'from-emerald-500/15 to-primary/15 border-emerald-500/25',
};

/** 中部 AI 引导卡 — 默认折叠为摘要行，点击展开完整内容 */
export function AiMiddleGuideCard({
  variant,
  title,
  children,
  className,
}: {
  variant: 'convergence' | 'threshold' | 'boundary' | 'adjudication';
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  const [expanded, setExpanded] = React.useState(false);

  return (
    <div
      className={cn(
        'rounded-xl border bg-gradient-to-br shadow-sm overflow-hidden transition-all duration-200',
        expanded ? 'p-4 space-y-2.5' : 'p-2.5',
        VARIANT_RING[variant],
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between gap-2"
      >
        <div className="flex items-center gap-2 min-w-0">
          <div className="size-6 rounded-lg bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center shadow-sm shrink-0">
            <Sparkles className="size-3 text-primary-foreground" aria-hidden />
          </div>
          <div className="text-left min-w-0">
            <div className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">AI 引导</div>
            <div className="text-[12px] font-semibold text-foreground leading-tight truncate">{title}</div>
          </div>
        </div>
        <ChevronDown
          size={14}
          className={cn(
            'text-muted-foreground shrink-0 transition-transform duration-200',
            expanded && 'rotate-180',
          )}
        />
      </button>
      {expanded && (
        <div className="text-[11px] leading-relaxed text-foreground/90 pl-0.5">{children}</div>
      )}
    </div>
  );
}

/** 右侧 AI 坞：默认窄摘要，展开后完整建议 + 打字机 */
export function ApprovalAiDock({
  collapsedSummary,
  fullText,
  expanded,
  onToggle,
}: {
  collapsedSummary: string;
  fullText: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex flex-col h-full min-h-[200px]">
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-border">
        <div className="flex items-center gap-1.5 min-w-0">
          <Brain className="size-4 text-primary shrink-0" />
          <span className="text-[11px] font-semibold truncate">AI 建议</span>
        </div>
        <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-[10px] shrink-0 gap-0.5" onClick={onToggle}>
          {expanded ? (
            <>
              <ChevronRight className="size-3.5 rotate-180" /> 收起
            </>
          ) : (
            <>
              展开 <ChevronLeft className="size-3.5" />
            </>
          )}
        </Button>
      </div>
      {!expanded && (
        <p className="text-[10px] text-muted-foreground leading-snug mt-4 line-clamp-8" title={collapsedSummary}>
          {collapsedSummary}
        </p>
      )}
      {expanded && (
        <div className="flex-1 overflow-y-auto mt-4 space-y-4 pr-1">
          <TypewriterText text={fullText} active />
          <p className="text-[9px] text-muted-foreground border-t border-border pt-2">
            中部为任务引导，此处为完整解释与可采纳动作参考。
          </p>
        </div>
      )}
    </div>
  );
}
