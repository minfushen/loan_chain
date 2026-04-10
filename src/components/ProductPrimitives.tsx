import React from 'react';
import { LucideIcon, ChevronDown, Building2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { SAMPLES, type ChainLoanSample } from '../demo/chainLoan/data';

type BaseProps = React.HTMLAttributes<HTMLDivElement>;

/* ────────────────────────────────────────────────────────────────
   Design Tokens
   ──────────────────────────────────────────────────────────────── */

export const STATE_COLORS = {
  normal:   { bg: 'bg-[#ECFDF3]', text: 'text-[#047857]', border: 'border-[#A7F3D0]', dot: 'bg-[#16A34A]' },
  watch:    { bg: 'bg-[#FFF7ED]', text: 'text-[#C2410C]', border: 'border-[#FED7AA]', dot: 'bg-[#EA580C]' },
  risk:     { bg: 'bg-[#FEF2F2]', text: 'text-[#DC2626]', border: 'border-[#FECACA]', dot: 'bg-[#DC2626]' },
  recovery: { bg: 'bg-[#F8FAFC]', text: 'text-[#475569]', border: 'border-[#E2E8F0]', dot: 'bg-[#64748B]' },
  info:     { bg: 'bg-[#EFF6FF]', text: 'text-[#2563EB]', border: 'border-[#BFDBFE]', dot: 'bg-[#2563EB]' },
  warn:     { bg: 'bg-[#FFF7ED]', text: 'text-[#C2410C]', border: 'border-[#FED7AA]', dot: 'bg-[#EA580C]' },
  muted:    { bg: 'bg-[#F1F5F9]', text: 'text-[#475569]', border: 'border-[#E2E8F0]', dot: 'bg-[#94A3B8]' },
} as const;

export const AI_TOKENS = {
  shadow: {
    card: '0 1px 2px rgba(15,23,42,0.04), 0 8px 24px rgba(15,23,42,0.04)',
    ai: '0 0 0 1px rgba(59,130,246,0.12), 0 12px 32px rgba(59,130,246,0.10)',
    glow: '0 0 0 1px rgba(34,211,238,0.18), 0 0 24px rgba(34,211,238,0.10)',
  },
  gradient: {
    aiSurface: 'linear-gradient(180deg, rgba(239,246,255,0.92) 0%, rgba(255,255,255,1) 100%)',
    aiSubtle: 'linear-gradient(135deg, #FAFBFF 0%, #EFF6FF 100%)',
  },
} as const;

export type StateName = keyof typeof STATE_COLORS;

/* ────────────────────────────────────────────────────────────────
   1. PageHeader — unified page header
   ──────────────────────────────────────────────────────────────── */

export function PageHeader({
  title,
  subtitle,
  tags,
  right,
}: {
  title: string;
  subtitle?: string;
  tags?: string[];
  right?: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-[#E2E8F0] bg-white px-5 py-3 flex items-center justify-between gap-4 flex-wrap">
      <div className="flex items-center gap-4 min-w-0">
        <span className="text-sm font-semibold text-[#0F172A] shrink-0">{title}</span>
        {subtitle && <span className="text-[11px] text-[#94A3B8] truncate">{subtitle}</span>}
        {tags && tags.length > 0 && (
          <div className="flex items-center gap-1.5">
            {tags.map((t) => (
              <Badge key={t} className="bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] text-[10px]">{t}</Badge>
            ))}
          </div>
        )}
      </div>
      {right && <div className="flex items-center gap-2 shrink-0">{right}</div>}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   2. WorkbenchPanel — unified card container with title & actions
   ──────────────────────────────────────────────────────────────── */

export function WorkbenchPanel({
  title,
  icon: Icon,
  actions,
  badge,
  children,
  className,
  ...rest
}: BaseProps & {
  title: string;
  icon?: LucideIcon;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card className={cn('border border-[#E5E7EB]', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-sm flex items-center gap-2">
            {Icon && <Icon size={14} className="text-[#2563EB]" />}
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            {badge}
            {actions}
          </div>
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

/* ────────────────────────────────────────────────────────────────
   3. StatusPill — unified status label
   ──────────────────────────────────────────────────────────────── */

export function StatusPill({ state, label, className }: { state: StateName; label: string; className?: string }) {
  const s = STATE_COLORS[state];
  return (
    <Badge className={cn(`text-[10px] border ${s.bg} ${s.text} ${s.border}`, className)}>
      <div className={`w-1.5 h-1.5 rounded-full ${s.dot} mr-1`} />
      {label}
    </Badge>
  );
}

/* ────────────────────────────────────────────────────────────────
   4. MetricCard — redesigned with dot, label, value, sub
   ──────────────────────────────────────────────────────────────── */

export function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  trend,
  tone = 'blue',
  ...rest
}: BaseProps & {
  label: string;
  value: string;
  detail?: string;
  icon?: LucideIcon;
  trend?: string;
  tone?: 'blue' | 'green' | 'amber' | 'slate' | 'red';
}) {
  const toneMap = {
    blue: { iconBg: 'bg-[#EFF6FF] text-[#2563EB]', dot: 'bg-[#2563EB]' },
    green: { iconBg: 'bg-[#F0FDF4] text-[#16A34A]', dot: 'bg-[#16A34A]' },
    amber: { iconBg: 'bg-[#FFF7ED] text-[#EA580C]', dot: 'bg-[#EA580C]' },
    red: { iconBg: 'bg-[#FEF2F2] text-[#DC2626]', dot: 'bg-[#DC2626]' },
    slate: { iconBg: 'bg-[#F1F5F9] text-[#475569]', dot: 'bg-[#94A3B8]' },
  };
  const t = toneMap[tone];
  const trendColor = trend?.startsWith('-') ? 'text-[#DC2626]' : 'text-[#16A34A]';

  return (
    <Card className="border border-[#E5E7EB] bg-white">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Icon ? (
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', t.iconBg)}>
                <Icon size={14} />
              </div>
            ) : (
              <div className={`w-2 h-2 rounded-full ${t.dot}`} />
            )}
            <span className="text-[11px] text-[#94A3B8]">{label}</span>
          </div>
          {trend && <span className={cn('text-xs font-medium', trendColor)}>{trend}</span>}
        </div>
        <div className="mt-2 text-xl font-semibold text-[#0F172A]">{value}</div>
        {detail && <div className="mt-1 text-[11px] text-[#64748B]">{detail}</div>}
      </CardContent>
    </Card>
  );
}

/* ────────────────────────────────────────────────────────────────
   5. FlowRow — horizontal progress bar
   ──────────────────────────────────────────────────────────────── */

export function FlowRow({ label, value, percentage, ...rest }: BaseProps & { label: string; value: string; percentage: number }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-[#64748B]">
        <span>{label}</span>
        <span className="font-medium text-[#0F172A]">{value}</span>
      </div>
      <div className="h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden">
        <div className="h-full rounded-full bg-[#60A5FA]" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   6. EntitySummaryCard — entity summary (company, partner, etc.)
   ──────────────────────────────────────────────────────────────── */

export function EntitySummaryCard({
  name,
  role,
  state,
  stateLabel,
  keyValue,
  icon: Icon,
  children,
  onClick,
  selected,
  ...rest
}: BaseProps & {
  name: string;
  role: string;
  state: StateName;
  stateLabel: string;
  keyValue?: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
}) {
  const s = STATE_COLORS[state];
  return (
    <div className={`rounded-lg border bg-white px-4 py-3 ${onClick ? 'cursor-pointer transition-colors' : ''} ${selected ? 'border-[#2563EB] bg-[#EFF6FF]' : 'border-[#E2E8F0]'}`} onClick={onClick}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-7 h-7 rounded-lg bg-[#F1F5F9] flex items-center justify-center shrink-0">
            {Icon ? <Icon size={13} className="text-[#64748B]" /> : <div className={`w-2.5 h-2.5 rounded-full ${s.dot}`} />}
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-medium text-[#0F172A] truncate">{name}</div>
            <div className="text-[10px] text-[#94A3B8]">{role}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge className={`text-[10px] border ${s.bg} ${s.text} ${s.border}`}>{stateLabel}</Badge>
          {keyValue && <span className="text-sm font-semibold text-[#0F172A]">{keyValue}</span>}
        </div>
      </div>
      {children}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   7. ActionQueueCard — todo, suggested action, queued task
   ──────────────────────────────────────────────────────────────── */

export function ActionQueueCard({
  action,
  source,
  priority,
  sla,
  ...rest
}: BaseProps & {
  action: string;
  source: string;
  priority?: string;
  sla?: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5">
      <div className="min-w-0">
        <div className="text-xs font-medium text-[#0F172A] truncate">{action}</div>
        <div className="text-[10px] text-[#94A3B8]">→ {source}</div>
      </div>
      <div className="flex items-center gap-1.5 shrink-0">
        {priority && <Badge className="bg-[#F1F5F9] text-[#475569] border-transparent text-[10px]">{priority}</Badge>}
        {sla && <Badge className="bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0] text-[10px]">{sla}</Badge>}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   10. InsightStrip — high-value AI insight or system judgment
   ──────────────────────────────────────────────────────────────── */

export function InsightStrip({
  children,
  tone = 'info',
  ...rest
}: BaseProps & {
  children: React.ReactNode;
  tone?: StateName;
}) {
  const s = STATE_COLORS[tone];
  return (
    <div className={cn('rounded-lg border px-4 py-2.5 text-xs leading-5 flex items-start gap-2', s.border, s.bg)}>
      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${s.dot}`} />
      <div className={s.text}>{children}</div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   11. TimelineRail — unified vertical timeline
   ──────────────────────────────────────────────────────────────── */

export function TimelineRail({
  items,
}: {
  items: { date: string; title: string; desc?: string; done?: boolean; icon?: LucideIcon }[];
}) {
  return (
    <div className="space-y-0">
      {items.map((item, idx) => {
        const IconComp = item.icon;
        return (
          <div key={`${item.date}-${idx}`} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={cn(
                'flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-medium shrink-0',
                item.done ? 'bg-[#16A34A] text-white' : 'bg-[#EFF6FF] text-[#1890FF] border border-[#BFDBFE]',
              )}>
                {IconComp ? <IconComp size={12} /> : (item.done ? '✓' : idx + 1)}
              </div>
              {idx < items.length - 1 && (
                <div className={`w-px flex-1 min-h-[16px] ${item.done ? 'bg-[#A7F3D0]' : 'bg-[#E2E8F0]'}`} />
              )}
            </div>
            <div className="pb-4 min-w-0">
              <div className="text-[10px] text-[#94A3B8]">{item.date}</div>
              <div className={`text-xs font-medium ${item.done ? 'text-[#0F172A]' : 'text-[#64748B]'}`}>{item.title}</div>
              {item.desc && <div className="mt-0.5 text-[11px] text-[#94A3B8] leading-4">{item.desc}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   12. MiniTrend — compact metric with trend
   ──────────────────────────────────────────────────────────────── */

export function MiniTrend({
  label,
  value,
  trend,
  good,
}: {
  label: string;
  value: string;
  trend: string;
  good: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5">
      <span className="text-xs text-[#334155]">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm font-semibold text-[#0F172A]">{value}</span>
        <span className={cn('text-[11px] font-medium', good ? 'text-[#16A34A]' : 'text-[#DC2626]')}>{trend}</span>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   13. WorkbenchSplit — left main + right aside layout
   ──────────────────────────────────────────────────────────────── */

export function WorkbenchSplit({
  main,
  aside,
  ratio = '1fr_0.8fr',
}: {
  main: React.ReactNode;
  aside: React.ReactNode;
  ratio?: string;
}) {
  return (
    <div className={`grid grid-cols-1 xl:grid-cols-[${ratio}] gap-4`}>
      <div>{main}</div>
      <div>{aside}</div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   14. GovBar — lightweight governance metadata bar
   ──────────────────────────────────────────────────────────────── */

export function GovBar({ items, right }: { items: string[]; right?: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 flex items-center justify-between text-[11px] text-[#94A3B8] flex-wrap gap-2">
      <div className="flex items-center gap-4">
        {items.map((item) => <span key={item}>{item}</span>)}
      </div>
      {right && <div className="flex items-center gap-2">{right}</div>}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   AI Inline: AiTag — tiny pill for inline use in headers / table rows
   ──────────────────────────────────────────────────────────────── */

export function AiTag({ label, confidence, tone = 'blue' }: {
  label?: string;
  confidence?: number;
  tone?: 'blue' | 'green' | 'amber' | 'red';
}) {
  const toneMap = {
    blue:  'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
    green: 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]',
    amber: 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
    red:   'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
  };
  const barTone = {
    blue:  'bg-[#3B82F6]',
    green: 'bg-[#16A34A]',
    amber: 'bg-[#F59E0B]',
    red:   'bg-[#DC2626]',
  };
  return (
    <span className={cn('inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium', toneMap[tone])}>
      <span className="font-bold" style={{ fontSize: 8, letterSpacing: '0.04em' }}>AI</span>
      {confidence != null && (
        <>
          <span className="w-8 h-[3px] rounded-full bg-black/[0.06] overflow-hidden inline-block align-middle">
            <span className={`block h-full rounded-full ${barTone[tone]}`} style={{ width: `${confidence}%` }} />
          </span>
          <span>{confidence}%</span>
        </>
      )}
      {label && <span>{label}</span>}
    </span>
  );
}

/* ────────────────────────────────────────────────────────────────
   AI Inline: AiNote — 1-2 line annotation for inside panels
   ──────────────────────────────────────────────────────────────── */

export function AiNote({ children, action, ...rest }: BaseProps & {
  children: React.ReactNode;
  action?: string;
}) {
  return (
    <div className="flex items-start gap-2 rounded-lg border border-[#BFDBFE]/60 bg-[#EFF6FF]/50 px-3 py-2 text-[11px] leading-5">
      <span className="shrink-0 rounded bg-[#3B82F6] text-white text-[8px] font-bold px-1 py-px mt-0.5" style={{ letterSpacing: '0.04em' }}>AI</span>
      <div className="min-w-0 flex-1">
        <span className="text-[#334155]">{children}</span>
        {action && <span className="text-[#2563EB] font-medium ml-1">→ {action}</span>}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   AI Inline: AiBar — compact bar: conclusion + metrics + action
   ──────────────────────────────────────────────────────────────── */

export function AiBar({ conclusion, confidence, metrics, action, ...rest }: BaseProps & {
  conclusion: string;
  confidence?: number;
  metrics?: { label: string; value: string }[];
  action?: string;
}) {
  const barColor = !confidence ? '' : confidence >= 80 ? 'bg-[#16A34A]' : confidence >= 60 ? 'bg-[#F59E0B]' : 'bg-[#DC2626]';
  const tone = !confidence ? 'blue' as const : confidence >= 80 ? 'green' as const : confidence >= 60 ? 'amber' as const : 'red' as const;
  return (
    <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-3 flex items-center gap-4 flex-wrap">
      <AiTag confidence={confidence} tone={tone} />
      <span className="text-xs font-medium text-[#0F172A] flex-1 min-w-0">{conclusion}</span>
      {metrics && metrics.map((m) => (
        <span key={m.label} className="text-[10px] text-[#64748B] shrink-0">
          {m.label} <span className="font-semibold text-[#0F172A]">{m.value}</span>
        </span>
      ))}
      {action && (
        <span className="text-[11px] text-[#2563EB] font-medium shrink-0">→ {action}</span>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   SampleSwitcher — unified sample selector, reusable across all scenes
   ──────────────────────────────────────────────────────────────── */

const BADGE_TONE: Record<ChainLoanSample['uiState']['badgeTone'], { bg: string; text: string; border: string }> = {
  blue:  { bg: 'bg-[#EFF6FF]', text: 'text-[#2563EB]', border: 'border-[#BFDBFE]' },
  green: { bg: 'bg-[#ECFDF3]', text: 'text-[#047857]', border: 'border-[#A7F3D0]' },
  amber: { bg: 'bg-[#FFF7ED]', text: 'text-[#C2410C]', border: 'border-[#FED7AA]' },
  red:   { bg: 'bg-[#FEF2F2]', text: 'text-[#DC2626]', border: 'border-[#FECACA]' },
  slate: { bg: 'bg-[#F1F5F9]', text: 'text-[#475569]', border: 'border-[#E2E8F0]' },
};

export function SampleSwitcher({
  selectedId,
  onSelect,
  samples = SAMPLES,
  compact = false,
}: {
  selectedId: string;
  onSelect: (id: string) => void;
  samples?: ChainLoanSample[];
  compact?: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  const current = samples.find((s) => s.id === selectedId) ?? samples[0];
  const tone = BADGE_TONE[current.uiState.badgeTone];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white transition-colors hover:border-[#CBD5E1]',
          compact ? 'px-2.5 py-1.5' : 'px-3 py-2',
        )}
      >
        <div className={cn('w-2 h-2 rounded-full shrink-0', tone.bg.replace('bg-', 'bg-'), BADGE_TONE[current.uiState.badgeTone].text.includes('2563') ? 'bg-[#2563EB]' : BADGE_TONE[current.uiState.badgeTone].text.includes('047857') ? 'bg-[#047857]' : BADGE_TONE[current.uiState.badgeTone].text.includes('C2410C') ? 'bg-[#EA580C]' : BADGE_TONE[current.uiState.badgeTone].text.includes('DC2626') ? 'bg-[#DC2626]' : 'bg-[#64748B]')} />
        <span className="text-xs font-medium text-[#0F172A] truncate max-w-[120px]">{current.shortName}</span>
        {!compact && (
          <Badge className={cn('text-[9px] border', tone.bg, tone.text, tone.border)}>{current.segmentTag}</Badge>
        )}
        <ChevronDown size={12} className={cn('text-[#94A3B8] transition-transform', open && 'rotate-180')} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute z-50 mt-1 w-72 rounded-lg border border-[#E2E8F0] bg-white shadow-lg py-1 max-h-64 overflow-y-auto left-0">
            {samples.map((s) => {
              const t = BADGE_TONE[s.uiState.badgeTone];
              const isSelected = s.id === selectedId;
              return (
                <button
                  key={s.id}
                  onClick={() => { onSelect(s.id); setOpen(false); }}
                  className={cn(
                    'w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors',
                    isSelected ? 'bg-[#EFF6FF]' : 'hover:bg-[#F8FAFC]',
                  )}
                >
                  <Building2 size={14} className={isSelected ? 'text-[#2563EB]' : 'text-[#94A3B8]'} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={cn('text-xs font-medium truncate', isSelected ? 'text-[#2563EB]' : 'text-[#0F172A]')}>
                        {s.shortName}
                      </span>
                      <Badge className={cn('text-[9px] border', t.bg, t.text, t.border)}>{s.segmentTag}</Badge>
                    </div>
                    <div className="text-[10px] text-[#94A3B8] truncate">{s.roleInChain} · {s.approvalStatus}</div>
                  </div>
                  <span className="text-[10px] text-[#94A3B8] shrink-0">{s.currentLimit}</span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   SelectedSampleSummary — sticky summary bar for the current sample
   ──────────────────────────────────────────────────────────────── */
export function SelectedSampleSummary({
  sample,
  onSwitchClick,
  className,
}: {
  sample: ChainLoanSample;
  onSwitchClick?: () => void;
  className?: string;
}) {
  const tone = BADGE_TONE[sample.uiState.badgeTone];

  return (
    <div className={cn('flex items-center gap-3 rounded-lg border border-[#D6E4FF] bg-[#FAFBFF] px-4 py-2.5', className)}>
      <Building2 size={16} className="text-[#2563EB] shrink-0" />
      <div className="flex-1 min-w-0 flex items-center gap-3">
        <span className="text-sm font-semibold text-[#0F172A] truncate">{sample.shortName}</span>
        <Badge className={cn('text-[9px] border', tone.bg, tone.text, tone.border)}>{sample.segmentTag}</Badge>
        <span className="text-[10px] text-[#94A3B8]">{sample.roleInChain}</span>
      </div>
      <div className="flex items-center gap-4 text-right shrink-0">
        <div>
          <div className="text-[10px] text-[#94A3B8]">额度</div>
          <div className="text-xs font-semibold text-[#0F172A]">{sample.currentLimit}</div>
        </div>
        <div>
          <div className="text-[10px] text-[#94A3B8]">风险</div>
          <div className={cn(
            'text-xs font-semibold',
            sample.riskStatus === '正常' ? 'text-[#047857]' : sample.riskStatus === '观察' ? 'text-[#C2410C]' : sample.riskStatus === '中度预警' ? 'text-[#DC2626]' : 'text-[#475569]',
          )}>{sample.riskStatus}</div>
        </div>
        <div>
          <div className="text-[10px] text-[#94A3B8]">下一步</div>
          <div className="text-xs font-medium text-[#2563EB]">{sample.nextAction}</div>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   PanelCard — generic panel container with optional header actions
   ──────────────────────────────────────────────────────────────── */
export function PanelCard({
  title,
  subtitle,
  badge,
  actions,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('rounded-xl border border-[#E2E8F0] bg-white', className)}>
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#F1F5F9]">
        <div className="flex items-center gap-2 min-w-0">
          <h3 className="text-sm font-semibold text-[#0F172A] truncate">{title}</h3>
          {subtitle && <span className="text-[10px] text-[#94A3B8]">{subtitle}</span>}
          {badge}
        </div>
        {actions && <div className="flex items-center gap-2 shrink-0">{actions}</div>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   SectionShell — full-width titled section for grouping content
   ──────────────────────────────────────────────────────────────── */
export function SectionShell({
  title,
  subtitle,
  children,
  className,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('space-y-3', className)}>
      <div>
        <h3 className="text-sm font-semibold text-[#0F172A]">{title}</h3>
        {subtitle && <p className="text-[11px] text-[#94A3B8] mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

/* ────────────────────────────────────────────────────────────────
   InsightCard — AI insight with conclusion, evidence count, and CTA
   ──────────────────────────────────────────────────────────────── */
export function InsightCard({
  title,
  conclusion,
  confidence,
  evidenceCount,
  action,
  onAction,
  className,
}: {
  title?: string;
  conclusion: string;
  confidence?: number;
  evidenceCount?: number;
  action?: string;
  onAction?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn('rounded-xl border border-[#D6E4FF] p-4', className)}
      style={{ background: AI_TOKENS.gradient.aiSubtle, boxShadow: AI_TOKENS.shadow.ai }}
    >
      {title && <div className="text-[10px] font-medium text-[#2563EB] mb-1.5">{title}</div>}
      <p className="text-[13px] text-[#0F172A] leading-6">{conclusion}</p>
      <div className="flex items-center gap-3 mt-3">
        {confidence != null && (
          <Badge className="bg-white/80 text-[#2563EB] border border-[#BFDBFE] text-[10px]">置信度 {confidence}%</Badge>
        )}
        {evidenceCount != null && (
          <Badge className="bg-white/80 text-[#475569] border border-[#E2E8F0] text-[10px]">{evidenceCount} 项证据</Badge>
        )}
        {action && (
          <button onClick={onAction} className="ml-auto text-[11px] font-medium text-[#2563EB] hover:underline">{action}</button>
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   ConfidenceCard — displays a confidence score with breakdown
   ──────────────────────────────────────────────────────────────── */
export function ConfidenceCard({
  score,
  label,
  breakdowns,
  className,
}: {
  score: number;
  label?: string;
  breakdowns?: { name: string; value: number }[];
  className?: string;
}) {
  const color = score >= 80 ? '#047857' : score >= 60 ? '#2563EB' : score >= 40 ? '#C2410C' : '#DC2626';
  return (
    <div className={cn('rounded-xl border border-[#E2E8F0] bg-white p-4', className)}>
      <div className="flex items-center gap-3">
        <div className="text-3xl font-bold" style={{ color }}>{score}</div>
        <div>
          <div className="text-xs font-medium text-[#0F172A]">{label ?? '综合置信度'}</div>
          <div className="text-[10px] text-[#94A3B8]">满分 100</div>
        </div>
      </div>
      {breakdowns && breakdowns.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {breakdowns.map((b) => (
            <div key={b.name} className="flex items-center gap-2">
              <span className="text-[11px] text-[#64748B] w-20 shrink-0">{b.name}</span>
              <div className="flex-1 h-1.5 rounded-full bg-[#F1F5F9]">
                <div className="h-full rounded-full" style={{ width: `${b.value}%`, backgroundColor: color }} />
              </div>
              <span className="text-[11px] font-medium text-[#334155] w-8 text-right">{b.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   ActionSuggestionCard — AI recommended next action
   ──────────────────────────────────────────────────────────────── */
export function ActionSuggestionCard({
  action,
  reason,
  priority,
  agent,
  onExecute,
  className,
}: {
  action: string;
  reason: string;
  priority?: 'high' | 'medium' | 'low';
  agent?: string;
  onExecute?: () => void;
  className?: string;
}) {
  const pColor = priority === 'high' ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]' : priority === 'medium' ? 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]' : 'bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]';
  return (
    <div className={cn('rounded-xl border border-[#E2E8F0] bg-white p-4', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[13px] font-semibold text-[#0F172A]">{action}</div>
          <p className="text-[11px] text-[#64748B] mt-1 leading-5">{reason}</p>
        </div>
        {onExecute && (
          <button onClick={onExecute} className="shrink-0 rounded-lg bg-[#2563EB] text-white text-[11px] font-medium px-3 py-1.5 hover:bg-[#1D4ED8] transition-colors">
            执行
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 mt-3">
        {priority && <Badge className={cn('text-[9px] border', pColor)}>{priority === 'high' ? '高优' : priority === 'medium' ? '中优' : '低优'}</Badge>}
        {agent && <Badge className="bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] text-[9px]">{agent}</Badge>}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   SignalCard — a single signal indicator with status
   ──────────────────────────────────────────────────────────────── */
export function SignalCard({
  icon: Icon,
  label,
  value,
  status,
  detail,
  className,
}: {
  icon?: LucideIcon;
  label: string;
  value: string;
  status: StateName;
  detail?: string;
  className?: string;
}) {
  const s = STATE_COLORS[status];
  return (
    <div className={cn('rounded-xl border border-[#E2E8F0] bg-white p-3.5', className)}>
      <div className="flex items-center gap-2.5">
        {Icon && (
          <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', s.bg)}>
            <Icon size={14} className={s.text} />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="text-[10px] text-[#94A3B8]">{label}</div>
          <div className="text-[13px] font-semibold text-[#0F172A]">{value}</div>
        </div>
        <Badge className={cn('text-[9px] border shrink-0', s.bg, s.text, s.border)}>
          {status === 'normal' ? '正常' : status === 'watch' ? '观察' : status === 'risk' ? '预警' : status === 'recovery' ? '恢复' : status === 'info' ? '信息' : '—'}
        </Badge>
      </div>
      {detail && <p className="text-[10px] text-[#64748B] mt-1.5 leading-4">{detail}</p>}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   TimelineInsightCard — timeline + AI insight overlay
   ──────────────────────────────────────────────────────────────── */
export function TimelineInsightCard({
  items,
  insight,
  className,
}: {
  items: { date: string; title: string; done?: boolean }[];
  insight?: string;
  className?: string;
}) {
  return (
    <div className={cn('rounded-xl border border-[#E2E8F0] bg-white p-4', className)}>
      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div className={cn('w-2.5 h-2.5 rounded-full mt-1', item.done ? 'bg-[#2563EB]' : 'bg-[#E2E8F0]')} />
              {i < items.length - 1 && <div className="w-px flex-1 bg-[#E2E8F0] my-1" />}
            </div>
            <div className="flex-1 min-w-0 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-[#94A3B8]">{item.date}</span>
                <span className={cn('text-[12px] font-medium', item.done ? 'text-[#0F172A]' : 'text-[#94A3B8]')}>{item.title}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      {insight && (
        <div className="mt-3 pt-3 border-t border-[#F1F5F9]">
          <div className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-1.5 shrink-0" />
            <p className="text-[11px] text-[#334155] leading-5">{insight}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   AgentCapabilityCard — shows an agent/capability with status
   ──────────────────────────────────────────────────────────────── */
export function AgentCapabilityCard({
  name,
  description,
  status,
  metrics,
  className,
}: {
  name: string;
  description: string;
  status: 'active' | 'ready' | 'disabled';
  metrics?: { label: string; value: string }[];
  className?: string;
}) {
  const statusColor = status === 'active' ? 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]' : status === 'ready' ? 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]' : 'bg-[#F1F5F9] text-[#94A3B8] border-[#E2E8F0]';
  const statusLabel = status === 'active' ? '运行中' : status === 'ready' ? '就绪' : '未启用';
  return (
    <div className={cn('rounded-xl border border-[#E2E8F0] bg-white p-4', className)}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="text-[13px] font-semibold text-[#0F172A]">{name}</div>
          <p className="text-[11px] text-[#64748B] mt-0.5 leading-4">{description}</p>
        </div>
        <Badge className={cn('text-[9px] border shrink-0', statusColor)}>{statusLabel}</Badge>
      </div>
      {metrics && metrics.length > 0 && (
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-[#F1F5F9]">
          {metrics.map((m) => (
            <div key={m.label}>
              <div className="text-[10px] text-[#94A3B8]">{m.label}</div>
              <div className="text-xs font-semibold text-[#0F172A]">{m.value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
