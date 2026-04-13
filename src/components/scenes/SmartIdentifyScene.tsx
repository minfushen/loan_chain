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
import { MetricCard, AiNote } from '../ProductPrimitives';

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
   智能推荐流 — 推荐数据
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
  if (s.agentHints.confidence >= 80 && s.evidenceCoverage >= 80) return '优先推荐';
  if (s.agentHints.confidence >= 60) return '建议关注';
  return '待人工确认';
}

const RECOMMEND_ITEMS: RecommendItem[] = SAMPLES.map(s => ({
  sampleId: s.id,
  level: getRecommendLevel(s),
  scene: s.productType,
  hitRules: [
    s.orderCount90d >= 15 ? '订单稳定性通过' : '订单频次偏低',
    s.invoiceContinuityMonths >= 10 ? '开票连续性通过' : '开票连续性一般',
    s.relationStrength >= 70 ? '关系强度较高' : '关系强度待确认',
  ].filter(Boolean),
  reasons: [
    s.orderCount90d >= 15 ? `近 90 天 ${s.orderCount90d} 笔稳定交易` : `近 90 天 ${s.orderCount90d} 笔交易，频次偏低`,
    s.relationStrength >= 70 ? `关系强度 ${s.relationStrength}%，链上位置清晰` : `关系强度 ${s.relationStrength}%，需补充验证`,
  ],
  riskHint: s.riskFlags.length > 0
    ? `存在 ${s.riskFlags.length} 项风险标识：${s.riskFlags.join('、')}`
    : '当前未发现明显风险信号',
  nextAction: s.nextAction,
  suggestedPage: s.agentHints.confidence >= 80 ? '智能尽调' : s.agentHints.confidence >= 60 ? '条件筛选流' : '人工确认',
  recommendTime: '2026-04-09 09:30',
  sourceBatch: 'BATCH-20260409-001',
}));

/* ══════════════════════════════════════════════════════════════════
   Component
   ══════════════════════════════════════════════════════════════════ */

interface Props { activeModule: string; onModuleChange: (id: string) => void }

