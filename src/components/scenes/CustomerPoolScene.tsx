import React from 'react';
import SceneLayout from '../SceneLayout';
import { SCENES } from '../../constants';
import {
  Building2,
  Search,
  SlidersHorizontal,
  MoreHorizontal,
  Plus,
  Eye,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  ArrowRightLeft,
  Wallet,
  FileText,
  Briefcase,
  Users,
  CircleDot,
  Network,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useDemo } from '../../demo/DemoContext';
import { SceneHero, ActionBar } from '../../demo/DemoComponents';
import { SAMPLES, type ChainLoanSample } from '../../demo/chainLoan/data';
import { SampleSwitcher, SelectedSampleSummary, AiJudgmentBlock } from '../ProductPrimitives';

interface CustomerPoolSceneProps {
  activeModule: string;
  onModuleChange: (id: string) => void;
}

// ─── Relationship Candidate Pool Data (driven by SAMPLES) ───────────────────

interface RelationCandidate {
  name: string;
  chain: string;
  position: string;
  relationScore: number;
  authenticityScore: number;
  riskExclusionScore: number;
  grade: 'A' | 'B' | 'C';
  action: string;
  status: 'identified' | 'observing' | 'pending';
  sampleId: string;
  segmentTag: string;
}

function sampleToGrade(s: ChainLoanSample): 'A' | 'B' | 'C' {
  if (s.segmentTag === 'A可授信') return 'A';
  if (s.segmentTag === 'B可做但需处理') return 'B';
  return 'C';
}

function sampleToStatus(s: ChainLoanSample): 'identified' | 'observing' | 'pending' {
  if (s.segmentTag === 'A可授信') return 'identified';
  if (s.segmentTag === 'D风险经营中') return 'identified';
  if (s.segmentTag === 'B可做但需处理') return 'observing';
  return 'pending';
}

const RELATION_CANDIDATES: RelationCandidate[] = SAMPLES.map((s) => ({
  name: s.companyName,
  chain: s.chainName,
  position: s.roleInChain,
  relationScore: s.relationStrength,
  authenticityScore: s.authenticityScore,
  riskExclusionScore: Math.round(100 - s.riskFlags.length * 8),
  grade: sampleToGrade(s),
  action: s.nextAction,
  status: sampleToStatus(s),
  sampleId: s.id,
  segmentTag: s.segmentTag,
}));

const GRADE_STYLES = {
  A: { bg: 'bg-[#ECFDF3]', text: 'text-[#047857]', border: 'border-[#A7F3D0]', label: 'A 可授信' },
  B: { bg: 'bg-[#EFF6FF]', text: 'text-[#1890FF]', border: 'border-[#BFDBFE]', label: 'B 观察池' },
  C: { bg: 'bg-[#F8FAFC]', text: 'text-[#94A3B8]', border: 'border-[#E2E8F0]', label: 'C 仅线索' },
};

const STATUS_MAP_V2 = {
  identified: { label: '已识别', className: 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]' },
  observing: { label: '观察中', className: 'bg-[#EFF6FF] text-[#1890FF] border-[#BFDBFE]' },
  pending: { label: '待验证', className: 'bg-white text-[#94A3B8] border-[#E2E8F0]' },
};

// ─── 标准小微客群识别规则 ──────────────────────────────────────────────────

interface StandardSegment {
  id: string;
  name: string;
  subtitle: string;
  status: 'active' | 'trial' | 'pending';
  dataSources: string[];
  rules: { label: string; detail: string }[];
  applicableProducts: string[];
  exclusions: string;
  applicableCustomers: string;
  coverage: string;
  updateTime: string;
  icon: React.ReactNode;
  color: string;
}

const STANDARD_SEGMENTS: StandardSegment[] = [
  {
    id: 'SEG-001', name: '税票连续经营客群', subtitle: '基于增值税发票连续性与销售规模识别',
    status: 'active',
    dataSources: ['税务发票数据', '纳税申报', '开票记录'],
    rules: [
      { label: '连续开票', detail: '近 12 个月中 ≥ 10 个月存在有效开票记录' },
      { label: '销售规模', detail: '近 12 月累计销售额 ≥ 50 万元' },
      { label: '品类稳定', detail: '主营品类占比 ≥ 60%，未出现重大品类跳转' },
      { label: '下游分散', detail: '前 3 大开票对象占比 ≤ 70%' },
    ],
    applicableProducts: ['订单微贷', '税票流水贷'],
    exclusions: '停票 > 3 月或存在重大品类跳转',
    applicableCustomers: '制造业小微 · 有稳定开票的供应链参与者',
    coverage: '3,400',
    updateTime: '2026-04-05',
    icon: <FileText size={16} />, color: '#1890FF',
  },
  {
    id: 'SEG-002', name: '流水稳定经营客群', subtitle: '基于对公结算流水的频次与稳定性识别',
    status: 'active',
    dataSources: ['对公结算流水', '交易摘要', '收付款记录'],
    rules: [
      { label: '月均流水', detail: '近 6 个月月均结算金额 ≥ 20 万元' },
      { label: '结算频次', detail: '月均结算笔数 ≥ 8 笔，无连续 2 月中断' },
      { label: '收付平衡', detail: '收款/付款比例在 0.3~3.0 之间' },
      { label: '账期合理', detail: '主要对手方收付款间隔稳定在 15~60 天' },
    ],
    applicableProducts: ['经营信用贷', '税票流水贷'],
    exclusions: '月均流水 < 10 万或存在连续 2 月空白',
    applicableCustomers: '对公结算活跃的小微企业',
    coverage: '2,180',
    updateTime: '2026-04-03',
    icon: <Wallet size={16} />, color: '#10B981',
  },
  {
    id: 'SEG-003', name: '经营关系稳定客群', subtitle: '基于上下游交易图谱与关系连续性识别',
    status: 'active',
    dataSources: ['对公流水', '交易对手图谱', '摘要语义分析'],
    rules: [
      { label: '稳定对手', detail: '连续 6 个月以上交易对手 ≥ 3 家' },
      { label: '集中度合理', detail: '最大对手占比 ≤ 55%，前二大结构稳定' },
      { label: '语义匹配', detail: '摘要长期出现货款、材料款、运费等经营关键词' },
      { label: '关系互惠', detail: '存在双向交易或上下游闭环证据' },
    ],
    applicableProducts: ['订单微贷', '场景专项贷'],
    exclusions: '无法识别稳定对手方或关系图谱断裂',
    applicableCustomers: '供应链中下游有稳定往来关系的小微',
    coverage: '1,560',
    updateTime: '2026-04-01',
    icon: <Network size={16} />, color: '#8B5CF6',
  },
  {
    id: 'SEG-004', name: '公私联动活跃客群', subtitle: '基于企业结算 + 法人个人多维活跃度识别',
    status: 'trial',
    dataSources: ['代发工资', '个人账户', '理财/存款', '按揭/信用卡'],
    rules: [
      { label: '代发工资', detail: '近 6 个月存在稳定代发记录，人数 ≥ 5 人' },
      { label: '法人沉淀', detail: '法人个人账户日均存款 ≥ 5 万或持有理财' },
      { label: '双重活跃', detail: '企业结算与个人账户同时活跃 ≥ 4 个月' },
      { label: '信用无异常', detail: '法人无逾期、无司法负面' },
    ],
    applicableProducts: ['经营信用贷', '消费+经营组合贷'],
    exclusions: '法人征信有逾期或代发人数波动 > 50%',
    applicableCustomers: '法人与企业双重活跃的小微企业主',
    coverage: '960',
    updateTime: '2026-03-28',
    icon: <Users size={16} />, color: '#F59E0B',
  },
  {
    id: 'SEG-005', name: '经营缴费达标客群', subtitle: '基于水电燃气、租金、社保等经营足迹识别',
    status: 'trial',
    dataSources: ['社保公积金', '水电燃气', '租金缴费', '通信费'],
    rules: [
      { label: '社保连续', detail: '近 6 个月社保/公积金缴纳无中断' },
      { label: '经营缴费', detail: '水电燃气或租金连续缴费 ≥ 6 个月' },
      { label: '规模匹配', detail: '缴费规模与申报经营体量基本吻合' },
      { label: '地址一致', detail: '缴费地址与工商注册或实际经营地址一致' },
    ],
    applicableProducts: ['经营信用贷'],
    exclusions: '缴费地址与工商地址不一致或社保中断 > 3 月',
    applicableCustomers: '小微经营实体 · 有稳定经营场所证据',
    coverage: '1,340',
    updateTime: '2026-03-25',
    icon: <Building2 size={16} />, color: '#EC4899',
  },
];

