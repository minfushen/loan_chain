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
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  Crosshair,
  DatabaseZap,
  Eye,
  FileCheck2,
  History,
  Inbox,
  Layers,
  PlusCircle,
  Search,
  ShieldAlert,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';
import { SampleSwitcher, StatusPill, MetricCard, WorkbenchPanel } from '../ProductPrimitives';
import { useDemo, STAGE_ORDER } from '../../demo/DemoContext';
import { ActionBar } from '../../demo/DemoComponents';
import { CHAIN_LOAN_STAGE_LABELS, SAMPLES, type ChainLoanSample } from '../../demo/chainLoan/data';
import { MiniAreaChart, DonutChart, CHART_COLORS } from '../Charts';
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

const COCKPIT_NOTIFICATIONS: { id: string; category: string; title: string; time: string }[] = [
  { id: 'cn-1', category: '审批', title: '「衡远包装」补审材料已齐备，请于今日内核验', time: '09:42' },
  { id: 'cn-2', category: 'AI', title: '预授信引擎完成对「佳利包装」线索的复评结论已生成', time: '08:58' },
  { id: 'cn-3', category: '预警', title: '智能监控：回款类规则触发 2 条，已同步至任务中心', time: '昨天 18:20' },
  { id: 'cn-4', category: '系统', title: '演示案例阶段已推进至「人工补审」', time: '昨天 11:05' },
  { id: 'cn-5', category: '恢复', title: '「宇通供应链」满足恢复条件，额度调整待您确认', time: '周一 16:30' },
];

