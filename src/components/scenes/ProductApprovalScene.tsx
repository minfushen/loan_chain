import React from 'react';
import SceneLayout from '../SceneLayout';
import { SCENES } from '../../constants';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  CheckCircle2,
  ChevronRight,
  CircleAlert,
  CircleDot,
  Clock,
  CreditCard,
  Eye,
  FileCheck2,
  FileText,
  Filter,
  Info,
  Link2,
  PackageCheck,
  Pencil,
  Route,
  Search,
  ShieldCheck,
  Sparkles,
  Upload,
  User,
  Wallet,
  XCircle,
  Zap,
} from 'lucide-react';
import {
  AiNote,
  SampleSwitcher,
  PanelCard,
  SectionShell,
  ConfidenceCard,
  AiJudgmentBlock,
} from '../ProductPrimitives';
import { useDemo, STAGE_ORDER } from '../../demo/DemoContext';
import { SceneHero, ActionBar } from '../../demo/DemoComponents';
import { SAMPLES, getRuleHitsForSample } from '../../demo/chainLoan/data';
import { cn } from '@/lib/utils';

/* ══════════════════════════════════════════════════════════════════════════
   Types & Constants
   ══════════════════════════════════════════════════════════════════════════ */

interface Props {
  activeModule: string;
  onModuleChange: (id: string) => void;
}

const PRODUCT_CATALOG = [
  {
    id: 'P-001', name: '公私联动贷', icon: Link2,
    target: '法人按揭/代发/结算客户', limit: '50–200万', rate: '4.5%–5.8%', term: '12个月',
    segment: '存量唤醒', riskLevel: '低风险' as const, status: '已上线' as const,
    tags: ['公私联动', '法人按揭客户', '代发稳定'],
    matchCondition: (s: typeof SAMPLES[0]) => s.relationStrength >= 80 && s.authenticityScore >= 85,
  },
  {
    id: 'P-002', name: '税易贷', icon: FileText,
    target: '税票流水达标小微', limit: '50–200万', rate: '6.2%–7.5%', term: '6–12个月',
    segment: '标准数据授信', riskLevel: '低风险' as const, status: '已上线' as const,
    tags: ['纳税稳定', '高新企业', '无逾期'],
    matchCondition: (s: typeof SAMPLES[0]) => s.invoiceContinuityMonths >= 10,
  },
  {
    id: 'P-003', name: '订单微贷', icon: PackageCheck,
    target: '脱核链贷场景主体', limit: '30–150万', rate: '7.0%–8.2%', term: '6个月',
    segment: '长尾场景', riskLevel: '中风险' as const, status: '试运行' as const,
    tags: ['产业链关系', '三流验证', '脱核补审'],
    matchCondition: (s: typeof SAMPLES[0]) => s.productType.includes('订单'),
  },
  {
    id: 'P-004', name: '运费贷', icon: Route,
    target: '链上物流服务主体', limit: '20–100万', rate: '6.8%–7.8%', term: '3–6个月',
    segment: '长尾场景', riskLevel: '中风险' as const, status: '试运行' as const,
    tags: ['运单频次', '结算验证', '履约稳定'],
    matchCondition: (s: typeof SAMPLES[0]) => s.productType.includes('运费'),
  },
];

const RISK_LEVEL_STYLES = {
  '低风险': 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]',
  '中风险': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
  '高风险': 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
};

/* ══════════════════════════════════════════════════════════════════════════
   ConfidenceDots — 双维置信度点阵
   ══════════════════════════════════════════════════════════════════════════ */
