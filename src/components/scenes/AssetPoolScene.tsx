import React from 'react';
import SceneLayout from '../SceneLayout';
import { SCENES } from '../../constants';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Database,
  ChevronDown,
  Clock,
  Eye,
  FileCheck2,
  Filter,
  Search,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
  Zap,
} from 'lucide-react';
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
import { SceneHero, ActionBar } from '../../demo/DemoComponents';
import { SAMPLES, SAMPLE_YUTONG, SAMPLE_CHIYUAN, SAMPLE_RUIXIN, SAMPLE_RUIFENG } from '../../demo/chainLoan/data';
import { StageFunnelChart, CHART_COLORS } from '../Charts';
import { cn } from '@/lib/utils';

/* ══════════════════════════════════════════════════════════════════════════
   Data for the scene
   ══════════════════════════════════════════════════════════════════════════ */

const ASSET_LIST = [
  { id: 'a-001', name: '裕同包装科技', industry: '包装材料', limit: '120万', used: '95万', status: '正常' as const, dueDate: '2026-07-15', riskLevel: 5, manager: '张三', updatedAgo: '10分钟前' },
  { id: 'a-002', name: '新宙邦科技', industry: '新材料', limit: '110万', used: '86万', status: '观察' as const, dueDate: '2026-05-20', riskLevel: 3, manager: '李雪婷', updatedAgo: '1小时前' },
  { id: 'a-003', name: '瑞泰新能源材料', industry: '新能源辅料', limit: '72万', used: '72万', status: '风险' as const, dueDate: '2026-04-28', riskLevel: 2, manager: '王敏', updatedAgo: '30分钟前' },
  { id: 'a-004', name: '中外运物流', industry: '物流服务', limit: '80万', used: '52万', status: '正常' as const, dueDate: '2026-08-10', riskLevel: 4, manager: '张三', updatedAgo: '3小时前' },
  { id: 'a-005', name: '王子新材料', industry: '包装材料', limit: '60万', used: '0万', status: '逾期' as const, dueDate: '2026-03-25', riskLevel: 1, manager: '陈立', updatedAgo: '昨天' },
  { id: 'a-006', name: '科陆储能技术', industry: '储能设备', limit: '150万', used: '120万', status: '正常' as const, dueDate: '2026-09-01', riskLevel: 5, manager: '李雪婷', updatedAgo: '2小时前' },
  { id: 'a-007', name: '盛拓模组科技', industry: '电池模组', limit: '200万', used: '180万', status: '正常' as const, dueDate: '2026-10-15', riskLevel: 4, manager: '张三', updatedAgo: '5小时前' },
  { id: 'a-008', name: '驰远物流服务', industry: '物流', limit: '80万', used: '45万', status: '观察' as const, dueDate: '2026-06-12', riskLevel: 3, manager: '王敏', updatedAgo: '1天前' },
];

const STATUS_STYLES = {
  '正常': { bg: 'bg-[#ECFDF3]', text: 'text-[#047857]', border: 'border-[#A7F3D0]', dot: 'bg-[#16A34A]' },
  '观察': { bg: 'bg-[#FFF7ED]', text: 'text-[#C2410C]', border: 'border-[#FED7AA]', dot: 'bg-[#F59E0B]' },
  '逾期': { bg: 'bg-[#FEF2F2]', text: 'text-[#DC2626]', border: 'border-[#FCA5A5]', dot: 'bg-[#DC2626]' },
  '风险': { bg: 'bg-[#FEF2F2]', text: 'text-[#DC2626]', border: 'border-[#FCA5A5]', dot: 'bg-[#DC2626]' },
};

