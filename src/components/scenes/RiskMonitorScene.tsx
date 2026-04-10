import React from 'react';
import SceneLayout from '../SceneLayout';
import { SCENES } from '../../constants';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Radar,
  ShieldAlert,
  TrendingDown,
} from 'lucide-react';
import { FlowRow, AiBar, AiNote, SampleSwitcher, SelectedSampleSummary, PanelCard, InsightCard, ActionSuggestionCard } from '../ProductPrimitives';
import { useDemo } from '../../demo/DemoContext';
import { DemoStepper, CaseSummaryCard, ActionBar, RiskEventPanel } from '../../demo/DemoComponents';
import { SAMPLES, SAMPLE_HENGYUAN, getRiskEventForSample } from '../../demo/chainLoan/data';

interface RiskMonitorSceneProps {
  activeModule: string;
  onModuleChange: (id: string) => void;
}

export default function RiskMonitorScene({ activeModule, onModuleChange }: RiskMonitorSceneProps) {
  const scene = SCENES.find((item) => item.id === 'risk-monitor')!;
  const { active, riskSimulated, simulateRisk, stage, currentSample, selectSample, selectedSampleId } = useDemo();
  const isHengyuan = currentSample.id === SAMPLE_HENGYUAN.id;

  const isRiskStage = stage === 'risk_alert';
  const sampleRiskEvent = getRiskEventForSample(currentSample);

  const maxLimit = parseInt(currentSample.recommendedLimit) || 120;
  const shrunkLimit = parseInt(currentSample.currentLimit) || Math.round(maxLimit * 0.8);

  const [availableLimit, setAvailableLimit] = React.useState(maxLimit);

  React.useEffect(() => {
    if (!riskSimulated) {
      setAvailableLimit(maxLimit);
      return;
    }
    let frame = maxLimit;
    const step = Math.max(1, Math.round((maxLimit - shrunkLimit) / 8));
    const timer = window.setInterval(() => {
      frame -= step;
      if (frame <= shrunkLimit) {
        setAvailableLimit(shrunkLimit);
        window.clearInterval(timer);
        return;
      }
      setAvailableLimit(frame);
    }, 45);
    return () => window.clearInterval(timer);
  }, [riskSimulated, maxLimit, shrunkLimit]);

  const renderContent = () => {
    switch (activeModule) {
      case 'signals':
        return (
          <div className="space-y-4">
            {active && <DemoStepper />}
            {active && <CaseSummaryCard />}
            <div className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden">
              <div className="px-5 py-3 border-b border-[#E2E8F0]">
                <div className="text-sm font-semibold text-[#0F172A]">监控指标看板</div>
                <div className="mt-0.5 text-[11px] text-[#94A3B8]">实时监控在贷客户经营与资金状态</div>
              </div>
              <div className="divide-y divide-[#E2E8F0]">
                {[
                  { name: '账户净流出', threshold: '连续 3 周净流出', current: riskSimulated ? currentSample.accountFlowStatus : '净流入', severity: (riskSimulated && currentSample.riskFlags.length > 0 ? 'high' : 'normal') as 'high' | 'warn' | 'normal', action: '生成排查任务' },
                  { name: '回款周期拉长', threshold: '拉长幅度 > 40%', current: riskSimulated ? `${currentSample.avgReceivableCycle}（+44%）` : `${currentSample.avgReceivableCycle}（稳定）`, severity: (riskSimulated && parseInt(currentSample.avgReceivableCycle) > 40 ? 'high' : 'normal') as 'high' | 'warn' | 'normal', action: '额度临时收缩' },
                  { name: '断票风险', threshold: '连续 2 个月未开票', current: currentSample.invoiceContinuityMonths >= 10 ? '正常' : '连续性不足', severity: (currentSample.invoiceContinuityMonths < 6 ? 'warn' : 'normal') as 'high' | 'warn' | 'normal', action: '触发拒件' },
                  { name: '废票率异常', threshold: '近 6 月废票占比 > 10%', current: '3.8%', severity: 'normal' as const, action: '触发预警' },
                  { name: '客户集中度', threshold: '单一客户占比 > 55%', current: currentSample.maxCustomerConcentration, severity: (parseInt(currentSample.maxCustomerConcentration) > 55 ? 'warn' : 'normal') as 'high' | 'warn' | 'normal', action: '自动收缩敞口' },
                  { name: '物流履约延迟', threshold: '10 天内 ≥ 3 笔延迟', current: riskSimulated ? currentSample.logisticsStatus : '正常', severity: (riskSimulated && currentSample.logisticsStatus.includes('延迟') ? 'high' : 'normal') as 'high' | 'warn' | 'normal', action: '联合回款排查' },
                ].map((sig) => (
                  <div key={sig.name} className="px-5 py-3 flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${sig.severity === 'high' ? 'bg-[#DC2626]' : sig.severity === 'warn' ? 'bg-[#F59E0B]' : 'bg-[#16A34A]'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium text-[#0F172A]">{sig.name}</div>
                      <div className="mt-0.5 text-[11px] text-[#64748B]">阈值: {sig.threshold} → {sig.action}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className={`text-xs font-medium ${sig.severity === 'high' ? 'text-[#DC2626]' : sig.severity === 'warn' ? 'text-[#C2410C]' : 'text-[#16A34A]'}`}>
                        {sig.current}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {active && <ActionBar />}
          </div>
        );
      case 'actions':
        return (
          <div className="space-y-4">
            {active && <DemoStepper />}
            {active && <CaseSummaryCard />}

            {/* 风险处置流程条 */}
            <div className="flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-white px-4 py-3">
              {['风险识别', '自动处置', '人工复核', '处置确认', '效果评估'].map((step, i) => {
                const currentIdx = riskSimulated ? 2 : 0;
                const done = i < currentIdx;
                const isActive = i === currentIdx;
                return (
                  <React.Fragment key={step}>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium ${done ? 'bg-[#ECFDF3] text-[#047857]' : isActive ? 'bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]' : 'text-[#94A3B8]'}`}>
                      <span className={`w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold ${done ? 'bg-[#047857] text-white' : isActive ? 'bg-[#DC2626] text-white' : 'bg-[#E2E8F0] text-[#94A3B8]'}`}>{done ? '✓' : i + 1}</span>
                      {step}
                    </div>
                    {i < 4 && <div className={`flex-1 h-px ${i < currentIdx ? 'bg-[#047857]' : 'bg-[#E2E8F0]'}`} />}
                  </React.Fragment>
                );
              })}
            </div>

            {riskSimulated && (
              <ActionSuggestionCard
                action="启动人工复核"
                reason={`${currentSample.shortName} 已触发自动额度收缩，建议人工确认回款周期与物流状态后决定是否进入恢复观察。`}
                priority="high"
                agent="风险处置 Agent"
              />
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="border border-[#E5E7EB]">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">自动处置</CardTitle>
                    <Badge className="bg-[#EFF6FF] text-[#1890FF] border border-[#BFDBFE] text-[10px]">系统执行</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { action: '额度临时收缩', trigger: '风险评分 ≥ 中度', sla: '实时', count: '23 次/月' },
                    { action: '生成复核任务', trigger: '预警命中 ≥ 2 条规则', sla: '< 5 分钟', count: '18 次/月' },
                    { action: '暂停自动续贷', trigger: '连续预警未解除', sla: '实时', count: '5 次/月' },
                  ].map((item) => (
                    <div key={item.action} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-medium text-[#0F172A]">{item.action}</span>
                        <span className="text-[11px] text-[#94A3B8]">{item.count}</span>
                      </div>
                      <div className="mt-1 text-[11px] text-[#64748B]">触发: {item.trigger} · 响应: {item.sla}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              <Card className="border border-[#E5E7EB]">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">人工处置</CardTitle>
                    <Badge className="bg-[#FFF7ED] text-[#C2410C] border border-[#FED7AA] text-[10px]">需人工确认</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {[
                    { action: '补充经营材料', trigger: '自动处置后仍需核验', sla: '< 24 小时', count: '12 次/月' },
                    { action: '核查异常交易', trigger: '大额异动或关联交易', sla: '< 48 小时', count: '4 次/月' },
                    { action: '现场尽调', trigger: '高风险且额度 > 100 万', sla: '< 72 小时', count: '1 次/月' },
                  ].map((item) => (
                    <div key={item.action} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-medium text-[#0F172A]">{item.action}</span>
                        <span className="text-[11px] text-[#94A3B8]">{item.count}</span>
                      </div>
                      <div className="mt-1 text-[11px] text-[#64748B]">触发: {item.trigger} · 响应: {item.sla}</div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
            {active && <ActionBar />}
          </div>
        );
      case 'quality':
        return (
          <div className="space-y-4">
            {active && <DemoStepper />}
            {active && <CaseSummaryCard />}
            <div className="rounded-xl border border-[#E5E7EB] bg-white px-5 py-3 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-[#0F172A]">规则效果评估</span>
                <span className="text-[11px] text-[#94A3B8]">数据口径: 最近 90 天 · 更新: 每日</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: '预警准确率', value: '71%', sub: '命中预警后 30 天内确认风险', dot: 'blue' },
                { label: '误报率', value: '12%', sub: '预警后无实质性风险发生', dot: 'green' },
                { label: '处置后改善率', value: '63%', sub: '额度收缩后风险指标回落', dot: 'amber' },
              ].map(m => (
                <Card key={m.label} className="border border-[#E5E7EB] bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${m.dot === 'blue' ? 'bg-[#2563EB]' : m.dot === 'green' ? 'bg-[#16A34A]' : 'bg-[#F59E0B]'}`} />
                      <span className="text-[11px] text-[#94A3B8]">{m.label}</span>
                    </div>
                    <div className="mt-2 text-xl font-semibold text-[#0F172A]">{m.value}</div>
                    <div className="mt-1 text-[11px] text-[#64748B]">{m.sub}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Card className="border border-[#E5E7EB]">
              <CardHeader className="pb-3"><CardTitle className="text-sm">规则效果明细</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <FlowRow label="动账预警 → 风险确认" value="71%" percentage={71} />
                <FlowRow label="断票规则 → 及时拦截" value="84%" percentage={84} />
                <FlowRow label="集中度调额 → 风险改善" value="63%" percentage={63} />
                <FlowRow label="回款周期预警 → 提前干预" value="78%" percentage={78} />
                <FlowRow label="物流延迟 → 联合排查有效" value="55%" percentage={55} />
              </CardContent>
            </Card>
            <Card className="border border-[#E5E7EB]">
              <CardHeader className="pb-3"><CardTitle className="text-sm">资产质量趋势</CardTitle></CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: '不良率', value: '0.82%', change: '-0.05%', good: true },
                  { label: '关注类占比', value: '2.41%', change: '-0.18%', good: true },
                  { label: '逾期 30+ 天', value: '0.34%', change: '+0.02%', good: false },
                ].map((item) => (
                  <div key={item.label} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-center">
                    <div className="text-[10px] text-[#94A3B8]">{item.label}</div>
                    <div className="mt-1 text-2xl font-semibold text-[#0F172A]">{item.value}</div>
                    <div className={`mt-1 text-xs font-medium ${item.good ? 'text-[#16A34A]' : 'text-[#DC2626]'}`}>{item.change}</div>
                  </div>
                ))}
              </CardContent>
            </Card>
            {active && <ActionBar />}
          </div>
        );
      default:
        return (
          <div className="space-y-4">
            {active && <DemoStepper />}
            {active && <CaseSummaryCard />}
            <div className="rounded-xl border border-[#E5E7EB] bg-white px-5 py-3 flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-[#0F172A]">预警总览</span>
                <SampleSwitcher selectedId={selectedSampleId} onSelect={selectSample} compact />
              </div>
              <div className="flex items-center gap-2">
                {['前置预警', '动态监控', '额度联动'].map(t => (
                  <Badge key={t} className="bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE] text-[10px]">{t}</Badge>
                ))}
              </div>
            </div>

            <SelectedSampleSummary sample={currentSample} />

            {riskSimulated && <RiskEventPanel />}

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { label: '风险主体', value: currentSample.shortName, sub: `${currentSample.roleInChain} · ${currentSample.chainName}`, dot: 'blue' },
                { label: '当前可用额度', value: isHengyuan ? `${availableLimit}万` : currentSample.currentLimit, sub: isHengyuan ? (riskSimulated ? '系统已自动收缩 20%' : '尚未触发额度收缩') : currentSample.approvalStatus, dot: (isHengyuan ? riskSimulated : currentSample.riskStatus !== '正常') ? 'red' : 'green' },
                { label: '风险级别', value: isHengyuan ? (riskSimulated ? '中度预警' : '正常监控') : currentSample.riskStatus, sub: isHengyuan ? '根据回款周期与物流履约共同判断' : (currentSample.riskFlags.join('、') || '无风险标识'), dot: (isHengyuan ? riskSimulated : currentSample.riskStatus !== '正常') ? 'red' : 'green' },
                { label: '联动动作', value: riskSimulated ? '已执行' : '待触发', sub: '自动收缩额度并生成复核任务', dot: riskSimulated ? 'amber' : 'slate' },
              ].map(m => (
                <Card key={m.label} className="border border-[#E5E7EB] bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${m.dot === 'blue' ? 'bg-[#2563EB]' : m.dot === 'green' ? 'bg-[#16A34A]' : m.dot === 'red' ? 'bg-[#DC2626]' : m.dot === 'amber' ? 'bg-[#F59E0B]' : 'bg-[#94A3B8]'}`} />
                      <span className="text-[11px] text-[#94A3B8]">{m.label}</span>
                    </div>
                    <div className={`mt-2 text-xl font-semibold ${m.dot === 'red' ? 'text-[#DC2626]' : 'text-[#0F172A]'}`}>{m.value}</div>
                    <div className="mt-1 text-[11px] text-[#64748B]">{m.sub}</div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <AiBar
              conclusion={riskSimulated ? '检测到中度风险，已收缩额度至 96 万' : '经营状态正常，持续监控中'}
              confidence={riskSimulated ? 85 : 96}
              metrics={[{ label: '探针', value: '风险探针 Agent' }]}
              action={riskSimulated ? '启动人工复核' : '自动监控中'}
            />

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_0.95fr] gap-6">
              <Card className={`border ${riskSimulated ? 'border-[#FCA5A5]' : 'border-[#E2E8F0]'}`}>
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <CardTitle className="text-base flex items-center gap-2">
                      <TrendingDown size={18} className={riskSimulated ? 'text-[#DC2626]' : 'text-[#1890FF]'} />
                      额度自动收缩演示
                    </CardTitle>
                    {!active && (
                      <Button
                        className={riskSimulated ? 'bg-[#0F172A] hover:bg-[#1E293B]' : 'bg-[#DC2626] hover:bg-[#B91C1C]'}
                        onClick={() => riskSimulated ? setAvailableLimit(120) : simulateRisk()}
                      >
                        {riskSimulated ? '重置预警场景' : '模拟风险事件'}
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-3xl border border-[#E2E8F0] bg-white p-6">
                    <div className="text-xs text-[#64748B]">可用额度</div>
                    <div className={`mt-3 text-5xl font-bold tracking-tight ${riskSimulated ? 'text-[#DC2626]' : 'text-[#0F172A]'}`}>
                      {availableLimit}万
                    </div>
                    <div className="mt-3 text-sm text-[#64748B]">{riskSimulated ? `额度从 ${maxLimit} 万收缩至 ${shrunkLimit} 万。` : '点击按钮后展示额度收缩过程。'}</div>
                    <div className="mt-5 h-3 rounded-full bg-[#F1F5F9] overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${riskSimulated ? 'bg-[#DC2626]' : 'bg-[#1890FF]'}`}
                        style={{ width: `${(availableLimit / maxLimit) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      ['回款周期', riskSimulated ? sampleRiskEvent.impact.receivableCycle : currentSample.avgReceivableCycle],
                      ['履约状态', riskSimulated ? sampleRiskEvent.impact.fulfillmentDelay : currentSample.logisticsStatus],
                      ['敞口调整', riskSimulated ? sampleRiskEvent.impact.exposureAdjustment : '未调整'],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] p-4">
                        <div className="text-[10px] uppercase tracking-wide text-[#94A3B8]">{label}</div>
                        <div className={`mt-2 text-lg font-bold ${riskSimulated ? 'text-[#DC2626]' : 'text-[#0F172A]'}`}>{value}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className={`border ${riskSimulated ? 'border-[#FCA5A5]' : 'border-[#E2E8F0]'}`}>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Radar size={18} className={riskSimulated ? 'text-[#DC2626]' : 'text-[#1890FF]'} />
                    风险探针报告
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className={`rounded-2xl border p-4 ${riskSimulated ? 'border-[#FCA5A5]' : 'border-[#B9DCFF]'}`}>
                    <div className="text-sm font-semibold text-[#0F172A]">
                      {riskSimulated ? sampleRiskEvent.name : '尚未触发风险事件'}
                    </div>
                    <p className="mt-2 text-xs leading-6 text-[#64748B]">{riskSimulated ? sampleRiskEvent.summary : `${currentSample.shortName}当前经营状态正常，系统持续监控中。`}</p>
                  </div>

                  <div className="space-y-3">
                    {(riskSimulated
                      ? sampleRiskEvent.triggerRules
                      : [`回款周期稳定在 ${currentSample.avgReceivableCycle}`, `物流状态：${currentSample.logisticsStatus}`, `账户状态：${currentSample.accountFlowStatus}`]
                    ).map((item) => (
                      <div key={item} className="flex items-start gap-3 rounded-2xl border border-[#E2E8F0] bg-white p-4 text-sm leading-6 text-[#334155]">
                        <ShieldAlert size={16} className={`mt-1 shrink-0 ${riskSimulated ? 'text-[#DC2626]' : 'text-[#1890FF]'}`} />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  {riskSimulated && (
                    <AiNote action={currentSample.agentHints.suggestedAction}>
                      {currentSample.riskFlags.length > 0 ? currentSample.riskFlags.join('、') : '经营波动'} — 已收缩额度至 {shrunkLimit} 万
                    </AiNote>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card className="border border-[#E5E7EB]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">风险关注清单</CardTitle>
                  <Badge className="bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] text-[10px]">{SAMPLES.filter(s => s.riskFlags.length > 0).length} 家关注</Badge>
                </div>
              </CardHeader>
              <CardContent className="divide-y divide-[#E2E8F0]">
                {SAMPLES.filter(s => s.riskFlags.length > 0).map((s) => (
                  <button key={s.id} onClick={() => selectSample(s.id)} className={`w-full flex items-center justify-between py-2.5 first:pt-0 last:pb-0 text-left rounded-lg px-2 -mx-2 transition-colors ${s.id === selectedSampleId ? 'bg-[#EFF6FF]' : 'hover:bg-[#F8FAFC]'}`}>
                    <div className="min-w-0">
                      <div className={`text-xs font-medium truncate ${s.id === selectedSampleId ? 'text-[#2563EB]' : 'text-[#0F172A]'}`}>{s.shortName}</div>
                      <div className="text-[10px] text-[#94A3B8]">{s.roleInChain} · {s.riskFlags.join('、')}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className={`text-[10px] border ${s.riskStatus === '中度预警' ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]' : s.riskStatus === '观察' ? 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]' : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]'}`}>
                        {s.riskStatus}
                      </Badge>
                      <span className="text-xs font-medium text-[#0F172A]">{s.currentLimit}</span>
                    </div>
                  </button>
                ))}
              </CardContent>
            </Card>

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