function ConfidenceDots({ label, value, max = 5 }: { label: string; value: number; max?: number }) {
  const filled = Math.round((value / 100) * max);
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-[10px] text-[#94A3B8] w-3">{label}</span>
      <div className="flex gap-0.5">
        {Array.from({ length: max }).map((_, i) => (
          <div key={i} className={`w-2 h-2 rounded-full ${i < filled ? 'bg-[#16A34A]' : 'bg-[#E5E6EB]'}`} />
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════════════════════════════════ */

export default function ProductApprovalScene({ activeModule, onModuleChange }: Props) {
  const scene = SCENES.find((s) => s.id === 'product-approval')!;
  const { active, stage, stageIndex, advanceStage, currentSample, selectSample, selectedSampleId } = useDemo();
  const [selectedFlowId, setSelectedFlowId] = React.useState('flow-2');
  const [productTypeFilter, setProductTypeFilter] = React.useState<string>('all');
  const [riskFilter, setRiskFilter] = React.useState<string>('all');
  const [reviewFilter, setReviewFilter] = React.useState<string>('all');
  const [reviewTimeFilter, setReviewTimeFilter] = React.useState<string>('all');

  const isPastApproval = stageIndex >= STAGE_ORDER.indexOf('approved');
  const isAtManualReview = stage === 'manual_review';
  const sampleRuleHits = getRuleHitsForSample(currentSample);

  const counterparty = currentSample.keyCounterparty;
  const sender = currentSample.mainChainPath[currentSample.mainChainPath.length - 1];
  const baseAmt = parseInt(currentSample.orderAmount90d) || 100;
  const baseCycle = parseInt(currentSample.avgReceivableCycle) || 30;
  const hasLogisticsIssue = currentSample.logisticsStatus.includes('延迟') || currentSample.logisticsStatus.includes('不连续');
  const evidenceGrade = currentSample.evidenceCoverage >= 85 ? '充分' : currentSample.evidenceCoverage >= 65 ? '一般' : '不足';

  const matchedProduct = PRODUCT_CATALOG.find(p => p.matchCondition(currentSample)) ?? PRODUCT_CATALOG[2];
  const otherProducts = PRODUCT_CATALOG.filter(p => p.id !== matchedProduct.id);

  const filteredProducts = PRODUCT_CATALOG.filter(p => {
    if (productTypeFilter !== 'all' && p.name !== productTypeFilter) return false;
    if (riskFilter !== 'all' && p.riskLevel !== riskFilter) return false;
    return true;
  });

  const riskWarnings: string[] = [];
  if (currentSample.riskFlags.length > 0) riskWarnings.push(...currentSample.riskFlags);
  if (parseInt(currentSample.maxCustomerConcentration) > 50) riskWarnings.push('客户集中度偏高');
  if (hasLogisticsIssue) riskWarnings.push('需核实下游履约周期');

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
  const selectedFlow = verificationFlows.find(f => f.id === selectedFlowId) ?? verificationFlows[0];

  const handleApprove = () => { if (isAtManualReview && active) advanceStage(); };

  const renderContent = () => {
    switch (activeModule) {

      /* ════════════════════════════════════════════════════════════════════
         PAGE 1: 产品匹配 (DEFAULT)
         基于公私联动验证结果，卡片式产品推荐
         ════════════════════════════════════════════════════════════════════ */
      case 'matching':
      default:
        return (
          <div className="space-y-4">
            {/* Context bar */}
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3 text-[12px]">
                <Zap size={14} className="text-[#2563EB]" />
                <span className="text-[13px] font-semibold text-[#0F172A]">产品匹配</span>
                <span className="text-[#94A3B8]">·</span>
                <SampleSwitcher selectedId={selectedSampleId} onSelect={selectSample} compact />
              </div>
              <div className="flex items-center gap-2">
                <ConfidenceDots label="企" value={currentSample.relationStrength} />
                <ConfidenceDots label="人" value={currentSample.authenticityScore} />
              </div>
            </div>

            {/* Filter bar */}
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
                <Filter size={12} />
                <span>筛选:</span>
              </div>
              <select className="h-7 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-2 text-[11px] text-[#334155]" value={productTypeFilter} onChange={e => setProductTypeFilter(e.target.value)}>
                <option value="all">全部产品</option>
                {PRODUCT_CATALOG.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
              </select>
              <select className="h-7 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-2 text-[11px] text-[#334155]" value={riskFilter} onChange={e => setRiskFilter(e.target.value)}>
                <option value="all">全部风险</option>
                <option value="低风险">低风险</option>
                <option value="中风险">中风险</option>
              </select>
              <div className="flex-1" />
              <span className="text-[10px] text-[#94A3B8]">共 {filteredProducts.length} 款产品</span>
            </div>

            {/* Product cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredProducts.map(product => {
                const isRecommended = product.id === matchedProduct.id;
                const Icon = product.icon;
                return (
                  <div key={product.id} className={cn(
                    'rounded-xl border bg-white overflow-hidden transition-shadow hover:shadow-md',
                    isRecommended ? 'border-[#2563EB] ring-1 ring-[#2563EB]/20' : 'border-[#E2E8F0]'
                  )}>
                    {/* Card header */}
                    <div className={cn('px-5 py-3 flex items-center justify-between', isRecommended ? 'bg-[#EFF6FF]' : 'bg-[#F8FAFC]')}>
                      <div className="flex items-center gap-2.5">
                        <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center', isRecommended ? 'bg-[#2563EB] text-white' : 'bg-[#E2E8F0] text-[#64748B]')}>
                          <Icon size={16} />
                        </div>
                        <div>
                          <div className="text-[14px] font-semibold text-[#0F172A]">{product.name}</div>
                          <div className="text-[10px] text-[#94A3B8]">{product.target}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {isRecommended && <Badge className="bg-[#2563EB] text-white text-[9px]">最佳匹配</Badge>}
                        <Badge className={cn('text-[9px] border', RISK_LEVEL_STYLES[product.riskLevel])}>{product.riskLevel}</Badge>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="px-5 py-4 space-y-3">
                      <div className="grid grid-cols-3 gap-3">
                        <div><div className="text-[10px] text-[#94A3B8]">额度</div><div className="text-sm font-bold text-[#0F172A]">{product.limit}</div></div>
                        <div><div className="text-[10px] text-[#94A3B8]">年化利率</div><div className="text-sm font-bold text-[#0F172A]">{product.rate}</div></div>
                        <div><div className="text-[10px] text-[#94A3B8]">期限</div><div className="text-sm font-bold text-[#0F172A]">{product.term}</div></div>
                      </div>

                      {/* Match tags */}
                      <div>
                        <div className="text-[10px] text-[#94A3B8] mb-1.5">匹配理由</div>
                        <div className="flex flex-wrap gap-1.5">
                          {product.tags.map(tag => (
                            <span key={tag} className={cn(
                              'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-medium border',
                              isRecommended ? 'bg-[#E8F3FF] text-[#1677FF] border-[#B3D4FF]' : 'bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]'
                            )}>
                              🏷️ {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Risk warning */}
                      {isRecommended && riskWarnings.length > 0 && (
                        <div className="text-[11px] text-[#94A3B8] leading-4 flex items-start gap-1.5">
                          <Info size={12} className="shrink-0 mt-0.5 text-[#CBD5E1]" />
                          <span>{riskWarnings.join('；')}</span>
                        </div>
                      )}

                      {/* Not matched reason */}
                      {!isRecommended && (
                        <div className="text-[11px] text-[#94A3B8] leading-4 flex items-start gap-1.5">
                          <CircleAlert size={12} className="shrink-0 mt-0.5 text-[#CBD5E1]" />
                          <span>
                            {product.name === '公私联动贷' ? '当前企业非行内存量客户，公私联动前置条件不满足' :
                             product.name === '税易贷' ? `连续开票 ${currentSample.invoiceContinuityMonths} 月，税票评分未达标` :
                             product.name === '运费贷' ? '业务模式非物流服务履约，运单频次条件不适用' :
                             `当前客户"${currentSample.roleInChain}"与产品适用客群不匹配`}
                          </span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-1">
                        <Button
                          size="sm"
                          className={cn('h-8 text-[11px] gap-1.5', isRecommended ? 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white' : 'bg-white border border-[#E2E8F0] text-[#334155] hover:bg-[#F8FAFC]')}
                          onClick={() => isRecommended && onModuleChange('flow')}
                        >
                          {isRecommended ? <><CheckCircle2 size={12} /> 选择此产品</> : '选择此产品'}
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 text-[11px] text-[#64748B] gap-1">
                          <Eye size={12} /> 查看详情
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* AI recommendation strip */}
            <div className="rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-3 flex items-start gap-2.5 text-[12px]">
              <Sparkles size={14} className="text-[#2563EB] shrink-0 mt-0.5" />
              <div>
                <span className="font-medium text-[#2563EB]">AI 推荐: </span>
                <span className="text-[#334155]">基于{currentSample.shortName}的公私联动验证结果（企业置信度 {currentSample.relationStrength}%、个人置信度 {currentSample.authenticityScore}%），</span>
                <span className="font-medium text-[#0F172A]">推荐"{matchedProduct.name}"，建议额度 {currentSample.recommendedLimit}。</span>
              </div>
            </div>

            {active && <ActionBar />}
          </div>
        );

      /* ════════════════════════════════════════════════════════════════════
         PAGE 2: 预审与推单
         本系统终点 = 预审通过 → 推送信贷系统，不越权做最终审批/放款
         ════════════════════════════════════════════════════════════════════ */
      case 'flow': {
        const flowNodes = [
          {
            step: '客户经理提交预审',
            desc: `${currentSample.shortName} 提交产品匹配与预审申请`,
            operator: '张三经理',
            time: '10分钟前',
            done: true,
            rejected: false,
          },
          {
            step: '系统自动核验',
            desc: `公私联动验证通过 · 双维置信度: 企${currentSample.relationStrength}% 人${currentSample.authenticityScore}%`,
            operator: '系统',
            time: '8分钟前',
            done: true,
            rejected: false,
          },
          {
            step: '风控预审',
            desc: isPastApproval ? '风控预审通过，预审结论已生成' : isAtManualReview ? '待风控预审，需人工确认补审证据' : '待前置流程完成',
            operator: isPastApproval ? '风控系统' : '待分配',
            time: isPastApproval ? '5分钟前' : '—',
            done: isPastApproval,
            rejected: false,
          },
          {
            step: '预审通过，已推送信贷系统',
            desc: isPastApproval ? `预审通过 · ${matchedProduct.name} · 建议额度 ${currentSample.recommendedLimit} · 已推送统一信贷系统建档` : '待预审完成后自动推送',
            operator: isPastApproval ? '系统自动推送' : '—',
            time: isPastApproval ? '3分钟前' : '—',
            done: isPastApproval,
            rejected: false,
          },
        ];

        return (
          <div className="space-y-4">
            {/* Header */}
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3 text-[12px]">
                <Route size={14} className="text-[#2563EB]" />
                <span className="text-[13px] font-semibold text-[#0F172A]">预审与推单</span>
                <span className="text-[#94A3B8]">·</span>
                <SampleSwitcher selectedId={selectedSampleId} onSelect={selectSample} compact />
              </div>
              <Badge className={isPastApproval ? 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0] text-[10px]' : isAtManualReview ? 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA] text-[10px]' : 'bg-[#EFF6FF] text-[#1890FF] border-[#BFDBFE] text-[10px]'}>{isPastApproval ? '已推送信贷系统' : isAtManualReview ? '待风控预审' : '流程中'}</Badge>
            </div>

            {/* Credit system status feedback */}
            {isPastApproval ? (
              <div className="rounded-lg border border-[#A7F3D0] bg-[#ECFDF3] px-4 py-3 flex items-center gap-3 text-[12px]">
                <CheckCircle size={16} className="text-[#047857] shrink-0" />
                <div>
                  <span className="font-semibold text-[#047857]">信贷系统已受理</span>
                  <span className="text-[#334155] ml-2">编号: LOAN{new Date().getFullYear()}{String(new Date().getMonth() + 1).padStart(2, '0')}{String(new Date().getDate()).padStart(2, '0')}01 · 等待正式建档放款（由统一信贷系统完成）</span>
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 flex items-center gap-3 text-[12px]">
                <Clock size={14} className="text-[#94A3B8] shrink-0" />
                <span className="text-[#94A3B8]">预审通过后，系统将自动推送至统一信贷系统，由信贷系统完成正式建档与放款。本系统不执行审批放款操作。</span>
              </div>
            )}

            {/* Timeline nodes */}
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-5">
              <div className="relative">
                {flowNodes.map((node, i) => {
                  const isLast = i === flowNodes.length - 1;
                  const isCurrent = !node.done && (i === 0 || flowNodes[i - 1].done);
                  return (
                    <div key={node.step} className="flex gap-4">
                      {/* Timeline spine */}
                      <div className="flex flex-col items-center">
                        <div className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors',
                          node.done ? 'bg-[#ECFDF3] border-[#16A34A] text-[#16A34A]' :
                          node.rejected ? 'bg-[#FEF2F2] border-[#DC2626] text-[#DC2626]' :
                          isCurrent ? 'bg-[#EFF6FF] border-[#2563EB] text-[#2563EB] ring-4 ring-[#2563EB]/10' :
                          'bg-[#F8FAFC] border-[#E2E8F0] text-[#CBD5E1]'
                        )}>
                          {node.done ? <CheckCircle size={16} /> : node.rejected ? <XCircle size={16} /> : <span className="text-[11px] font-bold">{i + 1}</span>}
                        </div>
                        {!isLast && <div className={cn('w-0.5 flex-1 my-1', node.done ? 'bg-[#16A34A]' : 'bg-[#E2E8F0]')} />}
                      </div>
                      {/* Node content */}
                      <div className={cn('pb-6', isLast && 'pb-0')}>
                        <div className="flex items-center gap-2">
                          <span className={cn('text-[13px] font-semibold', node.done ? 'text-[#0F172A]' : isCurrent ? 'text-[#2563EB]' : 'text-[#94A3B8]')}>{node.step}</span>
                          {isCurrent && <Badge className="bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE] text-[9px]">当前节点</Badge>}
                        </div>
                        <div className="mt-1 text-[11px] text-[#64748B] leading-4">{node.desc}</div>
                        <div className="mt-1 flex items-center gap-3 text-[10px] text-[#94A3B8]">
                          <span className="flex items-center gap-1"><User size={10} />{node.operator}</span>
                          <span className="flex items-center gap-1"><Clock size={10} />{node.time}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Inline approval summary */}
            <SectionShell title="预审摘要" subtitle="基于候选资产池验证结果自动生成">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {/* Enterprise dimension */}
                <div className="rounded-lg border border-[#E2E8F0] bg-[#FAFBFF] p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-[#2563EB] text-white flex items-center justify-center"><CreditCard size={12} /></div>
                    <span className="text-[12px] font-semibold text-[#0F172A]">企业维度</span>
                  </div>
                  {[
                    { k: '行业', v: `${currentSample.chainName}（${currentSample.roleInChain}）` },
                    { k: '营收', v: currentSample.annualSales },
                    { k: '对公关系', v: currentSample.accountFlowStatus },
                  ].map(r => (
                    <div key={r.k} className="flex items-center justify-between text-[12px]">
                      <span className="text-[#94A3B8]">{r.k}</span>
                      <span className="text-[#0F172A] font-medium">{r.v}</span>
                    </div>
                  ))}
                  <div className="pt-1 border-t border-[#F1F5F9]">
                    <div className="text-[10px] text-[#94A3B8] mb-1">企业置信度</div>
                    <ConfidenceDots label="企" value={currentSample.relationStrength} />
                  </div>
                </div>
                {/* Personal dimension */}
                <div className="rounded-lg border border-[#E2E8F0] bg-[#FAFBFF] p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-[#7C3AED] text-white flex items-center justify-center"><User size={12} /></div>
                    <span className="text-[12px] font-semibold text-[#0F172A]">个人维度</span>
                  </div>
                  {[
                    { k: '法人', v: '法人代表（信息来源: 行内数据）' },
                    { k: '本行关系', v: '按揭客户（月供稳定，无逾期）' },
                    { k: '公私联动', v: currentSample.authenticityScore >= 80 ? '已通过交叉验证' : '验证数据不充分' },
                  ].map(r => (
                    <div key={r.k} className="flex items-center justify-between text-[12px]">
                      <span className="text-[#94A3B8]">{r.k}</span>
                      <span className="text-[#0F172A] font-medium">{r.v}</span>
                    </div>
                  ))}
                  <div className="pt-1 border-t border-[#F1F5F9]">
                    <div className="text-[10px] text-[#94A3B8] mb-1">个人置信度</div>
                    <ConfidenceDots label="人" value={currentSample.authenticityScore} />
                  </div>
                </div>
              </div>
              {/* Product match reason */}
              <div className="mt-4 rounded-lg border border-[#D6E4FF] bg-[#EFF6FF] p-4 space-y-2">
                <div className="text-[12px] font-semibold text-[#0F172A]">匹配产品: {matchedProduct.name}（额度 {currentSample.recommendedLimit}，年化 {matchedProduct.rate}）</div>
                <div className="text-[11px] text-[#2563EB] leading-4">
                  理由: 公私联动验证通过 · 企业置信度 {currentSample.relationStrength}% · 个人置信度 {currentSample.authenticityScore}% · {matchedProduct.tags.join(' + ')}
                </div>
              </div>
              {/* Actions */}
              <div className="mt-4 flex items-center gap-3">
                <Button size="sm" className="h-8 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[11px] gap-1.5" onClick={handleApprove} disabled={!isAtManualReview}>
                  <CheckCircle2 size={12} /> 确认摘要
                </Button>
                <Button variant="outline" size="sm" className="h-8 text-[11px] gap-1.5 text-[#64748B]">
                  <Pencil size={12} /> 修改摘要
                </Button>
                <span className="text-[10px] text-[#94A3B8]">修改内容将标注"修改记录"</span>
              </div>
            </SectionShell>

            {active && <ActionBar />}
          </div>
        );
      }

      /* ════════════════════════════════════════════════════════════════════
         PAGE 3: 审批摘要
         自动生成企业/个人/产品三维审批依据
         ════════════════════════════════════════════════════════════════════ */
      case 'summary':
        return (
          <div className="space-y-4">
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3 text-[12px]">
                <FileCheck2 size={14} className="text-[#2563EB]" />
                <span className="text-[13px] font-semibold text-[#0F172A]">审批摘要</span>
                <span className="text-[#94A3B8]">·</span>
                <SampleSwitcher selectedId={selectedSampleId} onSelect={selectSample} compact />
              </div>
              <Badge className="bg-[#EFF6FF] text-[#1890FF] border-[#BFDBFE] text-[10px]">自动生成</Badge>
            </div>

            <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden">
              {/* Title area */}
              <div className="px-6 py-4 bg-gradient-to-r from-[#F8FAFC] to-white border-b border-[#E2E8F0]">
                <div className="text-[16px] font-bold text-[#0F172A]">{currentSample.companyName}</div>
                <div className="mt-1 text-[11px] text-[#64748B]">{currentSample.chainName} · {currentSample.roleInChain} · 审批摘要自动生成</div>
              </div>

              <div className="p-6 space-y-5">
                {/* Section 1: Enterprise */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[13px] font-semibold text-[#0F172A]">
                    <span className="w-5 h-5 rounded bg-[#2563EB] text-white flex items-center justify-center text-[10px] font-bold">1</span>
                    企业维度
                  </div>
                  <div className="ml-7 grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { k: '行业', v: `${currentSample.chainName}（${currentSample.roleInChain}）` },
                      { k: '营收', v: `${currentSample.annualSales}（税局开票）` },
                      { k: '对公流水', v: currentSample.accountFlowStatus },
                      { k: '关系强度', v: `${currentSample.relationStrength}%` },
                      { k: '证据覆盖', v: `${currentSample.evidenceCoverage}%` },
                      { k: '集中度', v: currentSample.maxCustomerConcentration },
                    ].map(r => (
                      <div key={r.k} className="rounded-md border border-[#F1F5F9] bg-[#F8FAFC] px-3 py-2">
                        <div className="text-[10px] text-[#94A3B8]">{r.k}</div>
                        <div className="mt-0.5 text-[12px] font-medium text-[#0F172A]">{r.v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="ml-7"><ConfidenceDots label="企" value={currentSample.relationStrength} /></div>
                </div>

                {/* Section 2: Personal */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[13px] font-semibold text-[#0F172A]">
                    <span className="w-5 h-5 rounded bg-[#7C3AED] text-white flex items-center justify-center text-[10px] font-bold">2</span>
                    个人维度
                  </div>
                  <div className="ml-7 grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { k: '法人', v: '法人代表' },
                      { k: '本行关系', v: '按揭客户（月供稳定，无逾期）' },
                      { k: '公私联动', v: currentSample.authenticityScore >= 80 ? '已通过（法人按揭 + 企业代发）' : '数据待补全' },
                    ].map(r => (
                      <div key={r.k} className="rounded-md border border-[#F1F5F9] bg-[#F8FAFC] px-3 py-2">
                        <div className="text-[10px] text-[#94A3B8]">{r.k}</div>
                        <div className="mt-0.5 text-[12px] font-medium text-[#0F172A]">{r.v}</div>
                      </div>
                    ))}
                  </div>
                  <div className="ml-7"><ConfidenceDots label="人" value={currentSample.authenticityScore} /></div>
                </div>

                {/* Section 3: Product match */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[13px] font-semibold text-[#0F172A]">
                    <span className="w-5 h-5 rounded bg-[#047857] text-white flex items-center justify-center text-[10px] font-bold">3</span>
                    匹配产品
                  </div>
                  <div className="ml-7 rounded-lg border border-[#D6E4FF] bg-[#EFF6FF] p-4">
                    <div className="flex items-center justify-between">
                      <div className="text-[14px] font-bold text-[#0F172A]">{matchedProduct.name}</div>
                      <div className="text-[14px] font-bold text-[#2563EB]">额度 {currentSample.recommendedLimit}</div>
                    </div>
                    <div className="mt-2 text-[11px] text-[#334155] leading-5">
                      年化 {matchedProduct.rate} · 期限 {matchedProduct.term} · 理由: {matchedProduct.tags.join(' + ')}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {matchedProduct.tags.map(tag => (
                        <span key={tag} className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 bg-[#E8F3FF] text-[#1677FF] border border-[#B3D4FF] text-[10px] font-medium">
                          🏷️ {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Risk flags */}
                {currentSample.riskFlags.length > 0 && (
                  <div className="border-t border-[#F1F5F9] pt-4 space-y-2">
                    <div className="text-[11px] font-medium text-[#DC2626] flex items-center gap-1.5"><AlertTriangle size={12} /> 风险标记</div>
                    <div className="flex flex-wrap gap-1.5 ml-5">
                      {currentSample.riskFlags.map(f => <Badge key={f} className="bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5] text-[9px]">{f}</Badge>)}
                    </div>
                  </div>
                )}

                {/* AI judgment */}
                <div className="border-t border-[#F1F5F9] pt-4">
                  <div className="text-[11px] font-medium text-[#64748B] mb-2 flex items-center gap-1.5"><Sparkles size={12} className="text-[#2563EB]" /> AI 综合判断</div>
                  <div className="rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] px-4 py-3 text-[12px] text-[#2563EB] leading-5">{currentSample.aiSummary}</div>
                </div>
              </div>

              {/* Action footer */}
              <div className="px-6 py-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center gap-3">
                <Button size="sm" className="h-9 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-[12px] gap-1.5 px-5" onClick={handleApprove} disabled={!isAtManualReview}>
                  <CheckCircle2 size={14} /> 确认摘要，提交审批
                </Button>
                <Button variant="outline" size="sm" className="h-9 text-[12px] gap-1.5 text-[#64748B]">
                  <Pencil size={14} /> 修改摘要
                </Button>
                <span className="text-[10px] text-[#94A3B8]">修改后将自动标注"修改记录"</span>
              </div>
            </div>

            {active && <ActionBar />}
          </div>
        );

      /* ════════════════════════════════════════════════════════════════════
         PAGE 4: 补审作业
         处理需要补充资料的企业（法人缺失、征信异常）
         ════════════════════════════════════════════════════════════════════ */
      case 'review': {
        const reviewSamples = SAMPLES.map(s => {
          const reasons: string[] = [];
          if (s.riskFlags.length > 0) reasons.push(...s.riskFlags);
          if (s.evidenceCoverage < 70) reasons.push('证据覆盖不足');
          if (s.authenticityScore < 60) reasons.push('法人身份待验证');
          if (s.reviewReason) reasons.push(s.reviewReason.slice(0, 30));
          const primaryReason = reasons[0] || '待补审';
          const category = primaryReason.includes('身份') ? '法人身份缺失' :
                           primaryReason.includes('征信') ? '征信异常' :
                           primaryReason.includes('证据') || primaryReason.includes('覆盖') ? '信息不完整' :
                           '需人工核实';
          return { ...s, reasons, primaryReason, category, updatedAgo: s.stage === 'manual_review' ? '2小时前' : s.stage === 'identified' ? '1天前' : '3天前' };
        });

        const filteredReviews = reviewSamples.filter(s => {
          if (reviewFilter !== 'all' && s.category !== reviewFilter) return false;
          return true;
        });

        const categoryCount = (cat: string) => reviewSamples.filter(s => s.category === cat).length;

        return (
          <div className="space-y-4">
            {/* Header */}
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3 text-[12px]">
                <ShieldCheck size={14} className="text-[#C2410C]" />
                <span className="text-[13px] font-semibold text-[#0F172A]">补审作业</span>
                <span className="text-[#94A3B8]">· 共 {reviewSamples.length} 户待处理</span>
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-[10px] text-[#64748B] gap-1"><Search size={10} /> 搜索</Button>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[200px_1fr] gap-4">
              {/* Left: filter sidebar */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white p-3 space-y-3 h-fit">
                <div className="text-[11px] font-semibold text-[#0F172A]">补审原因</div>
                <div className="space-y-1">
                  {[
                    { value: 'all', label: '全部', count: reviewSamples.length },
                    { value: '法人身份缺失', label: '法人身份缺失', count: categoryCount('法人身份缺失') },
                    { value: '征信异常', label: '征信异常', count: categoryCount('征信异常') },
                    { value: '信息不完整', label: '信息不完整', count: categoryCount('信息不完整') },
                    { value: '需人工核实', label: '需人工核实', count: categoryCount('需人工核实') },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setReviewFilter(opt.value)}
                      className={cn(
                        'w-full flex items-center justify-between rounded-md px-2.5 py-2 text-[11px] transition-colors',
                        reviewFilter === opt.value ? 'bg-[#EFF6FF] text-[#2563EB] font-medium' : 'text-[#64748B] hover:bg-[#F8FAFC]'
                      )}
                    >
                      <span>{opt.label}</span>
                      <span className="text-[10px] bg-[#F1F5F9] rounded-full px-1.5 py-0.5">{opt.count}</span>
                    </button>
                  ))}
                </div>
                <div className="border-t border-[#F1F5F9] pt-3 space-y-1">
                  <div className="text-[11px] font-semibold text-[#0F172A]">更新时间</div>
                  {['all', '近7天', '近30天'].map(opt => (
                    <button
                      key={opt}
                      onClick={() => setReviewTimeFilter(opt)}
                      className={cn(
                        'w-full text-left rounded-md px-2.5 py-2 text-[11px] transition-colors',
                        reviewTimeFilter === opt ? 'bg-[#EFF6FF] text-[#2563EB] font-medium' : 'text-[#64748B] hover:bg-[#F8FAFC]'
                      )}
                    >
                      {opt === 'all' ? '全部' : opt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right: list */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
                {/* Table header */}
                <div className="grid grid-cols-[1fr_140px_100px_120px] gap-0 px-4 py-2.5 border-b border-[#E2E8F0] bg-[#F8FAFC] text-[10px] font-medium text-[#94A3B8] uppercase tracking-wider">
                  <div>企业简称</div><div>补审原因</div><div>更新时间</div><div>操作</div>
                </div>
                {/* Rows */}
                {filteredReviews.map(s => (
                  <div key={s.id} className="grid grid-cols-[1fr_140px_100px_120px] gap-0 px-4 py-3 border-b border-[#F1F5F9] last:border-b-0 items-center hover:bg-[#FAFBFF] transition-colors">
                    <div>
                      <div className="text-[12px] font-medium text-[#0F172A]">{s.shortName}</div>
                      <div className="mt-0.5 text-[10px] text-[#94A3B8]">{s.roleInChain}</div>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {s.reasons.slice(0, 2).map(r => (
                          <span key={r} className="bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5] rounded px-1.5 py-0.5 text-[9px]">{r.slice(0, 16)}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <Badge className={cn('text-[9px] border',
                        s.category === '法人身份缺失' ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]' :
                        s.category === '征信异常' ? 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]' :
                        'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]'
                      )}>
                        {s.category}
                      </Badge>
                    </div>
                    <div className="text-[11px] text-[#94A3B8]">{s.updatedAgo}</div>
                    <div className="flex items-center gap-1.5">
                      <Button variant="outline" size="sm" className="h-6 text-[10px] px-2 gap-1 text-[#2563EB] border-[#BFDBFE]">
                        <Upload size={10} /> 补充资料
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2 gap-1 text-[#64748B]">
                        <ArrowRight size={10} /> 重新提交
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredReviews.length === 0 && (
                  <div className="text-center py-10 text-[#94A3B8] text-xs">无匹配结果</div>
                )}
              </div>
            </div>

            {/* Tip strip */}
            <div className="rounded-lg border border-[#FDE68A] bg-[#FFFBEB] px-4 py-2.5 text-[11px] text-[#92400E] flex items-center gap-2">
              <Info size={12} className="shrink-0" />
              补充资料后，企业将重新进入审批流程；点击"补充资料"可跳转至外勤录入流补充法人身份等信息。
            </div>

            {active && <ActionBar />}
          </div>
        );
      }
    }
  };

  return (
    <SceneLayout title={scene.title} modules={scene.modules} activeModule={activeModule} onModuleChange={onModuleChange}>
      {renderContent()}
    </SceneLayout>
  );
}
