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
  AiJudgmentBlock,
} from '../ProductPrimitives';
import { useDemo, STAGE_ORDER } from '../../demo/DemoContext';
import { SceneHero, ActionBar } from '../../demo/DemoComponents';
import { SAMPLES, SAMPLE_YUTONG, SAMPLE_CHIYUAN, SAMPLE_JIALI, SAMPLE_RUIXIN, SAMPLE_RUIFENG } from '../../demo/chainLoan/data';
import { StageFunnelChart, DistributionBarChart, CHART_COLORS } from '../Charts';

interface AssetPoolSceneProps {
  activeModule: string;
  onModuleChange: (id: string) => void;
}

export default function AssetPoolScene({ activeModule, onModuleChange }: AssetPoolSceneProps) {
  const scene = SCENES.find((item) => item.id === 'asset-pool')!;
  const { active, stage, stageIndex, riskSimulated, recoveryComplete, currentSample, selectSample, selectedSampleId } = useDemo();
  const isCurrentApproved = currentSample.stage === 'approved' || currentSample.stage === 'risk_alert' || currentSample.stage === 'recovery';

  const isPastPreCredit = stageIndex >= STAGE_ORDER.indexOf('pre_credit');
  const isPastApproval = stageIndex >= STAGE_ORDER.indexOf('approved');

  const renderContent = () => {
    switch (activeModule) {
      // ─── 在营资产列表 (default) ────────────────────────────────
      case 'activated':
      default:
        return (
          <div className="space-y-4">
            {active && <SceneHero question="当前客户在哪个池子、下一步去哪" />}

            <PageHeader
              title="在营资产"
              subtitle={`资产总量: 1,120 户 · 在营余额: ¥12.8亿`}
              right={<Button variant="ghost" size="sm" className="h-6 text-[10px] text-[#64748B] gap-1 px-2"><Search size={10} /> 搜索</Button>}
            />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <MetricCard label="正常经营" value="892 户" detail="占比 79.6% · 经营健康" tone="green" />
              <MetricCard label="观察中" value="138 户" detail="占比 12.3% · 波动待稳" tone="amber" />
              <MetricCard label="已降额" value="62 户" detail="占比 5.5% · 额度已调降" tone="red" />
              <MetricCard label="恢复中" value="28 户" detail="占比 2.5% · 恢复至90%后30天观察" tone="slate" />
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
              <InsightStrip tone={riskSimulated ? 'risk' : 'normal'}>
                当前样本 — <strong>{currentSample.shortName}</strong> ·
                在营额度: {riskSimulated ? (recoveryComplete ? `${Math.round(parseInt(currentSample.recommendedLimit) * 0.9)}万 (已恢复 90%)` : `${currentSample.currentLimit} (已收缩)`) : currentSample.currentLimit}
                {riskSimulated ? (recoveryComplete ? ' · 恢复观察中' : ' · 风险收缩中') : ' · 正常经营'}
              </InsightStrip>
            )}

            

            <WorkbenchPanel
              title="在营客户"
              badge={<Badge className="bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] text-[10px]">仅含已审批通过客户</Badge>}
            >
              <div className="space-y-2">
                {SAMPLES.filter(s => ['approved', 'risk_alert', 'recovery'].includes(s.stage)).map((s) => {
                  const state = s.riskStatus === '中度预警' ? 'risk' as const : s.riskStatus === '观察' ? 'watch' as const : s.approvalStatus === '恢复中' ? 'recovery' as const : 'normal' as const;
                  const statusLabel = s.riskStatus === '中度预警' ? '预警触发' : s.approvalStatus === '恢复中' ? '恢复观察中' : s.approvalStatus === '已降额' ? '观察中' : '正常经营';
                  return (
                    <EntitySummaryCard key={s.id} name={s.companyName} role={s.chainName} state={state} stateLabel={statusLabel} keyValue={s.currentLimit} icon={Building2} onClick={() => selectSample(s.id)} selected={s.id === selectedSampleId} />
                  );
                })}
                {SAMPLES.filter(s => ['approved', 'risk_alert', 'recovery'].includes(s.stage)).length === 0 && (
                  <div className="text-center py-8 text-[#94A3B8] text-xs">当前无已审批客户</div>
                )}
              </div>
            </WorkbenchPanel>

            {active && <ActionBar />}
          </div>
        );

      // ─── 风险资产 ────────────────────────────────────────────
      case 'risk-assets':
        return (
          <div className="space-y-4">
            <PageHeader title="风险资产" subtitle="展示逾期、降额、预警中的在营企业" right={<Button variant="ghost" size="sm" className="h-6 text-[10px] text-[#64748B] gap-1 px-2"><Search size={10} /> 搜索</Button>} />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <MetricCard label="逾期客户" value="12 户" detail="逾期金额 ¥286万" tone="red" />
              <MetricCard label="已降额" value="62 户" detail="降额总量 ¥1,840万" tone="amber" />
              <MetricCard label="预警观察" value="38 户" detail="关注回款与经营波动" tone="amber" />
              <MetricCard label="恢复中" value="28 户" detail="恢复至90%后30天观察" tone="slate" />
            </div>
            <WorkbenchPanel title="风险资产列表">
              <div className="space-y-2">
                {SAMPLES.filter(s => ['risk_alert', 'recovery'].includes(s.stage) || s.riskFlags.length > 0).map((s) => (
                  <EntitySummaryCard key={s.id} name={s.companyName} role={s.chainName} state={s.riskStatus === '中度预警' ? 'alert' as const : 'watch' as const} stateLabel={s.riskStatus} keyValue={s.currentLimit} icon={Building2} onClick={() => selectSample(s.id)} selected={s.id === selectedSampleId}>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {s.riskFlags.map(f => (<Badge key={f} className="bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5] text-[10px]">{f}</Badge>))}
                    </div>
                  </EntitySummaryCard>
                ))}
                {SAMPLES.filter(s => ['risk_alert', 'recovery'].includes(s.stage) || s.riskFlags.length > 0).length === 0 && (
                  <div className="text-center py-8 text-[#94A3B8] text-xs">当前无风险资产</div>
                )}
              </div>
            </WorkbenchPanel>
            {active && <ActionBar />}
          </div>
        );

      // ─── 还款管理 ────────────────────────────────────────────
      case 'repayment':
        return (
          <div className="space-y-4">
            <PageHeader title="还款管理" subtitle="管理还款计划、到期提醒与还款记录" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <MetricCard label="本月到期" value="86 户" detail="到期金额 ¥3,240万" tone="blue" />
              <MetricCard label="已正常还款" value="72 户" detail="还款率 83.7%" tone="green" />
              <MetricCard label="即将到期 (7天内)" value="18 户" detail="金额 ¥680万" tone="amber" />
              <MetricCard label="逾期未还" value="8 户" detail="金额 ¥286万" tone="red" />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_0.8fr] gap-4">
              <WorkbenchPanel title="还款日历">
                <div className="space-y-3">
                  {[
                    { date: '2026-04-15', count: 12, amount: '¥580万', status: '即将到期' },
                    { date: '2026-04-20', count: 8, amount: '¥320万', status: '即将到期' },
                    { date: '2026-04-25', count: 15, amount: '¥860万', status: '计划中' },
                    { date: '2026-04-30', count: 22, amount: '¥1,140万', status: '计划中' },
                  ].map(r => (
                    <div key={r.date} className="flex items-center justify-between rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5">
                      <div className="flex items-center gap-3"><span className="text-[11px] font-mono text-[#64748B]">{r.date}</span><span className="text-xs font-medium text-[#0F172A]">{r.count} 户</span></div>
                      <div className="flex items-center gap-3"><span className="text-xs font-semibold text-[#0F172A]">{r.amount}</span><Badge className={`text-[9px] border ${r.status === '即将到期' ? 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]' : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]'}`}>{r.status}</Badge></div>
                    </div>
                  ))}
                </div>
              </WorkbenchPanel>
              <WorkbenchPanel title="还款待办">
                <div className="space-y-2">
                  <ActionQueueCard action="催收提醒 · 逾期未还客户" source="客户经理" sla="8 户" priority="高优" />
                  <ActionQueueCard action="到期提醒 · 7天内到期" source="系统" sla="18 户" priority="普通" />
                  <ActionQueueCard action="续贷审批 · 即将到期优质客户" source="审批岗" sla="12 户" priority="普通" />
                </div>
              </WorkbenchPanel>
            </div>
            {active && <ActionBar />}
          </div>
        );

      // ─── 转化看板 ──────────────────────────────────────────────
      case 'pipeline':
        return (
          <div className="space-y-4">
            {active && <SceneHero question="当前客户在哪个池子、下一步去哪" />}

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
                <StageFunnelChart
                  data={[
                    { name: '客群识别', value: 12480, color: CHART_COLORS.blue },
                    { name: '形成预授信', value: 3260, color: CHART_COLORS.sky },
                    { name: '进入补审', value: 680, color: CHART_COLORS.amber },
                    { name: '形成资产', value: 1120, color: CHART_COLORS.emerald },
                  ]}
                  height={200}
                />
                <div className="mt-2 grid grid-cols-2 gap-2 text-[10px] text-muted-foreground">
                  <div>识别→预授信: <span className="font-semibold text-foreground">26.1%</span></div>
                  <div>预授信→补审: <span className="font-semibold text-foreground">20.9%</span></div>
                  <div>补审→在营: <span className="font-semibold text-foreground">77.4%</span></div>
                  <div>全链路: <span className="font-semibold text-foreground">9.0%</span></div>
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
                    { name: SAMPLE_YUTONG.shortName, source: '内部数据识别', limit: SAMPLE_YUTONG.recommendedLimit },
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
