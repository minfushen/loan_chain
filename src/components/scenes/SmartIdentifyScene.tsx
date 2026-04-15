import React from 'react';
import SceneLayout from '../SceneLayout';
import { SCENES } from '../../constants';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brain,
  Cable,
  CheckCircle2,
  ChevronRight,
  Clock,
  Crosshair,
  Download,
  Eye,
  ExternalLink,
  FileCheck,
  FileCode,
  Fingerprint,
  FileSearch,
  FileSpreadsheet,
  FileText,
  Filter,
  Globe,
  Layers,
  Lightbulb,
  Link2,
  Loader2,
  Lock,
  MapPin,
  Network,
  Play,
  Plug,
  RefreshCw,
  Search,
  Send,
  Server,
  Shield,
  Sparkles,
  Star,
  TrendingUp,
  Upload,
  UserCheck,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { SAMPLES, type ChainLoanSample } from '../../demo/chainLoan/data';
import { useDemo } from '../../demo/DemoContext';
import { MetricCard, AiNote, FlowProgress, AiInsight } from '../ProductPrimitives';

/* ══════════════════════════════════════════════════════════════════
   文件导入 — 批次数据
   ══════════════════════════════════════════════════════════════════ */

type BatchStatus = '待校验' | '待修正' | '待生成样本' | '待进入识别' | '已完成';

interface ImportBatch {
  id: string;
  name: string;
  fileName: string;
  sourceType: 'Excel' | 'CSV';
  importTime: string;
  totalCount: number;
  passedCount: number;
  missingFields: number;
  formatErrors: number;
  duplicates: number;
  pendingConfirm: number;
  generatedSamples: number;
  pendingSamples: number;
  currentStep: string;
  status: BatchStatus;
  suggestedScene: string;
  nextAction: string;
  creator: string;
  // 流转时间
  validateTime?: string;
  generateTime?: string;
  identifyTime?: string;
}

const IMPORT_BATCHES: ImportBatch[] = [
  {
    id: 'IMP-20260413-001', name: '新能源链白名单_2026-04-13', fileName: '新能源链白名单_20260413.xlsx',
    sourceType: 'Excel', importTime: '2026-04-13 10:25', totalCount: 86,
    passedCount: 79, missingFields: 3, formatErrors: 2, duplicates: 1, pendingConfirm: 1,
    generatedSamples: 0, pendingSamples: 79, currentStep: '待生成样本',
    status: '待生成样本', suggestedScene: '脱核链上', nextAction: '生成样本',
    creator: '王敏', validateTime: '2026-04-13 10:27',
  },
  {
    id: 'IMP-20260413-002', name: '商圈周边小微_2026-04-13', fileName: '商圈小微名单_A区.csv',
    sourceType: 'CSV', importTime: '2026-04-13 09:40', totalCount: 120,
    passedCount: 108, missingFields: 0, formatErrors: 0, duplicates: 0, pendingConfirm: 0,
    generatedSamples: 108, pendingSamples: 0, currentStep: '待推送识别',
    status: '待进入识别', suggestedScene: '本地商圈', nextAction: '进入识别',
    creator: '李雪婷', validateTime: '2026-04-13 09:42', generateTime: '2026-04-13 09:45',
  },
  {
    id: 'IMP-20260412-003', name: '涉农经营主体_华东', fileName: '涉农经营主体_华东.xlsx',
    sourceType: 'Excel', importTime: '2026-04-12 14:18', totalCount: 152,
    passedCount: 132, missingFields: 8, formatErrors: 5, duplicates: 4, pendingConfirm: 3,
    generatedSamples: 0, pendingSamples: 0, currentStep: '字段校验异常',
    status: '待修正', suggestedScene: '涉农', nextAction: '查看问题',
    creator: '陈立', validateTime: '2026-04-12 14:20',
  },
  {
    id: 'IMP-20260412-004', name: '产业链二级供应商', fileName: '二级供应商_长三角.xlsx',
    sourceType: 'Excel', importTime: '2026-04-12 11:05', totalCount: 65,
    passedCount: 65, missingFields: 0, formatErrors: 0, duplicates: 0, pendingConfirm: 0,
    generatedSamples: 65, pendingSamples: 0, currentStep: '已完成',
    status: '已完成', suggestedScene: '脱核链上', nextAction: '查看结果',
    creator: '王敏', validateTime: '2026-04-12 11:07', generateTime: '2026-04-12 11:10', identifyTime: '2026-04-12 11:12',
  },
  {
    id: 'IMP-20260413-005', name: '物流服务商名单', fileName: '物流服务商_华东片区.xlsx',
    sourceType: 'Excel', importTime: '2026-04-13 11:02', totalCount: 48,
    passedCount: 0, missingFields: 0, formatErrors: 0, duplicates: 0, pendingConfirm: 0,
    generatedSamples: 0, pendingSamples: 0, currentStep: '字段校验',
    status: '待校验', suggestedScene: '物流服务', nextAction: '查看进度',
    creator: '张明远',
  },
];

const BATCH_STATUS_STYLE: Record<BatchStatus, string> = {
  '待校验': 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]',
  '待修正': 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]',
  '待生成样本': 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
  '待进入识别': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
  '已完成': 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]',
};

const BATCH_STATUS_DESC: Record<BatchStatus, string> = {
  '待校验': '系统正在进行字段校验、去重与主键归并',
  '待修正': '请先处理异常字段后，再进入样本生成',
  '待生成样本': '校验已通过，可按规则生成识别样本',
  '待进入识别': '样本已准备完成，可进入智能识别流程',
  '已完成': '该批次已完成接入与识别流转',
};

/* ══════════════════════════════════════════════════════════════════
   API 接入 — 数据
   ══════════════════════════════════════════════════════════════════ */

type ApiStatus = '运行中' | '失败' | '待重试' | '已完成';

interface ApiInterface {
  id: string;
  name: string;
  type: 'ESB 推送' | 'ESB 拉取';
  code: string;
  status: '已连接' | '试运行';
  lastCall: string;
  successRate: string;
  recentBatches: number;
  avgDuration: string;
  affectedModules: string[];
  exceptionCount: number;
  pendingBatches: number;
  desc: string;
}

interface ApiBatch {
  id: string;
  sourceInterface: string;
  receiveTime: string;
  totalCount: number;
  validatedCount: number;
  exceptionCount: number;
  generatedSamples: number;
  currentStep: string;
  status: ApiStatus;
  failReason?: string;
  affectedAction?: string;
  canRetry?: boolean;
}

const API_INTERFACES: ApiInterface[] = [
  {
    id: 'IF-001', name: 'ESB 名单推送接口', type: 'ESB 推送', code: 'ESB.SMIC.PUSH.001',
    status: '已连接', lastCall: '09:42', successRate: '96%', recentBatches: 12,
    avgDuration: '320ms', affectedModules: ['智能识别', '智能尽调'], exceptionCount: 1, pendingBatches: 2,
    desc: '用于接收上游系统推送的企业名单批次',
  },
  {
    id: 'IF-002', name: '企业名单拉取接口', type: 'ESB 拉取', code: 'ESB.SMIC.PULL.001',
    status: '试运行', lastCall: '08:15', successRate: '100%', recentBatches: 3,
    avgDuration: '580ms', affectedModules: ['智能识别'], exceptionCount: 0, pendingBatches: 0,
    desc: '用于按任务批次从上游系统拉取企业名单',
  },
];

const API_BATCHES: ApiBatch[] = [
  { id: 'API_BATCH_20260413_001', sourceInterface: 'ESB 推送接口', receiveTime: '2026-04-13 09:42', totalCount: 200, validatedCount: 160, exceptionCount: 12, generatedSamples: 0, currentStep: '字段映射校验', status: '运行中' },
  { id: 'API_BATCH_20260413_002', sourceInterface: 'ESB 推送接口', receiveTime: '2026-04-13 08:30', totalCount: 85, validatedCount: 85, exceptionCount: 0, generatedSamples: 85, currentStep: '待推送识别', status: '已完成' },
  { id: 'API_BATCH_20260412_003', sourceInterface: 'ESB 推送接口', receiveTime: '2026-04-12 16:20', totalCount: 150, validatedCount: 98, exceptionCount: 52, generatedSamples: 0, currentStep: '字段映射失败', status: '失败', failReason: '统一社会信用代码字段缺失率过高（34%）', affectedAction: '无法进入样本生成', canRetry: false },
  { id: 'API_BATCH_20260412_004', sourceInterface: 'ESB 拉取接口', receiveTime: '2026-04-12 14:10', totalCount: 60, validatedCount: 55, exceptionCount: 5, generatedSamples: 0, currentStep: '等待重新处理', status: '待重试', failReason: '下游外数平台超时，部分企业工商数据未返回', affectedAction: '5 户无法完成校验', canRetry: true },
];

const FIELD_MAPPINGS = [
  { upstream: 'ent_name', local: '企业名称', desc: '企业工商注册全称', required: true, transform: '直接映射', status: '正常' as const },
  { upstream: 'credit_code', local: '统一社会信用代码', desc: '18 位统一代码', required: true, transform: '格式校验 + 去空格', status: '正常' as const },
  { upstream: 'legal_name', local: '法人姓名', desc: '法定代表人姓名', required: false, transform: '直接映射', status: '正常' as const },
  { upstream: 'legal_id', local: '法人身份证号码', desc: '法人身份证', required: false, transform: 'SM4 加密存储', status: '正常' as const },
  { upstream: 'contact_phone', local: '联系电话', desc: '主要联系人电话', required: false, transform: '脱敏展示（前3后4）', status: '正常' as const },
  { upstream: 'chain_tag', local: '产业链标签', desc: '所属产业链', required: false, transform: '枚举映射（行内标签体系）', status: '正常' as const },
  { upstream: 'reg_capital', local: '注册资本', desc: '注册资本金额', required: false, transform: '统一单位（万元）', status: '告警' as const },
  { upstream: 'est_date', local: '成立日期', desc: '企业成立日期', required: false, transform: 'yyyy-MM-dd 标准化', status: '正常' as const },
  { upstream: 'recommend_reason', local: '推荐原因', desc: '推荐入池理由', required: false, transform: '直接映射', status: '正常' as const },
];

const API_BATCH_STATUS_STYLE: Record<ApiStatus, string> = {
  '运行中': 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
  '失败': 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]',
  '待重试': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
  '已完成': 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]',
};

/* ══════════════════════════════════════════════════════════════════
   智能筛选 — 推荐数据
   ══════════════════════════════════════════════════════════════════ */

type RecommendLevel = '优先推荐' | '建议关注' | '待人工确认';

interface RecommendItem {
  sampleId: string;
  level: RecommendLevel;
  scene: string;
  hitRules: string[];
  reasons: string[];
  riskHint: string;
  nextAction: string;
  suggestedPage: string;
  recommendTime: string;
  sourceBatch: string;
}

const RECOMMEND_LEVEL_STYLE: Record<RecommendLevel, { bg: string; text: string; border: string; dot: string }> = {
  '优先推荐': { bg: 'bg-[#EFF6FF]', text: 'text-[#2563EB]', border: 'border-[#BFDBFE]', dot: 'bg-[#2563EB]' },
  '建议关注': { bg: 'bg-[#FFF7ED]', text: 'text-[#C2410C]', border: 'border-[#FED7AA]', dot: 'bg-[#F59E0B]' },
  '待人工确认': { bg: 'bg-[#F8FAFC]', text: 'text-[#64748B]', border: 'border-[#E2E8F0]', dot: 'bg-[#94A3B8]' },
};

function getRecommendLevel(s: ChainLoanSample): RecommendLevel {
  // 混合路径：三流 + 抵押，最高优先级
  if (s.loanPath === 'hybrid') return '优先推荐';
  // 抵押路径：产权清晰即优先推荐，无论三流数据
  if (s.loanPath === 'collateral' && s.collateral?.propertyRisk === '清晰') return '优先推荐';
  if (s.loanPath === 'collateral' && s.collateral?.propertyRisk === '待核验') return '建议关注';
  // 信用流贷：原有三流逻辑
  if (s.agentHints.confidence >= 80 && s.evidenceCoverage >= 80) return '优先推荐';
  if (s.agentHints.confidence >= 60) return '建议关注';
  return '待人工确认';
}

// 抵押物类型优先级权重（用于排序和显示）
const COLLATERAL_PRIORITY: Record<string, number> = { '房产': 3, '设备': 2, '存货': 1, '应收账款质押': 1 };

const RECOMMEND_ITEMS: RecommendItem[] = SAMPLES.map(s => ({
  sampleId: s.id,
  level: getRecommendLevel(s),
  scene: s.productType,
  hitRules: s.loanPath === 'collateral' || s.loanPath === 'hybrid'
    ? [
        s.collateral ? `${s.collateral.type}抵押（评估 ${s.collateral.estimatedValue}）` : '',
        s.collateral ? `LTV ${Math.round(s.collateral.ltvRatio * 100)}%` : '',
        s.collateral?.propertyRisk === '清晰' ? '产权清晰无瑕疵' : '产权待核验',
        s.loanPath === 'hybrid' ? '三流数据同步验证通过' : '',
      ].filter(Boolean)
    : [
        s.orderCount90d >= 15 ? '订单稳定性通过' : '订单频次偏低',
        s.invoiceContinuityMonths >= 10 ? '开票连续性通过' : '开票连续性一般',
        s.relationStrength >= 70 ? '关系强度较高' : '关系强度待确认',
      ].filter(Boolean),
  reasons: s.loanPath === 'collateral' || s.loanPath === 'hybrid'
    ? [
        s.collateral ? `${s.collateral.type}评估价值 ${s.collateral.estimatedValue}，LTV ${Math.round(s.collateral.ltvRatio * 100)}%` : '',
        s.loanPath === 'hybrid' ? `三流数据同步良好，置信度 ${s.agentHints.confidence}%` : '三流数据不足，以抵押物为主要授信依据',
      ].filter(Boolean)
    : [
        s.orderCount90d >= 15 ? `近 90 天 ${s.orderCount90d} 笔稳定交易` : `近 90 天 ${s.orderCount90d} 笔交易，频次偏低`,
        s.relationStrength >= 70 ? `关系强度 ${s.relationStrength}%，链上位置清晰` : `关系强度 ${s.relationStrength}%，需补充验证`,
      ],
  riskHint: s.riskFlags.length > 0
    ? `存在 ${s.riskFlags.length} 项风险标识：${s.riskFlags.join('、')}`
    : '当前未发现明显风险信号',
  nextAction: s.nextAction,
  suggestedPage: (s.loanPath === 'collateral' || s.loanPath === 'hybrid') ? '智能尽调'
    : s.agentHints.confidence >= 80 ? '智能尽调'
    : s.agentHints.confidence >= 60 ? '智能筛选'
    : '人工确认',
  recommendTime: '2026-04-09 09:30',
  sourceBatch: 'BATCH-20260409-001',
}));

/* ══════════════════════════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════════════════════════ */

interface Props { activeModule: string; onModuleChange: (id: string) => void }

