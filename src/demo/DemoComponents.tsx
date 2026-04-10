import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Building2,
  ChevronRight,
  X,
  FileText,
  Truck,
  Wallet,
  PackageCheck,
  Check,
  AlertTriangle,
  Play,
  RotateCcw,
} from 'lucide-react';
import { useDemo, STAGE_ORDER } from './DemoContext';
import {
  CHAIN_LOAN_STAGE_LABELS,
  CHAIN_LOAN_DEMO_ACTION_COPY,
  DemoStage,
  getEvidenceForSample,
  getRiskEventForSample,
} from './chainLoan/data';
import { AnimatePresence, motion } from 'motion/react';

// ─── DemoStepper ────────────────────────────────────────────────────────────
export function DemoStepper() {
  const { active, stage, stageIndex, currentSample } = useDemo();
  if (!active) return null;

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white px-5 py-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-sm font-medium text-[#0F172A]">
            {currentSample.shortName} · 演示流程
          </div>
          <div className="mt-0.5 text-[11px] text-[#94A3B8]">
            {currentSample.productType} · {currentSample.roleInChain}
          </div>
        </div>
        <span className="text-[11px] text-[#94A3B8] border border-[#E2E8F0] rounded-md px-2 py-0.5">
          步骤 {stageIndex + 1} / 7
        </span>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {STAGE_ORDER.map((s, index) => {
          const isCurrent = s === stage;
          const isDone = index < stageIndex;
          return (
            <div key={s} className="flex flex-col items-center gap-1.5 text-center">
              <div
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-all',
                  isCurrent
                    ? 'border-2 border-[#1890FF] bg-[#EFF6FF] text-[#1890FF]'
                    : isDone
                      ? 'border border-[#A7F3D0] bg-[#ECFDF3] text-[#16A34A]'
                      : 'border border-[#E2E8F0] bg-white text-[#94A3B8]',
                )}
              >
                {isDone ? <Check size={12} /> : index + 1}
              </div>
              <div
                className={cn(
                  'text-[11px]',
                  isCurrent
                    ? 'font-medium text-[#1890FF]'
                    : isDone
                      ? 'text-[#16A34A]'
                      : 'text-[#94A3B8]',
                )}
              >
                {CHAIN_LOAN_STAGE_LABELS[s]}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── CaseSummaryCard ────────────────────────────────────────────────────────
export function CaseSummaryCard() {
  const { active, stage, riskSimulated, recoveryComplete, currentSample } = useDemo();
  if (!active) return null;

  const riskStatus = (() => {
    if (riskSimulated && stage === 'risk_alert') return '中度预警';
    if (recoveryComplete && stage === 'post_loan_recovery') return '已恢复';
    return currentSample.riskStatus;
  })();

  const riskColor =
    riskStatus === '中度预警' ? 'text-[#DC2626]' : riskStatus === '已恢复' || riskStatus === '正常' ? 'text-[#0F172A]' : 'text-[#C2410C]';

  const limitValue = (() => {
    if (riskSimulated && !recoveryComplete) return currentSample.currentLimit;
    if (recoveryComplete) return currentSample.currentLimit;
    return currentSample.recommendedLimit;
  })();

  const approvalStatus = (() => {
    if (STAGE_ORDER.indexOf(stage) >= STAGE_ORDER.indexOf('approved')) return '已批准';
    if (riskSimulated) return '已降额';
    return currentSample.approvalStatus;
  })();

  return (
    <div className="rounded-2xl border border-[#D6E4FF] bg-[#FAFBFF] px-5 py-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#D6E4FF] bg-white text-[#2563EB]">
            <Building2 size={18} />
          </div>
          <div>
            <div className="text-lg font-semibold text-[#0F172A]">
              {currentSample.companyName}
            </div>
            <div className="text-[11px] text-[#94A3B8]">
              {currentSample.chainName} · {currentSample.roleInChain}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          <div className="text-right">
            <div className="text-[11px] text-[#94A3B8]">拟授信额度</div>
            <div className="mt-1 text-base font-semibold text-[#0F172A]">{limitValue}</div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-[#94A3B8]">风险状态</div>
            <div className={cn('mt-1 text-base font-semibold', riskColor)}>{riskStatus}</div>
          </div>
          <div className="text-right">
            <div className="text-[11px] text-[#94A3B8]">审批状态</div>
            <div className="mt-1 text-base font-semibold text-[#0F172A]">{approvalStatus}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── ActionBar ──────────────────────────────────────────────────────────────
export function ActionBar() {
  const { active, stage, stageIndex, advanceStage, toggleEvidenceDrawer, resetDemo, currentSample } = useDemo();
  if (!active) return null;

  const copy = CHAIN_LOAN_DEMO_ACTION_COPY[stage];
  const isLast = stageIndex === STAGE_ORDER.length - 1;

  const handlePrimary = () => {
    if (isLast) {
      resetDemo();
    } else {
      advanceStage();
    }
  };

  return (
    <div className="sticky bottom-0 z-40 border-t border-[#E2E8F0] bg-white/95 backdrop-blur-sm px-5 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Badge className="bg-[#EFF6FF] text-[#1890FF] border border-[#BFDBFE] text-[11px]">
            {currentSample.shortName}
          </Badge>
          <span className="text-xs text-[#64748B]">
            当前：{CHAIN_LOAN_STAGE_LABELS[stage]}
            {!isLast && (
              <>
                <ChevronRight size={12} className="inline mx-0.5" />
                下一步：{CHAIN_LOAN_STAGE_LABELS[STAGE_ORDER[stageIndex + 1]]}
              </>
            )}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs border-[#E2E8F0] text-[#64748B]"
            onClick={toggleEvidenceDrawer}
          >
            {copy.secondary}
          </Button>
          <Button
            size="sm"
            className={cn(
              'h-8 text-xs gap-1.5',
              isLast
                ? 'bg-[#0F172A] hover:bg-[#1E293B]'
                : 'bg-[#1890FF] hover:bg-[#0F76D1]',
            )}
            onClick={handlePrimary}
          >
            {isLast ? <RotateCcw size={12} /> : <Play size={12} />}
            {isLast ? '重新演示' : copy.primary}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── EvidenceDrawer ─────────────────────────────────────────────────────────
const EVIDENCE_ICONS: Record<string, React.ReactNode> = {
  order: <PackageCheck size={16} className="text-[#1890FF]" />,
  invoice: <FileText size={16} className="text-[#7C3AED]" />,
  settlement: <Wallet size={16} className="text-[#C2410C]" />,
  logistics: <Truck size={16} className="text-[#047857]" />,
};

export function EvidenceDrawer() {
  const { evidenceDrawerOpen, toggleEvidenceDrawer, currentSample } = useDemo();
  const sampleEvidence = getEvidenceForSample(currentSample);

  return (
    <AnimatePresence>
      {evidenceDrawerOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/20"
            onClick={toggleEvidenceDrawer}
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-[480px] max-w-[90vw] bg-white border-l border-[#E2E8F0] shadow-xl flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E2E8F0]">
              <div>
                <div className="text-base font-semibold text-[#0F172A]">
                  {currentSample.shortName} · 经营实质证据
                </div>
                <div className="mt-0.5 text-[11px] text-[#94A3B8]">
                  {currentSample.roleInChain} · {currentSample.chainName}
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="w-8 h-8 text-[#94A3B8]"
                onClick={toggleEvidenceDrawer}
              >
                <X size={16} />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Sample-level summary metrics */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: '关系强度', value: `${currentSample.relationStrength}%`, icon: '🔗' },
                  { label: '真实性得分', value: `${currentSample.authenticityScore}%`, icon: '✅' },
                  { label: '90天订单', value: `${currentSample.orderCount90d} 笔 / ${currentSample.orderAmount90d}`, icon: '📦' },
                  { label: '开票连续', value: `${currentSample.invoiceContinuityMonths} 月`, icon: '📄' },
                  { label: '回款周期', value: currentSample.avgReceivableCycle, icon: '💰' },
                  { label: '集中度', value: currentSample.maxCustomerConcentration, icon: '📊' },
                ].map((m) => (
                  <div key={m.label} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5">
                    <div className="text-[10px] text-[#94A3B8]">{m.icon} {m.label}</div>
                    <div className="mt-1 text-sm font-semibold text-[#0F172A]">{m.value}</div>
                  </div>
                ))}
              </div>

              {/* Logistics & account status */}
              <div className="space-y-2">
                {[
                  { label: '物流履约', value: currentSample.logisticsStatus },
                  { label: '账户流水', value: currentSample.accountFlowStatus },
                  { label: '链路', value: currentSample.mainChainPath.join(' → ') },
                ].map((row) => (
                  <div key={row.label} className="flex items-center justify-between rounded-lg border border-[#E2E8F0] bg-white px-3 py-2.5">
                    <span className="text-[11px] text-[#94A3B8]">{row.label}</span>
                    <span className="text-xs font-medium text-[#334155]">{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Risk flags */}
              {currentSample.riskFlags.length > 0 && (
                <div className="rounded-lg border border-[#FED7AA] bg-[#FFFBEB] p-3">
                  <div className="text-xs font-medium text-[#92400E] mb-2">风险标识</div>
                  <div className="flex flex-wrap gap-1.5">
                    {currentSample.riskFlags.map((f) => (
                      <Badge key={f} className="bg-white text-[#C2410C] border border-[#FED7AA] text-[10px]">{f}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* AI summary */}
              <div className="rounded-lg border border-[#D6E4FF] bg-[#FAFBFF] p-3">
                <div className="text-xs font-medium text-[#2563EB] mb-1">AI 判断</div>
                <p className="text-xs leading-5 text-[#334155]">{currentSample.aiSummary}</p>
                <div className="mt-2 text-[10px] text-[#94A3B8]">
                  置信度 {currentSample.agentHints.confidence}% · {currentSample.agentHints.suggestedAgent}
                </div>
              </div>

              {/* Detailed evidence cards for current sample */}
              <div className="text-[10px] text-[#94A3B8] uppercase tracking-wider pt-2">详细证据（{currentSample.shortName}）</div>
              {sampleEvidence.map((ev) => (
                <Card key={ev.id} className="border border-[#E5E7EB]">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {EVIDENCE_ICONS[ev.type]}
                        <span className="text-sm font-semibold text-[#0F172A]">{ev.title}</span>
                      </div>
                      <Badge className="bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0] text-[10px]">
                        {ev.metricLabel}: {ev.metricValue}
                      </Badge>
                    </div>
                    <p className="text-xs text-[#64748B] leading-5">{ev.summary}</p>
                    <div className="space-y-1.5">
                      {ev.detailPoints.map((pt) => (
                        <div
                          key={pt}
                          className="rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-2 text-[11px] text-[#334155] leading-5"
                        >
                          {pt}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Review reason */}
              <div className="rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
                <div className="text-xs font-medium text-[#0F172A]">审核原因</div>
                <p className="mt-2 text-[11px] leading-5 text-[#475569]">{currentSample.reviewReason}</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── RiskEventPanel ─────────────────────────────────────────────────────────
export function RiskEventPanel() {
  const { riskSimulated, stage, currentSample } = useDemo();
  if (!riskSimulated || (stage !== 'risk_alert' && stage !== 'post_loan_recovery')) return null;

  const event = getRiskEventForSample(currentSample);

  return (
    <div className="rounded-2xl border border-[#FCA5A5] bg-white p-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#DC2626] text-white shrink-0">
            <AlertTriangle size={18} />
          </div>
          <div>
            <div className="text-sm font-semibold text-[#991B1B]">{event.name}</div>
            <div className="mt-1 text-xs leading-5 text-[#7F1D1D]">{event.summary}</div>
          </div>
        </div>
        <Badge className="w-fit bg-white text-[#B91C1C] border border-[#FECACA] text-[11px] shrink-0">
          触发: {event.triggeredAt}
        </Badge>
      </div>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
        {[
          ['回款周期', event.impact.receivableCycle],
          ['履约延迟', event.impact.fulfillmentDelay],
          ['敞口调整', event.impact.exposureAdjustment],
        ].map(([label, value]) => (
          <div key={label} className="rounded-xl border border-[#FECACA] bg-white p-3">
            <div className="text-[10px] text-[#94A3B8]">{label}</div>
            <div className="mt-1 text-sm font-semibold text-[#DC2626]">{value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
