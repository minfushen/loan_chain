import React from 'react';
import SceneLayout from '../SceneLayout';
import { SCENES } from '../../constants';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Brain,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  Database,
  ChevronDown,
  Clock,
  Download,
  Eye,
  FileCheck2,
  Filter,
  Layers,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  Sparkles,
  Star,
  TrendingDown,
  TrendingUp,
  UserCheck,
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
  KpiBar,
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
  const [selectedAssetId, setSelectedAssetId] = React.useState<string>('a-001');
  const [selectedRiskId, setSelectedRiskId] = React.useState<string>('r-001');
  const [selectedRepayId, setSelectedRepayId] = React.useState<string>('rp-01');

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
         PAGE 1: 在营资产（5 区工作台）
         ════════════════════════════════════════════════════════════════════ */
      case 'activated': {
        type BizTag = '高价值' | '稳定经营' | '重点维护' | '重点观察' | '待激活';
        type RiskSt = '正常' | '轻度预警' | '中度预警' | '高风险关注';
        type RepaySt = '正常还款' | '临近到期' | '轻微逾期' | '已逾期' | '回款波动';

        interface ActiveAsset {
          id: string; name: string; industry: string; region: string; product: string; stage: string;
          balance: string; creditLimit: string; used: string; effectDate: string; updatedAt: string;
          bizTag: BizTag; riskStatus: RiskSt; repayStatus: RepaySt; lastActive: string; suggestion: string;
          manager: string; scene: string;
          conclusion: string; recentRepay: string; usageFreq: string; activeness: string;
          riskTags: string[]; suggestRisk: boolean; suggestRepay: boolean;
        }

        const ACTIVE_ASSETS: ActiveAsset[] = ASSET_LIST.map((a, idx) => {
          const bizTag: BizTag = a.status === '正常' && a.riskLevel >= 4 ? '高价值' : a.status === '正常' ? '稳定经营' : a.status === '观察' ? '重点观察' : a.status === '逾期' ? '待激活' : '重点维护';
          const riskStatus: RiskSt = a.riskLevel >= 4 ? '正常' : a.riskLevel === 3 ? '轻度预警' : a.riskLevel === 2 ? '中度预警' : '高风险关注';
          const repayStatus: RepaySt = a.status === '逾期' ? '已逾期' : a.status === '风险' ? '回款波动' : a.status === '观察' ? '临近到期' : '正常还款';
          return {
            id: a.id, name: a.name, industry: a.industry, region: idx <= 2 ? '常州' : idx <= 4 ? '深圳' : idx <= 5 ? '无锡' : '南京',
            product: '订单微贷', stage: '在营',
            balance: a.used, creditLimit: a.limit, used: a.used, effectDate: '2025-10-01', updatedAt: a.updatedAgo,
            bizTag, riskStatus, repayStatus, lastActive: `04/0${Math.max(1, 9 - idx)}`, suggestion: riskStatus !== '正常' ? '查看风险' : repayStatus !== '正常还款' ? '查看还款' : '持续经营',
            manager: a.manager, scene: '供应链融资',
            conclusion: riskStatus === '正常' && repayStatus === '正常还款' ? '当前处于稳定在营状态，经营表现与履约整体可控。' : '经营活跃度或履约表现出现波动，建议进一步关注。',
            recentRepay: repayStatus === '正常还款' ? '上期按时还款' : repayStatus === '已逾期' ? `逾期 ${a.status === '逾期' ? '15' : '18'} 天` : '临近到期',
            usageFreq: a.riskLevel >= 4 ? '高频' : a.riskLevel === 3 ? '中频' : '低频',
            activeness: a.riskLevel >= 4 ? '活跃' : a.riskLevel === 3 ? '一般' : '低迷',
            riskTags: a.status === '风险' ? ['回款周期拉长'] : a.status === '逾期' ? ['连续逾期'] : a.status === '观察' ? ['客户集中度偏高'] : [],
            suggestRisk: riskStatus !== '正常', suggestRepay: repayStatus !== '正常还款',
          };
        });

        const BIZ_STYLE: Record<BizTag, string> = {
          '高价值': 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
          '稳定经营': 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]',
          '重点维护': 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]',
          '重点观察': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
          '待激活': 'bg-[#F8FAFC] text-[#94A3B8] border-[#E2E8F0]',
        };
        const RISK_ST_STYLE: Record<RiskSt, string> = {
          '正常': 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]',
          '轻度预警': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
          '中度预警': 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
          '高风险关注': 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
        };

        const activeAsset = ACTIVE_ASSETS.find(a => a.id === selectedAssetId) ?? ACTIVE_ASSETS[0];
        const totalCount = ACTIVE_ASSETS.length;
        const totalBalance = '¥12.8亿';
        const highValueCount = ACTIVE_ASSETS.filter(a => a.bizTag === '高价值').length;
        const trackCount = ACTIVE_ASSETS.filter(a => a.bizTag === '重点观察' || a.bizTag === '重点维护').length;
        const normalRepayCount = ACTIVE_ASSETS.filter(a => a.repayStatus === '正常还款').length;

        const fAssets = ACTIVE_ASSETS.filter(a => {
          if (statusFilter !== 'all' && a.riskStatus !== statusFilter && a.bizTag !== statusFilter && a.repayStatus !== statusFilter) {
            if (statusFilter === '正常' && a.riskStatus === '正常') return true;
            if (statusFilter === '观察' && (a.bizTag === '重点观察')) return true;
            if (statusFilter === '逾期' && a.repayStatus === '已逾期') return true;
            if (statusFilter === '风险' && a.suggestRisk) return true;
            return false;
          }
          return true;
        });

        return (
          <div className="space-y-3">
            <div className="flex items-center justify-end gap-2 flex-wrap">
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#BFDBFE] text-[#2563EB]"><RefreshCw size={10} />刷新列表</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Download size={10} />导出资产清单</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Star size={10} />批量标记关注</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Eye size={10} />查看经营规则</Button>
            </div>

            <KpiBar items={[
              { label: '在营资产总数', value: `${totalCount} 户`, hint: '纳入经营管理的资产数量', tone: 'info' },
              { label: '在营资产余额', value: totalBalance, hint: '在营资产余额总量', tone: 'normal' },
              { label: '高价值在营', value: `${highValueCount} 户`, hint: '建议重点维护', tone: highValueCount > 0 ? 'warn' : 'muted' },
              { label: '重点跟踪', value: `${trackCount} 户`, hint: '经营波动需持续关注', tone: trackCount > 0 ? 'warn' : 'muted' },
              { label: '履约正常', value: `${normalRepayCount} 户`, hint: '还款表现稳定', tone: 'normal' },
            ]} />

            {/* 2. Filters */}
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1 text-[10px] text-[#64748B]"><Filter size={10} />筛选:</div>
              <select className="h-6 rounded border border-[#E2E8F0] bg-[#F8FAFC] px-1.5 text-[10px] text-[#334155]" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="all">全部状态</option><option value="正常">正常</option><option value="观察">观察</option><option value="逾期">逾期</option><option value="风险">风险</option>
              </select>
              <select className="h-6 rounded border border-[#E2E8F0] bg-[#F8FAFC] px-1.5 text-[10px] text-[#334155]" value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="updated">按更新时间</option><option value="due">按到期日</option><option value="risk">按风险等级</option>
              </select>
            </div>

            {/* 3-column layout: List + Detail + AI */}
            <div className="grid grid-cols-[220px_1fr_250px] gap-3" style={{ minHeight: 520 }}>

              {/* COL 1: Asset list */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-3 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                  <span className="text-[11px] font-semibold text-[#0F172A]">在营资产列表</span>
                  <p className="text-[9px] text-[#94A3B8] mt-0.5">重点关注高价值与经营波动资产</p>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {fAssets.map(a => {
                    const isActive = activeAsset?.id === a.id;
                    return (
                      <div key={a.id} onClick={() => setSelectedAssetId(a.id)}
                        className={cn('px-3 py-2.5 border-b border-[#F1F5F9] cursor-pointer transition-all', isActive ? 'bg-[#EFF6FF] border-l-2 border-l-[#2563EB]' : 'hover:bg-[#FAFBFF]')}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[11px] font-semibold text-[#0F172A] truncate">{a.name}</span>
                          <Badge className={cn('text-[7px] border', BIZ_STYLE[a.bizTag])}>{a.bizTag}</Badge>
                        </div>
                        <div className="text-[9px] text-[#64748B] mb-1">{a.industry} · {a.region} · {a.product}</div>
                        <div className="flex items-center gap-1.5 mb-1 text-[8px]">
                          <Badge className={cn('text-[7px] border', RISK_ST_STYLE[a.riskStatus])}>{a.riskStatus}</Badge>
                          <span className="text-[#64748B]">{a.repayStatus}</span>
                        </div>
                        <div className="flex items-center justify-between text-[8px] text-[#94A3B8]">
                          <span>余额 {a.balance}</span>
                          <span>{a.lastActive}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1.5">
                          <Button variant="outline" size="sm" className="h-5 text-[8px] px-1.5 gap-0.5 border-[#BFDBFE] text-[#2563EB]" onClick={e => e.stopPropagation()}>详情</Button>
                          <Button variant="ghost" size="sm" className="h-5 text-[8px] px-1 text-[#64748B]"><Star size={8} /></Button>
                          {a.suggestRisk && <Button variant="ghost" size="sm" className="h-5 text-[8px] px-1 text-[#DC2626]" onClick={e => { e.stopPropagation(); onModuleChange('risk-assets'); }}>风险</Button>}
                        </div>
                      </div>
                    );
                  })}
                  {fAssets.length === 0 && <div className="text-center py-8 text-[#94A3B8] text-[10px]">当前筛选下无命中资产</div>}
                </div>
              </div>

              {/* COL 2: Detail */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-4 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC] flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#0F172A]">当前资产详情</span>
                  <div className="flex items-center gap-1.5">
                    <Badge className={cn('text-[7px] border', BIZ_STYLE[activeAsset.bizTag])}>{activeAsset.bizTag}</Badge>
                    <Badge className={cn('text-[7px] border', RISK_ST_STYLE[activeAsset.riskStatus])}>{activeAsset.riskStatus}</Badge>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                  {/* Entity info */}
                  <div className="grid grid-cols-3 gap-x-3 gap-y-1 text-[9px] pb-2 border-b border-[#F1F5F9]">
                    <div><span className="text-[#94A3B8]">企业</span> <span className="text-[#0F172A] font-medium">{activeAsset.name}</span></div>
                    <div><span className="text-[#94A3B8]">行业</span> <span className="text-[#0F172A]">{activeAsset.industry}</span></div>
                    <div><span className="text-[#94A3B8]">地区</span> <span className="text-[#0F172A]">{activeAsset.region}</span></div>
                    <div><span className="text-[#94A3B8]">产品</span> <span className="text-[#0F172A]">{activeAsset.product}</span></div>
                    <div><span className="text-[#94A3B8]">场景</span> <span className="text-[#0F172A]">{activeAsset.scene}</span></div>
                    <div><span className="text-[#94A3B8]">客户经理</span> <span className="text-[#0F172A]">{activeAsset.manager}</span></div>
                  </div>

                  {/* Asset conclusion */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-semibold text-[#0F172A]">资产结论</div>
                    <div className={cn('rounded px-2.5 py-2 text-[9px] leading-4', activeAsset.riskStatus === '正常' && activeAsset.repayStatus === '正常还款' ? 'bg-[#F0FDF4] border border-[#BBF7D0] text-[#047857]' : 'bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E]')}>
                      {activeAsset.conclusion}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[9px]">
                      <div className="rounded border border-[#F1F5F9] bg-[#F8FAFC] px-2 py-1.5"><div className="text-[#94A3B8]">当前余额</div><div className="font-medium text-[#0F172A]">{activeAsset.balance}</div></div>
                      <div className="rounded border border-[#F1F5F9] bg-[#F8FAFC] px-2 py-1.5"><div className="text-[#94A3B8]">已用额度</div><div className="font-medium text-[#0F172A]">{activeAsset.used}</div></div>
                      <div className="rounded border border-[#F1F5F9] bg-[#F8FAFC] px-2 py-1.5"><div className="text-[#94A3B8]">授信金额</div><div className="font-medium text-[#0F172A]">{activeAsset.creditLimit}</div></div>
                    </div>
                  </div>

                  {/* Biz performance */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-semibold text-[#0F172A]">经营表现</div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[9px]">
                      <div><span className="text-[#94A3B8]">活跃度</span> <span className="text-[#0F172A]">{activeAsset.activeness}</span></div>
                      <div><span className="text-[#94A3B8]">用信频次</span> <span className="text-[#0F172A]">{activeAsset.usageFreq}</span></div>
                      <div><span className="text-[#94A3B8]">经营标签</span> <Badge className={cn('text-[7px] border', BIZ_STYLE[activeAsset.bizTag])}>{activeAsset.bizTag}</Badge></div>
                      <div><span className="text-[#94A3B8]">建议动作</span> <span className="text-[#0F172A]">{activeAsset.suggestion}</span></div>
                    </div>
                  </div>

                  {/* Risk & repayment */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-semibold text-[#0F172A]">风险与履约</div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[9px]">
                      <div className="flex items-center gap-1"><span className="text-[#94A3B8]">风险状态</span><Badge className={cn('text-[7px] border', RISK_ST_STYLE[activeAsset.riskStatus])}>{activeAsset.riskStatus}</Badge></div>
                      <div><span className="text-[#94A3B8]">还款状态</span> <span className={cn(activeAsset.repayStatus === '正常还款' ? 'text-[#047857]' : 'text-[#C2410C]')}>{activeAsset.repayStatus}</span></div>
                      <div><span className="text-[#94A3B8]">最近还款</span> <span className="text-[#0F172A]">{activeAsset.recentRepay}</span></div>
                      <div><span className="text-[#94A3B8]">最近活跃</span> <span className="text-[#0F172A]">{activeAsset.lastActive}</span></div>
                    </div>
                    {activeAsset.riskTags.length > 0 && <div className="flex flex-wrap gap-1 mt-1">{activeAsset.riskTags.map(t => <Badge key={t} className="text-[7px] bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]">{t}</Badge>)}</div>}
                    {activeAsset.riskStatus !== '正常' && <div className="text-[9px] text-[#C2410C] mt-0.5">当前存在预警信号，建议结合风险监控与还款表现进一步核查。</div>}
                  </div>

                  {/* Detail actions */}
                  <div className="flex items-center gap-1.5 border-t border-[#F1F5F9] pt-2 flex-wrap">
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#FCA5A5] text-[#DC2626]" onClick={() => onModuleChange('risk-assets')}><Shield size={9} />进入风险监控</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#FED7AA] text-[#C2410C]" onClick={() => onModuleChange('repayment')}><Calendar size={9} />进入还款表现</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]"><Eye size={9} />查看经营轨迹</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#BFDBFE] text-[#2563EB]"><Star size={9} />标记重点关注</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#DDD6FE] text-[#7C3AED]"><UserCheck size={9} />人工确认</Button>
                  </div>
                </div>
              </div>

              {/* COL 3: AI judgment */}
              <div className="space-y-3">
                <div className="rounded-lg border border-[#E2E8F0] bg-white p-3 space-y-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#7C3AED] to-[#2563EB] flex items-center justify-center"><Brain size={10} className="text-white" /></div>
                    <span className="text-[11px] font-semibold text-[#0F172A]">AI 建议</span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">当前判断</div>
                      <p className="text-[10px] text-[#0F172A] leading-4 font-medium">
                        {activeAsset.riskStatus === '正常' && activeAsset.repayStatus === '正常还款'
                          ? `${activeAsset.name}整体经营状态稳定，建议持续经营跟进。`
                          : `${activeAsset.name}经营活跃度与回款表现存在波动，建议持续跟踪。`}
                      </p>
                    </div>

                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">资产经营摘要</div>
                      <p className="text-[9px] text-[#475569] leading-4">
                        余额 {activeAsset.balance}，用信{activeAsset.usageFreq}，活跃度{activeAsset.activeness}，
                        {activeAsset.repayStatus === '正常还款' ? '履约表现稳定' : `履约${activeAsset.repayStatus}`}。
                      </p>
                    </div>

                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">经营价值</div>
                      {(() => {
                        const score = activeAsset.bizTag === '高价值' ? 90 : activeAsset.bizTag === '稳定经营' ? 75 : activeAsset.bizTag === '重点维护' ? 55 : activeAsset.bizTag === '重点观察' ? 40 : 20;
                        return (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 rounded-full bg-[#F1F5F9] overflow-hidden"><div className="h-full rounded-full" style={{ width: `${score}%`, backgroundColor: score >= 70 ? '#047857' : score >= 40 ? '#F59E0B' : '#DC2626' }} /></div>
                            <span className="text-[10px] font-bold" style={{ color: score >= 70 ? '#047857' : score >= 40 ? '#F59E0B' : '#DC2626' }}>{score}分</span>
                          </div>
                        );
                      })()}
                    </div>

                    {activeAsset.riskTags.length > 0 && (
                      <div>
                        <div className="text-[9px] text-[#94A3B8] mb-0.5">主要风险提示</div>
                        <div className="rounded bg-[#FEF2F2] px-2 py-1.5 text-[9px] text-[#DC2626] space-y-0.5">
                          {activeAsset.riskTags.map((t, i) => <div key={i}>· {t}</div>)}
                          <div>· 风险状态：{activeAsset.riskStatus}</div>
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">下一步建议</div>
                      <p className="text-[10px] text-[#7C3AED] font-medium">
                        {activeAsset.suggestRisk
                          ? '建议进入风险监控查看预警变化，并结合还款表现观察短期履约。'
                          : activeAsset.suggestRepay
                            ? '建议进入还款表现查看履约情况。'
                            : '建议继续经营跟进，保持稳定管理。'}
                      </p>
                    </div>

                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">建议进入页面</div>
                      <p className="text-[10px] text-[#475569]">{activeAsset.suggestRisk ? '风险监控' : activeAsset.suggestRepay ? '还款表现' : '继续经营跟进'}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 pt-1">
                    <Button size="sm" className="h-7 text-[10px] gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white w-full"><CheckCircle2 size={10} />采纳建议</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#FCA5A5] text-[#DC2626] w-full" onClick={() => onModuleChange('risk-assets')}><ArrowRight size={10} />进入风险监控</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#FED7AA] text-[#C2410C] w-full" onClick={() => onModuleChange('repayment')}><ArrowRight size={10} />进入还款表现</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#A7F3D0] text-[#047857] w-full"><ArrowRight size={10} />继续经营跟进</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569] w-full"><UserCheck size={10} />人工确认</Button>
                  </div>
                </div>
              </div>
            </div>

            {active && <ActionBar />}
          </div>
        );
      }

      /* ════════════════════════════════════════════════════════════════════
         PAGE 2: 风险监控（5 区工作台）
         ════════════════════════════════════════════════════════════════════ */
      case 'risk-assets': {
        type RiskLevel = '轻度预警' | '中度预警' | '高风险关注' | '已异常资产';
        type RiskType = '还款波动' | '逾期上升' | '用信活跃下降' | '经营异常' | '风险标签新增' | '客户经理重点关注';
        type RiskTrend = '上升' | '持平' | '下降' | '波动';

        interface RiskTier { level: RiskLevel; count: number; balance: string; pct: number; mainType: RiskType; trend: RiskTrend; action: string }
        interface RiskAssetItem {
          id: string; name: string; industry: string; region: string; product: string; stage: string;
          balance: string; creditLimit: string; updatedAt: string; lastActive: string;
          riskLevel: RiskLevel; riskTags: string[]; alertTime: string; repayStatus: string; suggestion: string;
          conclusion: string; changeSummary: string; activeness: string; repaySummary: string; impact: string;
          priority: '紧急' | '高' | '中' | '低'; manager: string; lastFollowUp: string;
          suggestRepay: boolean; needConfirm: boolean;
        }

        const RISK_TIERS: RiskTier[] = [
          { level: '轻度预警', count: 8, balance: '¥1.2亿', pct: 35, mainType: '还款波动', trend: '持平', action: '持续观察' },
          { level: '中度预警', count: 5, balance: '¥0.9亿', pct: 22, mainType: '逾期上升', trend: '上升', action: '重点跟踪' },
          { level: '高风险关注', count: 4, balance: '¥0.7亿', pct: 26, mainType: '经营异常', trend: '上升', action: '发起人工确认' },
          { level: '已异常资产', count: 3, balance: '¥0.4亿', pct: 17, mainType: '逾期上升', trend: '上升', action: '纳入处置清单' },
        ];

        const RISK_ITEMS: RiskAssetItem[] = RISK_ASSETS.map((ra, idx) => {
          const level: RiskLevel = ra.riskLevel === '高' ? (ra.overdueDays >= 30 ? '已异常资产' : '高风险关注') : ra.riskLevel === '中' ? '中度预警' : '轻度预警';
          const repayStatus = ra.overdueDays > 0 ? (ra.overdueDays >= 15 ? '已逾期' : '轻微逾期') : '回款波动';
          return {
            id: ra.id, name: ra.name, industry: ra.reason.split('/')[0] || '新能源', region: idx <= 1 ? '深圳' : idx === 2 ? '常州' : idx === 3 ? '无锡' : '南京',
            product: '订单微贷', stage: '在营',
            balance: ra.amount, creditLimit: `${parseInt(ra.amount) + 30}万`, updatedAt: ra.dueDate, lastActive: `04/0${Math.max(1, 8 - idx)}`,
            riskLevel: level, riskTags: ra.reason.split('/').slice(0, 2).concat(ra.overdueDays > 0 ? [`逾期${ra.overdueDays}天`] : []),
            alertTime: `2026-04-0${Math.max(1, 7 - idx)}`, repayStatus, suggestion: level === '已异常资产' ? '发起处置' : level === '高风险关注' ? '人工确认' : level === '中度预警' ? '重点跟踪' : '继续观察',
            conclusion: level === '已异常资产' || level === '高风险关注' ? '当前资产已出现连续风险预警信号，短期内需重点关注其履约表现与经营变化。' : '该资产当前处于轻度预警阶段，尚未形成明显异常，但建议持续跟踪其变化趋势。',
            changeSummary: ra.overdueDays > 0 ? `近期逾期 ${ra.overdueDays} 天，风险等级较前期上升` : '近期出现回款波动信号，风险标签有所增加',
            activeness: ra.riskLevel === '高' ? '低迷' : '波动',
            repaySummary: ra.overdueDays > 0 ? `已逾期 ${ra.overdueDays} 天` : '近期回款节奏波动',
            impact: level === '已异常资产' ? '影响资产质量' : level === '高风险关注' ? '影响持续经营' : '影响履约稳定性',
            priority: level === '已异常资产' ? '紧急' : level === '高风险关注' ? '高' : level === '中度预警' ? '中' : '低',
            manager: ra.manager, lastFollowUp: idx < 2 ? '04/08 已电话跟进' : '暂无',
            suggestRepay: ra.overdueDays > 0, needConfirm: level === '高风险关注' || level === '已异常资产',
          };
        });

        const LEVEL_STYLE: Record<RiskLevel, string> = {
          '轻度预警': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
          '中度预警': 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
          '高风险关注': 'bg-[#FEF2F2] text-[#991B1B] border-[#FCA5A5]',
          '已异常资产': 'bg-[#450A0A] text-white border-[#991B1B]',
        };
        const PRIORITY_STYLE: Record<string, string> = {
          '紧急': 'bg-[#450A0A] text-white border-[#991B1B]',
          '高': 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]',
          '中': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
          '低': 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]',
        };
        const TREND_ICON_R = { '上升': TrendingUp, '下降': TrendingDown, '持平': ArrowRight, '波动': Zap };
        const TREND_CLR = { '上升': 'text-[#DC2626]', '下降': 'text-[#047857]', '持平': 'text-[#64748B]', '波动': 'text-[#F59E0B]' };

        const riskTotal = RISK_TIERS.reduce((s, t) => s + t.count, 0);
        const highRiskCount = RISK_ITEMS.filter(r => r.riskLevel === '高风险关注' || r.riskLevel === '已异常资产').length;
        const newAlertCount = 3;
        const pendingCount = RISK_ITEMS.filter(r => r.suggestion !== '继续观察').length;
        const needConfirmCount = RISK_ITEMS.filter(r => r.needConfirm).length;

        const filteredRI = RISK_ITEMS.filter(r => {
          if (riskLevelFilter === 'all') return true;
          if (riskLevelFilter === '高') return r.riskLevel === '高风险关注' || r.riskLevel === '已异常资产';
          if (riskLevelFilter === '中') return r.riskLevel === '中度预警';
          return r.riskLevel === '轻度预警';
        }).filter(r => {
          if (overdueFilter === 'all') return true;
          const days = r.riskTags.find(t => t.includes('逾期'))?.match(/\d+/)?.[0];
          return days ? parseInt(days) >= parseInt(overdueFilter) : false;
        });

        const activeRisk = filteredRI.find(r => r.id === selectedRiskId) ?? filteredRI[0] ?? RISK_ITEMS[0];

        return (
          <div className="space-y-3">
            <div className="flex items-center justify-end gap-2 flex-wrap">
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#FCA5A5] text-[#DC2626]"><RefreshCw size={10} />刷新监控结果</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Layers size={10} />切换预警口径</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Download size={10} />导出风险清单</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Eye size={10} />查看风险规则</Button>
            </div>

            <KpiBar items={[
              { label: '风险关注资产', value: `${riskTotal} 户`, hint: '纳入风险关注范围的资产', tone: 'risk' },
              { label: '高风险资产', value: `${highRiskCount} 户`, hint: '需重点跟进', tone: highRiskCount > 0 ? 'risk' : 'muted' },
              { label: '新增预警', value: `${newAlertCount} 户`, hint: '本期新进入预警', tone: newAlertCount > 0 ? 'warn' : 'muted' },
              { label: '待处理风险项', value: `${pendingCount} 项`, hint: '待跟进、确认或处置', tone: pendingCount > 0 ? 'warn' : 'muted' },
              { label: '需人工确认', value: `${needConfirmCount} 户`, hint: '边界信号需复核', tone: needConfirmCount > 0 ? 'warn' : 'muted' },
            ]} />

            {/* 2. Risk tiers */}
            <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#F1F5F9] bg-[#F8FAFC] flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-[#0F172A]">风险分层与趋势</span>
                  <span className="text-[9px] text-[#94A3B8] ml-2">优先查看高风险关注与新增预警资产</span>
                </div>
                <Button variant="ghost" size="sm" className="h-6 text-[9px] text-[#64748B]">切换维度</Button>
              </div>
              <div className="p-3 space-y-1.5">
                {RISK_TIERS.map(tier => {
                  const TrIcon = TREND_ICON_R[tier.trend];
                  return (
                    <div key={tier.level} className="flex items-center gap-3 rounded-lg border border-[#F1F5F9] bg-[#FAFBFF] px-3 py-2 hover:bg-[#FEF2F2]/30 transition-colors cursor-pointer"
                      onClick={() => { setRiskLevelFilter(tier.level === '轻度预警' ? '低' : tier.level === '中度预警' ? '中' : '高'); }}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge className={cn('text-[7px] border', LEVEL_STYLE[tier.level])}>{tier.level}</Badge>
                          <span className="text-[9px] text-[#64748B]">主要类型: {tier.mainType}</span>
                        </div>
                        <div className="text-[9px] text-[#94A3B8] mt-0.5">建议: {tier.action}</div>
                      </div>
                      <div className="text-right shrink-0 w-14">
                        <div className="text-[12px] font-bold text-[#0F172A]">{tier.count} 户</div>
                        <div className="text-[9px] text-[#64748B]">{tier.balance}</div>
                      </div>
                      <div className="shrink-0 w-10 text-right"><div className="text-[11px] font-bold text-[#0F172A]">{tier.pct}%</div></div>
                      <div className={cn('shrink-0 flex items-center gap-0.5 text-[9px]', TREND_CLR[tier.trend])}>
                        <TrIcon size={10} />{tier.trend}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3-column: List + Detail + AI */}
            <div className="grid grid-cols-[220px_1fr_250px] gap-3" style={{ minHeight: 480 }}>

              {/* COL 1: Risk asset list */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-3 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                  <span className="text-[11px] font-semibold text-[#0F172A]">风险资产列表</span>
                  <p className="text-[9px] text-[#94A3B8] mt-0.5">重点关注风险等级与触发时间</p>
                </div>
                <div className="px-2 py-1.5 border-b border-[#F1F5F9] flex items-center gap-1.5">
                  <select className="h-5 rounded border border-[#E2E8F0] bg-[#F8FAFC] px-1 text-[9px] text-[#334155] flex-1" value={riskLevelFilter} onChange={e => setRiskLevelFilter(e.target.value)}>
                    <option value="all">全部等级</option><option value="高">高风险</option><option value="中">中风险</option><option value="低">低风险</option>
                  </select>
                  <select className="h-5 rounded border border-[#E2E8F0] bg-[#F8FAFC] px-1 text-[9px] text-[#334155] flex-1" value={overdueFilter} onChange={e => setOverdueFilter(e.target.value)}>
                    <option value="all">全部逾期</option><option value="7">≥7天</option><option value="15">≥15天</option><option value="30">≥30天</option>
                  </select>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {filteredRI.map(r => {
                    const isActive = activeRisk?.id === r.id;
                    return (
                      <div key={r.id} onClick={() => setSelectedRiskId(r.id)}
                        className={cn('px-3 py-2.5 border-b border-[#F1F5F9] cursor-pointer transition-all', isActive ? 'bg-[#FEF2F2] border-l-2 border-l-[#DC2626]' : 'hover:bg-[#FAFBFF]')}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[11px] font-semibold text-[#0F172A] truncate">{r.name}</span>
                          <Badge className={cn('text-[7px] border', LEVEL_STYLE[r.riskLevel])}>{r.riskLevel}</Badge>
                        </div>
                        <div className="text-[9px] text-[#64748B] mb-1">{r.industry} · {r.region} · {r.product}</div>
                        <div className="flex flex-wrap gap-1 mb-1">
                          {r.riskTags.slice(0, 2).map(t => <Badge key={t} className="text-[7px] bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]">{t}</Badge>)}
                        </div>
                        <div className="flex items-center justify-between text-[8px] text-[#94A3B8]">
                          <span>余额 {r.balance}</span>
                          <span>预警 {r.alertTime.slice(5)}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1.5">
                          <Button variant="outline" size="sm" className="h-5 text-[8px] px-1.5 gap-0.5 border-[#FCA5A5] text-[#DC2626]" onClick={e => e.stopPropagation()}>详情</Button>
                          <Button variant="ghost" size="sm" className="h-5 text-[8px] px-1 text-[#C2410C]"><Star size={8} /></Button>
                          {r.suggestRepay && <Button variant="ghost" size="sm" className="h-5 text-[8px] px-1 text-[#475569]" onClick={e => { e.stopPropagation(); onModuleChange('repayment'); }}>还款</Button>}
                        </div>
                      </div>
                    );
                  })}
                  {filteredRI.length === 0 && (
                    <div className="text-center py-8 space-y-1">
                      <CheckCircle2 size={18} className="text-[#A7F3D0] mx-auto" />
                      <div className="text-[10px] text-[#047857]">当前筛选下暂无命中风险资产</div>
                      <div className="text-[9px] text-[#94A3B8]">建议调整风险等级或逾期天数筛选</div>
                    </div>
                  )}
                </div>
              </div>

              {/* COL 2: Detail + disposal */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-4 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC] flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#0F172A]">当前风险详情</span>
                  <div className="flex items-center gap-1.5">
                    <Badge className={cn('text-[7px] border', LEVEL_STYLE[activeRisk.riskLevel])}>{activeRisk.riskLevel}</Badge>
                    <Badge className={cn('text-[7px] border', PRIORITY_STYLE[activeRisk.priority])}>{activeRisk.priority}</Badge>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                  {/* Entity & risk info */}
                  <div className="grid grid-cols-3 gap-x-3 gap-y-1 text-[9px] pb-2 border-b border-[#F1F5F9]">
                    <div><span className="text-[#94A3B8]">企业</span> <span className="text-[#0F172A] font-medium">{activeRisk.name}</span></div>
                    <div><span className="text-[#94A3B8]">产品</span> <span className="text-[#0F172A]">{activeRisk.product}</span></div>
                    <div><span className="text-[#94A3B8]">预警时间</span> <span className="text-[#0F172A]">{activeRisk.alertTime}</span></div>
                  </div>

                  {/* Risk conclusion */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-semibold text-[#0F172A]">风险结论</div>
                    <div className={cn('rounded px-2.5 py-2 text-[9px] leading-4 border', activeRisk.riskLevel === '已异常资产' || activeRisk.riskLevel === '高风险关注' ? 'bg-[#FEF2F2] border-[#FCA5A5] text-[#991B1B]' : 'bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]')}>
                      {activeRisk.conclusion}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[9px]">
                      <div className="rounded border border-[#F1F5F9] bg-[#F8FAFC] px-2 py-1.5"><div className="text-[#94A3B8]">资产余额</div><div className="font-medium text-[#0F172A]">{activeRisk.balance}</div></div>
                      <div className="rounded border border-[#F1F5F9] bg-[#F8FAFC] px-2 py-1.5"><div className="text-[#94A3B8]">授信金额</div><div className="font-medium text-[#0F172A]">{activeRisk.creditLimit}</div></div>
                      <div className="rounded border border-[#F1F5F9] bg-[#F8FAFC] px-2 py-1.5"><div className="text-[#94A3B8]">还款状态</div><div className={cn('font-medium', activeRisk.repayStatus.includes('逾期') ? 'text-[#DC2626]' : 'text-[#C2410C]')}>{activeRisk.repayStatus}</div></div>
                    </div>
                  </div>

                  {/* Risk performance */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-semibold text-[#0F172A]">风险表现</div>
                    <div className="flex flex-wrap gap-1 mb-1">{activeRisk.riskTags.map(t => <Badge key={t} className="text-[7px] bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]">{t}</Badge>)}</div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[9px]">
                      <div><span className="text-[#94A3B8]">近阶段变化</span> <span className="text-[#0F172A]">{activeRisk.changeSummary}</span></div>
                      <div><span className="text-[#94A3B8]">活跃表现</span> <span className="text-[#0F172A]">{activeRisk.activeness}</span></div>
                      <div><span className="text-[#94A3B8]">还款摘要</span> <span className={cn(activeRisk.repaySummary.includes('逾期') ? 'text-[#DC2626]' : 'text-[#C2410C]')}>{activeRisk.repaySummary}</span></div>
                      <div><span className="text-[#94A3B8]">影响范围</span> <span className="text-[#0F172A]">{activeRisk.impact}</span></div>
                    </div>
                  </div>

                  {/* Disposal & follow-up */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-semibold text-[#0F172A]">处置与跟进</div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[9px]">
                      <div><span className="text-[#94A3B8]">建议动作</span> <span className="text-[#0F172A] font-medium">{activeRisk.suggestion}</span></div>
                      <div><span className="text-[#94A3B8]">跟进优先级</span> <Badge className={cn('text-[7px] border', PRIORITY_STYLE[activeRisk.priority])}>{activeRisk.priority}</Badge></div>
                      <div><span className="text-[#94A3B8]">责任人</span> <span className="text-[#0F172A]">{activeRisk.manager}</span></div>
                      <div><span className="text-[#94A3B8]">最近跟进</span> <span className="text-[#0F172A]">{activeRisk.lastFollowUp}</span></div>
                    </div>
                    {activeRisk.needConfirm && <div className="text-[9px] text-[#7C3AED] mt-0.5">该资产存在边界风险信号，建议人工复核确认后再决定处置方式。</div>}
                    <div className="text-[9px] text-[#64748B]">建议先查看还款表现与最近跟进记录，再决定是否纳入重点处置范围。</div>
                  </div>

                  {/* Detail actions */}
                  <div className="flex items-center gap-1.5 border-t border-[#F1F5F9] pt-2 flex-wrap">
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#FCA5A5] text-[#DC2626]"><Shield size={9} />查看风险明细</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#FED7AA] text-[#C2410C]" onClick={() => onModuleChange('repayment')}><Calendar size={9} />进入还款表现</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]"><FileCheck2 size={9} />记录跟进</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#DDD6FE] text-[#7C3AED]"><UserCheck size={9} />标记人工确认</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#991B1B] text-[#991B1B]"><AlertTriangle size={9} />加入处置清单</Button>
                  </div>
                </div>
              </div>

              {/* COL 3: AI judgment */}
              <div className="space-y-3">
                <div className="rounded-lg border border-[#E2E8F0] bg-white p-3 space-y-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#DC2626] to-[#7C3AED] flex items-center justify-center"><Brain size={10} className="text-white" /></div>
                    <span className="text-[11px] font-semibold text-[#0F172A]">AI 建议</span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">当前判断</div>
                      <p className="text-[10px] text-[#0F172A] leading-4 font-medium">
                        {activeRisk.riskLevel === '已异常资产' || activeRisk.riskLevel === '高风险关注'
                          ? `${activeRisk.name}风险信号处于上升阶段，已具备重点跟踪与处置价值。`
                          : `${activeRisk.name}风险信号尚未完全演变为高风险异常，建议持续观察。`}
                      </p>
                    </div>

                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">风险摘要</div>
                      <p className="text-[9px] text-[#475569] leading-4">
                        {activeRisk.changeSummary}，当前活跃表现{activeRisk.activeness}，{activeRisk.impact}。
                      </p>
                    </div>

                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">风险影响</div>
                      {(() => {
                        const severity = activeRisk.riskLevel === '已异常资产' ? 95 : activeRisk.riskLevel === '高风险关注' ? 75 : activeRisk.riskLevel === '中度预警' ? 50 : 25;
                        return (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 rounded-full bg-[#F1F5F9] overflow-hidden"><div className="h-full rounded-full" style={{ width: `${severity}%`, backgroundColor: severity >= 70 ? '#DC2626' : severity >= 40 ? '#F59E0B' : '#94A3B8' }} /></div>
                            <span className="text-[10px] font-bold" style={{ color: severity >= 70 ? '#DC2626' : severity >= 40 ? '#F59E0B' : '#94A3B8' }}>风险度 {severity}</span>
                          </div>
                        );
                      })()}
                    </div>

                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">主要关注提示</div>
                      <div className="rounded bg-[#FEF2F2] px-2 py-1.5 text-[9px] text-[#DC2626] space-y-0.5">
                        {activeRisk.riskTags.map((t, i) => <div key={i}>· {t}</div>)}
                        <div>· {activeRisk.impact}</div>
                      </div>
                    </div>

                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">下一步建议</div>
                      <p className="text-[10px] text-[#7C3AED] font-medium">
                        {activeRisk.riskLevel === '已异常资产'
                          ? '建议立即纳入处置清单并启动人工确认流程。'
                          : activeRisk.suggestRepay
                            ? '建议优先结合还款表现核查履约情况，并持续记录风险变化。'
                            : '建议持续观察预警趋势，如预警持续上升可加入重点处置。'}
                      </p>
                    </div>

                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">建议进入页面</div>
                      <p className="text-[10px] text-[#475569]">{activeRisk.suggestRepay ? '还款表现' : '继续风险跟踪'}</p>
                    </div>

                    {activeRisk.needConfirm && (
                      <div className="rounded bg-[#F5F3FF] border border-[#DDD6FE] px-2 py-1.5 text-[9px] text-[#7C3AED]">
                        该资产存在边界风险信号，建议人工复核后确定后续处置方向。
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5 pt-1">
                    <Button size="sm" className="h-7 text-[10px] gap-1 bg-[#DC2626] hover:bg-[#B91C1C] text-white w-full"><CheckCircle2 size={10} />采纳建议</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#FED7AA] text-[#C2410C] w-full" onClick={() => onModuleChange('repayment')}><ArrowRight size={10} />进入还款表现</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#FCA5A5] text-[#DC2626] w-full"><ArrowRight size={10} />继续风险跟踪</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#DDD6FE] text-[#7C3AED] w-full"><UserCheck size={10} />发起人工确认</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#991B1B] text-[#991B1B] w-full"><AlertTriangle size={10} />加入处置清单</Button>
                  </div>
                </div>
              </div>
            </div>

            {active && <ActionBar />}
          </div>
        );
      }

      /* ════════════════════════════════════════════════════════════════════
         PAGE 3: 还款表现（5 区工作台）
         ════════════════════════════════════════════════════════════════════ */
      case 'repayment': {
        type RepayLevel = '正常履约' | '临近到期' | '轻微逾期' | '持续逾期' | '回款波动';
        type RepayTrend = '改善' | '持平' | '上升' | '恶化';
        type WaveTag = '节奏稳定' | '轻微波动' | '持续波动' | '明显异常';
        type RiskLink = '未触发' | '已触发轻度预警' | '已触发中度预警' | '已进入高风险关注';

        interface RepayTier { level: RepayLevel; count: number; balance: string; pct: number; dueDist: string; trend: RepayTrend; action: string }
        interface RepayAssetItem {
          id: string; name: string; industry: string; region: string; product: string; stage: string;
          balance: string; dueAmount: string; paidAmount: string; nextDue: string; lastPaid: string;
          repayStatus: RepayLevel; overdueDays: number; waveTag: WaveTag; riskLink: RiskLink; suggestion: string;
          conclusion: string; recentRecord: string; dueVsPaid: string; overdueSummary: string; trendSummary: string; waveReason: string;
          priority: '紧急' | '高' | '中' | '低'; manager: string; lastFollowUp: string;
          suggestRisk: boolean; needConfirm: boolean;
        }

        const REPAY_TIERS: RepayTier[] = [
          { level: '正常履约', count: 65, balance: '¥8.2亿', pct: 64, dueDist: '均匀分布', trend: '持平', action: '持续观察' },
          { level: '临近到期', count: 12, balance: '¥1.6亿', pct: 13, dueDist: '7日内集中', trend: '上升', action: '提前提醒' },
          { level: '轻微逾期', count: 8, balance: '¥1.1亿', pct: 11, dueDist: '已到期', trend: '持平', action: '重点跟踪' },
          { level: '持续逾期', count: 5, balance: '¥0.7亿', pct: 7, dueDist: '已到期未还', trend: '恶化', action: '纳入催收跟进' },
          { level: '回款波动', count: 6, balance: '¥0.6亿', pct: 5, dueDist: '不规律', trend: '上升', action: '联动风险监控' },
        ];

        const REPAY_ITEMS: RepayAssetItem[] = [
          ...REPAY_PLANS.map((p, idx): RepayAssetItem => {
            const level: RepayLevel = p.status === '逾期' ? (idx === 0 ? '持续逾期' : '轻微逾期') : p.status === '即将到期' ? '临近到期' : '正常履约';
            const days = p.status === '逾期' ? (idx === 0 ? 18 : 8) : 0;
            const waveTag: WaveTag = level === '持续逾期' ? '明显异常' : level === '轻微逾期' ? '持续波动' : level === '临近到期' ? '轻微波动' : '节奏稳定';
            const riskLink: RiskLink = level === '持续逾期' ? '已进入高风险关注' : level === '轻微逾期' ? '已触发轻度预警' : '未触发';
            const priority: RepayAssetItem['priority'] = level === '持续逾期' ? '紧急' : level === '轻微逾期' ? '高' : level === '临近到期' ? '中' : '低';
            return {
              id: `rp-0${idx + 1}`, name: p.name, industry: idx <= 1 ? '新能源' : idx <= 3 ? '包装材料' : '储能设备',
              region: idx <= 1 ? '深圳' : idx <= 3 ? '常州' : '无锡', product: '订单微贷', stage: '在营',
              balance: p.amount, dueAmount: p.amount, paidAmount: level === '正常履约' ? p.amount : `${Math.round(parseInt(p.amount) * 0.6)}万`,
              nextDue: p.dueDate, lastPaid: level === '正常履约' ? '04/05' : level === '临近到期' ? '03/28' : '03/15',
              repayStatus: level, overdueDays: days, waveTag, riskLink, suggestion: level === '持续逾期' ? '发起催收' : level === '轻微逾期' ? '重点跟进' : level === '临近到期' ? '提前提醒' : '持续观察',
              conclusion: level === '正常履约' ? '履约稳定' : level === '临近到期' ? '短期关注' : level === '轻微逾期' ? '已出现波动' : '存在明显异常',
              recentRecord: level === '正常履约' ? '上期按时还款' : level === '临近到期' ? '上期正常，本期即将到期' : `逾期 ${days} 天`,
              dueVsPaid: level === '正常履约' ? '应还=实还' : `应还 ${p.amount}，实还 ${Math.round(parseInt(p.amount) * 0.6)}万`,
              overdueSummary: days > 0 ? `已逾期 ${days} 天` : '无逾期',
              trendSummary: level === '正常履约' ? '回款节奏稳定' : level === '临近到期' ? '即将到期需关注' : '回款节奏出现波动',
              waveReason: level === '持续逾期' ? '连续两期未还，疑似经营困难' : level === '轻微逾期' ? '资金周转延迟' : '',
              priority, manager: `客户经理${String.fromCharCode(65 + idx)}`, lastFollowUp: idx < 2 ? '04/08 已电话跟进' : '暂无',
              suggestRisk: level === '持续逾期' || level === '轻微逾期', needConfirm: level === '持续逾期',
            };
          }),
          {
            id: 'rp-wave', name: '盛拓模组科技', industry: '电池模组', region: '常州', product: '订单微贷', stage: '在营',
            balance: '180万', dueAmount: '45万', paidAmount: '30万', nextDue: '2026-04-20', lastPaid: '03/22',
            repayStatus: '回款波动', overdueDays: 0, waveTag: '持续波动', riskLink: '已触发中度预警', suggestion: '查看风险',
            conclusion: '已出现波动', recentRecord: '近两期还款金额不稳定', dueVsPaid: '应还 45万，实还 30万',
            overdueSummary: '无逾期但金额波动', trendSummary: '回款金额连续下降', waveReason: '交易频次降低，回款金额不稳定',
            priority: '中' as const, manager: '客户经理C', lastFollowUp: '04/07 已面访', suggestRisk: true, needConfirm: false,
          },
        ];

        const LEVEL_CLR: Record<RepayLevel, string> = {
          '正常履约': 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]',
          '临近到期': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
          '轻微逾期': 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
          '持续逾期': 'bg-[#450A0A] text-white border-[#991B1B]',
          '回款波动': 'bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]',
        };
        const WAVE_CLR: Record<WaveTag, string> = {
          '节奏稳定': 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]',
          '轻微波动': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
          '持续波动': 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
          '明显异常': 'bg-[#450A0A] text-white border-[#991B1B]',
        };
        const PRI_CLR: Record<string, string> = {
          '紧急': 'bg-[#450A0A] text-white border-[#991B1B]',
          '高': 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]',
          '中': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
          '低': 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]',
        };
        const TR_ICON = { '改善': TrendingDown, '持平': ArrowRight, '上升': TrendingUp, '恶化': TrendingUp };
        const TR_CLR = { '改善': 'text-[#047857]', '持平': 'text-[#64748B]', '上升': 'text-[#F59E0B]', '恶化': 'text-[#DC2626]' };

        const normalCount = REPAY_TIERS[0].count;
        const nearDueCount = REPAY_TIERS[1].count;
        const mildOverdueCount = REPAY_TIERS[2].count;
        const heavyOverdueCount = REPAY_TIERS[3].count;
        const dueTotal = '¥3,240万';
        const paidTotal = '¥2,680万';

        const filteredRP = REPAY_ITEMS.filter(r => {
          if (statusFilter === 'all') return true;
          if (statusFilter === '正常') return r.repayStatus === '正常履约';
          if (statusFilter === '观察') return r.repayStatus === '临近到期' || r.repayStatus === '回款波动';
          if (statusFilter === '逾期') return r.repayStatus === '轻微逾期' || r.repayStatus === '持续逾期';
          if (statusFilter === '风险') return r.suggestRisk;
          return true;
        });

        const activeRepay = filteredRP.find(r => r.id === selectedRepayId) ?? filteredRP[0] ?? REPAY_ITEMS[0];

        return (
          <div className="space-y-3">
            <div className="flex items-center justify-end gap-2 flex-wrap">
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#BFDBFE] text-[#2563EB]"><RefreshCw size={10} />刷新还款结果</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Layers size={10} />切换统计周期</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Download size={10} />导出还款清单</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Eye size={10} />查看履约规则</Button>
            </div>

            <KpiBar items={[
              { label: '正常还款', value: `${normalCount} 户`, hint: '履约节奏稳定', tone: 'normal' },
              { label: '临近到期', value: `${nearDueCount} 户`, hint: '短期内即将到期', tone: nearDueCount > 0 ? 'warn' : 'muted' },
              { label: '轻微逾期', value: `${mildOverdueCount} 户`, hint: '需重点跟踪', tone: mildOverdueCount > 0 ? 'risk' : 'muted' },
              { label: '持续逾期', value: `${heavyOverdueCount} 户`, hint: '需进一步处置', tone: heavyOverdueCount > 0 ? 'risk' : 'muted' },
              { label: '本期应还', value: dueTotal, hint: '当前周期应还金额', tone: 'info' },
              { label: '本期已还', value: paidTotal, hint: '当前周期已还金额', tone: 'normal' },
            ]} />

            {/* 2. Tiers */}
            <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#F1F5F9] bg-[#F8FAFC] flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-[#0F172A]">履约分层与到期趋势</span>
                  <span className="text-[9px] text-[#94A3B8] ml-2">优先查看临近到期与逾期资产</span>
                </div>
                <Button variant="ghost" size="sm" className="h-6 text-[9px] text-[#64748B]">切换维度</Button>
              </div>
              <div className="p-3 space-y-1.5">
                {REPAY_TIERS.map(tier => {
                  const TrIcon = TR_ICON[tier.trend];
                  return (
                    <div key={tier.level} className="flex items-center gap-3 rounded-lg border border-[#F1F5F9] bg-[#FAFBFF] px-3 py-2 hover:bg-[#EFF6FF]/30 transition-colors cursor-pointer"
                      onClick={() => { setStatusFilter(tier.level === '正常履约' ? '正常' : tier.level === '临近到期' || tier.level === '回款波动' ? '观察' : '逾期'); }}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge className={cn('text-[7px] border', LEVEL_CLR[tier.level])}>{tier.level}</Badge>
                          <span className="text-[9px] text-[#64748B]">{tier.dueDist}</span>
                        </div>
                        <div className="text-[9px] text-[#94A3B8] mt-0.5">建议: {tier.action}</div>
                      </div>
                      <div className="text-right shrink-0 w-14">
                        <div className="text-[12px] font-bold text-[#0F172A]">{tier.count} 户</div>
                        <div className="text-[9px] text-[#64748B]">{tier.balance}</div>
                      </div>
                      <div className="shrink-0 w-10 text-right"><div className="text-[11px] font-bold text-[#0F172A]">{tier.pct}%</div></div>
                      <div className={cn('shrink-0 flex items-center gap-0.5 text-[9px]', TR_CLR[tier.trend])}>
                        <TrIcon size={10} />{tier.trend}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3-column: List + Detail + AI */}
            <div className="grid grid-cols-[220px_1fr_250px] gap-3" style={{ minHeight: 480 }}>

              {/* COL 1: Repay asset list */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-3 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                  <span className="text-[11px] font-semibold text-[#0F172A]">还款资产列表</span>
                  <p className="text-[9px] text-[#94A3B8] mt-0.5">重点关注到期、逾期与回款波动</p>
                </div>
                <div className="px-2 py-1.5 border-b border-[#F1F5F9] flex items-center gap-1.5">
                  <select className="h-5 rounded border border-[#E2E8F0] bg-[#F8FAFC] px-1 text-[9px] text-[#334155] flex-1" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                    <option value="all">全部状态</option><option value="正常">正常</option><option value="观察">临近/波动</option><option value="逾期">逾期</option><option value="风险">风险联动</option>
                  </select>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {filteredRP.map(r => {
                    const isActive = activeRepay?.id === r.id;
                    return (
                      <div key={r.id} onClick={() => setSelectedRepayId(r.id)}
                        className={cn('px-3 py-2.5 border-b border-[#F1F5F9] cursor-pointer transition-all', isActive ? 'bg-[#EFF6FF] border-l-2 border-l-[#2563EB]' : 'hover:bg-[#FAFBFF]')}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[11px] font-semibold text-[#0F172A] truncate">{r.name}</span>
                          <Badge className={cn('text-[7px] border', LEVEL_CLR[r.repayStatus])}>{r.repayStatus}</Badge>
                        </div>
                        <div className="text-[9px] text-[#64748B] mb-1">{r.industry} · {r.region} · {r.product}</div>
                        <div className="flex items-center gap-1.5 mb-1 text-[8px]">
                          <Badge className={cn('text-[7px] border', WAVE_CLR[r.waveTag])}>{r.waveTag}</Badge>
                          {r.overdueDays > 0 && <span className="text-[#DC2626]">逾期{r.overdueDays}天</span>}
                        </div>
                        <div className="flex items-center justify-between text-[8px] text-[#94A3B8]">
                          <span>应还 {r.dueAmount}</span>
                          <span>到期 {r.nextDue.slice(5)}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1.5">
                          <Button variant="outline" size="sm" className="h-5 text-[8px] px-1.5 gap-0.5 border-[#BFDBFE] text-[#2563EB]" onClick={e => e.stopPropagation()}>详情</Button>
                          <Button variant="ghost" size="sm" className="h-5 text-[8px] px-1 text-[#C2410C]"><Star size={8} /></Button>
                          {r.suggestRisk && <Button variant="ghost" size="sm" className="h-5 text-[8px] px-1 text-[#DC2626]" onClick={e => { e.stopPropagation(); onModuleChange('risk-assets'); }}>风险</Button>}
                        </div>
                      </div>
                    );
                  })}
                  {filteredRP.length === 0 && (
                    <div className="text-center py-8 space-y-1">
                      <CheckCircle2 size={18} className="text-[#A7F3D0] mx-auto" />
                      <div className="text-[10px] text-[#047857]">当前筛选下暂无命中资产</div>
                      <div className="text-[9px] text-[#94A3B8]">建议调整还款状态筛选条件</div>
                    </div>
                  )}
                </div>
              </div>

              {/* COL 2: Detail + follow-up */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-4 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC] flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#0F172A]">当前还款详情</span>
                  <div className="flex items-center gap-1.5">
                    <Badge className={cn('text-[7px] border', LEVEL_CLR[activeRepay.repayStatus])}>{activeRepay.repayStatus}</Badge>
                    <Badge className={cn('text-[7px] border', PRI_CLR[activeRepay.priority])}>{activeRepay.priority}</Badge>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                  {/* Entity & repay info */}
                  <div className="grid grid-cols-3 gap-x-3 gap-y-1 text-[9px] pb-2 border-b border-[#F1F5F9]">
                    <div><span className="text-[#94A3B8]">企业</span> <span className="text-[#0F172A] font-medium">{activeRepay.name}</span></div>
                    <div><span className="text-[#94A3B8]">产品</span> <span className="text-[#0F172A]">{activeRepay.product}</span></div>
                    <div><span className="text-[#94A3B8]">下次应还</span> <span className="text-[#0F172A]">{activeRepay.nextDue}</span></div>
                  </div>

                  {/* Conclusion */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-semibold text-[#0F172A]">履约结论</div>
                    <div className={cn('rounded px-2.5 py-2 text-[9px] leading-4 border', activeRepay.conclusion === '履约稳定' ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#047857]' : activeRepay.conclusion === '短期关注' ? 'bg-[#FFFBEB] border-[#FDE68A] text-[#92400E]' : 'bg-[#FEF2F2] border-[#FCA5A5] text-[#991B1B]')}>
                      {activeRepay.conclusion === '履约稳定' ? '当前资产整体履约表现较稳定，短期内建议持续观察其到期与回款节奏。' : '该资产近期已出现回款波动与逾期迹象，建议尽快跟进其履约变化并联动风险监控。'}
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[9px]">
                      <div className="rounded border border-[#F1F5F9] bg-[#F8FAFC] px-2 py-1.5"><div className="text-[#94A3B8]">资产余额</div><div className="font-medium text-[#0F172A]">{activeRepay.balance}</div></div>
                      <div className="rounded border border-[#F1F5F9] bg-[#F8FAFC] px-2 py-1.5"><div className="text-[#94A3B8]">应还金额</div><div className="font-medium text-[#0F172A]">{activeRepay.dueAmount}</div></div>
                      <div className="rounded border border-[#F1F5F9] bg-[#F8FAFC] px-2 py-1.5"><div className="text-[#94A3B8]">已还金额</div><div className={cn('font-medium', activeRepay.paidAmount === activeRepay.dueAmount ? 'text-[#047857]' : 'text-[#C2410C]')}>{activeRepay.paidAmount}</div></div>
                    </div>
                  </div>

                  {/* Repay performance */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-semibold text-[#0F172A]">还款表现</div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[9px]">
                      <div><span className="text-[#94A3B8]">最近还款</span> <span className="text-[#0F172A]">{activeRepay.recentRecord}</span></div>
                      <div><span className="text-[#94A3B8]">应还 vs 实还</span> <span className="text-[#0F172A]">{activeRepay.dueVsPaid}</span></div>
                      <div><span className="text-[#94A3B8]">逾期情况</span> <span className={cn(activeRepay.overdueDays > 0 ? 'text-[#DC2626]' : 'text-[#047857]')}>{activeRepay.overdueSummary}</span></div>
                      <div><span className="text-[#94A3B8]">回款趋势</span> <span className="text-[#0F172A]">{activeRepay.trendSummary}</span></div>
                    </div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Badge className={cn('text-[7px] border', WAVE_CLR[activeRepay.waveTag])}>{activeRepay.waveTag}</Badge>
                      {activeRepay.riskLink !== '未触发' && <Badge className="text-[7px] bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]">{activeRepay.riskLink}</Badge>}
                    </div>
                    {activeRepay.waveReason && <div className="text-[9px] text-[#C2410C] mt-0.5">波动原因: {activeRepay.waveReason}</div>}
                  </div>

                  {/* Follow-up */}
                  <div className="space-y-1.5">
                    <div className="text-[10px] font-semibold text-[#0F172A]">跟进与处置</div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[9px]">
                      <div><span className="text-[#94A3B8]">建议动作</span> <span className="text-[#0F172A] font-medium">{activeRepay.suggestion}</span></div>
                      <div><span className="text-[#94A3B8]">跟进优先级</span> <Badge className={cn('text-[7px] border', PRI_CLR[activeRepay.priority])}>{activeRepay.priority}</Badge></div>
                      <div><span className="text-[#94A3B8]">责任人</span> <span className="text-[#0F172A]">{activeRepay.manager}</span></div>
                      <div><span className="text-[#94A3B8]">最近跟进</span> <span className="text-[#0F172A]">{activeRepay.lastFollowUp}</span></div>
                    </div>
                    {activeRepay.needConfirm && <div className="text-[9px] text-[#7C3AED] mt-0.5">该资产履约状态处于边界区间，建议人工确认后决定后续处置。</div>}
                    <div className="text-[9px] text-[#64748B]">建议优先发起到期提醒或重点跟进，如逾期持续扩大可纳入催收跟进。</div>
                  </div>

                  {/* Detail actions */}
                  <div className="flex items-center gap-1.5 border-t border-[#F1F5F9] pt-2 flex-wrap">
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#BFDBFE] text-[#2563EB]"><Eye size={9} />查看还款明细</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#FCA5A5] text-[#DC2626]" onClick={() => onModuleChange('risk-assets')}><Shield size={9} />进入风险监控</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]"><FileCheck2 size={9} />记录跟进</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#FED7AA] text-[#C2410C]"><Bell size={9} />发起提醒</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#DDD6FE] text-[#7C3AED]"><UserCheck size={9} />标记人工确认</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#991B1B] text-[#991B1B]"><AlertTriangle size={9} />加入催收跟进</Button>
                  </div>
                </div>
              </div>

              {/* COL 3: AI judgment */}
              <div className="space-y-3">
                <div className="rounded-lg border border-[#E2E8F0] bg-white p-3 space-y-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#7C3AED] to-[#2563EB] flex items-center justify-center"><Brain size={10} className="text-white" /></div>
                    <span className="text-[11px] font-semibold text-[#0F172A]">AI 建议</span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">当前判断</div>
                      <p className="text-[10px] text-[#0F172A] leading-4 font-medium">
                        {activeRepay.repayStatus === '正常履约'
                          ? `${activeRepay.name}履约状态处于可控范围，建议持续观察。`
                          : `${activeRepay.name}短期回款节奏已出现波动，建议加强跟踪。`}
                      </p>
                    </div>

                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">还款表现摘要</div>
                      <p className="text-[9px] text-[#475569] leading-4">
                        {activeRepay.dueVsPaid}，{activeRepay.trendSummary}。
                        {activeRepay.riskLink !== '未触发' ? ` 风险联动：${activeRepay.riskLink}。` : ''}
                      </p>
                    </div>

                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">履约稳定性</div>
                      {(() => {
                        const stability = activeRepay.repayStatus === '正常履约' ? 90 : activeRepay.repayStatus === '临近到期' ? 65 : activeRepay.repayStatus === '回款波动' ? 45 : activeRepay.repayStatus === '轻微逾期' ? 30 : 10;
                        return (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 rounded-full bg-[#F1F5F9] overflow-hidden"><div className="h-full rounded-full" style={{ width: `${stability}%`, backgroundColor: stability >= 70 ? '#047857' : stability >= 40 ? '#F59E0B' : '#DC2626' }} /></div>
                            <span className="text-[10px] font-bold" style={{ color: stability >= 70 ? '#047857' : stability >= 40 ? '#F59E0B' : '#DC2626' }}>{stability}分</span>
                          </div>
                        );
                      })()}
                    </div>

                    {(activeRepay.overdueDays > 0 || activeRepay.waveReason) && (
                      <div>
                        <div className="text-[9px] text-[#94A3B8] mb-0.5">主要关注提示</div>
                        <div className="rounded bg-[#FEF2F2] px-2 py-1.5 text-[9px] text-[#DC2626] space-y-0.5">
                          {activeRepay.overdueDays > 0 && <div>· 逾期 {activeRepay.overdueDays} 天</div>}
                          {activeRepay.waveReason && <div>· {activeRepay.waveReason}</div>}
                          {activeRepay.riskLink !== '未触发' && <div>· {activeRepay.riskLink}</div>}
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">下一步建议</div>
                      <p className="text-[10px] text-[#7C3AED] font-medium">
                        {activeRepay.repayStatus === '持续逾期'
                          ? '建议立即启动催收跟进并联动风险监控。'
                          : activeRepay.suggestRisk
                            ? '建议优先跟踪临近到期与轻微逾期资产，并结合风险监控判断是否升级处置。'
                            : '建议持续观察到期节奏，关注是否出现新增逾期。'}
                      </p>
                    </div>

                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">建议进入页面</div>
                      <p className="text-[10px] text-[#475569]">{activeRepay.suggestRisk ? '风险监控' : '继续履约跟踪'}</p>
                    </div>

                    {activeRepay.needConfirm && (
                      <div className="rounded bg-[#F5F3FF] border border-[#DDD6FE] px-2 py-1.5 text-[9px] text-[#7C3AED]">
                        当前履约状态处于边界区间，建议人工确认。
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5 pt-1">
                    <Button size="sm" className="h-7 text-[10px] gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white w-full"><CheckCircle2 size={10} />采纳建议</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#FCA5A5] text-[#DC2626] w-full" onClick={() => onModuleChange('risk-assets')}><ArrowRight size={10} />进入风险监控</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#A7F3D0] text-[#047857] w-full"><ArrowRight size={10} />继续履约跟踪</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#FED7AA] text-[#C2410C] w-full"><Bell size={10} />发起提醒</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#991B1B] text-[#991B1B] w-full"><AlertTriangle size={10} />发起催收</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569] w-full"><UserCheck size={10} />人工确认</Button>
                  </div>
                </div>
              </div>
            </div>

            {active && <ActionBar />}
          </div>
        );
      }

      /* ════════════════════════════════════════════════════════════════════
         PAGE 4: 资产经营看板 (DEFAULT)
         经营总览 + 分层 + 关键资产 + 异常 + AI
         ════════════════════════════════════════════════════════════════════ */
      case 'dashboard':
      default: {
        type AssetTier = '高价值在营资产' | '稳定经营资产' | '重点观察资产' | '风险预警资产' | '回款异常资产';
        type AlertType = '风险预警上升' | '逾期资产增加' | '高价值资产活跃下降' | '转化率波动' | '还款异常集中' | '重点客户需跟进';

        interface TierItem { name: AssetTier; count: number; balance: string; pct: number; status: string; trend: '上升' | '持平' | '下降' | '波动'; action: string }
        interface KeyAsset { id: string; name: string; industry: string; region: string; product: string; stage: string; balance: string; creditLimit: string; usageStatus: string; lastActive: string; tag: string; riskStatus: string; repayStatus: string; suggestion: string }
        interface AlertItem { type: AlertType; assetCount: number; scope: string; level: '高' | '中' | '低'; summary: string; suggestion: string; targetPage: string; needConfirm: boolean }

        const TIERS: TierItem[] = [
          { name: '高价值在营资产', count: 28, balance: '¥4.2亿', pct: 33, status: '活跃经营', trend: '持平', action: '持续经营' },
          { name: '稳定经营资产', count: 45, balance: '¥5.1亿', pct: 40, status: '正常还款', trend: '上升', action: '持续经营' },
          { name: '重点观察资产', count: 12, balance: '¥1.8亿', pct: 14, status: '波动观察', trend: '波动', action: '重点跟踪' },
          { name: '风险预警资产', count: 6, balance: '¥0.9亿', pct: 7, status: '预警已触发', trend: '上升', action: '下钻风险监控' },
          { name: '回款异常资产', count: 5, balance: '¥0.8亿', pct: 6, status: '逾期/波动', trend: '上升', action: '下钻还款表现' },
        ];

        const KEY_ASSETS: KeyAsset[] = [
          { id: 'ka-01', name: '裕同包装科技', industry: '包装材料', region: '深圳', product: '订单微贷', stage: '在营', balance: '95万', creditLimit: '120万', usageStatus: '正常用信', lastActive: '04/09', tag: '高价值', riskStatus: '正常', repayStatus: '正常还款', suggestion: '持续经营' },
          { id: 'ka-02', name: '科陆储能技术', industry: '储能设备', region: '深圳', product: '订单微贷', stage: '在营', balance: '120万', creditLimit: '150万', usageStatus: '正常用信', lastActive: '04/08', tag: '高价值', riskStatus: '正常', repayStatus: '正常还款', suggestion: '持续经营' },
          { id: 'ka-03', name: '盛拓模组科技', industry: '电池模组', region: '常州', product: '订单微贷', stage: '在营', balance: '180万', creditLimit: '200万', usageStatus: '高用信', lastActive: '04/07', tag: '稳定经营', riskStatus: '正常', repayStatus: '正常还款', suggestion: '关注用信率' },
          { id: 'ka-04', name: '新宙邦科技', industry: '新材料', region: '深圳', product: '订单微贷', stage: '在营', balance: '86万', creditLimit: '110万', usageStatus: '正常用信', lastActive: '04/06', tag: '重点跟踪', riskStatus: '观察', repayStatus: '临近到期', suggestion: '查看风险' },
          { id: 'ka-05', name: '瑞泰新能源材料', industry: '新能源辅料', region: '无锡', product: '订单微贷', stage: '在营', balance: '72万', creditLimit: '72万', usageStatus: '满额用信', lastActive: '04/05', tag: '风险关注', riskStatus: '风险', repayStatus: '已逾期', suggestion: '查看风险' },
          { id: 'ka-06', name: '王子新材料', industry: '包装材料', region: '东莞', product: '订单微贷', stage: '在营', balance: '0万', creditLimit: '60万', usageStatus: '未用信', lastActive: '03/25', tag: '待激活', riskStatus: '逾期', repayStatus: '已逾期', suggestion: '查看还款' },
        ];

        const ALERTS: AlertItem[] = [
          { type: '风险预警上升', assetCount: 3, scope: '影响资产质量', level: '高', summary: '近7天新增风险预警资产 3 户，主要集中在新能源辅料行业', suggestion: '进入风险监控查看异常', targetPage: 'risk-assets', needConfirm: false },
          { type: '逾期资产增加', assetCount: 2, scope: '影响回款稳定性', level: '高', summary: '瑞泰新能源材料逾期 18 天、王子新材料逾期 15 天', suggestion: '进入还款表现查看履约情况', targetPage: 'repayment', needConfirm: false },
          { type: '高价值资产活跃下降', assetCount: 1, scope: '影响经营转化', level: '中', summary: '盛拓模组科技近期活跃度下降，用信率保持高位但交易频次降低', suggestion: '进入在营资产查看明细', targetPage: 'activated', needConfirm: false },
          { type: '重点客户需跟进', assetCount: 1, scope: '影响后续经营动作', level: '低', summary: '新宙邦科技客户集中度偏高，建议安排重点跟进', suggestion: '安排重点跟进', targetPage: 'activated', needConfirm: true },
        ];

        const TAG_STYLE: Record<string, string> = {
          '高价值': 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
          '稳定经营': 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]',
          '重点跟踪': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
          '风险关注': 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
          '待激活': 'bg-[#F8FAFC] text-[#94A3B8] border-[#E2E8F0]',
        };
        const TREND_ICON = { '上升': TrendingUp, '下降': TrendingDown, '持平': ArrowRight, '波动': Zap };
        const TREND_COLOR = { '上升': 'text-[#DC2626]', '下降': 'text-[#047857]', '持平': 'text-[#64748B]', '波动': 'text-[#F59E0B]' };

        const totalAssets = TIERS.reduce((s, t) => s + t.count, 0);
        const totalBalance = '¥12.8亿';
        const newConversions = 8;
        const highValueCount = TIERS.find(t => t.name === '高价值在营资产')!.count;
        const riskCount = TIERS.find(t => t.name === '风险预警资产')!.count;
        const normalRepay = totalAssets - riskCount - TIERS.find(t => t.name === '回款异常资产')!.count;

        return (
          <div className="space-y-3">
            <div className="flex items-center justify-end gap-2 flex-wrap">
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#BFDBFE] text-[#2563EB]"><RefreshCw size={10} />刷新看板</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Layers size={10} />切换统计口径</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Download size={10} />导出经营概览</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Eye size={10} />查看经营规则</Button>
            </div>

            <KpiBar items={[
              { label: '资产池总规模', value: totalBalance, hint: '纳入统一管理的资产规模', tone: 'info' },
              { label: '在营资产数', value: `${totalAssets} 户`, hint: '处于在营可持续经营', tone: 'normal' },
              { label: '本期新增转化', value: `${newConversions} 户`, hint: '由审批转化进入资产池', tone: 'info' },
              { label: '高价值资产', value: `${highValueCount} 户`, hint: '建议重点维护', tone: 'warn' },
              { label: '风险关注资产', value: `${riskCount} 户`, hint: '存在预警需重点观察', tone: riskCount > 0 ? 'risk' : 'muted' },
              { label: '还款正常资产', value: `${normalRepay} 户`, hint: '履约表现正常', tone: 'normal' },
            ]} />

            {/* 2. Tier board + 3. Key assets + 4. Alerts + 5. AI */}
            <div className="grid grid-cols-[1fr_260px] gap-3">

              {/* Left: Tiers + Key Assets + Alerts stacked */}
              <div className="space-y-3">

                {/* 2. Tier board */}
                <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-[#F1F5F9] bg-[#F8FAFC] flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#0F172A]">经营分层看板</span>
                    <div className="flex items-center gap-1.5">
                      <Button variant="ghost" size="sm" className="h-6 text-[9px] text-[#64748B]">切换维度</Button>
                      <Button variant="ghost" size="sm" className="h-6 text-[9px] text-[#2563EB]">查看更多</Button>
                    </div>
                  </div>
                  <div className="p-3 space-y-1.5">
                    {TIERS.map(tier => {
                      const TrIcon = TREND_ICON[tier.trend];
                      return (
                        <div key={tier.name} className="flex items-center gap-3 rounded-lg border border-[#F1F5F9] bg-[#FAFBFF] px-3 py-2 hover:bg-[#EFF6FF] transition-colors cursor-pointer" onClick={() => {
                          if (tier.action.includes('风险')) onModuleChange('risk-assets');
                          else if (tier.action.includes('还款')) onModuleChange('repayment');
                          else onModuleChange('activated');
                        }}>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-[11px] font-semibold text-[#0F172A]">{tier.name}</span>
                              <Badge className="text-[7px] border bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]">{tier.status}</Badge>
                            </div>
                            <div className="text-[9px] text-[#94A3B8] mt-0.5">建议: {tier.action}</div>
                          </div>
                          <div className="text-right shrink-0 w-16">
                            <div className="text-[12px] font-bold text-[#0F172A]">{tier.count} 户</div>
                            <div className="text-[9px] text-[#64748B]">{tier.balance}</div>
                          </div>
                          <div className="shrink-0 w-10 text-right">
                            <div className="text-[11px] font-bold text-[#0F172A]">{tier.pct}%</div>
                          </div>
                          <div className={cn('shrink-0 flex items-center gap-0.5 text-[9px]', TREND_COLOR[tier.trend])}>
                            <TrIcon size={10} />{tier.trend}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. Key assets */}
                <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                    <span className="text-[11px] font-semibold text-[#0F172A]">关键资产分组</span>
                    <span className="text-[9px] text-[#94A3B8] ml-2">需重点经营、观察或跟进的代表性资产</span>
                  </div>
                  <div className="overflow-x-auto">
                    <div className="min-w-[700px]">
                      <div className="grid grid-cols-[1fr_60px_70px_60px_60px_70px_100px] gap-0 px-4 py-2 border-b border-[#E2E8F0] bg-[#F8FAFC] text-[9px] font-medium text-[#94A3B8] uppercase tracking-wider">
                        <div>企业</div><div>余额</div><div>经营标签</div><div>风险</div><div>还款</div><div>最近活跃</div><div>操作</div>
                      </div>
                      {KEY_ASSETS.map(a => (
                        <div key={a.id} className="grid grid-cols-[1fr_60px_70px_60px_60px_70px_100px] gap-0 px-4 py-2.5 border-b border-[#F1F5F9] last:border-b-0 items-center hover:bg-[#FAFBFF] transition-colors">
                          <div>
                            <div className="text-[11px] font-medium text-[#0F172A]">{a.name}</div>
                            <div className="text-[9px] text-[#94A3B8]">{a.industry} · {a.region}</div>
                          </div>
                          <div className="text-[11px] font-semibold text-[#0F172A]">{a.balance}</div>
                          <div><Badge className={cn('text-[7px] border', TAG_STYLE[a.tag] || TAG_STYLE['稳定经营'])}>{a.tag}</Badge></div>
                          <div><Badge className={cn('text-[7px] border', a.riskStatus === '正常' ? 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]' : a.riskStatus === '观察' ? 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]' : 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]')}>{a.riskStatus}</Badge></div>
                          <div className="text-[9px] text-[#64748B]">{a.repayStatus}</div>
                          <div className="text-[9px] text-[#94A3B8]">{a.lastActive}</div>
                          <div className="flex items-center gap-1">
                            <Button variant="outline" size="sm" className="h-5 text-[8px] px-1.5 border-[#BFDBFE] text-[#2563EB]" onClick={() => onModuleChange('activated')}>详情</Button>
                            {a.riskStatus !== '正常' && <Button variant="ghost" size="sm" className="h-5 text-[8px] px-1 text-[#DC2626]" onClick={() => onModuleChange('risk-assets')}>风险</Button>}
                            <Button variant="ghost" size="sm" className="h-5 text-[8px] px-1 text-[#64748B]"><Star size={8} /></Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. Alerts */}
                <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
                  <div className="px-4 py-2.5 border-b border-[#F1F5F9] bg-[#F8FAFC] flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#0F172A]">异常与关注提示</span>
                    <Button variant="ghost" size="sm" className="h-6 text-[9px] text-[#64748B] gap-1"><Download size={9} />下载关注清单</Button>
                  </div>
                  <div className="p-3 space-y-1.5">
                    {ALERTS.map((al, i) => (
                      <div key={i} className={cn('rounded border px-3 py-2 flex items-start gap-3', al.level === '高' ? 'border-[#FCA5A5] bg-[#FEF2F2]' : al.level === '中' ? 'border-[#FDE68A] bg-[#FFFBEB]' : 'border-[#E2E8F0] bg-[#F8FAFC]')}>
                        <AlertTriangle size={12} className={cn('shrink-0 mt-0.5', al.level === '高' ? 'text-[#DC2626]' : al.level === '中' ? 'text-[#F59E0B]' : 'text-[#94A3B8]')} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-semibold text-[#0F172A]">{al.type}</span>
                            <span className="text-[8px] text-[#64748B]">涉及 {al.assetCount} 户 · {al.scope}</span>
                            {al.needConfirm && <Badge className="text-[7px] bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]">需人工确认</Badge>}
                          </div>
                          <div className="text-[9px] text-[#475569] mt-0.5">{al.summary}</div>
                          <div className="flex items-center gap-2 mt-1">
                            <Button variant="outline" size="sm" className="h-5 text-[8px] px-1.5 gap-0.5 border-[#BFDBFE] text-[#2563EB]" onClick={() => onModuleChange(al.targetPage)}>
                              <Eye size={8} />{al.suggestion.slice(0, 8)}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {ALERTS.length === 0 && (
                      <div className="text-center py-6"><CheckCircle2 size={18} className="text-[#A7F3D0] mx-auto mb-1" /><div className="text-[10px] text-[#047857]">暂无明显异常或重点关注项</div></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: AI judgment */}
              <div className="space-y-3">
                <div className="rounded-lg border border-[#E2E8F0] bg-white p-3 space-y-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#7C3AED] to-[#2563EB] flex items-center justify-center"><Brain size={10} className="text-white" /></div>
                    <span className="text-[11px] font-semibold text-[#0F172A]">AI 经营建议</span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">当前判断</div>
                      <p className="text-[10px] text-[#0F172A] leading-4 font-medium">
                        当前资产池整体经营状态较稳定，在营资产与正常还款资产占比较高，但部分重点资产存在风险上升与回款波动迹象。
                      </p>
                    </div>

                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">资产经营摘要</div>
                      <p className="text-[9px] text-[#475569] leading-4">
                        高价值资产总体保持稳定，新增转化资产已逐步进入经营阶段，当前主要关注点集中在少量风险预警与临近到期资产。
                      </p>
                    </div>

                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">资产池质量</div>
                      {(() => {
                        const healthyPct = Math.round(((TIERS[0].count + TIERS[1].count) / totalAssets) * 100);
                        return (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-2 rounded-full bg-[#F1F5F9] overflow-hidden"><div className="h-full rounded-full bg-[#047857]" style={{ width: `${healthyPct}%` }} /></div>
                            <span className="text-[10px] font-bold text-[#047857]">{healthyPct}% 健康</span>
                          </div>
                        );
                      })()}
                    </div>

                    {ALERTS.filter(a => a.level === '高').length > 0 && (
                      <div>
                        <div className="text-[9px] text-[#94A3B8] mb-0.5">主要关注提示</div>
                        <div className="rounded bg-[#FEF2F2] px-2 py-1.5 text-[9px] text-[#DC2626] space-y-0.5">
                          {ALERTS.filter(a => a.level === '高').map((a, i) => <div key={i}>· {a.type}：涉及 {a.assetCount} 户</div>)}
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">下一步建议</div>
                      <p className="text-[10px] text-[#7C3AED] font-medium">
                        建议优先查看风险关注资产与回款波动资产的明细情况，并结合在营资产状态安排后续经营与跟进动作。
                      </p>
                    </div>

                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">建议进入页面</div>
                      <p className="text-[10px] text-[#475569]">风险监控 → 还款表现</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 pt-1">
                    <Button size="sm" className="h-7 text-[10px] gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white w-full"><CheckCircle2 size={10} />采纳建议</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#A7F3D0] text-[#047857] w-full" onClick={() => onModuleChange('activated')}><ArrowRight size={10} />进入在营资产</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#FCA5A5] text-[#DC2626] w-full" onClick={() => onModuleChange('risk-assets')}><ArrowRight size={10} />进入风险监控</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#FED7AA] text-[#C2410C] w-full" onClick={() => onModuleChange('repayment')}><ArrowRight size={10} />进入还款表现</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569] w-full"><UserCheck size={10} />人工确认</Button>
                  </div>
                </div>
              </div>
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