const SEGMENT_STATUS_MAP = {
  active: { label: '已上线', dot: 'bg-emerald-400', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  trial: { label: '灰度中', dot: 'bg-amber-400', bg: 'bg-amber-50 text-amber-700 border-amber-200' },
  pending: { label: '待上线', dot: 'bg-slate-300', bg: 'bg-slate-50 text-slate-500 border-slate-200' },
};

// ─── 长尾场景客群识别规则 ──────────────────────────────────────────────────

interface LongtailScenario {
  id: string;
  name: string;
  subtitle: string;
  status: 'active' | 'trial' | 'pending';
  dataSources: string[];
  rules: { label: string; detail: string }[];
  applicableProducts: string[];
  exclusions: string;
  applicableCustomers: string;
  coverage: string;
  updateTime: string;
  icon: React.ReactNode;
  color: string;
}

const LONGTAIL_SCENARIOS: LongtailScenario[] = [
  {
    id: 'LT-001', name: '脱核链贷主体', subtitle: '无链主确权场景下，基于内部数据交叉验证识别链上主体',
    status: 'active',
    dataSources: ['对公流水', '发票', '物流单据', '回款归集'],
    rules: [
      { label: '三流交叉', detail: '订单金额、发票金额、回款金额三者偏差 ≤ 15%' },
      { label: '物流佐证', detail: '存在与交易匹配的物流签收或运单记录' },
      { label: '回款闭环', detail: '下游回款归集账户可追溯至对应订单' },
      { label: '关系评分', detail: '关系强度 ≥ 70 分且经营真实性 ≥ 65 分' },
    ],
    applicableProducts: ['订单微贷'],
    exclusions: '三流偏差 > 20% 或关系强度 < 60',
    applicableCustomers: '无链主确权的供应链小微企业',
    coverage: '460',
    updateTime: '2026-04-07',
    icon: <ArrowRightLeft size={16} />, color: '#6366F1',
  },
  {
    id: 'LT-002', name: '个体承运商', subtitle: '基于运单频次与签收稳定性识别物流链末端经营主体',
    status: 'trial',
    dataSources: ['运单数据', '签收记录', '结算流水', 'GPS轨迹'],
    rules: [
      { label: '运单频次', detail: '月均完成运单 ≥ 30 单' },
      { label: '签收率', detail: '签收率 ≥ 95%，异常签收 ≤ 2%' },
      { label: '结算稳定', detail: '月均运费结算金额波动 ≤ 20%' },
      { label: '路线稳定', detail: '常跑线路 ≥ 2 条，线路连续 ≥ 3 个月' },
    ],
    applicableProducts: ['运费贷', '服务贷'],
    exclusions: '签收率 < 90% 或运单月均 < 15',
    applicableCustomers: '物流链末端个体或小微承运商',
    coverage: '1,200',
    updateTime: '2026-04-02',
    icon: <TrendingUp size={16} />, color: '#0EA5E9',
  },
  {
    id: 'LT-003', name: '轻资产服务商', subtitle: '基于合同回款与客户黏性识别技术/咨询/设计类服务主体',
    status: 'pending',
    dataSources: ['合同台账', '回款记录', '发票数据', '代发工资'],
    rules: [
      { label: '合同连续', detail: '近 12 个月存在 ≥ 2 份有效服务合同' },
      { label: '回款匹配', detail: '合同金额与实际回款偏差 ≤ 10%' },
      { label: '客户黏性', detail: '复购客户占比 ≥ 40%' },
      { label: '团队稳定', detail: '代发工资人数稳定且无大幅波动' },
    ],
    applicableProducts: ['经营信用贷'],
    exclusions: '复购率 < 30% 或合同中断 > 6 月',
    applicableCustomers: '技术/咨询/设计类轻资产服务企业',
    coverage: '680',
    updateTime: '2026-03-20',
    icon: <Briefcase size={16} />, color: '#14B8A6',
  },
];

// ─── Graph Data ──────────────────────────────────────────────────────────────

interface CounterpartyNode {
  id: string;
  name: string;
  direction: 'upstream' | 'downstream' | 'service';
  txCount: number;
  txAmount: string;
  months: number;
  cycleDays: string;
  concentration: string;
  keywords: string[];
  status: 'stable' | 'attention' | 'new';
  relationStrength: number;
  evidenceSources: string[];
  isMainChain: boolean;
}

const COUNTERPARTY_NODES: CounterpartyNode[] = [
  { id: 'cp-1', name: '盛拓模组科技', direction: 'downstream', txCount: 48, txAmount: '386万', months: 14, cycleDays: '30-35天', concentration: '42%', keywords: ['包装箱', '材料款', '周转箱'], status: 'stable', relationStrength: 92, evidenceSources: ['对公流水', '增值税发票', '物流签收'], isMainChain: true },
  { id: 'cp-2', name: '金利达新材料', direction: 'upstream', txCount: 22, txAmount: '156万', months: 11, cycleDays: '15-20天', concentration: '28%', keywords: ['原材料', '采购款', 'EPE'], status: 'stable', relationStrength: 88, evidenceSources: ['对公流水', '增值税发票', '采购合同'], isMainChain: true },
  { id: 'cp-3', name: '驰远物流', direction: 'service', txCount: 61, txAmount: '34万', months: 18, cycleDays: '周结', concentration: '—', keywords: ['运费', '物流费'], status: 'stable', relationStrength: 85, evidenceSources: ['对公流水', '运单签收', '物流轨迹'], isMainChain: false },
  { id: 'cp-4', name: '常州永信化工', direction: 'upstream', txCount: 15, txAmount: '89万', months: 8, cycleDays: '30天', concentration: '16%', keywords: ['胶水', '材料款'], status: 'stable', relationStrength: 76, evidenceSources: ['对公流水', '增值税发票'], isMainChain: false },
  { id: 'cp-5', name: '瑞丰辅料', direction: 'downstream', txCount: 12, txAmount: '67万', months: 6, cycleDays: '45天', concentration: '12%', keywords: ['缓冲材料', '货款'], status: 'new', relationStrength: 61, evidenceSources: ['对公流水', '发票'], isMainChain: false },
  { id: 'cp-6', name: '溧阳宏达机械', direction: 'downstream', txCount: 8, txAmount: '38万', months: 4, cycleDays: '不规律', concentration: '7%', keywords: ['加工费', '服务费'], status: 'attention', relationStrength: 42, evidenceSources: ['对公流水'], isMainChain: false },
  { id: 'cp-7', name: '苏州汇能塑胶', direction: 'upstream', txCount: 18, txAmount: '112万', months: 9, cycleDays: '30天', concentration: '19%', keywords: ['塑料粒子', '原材料'], status: 'stable', relationStrength: 80, evidenceSources: ['对公流水', '增值税发票', '物流签收'], isMainChain: true },
  { id: 'cp-8', name: '顺捷报关行', direction: 'service', txCount: 24, txAmount: '18万', months: 12, cycleDays: '月结', concentration: '—', keywords: ['报关费', '代理费'], status: 'stable', relationStrength: 72, evidenceSources: ['对公流水', '报关单据'], isMainChain: false },
  { id: 'cp-9', name: '无锡创达电气', direction: 'downstream', txCount: 6, txAmount: '29万', months: 3, cycleDays: '45-60天', concentration: '5%', keywords: ['电气箱', '包装'], status: 'new', relationStrength: 38, evidenceSources: ['对公流水'], isMainChain: false },
];

// ─── Score Bar Component ─────────────────────────────────────────────────────

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} />
      </div>
      <span className="text-xs font-semibold text-[#0F172A] w-7 text-right">{value}</span>
    </div>
  );
}