export default function SmartIdentifyScene({ activeModule, onModuleChange }: Props) {
  const scene = SCENES.find(s => s.id === 'smart-identify')!;

  const IDENTIFY_FLOW_STEPS = [
    { id: 'file-import', label: '名单导入', description: '文件上传与 API 接入' },
    { id: 'feed', label: '智能筛选', description: 'AI推荐与条件筛选' },
    { id: 'graph', label: '图谱验证', description: '候选资产与关系图谱' },
  ];

  // Map activeModule to flow step for progress bar
  const getFlowStepId = (mod: string) => {
    if (mod === 'file-import') return 'file-import';
    if (mod === 'feed' || mod === 'list') return 'feed';
    if (mod === 'graph' || mod === 'linked') return 'graph';
    return 'file-import';
  };

  const { navigate, selectSample } = useDemo();
  const [selectedBatch, setSelectedBatch] = React.useState<string | null>(null);
  const [drawerTab, setDrawerTab] = React.useState<'info' | 'validate' | 'sample' | 'timeline'>('info');
  const [apiSection, setApiSection] = React.useState<'overview' | 'batches' | 'mapping'>('overview');
  const [uploadState, setUploadState] = React.useState<'idle' | 'uploading' | 'done'>('idle');
  const [uploadedFileName, setUploadedFileName] = React.useState<string>('');
  const [dynamicBatches, setDynamicBatches] = React.useState<ImportBatch[]>(IMPORT_BATCHES);
  const [importTab, setImportTab] = React.useState<'upload' | 'api'>('upload');
  // CSV解析出的企业列表，用于动态生成推荐
  const [csvCompanies, setCsvCompanies] = React.useState<{ name: string; creditCode: string; legalPerson: string; capital: string; established: string; reason: string }[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [selectedRecommend, setSelectedRecommend] = React.useState<string | null>(RECOMMEND_ITEMS[0]?.sampleId ?? null);
  const [selectedFilter, setSelectedFilter] = React.useState<string | null>(SAMPLES[0]?.id ?? null);
  const [filterExpanded, setFilterExpanded] = React.useState(true);
  const [selectedCandidate, setSelectedCandidate] = React.useState<string | null>(SAMPLES[0]?.id ?? null);
  const [selectedGraphNode, setSelectedGraphNode] = React.useState<string | null>(null);
  const [hoveredGraphNode, setHoveredGraphNode] = React.useState<string | null>(null);
  const [graphView, setGraphView] = React.useState<'trade' | 'fund' | 'logistics' | 'linked'>('trade');
  const [selectedLinkedEntity, setSelectedLinkedEntity] = React.useState<string | null>(null);
  const [linkedView, setLinkedView] = React.useState<'legal' | 'controller' | 'account' | 'repayment'>('legal');
  const [csvToast, setCsvToast] = React.useState<{ count: number; visible: boolean } | null>(null);

  const renderContent = () => {
    switch (activeModule) {

      /* ═══════════════════════════════════════════════════════════
         PAGE 1: 名单导入 — 文件上传 + API接入合并页
         ═══════════════════════════════════════════════════════════ */
      case 'file-import': {
        const batch = dynamicBatches.find(b => b.id === selectedBatch);
        const statusGroups: BatchStatus[] = ['待校验', '待修正', '待生成样本', '待进入识别', '已完成'];
        const countByStatus = (s: BatchStatus) => dynamicBatches.filter(b => b.status === s);

        if (batch && selectedBatch) {
          const DRAWER_TABS = [
            { id: 'info' as const, label: '批次信息' },
            { id: 'validate' as const, label: '字段校验' },
            { id: 'sample' as const, label: '样本生成' },
            { id: 'timeline' as const, label: '流转记录' },
          ];
          return (
            <div className="space-y-4">
              <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 flex items-center gap-3">
                <button onClick={() => setSelectedBatch(null)} className="flex items-center gap-1 text-[11px] text-[#2563EB] hover:text-[#1D4ED8] transition-colors"><ArrowLeft size={12} /> 返回批次列表</button>
                <div className="w-px h-4 bg-[#E2E8F0]" />
                <span className="text-[13px] font-semibold text-[#0F172A]">{batch.name}</span>
                <Badge className={cn('text-[9px] border', BATCH_STATUS_STYLE[batch.status])}>{batch.status}</Badge>
                <div className="flex-1" />
                {batch.status === '待修正' && <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 text-[#DC2626] border-[#FCA5A5]"><Download size={10} />下载异常清单</Button>}
                {batch.status === '待生成样本' && <Button size="sm" className="h-7 text-[10px] gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white" onClick={() => {
                  setDynamicBatches(prev => prev.map(item => item.id === batch.id ? {
                    ...item,
                    status: '待进入识别' as BatchStatus,
                    currentStep: '待推送识别',
                    generatedSamples: item.passedCount,
                    pendingSamples: 0,
                    nextAction: '进入识别',
                    generateTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-').slice(0, 16),
                  } : item));
                }}><Sparkles size={10} />生成样本</Button>}
                {batch.status === '待进入识别' && <Button size="sm" className="h-7 text-[10px] gap-1 bg-[#047857] hover:bg-[#065F46] text-white" onClick={() => navigate('smart-identify', 'feed')}><ArrowRight size={10} />进入识别</Button>}
              </div>

              {/* Drawer tabs */}
              <div className="flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-1">
                {DRAWER_TABS.map(t => (
                  <button key={t.id} onClick={() => setDrawerTab(t.id)} className={cn('px-3 py-1.5 rounded-md text-[11px] font-medium transition-all', drawerTab === t.id ? 'bg-white text-[#0F172A] shadow-sm border border-[#E2E8F0]' : 'text-[#64748B] hover:text-[#334155]')}>{t.label}</button>
                ))}
              </div>

              {/* Hints */}
              {batch.status === '待修正' && <div className="rounded-lg border border-[#FCA5A5] bg-[#FEF2F2] px-3 py-2 text-[11px] text-[#DC2626] flex items-center gap-2"><AlertCircle size={12} />存在必填字段缺失，请修正后再继续。</div>}
              {batch.status === '待生成样本' && <div className="rounded-lg border border-[#A7F3D0] bg-[#ECFDF3] px-3 py-2 text-[11px] text-[#047857] flex items-center gap-2"><CheckCircle2 size={12} />该批次已完成基础校验，建议继续生成样本。</div>}
              {batch.status === '待进入识别' && <div className="rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-2 text-[11px] text-[#2563EB] flex items-center gap-2"><Sparkles size={12} />样本生成完成后，可直接进入智能识别。</div>}

              {drawerTab === 'info' && (
                <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 space-y-3">
                  <div className="text-[12px] font-semibold text-[#0F172A] flex items-center gap-2"><FileText size={13} className="text-[#2563EB]" /> 批次信息</div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { label: '批次名称', value: batch.name },
                      { label: '文件名', value: uploadedFileName || batch.fileName },
                      { label: '来源类型', value: batch.sourceType },
                      { label: '导入时间', value: batch.importTime },
                      { label: '企业总数', value: `${batch.totalCount} 户` },
                      { label: '创建人', value: batch.creator },
                    ].map(f => (
                      <div key={f.label} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5">
                        <div className="text-[10px] text-[#94A3B8]">{f.label}</div>
                        <div className="text-[12px] font-medium text-[#0F172A] mt-0.5">{f.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {drawerTab === 'validate' && (
                <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 space-y-3">
                  <div className="text-[12px] font-semibold text-[#0F172A] flex items-center gap-2"><CheckCircle2 size={13} className="text-[#047857]" /> 字段校验</div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    <div className="rounded-lg border border-[#A7F3D0] bg-[#ECFDF3] px-3 py-2.5 text-center"><div className="text-[10px] text-[#047857]">通过校验</div><div className="text-lg font-bold text-[#047857]">{batch.passedCount}</div></div>
                    <div className={cn('rounded-lg border px-3 py-2.5 text-center', batch.missingFields > 0 ? 'border-[#FCA5A5] bg-[#FEF2F2]' : 'border-[#E2E8F0] bg-[#F8FAFC]')}><div className="text-[10px] text-[#64748B]">缺失字段</div><div className={cn('text-lg font-bold', batch.missingFields > 0 ? 'text-[#DC2626]' : 'text-[#64748B]')}>{batch.missingFields}</div></div>
                    <div className={cn('rounded-lg border px-3 py-2.5 text-center', batch.formatErrors > 0 ? 'border-[#FCA5A5] bg-[#FEF2F2]' : 'border-[#E2E8F0] bg-[#F8FAFC]')}><div className="text-[10px] text-[#64748B]">格式错误</div><div className={cn('text-lg font-bold', batch.formatErrors > 0 ? 'text-[#DC2626]' : 'text-[#64748B]')}>{batch.formatErrors}</div></div>
                    <div className={cn('rounded-lg border px-3 py-2.5 text-center', batch.duplicates > 0 ? 'border-[#FED7AA] bg-[#FFF7ED]' : 'border-[#E2E8F0] bg-[#F8FAFC]')}><div className="text-[10px] text-[#64748B]">重复企业</div><div className={cn('text-lg font-bold', batch.duplicates > 0 ? 'text-[#C2410C]' : 'text-[#64748B]')}>{batch.duplicates}</div></div>
                    <div className={cn('rounded-lg border px-3 py-2.5 text-center', batch.pendingConfirm > 0 ? 'border-[#FED7AA] bg-[#FFF7ED]' : 'border-[#E2E8F0] bg-[#F8FAFC]')}><div className="text-[10px] text-[#64748B]">待人工确认</div><div className={cn('text-lg font-bold', batch.pendingConfirm > 0 ? 'text-[#C2410C]' : 'text-[#64748B]')}>{batch.pendingConfirm}</div></div>
                  </div>
                  <div className="text-[10px] text-[#94A3B8]">必填字段通过率: {batch.totalCount > 0 ? Math.round(batch.passedCount / batch.totalCount * 100) : 0}%</div>
                </div>
              )}

              {drawerTab === 'sample' && (
                <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 space-y-3">
                  <div className="text-[12px] font-semibold text-[#0F172A] flex items-center gap-2"><Sparkles size={13} className="text-[#7C3AED]" /> 样本生成</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5"><div className="text-[10px] text-[#94A3B8]">已生成样本</div><div className="text-lg font-bold text-[#0F172A]">{batch.generatedSamples}</div></div>
                    <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5"><div className="text-[10px] text-[#94A3B8]">待生成样本</div><div className="text-lg font-bold text-[#0F172A]">{batch.pendingSamples}</div></div>
                    <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5"><div className="text-[10px] text-[#94A3B8]">建议场景</div><div className="text-[12px] font-medium text-[#0F172A] mt-1">{batch.suggestedScene}</div></div>
                    <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5"><div className="text-[10px] text-[#94A3B8]">下一步动作</div><div className="text-[12px] font-medium text-[#2563EB] mt-1">{batch.nextAction}</div></div>
                  </div>
                </div>
              )}

              {drawerTab === 'timeline' && (
                <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 space-y-3">
                  <div className="text-[12px] font-semibold text-[#0F172A] flex items-center gap-2"><Clock size={13} className="text-[#2563EB]" /> 流转记录</div>
                  <div className="space-y-2">
                    {[
                      { label: '导入完成', time: batch.importTime, done: true },
                      { label: '校验完成', time: batch.validateTime, done: !!batch.validateTime },
                      { label: '样本生成', time: batch.generateTime, done: !!batch.generateTime },
                      { label: '进入识别', time: batch.identifyTime, done: !!batch.identifyTime },
                    ].map((ev, idx, arr) => (
                      <div key={ev.label} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div className={cn('w-5 h-5 rounded-full flex items-center justify-center text-[9px]', ev.done ? 'bg-[#047857] text-white' : 'bg-[#E2E8F0] text-[#94A3B8]')}>{ev.done ? <CheckCircle2 size={10} /> : idx + 1}</div>
                          {idx < arr.length - 1 && <div className="w-px h-5 bg-[#E2E8F0] mt-1" />}
                        </div>
                        <div>
                          <div className="text-[11px] font-medium text-[#0F172A]">{ev.label}</div>
                          <div className="text-[10px] text-[#94A3B8]">{ev.time || '—'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        }

        return (
          <div className="space-y-4">
            {/* 顶部 Tab：文件上传 | API接入 */}
            <div className="flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-1 w-fit">
              {[
                { id: 'upload' as const, label: '文件上传', icon: Upload },
                { id: 'api' as const, label: 'API 接入', icon: Plug },
              ].map(t => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setImportTab(t.id)}
                    className={cn(
                      'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-medium transition-all',
                      importTab === t.id
                        ? 'bg-white text-[#0F172A] shadow-sm border border-[#E2E8F0]'
                        : 'text-[#64748B] hover:text-[#334155]',
                    )}
                  >
                    <Icon size={10} />{t.label}
                  </button>
                );
              })}
            </div>

            {/* ── API 接入 Tab ── */}
            {importTab === 'api' && (
              <div className="space-y-3">
                <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F3E8FF] flex items-center justify-center"><Plug size={15} className="text-[#7C3AED]" /></div>
                    <div>
                      <h3 className="text-sm font-semibold text-[#0F172A]">API 接入</h3>
                      <p className="text-[11px] text-[#94A3B8]">通过行内 ESB 总线接入企业名单批次，管理接口状态与运行结果。</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 text-[#64748B] border-[#E2E8F0]"><BookOpen size={10} />接口文档</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 text-[#2563EB] border-[#BFDBFE]"><Play size={10} />发起测试</Button>
                  </div>
                </div>

                {/* 接口状态卡片 */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { name: 'CRM客群推送接口', code: 'ESB-CRM-001', status: '已连接' as const, lastCall: '10分钟前', successRate: '99.2%', desc: '从CRM系统推送目标客群名单', color: 'text-[#047857]', bg: 'bg-[#ECFDF3]', border: 'border-[#A7F3D0]' },
                    { name: '核心企业供应链接口', code: 'ESB-SCM-002', status: '已连接' as const, lastCall: '2小时前', successRate: '97.8%', desc: '从供应链管理系统拉取供应商名单', color: 'text-[#047857]', bg: 'bg-[#ECFDF3]', border: 'border-[#A7F3D0]' },
                    { name: '外部数据平台接口', code: 'ESB-EXT-003', status: '配额不足' as const, lastCall: '昨天', successRate: '94.1%', desc: '从外部数据平台获取企业线索', color: 'text-[#C2410C]', bg: 'bg-[#FFF7ED]', border: 'border-[#FED7AA]' },
                  ].map(intf => (
                    <div key={intf.code} className={cn('rounded-lg border p-3 space-y-2', intf.border, intf.bg)}>
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-semibold text-[#0F172A]">{intf.name}</span>
                        <Badge className={cn('text-[9px] border', intf.bg, intf.color, intf.border)}>{intf.status}</Badge>
                      </div>
                      <p className="text-[10px] text-[#64748B]">{intf.desc}</p>
                      <div className="flex items-center justify-between text-[10px] text-[#94A3B8]">
                        <span>编码: <code className="font-mono">{intf.code}</code></span>
                        <span>成功率 <b className={intf.color}>{intf.successRate}</b></span>
                      </div>
                      <div className="text-[10px] text-[#94A3B8]">最近调用: {intf.lastCall}</div>
                    </div>
                  ))}
                </div>

                {/* 近期批次 */}
                <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-[#F1F5F9] bg-[#F8FAFC] flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#0F172A]">近期接入批次</span>
                    <span className="text-[10px] text-[#94A3B8]">最近7天</span>
                  </div>
                  {[
                    { id: 'API-20260413-001', source: 'CRM客群推送接口', time: '2026-04-13 08:30', count: 43, passed: 41, status: '已完成', statusColor: 'text-[#047857]', statusBg: 'bg-[#ECFDF3] border-[#A7F3D0]' },
                    { id: 'API-20260412-002', source: '核心企业供应链接口', time: '2026-04-12 16:15', count: 28, passed: 26, status: '已完成', statusColor: 'text-[#047857]', statusBg: 'bg-[#ECFDF3] border-[#A7F3D0]' },
                    { id: 'API-20260411-003', source: 'CRM客群推送接口', time: '2026-04-11 10:42', count: 67, passed: 62, status: '已完成', statusColor: 'text-[#047857]', statusBg: 'bg-[#ECFDF3] border-[#A7F3D0]' },
                    { id: 'API-20260410-004', source: '外部数据平台接口', time: '2026-04-10 14:20', count: 15, passed: 0, status: '配额超限', statusColor: 'text-[#C2410C]', statusBg: 'bg-[#FFF7ED] border-[#FED7AA]' },
                  ].map(b => (
                    <div key={b.id} className="px-4 py-3 border-b border-[#F1F5F9] last:border-b-0 flex items-center gap-3 hover:bg-[#FAFBFF] transition-colors">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <code className="text-[11px] font-mono font-semibold text-[#0F172A]">{b.id}</code>
                          <Badge className={cn('text-[9px] border', b.statusBg, b.statusColor)}>{b.status}</Badge>
                        </div>
                        <div className="text-[10px] text-[#94A3B8] mt-0.5">{b.source} · {b.time}</div>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] text-[#64748B] shrink-0">
                        <span>接收 <b className="text-[#0F172A]">{b.count}</b> 户</span>
                        {b.passed > 0 && <span>通过 <b className="text-[#047857]">{b.passed}</b> 户</span>}
                      </div>
                      <Button variant="outline" size="sm" className="h-6 text-[9px] px-2 text-[#64748B] border-[#E2E8F0] shrink-0">查看详情</Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── 文件上传 Tab ── */}
            {importTab === 'upload' && (<>
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center"><Upload size={15} className="text-[#2563EB]" /></div>
                <div>
                  <h3 className="text-sm font-semibold text-[#0F172A]">文件导入</h3>
                  <p className="text-[11px] text-[#94A3B8]">通过 Excel / CSV 导入企业名单，完成批次校验、异常修正与样本生成。</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {/* 隐藏的文件选择器，只接受 CSV/Excel */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setUploadedFileName(file.name);
                    setUploadState('uploading');
                    e.target.value = '';

                    // 解析文件内容，动态生成批次信息
                    const reader = new FileReader();
                    reader.onload = (evt) => {
                      const text = evt.target?.result as string ?? '';
                      const lines = text.split('\n').filter(l => l.trim());
                      const dataRows = lines.length > 1 ? lines.length - 1 : 0; // 减去表头
                      const isCSV = file.name.endsWith('.csv');
                      const now = new Date();
                      const pad = (n: number) => String(n).padStart(2, '0');
                      const importTime = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}`;
                      const batchName = file.name.replace(/\.(csv|xlsx|xls)$/i, '').replace(/_/g, ' ');
                      const missingFields = Math.min(3, Math.floor(dataRows * 0.03));
                      const formatErrors = Math.min(2, Math.floor(dataRows * 0.02));
                      const duplicates = Math.min(1, Math.floor(dataRows * 0.01));
                      const passedCount = dataRows - missingFields - formatErrors;

                      // 解析CSV企业列表（跳过表头），用于智能筛选动态推荐
                      if (isCSV && lines.length > 1) {
                        // 清除 BOM 及首行多余空白
                        const rawHeader = lines[0].replace(/^\uFEFF/, '').split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
                        // 模糊匹配列索引，支持常见变体
                        const findCol = (keywords: string[]) =>
                          rawHeader.findIndex(h => keywords.some(k => h.includes(k)));
                        const nameIdx    = findCol(['企业名称', '公司名称', '单位名称', '名称']);
                        const codeIdx    = findCol(['统一社会信用代码', '信用代码', '社会信用代码', '注册号']);
                        const legalIdx   = findCol(['法人姓名', '法定代表人', '法人代表', '法人']);
                        const capitalIdx = findCol(['注册资本', '资本', '注册资金']);
                        const dateIdx    = findCol(['成立日期', '注册日期', '成立时间', '注册时间']);
                        const reasonIdx  = findCol(['推荐原因', '原因', '备注', '说明']);
                        const parsed = lines.slice(1).map(line => {
                          // 简单处理带引号的字段（如字段内含逗号）
                          const cols = line.split(',').map(c => c.trim().replace(/^["']|["']$/g, ''));
                          return {
                            name:        nameIdx    >= 0 ? (cols[nameIdx]    ?? '') : '',
                            creditCode:  codeIdx    >= 0 ? (cols[codeIdx]    ?? '') : '',
                            legalPerson: legalIdx   >= 0 ? (cols[legalIdx]   ?? '') : '',
                            capital:     capitalIdx >= 0 ? (cols[capitalIdx] ?? '') : '',
                            established: dateIdx    >= 0 ? (cols[dateIdx]    ?? '') : '',
                            reason:      reasonIdx  >= 0 ? (cols[reasonIdx]  ?? '') : '',
                          };
                        }).filter(r => r.name);
                        setCsvCompanies(parsed);
                        // 显示解析结果 toast
                        setCsvToast({ count: parsed.length, visible: true });
                        setTimeout(() => setCsvToast(null), 4000);
                        // 导入后将推荐选中项重置到第一条
                        if (parsed.length > 0) {
                          setSelectedRecommend(`csv-0`);
                        }
                      }

                      // 动态更新批次数据
                      const dynamicBatch: ImportBatch = {
                        id: 'IMP-20260413-001',
                        name: batchName,
                        fileName: file.name,
                        sourceType: isCSV ? 'CSV' : 'Excel',
                        importTime,
                        totalCount: dataRows,
                        passedCount,
                        missingFields,
                        formatErrors,
                        duplicates,
                        pendingConfirm: missingFields > 0 ? 1 : 0,
                        generatedSamples: 0,
                        pendingSamples: passedCount,
                        currentStep: '待生成样本',
                        status: '待生成样本',
                        suggestedScene: file.name.includes('新能源') ? '脱核链上' : file.name.includes('商圈') ? '本地商圈' : '通用',
                        nextAction: '生成样本',
                        creator: '王敏',
                        validateTime: importTime,
                      };
                      // 写回到 dynamicBatches[0]
                      setDynamicBatches(prev => {
                        const next = [...prev];
                        next[0] = dynamicBatch;
                        return next;
                      });

                      setTimeout(() => {
                        setUploadState('done');
                        setSelectedBatch('IMP-20260413-001');
                        setDrawerTab('info');
                      }, 800);
                    };
                    reader.readAsText(file, 'utf-8');
                  }}
                />
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 text-[#64748B] border-[#E2E8F0]"><FileText size={10} />查看字段要求</Button>
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 text-[#64748B] border-[#E2E8F0]"><Download size={10} />下载模板</Button>
                <Button
                  size="sm"
                  disabled={uploadState === 'uploading'}
                  className={cn('h-7 text-[10px] gap-1 text-white transition-all min-w-[88px]',
                    uploadState === 'done' ? 'bg-[#047857] hover:bg-[#065F46]' :
                    uploadState === 'uploading' ? 'bg-[#2563EB] opacity-80 cursor-not-allowed' :
                    'bg-[#2563EB] hover:bg-[#1D4ED8]'
                  )}
                  onClick={() => {
                    if (uploadState === 'idle') fileInputRef.current?.click();
                    else if (uploadState === 'done') {
                      // 允许重新上传
                      setUploadState('idle');
                      setUploadedFileName('');
                      setTimeout(() => fileInputRef.current?.click(), 50);
                    }
                  }}
                >
                  {uploadState === 'idle' && <><Upload size={10} />上传文件</>}
                  {uploadState === 'uploading' && <><RefreshCw size={10} className="animate-spin" />处理中…</>}
                  {uploadState === 'done' && <><CheckCircle2 size={10} />上传成功</>}
                </Button>
              </div>
            </div>

            {/* Overview cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {statusGroups.map(s => {
                const batches = countByStatus(s);
                const totalEnterprises = batches.reduce((sum, b) => sum + b.totalCount, 0);
                return (
                  <div key={s} className={cn('rounded-lg border px-3 py-3', BATCH_STATUS_STYLE[s])}>
                    <div className="text-[10px] font-medium">{s}</div>
                    <div className="text-xl font-bold mt-1">{batches.length} <span className="text-[10px] font-normal opacity-70">批次</span></div>
                    <div className="text-[10px] opacity-70 mt-0.5">{totalEnterprises} 户企业</div>
                  </div>
                );
              })}
            </div>

            {/* Batch groups */}
            {statusGroups.map(s => {
              const batches = countByStatus(s);
              if (batches.length === 0) return null;
              return (
                <div key={s} className="space-y-2">
                  <div className="flex items-center gap-2 px-1">
                    <span className="text-[12px] font-semibold text-[#0F172A]">{s}</span>
                    <span className="text-[10px] text-[#94A3B8]">{BATCH_STATUS_DESC[s]}</span>
                  </div>
                  <div className="space-y-2">
                    {batches.map(b => (
                      <div key={b.id} className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-3 hover:border-[#BFDBFE] hover:shadow-sm transition-all">
                        <div className="flex items-center gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[13px] font-semibold text-[#0F172A]">{b.name}</span>
                              <Badge className={cn('text-[9px] border', BATCH_STATUS_STYLE[b.status])}>{b.status}</Badge>
                            </div>
                            <div className="text-[10px] text-[#94A3B8] mt-0.5">{b.sourceType} · {b.totalCount} 户 · {b.importTime.split(' ')[1]} 导入</div>
                          </div>
                          <div className="flex items-center gap-3 text-[10px] text-[#64748B] shrink-0">
                            <span>通过 <b className="text-[#047857]">{b.passedCount}</b></span>
                            {(b.missingFields + b.formatErrors) > 0 && <span>异常 <b className="text-[#DC2626]">{b.missingFields + b.formatErrors}</b></span>}
                            {b.pendingConfirm > 0 && <span>待确认 <b className="text-[#C2410C]">{b.pendingConfirm}</b></span>}
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            {b.status === '待校验' && <Button variant="outline" size="sm" className="h-6 text-[10px] px-2 gap-1 text-[#64748B] border-[#E2E8F0]" onClick={() => { setSelectedBatch(b.id); setDrawerTab('validate'); }}><Eye size={9} />查看进度</Button>}
                            {b.status === '待修正' && <>
                              <Button variant="outline" size="sm" className="h-6 text-[10px] px-2 gap-1 text-[#DC2626] border-[#FCA5A5]" onClick={() => { setSelectedBatch(b.id); setDrawerTab('validate'); }}><AlertCircle size={9} />查看问题</Button>
                              <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2 gap-1 text-[#64748B]"><Download size={9} />下载异常清单</Button>
                            </>}
                            {b.status === '待生成样本' && <Button size="sm" className="h-6 text-[10px] px-2 gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white" onClick={() => {
                              setDynamicBatches(prev => prev.map(item => item.id === b.id ? {
                                ...item,
                                status: '待进入识别' as BatchStatus,
                                currentStep: '待推送识别',
                                generatedSamples: item.passedCount,
                                pendingSamples: 0,
                                nextAction: '进入识别',
                                generateTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-').slice(0, 16),
                              } : item));
                            }}><Sparkles size={9} />生成样本</Button>}
                            {b.status === '待进入识别' && <>
                              <Button variant="outline" size="sm" className="h-6 text-[10px] px-2 gap-1 text-[#2563EB] border-[#BFDBFE]" onClick={() => { setSelectedBatch(b.id); setDrawerTab('sample'); }}><Eye size={9} />查看样本</Button>
                              <Button size="sm" className="h-6 text-[10px] px-2 gap-1 bg-[#047857] hover:bg-[#065F46] text-white" onClick={() => navigate('smart-identify', 'feed')}><ArrowRight size={9} />进入识别</Button>
                            </>}
                            {b.status === '已完成' && <Button variant="outline" size="sm" className="h-6 text-[10px] px-2 gap-1 text-[#047857] border-[#A7F3D0]" onClick={() => { setSelectedBatch(b.id); setDrawerTab('info'); }}><CheckCircle2 size={9} />查看结果</Button>}
                          </div>
                        </div>
                        <div className="text-[10px] text-[#94A3B8] mt-1.5">当前步骤：{b.currentStep}</div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </>)}
          </div>
        );
      }

      /* ═══════════════════════════════════════════════════════════
         PAGE 2: API 接入 — 已合并至名单导入，重定向
         ═══════════════════════════════════════════════════════════ */
      case 'api-access':
        return null; // 已合并至 file-import，constants.ts 中已移除此菜单

      /* ═══════════════════════════════════════════════════════════
         PAGE 3: 智能筛选 — 推荐流 + 条件筛选合并页
         ═══════════════════════════════════════════════════════════ */
      case 'filter-flow': // 已合并至 feed，保留 case 做兼容跳转
      case 'feed': {
        const levels: RecommendLevel[] = ['优先推荐', '建议关注', '待人工确认'];

        // 如果有CSV导入数据，动态生成推荐列表；否则用默认5个样本
        const dynamicRecommendItems: RecommendItem[] = csvCompanies.length > 0
          ? csvCompanies.map((c, i) => {
              // 根据推荐原因和注册资本简单推断置信度
              const capital = parseFloat(c.capital) || 0;
              const yearsSince = c.established
                ? Math.max(0, new Date().getFullYear() - parseInt(c.established.slice(0, 4)))
                : 0;
              const hasRisk = c.reason.includes('风险') || c.reason.includes('逾期') || c.reason.includes('异常') || c.reason.includes('排除');
              const isStrong = c.reason.includes('稳定') || c.reason.includes('清晰') || c.reason.includes('通过') || capital >= 800;
              const isWeak = c.reason.includes('不足') || c.reason.includes('待补充') || c.reason.includes('偏低') || yearsSince < 2;
              const confidence = hasRisk ? 35 : isStrong ? 85 : isWeak ? 48 : 65;
              const level: RecommendLevel = hasRisk ? '待人工确认' : confidence >= 80 ? '优先推荐' : confidence >= 60 ? '建议关注' : '待人工确认';
              // 识别抵押物关键词，判断贷款路径
              const hasCollateral = c.reason.includes('房产') || c.reason.includes('厂房') || c.reason.includes('设备') || c.reason.includes('抵押') || c.reason.includes('存货质押');
              const hasGoodFlow = isStrong && !isWeak;
              const csvLoanPath = hasCollateral && hasGoodFlow ? 'hybrid' : hasCollateral ? 'collateral' : 'credit_flow';
              // 抵押路径置信度直接拉高
              const finalConfidence = csvLoanPath === 'hybrid' ? 95 : csvLoanPath === 'collateral' ? 88 : confidence;
              const finalLevel: RecommendLevel = csvLoanPath !== 'credit_flow' ? '优先推荐' : (hasRisk ? '待人工确认' : confidence >= 80 ? '优先推荐' : confidence >= 60 ? '建议关注' : '待人工确认');
              // 用CSV里的企业名匹配已有样本（前5条对应样本）
              const matchedSample = SAMPLES.find(s => s.companyName === c.name);
              const sampleId = matchedSample?.id ?? `csv-${i}`;
              return {
                sampleId,
                level: finalLevel,
                scene: csvLoanPath !== 'credit_flow' ? (csvLoanPath === 'hybrid' ? '抵押+流贷混合' : '抵押贷款') : (capital >= 500 ? '订单微贷' : '税票贷'),
                hitRules: csvLoanPath !== 'credit_flow'
                  ? [
                      c.reason.includes('房产') || c.reason.includes('厂房') ? '房产抵押（优先级最高）' : c.reason.includes('设备') ? '设备抵押' : '存货/质押',
                      csvLoanPath === 'hybrid' ? '三流数据同步验证通过' : '三流数据不足，以抵押物为主',
                      '产权待核验',
                    ].filter(Boolean)
                  : [
                      isStrong ? '订单稳定性通过' : '订单频次待核实',
                      yearsSince >= 3 ? '开票连续性通过' : '开票连续性待核实',
                      capital >= 300 ? '注册资本达标' : '注册资本偏低',
                    ].filter(Boolean),
                reasons: csvLoanPath !== 'credit_flow'
                  ? [
                      `${c.reason.slice(0, 30)}`,
                      csvLoanPath === 'hybrid' ? `三流数据良好，置信度 ${finalConfidence}%` : '三流数据薄弱，抵押物为主要授信依据',
                    ]
                  : [
                      c.reason.slice(0, 30) || `注册资本${c.capital}万，成立${yearsSince}年`,
                      `法人：${c.legalPerson}`,
                    ],
                riskHint: hasRisk ? `推荐原因含风险提示：${c.reason.slice(0, 40)}` : '当前未发现明显风险信号',
                nextAction: csvLoanPath !== 'credit_flow' ? '核验抵押物产权' : (hasRisk ? '人工确认' : finalConfidence >= 80 ? '进入尽调' : '补充材料后推进'),
                suggestedPage: csvLoanPath !== 'credit_flow' ? '智能尽调' : (finalConfidence >= 80 ? '智能尽调' : finalConfidence >= 60 ? '智能筛选' : '人工确认'),
                recommendTime: new Date().toLocaleString('zh-CN', { hour12: false }).replace(/\//g, '-').slice(0, 16),
                sourceBatch: dynamicBatches[0]?.id ?? 'BATCH-001',
              } as RecommendItem;
            })
          : RECOMMEND_ITEMS;

        const activeRecommendItems = dynamicRecommendItems;
        const currentItem = activeRecommendItems.find(r => r.sampleId === selectedRecommend)
          ?? activeRecommendItems[0];
        const currentSampleForFeed = SAMPLES.find(s => s.id === currentItem?.sampleId) ?? SAMPLES[0];

        const overviewCards = [
          { label: '今日新增推荐', value: activeRecommendItems.length, desc: '系统今日新识别出的推荐企业', icon: Sparkles, color: 'text-[#2563EB]' },
          { label: '高置信度推荐', value: activeRecommendItems.filter(r => r.level === '优先推荐').length, desc: '关系与证据覆盖较强，建议优先处理', icon: Star, color: 'text-[#F59E0B]' },
          { label: '待进入筛选', value: activeRecommendItems.filter(r => r.suggestedPage === '智能筛选').length, desc: '推荐已生成，待进一步筛选确认', icon: Filter, color: 'text-[#7C3AED]' },
          { label: '待进入尽调', value: activeRecommendItems.filter(r => r.suggestedPage === '智能尽调').length, desc: '已具备基础条件，可推进尽调作业', icon: FileSearch, color: 'text-[#047857]' },
          { label: '待人工确认', value: activeRecommendItems.filter(r => r.level === '待人工确认').length, desc: '存在边界情况，建议人工补充判断', icon: UserCheck, color: 'text-[#64748B]' },
        ];

        return (
          <div className="space-y-4">
            {/* AI Insight replacing KPI cards */}
            <AiInsight
              message={`今日新增 ${activeRecommendItems.length} 条推荐，其中 ${activeRecommendItems.filter(r => r.level === '优先推荐').length} 条高置信度可优先处理，${activeRecommendItems.filter(r => r.suggestedPage === '智能尽调').length} 条已具备进入尽调条件。`}
              tone="info"
              action={
                <div className="flex items-center gap-1.5">
                  <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1"><RefreshCw size={9} />刷新</Button>
                  <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1" onClick={() => { selectSample('sample-hengyuan'); navigate('smart-due-diligence', 'material'); }}><FileSearch size={9} />进入尽调</Button>
                </div>
              }
            />

            {/* Three-column layout */}
            <div className="grid grid-cols-[280px_1fr] gap-3" style={{ minHeight: 520 }}>

              {/* LEFT: Recommendation list grouped by level */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-3 py-2.5 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                  <span className="text-[11px] font-semibold text-[#0F172A]">推荐流</span>
                  <span className="text-[9px] text-[#94A3B8] ml-2">{activeRecommendItems.length} 家企业</span>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {levels.map(level => {
                    const items = activeRecommendItems.filter(r => r.level === level);
                    if (items.length === 0) return null;
                    const ls = RECOMMEND_LEVEL_STYLE[level];
                    return (
                      <div key={level}>
                        <div className="px-3 py-1.5 bg-[#FAFBFF] border-b border-[#F1F5F9] flex items-center gap-1.5">
                          <div className={cn('w-1.5 h-1.5 rounded-full', ls.dot)} />
                          <span className={cn('text-[10px] font-semibold', ls.text)}>{level}</span>
                          <span className="text-[9px] text-[#94A3B8]">{items.length}</span>
                        </div>
                        {items.map(item => {
                          // 优先匹配已有样本，否则用CSV数据构造显示
                          const sample = SAMPLES.find(s => s.id === item.sampleId);
                          const csvIdx = item.sampleId.startsWith('csv-') ? parseInt(item.sampleId.replace('csv-', '')) : -1;
                          const csvEntry = csvIdx >= 0 ? csvCompanies[csvIdx] : undefined;
                          const displayName = sample?.shortName ?? (csvEntry?.name.slice(0, 8) ?? item.sampleId);
                          const displayRole = sample?.roleInChain ?? '产业链企业';
                          const displayChain = sample?.chainName ?? (csvEntry ? '导入名单' : '新能源电池产业链');
                          const displayConfidence = sample?.agentHints.confidence ??
                            (item.level === '优先推荐' ? 87 : item.level === '建议关注' ? 65 : 42);
                          const loanPath = sample?.loanPath ?? 'credit_flow';
                          const isActive = selectedRecommend === item.sampleId;
                          // loanPath 标签样式
                          const loanPathTag = loanPath === 'hybrid'
                            ? { label: '混合贷 ★', cls: 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]' }
                            : loanPath === 'collateral'
                            ? { label: '抵押贷', cls: 'bg-[#F0FDF4] text-[#047857] border-[#A7F3D0]' }
                            : null;
                          return (
                            <div
                              key={item.sampleId}
                              onClick={() => setSelectedRecommend(item.sampleId)}
                              className={cn(
                                'px-3 py-2.5 border-b border-[#F1F5F9] cursor-pointer transition-all',
                                isActive ? 'bg-[#EFF6FF] border-l-2 border-l-[#2563EB]' : 'hover:bg-[#FAFBFF]',
                              )}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[12px] font-semibold text-[#0F172A] truncate">{displayName}</span>
                                <div className="flex items-center gap-1">
                                  {loanPathTag && (
                                    <span className={cn('text-[8px] px-1.5 py-0.5 rounded border font-medium', loanPathTag.cls)}>{loanPathTag.label}</span>
                                  )}
                                  <Badge className={cn('text-[8px] border', ls.bg, ls.text, ls.border)}>{level}</Badge>
                                </div>
                              </div>
                              <div className="text-[9px] text-[#64748B] mb-1.5">{displayRole} · {displayChain}</div>
                              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                                {item.hitRules.slice(0, 2).map(r => (
                                  <span key={r} className={cn(
                                    'text-[8px] px-1.5 py-0.5 rounded border',
                                    r.includes('通过') || r.includes('较高') ? 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]' : 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
                                  )}>{r}</span>
                                ))}
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                  <span className="text-[9px] text-[#94A3B8]">置信度</span>
                                  <div className="w-12 h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden">
                                    <div className="h-full rounded-full bg-[#2563EB]" style={{ width: `${displayConfidence}%` }} />
                                  </div>
                                  <span className="text-[9px] font-medium text-[#0F172A]">{displayConfidence}%</span>
                                </div>
                                <span className="text-[8px] text-[#CBD5E1]">{item.recommendTime.split(' ')[1]}</span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* CENTER: Current recommendation detail */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                {currentSampleForFeed && currentItem ? (
                  <>
                    <div className="px-4 py-3 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-semibold text-[#0F172A]">当前推荐详情</span>
                        <div className="flex items-center gap-1.5">
                          <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]" onClick={() => navigate('smart-identify', 'graph')}><Network size={9} />关系图谱</Button>
                          <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]" onClick={() => navigate('smart-identify', 'linked')}><Link2 size={9} />公私联动</Button>
                          <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]" onClick={() => navigate('smart-identify', 'list')}><Layers size={9} />候选资产</Button>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {/* Entity info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[15px] font-bold text-[#0F172A]">{currentSampleForFeed.companyName}</span>
                          <Badge className={cn('text-[9px] border', RECOMMEND_LEVEL_STYLE[currentItem.level].bg, RECOMMEND_LEVEL_STYLE[currentItem.level].text, RECOMMEND_LEVEL_STYLE[currentItem.level].border)}>{currentItem.level}</Badge>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-[#64748B]">
                          <span>{currentSampleForFeed.roleInChain}</span>
                          <span className="text-[#CBD5E1]">·</span>
                          <span>{currentSampleForFeed.chainName}</span>
                          <span className="text-[#CBD5E1]">·</span>
                          <span>年销售 {currentSampleForFeed.annualSales}</span>
                          <span className="text-[#CBD5E1]">·</span>
                          <span>{currentSampleForFeed.productType}</span>
                        </div>
                      </div>

                      {/* Identification judgment */}
                      <div className="rounded-lg border border-[#E2E8F0] p-3 space-y-2">
                        <div className="text-[11px] font-semibold text-[#0F172A] flex items-center gap-1.5">
                          <Brain size={12} className="text-[#7C3AED]" />识别判断
                          {currentSampleForFeed.loanPath !== 'credit_flow' && (
                            <span className={cn('ml-auto text-[9px] px-2 py-0.5 rounded border font-medium',
                              currentSampleForFeed.loanPath === 'hybrid'
                                ? 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]'
                                : 'bg-[#F0FDF4] text-[#047857] border-[#A7F3D0]'
                            )}>
                              {currentSampleForFeed.loanPath === 'hybrid' ? '混合贷款路径 ★ 最高优先级' : '抵押贷款路径'}
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-[#64748B]">识别结论</span>
                            <span className="font-medium text-[#0F172A]">{currentSampleForFeed.segmentTag}</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-[#64748B]">推荐场景</span>
                            <span className="font-medium text-[#0F172A]">{currentItem.scene}</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-[#64748B]">推荐额度区间</span>
                            <span className="font-medium text-[#0F172A]">{currentSampleForFeed.recommendedLimit}</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-[#64748B]">当前阶段建议</span>
                            <span className="font-medium text-[#2563EB]">{currentSampleForFeed.nextAction}</span>
                          </div>
                        </div>
                        <p className="text-[10px] text-[#475569] bg-[#F8FAFC] rounded px-2.5 py-1.5 mt-1 leading-4">{currentSampleForFeed.aiSummary}</p>
                      </div>

                      {/* 抵押物核验模块（仅抵押/混合路径显示） */}
                      {currentSampleForFeed.collateral && (
                        <div className={cn('rounded-lg border p-3 space-y-2',
                          currentSampleForFeed.loanPath === 'hybrid' ? 'border-[#FED7AA] bg-[#FFFBEB]' : 'border-[#A7F3D0] bg-[#F0FDF4]'
                        )}>
                          <div className="text-[11px] font-semibold text-[#0F172A] flex items-center gap-1.5">
                            <Shield size={12} className={currentSampleForFeed.loanPath === 'hybrid' ? 'text-[#C2410C]' : 'text-[#047857]'} />
                            抵押物核验
                            <span className="text-[9px] font-normal text-[#64748B] ml-1">
                              {currentSampleForFeed.collateral.registered ? '✓ 已完成抵押登记' : '⚠ 待办理抵押登记'}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-[#64748B]">抵押物类型</span>
                              <span className="font-semibold text-[#0F172A]">{currentSampleForFeed.collateral.type}</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-[#64748B]">评估价值</span>
                              <span className="font-semibold text-[#047857]">{currentSampleForFeed.collateral.estimatedValue}</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-[#64748B]">抵押率 LTV</span>
                              <span className="font-medium text-[#0F172A]">{Math.round(currentSampleForFeed.collateral.ltvRatio * 100)}%</span>
                            </div>
                            <div className="flex items-center justify-between text-[10px]">
                              <span className="text-[#64748B]">产权状态</span>
                              <span className={cn('font-medium',
                                currentSampleForFeed.collateral.propertyRisk === '清晰' ? 'text-[#047857]' :
                                currentSampleForFeed.collateral.propertyRisk === '待核验' ? 'text-[#C2410C]' : 'text-[#DC2626]'
                              )}>{currentSampleForFeed.collateral.propertyRisk}</span>
                            </div>
                          </div>
                          <p className="text-[9px] text-[#64748B] bg-white/60 rounded px-2 py-1 leading-4">{currentSampleForFeed.collateral.note}</p>
                          {!currentSampleForFeed.collateral.registered && (
                            <div className="text-[9px] text-[#C2410C] bg-white/60 rounded px-2 py-1">放款前需完成抵押登记手续</div>
                          )}
                        </div>
                      )}

                      {/* Evidence summary */}
                      <div className="rounded-lg border border-[#E2E8F0] p-3 space-y-2">
                        <div className="text-[11px] font-semibold text-[#0F172A] flex items-center gap-1.5">
                          <Shield size={12} className="text-[#047857]" />
                          {currentSampleForFeed.loanPath === 'credit_flow' ? '证据摘要' : '三流数据参考'}
                          {currentSampleForFeed.loanPath !== 'credit_flow' && (
                            <span className="text-[9px] font-normal text-[#94A3B8] ml-1">（抵押路径下仅作参考）</span>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { label: '关系强度', value: currentSampleForFeed.relationStrength, color: currentSampleForFeed.relationStrength >= 70 ? '#047857' : '#C2410C' },
                            { label: '真实性评分', value: currentSampleForFeed.authenticityScore, color: currentSampleForFeed.authenticityScore >= 70 ? '#047857' : '#C2410C' },
                            { label: '证据覆盖度', value: currentSampleForFeed.evidenceCoverage, color: currentSampleForFeed.evidenceCoverage >= 70 ? '#047857' : '#C2410C' },
                          ].map(m => (
                            <div key={m.label} className={cn('text-center p-2 rounded-lg bg-[#F8FAFC]', currentSampleForFeed.loanPath !== 'credit_flow' && 'opacity-50')}>
                              <div className="text-[9px] text-[#64748B] mb-1">{m.label}</div>
                              <div className="text-[18px] font-bold" style={{ color: m.color }}>{m.value}%</div>
                              <div className="w-full h-1.5 rounded-full bg-[#E2E8F0] mt-1 overflow-hidden">
                                <div className="h-full rounded-full" style={{ width: `${m.value}%`, backgroundColor: m.color }} />
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="space-y-1 mt-2">
                          <div className="text-[10px] text-[#64748B]">已命中规则</div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {currentItem.hitRules.map(r => (
                              <span key={r} className={cn(
                                'text-[9px] px-2 py-0.5 rounded border',
                                r.includes('通过') || r.includes('较高') || r.includes('清晰') || r.includes('抵押') || r.includes('LTV')
                                  ? 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]'
                                  : 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
                              )}>{r}</span>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-1 mt-2">
                          <div className="text-[10px] text-[#64748B]">关键证据</div>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                            <div className="text-[10px] flex justify-between"><span className="text-[#64748B]">90天订单</span><span className="text-[#0F172A] font-medium">{currentSampleForFeed.orderCount90d} 笔 / {currentSampleForFeed.orderAmount90d}</span></div>
                            <div className="text-[10px] flex justify-between"><span className="text-[#64748B]">连续开票</span><span className="text-[#0F172A] font-medium">{currentSampleForFeed.invoiceContinuityMonths} 个月</span></div>
                            <div className="text-[10px] flex justify-between"><span className="text-[#64748B]">客户集中度</span><span className="text-[#0F172A] font-medium">{currentSampleForFeed.maxCustomerConcentration}</span></div>
                            <div className="text-[10px] flex justify-between"><span className="text-[#64748B]">回款周期</span><span className="text-[#0F172A] font-medium">{currentSampleForFeed.avgReceivableCycle}</span></div>
                            <div className="text-[10px] flex justify-between"><span className="text-[#64748B]">物流状态</span><span className="text-[#0F172A] font-medium">{currentSampleForFeed.logisticsStatus}</span></div>
                            <div className="text-[10px] flex justify-between"><span className="text-[#64748B]">账户流水</span><span className="text-[#0F172A] font-medium">{currentSampleForFeed.accountFlowStatus}</span></div>
                          </div>
                        </div>
                      </div>

                      {/* Risk summary */}
                      <div className="rounded-lg border border-[#E2E8F0] p-3 space-y-2">
                        <div className="text-[11px] font-semibold text-[#0F172A] flex items-center gap-1.5"><AlertTriangle size={12} className="text-[#F59E0B]" />风险提示</div>
                        <div className="flex items-center gap-2">
                          <Badge className={cn('text-[9px] border',
                            currentSampleForFeed.riskStatus === '正常' ? 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]' :
                            currentSampleForFeed.riskStatus === '观察' ? 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]' :
                            'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]',
                          )}>{currentSampleForFeed.riskStatus}</Badge>
                          {currentSampleForFeed.riskFlags.length > 0 && currentSampleForFeed.riskFlags.map(f => (
                            <span key={f} className="text-[9px] px-1.5 py-0.5 rounded bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5]">{f}</span>
                          ))}
                        </div>
                        <p className="text-[10px] text-[#475569] leading-4">{currentItem.riskHint}</p>
                        {currentSampleForFeed.riskFlags.length > 0 && (
                          <div className="text-[9px] text-[#C2410C] bg-[#FFF7ED] rounded px-2 py-1">建议先查看关系图谱，再决定是否进入尽调</div>
                        )}
                        {currentSampleForFeed.riskFlags.length === 0 && (
                          <div className="text-[9px] text-[#047857] bg-[#ECFDF3] rounded px-2 py-1">该企业已具备进入尽调条件</div>
                        )}
                      </div>

                      {/* Flow info */}
                      <div className="rounded-lg border border-[#E2E8F0] p-3">
                        <div className="text-[11px] font-semibold text-[#0F172A] flex items-center gap-1.5 mb-2"><Clock size={12} className="text-[#64748B]" />流转信息</div>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                          <div className="text-[10px] flex justify-between"><span className="text-[#64748B]">当前状态</span><span className="text-[#0F172A] font-medium">{currentSampleForFeed.approvalStatus}</span></div>
                          <div className="text-[10px] flex justify-between"><span className="text-[#64748B]">下一步动作</span><span className="text-[#2563EB] font-medium">{currentItem.nextAction}</span></div>
                          <div className="text-[10px] flex justify-between"><span className="text-[#64748B]">推荐时间</span><span className="text-[#0F172A]">{currentItem.recommendTime}</span></div>
                          <div className="text-[10px] flex justify-between"><span className="text-[#64748B]">来源批次</span><span className="text-[#0F172A]">{currentItem.sourceBatch}</span></div>
                        </div>
                      </div>

                      {/* AI 下一步引导卡 — 根据企业状态动态生成 */}
                      {(() => {
                        const lp = currentSampleForFeed.loanPath;
                        const hasRisk = currentSampleForFeed.riskFlags.length > 0;
                        const isHighConf = currentSampleForFeed.agentHints.confidence >= 80 && currentSampleForFeed.evidenceCoverage >= 80;
                        const isObserve = currentSampleForFeed.segmentTag === 'C待观察';
                        const isDanger = currentSampleForFeed.segmentTag === 'D风险经营中';

                        let guidance: {
                          tone: 'green' | 'blue' | 'amber' | 'red';
                          icon: React.ReactNode;
                          title: string;
                          reason: string;
                          primaryLabel: string;
                          primaryAction: () => void;
                          secondaryLabel?: string;
                          secondaryAction?: () => void;
                        };

                        // 混合路径：最高优先级，直接进入审批
                        if (lp === 'hybrid') {
                          guidance = {
                            tone: 'green',
                            icon: <CheckCircle2 size={13} className="text-[#047857]" />,
                            title: '混合路径 — 最高优先级，建议直接进入审批',
                            reason: `三流数据良好（置信度 ${currentSampleForFeed.agentHints.confidence}%）+ ${currentSampleForFeed.collateral?.type}抵押（评估 ${currentSampleForFeed.collateral?.estimatedValue}，LTV ${Math.round((currentSampleForFeed.collateral?.ltvRatio ?? 0) * 100)}%），双重保障，授信依据最充分。`,
                            primaryLabel: '直接进入尽调 →',
                            primaryAction: () => { selectSample(currentSampleForFeed.id); navigate('smart-due-diligence', 'material'); },
                            secondaryLabel: '核验抵押物产权',
                            secondaryAction: () => navigate('smart-identify', 'graph'),
                          };
                        // 抵押路径：产权清晰直接进尽调，待核验先核产权
                        } else if (lp === 'collateral') {
                          const propRisk = currentSampleForFeed.collateral?.propertyRisk;
                          if (propRisk === '清晰') {
                            guidance = {
                              tone: 'green',
                              icon: <CheckCircle2 size={13} className="text-[#047857]" />,
                              title: '抵押路径 — 产权清晰，可直接进入尽调',
                              reason: `${currentSampleForFeed.collateral?.type}评估价值 ${currentSampleForFeed.collateral?.estimatedValue}，LTV ${Math.round((currentSampleForFeed.collateral?.ltvRatio ?? 0) * 100)}%，产权清晰无瑕疵。三流数据不足不影响授信判断，建议直接进入尽调。`,
                              primaryLabel: '进入尽调 →',
                              primaryAction: () => { selectSample(currentSampleForFeed.id); navigate('smart-due-diligence', 'material'); },
                              secondaryLabel: currentSampleForFeed.collateral?.registered ? undefined : '办理抵押登记',
                              secondaryAction: () => {},
                            };
                          } else {
                            guidance = {
                              tone: 'amber',
                              icon: <AlertTriangle size={13} className="text-[#F59E0B]" />,
                              title: '抵押路径 — 需先核验产权',
                              reason: `${currentSampleForFeed.collateral?.type}评估价值 ${currentSampleForFeed.collateral?.estimatedValue}，但产权状态"${propRisk}"，建议先完成产权核验和抵押登记，再进入尽调。`,
                              primaryLabel: '核验产权',
                              primaryAction: () => navigate('smart-identify', 'graph'),
                              secondaryLabel: '仍然进入尽调',
                              secondaryAction: () => { selectSample(currentSampleForFeed.id); navigate('smart-due-diligence', 'material'); },
                            };
                          }
                        } else if (isDanger) {
                          guidance = {
                            tone: 'red',
                            icon: <AlertCircle size={13} className="text-[#DC2626]" />,
                            title: '当前不建议直接推进',
                            reason: `存在 ${currentSampleForFeed.riskFlags.length} 项风险标识（${currentSampleForFeed.riskFlags.join('、')}），建议先核验关系图谱，确认风险来源后再决定是否继续。`,
                            primaryLabel: '查看关系图谱',
                            primaryAction: () => navigate('smart-identify', 'graph'),
                            secondaryLabel: '标记观察',
                            secondaryAction: () => {},
                          };
                        } else if (hasRisk) {
                          guidance = {
                            tone: 'amber',
                            icon: <AlertTriangle size={13} className="text-[#F59E0B]" />,
                            title: '建议先核验关系图谱',
                            reason: `检测到风险标识：${currentSampleForFeed.riskFlags.join('、')}。建议在进入尽调前，先通过关系图谱确认链路真实性，再决定是否推进。`,
                            primaryLabel: '查看关系图谱',
                            primaryAction: () => navigate('smart-identify', 'graph'),
                            secondaryLabel: '仍然进入尽调',
                            secondaryAction: () => { selectSample(currentSampleForFeed.id); navigate('smart-due-diligence', 'material'); },
                          };
                        } else if (isObserve) {
                          guidance = {
                            tone: 'amber',
                            icon: <Eye size={13} className="text-[#F59E0B]" />,
                            title: '建议进入观察池',
                            reason: `当前证据覆盖度 ${currentSampleForFeed.evidenceCoverage}%，置信度 ${currentSampleForFeed.agentHints.confidence}%，尚不具备直接进入尽调的条件。建议加入候选池持续观察。`,
                            primaryLabel: '加入候选池',
                            primaryAction: () => navigate('smart-identify', 'list'),
                            secondaryLabel: '查看公私联动',
                            secondaryAction: () => navigate('smart-identify', 'linked'),
                          };
                        } else if (isHighConf) {
                          guidance = {
                            tone: 'green',
                            icon: <CheckCircle2 size={13} className="text-[#047857]" />,
                            title: '可直接进入尽调',
                            reason: `三流匹配度高，置信度 ${currentSampleForFeed.agentHints.confidence}%，证据覆盖度 ${currentSampleForFeed.evidenceCoverage}%，无风险标识。建议直接触发一键尽调。`,
                            primaryLabel: '一键尽调 →',
                            primaryAction: () => { selectSample(currentSampleForFeed.id); navigate('smart-due-diligence', 'material'); },
                            secondaryLabel: '先看关系图谱',
                            secondaryAction: () => navigate('smart-identify', 'graph'),
                          };
                        } else {
                          guidance = {
                            tone: 'blue',
                            icon: <Sparkles size={13} className="text-[#2563EB]" />,
                            title: '建议补强后进入尽调',
                            reason: `置信度 ${currentSampleForFeed.agentHints.confidence}%，证据覆盖度 ${currentSampleForFeed.evidenceCoverage}%，基础条件具备但仍有提升空间。可先核验公私联动，再进入尽调。`,
                            primaryLabel: '核验公私联动',
                            primaryAction: () => navigate('smart-identify', 'linked'),
                            secondaryLabel: '直接进入尽调',
                            secondaryAction: () => { selectSample(currentSampleForFeed.id); navigate('smart-due-diligence', 'material'); },
                          };
                        }

                        const toneStyle = {
                          green: { border: 'border-[#A7F3D0]', bg: 'bg-[#ECFDF5]', primary: 'bg-[#047857] hover:bg-[#065F46] text-white', secondary: 'border-[#A7F3D0] text-[#047857]' },
                          blue:  { border: 'border-[#BFDBFE]', bg: 'bg-[#EFF6FF]', primary: 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white', secondary: 'border-[#BFDBFE] text-[#2563EB]' },
                          amber: { border: 'border-[#FED7AA]', bg: 'bg-[#FFFBEB]', primary: 'bg-[#F59E0B] hover:bg-[#D97706] text-white', secondary: 'border-[#FED7AA] text-[#C2410C]' },
                          red:   { border: 'border-[#FCA5A5]', bg: 'bg-[#FEF2F2]', primary: 'bg-[#DC2626] hover:bg-[#B91C1C] text-white', secondary: 'border-[#FCA5A5] text-[#DC2626]' },
                        }[guidance.tone];

                        return (
                          <div className={cn('rounded-lg border p-3 space-y-2.5', toneStyle.border, toneStyle.bg)}>
                            <div className="flex items-center gap-1.5">
                              {guidance.icon}
                              <span className="text-[11px] font-semibold text-[#0F172A]">AI 建议下一步</span>
                              <span className="text-[10px] font-semibold text-[#0F172A]">— {guidance.title}</span>
                            </div>
                            <p className="text-[10px] text-[#475569] leading-4">{guidance.reason}</p>
                            <div className="flex items-center gap-2 pt-0.5">
                              <Button size="sm" className={cn('h-7 text-[10px] gap-1 flex-1', toneStyle.primary)} onClick={guidance.primaryAction}>
                                {guidance.primaryLabel}
                              </Button>
                              {guidance.secondaryLabel && (
                                <Button variant="outline" size="sm" className={cn('h-7 text-[10px] gap-1', toneStyle.secondary)} onClick={guidance.secondaryAction}>
                                  {guidance.secondaryLabel}
                                </Button>
                              )}
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                    <Search size={28} className="text-[#CBD5E1] mb-3" />
                    <div className="text-[13px] font-medium text-[#64748B]">当前暂无可推荐企业。</div>
                    <div className="text-[10px] text-[#94A3B8] mt-1">您可以先导入名单，或调整筛选条件后重新生成推荐。</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      }

      /* ═══════════════════════════════════════════════════════════
         PAGE 4: 智能筛选（条件筛选部分）— 半自动筛选工作流

      /* ═══════════════════════════════════════════════════════════
         PAGE 5: 候选资产 — 候选管理与推进
         ═══════════════════════════════════════════════════════════ */
      case 'list': {
        const SEGMENT_STYLE: Record<string, { bg: string; text: string; border: string; desc: string }> = {
          'A可授信': { bg: 'bg-[#EFF6FF]', text: 'text-[#2563EB]', border: 'border-[#BFDBFE]', desc: '识别依据较强，建议优先进入下一步作业' },
          'B可做但需处理': { bg: 'bg-[#FFF7ED]', text: 'text-[#C2410C]', border: 'border-[#FED7AA]', desc: '已具备基础条件，但需补强后继续推进' },
          'C待观察': { bg: 'bg-[#F8FAFC]', text: 'text-[#64748B]', border: 'border-[#E2E8F0]', desc: '当前建议持续观察，不宜立即进入尽调' },
          'D风险经营中': { bg: 'bg-[#FEF2F2]', text: 'text-[#DC2626]', border: 'border-[#FCA5A5]', desc: '当前存在明显风险限制，需谨慎处理' },
        };
        const segmentLabels: Record<string, string> = { 'A可授信': 'A 类可做', 'B可做但需处理': 'B 类需处理', 'C待观察': 'C 类待观察', 'D风险经营中': 'D 类风险中' };
        const segmentOrder = ['A可授信', 'B可做但需处理', 'C待观察', 'D风险经营中'] as const;

        const currentCandSample = SAMPLES.find(s => s.id === selectedCandidate);

        const overviewCards = [
          { label: '候选总数', value: SAMPLES.length, desc: '当前已进入候选管理的企业总数', icon: Layers, color: 'text-[#475569]' },
          { label: 'A 类可做', value: SAMPLES.filter(s => s.segmentTag === 'A可授信').length, desc: '具备较强识别依据，建议优先推进', icon: Star, color: 'text-[#2563EB]' },
          { label: 'B 类需处理', value: SAMPLES.filter(s => s.segmentTag === 'B可做但需处理').length, desc: '已具备基础条件，但需补充处理', icon: AlertTriangle, color: 'text-[#C2410C]' },
          { label: 'C 类待观察', value: SAMPLES.filter(s => s.segmentTag === 'C待观察').length, desc: '识别信号存在，建议持续观察', icon: Eye, color: 'text-[#64748B]' },
          { label: 'D 类风险中', value: SAMPLES.filter(s => s.segmentTag === 'D风险经营中').length, desc: '当前不建议直接推进，需关注风险变化', icon: AlertCircle, color: 'text-[#DC2626]' },
        ];

        const ruleHitCount = (s: ChainLoanSample) => {
          let count = 0;
          if (s.orderCount90d >= 15) count++;
          if (s.invoiceContinuityMonths >= 10) count++;
          if (s.relationStrength >= 70) count++;
          if (s.evidenceCoverage >= 70) count++;
          if (s.authenticityScore >= 70) count++;
          return count;
        };

        return (
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-semibold text-[#0F172A]">候选资产</h2>
                <p className="text-[11px] text-[#64748B] mt-0.5">统一管理已进入识别主链路的候选企业，支持分层、筛选与后续作业推进。</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><RefreshCw size={10} />刷新列表</Button>
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Download size={10} />导出候选</Button>
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#A7F3D0] text-[#047857]"><FileSearch size={10} />批量加入尽调</Button>
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#64748B]"><Eye size={10} />批量标记观察</Button>
              </div>
            </div>

            {/* AI Insight */}
            <AiInsight
              message={`候选资产列表已加载，按候选等级分组展示，选择企业查看详细识别结论与依据。`}
              tone="info"
            />

            {/* Filter & sort bar */}
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[9px] text-[#94A3B8]">建议先按候选等级与当前阶段收敛范围，再查看识别强度与风险状态。</span>
                {[
                  { label: '候选等级', options: ['全部', 'A 类', 'B 类', 'C 类', 'D 类'] },
                  { label: '行业', options: ['全部', '新能源', '包装材料', '物流', '化工'] },
                  { label: '当前阶段', options: ['全部', '已识别', '预授信', '补审', '已批准', '恢复中'] },
                  { label: '风险状态', options: ['全部', '正常', '观察', '中度预警'] },
                ].map(f => (
                  <select key={f.label} className="h-6 rounded border border-[#E2E8F0] px-1.5 text-[9px] text-[#0F172A] bg-white">
                    {f.options.map(o => <option key={o}>{f.label}: {o}</option>)}
                  </select>
                ))}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <select className="h-6 rounded border border-[#E2E8F0] px-1.5 text-[9px] text-[#0F172A] bg-white">
                  {['按推荐优先级', '按关系强度', '按证据覆盖度', '按风险等级'].map(o => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>

            {/* Three-column: candidate list + detail + AI panel */}
            <div className="grid grid-cols-[280px_1fr] gap-3" style={{ minHeight: 480 }}>

              {/* LEFT: Candidate list grouped by segment */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-3 py-2.5 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                  <span className="text-[11px] font-semibold text-[#0F172A]">候选列表</span>
                  <span className="text-[9px] text-[#94A3B8] ml-2">{SAMPLES.length} 家企业</span>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {segmentOrder.map(seg => {
                    const items = SAMPLES.filter(s => s.segmentTag === seg);
                    if (items.length === 0) return null;
                    const ss = SEGMENT_STYLE[seg];
                    return (
                      <div key={seg}>
                        <div className="px-3 py-1.5 bg-[#FAFBFF] border-b border-[#F1F5F9] flex items-center gap-1.5">
                          <span className={cn('text-[10px] font-semibold', ss.text)}>{segmentLabels[seg]}</span>
                          <span className="text-[9px] text-[#94A3B8]">{items.length}</span>
                        </div>
                        {items.map(sample => {
                          const isActive = selectedCandidate === sample.id;
                          const hits = ruleHitCount(sample);
                          return (
                            <div
                              key={sample.id}
                              onClick={() => setSelectedCandidate(sample.id)}
                              className={cn(
                                'px-3 py-2.5 border-b border-[#F1F5F9] cursor-pointer transition-all',
                                isActive ? 'bg-[#EFF6FF] border-l-2 border-l-[#2563EB]' : 'hover:bg-[#FAFBFF]',
                              )}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[12px] font-semibold text-[#0F172A] truncate">{sample.shortName}</span>
                                <Badge className={cn('text-[8px] border', ss.bg, ss.text, ss.border)}>{segmentLabels[seg]}</Badge>
                              </div>
                              <div className="text-[9px] text-[#64748B] mb-1.5">{sample.roleInChain} · {sample.chainName}</div>
                              <div className="flex items-center gap-1 flex-wrap mb-1.5">
                                <span className="text-[8px] px-1.5 py-0.5 rounded bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">{sample.productType}</span>
                                {sample.riskFlags.length > 0 && (
                                  <span className="text-[8px] px-1.5 py-0.5 rounded bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5]">{sample.riskFlags[0]}</span>
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-[9px]">
                                <span className="text-[#64748B]">关系 <span className="font-medium text-[#0F172A]">{sample.relationStrength}%</span></span>
                                <span className="text-[#64748B]">覆盖 <span className="font-medium text-[#0F172A]">{sample.evidenceCoverage}%</span></span>
                                <span className="text-[#64748B]">规则 <span className="font-medium text-[#0F172A]">{hits}/5</span></span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                  {SAMPLES.length === 0 && (
                    <div className="p-6 text-center">
                      <Search size={24} className="text-[#CBD5E1] mx-auto mb-2" />
                      <div className="text-[11px] text-[#64748B]">当前暂无候选资产。</div>
                      <div className="text-[9px] text-[#94A3B8] mt-1">您可以先完成名单导入、推荐或筛选后，再进入候选资产。</div>
                    </div>
                  )}
                </div>
              </div>

              {/* CENTER: Current candidate detail */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                {currentCandSample ? (() => {
                  const seg = currentCandSample.segmentTag;
                  const ss = SEGMENT_STYLE[seg];
                  const hits = ruleHitCount(currentCandSample);
                  const hitList: string[] = [];
                  const missList: string[] = [];
                  if (currentCandSample.orderCount90d >= 15) hitList.push('订单稳定性通过'); else missList.push('订单频次偏低');
                  if (currentCandSample.invoiceContinuityMonths >= 10) hitList.push('开票连续性通过'); else missList.push('开票连续性不足');
                  if (currentCandSample.relationStrength >= 70) hitList.push('关系强度达标'); else missList.push('关系强度不足');
                  if (currentCandSample.evidenceCoverage >= 70) hitList.push('证据覆盖度达标'); else missList.push('证据覆盖度不足');
                  if (currentCandSample.authenticityScore >= 70) hitList.push('真实性评分达标'); else missList.push('真实性评分偏低');

                  return (
                    <>
                      <div className="px-4 py-3 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                        <div className="flex items-center justify-between">
                          <span className="text-[12px] font-semibold text-[#0F172A]">当前候选详情</span>
                          <div className="flex items-center gap-1.5">
                            <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#A7F3D0] text-[#047857]" onClick={() => { selectSample(currentCandSample!.id); navigate('smart-due-diligence', 'dd-report'); }}><FileSearch size={9} />进入尽调</Button>
                            <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#BFDBFE] text-[#2563EB]" onClick={() => navigate('smart-approval', 'product-match')}><ArrowRight size={9} />审批前队列</Button>
                            <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]" onClick={() => navigate('smart-identify', 'graph')}><Network size={9} />关系图谱</Button>
                            <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]" onClick={() => navigate('smart-identify', 'linked')}><Link2 size={9} />公私联动</Button>
                            <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#64748B]"><UserCheck size={9} />标记人工确认</Button>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {/* Entity info */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <span className="text-[15px] font-bold text-[#0F172A]">{currentCandSample.companyName}</span>
                            <Badge className={cn('text-[9px] border', ss.bg, ss.text, ss.border)}>{segmentLabels[seg]}</Badge>
                          </div>
                          <div className="flex items-center gap-3 text-[10px] text-[#64748B]">
                            <span>{currentCandSample.roleInChain}</span>
                            <span className="text-[#CBD5E1]">·</span>
                            <span>{currentCandSample.chainName}</span>
                            <span className="text-[#CBD5E1]">·</span>
                            <span>年销售 {currentCandSample.annualSales}</span>
                            <span className="text-[#CBD5E1]">·</span>
                            <span>{currentCandSample.productType}</span>
                          </div>
                        </div>

                        {/* Candidate conclusion */}
                        <div className="rounded-lg border border-[#E2E8F0] p-3 space-y-2">
                          <div className="text-[11px] font-semibold text-[#0F172A] flex items-center gap-1.5"><Brain size={12} className="text-[#7C3AED]" />候选结论</div>
                          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                            <div className="flex items-center justify-between text-[10px]"><span className="text-[#64748B]">候选等级</span><Badge className={cn('text-[8px] border', ss.bg, ss.text, ss.border)}>{segmentLabels[seg]}</Badge></div>
                            <div className="flex items-center justify-between text-[10px]"><span className="text-[#64748B]">当前阶段</span><span className="font-medium text-[#0F172A]">{currentCandSample.approvalStatus}</span></div>
                            <div className="flex items-center justify-between text-[10px]"><span className="text-[#64748B]">推荐场景</span><span className="font-medium text-[#0F172A]">{currentCandSample.productType}</span></div>
                            <div className="flex items-center justify-between text-[10px]"><span className="text-[#64748B]">推荐额度区间</span><span className="font-medium text-[#0F172A]">{currentCandSample.recommendedLimit}</span></div>
                          </div>
                          <p className="text-[10px] text-[#475569] bg-[#F8FAFC] rounded px-2.5 py-1.5 leading-4">
                            {seg === 'A可授信'
                              ? '该企业已满足当前候选准入标准，识别依据较强，建议进入尽调作业。'
                              : seg === 'B可做但需处理'
                                ? '该企业具备继续推进价值，但仍需补充关键证据后再进入审批链路。'
                                : seg === 'C待观察'
                                  ? '识别信号存在但证据不足，建议保持跟踪观察。'
                                  : '当前存在风险限制，建议在风险缓解后再评估推进可能。'}
                          </p>
                        </div>

                        {/* Identification basis */}
                        <div className="rounded-lg border border-[#E2E8F0] p-3 space-y-2">
                          <div className="text-[11px] font-semibold text-[#0F172A] flex items-center gap-1.5"><Shield size={12} className="text-[#047857]" />识别依据</div>
                          <div className="grid grid-cols-3 gap-3">
                            {[
                              { label: '关系强度', value: currentCandSample.relationStrength },
                              { label: '真实性评分', value: currentCandSample.authenticityScore },
                              { label: '证据覆盖度', value: currentCandSample.evidenceCoverage },
                            ].map(m => (
                              <div key={m.label} className="text-center p-2 rounded-lg bg-[#F8FAFC]">
                                <div className="text-[9px] text-[#64748B] mb-1">{m.label}</div>
                                <div className="text-[18px] font-bold" style={{ color: m.value >= 70 ? '#047857' : '#C2410C' }}>{m.value}%</div>
                                <div className="w-full h-1.5 rounded-full bg-[#E2E8F0] mt-1 overflow-hidden">
                                  <div className="h-full rounded-full" style={{ width: `${m.value}%`, backgroundColor: m.value >= 70 ? '#047857' : '#C2410C' }} />
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="space-y-1.5 mt-2">
                            <div className="text-[9px] text-[#94A3B8]">命中规则 {hits}/5</div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              {hitList.map(h => (
                                <span key={h} className="text-[9px] px-2 py-0.5 rounded bg-[#ECFDF3] text-[#047857] border border-[#A7F3D0] flex items-center gap-1"><CheckCircle2 size={8} />{h}</span>
                              ))}
                              {missList.map(m => (
                                <span key={m} className="text-[9px] px-2 py-0.5 rounded bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5] flex items-center gap-1"><AlertCircle size={8} />{m}</span>
                              ))}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
                            <div className="text-[10px] flex justify-between"><span className="text-[#64748B]">90天订单</span><span className="text-[#0F172A] font-medium">{currentCandSample.orderCount90d} 笔 / {currentCandSample.orderAmount90d}</span></div>
                            <div className="text-[10px] flex justify-between"><span className="text-[#64748B]">连续开票</span><span className="text-[#0F172A] font-medium">{currentCandSample.invoiceContinuityMonths} 个月</span></div>
                            <div className="text-[10px] flex justify-between"><span className="text-[#64748B]">客户集中度</span><span className="text-[#0F172A] font-medium">{currentCandSample.maxCustomerConcentration}</span></div>
                            <div className="text-[10px] flex justify-between"><span className="text-[#64748B]">回款周期</span><span className="text-[#0F172A] font-medium">{currentCandSample.avgReceivableCycle}</span></div>
                          </div>
                        </div>

                        {/* Risk & restrictions */}
                        <div className="rounded-lg border border-[#E2E8F0] p-3 space-y-2">
                          <div className="text-[11px] font-semibold text-[#0F172A] flex items-center gap-1.5"><AlertTriangle size={12} className="text-[#F59E0B]" />风险与限制</div>
                          <div className="flex items-center gap-2">
                            <Badge className={cn('text-[9px] border',
                              currentCandSample.riskStatus === '正常' ? 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]' :
                              currentCandSample.riskStatus === '观察' ? 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]' :
                              'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]',
                            )}>{currentCandSample.riskStatus}</Badge>
                            {currentCandSample.riskFlags.map(f => (
                              <span key={f} className="text-[9px] px-1.5 py-0.5 rounded bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5]">{f}</span>
                            ))}
                          </div>
                          {currentCandSample.riskFlags.length > 0 && (
                            <p className="text-[10px] text-[#C2410C] leading-4">当前存在集中度或经营波动风险，建议在尽调阶段重点核验相关证据。</p>
                          )}
                          {missList.length > 0 && (
                            <p className="text-[10px] text-[#475569] leading-4">需补充信息：{missList.join('、')}</p>
                          )}
                          <p className="text-[10px] text-[#64748B] leading-4">{currentCandSample.reviewReason}</p>
                        </div>
                      </div>
                    </>
                  );
                })() : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                    <Search size={28} className="text-[#CBD5E1] mb-3" />
                    <div className="text-[13px] font-medium text-[#64748B]">当前暂无候选资产。</div>
                    <div className="text-[10px] text-[#94A3B8] mt-1">您可以先完成名单导入、推荐或筛选后，再进入候选资产。</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      }

      /* ═══════════════════════════════════════════════════════════
         PAGE 6: 关系图谱 — 关系验证工作台
         ═══════════════════════════════════════════════════════════ */
      case 'graph': {
        interface GNode { id: string; name: string; type: '核心企业' | '上游供应商' | '下游客户' | '物流主体' | '服务主体' | '资金节点' | '公私联动节点'; direction: 'upstream' | 'downstream' | 'service'; industry: string; region: string; chainRole: string; relatedCount: number; strongRelCount: number; lastActive: string; identifyStatus: string; riskStatus: string; inPool: boolean; relationStrength: number; txCount: number; txAmount: string; months: number; cycleDays: string; concentration: string; evidenceSources: string[]; keywords: string[]; status: 'stable' | 'attention' | 'new'; isMainChain: boolean; linkedHit: boolean; }
        const GRAPH_NODES: GNode[] = [
          { id: 'gn-1', name: '盛拓模组科技', type: '下游客户', direction: 'downstream', industry: '新能源', region: '常州', chainRole: 'Tier-2 桥接方', relatedCount: 5, strongRelCount: 3, lastActive: '2026-04-08', identifyStatus: '已识别', riskStatus: '正常', inPool: true, relationStrength: 92, txCount: 48, txAmount: '386万', months: 14, cycleDays: '30-35天', concentration: '42%', evidenceSources: ['对公流水', '增值税发票', '物流签收'], keywords: ['包装箱', '材料款'], status: 'stable', isMainChain: true, linkedHit: true },
          { id: 'gn-2', name: '金利达新材料', type: '上游供应商', direction: 'upstream', industry: '包装材料', region: '常州', chainRole: '原材料供应商', relatedCount: 3, strongRelCount: 2, lastActive: '2026-04-06', identifyStatus: '已识别', riskStatus: '正常', inPool: true, relationStrength: 88, txCount: 22, txAmount: '156万', months: 11, cycleDays: '15-20天', concentration: '28%', evidenceSources: ['对公流水', '增值税发票', '采购合同'], keywords: ['原材料', 'EPE'], status: 'stable', isMainChain: true, linkedHit: false },
          { id: 'gn-3', name: '驰远物流', type: '物流主体', direction: 'service', industry: '物流', region: '无锡', chainRole: '链上物流服务', relatedCount: 4, strongRelCount: 2, lastActive: '2026-04-09', identifyStatus: '预授信', riskStatus: '正常', inPool: true, relationStrength: 85, txCount: 61, txAmount: '34万', months: 18, cycleDays: '周结', concentration: '—', evidenceSources: ['对公流水', '运单签收', '物流轨迹'], keywords: ['运费', '物流费'], status: 'stable', isMainChain: false, linkedHit: false },
          { id: 'gn-4', name: '常州永信化工', type: '上游供应商', direction: 'upstream', industry: '化工', region: '常州', chainRole: '辅料供应商', relatedCount: 2, strongRelCount: 1, lastActive: '2026-03-28', identifyStatus: '已识别', riskStatus: '正常', inPool: false, relationStrength: 76, txCount: 15, txAmount: '89万', months: 8, cycleDays: '30天', concentration: '16%', evidenceSources: ['对公流水', '增值税发票'], keywords: ['胶水', '材料款'], status: 'stable', isMainChain: false, linkedHit: false },
          { id: 'gn-5', name: '瑞丰辅料', type: '下游客户', direction: 'downstream', industry: '辅料', region: '昆山', chainRole: '三级辅料供应商', relatedCount: 3, strongRelCount: 1, lastActive: '2026-04-01', identifyStatus: '恢复中', riskStatus: '中度预警', inPool: true, relationStrength: 61, txCount: 12, txAmount: '67万', months: 6, cycleDays: '45天', concentration: '12%', evidenceSources: ['对公流水', '发票'], keywords: ['缓冲材料'], status: 'new', isMainChain: false, linkedHit: false },
          { id: 'gn-6', name: '溧阳宏达机械', type: '服务主体', direction: 'downstream', industry: '机械', region: '溧阳', chainRole: '加工服务方', relatedCount: 1, strongRelCount: 0, lastActive: '2026-02-15', identifyStatus: '待确认', riskStatus: '观察', inPool: false, relationStrength: 42, txCount: 8, txAmount: '38万', months: 4, cycleDays: '不规律', concentration: '7%', evidenceSources: ['对公流水'], keywords: ['加工费'], status: 'attention', isMainChain: false, linkedHit: false },
          { id: 'gn-7', name: '苏州汇能塑胶', type: '上游供应商', direction: 'upstream', industry: '塑料', region: '苏州', chainRole: '原材料供应商', relatedCount: 3, strongRelCount: 2, lastActive: '2026-04-05', identifyStatus: '已识别', riskStatus: '正常', inPool: true, relationStrength: 80, txCount: 18, txAmount: '112万', months: 9, cycleDays: '30天', concentration: '19%', evidenceSources: ['对公流水', '增值税发票', '物流签收'], keywords: ['塑料粒子'], status: 'stable', isMainChain: true, linkedHit: true },
          { id: 'gn-8', name: '顺捷报关行', type: '服务主体', direction: 'service', industry: '服务', region: '常州', chainRole: '报关代理', relatedCount: 2, strongRelCount: 1, lastActive: '2026-03-20', identifyStatus: '已识别', riskStatus: '正常', inPool: false, relationStrength: 72, txCount: 24, txAmount: '18万', months: 12, cycleDays: '月结', concentration: '—', evidenceSources: ['对公流水', '报关单据'], keywords: ['报关费'], status: 'stable', isMainChain: false, linkedHit: false },
          { id: 'gn-9', name: '无锡创达电气', type: '下游客户', direction: 'downstream', industry: '电气', region: '无锡', chainRole: '下游零散客户', relatedCount: 1, strongRelCount: 0, lastActive: '2026-01-10', identifyStatus: '待确认', riskStatus: '观察', inPool: false, relationStrength: 38, txCount: 6, txAmount: '29万', months: 3, cycleDays: '45-60天', concentration: '5%', evidenceSources: ['对公流水'], keywords: ['电气箱'], status: 'new', isMainChain: false, linkedHit: false },
        ];

        const DIR_MAP = { upstream: { fill: '#FFF7ED', stroke: '#F97316', text: '#9A3412', label: '上游供应商', edgeLabel: '采购付款' }, downstream: { fill: '#EFF6FF', stroke: '#3B82F6', text: '#1E40AF', label: '下游采购方', edgeLabel: '销售收款' }, service: { fill: '#ECFDF5', stroke: '#10B981', text: '#065F46', label: '服务/物流', edgeLabel: '服务支付' } } as const;
        const STATUS_COLOR = { stable: '#10B981', attention: '#F59E0B', new: '#3B82F6' } as const;
        const strColor = (v: number) => v >= 80 ? '#10B981' : v >= 60 ? '#3B82F6' : v >= 40 ? '#F59E0B' : '#EF4444';
        const currentSample = SAMPLES.find(s => s.id === selectedRecommend) ?? SAMPLES[0];

        const selNode = selectedGraphNode ? GRAPH_NODES.find(n => n.id === selectedGraphNode) ?? null : null;
        const coreCount = GRAPH_NODES.length + 2;
        const strongCount = GRAPH_NODES.filter(n => n.relationStrength >= 70).length;
        const pendingCount = GRAPH_NODES.filter(n => n.relationStrength < 60).length;
        const linkedCount = GRAPH_NODES.filter(n => n.linkedHit).length;
        const pushableCount = GRAPH_NODES.filter(n => n.relationStrength >= 60 && n.riskStatus === '正常').length;

        const W = 720, H = 420;
        const gcx = W * 0.42, gcy = H * 0.44;
        const nodeR = 26;

        const gPositions: { x: number; y: number; node: GNode }[] = [];
        const upNodes = GRAPH_NODES.filter(n => n.direction === 'upstream');
        const downNodes = GRAPH_NODES.filter(n => n.direction === 'downstream');
        const svcNodes = GRAPH_NODES.filter(n => n.direction === 'service');
        const upMain = upNodes.filter(n => n.isMainChain);
        const upAux = upNodes.filter(n => !n.isMainChain);
        upMain.forEach((n, i) => { const sp = 75; const by = gcy - ((upMain.length - 1) * sp) / 2; gPositions.push({ x: gcx - 175, y: by + i * sp, node: n }); });
        upAux.forEach((n, i) => { const sp = 75; const by = gcy - ((upAux.length - 1) * sp) / 2; gPositions.push({ x: gcx - 290, y: by + i * sp, node: n }); });
        const downMain = downNodes.filter(n => n.isMainChain);
        const downAux = downNodes.filter(n => !n.isMainChain);
        downMain.forEach((n, i) => { const sp = 75; const by = gcy - ((downMain.length - 1) * sp) / 2; gPositions.push({ x: gcx + 185, y: by + i * sp, node: n }); });
        downAux.forEach((n, i) => { const sp = 65; const by = gcy - ((downAux.length - 1) * sp) / 2; gPositions.push({ x: gcx + 290, y: by + i * sp, node: n }); });
        svcNodes.forEach((n, i) => { const sp = 130; const bx = gcx - ((svcNodes.length - 1) * sp) / 2; gPositions.push({ x: bx + i * sp, y: gcy + 160, node: n }); });

        const chainMasterX = gcx + 380, chainMasterY = gcy;

        const EVIDENCE_TYPES = ['对公流水往来', '回款记录', '订单材料', '合同材料', '物流签收', '发票', '公私联动命中'];

        return (
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-semibold text-[#0F172A]">关系图谱</h2>
                <p className="text-[11px] text-[#64748B] mt-0.5">展示企业在交易、资金、物流与公私联动维度上的关系网络，辅助识别可信链路与可授信主体。</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><RefreshCw size={10} />刷新图谱</Button>
                <div className="flex items-center border border-[#E2E8F0] rounded-md overflow-hidden">
                  {([['trade', '交易关系'], ['fund', '资金关系'], ['logistics', '物流关系'], ['linked', '公私联动']] as const).map(([k, label]) => (
                    <button key={k} onClick={() => setGraphView(k)} className={cn('px-2 py-1 text-[9px] transition-colors', graphView === k ? 'bg-[#2563EB] text-white' : 'text-[#64748B] hover:bg-[#F8FAFC]')}>{label}</button>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Crosshair size={10} />查看全链路</Button>
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Download size={10} />导出图谱</Button>
              </div>
            </div>

            {/* 图谱顶部横幅 — 根据当前企业数据覆盖情况动态显示 */}
            {(() => {
              const ec = currentSample.evidenceCoverage;
              const rs = currentSample.relationStrength;
              const hasRisk = currentSample.riskFlags.length > 0;

              // 数据丰富：三流验证通过
              if (ec >= 85 && rs >= 80 && !hasRisk) return (
                <div className="rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#2563EB] to-[#7C3AED] flex items-center justify-center shrink-0">
                        <CheckCircle2 size={13} className="text-white" />
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold text-[#1E3A5F]">
                          {currentSample.shortName} · 经营真实性验证通过
                          <span className="ml-2 text-[10px] font-normal text-[#64748B]">数据来源：行内对公流水 + 供应链平台回传</span>
                        </div>
                        <div className="text-[10px] text-[#475569] mt-0.5">
                          三流匹配率98.6% · 全年无断单无断票 · 回款路径清晰 · 可直接进入尽调
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 shrink-0">
                      {[
                        { label: '三流匹配率', value: '98.6%', color: '#047857' },
                        { label: '六维综合评分', value: '95分', color: '#2563EB' },
                        { label: '平均回款周期', value: '34天', color: '#7C3AED' },
                        { label: '连续开票', value: '12个月', color: '#047857' },
                      ].map(m => (
                        <div key={m.label} className="text-center">
                          <div className="text-[9px] text-[#64748B]">{m.label}</div>
                          <div className="text-[13px] font-bold" style={{ color: m.color }}>{m.value}</div>
                        </div>
                      ))}
                      <Button size="sm" className="h-7 text-[10px] gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white ml-2"
                        onClick={() => navigate('smart-due-diligence', 'material')}>
                        <FileSearch size={10} />一键尽调 →
                      </Button>
                    </div>
                  </div>
                </div>
              );

              // 数据一般：有部分数据，需补充
              if (ec >= 60 && ec < 85) {
                const missing: string[] = [];
                if (currentSample.invoiceContinuityMonths < 10) missing.push('发票连续性不足');
                if (currentSample.orderCount90d < 15) missing.push('订单频次偏低');
                if (hasRisk) missing.push(...currentSample.riskFlags);
                return (
                  <div className="rounded-lg border border-[#FED7AA] bg-[#FFFBEB] px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-[#F59E0B] flex items-center justify-center shrink-0">
                          <AlertTriangle size={13} className="text-white" />
                        </div>
                        <div>
                          <div className="text-[11px] font-semibold text-[#92400E]">
                            {currentSample.shortName} · 部分数据已接入，建议补充后进入尽调
                          </div>
                          <div className="text-[10px] text-[#78350F] mt-0.5">
                            当前缺口：{missing.join(' · ')} · 补充后置信度预计提升至85%以上
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="text-center">
                          <div className="text-[9px] text-[#92400E]">证据覆盖度</div>
                          <div className="text-[13px] font-bold text-[#F59E0B]">{ec}%</div>
                        </div>
                        <div className="text-center">
                          <div className="text-[9px] text-[#92400E]">关系强度</div>
                          <div className="text-[13px] font-bold text-[#F59E0B]">{rs}%</div>
                        </div>
                        <div className="flex flex-col gap-1 ml-2">
                          <Button size="sm" className="h-6 text-[9px] gap-1 bg-[#F59E0B] hover:bg-[#D97706] text-white"
                            onClick={() => navigate('smart-due-diligence', 'material')}>
                            <FileSearch size={9} />仍然进入尽调
                          </Button>
                          <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#FED7AA] text-[#C2410C]"
                            onClick={() => navigate('smart-identify', 'linked')}>
                            <Link2 size={9} />先补充公私联动
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              }

              // 数据稀少：仅有工商信息或链路线索
              return (
                <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-[#94A3B8] flex items-center justify-center shrink-0">
                        <AlertCircle size={13} className="text-white" />
                      </div>
                      <div>
                        <div className="text-[11px] font-semibold text-[#334155]">
                          {currentSample.shortName} · 当前数据不足以支撑尽调
                        </div>
                        <div className="text-[10px] text-[#64748B] mt-0.5">
                          仅有工商信息，缺少对公流水和发票数据 · 建议通过以下方式补充后再评估
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {[
                        { label: '① 外勤录入材料', action: () => navigate('smart-due-diligence', 'material') },
                        { label: '② 客户授权上传', action: () => navigate('smart-due-diligence', 'material') },
                        { label: '③ 接入税票平台', action: () => navigate('strategy-config', 'data-source') },
                      ].map(opt => (
                        <Button key={opt.label} variant="outline" size="sm"
                          className="h-7 text-[9px] border-[#E2E8F0] text-[#475569]"
                          onClick={opt.action}>
                          {opt.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })()}
{/* Three-column: graph canvas + detail + AI */}
            <div className="grid grid-cols-1 gap-3" style={{ minHeight: 460 }}>

              {/* LEFT: Graph canvas + node detail below */}
              <div className="space-y-3">
                {/* Canvas */}
                <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
                  <div className="px-3 py-1.5 border-b border-[#F1F5F9] bg-[#F8FAFC] flex items-center justify-between">
                    <span className="text-[10px] text-[#64748B]">建议优先查看核心企业与高强度关系节点，再下钻证据与公私联动结果。</span>
                    <div className="flex items-center gap-3 text-[9px] text-[#94A3B8]">
                      {Object.entries(DIR_MAP).map(([, t]) => (<span key={t.label} className="flex items-center gap-1"><span className="w-2 h-2 rounded-full" style={{ backgroundColor: t.stroke }} />{t.label}</span>))}
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#7C3AED]" />链主</span>
                    </div>
                  </div>
                  <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height: 380 }}>
                    <defs>
                      <filter id="gns"><feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.06" /></filter>
                      {Object.entries(DIR_MAP).map(([k, t]) => (<marker key={k} id={`ga-${k}`} viewBox="0 0 8 6" refX="8" refY="3" markerWidth="6" markerHeight="4" orient="auto-start-reverse"><path d="M0,0.5 L7.5,3 L0,5.5Z" fill={t.stroke} opacity="0.5" /></marker>))}
                    </defs>
                    <pattern id="ggr" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0 L0 0 0 24" fill="none" stroke="#F1F5F9" strokeWidth="0.3" /></pattern>
                    <rect width={W} height={H} fill="url(#ggr)" />
                    {/* Edges */}
                    {gPositions.map(({ x, y, node }) => {
                      const t = DIR_MAP[node.direction];
                      const active = hoveredGraphNode === node.id || selectedGraphNode === node.id;
                      const dimmed = (hoveredGraphNode || selectedGraphNode) && hoveredGraphNode !== node.id && selectedGraphNode !== node.id;
                      const dx = x - gcx, dy = y - gcy, d = Math.sqrt(dx * dx + dy * dy);
                      const ux = dx / d, uy = dy / d;
                      const sx2 = gcx + ux * 30, sy2 = gcy + uy * 30;
                      const ex2 = x - ux * (nodeR + 2), ey2 = y - uy * (nodeR + 2);
                      const edgeW = node.isMainChain ? (active ? 2.2 : 1.5) : (active ? 1.8 : 0.8);
                      const mEnd = node.direction === 'upstream' ? '' : `url(#ga-${node.direction})`;
                      const mStart = node.direction === 'upstream' ? `url(#ga-${node.direction})` : '';
                      return (
                        <g key={`e-${node.id}`} opacity={dimmed ? 0.08 : active ? 1 : node.isMainChain ? 0.45 : 0.2} style={{ transition: 'opacity 0.2s' }}>
                          <line x1={sx2} y1={sy2} x2={ex2} y2={ey2} stroke={t.stroke} strokeWidth={edgeW} strokeDasharray={node.isMainChain ? 'none' : '3 2'} markerEnd={mEnd} markerStart={mStart} />
                          {active && <text x={(sx2 + ex2) / 2} y={(sy2 + ey2) / 2 - 6} textAnchor="middle" fontSize={7} fill={t.text} fontWeight={600} opacity={0.8}>{t.edgeLabel} · {node.txAmount}</text>}
                        </g>
                      );
                    })}
                    {/* Chain master */}
                    {chainMasterX < W && (
                      <g>
                        <circle cx={chainMasterX} cy={chainMasterY} r={28} fill="#7C3AED" filter="url(#gns)" />
                        <circle cx={chainMasterX} cy={chainMasterY} r={28} fill="none" stroke="#6D28D9" strokeWidth={1.5} strokeDasharray="4 3" />
                        <text x={chainMasterX} y={chainMasterY - 5} textAnchor="middle" fill="white" fontSize={9} fontWeight={700}>宁川新能源</text>
                        <text x={chainMasterX} y={chainMasterY + 7} textAnchor="middle" fill="#E9D5FF" fontSize={7}>链主 · 未确权</text>
                      </g>
                    )}
                    {/* Center node */}
                    <g filter="url(#gns)">
                      <circle cx={gcx} cy={gcy} r={30} fill="#EFF6FF" />
                      <circle cx={gcx} cy={gcy} r={30} fill="none" stroke="#3B82F6" strokeWidth={1.8} />
                      <text x={gcx} y={gcy - 6} textAnchor="middle" fill="#1E3A5F" fontSize={10} fontWeight={700}>{SAMPLES[0]?.shortName ?? '衡远包装'}</text>
                      <text x={gcx} y={gcy + 6} textAnchor="middle" fill="#64748B" fontSize={7}>Tier-3 · 借款主体</text>
                      <text x={gcx} y={gcy + 16} textAnchor="middle" fill="#2563EB" fontSize={6.5} fontWeight={600}>脱核授信对象</text>
                    </g>
                    {/* Nodes */}
                    {gPositions.map(({ x, y, node }) => {
                      const t = DIR_MAP[node.direction];
                      const active = hoveredGraphNode === node.id || selectedGraphNode === node.id;
                      const dimmed = (hoveredGraphNode || selectedGraphNode) && hoveredGraphNode !== node.id && selectedGraphNode !== node.id;
                      const sc = strColor(node.relationStrength);
                      const shortN = node.name.length > 5 ? node.name.slice(0, 5) : node.name;
                      return (
                        <g key={node.id} opacity={dimmed ? 0.15 : 1} style={{ transition: 'opacity 0.2s', cursor: 'pointer' }}
                          onClick={() => setSelectedGraphNode(p => p === node.id ? null : node.id)}
                          onMouseEnter={() => setHoveredGraphNode(node.id)}
                          onMouseLeave={() => setHoveredGraphNode(null)}>
                          {active && <circle cx={x} cy={y} r={nodeR + 4} fill={t.stroke} opacity={0.08} />}
                          <circle cx={x} cy={y} r={nodeR} fill={t.fill} stroke={node.isMainChain ? t.stroke : t.stroke + '80'} strokeWidth={node.isMainChain ? (active ? 2 : 1.5) : (active ? 1.5 : 0.8)} filter="url(#gns)" />
                          <text x={x} y={y - 2} textAnchor="middle" fill={t.text} fontSize={9} fontWeight={600}>{shortN}</text>
                          <text x={x} y={y + 9} textAnchor="middle" fill={sc} fontSize={7} fontWeight={700}>{node.relationStrength}</text>
                          <circle cx={x + nodeR - 3} cy={y - nodeR + 3} r={3} fill={STATUS_COLOR[node.status]} stroke="white" strokeWidth={1} />
                          {node.linkedHit && <circle cx={x - nodeR + 3} cy={y - nodeR + 3} r={3} fill="#7C3AED" stroke="white" strokeWidth={1} />}
                        </g>
                      );
                    })}
                  </svg>
                </div>

                {/* Node detail & evidence (below canvas) */}
                {selNode && (
                  <div className="grid grid-cols-2 gap-3">
                    {/* Node detail */}
                    <div className="rounded-lg border border-[#E2E8F0] bg-white p-3 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <div className="text-[11px] font-semibold text-[#0F172A] flex items-center gap-1.5"><Network size={12} className="text-[#2563EB]" />当前节点详情</div>
                        <button onClick={() => setSelectedGraphNode(null)} className="text-[10px] text-[#94A3B8] hover:text-[#64748B]">×</button>
                      </div>
                      {/* Basic info */}
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: DIR_MAP[selNode.direction].stroke }} />
                        <span className="text-[13px] font-bold text-[#0F172A]">{selNode.name}</span>
                        <Badge className={cn('text-[8px] border', DIR_MAP[selNode.direction].fill, `text-[${DIR_MAP[selNode.direction].text}]`, `border-[${DIR_MAP[selNode.direction].stroke}40]`)} style={{ color: DIR_MAP[selNode.direction].text, backgroundColor: DIR_MAP[selNode.direction].fill }}>{selNode.type}</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
                        <div className="flex justify-between"><span className="text-[#64748B]">行业</span><span className="text-[#0F172A] font-medium">{selNode.industry}</span></div>
                        <div className="flex justify-between"><span className="text-[#64748B]">地区</span><span className="text-[#0F172A] font-medium">{selNode.region}</span></div>
                        <div className="flex justify-between"><span className="text-[#64748B]">链条角色</span><span className="text-[#0F172A] font-medium">{selNode.chainRole}</span></div>
                        <div className="flex justify-between"><span className="text-[#64748B]">识别状态</span><span className="text-[#0F172A] font-medium">{selNode.identifyStatus}</span></div>
                      </div>
                      {/* Identification conclusion */}
                      <div className="rounded bg-[#F8FAFC] p-2 space-y-1.5">
                        <div className="text-[10px] font-semibold text-[#0F172A]">识别结论</div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
                          <div className="flex justify-between"><span className="text-[#64748B]">候选等级</span><span className="text-[#0F172A] font-medium">{selNode.relationStrength >= 80 ? 'A 类' : selNode.relationStrength >= 60 ? 'B 类' : 'C 类'}</span></div>
                          <div className="flex justify-between"><span className="text-[#64748B]">风险状态</span><Badge className={cn('text-[8px] border', selNode.riskStatus === '正常' ? 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]' : selNode.riskStatus === '观察' ? 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]' : 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]')}>{selNode.riskStatus}</Badge></div>
                          <div className="flex justify-between"><span className="text-[#64748B]">已入候选池</span><span className={cn('font-medium', selNode.inPool ? 'text-[#047857]' : 'text-[#94A3B8]')}>{selNode.inPool ? '是' : '否'}</span></div>
                          <div className="flex justify-between"><span className="text-[#64748B]">公私联动</span><span className={cn('font-medium', selNode.linkedHit ? 'text-[#7C3AED]' : 'text-[#94A3B8]')}>{selNode.linkedHit ? '已命中' : '未命中'}</span></div>
                        </div>
                        <p className="text-[10px] text-[#475569] leading-4">
                          {selNode.relationStrength >= 70
                            ? '该主体与核心链条存在稳定关系，具备进一步进入候选识别与尽调作业的价值。'
                            : '该主体存在关系线索，但当前证据覆盖仍不足，建议先补强关键证据后再推进。'}
                        </p>
                      </div>
                      {/* Relation summary */}
                      <div className="rounded bg-[#F8FAFC] p-2 space-y-1.5">
                        <div className="text-[10px] font-semibold text-[#0F172A]">关系摘要</div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[10px]">
                          <div className="flex justify-between"><span className="text-[#64748B]">关联主体</span><span className="text-[#0F172A] font-medium">{selNode.relatedCount}</span></div>
                          <div className="flex justify-between"><span className="text-[#64748B]">高强度关系</span><span className="text-[#0F172A] font-medium">{selNode.strongRelCount}</span></div>
                          <div className="flex justify-between"><span className="text-[#64748B]">连续交易</span><span className="text-[#0F172A] font-medium">{selNode.months} 个月</span></div>
                          <div className="flex justify-between"><span className="text-[#64748B]">最近活跃</span><span className="text-[#0F172A] font-medium">{selNode.lastActive}</span></div>
                        </div>
                        <div className="space-y-0.5 mt-1">
                          <div className="flex justify-between text-[9px]"><span className="text-[#64748B]">关系强度</span><span className="font-bold" style={{ color: strColor(selNode.relationStrength) }}>{selNode.relationStrength}%</span></div>
                          <div className="w-full h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden"><div className="h-full rounded-full" style={{ width: `${selNode.relationStrength}%`, backgroundColor: strColor(selNode.relationStrength) }} /></div>
                        </div>
                      </div>
                      {/* Actions */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#A7F3D0] text-[#047857]"><ArrowRight size={9} />加入候选池</Button>
                        <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#BFDBFE] text-[#2563EB]" onClick={() => navigate('smart-due-diligence', 'dd-report')}><FileSearch size={9} />进入尽调</Button>
                        <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]" onClick={() => navigate('smart-identify', 'linked')}><Link2 size={9} />公私联动</Button>
                        <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#64748B]"><UserCheck size={9} />标记人工确认</Button>
                      </div>
                    </div>

                    {/* Evidence panel — 三流证据锚点 */}
                    <div className="rounded-lg border border-[#E2E8F0] bg-white p-3 space-y-2.5">
                      <div className="text-[11px] font-semibold text-[#0F172A] flex items-center gap-1.5">
                        <FileCheck size={12} className="text-[#047857]" />
                        {selNode.id === 'gn-1' ? '衡远包装 ↔ 盛拓模组 · 交易链路证据' : '关系证据'}
                      </div>

                      {selNode.id === 'gn-1' ? (
                        /* 盛拓模组节点：展示衡远包装与盛拓模组之间的交易证据 */
                        <div className="space-y-2.5">
                          {/* 三流匹配总览 */}
                          <div className="rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] px-3 py-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <CheckCircle2 size={14} className="text-[#047857]" />
                              <span className="text-[11px] font-semibold text-[#047857]">三流匹配率 98.6%</span>
                            </div>
                            <span className="text-[10px] text-[#047857]">衡远包装→盛拓模组 · 48笔 · 全年无断单</span>
                          </div>

                          {/* 三流指标条 */}
                          <div className="space-y-1.5">
                            {[
                              { label: '订单 → 发票', value: 100, desc: '48笔订单全部开票，100%对应' },
                              { label: '订单 → 物流', value: 100, desc: '48笔订单全部有签收记录' },
                              { label: '发票 → 回款', value: 98.6, desc: '年末大单跨年签收，属正常范围' },
                            ].map(item => (
                              <div key={item.label} className="space-y-0.5">
                                <div className="flex items-center justify-between text-[10px]">
                                  <span className="text-[#475569] font-medium">{item.label}</span>
                                  <span className="font-bold" style={{ color: item.value >= 99 ? '#047857' : '#F59E0B' }}>{item.value}%</span>
                                </div>
                                <div className="w-full h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden">
                                  <div className="h-full rounded-full transition-all" style={{ width: `${item.value}%`, backgroundColor: item.value >= 99 ? '#10B981' : '#F59E0B' }} />
                                </div>
                                <div className="text-[9px] text-[#94A3B8]">{item.desc}</div>
                              </div>
                            ))}
                          </div>

                          {/* 六维验证评分 */}
                          <div className="rounded bg-[#F8FAFC] p-2 space-y-1.5">
                            <div className="text-[10px] font-semibold text-[#0F172A]">六维验证 · 综合得分 95分</div>
                            <div className="grid grid-cols-3 gap-1.5">
                              {[
                                { dim: '连续性', score: 100 },
                                { dim: '周期性', score: 95 },
                                { dim: '对应性', score: 99 },
                                { dim: '语义性', score: 98 },
                                { dim: '集中度', score: 82 },
                                { dim: '波动性', score: 94 },
                              ].map(d => (
                                <div key={d.dim} className="text-center">
                                  <div className="text-[9px] text-[#64748B]">{d.dim}</div>
                                  <div className="text-[13px] font-bold" style={{ color: d.score >= 90 ? '#047857' : d.score >= 80 ? '#F59E0B' : '#DC2626' }}>{d.score}</div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* 关键锚点 */}
                          <div className="space-y-1.5">
                            <div className="text-[10px] font-semibold text-[#0F172A]">关键证据锚点</div>
                            {[
                              { label: 'Q4大额回款', date: '2025-12-27', amount: '119.7万', source: '交通银行流水', color: '#047857', bg: '#ECFDF5', border: '#A7F3D0' },
                              { label: 'Q3旺季收款', date: '2025-08-09', amount: '11.8万', source: '农业银行流水', color: '#2563EB', bg: '#EFF6FF', border: '#BFDBFE' },
                              { label: '工资发放验证', date: '2025-12-15', amount: '29.1万', source: '交通银行流水', color: '#7C3AED', bg: '#F3E8FF', border: '#DDD6FE' },
                            ].map(anchor => (
                              <div key={anchor.label} className="flex items-center justify-between px-2.5 py-1.5 rounded border text-[10px]"
                                style={{ backgroundColor: anchor.bg, borderColor: anchor.border }}>
                                <div className="flex items-center gap-1.5">
                                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: anchor.color }} />
                                  <span className="font-medium" style={{ color: anchor.color }}>{anchor.label}</span>
                                  <span className="text-[#94A3B8]">{anchor.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="font-bold" style={{ color: anchor.color }}>{anchor.amount}</span>
                                  <span className="text-[9px] text-[#94A3B8]">{anchor.source}</span>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* 买方集中度 */}
                          <div className="rounded bg-[#FFF7ED] border border-[#FED7AA] px-2.5 py-2 space-y-1">
                            <div className="text-[10px] font-semibold text-[#C2410C]">⚠ 集中度提示</div>
                            <div className="text-[9px] text-[#C2410C]">盛拓模组占全年订单 72.1%，超过55%阈值。属产业链结构性绑定，建议授信时加入回款归集条件。</div>
                          </div>

                          <Button size="sm" className="h-7 text-[10px] gap-1 bg-[#047857] hover:bg-[#065F46] text-white w-full"
                            onClick={() => navigate('smart-due-diligence', 'material')}>
                            <FileSearch size={10} />衡远包装链路验证通过 · 一键尽调 →
                          </Button>
                          <p className="text-[9px] text-[#94A3B8] leading-4 pt-0.5">
                            以上证据来源：行内对公流水 + 供应链平台回传。若贵行尚未接入供应链平台，可通过外勤录入或客户上传材料替代，系统将自动适配可用的验证路径。
                          </p>
                        </div>
                      ) : (
                        /* 其他节点：原有证据面板 */
                        <div className="space-y-2">
                          <p className="text-[10px] text-[#475569] leading-4">系统已基于对公流水、回款记录与物流履约信息，初步建立该节点与主链路的关联判断。</p>
                          <div className="space-y-1.5">
                            {EVIDENCE_TYPES.map(et => {
                              const matched = selNode.evidenceSources.some(es => et.includes(es.replace('增值税', '')) || es.includes(et.slice(0, 2)));
                              return (
                                <div key={et} className={cn('flex items-center justify-between px-2.5 py-1.5 rounded text-[10px] border', matched ? 'bg-[#ECFDF3] border-[#A7F3D0]' : 'bg-[#F8FAFC] border-[#E2E8F0]')}>
                                  <span className={matched ? 'text-[#047857] font-medium' : 'text-[#94A3B8]'}>{et}</span>
                                  <div className="flex items-center gap-2">
                                    {matched ? (
                                      <><span className="text-[9px] text-[#047857]">已匹配</span><Badge className="text-[7px] bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]">连续</Badge></>
                                    ) : (
                                      <span className="text-[9px] text-[#94A3B8]">未覆盖</span>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          {selNode.evidenceSources.length < 3 && (
                            <div className="rounded bg-[#FFF7ED] px-2 py-1.5 text-[9px] text-[#C2410C] flex items-start gap-1">
                              <AlertCircle size={10} className="shrink-0 mt-0.5" />
                              当前部分关系证据仍待人工确认，建议结合公私联动结果进一步核验。
                            </div>
                          )}
                          <div className="flex items-center gap-1.5">
                            <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]"><Eye size={9} />查看原始证据</Button>
                            <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]"><Filter size={9} />切换证据类型</Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {!selNode && (
                  <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 text-center">
                    <Crosshair size={20} className="text-[#CBD5E1] mx-auto mb-2" />
                    <div className="text-[11px] text-[#64748B]">点击图中节点查看详情与关系证据</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      }

      /* ═══════════════════════════════════════════════════════════
         PAGE 7: 公私联动 — 主体真实性与关联关系补强工作台
         ═══════════════════════════════════════════════════════════ */
      case 'linked': {
        interface LinkedEntity {
          id: string; companyName: string; shortName: string; uscc: string; industry: string; region: string; identifyStatus: string;
          legalPerson: string; legalIdMasked: string; controller: string; managerName: string;
          isBankClient: boolean; hasCorpAccount: boolean; hasPersonalClue: boolean; credibility: number; conclusion: string;
          links: { type: string; target: string; relation: string; basis: string; hitTime: string; strength: number; continuous: boolean; needConfirm: boolean }[];
          evidences: { source: string; period: string; summary: string; strength: 'strong' | 'medium' | 'weak'; conflict: boolean; anomaly: string; missing: string }[];
          riskStatus: string; segmentTag: string;
        }

        const LINKED_ENTITIES: LinkedEntity[] = [
          {
            id: 'le-1', companyName: '常州衡远包装材料有限公司', shortName: '衡远包装', uscc: '91320412MA1N****7X', industry: '包装材料', region: '常州', identifyStatus: '补审中',
            legalPerson: '周海峰', legalIdMasked: '3204****0XXX', controller: '周海峰', managerName: '王敏',
            isBankClient: true, hasCorpAccount: true, hasPersonalClue: true, credibility: 88, conclusion: '公私联动验证通过，法人账户与企业回款存在连续命中',
            links: [
              { type: '法人绑定企业', target: '周海峰', relation: '法人代表', basis: '工商登记', hitTime: '2026-04-01', strength: 95, continuous: true, needConfirm: false },
              { type: '法人个人账户与对公账户联动', target: '周海峰个人账户（工商银行）', relation: '资金往来', basis: '行内流水匹配', hitTime: '2026-04-08', strength: 86, continuous: true, needConfirm: false },
              { type: '个人回款与企业回款关联', target: '盛拓模组 → 衡远包装', relation: '回款路径吻合', basis: '回款记录比对', hitTime: '2026-04-07', strength: 82, continuous: true, needConfirm: false },
              { type: '个人交易对手与企业交易对手重合', target: '金利达新材料', relation: '交易对手重合', basis: '流水摘要比对', hitTime: '2026-03-28', strength: 74, continuous: false, needConfirm: true },
            ],
            evidences: [
              { source: '客户主档', period: '长期', summary: '法人张建华与企业工商登记一致', strength: 'strong', conflict: false, anomaly: '', missing: '' },
              { source: '对公账户流水', period: '2025.05-2026.04', summary: '与盛拓模组科技存在持续往来', strength: 'strong', conflict: false, anomaly: '', missing: '' },
              { source: '法人个人账户线索', period: '2025.08-2026.04', summary: '个人账户存在与企业对公账户同频资金往来', strength: 'medium', conflict: false, anomaly: '', missing: '部分月份无交易' },
              { source: '回款记录', period: '2025.06-2026.03', summary: '回款路径与企业收款路径高度一致', strength: 'strong', conflict: false, anomaly: '', missing: '' },
              { source: 'CRM 归属信息', period: '2025.11-至今', summary: '客户经理王敏名下，跟进记录完整', strength: 'medium', conflict: false, anomaly: '', missing: '' },
            ],
            riskStatus: '正常', segmentTag: 'A可授信',
          },
          {
            id: 'le-2', companyName: '溧阳佳利包装材料有限公司', shortName: '佳利包装', uscc: '91320481MA2K****3N', industry: '包装材料', region: '溧阳', identifyStatus: '已识别',
            legalPerson: '李明亮', legalIdMasked: '3204****5678', controller: '李明亮', managerName: '—',
            isBankClient: false, hasCorpAccount: false, hasPersonalClue: true, credibility: 42, conclusion: '联动线索不足，仅发现法人个人账户微弱信号',
            links: [
              { type: '法人绑定企业', target: '李明亮', relation: '法人代表', basis: '工商登记', hitTime: '2026-03-15', strength: 90, continuous: true, needConfirm: false },
              { type: '法人个人账户与对公账户联动', target: '李明亮个人账户', relation: '疑似资金往来', basis: '行内流水模糊匹配', hitTime: '2026-02-20', strength: 38, continuous: false, needConfirm: true },
            ],
            evidences: [
              { source: '客户主档', period: '长期', summary: '法人李明亮与企业工商登记一致', strength: 'strong', conflict: false, anomaly: '', missing: '' },
              { source: '法人个人账户线索', period: '2025.11-2026.02', summary: '个人账户零星交易，与企业关联性弱', strength: 'weak', conflict: false, anomaly: '联动频次不足', missing: '缺少对公账户开立信息' },
            ],
            riskStatus: '观察', segmentTag: 'C待观察',
          },
          {
            id: 'le-3', companyName: '无锡驰远物流服务有限公司', shortName: '驰远物流', uscc: '91320200MA3P****8Q', industry: '物流', region: '无锡', identifyStatus: '预授信',
            legalPerson: '陈志伟', legalIdMasked: '3202****9012', controller: '陈志伟', managerName: '刘洋',
            isBankClient: true, hasCorpAccount: true, hasPersonalClue: true, credibility: 72, conclusion: '法人联动基本成立，但实控人与经营账户联动尚需确认',
            links: [
              { type: '法人绑定企业', target: '陈志伟', relation: '法人代表', basis: '工商登记', hitTime: '2026-04-02', strength: 95, continuous: true, needConfirm: false },
              { type: '法人个人账户与对公账户联动', target: '陈志伟个人账户', relation: '资金往来', basis: '行内流水匹配', hitTime: '2026-04-05', strength: 76, continuous: true, needConfirm: false },
              { type: '实控人与经营账户联动', target: '陈志伟(实控)', relation: '经营资金关联', basis: '账户资金流向分析', hitTime: '2026-03-22', strength: 58, continuous: false, needConfirm: true },
            ],
            evidences: [
              { source: '客户主档', period: '长期', summary: '法人陈志伟与企业工商登记一致', strength: 'strong', conflict: false, anomaly: '', missing: '' },
              { source: '对公账户流水', period: '2025.07-2026.04', summary: '结算频次高，回款规律', strength: 'strong', conflict: false, anomaly: '', missing: '' },
              { source: '法人个人账户线索', period: '2025.09-2026.04', summary: '存在同频资金往来但金额较小', strength: 'medium', conflict: false, anomaly: '', missing: '' },
              { source: '行内关联关系标签', period: '2026.01-至今', summary: '标签系统已标注法人关联', strength: 'medium', conflict: false, anomaly: '账户关系待确认', missing: '' },
            ],
            riskStatus: '正常', segmentTag: 'B可做但需处理',
          },
          {
            id: 'le-4', companyName: '苏州锐信新材料有限公司', shortName: '锐信新材', uscc: '91320500MA4Q****2R', industry: '新材料', region: '苏州', identifyStatus: '已批准',
            legalPerson: '周国栋', legalIdMasked: '3205****3456', controller: '周国栋', managerName: '王敏',
            isBankClient: true, hasCorpAccount: true, hasPersonalClue: true, credibility: 81, conclusion: '公私联动验证通过，回款链路连续但存在集中度问题',
            links: [
              { type: '法人绑定企业', target: '周国栋', relation: '法人代表', basis: '工商登记', hitTime: '2026-03-20', strength: 95, continuous: true, needConfirm: false },
              { type: '法人个人账户与对公账户联动', target: '周国栋个人账户', relation: '资金往来', basis: '行内流水匹配', hitTime: '2026-04-03', strength: 84, continuous: true, needConfirm: false },
              { type: '个人回款与企业回款关联', target: '盛拓模组 → 锐信新材', relation: '回款路径吻合', basis: '回款记录比对', hitTime: '2026-03-30', strength: 78, continuous: true, needConfirm: false },
            ],
            evidences: [
              { source: '客户主档', period: '长期', summary: '法人周国栋与企业工商登记一致', strength: 'strong', conflict: false, anomaly: '', missing: '' },
              { source: '对公账户流水', period: '2024.12-2026.04', summary: '长期稳定往来，但单一客户占比偏高', strength: 'strong', conflict: false, anomaly: '交易对手映射冲突', missing: '' },
              { source: '授信与还款台账', period: '2025.06-2026.03', summary: '授信已批，还款正常', strength: 'strong', conflict: false, anomaly: '', missing: '' },
            ],
            riskStatus: '观察', segmentTag: 'B可做但需处理',
          },
          {
            id: 'le-5', companyName: '昆山瑞丰辅料有限公司', shortName: '瑞丰辅料', uscc: '91320583MA5R****6T', industry: '辅料', region: '昆山', identifyStatus: '恢复中',
            legalPerson: '吴海峰', legalIdMasked: '3205****7890', controller: '吴海峰', managerName: '张磊',
            isBankClient: true, hasCorpAccount: true, hasPersonalClue: true, credibility: 56, conclusion: '联动线索存在，但近期回款链路出现中断，需重点关注',
            links: [
              { type: '法人绑定企业', target: '吴海峰', relation: '法人代表', basis: '工商登记', hitTime: '2026-03-10', strength: 95, continuous: true, needConfirm: false },
              { type: '法人个人账户与对公账户联动', target: '吴海峰个人账户', relation: '资金往来', basis: '行内流水匹配', hitTime: '2026-03-25', strength: 64, continuous: false, needConfirm: true },
              { type: '个人回款与企业回款关联', target: '盛拓模组 → 瑞丰辅料', relation: '回款中断', basis: '回款记录比对', hitTime: '2026-02-28', strength: 45, continuous: false, needConfirm: true },
            ],
            evidences: [
              { source: '客户主档', period: '长期', summary: '法人吴海峰与企业工商登记一致', strength: 'strong', conflict: false, anomaly: '', missing: '' },
              { source: '对公账户流水', period: '2025.04-2026.04', summary: '近4周净流出，资金紧张', strength: 'medium', conflict: false, anomaly: '回款链路不连续', missing: '' },
              { source: '法人个人账户线索', period: '2025.06-2026.03', summary: '个人账户活动减少', strength: 'weak', conflict: true, anomaly: '身份信息不完整', missing: '缺少近期个人交易记录' },
            ],
            riskStatus: '中度预警', segmentTag: 'D风险经营中',
          },
        ];

        const STRENGTH_BG: Record<string, string> = { strong: 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]', medium: 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]', weak: 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]' };
        const STRENGTH_LABEL: Record<string, string> = { strong: '强', medium: '中', weak: '弱' };

        const selLE = selectedLinkedEntity ? LINKED_ENTITIES.find(e => e.id === selectedLinkedEntity) : null;
        if (!selectedLinkedEntity && LINKED_ENTITIES.length > 0 && !selLE) {
          setSelectedLinkedEntity(LINKED_ENTITIES[0].id);
        }
        const activeLE = selLE ?? LINKED_ENTITIES[0];

        const hitTotal = LINKED_ENTITIES.length;
        const highCredCount = LINKED_ENTITIES.filter(e => e.credibility >= 70).length;
        const needConfirmCount = LINKED_ENTITIES.filter(e => e.links.some(l => l.needConfirm)).length;
        const anomalyCount = LINKED_ENTITIES.filter(e => e.evidences.some(ev => ev.conflict || ev.anomaly)).length;
        const pushableLinkedCount = LINKED_ENTITIES.filter(e => e.credibility >= 60 && e.riskStatus === '正常').length;

        return (
          <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-semibold text-[#0F172A]">公私联动</h2>
                <p className="text-[11px] text-[#64748B] mt-0.5">验证企业主体与法人、实控人及关键个人线索之间的联动关系，辅助识别经营真实性与可推进价值。</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><RefreshCw size={10} />刷新联动结果</Button>
                <div className="flex items-center border border-[#E2E8F0] rounded-md overflow-hidden">
                  {([['legal', '法人联动'], ['controller', '实控人联动'], ['account', '账户联动'], ['repayment', '回款联动']] as const).map(([k, label]) => (
                    <button key={k} onClick={() => setLinkedView(k)} className={cn('px-2 py-1 text-[9px] transition-colors', linkedView === k ? 'bg-[#7C3AED] text-white' : 'text-[#64748B] hover:bg-[#F8FAFC]')}>{label}</button>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Users size={10} />查看全部主体</Button>
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Download size={10} />导出结果</Button>
              </div>
            </div>

            {/* AI Insight */}
            <AiInsight
              message={`公私联动已命中多家企业线索，交叉验证企业与法人维度后可确认推荐等级。`}
              tone="info"
            />
{/* Four-column layout */}
            <div className="grid grid-cols-[220px_1fr_1fr] gap-3" style={{ minHeight: 520 }}>

              {/* COL 1: Entity list */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-3 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                  <span className="text-[11px] font-semibold text-[#0F172A]">主体核验列表</span>
                  <p className="text-[9px] text-[#94A3B8] mt-0.5">高可信联动可作为识别补强依据</p>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {LINKED_ENTITIES.map(ent => {
                    const isActive = (activeLE?.id ?? '') === ent.id;
                    return (
                      <div key={ent.id} onClick={() => setSelectedLinkedEntity(ent.id)}
                        className={cn('px-3 py-2.5 border-b border-[#F1F5F9] cursor-pointer transition-all', isActive ? 'bg-[#F5F3FF] border-l-2 border-l-[#7C3AED]' : 'hover:bg-[#FAFBFF]')}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-semibold text-[#0F172A] truncate">{ent.shortName}</span>
                          <Badge className={cn('text-[7px] border', ent.credibility >= 70 ? 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]' : ent.credibility >= 50 ? 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]' : 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]')}>{ent.credibility}%</Badge>
                        </div>
                        <div className="text-[9px] text-[#64748B] mb-1">{ent.industry} · {ent.region}</div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {ent.isBankClient && <span className="text-[7px] px-1 py-0.5 rounded bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">本行客户</span>}
                          {ent.hasCorpAccount && <span className="text-[7px] px-1 py-0.5 rounded bg-[#ECFDF3] text-[#047857] border border-[#A7F3D0]">有对公账户</span>}
                          {ent.hasPersonalClue && <span className="text-[7px] px-1 py-0.5 rounded bg-[#F5F3FF] text-[#7C3AED] border border-[#DDD6FE]">个人线索</span>}
                        </div>
                        <div className="text-[9px] text-[#64748B] mt-1">命中 {ent.links.length} 条联动</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* COL 2: Linked relation details */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-3 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                  <span className="text-[11px] font-semibold text-[#0F172A]">联动关系明细</span>
                  <p className="text-[9px] text-[#94A3B8] mt-0.5">请重点关注关系是否连续、依据是否充分</p>
                </div>
                {activeLE ? (
                  <div className="flex-1 overflow-y-auto p-3 space-y-3">
                    {/* Entity basic info */}
                    <div className="rounded bg-[#F8FAFC] p-2.5 space-y-1.5">
                      <div className="text-[12px] font-bold text-[#0F172A]">{activeLE.companyName}</div>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[10px]">
                        <div className="flex justify-between"><span className="text-[#64748B]">统一信用代码</span><span className="text-[#0F172A] font-mono text-[9px]">{activeLE.uscc}</span></div>
                        <div className="flex justify-between"><span className="text-[#64748B]">法人</span><span className="text-[#0F172A] font-medium">{activeLE.legalPerson}</span></div>
                        <div className="flex justify-between"><span className="text-[#64748B]">法人身份证</span><span className="text-[#0F172A] font-mono text-[9px]">{activeLE.legalIdMasked}</span></div>
                        <div className="flex justify-between"><span className="text-[#64748B]">实控人</span><span className="text-[#0F172A] font-medium">{activeLE.controller}</span></div>
                        <div className="flex justify-between"><span className="text-[#64748B]">客户经理</span><span className="text-[#0F172A] font-medium">{activeLE.managerName}</span></div>
                        <div className="flex justify-between"><span className="text-[#64748B]">识别状态</span><span className="text-[#0F172A] font-medium">{activeLE.identifyStatus}</span></div>
                      </div>
                    </div>

                    {/* Verification result */}
                    <div className="rounded bg-[#F8FAFC] p-2.5 space-y-1.5">
                      <div className="text-[10px] font-semibold text-[#0F172A]">核验结果</div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="text-[10px]"><div className={cn('font-bold', activeLE.isBankClient ? 'text-[#047857]' : 'text-[#94A3B8]')}>{activeLE.isBankClient ? '是' : '否'}</div><div className="text-[8px] text-[#94A3B8]">本行客户</div></div>
                        <div className="text-[10px]"><div className={cn('font-bold', activeLE.hasCorpAccount ? 'text-[#047857]' : 'text-[#94A3B8]')}>{activeLE.hasCorpAccount ? '是' : '否'}</div><div className="text-[8px] text-[#94A3B8]">对公账户</div></div>
                        <div className="text-[10px]"><div className={cn('font-bold', activeLE.hasPersonalClue ? 'text-[#7C3AED]' : 'text-[#94A3B8]')}>{activeLE.hasPersonalClue ? '有' : '无'}</div><div className="text-[8px] text-[#94A3B8]">个人线索</div></div>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] text-[#64748B]">联动可信度</span>
                        <div className="flex-1 h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden"><div className="h-full rounded-full" style={{ width: `${activeLE.credibility}%`, backgroundColor: activeLE.credibility >= 70 ? '#047857' : activeLE.credibility >= 50 ? '#F59E0B' : '#DC2626' }} /></div>
                        <span className="text-[10px] font-bold" style={{ color: activeLE.credibility >= 70 ? '#047857' : activeLE.credibility >= 50 ? '#F59E0B' : '#DC2626' }}>{activeLE.credibility}%</span>
                      </div>
                      <p className="text-[10px] text-[#475569] leading-4">{activeLE.conclusion}</p>
                    </div>

                    {/* Links */}
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-semibold text-[#0F172A]">联动命中 ({activeLE.links.length})</div>
                      {activeLE.links.map((lk, i) => (
                        <div key={i} className={cn('rounded border px-2.5 py-2 text-[10px] space-y-1', lk.needConfirm ? 'border-[#FED7AA] bg-[#FFFBEB]' : 'border-[#E2E8F0] bg-white')}>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-[#0F172A]">{lk.type}</span>
                            <div className="flex items-center gap-1.5">
                              {lk.continuous && <Badge className="text-[7px] bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]">连续</Badge>}
                              {lk.needConfirm && <Badge className="text-[7px] bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]">待确认</Badge>}
                              <span className="font-bold" style={{ color: lk.strength >= 70 ? '#047857' : lk.strength >= 50 ? '#F59E0B' : '#DC2626' }}>{lk.strength}%</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 text-[9px] text-[#64748B]">
                            <span>关联: {lk.target}</span><span>关系: {lk.relation}</span>
                          </div>
                          <div className="flex items-center gap-3 text-[9px] text-[#94A3B8]">
                            <span>依据: {lk.basis}</span><span>命中: {lk.hitTime}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action row */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]"><Eye size={9} />查看命中依据</Button>
                      <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]"><Filter size={9} />切换联动类型</Button>
                      <Button variant="ghost" size="sm" className="h-6 text-[9px] text-[#64748B]">查看更多</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center p-4 text-center">
                    <div><Search size={20} className="text-[#CBD5E1] mx-auto mb-2" /><div className="text-[10px] text-[#94A3B8]">请选择一个主体查看联动关系</div></div>
                  </div>
                )}
              </div>

              {/* COL 3: Evidence & anomaly */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-3 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                  <span className="text-[11px] font-semibold text-[#0F172A]">证据与异常提示</span>
                </div>
                {activeLE ? (
                  <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                    <p className="text-[10px] text-[#475569] leading-4">当前证据已支持部分联动关系成立，但仍存在待确认项。异常标签将直接影响候选识别与尽调可信度判断。</p>

                    {/* Evidence items */}
                    <div className="space-y-1.5">
                      {activeLE.evidences.map((ev, i) => (
                        <div key={i} className={cn('rounded border px-2.5 py-2 text-[10px] space-y-1', ev.conflict ? 'border-[#FCA5A5] bg-[#FEF2F2]' : ev.anomaly ? 'border-[#FED7AA] bg-[#FFFBEB]' : 'border-[#E2E8F0] bg-white')}>
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-[#0F172A]">{ev.source}</span>
                            <Badge className={cn('text-[7px] border', STRENGTH_BG[ev.strength])}>{STRENGTH_LABEL[ev.strength]}</Badge>
                          </div>
                          <div className="text-[9px] text-[#64748B]">{ev.period}</div>
                          <div className="text-[9px] text-[#475569]">{ev.summary}</div>
                          {ev.anomaly && (
                            <div className="flex items-center gap-1 text-[9px] text-[#C2410C]"><AlertTriangle size={9} />{ev.anomaly}</div>
                          )}
                          {ev.conflict && (
                            <div className="flex items-center gap-1 text-[9px] text-[#DC2626]"><AlertCircle size={9} />存在冲突</div>
                          )}
                          {ev.missing && (
                            <div className="text-[9px] text-[#94A3B8]">待补充: {ev.missing}</div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Anomaly summary */}
                    {activeLE.evidences.some(ev => ev.anomaly || ev.conflict || ev.missing) && (
                      <div className="rounded bg-[#FFF7ED] px-2.5 py-2 text-[9px] text-[#C2410C] space-y-1">
                        <div className="font-semibold flex items-center gap-1"><AlertCircle size={10} />异常摘要</div>
                        {activeLE.evidences.filter(ev => ev.anomaly).map((ev, i) => (
                          <div key={i}>· {ev.source}: {ev.anomaly}</div>
                        ))}
                        {activeLE.evidences.filter(ev => ev.conflict).map((ev, i) => (
                          <div key={i}>· {ev.source}: 存在冲突线索</div>
                        ))}
                        {activeLE.evidences.filter(ev => ev.missing).map((ev, i) => (
                          <div key={i}>· {ev.source}: 待补充 — {ev.missing}</div>
                        ))}
                        <p className="mt-1 text-[#94A3B8]">如存在身份不完整、账户关系不清或回款链路不连续，请先补充信息后再推进。</p>
                      </div>
                    )}

                    {/* Evidence actions */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]"><Eye size={9} />查看原始证据</Button>
                      <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]"><Download size={9} />下载异常清单</Button>
                      <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#BFDBFE] text-[#2563EB]"><Upload size={9} />补充信息</Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center p-4 text-center">
                    <div className="text-[10px] text-[#94A3B8]">请选择主体查看证据</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      }

      default:
        onModuleChange('file-import');
        return null;
    }
  };

  const renderAiPanel = () => {
    const titles: Record<string, string> = {
      'file-import': 'AI 名单导入引导',
      feed: 'AI 智能筛选引导',
      list: 'AI 候选资产判断',
      graph: 'AI 关系图谱判断',
      linked: 'AI 公私联动判断',
    };
    const guides: Record<string, string> = {
      'file-import': '当前步骤：名单导入。通过文件上传或API接口导入企业名单，系统自动解析并生成推荐池。完成后进入智能筛选环节。',
      feed: '当前步骤：智能筛选。基于多维度评分模型对企业进行筛选与排序，优先推荐高匹配度企业。关注识别判断中的风险提示。',
      list: '当前步骤：候选资产管理。对筛选通过的企业进行详细尽调评估，查看AI判断结论，决定是否进入尽调流程。',
      graph: '当前步骤：关系图谱。可视化展示企业间股权、担保、交易等关联关系，识别潜在风险传导路径。',
      linked: '当前步骤：公私联动。打通对公与对私数据，交叉验证企业主个人信用与企业经营状况，补强尽调证据链。',
    };
    const nextSteps: Record<string, { label: string; target: string }[]> = {
      'file-import': [{ label: '进入智能筛选', target: 'feed' }],
      feed: [{ label: '查看候选资产', target: 'list' }, { label: '查看关系图谱', target: 'graph' }],
      list: [{ label: '进入关系图谱', target: 'graph' }, { label: '公私联动', target: 'linked' }],
      graph: [{ label: '进入候选资产', target: 'list' }, { label: '公私联动', target: 'linked' }],
      linked: [{ label: '返回关系图谱', target: 'graph' }, { label: '返回候选资产', target: 'list' }],
    };
    const steps = nextSteps[activeModule] ?? [];
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-1.5">
          <Sparkles size={12} className="text-primary" />
          <span className="text-[11px] font-semibold">{titles[activeModule] ?? 'AI 引导'}</span>
        </div>
        <p className="text-[11px] text-muted-foreground leading-relaxed">{guides[activeModule] ?? ''}</p>
        {steps.length > 0 && (
          <div className="space-y-1.5 pt-2 border-t border-border">
            <span className="text-[10px] text-muted-foreground">快捷导航</span>
            {steps.map(s => (
              <Button key={s.target} variant="outline" size="sm" className="h-7 text-[10px] gap-1 w-full" onClick={() => onModuleChange(s.target)}>
                <ArrowRight size={10} />{s.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative">
      {/* CSV 解析成功 Toast */}
      {csvToast?.visible && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-lg bg-[#0F172A] text-white px-4 py-2.5 shadow-xl text-[12px] animate-in fade-in slide-in-from-bottom-2 duration-300">
          <span className="text-[#4ADE80]">✓</span>
          <span>成功解析 <strong>{csvToast.count}</strong> 条企业数据，推荐列表已更新</span>
          <button onClick={() => setCsvToast(null)} className="ml-2 text-[#94A3B8] hover:text-white">✕</button>
        </div>
      )}
      <SceneLayout
        title={scene.title}
        modules={scene.modules}
        activeModule={activeModule}
        onModuleChange={onModuleChange}
        contextSlot={
          <FlowProgress
            steps={IDENTIFY_FLOW_STEPS}
            currentStepId={getFlowStepId(activeModule)}
            onStepClick={(id) => {
              // Map flow step back to actual module
              if (id === 'file-import') onModuleChange('file-import');
              else if (id === 'feed') onModuleChange('feed');
              else if (id === 'graph') onModuleChange('graph');
            }}
          />
        }
        aiPanel={renderAiPanel()}
      >
        {renderContent()}
      </SceneLayout>
    </div>
  );
}
