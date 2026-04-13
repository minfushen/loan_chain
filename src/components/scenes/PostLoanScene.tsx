import React from 'react';
import SceneLayout from '../SceneLayout';
import { SCENES } from '../../constants';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  Clock3,
  Edit,
  Eye,
  FileText,
  Filter,
  Gift,
  Megaphone,
  Package,
  Plus,
  Power,
  RefreshCw,
  RotateCcw,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Trash2,
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
  StatusPill,
  EntitySummaryCard,
  ActionQueueCard,
  MiniTrend,
  InsightStrip,
  TimelineRail,
  AiNote,
  STATE_COLORS,
  type StateName,
} from '../ProductPrimitives';
import { useDemo } from '../../demo/DemoContext';
import { ActionBar } from '../../demo/DemoComponents';
import { SAMPLES, SAMPLE_YUTONG, SAMPLE_CHIYUAN, SAMPLE_RUIXIN, SAMPLE_RUIFENG } from '../../demo/chainLoan/data';
import { TrendLineChart, DonutChart, DistributionBarChart, CHART_COLORS } from '../Charts';
import { cn } from '@/lib/utils';

/* ══════════════════════════════════════════════════════════════════════════
   Static data
   ══════════════════════════════════════════════════════════════════════════ */

const TIER_CLIENTS = [
  { id: 'tc-01', name: '科陆储能技术', tier: '高价值' as const, repayRate: '100%', active: '90%', contribution: '¥50万', manager: '李雪婷' },
  { id: 'tc-02', name: '裕同包装科技', tier: '高价值' as const, repayRate: '98%', active: '85%', contribution: '¥42万', manager: '张三' },
  { id: 'tc-03', name: '盛拓模组科技', tier: '高价值' as const, repayRate: '97%', active: '88%', contribution: '¥65万', manager: '张三' },
  { id: 'tc-04', name: '王子包装印刷厂', tier: '中价值' as const, repayRate: '95%', active: '70%', contribution: '¥20万', manager: '陈立' },
  { id: 'tc-05', name: '中外运物流', tier: '中价值' as const, repayRate: '93%', active: '72%', contribution: '¥18万', manager: '王敏' },
  { id: 'tc-06', name: '新宙邦科技', tier: '中价值' as const, repayRate: '91%', active: '65%', contribution: '¥15万', manager: '李雪婷' },
  { id: 'tc-07', name: '顺丰达物流', tier: '低价值' as const, repayRate: '80%', active: '50%', contribution: '¥5万', manager: '王敏' },
  { id: 'tc-08', name: '佳利包装', tier: '低价值' as const, repayRate: '75%', active: '40%', contribution: '¥3万', manager: '张三' },
  { id: 'tc-09', name: '瑞泰新能源材料', tier: '低价值' as const, repayRate: '72%', active: '35%', contribution: '¥2万', manager: '王敏' },
];

const TIER_STYLES = {
  '高价值': { bg: 'bg-[#ECFDF3]', text: 'text-[#047857]', border: 'border-[#A7F3D0]' },
  '中价值': { bg: 'bg-[#FFF7ED]', text: 'text-[#C2410C]', border: 'border-[#FED7AA]' },
  '低价值': { bg: 'bg-[#FEF2F2]', text: 'text-[#DC2626]', border: 'border-[#FCA5A5]' },
};

