import React from 'react';
import SceneLayout from '../SceneLayout';
import { SCENES } from '../../constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Building2,
  Eye,
  FileCheck2,
  Filter,
  Layers,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  PageHeader,
  WorkbenchPanel,
  MetricCard,
  FlowRow,
  EntitySummaryCard,
  ActionQueueCard,
  MiniTrend,
  InsightStrip,
  AiNote,
  SelectedSampleSummary,
} from '../ProductPrimitives';
import { useDemo, STAGE_ORDER } from '../../demo/DemoContext';
import { DemoStepper, CaseSummaryCard, ActionBar } from '../../demo/DemoComponents';
import { SAMPLES, SAMPLE_HENGYUAN, SAMPLE_CHIYUAN, SAMPLE_JIALI, SAMPLE_RUIXIN, SAMPLE_RUIFENG } from '../../demo/chainLoan/data';

interface AssetPoolSceneProps {
  activeModule: string;
  onModuleChange: (id: string) => void;
}

export default function AssetPoolScene({ activeModule, onModuleChange }: AssetPoolSceneProps) {
  const scene = SCENES.find((item) => item.id === 'asset-pool')!;
  const { active, stage, stageIndex, riskSimulated, recoveryComplete, currentSample, selectSample, selectedSampleId } = useDemo();
  const isHengyuan = currentSample.id === SAMPLE_HENGYUAN.id;

  const isPastPreCredit = stageIndex >= STAGE_ORDER.indexOf('pre_credit');
  const isPastApproval = stageIndex >= STAGE_ORDER.indexOf('approved');

  const renderContent = () => {
    switch (activeModule) {
      // ─── 预授信池 ────────────────────────────────────────────
      case 'pre-credit':
        return (
          <div className="space-y-4">
            {active && <DemoStepper />}
            {active && <CaseSummaryCard />}

            <PageHeader
              title="预授信池"
              subtitle="数据口径: 近 30 天 · 最后更新: 2026-04-09 08:15"
              right={
                <>
                  <Button variant="ghost" size="sm" className="h-6 text-[10px] text-[#64748B] gap-1 px-2"><Search size={10} /> 搜索</Button>
                  <Button variant="ghost" size="sm" className="h-6 text-[10px] text-[#64748B] gap-1 px-2"><Filter size={10} /> 筛选</Button>
                </>
              }
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <MetricCard label="池内总量" value="3,260 户" detail="本周新增 86 户" tone="blue" />
              <MetricCard label="推荐额度中位数" value="95万" detail="P25: 50万 · P75: 165万" tone="green" />
              <MetricCard label="待触达" value="1,420 户" detail="尚未进入产品匹配" tone="amber" />
              <MetricCard label="已转化" value="1,120 户" detail="累计转化率 34.4%" tone="green" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_0.8fr] gap-4">
              <WorkbenchPanel title="推荐额度分布">
                <div className="space-y-3">
                  <FlowRow label="50万以下" value="860 户 (26%)" percentage={26} />
                  <FlowRow label="50万 - 100万" value="1,080 户 (33%)" percentage={33} />
                  <FlowRow label="100万 - 200万" value="920 户 (28%)" percentage={28} />
                  <FlowRow label="200万以上" value="400 户 (13%)" percentage={13} />
                </div>
              </WorkbenchPanel>

              <WorkbenchPanel title="产品匹配分布">
                <div className="space-y-2">
                  {[
                    { product: '订单微贷', count: '1,240', pct: 38, color: 'bg-[#2563EB]' },
                    { product: '税票流水贷', count: '980', pct: 30, color: 'bg-[#7C3AED]' },
                    { product: '经营信用贷', count: '660', pct: 20, color: 'bg-[#047857]' },
                    { product: '场景专项贷', count: '380', pct: 12, color: 'bg-[#C2410C]' },
                  ].map((p) => (
                    <div key={p.product} className="flex items-center justify-between rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${p.color}`} />
                        <span className="text-xs font-medium text-[#0F172A]">{p.product}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-[#64748B]">{p.count} 户</span>
                        <span className="text-xs font-semibold text-[#0F172A]">{p.pct}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </WorkbenchPanel>
            </div>

            {active && isPastPreCredit && (
              <InsightStrip tone="info">
                当前样本 — <strong>{currentSample.shortName}</strong> {currentSample.approvalStatus}，额度 {currentSample.currentLimit} · {currentSample.productType}
                {isPastApproval && isHengyuan && ' · 已批准'}
              </InsightStrip>
            )}

            <WorkbenchPanel
              title="预授信候选客户"
              badge={<Badge className="bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] text-[10px]">TOP 5 · 按触达优先级</Badge>}
            >
              <div className="space-y-2">
                {SAMPLES.map((s) => {
                  const state = s.uiState.badgeTone === 'blue' ? 'info' as const : s.uiState.badgeTone === 'green' ? 'normal' as const : s.uiState.badgeTone === 'amber' ? 'watch' as const : s.uiState.badgeTone === 'red' ? 'risk' as const : 'info' as const;
                  const priority = s.uiState.priority === 'high' ? '高' : s.uiState.priority === 'medium' ? '中' : '低';
                  return (
                    <EntitySummaryCard
                      key={s.id}
                      name={s.companyName}
                      role={s.chainName}
                      state={state}
                      stateLabel={s.approvalStatus}
                      keyValue={s.recommendedLimit}
                      icon={Building2}
                      onClick={() => selectSample(s.id)}
                      selected={s.id === selectedSampleId}
                    >
                      <div className="mt-2 flex items-center justify-between">
                        <div className="text-[11px] text-[#64748B] flex items-center gap-1">
                          <Eye size={10} className="text-[#94A3B8]" />
                          {s.aiSummary.slice(0, 20)}…
                        </div>
                        <div className="flex gap-1">
                          <Badge className="bg-[#F1F5F9] text-[#475569] border-transparent text-[10px]">优先级: {priority}</Badge>
                          <Badge className="bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE] text-[10px]">{s.nextAction}</Badge>
                        </div>
                      </div>
                    </EntitySummaryCard>
                  );
                })}
              </div>
            </WorkbenchPanel>

            {active && <ActionBar />}
          </div>
        );

      // ─── 补审队列 ────────────────────────────────────────────
      case 'review':
        return (
          <div className="space-y-4">
            {active && <DemoStepper />}
            {active && <CaseSummaryCard />}

            <PageHeader
              title="补审队列"
              subtitle={`待处理: 68 户 · 本周完成: 24 户`}
              right={<Button variant="ghost" size="sm" className="h-6 text-[10px] text-[#64748B] gap-1 px-2"><Filter size={10} /> 按优先级</Button>}
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <MetricCard label="待补审" value="68 户" detail="高优 18 · 普通 32 · 待补材料 18" tone="amber" />
              <MetricCard label="本周通过" value="24 户" detail="通过率 77.4%" tone="green" />
              <MetricCard label="本周退回" value="7 户" detail="主要原因: 材料不足" tone="red" />
              <MetricCard label="平均处理时长" value="1.8 天" detail="较上周 -0.3 天" tone="blue" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_0.8fr] gap-4">
              <WorkbenchPanel title="补审原因分布">
                <div className="space-y-3">
                  <FlowRow label="脱核场景 · 未获链主确权" value="28 户 (41%)" percentage={41} />
                  <FlowRow label="集中度超阈值 · 需人工判断" value="14 户 (21%)" percentage={21} />
                  <FlowRow label="回款路径不完整 · 待补材料" value="12 户 (18%)" percentage={18} />
                  <FlowRow label="经营年限不足 · 灰度验证" value="8 户 (12%)" percentage={12} />
                  <FlowRow label="其他规则触发" value="6 户 (8%)" percentage={8} />
                </div>
              </WorkbenchPanel>

              <WorkbenchPanel title="待办动作">
                <div className="space-y-2">
                  {[
                    { action: '查看证据链并确认', source: '审批岗', priority: '高优', sla: '18 户' },
                    { action: '补充经营材料后复审', source: '客户经理', priority: '待补', sla: '18 户' },
                    { action: '人工判断集中度风险', source: '审批岗', priority: '普通', sla: '14 户' },
                    { action: '灰度样本跟踪观察', source: '系统', priority: '低', sla: '8 户' },
                    { action: '退回后补充再提交', source: '客户经理', priority: '回流', sla: '10 户' },
                  ].map((a) => (
                    <ActionQueueCard key={a.action} action={a.action} source={a.source} priority={a.priority} sla={a.sla} />
                  ))}
                </div>
              </WorkbenchPanel>
            </div>

            {active && isPastPreCredit && (
              <InsightStrip tone={isPastApproval ? 'normal' : 'watch'}>
                当前样本 — <strong>{currentSample.shortName}</strong> · {isPastApproval && isHengyuan ? '补审已通过' : currentSample.approvalStatus}
              </InsightStrip>
            )}

            <WorkbenchPanel
              title="补审样本列表"
              actions={
                <div className="flex gap-1">
                  {['高优先级', '普通', '待补材料'].map((g) => (
                    <Badge key={g} className="bg-[#F1F5F9] text-[#475569] border-transparent text-[10px] cursor-pointer hover:bg-[#E2E8F0]">{g}</Badge>
                  ))}
                </div>
              }
            >
              <div className="space-y-2">
                {([
                  { sample: SAMPLE_HENGYUAN, status: isPastApproval && isHengyuan ? '已通过' : '高优待审', state: (isPastApproval && isHengyuan ? 'normal' : 'watch') as 'normal' | 'watch' },
                  { sample: SAMPLE_RUIXIN, status: '高优待审', state: 'watch' as const },
                  { sample: SAMPLE_JIALI, status: '待补材料', state: 'muted' as const },
                  { sample: SAMPLE_CHIYUAN, status: '产品匹配', state: 'info' as const },
                  { sample: SAMPLE_RUIFENG, status: '恢复中', state: 'risk' as const },
                ]).map((c) => (
                  <EntitySummaryCard key={c.sample.id} name={c.sample.companyName} role={c.sample.chainName} state={c.state} stateLabel={c.status} keyValue={c.sample.recommendedLimit} icon={Building2} onClick={() => selectSample(c.sample.id)} selected={c.sample.id === selectedSampleId}>
                    <div className="mt-2 text-[11px] text-[#64748B] flex items-center gap-1">
                      <FileCheck2 size={10} className="text-[#94A3B8]" />
                      {c.sample.reviewReason.slice(0, 18)}…
                    </div>
                  </EntitySummaryCard>
                ))}
              </div>
            </WorkbenchPanel>

            {active && <ActionBar />}
          </div>
        );

      // ─── 在营资产 ────────────────────────────────────────────
      case 'activated':
        return (
          <div className="space-y-4">
            {active && <DemoStepper />}
            {active && <CaseSummaryCard />}

            <PageHeader
              title="在营资产"
              subtitle={`资产总量: 1,120 户 · 在营余额: ¥12.8亿`}
              right={<Button variant="ghost" size="sm" className="h-6 text-[10px] text-[#64748B] gap-1 px-2"><Search size={10} /> 搜索</Button>}
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <MetricCard label="正常经营" value="892 户" detail="占比 79.6% · 经营健康" tone="green" />
              <MetricCard label="观察中" value="138 户" detail="占比 12.3% · 波动待稳" tone="amber" />
              <MetricCard label="已收缩" value="62 户" detail="占比 5.5% · 额度已调降" tone="red" />
              <MetricCard label="待恢复" value="28 户" detail="占比 2.5% · 恢复条件待满足" tone="slate" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_0.8fr] gap-4">
              <WorkbenchPanel title="在营资产结构">
                <div className="space-y-3">
                  <FlowRow label="内部存量转化资产" value="¥4.86亿 (38%)" percentage={38} />
                  <FlowRow label="标准数据授信资产" value="¥5.25亿 (41%)" percentage={41} />
                  <FlowRow label="长尾场景金融资产" value="¥2.69亿 (21%)" percentage={21} />
                  <div className="pt-2 border-t border-[#E2E8F0]">
                    <div className="text-[10px] text-[#94A3B8] uppercase tracking-wide mb-2">产品分布</div>
                    <div className="space-y-2">
                      <FlowRow label="订单微贷" value="¥3.84亿 (30%)" percentage={30} />
                      <FlowRow label="税票流水贷" value="¥4.48亿 (35%)" percentage={35} />
                      <FlowRow label="经营信用贷" value="¥2.56亿 (20%)" percentage={20} />
                      <FlowRow label="场景专项贷" value="¥1.92亿 (15%)" percentage={15} />
                    </div>
                  </div>
                </div>
              </WorkbenchPanel>

              <div className="space-y-4">
                <WorkbenchPanel title="资产健康度">
                  <div className="space-y-2">
                    <MiniTrend label="不良率" value="0.82%" trend="-0.05%" good />
                    <MiniTrend label="关注类占比" value="2.41%" trend="-0.18%" good />
                    <MiniTrend label="逾期 30+ 天" value="0.34%" trend="+0.02%" good={false} />
                    <MiniTrend label="平均回款周期" value="36 天" trend="-1 天" good />
                  </div>
                </WorkbenchPanel>

                <WorkbenchPanel title="风险观察" icon={ShieldAlert}>
                  <div className="space-y-2">
                    {[
                      { signal: '回款周期拉长 > 40%', count: 8, severity: '高' },
                      { signal: '对公账户连续净流出', count: 5, severity: '高' },
                      { signal: '集中度上升需关注', count: 14, severity: '中' },
                      { signal: '物流频次下降', count: 11, severity: '低' },
                    ].map((r) => (
                      <div key={r.signal} className="flex items-center justify-between rounded-lg border border-[#E2E8F0] bg-white px-3 py-2.5">
                        <div className="flex items-center gap-2 min-w-0">
                          <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${r.severity === '高' ? 'bg-[#DC2626]' : r.severity === '中' ? 'bg-[#F59E0B]' : 'bg-[#94A3B8]'}`} />
                          <span className="text-xs text-[#334155] truncate">{r.signal}</span>
                        </div>
                        <span className="text-xs font-semibold text-[#0F172A] shrink-0">{r.count} 户</span>
                      </div>
                    ))}
                  </div>
                </WorkbenchPanel>
              </div>
            </div>

            {active && isPastApproval && (
              <InsightStrip tone={(riskSimulated && isHengyuan) ? 'risk' : 'normal'}>
                当前样本 — <strong>{currentSample.shortName}</strong> ·
                在营额度: {(riskSimulated && isHengyuan) ? (recoveryComplete ? '108万 (已恢复 90%)' : '96万 (已收缩 20%)') : currentSample.currentLimit}
                {riskSimulated ? (recoveryComplete ? ' · 恢复观察中' : ' · 风险收缩中') : ' · 正常经营'}
              </InsightStrip>
            )}

            

            <WorkbenchPanel
              title="在营客户样本"
              badge={<Badge className="bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] text-[10px]">按额度排序 · TOP 5</Badge>}
            >
              <div className="space-y-2">
                {([
                  { sample: SAMPLE_RUIXIN, status: SAMPLE_RUIXIN.approvalStatus, state: 'watch' as const, limit: SAMPLE_RUIXIN.currentLimit },
                  { sample: SAMPLE_HENGYUAN, status: (riskSimulated && isHengyuan) ? '已收缩' : '正常经营', state: ((riskSimulated && isHengyuan) ? 'risk' : 'normal') as 'risk' | 'normal', limit: (riskSimulated && isHengyuan) ? '96万' : SAMPLE_HENGYUAN.currentLimit },
                  { sample: SAMPLE_CHIYUAN, status: '正常经营', state: 'normal' as const, limit: SAMPLE_CHIYUAN.currentLimit },
                  { sample: SAMPLE_RUIFENG, status: SAMPLE_RUIFENG.approvalStatus, state: 'risk' as const, limit: SAMPLE_RUIFENG.currentLimit },
                ]).map((c) => (
                  <EntitySummaryCard key={c.sample.id} name={c.sample.companyName} role={c.sample.chainName} state={c.state} stateLabel={c.status} keyValue={c.limit} icon={Building2} onClick={() => selectSample(c.sample.id)} selected={c.sample.id === selectedSampleId} />
                ))}
              </div>
            </WorkbenchPanel>

            {active && <ActionBar />}
          </div>
        );

      // ─── 转化看板 (default) ──────────────────────────────────
      default:
        return (
          <div className="space-y-4">
            {active && <DemoStepper />}
            {active && <CaseSummaryCard />}

            {/* 资产流程条 */}
            <div className="flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-white px-4 py-3">
              {['识别', '预授信', '补审', '在营'].map((step, i) => {
                const done = stageIndex >= STAGE_ORDER.indexOf(['identified', 'pre_credit', 'manual_review', 'approved'][i] as typeof stage);
                const isActive = i === (stageIndex >= STAGE_ORDER.indexOf('approved') ? 3 : stageIndex >= STAGE_ORDER.indexOf('manual_review') ? 2 : stageIndex >= STAGE_ORDER.indexOf('pre_credit') ? 1 : 0);
                return (
                  <React.Fragment key={step}>
                    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium ${done ? 'bg-[#ECFDF3] text-[#047857]' : isActive ? 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]' : 'text-[#94A3B8]'}`}>
                      <span className={`w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold ${done ? 'bg-[#047857] text-white' : isActive ? 'bg-[#2563EB] text-white' : 'bg-[#E2E8F0] text-[#94A3B8]'}`}>{done ? '✓' : i + 1}</span>
                      {step}
                    </div>
                    {i < 3 && <div className={`flex-1 h-px ${done ? 'bg-[#047857]' : 'bg-[#E2E8F0]'}`} />}
                  </React.Fragment>
                );
              })}
            </div>

            <SelectedSampleSummary sample={currentSample} />

            <PageHeader
              title="资产转化概览"
              subtitle={`数据口径: 全量 · 截至 ${new Date().toLocaleDateString('zh-CN')}`}
              right={
                <Badge className="bg-[#ECFDF3] text-[#047857] border border-[#A7F3D0] text-[10px] gap-1">
                  <TrendingUp size={10} /> 本周转化 +12.3%
                </Badge>
              }
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <MetricCard label="识别中" value="12,480 户" detail="+126 本周" icon={Users} tone="blue" trend="+1.0%" />
              <MetricCard label="预授信池" value="3,260 户" detail="+86 本周" icon={Zap} tone="green" trend="+2.7%" />
              <MetricCard label="补审队列" value="680 户" detail="+24 本周" icon={FileCheck2} tone="amber" trend="+3.7%" />
              <MetricCard label="在营资产" value="1,120 户" detail="+18 本周" icon={Wallet} tone="slate" trend="+1.6%" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_0.8fr] gap-4">
              <WorkbenchPanel title="资产生成漏斗">
                <div className="space-y-4">
                  {[
                    { stage: '客群识别', value: '12,480 户', pct: 100, desc: '已接入内部结算、税票、物流、公私联动数据' },
                    { stage: '形成预授信', value: '3,260 户', pct: 26, desc: '通过规则引擎筛选，匹配产品与额度建议' },
                    { stage: '进入补审', value: '680 户', pct: 5, desc: '需人工确认经营证据、脱核替代性材料' },
                    { stage: '形成资产', value: '1,120 户', pct: 9, desc: '完成审批放款，进入贷中持续经营' },
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
                <WorkbenchPanel title="当前关注">
                  <div className="space-y-2">
                    <MiniTrend label="预授信转化率" value="26.1%" trend="+1.2%" good />
                    <MiniTrend label="补审通过率" value="77.4%" trend="+3.1%" good />
                    <MiniTrend label="在营资产余额" value="¥12.8亿" trend="+4.6%" good />
                    <MiniTrend label="风险资产占比" value="0.82%" trend="-0.05%" good />
                  </div>
                </WorkbenchPanel>

                <WorkbenchPanel title="转化动作">
                  <div className="space-y-2">
                    <ActionQueueCard action="新增预授信名单推送" source="客户经理" sla="进行中" />
                    <ActionQueueCard action="补审高优任务分配" source="审批岗" sla="待处理 18 户" />
                    <ActionQueueCard action="在营客户续贷提醒" source="系统自动" sla="本周 52 户" />
                    <ActionQueueCard action="风险客户额度复核" source="风控岗" sla="待处理 5 户" />
                  </div>
                </WorkbenchPanel>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <WorkbenchPanel title="本周新增样本" icon={Sparkles}>
                <div className="space-y-2">
                  {[
                    { name: SAMPLE_HENGYUAN.shortName, source: '内部数据识别', limit: SAMPLE_HENGYUAN.recommendedLimit },
                    { name: SAMPLE_CHIYUAN.shortName, source: '物流服务识别', limit: SAMPLE_CHIYUAN.recommendedLimit },
                    { name: SAMPLE_RUIXIN.shortName, source: '税票流水筛选', limit: SAMPLE_RUIXIN.recommendedLimit },
                  ].map((s) => (
                    <div key={s.name} className="flex items-center justify-between rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-2">
                      <div>
                        <div className="text-xs font-medium text-[#0F172A]">{s.name}</div>
                        <div className="text-[10px] text-[#94A3B8]">{s.source}</div>
                      </div>
                      <span className="text-xs font-semibold text-[#2563EB]">{s.limit}</span>
                    </div>
                  ))}
                </div>
              </WorkbenchPanel>

              <WorkbenchPanel title="转化阻塞点" icon={ShieldAlert}>
                <div className="space-y-2">
                  {[
                    { blocker: '缺少链主确权', count: 28, action: '走脱核补审通道' },
                    { blocker: '材料不完整', count: 18, action: '推送补材料任务' },
                    { blocker: '集中度超阈值', count: 14, action: '人工判断后调额' },
                  ].map((b) => (
                    <div key={b.blocker} className="rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-[#0F172A]">{b.blocker}</span>
                        <span className="text-xs font-semibold text-[#C2410C]">{b.count} 户</span>
                      </div>
                      <div className="mt-1 text-[10px] text-[#64748B]">→ {b.action}</div>
                    </div>
                  ))}
                  <AiNote action="为脱核高置信客户开通快速补审通道">
                    脱核阻塞 28 户中 18 户交叉验证 &gt; 85%，建议优先推进
                  </AiNote>
                </div>
              </WorkbenchPanel>

              <WorkbenchPanel title="重点链路">
                <div className="space-y-2">
                  {[
                    { chain: '新能源电池链', coverage: '860 户', conversion: '32%' },
                    { chain: '半导体封装链', coverage: '620 户', conversion: '28%' },
                    { chain: '家电零部件链', coverage: '480 户', conversion: '24%' },
                  ].map((l) => (
                    <div key={l.chain} className="rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-[#0F172A]">{l.chain}</span>
                        <span className="text-xs font-semibold text-[#7C3AED]">{l.conversion}</span>
                      </div>
                      <div className="mt-1 text-[10px] text-[#64748B]">覆盖 {l.coverage}</div>
                    </div>
                  ))}
                </div>
              </WorkbenchPanel>
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
