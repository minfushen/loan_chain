import React from 'react';
import SceneLayout from '../SceneLayout';
import { SCENES } from '../../constants';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowRightLeft,
  CheckCircle,
  CheckCircle2,
  CircleAlert,
  FileCheck2,
  Filter,
  PackageCheck,
  Route,
  Search,
  Wallet,
  Zap,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  ChevronRight,
  CircleDot,
} from 'lucide-react';
import { AiNote, SampleSwitcher, SelectedSampleSummary, PanelCard, InsightCard, ConfidenceCard, SectionShell, AiJudgmentBlock } from '../ProductPrimitives';
import { useDemo, STAGE_ORDER } from '../../demo/DemoContext';
import { SceneHero, ActionBar } from '../../demo/DemoComponents';
import { SAMPLES, getRuleHitsForSample } from '../../demo/chainLoan/data';

interface ProductApprovalSceneProps {
  activeModule: string;
  onModuleChange: (id: string) => void;
}

export default function ProductApprovalScene({ activeModule, onModuleChange }: ProductApprovalSceneProps) {
  const scene = SCENES.find((item) => item.id === 'product-approval')!;
  const { active, stage, stageIndex, advanceStage, currentSample, selectSample, selectedSampleId } = useDemo();
  const [selectedFlowId, setSelectedFlowId] = React.useState('flow-2');

  const isPastApproval = stageIndex >= STAGE_ORDER.indexOf('approved');
  const isAtManualReview = stage === 'manual_review';
  const approvalState = isPastApproval ? 'approved' : 'pending';
  const sampleRuleHits = getRuleHitsForSample(currentSample);

  const counterparty = currentSample.keyCounterparty;
  const sender = currentSample.mainChainPath[currentSample.mainChainPath.length - 1];
  const baseAmt = parseInt(currentSample.orderAmount90d) || 100;
  const baseCycle = parseInt(currentSample.avgReceivableCycle) || 30;
  const hasLogisticsIssue = currentSample.logisticsStatus.includes('延迟') || currentSample.logisticsStatus.includes('不连续');
  const evidenceGrade = currentSample.evidenceCoverage >= 85 ? '充分' : currentSample.evidenceCoverage >= 65 ? '一般' : '不足';

  const verificationFlows = [
    {
      id: 'flow-1',
      order: { code: `ORD-${currentSample.id.slice(-4)}-0312`, counterpart: counterparty, amount: `${Math.round(baseAmt * 0.5)}万`, date: '03-12' },
      logistics: { code: `YUN-${currentSample.id.slice(-4)}-4407`, status: hasLogisticsIssue ? '延迟签收' : '已签收', route: `${sender} 发货`, date: '03-15' },
      settlement: { code: `SET-${currentSample.id.slice(-4)}-2081`, amount: `${Math.round(baseAmt * 0.2)}万`, cycle: `T+${baseCycle}`, date: '04-17' },
    },
    {
      id: 'flow-2',
      order: { code: `ORD-${currentSample.id.slice(-4)}-0328`, counterpart: counterparty, amount: `${Math.round(baseAmt * 0.6)}万`, date: '03-28' },
      logistics: { code: `YUN-${currentSample.id.slice(-4)}-4519`, status: '已签收', route: `${sender} 发货`, date: '03-31' },
      settlement: { code: `SET-${currentSample.id.slice(-4)}-2210`, amount: `${Math.round(baseAmt * 0.27)}万`, cycle: `T+${baseCycle + 1}`, date: '05-02' },
    },
    {
      id: 'flow-3',
      order: { code: `ORD-${currentSample.id.slice(-4)}-0408`, counterpart: counterparty, amount: `${Math.round(baseAmt * 0.72)}万`, date: '04-08' },
      logistics: { code: `YUN-${currentSample.id.slice(-4)}-4675`, status: hasLogisticsIssue ? '待确认' : '运输完成', route: `${sender} 发货`, date: '04-11' },
      settlement: { code: `SET-${currentSample.id.slice(-4)}-2394`, amount: `${Math.round(baseAmt * 0.37)}万`, cycle: `T+${baseCycle + 2}`, date: '05-14' },
    },
  ];
  const selectedFlow = verificationFlows.find((f) => f.id === selectedFlowId) ?? verificationFlows[0];

  const handleApprove = () => {
    if (isAtManualReview && active) advanceStage();
  };

  // ─── Product configuration data ────────────────────────────────────────────
  const PRODUCTS = [
    { id: 'P-001', name: '信用快贷', target: '存量代发/结算/按揭客户', limit: '10–50万', rate: '5.8%–6.5%', term: '12个月', segment: '存量唤醒', rulePackage: '基础准入 + 公私联动', status: '已上线' as const },
    { id: 'P-002', name: '数据贷', target: '税票流水达标小微', limit: '50–200万', rate: '6.2%–7.5%', term: '6–12个月', segment: '标准数据授信', rulePackage: '税票融合 + 图谱评分', status: '已上线' as const },
    { id: 'P-003', name: '订单微贷', target: '脱核链贷场景主体', limit: '30–150万', rate: '7.0%–8.2%', term: '6个月', segment: '长尾场景', rulePackage: '产业数据 + 经营实质 + 脱核补审', status: '试运行' as const },
    { id: 'P-004', name: '运费贷', target: '链上物流服务主体', limit: '20–100万', rate: '6.8%–7.8%', term: '3–6个月', segment: '长尾场景', rulePackage: '运单频次 + 结算验证', status: '试运行' as const },
  ];

  // ─── Rules data (reused from old 'rules' module) ──────────────────────────
  const RULES_DATA = [
    { id: 'R-001', name: '高频对手规则', category: '基础' as const, trigger: '月均交易 ≥ 3 笔 & 连续 4 月未中断', scope: '关系识别', status: '启用' as const, priority: 'P1', owner: '张明远', updatedAt: '2026-03-18', dataSources: ['对公流水', '交易频次'], actionChain: '关系候选加分 → 进入候选池', hitRate: '18.4%', hitCount: 312, falsePositiveRate: '3.2%', reviewPassRate: '—', contribution: '识别率 +12%', trend: 'up' as const },
    { id: 'R-002', name: '稳定账期规则', category: '基础' as const, trigger: '收付间隔落在合理账期区间', scope: '关系识别', status: '启用' as const, priority: 'P1', owner: '张明远', updatedAt: '2026-03-18', dataSources: ['对公流水', '回款流水'], actionChain: '关系强度加分 → 提升候选等级', hitRate: '15.2%', hitCount: 258, falsePositiveRate: '4.1%', reviewPassRate: '—', contribution: '评分准确度 +8%', trend: 'stable' as const },
    { id: 'R-003', name: '经营闭环规则', category: '基础' as const, trigger: '收款→付款→工资/税费/缴费形成闭环', scope: '关系识别', status: '启用' as const, priority: 'P1', owner: '李雪婷', updatedAt: '2026-03-22', dataSources: ['对公流水', '代发工资', '税费缴纳'], actionChain: '经营真实性加分', hitRate: '22.1%', hitCount: 375, falsePositiveRate: '2.6%', reviewPassRate: '—', contribution: '真实经营 +15%', trend: 'up' as const },
    { id: 'R-005', name: '集中度规则', category: '基础' as const, trigger: '最大对手占比 ≤ 55%', scope: '准入 + 贷中', status: '启用' as const, priority: 'P1', owner: '王敏', updatedAt: '2026-04-01', dataSources: ['对公流水', '发票数据'], actionChain: '降额 → 贷中监控', hitRate: '6.1%', hitCount: 104, falsePositiveRate: '8.2%', reviewPassRate: '72%', contribution: '减少坏账 0.3%', trend: 'up' as const },
    { id: 'R-006', name: '快进快出排除', category: '排除' as const, trigger: '3 日内进出差 < 5%', scope: '风险排除', status: '启用' as const, priority: 'P0', owner: '陈立', updatedAt: '2026-03-28', dataSources: ['对公流水'], actionChain: '候选降级 → 标记异常', hitRate: '3.8%', hitCount: 65, falsePositiveRate: '6.1%', reviewPassRate: '23%', contribution: '拦截空转 52 户', trend: 'stable' as const },
    { id: 'R-008', name: '断票规则', category: '准入' as const, trigger: '连续未开票 ≥ 2 个月', scope: '准入', status: '启用' as const, priority: 'P1', owner: '王敏', updatedAt: '2026-03-10', dataSources: ['税票数据'], actionChain: '自动拒件', hitRate: '4.2%', hitCount: 71, falsePositiveRate: '4.2%', reviewPassRate: '33%', contribution: '减少人工 68 件', trend: 'stable' as const },
    { id: 'R-009', name: '脱核补审规则', category: '准入' as const, trigger: '未获得链主直接确权', scope: '准入', status: '启用' as const, priority: 'P1', owner: '王敏', updatedAt: '2026-04-05', dataSources: ['对公流水', '物流数据', '回款归集'], actionChain: '进入人工补审 → 调取证据包', hitRate: '12.6%', hitCount: 214, falsePositiveRate: '11.2%', reviewPassRate: '76%', contribution: '补审通过 163 户', trend: 'up' as const },
    { id: 'R-010', name: '回款周期规则', category: '贷中' as const, trigger: '回款周期拉长 > 40%', scope: '贷中', status: '启用' as const, priority: 'P1', owner: '陈立', updatedAt: '2026-04-03', dataSources: ['对公流水', '回款流水'], actionChain: '临时收缩额度 → 生成复核', hitRate: '3.5%', hitCount: 59, falsePositiveRate: '15.3%', reviewPassRate: '62%', contribution: '提前预警 14 户', trend: 'up' as const },
    { id: 'R-012', name: '资金外流规则', category: '贷中' as const, trigger: '连续 3 周净流出', scope: '贷中', status: '灰度' as const, priority: 'P2', owner: '陈立', updatedAt: '2026-04-08', dataSources: ['对公流水'], actionChain: '生成排查任务 → 人工复核', hitRate: '—', hitCount: 0, falsePositiveRate: '—', reviewPassRate: '—', contribution: '灰度验证中', trend: 'stable' as const },
  ];

  const CATEGORY_STYLES: Record<string, string> = {
    '基础': 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
    '排除': 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
    '增强': 'bg-[#F0FDF4] text-[#047857] border-[#A7F3D0]',
    '准入': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
    '贷中': 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]',
  };

  // ─── Product matching logic ────────────────────────────────────────────────
  const recommendedProduct = PRODUCTS.find((p) =>
    currentSample.productType.includes(p.name) ||
    (currentSample.productType.includes('运费') && p.name === '运费贷') ||
    (currentSample.productType.includes('订单') && p.name === '订单微贷'),
  ) ?? PRODUCTS[2];

  const alternativeProducts = PRODUCTS.filter((p) => p.id !== recommendedProduct.id).slice(0, 2);

  const matchReasons = [
    `年度销售规模 ${currentSample.annualSales}，匹配产品额度区间 ${recommendedProduct.limit}`,
    `角色为"${currentSample.roleInChain}"，适用"${recommendedProduct.segment}"客群`,
    `关系强度 ${currentSample.relationStrength}%，真实性得分 ${currentSample.authenticityScore}%`,
    `证据覆盖 ${currentSample.evidenceCoverage}%，命中规则包: ${recommendedProduct.rulePackage}`,
  ];

  const noMatchReasons = alternativeProducts.map((p) => ({
    product: p.name,
    reason: p.name === '信用快贷' ? '非行内存量客户，不满足公私联动前提' :
      p.name === '数据贷' ? `税票流水评分不足，连续开票 ${currentSample.invoiceContinuityMonths} 月低于标准阈值` :
      p.name === '运费贷' ? '业务模式非物流服务履约，运单频次不适用' :
      `产品类型"${p.name}"与"${currentSample.roleInChain}"不匹配`,
  }));

  const renderContent = () => {
    switch (activeModule) {
      // ═══════════════════════════════════════════════════════════════════════
      // PAGE 2: 审批流程
      // ═══════════════════════════════════════════════════════════════════════
      case 'flow':
        return (
          <div className="space-y-4">
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 flex items-center justify-between text-[11px] text-[#94A3B8]">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-[#0F172A]">审批流程</span>
                <span>当前样本:</span>
                <SampleSwitcher selectedId={selectedSampleId} onSelect={selectSample} compact />
              </div>
              <Badge className={isPastApproval ? 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0] text-[10px]' : isAtManualReview ? 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA] text-[10px]' : 'bg-[#EFF6FF] text-[#1890FF] border-[#BFDBFE] text-[10px]'}>{isPastApproval ? '已通过' : isAtManualReview ? '补审中' : '流程中'}</Badge>
            </div>
            <div className="flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-white px-4 py-3">
              {['线索识别', '预授信评估', '产品匹配', '三流交叉验证', '人工补审', '审批结论'].map((step, i) => {
                const stageMap: Record<string, number> = { identified: 0, pre_credit: 1, manual_review: 4, approved: 5, risk_alert: 5, recovery: 5 };
                const currentIdx = stageMap[currentSample.stage] ?? 0;
                const done = i < currentIdx;
                const isCurrent = i === currentIdx;
                return (
                  <React.Fragment key={step}>
                    {i > 0 && <div className={`flex-1 h-px ${done ? 'bg-[#16A34A]' : 'bg-[#E2E8F0]'}`} />}
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] shrink-0 ${done ? 'bg-[#ECFDF3] text-[#047857]' : isCurrent ? 'bg-[#EFF6FF] text-[#2563EB] ring-1 ring-[#2563EB]/30' : 'bg-[#F8FAFC] text-[#94A3B8]'}`}>
                      {done ? <CheckCircle size={12} /> : <div className={`w-3 h-3 rounded-full border-2 ${isCurrent ? 'border-[#2563EB] bg-[#2563EB]' : 'border-[#CBD5E1]'}`} />}
                      <span className="font-medium">{step}</span>
                    </div>
                  </React.Fragment>
                );
              })}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { node: '产品匹配', desc: `推荐产品: ${recommendedProduct.name}`, detail: `额度 ${currentSample.recommendedLimit}，期限 ${recommendedProduct.term}`, status: currentSample.stage !== 'identified' ? '已完成' : '待执行' },
                { node: '三流交叉验证', desc: `订单 ${currentSample.orderCount90d} 笔 / 发票 ${currentSample.invoiceContinuityMonths} 月 / 回款 ${currentSample.avgReceivableCycle}`, detail: `覆盖率 ${currentSample.evidenceCoverage}%`, status: currentSample.evidenceCoverage > 70 ? '已完成' : '进行中' },
                { node: '人工补审', desc: currentSample.reviewReason, detail: `置信度 ${currentSample.authenticityScore}%`, status: isPastApproval ? '已完成' : isAtManualReview ? '进行中' : '待执行' },
              ].map(n => (
                <div key={n.node} className="rounded-lg border border-[#E2E8F0] bg-white p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-[#0F172A]">{n.node}</span>
                    <Badge className={`text-[9px] border ${n.status === '已完成' ? 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]' : n.status === '进行中' ? 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]' : 'bg-[#F8FAFC] text-[#94A3B8] border-[#E2E8F0]'}`}>{n.status}</Badge>
                  </div>
                  <div className="text-[11px] text-[#64748B] leading-4">{n.desc}</div>
                  <div className="text-[10px] text-[#94A3B8]">{n.detail}</div>
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-3 text-[12px] text-[#2563EB]">
              <span className="font-medium">AI 建议: </span>{currentSample.aiSummary}
            </div>
            {active && <ActionBar />}
          </div>
        );

      // ═══════════════════════════════════════════════════════════════════════
      // PAGE 3: 审批摘要 (NEW)
      // ═══════════════════════════════════════════════════════════════════════
      case 'summary':
        return (
          <div className="space-y-4">
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 flex items-center justify-between text-[11px] text-[#94A3B8]">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-[#0F172A]">审批摘要</span>
                <SampleSwitcher selectedId={selectedSampleId} onSelect={selectSample} compact />
              </div>
              <Badge className="bg-[#EFF6FF] text-[#1890FF] border-[#BFDBFE] text-[10px]">自动生成</Badge>
            </div>
            <div className="rounded-lg border border-[#E2E8F0] bg-white p-5 space-y-4">
              <div className="text-[14px] font-semibold text-[#0F172A]">{currentSample.shortName} — 审批依据摘要</div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="text-[11px] font-medium text-[#64748B]">企业信息</div>
                  {[
                    { k: '企业全称', v: currentSample.companyName },
                    { k: '产业链角色', v: currentSample.roleInChain },
                    { k: '年销售额', v: currentSample.annualSales },
                    { k: '关系强度', v: `${currentSample.relationStrength}%` },
                    { k: '真实性评分', v: `${currentSample.authenticityScore}%` },
                  ].map(r => (
                    <div key={r.k} className="flex items-center justify-between text-[12px]">
                      <span className="text-[#94A3B8]">{r.k}</span>
                      <span className="text-[#0F172A] font-medium">{r.v}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-3">
                  <div className="text-[11px] font-medium text-[#64748B]">授信决策</div>
                  {[
                    { k: '推荐产品', v: recommendedProduct.name },
                    { k: '推荐额度', v: currentSample.recommendedLimit },
                    { k: '审批状态', v: currentSample.approvalStatus },
                    { k: '风险状态', v: currentSample.riskStatus },
                    { k: '证据覆盖', v: `${currentSample.evidenceCoverage}%` },
                  ].map(r => (
                    <div key={r.k} className="flex items-center justify-between text-[12px]">
                      <span className="text-[#94A3B8]">{r.k}</span>
                      <span className="text-[#0F172A] font-medium">{r.v}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-[#F1F5F9] pt-3 space-y-2">
                <div className="text-[11px] font-medium text-[#64748B]">经营证据</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { k: '近90天订单', v: `${currentSample.orderCount90d} 笔 / ${currentSample.orderAmount90d}` },
                    { k: '发票连续', v: `${currentSample.invoiceContinuityMonths} 个月` },
                    { k: '平均回款周期', v: currentSample.avgReceivableCycle },
                    { k: '物流', v: currentSample.logisticsStatus },
                  ].map(r => (
                    <div key={r.k} className="rounded border border-[#E2E8F0] px-3 py-2">
                      <div className="text-[10px] text-[#94A3B8]">{r.k}</div>
                      <div className="text-[12px] font-medium text-[#0F172A] mt-0.5">{r.v}</div>
                    </div>
                  ))}
                </div>
              </div>
              {currentSample.riskFlags.length > 0 && (
                <div className="border-t border-[#F1F5F9] pt-3 space-y-2">
                  <div className="text-[11px] font-medium text-[#DC2626]">风险标记</div>
                  <div className="flex flex-wrap gap-1">
                    {currentSample.riskFlags.map(f => (
                      <Badge key={f} className="bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5] text-[9px]">{f}</Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="border-t border-[#F1F5F9] pt-3">
                <div className="text-[11px] font-medium text-[#64748B] mb-1">AI 综合判断</div>
                <div className="rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] px-4 py-3 text-[12px] text-[#2563EB] leading-5">{currentSample.aiSummary}</div>
              </div>
            </div>
            {active && <ActionBar />}
          </div>
        );

      // ═══════════════════════════════════════════════════════════════════════
      // PAGE 1: 产品匹配 (DEFAULT)
      // ═══════════════════════════════════════════════════════════════════════
      case 'matching':
      default:
        return (
          <div className="space-y-4">
            {active && <SceneHero question="为什么匹配这个产品、为什么能通过补审" />}

            <div className="rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-2.5 flex items-center gap-2 text-[12px]">
              <Zap size={14} className="text-[#2563EB] shrink-0" />
              <span className="text-[#2563EB] font-medium">产品匹配</span>
              <span className="text-[#64748B]">·</span>
              <SampleSwitcher selectedId={selectedSampleId} onSelect={selectSample} compact />
              <span className="text-[#64748B]">· 为什么这个客户适合这个产品</span>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[0.35fr_0.65fr] gap-4">
              {/* Left: Sample list */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white">
                <div className="px-4 py-3 border-b border-[#E2E8F0]">
                  <span className="text-sm font-semibold text-[#0F172A]">候选样本</span>
                </div>
                <div className="divide-y divide-[#F1F5F9]">
                  {SAMPLES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => selectSample(s.id)}
                      className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${s.id === selectedSampleId ? 'bg-[#EFF6FF]' : 'hover:bg-[#F8FAFC]'}`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-medium ${s.id === selectedSampleId ? 'text-[#2563EB]' : 'text-[#0F172A]'}`}>{s.shortName}</span>
                          <Badge className={`text-[9px] border ${s.segmentTag.startsWith('A') ? 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]' : s.segmentTag.startsWith('B') ? 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]' : s.segmentTag.startsWith('D') ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]' : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]'}`}>
                            {s.segmentTag}
                          </Badge>
                        </div>
                        <div className="text-[10px] text-[#94A3B8] mt-0.5">{s.roleInChain}</div>
                      </div>
                      <ChevronRight size={12} className="text-[#CBD5E1] shrink-0" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: Matching result */}
              <div className="space-y-4">
                {/* Recommended product */}
                <div className="rounded-lg border border-[#D6E4FF] bg-white overflow-hidden">
                  <div className="px-5 py-3 bg-[#FAFBFF] border-b border-[#D6E4FF] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-[#2563EB]" />
                      <span className="text-sm font-semibold text-[#0F172A]">推荐产品</span>
                    </div>
                    <Badge className="bg-[#2563EB] text-white text-[10px]">最佳匹配</Badge>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-bold text-[#0F172A]">{recommendedProduct.name}</div>
                        <div className="mt-0.5 text-[11px] text-[#64748B]">{recommendedProduct.target}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-[#94A3B8]">建议额度</div>
                        <div className="text-xl font-bold text-[#2563EB]">{currentSample.recommendedLimit}</div>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-4 gap-3">
                      {[
                        { label: '额度区间', value: recommendedProduct.limit },
                        { label: '定价', value: recommendedProduct.rate },
                        { label: '期限', value: recommendedProduct.term },
                        { label: '状态', value: recommendedProduct.status },
                      ].map((f) => (
                        <div key={f.label} className="rounded-md bg-[#F8FAFC] border border-[#F1F5F9] px-2.5 py-2">
                          <div className="text-[10px] text-[#94A3B8]">{f.label}</div>
                          <div className="mt-0.5 text-xs font-medium text-[#0F172A]">{f.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Match reasons */}
                <PanelCard title="匹配依据">
                  <div className="space-y-2">
                    {matchReasons.map((r, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs leading-5">
                        <CheckCircle2 size={14} className="text-[#16A34A] shrink-0 mt-0.5" />
                        <span className="text-[#334155]">{r}</span>
                      </div>
                    ))}
                  </div>
                </PanelCard>

                {/* Rule hits for this sample */}
                <PanelCard title={`${currentSample.shortName} 规则命中`}>
                  <div className="space-y-1.5">
                    {sampleRuleHits.map((rule) => (
                      <div key={rule.id} className="flex items-center justify-between rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2">
                        <div>
                          <span className="text-xs font-medium text-[#334155]">{rule.name}</span>
                          <span className="ml-2 text-[11px] text-[#64748B]">{rule.reason}</span>
                        </div>
                        <Badge className={rule.result === 'pass' ? 'bg-[#ECFDF3] text-[#047857] border border-[#A7F3D0] text-[10px]' : rule.result === 'warn' ? 'bg-[#FFF7ED] text-[#C2410C] border border-[#FED7AA] text-[10px]' : 'bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA] text-[10px]'}>
                          {rule.result === 'pass' ? '通过' : rule.result === 'warn' ? '关注' : '补审'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </PanelCard>

                {/* Why NOT other products */}
                <PanelCard title="不推荐其他产品的原因">
                  <div className="space-y-2">
                    {noMatchReasons.map((nm) => (
                      <div key={nm.product} className="flex items-start gap-2 rounded-md border border-[#E2E8F0] bg-white px-3 py-2.5">
                        <CircleAlert size={14} className="text-[#94A3B8] shrink-0 mt-0.5" />
                        <div>
                          <span className="text-xs font-medium text-[#0F172A]">{nm.product}</span>
                          <span className="ml-1.5 text-[11px] text-[#64748B]">— {nm.reason}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </PanelCard>

                <AiNote action={currentSample.agentHints.suggestedAction}>
                  {currentSample.aiSummary}
                </AiNote>
              </div>
            </div>

            {active && <ActionBar />}
          </div>
        );

      // ═══════════════════════════════════════════════════════════════════════
      // PAGE 4: 补审作业 (merged workflow + conclusion)
      // ═══════════════════════════════════════════════════════════════════════
      case 'review':
        return (
          <div className="space-y-4">
            {active && <SceneHero question="为什么匹配这个产品、为什么能通过补审" />}

            {/* 补审流程条 */}
            <div className="flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-white px-4 py-3">
              {['提交补审', '证据核验', '规则复核', '人工判断（增强审批）', '审批结论'].map((step, i) => {
                const currentIdx = isPastApproval ? 4 : isAtManualReview ? 3 : 1;
                const done = i < currentIdx;
                const isCurrent = i === currentIdx;
                return (
                  <React.Fragment key={step}>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium ${done ? 'bg-[#ECFDF3] text-[#047857]' : isCurrent ? 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]' : 'text-[#94A3B8]'}`}>
                      <span className={`w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold ${done ? 'bg-[#047857] text-white' : isCurrent ? 'bg-[#2563EB] text-white' : 'bg-[#E2E8F0] text-[#94A3B8]'}`}>{done ? '✓' : i + 1}</span>
                      {step}
                    </div>
                    {i < 4 && <div className={`flex-1 h-px ${i < currentIdx ? 'bg-[#047857]' : 'bg-[#E2E8F0]'}`} />}
                  </React.Fragment>
                );
              })}
            </div>

            <div className="rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-2.5 flex items-center gap-2 text-[12px]">
              <FileCheck2 size={14} className="text-[#2563EB] shrink-0" />
              <span className="text-[#2563EB] font-medium">补审作业</span>
              <span className="text-[#64748B]">·</span>
              <SampleSwitcher selectedId={selectedSampleId} onSelect={selectSample} compact />
              <span className="text-[#64748B]">· 状态: {isPastApproval ? '已批准' : isAtManualReview ? '补审中' : currentSample.approvalStatus}</span>
            </div>

            {/* ── UPPER: Flow verification ── */}
            <SectionShell title="证据交叉验证" subtitle={`${currentSample.shortName} · 三流验证 · 证据等级: ${evidenceGrade} (${currentSample.evidenceCoverage}%)`}>
              <div className="flex flex-wrap gap-2 mb-4">
                {verificationFlows.map((flow, index) => (
                  <button
                    key={flow.id}
                    onClick={() => setSelectedFlowId(flow.id)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${flow.id === selectedFlowId ? 'bg-[#1890FF] text-white' : 'bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0]'}`}
                  >
                    证据链 {index + 1}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                {[
                  { icon: <PackageCheck size={16} className="text-[#1890FF]" />, title: '订单流', badge: '源头证据', color: 'border-[#D7E8FF]', fields: [['订单编号', selectedFlow.order.code], ['采购方', selectedFlow.order.counterpart], ['订单金额', selectedFlow.order.amount], ['日期', `2026-${selectedFlow.order.date}`]] },
                  { icon: <Route size={16} className="text-[#047857]" />, title: '物流轨迹', badge: '履约证据', color: 'border-[#CCF5DE]', fields: [['运单编号', selectedFlow.logistics.code], ['状态', selectedFlow.logistics.status], ['路线', selectedFlow.logistics.route], ['日期', `2026-${selectedFlow.logistics.date}`]] },
                  { icon: <Wallet size={16} className="text-[#C2410C]" />, title: '回款流水', badge: '资金证据', color: 'border-[#FDE7C2]', fields: [['流水号', selectedFlow.settlement.code], ['金额', selectedFlow.settlement.amount], ['周期', selectedFlow.settlement.cycle], ['日期', `2026-${selectedFlow.settlement.date}`]] },
                ].map((col) => (
                  <div key={col.title} className={`rounded-xl border ${col.color} bg-white p-4`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">{col.icon}<span className="text-sm font-semibold text-[#0F172A]">{col.title}</span></div>
                      <Badge className="bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0] text-[9px]">{col.badge}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2.5">
                      {col.fields.map(([label, val]) => (
                        <div key={label}>
                          <div className="text-[10px] text-[#94A3B8]">{label}</div>
                          <div className="mt-0.5 text-xs font-medium text-[#334155]">{val}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] p-3 flex items-start gap-2">
                <CircleDot size={12} className="text-[#94A3B8] shrink-0 mt-1" />
                <span className="text-[11px] text-[#64748B] leading-5">
                  <span className="font-medium text-[#334155]">脱核逻辑：</span>
                  链主"{currentSample.mainChainPath[0]}"未直接确权，桥接节点"{currentSample.keyCounterparty}"证据覆盖 {currentSample.evidenceCoverage}%，{currentSample.evidenceCoverage >= 80 ? '足以证明真实交易背景' : '仍需补充更多证据'}。
                </span>
              </div>
            </SectionShell>

            {/* Rule hits + Approval action */}
            <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-4">
              <PanelCard title="规则命中">
                <div className="space-y-2">
                  {sampleRuleHits.map((rule) => (
                    <div key={rule.id} className="rounded-md border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-[13px] font-semibold text-[#0F172A]">{rule.name}</span>
                        <Badge className={rule.result === 'pass' ? 'bg-[#ECFDF3] text-[#047857] border border-[#A7F3D0]' : rule.result === 'warn' ? 'bg-[#FFF7ED] text-[#C2410C] border border-[#FED7AA]' : 'bg-[#FEF2F2] text-[#B91C1C] border border-[#FECACA]'}>
                          {rule.result === 'pass' ? '通过' : rule.result === 'warn' ? '关注' : '补审'}
                        </Badge>
                      </div>
                      <p className="mt-1 text-[11px] text-[#64748B]">{rule.reason}</p>
                    </div>
                  ))}
                </div>
              </PanelCard>

              <div className="space-y-4">
                {/* Approval card */}
                <div className="rounded-xl bg-gradient-to-br from-[#1E40AF] via-[#2563EB] to-[#3B82F6] p-5 text-white relative overflow-hidden">
                  <div className="text-xs text-white/60 font-medium uppercase tracking-wider">审批方案</div>
                  <div className="mt-2">
                    <span className="text-3xl font-bold tracking-tight">{currentSample.recommendedLimit}</span>
                    <span className="ml-1.5 text-sm text-white/50">{currentSample.productType}</span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    {[
                      ['关系强度', `${currentSample.relationStrength}%`],
                      ['审批状态', currentSample.approvalStatus],
                      ['置信度', `${currentSample.agentHints.confidence}%`],
                      ['当前额度', currentSample.currentLimit],
                    ].map(([label, val]) => (
                      <div key={label}>
                        <div className="text-[10px] text-white/50">{label}</div>
                        <div className="mt-0.5 text-sm font-medium text-white/90">{val}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 rounded-lg bg-white/10 border border-white/15 px-3 py-2">
                    <div className="text-[10px] text-white/50 mb-1">脱核链贷口径</div>
                    <div className="text-[11px] text-white/80 leading-4">未取得链主直接确权，依据替代性证据进行增强审批。强证据支持「建议通过」，但不等于取消补审。</div>
                  </div>
                  {active && isAtManualReview && (
                    <Button className="mt-3 w-full bg-white text-[#2563EB] hover:bg-white/90 font-semibold" onClick={handleApprove}>
                      建议通过，提交复核
                    </Button>
                  )}
                  {isPastApproval && (
                    <div className="mt-3 flex items-center gap-2 rounded-lg bg-white/15 border border-white/20 px-3 py-2">
                      <CheckCircle2 size={14} className="text-[#4ADE80]" />
                      <span className="text-xs text-white/90">增强审批已通过</span>
                    </div>
                  )}
                </div>

                <AiNote action={currentSample.agentHints.suggestedAction}>
                  {currentSample.aiSummary}
                </AiNote>
              </div>
            </div>

            {/* ── LOWER: Conclusion deposit ── */}
            <SectionShell title="审批结论沉淀" subtitle={`${currentSample.shortName} · ${currentSample.roleInChain}`}>
              <div className="grid grid-cols-1 xl:grid-cols-[1fr_0.35fr] gap-4">
                <div className="space-y-3">
                  <PanelCard title="证据摘要">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {[
                        { label: '90天订单', value: `${currentSample.orderCount90d} 笔 / ${currentSample.orderAmount90d}` },
                        { label: '连续开票', value: `${currentSample.invoiceContinuityMonths} 月` },
                        { label: '物流状态', value: currentSample.logisticsStatus },
                        { label: '资金流水', value: currentSample.accountFlowStatus },
                        { label: '集中度', value: currentSample.maxCustomerConcentration },
                        { label: '证据覆盖', value: `${currentSample.evidenceCoverage}%` },
                      ].map((m) => (
                        <div key={m.label} className="rounded-md bg-[#F8FAFC] border border-[#F1F5F9] px-2.5 py-2">
                          <div className="text-[10px] text-[#94A3B8]">{m.label}</div>
                          <div className="mt-0.5 text-xs font-semibold text-[#0F172A]">{m.value}</div>
                        </div>
                      ))}
                    </div>
                  </PanelCard>

                  <PanelCard title="风险提示">
                    <p className="text-[12px] text-[#334155] leading-5">{currentSample.reviewReason}</p>
                    {currentSample.riskFlags.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {currentSample.riskFlags.map((f) => (
                          <Badge key={f} className="bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] text-[10px]">{f}</Badge>
                        ))}
                      </div>
                    )}
                  </PanelCard>

                  <PanelCard title="审批建议（增强审批）">
                    <div className="rounded-md border border-[#FDE68A] bg-[#FFFBEB] px-3 py-2 mb-2">
                      <p className="text-[11px] text-[#92400E] leading-4">本样本未取得链主直接确权，审批结论基于替代性证据增强判断，不等于系统自动放款。</p>
                    </div>
                    <div className="rounded-md border border-[#D6E4FF] bg-[#EFF6FF] px-3 py-2.5">
                      <p className="text-xs text-[#0F172A] leading-5">{currentSample.aiSummary}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge className="bg-white text-[#2563EB] border border-[#BFDBFE] text-[10px]">额度: {currentSample.recommendedLimit}</Badge>
                        <Badge className="bg-white text-[#047857] border border-[#A7F3D0] text-[10px]">产品: {currentSample.productType}</Badge>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-2">
                      {[
                        { label: '建议通过', tone: 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]', active: currentSample.segmentTag === 'A可授信' },
                        { label: '建议通过但降额', tone: 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]', active: currentSample.approvalStatus === '已降额' },
                        { label: '建议补充材料', tone: 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]', active: currentSample.segmentTag === 'C待观察' },
                        { label: '建议退回', tone: 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]', active: false },
                      ].map(opt => (
                        <div key={opt.label} className={`text-center rounded-md border px-2 py-1.5 text-[11px] font-medium ${opt.active ? opt.tone : 'bg-[#F8FAFC] text-[#94A3B8] border-[#E2E8F0]'}`}>
                          {opt.label}
                        </div>
                      ))}
                    </div>
                  </PanelCard>
                </div>

                <div className="space-y-3">
                  <ConfidenceCard
                    score={currentSample.authenticityScore}
                    label="综合真实性评分"
                    breakdowns={[
                      { name: '关系强度', value: currentSample.relationStrength },
                      { name: '证据覆盖', value: currentSample.evidenceCoverage },
                      { name: '真实性', value: currentSample.authenticityScore },
                    ]}
                  />
                  <AiJudgmentBlock
                    judgment={currentSample.aiSummary}
                    basis={[
                      `关系强度 ${currentSample.relationStrength}%`,
                      `证据覆盖 ${currentSample.evidenceCoverage}%`,
                      `真实性评分 ${currentSample.authenticityScore}%`,
                      currentSample.reviewReason,
                    ]}
                    confidence={currentSample.agentHints.confidence}
                    action={currentSample.nextAction}
                  />
                </div>
              </div>
            </SectionShell>

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
