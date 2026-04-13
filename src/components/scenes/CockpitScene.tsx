import React from 'react';
import SceneLayout from '../SceneLayout';
import { SCENES } from '../../constants';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bell,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  Crosshair,
  DatabaseZap,
  Eye,
  FileCheck2,
  Gauge,
  History,
  Layers,
  PlusCircle,
  Search,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';
import { SampleSwitcher, StatusPill, SceneQuestion, MetricCard, WorkbenchPanel, MiniTrend, FlowRow } from '../ProductPrimitives';
import { useDemo, STAGE_ORDER } from '../../demo/DemoContext';
import { ActionBar } from '../../demo/DemoComponents';
import { CHAIN_LOAN_STAGE_LABELS, SAMPLES } from '../../demo/chainLoan/data';
import { MiniAreaChart, DonutChart, TrendLineChart, DistributionBarChart, CHART_COLORS } from '../Charts';
import { cn } from '@/lib/utils';
import type { SceneId } from '../../types';

/* ══════════════════════════════════════════════════════════════════
   Helpers
   ══════════════════════════════════════════════════════════════════ */

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 6) return '夜深了';
  if (h < 12) return '早安';
  if (h < 14) return '午安';
  if (h < 18) return '下午好';
  return '晚上好';
}

/* ══════════════════════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════════════════════ */

interface Props { activeModule: string; onModuleChange: (id: string) => void }