const ACTION_TEMPLATES = [
  { id: 'at-01', name: '逾期 15 天催收短信', type: '催收' as const, status: '启用' as const, content: '尊敬的客户，您的贷款已逾期 15 天，请尽快还款，避免影响征信。', target: '逾期客户', lastUsed: '2小时前', useCount: 128 },
  { id: 'at-02', name: '高价值客户推荐税易贷', type: '营销' as const, status: '启用' as const, content: '尊敬的客户，您的贷款已还清，可申请税易贷（额度 50-200 万，年化 4.5%）。', target: '高价值客户', lastUsed: '1天前', useCount: 86 },
  { id: 'at-03', name: '续贷到期提醒', type: '提醒' as const, status: '启用' as const, content: '尊敬的客户，您的贷款将于 30 天后到期，如需续贷请提前联系客户经理。', target: '到期前 30 天', lastUsed: '3天前', useCount: 210 },
  { id: 'at-04', name: '企业财产险推荐', type: '营销' as const, status: '启用' as const, content: '尊敬的客户，为保障您的经营资产安全，推荐企业财产险（年保费低至 0.3%）。', target: '中高价值客户', lastUsed: '5天前', useCount: 45 },
  { id: 'at-05', name: '沉睡客户召回通知', type: '营销' as const, status: '启用' as const, content: '尊敬的客户，近期发现您有新增经营活动，可申请优惠利率贷款。', target: '沉睡客户', lastUsed: '1周前', useCount: 32 },
  { id: 'at-06', name: '逾期 30 天催收电话话术', type: '催收' as const, status: '启用' as const, content: '客户经理话术模板：确认还款意愿→协商还款计划→记录跟进结果。', target: '严重逾期', lastUsed: '2天前', useCount: 18 },
  { id: 'at-07', name: '理财产品推荐', type: '营销' as const, status: '禁用' as const, content: '尊敬的客户，推荐短期理财产品（7 天期，年化 3.2%），闲置资金增值。', target: '高价值客户', lastUsed: '2周前', useCount: 12 },
  { id: 'at-08', name: '风险提醒预警', type: '提醒' as const, status: '启用' as const, content: '系统监测到您的经营数据出现波动，请关注并及时提供补充材料。', target: '观察层客户', lastUsed: '4天前', useCount: 56 },
];

const TEMPLATE_TYPE_ICON = { '催收': ShieldAlert, '营销': Gift, '提醒': Bell };
const TEMPLATE_TYPE_STYLE = {
  '催收': 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]',
  '营销': 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
  '提醒': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
};

const REPAY_TREND_90D = [
  { name: '1月', rate: 95.8 },
  { name: '2月', rate: 95.5 },
  { name: '3月', rate: 95.1 },
  { name: '4月上', rate: 95.2 },
];

/* ══════════════════════════════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════════════════════════════ */

interface Props { activeModule: string; onModuleChange: (id: string) => void }