// ─── Chain Proof Graph ────────────────────────────────────────────────────────

const DIR_THEME = {
  upstream:   { fill: '#FFF7ED', stroke: '#F97316', text: '#9A3412', label: '上游供应商', edgeLabel: '采购付款' },
  downstream: { fill: '#EFF6FF', stroke: '#3B82F6', text: '#1E40AF', label: '下游采购方', edgeLabel: '销售收款' },
  service:    { fill: '#ECFDF5', stroke: '#10B981', text: '#065F46', label: '服务/物流',  edgeLabel: '服务支付' },
} as const;

const STATUS_DOT = { stable: '#10B981', attention: '#F59E0B', new: '#3B82F6' } as const;

interface NodePos { x: number; y: number; node: CounterpartyNode }

function chainLayout(nodes: CounterpartyNode[], W: number, H: number): { positions: NodePos[]; cx: number; cy: number } {
  const groups = { upstream: nodes.filter(n => n.direction === 'upstream'), downstream: nodes.filter(n => n.direction === 'downstream'), service: nodes.filter(n => n.direction === 'service') };
  const cx = W * 0.42, cy = H * 0.42;
  const result: NodePos[] = [];

  const upMain = groups.upstream.filter(n => n.isMainChain);
  const upAux  = groups.upstream.filter(n => !n.isMainChain);
  upMain.forEach((n, i) => {
    const spacing = 80;
    const baseY = cy - ((upMain.length - 1) * spacing) / 2;
    result.push({ x: cx - 190, y: baseY + i * spacing, node: n });
  });
  upAux.forEach((n, i) => {
    const spacing = 80;
    const baseY = cy - ((upAux.length - 1) * spacing) / 2;
    result.push({ x: cx - 310, y: baseY + i * spacing, node: n });
  });

  const downMain = groups.downstream.filter(n => n.isMainChain);
  const downAux  = groups.downstream.filter(n => !n.isMainChain);
  downMain.forEach((n, i) => {
    const spacing = 80;
    const baseY = cy - ((downMain.length - 1) * spacing) / 2;
    result.push({ x: cx + 200, y: baseY + i * spacing, node: n });
  });
  downAux.forEach((n, i) => {
    const spacing = 72;
    const baseY = cy - ((downAux.length - 1) * spacing) / 2;
    result.push({ x: cx + 310, y: baseY + i * spacing, node: n });
  });

  groups.service.forEach((n, i) => {
    const spacing = 140;
    const baseX = cx - ((groups.service.length - 1) * spacing) / 2;
    result.push({ x: baseX + i * spacing, y: cy + 180, node: n });
  });

  return { positions: result, cx, cy };
}