export default function CockpitScene({ activeModule, onModuleChange }: Props) {
  const scene = SCENES.find(s => s.id === 'cockpit')!;
  const { active, stageIndex, riskSimulated, recoveryComplete, navigate, currentSample, selectSample, selectedSampleId } = useDemo();

  const reviewCount = SAMPLES.filter(s => s.stage === 'manual_review').length;
  const riskCount = SAMPLES.filter(s => s.riskFlags.length >= 2).length;
  const recoveryCount = SAMPLES.filter(s => s.stage === 'recovery').length;
  const followUpCount = SAMPLES.filter(s => s.segmentTag === 'C待观察' || s.stage === 'pre_credit').length;
  const aiSuggestionCount = SAMPLES.filter(s => s.agentHints.confidence > 0).length;
  const activeSamples = SAMPLES.filter(s => ['approved', 'risk_alert', 'recovery'].includes(s.stage)).length;

  const currentStageLabel = active ? CHAIN_LOAN_STAGE_LABELS[STAGE_ORDER[stageIndex]] || '未启动' : '未启动';
  const riskState: 'normal' | 'watch' | 'risk' = riskSimulated && !recoveryComplete ? 'risk' : riskSimulated && recoveryComplete ? 'watch' : 'normal';
  const riskLabel = riskState === 'risk' ? '中度预警' : riskState === 'watch' ? '恢复观察' : '正常';

  const judgment = (() => {
    if (!active) return '演示未启动，点击策略与配置开始';
    if (recoveryComplete) return `恢复条件已满足，额度已回升至 ${currentSample.recommendedLimit}，进入常规监控`;
    if (riskSimulated) return `${currentSample.riskFlags.slice(0, 2).join('、') || '经营波动'}，已收缩额度至 ${currentSample.currentLimit}，观察中`;
    if (stageIndex >= STAGE_ORDER.indexOf('approved')) return `授信已批准 ${currentSample.recommendedLimit}，经营闭环正常运行`;
    if (stageIndex >= STAGE_ORDER.indexOf('manual_review')) return `证据覆盖 ${currentSample.evidenceCoverage}%，等待人工批准`;
    if (stageIndex >= STAGE_ORDER.indexOf('pre_credit')) return '已形成订单-物流-回款闭环，可进入补审';
    if (stageIndex >= STAGE_ORDER.indexOf('identified')) return '内部数据识别出候选关系，待生成预授信';
    return '产业链生态已接入，待启动客群识别';
  })();

  const nextActions: { label: string; target: SceneId }[] = (() => {
    if (!active) return [{ label: '开始演示', target: 'partner-management' as SceneId }];
    if (recoveryComplete) return [{ label: '查看贷后经营', target: 'post-loan' as SceneId }, { label: '查看客群池', target: 'customer-pool' as SceneId }];
    if (riskSimulated) return [{ label: '查看贷后恢复', target: 'post-loan' as SceneId }, { label: '查看风险监控', target: 'risk-monitor' as SceneId }];
    if (stageIndex >= STAGE_ORDER.indexOf('approved')) return [{ label: '进入风险监控', target: 'risk-monitor' as SceneId }, { label: '查看资产池', target: 'asset-pool' as SceneId }];
    if (stageIndex >= STAGE_ORDER.indexOf('manual_review')) return [{ label: '进入补审', target: 'product-approval' as SceneId }];
    if (stageIndex >= STAGE_ORDER.indexOf('pre_credit')) return [{ label: '进入资产池', target: 'asset-pool' as SceneId }];
    if (stageIndex >= STAGE_ORDER.indexOf('identified')) return [{ label: '查看客群池', target: 'customer-pool' as SceneId }];
    return [{ label: '进入策略与配置', target: 'partner-management' as SceneId }];
  })();

  /* ── Computed tasks ── */
  const tasks = React.useMemo(() => {
    const high: { label: string; source: string; target: SceneId; type: string }[] = [];
    const normal: { label: string; source: string; target: SceneId; type: string }[] = [];
    const followUp: { label: string; source: string; target: SceneId; type: string }[] = [];

    const reviewSamples = SAMPLES.filter(s => s.stage === 'manual_review');
    const recoverySamples = SAMPLES.filter(s => s.stage === 'recovery');
    const riskSamples = SAMPLES.filter(s => s.riskFlags.length >= 2);
    const preSamples = SAMPLES.filter(s => s.stage === 'pre_credit');
    const observeSamples = SAMPLES.filter(s => s.segmentTag === 'C待观察');

    if (reviewSamples.length > 0) high.push({ label: `${reviewSamples.map(s => s.shortName).join('、')} — 补审待批准`, source: '规则引擎', target: 'product-approval' as SceneId, type: 'review' });
    if (recoverySamples.length > 0) high.push({ label: `${recoverySamples.map(s => s.shortName).join('、')} — 风险恢复跟进`, source: '预警引擎', target: 'post-loan' as SceneId, type: 'recovery' });
    if (riskSamples.length > 0) normal.push({ label: `${riskSamples.map(s => s.shortName).join('、')} — 风险复查`, source: '预警引擎', target: 'risk-monitor' as SceneId, type: 'risk' });
    if (preSamples.length > 0) normal.push({ label: `${preSamples.map(s => s.shortName).join('、')} — 产品匹配`, source: '识别引擎', target: 'asset-pool' as SceneId, type: 'match' });
    if (observeSamples.length > 0) followUp.push({ label: `${observeSamples.map(s => s.shortName).join('、')} — 持续观察`, source: '系统', target: 'customer-pool' as SceneId, type: 'observe' });

    return { high, normal, followUp };
  }, []);

  const highStrengthReview = SAMPLES.filter(s => s.stage === 'manual_review' && s.relationStrength > 80).length;
  const receivableRiskCount = SAMPLES.filter(s => s.riskFlags.some(f => f.includes('回款'))).length;

  /* ── Task Row (shared) ── */
  const TaskRow = ({ label, source, target, type }: { label: string; source: string; target: SceneId; type?: string }) => {
    const dotColor = type === 'review' ? 'bg-[#F59E0B]' : type === 'recovery' || type === 'risk' ? 'bg-[#DC2626]' : type === 'match' ? 'bg-[#2563EB]' : 'bg-[#94A3B8]';
    return (
      <button className="w-full flex items-center gap-3 px-3.5 py-2.5 hover:bg-[#F8FAFC] transition-colors text-left rounded-md" onClick={() => navigate(target)}>
        <div className={cn('w-2 h-2 rounded-full shrink-0', dotColor)} />
        <div className="flex-1 min-w-0">
          <div className="text-[12px] text-[#0F172A] truncate">{label}</div>
          <div className="text-[10px] text-[#94A3B8] mt-0.5">{source}</div>
        </div>
        <ChevronRight size={12} className="text-[#CBD5E1] shrink-0" />
      </button>
    );
  };

  const renderContent = () => {
    switch (activeModule) {

      /* ════════════════════════════════════════════════════════════════════
         PAGE 1: 工作台（DEFAULT — 入口仪表盘）
         ════════════════════════════════════════════════════════════════════ */
      case 'overview':
      default:
        return (
          <div className="space-y-5">
            {/* Greeting */}
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-xl font-semibold text-[#0F172A] tracking-tight">{getGreeting()}，王敏</h1>
                <p className="mt-1 text-[13px] text-[#64748B]">这是您今日需要优先处理的业务、客户与建议。</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="ghost" size="sm" className="h-8 text-[12px] text-[#64748B] gap-1.5"><History size={13} /> 历史记录</Button>
                <Button variant="outline" size="sm" className="h-8 text-[12px] gap-1.5 border-[#E2E8F0] text-[#334155]"><PlusCircle size={13} /> 新建场景</Button>
              </div>
            </div>

            {/* Quick stat strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2.5">
              {[
                { label: '待补审', value: reviewCount, color: 'text-[#DC2626]', chartColor: CHART_COLORS.red, icon: FileCheck2, trend: [3,2,4,1,2,1,reviewCount] },
                { label: '新增预警', value: riskCount, color: 'text-[#EA580C]', chartColor: CHART_COLORS.amber, icon: ShieldAlert, trend: [1,0,2,1,0,1,riskCount] },
                { label: '恢复观察', value: recoveryCount, color: 'text-[#475569]', chartColor: CHART_COLORS.slate, icon: Eye, trend: [2,3,2,1,1,1,recoveryCount] },
                { label: '待跟进客户', value: followUpCount, color: 'text-[#2563EB]', chartColor: CHART_COLORS.blue, icon: Users, trend: [4,3,5,4,3,2,followUpCount] },
                { label: 'AI 待确认建议', value: aiSuggestionCount, color: 'text-[#7C3AED]', chartColor: CHART_COLORS.violet, icon: Sparkles, trend: [3,5,4,6,5,4,aiSuggestionCount] },
              ].map(m => (
                <div key={m.label} className="rounded-xl border border-border bg-card px-3.5 py-3 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-wider"><m.icon size={11} />{m.label}</div>
                  <div className="mt-1 flex items-end justify-between gap-2">
                    <span className={cn('text-2xl font-bold leading-none', m.value > 0 ? m.color : 'text-muted-foreground/40')}>{m.value}</span>
                    <div className="w-16 shrink-0 opacity-70"><MiniAreaChart data={m.trend.map((v, i) => ({ name: `d${i}`, value: v }))} color={m.chartColor} height={28} /></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tasks + Key Customer */}
            <div className="grid grid-cols-1 xl:grid-cols-[3fr_2fr] gap-4">
              {/* Tasks */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
                <div className="px-4 py-3 border-b border-[#F1F5F9] flex items-center justify-between">
                  <div className="flex items-center gap-2"><Clock size={13} className="text-[#64748B]" /><span className="text-[13px] font-semibold text-[#0F172A]">今日任务</span></div>
                  <button onClick={() => onModuleChange('todo')} className="text-[10px] text-[#2563EB] hover:underline">查看全部</button>
                </div>
                <div className="divide-y divide-[#F1F5F9]">
                  {tasks.high.length > 0 && <div className="px-1.5 py-1.5"><div className="px-3 pt-1.5 pb-1 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" /><span className="text-[10px] font-semibold text-[#DC2626] uppercase tracking-wider">高优先级</span></div>{tasks.high.map(t => <TaskRow key={t.label} {...t} />)}</div>}
                  {tasks.normal.length > 0 && <div className="px-1.5 py-1.5"><div className="px-3 pt-1.5 pb-1 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" /><span className="text-[10px] font-semibold text-[#92400E] uppercase tracking-wider">普通任务</span></div>{tasks.normal.map(t => <TaskRow key={t.label} {...t} />)}</div>}
                  {tasks.followUp.length > 0 && <div className="px-1.5 py-1.5"><div className="px-3 pt-1.5 pb-1 flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-[#94A3B8]" /><span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">我的跟进</span></div>{tasks.followUp.map(t => <TaskRow key={t.label} {...t} />)}</div>}
                  {tasks.high.length === 0 && tasks.normal.length === 0 && tasks.followUp.length === 0 && <div className="px-4 py-8 text-center text-[13px] text-[#94A3B8]">暂无待办任务</div>}
                </div>
              </div>

              {/* Current Key Customer */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
                <div className="px-4 py-3 border-b border-[#F1F5F9] flex items-center justify-between">
                  <div className="flex items-center gap-2"><Crosshair size={13} className="text-[#2563EB]" /><span className="text-[13px] font-semibold text-[#0F172A]">当前重点客户</span></div>
                  <SampleSwitcher selectedId={selectedSampleId} onSelect={selectSample} compact />
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D6E4FF] bg-[#EFF6FF] text-[#2563EB]"><Building2 size={16} /></div>
                    <div className="flex-1 min-w-0"><div className="text-sm font-semibold text-[#0F172A] truncate">{currentSample.shortName}</div><div className="text-[10px] text-[#94A3B8]">{currentSample.roleInChain}</div></div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: '当前阶段', value: currentStageLabel },
                      { label: '审批状态', value: currentSample.approvalStatus },
                      { label: '风险状态', value: riskLabel, isRisk: true },
                      { label: '拟授信额度', value: riskSimulated && !recoveryComplete ? currentSample.currentLimit : currentSample.recommendedLimit },
                    ].map(cell => (
                      <div key={cell.label} className="rounded-md bg-[#F8FAFC] border border-[#F1F5F9] px-2.5 py-2">
                        <div className="text-[10px] text-[#94A3B8]">{cell.label}</div>
                        <div className="mt-0.5 text-xs font-semibold text-[#0F172A]">{cell.isRisk ? <StatusPill state={riskState} label={riskLabel} /> : cell.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-md border border-[#E2E8F0] bg-[#FAFBFF] px-3 py-2.5">
                    <div className="text-[10px] text-[#94A3B8] mb-0.5">当前判断</div>
                    <div className="text-xs leading-5 text-[#334155]">{judgment}</div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {nextActions.map(a => (
                      <Button key={a.label} variant="outline" size="sm" className="h-7 text-[11px] gap-1 border-[#E2E8F0] text-[#334155] hover:border-[#BFDBFE] hover:text-[#2563EB]" onClick={() => navigate(a.target)}>{a.label}<ArrowRight size={10} /></Button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* AI insight strip */}
            <div className="flex items-center gap-3 rounded-lg border border-[#D6E4FF] bg-[#FAFBFF] px-4 py-2.5">
              <div className="flex items-center justify-center w-5 h-5 rounded bg-[#2563EB] shrink-0"><Sparkles size={10} className="text-white" /></div>
              <p className="flex-1 text-xs leading-5 text-[#334155]">
                <span className="font-medium text-[#2563EB]">今日建议：</span>
                {highStrengthReview > 0 ? `补审队列中 ${highStrengthReview} 户关系强度 > 80%，建议优先处理。` : ''}
                {receivableRiskCount > 0 ? ` ${riskCount} 笔预警中回款延迟类 ${receivableRiskCount} 笔占比最高。` : ` ${SAMPLES.length} 个样本经营状态总体稳定。`}
              </p>
              <Button variant="ghost" size="sm" className="h-7 text-[11px] text-[#2563EB] hover:bg-[#EFF6FF] shrink-0" onClick={() => navigate('customer-pool')}>查看<ArrowRight size={10} className="ml-0.5" /></Button>
            </div>

            {/* Quick entries + Donut */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_240px] gap-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { label: '候选资产池', target: 'customer-pool' as SceneId, icon: <Search size={14} />, stat: `候选 ${SAMPLES.length} 户` },
                  { label: '补审作业', target: 'product-approval' as SceneId, icon: <FileCheck2 size={14} />, stat: `待审 ${reviewCount} 户` },
                  { label: '风险监控', target: 'risk-monitor' as SceneId, icon: <ShieldAlert size={14} />, stat: `预警 ${riskCount} 笔` },
                  { label: '贷后经营', target: 'post-loan' as SceneId, icon: <Activity size={14} />, stat: `恢复 ${recoveryCount} 户` },
                  { label: '授信资产池', target: 'asset-pool' as SceneId, icon: <BarChart3 size={14} />, stat: `在营 ${activeSamples} 户` },
                  { label: '策略与配置', target: 'partner-management' as SceneId, icon: <DatabaseZap size={14} />, stat: `${new Set(SAMPLES.map(s => s.chainName)).size} 条链` },
                ].map(e => (
                  <button key={e.label} className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-3.5 py-3 hover:border-primary/30 hover:shadow-md transition-all text-left group" onClick={() => navigate(e.target)}>
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-muted/50 text-muted-foreground group-hover:border-primary/30 group-hover:text-primary group-hover:bg-primary/5 transition-colors shrink-0">{e.icon}</div>
                    <div className="min-w-0 flex-1"><div className="text-[12px] font-semibold text-foreground group-hover:text-primary transition-colors truncate">{e.label}</div><div className="text-[10px] text-muted-foreground">{e.stat}</div></div>
                  </button>
                ))}
              </div>
              <div className="rounded-xl border border-border bg-card p-3 shadow-sm">
                <div className="text-[11px] font-medium text-muted-foreground mb-1">样本分布</div>
                <DonutChart
                  data={[
                    { name: 'A可授信', value: SAMPLES.filter(s => s.segmentTag === 'A可授信').length, color: CHART_COLORS.emerald },
                    { name: 'B可做需处理', value: SAMPLES.filter(s => s.segmentTag === 'B可做但需处理').length, color: CHART_COLORS.blue },
                    { name: 'C待观察', value: SAMPLES.filter(s => s.segmentTag === 'C待观察').length, color: CHART_COLORS.amber },
                    { name: 'D风险中', value: SAMPLES.filter(s => s.segmentTag === 'D风险经营中').length, color: CHART_COLORS.red },
                  ]}
                  height={140} innerRadius={36} outerRadius={56} centerLabel="总样本" centerValue={`${SAMPLES.length}`}
                />
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 justify-center">
                  {[{ label: 'A可授信', color: CHART_COLORS.emerald }, { label: 'B需处理', color: CHART_COLORS.blue }, { label: 'C待观察', color: CHART_COLORS.amber }, { label: 'D风险中', color: CHART_COLORS.red }].map(l => (
                    <span key={l.label} className="flex items-center gap-1 text-[9px] text-muted-foreground"><span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: l.color }} />{l.label}</span>
                  ))}
                </div>
              </div>
            </div>

            {active && <ActionBar />}
          </div>
        );

      /* ════════════════════════════════════════════════════════════════════
         PAGE 2: 待办任务
         ════════════════════════════════════════════════════════════════════ */
      case 'todo': {
        const todoItems = [
          { id: 't-01', type: '补审' as const, label: `${SAMPLES.filter(s => s.stage === 'manual_review').map(s => s.shortName).join('、') || '—'} — 补审待批准`, count: reviewCount, icon: FileCheck2, color: 'amber', target: 'product-approval' as SceneId, priority: '高' },
          { id: 't-02', type: '逾期' as const, label: '逾期 15 天以上企业需催收', count: SAMPLES.filter(s => s.riskFlags.some(f => f.includes('回款'))).length, icon: AlertTriangle, color: 'red', target: 'risk-monitor' as SceneId, priority: '高' },
          { id: 't-03', type: '审批' as const, label: '待审批贷款申请', count: reviewCount + SAMPLES.filter(s => s.stage === 'pre_credit').length, icon: CheckCircle2, color: 'blue', target: 'product-approval' as SceneId, priority: '中' },
          { id: 't-04', type: '新增' as const, label: '今日新增候选企业待跟进', count: SAMPLES.filter(s => s.segmentTag === 'C待观察' || s.stage === 'identified').length, icon: Users, color: 'green', target: 'customer-pool' as SceneId, priority: '普通' },
          { id: 't-05', type: '恢复' as const, label: `${SAMPLES.filter(s => s.stage === 'recovery').map(s => s.shortName).join('、') || '—'} — 恢复跟进`, count: recoveryCount, icon: Activity, color: 'slate', target: 'post-loan' as SceneId, priority: '普通' },
        ];
        const colorMap: Record<string, { dot: string; bg: string; text: string; border: string }> = {
          amber: { dot: 'bg-[#F59E0B]', bg: 'bg-[#FFFBEB]', text: 'text-[#92400E]', border: 'border-[#FDE68A]' },
          red: { dot: 'bg-[#DC2626]', bg: 'bg-[#FEF2F2]', text: 'text-[#DC2626]', border: 'border-[#FCA5A5]' },
          blue: { dot: 'bg-[#2563EB]', bg: 'bg-[#EFF6FF]', text: 'text-[#2563EB]', border: 'border-[#BFDBFE]' },
          green: { dot: 'bg-[#16A34A]', bg: 'bg-[#F0FDF4]', text: 'text-[#047857]', border: 'border-[#BBF7D0]' },
          slate: { dot: 'bg-[#64748B]', bg: 'bg-[#F8FAFC]', text: 'text-[#475569]', border: 'border-[#E2E8F0]' },
        };

        return (
          <div className="space-y-4">
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock size={14} className="text-[#2563EB]" />
                <span className="text-[13px] font-semibold text-[#0F172A]">待办任务</span>
                <span className="text-[11px] text-[#94A3B8]">{new Date().toLocaleDateString('zh-CN')} · 共 {todoItems.reduce((s, t) => s + t.count, 0)} 项</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricCard label="补审队列" value={`${reviewCount} 个`} detail="待处理" icon={FileCheck2} tone="amber" />
              <MetricCard label="逾期资产" value={`${SAMPLES.filter(s => s.riskFlags.some(f => f.includes('回款'))).length} 户`} detail="需催收" icon={AlertTriangle} tone="red" />
              <MetricCard label="审批任务" value={`${reviewCount + SAMPLES.filter(s => s.stage === 'pre_credit').length} 笔`} detail="待审批" icon={CheckCircle2} tone="blue" />
              <MetricCard label="新增客户" value={`${SAMPLES.filter(s => s.segmentTag === 'C待观察' || s.stage === 'identified').length} 家`} detail="待跟进" icon={Users} tone="green" />
            </div>

            <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
              <div className="grid grid-cols-[40px_60px_1fr_60px_60px_100px] gap-0 px-4 py-2.5 border-b border-[#E2E8F0] bg-[#F8FAFC] text-[10px] font-medium text-[#94A3B8] uppercase tracking-wider">
                <div></div><div>类型</div><div>任务内容</div><div>数量</div><div>优先级</div><div>操作</div>
              </div>
              {todoItems.map(t => {
                const c = colorMap[t.color];
                const Icon = t.icon;
                return (
                  <div key={t.id} className="grid grid-cols-[40px_60px_1fr_60px_60px_100px] gap-0 px-4 py-3 border-b border-[#F1F5F9] last:border-b-0 items-center hover:bg-[#FAFBFF] transition-colors">
                    <div className={cn('w-3 h-3 rounded-full', c.dot)} />
                    <Badge className={cn('text-[9px] border w-fit', c.bg, c.text, c.border)}><Icon size={9} className="mr-0.5" />{t.type}</Badge>
                    <div className="text-[12px] text-[#0F172A] pr-2 truncate">{t.label}</div>
                    <div className="text-[13px] font-bold text-[#0F172A]">{t.count}</div>
                    <Badge className={cn('text-[9px] border w-fit', t.priority === '高' ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]' : t.priority === '中' ? 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]' : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]')}>{t.priority}</Badge>
                    <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1 text-[#2563EB] border-[#BFDBFE]" onClick={() => navigate(t.target)}>立即处理 <ArrowRight size={9} /></Button>
                  </div>
                );
              })}
            </div>

            {active && <ActionBar />}
          </div>
        );
      }

      /* ════════════════════════════════════════════════════════════════════
         PAGE 3: 风险预警
         ════════════════════════════════════════════════════════════════════ */
      case 'risk-alert': {
        const riskSamples = SAMPLES.filter(s => s.riskFlags.length >= 2);
        const newAlertCount = riskSamples.length;
        const disposalCount = riskSamples.length + recoveryCount;

        return (
          <div className="space-y-4">
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldAlert size={14} className="text-[#DC2626]" />
                <span className="text-[13px] font-semibold text-[#0F172A]">风险预警</span>
                <span className="text-[11px] text-[#94A3B8]">当日风险状况</span>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 text-[#2563EB] border-[#BFDBFE]" onClick={() => navigate('risk-monitor')}>进入风险监控 <ArrowRight size={9} /></Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <MetricCard label="预警总览（当日新增）" value={`${newAlertCount} 个`} detail="新增风险预警" icon={Bell} tone="red" />
              <MetricCard label="风险资产（当日新增）" value={`${riskSamples.length} 户`} detail="风险企业" icon={ShieldAlert} tone="amber" />
              <MetricCard label="处置动作（待执行）" value={`${disposalCount} 个`} detail="催收/处置任务" icon={AlertTriangle} tone="amber" />
            </div>

            {/* Risk detail list */}
            <WorkbenchPanel title="风险预警明细" badge={<Badge className="bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5] text-[9px]">{newAlertCount} 条活跃预警</Badge>}>
              <div className="space-y-2">
                {riskSamples.length > 0 ? riskSamples.map(s => (
                  <button key={s.id} className="w-full text-left rounded-lg border border-[#FCA5A5] bg-[#FEF2F2] px-4 py-3 hover:bg-[#FEE2E2] transition-colors" onClick={() => navigate('risk-monitor')}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[12px] font-semibold text-[#0F172A]">{s.shortName}</span>
                      <Badge className="bg-[#DC2626] text-white border-transparent text-[9px]">风险</Badge>
                    </div>
                    <div className="text-[10px] text-[#64748B]">风险信号：{s.riskFlags.join('、')}</div>
                    <div className="text-[10px] text-[#94A3B8] mt-1">回款周期 {s.avgReceivableCycle} · {s.accountFlowStatus}</div>
                  </button>
                )) : (
                  <div className="text-center py-6 text-[#94A3B8] text-xs">当日暂无新增风险预警</div>
                )}
              </div>
            </WorkbenchPanel>

            {/* Quick links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { label: '预警总览', desc: '查看全部风险概览', target: 'risk-monitor' as SceneId, module: 'warning' },
                { label: '处置动作', desc: '执行催收与处置任务', target: 'risk-monitor' as SceneId, module: 'actions' },
                { label: '规则效果', desc: '分析规则触发与准确率', target: 'risk-monitor' as SceneId, module: 'quality' },
              ].map(e => (
                <button key={e.label} className="rounded-lg border border-[#E2E8F0] bg-white p-4 text-left hover:bg-[#FAFBFF] hover:border-[#BFDBFE] transition-colors" onClick={() => navigate(e.target, e.module)}>
                  <div className="text-[12px] font-semibold text-[#0F172A]">{e.label}</div>
                  <div className="text-[10px] text-[#94A3B8] mt-1">{e.desc}</div>
                  <div className="mt-2 text-[10px] text-[#2563EB] flex items-center gap-1">进入 <ArrowRight size={9} /></div>
                </button>
              ))}
            </div>

            {active && <ActionBar />}
          </div>
        );
      }

      /* ════════════════════════════════════════════════════════════════════
         PAGE 4: 数据概览
         ════════════════════════════════════════════════════════════════════ */
      case 'data-overview':
        return (
          <div className="space-y-4">
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Gauge size={14} className="text-[#2563EB]" />
                <span className="text-[13px] font-semibold text-[#0F172A]">数据概览</span>
                <span className="text-[11px] text-[#94A3B8]">当日关键业务数据</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricCard label="还款率" value="95.2%" detail="-0.1% 较上期" tone="green" />
              <MetricCard label="客户活跃度" value="78%" detail="+2% 较上期" tone="amber" />
              <MetricCard label="转化率" value="26.1%" detail="候选→预授信" tone="blue" />
              <MetricCard label="规则触发次数" value="70 次" detail="当日累计" tone="slate" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-[13px] font-semibold text-[#0F172A]">还款率趋势（近 90 天）</div>
                  <button onClick={() => navigate('post-loan', 'operations')} className="text-[10px] text-[#2563EB] hover:underline flex items-center gap-1">进入贷后总览 <ArrowRight size={9} /></button>
                </div>
                <TrendLineChart
                  data={[
                    { name: '1月', actual: 95.8, target: 95 },
                    { name: '2月', actual: 95.5, target: 95 },
                    { name: '3月', actual: 95.1, target: 95 },
                    { name: '4月上', actual: 95.2, target: 95 },
                  ]}
                  lines={[
                    { key: 'actual', color: CHART_COLORS.emerald, label: '还款率 (%)' },
                    { key: 'target', color: CHART_COLORS.amber, label: '目标线', dashed: true },
                  ]}
                  height={180}
                />
              </div>

              <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-[13px] font-semibold text-[#0F172A]">转化漏斗</div>
                  <button onClick={() => navigate('asset-pool', 'funnel')} className="text-[10px] text-[#2563EB] hover:underline flex items-center gap-1">进入转化看板 <ArrowRight size={9} /></button>
                </div>
                <div className="space-y-3">
                  {[
                    { stage: '候选池', value: `${SAMPLES.length} 户`, pct: 100, desc: '全部候选企业' },
                    { stage: '预授信', value: `${SAMPLES.filter(s => s.stage !== 'identified').length} 户`, pct: 80, desc: '通过初筛' },
                    { stage: '补审通过', value: `${SAMPLES.filter(s => ['approved', 'risk_alert', 'recovery'].includes(s.stage)).length} 户`, pct: 60, desc: '审批完成' },
                    { stage: '在营', value: `${activeSamples} 户`, pct: 40, desc: '已放款经营' },
                  ].map(f => (
                    <div key={f.stage}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2"><span className="text-[11px] font-medium text-[#0F172A]">{f.stage}</span><span className="text-[10px] text-[#64748B]">{f.value}</span></div>
                        <span className="text-[11px] font-semibold text-[#2563EB]">{f.pct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-[#F1F5F9] overflow-hidden"><div className="h-full rounded-full bg-[#60A5FA] transition-all" style={{ width: `${f.pct}%` }} /></div>
                      <div className="mt-0.5 text-[10px] text-[#94A3B8]">{f.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Rule effectiveness */}
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-[13px] font-semibold text-[#0F172A]">规则效果速览（当日触发）</div>
                <button onClick={() => navigate('risk-monitor', 'quality')} className="text-[10px] text-[#2563EB] hover:underline flex items-center gap-1">进入规则效果 <ArrowRight size={9} /></button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3"><div className="text-[10px] text-[#94A3B8]">总触发次数</div><div className="mt-0.5 text-lg font-bold text-[#0F172A]">70</div></div>
                <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3"><div className="text-[10px] text-[#94A3B8]">平均转化率</div><div className="mt-0.5 text-lg font-bold text-[#0F172A]">50%</div></div>
                <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3"><div className="text-[10px] text-[#94A3B8]">平均准确率</div><div className="mt-0.5 text-lg font-bold text-[#0F172A]">72%</div></div>
                <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3"><div className="text-[10px] text-[#94A3B8]">有效规则数</div><div className="mt-0.5 text-lg font-bold text-[#0F172A]">6</div></div>
              </div>
              <DistributionBarChart
                data={[
                  { name: '逾期规则', value: 18, color: CHART_COLORS.red },
                  { name: '回款规则', value: 15, color: CHART_COLORS.amber },
                  { name: '流水规则', value: 12, color: CHART_COLORS.blue },
                  { name: '关系规则', value: 10, color: CHART_COLORS.emerald },
                  { name: '集中度规则', value: 8, color: CHART_COLORS.violet },
                  { name: '其他', value: 7, color: CHART_COLORS.slate },
                ]}
                height={160}
              />
            </div>

            {/* Quick links */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { label: '贷后总览', desc: '还款率、客户活跃度、增收贡献', target: 'post-loan' as SceneId, module: 'operations' },
                { label: '转化看板', desc: '候选→预授信→在营转化', target: 'asset-pool' as SceneId, module: 'funnel' },
                { label: '规则效果', desc: '规则触发次数、转化率、准确率', target: 'risk-monitor' as SceneId, module: 'quality' },
              ].map(e => (
                <button key={e.label} className="rounded-lg border border-[#E2E8F0] bg-white p-4 text-left hover:bg-[#FAFBFF] hover:border-[#BFDBFE] transition-colors" onClick={() => navigate(e.target, e.module)}>
                  <div className="text-[12px] font-semibold text-[#0F172A]">{e.label}</div>
                  <div className="text-[10px] text-[#94A3B8] mt-1">{e.desc}</div>
                  <div className="mt-2 text-[10px] text-[#2563EB] flex items-center gap-1">进入 <ArrowRight size={9} /></div>
                </button>
              ))}
            </div>

            {active && <ActionBar />}
          </div>
        );
    }
  };

  return (
    <SceneLayout title={scene.title} modules={scene.modules} activeModule={activeModule} onModuleChange={onModuleChange}>
      {renderContent()}
    </SceneLayout>
  );
}
