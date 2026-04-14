import React from 'react';
import SceneLayout from '../SceneLayout';
import { SCENES } from '../../constants';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Brain,
  Building2,
  Check,
  CheckCircle2,
  Clock,
  Clock3,
  Download,
  Edit,
  Eye,
  FileText,
  Filter,
  Gift,
  Layers,
  MessageSquare,
  Megaphone,
  Package,
  Phone,
  Plus,
  Power,
  RefreshCw,
  RotateCcw,
  Search,
  Send,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
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
  StatusPill,
  EntitySummaryCard,
  ActionQueueCard,
  MiniTrend,
  InsightStrip,
  TimelineRail,
  AiNote,
  STATE_COLORS,
  type StateName,
  KpiBar,
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
  const [selectedSegmentId, setSelectedSegmentId] = React.useState('sg-01');
  const [segmentFilter, setSegmentFilter] = React.useState('all');
  const [selectedRecoveryId, setSelectedRecoveryId] = React.useState('rc-01');
  const [recoveryStatusFilter, setRecoveryStatusFilter] = React.useState('all');
  const [selectedActionId, setSelectedActionId] = React.useState('act-01');
  const [actionStatusFilter, setActionStatusFilter] = React.useState('all');
  const [selectedTemplateId, setSelectedTemplateId] = React.useState('tpl-01');
  const [templateTypeFilter, setTemplateTypeFilter] = React.useState('all');
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
         PAGE: 经营总览 (5 区驾驶舱)
         ════════════════════════════════════════════════════════════════════ */
      case 'operations':
      default: {
        type CustTier = '高价值客户' | '成长型客户' | '稳定客户' | '沉默客户' | '流失风险客户';
        type TierTrend = '上升' | '持平' | '下降';
        type OppoType = '提额机会' | '交叉销售机会' | '续贷机会' | '激活机会';
        type RecoverType = '沉默客户' | '流失风险客户' | '已流失客户';

        interface ValueTier { tier: CustTier; count: number; pct: number; asset: string; trend: TierTrend; action: string }
        interface OppoItem { id: string; name: string; type: OppoType; asset: string; lastActive: string; suggestion: string; handler: string }
        interface RecoverItem { id: string; name: string; type: RecoverType; asset: string; lastActive: string; suggestion: string; handler: string }

        const VALUE_TIERS: ValueTier[] = [
          { tier: '高价值客户', count: 42, pct: 28, asset: '¥3.2亿', trend: '持平', action: '深耕交叉销售' },
          { tier: '成长型客户', count: 35, pct: 23, asset: '¥1.8亿', trend: '上升', action: '推进提额续贷' },
          { tier: '稳定客户', count: 38, pct: 25, asset: '¥1.5亿', trend: '持平', action: '维持关系维护' },
          { tier: '沉默客户', count: 22, pct: 15, asset: '¥6,800万', trend: '上升', action: '激活经营触达' },
          { tier: '流失风险客户', count: 13, pct: 9, asset: '¥3,200万', trend: '上升', action: '优先恢复跟进' },
        ];

        const OPPO_ITEMS: OppoItem[] = [
          { id: 'op-01', name: '科陆储能技术', type: '提额机会', asset: '¥120万', lastActive: '2天前', suggestion: '额度使用率92%，建议提额至¥180万', handler: '李雪婷' },
          { id: 'op-02', name: '裕同包装科技', type: '交叉销售机会', asset: '¥85万', lastActive: '1天前', suggestion: '结算沉淀¥60万，可匹配企业理财', handler: '张三' },
          { id: 'op-03', name: '盛拓模组科技', type: '续贷机会', asset: '¥65万', lastActive: '3天前', suggestion: '30天后到期，还款表现优，建议主动续贷', handler: '张三' },
          { id: 'op-04', name: '王子包装印刷厂', type: '交叉销售机会', asset: '¥42万', lastActive: '5天前', suggestion: '经营稳定，推荐企业财产险', handler: '陈立' },
          { id: 'op-05', name: '新宙邦科技', type: '激活机会', asset: '¥30万', lastActive: '15天前', suggestion: '近期恢复经营活动，可推送优惠利率', handler: '李雪婷' },
        ];

        const RECOVER_ITEMS: RecoverItem[] = [
          { id: 'rc-01', name: '瑞泰新能源材料', type: '流失风险客户', asset: '¥260万', lastActive: '18天前', suggestion: '多项风险信号，需优先跟进恢复', handler: '王敏' },
          { id: 'rc-02', name: '驰远物流服务', type: '沉默客户', asset: '¥45万', lastActive: '25天前', suggestion: '物流频次持续下降，建议触达确认', handler: '李雪婷' },
          { id: 'rc-03', name: '佳利包装', type: '沉默客户', asset: '¥18万', lastActive: '30天前', suggestion: '活跃度持续走低，建议激活联系', handler: '张三' },
          { id: 'rc-04', name: '顺丰达物流', type: '已流失客户', asset: '¥8万', lastActive: '60天前', suggestion: '已终止业务，评估召回可能性', handler: '王敏' },
        ];

        const TIER_CLR: Record<CustTier, string> = {
          '高价值客户': 'bg-[#F0FDF4] text-[#047857] border-[#BBF7D0]',
          '成长型客户': 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
          '稳定客户': 'bg-[#F8FAFC] text-[#475569] border-[#E2E8F0]',
          '沉默客户': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
          '流失风险客户': 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]',
        };
        const OPPO_CLR: Record<OppoType, string> = {
          '提额机会': 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
          '交叉销售机会': 'bg-[#F0FDF4] text-[#047857] border-[#BBF7D0]',
          '续贷机会': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
          '激活机会': 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]',
        };
        const REC_CLR: Record<RecoverType, string> = {
          '沉默客户': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
          '流失风险客户': 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]',
          '已流失客户': 'bg-[#F8FAFC] text-[#94A3B8] border-[#E2E8F0]',
        };

        const totalCustomers = VALUE_TIERS.reduce((s, t) => s + t.count, 0);
        const activeCustomers = VALUE_TIERS.filter(t => t.tier !== '沉默客户' && t.tier !== '流失风险客户').reduce((s, t) => s + t.count, 0);
        const highValueCount = VALUE_TIERS.find(t => t.tier === '高价值客户')!.count;
        const recoverCount = VALUE_TIERS.filter(t => t.tier === '沉默客户' || t.tier === '流失风险客户').reduce((s, t) => s + t.count, 0);

        return (
          <div className="space-y-3">
            <div className="flex items-center justify-end gap-2 flex-wrap">
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#BFDBFE] text-[#2563EB]"><RefreshCw size={10} />刷新数据</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Clock size={10} />切换统计周期</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Download size={10} />导出经营报告</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Eye size={10} />查看规则</Button>
            </div>

            <KpiBar items={[
              { label: '客户总数', value: totalCustomers, hint: '纳入经营管理的客户（+3 较上期）', tone: 'info' },
              { label: '在营客户', value: activeCustomers, hint: '当前活跃且有业务往来（+2 较上期）', tone: 'normal' },
              { label: '高价值客户', value: highValueCount, hint: '资产或贡献度较高（环比持平）', tone: 'warn' },
              { label: '可增收客户', value: OPPO_ITEMS.length, hint: '存在提额/交叉/续贷机会（+2 较上期）', tone: 'info' },
              { label: '待恢复客户', value: recoverCount, hint: '沉默或流失的客户（+5 较上期）', tone: recoverCount > 0 ? 'risk' : 'muted' },
              { label: '本期新增', value: 8, hint: '本统计周期内新增（+3 较上期）', tone: 'info' },
            ]} />

            {/* 2. 客户价值分层区 */}
            <div className="rounded-lg border border-[#E2E8F0] bg-white p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-[#0F172A]">客户价值分层</span>
                <Button variant="ghost" size="sm" className="h-5 text-[8px] text-[#2563EB]" onClick={() => onModuleChange('layers')}>查看详情 →</Button>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {VALUE_TIERS.map(tier => (
                  <div key={tier.tier} className={cn('rounded-lg border p-2.5 space-y-1 cursor-pointer hover:shadow-sm transition-shadow', TIER_CLR[tier.tier])} onClick={() => onModuleChange('layers')}>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-semibold">{tier.tier}</span>
                      <span className="text-[12px] font-bold">{tier.count}</span>
                    </div>
                    <div className="h-1 rounded-full bg-black/10 overflow-hidden"><div className="h-full rounded-full bg-current opacity-50" style={{ width: `${tier.pct}%` }} /></div>
                    <div className="text-[8px] opacity-80">占比 {tier.pct}% · {tier.trend === '上升' ? '↑' : tier.trend === '下降' ? '↓' : '→'}{tier.trend}</div>
                    <div className="text-[8px] opacity-70">资产 {tier.asset}</div>
                    <div className="text-[8px] font-medium mt-0.5">→ {tier.action}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. 经营机会与恢复关注区 (two columns) */}
            <div className="grid grid-cols-[1fr_1fr] gap-3">
              {/* Opportunities */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
                <div className="px-3 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC] flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#0F172A]">经营机会</span>
                  <Button variant="ghost" size="sm" className="h-5 text-[8px] text-[#2563EB]" onClick={() => onModuleChange('revenue')}>发起经营动作 →</Button>
                </div>
                <div className="divide-y divide-[#F1F5F9]">
                  {OPPO_ITEMS.map(item => (
                    <div key={item.id} className="px-3 py-2.5 hover:bg-[#FAFBFF] transition-colors cursor-pointer" onClick={() => onModuleChange('revenue')}>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[10px] font-semibold text-[#0F172A]">{item.name}</span>
                        <Badge className={cn('text-[7px] border', OPPO_CLR[item.type])}>{item.type}</Badge>
                      </div>
                      <div className="text-[9px] text-[#475569] mb-0.5">{item.suggestion}</div>
                      <div className="flex items-center gap-2 text-[8px] text-[#94A3B8]">
                        <span>资产 {item.asset}</span>
                        <span>活跃 {item.lastActive}</span>
                        <span>{item.handler}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recovery */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
                <div className="px-3 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC] flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#0F172A]">恢复关注</span>
                  <Button variant="ghost" size="sm" className="h-5 text-[8px] text-[#DC2626]" onClick={() => onModuleChange('recovery')}>发起恢复 →</Button>
                </div>
                <div className="divide-y divide-[#F1F5F9]">
                  {RECOVER_ITEMS.map(item => (
                    <div key={item.id} className="px-3 py-2.5 hover:bg-[#FAFBFF] transition-colors cursor-pointer" onClick={() => onModuleChange('recovery')}>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-[10px] font-semibold text-[#0F172A]">{item.name}</span>
                        <Badge className={cn('text-[7px] border', REC_CLR[item.type])}>{item.type}</Badge>
                      </div>
                      <div className="text-[9px] text-[#475569] mb-0.5">{item.suggestion}</div>
                      <div className="flex items-center gap-2 text-[8px] text-[#94A3B8]">
                        <span>资产 {item.asset}</span>
                        <span>最近 {item.lastActive}</span>
                        <span>{item.handler}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 4. 经营趋势分析区 */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 space-y-3">
                <div className="text-[12px] font-semibold text-[#0F172A]">客户结构变化趋势</div>
                <TrendLineChart
                  data={[
                    { name: '1月', newCust: 12, active: 108, churn: 3 },
                    { name: '2月', newCust: 10, active: 112, churn: 4 },
                    { name: '3月', newCust: 15, active: 118, churn: 2 },
                    { name: '4月上', newCust: 8, active: 115, churn: 5 },
                  ]}
                  lines={[
                    { key: 'active', color: CHART_COLORS.emerald, label: '在营客户' },
                    { key: 'newCust', color: CHART_COLORS.blue, label: '新增客户' },
                    { key: 'churn', color: CHART_COLORS.red, label: '流失客户' },
                  ]}
                  height={160}
                />
              </div>
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 space-y-3">
                <div className="text-[12px] font-semibold text-[#0F172A]">增收转化与客户活跃度趋势</div>
                <TrendLineChart
                  data={[
                    { name: '1月', conversion: 58, activeRate: 76 },
                    { name: '2月', conversion: 62, activeRate: 78 },
                    { name: '3月', conversion: 65, activeRate: 80 },
                    { name: '4月上', conversion: 61, activeRate: 78 },
                  ]}
                  lines={[
                    { key: 'conversion', color: CHART_COLORS.blue, label: '增收转化率 (%)' },
                    { key: 'activeRate', color: CHART_COLORS.emerald, label: '客户活跃率 (%)' },
                  ]}
                  height={160}
                />
              </div>
            </div>

            {/* 5. AI经营洞察与行动建议区 */}
            <div className="rounded-lg border border-[#E2E8F0] bg-white p-4">
              <div className="flex items-center gap-1.5 mb-3">
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#7C3AED] to-[#2563EB] flex items-center justify-center"><Brain size={10} className="text-white" /></div>
                <span className="text-[12px] font-semibold text-[#0F172A]">AI 经营洞察与行动建议</span>
              </div>
              <div className="grid grid-cols-[1fr_1fr_250px] gap-4">
                <div className="space-y-2">
                  <div>
                    <div className="text-[9px] text-[#94A3B8] mb-0.5">当前经营结论</div>
                    <p className="text-[10px] text-[#0F172A] font-medium leading-4">整体客户结构稳定，但沉默客户占比有所上升（+5户），流失风险客户同步增长，需关注恢复经营节奏。</p>
                  </div>
                  <div>
                    <div className="text-[9px] text-[#94A3B8] mb-0.5">关键洞察</div>
                    <div className="space-y-1 text-[9px] text-[#475569]">
                      <div className="flex items-start gap-1"><span className="text-[#2563EB] shrink-0">·</span> 高价值客户中有 3 户存在续贷机会，建议 7 天内触达。</div>
                      <div className="flex items-start gap-1"><span className="text-[#F59E0B] shrink-0">·</span> 成长型客户增速较快，可重点培养提额。</div>
                      <div className="flex items-start gap-1"><span className="text-[#DC2626] shrink-0">·</span> 沉默客户数量环比上升 29%，需尽快激活。</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="text-[9px] text-[#94A3B8] mb-0.5">推荐行动</div>
                    <div className="space-y-1.5">
                      {[
                        { action: '优先激活沉默客户', priority: '高', target: '客户恢复', color: 'text-[#DC2626]' },
                        { action: '推进高价值客户交叉销售', priority: '高', target: '经营动作', color: 'text-[#2563EB]' },
                        { action: '跟进续贷到期客户', priority: '中', target: '经营动作', color: 'text-[#C2410C]' },
                        { action: '分析流失原因并优化策略', priority: '中', target: '客户分层', color: 'text-[#7C3AED]' },
                      ].map(a => (
                        <div key={a.action} className="flex items-center gap-2 text-[9px]">
                          <Badge className={cn('text-[7px]', a.priority === '高' ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]' : 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]')}>{a.priority}</Badge>
                          <span className="text-[#0F172A] flex-1">{a.action}</span>
                          <span className="text-[8px] text-[#94A3B8]">→ {a.target}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <Button size="sm" className="h-7 text-[10px] gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white w-full"><CheckCircle2 size={10} />采纳建议</Button>
                  <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#BFDBFE] text-[#2563EB] w-full" onClick={() => onModuleChange('layers')}><Users size={10} />客户分层</Button>
                  <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#BBF7D0] text-[#047857] w-full" onClick={() => onModuleChange('revenue')}><TrendingUp size={10} />经营动作</Button>
                  <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#FCA5A5] text-[#DC2626] w-full" onClick={() => onModuleChange('recovery')}><RefreshCw size={10} />客户恢复</Button>
                  <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569] w-full" onClick={() => onModuleChange('playbook')}><FileText size={10} />经营模板</Button>
                </div>
              </div>
            </div>

            {active && <ActionBar />}
          </div>
        );
      }

      /* ════════════════════════════════════════════════════════════════════
         PAGE: 客户分层 (5 区工作台)
         ════════════════════════════════════════════════════════════════════ */
      case 'layers': {
        type SegCategory = '生命周期类' | '价值贡献类' | '风险防范类';
        type SegSource = '系统预置' | '规则生成' | 'AI推荐' | '人工圈选';
        type StrategyCoverage = '已全量覆盖' | '部分覆盖' | '待配置动作' | '策略执行中';

        interface ModelTier { name: string; count: number; pct: number; aum: string; change: string }
        interface Segment {
          id: string; name: string; category: SegCategory; source: SegSource; updatedAt: string;
          custCount: number; asset: string; avgValue: string; activeChange: string; upRate: string; churnRate: string;
          linkedActions: number; coverage: StrategyCoverage; suggestion: string;
          definition: string; geoProfile: string; preferProfile: string; painProfile: string;
          histReach: string; histConvert: string; needRecovery: boolean; recTemplate: string;
        }

        const MODEL_TIERS: ModelTier[] = [
          { name: '高价值-活跃客群（核心）', count: 32, pct: 21, aum: '¥2.6亿', change: '+2 ↑' },
          { name: '高价值-沉睡客群（挽回）', count: 10, pct: 7, aum: '¥6,200万', change: '+3 ↑' },
          { name: '中低价值-活跃客群（培育）', count: 45, pct: 30, aum: '¥1.4亿', change: '持平' },
          { name: '新客-待首单客群（破冰）', count: 28, pct: 19, aum: '¥4,500万', change: '+5 ↑' },
          { name: '流失风险客群（预警）', count: 13, pct: 9, aum: '¥3,200万', change: '+4 ↑' },
          { name: '已沉淀客群（维持）', count: 22, pct: 14, aum: '¥8,800万', change: '-1 ↓' },
        ];

        const SEGMENTS: Segment[] = [
          { id: 'sg-01', name: '高价值核心客群', category: '价值贡献类', source: '系统预置', updatedAt: '30分钟前', custCount: 32, asset: '¥2.6亿', avgValue: '¥813万', activeChange: '+2%', upRate: '8%', churnRate: '1%', linkedActions: 4, coverage: '已全量覆盖', suggestion: '深耕交叉销售', definition: '授信余额≥500万 & 活跃度≥85% & 还款率≥95%', geoProfile: '长三角62%、珠三角28%', preferProfile: '主用供应链融资，高频小额用信', painProfile: '对利率敏感度中等，续贷体验要求高', histReach: '触达率 92%', histConvert: '转化率 68%', needRecovery: false, recTemplate: '限时提额+交叉销售' },
          { id: 'sg-02', name: '高价值沉睡客群', category: '生命周期类', source: 'AI推荐', updatedAt: '1小时前', custCount: 10, asset: '¥6,200万', avgValue: '¥620万', activeChange: '-15%', upRate: '0%', churnRate: '12%', linkedActions: 1, coverage: '待配置动作', suggestion: '立即配置挽回动作', definition: '历史高价值 & 近30天活跃度下降≥20% & 无业务发生', geoProfile: '长三角55%、中西部30%', preferProfile: '曾为高频客户，近期用信骤降', painProfile: '用信频率下降、早偿增加，资金需求可能外移', histReach: '触达率 65%', histConvert: '转化率 22%', needRecovery: true, recTemplate: '挽回关怀+专属提额' },
          { id: 'sg-03', name: '成长型培育客群', category: '价值贡献类', source: '规则生成', updatedAt: '2小时前', custCount: 45, asset: '¥1.4亿', avgValue: '¥311万', activeChange: '+5%', upRate: '15%', churnRate: '3%', linkedActions: 3, coverage: '部分覆盖', suggestion: '推进提额与续贷', definition: '授信余额100-500万 & 活跃度60-85% & 还款正常', geoProfile: '珠三角45%、长三角35%', preferProfile: '产品单一，以流贷为主', painProfile: '额度不足是主要瓶颈，提额意愿强', histReach: '触达率 78%', histConvert: '转化率 45%', needRecovery: false, recTemplate: '提额引导+续贷提醒' },
          { id: 'sg-04', name: '新客破冰客群', category: '生命周期类', source: '系统预置', updatedAt: '3小时前', custCount: 28, asset: '¥4,500万', avgValue: '¥161万', activeChange: '新增', upRate: 'N/A', churnRate: '5%', linkedActions: 2, coverage: '策略执行中', suggestion: '促首单转化', definition: '授信已批复 & 未发生首笔用信 & 获客≤60天', geoProfile: '分布较广，无明显集中', preferProfile: '观望中，对产品了解不足', painProfile: '操作流程不熟悉、缺乏信任感', histReach: '触达率 55%', histConvert: '转化率 18%', needRecovery: false, recTemplate: '首单引导+操作指引' },
          { id: 'sg-05', name: '流失预警客群', category: '风险防范类', source: 'AI推荐', updatedAt: '5小时前', custCount: 13, asset: '¥3,200万', avgValue: '¥246万', activeChange: '-25%', upRate: '0%', churnRate: '28%', linkedActions: 1, coverage: '待配置动作', suggestion: '优先转入客户恢复', definition: '活跃度降幅≥30% | 连续2期未用信 | 风险信号≥2', geoProfile: '中西部占比偏高', preferProfile: '业务频率骤降，产品使用停滞', painProfile: '经营困难或竞品替代，流失意愿明显', histReach: '触达率 42%', histConvert: '转化率 8%', needRecovery: true, recTemplate: '流失召回+利率优惠' },
          { id: 'sg-06', name: '稳定沉淀客群', category: '价值贡献类', source: '系统预置', updatedAt: '1天前', custCount: 22, asset: '¥8,800万', avgValue: '¥400万', activeChange: '持平', upRate: '3%', churnRate: '2%', linkedActions: 2, coverage: '已全量覆盖', suggestion: '维持关系维护', definition: '授信余额200-500万 & 活跃度稳定 & 无异常', geoProfile: '长三角58%、珠三角32%', preferProfile: '用信稳定，偏好固定产品', painProfile: '无明显痛点，但缺乏惊喜感', histReach: '触达率 85%', histConvert: '转化率 52%', needRecovery: false, recTemplate: '关系维护+增值推荐' },
        ];

        const SCOV: Record<StrategyCoverage, string> = {
          '已全量覆盖': 'bg-[#F0FDF4] text-[#047857] border-[#BBF7D0]',
          '部分覆盖': 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
          '待配置动作': 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]',
          '策略执行中': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
        };
        const SCAT: Record<SegCategory, string> = {
          '生命周期类': 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]',
          '价值贡献类': 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
          '风险防范类': 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]',
        };

        const totalSegs = SEGMENTS.length;
        const totalCovered = SEGMENTS.reduce((s, sg) => s + sg.custCount, 0);
        const upCount = SEGMENTS.filter(sg => parseInt(sg.upRate) > 5).reduce((s, sg) => s + Math.round(sg.custCount * parseInt(sg.upRate) / 100), 0);
        const downCount = SEGMENTS.filter(sg => sg.activeChange.startsWith('-')).reduce((s, sg) => s + sg.custCount, 0);
        const needStrategy = SEGMENTS.filter(sg => sg.coverage === '待配置动作').length;

        const filteredSegs = SEGMENTS.filter(sg => {
          if (segmentFilter === 'all') return true;
          return sg.category === segmentFilter;
        });
        const activeSeg = filteredSegs.find(sg => sg.id === selectedSegmentId) ?? filteredSegs[0] ?? SEGMENTS[0];

        return (
          <div className="space-y-3">
            <div className="flex items-center justify-end gap-2 flex-wrap">
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#BFDBFE] text-[#2563EB]"><RefreshCw size={10} />刷新分层</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#BBF7D0] text-[#047857]"><Plus size={10} />新建客群</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Download size={10} />导出画像</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Eye size={10} />分层规则</Button>
            </div>

            <KpiBar items={[
              { label: '已分层客群', value: totalSegs, hint: '持续监控中的细分客群', tone: 'info' },
              { label: '覆盖客户', value: totalCovered, hint: '已纳入日常经营管理', tone: 'normal' },
              { label: '向上跃迁', value: upCount, hint: '本期升级客户', tone: upCount > 0 ? 'normal' : 'muted' },
              { label: '向下沉睡', value: downCount, hint: '活跃骤降客户', tone: downCount > 0 ? 'risk' : 'muted' },
              { label: '待配置策略', value: needStrategy, hint: '亟需下发经营动作', tone: needStrategy > 0 ? 'warn' : 'muted' },
            ]} />

            {/* 2. Model distribution board */}
            <div className="rounded-lg border border-[#E2E8F0] bg-white p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-[#0F172A]">分层模型与分布看板</span>
                <span className="text-[9px] text-[#94A3B8]">重点关注"高价值沉睡"与"流失预警"客群变化</span>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {MODEL_TIERS.map(tier => {
                  const isWarn = tier.name.includes('沉睡') || tier.name.includes('流失');
                  return (
                    <div key={tier.name} className={cn('rounded-lg border p-2.5 space-y-1', isWarn ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]' : 'bg-[#F8FAFC] text-[#475569] border-[#E2E8F0]')}>
                      <div className="text-[8px] font-semibold leading-tight">{tier.name}</div>
                      <div className="text-[14px] font-bold">{tier.count}</div>
                      <div className="h-1 rounded-full bg-black/10 overflow-hidden"><div className="h-full rounded-full bg-current opacity-40" style={{ width: `${tier.pct * 2}%` }} /></div>
                      <div className="text-[8px] opacity-70">占比 {tier.pct}% · AUM {tier.aum}</div>
                      <div className="text-[8px] font-medium">{tier.change}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3-column: Segment list + Detail + AI */}
            <div className="grid grid-cols-[220px_1fr_250px] gap-3" style={{ minHeight: 440 }}>

              {/* COL 1: Segment list */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-3 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                  <span className="text-[11px] font-semibold text-[#0F172A]">细分客群列表</span>
                  <p className="text-[9px] text-[#94A3B8] mt-0.5">关注变动趋势与策略覆盖</p>
                </div>
                <div className="px-2 py-1.5 border-b border-[#F1F5F9]">
                  <select className="h-5 rounded border border-[#E2E8F0] bg-[#F8FAFC] px-1 text-[9px] text-[#334155] w-full" value={segmentFilter} onChange={e => setSegmentFilter(e.target.value)}>
                    <option value="all">全部分类</option><option value="价值贡献类">价值贡献类</option><option value="生命周期类">生命周期类</option><option value="风险防范类">风险防范类</option>
                  </select>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {filteredSegs.map(sg => {
                    const isActive = activeSeg?.id === sg.id;
                    return (
                      <div key={sg.id} onClick={() => setSelectedSegmentId(sg.id)}
                        className={cn('px-3 py-2.5 border-b border-[#F1F5F9] cursor-pointer transition-all', isActive ? 'bg-[#EFF6FF] border-l-2 border-l-[#2563EB]' : 'hover:bg-[#FAFBFF]')}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[10px] font-semibold text-[#0F172A] truncate flex-1">{sg.name}</span>
                          <Badge className={cn('text-[7px] border shrink-0 ml-1', SCOV[sg.coverage])}>{sg.coverage}</Badge>
                        </div>
                        <div className="flex items-center gap-1 text-[8px] mb-0.5">
                          <Badge className={cn('text-[7px] border', SCAT[sg.category])}>{sg.category}</Badge>
                          <span className="text-[#94A3B8]">{sg.source}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[8px] text-[#64748B]">
                          <span>{sg.custCount}户</span>
                          <span>{sg.asset}</span>
                          <span className={sg.activeChange.startsWith('-') ? 'text-[#DC2626]' : sg.activeChange.startsWith('+') ? 'text-[#047857]' : 'text-[#94A3B8]'}>{sg.activeChange}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Button variant="outline" size="sm" className="h-5 text-[7px] px-1 gap-0.5 border-[#BFDBFE] text-[#2563EB]" onClick={e => e.stopPropagation()}>画像</Button>
                          <Button variant="ghost" size="sm" className="h-5 text-[7px] px-1 text-[#047857]" onClick={e => { e.stopPropagation(); onModuleChange('revenue'); }}>动作</Button>
                          <Button variant="ghost" size="sm" className="h-5 text-[7px] px-1 text-[#64748B]"><Star size={7} /></Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* COL 2: Detail */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-4 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC] flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#0F172A]">客群画像与特征详情</span>
                  <div className="flex items-center gap-1.5">
                    <Badge className={cn('text-[7px] border', SCOV[activeSeg.coverage])}>{activeSeg.coverage}</Badge>
                    <Badge className={cn('text-[7px] border', SCAT[activeSeg.category])}>{activeSeg.category}</Badge>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                  {/* Definition & scale */}
                  <div className="grid grid-cols-3 gap-x-3 gap-y-1 text-[9px] pb-2 border-b border-[#F1F5F9]">
                    <div className="col-span-2"><span className="text-[#94A3B8]">客群</span> <span className="text-[#0F172A] font-medium">{activeSeg.name}</span></div>
                    <div><span className="text-[#94A3B8]">来源</span> <span className="text-[#0F172A]">{activeSeg.source}</span></div>
                    <div className="col-span-3"><span className="text-[#94A3B8]">定义</span> <span className="text-[#0F172A]">{activeSeg.definition}</span></div>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {[
                      { label: '客户数', value: `${activeSeg.custCount}`, color: '#2563EB' },
                      { label: '资产', value: activeSeg.asset, color: '#047857' },
                      { label: '客均价值', value: activeSeg.avgValue, color: '#2563EB' },
                      { label: '跃迁率', value: activeSeg.upRate, color: '#047857' },
                      { label: '流失率', value: activeSeg.churnRate, color: parseInt(activeSeg.churnRate) > 10 ? '#DC2626' : '#64748B' },
                    ].map(m => (
                      <div key={m.label}>
                        <div className="text-[8px] text-[#94A3B8]">{m.label}</div>
                        <div className="text-[12px] font-bold" style={{ color: m.color }}>{m.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Profile */}
                  <div className="border-t border-[#F1F5F9] pt-2">
                    <div className="text-[9px] font-semibold text-[#0F172A] mb-1">特征画像</div>
                    <div className="grid grid-cols-1 gap-1 text-[9px]">
                      <div><span className="text-[#94A3B8]">地域集中度</span> <span className="text-[#0F172A]">{activeSeg.geoProfile}</span></div>
                      <div><span className="text-[#94A3B8]">偏好特征</span> <span className="text-[#0F172A]">{activeSeg.preferProfile}</span></div>
                      <div><span className="text-[#94A3B8]">痛点/流失风险</span> <span className="text-[#DC2626]">{activeSeg.painProfile}</span></div>
                    </div>
                  </div>

                  {/* Actions & conversion */}
                  <div className="border-t border-[#F1F5F9] pt-2">
                    <div className="text-[9px] font-semibold text-[#0F172A] mb-1">经营成效</div>
                    <div className="grid grid-cols-3 gap-x-3 gap-y-1 text-[9px]">
                      <div><span className="text-[#94A3B8]">关联动作</span> <span className="text-[#0F172A]">{activeSeg.linkedActions} 个</span></div>
                      <div><span className="text-[#94A3B8]">历史触达率</span> <span className="text-[#0F172A]">{activeSeg.histReach}</span></div>
                      <div><span className="text-[#94A3B8]">历史转化率</span> <span className="text-[#0F172A]">{activeSeg.histConvert}</span></div>
                      <div><span className="text-[#94A3B8]">推荐模板</span> <span className="text-[#2563EB]">{activeSeg.recTemplate}</span></div>
                      {activeSeg.needRecovery && <div className="col-span-2"><span className="text-[#DC2626] font-medium">⚠ 建议转入客户恢复</span></div>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 border-t border-[#F1F5F9] pt-2 flex-wrap">
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#BFDBFE] text-[#2563EB]"><Eye size={9} />特征明细</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]"><Download size={9} />客户清单</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#BBF7D0] text-[#047857]" onClick={() => onModuleChange('playbook')}><FileText size={9} />关联模板</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#BFDBFE] text-[#2563EB]" onClick={() => onModuleChange('revenue')}><Send size={9} />下发动作</Button>
                    {activeSeg.needRecovery && <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#FCA5A5] text-[#DC2626]" onClick={() => onModuleChange('recovery')}><RefreshCw size={9} />客户恢复</Button>}
                  </div>
                </div>
              </div>

              {/* COL 3: AI */}
              <div className="space-y-3">
                <div className="rounded-lg border border-[#E2E8F0] bg-white p-3 space-y-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#7C3AED] to-[#2563EB] flex items-center justify-center"><Brain size={10} className="text-white" /></div>
                    <span className="text-[11px] font-semibold text-[#0F172A]">AI 洞察与策略匹配</span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">当前判断</div>
                      <p className="text-[10px] text-[#0F172A] leading-4 font-medium">
                        {activeSeg.coverage === '待配置动作'
                          ? '当前客群画像清晰，但处于策略"裸奔"状态，亟需下发经营动作。'
                          : '当前客群画像清晰，价值贡献度较高，现有策略触达转化稳定。'}
                      </p>
                    </div>

                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">客群特征摘要</div>
                      <p className="text-[9px] text-[#475569] leading-4">
                        {activeSeg.painProfile}
                      </p>
                    </div>

                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">经营价值</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
                          <div className="h-full rounded-full bg-[#2563EB]" style={{ width: `${Math.min(parseInt(activeSeg.histConvert) * 1.2, 100)}%` }} />
                        </div>
                        <span className="text-[10px] font-bold text-[#2563EB]">{activeSeg.histConvert}</span>
                      </div>
                    </div>

                    {activeSeg.needRecovery && (
                      <div className="rounded bg-[#FEF2F2] border border-[#FCA5A5] px-2 py-1.5 text-[9px] text-[#DC2626]">
                        该客群向下沉睡率偏高，部分高危客户建议直接移交客户恢复跟进。
                      </div>
                    )}

                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">下一步建议</div>
                      <p className="text-[10px] text-[#7C3AED] font-medium">
                        {activeSeg.needRecovery
                          ? '建议对该客群立即配置"挽回与关怀类"经营动作，并关联专属提额模板；部分高危客户直接移交客户恢复。'
                          : `建议复用历史成功模板「${activeSeg.recTemplate}」持续经营，并关注跃迁率变化。`}
                      </p>
                    </div>

                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">建议进入</div>
                      <p className="text-[10px] text-[#475569]">{activeSeg.needRecovery ? '客户恢复' : activeSeg.coverage === '待配置动作' ? '经营动作' : '经营模板'}</p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 pt-1">
                    <Button size="sm" className="h-7 text-[10px] gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white w-full"><CheckCircle2 size={10} />采纳建议</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#BFDBFE] text-[#2563EB] w-full" onClick={() => onModuleChange('revenue')}><TrendingUp size={10} />经营动作</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569] w-full" onClick={() => onModuleChange('playbook')}><FileText size={10} />经营模板</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#FCA5A5] text-[#DC2626] w-full" onClick={() => onModuleChange('recovery')}><RefreshCw size={10} />客户恢复</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#BBF7D0] text-[#047857] w-full"><Zap size={10} />一键配置策略</Button>
                  </div>
                </div>
              </div>
            </div>

            {active && <ActionBar />}
          </div>
        );
      }

      /* ════════════════════════════════════════════════════════════════════
         PAGE: 经营动作 (5 区工作台)
         ════════════════════════════════════════════════════════════════════ */
      case 'revenue': {
        type ActionStatus = '草稿' | '待执行' | '执行中' | '已暂停' | '已结束';
        type ActionType = '促活' | '破冰' | '挽回' | '交叉营销';
        type EffectTag = '转化超预期' | '表现平稳' | '触达率低' | '转化停滞';

        interface BizAction {
          id: string; name: string; type: ActionType; targetGroup: string;
          startDate: string; endDate: string; executor: string; channel: string;
          targetCount: number; reachCount: number; responseCount: number; convertCount: number;
          reachRate: number; convertRate: number; addedValue: string;
          status: ActionStatus; effectTag: EffectTag; suggestion: string;
          description: string; groupRule: string; template: string;
          bottleneck: string; feedback: string; abNote: string;
        }

        const BIZ_ACTIONS: BizAction[] = [
          {
            id: 'act-01', name: '高价值客群提额促活', type: '促活', targetGroup: '高价值核心客群',
            startDate: '04-01', endDate: '04-15', executor: '系统自动化', channel: 'APP推送+企微',
            targetCount: 32, reachCount: 30, responseCount: 18, convertCount: 12,
            reachRate: 93.8, convertRate: 37.5, addedValue: '¥680万',
            status: '执行中', effectTag: '转化超预期', suggestion: '建议扩大客群范围',
            description: '针对高价值核心客群推送专属提额邀请，搭配限时利率优惠权益', groupRule: '授信余额≥500万 & 活跃度≥85%',
            template: '限时提额+利率优惠组合包', bottleneck: '漏斗健康，各环节流失率均在合理范围',
            feedback: '12户已完成提额申请，平均提额 56 万', abNote: '企微渠道响应率 68%，APP推送 42%',
          },
          {
            id: 'act-02', name: '新客首贷破冰动作', type: '破冰', targetGroup: '新客-待首单客群',
            startDate: '04-03', endDate: '04-20', executor: '系统+客户经理', channel: '短信+人工外呼',
            targetCount: 28, reachCount: 22, responseCount: 6, convertCount: 2,
            reachRate: 78.6, convertRate: 7.1, addedValue: '¥85万',
            status: '执行中', effectTag: '触达率低', suggestion: '调整触达渠道，增加企微',
            description: '面向已获批但未首笔用信客户，发送首贷引导与操作指南', groupRule: '授信已批复 & 未发生首笔用信 & 获客≤60天',
            template: '首单引导+操作指引', bottleneck: '短信触达率低（54%），且响应至转化环节流失严重',
            feedback: '短信渠道几乎无转化，人工外呼效果较好', abNote: '短信 vs 外呼: 转化率 1.2% vs 15%',
          },
          {
            id: 'act-03', name: '沉睡客群专属挽回', type: '挽回', targetGroup: '高价值沉睡客群',
            startDate: '04-05', endDate: '04-25', executor: '系统自动化', channel: 'APP推送+短信',
            targetCount: 10, reachCount: 8, responseCount: 3, convertCount: 1,
            reachRate: 80, convertRate: 10, addedValue: '¥120万',
            status: '执行中', effectTag: '表现平稳', suggestion: '继续执行，观察转化趋势',
            description: '对高价值沉睡客群下发免息券+提额降息复合权益', groupRule: '历史高价值 & 近30天活跃度下降≥20%',
            template: '挽回关怀+专属提额', bottleneck: '触达率可接受，但响应率偏低（37.5%）',
            feedback: '1户已重新激活并用信，3户已领取权益待观察', abNote: '免息券领取率 25%，提额邀请领取率 12.5%',
          },
          {
            id: 'act-04', name: '成长客群交叉营销', type: '交叉营销', targetGroup: '成长型培育客群',
            startDate: '03-20', endDate: '04-10', executor: '客户经理', channel: '企微+外勤拜访',
            targetCount: 45, reachCount: 40, responseCount: 22, convertCount: 8,
            reachRate: 88.9, convertRate: 17.8, addedValue: '¥450万',
            status: '已结束', effectTag: '转化超预期', suggestion: '复制至其他相似客群',
            description: '向成长型客群推荐供应链融资、结算沉淀等交叉产品', groupRule: '授信100-500万 & 活跃度60-85% & 产品单一',
            template: '交叉销售引导+增值权益', bottleneck: '无明显瓶颈，整体漏斗健康',
            feedback: '8户新增供应链融资，平均额度 56 万', abNote: '企微转化率 22% > 外勤 14%',
          },
          {
            id: 'act-05', name: '续贷到期提醒', type: '促活', targetGroup: '稳定沉淀客群',
            startDate: '04-01', endDate: '04-30', executor: '系统自动化', channel: 'APP推送+短信',
            targetCount: 22, reachCount: 20, responseCount: 5, convertCount: 0,
            reachRate: 90.9, convertRate: 0, addedValue: '¥0',
            status: '已暂停', effectTag: '转化停滞', suggestion: '检查权益吸引力，考虑叫停',
            description: '对即将到期客户发送续贷提醒与续贷优惠', groupRule: '授信到期≤30天 & 活跃度稳定',
            template: '续贷提醒+手续费减免', bottleneck: '触达良好但响应至转化完全断裂，权益无吸引力',
            feedback: '5户打开了推送但无任何后续操作', abNote: '无有效对比数据',
          },
        ];

        const ASTAT: Record<ActionStatus, string> = {
          '草稿': 'bg-[#F8FAFC] text-[#94A3B8] border-[#E2E8F0]',
          '待执行': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
          '执行中': 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
          '已暂停': 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]',
          '已结束': 'bg-[#F0FDF4] text-[#047857] border-[#BBF7D0]',
        };
        const ATYPE: Record<ActionType, string> = {
          '促活': 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
          '破冰': 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]',
          '挽回': 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]',
          '交叉营销': 'bg-[#F0FDF4] text-[#047857] border-[#BBF7D0]',
        };
        const AEFF: Record<EffectTag, string> = {
          '转化超预期': 'bg-[#F0FDF4] text-[#047857] border-[#BBF7D0]',
          '表现平稳': 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
          '触达率低': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
          '转化停滞': 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]',
        };

        const executing = BIZ_ACTIONS.filter(a => a.status === '执行中').length;
        const highConvert = BIZ_ACTIONS.filter(a => a.effectTag === '转化超预期').length;
        const lowEff = BIZ_ACTIONS.filter(a => a.effectTag === '触达率低' || a.effectTag === '转化停滞').length;
        const totalReach = BIZ_ACTIONS.filter(a => a.status !== '草稿').reduce((s, a) => s + a.reachCount, 0);
        const totalAddedValue = '¥1,335万';

        const filteredActions = BIZ_ACTIONS.filter(a => {
          if (actionStatusFilter === 'all') return true;
          return a.status === actionStatusFilter;
        });
        const activeAction = filteredActions.find(a => a.id === selectedActionId) ?? filteredActions[0] ?? BIZ_ACTIONS[0];

        return (
          <div className="space-y-3">
            <div className="flex items-center justify-end gap-2 flex-wrap">
              <Button size="sm" className="h-7 text-[10px] gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white"><Plus size={10} />新建动作</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#BFDBFE] text-[#2563EB]"><RefreshCw size={10} />刷新</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Download size={10} />执行报告</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Eye size={10} />执行规则</Button>
            </div>

            <KpiBar items={[
              { label: '执行中动作', value: executing, hint: '活跃派发中', tone: executing > 0 ? 'info' : 'muted' },
              { label: '高转化动作', value: highConvert, hint: '建议复用扩大', tone: 'normal' },
              { label: '低效/停滞', value: lowEff, hint: '亟需优化或叫停', tone: lowEff > 0 ? 'risk' : 'muted' },
              { label: '累计触达', value: totalReach, hint: '去重客户总数', tone: 'info' },
              { label: '转化资产', value: totalAddedValue, hint: '促成增量价值', tone: 'normal' },
            ]} />

            {/* 3-column: list + detail/funnel + AI */}
            <div className="grid grid-cols-[220px_1fr_250px] gap-3" style={{ minHeight: 480 }}>

              {/* COL 1: Action list */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-3 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                  <span className="text-[11px] font-semibold text-[#0F172A]">经营动作列表</span>
                  <p className="text-[9px] text-[#94A3B8] mt-0.5">优先关注低效动作与高转化动作</p>
                </div>
                <div className="px-2 py-1.5 border-b border-[#F1F5F9]">
                  <select className="h-5 rounded border border-[#E2E8F0] bg-[#F8FAFC] px-1 text-[9px] text-[#334155] w-full" value={actionStatusFilter} onChange={e => setActionStatusFilter(e.target.value)}>
                    <option value="all">全部状态</option>
                    <option value="执行中">执行中</option>
                    <option value="已暂停">已暂停</option>
                    <option value="已结束">已结束</option>
                    <option value="草稿">草稿</option>
                  </select>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {filteredActions.map(a => {
                    const isAct = activeAction?.id === a.id;
                    return (
                      <div key={a.id} onClick={() => setSelectedActionId(a.id)}
                        className={cn('px-3 py-2.5 border-b border-[#F1F5F9] cursor-pointer transition-all', isAct ? 'bg-[#EFF6FF] border-l-2 border-l-[#2563EB]' : 'hover:bg-[#FAFBFF]')}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[10px] font-semibold text-[#0F172A] truncate flex-1">{a.name}</span>
                          <Badge className={cn('text-[7px] border shrink-0 ml-1', ASTAT[a.status])}>{a.status}</Badge>
                        </div>
                        <div className="flex items-center gap-1 text-[8px] mb-0.5">
                          <Badge className={cn('text-[7px] border', ATYPE[a.type])}>{a.type}</Badge>
                          <Badge className={cn('text-[7px] border', AEFF[a.effectTag])}>{a.effectTag}</Badge>
                        </div>
                        <div className="text-[8px] text-[#94A3B8] mb-0.5">{a.targetGroup} · {a.executor}</div>
                        <div className="flex items-center gap-2 text-[8px] text-[#64748B]">
                          <span>触达 {a.reachRate}%</span>
                          <span>转化 {a.convertRate}%</span>
                          <span className="text-[#047857] font-medium">{a.addedValue}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Button variant="outline" size="sm" className="h-5 text-[7px] px-1 gap-0.5 border-[#BFDBFE] text-[#2563EB]" onClick={e => e.stopPropagation()}>成效</Button>
                          <Button variant="ghost" size="sm" className="h-5 text-[7px] px-1 text-[#C2410C]" onClick={e => e.stopPropagation()}>
                            {a.status === '执行中' ? '暂停' : a.status === '已暂停' ? '恢复' : '复制'}
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  {filteredActions.length === 0 && (
                    <div className="text-center py-10 text-[9px] text-[#94A3B8] px-3">
                      <p>当前暂无配置的经营动作。</p>
                      <p className="mt-1">建议先前往"客户分层"圈选目标客群。</p>
                    </div>
                  )}
                </div>
              </div>

              {/* COL 2: Detail + Funnel */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-4 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC] flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#0F172A]">动作详情与成效漏斗</span>
                  <div className="flex items-center gap-1.5">
                    <Badge className={cn('text-[7px] border', ASTAT[activeAction.status])}>{activeAction.status}</Badge>
                    <Badge className={cn('text-[7px] border', AEFF[activeAction.effectTag])}>{activeAction.effectTag}</Badge>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                  {/* Config detail */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[9px] pb-2 border-b border-[#F1F5F9]">
                    <div className="col-span-2"><span className="text-[#94A3B8]">动作</span> <span className="text-[#0F172A] font-medium">{activeAction.name}</span></div>
                    <div><span className="text-[#94A3B8]">类型</span> <Badge className={cn('text-[7px] border', ATYPE[activeAction.type])}>{activeAction.type}</Badge></div>
                    <div><span className="text-[#94A3B8]">渠道</span> <span className="text-[#0F172A]">{activeAction.channel}</span></div>
                    <div><span className="text-[#94A3B8]">客群</span> <span className="text-[#0F172A]">{activeAction.targetGroup}</span></div>
                    <div><span className="text-[#94A3B8]">执行</span> <span className="text-[#0F172A]">{activeAction.executor}</span></div>
                    <div><span className="text-[#94A3B8]">周期</span> <span className="text-[#0F172A]">{activeAction.startDate} ~ {activeAction.endDate}</span></div>
                    <div><span className="text-[#94A3B8]">模板</span> <span className="text-[#2563EB]">{activeAction.template}</span></div>
                    <div className="col-span-2"><span className="text-[#94A3B8]">规则</span> <span className="text-[#64748B]">{activeAction.groupRule}</span></div>
                    <div className="col-span-2"><span className="text-[#94A3B8]">说明</span> <span className="text-[#0F172A]">{activeAction.description}</span></div>
                  </div>

                  {/* Funnel */}
                  <div className="border-b border-[#F1F5F9] pb-2">
                    <div className="text-[9px] font-semibold text-[#0F172A] mb-2">成效转化漏斗</div>
                    <div className="space-y-1.5">
                      {[
                        { label: '目标应达', count: activeAction.targetCount, pct: 100, color: '#94A3B8' },
                        { label: '实际触达', count: activeAction.reachCount, pct: activeAction.reachRate, color: '#2563EB' },
                        { label: '响应/点击', count: activeAction.responseCount, pct: activeAction.targetCount > 0 ? Math.round(activeAction.responseCount / activeAction.targetCount * 100) : 0, color: '#7C3AED' },
                        { label: '最终转化', count: activeAction.convertCount, pct: activeAction.targetCount > 0 ? Math.round(activeAction.convertCount / activeAction.targetCount * 100) : 0, color: '#047857' },
                      ].map((step, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-[8px] text-[#94A3B8] w-[52px] text-right shrink-0">{step.label}</span>
                          <div className="flex-1 h-4 rounded bg-[#F1F5F9] overflow-hidden relative">
                            <div className="h-full rounded transition-all" style={{ width: `${step.pct}%`, backgroundColor: step.color, opacity: 0.2 }} />
                            <div className="absolute inset-y-0 left-0 h-full rounded transition-all" style={{ width: `${step.pct}%`, backgroundColor: step.color, opacity: 0.6 }} />
                          </div>
                          <span className="text-[9px] font-bold w-[28px] shrink-0" style={{ color: step.color }}>{step.count}</span>
                          <span className="text-[8px] text-[#94A3B8] w-[30px] shrink-0">{step.pct}%</span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-1.5 text-[9px] text-[#0F172A]">
                      <span className="text-[#94A3B8]">增量价值</span> <span className="font-bold text-[#047857]">{activeAction.addedValue}</span>
                    </div>
                  </div>

                  {/* Bottleneck */}
                  <div className="border-b border-[#F1F5F9] pb-2">
                    <div className="text-[9px] font-semibold text-[#0F172A] mb-1">瓶颈分析</div>
                    <p className="text-[9px] text-[#475569]">{activeAction.bottleneck}</p>
                  </div>

                  {/* Feedback & AB */}
                  <div className="border-b border-[#F1F5F9] pb-2 grid grid-cols-2 gap-3 text-[9px]">
                    <div><span className="text-[#94A3B8]">最近反馈</span> <span className="text-[#0F172A]">{activeAction.feedback}</span></div>
                    <div><span className="text-[#94A3B8]">A/B对比</span> <span className="text-[#7C3AED]">{activeAction.abNote}</span></div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#BFDBFE] text-[#2563EB]"><Eye size={9} />触达明细</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]" onClick={() => onModuleChange('playbook')}><RefreshCw size={9} />换模板</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]" onClick={() => onModuleChange('layers')}><Users size={9} />调客群</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#DDD6FE] text-[#7C3AED]"><Sparkles size={9} />A/B测试</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#BBF7D0] text-[#047857]"><FileText size={9} />成效战报</Button>
                  </div>
                </div>
              </div>

              {/* COL 3: AI diagnosis */}
              <div className="space-y-3">
                <div className="rounded-lg border border-[#E2E8F0] bg-white p-3 space-y-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#7C3AED] to-[#2563EB] flex items-center justify-center"><Brain size={10} className="text-white" /></div>
                    <span className="text-[11px] font-semibold text-[#0F172A]">AI 诊断与优化建议</span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">当前诊断</div>
                      <p className="text-[10px] text-[#0F172A] leading-4 font-medium">
                        {activeAction.effectTag === '转化停滞'
                          ? '该动作已失去边际效用，触达正常但转化完全断裂，建议叫停并释放资源。'
                          : activeAction.effectTag === '触达率低'
                            ? '该动作触达率偏低，建议检查发送渠道配置，并考虑增加企微等高响应渠道。'
                            : activeAction.effectTag === '转化超预期'
                              ? '该动作ROI极佳，建议复制并应用于其他相似客群，持续扩大战果。'
                              : '该动作进入执行中后期，触达基本完成，建议关注转化边际变化。'}
                      </p>
                    </div>

                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">成效摘要</div>
                      <p className="text-[9px] text-[#475569] leading-4">{activeAction.feedback}</p>
                    </div>

                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">漏斗瓶颈</div>
                      <p className="text-[9px] text-[#DC2626] leading-4">{activeAction.bottleneck}</p>
                    </div>

                    {activeAction.effectTag === '转化停滞' && (
                      <div className="rounded bg-[#FEF2F2] border border-[#FCA5A5] px-2 py-1.5 text-[9px] text-[#DC2626]">
                        转化率低于预警线，建议人工介入诊断或直接叫停。
                      </div>
                    )}

                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">下一步建议</div>
                      <p className="text-[10px] text-[#7C3AED] font-medium leading-4">{activeAction.suggestion}</p>
                    </div>

                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">建议进入</div>
                      <p className="text-[10px] text-[#475569]">
                        {activeAction.effectTag === '触达率低' || activeAction.effectTag === '转化停滞'
                          ? '经营模板（优化权益内容）'
                          : '客户分层（扩展目标客群）'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 pt-1">
                    <Button size="sm" className="h-7 text-[10px] gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white w-full"><CheckCircle2 size={10} />采纳建议</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#BFDBFE] text-[#2563EB] w-full" onClick={() => onModuleChange('playbook')}><FileText size={10} />经营模板</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569] w-full" onClick={() => onModuleChange('layers')}><Layers size={10} />客户分层</Button>
                    {(activeAction.effectTag === '触达率低' || activeAction.effectTag === '转化停滞') && (
                      <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#FCA5A5] text-[#DC2626] w-full"><ShieldAlert size={10} />停止低效动作</Button>
                    )}
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#BBF7D0] text-[#047857] w-full"><Zap size={10} />一键优化</Button>
                  </div>
                </div>
              </div>
            </div>

            {active && <ActionBar />}
          </div>
        );
      }

      /* ════════════════════════════════════════════════════════════════════
         PAGE: 客户恢复 (5 区工作台)
         ════════════════════════════════════════════════════════════════════ */
      case 'recovery': {
        type RiskLevel = '高' | '中' | '低';
        type RecoveryStatus = '待介入' | '自动挽回中' | '人工跟进中' | '挽回成功' | '确认流失';

        interface RecoveryCustomer {
          id: string; name: string; tier: string; manager: string;
          riskLevel: RiskLevel; inactiveDays: number; coreSignal: string; status: RecoveryStatus;
          priority: '紧急' | '高' | '普通'; suggestion: string; lastFollowUp: string;
          peakAum: string; currentAum: string; dropPct: string;
          lossReason: string; triggerEvent: string; recoverability: string;
          hasBlacklist: boolean; coolDown: boolean;
          actions: { time: string; method: string; template: string; feedback: string; executor: string; next: string }[];
        }

        const RECOVERY_CUSTOMERS: RecoveryCustomer[] = [
          {
            id: 'rc-01', name: '苏州恒盛精密机械', tier: '高价值核心', manager: '张伟', riskLevel: '高', inactiveDays: 128,
            coreSignal: '额度闲置超90天、连续早偿、竞品活跃', status: '待介入', priority: '紧急',
            suggestion: '立即人工电话关怀+专属提额降息', lastFollowUp: '15天前',
            peakAum: '¥850万', currentAum: '¥120万', dropPct: '-85.9%',
            lossReason: '对利率变动高度敏感，竞品提供更低利率报价', triggerEvent: '近3月提款频次下降80%，最近一次额度续授被延迟',
            recoverability: '挽回价值极高，资金需求仍存在',
            hasBlacklist: false, coolDown: false,
            actions: [
              { time: '03-25', method: '自动短信', template: '利率优惠通知', feedback: '已阅读未响应', executor: '系统', next: '升级人工关怀' },
              { time: '03-18', method: 'APP推送', template: '提额邀请', feedback: '未点击', executor: '系统', next: '尝试短信' },
            ],
          },
          {
            id: 'rc-02', name: '无锡创联电子', tier: '高价值核心', manager: '李婷', riskLevel: '高', inactiveDays: 95,
            coreSignal: '连续3次提款被风控拒绝、客户投诉', status: '人工跟进中', priority: '紧急',
            suggestion: '紧急恢复授信+专属客户经理致歉', lastFollowUp: '3天前',
            peakAum: '¥620万', currentAum: '¥280万', dropPct: '-54.8%',
            lossReason: '连续3次提款被"模型风控"拒绝，客户体验严重受损', triggerEvent: '客户投诉后进入沉睡状态，资金转向外部机构',
            recoverability: '挽回可能性中等，需恢复信任',
            hasBlacklist: false, coolDown: false,
            actions: [
              { time: '04-06', method: '人工电话', template: '致歉关怀话术', feedback: '已接听，表示考虑中', executor: '李婷', next: '48h后跟进' },
              { time: '03-30', method: '企微推送', template: '专属权益包', feedback: '已查看', executor: '系统', next: '跟进反馈' },
            ],
          },
          {
            id: 'rc-03', name: '常熟振华纺织', tier: '中等价值', manager: '王磊', riskLevel: '中', inactiveDays: 72,
            coreSignal: '授信到期未续贷、业务量骤降', status: '自动挽回中', priority: '高',
            suggestion: '发送续贷优惠+免息券', lastFollowUp: '7天前',
            peakAum: '¥350万', currentAum: '¥85万', dropPct: '-75.7%',
            lossReason: '授信到期后未主动续贷，可能无资金需求或转向竞品', triggerEvent: '授信到期+30天无任何业务发生',
            recoverability: '挽回可能性较高，需提供续贷便利',
            hasBlacklist: false, coolDown: false,
            actions: [
              { time: '04-02', method: '自动短信', template: '续贷免手续费', feedback: '未回复', executor: '系统', next: '3天后升级电话' },
            ],
          },
          {
            id: 'rc-04', name: '张家港盛达物流', tier: '中等价值', manager: '赵敏', riskLevel: '低', inactiveDays: 45,
            coreSignal: '用信频率明显下降、额度使用率<10%', status: '自动挽回中', priority: '普通',
            suggestion: '发送促活短信试探', lastFollowUp: '12天前',
            peakAum: '¥280万', currentAum: '¥180万', dropPct: '-35.7%',
            lossReason: '季节性因素，物流淡季资金需求下降', triggerEvent: '连续2期用信不足历史均值30%',
            recoverability: '季节性下降，预计回暖可能性大',
            hasBlacklist: false, coolDown: true,
            actions: [
              { time: '03-28', method: 'APP推送', template: '限时提额活动', feedback: '已领取权益', executor: '系统', next: '观察是否回流' },
            ],
          },
          {
            id: 'rc-05', name: '昆山华鑫模具', tier: '低价值', manager: '陈浩', riskLevel: '高', inactiveDays: 180,
            coreSignal: '贷款已全部结清、无任何互动', status: '确认流失', priority: '普通',
            suggestion: '标记确认流失，释放运营资源', lastFollowUp: '60天前',
            peakAum: '¥150万', currentAum: '¥0', dropPct: '-100%',
            lossReason: '客户明确表示不再使用，已全额结清转向竞品', triggerEvent: '客户主动致电要求注销授信额度',
            recoverability: '挽回可能性极低',
            hasBlacklist: false, coolDown: false,
            actions: [
              { time: '02-10', method: '人工电话', template: '流失挽留话术', feedback: '明确拒绝', executor: '陈浩', next: '关闭跟进' },
            ],
          },
        ];

        const RLVL: Record<RiskLevel, string> = {
          '高': 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]',
          '中': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
          '低': 'bg-[#F0FDF4] text-[#047857] border-[#BBF7D0]',
        };
        const RSTAT: Record<RecoveryStatus, string> = {
          '待介入': 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]',
          '自动挽回中': 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
          '人工跟进中': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
          '挽回成功': 'bg-[#F0FDF4] text-[#047857] border-[#BBF7D0]',
          '确认流失': 'bg-[#F8FAFC] text-[#94A3B8] border-[#E2E8F0]',
        };
        const RPRI: Record<string, string> = {
          '紧急': 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]',
          '高': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
          '普通': 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]',
        };

        const highRiskCount = RECOVERY_CUSTOMERS.filter(c => c.riskLevel === '高' && c.status !== '确认流失').length;
        const highValuePending = RECOVERY_CUSTOMERS.filter(c => c.tier.includes('高价值') && c.status !== '挽回成功' && c.status !== '确认流失').length;
        const inProgress = RECOVERY_CUSTOMERS.filter(c => c.status === '自动挽回中' || c.status === '人工跟进中').length;
        const recovered = RECOVERY_CUSTOMERS.filter(c => c.status === '挽回成功').length;
        const total = RECOVERY_CUSTOMERS.filter(c => c.status !== '确认流失').length;
        const successRate = total > 0 ? Math.round(recovered / total * 100) : 0;

        const filteredRecovery = RECOVERY_CUSTOMERS.filter(c => {
          if (recoveryStatusFilter === 'all') return true;
          return c.status === recoveryStatusFilter;
        });
        const activeRecovery = filteredRecovery.find(c => c.id === selectedRecoveryId) ?? filteredRecovery[0] ?? RECOVERY_CUSTOMERS[0];

        return (
          <div className="space-y-3">
            <div className="flex items-center justify-end gap-2 flex-wrap">
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#BFDBFE] text-[#2563EB]"><RefreshCw size={10} />刷新预警</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#FED7AA] text-[#C2410C]"><Send size={10} />批量派发</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Download size={10} />流失名单</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Eye size={10} />流失规则</Button>
            </div>

            <KpiBar items={[
              { label: '高危预警', value: highRiskCount, hint: '极易发生资产转移', tone: highRiskCount > 0 ? 'risk' : 'muted' },
              { label: '待挽高价值', value: highValuePending, hint: '核心客户需优先抢救', tone: highValuePending > 0 ? 'warn' : 'muted' },
              { label: '挽回执行中', value: inProgress, hint: '自动/人工策略进行中', tone: inProgress > 0 ? 'info' : 'muted' },
              { label: '本期挽回', value: recovered, hint: '重新产生活跃行为', tone: 'normal' },
              { label: '挽回成功率', value: `${successRate}%`, hint: '本周期整体挽回效率', tone: successRate >= 50 ? 'normal' : 'warn' },
            ]} />

            {/* 3-column: list + detail/actions + AI */}
            <div className="grid grid-cols-[220px_1fr_250px] gap-3" style={{ minHeight: 480 }}>

              {/* COL 1: Customer list */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-3 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                  <span className="text-[11px] font-semibold text-[#0F172A]">流失预警与待挽回</span>
                  <p className="text-[9px] text-[#94A3B8] mt-0.5">按价值与优先级排序</p>
                </div>
                <div className="px-2 py-1.5 border-b border-[#F1F5F9]">
                  <select className="h-5 rounded border border-[#E2E8F0] bg-[#F8FAFC] px-1 text-[9px] text-[#334155] w-full" value={recoveryStatusFilter} onChange={e => setRecoveryStatusFilter(e.target.value)}>
                    <option value="all">全部状态</option>
                    <option value="待介入">待介入</option>
                    <option value="自动挽回中">自动挽回中</option>
                    <option value="人工跟进中">人工跟进中</option>
                    <option value="挽回成功">挽回成功</option>
                    <option value="确认流失">确认流失</option>
                  </select>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {filteredRecovery.map(c => {
                    const isActive = activeRecovery?.id === c.id;
                    return (
                      <div key={c.id} onClick={() => setSelectedRecoveryId(c.id)}
                        className={cn('px-3 py-2.5 border-b border-[#F1F5F9] cursor-pointer transition-all', isActive ? 'bg-[#FEF2F2] border-l-2 border-l-[#DC2626]' : 'hover:bg-[#FAFBFF]')}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[10px] font-semibold text-[#0F172A] truncate flex-1">{c.name}</span>
                          <Badge className={cn('text-[7px] border shrink-0 ml-1', RLVL[c.riskLevel])}>{c.riskLevel}危</Badge>
                        </div>
                        <div className="flex items-center gap-1 text-[8px] mb-0.5">
                          <Badge className={cn('text-[7px] border', RSTAT[c.status])}>{c.status}</Badge>
                          <Badge className={cn('text-[7px] border', RPRI[c.priority])}>{c.priority}</Badge>
                        </div>
                        <div className="text-[8px] text-[#94A3B8] mb-0.5">{c.tier} · {c.manager}</div>
                        <div className="text-[8px] text-[#DC2626]">{c.coreSignal}</div>
                        <div className="text-[8px] text-[#94A3B8] mt-0.5">沉睡 {c.inactiveDays} 天 · 跟进 {c.lastFollowUp}</div>
                        <div className="flex items-center gap-1 mt-1">
                          <Button variant="outline" size="sm" className="h-5 text-[7px] px-1 gap-0.5 border-[#FCA5A5] text-[#DC2626]" onClick={e => e.stopPropagation()}>诊断</Button>
                          <Button variant="ghost" size="sm" className="h-5 text-[7px] px-1 text-[#2563EB]" onClick={e => { e.stopPropagation(); }}>挽回</Button>
                          <Button variant="ghost" size="sm" className="h-5 text-[7px] px-1 text-[#64748B]" onClick={e => e.stopPropagation()}><UserCheck size={7} /></Button>
                        </div>
                      </div>
                    );
                  })}
                  {filteredRecovery.length === 0 && (
                    <div className="text-center py-10 text-[9px] text-[#94A3B8] px-3">
                      <p>当前条件下暂无待处理的挽回任务。</p>
                      <p className="mt-1">请跟进"人工跟进中"的客户反馈。</p>
                    </div>
                  )}
                </div>
              </div>

              {/* COL 2: Detail + Actions */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-4 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC] flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#0F172A]">流失诊断与跟进记录</span>
                  <div className="flex items-center gap-1.5">
                    <Badge className={cn('text-[7px] border', RSTAT[activeRecovery.status])}>{activeRecovery.status}</Badge>
                    <Badge className={cn('text-[7px] border', RLVL[activeRecovery.riskLevel])}>{activeRecovery.riskLevel}危</Badge>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                  {/* Value & drop */}
                  <div className="grid grid-cols-2 gap-3 pb-2 border-b border-[#F1F5F9]">
                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">客户</div>
                      <div className="text-[12px] font-semibold text-[#0F172A]">{activeRecovery.name}</div>
                      <div className="text-[9px] text-[#64748B]">{activeRecovery.tier} · {activeRecovery.manager}</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div><div className="text-[8px] text-[#94A3B8]">历史峰值</div><div className="text-[11px] font-bold text-[#0F172A]">{activeRecovery.peakAum}</div></div>
                      <div><div className="text-[8px] text-[#94A3B8]">当前AUM</div><div className="text-[11px] font-bold text-[#DC2626]">{activeRecovery.currentAum}</div></div>
                      <div><div className="text-[8px] text-[#94A3B8]">降幅</div><div className="text-[11px] font-bold text-[#DC2626]">{activeRecovery.dropPct}</div></div>
                    </div>
                  </div>

                  {/* Loss diagnosis */}
                  <div className="border-b border-[#F1F5F9] pb-2">
                    <div className="text-[9px] font-semibold text-[#0F172A] mb-1">AI 流失归因诊断</div>
                    <div className="space-y-1 text-[9px]">
                      <div><span className="text-[#94A3B8]">主要原因</span> <span className="text-[#DC2626]">{activeRecovery.lossReason}</span></div>
                      <div><span className="text-[#94A3B8]">触发事件</span> <span className="text-[#0F172A]">{activeRecovery.triggerEvent}</span></div>
                      <div><span className="text-[#94A3B8]">可挽回评估</span> <span className="text-[#7C3AED] font-medium">{activeRecovery.recoverability}</span></div>
                    </div>
                  </div>

                  {/* Constraints */}
                  <div className="flex items-center gap-3 text-[9px] pb-2 border-b border-[#F1F5F9]">
                    {activeRecovery.hasBlacklist && <span className="text-[#DC2626] font-medium">⚠ 命中黑名单 - 不可挽回</span>}
                    {activeRecovery.coolDown && <span className="text-[#C2410C]">⏳ 防骚扰冷却期</span>}
                    {!activeRecovery.hasBlacklist && !activeRecovery.coolDown && <span className="text-[#047857]">✓ 无风控限制</span>}
                    <span className="text-[#94A3B8]">沉睡 {activeRecovery.inactiveDays} 天</span>
                  </div>

                  {/* Action timeline */}
                  <div className="border-b border-[#F1F5F9] pb-2">
                    <div className="text-[9px] font-semibold text-[#0F172A] mb-1.5">挽回动作轨迹</div>
                    <div className="space-y-2">
                      {activeRecovery.actions.map((a, i) => (
                        <div key={i} className="flex gap-2">
                          <div className="w-[46px] shrink-0 text-[8px] text-[#94A3B8] text-right pt-0.5">{a.time}</div>
                          <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-1.5 shrink-0" />
                          <div className="flex-1 text-[9px]">
                            <div className="flex items-center gap-1.5">
                              <Badge className="text-[7px] bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">{a.method}</Badge>
                              <span className="text-[#64748B]">{a.template}</span>
                              <span className="text-[#94A3B8]">· {a.executor}</span>
                            </div>
                            <div className="text-[#0F172A] mt-0.5">反馈: {a.feedback}</div>
                            <div className="text-[#7C3AED] text-[8px]">下一步: {a.next}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#BFDBFE] text-[#2563EB]" onClick={() => onModuleChange('revenue')}><Zap size={9} />自动挽回</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#FED7AA] text-[#C2410C]"><MessageSquare size={9} />记录跟进</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#BBF7D0] text-[#047857]"><Gift size={9} />申请权益</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]"><Eye size={9} />历史工单</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#BBF7D0] text-[#047857]"><CheckCircle2 size={9} />标记成功</Button>
                  </div>
                </div>
              </div>

              {/* COL 3: AI diagnosis */}
              <div className="space-y-3">
                <div className="rounded-lg border border-[#E2E8F0] bg-white p-3 space-y-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#DC2626] to-[#7C3AED] flex items-center justify-center"><Brain size={10} className="text-white" /></div>
                    <span className="text-[11px] font-semibold text-[#0F172A]">AI 归因与挽回建议</span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">当前判断</div>
                      <p className="text-[10px] text-[#0F172A] leading-4 font-medium">
                        {activeRecovery.status === '确认流失'
                          ? '该客户已明确拒绝或不符合挽回条件，建议结束跟进，释放运营资源。'
                          : activeRecovery.inactiveDays > 100
                            ? `该客户已处于濒临流失状态（闲置超${activeRecovery.inactiveDays}天），常规自动化促活已失效，亟需高优人工介入。`
                            : '该客户处于沉睡初期，仍有较大挽回窗口，建议及时干预。'}
                      </p>
                    </div>

                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">流失归因</div>
                      <p className="text-[9px] text-[#DC2626] leading-4">{activeRecovery.lossReason}</p>
                    </div>

                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">挽回价值</div>
                      <p className="text-[10px] text-[#7C3AED] font-medium">{activeRecovery.recoverability}</p>
                    </div>

                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">主要痛点</div>
                      <p className="text-[9px] text-[#475569] leading-4">{activeRecovery.triggerEvent}</p>
                    </div>

                    {activeRecovery.coolDown && (
                      <div className="rounded bg-[#FFF7ED] border border-[#FED7AA] px-2 py-1.5 text-[9px] text-[#C2410C]">
                        客户处于防骚扰免打扰期，暂不能派发自动化消息动作。
                      </div>
                    )}

                    {activeRecovery.status === '确认流失' ? (
                      <div className="rounded bg-[#F8FAFC] border border-[#E2E8F0] px-2 py-1.5 text-[9px] text-[#64748B]">
                        建议标记确认流失以完善流失模型数据，释放运营资源。
                      </div>
                    ) : (
                      <div>
                        <div className="text-[9px] text-[#94A3B8] mb-0.5">下一步建议</div>
                        <p className="text-[10px] text-[#7C3AED] font-medium leading-4">{activeRecovery.suggestion}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5 pt-1">
                    <Button size="sm" className="h-7 text-[10px] gap-1 bg-[#DC2626] hover:bg-[#B91C1C] text-white w-full"><CheckCircle2 size={10} />采纳建议</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#BFDBFE] text-[#2563EB] w-full" onClick={() => onModuleChange('playbook')}><FileText size={10} />挽回模板</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#FED7AA] text-[#C2410C] w-full"><Phone size={10} />转交人工</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#94A3B8] w-full"><ShieldAlert size={10} />确认流失</Button>
                  </div>
                </div>
              </div>
            </div>

            {active && <ActionBar />}
          </div>
        );
      }

      /* ════════════════════════════════════════════════════════════════════
         PAGE: 经营模板 (5 区工作台)
         ════════════════════════════════════════════════════════════════════ */
      case 'playbook': {
        type TplType = '营销类' | '维护类' | '增收类' | '风险关怀类';
        type TplStatus = '启用' | '停用';

        interface BizTemplate {
          id: string; name: string; code: string; type: TplType; tiers: string;
          product: string; status: TplStatus; description: string;
          useCount: number; convertRate: number; coveredCustomers: number; revenueAdd: string;
          creator: string; org: string; createdAt: string; updatedAt: string;
          targetIndustry: string; targetScale: string; targetRegion: string;
          goal: string; cycle: string;
          actions: { name: string; method: string; order: number; interval: string; script: string }[];
          channels: string[];
        }

        const TPL_LIST: BizTemplate[] = [
          {
            id: 'tpl-01', name: '高价值客户提额+交叉营销', code: 'TPL-2026-001', type: '营销类', tiers: 'L1-L2',
            product: '供应链融资、结算沉淀', status: '启用', description: '面向高价值核心客群，通过提额邀请与供应链产品推荐实现交叉销售',
            useCount: 48, convertRate: 37.5, coveredCustomers: 320, revenueAdd: '¥1,240万',
            creator: '张伟', org: '苏州分行', createdAt: '2026-03-10', updatedAt: '2026-04-05',
            targetIndustry: '制造业、新能源', targetScale: '中小型', targetRegion: '长三角',
            goal: '授信使用率提升≥20%，产品渗透率≥15%', cycle: '周期性（每月）',
            actions: [
              { name: '专属提额邀请推送', method: 'APP推送', order: 1, interval: '立即', script: '尊敬的客户，您的授信额度已可升级至XXX万...' },
              { name: '供应链产品推荐', method: '企微', order: 2, interval: '3天后', script: '基于您的供应链交易特征，为您推荐...' },
              { name: '客户经理跟进回访', method: '电话', order: 3, interval: '7天后', script: '回访确认客户意向，解答疑问...' },
            ],
            channels: ['APP推送', '企微', '电话'],
          },
          {
            id: 'tpl-02', name: '新客首贷破冰引导', code: 'TPL-2026-002', type: '营销类', tiers: 'L3-L4',
            product: '流贷、信用贷', status: '启用', description: '帮助获批未用信的新客户完成首笔贷款，降低操作门槛',
            useCount: 35, convertRate: 18, coveredCustomers: 280, revenueAdd: '¥450万',
            creator: '李婷', org: '无锡分行', createdAt: '2026-03-15', updatedAt: '2026-04-08',
            targetIndustry: '通用', targetScale: '小微', targetRegion: '全区域',
            goal: '首贷转化率≥25%', cycle: '单次',
            actions: [
              { name: '首贷操作指引推送', method: 'APP推送+短信', order: 1, interval: '立即', script: '欢迎使用XX银行，您的授信已批复，首笔操作只需3步...' },
              { name: '人工外呼引导', method: '电话', order: 2, interval: '5天后', script: '确认客户是否遇到操作困难...' },
            ],
            channels: ['APP推送', '短信', '电话'],
          },
          {
            id: 'tpl-03', name: '沉睡客户挽回关怀', code: 'TPL-2026-003', type: '风险关怀类', tiers: 'L1-L2',
            product: '提额降息、免息券', status: '启用', description: '面向高价值沉睡客群，通过专属权益与人工关怀实现流失挽回',
            useCount: 22, convertRate: 12, coveredCustomers: 100, revenueAdd: '¥280万',
            creator: '王磊', org: '常州分行', createdAt: '2026-03-20', updatedAt: '2026-04-10',
            targetIndustry: '制造业、贸易', targetScale: '中型', targetRegion: '长三角',
            goal: '挽回成功率≥15%，重新用信率≥10%', cycle: '单次',
            actions: [
              { name: '利率优惠推送', method: '短信', order: 1, interval: '立即', script: '专属降息优惠，年化低至X.X%...' },
              { name: '免息券发放', method: 'APP推送', order: 2, interval: '2天后', script: '您有一张XXX万免息券待领取...' },
              { name: '客户经理致电关怀', method: '电话', order: 3, interval: '5天后', script: '致歉关怀+了解沉睡原因...' },
            ],
            channels: ['短信', 'APP推送', '电话'],
          },
          {
            id: 'tpl-04', name: '到期续贷提醒', code: 'TPL-2026-004', type: '维护类', tiers: 'L1-L3',
            product: '续贷', status: '启用', description: '授信到期前30天自动触发续贷提醒，减少客户遗忘导致的被动流失',
            useCount: 56, convertRate: 45, coveredCustomers: 220, revenueAdd: '¥680万',
            creator: '赵敏', org: '总行运营', createdAt: '2026-02-28', updatedAt: '2026-04-01',
            targetIndustry: '通用', targetScale: '通用', targetRegion: '全区域',
            goal: '续贷率≥50%', cycle: '周期性（触发式）',
            actions: [
              { name: '到期提醒推送', method: 'APP推送+短信', order: 1, interval: '到期前30天', script: '您的授信将于XX日到期，续贷仅需1步...' },
              { name: '续贷优惠推送', method: '企微', order: 2, interval: '到期前15天', script: '续贷可享手续费减免...' },
            ],
            channels: ['APP推送', '短信', '企微'],
          },
          {
            id: 'tpl-05', name: '稳定客户增值推荐', code: 'TPL-2026-005', type: '增收类', tiers: 'L2-L3',
            product: '理财、存款、结算', status: '停用', description: '向稳定客群推荐增值金融产品，提升客均贡献价值',
            useCount: 15, convertRate: 8, coveredCustomers: 150, revenueAdd: '¥120万',
            creator: '陈浩', org: '苏州分行', createdAt: '2026-03-05', updatedAt: '2026-03-25',
            targetIndustry: '制造业、服务业', targetScale: '中小型', targetRegion: '苏州',
            goal: '产品渗透率≥10%，存款增长≥5%', cycle: '周期性（季度）',
            actions: [
              { name: '增值产品推送', method: 'APP推送', order: 1, interval: '立即', script: '为您精选理财产品，预期收益率X.X%...' },
            ],
            channels: ['APP推送'],
          },
        ];

        const TTYPE: Record<TplType, string> = {
          '营销类': 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
          '维护类': 'bg-[#F0FDF4] text-[#047857] border-[#BBF7D0]',
          '增收类': 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]',
          '风险关怀类': 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]',
        };

        const totalTpl = TPL_LIST.length;
        const enabledTpl = TPL_LIST.filter(t => t.status === '启用').length;
        const monthUse = TPL_LIST.reduce((s, t) => s + t.useCount, 0);
        const totalCovered = TPL_LIST.reduce((s, t) => s + t.coveredCustomers, 0);
        const avgConvert = Math.round(TPL_LIST.filter(t => t.status === '启用').reduce((s, t) => s + t.convertRate, 0) / enabledTpl);

        const filteredTpl = TPL_LIST.filter(t => {
          if (templateTypeFilter === 'all') return true;
          return t.type === templateTypeFilter;
        });
        const activeTpl = filteredTpl.find(t => t.id === selectedTemplateId) ?? filteredTpl[0] ?? TPL_LIST[0];

        return (
          <div className="space-y-3">
            <div className="flex items-center justify-end gap-2 flex-wrap">
              <Button size="sm" className="h-7 text-[10px] gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white"><Plus size={10} />新建模板</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#BFDBFE] text-[#2563EB]"><RefreshCw size={10} />刷新</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Download size={10} />导出</Button>
            </div>

            <KpiBar items={[
              { label: '模板总数', value: totalTpl, hint: '已创建的模板数量', tone: 'info' },
              { label: '启用模板', value: enabledTpl, hint: '正在生效中', tone: 'normal' },
              { label: '本月使用', value: monthUse, hint: '被调用生成任务次数', tone: 'info' },
              { label: '覆盖客户', value: totalCovered, hint: '模板触达客户总量', tone: 'info' },
              { label: '平均转化率', value: `${Number.isFinite(avgConvert) ? avgConvert : 0}%`, hint: '启用模板综合转化', tone: 'normal' },
            ]} />

            {/* 3-column: list + detail + eval/AI */}
            <div className="grid grid-cols-[220px_1fr_250px] gap-3" style={{ minHeight: 480 }}>

              {/* COL 1: Template list */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-3 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                  <span className="text-[11px] font-semibold text-[#0F172A]">模板列表</span>
                  <p className="text-[9px] text-[#94A3B8] mt-0.5">管理与复用经营策略</p>
                </div>
                <div className="px-2 py-1.5 border-b border-[#F1F5F9]">
                  <select className="h-5 rounded border border-[#E2E8F0] bg-[#F8FAFC] px-1 text-[9px] text-[#334155] w-full" value={templateTypeFilter} onChange={e => setTemplateTypeFilter(e.target.value)}>
                    <option value="all">全部类型</option>
                    <option value="营销类">营销类</option>
                    <option value="维护类">维护类</option>
                    <option value="增收类">增收类</option>
                    <option value="风险关怀类">风险关怀类</option>
                  </select>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {filteredTpl.map(t => {
                    const isAct = activeTpl?.id === t.id;
                    return (
                      <div key={t.id} onClick={() => setSelectedTemplateId(t.id)}
                        className={cn('px-3 py-2.5 border-b border-[#F1F5F9] cursor-pointer transition-all', isAct ? 'bg-[#EFF6FF] border-l-2 border-l-[#2563EB]' : 'hover:bg-[#FAFBFF]')}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[10px] font-semibold text-[#0F172A] truncate flex-1">{t.name}</span>
                          <Badge className={cn('text-[7px] border shrink-0 ml-1', t.status === '启用' ? 'bg-[#F0FDF4] text-[#047857] border-[#BBF7D0]' : 'bg-[#F8FAFC] text-[#94A3B8] border-[#E2E8F0]')}>{t.status}</Badge>
                        </div>
                        <div className="flex items-center gap-1 text-[8px] mb-0.5">
                          <Badge className={cn('text-[7px] border', TTYPE[t.type])}>{t.type}</Badge>
                          <span className="text-[#94A3B8]">{t.tiers}</span>
                          <span className="text-[#94A3B8]">{t.code}</span>
                        </div>
                        <div className="flex items-center gap-2 text-[8px] text-[#64748B]">
                          <span>使用 {t.useCount} 次</span>
                          <span>转化 {t.convertRate}%</span>
                          <span className="text-[#047857]">{t.revenueAdd}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Button variant="outline" size="sm" className="h-5 text-[7px] px-1 gap-0.5 border-[#BFDBFE] text-[#2563EB]" onClick={e => e.stopPropagation()}>查看</Button>
                          <Button variant="ghost" size="sm" className="h-5 text-[7px] px-1 text-[#047857]" onClick={e => { e.stopPropagation(); onModuleChange('revenue'); }}>生成任务</Button>
                          <Button variant="ghost" size="sm" className="h-5 text-[7px] px-1 text-[#64748B]" onClick={e => e.stopPropagation()}><Edit size={7} /></Button>
                        </div>
                      </div>
                    );
                  })}
                  {filteredTpl.length === 0 && (
                    <div className="text-center py-10 text-[9px] text-[#94A3B8] px-3">
                      <p>暂无经营模板。</p>
                      <p className="mt-1">建议新建模板开始您的客户运营。</p>
                    </div>
                  )}
                </div>
              </div>

              {/* COL 2: Detail drawer */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-4 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC] flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#0F172A]">模板详情</span>
                  <div className="flex items-center gap-1.5">
                    <Badge className={cn('text-[7px] border', TTYPE[activeTpl.type])}>{activeTpl.type}</Badge>
                    <Badge className={cn('text-[7px] border', activeTpl.status === '启用' ? 'bg-[#F0FDF4] text-[#047857] border-[#BBF7D0]' : 'bg-[#F8FAFC] text-[#94A3B8] border-[#E2E8F0]')}>{activeTpl.status}</Badge>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                  {/* Basic info */}
                  <div className="grid grid-cols-3 gap-x-4 gap-y-1 text-[9px] pb-2 border-b border-[#F1F5F9]">
                    <div className="col-span-2"><span className="text-[#94A3B8]">名称</span> <span className="text-[#0F172A] font-medium">{activeTpl.name}</span></div>
                    <div><span className="text-[#94A3B8]">编号</span> <span className="text-[#0F172A]">{activeTpl.code}</span></div>
                    <div><span className="text-[#94A3B8]">层级</span> <span className="text-[#0F172A]">{activeTpl.tiers}</span></div>
                    <div><span className="text-[#94A3B8]">产品</span> <span className="text-[#0F172A]">{activeTpl.product}</span></div>
                    <div><span className="text-[#94A3B8]">周期</span> <span className="text-[#0F172A]">{activeTpl.cycle}</span></div>
                    <div className="col-span-3"><span className="text-[#94A3B8]">描述</span> <span className="text-[#0F172A]">{activeTpl.description}</span></div>
                    <div><span className="text-[#94A3B8]">创建</span> <span className="text-[#64748B]">{activeTpl.creator} · {activeTpl.org}</span></div>
                    <div><span className="text-[#94A3B8]">创建日</span> <span className="text-[#64748B]">{activeTpl.createdAt}</span></div>
                    <div><span className="text-[#94A3B8]">更新日</span> <span className="text-[#64748B]">{activeTpl.updatedAt}</span></div>
                  </div>

                  {/* Target */}
                  <div className="border-b border-[#F1F5F9] pb-2">
                    <div className="text-[9px] font-semibold text-[#0F172A] mb-1">适用客户</div>
                    <div className="grid grid-cols-3 gap-x-3 gap-y-1 text-[9px]">
                      <div><span className="text-[#94A3B8]">行业</span> <span className="text-[#0F172A]">{activeTpl.targetIndustry}</span></div>
                      <div><span className="text-[#94A3B8]">规模</span> <span className="text-[#0F172A]">{activeTpl.targetScale}</span></div>
                      <div><span className="text-[#94A3B8]">区域</span> <span className="text-[#0F172A]">{activeTpl.targetRegion}</span></div>
                    </div>
                  </div>

                  {/* Goal */}
                  <div className="border-b border-[#F1F5F9] pb-2">
                    <div className="text-[9px] font-semibold text-[#0F172A] mb-1">经营目标</div>
                    <p className="text-[9px] text-[#7C3AED]">{activeTpl.goal}</p>
                  </div>

                  {/* Actions */}
                  <div className="border-b border-[#F1F5F9] pb-2">
                    <div className="text-[9px] font-semibold text-[#0F172A] mb-1.5">执行动作 ({activeTpl.actions.length} 步)</div>
                    <div className="space-y-2">
                      {activeTpl.actions.map((a, i) => (
                        <div key={i} className="flex gap-2">
                          <div className="w-5 h-5 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center text-[8px] font-bold shrink-0 mt-0.5">{a.order}</div>
                          <div className="flex-1">
                            <div className="flex items-center gap-1.5 text-[9px]">
                              <span className="font-medium text-[#0F172A]">{a.name}</span>
                              <Badge className="text-[7px] bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]">{a.method}</Badge>
                              <span className="text-[#94A3B8]">{a.interval}</span>
                            </div>
                            <p className="text-[8px] text-[#64748B] mt-0.5 line-clamp-2">{a.script}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Channels */}
                  <div className="border-b border-[#F1F5F9] pb-2">
                    <div className="text-[9px] font-semibold text-[#0F172A] mb-1">触达方式</div>
                    <div className="flex items-center gap-1">
                      {activeTpl.channels.map(ch => (
                        <Badge key={ch} className="text-[7px] bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0]">{ch}</Badge>
                      ))}
                    </div>
                  </div>

                  {/* Performance */}
                  <div className="border-b border-[#F1F5F9] pb-2">
                    <div className="text-[9px] font-semibold text-[#0F172A] mb-1">效果指标</div>
                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { label: '使用次数', value: `${activeTpl.useCount}`, color: '#2563EB' },
                        { label: '覆盖客户', value: `${activeTpl.coveredCustomers}`, color: '#2563EB' },
                        { label: '转化率', value: `${activeTpl.convertRate}%`, color: activeTpl.convertRate >= 25 ? '#047857' : activeTpl.convertRate >= 10 ? '#2563EB' : '#DC2626' },
                        { label: '收入贡献', value: activeTpl.revenueAdd, color: '#047857' },
                      ].map(m => (
                        <div key={m.label}>
                          <div className="text-[8px] text-[#94A3B8]">{m.label}</div>
                          <div className="text-[12px] font-bold" style={{ color: m.color }}>{m.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#BFDBFE] text-[#2563EB]"><Edit size={9} />编辑</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#BBF7D0] text-[#047857]" onClick={() => onModuleChange('revenue')}><Send size={9} />生成任务</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]"><Package size={9} />复制</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]">
                      <Power size={9} />{activeTpl.status === '启用' ? '停用' : '启用'}
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 text-[9px] gap-1 text-[#DC2626]"><Trash2 size={9} />删除</Button>
                  </div>
                </div>
              </div>

              {/* COL 3: Eval + AI */}
              <div className="space-y-3">
                {/* Evaluation */}
                <div className="rounded-lg border border-[#E2E8F0] bg-white p-3 space-y-2">
                  <div className="text-[11px] font-semibold text-[#0F172A]">效果评估</div>
                  <div className="space-y-1.5">
                    {[
                      { label: '使用趋势', desc: activeTpl.useCount > 30 ? '持续增长，复用度高' : '使用较少，待推广', color: activeTpl.useCount > 30 ? '#047857' : '#C2410C' },
                      { label: '客户覆盖', desc: `覆盖 ${activeTpl.coveredCustomers} 客户，${activeTpl.tiers} 层级`, color: '#2563EB' },
                      { label: '转化效果', desc: activeTpl.convertRate >= 25 ? '转化率优秀' : activeTpl.convertRate >= 10 ? '转化率中等' : '转化率偏低', color: activeTpl.convertRate >= 25 ? '#047857' : activeTpl.convertRate >= 10 ? '#2563EB' : '#DC2626' },
                      { label: '收入贡献', desc: activeTpl.revenueAdd, color: '#047857' },
                    ].map(e => (
                      <div key={e.label} className="flex items-center justify-between text-[9px]">
                        <span className="text-[#94A3B8]">{e.label}</span>
                        <span className="font-medium" style={{ color: e.color }}>{e.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI insights */}
                <div className="rounded-lg border border-[#E2E8F0] bg-white p-3 space-y-2.5">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#7C3AED] to-[#2563EB] flex items-center justify-center"><Brain size={10} className="text-white" /></div>
                    <span className="text-[11px] font-semibold text-[#0F172A]">AI 优化建议</span>
                  </div>

                  <div className="space-y-2">
                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">模板评价</div>
                      <p className="text-[10px] text-[#0F172A] leading-4 font-medium">
                        {activeTpl.convertRate >= 25
                          ? '该模板 ROI 极佳，建议持续复用并扩展至相似客群。'
                          : activeTpl.convertRate >= 10
                            ? '该模板表现中等，建议优化触达渠道或权益内容。'
                            : activeTpl.status === '停用'
                              ? '该模板已停用且转化率偏低，建议优化后重新评估。'
                              : '该模板转化率偏低，建议检查权益吸引力与目标客群匹配度。'}
                      </p>
                    </div>

                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">优化方向</div>
                      <p className="text-[9px] text-[#7C3AED] leading-4">
                        {activeTpl.convertRate >= 25
                          ? '复制该模板应用于其他相似客群，或增加执行动作步骤提升深度转化。'
                          : activeTpl.actions.length <= 2
                            ? '当前动作步骤较少，建议增加多轮触达以提升客户响应率。'
                            : '建议调整权益内容或更换触达渠道（如企微替代短信）。'}
                      </p>
                    </div>

                    <div>
                      <div className="text-[9px] text-[#94A3B8] mb-0.5">关联建议</div>
                      <p className="text-[10px] text-[#475569]">
                        {activeTpl.type === '风险关怀类' ? '建议关联客户恢复流程' : activeTpl.type === '营销类' ? '建议关联客户分层扩展客群' : '建议关联经营动作生成任务'}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 pt-1">
                    <Button size="sm" className="h-7 text-[10px] gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white w-full" onClick={() => onModuleChange('revenue')}><Send size={10} />生成经营任务</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569] w-full" onClick={() => onModuleChange('layers')}><Layers size={10} />关联客户分层</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#FCA5A5] text-[#DC2626] w-full" onClick={() => onModuleChange('recovery')}><RefreshCw size={10} />关联客户恢复</Button>
                    <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#BBF7D0] text-[#047857] w-full"><Zap size={10} />AI 一键优化</Button>
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