function CockpitFocusCustomerRow({ sample, badge, onRowClick }: { sample: ChainLoanSample; badge?: string; onRowClick: () => void }) {
  return (
    <button
      type="button"
      className="w-full flex items-center gap-3 rounded-lg border border-[#F1F5F9] bg-[#FAFBFF]/50 px-3 py-2.5 text-left hover:border-[#BFDBFE] transition-colors"
      onClick={onRowClick}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D6E4FF] bg-[#EFF6FF] text-[#2563EB] shrink-0">
        <Building2 size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold text-[#0F172A] truncate">{sample.shortName}</span>
          {badge ? <Badge className="text-[8px] px-1.5 py-0 border-[#E9D5FF] bg-[#FAF5FF] text-[#7C3AED]">{badge}</Badge> : null}
        </div>
        <div className="text-[10px] text-[#94A3B8] truncate">{sample.roleInChain}</div>
      </div>
      <StatusPill state={sample.riskStatus === '正常' ? 'normal' : sample.riskStatus === '观察' ? 'watch' : 'risk'} label={sample.riskStatus} />
      <ChevronRight size={12} className="text-[#CBD5E1] shrink-0" />
    </button>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════════════════════ */

interface Props { activeModule: string; onModuleChange: (id: string) => void }

type TaskSourceTag = '补审' | '预警' | '催收' | '审批' | '跟进' | '恢复';

export default function CockpitScene({ activeModule, onModuleChange }: Props) {
  const scene = SCENES.find(s => s.id === 'cockpit')!;
  const { active, stageIndex, riskSimulated, recoveryComplete, navigate, currentSample, selectSample, selectedSampleId } = useDemo();

  const [taskTagFilter, setTaskTagFilter] = React.useState<'全部' | TaskSourceTag>('全部');
  const [readNotificationIds, setReadNotificationIds] = React.useState<Set<string>>(() => new Set());

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
    if (!active) return '尚未启动案例，点击策略与配置开始';
    if (recoveryComplete) return `恢复条件已满足，额度已回升至 ${currentSample.recommendedLimit}，进入常规监控`;
    if (riskSimulated) return `${currentSample.riskFlags.slice(0, 2).join('、') || '经营波动'}，已收缩额度至 ${currentSample.currentLimit}，观察中`;
    if (stageIndex >= STAGE_ORDER.indexOf('approved')) return `授信已批准 ${currentSample.recommendedLimit}，经营闭环正常运行`;
    if (stageIndex >= STAGE_ORDER.indexOf('manual_review')) return `证据覆盖 ${currentSample.evidenceCoverage}%，等待人工批准`;
    if (stageIndex >= STAGE_ORDER.indexOf('pre_credit')) return '已形成订单-物流-回款闭环，可进入补审';
    if (stageIndex >= STAGE_ORDER.indexOf('identified')) return '内部数据识别出候选关系，待生成预授信';
    return '产业链生态已接入，待启动客群识别';
  })();

  const nextActions: { label: string; target: SceneId }[] = (() => {
    if (!active) return [{ label: '开始演示', target: 'strategy-config' as SceneId }];
    if (recoveryComplete) return [{ label: '查看智能经营', target: 'smart-operation' as SceneId }, { label: '查看智能识别', target: 'smart-identify' as SceneId }];
    if (riskSimulated) return [{ label: '查看恢复经营', target: 'smart-operation' as SceneId }, { label: '查看智能监控', target: 'smart-monitor' as SceneId }];
    if (stageIndex >= STAGE_ORDER.indexOf('approved')) return [{ label: '进入智能监控', target: 'smart-monitor' as SceneId }, { label: '查看资产池', target: 'asset-pool' as SceneId }];
    if (stageIndex >= STAGE_ORDER.indexOf('manual_review')) return [{ label: '进入补审', target: 'smart-approval' as SceneId }];
    if (stageIndex >= STAGE_ORDER.indexOf('pre_credit')) return [{ label: '进入资产池', target: 'asset-pool' as SceneId }];
    if (stageIndex >= STAGE_ORDER.indexOf('identified')) return [{ label: '查看智能识别', target: 'smart-identify' as SceneId }];
    return [{ label: '进入策略与配置', target: 'strategy-config' as SceneId }];
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

    if (reviewSamples.length > 0) high.push({ label: `${reviewSamples.map(s => s.shortName).join('、')} — 补审待批准`, source: '规则引擎', target: 'smart-approval' as SceneId, type: 'review' });
    if (recoverySamples.length > 0) high.push({ label: `${recoverySamples.map(s => s.shortName).join('、')} — 风险恢复跟进`, source: '预警引擎', target: 'smart-operation' as SceneId, type: 'recovery' });
    if (riskSamples.length > 0) normal.push({ label: `${riskSamples.map(s => s.shortName).join('、')} — 风险复查`, source: '预警引擎', target: 'smart-monitor' as SceneId, type: 'risk' });
    if (preSamples.length > 0) normal.push({ label: `${preSamples.map(s => s.shortName).join('、')} — 产品匹配`, source: '识别引擎', target: 'asset-pool' as SceneId, type: 'match' });
    if (observeSamples.length > 0) followUp.push({ label: `${observeSamples.map(s => s.shortName).join('、')} — 持续观察`, source: '系统', target: 'smart-identify' as SceneId, type: 'observe' });

    return { high, normal, followUp };
  }, []);

  const highStrengthReview = SAMPLES.filter(s => s.stage === 'manual_review' && s.relationStrength > 80).length;
  const receivableRiskCount = SAMPLES.filter(s => s.riskFlags.some(f => f.includes('回款'))).length;

  const unifiedTaskRows = React.useMemo(() => {
    const reviewSamples = SAMPLES.filter(s => s.stage === 'manual_review');
    const recoverySamples = SAMPLES.filter(s => s.stage === 'recovery');
    const riskSamples = SAMPLES.filter(s => s.riskFlags.length >= 2);
    const preSamples = SAMPLES.filter(s => s.stage === 'pre_credit');
    const followNew = SAMPLES.filter(s => s.segmentTag === 'C待观察' || s.stage === 'identified');
    const receivableRisk = SAMPLES.filter(s => s.riskFlags.some(f => f.includes('回款')));

    const rows: Array<{
      id: string;
      tag: TaskSourceTag;
      title: string;
      count: number;
      priority: '高' | '中' | '普通';
      target: SceneId;
      module?: string;
      color: 'amber' | 'red' | 'blue' | 'green' | 'slate';
      icon: typeof FileCheck2;
    }> = [];

    if (reviewSamples.length > 0) {
      rows.push({
        id: 'agg-review',
        tag: '补审',
        title: `${reviewSamples.map(s => s.shortName).join('、')} — 补审待批准`,
        count: reviewSamples.length,
        priority: '高',
        target: 'smart-approval',
        color: 'amber',
        icon: FileCheck2,
      });
    }
    riskSamples.forEach(s => {
      rows.push({
        id: `risk-${s.id}`,
        tag: '预警',
        title: `${s.shortName} — ${s.riskFlags.join('、')}`,
        count: 1,
        priority: '高',
        target: 'smart-monitor',
        module: 'warning',
        color: 'red',
        icon: ShieldAlert,
      });
    });
    if (receivableRisk.length > 0) {
      rows.push({
        id: 'agg-collect',
        tag: '催收',
        title: `${receivableRisk.map(s => s.shortName).join('、')} — 回款类异常待催收`,
        count: receivableRisk.length,
        priority: '高',
        target: 'smart-monitor',
        module: 'actions',
        color: 'red',
        icon: AlertTriangle,
      });
    }
    if (reviewSamples.length > 0 || preSamples.length > 0) {
      rows.push({
        id: 'agg-approval',
        tag: '审批',
        title: '授信与额度相关审批待办',
        count: reviewSamples.length + preSamples.length,
        priority: '中',
        target: 'smart-approval',
        color: 'blue',
        icon: CheckCircle2,
      });
    }
    if (followNew.length > 0) {
      rows.push({
        id: 'agg-follow',
        tag: '跟进',
        title: `${followNew.map(s => s.shortName).join('、')} — 候选/观察池跟进`,
        count: followNew.length,
        priority: '普通',
        target: 'smart-identify',
        module: 'list',
        color: 'green',
        icon: Users,
      });
    }
    if (recoverySamples.length > 0) {
      rows.push({
        id: 'agg-recovery',
        tag: '恢复',
        title: `${recoverySamples.map(s => s.shortName).join('、')} — 风险恢复跟进`,
        count: recoverySamples.length,
        priority: '普通',
        target: 'smart-operation',
        module: 'recovery',
        color: 'slate',
        icon: Activity,
      });
    }
    return rows;
  }, []);

  const focusStarred = React.useMemo(() => SAMPLES.filter(s => s.uiState.featured), []);
  const focusRecent = React.useMemo(() => {
    const pri = (s: (typeof SAMPLES)[0]) => (s.id === selectedSampleId ? 4 : s.stage === 'manual_review' ? 3 : s.uiState.priority === 'high' ? 2 : 0);
    return [...SAMPLES].sort((a, b) => pri(b) - pri(a)).slice(0, 5);
  }, [selectedSampleId]);
  const focusAiPicks = React.useMemo(() => {
    const starred = new Set(focusStarred.map(s => s.id));
    return [...SAMPLES]
      .filter(s => !starred.has(s.id))
      .sort((a, b) => b.agentHints.confidence - a.agentHints.confidence)
      .slice(0, 4);
  }, [focusStarred]);

  const aiBriefItems = React.useMemo(
    () =>
      [...SAMPLES]
        .map(s => ({
          id: s.id,
          company: s.shortName,
          summary: s.aiSummary,
          action: s.agentHints.suggestedAction,
          agent: s.agentHints.suggestedAgent,
          confidence: s.agentHints.confidence,
          priority: s.uiState.priority,
        }))
        .sort((a, b) => {
          const po = (p: string) => (p === 'high' ? 0 : p === 'medium' ? 1 : 2);
          const d = po(a.priority) - po(b.priority);
          if (d !== 0) return d;
          return b.confidence - a.confidence;
        }),
    [],
  );

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
         PAGE 1: 今日总览（DEFAULT — 个人聚合入口）
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
                  <button type="button" onClick={() => onModuleChange('task-center')} className="text-[10px] text-[#2563EB] hover:underline">任务中心</button>
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
              <div className="flex items-center gap-1 shrink-0">
                <Button variant="ghost" size="sm" className="h-7 text-[11px] text-[#7C3AED] hover:bg-[#F5F3FF]" onClick={() => onModuleChange('ai-brief')}>AI 建议<ArrowRight size={10} className="ml-0.5" /></Button>
                <Button variant="ghost" size="sm" className="h-7 text-[11px] text-[#2563EB] hover:bg-[#EFF6FF]" onClick={() => navigate('smart-identify')}>识别<ArrowRight size={10} className="ml-0.5" /></Button>
              </div>
            </div>

            {/* Quick entries + Donut */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_240px] gap-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {[
                  { label: '智能识别', target: 'smart-identify' as SceneId, icon: <Search size={14} />, stat: `候选 ${SAMPLES.length} 户` },
                  { label: '智能审批', target: 'smart-approval' as SceneId, icon: <FileCheck2 size={14} />, stat: `待审 ${reviewCount} 户` },
                  { label: '智能监控', target: 'smart-monitor' as SceneId, icon: <ShieldAlert size={14} />, stat: `预警 ${riskCount} 笔` },
                  { label: '智能经营', target: 'smart-operation' as SceneId, icon: <Activity size={14} />, stat: `恢复 ${recoveryCount} 户` },
                  { label: '授信资产池', target: 'asset-pool' as SceneId, icon: <BarChart3 size={14} />, stat: `在营 ${activeSamples} 户` },
                  { label: '策略与配置', target: 'strategy-config' as SceneId, icon: <DatabaseZap size={14} />, stat: `${new Set(SAMPLES.map(s => s.chainName)).size} 条链` },
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
         PAGE 2: 任务中心（待办 + 风险提醒合并，按来源标签筛选）
         ════════════════════════════════════════════════════════════════════ */
      case 'task-center': {
        const riskSamplesTc = SAMPLES.filter(s => s.riskFlags.length >= 2);
        const filteredRows = unifiedTaskRows.filter(r => taskTagFilter === '全部' || r.tag === taskTagFilter);
        const totalUnits = filteredRows.reduce((s, r) => s + r.count, 0);
        const colorMap: Record<string, { dot: string; bg: string; text: string; border: string }> = {
          amber: { dot: 'bg-[#F59E0B]', bg: 'bg-[#FFFBEB]', text: 'text-[#92400E]', border: 'border-[#FDE68A]' },
          red: { dot: 'bg-[#DC2626]', bg: 'bg-[#FEF2F2]', text: 'text-[#DC2626]', border: 'border-[#FCA5A5]' },
          blue: { dot: 'bg-[#2563EB]', bg: 'bg-[#EFF6FF]', text: 'text-[#2563EB]', border: 'border-[#BFDBFE]' },
          green: { dot: 'bg-[#16A34A]', bg: 'bg-[#F0FDF4]', text: 'text-[#047857]', border: 'border-[#BBF7D0]' },
          slate: { dot: 'bg-[#64748B]', bg: 'bg-[#F8FAFC]', text: 'text-[#475569]', border: 'border-[#E2E8F0]' },
        };
        const tagFilters = ['全部', '补审', '预警', '催收', '审批', '跟进', '恢复'] as const;

        return (
          <div className="space-y-4">
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3 min-w-0">
                <Clock size={14} className="text-[#2563EB] shrink-0" />
                <div className="min-w-0">
                  <span className="text-[13px] font-semibold text-[#0F172A]">任务中心</span>
                  <span className="text-[11px] text-[#94A3B8] ml-2">{new Date().toLocaleDateString('zh-CN')} · 本页 {filteredRows.length} 条 · 涉及 {totalUnits} 项</span>
                </div>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 text-[#2563EB] border-[#BFDBFE] shrink-0" onClick={() => navigate('smart-monitor', 'warning')}>智能监控 <ArrowRight size={9} /></Button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {tagFilters.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setTaskTagFilter(tag)}
                  className={cn(
                    'rounded-full border px-3 py-1 text-[10px] font-medium transition-colors',
                    taskTagFilter === tag ? 'border-[#2563EB] bg-[#EFF6FF] text-[#2563EB]' : 'border-[#E2E8F0] bg-white text-[#64748B] hover:border-[#CBD5E1]',
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricCard label="补审队列" value={`${reviewCount} 个`} detail="待处理" icon={FileCheck2} tone="amber" />
              <MetricCard label="活跃预警" value={`${riskSamplesTc.length} 户`} detail="多信号命中" icon={ShieldAlert} tone="red" />
              <MetricCard label="回款催收" value={`${SAMPLES.filter(s => s.riskFlags.some(f => f.includes('回款'))).length} 户`} detail="待处置" icon={AlertTriangle} tone="amber" />
              <MetricCard label="恢复跟进" value={`${recoveryCount} 户`} detail="观察中" icon={Activity} tone="blue" />
            </div>

            <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
              <div className="grid grid-cols-[72px_1fr_52px_56px_100px] gap-0 px-4 py-2.5 border-b border-[#E2E8F0] bg-[#F8FAFC] text-[10px] font-medium text-[#94A3B8] uppercase tracking-wider">
                <div>来源</div>
                <div>任务内容</div>
                <div>数量</div>
                <div>优先级</div>
                <div>操作</div>
              </div>
              {filteredRows.length > 0 ? (
                filteredRows.map(t => {
                  const c = colorMap[t.color];
                  const Icon = t.icon;
                  return (
                    <div key={t.id} className="grid grid-cols-[72px_1fr_52px_56px_100px] gap-0 px-4 py-3 border-b border-[#F1F5F9] last:border-b-0 items-center hover:bg-[#FAFBFF] transition-colors">
                      <Badge className={cn('text-[9px] border w-fit justify-self-start', c.bg, c.text, c.border)}>
                        <Icon size={9} className="mr-0.5" />
                        {t.tag}
                      </Badge>
                      <div className="text-[12px] text-[#0F172A] pr-2 min-w-0">{t.title}</div>
                      <div className="text-[13px] font-bold text-[#0F172A]">{t.count}</div>
                      <Badge
                        className={cn(
                          'text-[9px] border w-fit justify-self-start',
                          t.priority === '高' ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]' : t.priority === '中' ? 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]' : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]',
                        )}
                      >
                        {t.priority}
                      </Badge>
                      <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1 text-[#2563EB] border-[#BFDBFE]" onClick={() => navigate(t.target, t.module)}>
                        处理 <ArrowRight size={9} />
                      </Button>
                    </div>
                  );
                })
              ) : (
                <div className="px-4 py-10 text-center text-[13px] text-[#94A3B8]">该分类下暂无任务</div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { label: '预警总览', desc: '全量风险与指标', target: 'smart-monitor' as SceneId, module: 'warning' },
                { label: '处置作业', desc: '催收与下发动作', target: 'smart-monitor' as SceneId, module: 'actions' },
                { label: '规则效果', desc: '命中率与误报', target: 'smart-monitor' as SceneId, module: 'quality' },
              ].map(e => (
                <button
                  key={e.label}
                  type="button"
                  className="rounded-lg border border-[#E2E8F0] bg-white p-4 text-left hover:bg-[#FAFBFF] hover:border-[#BFDBFE] transition-colors"
                  onClick={() => navigate(e.target, e.module)}
                >
                  <div className="text-[12px] font-semibold text-[#0F172A]">{e.label}</div>
                  <div className="text-[10px] text-[#94A3B8] mt-1">{e.desc}</div>
                  <div className="mt-2 text-[10px] text-[#2563EB] flex items-center gap-1">
                    进入 <ArrowRight size={9} />
                  </div>
                </button>
              ))}
            </div>

            {active && <ActionBar />}
          </div>
        );
      }

      /* ════════════════════════════════════════════════════════════════════
         PAGE 3: 消息通知
         ════════════════════════════════════════════════════════════════════ */
      case 'notifications': {
        const unreadCount = COCKPIT_NOTIFICATIONS.filter(n => !readNotificationIds.has(n.id)).length;
        const markRead = (id: string) => setReadNotificationIds(prev => new Set(prev).add(id));
        const markAllRead = () => setReadNotificationIds(new Set(COCKPIT_NOTIFICATIONS.map(n => n.id)));

        return (
          <div className="space-y-4">
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <Inbox size={14} className="text-[#2563EB]" />
                <span className="text-[13px] font-semibold text-[#0F172A]">消息通知</span>
                <Badge className="bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE] text-[9px]">{unreadCount} 条未读</Badge>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-[10px] border-[#E2E8F0] text-[#64748B]" onClick={markAllRead} disabled={unreadCount === 0}>
                全部标为已读
              </Button>
            </div>

            <div className="rounded-lg border border-[#E2E8F0] bg-white divide-y divide-[#F1F5F9]">
              {COCKPIT_NOTIFICATIONS.map(n => {
                const unread = !readNotificationIds.has(n.id);
                return (
                  <div key={n.id} className={cn('px-4 py-3 flex flex-wrap items-start justify-between gap-3', unread && 'bg-[#FAFBFF]')}>
                    <div className="flex gap-3 min-w-0 flex-1">
                      <div className={cn('mt-1 h-2 w-2 rounded-full shrink-0', unread ? 'bg-[#2563EB]' : 'bg-[#E2E8F0]')} />
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant="outline" className="text-[9px] border-[#E2E8F0] text-[#64748B]">
                            {n.category}
                          </Badge>
                          <span className="text-[10px] text-[#94A3B8]">{n.time}</span>
                        </div>
                        <p className="mt-1 text-[12px] text-[#0F172A] leading-relaxed">{n.title}</p>
                      </div>
                    </div>
                    {unread && (
                      <Button variant="ghost" size="sm" className="h-7 text-[10px] text-[#2563EB] shrink-0" onClick={() => markRead(n.id)}>
                        标为已读
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>

            <p className="text-[10px] text-[#94A3B8] px-1">审批流、AI 作业完成、监控预警与演示推进等系统事件会汇总于此；完整客户与资产列表请在对应深链路模块查看。</p>

            {active && <ActionBar />}
          </div>
        );
      }

      /* ════════════════════════════════════════════════════════════════════
         PAGE 4: 我的关注（星标 / 最近 / AI 推荐，非全量客户表）
         ════════════════════════════════════════════════════════════════════ */
      case 'my-focus': {
        const openSample = (id: string) => {
          selectSample(id);
          navigate('smart-identify', 'list');
        };

        return (
          <div className="space-y-4">
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <Star size={14} className="text-[#CA8A04]" />
                <span className="text-[13px] font-semibold text-[#0F172A]">我的关注</span>
                <span className="text-[11px] text-[#94A3B8]">星标、最近处理与 AI 推荐，非全量名单</span>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#BFDBFE] text-[#2563EB]" onClick={() => navigate('asset-pool', 'activated')}>
                在营全量 <ArrowRight size={9} />
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricCard label="星标" value={`${focusStarred.length} 户`} detail="重点盯盘" icon={Star} tone="amber" />
              <MetricCard label="最近" value={`${focusRecent.length} 户`} detail="本页展示" icon={History} tone="blue" />
              <MetricCard label="AI 推荐" value={`${focusAiPicks.length} 户`} detail="置信度优先" icon={Sparkles} tone="blue" />
              <MetricCard label="全库样本" value={`${SAMPLES.length} 户`} detail="深链查看" icon={Users} tone="slate" />
            </div>

            <WorkbenchPanel title="星标客户" badge={<Badge className="text-[9px] border-[#FDE68A] bg-[#FFFBEB] text-[#92400E]">{focusStarred.length} 户</Badge>}>
              <div className="space-y-2">
                {focusStarred.length > 0 ? (
                  focusStarred.map(s => (
                    <React.Fragment key={s.id}>
                      <CockpitFocusCustomerRow sample={s} badge="星标" onRowClick={() => openSample(s.id)} />
                    </React.Fragment>
                  ))
                ) : (
                  <div className="text-center py-6 text-[12px] text-[#94A3B8]">暂无星标，可在样本卡片上标记重点</div>
                )}
              </div>
            </WorkbenchPanel>

            <WorkbenchPanel title="最近处理" badge={<Badge className="text-[9px] border-[#BFDBFE] bg-[#EFF6FF] text-[#2563EB]">动态排序</Badge>}>
              <div className="space-y-2">
                {focusRecent.map(s => (
                  <React.Fragment key={s.id}>
                    <CockpitFocusCustomerRow
                      sample={s}
                      badge={s.id === selectedSampleId ? '当前' : undefined}
                      onRowClick={() => openSample(s.id)}
                    />
                  </React.Fragment>
                ))}
              </div>
            </WorkbenchPanel>

            <WorkbenchPanel title="AI 推荐关注" badge={<Badge className="text-[9px] border-[#DDD6FE] bg-[#F5F3FF] text-[#7C3AED]">按置信度</Badge>}>
              <div className="space-y-2">
                {focusAiPicks.map(s => (
                  <React.Fragment key={s.id}>
                    <CockpitFocusCustomerRow sample={s} badge={`AI ${s.agentHints.confidence}%`} onRowClick={() => openSample(s.id)} />
                  </React.Fragment>
                ))}
              </div>
            </WorkbenchPanel>

            {active && <ActionBar />}
          </div>
        );
      }

      /* ════════════════════════════════════════════════════════════════════
         PAGE 5: AI 建议（跨模块聚合）
         ════════════════════════════════════════════════════════════════════ */
      case 'ai-brief':
        return (
          <div className="space-y-4">
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 flex items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <Sparkles size={14} className="text-[#7C3AED]" />
                <span className="text-[13px] font-semibold text-[#0F172A]">AI 建议</span>
                <span className="text-[11px] text-[#94A3B8]">按优先级与模型置信度排序</span>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#BFDBFE] text-[#2563EB]" onClick={() => onModuleChange('task-center')}>
                去任务中心 <ArrowRight size={9} />
              </Button>
            </div>

            <div className="space-y-3">
              {aiBriefItems.map((item, idx) => (
                <div key={item.id} className="rounded-xl border border-[#E8E0FF] bg-gradient-to-br from-[#FAF5FF]/80 to-white px-4 py-3 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#7C3AED] text-[10px] font-bold text-white shrink-0">{idx + 1}</span>
                      <span className="text-[13px] font-semibold text-[#0F172A] truncate">{item.company}</span>
                      <Badge
                        className={cn(
                          'text-[8px] shrink-0',
                          item.priority === 'high' ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]' : item.priority === 'medium' ? 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]' : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]',
                        )}
                      >
                        {item.priority === 'high' ? '高优先' : item.priority === 'medium' ? '中优先' : '观察'}
                      </Badge>
                    </div>
                    <span className="text-[10px] text-[#94A3B8] shrink-0">置信 {item.confidence}%</span>
                  </div>
                  <p className="mt-2 text-[12px] leading-relaxed text-[#334155]">{item.summary}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px] text-[#64748B]">
                    <span className="font-medium text-[#7C3AED]">{item.agent}</span>
                    <span>·</span>
                    <span>建议动作：{item.action}</span>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button size="sm" className="h-7 text-[10px] gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white" onClick={() => { selectSample(item.id); navigate('smart-identify', 'list'); }}>
                      查看客户 <ArrowRight size={9} />
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] border-[#E2E8F0]" onClick={() => navigate('smart-approval', 'review')}>
                      相关审批
                    </Button>
                  </div>
                </div>
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
