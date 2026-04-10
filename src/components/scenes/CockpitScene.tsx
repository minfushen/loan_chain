import React from 'react';
import SceneLayout from '../SceneLayout';
import { SCENES } from '../../constants';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Building2,
  ArrowRight,
  Crosshair,
  Sparkles,
  Search,
  Users,
  ShieldAlert,
  FileCheck2,
  Activity,
  Eye,
  BarChart3,
  DatabaseZap,
  ChevronRight,
  Clock,
  History,
  PlusCircle,
} from 'lucide-react';
import { SampleSwitcher, StatusPill, SceneQuestion } from '../ProductPrimitives';
import { useDemo, STAGE_ORDER } from '../../demo/DemoContext';
import { ActionBar } from '../../demo/DemoComponents';
import { CHAIN_LOAN_STAGE_LABELS, SAMPLES } from '../../demo/chainLoan/data';
import { MiniAreaChart, DonutChart, CHART_COLORS } from '../Charts';
import type { SceneId } from '../../types';

interface CockpitSceneProps {
  activeModule: string;
  onModuleChange: (id: string) => void;
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 6) return '夜深了';
  if (h < 12) return '早安';
  if (h < 14) return '午安';
  if (h < 18) return '下午好';
  return '晚上好';
}

export default function CockpitScene({ activeModule, onModuleChange }: CockpitSceneProps) {
  const scene = SCENES.find((item) => item.id === 'cockpit')!;
  const { active, stageIndex, riskSimulated, recoveryComplete, navigate, currentSample, selectSample, selectedSampleId } = useDemo();

  const reviewCount = SAMPLES.filter((s) => s.stage === 'manual_review').length;
  const riskCount = SAMPLES.filter((s) => s.riskFlags.length >= 2).length;
  const recoveryCount = SAMPLES.filter((s) => s.stage === 'recovery').length;
  const followUpCount = SAMPLES.filter((s) => s.segmentTag === 'C待观察' || s.stage === 'pre_credit').length;
  const aiSuggestionCount = SAMPLES.filter((s) => s.agentHints.confidence > 0).length;

  const currentStageLabel = active ? CHAIN_LOAN_STAGE_LABELS[STAGE_ORDER[stageIndex]] || '未启动' : '未启动';

  const riskState: 'normal' | 'watch' | 'risk' =
    riskSimulated && !recoveryComplete ? 'risk' : riskSimulated && recoveryComplete ? 'watch' : 'normal';
  const riskLabel = riskState === 'risk' ? '中度预警' : riskState === 'watch' ? '恢复观察' : '正常';

  const judgment = (() => {
    if (!active) return '演示未启动，点击数据与接入开始';
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
    if (recoveryComplete) return [
      { label: '查看贷后经营', target: 'post-loan' as SceneId },
      { label: '查看客群池', target: 'customer-pool' as SceneId },
    ];
    if (riskSimulated) return [
      { label: '查看贷后恢复', target: 'post-loan' as SceneId },
      { label: '查看风险监控', target: 'risk-monitor' as SceneId },
    ];
    if (stageIndex >= STAGE_ORDER.indexOf('approved')) return [
      { label: '进入风险监控', target: 'risk-monitor' as SceneId },
      { label: '查看资产池', target: 'asset-pool' as SceneId },
    ];
    if (stageIndex >= STAGE_ORDER.indexOf('manual_review')) return [
      { label: '进入补审', target: 'product-approval' as SceneId },
      { label: '查看证据', target: 'customer-pool' as SceneId },
    ];
    if (stageIndex >= STAGE_ORDER.indexOf('pre_credit')) return [{ label: '进入资产池', target: 'asset-pool' as SceneId }];
    if (stageIndex >= STAGE_ORDER.indexOf('identified')) return [{ label: '查看客群池', target: 'customer-pool' as SceneId }];
    return [{ label: '进入数据与接入', target: 'partner-management' as SceneId }];
  })();

  /* ── Tasks ── */
  const tasks = React.useMemo(() => {
    const high: { label: string; source: string; target: SceneId }[] = [];
    const normal: { label: string; source: string; target: SceneId }[] = [];
    const followUp: { label: string; source: string; target: SceneId }[] = [];

    const reviewSamples = SAMPLES.filter(s => s.stage === 'manual_review');
    const recoverySamples = SAMPLES.filter(s => s.stage === 'recovery');
    const riskSamples = SAMPLES.filter(s => s.riskFlags.length >= 2);
    const preSamples = SAMPLES.filter(s => s.stage === 'pre_credit');
    const observeSamples = SAMPLES.filter(s => s.segmentTag === 'C待观察');

    if (reviewSamples.length > 0) high.push({ label: `${reviewSamples.map(s => s.shortName).join('、')} — 补审待批准`, source: '规则引擎', target: 'product-approval' as SceneId });
    if (recoverySamples.length > 0) high.push({ label: `${recoverySamples.map(s => s.shortName).join('、')} — 风险恢复跟进`, source: '预警引擎', target: 'post-loan' as SceneId });

    if (riskSamples.length > 0) normal.push({ label: `${riskSamples.map(s => s.shortName).join('、')} — 风险复查`, source: '预警引擎', target: 'risk-monitor' as SceneId });
    if (preSamples.length > 0) normal.push({ label: `${preSamples.map(s => s.shortName).join('、')} — 产品匹配`, source: '识别引擎', target: 'asset-pool' as SceneId });

    if (observeSamples.length > 0) followUp.push({ label: `${observeSamples.map(s => s.shortName).join('、')} — 持续观察`, source: '系统', target: 'customer-pool' as SceneId });
    if (recoverySamples.length > 0 && !followUp.some(f => f.target === 'post-loan')) {
      followUp.push({ label: `${recoverySamples.map(s => s.shortName).join('、')} — 30天观察期`, source: '系统', target: 'post-loan' as SceneId });
    }

    return { high, normal, followUp };
  }, []);

  /* ── AI insight text ── */
  const highStrengthReview = SAMPLES.filter(s => s.stage === 'manual_review' && s.relationStrength > 80).length;
  const receivableRiskCount = SAMPLES.filter(s => s.riskFlags.some(f => f.includes('回款'))).length;

  const highConfidenceCount = SAMPLES.filter(s => s.authenticityScore >= 80).length;
  const activeSamples = SAMPLES.filter(s => ['approved', 'risk_alert', 'recovery'].includes(s.stage)).length;
  const avgEvidenceCoverage = Math.round(SAMPLES.reduce((sum, s) => sum + s.evidenceCoverage, 0) / SAMPLES.length);

  /* ── Domain entries (lightweight) ── */
  const domainEntries: { label: string; target: SceneId; icon: React.ReactNode; stat: string }[] = [
    { label: '客群识别', target: 'customer-pool', icon: <Search size={14} />, stat: `候选 ${SAMPLES.length} 户` },
    { label: '补审作业', target: 'product-approval', icon: <FileCheck2 size={14} />, stat: `待审 ${reviewCount} 户` },
    { label: '风险监控', target: 'risk-monitor', icon: <ShieldAlert size={14} />, stat: `预警 ${riskCount} 笔` },
    { label: '贷后经营', target: 'post-loan', icon: <Activity size={14} />, stat: `恢复 ${recoveryCount} 户` },
    { label: '授信资产池', target: 'asset-pool', icon: <BarChart3 size={14} />, stat: `在营 ${activeSamples} 户` },
    { label: '数据与接入', target: 'partner-management', icon: <DatabaseZap size={14} />, stat: `${new Set(SAMPLES.map(s => s.chainName)).size} 条链` },
  ];

  const TaskRow = ({ label, source, target }: { label: string; source: string; target: SceneId }) => (
    <button
      className="w-full flex items-center gap-3 px-3.5 py-2 hover:bg-[#F8FAFC] transition-colors text-left rounded-md"
      onClick={() => navigate(target)}
    >
      <div className="flex-1 min-w-0">
        <div className="text-[13px] text-[#0F172A] truncate">{label}</div>
        <div className="text-[10px] text-[#94A3B8] mt-0.5">{source}</div>
      </div>
      <ChevronRight size={12} className="text-[#CBD5E1] shrink-0" />
    </button>
  );

  const dashboardContent = (
    <div className="space-y-5">
      {/* ── 1. 问候区 ── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-xl font-semibold text-[#0F172A] tracking-tight">{getGreeting()}，王敏</h1>
          <p className="mt-1 text-[13px] text-[#64748B]">这是您今日需要优先处理的业务、客户与建议。</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="sm" className="h-8 text-[12px] text-[#64748B] gap-1.5">
            <History size={13} />
            历史记录
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-[12px] gap-1.5 border-[#E2E8F0] text-[#334155]">
            <PlusCircle size={13} />
            新建场景
          </Button>
        </div>
      </div>

      <SceneQuestion question="今天最该处理什么、先看哪一户、下一步点哪里" />

      {/* ── 2. 今日工作概览 (带迷你趋势图) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-2.5">
        {[
          { label: '待补审', value: reviewCount, color: 'text-[#DC2626]', chartColor: CHART_COLORS.red, icon: FileCheck2, trend: [3,2,4,1,2,1,reviewCount] },
          { label: '新增预警', value: riskCount, color: 'text-[#EA580C]', chartColor: CHART_COLORS.amber, icon: ShieldAlert, trend: [1,0,2,1,0,1,riskCount] },
          { label: '恢复观察', value: recoveryCount, color: 'text-[#475569]', chartColor: CHART_COLORS.slate, icon: Eye, trend: [2,3,2,1,1,1,recoveryCount] },
          { label: '待跟进客户', value: followUpCount, color: 'text-[#2563EB]', chartColor: CHART_COLORS.blue, icon: Users, trend: [4,3,5,4,3,2,followUpCount] },
          { label: 'AI 待确认建议', value: aiSuggestionCount, color: 'text-[#7C3AED]', chartColor: CHART_COLORS.violet, icon: Sparkles, trend: [3,5,4,6,5,4,aiSuggestionCount] },
        ].map((m) => (
          <div key={m.label} className="rounded-xl border border-border bg-card px-3.5 py-3 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground uppercase tracking-wider">
              <m.icon size={11} />
              {m.label}
            </div>
            <div className="mt-1 flex items-end justify-between gap-2">
              <span className={`text-2xl font-bold leading-none ${m.value > 0 ? m.color : 'text-muted-foreground/40'}`}>{m.value}</span>
              <div className="w-16 shrink-0 opacity-70">
                <MiniAreaChart
                  data={m.trend.map((v, i) => ({ name: `d${i}`, value: v }))}
                  color={m.chartColor}
                  height={28}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── 3. 今日任务区 + 4. 当前重点客户 ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[3fr_2fr] gap-4">
        {/* Left: Tasks */}
        <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-[#F1F5F9] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={13} className="text-[#64748B]" />
              <span className="text-[13px] font-semibold text-[#0F172A]">今日任务</span>
            </div>
            <span className="text-[10px] text-[#94A3B8]">{tasks.high.length + tasks.normal.length + tasks.followUp.length} 项待办</span>
          </div>

          <div className="divide-y divide-[#F1F5F9]">
            {/* High priority */}
            {tasks.high.length > 0 && (
              <div className="px-1.5 py-1.5">
                <div className="px-3 pt-1.5 pb-1 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#DC2626]" />
                  <span className="text-[10px] font-semibold text-[#DC2626] uppercase tracking-wider">高优先级</span>
                </div>
                {tasks.high.map((t) => <TaskRow key={t.label} {...t} />)}
              </div>
            )}

            {/* Normal */}
            {tasks.normal.length > 0 && (
              <div className="px-1.5 py-1.5">
                <div className="px-3 pt-1.5 pb-1 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                  <span className="text-[10px] font-semibold text-[#92400E] uppercase tracking-wider">普通任务</span>
                </div>
                {tasks.normal.map((t) => <TaskRow key={t.label} {...t} />)}
              </div>
            )}

            {/* Follow-ups */}
            {tasks.followUp.length > 0 && (
              <div className="px-1.5 py-1.5">
                <div className="px-3 pt-1.5 pb-1 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#94A3B8]" />
                  <span className="text-[10px] font-semibold text-[#64748B] uppercase tracking-wider">我的跟进</span>
                </div>
                {tasks.followUp.map((t) => <TaskRow key={t.label} {...t} />)}
              </div>
            )}

            {tasks.high.length === 0 && tasks.normal.length === 0 && tasks.followUp.length === 0 && (
              <div className="px-4 py-8 text-center text-[13px] text-[#94A3B8]">暂无待办任务</div>
            )}
          </div>
        </div>

        {/* Right: Current key customer */}
        <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
          <div className="px-4 py-3 border-b border-[#F1F5F9] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Crosshair size={13} className="text-[#2563EB]" />
              <span className="text-[13px] font-semibold text-[#0F172A]">当前重点客户</span>
            </div>
            <SampleSwitcher selectedId={selectedSampleId} onSelect={selectSample} compact />
          </div>

          <div className="p-4 space-y-3">
            {/* Identity */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D6E4FF] bg-[#EFF6FF] text-[#2563EB]">
                <Building2 size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-[#0F172A] truncate">{currentSample.shortName}</div>
                <div className="text-[10px] text-[#94A3B8]">{currentSample.roleInChain}</div>
              </div>
            </div>

            {/* Key fields */}
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: '当前阶段', value: currentStageLabel },
                { label: '审批状态', value: currentSample.approvalStatus },
                { label: '风险状态', value: riskLabel, isRisk: true },
                { label: '拟授信额度', value: riskSimulated && !recoveryComplete ? currentSample.currentLimit : currentSample.recommendedLimit },
              ].map((cell) => (
                <div key={cell.label} className="rounded-md bg-[#F8FAFC] border border-[#F1F5F9] px-2.5 py-2">
                  <div className="text-[10px] text-[#94A3B8]">{cell.label}</div>
                  <div className="mt-0.5 text-xs font-semibold text-[#0F172A]">
                    {cell.isRisk ? <StatusPill state={riskState} label={riskLabel} /> : cell.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Judgment */}
            <div className="rounded-md border border-[#E2E8F0] bg-[#FAFBFF] px-3 py-2.5">
              <div className="text-[10px] text-[#94A3B8] mb-0.5">当前判断</div>
              <div className="text-xs leading-5 text-[#334155]">{judgment}</div>
            </div>

            {/* Quick actions */}
            <div className="flex flex-wrap gap-2">
              {nextActions.map((a) => (
                <Button
                  key={a.label}
                  variant="outline"
                  size="sm"
                  className="h-7 text-[11px] gap-1 border-[#E2E8F0] text-[#334155] hover:border-[#BFDBFE] hover:text-[#2563EB]"
                  onClick={() => navigate(a.target)}
                >
                  {a.label}
                  <ArrowRight size={10} />
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── 5. AI 建议条 ── */}
      <div className="flex items-center gap-3 rounded-lg border border-[#D6E4FF] bg-[#FAFBFF] px-4 py-2.5">
        <div className="flex items-center justify-center w-5 h-5 rounded bg-[#2563EB] shrink-0">
          <Sparkles size={10} className="text-white" />
        </div>
        <p className="flex-1 text-xs leading-5 text-[#334155]">
          <span className="font-medium text-[#2563EB]">今日建议：</span>
          {highStrengthReview > 0 ? `补审队列中 ${highStrengthReview} 户关系强度 > 80%，建议优先处理。` : ''}
          {receivableRiskCount > 0 ? ` ${riskCount} 笔预警中回款延迟类 ${receivableRiskCount} 笔占比最高。` : ` ${SAMPLES.length} 个样本经营状态总体稳定。`}
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-[11px] text-[#2563EB] hover:bg-[#EFF6FF] shrink-0"
          onClick={() => navigate('customer-pool')}
        >
          查看
          <ArrowRight size={10} className="ml-0.5" />
        </Button>
      </div>

      {/* ── 6. 快捷业务入口 + 资产分布 ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_240px] gap-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {domainEntries.map((entry) => (
            <button
              key={entry.label}
              className="flex items-center gap-2.5 rounded-xl border border-border bg-card px-3.5 py-3 hover:border-primary/30 hover:shadow-md transition-all text-left group"
              onClick={() => navigate(entry.target)}
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-muted/50 text-muted-foreground group-hover:border-primary/30 group-hover:text-primary group-hover:bg-primary/5 transition-colors shrink-0">
                {entry.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[12px] font-semibold text-foreground group-hover:text-primary transition-colors truncate">{entry.label}</div>
                <div className="text-[10px] text-muted-foreground">{entry.stat}</div>
              </div>
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
            height={140}
            innerRadius={36}
            outerRadius={56}
            centerLabel="总样本"
            centerValue={`${SAMPLES.length}`}
          />
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 justify-center">
            {[
              { label: 'A可授信', color: CHART_COLORS.emerald },
              { label: 'B需处理', color: CHART_COLORS.blue },
              { label: 'C待观察', color: CHART_COLORS.amber },
              { label: 'D风险中', color: CHART_COLORS.red },
            ].map(l => (
              <span key={l.label} className="flex items-center gap-1 text-[9px] text-muted-foreground">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: l.color }} />
                {l.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {active && <ActionBar />}
    </div>
  );

  return (
    <SceneLayout
      title={scene.title}
      modules={scene.modules}
      activeModule={activeModule}
      onModuleChange={onModuleChange}
    >
      {dashboardContent}
    </SceneLayout>
  );
}
