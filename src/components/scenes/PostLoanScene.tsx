import React from 'react';
import SceneLayout from '../SceneLayout';
import { SCENES } from '../../constants';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Clock3,
  Filter,
  Package,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Wallet,
  Zap,
} from 'lucide-react';
import {
  PageHeader,
  WorkbenchPanel,
  MetricCard,
  FlowRow,
  StatusPill,
  EntitySummaryCard,
  ActionQueueCard,
  MiniTrend,
  InsightStrip,
  TimelineRail,
  AiNote,
  AiJudgmentBlock,
  STATE_COLORS,
  type StateName,
} from '../ProductPrimitives';
import { useDemo } from '../../demo/DemoContext';
import { SceneHero, ActionBar, RiskEventPanel } from '../../demo/DemoComponents';
import { SAMPLE_YUTONG, SAMPLE_CHIYUAN, SAMPLE_RUIXIN, SAMPLE_RUIFENG, SAMPLES } from '../../demo/chainLoan/data';
import { SelectedSampleSummary, SampleSwitcher, PanelCard, InsightCard } from '../ProductPrimitives';
import { TrendLineChart, DonutChart, CHART_COLORS } from '../Charts';

interface PostLoanSceneProps {
  activeModule: string;
  onModuleChange: (id: string) => void;
}