const RISK_ASSETS = [
  { id: 'r-001', name: '瑞泰新能源材料', overdueDays: 18, riskLevel: '高' as const, dueDate: '2026-03-22', amount: '72万', reason: '回款周期拉长+物流延迟', manager: '王敏' },
  { id: 'r-002', name: '王子新材料', overdueDays: 15, riskLevel: '高' as const, dueDate: '2026-03-25', amount: '60万', reason: '连续4周净流出', manager: '陈立' },
  { id: 'r-003', name: '新宙邦科技', overdueDays: 0, riskLevel: '中' as const, dueDate: '2026-05-20', amount: '110万', reason: '客户集中度偏高', manager: '李雪婷' },
  { id: 'r-004', name: '驰远物流服务', overdueDays: 0, riskLevel: '中' as const, dueDate: '2026-06-12', amount: '80万', reason: '运单频次近期下降', manager: '王敏' },
  { id: 'r-005', name: '佳利包装', overdueDays: 7, riskLevel: '低' as const, dueDate: '2026-04-02', amount: '60万', reason: '证据覆盖率不足', manager: '张三' },
];

const REPAY_PLANS = [
  { id: 'rp-01', name: '裕同包装科技', dueDate: '2026-04-15', amount: '15万', status: '即将到期' as const, daysLeft: 6 },
  { id: 'rp-02', name: '科陆储能技术', dueDate: '2026-04-20', amount: '25万', status: '即将到期' as const, daysLeft: 11 },
  { id: 'rp-03', name: '盛拓模组科技', dueDate: '2026-04-25', amount: '30万', status: '未到期' as const, daysLeft: 16 },
  { id: 'rp-04', name: '中外运物流', dueDate: '2026-04-30', amount: '12万', status: '未到期' as const, daysLeft: 21 },
  { id: 'rp-05', name: '瑞泰新能源材料', dueDate: '2026-03-22', amount: '18万', status: '逾期' as const, daysLeft: -18 },
  { id: 'rp-06', name: '王子新材料', dueDate: '2026-03-25', amount: '10万', status: '逾期' as const, daysLeft: -15 },
];

const REPAY_RECORDS = [
  { id: 'rr-01', name: '裕同包装科技', date: '2026-03-15', amount: '15万', status: '已还' as const },
  { id: 'rr-02', name: '科陆储能技术', date: '2026-03-20', amount: '25万', status: '已还' as const },
  { id: 'rr-03', name: '盛拓模组科技', date: '2026-03-25', amount: '30万', status: '已还' as const },
  { id: 'rr-04', name: '中外运物流', date: '2026-03-30', amount: '12万', status: '已还' as const },
  { id: 'rr-05', name: '瑞泰新能源材料', date: '2026-03-22', amount: '18万', status: '未还' as const },
  { id: 'rr-06', name: '王子新材料', date: '2026-03-25', amount: '10万', status: '未还' as const },
];

/* ══════════════════════════════════════════════════════════════════════════
   ConfidenceDots (risk level)
   ══════════════════════════════════════════════════════════════════════════ */
