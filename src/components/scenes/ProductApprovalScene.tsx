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
  Download,
  Eye,
  FileCheck2,
  FileText,
  Filter,
  Info,
  Link2,
  PackageCheck,
  Pencil,
  RefreshCw,
  Route,
  Search,
  Shield,
  ShieldCheck,
  Star,
  Upload,
  User,
  UserCheck,
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
  MetricCard,
  KpiBar,
  Stepper,
} from '../ProductPrimitives';
import { ApprovalAiDock, AiMiddleGuideCard, MicroPulse } from './approval/ApprovalSharedUi';
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

export default function ProductApprovalScene({ activeModule, onModuleChange, sceneOverride }: Props & { sceneOverride?: string }) {
  const scene = SCENES.find((s) => s.id === (sceneOverride || 'smart-approval'))!;
  const { active, stage, stageIndex, advanceStage, currentSample, selectSample, selectedSampleId } = useDemo();
  const [selectedFlowId, setSelectedFlowId] = React.useState('flow-2');
  const [productTypeFilter, setProductTypeFilter] = React.useState<string>('all');
  const [riskFilter, setRiskFilter] = React.useState<string>('all');
  const [reviewFilter, setReviewFilter] = React.useState<string>('all');
  const [reviewTimeFilter, setReviewTimeFilter] = React.useState<string>('all');
  const [selectedProductId, setSelectedProductId] = React.useState<string | null>(null);
  const [selectedPreReviewId, setSelectedPreReviewId] = React.useState<string>('PR-01');
  const [selectedReviewTaskId, setSelectedReviewTaskId] = React.useState<string>('RT-01');
  const [selectedSummaryId, setSelectedSummaryId] = React.useState<string>('SM-01');
  const [approvalAiExpanded, setApprovalAiExpanded] = React.useState(false);

  React.useEffect(() => {
    setApprovalAiExpanded(false);
  }, [activeModule]);

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

  type WorkbenchLayout = {
    main: React.ReactNode;
    kpiSlot?: React.ReactNode;
    stickyActionSlot?: React.ReactNode;
    aiPanel?: React.ReactNode;
    pageSubtitleOverride?: string;
  };

  const renderWorkbench = (): WorkbenchLayout => {
    switch (activeModule) {

      /* ════════════════════════════════════════════════════════════════════
         PAGE 1: 产品匹配 — 审批前置的产品适配与准入建议工作台
         ════════════════════════════════════════════════════════════════════ */
      case 'matching':
      default: {
        type MatchLevel = '高适配' | '建议关注' | '可补后做' | '暂不建议';
        type GapImpact = '高' | '中' | '低';

        interface GapItem {
          condition: string; met: boolean; reason: string; impact: GapImpact;
          suggestion: string; blocksPreReview: boolean;
        }
        interface MatchProduct {
          id: string; name: string; type: string; scene: string; target: string;
          description: string;
          level: MatchLevel; strength: number; priority: number;
          limitRange: string; termRange: string;
          matchReasons: string[]; metCount: number; pendingCount: number;
          suggestAction: string; status: string; updatedAt: string;
          riskStatus: string; restrictions: string[]; unmetItems: string[]; needConfirm: boolean;
          entityMatch: string; bizMatch: string; evidenceSupport: string; ddRef: string; ruleHits: string;
          gaps: GapItem[];
        }

        const MATCH_PRODUCTS: MatchProduct[] = [
          {
            id: 'MP-01', name: '订单微贷', type: '订单融资', scene: '订单微贷', target: '核心企业上下游供应商',
            description: '基于核心企业应付账款/订单数据，向上下游小微企业提供短期流动资金支持。',
            level: '高适配', strength: 92, priority: 1,
            limitRange: `${currentSample.recommendedLimit}`, termRange: '6–12个月',
            matchReasons: ['订单流水持续稳定', '与链主真实交易关系已核验', `证据覆盖度 ${currentSample.evidenceCoverage}%`],
            metCount: 7, pendingCount: 2,
            suggestAction: '进入预审', status: '匹配完成', updatedAt: '04/09 14:20',
            riskStatus: riskWarnings.length > 0 ? '存在关注项' : '正常',
            restrictions: riskWarnings.length > 0 ? riskWarnings : [],
            unmetItems: currentSample.evidenceCoverage < 90 ? ['关键材料完整性'] : [],
            needConfirm: currentSample.evidenceCoverage < 85,
            entityMatch: `主体登记3年+，行业匹配`,
            bizMatch: `开票连续 ${currentSample.invoiceContinuityMonths} 月，流水稳定`,
            evidenceSupport: evidenceGrade,
            ddRef: '尽调报告已引用 — 主体、交易、关系层面',
            ruleHits: `命中 ${sampleRuleHits.length} 条标准识别规则`,
            gaps: [
              { condition: '企业成立年限', met: true, reason: '已满足(≥2年)', impact: '高', suggestion: '—', blocksPreReview: false },
              { condition: '开票连续性', met: currentSample.invoiceContinuityMonths >= 6, reason: currentSample.invoiceContinuityMonths >= 6 ? `连续 ${currentSample.invoiceContinuityMonths} 月` : `仅 ${currentSample.invoiceContinuityMonths} 月`, impact: '高', suggestion: '补充尽调材料', blocksPreReview: currentSample.invoiceContinuityMonths < 6 },
              { condition: '上下游真实性', met: true, reason: '公私联动验证通过', impact: '高', suggestion: '—', blocksPreReview: false },
              { condition: '流水稳定性', met: true, reason: '90日流水稳定', impact: '中', suggestion: '—', blocksPreReview: false },
              { condition: '关键材料完整性', met: currentSample.evidenceCoverage >= 85, reason: currentSample.evidenceCoverage >= 85 ? '材料齐全' : `覆盖度仅 ${currentSample.evidenceCoverage}%`, impact: '中', suggestion: '补充尽调材料', blocksPreReview: false },
              { condition: '黑白名单校验', met: true, reason: '未命中黑名单', impact: '高', suggestion: '—', blocksPreReview: false },
              { condition: '行内客户状态', met: false, reason: '非行内存量客户', impact: '低', suggestion: '新客户正常流程', blocksPreReview: false },
              { condition: '授信历史情况', met: false, reason: '无行内授信记录', impact: '低', suggestion: '首次授信评估', blocksPreReview: false },
              { condition: '营业收入要求', met: true, reason: '近年营收达标', impact: '中', suggestion: '—', blocksPreReview: false },
            ],
          },
          {
            id: 'MP-02', name: '发票融资', type: '发票融资', scene: '发票融资', target: '有连续开票记录的小微企业',
            description: '基于增值税发票数据，向具备连续开票记录的小微企业提供融资支持。',
            level: '建议关注', strength: 71, priority: 2,
            limitRange: '30–80万', termRange: '3–6个月',
            matchReasons: [`连续开票 ${currentSample.invoiceContinuityMonths} 月`, '开票金额与营收匹配'],
            metCount: 5, pendingCount: 3,
            suggestAction: '补充材料后关注', status: '匹配完成', updatedAt: '04/09 14:20',
            riskStatus: '正常', restrictions: [], unmetItems: ['税票评分未达标'], needConfirm: false,
            entityMatch: '主体登记正常', bizMatch: `连续开票 ${currentSample.invoiceContinuityMonths} 月`,
            evidenceSupport: '一般', ddRef: '部分引用', ruleHits: '命中 2 条',
            gaps: [
              { condition: '开票连续性', met: currentSample.invoiceContinuityMonths >= 12, reason: `${currentSample.invoiceContinuityMonths} 月`, impact: '高', suggestion: '等待开票月份积累', blocksPreReview: currentSample.invoiceContinuityMonths < 12 },
              { condition: '税票评分', met: false, reason: '评分偏低', impact: '高', suggestion: '补充经营说明', blocksPreReview: true },
              { condition: '营业收入要求', met: true, reason: '达标', impact: '中', suggestion: '—', blocksPreReview: false },
            ],
          },
          {
            id: 'MP-03', name: '流水贷', type: '流水贷', scene: '经营流水贷', target: '结算流水稳定的小微企业',
            description: '基于银行结算流水数据，向流水稳定的小微企业提供信用融资。',
            level: '可补后做', strength: 52, priority: 3,
            limitRange: '20–60万', termRange: '6–12个月',
            matchReasons: ['有一定流水基础'],
            metCount: 3, pendingCount: 5,
            suggestAction: '补充核验后再评估', status: '匹配完成', updatedAt: '04/09 14:20',
            riskStatus: '关注', restrictions: ['流水集中度偏高'], unmetItems: ['流水稳定性评分', '结算月均不足'], needConfirm: true,
            entityMatch: '主体正常', bizMatch: '流水数据有限',
            evidenceSupport: '不足', ddRef: '待补充', ruleHits: '命中 1 条',
            gaps: [
              { condition: '流水稳定性', met: false, reason: '月均波动较大', impact: '高', suggestion: '补充近6月流水', blocksPreReview: true },
              { condition: '结算月均', met: false, reason: '低于产品门槛', impact: '高', suggestion: '调整推荐产品', blocksPreReview: true },
              { condition: '黑白名单校验', met: true, reason: '未命中', impact: '高', suggestion: '—', blocksPreReview: false },
            ],
          },
          {
            id: 'MP-04', name: '公私联动贷', type: '经营贷', scene: '公私联动', target: '法人按揭/代发/结算客户',
            description: '面向行内存量公私联动客户，基于已有关系数据快速授信。',
            level: '暂不建议', strength: 28, priority: 4,
            limitRange: '50–200万', termRange: '12个月',
            matchReasons: [],
            metCount: 2, pendingCount: 6,
            suggestAction: '当前不建议推进', status: '匹配完成', updatedAt: '04/09 14:20',
            riskStatus: '限制', restrictions: ['非行内存量客户', '公私联动前置条件不满足'],
            unmetItems: ['行内客户状态', '代发/按揭/结算记录'], needConfirm: false,
            entityMatch: '主体正常但非行内客户', bizMatch: '无行内业务往来',
            evidenceSupport: '不适用', ddRef: '不适用', ruleHits: '命中 0 条',
            gaps: [
              { condition: '行内客户状态', met: false, reason: '非行内存量客户', impact: '高', suggestion: '不适用当前产品', blocksPreReview: true },
              { condition: '代发/按揭/结算记录', met: false, reason: '无记录', impact: '高', suggestion: '不适用当前产品', blocksPreReview: true },
            ],
          },
        ];

        const MATCH_LEVEL_STYLE: Record<MatchLevel, string> = {
          '高适配': 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]',
          '建议关注': 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
          '可补后做': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
          '暂不建议': 'bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]',
        };

        const GAP_IMPACT_STYLE: Record<GapImpact, string> = {
          '高': 'text-[#DC2626]', '中': 'text-[#F59E0B]', '低': 'text-[#64748B]',
        };

        if (!selectedProductId && MATCH_PRODUCTS.length > 0) setSelectedProductId(MATCH_PRODUCTS[0].id);
        const activeProd = MATCH_PRODUCTS.find(p => p.id === selectedProductId) ?? MATCH_PRODUCTS[0];

        const totalMatched = MATCH_PRODUCTS.length;
        const highFit = MATCH_PRODUCTS.filter(p => p.level === '高适配').length;
        const canPreReview = MATCH_PRODUCTS.filter(p => p.level === '高适配' || (p.level === '建议关注' && p.gaps.filter(g => g.blocksPreReview).length === 0)).length;
        const hasGap = MATCH_PRODUCTS.filter(p => p.pendingCount > 0).length;
        const needConfirmCount = MATCH_PRODUCTS.filter(p => p.needConfirm).length;
        const blockPre = activeProd.gaps.filter((g) => g.blocksPreReview).length;
        const pctFeas = Math.round((activeProd.metCount / (activeProd.metCount + activeProd.pendingCount)) * 100);
        const judg =
          activeProd.level === '高适配'
            ? `当前主体与「${activeProd.name}」具备较高适配性，基础经营特征与尽调结论能够形成有效支撑。`
            : activeProd.level === '建议关注'
              ? `当前主体与「${activeProd.name}」具备一定适配性，但部分准入条件需进一步确认。`
              : activeProd.level === '可补后做'
                ? `当前主体与「${activeProd.name}」的匹配度有限，建议补充材料后再评估。`
                : `当前主体与「${activeProd.name}」的适配度不足，不建议推进。`;
        const nextPageHint = blockPre === 0 ? '预审与推单' : '补审作业（补强后预审）';
        const nextStepHint =
          activeProd.level === '高适配' && blockPre === 0
            ? '当前产品已具备进入预审条件，建议直接提交。'
            : activeProd.level === '暂不建议'
              ? '当前产品不建议推进，建议切换更适合的产品方向。'
              : '建议优先补齐关键准入缺口后进入预审；如限制项持续存在，可切换产品方向。';
        const matchingCollapsed = `${activeProd.name} · ${activeProd.level} · ${blockPre === 0 ? '可进入预审' : `${blockPre} 项阻塞预审`}`;
        const restrictLines =
          activeProd.restrictions.length > 0 || blockPre > 0
            ? [
                '【主要限制提示】',
                ...activeProd.gaps.filter((g) => g.blocksPreReview).map((g) => `· ${g.condition}: ${g.reason}`),
                ...activeProd.restrictions.map((r) => `· ${r}`),
              ].join('\n')
            : '';
        const matchingFull = [
          '【当前判断】',
          judg,
          '',
          '【产品适配摘要】',
          `已满足 ${activeProd.metCount} 项准入条件，${activeProd.pendingCount} 项待补充${blockPre > 0 ? `，其中 ${blockPre} 项阻塞预审` : '。'}`,
          '',
          '【准入可行性】',
          `综合完成度约 ${pctFeas}%，${blockPre === 0 ? '当前评估为「可预审」。' : '当前评估为「需补强」。'}`,
          restrictLines,
          '',
          '【下一步建议】',
          nextStepHint,
          '',
          '【建议进入页面】',
          nextPageHint,
          activeProd.needConfirm ? '\n\n【边界提示】该产品存在边界判断项，建议人工确认后再推进。' : '',
        ]
          .filter(Boolean)
          .join('\n');

        return {
          pageSubtitleOverride: '帮助审批人从多个可选产品中快速收敛出当前案件最合适的产品。',
          kpiSlot: (
            <KpiBar
              items={[
                { label: '已匹配产品数', value: totalMatched, hint: '当前主体已完成匹配评估的产品数量', tone: 'info' },
                { label: '高适配产品数', value: highFit, hint: '适配度较高、建议优先推进', tone: 'normal' },
                { label: '可进入预审数', value: canPreReview, hint: '已具备基础准入条件、可进入预审', tone: 'normal' },
                {
                  label: '存在准入缺口数',
                  value: hasGap,
                  hint: '存在关键缺口、需补充后再推进',
                  tone: hasGap ? 'warn' : 'normal',
                },
              ]}
            />
          ),
          stickyActionSlot: (
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" className="h-8 text-[11px] gap-1.5" onClick={() => onModuleChange('flow')}>
                <ArrowRight size={12} />
                进入预审与推单
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-[11px] gap-1.5 border-[#FED7AA] text-[#C2410C]" onClick={() => onModuleChange('review')}>
                <Pencil size={12} />
                发起补审
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-[11px] gap-1.5">
                <FileText size={12} />
                查看尽调结果
              </Button>
              {needConfirmCount > 0 && (
                <span className="text-[10px] text-muted-foreground ml-1">待人工确认产品 {needConfirmCount} 个</span>
              )}
            </div>
          ),
          aiPanel: (
            <ApprovalAiDock
              collapsedSummary={matchingCollapsed}
              fullText={matchingFull}
              expanded={approvalAiExpanded}
              onToggle={() => setApprovalAiExpanded((v) => !v)}
            />
          ),
          main: (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-end gap-2">
              <SampleSwitcher selectedId={selectedSampleId} onSelect={selectSample} compact />
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#BFDBFE] text-[#2563EB]"><RefreshCw size={10} />刷新匹配结果</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Zap size={10} />重新匹配</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Eye size={10} />查看匹配规则</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Download size={10} />导出结果</Button>
            </div>

            <div className="grid grid-cols-[220px_1fr_220px] gap-3" style={{ minHeight: 520 }}>

              {/* COL 1: Product recommendation list */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-3 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                  <span className="text-[11px] font-semibold text-[#0F172A]">产品推荐列表</span>
                  <p className="text-[9px] text-[#94A3B8] mt-0.5">优先查看高适配产品</p>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {MATCH_PRODUCTS.map(prod => {
                    const isActive = activeProd?.id === prod.id;
                    return (
                      <div key={prod.id} onClick={() => setSelectedProductId(prod.id)}
                        className={cn('px-3 py-2.5 border-b border-[#F1F5F9] cursor-pointer transition-all', isActive ? 'bg-[#EFF6FF] border-l-2 border-l-[#2563EB]' : 'hover:bg-[#FAFBFF]')}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[11px] font-semibold text-[#0F172A]">{prod.name}</span>
                          <Badge className={cn('text-[7px] border', MATCH_LEVEL_STYLE[prod.level])}>{prod.level}</Badge>
                        </div>
                        <div className="text-[9px] text-[#64748B] mb-1">{prod.type} · {prod.target.length > 10 ? prod.target.slice(0, 10) + '…' : prod.target}</div>
                        <div className="flex items-center gap-2 mb-1 text-[8px]">
                          <span className="text-[#64748B]">适配 <span className="font-bold" style={{ color: prod.strength >= 80 ? '#047857' : prod.strength >= 60 ? '#F59E0B' : '#DC2626' }}>{prod.strength}%</span></span>
                          <span className="text-[#94A3B8]">P{prod.priority}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[8px]">
                          <span className="text-[#64748B]">{prod.metCount}满足 / {prod.pendingCount}待补</span>
                        </div>
                        <div className="mt-1 flex items-center gap-1 flex-wrap">
                          {prod.matchReasons.slice(0, 2).map((r, i) => (
                            <span key={i} className="text-[7px] px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[#475569]">{r.length > 12 ? r.slice(0, 12) + '…' : r}</span>
                          ))}
                        </div>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <Button variant="outline" size="sm" className="h-5 text-[8px] px-1.5 gap-0.5 border-[#BFDBFE] text-[#2563EB]" onClick={(e) => { e.stopPropagation(); if (prod.level === '高适配') onModuleChange('flow'); }}>进入预审</Button>
                          <Button variant="ghost" size="sm" className="h-5 text-[8px] px-1 text-[#64748B]"><Star size={8} /></Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* COL 2: Product detail */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-4 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC] flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-[#0F172A]">当前产品对比详情区</span>
                    <Badge className={cn('text-[7px] border shrink-0', MATCH_LEVEL_STYLE[activeProd.level])}>{activeProd.level}</Badge>
                  </div>
                  <MicroPulse
                    lines={[
                      '正在比对准入矩阵…',
                      '正在核对尽调引用与规则命中…',
                      '正在收敛产品排序与缺口项…',
                    ]}
                    className="text-[#64748B]"
                  />
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  <AiMiddleGuideCard variant="convergence" title="收敛到「当前最合适」产品">
                    先看清<strong>适配强度</strong>与<strong>阻塞预审项</strong>；若无阻塞，可直接带入选中产品进入预审；若有，请优先处理右侧准入缺口或发起补审。
                  </AiMiddleGuideCard>
                  {/* Product info */}
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[10px]">
                    <div><span className="text-[#94A3B8]">产品名称</span> <span className="text-[#0F172A] font-semibold">{activeProd.name}</span></div>
                    <div><span className="text-[#94A3B8]">产品类型</span> <span className="text-[#0F172A]">{activeProd.type}</span></div>
                    <div><span className="text-[#94A3B8]">适用场景</span> <span className="text-[#0F172A]">{activeProd.scene}</span></div>
                    <div><span className="text-[#94A3B8]">目标客群</span> <span className="text-[#0F172A]">{activeProd.target}</span></div>
                  </div>
                  <p className="text-[9px] text-[#64748B] leading-4">{activeProd.description}</p>

                  {/* Match conclusion */}
                  <div className="rounded bg-[#F0FDF4] border border-[#BBF7D0] px-3 py-2">
                    <div className="text-[9px] text-[#047857] font-medium mb-1">匹配结论</div>
                    <div className="grid grid-cols-2 gap-1 text-[10px]">
                      <div>推荐优先级: <span className="font-bold text-[#0F172A]">P{activeProd.priority}</span></div>
                      <div>适配强度: <span className="font-bold" style={{ color: activeProd.strength >= 80 ? '#047857' : activeProd.strength >= 60 ? '#F59E0B' : '#DC2626' }}>{activeProd.strength}%</span></div>
                      <div>推荐额度: <span className="font-medium text-[#0F172A]">{activeProd.limitRange}</span></div>
                      <div>推荐期限: <span className="font-medium text-[#0F172A]">{activeProd.termRange}</span></div>
                    </div>
                    <div className="flex items-center gap-1 mt-1 text-[9px]">
                      {activeProd.gaps.filter(g => g.blocksPreReview).length === 0
                        ? <><CheckCircle2 size={9} className="text-[#047857]" /><span className="text-[#047857]">建议进入预审</span></>
                        : <><AlertTriangle size={9} className="text-[#C2410C]" /><span className="text-[#C2410C]">存在阻塞项，暂不建议预审</span></>}
                    </div>
                  </div>

                  {/* Match basis */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-semibold text-[#0F172A]">匹配依据</div>
                    <div className="grid grid-cols-1 gap-1 text-[9px]">
                      <div className="flex items-start gap-1.5"><span className="text-[#94A3B8] w-16 shrink-0">主体特征</span><span className="text-[#0F172A]">{activeProd.entityMatch}</span></div>
                      <div className="flex items-start gap-1.5"><span className="text-[#94A3B8] w-16 shrink-0">经营特征</span><span className="text-[#0F172A]">{activeProd.bizMatch}</span></div>
                      <div className="flex items-start gap-1.5"><span className="text-[#94A3B8] w-16 shrink-0">证据支撑</span><span className="text-[#0F172A]">{activeProd.evidenceSupport}</span></div>
                      <div className="flex items-start gap-1.5"><span className="text-[#94A3B8] w-16 shrink-0">尽调引用</span><span className="text-[#0F172A]">{activeProd.ddRef}</span></div>
                      <div className="flex items-start gap-1.5"><span className="text-[#94A3B8] w-16 shrink-0">命中规则</span><span className="text-[#0F172A]">{activeProd.ruleHits}</span></div>
                    </div>
                    {activeProd.matchReasons.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {activeProd.matchReasons.map((r, i) => (
                          <span key={i} className="text-[8px] px-1.5 py-0.5 rounded-full bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">{r}</span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Risk & restrictions */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-semibold text-[#0F172A]">风险与限制</div>
                    <div className="grid grid-cols-2 gap-1 text-[9px]">
                      <div className="flex items-center gap-1">
                        {activeProd.riskStatus === '正常' ? <CheckCircle2 size={9} className="text-[#047857]" /> : <AlertTriangle size={9} className="text-[#F59E0B]" />}
                        <span>风险状态: {activeProd.riskStatus}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {activeProd.needConfirm ? <UserCheck size={9} className="text-[#7C3AED]" /> : <CheckCircle2 size={9} className="text-[#047857]" />}
                        <span>人工确认: {activeProd.needConfirm ? '待确认' : '无需'}</span>
                      </div>
                    </div>
                    {activeProd.restrictions.length > 0 && (
                      <div className="rounded bg-[#FEF2F2] px-2 py-1.5 text-[9px] text-[#DC2626] space-y-0.5">
                        {activeProd.restrictions.map((r, i) => <div key={i}>· {r}</div>)}
                      </div>
                    )}
                    {activeProd.unmetItems.length > 0 && (
                      <div className="text-[9px] text-[#C2410C]">不满足项: {activeProd.unmetItems.join('、')}</div>
                    )}
                  </div>

                  {/* Detail actions — 次动作留在主区，主动作见底部 Sticky */}
                  <div className="flex items-center gap-1.5 border-t border-[#F1F5F9] pt-2 flex-wrap">
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]"><Eye size={9} />查看准入依据</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]"><FileText size={9} />查看尽调结果</Button>
                    {activeProd.needConfirm && <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#DDD6FE] text-[#7C3AED]"><UserCheck size={9} />标记人工确认</Button>}
                  </div>
                </div>
              </div>

              {/* COL 3: Gaps & restrictions */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-3 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                  <span className="text-[11px] font-semibold text-[#0F172A]">准入缺口与限制</span>
                  <p className="text-[9px] text-[#94A3B8] mt-0.5">缺什么、影响多大、如何补充</p>
                </div>
                <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
                  {activeProd.gaps.length > 0 ? activeProd.gaps.map((g, i) => (
                    <div key={i} className={cn('rounded border px-2.5 py-2 text-[9px]', g.met ? 'border-[#D1FAE5] bg-[#F0FDF4]' : 'border-[#FED7AA] bg-[#FFFBEB]')}>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-medium text-[#0F172A]">{g.condition}</span>
                        <div className="flex items-center gap-1">
                          {g.blocksPreReview && <span className="text-[7px] text-[#DC2626] font-bold">阻塞</span>}
                          <span className={cn('text-[7px] font-bold', GAP_IMPACT_STYLE[g.impact])}>{g.impact}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 mb-0.5">
                        {g.met ? <CheckCircle2 size={8} className="text-[#047857]" /> : <XCircle size={8} className="text-[#DC2626]" />}
                        <span className={g.met ? 'text-[#047857]' : 'text-[#DC2626]'}>{g.reason}</span>
                      </div>
                      {!g.met && g.suggestion !== '—' && (
                        <div className="text-[8px] text-[#64748B]">建议: {g.suggestion}</div>
                      )}
                    </div>
                  )) : (
                    <div className="flex-1 flex items-center justify-center text-center p-4">
                      <div><CheckCircle2 size={18} className="text-[#A7F3D0] mx-auto mb-1" /><div className="text-[10px] text-[#047857]">当前产品已满足基础准入要求</div><div className="text-[8px] text-[#94A3B8] mt-0.5">建议进入预审与推单</div></div>
                    </div>
                  )}
                  {activeProd.gaps.some(g => !g.met) && (
                    <div className="flex items-center gap-1.5 pt-1 flex-wrap border-t border-[#F1F5F9]">
                      <Button variant="outline" size="sm" className="h-5 text-[8px] px-1.5 gap-0.5 border-[#BFDBFE] text-[#2563EB]"><Eye size={8} />查看缺口详情</Button>
                      <Button variant="outline" size="sm" className="h-5 text-[8px] px-1.5 gap-0.5 border-[#E2E8F0] text-[#475569]"><Upload size={8} />补充信息</Button>
                      <Button variant="outline" size="sm" className="h-5 text-[8px] px-1.5 gap-0.5 border-[#E2E8F0] text-[#475569]"><Download size={8} />下载缺口清单</Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          ),
        };
      }

      /* ════════════════════════════════════════════════════════════════════
         PAGE 2: 预审与推单
         本系统终点 = 预审通过 → 推送信贷系统，不越权做最终审批/放款
         ════════════════════════════════════════════════════════════════════ */
      case 'flow': {
        type PreReviewConclusion = '建议通过' | '可补后推' | '暂缓推进' | '暂不建议';
        type PushStatus = '未开始' | '待推单' | '推单中' | '已推单' | '推单失败';
        type VerifyResult = '已满足' | '基本满足' | '存在缺口' | '不满足' | '无法判断';

        interface ReviewItem {
          name: string; type: string; result: VerifyResult; judgment: string;
          basis: string; riskTip: string; meetsPush: boolean; needConfirm: boolean;
        }
        interface BlockerItem {
          name: string; blockerType: string; status: string; reason: string;
          impact: string; suggestion: string; blocksPush: boolean; path: string;
        }
        interface PreReviewObj {
          id: string; company: string; shortName: string; industry: string; region: string;
          product: string; taskName: string; scene: string; stage: string;
          createdAt: string; updatedAt: string;
          conclusion: PreReviewConclusion; pushStatus: PushStatus; priority: number; handler: string;
          reviewItems: ReviewItem[]; blockers: BlockerItem[]; needConfirm: boolean;
        }

        const PRE_REVIEW_OBJS: PreReviewObj[] = [
          {
            id: 'PR-01', company: currentSample.companyName, shortName: currentSample.shortName,
            industry: currentSample.chainName, region: '江苏-常州', product: matchedProduct.name,
            taskName: `${currentSample.shortName} 预审`, scene: '订单微贷', stage: isPastApproval ? '已推单' : isAtManualReview ? '待人工确认' : '预审中',
            createdAt: '04/09 09:00', updatedAt: '04/09 14:30',
            conclusion: isPastApproval ? '建议通过' : currentSample.evidenceCoverage >= 85 ? '建议通过' : '可补后推',
            pushStatus: isPastApproval ? '已推单' : currentSample.evidenceCoverage >= 85 ? '待推单' : '未开始',
            priority: 1, handler: '王敏', needConfirm: isAtManualReview,
            reviewItems: [
              { name: '主体准入判断', type: '主体准入判断', result: '已满足', judgment: '企业登记正常，行业匹配，成立年限达标', basis: '工商登记 + 行内数据', riskTip: '—', meetsPush: true, needConfirm: false },
              { name: '产品准入判断', type: '产品准入判断', result: currentSample.evidenceCoverage >= 85 ? '已满足' : '基本满足', judgment: `匹配${matchedProduct.name}，适配强度 ${currentSample.relationStrength}%`, basis: '产品匹配结果', riskTip: currentSample.evidenceCoverage < 85 ? '部分准入条件边界' : '—', meetsPush: currentSample.evidenceCoverage >= 85, needConfirm: currentSample.evidenceCoverage < 85 },
              { name: '尽调结论引用', type: '尽调结论引用', result: currentSample.evidenceCoverage >= 80 ? '已满足' : '存在缺口', judgment: `尽调报告已引用，证据覆盖 ${currentSample.evidenceCoverage}%`, basis: '尽调报告', riskTip: currentSample.evidenceCoverage < 80 ? '证据覆盖度不足' : '—', meetsPush: currentSample.evidenceCoverage >= 80, needConfirm: false },
              { name: '材料完整性判断', type: '材料完整性判断', result: currentSample.evidenceCoverage >= 90 ? '已满足' : '存在缺口', judgment: currentSample.evidenceCoverage >= 90 ? '关键材料齐全' : '部分材料待补充', basis: '材料解析结果', riskTip: currentSample.evidenceCoverage < 90 ? '关键材料不完整' : '—', meetsPush: currentSample.evidenceCoverage >= 90, needConfirm: false },
              { name: '证据充分性判断', type: '证据充分性判断', result: evidenceGrade === '充分' ? '已满足' : evidenceGrade === '一般' ? '基本满足' : '存在缺口', judgment: `证据充分性: ${evidenceGrade}`, basis: '证据核验结果', riskTip: evidenceGrade !== '充分' ? '证据支撑力度不足' : '—', meetsPush: evidenceGrade === '充分', needConfirm: evidenceGrade === '一般' },
              { name: '风险规则校验', type: '风险规则校验', result: riskWarnings.length === 0 ? '已满足' : '基本满足', judgment: riskWarnings.length === 0 ? '未触发风险规则' : `触发 ${riskWarnings.length} 条关注项`, basis: '规则引擎', riskTip: riskWarnings.length > 0 ? riskWarnings[0] : '—', meetsPush: true, needConfirm: riskWarnings.length > 0 },
              { name: '黑白名单判断', type: '黑白名单判断', result: '已满足', judgment: '未命中黑名单，无限制', basis: '外部名单库', riskTip: '—', meetsPush: true, needConfirm: false },
              { name: '授信历史判断', type: '授信历史判断', result: '基本满足', judgment: '无行内授信记录，首次申请', basis: '行内系统', riskTip: '首次授信需关注', meetsPush: true, needConfirm: false },
            ],
            blockers: [
              ...(currentSample.evidenceCoverage < 90 ? [{ name: '关键材料不完整', blockerType: '材料缺失', status: '未处理', reason: `证据覆盖度 ${currentSample.evidenceCoverage}%，低于90%门槛`, impact: '影响推单', suggestion: '补充材料', blocksPush: true, path: '返回材料解析' }] : []),
              ...(riskWarnings.length > 0 ? [{ name: '风险关注项', blockerType: '风险规则未通过', status: '待确认', reason: riskWarnings[0], impact: '影响预审通过', suggestion: '发起人工确认', blocksPush: false, path: '人工确认' }] : []),
              ...(isAtManualReview ? [{ name: '人工确认待处理', blockerType: '人工判断边界项', status: '待确认', reason: '存在边界判断项需人工确认', impact: '影响推单', suggestion: '发起人工确认', blocksPush: true, path: '人工确认' }] : []),
            ],
          },
          ...SAMPLES.filter(s => s.id !== currentSample.id).slice(0, 2).map((s, idx) => ({
            id: `PR-0${idx + 2}`, company: s.companyName, shortName: s.shortName,
            industry: s.chainName, region: '江苏', product: '订单微贷',
            taskName: `${s.shortName} 预审`, scene: '订单微贷', stage: s.evidenceCoverage >= 80 ? '预审中' : '待补充',
            createdAt: '04/08 10:00', updatedAt: '04/09 11:00',
            conclusion: (s.evidenceCoverage >= 85 ? '建议通过' : s.evidenceCoverage >= 70 ? '可补后推' : '暂缓推进') as PreReviewConclusion,
            pushStatus: (s.evidenceCoverage >= 85 ? '待推单' : '未开始') as PushStatus,
            priority: idx + 2, handler: idx === 0 ? '李明' : '张磊',
            needConfirm: s.evidenceCoverage < 80,
            reviewItems: [
              { name: '主体准入判断', type: '主体准入判断', result: '已满足' as VerifyResult, judgment: '主体正常', basis: '工商登记', riskTip: '—', meetsPush: true, needConfirm: false },
              { name: '尽调结论引用', type: '尽调结论引用', result: (s.evidenceCoverage >= 80 ? '已满足' : '存在缺口') as VerifyResult, judgment: `覆盖 ${s.evidenceCoverage}%`, basis: '尽调报告', riskTip: s.evidenceCoverage < 80 ? '不足' : '—', meetsPush: s.evidenceCoverage >= 80, needConfirm: false },
            ],
            blockers: s.evidenceCoverage < 80 ? [{ name: '尽调结论不足', blockerType: '尽调结论不足', status: '未处理', reason: `覆盖度 ${s.evidenceCoverage}%`, impact: '影响推单', suggestion: '返回补审', blocksPush: true, path: '补审作业' }] : [],
          })),
        ];

        const CONCLUSION_STYLE: Record<PreReviewConclusion, string> = {
          '建议通过': 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]',
          '可补后推': 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
          '暂缓推进': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
          '暂不建议': 'bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]',
        };
        const PUSH_STYLE: Record<PushStatus, string> = {
          '未开始': 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]',
          '待推单': 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
          '推单中': 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]',
          '已推单': 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]',
          '推单失败': 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
        };
        const VERIFY_RESULT_STYLE: Record<VerifyResult, string> = {
          '已满足': 'text-[#047857]', '基本满足': 'text-[#2563EB]', '存在缺口': 'text-[#C2410C]', '不满足': 'text-[#DC2626]', '无法判断': 'text-[#64748B]',
        };

        const activeObj = PRE_REVIEW_OBJS.find(o => o.id === selectedPreReviewId) ?? PRE_REVIEW_OBJS[0];

        const totalObjs = PRE_REVIEW_OBJS.length;
        const passedObjs = PRE_REVIEW_OBJS.filter(o => o.conclusion === '建议通过').length;
        const canPush = PRE_REVIEW_OBJS.filter(o => o.pushStatus === '待推单' || o.pushStatus === '已推单').length;
        const blockedObjs = PRE_REVIEW_OBJS.filter(o => o.blockers.some(b => b.blocksPush)).length;
        const confirmObjs = PRE_REVIEW_OBJS.filter(o => o.needConfirm).length;
        const pushBlock = activeObj.blockers.filter((b) => b.blocksPush).length;
        const metPush = activeObj.reviewItems.filter((r) => r.meetsPush).length;
        const pctPush = Math.round((metPush / activeObj.reviewItems.length) * 100);
        const flowCollapsed = `${activeObj.shortName} · ${activeObj.conclusion} · ${pushBlock === 0 ? '可推单' : `${pushBlock} 项阻塞推单`}`;
        const flowJudg =
          activeObj.conclusion === '建议通过' && pushBlock === 0
            ? `${activeObj.shortName} 已具备预审通过条件，各项核验结果支撑充分，建议发起推单。`
            : activeObj.conclusion === '可补后推'
              ? `${activeObj.shortName} 已具备部分预审通过条件，但仍有个别关键阻塞项需进一步处理。`
              : `${activeObj.shortName} 当前预审条件不足，建议补强后再推进。`;
        const flowFull = [
          '【当前判断】',
          flowJudg,
          '',
          '【预审结论摘要】',
          `${metPush}/${activeObj.reviewItems.length} 项满足推单条件${activeObj.blockers.length > 0 ? `，${pushBlock} 项阻塞推单` : '。'}`,
          '',
          '【推单可行性】',
          `核验完成度约 ${pctPush}%，${pushBlock === 0 ? '评估为「可推单」。' : '评估为「需处理」。'}`,
          activeObj.blockers.length > 0
            ? ['', '【主要阻塞提示】', ...activeObj.blockers.map((b) => `· ${b.name}: ${b.reason}`)].join('\n')
            : '',
          '',
          '【下一步建议】',
          pushBlock === 0 ? '当前对象已具备推单条件，建议发起正式推单。' : '建议优先处理阻塞项并补强关键说明，待条件满足后再发起推单。',
          '',
          '【建议进入页面】',
          pushBlock === 0 ? '推单 → 统一信贷系统' : '补审作业（补强后推单）',
          activeObj.needConfirm ? '\n\n【边界提示】该对象存在边界判断项，建议人工确认后再推进。' : '',
        ]
          .filter(Boolean)
          .join('\n');

        return {
          pageSubtitleOverride: '把「能否推单」收敛成可执行门槛：核验通过、阻塞清零后再进入正式审批链路。',
          kpiSlot: (
            <KpiBar
              items={[
                { label: '待预审对象数', value: totalObjs, hint: '当前等待完成预审判断的对象数量', tone: 'info' },
                { label: '预审通过数', value: passedObjs, hint: '已满足基础条件、建议通过预审', tone: 'normal' },
                { label: '可推单对象数', value: canPush, hint: '已具备进入正式审批链路条件', tone: 'normal' },
                { label: '存在阻塞项数', value: blockedObjs, hint: '存在关键卡点、暂不能直接推单', tone: blockedObjs ? 'warn' : 'normal' },
                { label: '待人工确认数', value: confirmObjs, hint: '存在边界判断项或特殊情况', tone: confirmObjs ? 'warn' : 'muted' },
              ]}
            />
          ),
          stickyActionSlot: (
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" className="h-8 text-[11px] gap-1.5" onClick={handleApprove}>
                <ArrowRight size={12} />
                发起推单
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-[11px] gap-1.5" onClick={() => onModuleChange('matching')}>
                返回产品匹配
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-[11px] gap-1.5 border-[#FED7AA] text-[#C2410C]" onClick={() => onModuleChange('review')}>
                <Pencil size={12} />
                发起补审
              </Button>
            </div>
          ),
          aiPanel: (
            <ApprovalAiDock
              collapsedSummary={flowCollapsed}
              fullText={flowFull}
              expanded={approvalAiExpanded}
              onToggle={() => setApprovalAiExpanded((v) => !v)}
            />
          ),
          main: (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#BFDBFE] text-[#2563EB]"><RefreshCw size={10} />刷新预审结果</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Zap size={10} />批量预审</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Eye size={10} />查看预审规则</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Download size={10} />导出结论</Button>
            </div>

            <Stepper
              className="shadow-sm"
              current="pre"
              steps={[
                { id: 'match', label: '产品匹配', hint: '方向已选', stepDescription: '在「产品匹配」中完成适配与准入缺口收敛。' },
                { id: 'pre', label: '预审判断', hint: '当前步骤', stepDescription: '逐项核验主体、材料、风险规则与尽调引用。' },
                { id: 'push', label: '推单准备', hint: '阻塞清零', stepDescription: '清除阻塞推单项后可发起推单。' },
                { id: 'formal', label: '进入正式审批', hint: '信贷系统', stepDescription: '推送至统一信贷系统进入正式审批。' },
              ]}
            />

            <div className="grid grid-cols-[210px_1fr_210px] gap-3" style={{ minHeight: 520 }}>

              {/* COL 1: Pre-review task list */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-3 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                  <span className="text-[11px] font-semibold text-[#0F172A]">预审任务与对象</span>
                  <p className="text-[9px] text-[#94A3B8] mt-0.5">优先处理可推单与高优先级对象</p>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {PRE_REVIEW_OBJS.map(obj => {
                    const isActive = activeObj?.id === obj.id;
                    return (
                      <div key={obj.id} onClick={() => setSelectedPreReviewId(obj.id)}
                        className={cn('px-3 py-2.5 border-b border-[#F1F5F9] cursor-pointer transition-all', isActive ? 'bg-[#EFF6FF] border-l-2 border-l-[#2563EB]' : 'hover:bg-[#FAFBFF]')}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[11px] font-semibold text-[#0F172A] truncate">{obj.shortName}</span>
                          <Badge className={cn('text-[7px] border', CONCLUSION_STYLE[obj.conclusion])}>{obj.conclusion}</Badge>
                        </div>
                        <div className="text-[9px] text-[#64748B] mb-1">{obj.industry} · {obj.product} · P{obj.priority}</div>
                        <div className="flex items-center gap-1.5 mb-1 text-[8px]">
                          <Badge className={cn('text-[6px] border', PUSH_STYLE[obj.pushStatus])}>{obj.pushStatus}</Badge>
                          {obj.needConfirm && <span className="text-[#7C3AED]">需确认</span>}
                          {obj.blockers.some(b => b.blocksPush) && <span className="text-[#DC2626]">有阻塞</span>}
                        </div>
                        <div className="text-[8px] text-[#94A3B8]">{obj.updatedAt} · {obj.handler}</div>
                        <div className="flex items-center gap-1 mt-1.5">
                          <Button variant="outline" size="sm" className="h-5 text-[8px] px-1.5 gap-0.5 border-[#A7F3D0] text-[#047857]" onClick={(e) => { e.stopPropagation(); }}><ArrowRight size={8} />发起推单</Button>
                          <Button variant="ghost" size="sm" className="h-5 text-[8px] px-1 text-[#64748B]" onClick={(e) => { e.stopPropagation(); onModuleChange('matching'); }}>返回匹配</Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* COL 2: Pre-review results */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-4 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC] flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-[#0F172A]">预审结果 — {activeObj.shortName}</span>
                    <div className="flex items-center gap-1 shrink-0">
                      <Badge className={cn('text-[7px] border', CONCLUSION_STYLE[activeObj.conclusion])}>{activeObj.conclusion}</Badge>
                      <Badge className={cn('text-[7px] border', PUSH_STYLE[activeObj.pushStatus])}>{activeObj.pushStatus}</Badge>
                    </div>
                  </div>
                  <MicroPulse
                    lines={[
                      '正在核对预审事项与依据引用…',
                      '正在评估推单门槛与阻塞项…',
                      '正在收敛「可推单 / 需补审」结论…',
                    ]}
                    className="text-[#64748B]"
                  />
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  <AiMiddleGuideCard variant="threshold" title="门槛判断：先清阻塞，再谈推单">
                    本页只做<strong>预审与推单准备</strong>。请优先看清右侧阻塞项是否<strong>阻塞推单</strong>；未清零前，推单动作应保持克制，必要时回到补审或产品匹配。
                  </AiMiddleGuideCard>
                  {/* Entity info row */}
                  <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-[9px] pb-2 border-b border-[#F1F5F9]">
                    <div><span className="text-[#94A3B8]">企业</span> <span className="text-[#0F172A] font-medium">{activeObj.shortName}</span></div>
                    <div><span className="text-[#94A3B8]">行业</span> <span className="text-[#0F172A]">{activeObj.industry}</span></div>
                    <div><span className="text-[#94A3B8]">产品</span> <span className="text-[#0F172A]">{activeObj.product}</span></div>
                    <div><span className="text-[#94A3B8]">场景</span> <span className="text-[#0F172A]">{activeObj.scene}</span></div>
                    <div><span className="text-[#94A3B8]">阶段</span> <span className="text-[#0F172A]">{activeObj.stage}</span></div>
                    <div><span className="text-[#94A3B8]">处理人</span> <span className="text-[#0F172A]">{activeObj.handler}</span></div>
                  </div>

                  {/* Review items */}
                  <div className="text-[10px] font-semibold text-[#0F172A]">预审事项 ({activeObj.reviewItems.length})</div>
                  {activeObj.reviewItems.map((item, i) => (
                    <div key={i} className="rounded border border-[#F1F5F9] px-3 py-2 text-[9px] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[#0F172A]">{item.name}</span>
                        <div className="flex items-center gap-1.5">
                          <span className={cn('font-bold text-[8px]', VERIFY_RESULT_STYLE[item.result])}>{item.result}</span>
                          {item.meetsPush ? <CheckCircle2 size={8} className="text-[#047857]" /> : <AlertTriangle size={8} className="text-[#C2410C]" />}
                          {item.needConfirm && <UserCheck size={8} className="text-[#7C3AED]" />}
                        </div>
                      </div>
                      <div className="text-[#475569]">{item.judgment}</div>
                      <div className="flex items-center gap-3 text-[8px] text-[#94A3B8]">
                        <span>依据: {item.basis}</span>
                        {item.riskTip !== '—' && <span className="text-[#C2410C]">风险: {item.riskTip}</span>}
                      </div>
                    </div>
                  ))}

                  {/* Result actions — 主动作见底部 Sticky */}
                  <div className="flex items-center gap-1.5 border-t border-[#F1F5F9] pt-2 flex-wrap">
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]"><Eye size={9} />查看依据</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]"><Shield size={9} />查看风险项</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#BFDBFE] text-[#2563EB]"><RefreshCw size={9} />重新预审</Button>
                    {activeObj.needConfirm && <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#DDD6FE] text-[#7C3AED]"><UserCheck size={9} />标记人工确认</Button>}
                  </div>
                </div>
              </div>

              {/* COL 3: Blockers & push restrictions */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-3 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                  <span className="text-[11px] font-semibold text-[#0F172A]">阻塞项与推单限制</span>
                  <p className="text-[9px] text-[#94A3B8] mt-0.5">卡在哪里、如何处理</p>
                </div>
                <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
                  {activeObj.blockers.length > 0 ? activeObj.blockers.map((b, i) => (
                    <div key={i} className="rounded border border-[#FED7AA] bg-[#FFFBEB] px-2.5 py-2 text-[9px] space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-[#0F172A]">{b.name}</span>
                        {b.blocksPush && <span className="text-[7px] font-bold text-[#DC2626]">阻塞推单</span>}
                      </div>
                      <div className="text-[8px] text-[#64748B]">类型: {b.blockerType}</div>
                      <div className="text-[8px] text-[#C2410C]">原因: {b.reason}</div>
                      <div className="flex items-center gap-2 text-[8px] text-[#64748B]">
                        <span>影响: {b.impact}</span>
                        <span>路径: {b.path}</span>
                      </div>
                      <div className="text-[8px] text-[#2563EB]">建议: {b.suggestion}</div>
                    </div>
                  )) : (
                    <div className="flex-1 flex items-center justify-center text-center p-4">
                      <div><CheckCircle2 size={18} className="text-[#A7F3D0] mx-auto mb-1" /><div className="text-[10px] text-[#047857]">当前对象已满足基础推单要求</div><div className="text-[8px] text-[#94A3B8] mt-0.5">建议发起推单，继续推进审批链路</div></div>
                    </div>
                  )}
                  {activeObj.blockers.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-1 flex-wrap border-t border-[#F1F5F9]">
                      <Button variant="outline" size="sm" className="h-5 text-[8px] px-1.5 gap-0.5 border-[#BFDBFE] text-[#2563EB]"><Eye size={8} />查看阻塞详情</Button>
                      <Button variant="outline" size="sm" className="h-5 text-[8px] px-1.5 gap-0.5 border-[#FED7AA] text-[#C2410C]" onClick={() => onModuleChange('review')}><Pencil size={8} />发起补审</Button>
                      <Button variant="outline" size="sm" className="h-5 text-[8px] px-1.5 gap-0.5 border-[#E2E8F0] text-[#475569]"><Download size={8} />下载阻塞清单</Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          ),
        };
      }

      /* ════════════════════════════════════════════════════════════════════
         PAGE 3: 审批摘要
         自动生成企业/个人/产品三维审批依据
         ════════════════════════════════════════════════════════════════════ */
      case 'summary': {
        type ApprovalSuggestion = '建议推进' | '可补后做' | '暂缓推进' | '暂不建议';
        type OutputStatus = '未生成' | '已生成' | '待确认' | '已输出' | '已归档';
        type EvidenceType = '产品匹配依据' | '尽调结论依据' | '预审通过依据' | '补审完成依据' | '风险规则判断' | '人工确认结果';

        interface SummaryEvidence {
          name: string; evidenceType: EvidenceType; status: string; supportConclusion: string;
          limitNote: string; impactLevel: '高' | '中' | '低'; blocksAdvance: boolean; suggestion: string;
        }
        interface SummaryObj {
          id: string; company: string; shortName: string; industry: string; product: string; scene: string;
          taskName: string; source: string; stage: string; createdAt: string; updatedAt: string;
          status: OutputStatus; suggestion: ApprovalSuggestion; priority: '高' | '中' | '低'; handler: string;
          region: string;
          conclusionText: string; limitRange: string; termRange: string; canAdvance: boolean;
          productMatchSummary: string; preReviewSummary: string; reviewSummary: string; riskSummary: string; manualNote: string;
          generatedAt: string; lastEditor: string; lastEditTime: string;
          evidences: SummaryEvidence[];
          needConfirm: boolean;
        }

        const SUMMARY_OBJS: SummaryObj[] = SAMPLES.map((s, idx) => {
          const hasRisk = s.riskFlags.length > 0;
          const highEvidence = s.evidenceCoverage >= 80;
          const canAdvance = highEvidence && s.authenticityScore >= 70 && !hasRisk;
          const suggestion: ApprovalSuggestion = canAdvance ? '建议推进' : (highEvidence ? '可补后做' : (s.evidenceCoverage >= 60 ? '暂缓推进' : '暂不建议'));
          const status: OutputStatus = canAdvance ? '已生成' : (highEvidence ? '待确认' : '未生成');

          const evidences: SummaryEvidence[] = [
            { name: '产品匹配结论', evidenceType: '产品匹配依据', status: '已完成', supportConclusion: `匹配${matchedProduct.name}，适配度 ${Math.min(95, s.relationStrength + 10)}%`, limitNote: '', impactLevel: '高', blocksAdvance: false, suggestion: '直接推进' },
            { name: '尽调报告结论', evidenceType: '尽调结论依据', status: highEvidence ? '已完成' : '部分完成', supportConclusion: highEvidence ? '尽调结论充分，证据覆盖 ' + s.evidenceCoverage + '%' : '尽调材料不完整，覆盖 ' + s.evidenceCoverage + '%', limitNote: highEvidence ? '' : '材料完整性不足', impactLevel: highEvidence ? '低' : '高', blocksAdvance: !highEvidence, suggestion: highEvidence ? '直接推进' : '返回补审' },
            { name: '预审通过结论', evidenceType: '预审通过依据', status: canAdvance ? '已通过' : '条件通过', supportConclusion: canAdvance ? '预审全部通过' : '预审条件通过，存在待确认项', limitNote: canAdvance ? '' : '个别条件待确认', impactLevel: canAdvance ? '低' : '中', blocksAdvance: false, suggestion: canAdvance ? '直接推进' : '补充说明' },
          ];
          if (hasRisk) evidences.push({ name: '风险规则关注项', evidenceType: '风险规则判断', status: '待处理', supportConclusion: '', limitNote: s.riskFlags.join('、'), impactLevel: '高', blocksAdvance: true, suggestion: '补充说明' });
          if (s.authenticityScore < 70) evidences.push({ name: '法人身份验证', evidenceType: '人工确认结果', status: '待确认', supportConclusion: '', limitNote: '真实性得分 ' + s.authenticityScore + '%', impactLevel: '高', blocksAdvance: true, suggestion: '发起人工确认' });
          if (idx === 0 && canAdvance) evidences.push({ name: '补审处理确认', evidenceType: '补审完成依据', status: '已完成', supportConclusion: '补审缺口已处理完成', limitNote: '', impactLevel: '低', blocksAdvance: false, suggestion: '直接推进' });

          return {
            id: `SM-0${idx + 1}`, company: s.companyName, shortName: s.shortName, industry: s.chainName, product: matchedProduct.name, scene: '订单微贷',
            taskName: `${s.shortName} 审批摘要`, source: canAdvance ? '预审与推单' : '补审作业', stage: canAdvance ? '可输出' : '待补充',
            createdAt: idx === 0 ? '04/09 10:00' : idx === 1 ? '04/08 14:00' : '04/07 09:00',
            updatedAt: idx === 0 ? '04/09 16:00' : idx === 1 ? '04/09 12:00' : '04/08 18:00',
            status, suggestion, priority: (canAdvance ? '高' : highEvidence ? '中' : '低') as '高' | '中' | '低',
            handler: idx === 0 ? '王敏' : idx === 1 ? '李明' : '张磊',
            region: s.companyName.includes('常州') ? '常州' : s.companyName.includes('苏州') ? '苏州' : s.companyName.includes('南京') ? '南京' : '无锡',
            conclusionText: canAdvance
              ? `${s.shortName}主体与产品匹配度较高，预审与补审结果支撑继续推进，建议额度 ${s.recommendedLimit}。`
              : `${s.shortName}基础条件具备，但仍有 ${evidences.filter(e => e.blocksAdvance).length} 项限制待处理。`,
            limitRange: s.recommendedLimit, termRange: '12个月',
            canAdvance,
            productMatchSummary: `匹配${matchedProduct.name}，年化 ${matchedProduct.rate}，期限 ${matchedProduct.term}`,
            preReviewSummary: canAdvance ? '预审全部通过，无阻塞项' : '预审条件通过，存在待确认事项',
            reviewSummary: canAdvance ? '补审缺口已处理完成' : (highEvidence ? '补审部分完成' : '补审待处理'),
            riskSummary: hasRisk ? s.riskFlags.join('；') : '无明显风险',
            manualNote: '',
            generatedAt: idx === 0 ? '04/09 15:30' : '—',
            lastEditor: idx === 0 ? '系统（自动）' : '—', lastEditTime: idx === 0 ? '04/09 16:00' : '—',
            evidences,
            needConfirm: hasRisk || s.authenticityScore < 70,
          };
        });

        const SGG_STYLE: Record<ApprovalSuggestion, string> = {
          '建议推进': 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]',
          '可补后做': 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
          '暂缓推进': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
          '暂不建议': 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
        };
        const OUT_STYLE: Record<OutputStatus, string> = {
          '未生成': 'bg-[#F8FAFC] text-[#94A3B8] border-[#E2E8F0]',
          '已生成': 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
          '待确认': 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]',
          '已输出': 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]',
          '已归档': 'bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]',
        };

        const activeObj = SUMMARY_OBJS.find(o => o.id === selectedSummaryId) ?? SUMMARY_OBJS[0];
        const pendingGen = SUMMARY_OBJS.filter(o => o.status === '未生成').length;
        const generated = SUMMARY_OBJS.filter(o => o.status !== '未生成').length;
        const canAdvanceCount = SUMMARY_OBJS.filter(o => o.canAdvance).length;
        const limitCount = SUMMARY_OBJS.filter(o => o.evidences.some(e => e.blocksAdvance)).length;
        const confirmCount = SUMMARY_OBJS.filter(o => o.needConfirm).length;
        const passedEv = activeObj.evidences.filter((e) => !e.blocksAdvance).length;
        const totalEv = activeObj.evidences.length || 1;
        const pctSum = Math.round((passedEv / totalEv) * 100);
        const sumCollapsed = `${activeObj.shortName} · ${activeObj.suggestion} · ${activeObj.canAdvance ? '依据闭环' : '待收束限制项'}`;
        const sumJudg = activeObj.canAdvance
          ? `${activeObj.shortName} 已形成完整审批判断，依据闭环，建议输出摘要并进入正式审批。`
          : `${activeObj.shortName} 已形成基础审批判断，但仍有部分限制项需进一步说明或确认。`;
        const sumFull = [
          '【当前判断】',
          sumJudg,
          '',
          '【审批结论摘要】',
          activeObj.canAdvance
            ? '主体与产品匹配充分，预审与补审结果均支撑推进，当前无明显限制。'
            : `主体与产品具备匹配基础，当前主要限制集中在：${activeObj.evidences.filter((e) => e.blocksAdvance).map((e) => e.name).join('、') || '—'}。`,
          '',
          '【推进可行性】',
          `依据项闭环约 ${pctSum}%。`,
          activeObj.evidences.some((e) => e.blocksAdvance)
            ? ['', '【主要限制提示】', ...activeObj.evidences.filter((e) => e.blocksAdvance).map((e) => `· ${e.name}：${e.limitNote || e.evidenceType}`)].join('\n')
            : '',
          '',
          '【下一步建议】',
          activeObj.canAdvance ? '关键依据已闭环，建议输出审批摘要并进入正式审批。' : '建议优先补充高影响限制项说明，待关键依据闭环后输出审批摘要。',
          '',
          '【建议进入页面】',
          activeObj.canAdvance ? '正式审批链路' : '补审作业',
          activeObj.needConfirm ? '\n\n【边界提示】该对象存在边界判断项，建议人工确认后再正式输出。' : '',
        ]
          .filter(Boolean)
          .join('\n');

        return {
          pageSubtitleOverride: '把多源依据收束成「可输出、可负责」的审批摘要结论，支撑最终裁决与留痕。',
          kpiSlot: (
            <KpiBar
              items={[
                { label: '待生成摘要数', value: pendingGen, hint: '当前等待形成审批摘要结论', tone: 'warn' },
                { label: '已生成摘要数', value: generated, hint: '已完成审批摘要生成', tone: 'info' },
                { label: '可推进对象数', value: canAdvanceCount, hint: '已具备进入审批链路条件', tone: 'normal' },
                { label: '存在限制项数', value: limitCount, hint: '存在关键限制或待处理事项', tone: limitCount ? 'warn' : 'normal' },
                { label: '待人工确认数', value: confirmCount, hint: '存在边界判断项、需人工确认', tone: confirmCount ? 'warn' : 'muted' },
              ]}
            />
          ),
          stickyActionSlot: (
            <div className="flex flex-wrap items-center gap-2">
              <Button size="sm" className="h-8 text-[11px] gap-1.5" onClick={handleApprove}>
                <ArrowRight size={12} />
                进入正式审批
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-[11px] gap-1.5 border-[#FED7AA] text-[#C2410C]" onClick={() => onModuleChange('review')}>
                返回补审作业
              </Button>
              <Button variant="outline" size="sm" className="h-8 text-[11px] gap-1.5">
                <Download size={12} />
                导出摘要
              </Button>
            </div>
          ),
          aiPanel: (
            <ApprovalAiDock
              collapsedSummary={sumCollapsed}
              fullText={sumFull}
              expanded={approvalAiExpanded}
              onToggle={() => setApprovalAiExpanded((v) => !v)}
            />
          ),
          main: (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#BFDBFE] text-[#2563EB]"><RefreshCw size={10} />刷新摘要</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Zap size={10} />批量生成摘要</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Download size={10} />导出摘要</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Eye size={10} />查看摘要规则</Button>
            </div>

            <div className="grid grid-cols-[210px_1fr_210px] gap-3" style={{ minHeight: 520 }}>

              {/* COL 1: Object list */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-3 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                  <span className="text-[11px] font-semibold text-[#0F172A]">审批对象列表</span>
                  <p className="text-[9px] text-[#94A3B8] mt-0.5">优先处理可推进与高优先级对象</p>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {SUMMARY_OBJS.map(obj => {
                    const isActive = activeObj?.id === obj.id;
                    return (
                      <div key={obj.id} onClick={() => setSelectedSummaryId(obj.id)}
                        className={cn('px-3 py-2.5 border-b border-[#F1F5F9] cursor-pointer transition-all', isActive ? 'bg-[#EFF6FF] border-l-2 border-l-[#2563EB]' : 'hover:bg-[#FAFBFF]')}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[11px] font-semibold text-[#0F172A] truncate">{obj.shortName}</span>
                          <Badge className={cn('text-[7px] border', SGG_STYLE[obj.suggestion])}>{obj.suggestion}</Badge>
                        </div>
                        <div className="text-[9px] text-[#64748B] mb-1">{obj.industry} · {obj.product}</div>
                        <div className="flex items-center gap-1.5 mb-1 text-[8px]">
                          <Badge className={cn('text-[7px] border', OUT_STYLE[obj.status])}>{obj.status}</Badge>
                          <span className="text-[#94A3B8]">优先级:{obj.priority}</span>
                        </div>
                        <div className="text-[8px] text-[#94A3B8]">{obj.updatedAt} · {obj.handler}</div>
                        <div className="flex items-center gap-1 mt-1.5">
                          <Button variant="outline" size="sm" className="h-5 text-[8px] px-1.5 gap-0.5 border-[#BFDBFE] text-[#2563EB]" onClick={e => { e.stopPropagation(); }}>
                            {obj.status === '未生成' ? '生成摘要' : '查看详情'}
                          </Button>
                          <Button variant="ghost" size="sm" className="h-5 text-[8px] px-1 text-[#64748B]"><Star size={8} /></Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* COL 2: Summary detail */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-4 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC] flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-[#0F172A]">审批摘要主区</span>
                    <div className="flex items-center gap-1 shrink-0">
                      <Badge className={cn('text-[7px] border', SGG_STYLE[activeObj.suggestion])}>{activeObj.suggestion}</Badge>
                      <Badge className={cn('text-[7px] border', OUT_STYLE[activeObj.status])}>{activeObj.status}</Badge>
                    </div>
                  </div>
                  <MicroPulse
                    lines={[
                      '正在收束多源依据与限制项…',
                      '正在生成可输出摘要表述…',
                      '正在对齐额度期限与可推进性…',
                    ]}
                    className="text-[#64748B]"
                  />
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                  <AiMiddleGuideCard variant="adjudication" title="裁决引导：先建议，再结论，再输出">
                    按<strong>审批建议 → 结论摘要 → 关键依据 → 限制项 → 输出动作</strong>阅读。右侧为完整 AI 解释；底部 Sticky 承载「进入正式审批」等裁决级动作。
                  </AiMiddleGuideCard>
                  {/* Entity & product info */}
                  <div className="grid grid-cols-3 gap-x-3 gap-y-1 text-[9px] pb-2 border-b border-[#F1F5F9]">
                    <div><span className="text-[#94A3B8]">企业</span> <span className="text-[#0F172A] font-medium">{activeObj.company}</span></div>
                    <div><span className="text-[#94A3B8]">行业</span> <span className="text-[#0F172A]">{activeObj.industry}</span></div>
                    <div><span className="text-[#94A3B8]">地区</span> <span className="text-[#0F172A]">{activeObj.region}</span></div>
                    <div><span className="text-[#94A3B8]">产品</span> <span className="text-[#0F172A]">{activeObj.product}</span></div>
                    <div><span className="text-[#94A3B8]">场景</span> <span className="text-[#0F172A]">{activeObj.scene}</span></div>
                    <div><span className="text-[#94A3B8]">来源</span> <span className="text-[#0F172A]">{activeObj.source}</span></div>
                  </div>

                  <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-2.5 space-y-1">
                    <div className="text-[10px] font-semibold text-[#0F172A]">审批建议</div>
                    <p className="text-[9px] text-[#475569] leading-relaxed">
                      系统倾向 <span className="font-semibold text-[#0F172A]">{activeObj.suggestion}</span>，摘要状态 <span className="font-semibold text-[#0F172A]">{activeObj.status}</span>
                      {activeObj.needConfirm ? '；存在待人工确认边界项。' : '。'}
                    </p>
                  </div>

                  {/* Summary conclusion */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-semibold text-[#0F172A]">结论摘要</div>
                    <div className={cn('rounded px-2.5 py-2 text-[9px] leading-4', activeObj.canAdvance ? 'bg-[#F0FDF4] border border-[#BBF7D0] text-[#047857]' : 'bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E]')}>
                      {activeObj.conclusionText}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[9px]">
                      <div className="rounded border border-[#F1F5F9] bg-[#F8FAFC] px-2 py-1.5">
                        <div className="text-[#94A3B8]">建议额度</div><div className="font-medium text-[#0F172A]">{activeObj.limitRange}</div>
                      </div>
                      <div className="rounded border border-[#F1F5F9] bg-[#F8FAFC] px-2 py-1.5">
                        <div className="text-[#94A3B8]">建议期限</div><div className="font-medium text-[#0F172A]">{activeObj.termRange}</div>
                      </div>
                      <div className="rounded border border-[#F1F5F9] bg-[#F8FAFC] px-2 py-1.5">
                        <div className="text-[#94A3B8]">是否可推进</div><div className={cn('font-medium', activeObj.canAdvance ? 'text-[#047857]' : 'text-[#C2410C]')}>{activeObj.canAdvance ? '是' : '否'}</div>
                      </div>
                    </div>
                  </div>

                  {/* Composition — 关键依据 */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-semibold text-[#0F172A]">关键依据</div>
                    {[
                      { k: '产品匹配', v: activeObj.productMatchSummary },
                      { k: '预审结论', v: activeObj.preReviewSummary },
                      { k: '补审处理', v: activeObj.reviewSummary },
                      { k: '风险提示', v: activeObj.riskSummary },
                    ].map(item => (
                      <div key={item.k} className="flex items-start gap-2 text-[9px]">
                        <span className="text-[#94A3B8] shrink-0 w-14">{item.k}</span>
                        <span className="text-[#334155]">{item.v}</span>
                      </div>
                    ))}
                    {activeObj.manualNote && <div className="flex items-start gap-2 text-[9px]"><span className="text-[#94A3B8] shrink-0 w-14">人工说明</span><span className="text-[#334155]">{activeObj.manualNote}</span></div>}
                  </div>

                  <div className="space-y-1.5">
                    <div className="text-[10px] font-semibold text-[#0F172A]">限制项</div>
                    {activeObj.evidences.some((e) => e.blocksAdvance || e.limitNote) ? (
                      <ul className="text-[9px] text-[#C2410C] space-y-0.5 list-disc pl-4">
                        {activeObj.evidences
                          .filter((e) => e.blocksAdvance || e.limitNote)
                          .map((e) => (
                            <li key={e.name}>
                              {e.name}
                              {e.limitNote ? `：${e.limitNote}` : ''}
                            </li>
                          ))}
                      </ul>
                    ) : (
                      <p className="text-[9px] text-[#047857]">当前无明显限制项。</p>
                    )}
                  </div>

                  {/* Output info + actions */}
                  <div className="space-y-2 border-t border-[#F1F5F9] pt-2">
                    <div className="text-[10px] font-semibold text-[#0F172A]">输出动作</div>
                    <div className="grid grid-cols-3 gap-2 text-[8px] pb-1">
                      <div><span className="text-[#94A3B8]">生成时间</span><div className="text-[#0F172A]">{activeObj.generatedAt}</div></div>
                      <div><span className="text-[#94A3B8]">编辑人</span><div className="text-[#0F172A]">{activeObj.lastEditor}</div></div>
                      <div><span className="text-[#94A3B8]">编辑时间</span><div className="text-[#0F172A]">{activeObj.lastEditTime}</div></div>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#BFDBFE] text-[#2563EB]"><Pencil size={9} />编辑摘要</Button>
                      <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]"><Eye size={9} />查看来源依据</Button>
                      <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]"><RefreshCw size={9} />重新生成</Button>
                      {activeObj.needConfirm && <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#DDD6FE] text-[#7C3AED]"><UserCheck size={9} />标记人工确认</Button>}
                    </div>
                  </div>
                </div>
              </div>

              {/* COL 3: Key evidences & limits */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-3 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                  <span className="text-[11px] font-semibold text-[#0F172A]">关键依据与限制</span>
                  <p className="text-[9px] text-[#94A3B8] mt-0.5">摘要如何形成、哪些点限制推进</p>
                </div>
                <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
                  {activeObj.evidences.map((ev, i) => (
                    <div key={i} className={cn('rounded border px-2.5 py-2 text-[9px]', ev.blocksAdvance ? 'border-[#FED7AA] bg-[#FFFBEB]' : 'border-[#D1FAE5] bg-[#F0FDF4]')}>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-medium text-[#0F172A]">{ev.name}</span>
                        {ev.blocksAdvance && <span className="text-[7px] font-bold text-[#DC2626]">阻塞推进</span>}
                      </div>
                      <div className="text-[8px] text-[#64748B] mb-0.5">类型: {ev.evidenceType} · 状态: {ev.status}</div>
                      {ev.supportConclusion && <div className="text-[8px] text-[#047857]">{ev.supportConclusion}</div>}
                      {ev.limitNote && <div className="text-[8px] text-[#C2410C]">{ev.limitNote}</div>}
                      <div className="flex items-center gap-2 text-[8px] text-[#64748B] mt-0.5">
                        <span>影响: {ev.impactLevel}</span>
                        <span className="text-[#2563EB]">建议: {ev.suggestion}</span>
                      </div>
                    </div>
                  ))}
                  {activeObj.evidences.filter(e => e.blocksAdvance).length === 0 && (
                    <div className="rounded bg-[#F0FDF4] border border-[#BBF7D0] px-2.5 py-2 text-center">
                      <CheckCircle2 size={14} className="text-[#A7F3D0] mx-auto mb-0.5" />
                      <div className="text-[9px] text-[#047857]">当前对象无明显限制项</div>
                      <div className="text-[8px] text-[#94A3B8] mt-0.5">建议输出审批摘要并进入正式审批链路</div>
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 pt-1 flex-wrap border-t border-[#F1F5F9]">
                    <Button variant="outline" size="sm" className="h-5 text-[8px] px-1.5 gap-0.5 border-[#BFDBFE] text-[#2563EB]"><Eye size={8} />查看依据详情</Button>
                    <Button variant="outline" size="sm" className="h-5 text-[8px] px-1.5 gap-0.5 border-[#E2E8F0] text-[#475569]"><Shield size={8} />查看限制项</Button>
                    <Button variant="outline" size="sm" className="h-5 text-[8px] px-1.5 gap-0.5 border-[#E2E8F0] text-[#475569]"><Pencil size={8} />补充说明</Button>
                    <Button variant="outline" size="sm" className="h-5 text-[8px] px-1.5 gap-0.5 border-[#E2E8F0] text-[#475569]"><Download size={8} />下载摘要清单</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          ),
        };
      }

      /* ════════════════════════════════════════════════════════════════════
         PAGE 4: 补审作业
         处理需要补充资料的企业（法人缺失、征信异常）
         ════════════════════════════════════════════════════════════════════ */
      case 'review': {
        type ReviewStatus = '待处理' | '补件中' | '待确认' | '已完成' | '已回流' | '已关闭';
        type ReviewType = '材料补件' | '经营说明补充' | '风险项补充说明' | '规则边界确认' | '人工复核' | '产品切换复判' | '推单失败回流处理';
        type GapType = '材料缺失' | '说明不足' | '数据冲突' | '规则边界项' | '风险未解释' | '外部校验待完成' | '产品适配需重判';

        interface ReviewGap {
          name: string; gapType: GapType; status: string; reason: string;
          impact: string; suggestion: string; handler: string; blocksReturn: boolean; returnTarget: string;
        }
        interface ReviewTask {
          id: string; company: string; shortName: string; industry: string; product: string; scene: string;
          taskName: string; reviewType: ReviewType; source: string;
          createdAt: string; updatedAt: string; status: ReviewStatus; blockLevel: '高' | '中' | '低';
          suggestion: string; handler: string;
          triggerReason: string; blockerSummary: string;
          missingMaterials: string[]; pendingExplanations: string[]; pendingConfirms: string[];
          currentImpact: string;
          supplemented: string[]; pending: string[]; lastAction: string; conclusion: string; canReturn: boolean;
          riskTags: string[]; unresolved: string[]; needConfirm: boolean; suggestSwitch: boolean;
          gaps: ReviewGap[];
        }

        const REVIEW_TASKS: ReviewTask[] = SAMPLES.map((s, idx) => {
          const hasMaterialGap = s.evidenceCoverage < 85;
          const hasRiskGap = s.riskFlags.length > 0;
          const hasAuthGap = s.authenticityScore < 70;
          const gaps: ReviewGap[] = [];
          if (hasMaterialGap) gaps.push({ name: '关键材料不完整', gapType: '材料缺失', status: '未处理', reason: `证据覆盖度 ${s.evidenceCoverage}%`, impact: '影响预审通过', suggestion: '补充材料', handler: idx === 0 ? '王敏' : idx === 1 ? '李明' : '张磊', blocksReturn: true, returnTarget: '预审与推单' });
          if (hasRiskGap) gaps.push({ name: '风险项未解释', gapType: '风险未解释', status: '待确认', reason: s.riskFlags[0], impact: '影响推单', suggestion: '补充风险说明', handler: idx === 0 ? '王敏' : '张磊', blocksReturn: false, returnTarget: '预审与推单' });
          if (hasAuthGap) gaps.push({ name: '法人身份待验证', gapType: '说明不足', status: '未处理', reason: `真实性得分 ${s.authenticityScore}%`, impact: '影响审批结论', suggestion: '发起人工确认', handler: '王敏', blocksReturn: true, returnTarget: '预审与推单' });
          if (s.evidenceCoverage < 60) gaps.push({ name: '产品适配需重判', gapType: '产品适配需重判', status: '未处理', reason: '核心数据不足，当前产品方向可能不适合', impact: '影响继续推进', suggestion: '返回产品匹配', handler: '系统', blocksReturn: true, returnTarget: '产品匹配' });

          const reviewType: ReviewType = hasMaterialGap ? '材料补件' : hasRiskGap ? '风险项补充说明' : hasAuthGap ? '人工复核' : '经营说明补充';
          const canReturn = gaps.filter(g => g.blocksReturn).length === 0;

          return {
            id: `RT-0${idx + 1}`, company: s.companyName, shortName: s.shortName, industry: s.chainName, product: matchedProduct.name, scene: '订单微贷',
            taskName: `${s.shortName} 补审`, reviewType, source: '预审与推单',
            createdAt: idx === 0 ? '04/09 10:00' : idx === 1 ? '04/08 14:00' : '04/07 09:00',
            updatedAt: idx === 0 ? '04/09 14:30' : idx === 1 ? '04/09 11:00' : '04/08 16:00',
            status: (canReturn ? '已完成' : gaps.some(g => g.status === '待确认') ? '待确认' : '补件中') as ReviewStatus,
            blockLevel: (gaps.filter(g => g.blocksReturn).length >= 2 ? '高' : gaps.filter(g => g.blocksReturn).length === 1 ? '中' : '低') as '高' | '中' | '低',
            suggestion: canReturn ? '发起回流' : '继续补件',
            handler: idx === 0 ? '王敏' : idx === 1 ? '李明' : '张磊',
            triggerReason: hasMaterialGap ? '预审阶段材料完整性不足' : hasRiskGap ? '预审风险规则关注项' : '边界判断待确认',
            blockerSummary: gaps.map(g => g.name).join('、') || '无阻塞项',
            missingMaterials: hasMaterialGap ? ['经营流水补充件', '上下游合同扫描件'] : [],
            pendingExplanations: hasRiskGap ? [s.riskFlags[0] + ' 补充说明'] : [],
            pendingConfirms: hasAuthGap ? ['法人身份交叉验证'] : [],
            currentImpact: gaps.length > 0 ? `影响 ${gaps.length} 项预审事项` : '无影响',
            supplemented: canReturn ? ['已补充全部材料', '风险说明已确认'] : (hasRiskGap && !hasMaterialGap) ? ['风险说明部分已补充'] : [],
            pending: gaps.filter(g => g.status !== '已完成').map(g => g.name),
            lastAction: idx === 0 ? '04/09 14:30 提交补充材料' : '04/09 11:00 补充说明',
            conclusion: canReturn ? '缺口已基本消除，可返回预审' : '仍有关键缺口待处理',
            canReturn,
            riskTags: s.riskFlags,
            unresolved: gaps.filter(g => g.blocksReturn).map(g => g.name),
            needConfirm: hasAuthGap || hasRiskGap,
            suggestSwitch: s.evidenceCoverage < 60,
            gaps,
          };
        });

        const RSTATUS_STYLE: Record<ReviewStatus, string> = {
          '待处理': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
          '补件中': 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
          '待确认': 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]',
          '已完成': 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]',
          '已回流': 'bg-[#F1F5F9] text-[#475569] border-[#CBD5E1]',
          '已关闭': 'bg-[#F8FAFC] text-[#94A3B8] border-[#E2E8F0]',
        };
        const BLOCK_STYLE = { '高': 'text-[#DC2626]', '中': 'text-[#F59E0B]', '低': 'text-[#64748B]' };

        const activeTask = REVIEW_TASKS.find(t => t.id === selectedReviewTaskId) ?? REVIEW_TASKS[0];
        const totalTasks = REVIEW_TASKS.length;
        const materialTasks = REVIEW_TASKS.filter(t => t.missingMaterials.length > 0).length;
        const explainTasks = REVIEW_TASKS.filter(t => t.pendingExplanations.length > 0).length;
        const confirmTasks = REVIEW_TASKS.filter(t => t.needConfirm).length;
        const canReturnTasks = REVIEW_TASKS.filter(t => t.canReturn).length;
        const revCollapsed = `${activeTask.shortName} · ${activeTask.status} · ${activeTask.canReturn ? '可回流预审' : '待补齐缺口'}`;
        const revJudg = activeTask.canReturn
          ? `${activeTask.shortName} 的阻塞项已基本处理完成，建议发起回流返回预审。`
          : `${activeTask.shortName} 的部分阻塞项已具备处理基础，但仍有关键缺口需要进一步补充。`;
        const revFull = [
          '【当前判断】',
          revJudg,
          '',
          '【补审结论摘要】',
          `${activeTask.gaps.length} 项缺口，已处理 ${activeTask.supplemented.length} 项${activeTask.pending.length > 0 ? `，${activeTask.pending.length} 项待处理` : '。'}`,
          '',
          '【下一步建议】',
          activeTask.canReturn
            ? '关键缺口已消除，建议发起回流返回预审与推单。'
            : activeTask.suggestSwitch
              ? '核心数据不足，建议返回产品匹配重新评估。'
              : '建议优先补齐高影响缺口，关键限制项消除后返回预审。',
          '',
          '【建议进入页面】',
          activeTask.canReturn ? '预审与推单' : activeTask.suggestSwitch ? '产品匹配' : '继续补审处理',
          activeTask.needConfirm ? '\n\n【边界提示】该任务存在边界判断项，建议人工确认后再推进。' : '',
        ]
          .filter(Boolean)
          .join('\n');

        return {
          pageSubtitleOverride: '补强边界与材料缺口，明确「能否回流预审」与回流路径。',
          kpiSlot: (
            <KpiBar
              items={[
                { label: '待补审任务数', value: totalTasks, hint: '当前等待处理的补审任务总数', tone: 'warn' },
                { label: '待补件对象数', value: materialTasks, hint: '存在关键材料缺失、需补件', tone: materialTasks ? 'risk' : 'muted' },
                { label: '待补充说明数', value: explainTasks, hint: '需补充经营、风险或规则说明', tone: explainTasks ? 'warn' : 'muted' },
                { label: '待人工确认数', value: confirmTasks, hint: '存在边界判断项、需人工确认', tone: confirmTasks ? 'warn' : 'muted' },
                { label: '可返回预审数', value: canReturnTasks, hint: '已具备回流预审条件', tone: 'normal' },
              ]}
            />
          ),
          stickyActionSlot: (
            <div className="flex flex-wrap items-center gap-2">
              {activeTask.canReturn ? (
                <Button size="sm" className="h-8 text-[11px] gap-1.5" onClick={() => onModuleChange('flow')}>
                  <ArrowRight size={12} />
                  返回预审与推单
                </Button>
              ) : (
                <Button size="sm" className="h-8 text-[11px] gap-1.5">
                  <Pencil size={12} />
                  继续补审
                </Button>
              )}
              {activeTask.suggestSwitch && (
                <Button variant="outline" size="sm" className="h-8 text-[11px] gap-1.5" onClick={() => onModuleChange('matching')}>
                  返回产品匹配
                </Button>
              )}
              <Button variant="outline" size="sm" className="h-8 text-[11px] gap-1.5">
                <Download size={12} />
                导出任务清单
              </Button>
            </div>
          ),
          aiPanel: (
            <ApprovalAiDock
              collapsedSummary={revCollapsed}
              fullText={revFull}
              expanded={approvalAiExpanded}
              onToggle={() => setApprovalAiExpanded((v) => !v)}
            />
          ),
          main: (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-end gap-2">
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#BFDBFE] text-[#2563EB]"><RefreshCw size={10} />刷新任务</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Zap size={10} />批量补审</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Download size={10} />导出任务清单</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Eye size={10} />查看处理规则</Button>
            </div>

            <div className="grid grid-cols-[210px_1fr_210px] gap-3" style={{ minHeight: 520 }}>

              {/* COL 1: Task list */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-3 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                  <span className="text-[11px] font-semibold text-[#0F172A]">补审任务列表</span>
                  <p className="text-[9px] text-[#94A3B8] mt-0.5">优先处理高阻塞等级任务</p>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {REVIEW_TASKS.map(task => {
                    const isActive = activeTask?.id === task.id;
                    return (
                      <div key={task.id} onClick={() => setSelectedReviewTaskId(task.id)}
                        className={cn('px-3 py-2.5 border-b border-[#F1F5F9] cursor-pointer transition-all', isActive ? 'bg-[#EFF6FF] border-l-2 border-l-[#2563EB]' : 'hover:bg-[#FAFBFF]')}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[11px] font-semibold text-[#0F172A] truncate">{task.shortName}</span>
                          <Badge className={cn('text-[7px] border', RSTATUS_STYLE[task.status])}>{task.status}</Badge>
                        </div>
                        <div className="text-[9px] text-[#64748B] mb-1">{task.reviewType} · {task.source}</div>
                        <div className="flex items-center gap-1.5 mb-1 text-[8px]">
                          <span className={cn('font-bold', BLOCK_STYLE[task.blockLevel])}>阻塞:{task.blockLevel}</span>
                          {task.canReturn && <span className="text-[#047857]">可回流</span>}
                          {task.needConfirm && <span className="text-[#7C3AED]">需确认</span>}
                        </div>
                        <div className="text-[8px] text-[#94A3B8]">{task.updatedAt} · {task.handler}</div>
                        <div className="flex items-center gap-1 mt-1.5">
                          <Button variant="outline" size="sm" className="h-5 text-[8px] px-1.5 gap-0.5 border-[#BFDBFE] text-[#2563EB]" onClick={e => { e.stopPropagation(); }}>开始处理</Button>
                          <Button variant="ghost" size="sm" className="h-5 text-[8px] px-1 text-[#64748B]"><Star size={8} /></Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* COL 2: Detail */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-4 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC] flex flex-col gap-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-semibold text-[#0F172A]">补审详情主区</span>
                    <Badge className={cn('text-[7px] border shrink-0', RSTATUS_STYLE[activeTask.status])}>{activeTask.status}</Badge>
                  </div>
                  <MicroPulse
                    lines={[
                      '正在核对阻塞项与已补充项…',
                      '正在评估回流预审可行性…',
                      '正在收敛缺口处理路径…',
                    ]}
                    className="text-[#64748B]"
                  />
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                  <AiMiddleGuideCard variant="boundary" title="边界补强：先阻塞摘要，再决定回流">
                    阅读顺序：<strong>阻塞摘要 → 已补充 → 待处理缺口 → 预计回流路径</strong>。若仍存在阻塞回流项，请优先在右侧缺口卡处理后再发起回流。
                  </AiMiddleGuideCard>
                  {/* Task info */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[9px] pb-2 border-b border-[#F1F5F9]">
                    <div><span className="text-[#94A3B8]">任务名称</span> <span className="text-[#0F172A] font-medium">{activeTask.taskName}</span></div>
                    <div><span className="text-[#94A3B8]">补审类型</span> <span className="text-[#0F172A]">{activeTask.reviewType}</span></div>
                    <div><span className="text-[#94A3B8]">来源环节</span> <span className="text-[#0F172A]">{activeTask.source}</span></div>
                    <div><span className="text-[#94A3B8]">发起原因</span> <span className="text-[#0F172A]">{activeTask.triggerReason}</span></div>
                  </div>

                  {/* Problem description */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-semibold text-[#0F172A]">阻塞摘要</div>
                    <div className="text-[9px] text-[#C2410C] font-medium">{activeTask.blockerSummary}</div>
                    {activeTask.missingMaterials.length > 0 && (
                      <div className="text-[9px]"><span className="text-[#94A3B8]">缺失材料:</span> {activeTask.missingMaterials.join('、')}</div>
                    )}
                    {activeTask.pendingExplanations.length > 0 && (
                      <div className="text-[9px]"><span className="text-[#94A3B8]">待补说明:</span> {activeTask.pendingExplanations.join('、')}</div>
                    )}
                    {activeTask.pendingConfirms.length > 0 && (
                      <div className="text-[9px]"><span className="text-[#94A3B8]">待确认项:</span> {activeTask.pendingConfirms.join('、')}</div>
                    )}
                    <div className="text-[9px] text-[#64748B]">当前影响: {activeTask.currentImpact}</div>
                  </div>

                  {/* Processing status */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-semibold text-[#0F172A]">已补充</div>
                    {activeTask.supplemented.length > 0 ? (
                      <div className="text-[9px]">
                        {activeTask.supplemented.map((s, i) => <span key={i} className="mr-2 inline-flex items-center gap-0.5 text-[#047857]"><CheckCircle2 size={8} />{s}</span>)}
                      </div>
                    ) : (
                      <p className="text-[9px] text-[#94A3B8]">暂无已确认补充项。</p>
                    )}
                    <div className="text-[10px] font-semibold text-[#0F172A] pt-1">待处理缺口</div>
                    {activeTask.pending.length > 0 ? (
                      <div className="text-[9px]">
                        {activeTask.pending.map((p, i) => <span key={i} className="mr-2 inline-flex items-center gap-0.5 text-[#C2410C]"><Clock size={8} />{p}</span>)}
                      </div>
                    ) : (
                      <p className="text-[9px] text-[#047857]">当前无待处理缺口项。</p>
                    )}
                    <div className="text-[8px] text-[#94A3B8]">最近: {activeTask.lastAction}</div>

                    {/* Conclusion */}
                    <div className={cn('rounded px-2.5 py-1.5 text-[9px]', activeTask.canReturn ? 'bg-[#F0FDF4] border border-[#BBF7D0] text-[#047857]' : 'bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E]')}>
                      {activeTask.canReturn ? <><CheckCircle2 size={9} className="inline mr-1" />缺口已基本消除，可返回预审</> : <><AlertTriangle size={9} className="inline mr-1" />{activeTask.conclusion}</>}
                    </div>
                    <div className="rounded border border-[#E2E8F0] bg-[#F8FAFC] px-2.5 py-1.5 text-[9px] text-[#334155]">
                      <span className="font-semibold text-[#0F172A]">预计回流路径：</span>
                      {activeTask.canReturn
                        ? '预审与推单（缺口已消除，可回流）'
                        : activeTask.suggestSwitch
                          ? '产品匹配（需重判适配方向）'
                          : '继续补审 → 消除阻塞回流项 → 预审与推单'}
                    </div>
                  </div>

                  {/* Risk & restrictions */}
                  {(activeTask.riskTags.length > 0 || activeTask.unresolved.length > 0 || activeTask.suggestSwitch) && (
                    <div className="space-y-1">
                      <div className="text-[10px] font-semibold text-[#0F172A]">风险与限制</div>
                      {activeTask.riskTags.length > 0 && <div className="flex flex-wrap gap-1">{activeTask.riskTags.map(t => <Badge key={t} className="text-[7px] bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]">{t}</Badge>)}</div>}
                      {activeTask.unresolved.length > 0 && <div className="text-[9px] text-[#C2410C]">未消除限制: {activeTask.unresolved.join('、')}</div>}
                      {activeTask.suggestSwitch && <div className="text-[9px] text-[#7C3AED]">建议切换产品方向</div>}
                    </div>
                  )}

                  {/* Detail actions */}
                  <div className="flex items-center gap-1.5 border-t border-[#F1F5F9] pt-2 flex-wrap">
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#BFDBFE] text-[#2563EB]"><Upload size={9} />补充材料</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]"><Pencil size={9} />补充说明</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]"><Eye size={9} />查看来源依据</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#A7F3D0] text-[#047857]"><ArrowRight size={9} />提交补审结果</Button>
                    {activeTask.needConfirm && <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#DDD6FE] text-[#7C3AED]"><UserCheck size={9} />标记人工确认</Button>}
                  </div>
                </div>
              </div>

              {/* COL 3: Gaps & suggestions */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-3 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                  <span className="text-[11px] font-semibold text-[#0F172A]">缺口与处理建议</span>
                  <p className="text-[9px] text-[#94A3B8] mt-0.5">缺什么、怎么补、回到哪</p>
                </div>
                <div className="flex-1 overflow-y-auto p-2.5 space-y-1.5">
                  {activeTask.gaps.length > 0 ? activeTask.gaps.map((g, i) => (
                    <div key={i} className={cn('rounded border px-2.5 py-2 text-[9px]', g.blocksReturn ? 'border-[#FED7AA] bg-[#FFFBEB]' : 'border-[#D1FAE5] bg-[#F0FDF4]')}>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="font-medium text-[#0F172A]">{g.name}</span>
                        {g.blocksReturn && <span className="text-[7px] font-bold text-[#DC2626]">阻塞回流</span>}
                      </div>
                      <div className="text-[8px] text-[#64748B] mb-0.5">类型: {g.gapType} · 状态: {g.status}</div>
                      <div className="text-[8px] text-[#C2410C]">{g.reason}</div>
                      <div className="flex items-center gap-2 text-[8px] text-[#64748B] mt-0.5">
                        <span>影响: {g.impact}</span>
                        <span>跟进: {g.handler}</span>
                      </div>
                      <div className="text-[8px] text-[#2563EB] mt-0.5">建议: {g.suggestion} → {g.returnTarget}</div>
                    </div>
                  )) : (
                    <div className="flex-1 flex items-center justify-center text-center p-4">
                      <div><CheckCircle2 size={18} className="text-[#A7F3D0] mx-auto mb-1" /><div className="text-[10px] text-[#047857]">当前任务缺口已基本处理完成</div><div className="text-[8px] text-[#94A3B8] mt-0.5">建议发起回流</div></div>
                    </div>
                  )}
                  {activeTask.gaps.length > 0 && (
                    <div className="flex items-center gap-1.5 pt-1 flex-wrap border-t border-[#F1F5F9]">
                      <Button variant="outline" size="sm" className="h-5 text-[8px] px-1.5 gap-0.5 border-[#BFDBFE] text-[#2563EB]"><Eye size={8} />查看缺口详情</Button>
                      <Button variant="outline" size="sm" className="h-5 text-[8px] px-1.5 gap-0.5 border-[#E2E8F0] text-[#475569]"><User size={8} />分配处理人</Button>
                      <Button variant="outline" size="sm" className="h-5 text-[8px] px-1.5 gap-0.5 border-[#E2E8F0] text-[#475569]"><Download size={8} />下载缺口清单</Button>
                      {activeTask.canReturn && <Button variant="outline" size="sm" className="h-5 text-[8px] px-1.5 gap-0.5 border-[#A7F3D0] text-[#047857]"><ArrowRight size={8} />发起回流</Button>}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          ),
        };
      }
    }
  };

  const layout = renderWorkbench();

  return (
    <SceneLayout
      title={scene.title}
      modules={scene.modules}
      activeModule={activeModule}
      onModuleChange={onModuleChange}
      pageSubtitleOverride={layout.pageSubtitleOverride}
      kpiSlot={layout.kpiSlot}
      stickyActionSlot={layout.stickyActionSlot}
      aiPanel={layout.aiPanel}
    >
      {layout.main}
    </SceneLayout>
  );
}