export default function PostLoanScene({ activeModule, onModuleChange }: PostLoanSceneProps) {
  const scene = SCENES.find((item) => item.id === 'post-loan')!;
  const { active, recoveryComplete, completeRecovery, riskSimulated, stage, currentSample, selectSample, selectedSampleId } = useDemo();

  const isPostRisk = riskSimulated || stage === 'risk_alert' || stage === 'post_loan_recovery';
  const recoveryProgress = recoveryComplete ? 100 : isPostRisk ? 72 : 0;
  const currentLimit = recoveryComplete ? currentSample.recommendedLimit : currentSample.currentLimit;

  const currentState: StateName = recoveryComplete ? 'recovery' : isPostRisk ? 'risk' : 'normal';
  const currentStateLabel = recoveryComplete ? '恢复观察' : isPostRisk ? '风险收缩' : '正常经营';
  const currentPhase = recoveryComplete ? '恢复观察期' : isPostRisk ? '风险处置中' : '持续监控';

  const renderContent = () => {
    switch (activeModule) {

      // ─── 客户分层 ────────────────────────────────────────────
      case 'layers': {
        const layers = [
          { name: '健康层', count: 680, pct: '60.7%', state: 'normal' as StateName, definition: '近 3 月回款稳定 & 无预警 & 经营流水持续', strategy: '续贷提额', sample: [
            { name: SAMPLE_YUTONG.companyName, chain: SAMPLE_YUTONG.chainName, limit: SAMPLE_YUTONG.currentLimit },
            { name: SAMPLE_CHIYUAN.companyName, chain: SAMPLE_CHIYUAN.chainName, limit: SAMPLE_CHIYUAN.currentLimit },
          ]},
          { name: '成长层', count: 220, pct: '19.6%', state: 'normal' as StateName, definition: '交易增长 > 20% & 结算频次上升', strategy: '交叉销售', sample: [
            { name: SAMPLE_CHIYUAN.companyName, chain: SAMPLE_CHIYUAN.chainName, limit: SAMPLE_CHIYUAN.currentLimit },
          ]},
          { name: '波动层', count: 150, pct: '13.4%', state: 'watch' as StateName, definition: '触发过预警但未确认不良', strategy: '观察收缩', sample: [
            { name: SAMPLE_RUIXIN.companyName, chain: SAMPLE_RUIXIN.chainName, limit: SAMPLE_RUIXIN.currentLimit },
          ]},
          { name: '恢复层', count: 70, pct: '6.3%', state: 'recovery' as StateName, definition: '预警解除 & 恢复条件部分满足', strategy: '额度恢复', sample: [
            { name: SAMPLE_RUIFENG.companyName, chain: SAMPLE_RUIFENG.chainName, limit: SAMPLE_RUIFENG.currentLimit },
          ]},
        ];
        return (
          <div className="space-y-4">
            {active && <SceneHero question="当前应恢复、观察还是继续经营" />}

            <PageHeader
              title="客户分层管理"
              subtitle={`在营客户: 1,120 户 · 最后评估: 2026-04-08`}
              right={<Button variant="ghost" size="sm" className="h-6 text-[10px] text-[#64748B] gap-1 px-2"><Filter size={10} /> 按层级</Button>}
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {layers.map((l) => {
                const s = STATE_COLORS[l.state];
                return (
                  <Card key={l.name} className={`border ${s.border} ${s.bg}`}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${s.dot}`} />
                        <span className="text-sm font-semibold text-[#0F172A]">{l.name}</span>
                      </div>
                      <div className="mt-3 text-2xl font-bold text-[#0F172A]">{l.count}</div>
                      <div className="text-[11px] text-[#64748B]">占比 {l.pct}</div>
                      <div className="mt-2 rounded-md bg-white/80 border border-[#E2E8F0] px-2.5 py-1.5 text-[11px] text-[#475569]">
                        推荐: {l.strategy}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_0.8fr] gap-4">
              <WorkbenchPanel title="分层定义与推荐动作">
                <div className="space-y-2">
                  {layers.map((l) => (
                    <EntitySummaryCard key={l.name} name={l.name} role={l.definition} state={l.state} stateLabel={l.strategy} />
                  ))}
                </div>
              </WorkbenchPanel>

              <WorkbenchPanel title="本月迁移情况">
                <div className="space-y-2">
                  {[
                    { from: '成长层', to: '健康层', count: 18, up: true },
                    { from: '波动层', to: '成长层', count: 6, up: true },
                    { from: '健康层', to: '波动层', count: 8, up: false },
                    { from: '恢复层', to: '波动层', count: 4, up: true },
                    { from: '波动层', to: '恢复层', count: 12, up: false },
                  ].map((m) => (
                    <div key={`${m.from}-${m.to}`} className="flex items-center justify-between rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-[#475569]">{m.from}</span>
                        <ArrowRight size={12} className={m.up ? 'text-[#16A34A]' : 'text-[#DC2626]'} />
                        <span className="font-medium text-[#0F172A]">{m.to}</span>
                      </div>
                      <span className={`text-xs font-semibold ${m.up ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>{m.count} 户</span>
                    </div>
                  ))}
                </div>
              </WorkbenchPanel>
            </div>

            <WorkbenchPanel
              title="分层客户样本"
              badge={<Badge className="bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] text-[10px]">每层 TOP 样本</Badge>}
            >
              <div className="space-y-3">
                {layers.map((l) => (
                  <div key={l.name}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-2 h-2 rounded-full ${STATE_COLORS[l.state].dot}`} />
                      <span className="text-[11px] font-medium text-[#0F172A]">{l.name}</span>
                      <span className="text-[10px] text-[#94A3B8]">· {l.count} 户</span>
                    </div>
                    <div className="space-y-1.5 pl-4">
                      {l.sample.map((s) => (
                        <EntitySummaryCard key={s.name} name={s.name} role={s.chain} state={l.state} stateLabel={l.strategy} keyValue={s.limit} icon={Building2} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </WorkbenchPanel>

            {active && <ActionBar />}
          </div>
        );
      }

      // ─── 增收动作 ────────────────────────────────────────────
      case 'revenue':
        return (
          <div className="space-y-4">
            {active && <SceneHero question="当前应恢复、观察还是继续经营" />}

            <PageHeader
              title="增收动作"
              subtitle="本月预计贡献: ¥1,240万"
              right={
                <Badge className="bg-[#ECFDF3] text-[#047857] border border-[#A7F3D0] text-[10px] gap-1">
                  <TrendingUp size={10} /> 环比 +8.4%
                </Badge>
              }
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { action: '提额', icon: ArrowUpRight, count: 38, target: '健康层客户', trigger: '经营连续 3 月改善', contribution: '¥420万', tone: 'blue' as const },
                { action: '续贷', icon: RotateCcw, count: 52, target: '健康 + 成长层', trigger: '贷款到期前 30 天', contribution: '¥560万', tone: 'green' as const },
                { action: '交叉销售', icon: Package, count: 24, target: '成长层客户', trigger: '结算沉淀 > 50万', contribution: '¥180万', tone: 'slate' as const },
                { action: '召回', icon: Zap, count: 16, target: '沉睡客户', trigger: '重新出现活跃信号', contribution: '¥80万', tone: 'amber' as const },
              ].map((a) => (
                <MetricCard
                  key={a.action}
                  label={a.action}
                  value={`${a.count} 户`}
                  detail={`预计 ${a.contribution} · ${a.trigger}`}
                  icon={a.icon}
                  tone={a.tone}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_0.8fr] gap-4">
              <WorkbenchPanel title="动作漏斗">
                <div className="space-y-4">
                  {[
                    { stage: '候选池', value: '1,120 户', pct: 100, desc: '全部在营客户' },
                    { stage: '符合动作条件', value: '430 户', pct: 38, desc: '满足提额/续贷/交叉/召回任一条件' },
                    { stage: '已触达', value: '210 户', pct: 19, desc: '客户经理已执行外呼或推送' },
                    { stage: '已转化', value: '130 户', pct: 12, desc: '完成提额/续贷/新产品签约' },
                  ].map((f) => (
                    <div key={f.stage}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-[#0F172A]">{f.stage}</span>
                          <span className="text-xs text-[#64748B]">{f.value}</span>
                        </div>
                        <span className="text-xs font-semibold text-[#2563EB]">{f.pct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
                        <div className="h-full rounded-full bg-[#60A5FA] transition-all" style={{ width: `${f.pct}%` }} />
                      </div>
                      <div className="mt-1 text-[10px] text-[#94A3B8]">{f.desc}</div>
                    </div>
                  ))}
                </div>
              </WorkbenchPanel>

              <div className="space-y-4">
                <WorkbenchPanel title="优先队列">
                  <div className="space-y-2">
                    {[
                      { name: '苏州精微电子', action: '提额', priority: '高', limit: '180万→220万' },
                      { name: '南通远洋纺织', action: '续贷', priority: '高', limit: '150万 续期' },
                      { name: '无锡恒信五金', action: '交叉销售', priority: '中', limit: '现金管理+' },
                      { name: '镇江顺达物流', action: '召回', priority: '中', limit: '45万 重激活' },
                    ].map((q) => (
                      <ActionQueueCard key={q.name} action={q.name} source={q.limit} priority={q.priority} sla={q.action} />
                    ))}
                  </div>
                </WorkbenchPanel>

                <WorkbenchPanel title="贡献结构">
                  <div className="space-y-3">
                    <FlowRow label="利息收入" value="¥860万 (69%)" percentage={69} />
                    <FlowRow label="手续费" value="¥210万 (17%)" percentage={17} />
                    <FlowRow label="结算沉淀利差" value="¥170万 (14%)" percentage={14} />
                  </div>
                </WorkbenchPanel>
              </div>
            </div>

            {active && <ActionBar />}
          </div>
        );

      // ─── 动作模板 ────────────────────────────────────────────
      case 'playbook':
        return (
          <div className="space-y-4">
            {active && <SceneHero question="当前应恢复、观察还是继续经营" />}

            <PageHeader
              title="经营策略模板库"
              subtitle="模板总数: 4 个 · 已启用: 3 个"
              right={
                <>
                  <Button variant="ghost" size="sm" className="h-6 text-[10px] text-[#64748B] gap-1 px-2"><Search size={10} /> 搜索</Button>
                  <Button variant="ghost" size="sm" className="h-6 text-[10px] text-[#64748B] gap-1 px-2"><Filter size={10} /> 筛选</Button>
                </>
              }
            />

            <div className="space-y-4">
              {[
                {
                  name: '提额模板', status: '已启用', state: 'normal' as StateName,
                  applicableLayer: '健康层', trigger: '经营连续 3 个月改善 & 回款周期缩短',
                  steps: ['系统自动识别提额候选客户', '生成提额建议（额度 + 幅度）', '客户经理确认后执行'],
                  sla: '识别 → 执行 < 3 个工作日', lastUpdated: '2026-03-20', owner: '零售风控部',
                },
                {
                  name: '续贷模板', status: '已启用', state: 'normal' as StateName,
                  applicableLayer: '健康 + 成长层', trigger: '贷款到期前 30 天 & 分层 ∈ 健康/成长',
                  steps: ['自动推送续贷提醒', '重新评估经营数据', '一键续贷或人工确认'],
                  sla: '评估 → 审批 < 2 个工作日', lastUpdated: '2026-03-22', owner: '信贷运营部',
                },
                {
                  name: '召回模板', status: '已启用', state: 'normal' as StateName,
                  applicableLayer: '沉睡客户', trigger: '沉睡客户重新出现活跃信号',
                  steps: ['监测到新订单或结算活跃', '生成召回推荐任务', '客户经理外呼并评估'],
                  sla: '信号出现 → 触达 < 5 个工作日', lastUpdated: '2026-04-01', owner: '客户经营部',
                },
                {
                  name: '恢复观察模板', status: '灰度中', state: 'watch' as StateName,
                  applicableLayer: '恢复层', trigger: '风险缓解 & 恢复条件部分满足',
                  steps: ['进入恢复观察池', '持续 30 天无新增异常', '自动恢复部分额度'],
                  sla: '满足条件 → 恢复 30 天观察期', lastUpdated: '2026-04-05', owner: '零售风控部',
                },
              ].map((tmpl) => (
                <Card key={tmpl.name} className="border border-[#E5E7EB]">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-semibold text-[#0F172A]">{tmpl.name}</span>
                        <StatusPill state={tmpl.state} label={tmpl.status} />
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-[#94A3B8]">
                        <span>适用: {tmpl.applicableLayer}</span>
                        <span>SLA: {tmpl.sla}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4 mb-3">
                      <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5">
                        <div className="text-[10px] text-[#94A3B8] uppercase tracking-wide">触发条件</div>
                        <div className="mt-1 text-xs text-[#334155]">{tmpl.trigger}</div>
                      </div>
                      <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5">
                        <div className="text-[10px] text-[#94A3B8] uppercase tracking-wide">治理信息</div>
                        <div className="mt-1 text-xs text-[#334155]">更新: {tmpl.lastUpdated} · 负责人: {tmpl.owner}</div>
                      </div>
                      <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5 flex items-center">
                        <Badge className="bg-[#F1F5F9] text-[#475569] border-transparent text-[10px]">{tmpl.applicableLayer}</Badge>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {tmpl.steps.map((step, idx) => (
                        <div key={step} className="flex-1 rounded-lg border border-[#E2E8F0] bg-white p-3">
                          <div className="flex items-center gap-1.5">
                            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-[#EFF6FF] text-[#1890FF] text-[10px] font-medium shrink-0">
                              {idx + 1}
                            </div>
                            <span className="text-[11px] font-medium text-[#0F172A]">步骤 {idx + 1}</span>
                          </div>
                          <div className="mt-1.5 text-[11px] text-[#64748B] leading-4">{step}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {active && <ActionBar />}
          </div>
        );

      // ─── 贷后总览 (default) ──────────────────────────────────
      default:
        return (
          <div className="space-y-4">
            {active && <SceneHero question="当前应恢复、观察还是继续经营" />}

            {/* 贷后经营流程条 */}
            <div className="flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-white px-4 py-3">
              {['持续监控', '风险识别', '额度收缩', '恢复观察（30天）', '续贷评估'].map((step, i) => {
                const done = i === 0 ? true : i === 1 ? isPostRisk : i === 2 ? isPostRisk : i === 3 ? recoveryComplete : false;
                const isActive = !isPostRisk ? i === 0 : recoveryComplete ? i === 4 : isPostRisk && !recoveryComplete ? i === 2 : false;
                return (
                  <React.Fragment key={step}>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium ${done ? 'bg-[#ECFDF3] text-[#047857]' : isActive ? 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]' : 'text-[#94A3B8]'}`}>
                      <span className={`w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold ${done ? 'bg-[#047857] text-white' : isActive ? 'bg-[#2563EB] text-white' : 'bg-[#E2E8F0] text-[#94A3B8]'}`}>{done ? '✓' : i + 1}</span>
                      {step}
                    </div>
                    {i < 4 && <div className={`flex-1 h-px ${done ? 'bg-[#047857]' : 'bg-[#E2E8F0]'}`} />}
                  </React.Fragment>
                );
              })}
            </div>

            <div className="flex items-center justify-between">
              <SelectedSampleSummary sample={currentSample} />
              <SampleSwitcher selectedId={selectedSampleId} onSelect={selectSample} compact />
            </div>

            {!isPostRisk ? (
              <>
                <PageHeader
                  title="客户经营状态"
                  subtitle={`当前主体: ${currentSample.shortName}`}
                  right={<StatusPill state="normal" label={currentStateLabel} />}
                />

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <MetricCard label="当前主体" value={currentSample.shortName} detail={`${currentSample.roleInChain} · ${currentSample.chainName}`} icon={Building2} tone="slate" />
                  <MetricCard label="当前额度" value={currentLimit} detail={`授信额度正常 · ${currentSample.productType}`} icon={Wallet} tone="green" />
                  <MetricCard label="经营状态" value={currentSample.riskStatus} detail={`${currentSample.logisticsStatus} · ${currentSample.riskFlags.length === 0 ? '无预警' : currentSample.riskFlags.join('、')}`} icon={Activity} tone={currentSample.riskStatus === '正常' ? 'green' : 'amber'} />
                  <MetricCard label="当前阶段" value={currentPhase} detail={currentSample.nextAction} icon={Clock3} tone="slate" />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-[1fr_0.8fr] gap-4">
                  <WorkbenchPanel title={`经营健康看板 · ${currentSample.shortName}`}>
                    <div className="space-y-2">
                      {[
                        { label: '回款周期', value: currentSample.avgReceivableCycle, trend: parseInt(currentSample.avgReceivableCycle) <= 35 ? '正常' : '偏长', good: parseInt(currentSample.avgReceivableCycle) <= 35, bar: Math.max(20, 100 - parseInt(currentSample.avgReceivableCycle)) },
                        { label: '物流履约', value: currentSample.logisticsStatus, trend: currentSample.logisticsStatus.includes('正常') || currentSample.logisticsStatus.includes('稳定') ? '稳定' : '波动', good: !currentSample.logisticsStatus.includes('延迟'), bar: currentSample.logisticsStatus.includes('正常') || currentSample.logisticsStatus.includes('稳定') ? 95 : 55 },
                        { label: '对公账户活跃', value: currentSample.accountFlowStatus, trend: currentSample.accountFlowStatus.includes('流入') ? '健康' : '需关注', good: currentSample.accountFlowStatus.includes('流入') || currentSample.accountFlowStatus.includes('稳定'), bar: currentSample.accountFlowStatus.includes('流入') || currentSample.accountFlowStatus.includes('稳定') ? 80 : 40 },
                        { label: '预警状态', value: currentSample.riskFlags.length === 0 ? '未触发任何规则' : `${currentSample.riskFlags.length} 条命中`, trend: currentSample.riskFlags.length === 0 ? '安全' : '关注', good: currentSample.riskFlags.length === 0, bar: currentSample.riskFlags.length === 0 ? 100 : Math.max(20, 100 - currentSample.riskFlags.length * 25) },
                      ].map((m) => (
                        <div key={m.label} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-medium text-[#0F172A]">{m.label}</span>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-[#64748B]">{m.value}</span>
                              <Badge className={`text-[10px] ${m.good ? 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]' : 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]'}`}>{m.trend}</Badge>
                            </div>
                          </div>
                          <div className="h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
                            <div className="h-full rounded-full bg-[#86EFAC] transition-all" style={{ width: `${m.bar}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </WorkbenchPanel>

                  <div className="space-y-4">
                    <WorkbenchPanel title="当前关注">
                      <div className="space-y-2">
                        {[
                          { item: '续贷观察', detail: '贷款到期日 2026-08-15 · 可提前 30 天触发', status: '正常' },
                          { item: '提额机会', detail: '经营连续改善 2 个月 · 尚差 1 个月', status: '观察' },
                          { item: '风险观察', detail: '无异常信号 · 所有规则未命中', status: '安全' },
                          { item: '客户经理跟进', detail: '最近拜访 2026-03-28 · 建议 Q2 跟进', status: '待跟进' },
                        ].map((a) => (
                          <div key={a.item} className="rounded-lg border border-[#E2E8F0] bg-white px-3 py-2.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-[#0F172A]">{a.item}</span>
                              <Badge className="bg-[#F1F5F9] text-[#475569] border-transparent text-[10px]">{a.status}</Badge>
                            </div>
                            <div className="mt-1 text-[10px] text-[#94A3B8]">{a.detail}</div>
                          </div>
                        ))}
                      </div>
                    </WorkbenchPanel>

                    <WorkbenchPanel title="下一动作">
                      <div className="space-y-2">
                        <ActionQueueCard action="持续监控经营指标" source="系统自动" sla="进行中" />
                        <ActionQueueCard action="Q2 客户经理拜访" source="客户经理" sla="待安排" />
                        <ActionQueueCard action="续贷评估 T-30天" source="系统触发" sla="2026-07-15" />
                      </div>
                    </WorkbenchPanel>
                  </div>
                </div>

                <AiJudgmentBlock
                  judgment={`${currentSample.shortName}${currentSample.riskFlags.length === 0 ? '经营稳定，建议维持监控频率' : `存在 ${currentSample.riskFlags.length} 项关注，建议加密监控`}`}
                  basis={currentSample.riskFlags.length === 0
                    ? ['各项经营指标正常', '物流履约稳定', '回款周期在合理范围']
                    : currentSample.riskFlags.map(f => `风险信号：${f}`)}
                  confidence={currentSample.agentHints.confidence}
                  action={currentSample.riskFlags.length === 0 ? 'Q3 评估提额' : currentSample.agentHints.suggestedAction}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <WorkbenchPanel title="近 30 天经营轨迹" icon={Activity}>
                    <TrendLineChart
                      data={[
                        { name: 'W1', orders: 8, payments: 32 },
                        { name: 'W2', orders: 6, payments: 28 },
                        { name: 'W3', orders: 9, payments: 36 },
                        { name: 'W4', orders: 7, payments: 31 },
                      ]}
                      lines={[
                        { key: 'orders', color: CHART_COLORS.blue, label: '订单(笔)' },
                        { key: 'payments', color: CHART_COLORS.emerald, label: '回款(万)' },
                      ]}
                      height={160}
                    />
                  </WorkbenchPanel>

                  <WorkbenchPanel title="关键事件时间轴" icon={Clock3}>
                    <TimelineRail items={[
                      { date: '2026-01-15', title: '授信批准 · 额度 120万', done: true },
                      { date: '2026-02-10', title: '首笔放款 ¥45万', done: true },
                      { date: '2026-03-05', title: '回款正常 · 经营评估通过', done: true },
                      { date: '2026-03-28', title: '客户经理拜访 · 经营稳定', done: true },
                    ]} />
                  </WorkbenchPanel>

                  <WorkbenchPanel title="经营建议" icon={Sparkles}>
                    <div className="space-y-2">
                      {[
                        { advice: '保持当前监控频率，无需加密', priority: '维持' },
                        { advice: '可考虑 Q3 提额评估 (+30万)', priority: '建议' },
                        { advice: '推荐现金管理产品交叉销售', priority: '机会' },
                      ].map((a) => (
                        <div key={a.advice} className="rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-[#334155]">{a.advice}</span>
                            <Badge className="bg-[#F1F5F9] text-[#475569] border-transparent text-[10px]">{a.priority}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </WorkbenchPanel>
                </div>
              </>
            ) : (
              <>
                <PageHeader
                  title="客户经营状态"
                  subtitle={`当前主体: ${currentSample.shortName}`}
                  right={<StatusPill state={currentState} label={currentStateLabel} />}
                />

                {riskSimulated && <RiskEventPanel />}

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <MetricCard label="当前主体" value={currentSample.shortName} detail="风险后恢复经营对象" icon={Building2} tone="slate" />
                  <MetricCard label="当前额度" value={recoveryComplete ? `${Math.round(parseInt(currentSample.recommendedLimit) * 0.9)}万` : currentLimit} detail={recoveryComplete ? `恢复至原额度 90%（原 ${currentSample.recommendedLimit}），30天观察期` : '风险触发后额度收缩'} icon={Wallet} tone={recoveryComplete ? 'green' : 'amber'} />
                  <MetricCard label="经营状态" value={recoveryComplete ? '恢复观察中' : '风险收缩'} detail={recoveryComplete ? '30天观察期内，尚未回归正常经营' : '回款异常 · 额度已调降'} icon={recoveryComplete ? ShieldCheck : ShieldAlert} tone={recoveryComplete ? 'amber' : 'red'} />
                  <MetricCard label="当前阶段" value={currentPhase} detail={recoveryComplete ? '恢复观察中 · 观察期满后方可评估全额恢复' : '等待恢复条件满足'} icon={Clock3} tone="slate" />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-4">
                  <Card className={`border ${recoveryComplete ? 'border-[#BBF7D0]' : 'border-[#E2E8F0]'}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base flex items-center gap-2">
                          <RotateCcw size={18} className={recoveryComplete ? 'text-[#16A34A]' : 'text-[#1890FF]'} />
                          信用修复进度
                        </CardTitle>
                        {active && !recoveryComplete && (
                          <Button className="bg-[#16A34A] hover:bg-[#15803D]" onClick={completeRecovery}>进入恢复观察</Button>
                        )}
                        {active && recoveryComplete && (
                          <StatusPill state="normal" label="演示完成" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <div className="text-xs text-[#64748B]">恢复进度</div>
                            <div className="mt-2 text-4xl font-bold tracking-tight text-[#0F172A]">{recoveryProgress}%</div>
                          </div>
                          <StatusPill state={recoveryComplete ? 'normal' : 'watch'} label={recoveryComplete ? '恢复条件已满足' : '仍在观察期'} />
                        </div>
                        <div className="mt-4 h-3 overflow-hidden rounded-full bg-[#E2E8F0]">
                          <div className={`h-full rounded-full transition-all duration-500 ${recoveryComplete ? 'bg-[#16A34A]' : 'bg-[#1890FF]'}`} style={{ width: `${recoveryProgress}%` }} />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="text-[10px] text-[#94A3B8] uppercase tracking-wider">恢复评估三维度</div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          {[
                            { dim: '经营信号是否修复', items: ['补充 2 笔真实订单', '回款归集满 7 天'], status: recoveryComplete ? '已修复' : '修复中' },
                            { dim: '敞口是否恢复', items: [`恢复至原额度 90%（${Math.round(parseInt(currentSample.recommendedLimit) * 0.9)}万）`, '30天观察期'], status: recoveryComplete ? '已恢复（观察中）' : '待恢复' },
                            { dim: '是否回归正常经营', items: ['物流签收恢复正常', '无新增风险信号'], status: recoveryComplete ? '观察期内' : '待确认' },
                          ].map((d) => (
                            <div key={d.dim} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                              <div className="text-[11px] font-medium text-[#0F172A] mb-2">{d.dim}</div>
                              {d.items.map(item => (
                                <div key={item} className="flex items-center gap-1.5 text-[10px] text-[#64748B] mb-1">
                                  <div className={`w-1.5 h-1.5 rounded-full ${recoveryComplete ? 'bg-[#16A34A]' : 'bg-[#F59E0B]'}`} />
                                  {item}
                                </div>
                              ))}
                              <div className={`mt-2 text-xs font-semibold ${recoveryComplete ? 'text-[#16A34A]' : 'text-[#C2410C]'}`}>{d.status}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="rounded-xl border border-[#E2E8F0] bg-white p-4">
                        <div className="text-sm font-semibold text-[#0F172A] mb-3">从预警到恢复的时间轴</div>
                        <TimelineRail items={[
                          { date: '2026-05-12', title: '触发风险预警', desc: `${currentSample.riskFlags.length > 0 ? currentSample.riskFlags.slice(0, 2).join(' + ') : '经营波动'} · 额度收缩至 ${currentSample.currentLimit}`, icon: ShieldAlert, done: true },
                          { date: '2026-05-18', title: '补充经营材料', desc: '客户补传新订单与运输回单 · 人工复核后进入恢复观察', icon: ShieldCheck, done: true },
                          { date: '2026-05-29', title: recoveryComplete ? '进入恢复观察（30天）' : '等待恢复条件', desc: recoveryComplete ? `恢复至原额度 90%（${Math.round(parseInt(currentSample.recommendedLimit) * 0.9)}万），观察期满后评估全额恢复` : '恢复条件尚未全部满足', icon: Sparkles, done: recoveryComplete },
                        ]} />
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-4">
                    <AiJudgmentBlock
                      judgment={recoveryComplete ? `恢复条件已满足，额度恢复至原额度 90%（${Math.round(parseInt(currentSample.recommendedLimit) * 0.9)}万），进入 30 天观察期` : `恢复进度 ${recoveryProgress}%，仍需观察`}
                      basis={recoveryComplete
                        ? ['回款周期恢复正常', '物流签收恢复稳定', '账户流水净流入']
                        : ['部分恢复条件尚未满足', '需持续观察经营数据', '分阶段恢复 + 观察期策略']}
                      confidence={recoveryComplete ? 91 : currentSample.agentHints.confidence}
                      action={recoveryComplete ? '观察期满后评估全额恢复' : currentSample.agentHints.suggestedAction}
                    />
                    <WorkbenchPanel title="恢复信号">
                      <div className="space-y-2">
                        {[currentSample.logisticsStatus, currentSample.accountFlowStatus, ...currentSample.riskFlags].filter(Boolean).map((signal) => (
                          <div key={signal} className="flex items-start gap-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                            <CheckCircle2 size={14} className={`mt-0.5 shrink-0 ${recoveryComplete ? 'text-[#16A34A]' : 'text-[#1890FF]'}`} />
                            <span className="text-xs text-[#334155] leading-5">{signal}</span>
                          </div>
                        ))}
                      </div>
                    </WorkbenchPanel>

                    <WorkbenchPanel title="下一步经营动作">
                      <div className="space-y-2">
                        {[currentSample.nextAction, currentSample.agentHints.suggestedAction].filter(Boolean).map((action) => (
                          <ActionQueueCard key={action} action={action} source="系统推荐" />
                        ))}
                      </div>
                    </WorkbenchPanel>
                  </div>
                </div>
              </>
            )}

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