function RelationGraph() {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);

  const W = 780, H = 480;
  const { positions, cx, cy } = chainLayout(COUNTERPARTY_NODES, W, H);
  const { currentSample } = useDemo();
  const centerName = currentSample.shortName;
  const selected = selectedId ? COUNTERPARTY_NODES.find(n => n.id === selectedId) ?? null : null;

  const mainChainCount = COUNTERPARTY_NODES.filter(n => n.isMainChain).length;
  const avgStrength = Math.round(COUNTERPARTY_NODES.reduce((s, n) => s + n.relationStrength, 0) / COUNTERPARTY_NODES.length);
  const strongCount = COUNTERPARTY_NODES.filter(n => n.relationStrength >= 70).length;

  const nodeR = 30;

  const strengthColor = (v: number) => v >= 80 ? '#10B981' : v >= 60 ? '#3B82F6' : v >= 40 ? '#F59E0B' : '#EF4444';
  const strengthLabel = (v: number) => v >= 80 ? '强' : v >= 60 ? '中' : v >= 40 ? '弱' : '极弱';

  const chainMasterX = cx + 420, chainMasterY = cy;

  return (
    <div className="space-y-3">
      {/* ── Chain Summary Bar ── */}
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3.5 flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#7C3AED] flex items-center justify-center"><Network size={13} className="text-white" /></div>
              <div className="text-[12px]">
                <span className="text-[#94A3B8]">链主</span>
                <span className="ml-1.5 font-semibold text-[#7C3AED]">宁川新能源</span>
                <span className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-medium">未确权</span>
              </div>
            </div>
            <div className="text-[#CBD5E1]">→</div>
            <div className="text-[12px]">
              <span className="text-[#94A3B8]">Tier-2</span>
              <span className="ml-1.5 font-semibold text-[#3B82F6]">盛拓模组科技</span>
              <span className="ml-1 text-[10px] text-[#64748B]">· 桥接</span>
            </div>
            <div className="text-[#CBD5E1]">→</div>
            <div className="text-[12px]">
              <span className="text-[#94A3B8]">Tier-3 借款主体</span>
              <span className="ml-1.5 font-bold text-[#0F172A]">{centerName}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-center">
              <div className="text-[15px] font-bold text-emerald-600">{strongCount}/{COUNTERPARTY_NODES.length}</div>
              <div className="text-[9px] text-[#94A3B8]">强关系</div>
            </div>
            <div className="text-center">
              <div className="text-[15px] font-bold text-[#2563EB]">{mainChainCount}</div>
              <div className="text-[9px] text-[#94A3B8]">主链节点</div>
            </div>
            <div className="text-center">
              <div className="text-[15px] font-bold" style={{ color: strengthColor(avgStrength) }}>{avgStrength}</div>
              <div className="text-[9px] text-[#94A3B8]">平均强度</div>
            </div>
            <div className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${avgStrength >= 70 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
              证据{avgStrength >= 70 ? '充分' : '一般'}
            </div>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-[#F1F5F9] text-[11px] text-[#64748B] leading-5">
          链主<span className="font-semibold text-[#7C3AED]">宁川新能源</span>未对借款主体进行确权。本图谱基于银行内部结算流水、发票、物流等数据，推断<span className="font-semibold text-[#0F172A]">{centerName}</span>处于新能源电池产业链 Tier-3 层级，经营关系真实，具备脱核授信条件。
        </div>
      </div>

      {/* ── Graph + Detail Panel ── */}
      <div className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden flex" style={{ minHeight: 460 }}>
        {/* SVG Canvas */}
        <svg viewBox={`0 0 ${W} ${H}`} className="flex-1">
          <defs>
            <filter id="ns"><feDropShadow dx="0" dy="1" stdDeviation="2.5" floodOpacity="0.07" /></filter>
            <filter id="ng"><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            {Object.entries(DIR_THEME).map(([k, t]) => (
              <marker key={k} id={`a-${k}`} viewBox="0 0 8 6" refX="8" refY="3" markerWidth="7" markerHeight="5" orient="auto-start-reverse">
                <path d="M0,0.5 L7.5,3 L0,5.5Z" fill={t.stroke} opacity="0.5" />
              </marker>
            ))}
            <marker id="a-chain" viewBox="0 0 8 6" refX="8" refY="3" markerWidth="7" markerHeight="5" orient="auto-start-reverse">
              <path d="M0,0.5 L7.5,3 L0,5.5Z" fill="#7C3AED" opacity="0.4" />
            </marker>
          </defs>

          <pattern id="gr" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M28 0 L0 0 0 28" fill="none" stroke="#F1F5F9" strokeWidth="0.4" />
          </pattern>
          <rect width={W} height={H} fill="url(#gr)" />

          {/* Zone labels */}
          <text x={cx - 285} y={22} textAnchor="middle" fontSize={9} fill="#9A3412" opacity={0.4} fontWeight={600}>上游原材料</text>
          <text x={cx + 220} y={22} textAnchor="middle" fontSize={9} fill="#1E40AF" opacity={0.4} fontWeight={600}>下游采购方</text>
          <text x={cx} y={H - 12} textAnchor="middle" fontSize={9} fill="#065F46" opacity={0.4} fontWeight={600}>服务 / 物流方</text>

          {/* Supply chain flow backbone */}
          <line x1={cx - 380} y1={cy} x2={cx + 380} y2={cy} stroke="#CBD5E1" strokeWidth={1} strokeDasharray="6 4" opacity={0.2} />

          {/* Chain master demand flow — dashed purple from 盛拓模组科技 to 宁川新能源 */}
          {(() => {
            const shengtuo = positions.find(p => p.node.id === 'cp-1');
            if (!shengtuo) return null;
            const sx = shengtuo.x + nodeR + 4, sy = shengtuo.y;
            const ex = chainMasterX - 26, ey = chainMasterY;
            return (
              <g opacity={0.35}>
                <path d={`M${sx},${sy} Q${(sx + ex) / 2},${sy - 30} ${ex},${ey}`} fill="none" stroke="#7C3AED" strokeWidth={1.5} strokeDasharray="6 4" markerEnd="url(#a-chain)" />
                <text x={(sx + ex) / 2} y={sy - 36} textAnchor="middle" fontSize={7.5} fill="#7C3AED" opacity={0.7} fontWeight={500}>采购需求传导</text>
              </g>
            );
          })()}

          {/* Edges from center to counterparties */}
          {positions.map(({ x, y, node }) => {
            const t = DIR_THEME[node.direction];
            const active = hoveredId === node.id || selectedId === node.id;
            const dimmed = (hoveredId || selectedId) && hoveredId !== node.id && selectedId !== node.id;

            const dx = x - cx, dy = y - cy;
            const d = Math.sqrt(dx * dx + dy * dy);
            const ux = dx / d, uy = dy / d;
            const sx = cx + ux * 34, sy = cy + uy * 34;
            const ex = x - ux * (nodeR + 2), ey = y - uy * (nodeR + 2);
            const mx = (sx + ex) / 2, my = (sy + ey) / 2;
            const curveFactor = node.isMainChain ? 10 : 20;
            const qx = mx + (-uy) * curveFactor, qy = my + ux * curveFactor;

            const mEnd = node.direction === 'upstream' ? '' : `url(#a-${node.direction})`;
            const mStart = node.direction === 'upstream' ? `url(#a-${node.direction})` : '';
            const pid = `e-${node.id}`;
            const edgeW = node.isMainChain ? (active ? 2.5 : 1.8) : (active ? 2 : 1);

            return (
              <g key={pid} opacity={dimmed ? 0.08 : active ? 1 : node.isMainChain ? 0.5 : 0.25} style={{ transition: 'opacity 0.25s' }}>
                <path id={pid} d={`M${sx},${sy} Q${qx},${qy} ${ex},${ey}`} fill="none" stroke={t.stroke} strokeWidth={edgeW} strokeDasharray={node.isMainChain ? 'none' : '4 3'} markerEnd={mEnd} markerStart={mStart} filter={active ? 'url(#ng)' : undefined} />
                {active && (
                  <text className="select-none" dy={-5} fill={t.text} fontSize={8} fontWeight={600} opacity={0.85}>
                    <textPath href={`#${pid}`} startOffset="50%" textAnchor="middle">{t.edgeLabel} · {node.txAmount} · {node.txCount}笔</textPath>
                  </text>
                )}
              </g>
            );
          })}

          {/* ── Chain master node (宁川新能源) ── */}
          <g>
            <circle cx={chainMasterX} cy={chainMasterY} r={32} fill="#7C3AED" filter="url(#ns)" />
            <circle cx={chainMasterX} cy={chainMasterY} r={32} fill="none" stroke="#6D28D9" strokeWidth={2} strokeDasharray="5 3" />
            <text x={chainMasterX} y={chainMasterY - 6} textAnchor="middle" fill="white" fontSize={10.5} fontWeight={700} className="select-none">宁川新能源</text>
            <text x={chainMasterX} y={chainMasterY + 7} textAnchor="middle" fill="#E9D5FF" fontSize={7.5} fontWeight={500} className="select-none">链主 · 未确权</text>
          </g>

          {/* ── Center node: borrower (衡远包装) ── */}
          <g filter="url(#ns)">
            <circle cx={cx} cy={cy} r={34} fill="#EFF6FF" />
            <circle cx={cx} cy={cy} r={34} fill="none" stroke="#3B82F6" strokeWidth={2} />
            <text x={cx} y={cy - 7} textAnchor="middle" fill="#1E3A5F" fontSize={11.5} fontWeight={700} className="select-none">{centerName}</text>
            <text x={cx} y={cy + 6} textAnchor="middle" fill="#64748B" fontSize={7.5} className="select-none">Tier-3 · 借款主体</text>
            <text x={cx} y={cy + 17} textAnchor="middle" fill="#2563EB" fontSize={7} fontWeight={600} className="select-none">脱核授信对象</text>
          </g>

          {/* Counterparty nodes */}
          {positions.map(({ x, y, node }) => {
            const t = DIR_THEME[node.direction];
            const active = hoveredId === node.id || selectedId === node.id;
            const dimmed = (hoveredId || selectedId) && hoveredId !== node.id && selectedId !== node.id;
            const sColor = strengthColor(node.relationStrength);
            const shortName = node.name.length > 5 ? node.name.slice(0, 5) : node.name;

            return (
              <g
                key={node.id}
                opacity={dimmed ? 0.15 : 1}
                style={{ transition: 'opacity 0.25s', cursor: 'pointer' }}
                onClick={() => setSelectedId(p => p === node.id ? null : node.id)}
                onMouseEnter={() => setHoveredId(node.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                {active && <circle cx={x} cy={y} r={nodeR + 5} fill={t.stroke} opacity={0.08} />}
                <circle cx={x} cy={y} r={nodeR} fill={t.fill} stroke={node.isMainChain ? t.stroke : t.stroke + '80'} strokeWidth={node.isMainChain ? (active ? 2.5 : 1.8) : (active ? 2 : 1)} filter="url(#ns)" />
                <text x={x} y={y - 2} textAnchor="middle" fill={t.text} fontSize={10} fontWeight={600} className="select-none">{shortName}</text>
                <text x={x} y={y + 10} textAnchor="middle" fill={sColor} fontSize={7.5} fontWeight={700} className="select-none">{node.relationStrength}</text>
                <circle cx={x + nodeR - 4} cy={y - nodeR + 4} r={3.5} fill={STATUS_DOT[node.status]} stroke="white" strokeWidth={1.2} />
                {node.isMainChain && <circle cx={x - nodeR + 4} cy={y - nodeR + 4} r={3} fill="#2563EB" stroke="white" strokeWidth={1} />}
              </g>
            );
          })}

          {/* Legend at bottom-left */}
          <g transform={`translate(12, ${H - 42})`}>
            <g>
              <circle cx={5} cy={5} r={4} fill="#7C3AED" opacity={0.5} />
              <text x={13} y={9} fontSize={8} fill="#64748B">链主(未确权)</text>
            </g>
            {Object.entries(DIR_THEME).map(([, t], i) => (
              <g key={t.label} transform={`translate(${(i + 1) * 82}, 0)`}>
                <circle cx={5} cy={5} r={4} fill={t.stroke} opacity={0.7} />
                <text x={13} y={9} fontSize={8} fill="#64748B">{t.label}</text>
              </g>
            ))}
            <g transform="translate(328, 0)">
              <line x1={0} y1={5} x2={14} y2={5} stroke="#64748B" strokeWidth={1.5} />
              <text x={18} y={9} fontSize={8} fill="#64748B">主链</text>
            </g>
            <g transform="translate(372, 0)">
              <line x1={0} y1={5} x2={14} y2={5} stroke="#64748B" strokeWidth={1} strokeDasharray="3 2" />
              <text x={18} y={9} fontSize={8} fill="#64748B">辅助</text>
            </g>
          </g>
        </svg>

        {/* ── Right detail panel ── */}
        <div className="w-[270px] flex-shrink-0 border-l border-[#F1F5F9] bg-[#FAFBFC] overflow-y-auto" style={{ maxHeight: 460 }}>
          {selected ? (
            <div className="p-3 space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: DIR_THEME[selected.direction].stroke }} />
                  <span className="text-[12px] font-semibold text-[#0F172A]">{selected.name}</span>
                </div>
                <button onClick={() => setSelectedId(null)} className="text-[10px] text-[#94A3B8] hover:text-[#64748B]">×</button>
              </div>

              <div className="rounded-lg bg-white border border-[#E2E8F0] p-2.5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-[#94A3B8]">节点角色</span>
                  <span className="text-[11px] font-semibold" style={{ color: DIR_THEME[selected.direction].text }}>{DIR_THEME[selected.direction].label}</span>
                </div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] text-[#94A3B8]">关系强度</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[13px] font-bold" style={{ color: strengthColor(selected.relationStrength) }}>{selected.relationStrength}</span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold" style={{ color: strengthColor(selected.relationStrength), backgroundColor: strengthColor(selected.relationStrength) + '15' }}>{strengthLabel(selected.relationStrength)}</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${selected.relationStrength}%`, backgroundColor: strengthColor(selected.relationStrength) }} />
                </div>
                <div className="flex items-center justify-between mt-2 text-[10px]">
                  <span className="text-[#94A3B8]">链路位置</span>
                  <span className="font-medium text-[#334155]">{selected.isMainChain ? '主链节点' : '辅助节点'}</span>
                </div>
              </div>

              <div className="rounded-lg bg-white border border-[#E2E8F0] p-2.5">
                <p className="text-[10px] text-[#94A3B8] mb-2">交易指标</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: '交易笔数', value: `${selected.txCount}笔`, bold: true },
                    { label: '活跃月数', value: `${selected.months}个月`, bold: true },
                    { label: '交易金额', value: selected.txAmount, bold: true },
                    { label: '月均频次', value: `${(selected.txCount / selected.months).toFixed(1)}笔`, bold: false },
                    { label: '账期/结算', value: selected.cycleDays, bold: false },
                    { label: '集中度', value: selected.concentration, bold: false },
                  ].map(m => (
                    <div key={m.label} className="text-[11px]">
                      <div className="text-[9px] text-[#94A3B8]">{m.label}</div>
                      <div className={`${m.bold ? 'font-semibold text-[#0F172A]' : 'font-medium text-[#334155]'}`}>{m.value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-lg bg-white border border-[#E2E8F0] p-2.5">
                <p className="text-[10px] text-[#94A3B8] mb-1.5">证据来源</p>
                <div className="flex flex-wrap gap-1">
                  {selected.evidenceSources.map(src => (
                    <span key={src} className="text-[10px] px-1.5 py-0.5 rounded bg-[#F1F5F9] border border-[#E2E8F0] text-[#334155]">{src}</span>
                  ))}
                </div>
                <div className="mt-2 flex flex-wrap gap-1">
                  {selected.keywords.map(kw => (
                    <span key={kw} className="text-[9px] px-1.5 py-0.5 rounded border" style={{ borderColor: DIR_THEME[selected.direction].stroke + '30', backgroundColor: DIR_THEME[selected.direction].fill, color: DIR_THEME[selected.direction].text }}>{kw}</span>
                  ))}
                </div>
              </div>

              <div className="rounded-lg bg-white border border-[#E2E8F0] p-2.5">
                <p className="text-[10px] text-[#94A3B8] mb-1.5">六维验证</p>
                <div className="space-y-1.5">
                  {[
                    { dim: '连续性', pass: selected.months >= 6 },
                    { dim: '周期性', pass: selected.cycleDays !== '不规律' },
                    { dim: '对应性', pass: selected.evidenceSources.length >= 2 },
                    { dim: '语义性', pass: true },
                    { dim: '集中度', pass: selected.concentration !== '—' && parseFloat(selected.concentration) <= 55 },
                    { dim: '波动性', pass: selected.status !== 'attention' },
                  ].map(v => (
                    <div key={v.dim} className="flex items-center gap-1.5 text-[10px]">
                      {v.pass ? <CheckCircle2 size={10} className="text-emerald-500 flex-shrink-0" /> : <AlertTriangle size={10} className="text-amber-500 flex-shrink-0" />}
                      <span className="text-[#334155]">{v.dim}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-3 space-y-2.5">
              <p className="text-[11px] font-semibold text-[#0F172A]">节点列表</p>
              <p className="text-[10px] text-[#94A3B8]">点击图中节点或下方条目查看详情</p>
              {[...COUNTERPARTY_NODES]
                .sort((a, b) => b.relationStrength - a.relationStrength)
                .map(n => {
                  const t = DIR_THEME[n.direction];
                  return (
                    <button key={n.id} onClick={() => setSelectedId(n.id)} className="w-full text-left rounded-lg bg-white border border-[#E2E8F0] p-2 hover:border-[#CBD5E1] hover:shadow-sm transition-all">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: t.stroke }} />
                        <span className="text-[11px] font-medium text-[#0F172A] flex-1 truncate">{n.name}</span>
                        <span className="text-[10px] font-bold" style={{ color: strengthColor(n.relationStrength) }}>{n.relationStrength}</span>
                        {n.isMainChain && <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] flex-shrink-0" />}
                      </div>
                      <div className="flex items-center gap-3 mt-1 text-[9px] text-[#94A3B8] ml-4">
                        <span>{t.label}</span>
                        <span>{n.txAmount} · {n.txCount}笔</span>
                        <span>{n.months}月</span>
                      </div>
                    </button>
                  );
                })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Linked Module: Enhanced Business Footprint ──────────────────────────────

function LinkedEnhanced() {
  const { active, toggleEvidenceDrawer, currentSample } = useDemo();

  const footprintDimensions = [
    { icon: <Wallet size={14} className="text-[#2563EB]" />, label: '代发工资', detail: '月均代发 27 人 · 连续 14 个月', score: 88, status: 'pass' as const },
    { icon: <FileText size={14} className="text-[#7C3AED]" />, label: '社保公积金', detail: '社保 22 人 · 公积金 18 人 · 连续缴纳', score: 82, status: 'pass' as const },
    { icon: <Briefcase size={14} className="text-[#047857]" />, label: '经营性缴费', detail: '水电 ¥3,200/月 · 租金 ¥8,500/月 · 通信 ¥680/月', score: 91, status: 'pass' as const },
    { icon: <Users size={14} className="text-[#C2410C]" />, label: '法人个人沉淀', detail: '理财 ¥42万 · 按揭正常 · 信用卡活跃', score: 85, status: 'pass' as const },
    { icon: <AlertTriangle size={14} className="text-[#DC2626]" />, label: '异常排除', detail: '无大额对私转账 · 无快进快出 · 无夜间异常', score: 96, status: 'pass' as const },
  ];

  return (
    <>
      <div className="rounded-2xl bg-gradient-to-r from-[#7C3AED] to-[#A78BFA] p-5 text-white">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 shrink-0 mt-0.5">
            <Users size={18} />
          </div>
          <div>
            <div className="text-base font-semibold">经营实质增强验证（第四步）</div>
            <p className="mt-1.5 text-sm leading-6 text-white/80">
              在关系识别基础上，进一步验证主体是否真实经营、持续经营。将"交易关系"升级为"经营关系"。
            </p>
          </div>
        </div>
      </div>

      <Card className="border border-[#E5E7EB]">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm">经营足迹增强维度 — {currentSample.shortName}</CardTitle>
            <Badge className="bg-[#ECFDF3] text-[#047857] border border-[#A7F3D0] text-[10px]">综合加分 +23</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-0">
          {footprintDimensions.map((dim) => (
            <div key={dim.label} className="flex items-center gap-3 py-3 border-b border-[#F1F5F9] last:border-b-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F8FAFC] shrink-0">
                {dim.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium text-[#0F172A]">{dim.label}</span>
                  <CheckCircle2 size={12} className="text-[#16A34A]" />
                </div>
                <div className="text-[11px] text-[#64748B] mt-0.5">{dim.detail}</div>
              </div>
              <div className="w-24 shrink-0">
                <ScoreBar value={dim.score} color="bg-[#16A34A]" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border border-[#E5E7EB]">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">公私联动画像增强</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {[
              { label: '企业结算', items: ['对公月均结算 58 万', '月均结算笔数 86', '净流入为正 · 资金沉淀稳定'] },
              { label: '法人个人', items: ['理财余额 42 万', '按揭正常还款 36 期', '信用卡月均消费 1.2 万'] },
              { label: '联动信号', items: ['对公→个人转账合理', '无异常大额拆借', '公私联动评分 85'] },
            ].map((col) => (
              <div key={col.label} className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
                <div className="text-xs font-semibold text-[#0F172A] mb-2">{col.label}</div>
                <div className="space-y-1.5">
                  {col.items.map((item) => (
                    <div key={item} className="text-[11px] text-[#475569] leading-5 flex items-center gap-1.5">
                      <CircleDot size={8} className="text-[#94A3B8] shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {active && (
        <div className="rounded-xl border border-[#E5E7EB] bg-white p-4">
          <div className="text-xs font-medium text-[#0F172A] mb-3">AI 识别信号 — {currentSample.shortName}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-2 text-[11px] text-[#475569] leading-5">
              {currentSample.aiSummary}
            </div>
            <div className="rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-2 text-[11px] text-[#475569] leading-5">
              链路: {currentSample.mainChainPath.join(' → ')}
            </div>
            <div className="rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-2 text-[11px] text-[#475569] leading-5">
              {currentSample.logisticsStatus} · {currentSample.accountFlowStatus}
            </div>
            <div className="rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-2 text-[11px] text-[#475569] leading-5">
              置信度 {currentSample.agentHints.confidence}% · {currentSample.agentHints.suggestedAgent}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function CustomerPoolScene({ activeModule, onModuleChange }: CustomerPoolSceneProps) {
  const scene = SCENES.find((item) => item.id === 'customer-pool')!;
  const { active, toggleEvidenceDrawer, currentSample, selectSample, selectedSampleId } = useDemo();

  const renderContent = () => {
    switch (activeModule) {
      // ── 关系候选池 (internal) ──────────────────────────────────────────
      case 'internal':
      default:
        return (
          <div className="space-y-4">
            {active && <SceneHero question="谁该进入资产池、依据是什么" />}

            <SelectedSampleSummary sample={currentSample} />

            {/* Method positioning banner */}
            <div className="rounded-2xl bg-gradient-to-r from-[#0F172A] to-[#334155] p-5 text-white">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 shrink-0 mt-0.5">
                    <Network size={18} />
                  </div>
                  <div>
                    <div className="text-base font-semibold">内部数据供应链关系识别</div>
                    <p className="mt-1.5 text-sm leading-6 text-white/70">
                      基于银行内部数据，识别供应链关系候选，验证经营实质，为预授信、人工补审和风险前置提供证据支持。
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 shrink-0">
                  <Badge className="bg-white/10 text-white/80 border-white/15 text-[10px]">关系推断引擎</Badge>
                  <Badge className="bg-white/10 text-white/80 border-white/15 text-[10px]">经营实质验证</Badge>
                </div>
              </div>
            </div>

            {/* 识别结论汇总 — 三类标准结论 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: '已识别候选', value: '38', detail: '本周新增 5', color: 'text-[#2563EB]' },
                { label: '已识别，可入池', value: '12', detail: '满足经营实质 + 关系强度', color: 'text-[#047857]' },
                { label: '待验证，继续观察', value: '18', detail: '证据不足 · 需补充或持续追踪', color: 'text-[#F59E0B]' },
                { label: '不建议入池', value: '8', detail: '关系弱或经营真实性不足', color: 'text-[#94A3B8]' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-xl border border-[#E2E8F0] bg-white p-4">
                  <div className="text-[11px] text-[#94A3B8]">{stat.label}</div>
                  <div className={`mt-1 text-2xl font-bold ${stat.color}`}>{stat.value}</div>
                  <div className="mt-0.5 text-[11px] text-[#64748B]">{stat.detail}</div>
                </div>
              ))}
            </div>

            <AiJudgmentBlock
              judgment="38 户候选中 12 户达 A 级可授信标准，建议优先处理关系强度 > 80% 的样本"
              basis={['命中 5 条识别规则', '证据覆盖率 76%', '高置信度样本 12 户']}
              confidence={83}
              action="查看识别依据"
            />

            {/* Search & filters */}
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={14} />
                  <Input placeholder="搜索主体名称、疑似链条..." className="pl-8 h-8 w-64 text-xs bg-white border-[#E2E8F0] focus-visible:ring-1 focus-visible:ring-[#1890FF]" />
                </div>
                <Button variant="outline" size="sm" className="h-8 text-xs text-[#64748B] border-[#E2E8F0] gap-1.5">
                  <SlidersHorizontal size={12} />
                  筛选
                </Button>
              </div>
              <div className="flex items-center gap-2">
                {active && (
                  <Button variant="outline" size="sm" className="h-8 text-xs border-[#BFDBFE] text-[#1890FF] gap-1.5" onClick={toggleEvidenceDrawer}>
                    <Eye size={12} />
                    查看经营证据
                  </Button>
                )}
                <Button size="sm" className="h-8 text-xs bg-[#1890FF] hover:bg-[#0F76D1] gap-1.5">
                  <Plus size={12} />
                  触发识别任务
                </Button>
              </div>
            </div>

            {/* Candidate table */}
            <div className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-[#F8FAFC] hover:bg-[#F8FAFC]">
                    <TableHead className="text-[11px] text-[#64748B] font-medium h-9 pl-4">主体名称</TableHead>
                    <TableHead className="text-[11px] text-[#64748B] font-medium h-9">链条角色</TableHead>
                    <TableHead className="text-[11px] text-[#64748B] font-medium h-9">关系强度</TableHead>
                    <TableHead className="text-[11px] text-[#64748B] font-medium h-9">真实性评分</TableHead>
                    <TableHead className="text-[11px] text-[#64748B] font-medium h-9">证据覆盖度</TableHead>
                    <TableHead className="text-[11px] text-[#64748B] font-medium h-9">识别结论</TableHead>
                    <TableHead className="text-[11px] text-[#64748B] font-medium h-9">下一步动作</TableHead>
                    <TableHead className="text-[11px] text-[#64748B] font-medium h-9 pr-4 text-right">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {RELATION_CANDIDATES.map((c) => {
                    const grade = GRADE_STYLES[c.grade];
                    const isSelected = c.sampleId === selectedSampleId;
                    const conclusion = c.grade === 'A' ? '已识别，可入池' : c.grade === 'B' ? '待验证，继续观察' : '不建议入池';
                    const conclusionStyle = c.grade === 'A' ? 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]' : c.grade === 'B' ? 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]' : 'bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]';
                    return (
                      <TableRow key={c.name} className={`cursor-pointer transition-colors ${isSelected ? 'bg-[#EFF6FF] hover:bg-[#EFF6FF]' : 'hover:bg-[#F8FAFC]'}`} onClick={() => selectSample(c.sampleId)}>
                        <TableCell className="text-[13px] font-medium pl-4 py-3 max-w-[200px]">
                          <div className={`truncate ${isSelected ? 'text-[#2563EB]' : 'text-[#0F172A]'}`}>{c.name}</div>
                        </TableCell>
                        <TableCell className="text-[12px] text-[#334155] py-3">{c.position}</TableCell>
                        <TableCell className="py-3 w-24">
                          <ScoreBar value={c.relationScore} color={c.relationScore >= 70 ? 'bg-[#2563EB]' : 'bg-[#94A3B8]'} />
                        </TableCell>
                        <TableCell className="py-3 w-24">
                          <ScoreBar value={c.authenticityScore} color={c.authenticityScore >= 70 ? 'bg-[#047857]' : 'bg-[#F59E0B]'} />
                        </TableCell>
                        <TableCell className="py-3 w-24">
                          <ScoreBar value={c.riskExclusionScore} color={c.riskExclusionScore >= 80 ? 'bg-[#16A34A]' : 'bg-[#DC2626]'} />
                        </TableCell>
                        <TableCell className="py-3">
                          <Badge className={`text-[10px] border ${conclusionStyle}`}>{conclusion}</Badge>
                        </TableCell>
                        <TableCell className="text-[12px] text-[#475569] py-3">{c.action}</TableCell>
                        <TableCell className="pr-4 py-3 text-right">
                          <Button variant="ghost" size="icon" className="w-7 h-7 text-[#94A3B8] hover:text-[#334155]">
                            <MoreHorizontal size={14} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Scoring explanation */}
            <div className="rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4">
              <div className="text-xs font-semibold text-[#0F172A] mb-3">三层评分体系说明</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { icon: <ArrowRightLeft size={14} className="text-[#2563EB]" />, title: '关系强度分', desc: '判断上下游交易关系是否稳定、持续、可解释。基于交易对手图谱、收付款频次与账期稳定性。' },
                  { icon: <ShieldCheck size={14} className="text-[#047857]" />, title: '经营真实性分', desc: '判断主体是否持续真实经营。基于代发工资、社保缴纳、经营性缴费、公私联动等足迹数据。' },
                  { icon: <AlertTriangle size={14} className="text-[#DC2626]" />, title: '风险排除分', desc: '判断是否存在异常。排除快进快出、异常大额对私转账、夜间异常交易、资金空转等特征。' },
                ].map((item) => (
                  <div key={item.title} className="rounded-lg bg-white border border-[#E2E8F0] p-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      {item.icon}
                      <span className="text-[12px] font-semibold text-[#0F172A]">{item.title}</span>
                    </div>
                    <p className="text-[11px] text-[#64748B] leading-5">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {active && <ActionBar />}
          </div>
        );

      // ── 关系图谱 (graph) ──────────────────────────────────────────────
      case 'graph':
        return (
          <div className="space-y-4">
            {active && <SceneHero question="谁该进入资产池、依据是什么" />}

            <RelationGraph />

            {active && <ActionBar />}
          </div>
        );

      // ── 公私联动 (linked) ─────────────────────────────────────────────
      case 'linked':
        return (
          <div className="space-y-4">
            {active && <SceneHero question="谁该进入资产池、依据是什么" />}
            <LinkedEnhanced />
            {active && <ActionBar />}
          </div>
        );

      // ── 标准小微 (standard) ───────────────────────────────────────────
      case 'standard':
        return (
          <div className="space-y-4">
            {active && <SceneHero question="谁该进入资产池、依据是什么" />}

            {/* 概览统计 — 仅规则口径 */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: '已上线规则', value: STANDARD_SEGMENTS.filter(s => s.status === 'active').length.toString(), sub: '组', color: 'text-emerald-600' },
                { label: '灰度测试中', value: STANDARD_SEGMENTS.filter(s => s.status === 'trial').length.toString(), sub: '组', color: 'text-amber-600' },
                { label: '待上线', value: STANDARD_SEGMENTS.filter(s => s.status === 'pending').length.toString(), sub: '组', color: 'text-slate-500' },
              ].map(m => (
                <div key={m.label} className="rounded-xl border border-[#E5E7EB] bg-white p-3">
                  <p className="text-[11px] text-[#94A3B8]">{m.label}</p>
                  <p className={`text-xl font-semibold mt-1 ${m.color}`}>{m.value}<span className="text-xs font-normal text-[#94A3B8] ml-0.5">{m.sub}</span></p>
                </div>
              ))}
            </div>

            {/* 客群识别规则卡片 */}
            <div className="space-y-3">
              {STANDARD_SEGMENTS.map(seg => {
                const st = SEGMENT_STATUS_MAP[seg.status];
                return (
                  <div key={seg.id} className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden">
                    {/* 头部: 规则治理信息 */}
                    <div className="px-4 py-3 flex items-center justify-between border-b border-[#F1F5F9]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: seg.color + '14', color: seg.color }}>
                          {seg.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-semibold text-[#0F172A]">{seg.name}</span>
                            <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border ${st.bg}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                              {st.label}
                            </span>
                            <span className="text-[10px] text-[#94A3B8] font-mono">{seg.id}</span>
                          </div>
                          <p className="text-[11px] text-[#94A3B8] mt-0.5">{seg.subtitle}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-[11px] text-[#94A3B8]">
                        <span>更新: {seg.updateTime}</span>
                        <Button variant="ghost" size="sm" className="h-7 text-[11px] text-[#64748B] gap-1">
                          <MoreHorizontal size={12} /> 配置
                        </Button>
                      </div>
                    </div>

                    {/* 识别规则定义 */}
                    <div className="px-4 py-3 border-b border-[#F1F5F9]">
                      <p className="text-[11px] text-[#94A3B8] mb-2">识别规则定义</p>
                      <div className="grid grid-cols-2 gap-2">
                        {seg.rules.map(r => (
                          <div key={r.label} className="flex items-start gap-2 text-[12px]">
                            <CheckCircle2 size={13} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span>
                              <span className="font-medium text-[#334155]">{r.label}</span>
                              <span className="text-[#94A3B8] ml-1">{r.detail}</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 数据来源 */}
                    <div className="px-4 py-2.5 border-b border-[#F1F5F9] flex items-center gap-1.5">
                      <span className="text-[11px] text-[#94A3B8] mr-1">数据来源</span>
                      {seg.dataSources.map(ds => (
                        <span key={ds} className="text-[10px] px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]">{ds}</span>
                      ))}
                    </div>

                    {/* 规则定义属性 */}
                    <div className="px-4 py-2.5 bg-[#FAFBFC]">
                      <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-[12px]">
                        <div>
                          <span className="text-[#94A3B8]">适用产品</span>
                          <div className="flex gap-1 mt-0.5 flex-wrap">
                            {seg.applicableProducts.map(p => (
                              <span key={p} className="text-[10px] px-1.5 py-0.5 rounded bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">{p}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-[#94A3B8]">适用客群</span>
                          <div className="mt-0.5 text-[11px] text-[#0F172A]">{seg.applicableCustomers}</div>
                        </div>
                        <div className="col-span-2 mt-1">
                          <span className="text-[#94A3B8]">排除条件</span>
                          <div className="mt-0.5 text-[11px] text-[#C2410C]">{seg.exclusions}</div>
                        </div>
                      </div>
                      <div className="mt-2 flex items-center gap-3 text-[10px] text-[#94A3B8] border-t border-[#F1F5F9] pt-2">
                        <span>覆盖 <span className="font-semibold text-[#0F172A]">{seg.coverage}</span> 户</span>
                        <span>更新 {seg.updateTime}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end">
              <Button size="sm" className="h-8 text-xs bg-[#1890FF] hover:bg-[#0F76D1] gap-1.5">
                <Plus size={12} /> 新增标准客群识别规则
              </Button>
            </div>

            {active && <ActionBar />}
          </div>
        );

      // ── 长尾场景 (long-tail) ──────────────────────────────────────────
      case 'long-tail':
        return (
          <div className="space-y-4">
            {active && <SceneHero question="谁该进入资产池、依据是什么" />}

            {/* 场景说明 */}
            <div className="rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50 to-white p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0 mt-0.5">
                  <CircleDot size={16} />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-[#0F172A]">长尾场景识别</p>
                  <p className="text-[11px] text-[#64748B] mt-1 leading-relaxed">
                    针对传统风控模型难以覆盖的末端主体，结合多源交叉验证和场景化规则识别。
                    适用于脱核链贷、个体承运商、轻资产服务商等非标准信贷场景。
                  </p>
                </div>
              </div>
            </div>

            {/* 场景客群卡片 */}
            <div className="space-y-3">
              {LONGTAIL_SCENARIOS.map(sc => {
                const st = SEGMENT_STATUS_MAP[sc.status];
                return (
                  <div key={sc.id} className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden">
                    <div className="px-4 py-3 flex items-center justify-between border-b border-[#F1F5F9]">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: sc.color + '14', color: sc.color }}>
                          {sc.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-semibold text-[#0F172A]">{sc.name}</span>
                            <span className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full border ${st.bg}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                              {st.label}
                            </span>
                            <span className="text-[10px] text-[#94A3B8] font-mono">{sc.id}</span>
                          </div>
                          <p className="text-[11px] text-[#94A3B8] mt-0.5">{sc.subtitle}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-[11px] text-[#94A3B8]">
                        <span>更新: {sc.updateTime}</span>
                        <Button variant="ghost" size="sm" className="h-7 text-[11px] text-[#64748B] gap-1">
                          <MoreHorizontal size={12} /> 配置
                        </Button>
                      </div>
                    </div>

                    <div className="px-4 py-3 border-b border-[#F1F5F9]">
                      <p className="text-[11px] text-[#94A3B8] mb-2">识别规则</p>
                      <div className="grid grid-cols-2 gap-2">
                        {sc.rules.map(r => (
                          <div key={r.label} className="flex items-start gap-2 text-[12px]">
                            <CheckCircle2 size={13} className="text-emerald-400 mt-0.5 flex-shrink-0" />
                            <span>
                              <span className="font-medium text-[#334155]">{r.label}</span>
                              <span className="text-[#94A3B8] ml-1">{r.detail}</span>
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="px-4 py-2.5 border-t border-[#F1F5F9]">
                      <div className="flex items-center gap-1.5 mb-2">
                        <span className="text-[11px] text-[#94A3B8] mr-1">数据来源</span>
                        {sc.dataSources.map(ds => (
                          <span key={ds} className="text-[10px] px-1.5 py-0.5 rounded bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]">{ds}</span>
                        ))}
                      </div>
                      <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-[12px]">
                        <div>
                          <span className="text-[#94A3B8]">适用产品</span>
                          <div className="flex gap-1 mt-0.5 flex-wrap">
                            {sc.applicableProducts.map(p => (
                              <span key={p} className="text-[10px] px-1.5 py-0.5 rounded bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">{p}</span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-[#94A3B8]">适用客群</span>
                          <div className="mt-0.5 text-[11px] text-[#0F172A]">{sc.applicableCustomers}</div>
                        </div>
                        <div className="col-span-2 mt-1">
                          <span className="text-[#94A3B8]">排除条件</span>
                          <span className="ml-2 text-[11px] text-[#C2410C]">{sc.exclusions}</span>
                        </div>
                      </div>
                      <div className="mt-2 text-[10px] text-[#94A3B8]">覆盖 <span className="font-semibold text-[#0F172A]">{sc.coverage}</span> 户 · 更新 {sc.updateTime}</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end">
              <Button size="sm" className="h-8 text-xs bg-[#1890FF] hover:bg-[#0F76D1] gap-1.5">
                <Plus size={12} /> 新增场景识别规则
              </Button>
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