export default function PostLoanScene({ activeModule, onModuleChange, sceneOverride }: Props & { sceneOverride?: string }) {
  const scene = SCENES.find(s => s.id === (sceneOverride || 'smart-operation'))!;
  const { active, currentSample, selectSample, selectedSampleId } = useDemo();

  const [tierFilter, setTierFilter] = React.useState('all');
  const [activeFilter, setActiveFilter] = React.useState('all');
  const [repayFilter, setRepayFilter] = React.useState('all');
  const [actionType, setActionType] = React.useState('推荐贷款');
  const [actionTarget, setActionTarget] = React.useState('高价值');
  const [actionTrigger, setActionTrigger] = React.useState('还款后');
  const [actionContent, setActionContent] = React.useState('');

  const filteredClients = TIER_CLIENTS.filter(c => {
    if (tierFilter !== 'all' && c.tier !== tierFilter) return false;
    if (activeFilter === 'active' && parseInt(c.active) < 70) return false;
    if (activeFilter === 'inactive' && parseInt(c.active) >= 70) return false;
    if (repayFilter === '95' && parseInt(c.repayRate) < 95) return false;
    if (repayFilter === '80' && (parseInt(c.repayRate) < 80 || parseInt(c.repayRate) >= 95)) return false;
    if (repayFilter === 'low' && parseInt(c.repayRate) >= 80) return false;
    return true;
  });

  const renderContent = () => {
    switch (activeModule) {

      /* ════════════════════════════════════════════════════════════════════
         PAGE 1: 贷后总览 (DEFAULT)
         ════════════════════════════════════════════════════════════════════ */
      case 'operations':
      default:
        return (
          <div className="space-y-4">
            {/* Header */}
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity size={14} className="text-[#2563EB]" />
                <span className="text-[13px] font-semibold text-[#0F172A]">贷后总览</span>
                <span className="text-[11px] text-[#94A3B8]">数据口径: 全量 · 截至 {new Date().toLocaleDateString('zh-CN')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 text-[#64748B] border-[#E2E8F0]" onClick={() => onModuleChange('layers')}>
                  <Users size={10} /> 分析客户分层
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 text-[#2563EB] border-[#BFDBFE]" onClick={() => onModuleChange('revenue')}>
                  <TrendingUp size={10} /> 设计增收动作
                </Button>
              </div>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricCard label="还款率" value="95.2%" detail="-0.1% 较上期" tone="green" />
              <MetricCard label="客户活跃度" value="78%" detail="+2% 较上期" tone="amber" />
              <MetricCard label="增收贡献" value="¥1.2亿" detail="+5% 较上期" tone="blue" />
              <MetricCard label="风险客户占比" value="4.5%" detail="-0.2% 较上期" tone="red" />
            </div>

            {/* Trends */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 space-y-3">
                <div className="text-[13px] font-semibold text-[#0F172A]">还款率趋势（近 90 天）</div>
                <TrendLineChart
                  data={REPAY_TREND_90D.map(d => ({ name: d.name, actual: d.rate, target: 95 }))}
                  lines={[
                    { key: 'actual', color: CHART_COLORS.emerald, label: '还款率 (%)' },
                    { key: 'target', color: CHART_COLORS.amber, label: '目标线', dashed: true },
                  ]}
                  height={180}
                />
              </div>

              <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 space-y-3">
                <div className="text-[13px] font-semibold text-[#0F172A]">客户活跃度分布（近 30 天）</div>
                <div className="grid grid-cols-[1fr_1fr] gap-4 items-center">
                  <DonutChart
                    data={[
                      { name: '高价值', value: 420, color: CHART_COLORS.emerald },
                      { name: '中价值', value: 380, color: CHART_COLORS.amber },
                      { name: '低价值', value: 320, color: CHART_COLORS.red },
                    ]}
                    height={160}
                    innerRadius={40}
                    outerRadius={62}
                    centerLabel="在营客户"
                    centerValue="1,120"
                  />
                  <div className="space-y-3">
                    {[
                      { label: '高价值（活跃 ≥ 80%）', count: 420, pct: '37.5%', color: CHART_COLORS.emerald },
                      { label: '中价值（活跃 60-80%）', count: 380, pct: '33.9%', color: CHART_COLORS.amber },
                      { label: '低价值（活跃 < 60%）', count: 320, pct: '28.6%', color: CHART_COLORS.red },
                    ].map(r => (
                      <div key={r.label} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: r.color }} />
                        <span className="text-[10px] text-[#64748B] flex-1">{r.label}</span>
                        <span className="text-[11px] font-semibold text-[#0F172A]">{r.count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Key metrics */}
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 space-y-3">
              <div className="text-[13px] font-semibold text-[#0F172A]">经营健康指标</div>
              <div className="space-y-2">
                <MiniTrend label="平均回款周期" value="36 天" trend="-1 天" good />
                <MiniTrend label="续贷率" value="68.4%" trend="+2.1%" good />
                <MiniTrend label="交叉销售渗透率" value="12.8%" trend="+1.5%" good />
                <MiniTrend label="客户流失率" value="3.2%" trend="-0.3%" good />
                <MiniTrend label="逾期 30+ 天占比" value="0.34%" trend="+0.02%" good={false} />
              </div>
            </div>

            {/* Quick actions */}
            <WorkbenchPanel title="快捷操作">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: '查看还款记录', desc: '查看贷后客户还款情况', icon: Wallet },
                  { label: '分析客户分层', desc: '按价值等级划分客户', icon: Users },
                  { label: '设计增收动作', desc: '创建增值服务策略', icon: TrendingUp },
                  { label: '管理模板', desc: '编辑催收/营销模板', icon: FileText },
                ].map((a, i) => {
                  const Icon = a.icon;
                  return (
                    <button key={a.label} onClick={() => onModuleChange(['operations', 'layers', 'revenue', 'playbook'][i])} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3 text-left hover:bg-[#EFF6FF] transition-colors">
                      <div className="flex items-center gap-1.5 mb-1"><Icon size={12} className="text-[#2563EB]" /><span className="text-[11px] font-medium text-[#0F172A]">{a.label}</span></div>
                      <div className="text-[10px] text-[#94A3B8]">{a.desc}</div>
                    </button>
                  );
                })}
              </div>
            </WorkbenchPanel>

            {active && <ActionBar />}
          </div>
        );

      /* ════════════════════════════════════════════════════════════════════
         PAGE 2: 客户分层
         ════════════════════════════════════════════════════════════════════ */
      case 'layers':
        return (
          <div className="space-y-4">
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Users size={14} className="text-[#2563EB]" />
                <span className="text-[13px] font-semibold text-[#0F172A]">客户分层</span>
                <span className="text-[11px] text-[#94A3B8]">共 {TIER_CLIENTS.length} 户</span>
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-[10px] text-[#64748B] gap-1"><Search size={10} /> 搜索</Button>
            </div>

            {/* Tier summary */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { tier: '高价值', count: TIER_CLIENTS.filter(c => c.tier === '高价值').length, pct: '33%', desc: '还款稳定·活跃度高·贡献大', color: 'green' as const },
                { tier: '中价值', count: TIER_CLIENTS.filter(c => c.tier === '中价值').length, pct: '33%', desc: '还款正常·有增长潜力', color: 'amber' as const },
                { tier: '低价值', count: TIER_CLIENTS.filter(c => c.tier === '低价值').length, pct: '33%', desc: '需关注·流失风险', color: 'red' as const },
              ].map(t => (
                <MetricCard key={t.tier} label={t.tier} value={`${t.count} 户`} detail={`占比 ${t.pct} · ${t.desc}`} tone={t.color} />
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[200px_1fr] gap-4">
              {/* Left sidebar filters */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white p-3 space-y-3 h-fit">
                <div className="text-[11px] font-semibold text-[#0F172A]">客户分层</div>
                <div className="space-y-1">
                  {[{ value: 'all', label: '全部' }, { value: '高价值', label: '高价值' }, { value: '中价值', label: '中价值' }, { value: '低价值', label: '低价值' }].map(opt => (
                    <button key={opt.value} onClick={() => setTierFilter(opt.value)} className={cn('w-full text-left rounded-md px-2.5 py-2 text-[11px] transition-colors', tierFilter === opt.value ? 'bg-[#EFF6FF] text-[#2563EB] font-medium' : 'text-[#64748B] hover:bg-[#F8FAFC]')}>
                      {opt.label}
                    </button>
                  ))}
                </div>
                <div className="border-t border-[#F1F5F9] pt-3">
                  <div className="text-[11px] font-semibold text-[#0F172A]">活跃度</div>
                  <div className="space-y-1 mt-1">
                    {[{ value: 'all', label: '全部' }, { value: 'active', label: '活跃 (≥70%)' }, { value: 'inactive', label: '不活跃 (<70%)' }].map(opt => (
                      <button key={opt.value} onClick={() => setActiveFilter(opt.value)} className={cn('w-full text-left rounded-md px-2.5 py-2 text-[11px] transition-colors', activeFilter === opt.value ? 'bg-[#EFF6FF] text-[#2563EB] font-medium' : 'text-[#64748B] hover:bg-[#F8FAFC]')}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="border-t border-[#F1F5F9] pt-3">
                  <div className="text-[11px] font-semibold text-[#0F172A]">还款率</div>
                  <div className="space-y-1 mt-1">
                    {[{ value: 'all', label: '全部' }, { value: '95', label: '≥ 95%' }, { value: '80', label: '80-95%' }, { value: 'low', label: '< 80%' }].map(opt => (
                      <button key={opt.value} onClick={() => setRepayFilter(opt.value)} className={cn('w-full text-left rounded-md px-2.5 py-2 text-[11px] transition-colors', repayFilter === opt.value ? 'bg-[#EFF6FF] text-[#2563EB] font-medium' : 'text-[#64748B] hover:bg-[#F8FAFC]')}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right list */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
                <div className="grid grid-cols-[1fr_80px_70px_70px_80px_120px] gap-0 px-4 py-2.5 border-b border-[#E2E8F0] bg-[#F8FAFC] text-[10px] font-medium text-[#94A3B8] uppercase tracking-wider">
                  <div>客户简称</div><div>分层</div><div>还款率</div><div>活跃度</div><div>贡献度</div><div>操作</div>
                </div>
                {filteredClients.map(c => {
                  const ts = TIER_STYLES[c.tier];
                  return (
                    <div key={c.id} className="grid grid-cols-[1fr_80px_70px_70px_80px_120px] gap-0 px-4 py-3 border-b border-[#F1F5F9] last:border-b-0 items-center hover:bg-[#FAFBFF] transition-colors">
                      <div>
                        <div className="text-[12px] font-medium text-[#0F172A]">{c.name}</div>
                        <div className="text-[10px] text-[#94A3B8]">{c.manager}</div>
                      </div>
                      <div><Badge className={cn('text-[9px] border', ts.bg, ts.text, ts.border)}>{c.tier}</Badge></div>
                      <div className="text-[11px] font-semibold text-[#0F172A]">{c.repayRate}</div>
                      <div className="text-[11px] text-[#64748B]">{c.active}</div>
                      <div className="text-[11px] font-semibold text-[#2563EB]">{c.contribution}</div>
                      <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="h-6 text-[10px] px-1.5 text-[#64748B]"><Eye size={10} /></Button>
                        <Button variant="outline" size="sm" className="h-6 text-[10px] px-2 gap-1 text-[#2563EB] border-[#BFDBFE]" onClick={() => onModuleChange('revenue')}>设计动作</Button>
                      </div>
                    </div>
                  );
                })}
                {filteredClients.length === 0 && <div className="text-center py-10 text-[#94A3B8] text-xs">无匹配客户</div>}
              </div>
            </div>

            {active && <ActionBar />}
          </div>
        );

      /* ════════════════════════════════════════════════════════════════════
         PAGE 3: 增收动作
         本系统只生成营销线索/拜访任务，推送至CRM或移动展业PAD执行
         ════════════════════════════════════════════════════════════════════ */
      case 'revenue':
        return (
          <div className="space-y-4">
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp size={14} className="text-[#2563EB]" />
                <span className="text-[13px] font-semibold text-[#0F172A]">增收动作</span>
                <span className="text-[11px] text-[#94A3B8]">设计增值策略，生成营销线索推送至CRM/展业PAD</span>
              </div>
            </div>

            {/* Architecture boundary notice */}
            <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 flex items-center gap-2 text-[11px] text-[#94A3B8]">
              <Send size={12} className="shrink-0" />
              <span>本系统仅生成营销线索与拜访任务，实际客户触达由CRM系统或移动展业PAD执行并留痕。</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricCard label="本月预计贡献" value="¥1,240万" detail="+8.4% 环比" tone="blue" />
              <MetricCard label="已推送线索" value="210 条" detail="至CRM/展业PAD" tone="green" />
              <MetricCard label="CRM反馈转化" value="130 条" detail="转化率 61.9%" tone="green" />
              <MetricCard label="待生成线索" value="86 条" detail="含高优 24 条" tone="amber" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-4">
              {/* Left: action design area */}
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 space-y-4">
                <div className="text-[13px] font-semibold text-[#0F172A]">设计增值策略</div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] text-[#94A3B8] uppercase tracking-wider mb-1 block">策略类型</label>
                    <select className="w-full h-8 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-2 text-[11px] text-[#334155]" value={actionType} onChange={e => setActionType(e.target.value)}>
                      <option>推荐贷款</option>
                      <option>推荐保险</option>
                      <option>推荐理财</option>
                      <option>提额建议</option>
                      <option>续贷提醒</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-[#94A3B8] uppercase tracking-wider mb-1 block">目标客户</label>
                    <select className="w-full h-8 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-2 text-[11px] text-[#334155]" value={actionTarget} onChange={e => setActionTarget(e.target.value)}>
                      <option>高价值</option>
                      <option>中价值</option>
                      <option>低价值</option>
                      <option>全部</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-[#94A3B8] uppercase tracking-wider mb-1 block">推送目标</label>
                    <select className="w-full h-8 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-2 text-[11px] text-[#334155]" value={actionTrigger} onChange={e => setActionTrigger(e.target.value)}>
                      <option>生成营销线索 → CRM</option>
                      <option>生成外勤拜访任务 → 展业PAD</option>
                      <option>生成续贷提醒 → CRM</option>
                      <option>生成交叉销售线索 → CRM</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-[#94A3B8] uppercase tracking-wider mb-1 block">策略说明</label>
                  <textarea
                    className="w-full h-24 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-[11px] text-[#334155] resize-none"
                    placeholder="描述增值策略要点，如：针对还款后高价值客户，推荐税易贷产品（额度 50-200 万，年化 4.5%），生成营销线索推送至客户经理CRM..."
                    value={actionContent}
                    onChange={e => setActionContent(e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Button size="sm" className="h-8 text-[11px] gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white"><Send size={10} /> 生成线索并推送</Button>
                  <Button variant="outline" size="sm" className="h-8 text-[11px] gap-1 text-[#64748B] border-[#E2E8F0]"><FileText size={10} /> 保存为模板</Button>
                  <Button variant="ghost" size="sm" className="h-8 text-[11px] gap-1 text-[#64748B]"><Eye size={10} /> 预览</Button>
                </div>
              </div>

              {/* Right: task preview & dispatch status */}
              <div className="space-y-4">
                <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 space-y-3">
                  <div className="text-[12px] font-semibold text-[#0F172A]">推送预览</div>
                  <div className="rounded-lg border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-4">
                    <div className="text-[10px] text-[#94A3B8] mb-2">
                      {actionTrigger.includes('展业PAD') ? '外勤拜访任务预览' : '营销线索预览'}
                    </div>
                    <div className="text-[11px] text-[#334155] leading-5 bg-white rounded-md border border-[#E2E8F0] p-3 space-y-1">
                      <div><span className="text-[#94A3B8]">策略类型:</span> {actionType}</div>
                      <div><span className="text-[#94A3B8]">目标客群:</span> {actionTarget}客户</div>
                      <div><span className="text-[#94A3B8]">推送目标:</span> {actionTrigger}</div>
                      <div className="pt-1 border-t border-[#F1F5F9] text-[10px] text-[#94A3B8]">
                        {actionTrigger.includes('展业PAD') ? '将在客户经理移动展业PAD生成外勤拜访任务' : '将在客户经理CRM系统生成营销线索'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 space-y-3">
                  <div className="text-[12px] font-semibold text-[#0F172A]">贡献结构</div>
                  <div className="space-y-2">
                    <FlowRow label="利息收入" value="¥860万 (69%)" percentage={69} />
                    <FlowRow label="手续费" value="¥210万 (17%)" percentage={17} />
                    <FlowRow label="结算沉淀利差" value="¥170万 (14%)" percentage={14} />
                  </div>
                </div>

                <WorkbenchPanel title="待生成线索队列">
                  <div className="space-y-2">
                    <ActionQueueCard action="高价值客户提额 · 38 户" source="经营连续改善 → CRM" sla="预计 ¥420万" priority="高优" />
                    <ActionQueueCard action="续贷提醒 · 52 户" source="到期前 30 天 → CRM" sla="预计 ¥560万" priority="普通" />
                    <ActionQueueCard action="交叉销售 · 24 户" source="结算沉淀 > 50万 → 展业PAD" sla="预计 ¥180万" priority="普通" />
                  </div>
                </WorkbenchPanel>
              </div>
            </div>

            {active && <ActionBar />}
          </div>
        );

      /* ════════════════════════════════════════════════════════════════════
         PAGE: 恢复经营
         ════════════════════════════════════════════════════════════════════ */
      case 'recovery': {
        const recoverySamples = SAMPLES.filter(s => s.stage === 'recovery' || s.riskFlags.length >= 2);
        return (
          <div className="space-y-4">
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <RefreshCw size={14} className="text-[#EA580C]" />
                <span className="text-[13px] font-semibold text-[#0F172A]">恢复经营</span>
                <span className="text-[11px] text-[#94A3B8]">风险客户恢复跟踪与经营重建</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricCard label="恢复中" value={`${recoverySamples.length} 户`} detail="进行中" icon={RefreshCw} tone="amber" />
              <MetricCard label="已恢复" value="2 户" detail="本季度" icon={CheckCircle2} tone="green" />
              <MetricCard label="平均恢复周期" value="45 天" detail="近 6 月" icon={Clock} tone="blue" />
              <MetricCard label="恢复成功率" value="68%" detail="近 6 月" icon={TrendingUp} tone="slate" />
            </div>
            <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
              <div className="px-4 py-3 border-b border-[#F1F5F9]"><span className="text-[13px] font-semibold text-[#0F172A]">恢复任务列表</span></div>
              <div className="divide-y divide-[#F1F5F9]">
                {recoverySamples.length > 0 ? recoverySamples.map(s => (
                  <div key={s.id} className="flex items-center justify-between px-4 py-3 hover:bg-[#FAFBFF] transition-colors">
                    <div>
                      <div className="text-[12px] font-medium text-[#0F172A]">{s.shortName}</div>
                      <div className="text-[10px] text-[#94A3B8]">风险信号: {s.riskFlags.join('、') || '无'} · 额度 {s.currentLimit}</div>
                    </div>
                    <Badge className="text-[9px] bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]">恢复中</Badge>
                  </div>
                )) : (
                  <div className="text-center py-6 text-[13px] text-[#94A3B8]">暂无恢复经营任务</div>
                )}
              </div>
            </div>
            {active && <ActionBar />}
          </div>
        );
      }

      /* ════════════════════════════════════════════════════════════════════
         PAGE 4: 动作模板
         ════════════════════════════════════════════════════════════════════ */
      case 'playbook':
        return (
          <div className="space-y-4">
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText size={14} className="text-[#2563EB]" />
                <span className="text-[13px] font-semibold text-[#0F172A]">动作模板</span>
                <span className="text-[11px] text-[#94A3B8]">共 {ACTION_TEMPLATES.length} 个模板</span>
              </div>
              <Button size="sm" className="h-7 text-[10px] gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white">
                <Plus size={10} /> 新建模板
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricCard label="启用模板" value={`${ACTION_TEMPLATES.filter(t => t.status === '启用').length} 个`} detail="正在生效" tone="green" />
              <MetricCard label="禁用模板" value={`${ACTION_TEMPLATES.filter(t => t.status === '禁用').length} 个`} detail="暂停使用" tone="slate" />
              <MetricCard label="催收模板" value={`${ACTION_TEMPLATES.filter(t => t.type === '催收').length} 个`} detail="逾期处置" tone="red" />
              <MetricCard label="营销模板" value={`${ACTION_TEMPLATES.filter(t => t.type === '营销').length} 个`} detail="增值服务" tone="blue" />
            </div>

            {/* Template table */}
            <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
              <div className="grid grid-cols-[1fr_70px_70px_70px_80px_120px] gap-0 px-4 py-2.5 border-b border-[#E2E8F0] bg-[#F8FAFC] text-[10px] font-medium text-[#94A3B8] uppercase tracking-wider">
                <div>模板名称</div><div>类型</div><div>状态</div><div>使用次数</div><div>最近使用</div><div>操作</div>
              </div>
              {ACTION_TEMPLATES.map(t => {
                const TypeIcon = TEMPLATE_TYPE_ICON[t.type];
                return (
                  <div key={t.id} className="grid grid-cols-[1fr_70px_70px_70px_80px_120px] gap-0 px-4 py-3 border-b border-[#F1F5F9] last:border-b-0 items-center hover:bg-[#FAFBFF] transition-colors">
                    <div>
                      <div className="text-[12px] font-medium text-[#0F172A]">{t.name}</div>
                      <div className="mt-0.5 text-[10px] text-[#94A3B8] line-clamp-1">目标: {t.target}</div>
                    </div>
                    <div>
                      <Badge className={cn('text-[9px] border gap-0.5', TEMPLATE_TYPE_STYLE[t.type])}>
                        <TypeIcon size={8} /> {t.type}
                      </Badge>
                    </div>
                    <div>
                      <Badge className={cn('text-[9px] border', t.status === '启用' ? 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]' : 'bg-[#F8FAFC] text-[#94A3B8] border-[#E2E8F0]')}>
                        {t.status === '启用' ? <><Power size={8} className="mr-0.5" /> 启用</> : '禁用'}
                      </Badge>
                    </div>
                    <div className="text-[11px] text-[#64748B]">{t.useCount}</div>
                    <div className="text-[10px] text-[#94A3B8]">{t.lastUsed}</div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-6 text-[10px] px-1.5 text-[#2563EB]"><Edit size={10} /></Button>
                      <Button variant="outline" size="sm" className="h-6 text-[10px] px-2 gap-1 text-[#047857] border-[#A7F3D0]"><Send size={9} /> 执行</Button>
                      <Button variant="ghost" size="sm" className="h-6 text-[10px] px-1.5 text-[#94A3B8]"><Trash2 size={10} /></Button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Template preview */}
            <div className="rounded-lg border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-4 text-center">
              <div className="text-[11px] text-[#94A3B8]">点击模板的"编辑"按钮可修改内容，"执行"可选择目标客户后发送</div>
              <div className="mt-1 text-[10px] text-[#CBD5E1]">模板支持短信、APP 推送、电话话术等多种渠道</div>
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
