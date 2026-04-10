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
  TrendingUp,
  FileCheck2,
  Activity,
  Eye,
  Zap,
  BarChart3,
  Handshake,
  ChevronRight,
} from 'lucide-react';
import { SampleSwitcher, StatusPill } from '../ProductPrimitives';
import { useDemo, STAGE_ORDER } from '../../demo/DemoContext';
import { ActionBar } from '../../demo/DemoComponents';
import { CHAIN_LOAN_STAGE_LABELS, SAMPLES } from '../../demo/chainLoan/data';
import type { SceneId } from '../../types';

interface CockpitSceneProps {
  activeModule: string;
  onModuleChange: (id: string) => void;
}

export default function CockpitScene({ activeModule, onModuleChange }: CockpitSceneProps) {
  const scene = SCENES.find((item) => item.id === 'cockpit')!;
  const { active, stageIndex, riskSimulated, recoveryComplete, navigate, currentSample, selectSample, selectedSampleId } = useDemo();

  const approvedCount = SAMPLES.filter((s) => s.stage === 'approved' || s.stage === 'recovery').length;
  const preCreditCount = SAMPLES.filter((s) => s.stage === 'pre_credit' || s.stage === 'identified').length;
  const reviewCount = SAMPLES.filter((s) => s.stage === 'manual_review').length;
  const riskCount = SAMPLES.filter((s) => s.riskFlags.length >= 2).length;
  const recoveryCount = SAMPLES.filter((s) => s.stage === 'recovery').length;

  const currentStageLabel = active ? CHAIN_LOAN_STAGE_LABELS[STAGE_ORDER[stageIndex]] || '未启动' : '未启动';

  const riskState: 'normal' | 'watch' | 'risk' =
    riskSimulated && !recoveryComplete ? 'risk' : riskSimulated && recoveryComplete ? 'watch' : 'normal';
  const riskLabel = riskState === 'risk' ? '中度预警' : riskState === 'watch' ? '恢复观察' : '正常';

  const judgment = (() => {
    if (!active) return '演示未启动，点击合作方管理开始';
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
      { label: '进入审批', target: 'product-approval' as SceneId },
      { label: '查看证据', target: 'customer-pool' as SceneId },
    ];
    if (stageIndex >= STAGE_ORDER.indexOf('pre_credit')) return [{ label: '进入资产池', target: 'asset-pool' as SceneId }];
    if (stageIndex >= STAGE_ORDER.indexOf('identified')) return [{ label: '查看客群池', target: 'customer-pool' as SceneId }];
    return [{ label: '进入合作方管理', target: 'partner-management' as SceneId }];
  })();

  const missionTasks = [
    { label: '裕同包装补审待批准', count: 1, source: '规则引擎', priority: 'high' as const, target: 'product-approval' as SceneId },
    { label: '瑞泰新能源风险恢复跟进', count: 1, source: '预警引擎', priority: 'high' as const, target: 'post-loan' as SceneId },
    { label: '新宙邦集中度复查', count: 1, source: '预警引擎', priority: 'medium' as const, target: 'risk-monitor' as SceneId },
    { label: '中外运物流产品匹配', count: 1, source: '识别引擎', priority: 'medium' as const, target: 'asset-pool' as SceneId },
    { label: '王子新材待观察跟进', count: 1, source: '系统', priority: 'low' as const, target: 'customer-pool' as SceneId },
  ];

  const domainEntries: { label: string; target: SceneId; icon: React.ReactNode; count: string; insight: string }[] = [
    { label: '客群识别', target: 'customer-pool', icon: <Search size={16} />, count: '候选 126 户', insight: '高置信度 18 户' },
    { label: '授信资产池', target: 'asset-pool', icon: <BarChart3 size={16} />, count: '在营 1,120 户', insight: '今日新增 34 户' },
    { label: '补审作业', target: 'product-approval', icon: <FileCheck2 size={16} />, count: `待审 ${reviewCount + 1} 户`, insight: '通过率 85.7%' },
    { label: '风险监控', target: 'risk-monitor', icon: <ShieldAlert size={16} />, count: `预警 ${riskCount} 笔`, insight: '回款类 2 笔' },
    { label: '贷后经营', target: 'post-loan', icon: <Activity size={16} />, count: `恢复观察 ${recoveryCount} 户`, insight: '健康率 96.8%' },
    { label: '合作方管理', target: 'partner-management', icon: <Handshake size={16} />, count: '接入 3 家', insight: '数据可用度 89%' },
  ];

  const renderContent = () => {
    switch (activeModule) {
      case 'mvp':
        return (
          <div className="space-y-4">
            {/* ── GlobalSituationStrip ── */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-px rounded-lg border border-[#E2E8F0] bg-[#E2E8F0] overflow-hidden">
              {[
                { label: '在营资产', value: `${1120 + approvedCount} 户`, trend: '+8', icon: TrendingUp },
                { label: '今日新增预授信', value: `${34 + preCreditCount}`, trend: '+6', icon: Zap },
                { label: '待补审', value: `${reviewCount + 1}`, trend: '', icon: FileCheck2 },
                { label: '风险预警', value: `${riskCount} 笔`, trend: riskSimulated ? '+1' : '', icon: ShieldAlert },
                { label: '恢复观察', value: `${recoveryCount} 户`, trend: '', icon: Eye },
                { label: 'AI 建议数', value: '7', trend: '+3', icon: Sparkles },
              ].map((m) => (
                <div key={m.label} className="bg-white px-3.5 py-2.5">
                  <div className="flex items-center gap-1.5 text-[10px] text-[#94A3B8]">
                    <m.icon size={11} className="text-[#94A3B8]" />
                    {m.label}
                  </div>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-lg font-semibold text-[#0F172A] leading-none">{m.value}</span>
                    {m.trend && (
                      <span className={`text-[10px] font-medium ${m.trend.startsWith('+') ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>{m.trend}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* ── MissionControlPanel + CurrentBattleCard ── */}
            <div className="grid grid-cols-1 xl:grid-cols-[7fr_5fr] gap-4">
              {/* Left: MissionControlPanel */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0]">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#DC2626] animate-pulse" />
                    <span className="text-sm font-semibold text-[#0F172A]">任务中心</span>
                  </div>
                  <Badge className="bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] text-[9px]">
                    {missionTasks.filter((t) => t.priority === 'high').length} 项高优
                  </Badge>
                </div>
                <div className="divide-y divide-[#F1F5F9]">
                  {missionTasks.map((task) => (
                    <button
                      key={task.label}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#F8FAFC] transition-colors text-left"
                      onClick={() => navigate(task.target)}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${task.priority === 'high' ? 'bg-[#DC2626]' : task.priority === 'medium' ? 'bg-[#F59E0B]' : 'bg-[#94A3B8]'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-medium text-[#0F172A] truncate">{task.label}</div>
                        <div className="text-[10px] text-[#94A3B8]">{task.source}</div>
                      </div>
                      <Badge className={`text-[9px] border shrink-0 ${task.priority === 'high' ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]' : task.priority === 'medium' ? 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]' : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]'}`}>
                        {task.priority === 'high' ? '高优' : task.priority === 'medium' ? '中优' : '常规'}
                      </Badge>
                      <ChevronRight size={12} className="text-[#CBD5E1] shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: CurrentBattleCard */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0]">
                  <div className="flex items-center gap-2">
                    <Crosshair size={14} className="text-[#2563EB]" />
                    <span className="text-sm font-semibold text-[#0F172A]">当前作战对象</span>
                  </div>
                  <SampleSwitcher selectedId={selectedSampleId} onSelect={selectSample} compact />
                </div>
                <div className="p-4 space-y-3.5">
                  {/* Subject */}
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D6E4FF] bg-[#EFF6FF] text-[#2563EB]">
                      <Building2 size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-[#0F172A] truncate">{currentSample.shortName}</div>
                      <div className="text-[10px] text-[#94A3B8]">{currentSample.roleInChain}</div>
                    </div>
                  </div>

                  {/* Status grid */}
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
                  <div className="rounded-md border border-[#E2E8F0] bg-white px-3 py-2.5">
                    <div className="text-[10px] text-[#94A3B8] mb-0.5">当前判断</div>
                    <div className="text-xs leading-5 text-[#334155]">{judgment}</div>
                  </div>

                  {/* Actions */}
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

            {/* ── AIInsightStrip ── */}
            <div className="flex items-center gap-3 rounded-lg border border-[#D6E4FF] bg-[#FAFBFF] px-4 py-2.5">
              <div className="flex items-center justify-center w-6 h-6 rounded-md bg-[#2563EB] shrink-0">
                <Sparkles size={12} className="text-white" />
              </div>
              <p className="flex-1 text-xs leading-5 text-[#334155]">
                <span className="font-medium text-[#2563EB]">今日洞察：</span>
                补审队列中 {reviewCount + 1} 户关系强度 &gt; 80%，建议优先处理新能源链样本；{riskCount} 笔预警中回款延迟类占比最高，宁德时代下游需启动集中度复查。
              </p>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-[11px] border-[#BFDBFE] text-[#2563EB] hover:bg-[#EFF6FF] shrink-0"
                onClick={() => navigate('customer-pool')}
              >
                查看详情
              </Button>
            </div>

            {/* ── DomainEntryGrid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {domainEntries.map((entry) => (
                <button
                  key={entry.label}
                  className="flex items-start gap-3 rounded-lg border border-[#E2E8F0] bg-white p-3.5 hover:border-[#BFDBFE] hover:shadow-sm transition-all text-left group"
                  onClick={() => navigate(entry.target)}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] group-hover:border-[#BFDBFE] group-hover:text-[#2563EB] group-hover:bg-[#EFF6FF] transition-colors shrink-0">
                    {entry.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">{entry.label}</div>
                    <div className="mt-0.5 text-xs text-[#64748B]">{entry.count}</div>
                    <div className="mt-0.5 text-[11px] text-[#94A3B8]">{entry.insight}</div>
                  </div>
                  <ArrowRight size={14} className="text-[#CBD5E1] group-hover:text-[#2563EB] mt-0.5 shrink-0 transition-colors" />
                </button>
              ))}
            </div>

            {active && <ActionBar />}
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            {/* ── GlobalSituationStrip ── */}
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-px rounded-lg border border-[#E2E8F0] bg-[#E2E8F0] overflow-hidden">
              {[
                { label: '在营资产', value: `${1120 + approvedCount} 户`, trend: '+8', icon: TrendingUp },
                { label: '今日新增预授信', value: `${34 + preCreditCount}`, trend: '+6', icon: Zap },
                { label: '待补审', value: `${reviewCount + 1}`, trend: '', icon: FileCheck2 },
                { label: '风险预警', value: `${riskCount} 笔`, trend: riskSimulated ? '+1' : '', icon: ShieldAlert },
                { label: '恢复观察', value: `${recoveryCount} 户`, trend: '', icon: Eye },
                { label: 'AI 建议数', value: '7', trend: '+3', icon: Sparkles },
              ].map((m) => (
                <div key={m.label} className="bg-white px-3.5 py-2.5">
                  <div className="flex items-center gap-1.5 text-[10px] text-[#94A3B8]">
                    <m.icon size={11} className="text-[#94A3B8]" />
                    {m.label}
                  </div>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-lg font-semibold text-[#0F172A] leading-none">{m.value}</span>
                    {m.trend && (
                      <span className={`text-[10px] font-medium ${m.trend.startsWith('+') ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>{m.trend}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* ── MissionControlPanel + CurrentBattleCard ── */}
            <div className="grid grid-cols-1 xl:grid-cols-[7fr_5fr] gap-4">
              {/* Left: MissionControlPanel */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0]">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#DC2626] animate-pulse" />
                    <span className="text-sm font-semibold text-[#0F172A]">任务中心</span>
                  </div>
                  <Badge className="bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] text-[9px]">
                    {missionTasks.filter((t) => t.priority === 'high').length} 项高优
                  </Badge>
                </div>
                <div className="divide-y divide-[#F1F5F9]">
                  {missionTasks.map((task) => (
                    <button
                      key={task.label}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#F8FAFC] transition-colors text-left"
                      onClick={() => navigate(task.target)}
                    >
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${task.priority === 'high' ? 'bg-[#DC2626]' : task.priority === 'medium' ? 'bg-[#F59E0B]' : 'bg-[#94A3B8]'}`} />
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-medium text-[#0F172A] truncate">{task.label}</div>
                        <div className="text-[10px] text-[#94A3B8]">{task.source}</div>
                      </div>
                      <Badge className={`text-[9px] border shrink-0 ${task.priority === 'high' ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]' : task.priority === 'medium' ? 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]' : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]'}`}>
                        {task.priority === 'high' ? '高优' : task.priority === 'medium' ? '中优' : '常规'}
                      </Badge>
                      <ChevronRight size={12} className="text-[#CBD5E1] shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: CurrentBattleCard */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white">
                <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2E8F0]">
                  <div className="flex items-center gap-2">
                    <Crosshair size={14} className="text-[#2563EB]" />
                    <span className="text-sm font-semibold text-[#0F172A]">当前作战对象</span>
                  </div>
                  <SampleSwitcher selectedId={selectedSampleId} onSelect={selectSample} compact />
                </div>
                <div className="p-4 space-y-3.5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#D6E4FF] bg-[#EFF6FF] text-[#2563EB]">
                      <Building2 size={16} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-[#0F172A] truncate">{currentSample.shortName}</div>
                      <div className="text-[10px] text-[#94A3B8]">{currentSample.roleInChain}</div>
                    </div>
                  </div>

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

                  <div className="rounded-md border border-[#E2E8F0] bg-white px-3 py-2.5">
                    <div className="text-[10px] text-[#94A3B8] mb-0.5">当前判断</div>
                    <div className="text-xs leading-5 text-[#334155]">{judgment}</div>
                  </div>

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

            {/* ── AIInsightStrip ── */}
            <div className="flex items-center gap-3 rounded-lg border border-[#D6E4FF] bg-[#FAFBFF] px-4 py-2.5">
              <div className="flex items-center justify-center w-6 h-6 rounded-md bg-[#2563EB] shrink-0">
                <Sparkles size={12} className="text-white" />
              </div>
              <p className="flex-1 text-xs leading-5 text-[#334155]">
                <span className="font-medium text-[#2563EB]">今日洞察：</span>
                补审队列中 {reviewCount + 1} 户关系强度 &gt; 80%，建议优先处理新能源链样本；{riskCount} 笔预警中回款延迟类占比最高，宁德时代下游需启动集中度复查。
              </p>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-[11px] border-[#BFDBFE] text-[#2563EB] hover:bg-[#EFF6FF] shrink-0"
                onClick={() => navigate('customer-pool')}
              >
                查看详情
              </Button>
            </div>

            {/* ── DomainEntryGrid ── */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {domainEntries.map((entry) => (
                <button
                  key={entry.label}
                  className="flex items-start gap-3 rounded-lg border border-[#E2E8F0] bg-white p-3.5 hover:border-[#BFDBFE] hover:shadow-sm transition-all text-left group"
                  onClick={() => navigate(entry.target)}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] group-hover:border-[#BFDBFE] group-hover:text-[#2563EB] group-hover:bg-[#EFF6FF] transition-colors shrink-0">
                    {entry.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-[#0F172A] group-hover:text-[#2563EB] transition-colors">{entry.label}</div>
                    <div className="mt-0.5 text-xs text-[#64748B]">{entry.count}</div>
                    <div className="mt-0.5 text-[11px] text-[#94A3B8]">{entry.insight}</div>
                  </div>
                  <ArrowRight size={14} className="text-[#CBD5E1] group-hover:text-[#2563EB] mt-0.5 shrink-0 transition-colors" />
                </button>
              ))}
            </div>

            {active && <ActionBar />}
          </div>
        );
    }
  };

  return (
    <SceneLayout
      title={scene.title}
      modules={scene.modules}
      activeModule={activeModule}
      onModuleChange={onModuleChange}
    >
      {renderContent()}
    </SceneLayout>
  );
}