function RiskDots({ level, max = 5 }: { level: number; max?: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <div key={i} className={cn('w-2 h-2 rounded-full', i < level ? (level <= 2 ? 'bg-[#DC2626]' : level <= 3 ? 'bg-[#F59E0B]' : 'bg-[#16A34A]') : 'bg-[#E5E6EB]')} />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════════════════════════════ */

interface Props { activeModule: string; onModuleChange: (id: string) => void }

export default function AssetPoolScene({ activeModule, onModuleChange }: Props) {
  const scene = SCENES.find(s => s.id === 'asset-pool')!;
  const { active, stage, stageIndex, riskSimulated, recoveryComplete, currentSample, selectSample, selectedSampleId } = useDemo();

  const isPastApproval = stageIndex >= STAGE_ORDER.indexOf('approved');
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [sortBy, setSortBy] = React.useState('updated');
  const [riskLevelFilter, setRiskLevelFilter] = React.useState('all');
  const [overdueFilter, setOverdueFilter] = React.useState('all');
  const [repayTab, setRepayTab] = React.useState<'plan' | 'record'>('plan');

  const filteredAssets = ASSET_LIST.filter(a => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    return true;
  }).sort((a, b) => {
    if (sortBy === 'due') return a.dueDate.localeCompare(b.dueDate);
    if (sortBy === 'risk') return a.riskLevel - b.riskLevel;
    return 0;
  });

  const filteredRisk = RISK_ASSETS.filter(a => {
    if (riskLevelFilter !== 'all' && a.riskLevel !== riskLevelFilter) return false;
    if (overdueFilter === '7') return a.overdueDays >= 7;
    if (overdueFilter === '15') return a.overdueDays >= 15;
    if (overdueFilter === '30') return a.overdueDays >= 30;
    return true;
  });

  const renderContent = () => {
    switch (activeModule) {

      /* ════════════════════════════════════════════════════════════════════
         PAGE 1: 在营资产列表 (DEFAULT)
         ════════════════════════════════════════════════════════════════════ */
      case 'activated':
      default:
        return (
          <div className="space-y-4">
            {/* Header */}
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Wallet size={14} className="text-[#2563EB]" />
                <span className="text-[13px] font-semibold text-[#0F172A]">在营资产列表</span>
                <span className="text-[11px] text-[#94A3B8]">共 {ASSET_LIST.length} 户 · 在营余额 ¥12.8亿</span>
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-[10px] text-[#64748B] gap-1"><Search size={10} /> 搜索</Button>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricCard label="正常经营" value={`${ASSET_LIST.filter(a => a.status === '正常').length} 户`} detail="健康运营中" tone="green" />
              <MetricCard label="观察中" value={`${ASSET_LIST.filter(a => a.status === '观察').length} 户`} detail="波动待稳" tone="amber" />
              <MetricCard label="逾期" value={`${ASSET_LIST.filter(a => a.status === '逾期').length} 户`} detail="需催收跟进" tone="red" />
              <MetricCard label="风险" value={`${ASSET_LIST.filter(a => a.status === '风险').length} 户`} detail="预警已触发" tone="red" />
            </div>

            {/* Filter + Sort bar */}
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5 text-[11px] text-[#64748B]"><Filter size={12} /> 筛选:</div>
              <select className="h-7 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-2 text-[11px] text-[#334155]" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="all">全部状态</option>
                <option value="正常">正常</option>
                <option value="观察">观察</option>
                <option value="逾期">逾期</option>
                <option value="风险">风险</option>
              </select>
              <select className="h-7 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-2 text-[11px] text-[#334155]" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="updated">按更新时间</option>
                <option value="due">按到期日</option>
                <option value="risk">按风险等级</option>
              </select>
              <div className="flex-1" />
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 text-[#64748B]"><Bell size={10} /> 批量设置提醒</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 text-[#DC2626] border-[#FCA5A5]"><AlertTriangle size={10} /> 批量标记风险</Button>
            </div>

            {/* Table */}
            <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
              <div className="grid grid-cols-[24px_1fr_80px_80px_100px_90px_80px_120px] gap-0 px-4 py-2.5 border-b border-[#E2E8F0] bg-[#F8FAFC] text-[10px] font-medium text-[#94A3B8] uppercase tracking-wider">
                <div></div><div>企业简称</div><div>额度</div><div>状态</div><div>还款到期日</div><div>风险等级</div><div>更新</div><div>操作</div>
              </div>
              {filteredAssets.map(a => {
                const st = STATUS_STYLES[a.status];
                return (
                  <div key={a.id} className="grid grid-cols-[24px_1fr_80px_80px_100px_90px_80px_120px] gap-0 px-4 py-3 border-b border-[#F1F5F9] last:border-b-0 items-center hover:bg-[#FAFBFF] transition-colors">
                    <input type="checkbox" className="w-3.5 h-3.5 rounded border-[#CBD5E1]" />
                    <div>
                      <div className="text-[12px] font-medium text-[#0F172A]">{a.name}</div>
                      <div className="text-[10px] text-[#94A3B8]">{a.industry} · {a.manager}</div>
                    </div>
                    <div className="text-[12px] font-semibold text-[#0F172A]">{a.limit}</div>
                    <div><Badge className={cn('text-[9px] border', st.bg, st.text, st.border)}>{a.status}</Badge></div>
                    <div className="text-[11px] text-[#64748B] font-mono">{a.dueDate}</div>
                    <div><RiskDots level={a.riskLevel} /></div>
                    <div className="text-[10px] text-[#94A3B8]">{a.updatedAgo}</div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-6 text-[10px] px-1.5 text-[#64748B]"><Eye size={10} /></Button>
                      <Button variant="ghost" size="sm" className="h-6 text-[10px] px-1.5 text-[#2563EB]" onClick={() => onModuleChange('repayment')}>还款</Button>
                      <Button variant="ghost" size="sm" className="h-6 text-[10px] px-1.5 text-[#DC2626]" onClick={() => onModuleChange('risk-assets')}>预警</Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {active && isPastApproval && (
              <InsightStrip tone={riskSimulated ? 'risk' : 'normal'}>
                当前样本 — <strong>{currentSample.shortName}</strong> ·
                在营额度: {riskSimulated ? (recoveryComplete ? `${Math.round(parseInt(currentSample.recommendedLimit) * 0.9)}万 (已恢复 90%)` : `${currentSample.currentLimit} (已收缩)`) : currentSample.currentLimit}
                {riskSimulated ? (recoveryComplete ? ' · 恢复观察中' : ' · 风险收缩中') : ' · 正常经营'}
              </InsightStrip>
            )}

            {active && <ActionBar />}
          </div>
        );

      /* ════════════════════════════════════════════════════════════════════
         PAGE 2: 风险资产
         ════════════════════════════════════════════════════════════════════ */
      case 'risk-assets':
        return (
          <div className="space-y-4">
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldAlert size={14} className="text-[#DC2626]" />
                <span className="text-[13px] font-semibold text-[#0F172A]">风险资产</span>
                <span className="text-[11px] text-[#94A3B8]">共 {RISK_ASSETS.length} 户</span>
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-[10px] text-[#64748B] gap-1"><Search size={10} /> 搜索</Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricCard label="逾期客户" value={`${RISK_ASSETS.filter(a => a.overdueDays > 0).length} 户`} detail={`逾期金额 ¥${RISK_ASSETS.filter(a => a.overdueDays > 0).reduce((s, a) => s + parseInt(a.amount), 0)}万`} tone="red" />
              <MetricCard label="高风险" value={`${RISK_ASSETS.filter(a => a.riskLevel === '高').length} 户`} detail="需紧急介入" tone="red" />
              <MetricCard label="中风险" value={`${RISK_ASSETS.filter(a => a.riskLevel === '中').length} 户`} detail="持续关注" tone="amber" />
              <MetricCard label="低风险" value={`${RISK_ASSETS.filter(a => a.riskLevel === '低').length} 户`} detail="待观察" tone="slate" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[200px_1fr] gap-4">
              {/* Left sidebar filters */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white p-3 space-y-3 h-fit">
                <div className="text-[11px] font-semibold text-[#0F172A]">风险等级</div>
                <div className="space-y-1">
                  {[
                    { value: 'all', label: '全部', count: RISK_ASSETS.length },
                    { value: '高', label: '高风险', count: RISK_ASSETS.filter(a => a.riskLevel === '高').length },
                    { value: '中', label: '中风险', count: RISK_ASSETS.filter(a => a.riskLevel === '中').length },
                    { value: '低', label: '低风险', count: RISK_ASSETS.filter(a => a.riskLevel === '低').length },
                  ].map(opt => (
                    <button key={opt.value} onClick={() => setRiskLevelFilter(opt.value)} className={cn('w-full flex items-center justify-between rounded-md px-2.5 py-2 text-[11px] transition-colors', riskLevelFilter === opt.value ? 'bg-[#EFF6FF] text-[#2563EB] font-medium' : 'text-[#64748B] hover:bg-[#F8FAFC]')}>
                      <span>{opt.label}</span>
                      <span className="text-[10px] bg-[#F1F5F9] rounded-full px-1.5 py-0.5">{opt.count}</span>
                    </button>
                  ))}
                </div>
                <div className="border-t border-[#F1F5F9] pt-3 space-y-1">
                  <div className="text-[11px] font-semibold text-[#0F172A]">逾期天数</div>
                  {[
                    { value: 'all', label: '全部' },
                    { value: '7', label: '≥ 7 天' },
                    { value: '15', label: '≥ 15 天' },
                    { value: '30', label: '≥ 30 天' },
                  ].map(opt => (
                    <button key={opt.value} onClick={() => setOverdueFilter(opt.value)} className={cn('w-full text-left rounded-md px-2.5 py-2 text-[11px] transition-colors', overdueFilter === opt.value ? 'bg-[#EFF6FF] text-[#2563EB] font-medium' : 'text-[#64748B] hover:bg-[#F8FAFC]')}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right list */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
                <div className="grid grid-cols-[1fr_80px_80px_100px_150px] gap-0 px-4 py-2.5 border-b border-[#E2E8F0] bg-[#F8FAFC] text-[10px] font-medium text-[#94A3B8] uppercase tracking-wider">
                  <div>企业简称</div><div>逾期天数</div><div>风险等级</div><div>到期日</div><div>操作</div>
                </div>
                {filteredRisk.map(a => (
                  <div key={a.id} className="grid grid-cols-[1fr_80px_80px_100px_150px] gap-0 px-4 py-3 border-b border-[#F1F5F9] last:border-b-0 items-center hover:bg-[#FAFBFF] transition-colors">
                    <div>
                      <div className="text-[12px] font-medium text-[#0F172A]">{a.name}</div>
                      <div className="mt-0.5 text-[10px] text-[#94A3B8]">{a.reason}</div>
                      <div className="mt-0.5 text-[10px] text-[#94A3B8]">金额 {a.amount} · {a.manager}</div>
                    </div>
                    <div className={cn('text-[12px] font-semibold', a.overdueDays > 0 ? (a.overdueDays >= 15 ? 'text-[#DC2626]' : 'text-[#C2410C]') : 'text-[#64748B]')}>
                      {a.overdueDays > 0 ? `逾期 ${a.overdueDays} 天` : '—'}
                    </div>
                    <div>
                      <Badge className={cn('text-[9px] border', a.riskLevel === '高' ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]' : a.riskLevel === '中' ? 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]' : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]')}>
                        {a.riskLevel}
                      </Badge>
                    </div>
                    <div className="text-[11px] text-[#64748B] font-mono">{a.dueDate}</div>
                    <div className="flex items-center gap-1.5">
                      <Button variant="outline" size="sm" className="h-6 text-[10px] px-2 gap-1 text-[#DC2626] border-[#FCA5A5]">催收</Button>
                      <Button variant="outline" size="sm" className="h-6 text-[10px] px-2 gap-1 text-[#C2410C] border-[#FED7AA]">预警</Button>
                      <Button variant="ghost" size="sm" className="h-6 text-[10px] px-1.5 text-[#64748B]"><Eye size={10} /></Button>
                    </div>
                  </div>
                ))}
                {filteredRisk.length === 0 && (
                  <div className="text-center py-10 text-[#94A3B8] text-xs">无匹配结果</div>
                )}
              </div>
            </div>

            {active && <ActionBar />}
          </div>
        );

      /* ════════════════════════════════════════════════════════════════════
         PAGE 3: 还款管理
         Tab 切换（还款计划 / 还款记录）
         ════════════════════════════════════════════════════════════════════ */
      case 'repayment':
        return (
          <div className="space-y-4">
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar size={14} className="text-[#2563EB]" />
                <span className="text-[13px] font-semibold text-[#0F172A]">还款状态看板</span>
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-[10px] text-[#64748B] gap-1"><Search size={10} /> 搜索</Button>
            </div>

            {/* Data source label */}
            <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 flex items-center gap-2 text-[11px] text-[#94A3B8]">
              <Database size={12} className="shrink-0" />
              <span>数据同步自统一信贷系统，T+1 更新 · 最近同步时间: {new Date().toLocaleDateString('zh-CN')} 02:00</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricCard label="本月到期" value="86 户" detail="到期金额 ¥3,240万" tone="blue" />
              <MetricCard label="已正常还款" value="72 户" detail="还款率 83.7%" tone="green" />
              <MetricCard label="即将到期 (7天内)" value="18 户" detail="金额 ¥680万" tone="amber" />
              <MetricCard label="逾期未还" value="8 户" detail="金额 ¥286万" tone="red" />
            </div>

            {/* Anomaly alert strip */}
            <div className="rounded-lg border border-[#FCA5A5] bg-[#FEF2F2] px-4 py-3 flex items-start gap-3 text-[12px]">
              <AlertTriangle size={14} className="text-[#DC2626] shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-[#DC2626]">数据差异提醒</span>
                <span className="text-[#334155] ml-2">风险监控侦测到 3 户逾期信号（瑞丰辅料等），但统一信贷系统状态尚未更新为逾期，请核实确认。</span>
              </div>
            </div>

            {/* Tab bar */}
            <div className="flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-white px-2 py-1">
              {(['plan', 'record'] as const).map(tab => (
                <button key={tab} onClick={() => setRepayTab(tab)} className={cn('px-4 py-2 rounded-md text-[12px] font-medium transition-colors', repayTab === tab ? 'bg-[#EFF6FF] text-[#2563EB]' : 'text-[#64748B] hover:bg-[#F8FAFC]')}>
                  {tab === 'plan' ? '还款计划' : '还款记录'}
                </button>
              ))}
            </div>

            {repayTab === 'plan' ? (
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
                <div className="grid grid-cols-[1fr_100px_80px_100px_100px] gap-0 px-4 py-2.5 border-b border-[#E2E8F0] bg-[#F8FAFC] text-[10px] font-medium text-[#94A3B8] uppercase tracking-wider">
                  <div>企业</div><div>到期日</div><div>金额</div><div>信贷系统状态</div><div>本系统侦测</div>
                </div>
                {REPAY_PLANS.map(p => {
                  const statusStyle = p.status === '逾期' ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]' : p.status === '即将到期' ? 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]' : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]';
                  const hasAnomaly = p.status === '逾期';
                  return (
                    <div key={p.id} className={cn('grid grid-cols-[1fr_100px_80px_100px_100px] gap-0 px-4 py-3 border-b border-[#F1F5F9] last:border-b-0 items-center transition-colors', hasAnomaly ? 'bg-[#FEF2F2]/40 hover:bg-[#FEF2F2]/60' : 'hover:bg-[#FAFBFF]')}>
                      <div className="text-[12px] font-medium text-[#0F172A]">{p.name}</div>
                      <div className="text-[11px] text-[#64748B] font-mono">{p.dueDate}</div>
                      <div className="text-[12px] font-semibold text-[#0F172A]">{p.amount}</div>
                      <div><Badge className={cn('text-[9px] border', statusStyle)}>{p.status}</Badge></div>
                      <div>
                        {hasAnomaly ? (
                          <Badge className="text-[9px] border bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]">侦测逾期·待核实</Badge>
                        ) : (
                          <Badge className="text-[9px] border bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]">一致</Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
                <div className="grid grid-cols-[1fr_100px_80px_80px_100px] gap-0 px-4 py-2.5 border-b border-[#E2E8F0] bg-[#F8FAFC] text-[10px] font-medium text-[#94A3B8] uppercase tracking-wider">
                  <div>企业</div><div>还款日期</div><div>金额</div><div>信贷系统状态</div><div>数据来源</div>
                </div>
                {REPAY_RECORDS.map(r => (
                  <div key={r.id} className="grid grid-cols-[1fr_100px_80px_80px_100px] gap-0 px-4 py-3 border-b border-[#F1F5F9] last:border-b-0 items-center hover:bg-[#FAFBFF] transition-colors">
                    <div className="text-[12px] font-medium text-[#0F172A]">{r.name}</div>
                    <div className="text-[11px] text-[#64748B] font-mono">{r.date}</div>
                    <div className="text-[12px] font-semibold text-[#0F172A]">{r.amount}</div>
                    <div><Badge className={cn('text-[9px] border', r.status === '已还' ? 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]' : 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]')}>{r.status}</Badge></div>
                    <div className="text-[10px] text-[#94A3B8]">信贷系统</div>
                  </div>
                ))}
              </div>
            )}

            {active && <ActionBar />}
          </div>
        );

      /* ════════════════════════════════════════════════════════════════════
         PAGE 4: 转化看板
         漏斗图 + 指标卡片 + 转化率
         ════════════════════════════════════════════════════════════════════ */
      case 'pipeline':
        return (
          <div className="space-y-4">
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp size={14} className="text-[#2563EB]" />
                <span className="text-[13px] font-semibold text-[#0F172A]">转化看板</span>
                <span className="text-[11px] text-[#94A3B8]">数据口径: 全量 · 截至 {new Date().toLocaleDateString('zh-CN')}</span>
              </div>
              <Badge className="bg-[#ECFDF3] text-[#047857] border border-[#A7F3D0] text-[10px] gap-1">
                <TrendingUp size={10} /> 本周转化 +12.3%
              </Badge>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-4">
              {/* Left: Funnel */}
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 space-y-4">
                <div className="text-[13px] font-semibold text-[#0F172A]">资产生成漏斗</div>
                <StageFunnelChart
                  data={[
                    { name: '识别中', value: 12480, color: CHART_COLORS.blue },
                    { name: '预授信', value: 3260, color: CHART_COLORS.sky },
                    { name: '补审', value: 680, color: CHART_COLORS.amber },
                    { name: '在营资产', value: 1120, color: CHART_COLORS.emerald },
                  ]}
                  height={220}
                />
                {/* Conversion rates */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2 border-t border-[#F1F5F9]">
                  {[
                    { from: '识别→预授信', rate: '26.1%', trend: '+1.2%' },
                    { from: '预授信→补审', rate: '20.9%', trend: '+0.8%' },
                    { from: '补审→在营', rate: '77.4%', trend: '+3.1%' },
                    { from: '全链路', rate: '9.0%', trend: '+0.4%' },
                  ].map(c => (
                    <div key={c.from} className="text-center">
                      <div className="text-[10px] text-[#94A3B8]">{c.from}</div>
                      <div className="text-[16px] font-bold text-[#0F172A]">{c.rate}</div>
                      <div className="text-[10px] text-[#16A34A]">{c.trend}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Metrics */}
              <div className="space-y-4">
                <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 space-y-3">
                  <div className="text-[13px] font-semibold text-[#0F172A]">关键指标</div>
                  <div className="space-y-2">
                    <MiniTrend label="预授信转化率" value="26.1%" trend="+1.2%" good />
                    <MiniTrend label="补审通过率" value="77.4%" trend="+3.1%" good />
                    <MiniTrend label="在营资产余额" value="¥12.8亿" trend="+4.6%" good />
                    <MiniTrend label="风险资产占比" value="4.5%" trend="-0.2%" good />
                  </div>
                </div>

                <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 space-y-3">
                  <div className="text-[13px] font-semibold text-[#0F172A]">阶段明细</div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { stage: '识别中', value: '12,480', icon: Users, color: 'text-[#2563EB]' },
                      { stage: '预授信', value: '3,260', icon: Zap, color: 'text-[#0EA5E9]' },
                      { stage: '补审中', value: '680', icon: FileCheck2, color: 'text-[#F59E0B]' },
                      { stage: '在营资产', value: '1,120', icon: Wallet, color: 'text-[#047857]' },
                    ].map(s => {
                      const Icon = s.icon;
                      return (
                        <button key={s.stage} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-left hover:bg-[#EFF6FF] transition-colors" onClick={() => { /* navigate to stage list */ }}>
                          <div className="flex items-center gap-1.5 mb-1">
                            <Icon size={12} className={s.color} />
                            <span className="text-[10px] text-[#94A3B8]">{s.stage}</span>
                          </div>
                          <div className="text-[16px] font-bold text-[#0F172A]">{s.value}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <WorkbenchPanel title="转化动作">
                  <div className="space-y-2">
                    <ActionQueueCard action="新增预授信名单推送" source="客户经理" sla="进行中" />
                    <ActionQueueCard action="补审高优任务分配" source="审批岗" sla="待处理 18 户" />
                    <ActionQueueCard action="在营客户续贷提醒" source="系统自动" sla="本周 52 户" />
                  </div>
                </WorkbenchPanel>
              </div>
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