export default function SmartIdentifyScene({ activeModule, onModuleChange }: Props) {
  const scene = SCENES.find(s => s.id === 'smart-identify')!;
  const { navigate } = useDemo();
  const [selectedBatch, setSelectedBatch] = React.useState<string | null>(null);
  const [drawerTab, setDrawerTab] = React.useState<'info' | 'validate' | 'sample' | 'timeline'>('info');
  const [apiSection, setApiSection] = React.useState<'overview' | 'batches' | 'mapping'>('overview');
  const [selectedRecommend, setSelectedRecommend] = React.useState<string | null>(RECOMMEND_ITEMS[0]?.sampleId ?? null);
  const [selectedFilter, setSelectedFilter] = React.useState<string | null>(SAMPLES[0]?.id ?? null);
  const [filterExpanded, setFilterExpanded] = React.useState(true);
  const [selectedCandidate, setSelectedCandidate] = React.useState<string | null>(SAMPLES[0]?.id ?? null);
  const [selectedGraphNode, setSelectedGraphNode] = React.useState<string | null>(null);
  const [hoveredGraphNode, setHoveredGraphNode] = React.useState<string | null>(null);
  const [graphView, setGraphView] = React.useState<'trade' | 'fund' | 'logistics' | 'linked'>('trade');
  const [selectedLinkedEntity, setSelectedLinkedEntity] = React.useState<string | null>(null);
  const [linkedView, setLinkedView] = React.useState<'legal' | 'controller' | 'account' | 'repayment'>('legal');

  const renderContent = () => {
    switch (activeModule) {

      /* ═══════════════════════════════════════════════════════════
         PAGE 1: 文件导入 — 批次管理台
         ═══════════════════════════════════════════════════════════ */
      case 'file-import': {
        const batch = IMPORT_BATCHES.find(b => b.id === selectedBatch);
        const statusGroups: BatchStatus[] = ['待校验', '待修正', '待生成样本', '待进入识别', '已完成'];
        const countByStatus = (s: BatchStatus) => IMPORT_BATCHES.filter(b => b.status === s);

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
                {batch.status === '待生成样本' && <Button size="sm" className="h-7 text-[10px] gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white"><Sparkles size={10} />生成样本</Button>}
                {batch.status === '待进入识别' && <Button size="sm" className="h-7 text-[10px] gap-1 bg-[#047857] hover:bg-[#065F46] text-white"><ArrowRight size={10} />进入识别</Button>}
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
                      { label: '文件名', value: batch.fileName },
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
            {/* Header */}
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] flex items-center justify-center"><Upload size={15} className="text-[#2563EB]" /></div>
                <div>
                  <h3 className="text-sm font-semibold text-[#0F172A]">文件导入</h3>
                  <p className="text-[11px] text-[#94A3B8]">通过 Excel / CSV 导入企业名单，完成批次校验、异常修正与样本生成。</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 text-[#64748B] border-[#E2E8F0]"><FileText size={10} />查看字段要求</Button>
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 text-[#64748B] border-[#E2E8F0]"><Download size={10} />下载模板</Button>
                <Button size="sm" className="h-7 text-[10px] gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white"><Upload size={10} />上传文件</Button>
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
                            {b.status === '待生成样本' && <Button size="sm" className="h-6 text-[10px] px-2 gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white"><Sparkles size={9} />生成样本</Button>}
                            {b.status === '待进入识别' && <>
                              <Button variant="outline" size="sm" className="h-6 text-[10px] px-2 gap-1 text-[#2563EB] border-[#BFDBFE]" onClick={() => { setSelectedBatch(b.id); setDrawerTab('sample'); }}><Eye size={9} />查看样本</Button>
                              <Button size="sm" className="h-6 text-[10px] px-2 gap-1 bg-[#047857] hover:bg-[#065F46] text-white"><ArrowRight size={9} />进入识别</Button>
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
          </div>
        );
      }

      /* ═══════════════════════════════════════════════════════════
         PAGE 2: API 接入 — 接口 + 批次 + 映射管理台
         ═══════════════════════════════════════════════════════════ */
      case 'api-access': {
        const sections = [
          { id: 'overview' as const, label: '接口概览' },
          { id: 'batches' as const, label: '运行批次' },
          { id: 'mapping' as const, label: '字段映射' },
        ];

        return (
          <div className="space-y-4">
            {/* Header */}
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#F3E8FF] flex items-center justify-center"><Plug size={15} className="text-[#7C3AED]" /></div>
                <div>
                  <h3 className="text-sm font-semibold text-[#0F172A]">API 接入</h3>
                  <p className="text-[11px] text-[#94A3B8]">通过行内 ESB 总线接入企业名单批次，管理接口状态、字段映射与运行结果。</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 text-[#64748B] border-[#E2E8F0]"><BookOpen size={10} />查看接口文档</Button>
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 text-[#2563EB] border-[#BFDBFE]"><Play size={10} />发起测试</Button>
                <Button size="sm" className="h-7 text-[10px] gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white"><Plug size={10} />新建接入</Button>
              </div>
            </div>

            {/* Section tabs */}
            <div className="flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-1">
              {sections.map(t => (
                <button key={t.id} onClick={() => setApiSection(t.id)} className={cn('px-3 py-1.5 rounded-md text-[11px] font-medium transition-all', apiSection === t.id ? 'bg-white text-[#0F172A] shadow-sm border border-[#E2E8F0]' : 'text-[#64748B] hover:text-[#334155]')}>{t.label}</button>
              ))}
            </div>

            {apiSection === 'overview' && (
              <div className="space-y-4">
                {/* Status overview */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <MetricCard label="已连接接口" value={`${API_INTERFACES.length} 套`} detail="当前已建立的名单接入接口数量" tone="blue" />
                  <MetricCard label="运行中批次" value={`${API_BATCHES.filter(b => b.status === '运行中').length}`} detail="正在校验、生成或等待流转" tone="slate" />
                  <MetricCard label="失败批次" value={`${API_BATCHES.filter(b => b.status === '失败').length}`} detail="接入异常或字段映射失败" tone="red" />
                  <MetricCard label="待重试批次" value={`${API_BATCHES.filter(b => b.status === '待重试').length}`} detail="可重新处理的失败批次" tone="amber" />
                  <MetricCard label="最近成功" value="09:42" detail="最近一次成功完成接入" tone="green" />
                </div>

                {/* Interface cards */}
                <div className="space-y-2">
                  <div className="text-[12px] font-semibold text-[#0F172A] px-1">接入接口</div>
                  {API_INTERFACES.map(intf => (
                    <div key={intf.id} className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden hover:border-[#BFDBFE] transition-all">
                      <div className="px-4 py-3 flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#F3E8FF] flex items-center justify-center shrink-0"><Cable size={14} className="text-[#7C3AED]" /></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[13px] font-semibold text-[#0F172A]">{intf.name}</span>
                            <Badge className={cn('text-[9px] border', intf.status === '已连接' ? 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]' : 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]')}>{intf.status}</Badge>
                            <Badge className="text-[9px] bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]">{intf.type}</Badge>
                          </div>
                          <div className="text-[10px] text-[#94A3B8] mt-0.5">{intf.desc}</div>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] text-[#64748B] shrink-0">
                          <span>成功率 <b className="text-[#047857]">{intf.successRate}</b></span>
                          <span>最近调用 <b>{intf.lastCall}</b></span>
                          <span>近期 <b>{intf.recentBatches}</b> 批次</span>
                          <span>均耗 <b>{intf.avgDuration}</b></span>
                        </div>
                      </div>
                      <div className="px-4 py-2 bg-[#FAFBFC] border-t border-[#F1F5F9] flex items-center justify-between">
                        <div className="flex items-center gap-2 text-[10px] text-[#94A3B8]">
                          <span>编码: <code className="font-mono">{intf.code}</code></span>
                          <span>·</span>
                          <span>影响: {intf.affectedModules.join(' / ')}</span>
                          {intf.exceptionCount > 0 && <><span>·</span><span className="text-[#DC2626]">异常 {intf.exceptionCount}</span></>}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Button variant="outline" size="sm" className="h-6 text-[10px] px-2 text-[#64748B] border-[#E2E8F0]">查看配置</Button>
                          <Button variant="outline" size="sm" className="h-6 text-[10px] px-2 text-[#2563EB] border-[#BFDBFE]">测试连接</Button>
                          <Button variant="outline" size="sm" className="h-6 text-[10px] px-2 text-[#64748B] border-[#E2E8F0]" onClick={() => setApiSection('batches')}>查看批次</Button>
                          <Button variant="outline" size="sm" className="h-6 text-[10px] px-2 text-[#64748B] border-[#E2E8F0]" onClick={() => setApiSection('mapping')}>查看映射</Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {apiSection === 'batches' && (
              <div className="space-y-4">
                {/* Running batches */}
                {(() => {
                  const running = API_BATCHES.filter(b => b.status === '运行中');
                  return running.length > 0 && (
                    <div className="space-y-2">
                      <div className="px-1"><span className="text-[12px] font-semibold text-[#0F172A]">运行中批次</span><span className="text-[10px] text-[#94A3B8] ml-2">当前正在接收、校验或生成样本的 API 批次</span></div>
                      {running.map(b => (
                        <div key={b.id} className="rounded-lg border border-[#BFDBFE] bg-white px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2"><code className="text-[12px] font-mono font-semibold text-[#0F172A]">{b.id}</code><Badge className={cn('text-[9px] border', API_BATCH_STATUS_STYLE[b.status])}>{b.status}</Badge></div>
                              <div className="text-[10px] text-[#94A3B8] mt-0.5">来源：{b.sourceInterface}</div>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] text-[#64748B]">
                              <span>接收 <b>{b.totalCount}</b> 户</span>
                              <span>已校验 <b>{b.validatedCount}</b></span>
                              {b.exceptionCount > 0 && <span>异常 <b className="text-[#DC2626]">{b.exceptionCount}</b></span>}
                            </div>
                            <Button variant="outline" size="sm" className="h-6 text-[10px] px-2 text-[#2563EB] border-[#BFDBFE]"><Eye size={9} className="mr-1" />查看详情</Button>
                          </div>
                          <div className="text-[10px] text-[#94A3B8] mt-1.5">当前步骤：{b.currentStep}</div>
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {/* Failed / retry batches */}
                {(() => {
                  const failed = API_BATCHES.filter(b => b.status === '失败' || b.status === '待重试');
                  return failed.length > 0 && (
                    <div className="space-y-2">
                      <div className="px-1"><span className="text-[12px] font-semibold text-[#0F172A]">失败 / 待重试批次</span><span className="text-[10px] text-[#94A3B8] ml-2">接口异常、字段缺失或映射失败的批次</span></div>
                      {failed.map(b => (
                        <div key={b.id} className={cn('rounded-lg border bg-white px-4 py-3', b.status === '失败' ? 'border-[#FCA5A5]' : 'border-[#FED7AA]')}>
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2"><code className="text-[12px] font-mono font-semibold text-[#0F172A]">{b.id}</code><Badge className={cn('text-[9px] border', API_BATCH_STATUS_STYLE[b.status])}>{b.status}</Badge></div>
                              <div className="text-[10px] text-[#94A3B8] mt-0.5">来源：{b.sourceInterface} · {b.receiveTime}</div>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] text-[#64748B]">
                              <span>接收 <b>{b.totalCount}</b> 户</span>
                              <span>异常 <b className="text-[#DC2626]">{b.exceptionCount}</b></span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Button variant="outline" size="sm" className="h-6 text-[10px] px-2 text-[#DC2626] border-[#FCA5A5]"><AlertCircle size={9} className="mr-1" />查看问题</Button>
                              {b.canRetry && <Button variant="outline" size="sm" className="h-6 text-[10px] px-2 text-[#2563EB] border-[#BFDBFE]"><RefreshCw size={9} className="mr-1" />重新处理</Button>}
                              <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2 text-[#64748B]"><Send size={9} className="mr-1" />通知上游</Button>
                            </div>
                          </div>
                          {b.failReason && <div className="mt-2 rounded bg-[#FEF2F2] border border-[#FCA5A5] px-3 py-1.5 text-[10px] text-[#DC2626]">失败原因：{b.failReason}</div>}
                          {b.affectedAction && <div className="text-[10px] text-[#94A3B8] mt-1">影响：{b.affectedAction}</div>}
                        </div>
                      ))}
                    </div>
                  );
                })()}

                {/* Completed batches */}
                {(() => {
                  const completed = API_BATCHES.filter(b => b.status === '已完成');
                  return completed.length > 0 && (
                    <div className="space-y-2">
                      <div className="px-1"><span className="text-[12px] font-semibold text-[#0F172A]">已完成批次</span></div>
                      {completed.map(b => (
                        <div key={b.id} className="rounded-lg border border-[#A7F3D0] bg-white px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2"><code className="text-[12px] font-mono font-semibold text-[#0F172A]">{b.id}</code><Badge className={cn('text-[9px] border', API_BATCH_STATUS_STYLE[b.status])}>{b.status}</Badge></div>
                              <div className="text-[10px] text-[#94A3B8] mt-0.5">来源：{b.sourceInterface} · {b.receiveTime}</div>
                            </div>
                            <div className="flex items-center gap-3 text-[10px] text-[#64748B]">
                              <span>接收 <b>{b.totalCount}</b> 户</span>
                              <span>已生成 <b className="text-[#047857]">{b.generatedSamples}</b> 样本</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Button variant="outline" size="sm" className="h-6 text-[10px] px-2 text-[#047857] border-[#A7F3D0]"><CheckCircle2 size={9} className="mr-1" />查看结果</Button>
                              <Button size="sm" className="h-6 text-[10px] px-2 gap-1 bg-[#047857] hover:bg-[#065F46] text-white"><ArrowRight size={9} />进入识别</Button>
                            </div>
                          </div>
                          <div className="text-[10px] text-[#94A3B8] mt-1.5">当前步骤：{b.currentStep}</div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>
            )}

            {apiSection === 'mapping' && (
              <div className="space-y-4">
                <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-3 flex items-center justify-between">
                  <div>
                    <div className="text-[12px] font-semibold text-[#0F172A]">字段映射概览</div>
                    <div className="text-[10px] text-[#94A3B8] mt-0.5">查看上游字段与中台标准字段的映射关系及当前状态</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 text-[#64748B] border-[#E2E8F0]"><Download size={10} />导出映射模板</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 text-[#2563EB] border-[#BFDBFE]"><ExternalLink size={10} />查看完整映射规则</Button>
                  </div>
                </div>

                <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
                  <div className="grid grid-cols-[120px_120px_1fr_60px_1fr_60px] gap-0 px-4 py-2 bg-[#F8FAFC] text-[9px] font-medium text-[#94A3B8] uppercase tracking-wider border-b border-[#E2E8F0]">
                    <div>上游字段</div><div>中台字段</div><div>字段说明</div><div>必填</div><div>转换规则</div><div>状态</div>
                  </div>
                  {FIELD_MAPPINGS.map(m => (
                    <div key={m.upstream} className="grid grid-cols-[120px_120px_1fr_60px_1fr_60px] gap-0 px-4 py-2.5 border-b border-[#F1F5F9] last:border-b-0 items-center hover:bg-[#FAFBFF] transition-colors">
                      <code className="text-[10px] text-[#7C3AED] font-mono">{m.upstream}</code>
                      <span className="text-[11px] font-medium text-[#0F172A]">{m.local}</span>
                      <span className="text-[10px] text-[#64748B]">{m.desc}</span>
                      <span>{m.required ? <CheckCircle2 size={10} className="text-[#047857]" /> : <span className="text-[10px] text-[#CBD5E1]">—</span>}</span>
                      <span className="text-[10px] text-[#475569]">{m.transform}</span>
                      <Badge className={cn('text-[9px] border', m.status === '正常' ? 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]' : 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]')}>{m.status}</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      }

      /* ═══════════════════════════════════════════════════════════
         PAGE 3: 智能推荐流 — 三栏工作流
         ═══════════════════════════════════════════════════════════ */
      case 'feed': {
        const levels: RecommendLevel[] = ['优先推荐', '建议关注', '待人工确认'];
        const currentItem = RECOMMEND_ITEMS.find(r => r.sampleId === selectedRecommend);
        const currentSample = SAMPLES.find(s => s.id === selectedRecommend);

        const overviewCards = [
          { label: '今日新增推荐', value: RECOMMEND_ITEMS.length, desc: '系统今日新识别出的推荐企业', icon: Sparkles, color: 'text-[#2563EB]' },
          { label: '高置信度推荐', value: RECOMMEND_ITEMS.filter(r => r.level === '优先推荐').length, desc: '关系与证据覆盖较强，建议优先处理', icon: Star, color: 'text-[#F59E0B]' },
          { label: '待进入筛选', value: RECOMMEND_ITEMS.filter(r => r.suggestedPage === '条件筛选流').length, desc: '推荐已生成，待进一步筛选确认', icon: Filter, color: 'text-[#7C3AED]' },
          { label: '待进入尽调', value: RECOMMEND_ITEMS.filter(r => r.suggestedPage === '智能尽调').length, desc: '已具备基础条件，可推进尽调作业', icon: FileSearch, color: 'text-[#047857]' },
          { label: '待人工确认', value: RECOMMEND_ITEMS.filter(r => r.level === '待人工确认').length, desc: '存在边界情况，建议人工补充判断', icon: UserCheck, color: 'text-[#64748B]' },
        ];

        return (
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-semibold text-[#0F172A]">智能推荐流</h2>
                <p className="text-[11px] text-[#64748B] mt-0.5">基于导入名单、规则命中与关系识别结果，自动推荐优先关注的候选企业。</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><RefreshCw size={10} />刷新推荐</Button>
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Filter size={10} />批量进入筛选</Button>
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><FileSearch size={10} />批量进入尽调</Button>
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><BookOpen size={10} />查看规则依据</Button>
              </div>
            </div>

            {/* Overview cards */}
            <div className="grid grid-cols-5 gap-3">
              {overviewCards.map(c => (
                <div key={c.label} className="rounded-lg border border-[#E2E8F0] bg-white p-3 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <c.icon size={12} className={c.color} />
                    <span className="text-[10px] text-[#64748B]">{c.label}</span>
                  </div>
                  <div className="text-[20px] font-bold text-[#0F172A]">{c.value}</div>
                  <div className="text-[9px] text-[#94A3B8]">{c.desc}</div>
                </div>
              ))}
            </div>

            {/* Three-column layout */}
            <div className="grid grid-cols-[280px_1fr_280px] gap-3" style={{ minHeight: 520 }}>

              {/* LEFT: Recommendation list grouped by level */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-3 py-2.5 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                  <span className="text-[11px] font-semibold text-[#0F172A]">推荐流</span>
                  <span className="text-[9px] text-[#94A3B8] ml-2">{RECOMMEND_ITEMS.length} 家企业</span>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {levels.map(level => {
                    const items = RECOMMEND_ITEMS.filter(r => r.level === level);
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
                          const sample = SAMPLES.find(s => s.id === item.sampleId)!;
                          const isActive = selectedRecommend === item.sampleId;
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
                                <span className="text-[12px] font-semibold text-[#0F172A] truncate">{sample.shortName}</span>
                                <Badge className={cn('text-[8px] border', ls.bg, ls.text, ls.border)}>{level}</Badge>
                              </div>
                              <div className="text-[9px] text-[#64748B] mb-1.5">{sample.roleInChain} · {sample.chainName}</div>
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
                                    <div className="h-full rounded-full bg-[#2563EB]" style={{ width: `${sample.agentHints.confidence}%` }} />
                                  </div>
                                  <span className="text-[9px] font-medium text-[#0F172A]">{sample.agentHints.confidence}%</span>
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
                {currentSample && currentItem ? (
                  <>
                    <div className="px-4 py-3 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                      <div className="flex items-center justify-between">
                        <span className="text-[12px] font-semibold text-[#0F172A]">当前推荐详情</span>
                        <div className="flex items-center gap-1.5">
                          <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]" onClick={() => navigate('smart-identify', 'filter-flow')}><Filter size={9} />进入条件筛选</Button>
                          <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]" onClick={() => navigate('smart-identify', 'list')}><Layers size={9} />加入候选池</Button>
                          <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]" onClick={() => navigate('smart-due-diligence', 'dd-report')}><FileSearch size={9} />进入尽调</Button>
                          <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]" onClick={() => navigate('smart-identify', 'graph')}><Network size={9} />关系图谱</Button>
                          <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]" onClick={() => navigate('smart-identify', 'linked')}><Link2 size={9} />公私联动</Button>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                      {/* Entity info */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[15px] font-bold text-[#0F172A]">{currentSample.companyName}</span>
                          <Badge className={cn('text-[9px] border', RECOMMEND_LEVEL_STYLE[currentItem.level].bg, RECOMMEND_LEVEL_STYLE[currentItem.level].text, RECOMMEND_LEVEL_STYLE[currentItem.level].border)}>{currentItem.level}</Badge>
                        </div>
                        <div className="flex items-center gap-3 text-[10px] text-[#64748B]">
                          <span>{currentSample.roleInChain}</span>
                          <span className="text-[#CBD5E1]">·</span>
                          <span>{currentSample.chainName}</span>
                          <span className="text-[#CBD5E1]">·</span>
                          <span>年销售 {currentSample.annualSales}</span>
                          <span className="text-[#CBD5E1]">·</span>
                          <span>{currentSample.productType}</span>
                        </div>
                      </div>

                      {/* Identification judgment */}
                      <div className="rounded-lg border border-[#E2E8F0] p-3 space-y-2">
                        <div className="text-[11px] font-semibold text-[#0F172A] flex items-center gap-1.5"><Brain size={12} className="text-[#7C3AED]" />识别判断</div>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-[#64748B]">识别结论</span>
                            <span className="font-medium text-[#0F172A]">{currentSample.segmentTag}</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-[#64748B]">推荐场景</span>
                            <span className="font-medium text-[#0F172A]">{currentItem.scene}</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-[#64748B]">推荐额度区间</span>
                            <span className="font-medium text-[#0F172A]">{currentSample.recommendedLimit}</span>
                          </div>
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-[#64748B]">当前阶段建议</span>
                            <span className="font-medium text-[#2563EB]">{currentSample.nextAction}</span>
                          </div>
                        </div>
                        <p className="text-[10px] text-[#475569] bg-[#F8FAFC] rounded px-2.5 py-1.5 mt-1 leading-4">{currentSample.aiSummary}</p>
                      </div>

                      {/* Evidence summary */}
                      <div className="rounded-lg border border-[#E2E8F0] p-3 space-y-2">
                        <div className="text-[11px] font-semibold text-[#0F172A] flex items-center gap-1.5"><Shield size={12} className="text-[#047857]" />证据摘要</div>
                        <div className="grid grid-cols-3 gap-3">
                          {[
                            { label: '关系强度', value: currentSample.relationStrength, color: currentSample.relationStrength >= 70 ? '#047857' : '#C2410C' },
                            { label: '真实性评分', value: currentSample.authenticityScore, color: currentSample.authenticityScore >= 70 ? '#047857' : '#C2410C' },
                            { label: '证据覆盖度', value: currentSample.evidenceCoverage, color: currentSample.evidenceCoverage >= 70 ? '#047857' : '#C2410C' },
                          ].map(m => (
                            <div key={m.label} className="text-center p-2 rounded-lg bg-[#F8FAFC]">
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
                                r.includes('通过') || r.includes('较高') ? 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]' : 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
                              )}>{r}</span>
                            ))}
                          </div>
                        </div>
                        <div className="space-y-1 mt-2">
                          <div className="text-[10px] text-[#64748B]">关键证据</div>
                          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                            <div className="text-[10px] flex justify-between"><span className="text-[#64748B]">90天订单</span><span className="text-[#0F172A] font-medium">{currentSample.orderCount90d} 笔 / {currentSample.orderAmount90d}</span></div>
                            <div className="text-[10px] flex justify-between"><span className="text-[#64748B]">连续开票</span><span className="text-[#0F172A] font-medium">{currentSample.invoiceContinuityMonths} 个月</span></div>
                            <div className="text-[10px] flex justify-between"><span className="text-[#64748B]">客户集中度</span><span className="text-[#0F172A] font-medium">{currentSample.maxCustomerConcentration}</span></div>
                            <div className="text-[10px] flex justify-between"><span className="text-[#64748B]">回款周期</span><span className="text-[#0F172A] font-medium">{currentSample.avgReceivableCycle}</span></div>
                            <div className="text-[10px] flex justify-between"><span className="text-[#64748B]">物流状态</span><span className="text-[#0F172A] font-medium">{currentSample.logisticsStatus}</span></div>
                            <div className="text-[10px] flex justify-between"><span className="text-[#64748B]">账户流水</span><span className="text-[#0F172A] font-medium">{currentSample.accountFlowStatus}</span></div>
                          </div>
                        </div>
                      </div>

                      {/* Risk summary */}
                      <div className="rounded-lg border border-[#E2E8F0] p-3 space-y-2">
                        <div className="text-[11px] font-semibold text-[#0F172A] flex items-center gap-1.5"><AlertTriangle size={12} className="text-[#F59E0B]" />风险提示</div>
                        <div className="flex items-center gap-2">
                          <Badge className={cn('text-[9px] border',
                            currentSample.riskStatus === '正常' ? 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]' :
                            currentSample.riskStatus === '观察' ? 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]' :
                            'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]',
                          )}>{currentSample.riskStatus}</Badge>
                          {currentSample.riskFlags.length > 0 && currentSample.riskFlags.map(f => (
                            <span key={f} className="text-[9px] px-1.5 py-0.5 rounded bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5]">{f}</span>
                          ))}
                        </div>
                        <p className="text-[10px] text-[#475569] leading-4">{currentItem.riskHint}</p>
                        {currentSample.riskFlags.length > 0 && (
                          <div className="text-[9px] text-[#C2410C] bg-[#FFF7ED] rounded px-2 py-1">建议先查看关系图谱，再决定是否进入尽调</div>
                        )}
                        {currentSample.riskFlags.length === 0 && (
                          <div className="text-[9px] text-[#047857] bg-[#ECFDF3] rounded px-2 py-1">该企业已具备进入尽调条件</div>
                        )}
                      </div>

                      {/* Flow info */}
                      <div className="rounded-lg border border-[#E2E8F0] p-3">
                        <div className="text-[11px] font-semibold text-[#0F172A] flex items-center gap-1.5 mb-2"><Clock size={12} className="text-[#64748B]" />流转信息</div>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                          <div className="text-[10px] flex justify-between"><span className="text-[#64748B]">当前状态</span><span className="text-[#0F172A] font-medium">{currentSample.approvalStatus}</span></div>
                          <div className="text-[10px] flex justify-between"><span className="text-[#64748B]">下一步动作</span><span className="text-[#2563EB] font-medium">{currentItem.nextAction}</span></div>
                          <div className="text-[10px] flex justify-between"><span className="text-[#64748B]">推荐时间</span><span className="text-[#0F172A]">{currentItem.recommendTime}</span></div>
                          <div className="text-[10px] flex justify-between"><span className="text-[#64748B]">来源批次</span><span className="text-[#0F172A]">{currentItem.sourceBatch}</span></div>
                        </div>
                      </div>
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

              {/* RIGHT: AI suggestions & actions */}
              <div className="space-y-3">
                {currentSample && currentItem ? (
                  <>
                    {/* AI suggestion card */}
                    <div className="rounded-lg border border-[#E2E8F0] bg-white p-3 space-y-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#7C3AED] to-[#2563EB] flex items-center justify-center"><Lightbulb size={10} className="text-white" /></div>
                        <span className="text-[11px] font-semibold text-[#0F172A]">AI 建议</span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <div className="text-[9px] text-[#94A3B8] mb-0.5">当前判断</div>
                          <p className="text-[10px] text-[#0F172A] leading-4 font-medium">{currentSample.aiSummary}</p>
                        </div>
                        <div>
                          <div className="text-[9px] text-[#94A3B8] mb-0.5">推荐理由</div>
                          <ul className="space-y-1">
                            {currentItem.reasons.map(r => (
                              <li key={r} className="text-[10px] text-[#475569] flex items-start gap-1"><ChevronRight size={9} className="text-[#2563EB] mt-0.5 shrink-0" />{r}</li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <div className="text-[9px] text-[#94A3B8] mb-0.5">建议下一步</div>
                          <p className="text-[10px] text-[#2563EB] font-medium">{currentItem.nextAction}</p>
                        </div>
                        <div>
                          <div className="text-[9px] text-[#94A3B8] mb-0.5">建议进入页面</div>
                          <p className="text-[10px] text-[#7C3AED] font-medium">{currentItem.suggestedPage}</p>
                        </div>
                        {currentSample.riskFlags.length > 0 && (
                          <div className="rounded bg-[#FFF7ED] px-2 py-1.5 text-[9px] text-[#C2410C] flex items-start gap-1">
                            <AlertCircle size={10} className="shrink-0 mt-0.5" />
                            当前推荐依据不足，请人工确认
                          </div>
                        )}
                        <div className="text-[8px] text-[#CBD5E1]">推荐生成时间 {currentItem.recommendTime}</div>
                      </div>
                      <div className="flex flex-col gap-1.5 pt-1">
                        <Button size="sm" className="h-7 text-[10px] gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white w-full"><CheckCircle2 size={10} />采纳建议</Button>
                        <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569] w-full"><UserCheck size={10} />人工确认</Button>
                        <Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1 text-[#64748B] w-full"><Eye size={10} />查看更多依据</Button>
                      </div>
                    </div>

                    {/* Confidence card */}
                    <div className="rounded-lg border border-[#E2E8F0] bg-white p-3 space-y-2">
                      <div className="text-[11px] font-semibold text-[#0F172A]">置信度概览</div>
                      <div className="space-y-2">
                        {[
                          { label: 'AI 置信度', value: currentSample.agentHints.confidence },
                          { label: '关系强度', value: currentSample.relationStrength },
                          { label: '证据覆盖度', value: currentSample.evidenceCoverage },
                        ].map(m => (
                          <div key={m.label} className="space-y-0.5">
                            <div className="flex justify-between text-[9px]">
                              <span className="text-[#64748B]">{m.label}</span>
                              <span className="font-medium text-[#0F172A]">{m.value}%</span>
                            </div>
                            <div className="w-full h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden">
                              <div className="h-full rounded-full transition-all" style={{
                                width: `${m.value}%`,
                                backgroundColor: m.value >= 80 ? '#047857' : m.value >= 60 ? '#F59E0B' : '#DC2626',
                              }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick actions */}
                    <div className="rounded-lg border border-[#E2E8F0] bg-white p-3 space-y-2">
                      <div className="text-[11px] font-semibold text-[#0F172A]">快捷操作</div>
                      <div className="space-y-1">
                        <button onClick={() => navigate('smart-identify', 'filter-flow')} className="w-full text-left px-2 py-1.5 rounded text-[10px] text-[#475569] hover:bg-[#F8FAFC] flex items-center gap-2 transition-colors"><Filter size={10} className="text-[#7C3AED]" />进入筛选</button>
                        <button onClick={() => navigate('smart-due-diligence', 'dd-report')} className="w-full text-left px-2 py-1.5 rounded text-[10px] text-[#475569] hover:bg-[#F8FAFC] flex items-center gap-2 transition-colors"><FileSearch size={10} className="text-[#047857]" />进入尽调</button>
                        <button className="w-full text-left px-2 py-1.5 rounded text-[10px] text-[#475569] hover:bg-[#F8FAFC] flex items-center gap-2 transition-colors"><Eye size={10} className="text-[#F59E0B]" />标记观察</button>
                        <button className="w-full text-left px-2 py-1.5 rounded text-[10px] text-[#475569] hover:bg-[#F8FAFC] flex items-center gap-2 transition-colors"><X size={10} className="text-[#DC2626]" />忽略推荐</button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 text-center">
                    <div className="text-[11px] text-[#94A3B8]">当前暂无高置信度推荐企业。</div>
                    <div className="text-[10px] text-[#CBD5E1] mt-1">建议查看"待人工确认"分组，或进入条件筛选流进一步处理。</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      }

      /* ═══════════════════════════════════════════════════════════
         PAGE 4: 条件筛选流 — 半自动筛选工作流
         ═══════════════════════════════════════════════════════════ */
      case 'filter-flow': {
        type FilterAction = '优先进入候选池' | '建议进入尽调' | '待人工确认';

        const getFilterAction = (s: ChainLoanSample): FilterAction => {
          if (s.agentHints.confidence >= 80 && s.evidenceCoverage >= 80) return '优先进入候选池';
          if (s.agentHints.confidence >= 60) return '建议进入尽调';
          return '待人工确认';
        };

        const FILTER_ACTION_STYLE: Record<FilterAction, { bg: string; text: string; border: string }> = {
          '优先进入候选池': { bg: 'bg-[#EFF6FF]', text: 'text-[#2563EB]', border: 'border-[#BFDBFE]' },
          '建议进入尽调': { bg: 'bg-[#ECFDF3]', text: 'text-[#047857]', border: 'border-[#A7F3D0]' },
          '待人工确认': { bg: 'bg-[#F8FAFC]', text: 'text-[#64748B]', border: 'border-[#E2E8F0]' },
        };

        const filterActions: FilterAction[] = ['优先进入候选池', '建议进入尽调', '待人工确认'];
        const filteredSamples = SAMPLES;
        const currentFilterSample = filteredSamples.find(s => s.id === selectedFilter);

        const overviewCards = [
          { label: '总待筛选企业', value: SAMPLES.length, desc: '当前进入筛选流的企业总数', icon: Layers, color: 'text-[#475569]' },
          { label: '当前命中结果', value: filteredSamples.length, desc: '在当前筛选条件下命中的企业数量', icon: Search, color: 'text-[#2563EB]' },
          { label: '建议进入候选池', value: filteredSamples.filter(s => getFilterAction(s) === '优先进入候选池').length, desc: '已具备进入候选池条件的企业', icon: Star, color: 'text-[#F59E0B]' },
          { label: '建议进入尽调', value: filteredSamples.filter(s => getFilterAction(s) === '建议进入尽调').length, desc: '具备继续补强与核验价值的企业', icon: FileSearch, color: 'text-[#047857]' },
          { label: '待人工确认', value: filteredSamples.filter(s => getFilterAction(s) === '待人工确认').length, desc: '存在边界条件或证据不足的企业', icon: UserCheck, color: 'text-[#64748B]' },
        ];

        const hitConditions = (s: ChainLoanSample) => {
          const hits: string[] = [];
          const misses: string[] = [];
          if (s.relationStrength >= 70) hits.push('关系强度达标'); else misses.push('关系强度不足');
          if (s.evidenceCoverage >= 70) hits.push('证据覆盖度达标'); else misses.push('证据覆盖度不足');
          if (s.authenticityScore >= 70) hits.push('真实性评分达标'); else misses.push('真实性评分偏低');
          if (s.orderCount90d >= 10) hits.push('订单频次充足'); else misses.push('订单频次偏低');
          if (s.invoiceContinuityMonths >= 8) hits.push('开票连续性良好'); else misses.push('开票连续性不足');
          return { hits, misses };
        };

        return (
          <div className="space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[15px] font-semibold text-[#0F172A]">条件筛选流</h2>
                <p className="text-[11px] text-[#64748B] mt-0.5">基于行业、规模、链条与证据条件，对候选企业进行进一步收敛与流转筛选。</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Download size={10} />保存筛选方案</Button>
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><RefreshCw size={10} />重置条件</Button>
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><RefreshCw size={10} />刷新结果</Button>
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Download size={10} />导出结果</Button>
              </div>
            </div>

            {/* Overview cards */}
            <div className="grid grid-cols-5 gap-3">
              {overviewCards.map(c => (
                <div key={c.label} className="rounded-lg border border-[#E2E8F0] bg-white p-3 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <c.icon size={12} className={c.color} />
                    <span className="text-[10px] text-[#64748B]">{c.label}</span>
                  </div>
                  <div className="text-[20px] font-bold text-[#0F172A]">{c.value}</div>
                  <div className="text-[9px] text-[#94A3B8]">{c.desc}</div>
                </div>
              ))}
            </div>

            {/* Filter conditions area (collapsible) */}
            <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
              <button onClick={() => setFilterExpanded(!filterExpanded)} className="w-full px-4 py-2.5 flex items-center justify-between bg-[#F8FAFC] border-b border-[#F1F5F9]">
                <div className="flex items-center gap-2">
                  <Filter size={12} className="text-[#7C3AED]" />
                  <span className="text-[11px] font-semibold text-[#0F172A]">筛选条件</span>
                  <span className="text-[9px] text-[#94A3B8]">建议优先收敛行业、规模与链条条件，再结合识别强度决定是否进入尽调。</span>
                </div>
                <ChevronRight size={12} className={cn('text-[#94A3B8] transition-transform', filterExpanded && 'rotate-90')} />
              </button>
              {filterExpanded && (
                <div className="p-4 space-y-4">
                  <div className="grid grid-cols-4 gap-4">
                    {/* A. 基础属性 */}
                    <div className="space-y-2">
                      <div className="text-[10px] font-semibold text-[#0F172A]">基础属性</div>
                      {[
                        { label: '所属行业', options: ['全部', '新能源', '储能', '包装材料', '物流', '化工'] },
                        { label: '所在地区', options: ['全部', '江苏', '广东', '浙江', '上海', '安徽'] },
                        { label: '链条归属', options: ['全部', '新能源电池产业链', '储能产业链', '化工产业链'] },
                        { label: '年销售额', options: ['全部', '≥100万', '≥500万', '≥1000万'] },
                      ].map(f => (
                        <div key={f.label} className="flex items-center gap-2">
                          <span className="text-[9px] text-[#64748B] w-14 shrink-0">{f.label}</span>
                          <select className="flex-1 h-6 rounded border border-[#E2E8F0] px-1.5 text-[9px] text-[#0F172A] bg-white">{f.options.map(o => <option key={o}>{o}</option>)}</select>
                        </div>
                      ))}
                    </div>
                    {/* B. 经营状态 */}
                    <div className="space-y-2">
                      <div className="text-[10px] font-semibold text-[#0F172A]">经营状态</div>
                      {[
                        { label: '经营状态', options: ['全部', '正常经营', '风险观察', '恢复中'] },
                        { label: '是否本行客户', options: ['全部', '是', '否'] },
                        { label: '有对公账户', options: ['全部', '是', '否'] },
                      ].map(f => (
                        <div key={f.label} className="flex items-center gap-2">
                          <span className="text-[9px] text-[#64748B] w-14 shrink-0">{f.label}</span>
                          <select className="flex-1 h-6 rounded border border-[#E2E8F0] px-1.5 text-[9px] text-[#0F172A] bg-white">{f.options.map(o => <option key={o}>{o}</option>)}</select>
                        </div>
                      ))}
                    </div>
                    {/* C. 识别强度 */}
                    <div className="space-y-2">
                      <div className="text-[10px] font-semibold text-[#0F172A]">识别强度</div>
                      {[
                        { label: '关系强度', options: ['全部', '≥80%', '≥60%', '≥40%'] },
                        { label: '真实性评分', options: ['全部', '≥80%', '≥60%', '≥40%'] },
                        { label: '证据覆盖度', options: ['全部', '≥80%', '≥60%', '≥40%'] },
                      ].map(f => (
                        <div key={f.label} className="flex items-center gap-2">
                          <span className="text-[9px] text-[#64748B] w-14 shrink-0">{f.label}</span>
                          <select className="flex-1 h-6 rounded border border-[#E2E8F0] px-1.5 text-[9px] text-[#0F172A] bg-white">{f.options.map(o => <option key={o}>{o}</option>)}</select>
                        </div>
                      ))}
                    </div>
                    {/* D. 流转条件 */}
                    <div className="space-y-2">
                      <div className="text-[10px] font-semibold text-[#0F172A]">流转条件</div>
                      {[
                        { label: '当前阶段', options: ['全部', '已识别', '预授信', '补审', '已批准', '恢复中'] },
                        { label: '推荐场景', options: ['全部', '订单微贷', '运费贷', '服务贷'] },
                        { label: '待人工确认', options: ['全部', '是', '否'] },
                      ].map(f => (
                        <div key={f.label} className="flex items-center gap-2">
                          <span className="text-[9px] text-[#64748B] w-14 shrink-0">{f.label}</span>
                          <select className="flex-1 h-6 rounded border border-[#E2E8F0] px-1.5 text-[9px] text-[#0F172A] bg-white">{f.options.map(o => <option key={o}>{o}</option>)}</select>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-2 border-t border-[#F1F5F9]">
                    <Button size="sm" className="h-7 text-[10px] gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white"><Search size={10} />应用条件</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><X size={10} />清空条件</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Download size={10} />保存为方案</Button>
                    <div className="flex-1" />
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#BFDBFE] text-[#2563EB]"><Layers size={10} />批量加入候选池</Button>
                      <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#A7F3D0] text-[#047857]"><FileSearch size={10} />批量进入尽调</Button>
                      <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#64748B]"><Eye size={10} />批量标记观察</Button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Three-column: result list + detail + AI panel */}
            <div className="grid grid-cols-[280px_1fr_280px] gap-3" style={{ minHeight: 480 }}>

              {/* LEFT: Filtered result list grouped by action */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-3 py-2.5 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                  <span className="text-[11px] font-semibold text-[#0F172A]">筛选结果</span>
                  <span className="text-[9px] text-[#94A3B8] ml-2">{filteredSamples.length} 家企业</span>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {filterActions.map(action => {
                    const items = filteredSamples.filter(s => getFilterAction(s) === action);
                    if (items.length === 0) return null;
                    const as = FILTER_ACTION_STYLE[action];
                    return (
                      <div key={action}>
                        <div className="px-3 py-1.5 bg-[#FAFBFF] border-b border-[#F1F5F9] flex items-center gap-1.5">
                          <span className={cn('text-[10px] font-semibold', as.text)}>{action}</span>
                          <span className="text-[9px] text-[#94A3B8]">{items.length}</span>
                        </div>
                        {items.map(sample => {
                          const isActive = selectedFilter === sample.id;
                          const conds = hitConditions(sample);
                          return (
                            <div
                              key={sample.id}
                              onClick={() => setSelectedFilter(sample.id)}
                              className={cn(
                                'px-3 py-2.5 border-b border-[#F1F5F9] cursor-pointer transition-all',
                                isActive ? 'bg-[#EFF6FF] border-l-2 border-l-[#2563EB]' : 'hover:bg-[#FAFBFF]',
                              )}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[12px] font-semibold text-[#0F172A] truncate">{sample.shortName}</span>
                                <Badge className={cn('text-[8px] border', as.bg, as.text, as.border)}>{action === '优先进入候选池' ? '进候选池' : action === '建议进入尽调' ? '进尽调' : '待确认'}</Badge>
                              </div>
                              <div className="text-[9px] text-[#64748B] mb-1.5">{sample.roleInChain} · {sample.chainName}</div>
                              <div className="flex items-center gap-1 flex-wrap mb-1.5">
                                {conds.hits.slice(0, 2).map(h => (
                                  <span key={h} className="text-[8px] px-1.5 py-0.5 rounded bg-[#ECFDF3] text-[#047857] border border-[#A7F3D0]">{h}</span>
                                ))}
                                {conds.misses.length > 0 && (
                                  <span className="text-[8px] px-1.5 py-0.5 rounded bg-[#FFF7ED] text-[#C2410C] border border-[#FED7AA]">{conds.misses.length} 项未达</span>
                                )}
                              </div>
                              <div className="flex items-center gap-3 text-[9px]">
                                <span className="text-[#64748B]">关系 <span className="font-medium text-[#0F172A]">{sample.relationStrength}%</span></span>
                                <span className="text-[#64748B]">真实性 <span className="font-medium text-[#0F172A]">{sample.authenticityScore}%</span></span>
                                <span className="text-[#64748B]">覆盖 <span className="font-medium text-[#0F172A]">{sample.evidenceCoverage}%</span></span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                  {filteredSamples.length === 0 && (
                    <div className="p-6 text-center">
                      <Search size={24} className="text-[#CBD5E1] mx-auto mb-2" />
                      <div className="text-[11px] text-[#64748B]">当前条件下暂无命中企业。</div>
                      <div className="text-[9px] text-[#94A3B8] mt-1">建议放宽筛选条件，或返回智能推荐流查看原始推荐结果。</div>
                    </div>
                  )}
                </div>
              </div>

              {/* CENTER: Current filter object detail */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                {currentFilterSample ? (() => {
                  const conds = hitConditions(currentFilterSample);
                  const action = getFilterAction(currentFilterSample);
                  const fas = FILTER_ACTION_STYLE[action];
                  return (
                    <>
                      <div className="px-4 py-3 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                        <div className="flex items-center justify-between">
                          <span className="text-[12px] font-semibold text-[#0F172A]">当前对象详情</span>
                          <div className="flex items-center gap-1.5">
                            <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#BFDBFE] text-[#2563EB]" onClick={() => navigate('smart-identify', 'list')}><Layers size={9} />加入候选池</Button>
                            <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#A7F3D0] text-[#047857]" onClick={() => navigate('smart-due-diligence', 'dd-report')}><FileSearch size={9} />进入尽调</Button>
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
                            <span className="text-[15px] font-bold text-[#0F172A]">{currentFilterSample.companyName}</span>
                            <Badge className={cn('text-[9px] border', fas.bg, fas.text, fas.border)}>{action}</Badge>
                          </div>
                          <div className="flex items-center gap-3 text-[10px] text-[#64748B]">
                            <span>{currentFilterSample.roleInChain}</span>
                            <span className="text-[#CBD5E1]">·</span>
                            <span>{currentFilterSample.chainName}</span>
                            <span className="text-[#CBD5E1]">·</span>
                            <span>年销售 {currentFilterSample.annualSales}</span>
                            <span className="text-[#CBD5E1]">·</span>
                            <span>{currentFilterSample.productType}</span>
                          </div>
                        </div>

                        {/* Filter conclusion */}
                        <div className="rounded-lg border border-[#E2E8F0] p-3 space-y-2">
                          <div className="text-[11px] font-semibold text-[#0F172A] flex items-center gap-1.5"><Brain size={12} className="text-[#7C3AED]" />筛选结论</div>
                          <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                            <div className="flex items-center justify-between text-[10px]"><span className="text-[#64748B]">当前筛选结论</span><Badge className={cn('text-[8px] border', fas.bg, fas.text, fas.border)}>{action}</Badge></div>
                            <div className="flex items-center justify-between text-[10px]"><span className="text-[#64748B]">推荐场景</span><span className="font-medium text-[#0F172A]">{currentFilterSample.productType}</span></div>
                            <div className="flex items-center justify-between text-[10px]"><span className="text-[#64748B]">推荐阶段</span><span className="font-medium text-[#0F172A]">{currentFilterSample.nextAction}</span></div>
                            <div className="flex items-center justify-between text-[10px]"><span className="text-[#64748B]">建议进入候选池</span><span className="font-medium" style={{ color: action === '优先进入候选池' ? '#047857' : '#64748B' }}>{action === '优先进入候选池' ? '是' : '待确认'}</span></div>
                          </div>
                          <p className="text-[10px] text-[#475569] bg-[#F8FAFC] rounded px-2.5 py-1.5 leading-4">
                            {action === '优先进入候选池'
                              ? '该企业已满足当前筛选条件，建议进入候选池并继续跟踪识别结果。'
                              : action === '建议进入尽调'
                                ? '该企业具备一定识别价值，但关键证据尚不充分，建议进入尽调进一步补强。'
                                : '当前证据覆盖度接近阈值边界，建议人工确认后再决定是否推进。'}
                          </p>
                        </div>

                        {/* Hit detail */}
                        <div className="rounded-lg border border-[#E2E8F0] p-3 space-y-2">
                          <div className="text-[11px] font-semibold text-[#0F172A] flex items-center gap-1.5"><CheckCircle2 size={12} className="text-[#047857]" />条件命中明细</div>
                          <div className="space-y-2">
                            <div>
                              <div className="text-[9px] text-[#94A3B8] mb-1">已命中条件（{conds.hits.length}）</div>
                              <div className="flex items-center gap-1.5 flex-wrap">
                                {conds.hits.map(h => (
                                  <span key={h} className="text-[9px] px-2 py-0.5 rounded bg-[#ECFDF3] text-[#047857] border border-[#A7F3D0] flex items-center gap-1"><CheckCircle2 size={8} />{h}</span>
                                ))}
                              </div>
                            </div>
                            {conds.misses.length > 0 && (
                              <div>
                                <div className="text-[9px] text-[#94A3B8] mb-1">未命中条件（{conds.misses.length}）</div>
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  {conds.misses.map(m => (
                                    <span key={m} className="text-[9px] px-2 py-0.5 rounded bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5] flex items-center gap-1"><AlertCircle size={8} />{m}</span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                          <div className="grid grid-cols-3 gap-3 mt-2">
                            {[
                              { label: '关系强度', value: currentFilterSample.relationStrength },
                              { label: '真实性评分', value: currentFilterSample.authenticityScore },
                              { label: '证据覆盖度', value: currentFilterSample.evidenceCoverage },
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
                        </div>

                        {/* Risk & restrictions */}
                        <div className="rounded-lg border border-[#E2E8F0] p-3 space-y-2">
                          <div className="text-[11px] font-semibold text-[#0F172A] flex items-center gap-1.5"><AlertTriangle size={12} className="text-[#F59E0B]" />风险与限制</div>
                          <div className="flex items-center gap-2">
                            <Badge className={cn('text-[9px] border',
                              currentFilterSample.riskStatus === '正常' ? 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]' :
                              currentFilterSample.riskStatus === '观察' ? 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]' :
                              'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]',
                            )}>{currentFilterSample.riskStatus}</Badge>
                            {currentFilterSample.riskFlags.map(f => (
                              <span key={f} className="text-[9px] px-1.5 py-0.5 rounded bg-[#FEF2F2] text-[#DC2626] border border-[#FCA5A5]">{f}</span>
                            ))}
                          </div>
                          {conds.misses.length > 0 && (
                            <p className="text-[10px] text-[#C2410C] leading-4">不建议直接推进原因：{conds.misses.join('、')}</p>
                          )}
                          {currentFilterSample.reviewReason && (
                            <p className="text-[10px] text-[#475569] leading-4">{currentFilterSample.reviewReason}</p>
                          )}
                        </div>

                        {/* Source info */}
                        <div className="rounded-lg border border-[#E2E8F0] p-3">
                          <div className="text-[11px] font-semibold text-[#0F172A] flex items-center gap-1.5 mb-2"><Clock size={12} className="text-[#64748B]" />来源信息</div>
                          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
                            <div className="text-[10px] flex justify-between"><span className="text-[#64748B]">来源批次</span><span className="text-[#0F172A]">BATCH-20260409-001</span></div>
                            <div className="text-[10px] flex justify-between"><span className="text-[#64748B]">进入筛选时间</span><span className="text-[#0F172A]">2026-04-09 09:30</span></div>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })() : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                    <Search size={28} className="text-[#CBD5E1] mb-3" />
                    <div className="text-[13px] font-medium text-[#64748B]">当前暂无待筛选企业。</div>
                    <div className="text-[10px] text-[#94A3B8] mt-1">您可以先完成文件导入或 API 接入，再进入筛选流。</div>
                  </div>
                )}
              </div>

              {/* RIGHT: AI suggestion panel */}
              <div className="space-y-3">
                {currentFilterSample ? (() => {
                  const action = getFilterAction(currentFilterSample);
                  return (
                    <>
                      {/* AI suggestion card */}
                      <div className="rounded-lg border border-[#E2E8F0] bg-white p-3 space-y-2.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#7C3AED] to-[#2563EB] flex items-center justify-center"><Lightbulb size={10} className="text-white" /></div>
                          <span className="text-[11px] font-semibold text-[#0F172A]">AI 建议</span>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <div className="text-[9px] text-[#94A3B8] mb-0.5">当前判断</div>
                            <p className="text-[10px] text-[#0F172A] leading-4 font-medium">{currentFilterSample.aiSummary}</p>
                          </div>
                          <div>
                            <div className="text-[9px] text-[#94A3B8] mb-0.5">筛选依据</div>
                            <p className="text-[10px] text-[#475569] leading-4">
                              {`${currentFilterSample.shortName}在行业、链条归属上符合当前场景要求，关系强度 ${currentFilterSample.relationStrength}%${currentFilterSample.relationStrength >= 70 ? '，高于平均水平' : '，低于平均水平'}。`}
                            </p>
                          </div>
                          <div>
                            <div className="text-[9px] text-[#94A3B8] mb-0.5">下一步建议</div>
                            <p className="text-[10px] text-[#2563EB] font-medium">
                              {action === '优先进入候选池'
                                ? '建议先加入候选池，再结合关系图谱与公私联动结果决定是否进入尽调。'
                                : action === '建议进入尽调'
                                  ? '建议进入尽调，进一步补强证据链并生成尽调报告。'
                                  : '该企业处于边界状态，建议人工确认后再推进。'}
                            </p>
                          </div>
                          <div>
                            <div className="text-[9px] text-[#94A3B8] mb-0.5">建议进入页面</div>
                            <p className="text-[10px] text-[#7C3AED] font-medium">{action === '优先进入候选池' ? '候选资产列表' : action === '建议进入尽调' ? '智能尽调' : '人工确认'}</p>
                          </div>
                          {currentFilterSample.riskFlags.length > 0 && (
                            <div className="rounded bg-[#FFF7ED] px-2 py-1.5 text-[9px] text-[#C2410C] flex items-start gap-1">
                              <AlertCircle size={10} className="shrink-0 mt-0.5" />
                              当前结果缺少关键识别信息，暂不建议推进
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-1.5 pt-1">
                          <Button size="sm" className="h-7 text-[10px] gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white w-full" onClick={() => navigate('smart-identify', 'list')}><Layers size={10} />加入候选池</Button>
                          <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#A7F3D0] text-[#047857] w-full" onClick={() => navigate('smart-due-diligence', 'dd-report')}><FileSearch size={10} />进入尽调</Button>
                          <Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1 text-[#64748B] w-full"><Eye size={10} />标记观察</Button>
                          <Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1 text-[#DC2626] w-full"><X size={10} />移出结果</Button>
                        </div>
                      </div>

                      {/* Identification strength */}
                      <div className="rounded-lg border border-[#E2E8F0] bg-white p-3 space-y-2">
                        <div className="text-[11px] font-semibold text-[#0F172A]">识别强度</div>
                        <div className="space-y-2">
                          {[
                            { label: 'AI 置信度', value: currentFilterSample.agentHints.confidence },
                            { label: '关系强度', value: currentFilterSample.relationStrength },
                            { label: '证据覆盖度', value: currentFilterSample.evidenceCoverage },
                          ].map(m => (
                            <div key={m.label} className="space-y-0.5">
                              <div className="flex justify-between text-[9px]">
                                <span className="text-[#64748B]">{m.label}</span>
                                <span className="font-medium text-[#0F172A]">{m.value}%</span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden">
                                <div className="h-full rounded-full transition-all" style={{
                                  width: `${m.value}%`,
                                  backgroundColor: m.value >= 80 ? '#047857' : m.value >= 60 ? '#F59E0B' : '#DC2626',
                                }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Quick navigation */}
                      <div className="rounded-lg border border-[#E2E8F0] bg-white p-3 space-y-2">
                        <div className="text-[11px] font-semibold text-[#0F172A]">快捷跳转</div>
                        <div className="space-y-1">
                          <button onClick={() => navigate('smart-identify', 'graph')} className="w-full text-left px-2 py-1.5 rounded text-[10px] text-[#475569] hover:bg-[#F8FAFC] flex items-center gap-2 transition-colors"><Network size={10} className="text-[#7C3AED]" />查看关系图谱</button>
                          <button onClick={() => navigate('smart-identify', 'linked')} className="w-full text-left px-2 py-1.5 rounded text-[10px] text-[#475569] hover:bg-[#F8FAFC] flex items-center gap-2 transition-colors"><Link2 size={10} className="text-[#2563EB]" />查看公私联动</button>
                          <button onClick={() => navigate('smart-identify', 'feed')} className="w-full text-left px-2 py-1.5 rounded text-[10px] text-[#475569] hover:bg-[#F8FAFC] flex items-center gap-2 transition-colors"><Sparkles size={10} className="text-[#F59E0B]" />返回智能推荐流</button>
                        </div>
                      </div>
                    </>
                  );
                })() : (
                  <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 text-center">
                    <div className="text-[11px] text-[#94A3B8]">请在左侧选择企业查看详情</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      }

      /* ═══════════════════════════════════════════════════════════
         PAGE 5: 候选资产列表 — 候选管理与推进
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
                <h2 className="text-[15px] font-semibold text-[#0F172A]">候选资产列表</h2>
                <p className="text-[11px] text-[#64748B] mt-0.5">统一管理已进入识别主链路的候选企业，支持分层、筛选与后续作业推进。</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><RefreshCw size={10} />刷新列表</Button>
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Download size={10} />导出候选</Button>
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#A7F3D0] text-[#047857]"><FileSearch size={10} />批量加入尽调</Button>
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#64748B]"><Eye size={10} />批量标记观察</Button>
              </div>
            </div>

            {/* Overview cards */}
            <div className="grid grid-cols-5 gap-3">
              {overviewCards.map(c => (
                <div key={c.label} className="rounded-lg border border-[#E2E8F0] bg-white p-3 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <c.icon size={12} className={c.color} />
                    <span className="text-[10px] text-[#64748B]">{c.label}</span>
                  </div>
                  <div className="text-[20px] font-bold text-[#0F172A]">{c.value}</div>
                  <div className="text-[9px] text-[#94A3B8]">{c.desc}</div>
                </div>
              ))}
            </div>

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
            <div className="grid grid-cols-[280px_1fr_280px] gap-3" style={{ minHeight: 480 }}>

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
                      <div className="text-[9px] text-[#94A3B8] mt-1">您可以先完成名单导入、推荐或筛选后，再进入候选资产列表。</div>
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
                            <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#A7F3D0] text-[#047857]" onClick={() => navigate('smart-due-diligence', 'dd-report')}><FileSearch size={9} />进入尽调</Button>
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
                    <div className="text-[10px] text-[#94A3B8] mt-1">您可以先完成名单导入、推荐或筛选后，再进入候选资产列表。</div>
                  </div>
                )}
              </div>

              {/* RIGHT: AI judgment & actions */}
              <div className="space-y-3">
                {currentCandSample ? (() => {
                  const seg = currentCandSample.segmentTag;
                  return (
                    <>
                      {/* AI judgment card */}
                      <div className="rounded-lg border border-[#E2E8F0] bg-white p-3 space-y-2.5">
                        <div className="flex items-center gap-1.5">
                          <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#7C3AED] to-[#2563EB] flex items-center justify-center"><Lightbulb size={10} className="text-white" /></div>
                          <span className="text-[11px] font-semibold text-[#0F172A]">AI 判断</span>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <div className="text-[9px] text-[#94A3B8] mb-0.5">当前判断</div>
                            <p className="text-[10px] text-[#0F172A] leading-4 font-medium">{currentCandSample.aiSummary}</p>
                          </div>
                          <div>
                            <div className="text-[9px] text-[#94A3B8] mb-0.5">推荐理由</div>
                            <p className="text-[10px] text-[#475569] leading-4">
                              {`${currentCandSample.shortName}在链条关系、经营稳定性与证据覆盖上${currentCandSample.agentHints.confidence >= 70 ? '均高于当前候选平均水平' : '存在部分不足'}。`}
                            </p>
                          </div>
                          <div>
                            <div className="text-[9px] text-[#94A3B8] mb-0.5">推进建议</div>
                            <p className="text-[10px] text-[#2563EB] font-medium">
                              {seg === 'A可授信'
                                ? '建议先进入智能尽调补强证据，再决定是否进入审批前队列。'
                                : seg === 'B可做但需处理'
                                  ? '建议先补充关键证据，再决定下一步推进方向。'
                                  : seg === 'C待观察'
                                    ? '建议持续观察，暂不推进尽调。'
                                    : '建议先关注风险变化，风险缓解后再评估。'}
                            </p>
                          </div>
                          <div>
                            <div className="text-[9px] text-[#94A3B8] mb-0.5">建议进入页面</div>
                            <p className="text-[10px] text-[#7C3AED] font-medium">{seg === 'A可授信' || seg === 'B可做但需处理' ? '智能尽调' : '保持当前候选管理'}</p>
                          </div>
                          {currentCandSample.riskFlags.length > 0 && (
                            <div className="rounded bg-[#FFF7ED] px-2 py-1.5 text-[9px] text-[#C2410C] flex items-start gap-1">
                              <AlertCircle size={10} className="shrink-0 mt-0.5" />
                              当前对象缺少关键识别信息，暂不能推进
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-1.5 pt-1">
                          <Button size="sm" className="h-7 text-[10px] gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white w-full"><CheckCircle2 size={10} />采纳建议</Button>
                          <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569] w-full"><UserCheck size={10} />人工确认</Button>
                          <Button variant="ghost" size="sm" className="h-7 text-[10px] gap-1 text-[#64748B] w-full"><Eye size={10} />查看更多依据</Button>
                        </div>
                      </div>

                      {/* Strength overview */}
                      <div className="rounded-lg border border-[#E2E8F0] bg-white p-3 space-y-2">
                        <div className="text-[11px] font-semibold text-[#0F172A]">识别强度</div>
                        <div className="space-y-2">
                          {[
                            { label: 'AI 置信度', value: currentCandSample.agentHints.confidence },
                            { label: '关系强度', value: currentCandSample.relationStrength },
                            { label: '证据覆盖度', value: currentCandSample.evidenceCoverage },
                          ].map(m => (
                            <div key={m.label} className="space-y-0.5">
                              <div className="flex justify-between text-[9px]">
                                <span className="text-[#64748B]">{m.label}</span>
                                <span className="font-medium text-[#0F172A]">{m.value}%</span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden">
                                <div className="h-full rounded-full transition-all" style={{
                                  width: `${m.value}%`,
                                  backgroundColor: m.value >= 80 ? '#047857' : m.value >= 60 ? '#F59E0B' : '#DC2626',
                                }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Quick actions */}
                      <div className="rounded-lg border border-[#E2E8F0] bg-white p-3 space-y-2">
                        <div className="text-[11px] font-semibold text-[#0F172A]">快捷操作</div>
                        <div className="space-y-1">
                          <button onClick={() => navigate('smart-due-diligence', 'dd-report')} className="w-full text-left px-2 py-1.5 rounded text-[10px] text-[#475569] hover:bg-[#F8FAFC] flex items-center gap-2 transition-colors"><FileSearch size={10} className="text-[#047857]" />进入尽调</button>
                          <button onClick={() => navigate('smart-approval', 'product-match')} className="w-full text-left px-2 py-1.5 rounded text-[10px] text-[#475569] hover:bg-[#F8FAFC] flex items-center gap-2 transition-colors"><ArrowRight size={10} className="text-[#2563EB]" />加入审批前队列</button>
                          <button className="w-full text-left px-2 py-1.5 rounded text-[10px] text-[#475569] hover:bg-[#F8FAFC] flex items-center gap-2 transition-colors"><Eye size={10} className="text-[#F59E0B]" />标记观察</button>
                          <button className="w-full text-left px-2 py-1.5 rounded text-[10px] text-[#475569] hover:bg-[#F8FAFC] flex items-center gap-2 transition-colors"><X size={10} className="text-[#DC2626]" />移出候选</button>
                        </div>
                      </div>
                    </>
                  );
                })() : (
                  <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 text-center">
                    <div className="text-[11px] text-[#94A3B8]">请在左侧选择企业查看详情</div>
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

            {/* Overview cards */}
            <div className="grid grid-cols-5 gap-3">
              {[
                { label: '核心节点数', value: coreCount, desc: '当前图谱中已识别出的关键主体数量', icon: Users, color: 'text-[#475569]' },
                { label: '高强度关系', value: strongCount, desc: '已具备较强识别依据的关系链路', icon: Activity, color: 'text-[#047857]' },
                { label: '待核验关系', value: pendingCount, desc: '存在关系线索，但仍需证据补强', icon: AlertTriangle, color: 'text-[#F59E0B]' },
                { label: '公私联动命中', value: linkedCount, desc: '已命中法人或个人关联验证的主体数', icon: Link2, color: 'text-[#7C3AED]' },
                { label: '可推进企业', value: pushableCount, desc: '建议继续推进进入尽调或候选池', icon: ArrowRight, color: 'text-[#2563EB]' },
              ].map(c => (
                <div key={c.label} className="rounded-lg border border-[#E2E8F0] bg-white p-3 space-y-1">
                  <div className="flex items-center gap-1.5"><c.icon size={12} className={c.color} /><span className="text-[10px] text-[#64748B]">{c.label}</span></div>
                  <div className="text-[20px] font-bold text-[#0F172A]">{c.value}</div>
                  <div className="text-[9px] text-[#94A3B8]">{c.desc}</div>
                </div>
              ))}
            </div>

            {/* Three-column: graph canvas + detail + AI */}
            <div className="grid grid-cols-[1fr_300px] gap-3" style={{ minHeight: 460 }}>

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

                    {/* Evidence panel */}
                    <div className="rounded-lg border border-[#E2E8F0] bg-white p-3 space-y-2.5">
                      <div className="text-[11px] font-semibold text-[#0F172A] flex items-center gap-1.5"><FileCheck size={12} className="text-[#047857]" />关系证据</div>
                      <p className="text-[10px] text-[#475569] leading-4">系统已基于对公流水、回款记录与物流履约信息，初步建立该节点与主链路的关联判断。</p>
                      <div className="space-y-1.5">
                        {EVIDENCE_TYPES.map(et => {
                          const matched = selNode.evidenceSources.some(es => et.includes(es.replace('增值税', '')) || es.includes(et.slice(0, 2)));
                          return (
                            <div key={et} className={cn('flex items-center justify-between px-2.5 py-1.5 rounded text-[10px] border', matched ? 'bg-[#ECFDF3] border-[#A7F3D0]' : 'bg-[#F8FAFC] border-[#E2E8F0]')}>
                              <span className={matched ? 'text-[#047857] font-medium' : 'text-[#94A3B8]'}>{et}</span>
                              <div className="flex items-center gap-2">
                                {matched ? (
                                  <>
                                    <span className="text-[9px] text-[#047857]">已匹配</span>
                                    <Badge className="text-[7px] bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]">连续</Badge>
                                  </>
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
                        <Button variant="ghost" size="sm" className="h-6 text-[9px] text-[#64748B]">查看更多</Button>
                      </div>
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

              {/* RIGHT: AI judgment & actions */}
              <div className="space-y-3">
                {/* AI judgment card */}
                <div className="rounded-lg border border-[#E2E8F0] bg-white p-3 space-y-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#7C3AED] to-[#2563EB] flex items-center justify-center"><Brain size={10} className="text-white" /></div>
                    <span className="text-[11px] font-semibold text-[#0F172A]">AI 判断</span>
                  </div>
                  {selNode ? (
                    <div className="space-y-2">
                      <div>
                        <div className="text-[9px] text-[#94A3B8] mb-0.5">当前判断</div>
                        <p className="text-[10px] text-[#0F172A] leading-4 font-medium">
                          {selNode.relationStrength >= 70
                            ? `系统综合关系强度、连续交易表现与证据覆盖后，建议将${selNode.name}纳入候选池继续推进。`
                            : `${selNode.name}当前关系证据不足，建议先补强后再决定推进方向。`}
                        </p>
                      </div>
                      <div>
                        <div className="text-[9px] text-[#94A3B8] mb-0.5">关系识别摘要</div>
                        <p className="text-[10px] text-[#475569] leading-4">{`${selNode.name}为${selNode.chainRole}，${selNode.months}个月连续交易，${selNode.txCount}笔/${selNode.txAmount}，关系强度${selNode.relationStrength}%。`}</p>
                      </div>
                      <div>
                        <div className="text-[9px] text-[#94A3B8] mb-0.5">图谱结论</div>
                        <p className="text-[10px] text-[#2563EB] font-medium">
                          {selNode.isMainChain
                            ? `该主体位于核心企业上游链路，交易与回款关系较为稳定，具备进一步尽调价值。`
                            : `该主体为辅助节点，需进一步验证关系稳定性。`}
                        </p>
                      </div>
                      <div>
                        <div className="text-[9px] text-[#94A3B8] mb-0.5">下一步建议</div>
                        <p className="text-[10px] text-[#7C3AED] font-medium">
                          {selNode.linkedHit ? '建议直接进入尽调，进一步补强合同与物流证据。' : '建议先查看公私联动结果，再决定是否进入尽调。'}
                        </p>
                      </div>
                      <div>
                        <div className="text-[9px] text-[#94A3B8] mb-0.5">建议进入页面</div>
                        <p className="text-[10px] text-[#475569]">{selNode.relationStrength >= 70 ? '智能尽调 / 候选资产列表' : '保持图谱观察'}</p>
                      </div>
                      {selNode.riskStatus !== '正常' && (
                        <div className="rounded bg-[#FFF7ED] px-2 py-1.5 text-[9px] text-[#C2410C] flex items-start gap-1">
                          <AlertCircle size={10} className="shrink-0 mt-0.5" />
                          当前图谱关系存在边界节点，建议人工确认后再决定是否进入后续作业。
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-[10px] text-[#94A3B8] leading-4">选择节点后查看 AI 对该主体的关系判断与推进建议。</p>
                  )}
                  <div className="flex flex-col gap-1.5 pt-1">
                    <Button size="sm" className="h-7 text-[10px] gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white w-full" disabled={!selNode}><CheckCircle2 size={10} />采纳建议</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569] w-full" disabled={!selNode}><UserCheck size={10} />人工确认</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#A7F3D0] text-[#047857] w-full" disabled={!selNode} onClick={() => navigate('smart-due-diligence', 'dd-report')}><FileSearch size={10} />进入尽调</Button>
                  </div>
                </div>

                {/* Node list sidebar */}
                <div className="rounded-lg border border-[#E2E8F0] bg-white p-3 space-y-2">
                  <div className="text-[11px] font-semibold text-[#0F172A]">节点列表</div>
                  <div className="space-y-1">
                    {[...GRAPH_NODES].sort((a, b) => b.relationStrength - a.relationStrength).map(n => {
                      const t = DIR_MAP[n.direction];
                      return (
                        <button key={n.id} onClick={() => setSelectedGraphNode(n.id)} className={cn('w-full text-left rounded px-2 py-1.5 text-[10px] transition-colors border', selectedGraphNode === n.id ? 'bg-[#EFF6FF] border-[#BFDBFE]' : 'border-transparent hover:bg-[#F8FAFC]')}>
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: t.stroke }} />
                            <span className="text-[#0F172A] font-medium flex-1 truncate">{n.name}</span>
                            <span className="font-bold" style={{ color: strColor(n.relationStrength) }}>{n.relationStrength}</span>
                            {n.isMainChain && <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] shrink-0" />}
                            {n.linkedHit && <span className="w-1.5 h-1.5 rounded-full bg-[#7C3AED] shrink-0" />}
                          </div>
                          <div className="flex items-center gap-2 mt-0.5 ml-3.5 text-[9px] text-[#94A3B8]">
                            <span>{t.label}</span><span>{n.txAmount}</span><span>{n.months}月</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      }

      /* ═══════════════════════════════════════════════════════════
         PAGE 7: 公私联动验证 — 主体真实性与关联关系补强工作台
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
            legalPerson: '张建华', legalIdMasked: '3204****1234', controller: '张建华', managerName: '王敏',
            isBankClient: true, hasCorpAccount: true, hasPersonalClue: true, credibility: 88, conclusion: '公私联动验证通过，法人账户与企业回款存在连续命中',
            links: [
              { type: '法人绑定企业', target: '张建华', relation: '法人代表', basis: '工商登记', hitTime: '2026-04-01', strength: 95, continuous: true, needConfirm: false },
              { type: '法人个人账户与对公账户联动', target: '张建华个人账户', relation: '资金往来', basis: '行内流水匹配', hitTime: '2026-04-08', strength: 86, continuous: true, needConfirm: false },
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
                <h2 className="text-[15px] font-semibold text-[#0F172A]">公私联动验证</h2>
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

            {/* Overview cards */}
            <div className="grid grid-cols-5 gap-3">
              {[
                { label: '联动命中主体', value: hitTotal, desc: '当前已命中公私联动线索的企业主体数量', icon: Fingerprint, color: 'text-[#475569]' },
                { label: '高可信联动', value: highCredCount, desc: '已具备较强联动依据、可用于识别补强的主体', icon: CheckCircle2, color: 'text-[#047857]' },
                { label: '待人工确认', value: needConfirmCount, desc: '存在联动线索，但仍需人工复核的主体', icon: UserCheck, color: 'text-[#F59E0B]' },
                { label: '异常联动', value: anomalyCount, desc: '存在冲突、缺失或异常线索的主体', icon: AlertCircle, color: 'text-[#DC2626]' },
                { label: '可推进主体', value: pushableLinkedCount, desc: '建议进入候选池、关系图谱或尽调的主体', icon: ArrowRight, color: 'text-[#2563EB]' },
              ].map(c => (
                <div key={c.label} className="rounded-lg border border-[#E2E8F0] bg-white p-3 space-y-1">
                  <div className="flex items-center gap-1.5"><c.icon size={12} className={c.color} /><span className="text-[10px] text-[#64748B]">{c.label}</span></div>
                  <div className="text-[20px] font-bold text-[#0F172A]">{c.value}</div>
                  <div className="text-[9px] text-[#94A3B8]">{c.desc}</div>
                </div>
              ))}
            </div>

            {/* Four-column layout */}
            <div className="grid grid-cols-[220px_1fr_1fr_260px] gap-3" style={{ minHeight: 520 }}>

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

              {/* COL 4: AI judgment & actions */}
              <div className="space-y-3">
                {/* AI judgment card */}
                <div className="rounded-lg border border-[#E2E8F0] bg-white p-3 space-y-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#7C3AED] to-[#2563EB] flex items-center justify-center"><Brain size={10} className="text-white" /></div>
                    <span className="text-[11px] font-semibold text-[#0F172A]">AI 判断</span>
                  </div>
                  {activeLE ? (
                    <div className="space-y-2">
                      <div>
                        <div className="text-[9px] text-[#94A3B8] mb-0.5">当前判断</div>
                        <p className="text-[10px] text-[#0F172A] leading-4 font-medium">
                          {activeLE.credibility >= 70
                            ? `${activeLE.shortName}已形成较完整的公私联动线索，能够对经营真实性提供有效补强。`
                            : `${activeLE.shortName}联动线索存在，但仍需对关键账户关系做进一步确认。`}
                        </p>
                      </div>
                      <div>
                        <div className="text-[9px] text-[#94A3B8] mb-0.5">公私联动摘要</div>
                        <p className="text-[10px] text-[#475569] leading-4">
                          {`法人${activeLE.legalPerson}与对公账户之间${activeLE.credibility >= 70 ? '存在连续命中' : '存在部分命中'}，${activeLE.links.filter(l => l.continuous).length}/${activeLE.links.length} 条联动连续。`}
                        </p>
                      </div>
                      <div>
                        <div className="text-[9px] text-[#94A3B8] mb-0.5">可信度结论</div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 rounded-full bg-[#F1F5F9] overflow-hidden"><div className="h-full rounded-full" style={{ width: `${activeLE.credibility}%`, backgroundColor: activeLE.credibility >= 70 ? '#047857' : activeLE.credibility >= 50 ? '#F59E0B' : '#DC2626' }} /></div>
                          <span className="text-[11px] font-bold" style={{ color: activeLE.credibility >= 70 ? '#047857' : activeLE.credibility >= 50 ? '#F59E0B' : '#DC2626' }}>{activeLE.credibility}%</span>
                        </div>
                      </div>
                      {activeLE.evidences.some(ev => ev.anomaly || ev.conflict) && (
                        <div>
                          <div className="text-[9px] text-[#94A3B8] mb-0.5">主要风险提示</div>
                          <div className="rounded bg-[#FEF2F2] px-2 py-1.5 text-[9px] text-[#DC2626] space-y-0.5">
                            {activeLE.evidences.filter(ev => ev.anomaly).map((ev, i) => <div key={i}>· {ev.anomaly}</div>)}
                            {activeLE.evidences.filter(ev => ev.conflict).map((ev, i) => <div key={i}>· {ev.source}: 存在冲突线索</div>)}
                          </div>
                        </div>
                      )}
                      <div>
                        <div className="text-[9px] text-[#94A3B8] mb-0.5">下一步建议</div>
                        <p className="text-[10px] text-[#7C3AED] font-medium">
                          {activeLE.credibility >= 70
                            ? '建议进入关系图谱查看完整链路，并结合证据核验结果决定是否推进尽调。'
                            : activeLE.credibility >= 50
                              ? '建议先补充异常信息后再推进作业。'
                              : '联动线索不足，暂无法形成可信结论，建议持续观察。'}
                        </p>
                      </div>
                      <div>
                        <div className="text-[9px] text-[#94A3B8] mb-0.5">建议进入页面</div>
                        <p className="text-[10px] text-[#475569]">{activeLE.credibility >= 70 ? '关系图谱 / 智能尽调' : activeLE.credibility >= 50 ? '关系图谱' : '保持当前验证'}</p>
                      </div>
                      {activeLE.links.some(l => l.needConfirm) && (
                        <div className="rounded bg-[#FFF7ED] px-2 py-1.5 text-[9px] text-[#C2410C] flex items-start gap-1">
                          <AlertCircle size={10} className="shrink-0 mt-0.5" />
                          存在待人工确认的联动关系，请核验后再做最终推进。
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-[10px] text-[#94A3B8]">选择主体后查看 AI 联动判断。</p>
                  )}
                  <div className="flex flex-col gap-1.5 pt-1">
                    <Button size="sm" className="h-7 text-[10px] gap-1 bg-[#7C3AED] hover:bg-[#6D28D9] text-white w-full" disabled={!activeLE}><CheckCircle2 size={10} />采纳建议</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#A7F3D0] text-[#047857] w-full" disabled={!activeLE} onClick={() => navigate('smart-due-diligence', 'dd-report')}><FileSearch size={10} />进入尽调</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#BFDBFE] text-[#2563EB] w-full" disabled={!activeLE}><ArrowRight size={10} />加入候选池</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569] w-full" disabled={!activeLE}><UserCheck size={10} />人工确认</Button>
                  </div>
                </div>

                {/* Quick navigation */}
                <div className="rounded-lg border border-[#E2E8F0] bg-white p-3 space-y-2">
                  <div className="text-[11px] font-semibold text-[#0F172A]">快捷跳转</div>
                  <div className="space-y-1">
                    <button onClick={() => onModuleChange('graph')} className="w-full text-left px-2 py-1.5 rounded text-[10px] text-[#475569] hover:bg-[#F8FAFC] flex items-center gap-2 transition-colors"><Network size={10} className="text-[#2563EB]" />查看关系图谱</button>
                    <button onClick={() => onModuleChange('list')} className="w-full text-left px-2 py-1.5 rounded text-[10px] text-[#475569] hover:bg-[#F8FAFC] flex items-center gap-2 transition-colors"><Layers size={10} className="text-[#047857]" />候选资产列表</button>
                    <button onClick={() => onModuleChange('feed')} className="w-full text-left px-2 py-1.5 rounded text-[10px] text-[#475569] hover:bg-[#F8FAFC] flex items-center gap-2 transition-colors"><Sparkles size={10} className="text-[#F59E0B]" />智能推荐流</button>
                  </div>
                </div>
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

  return (
    <SceneLayout title={scene.title} modules={scene.modules} activeModule={activeModule} onModuleChange={onModuleChange}>
      {renderContent()}
    </SceneLayout>
  );
}
