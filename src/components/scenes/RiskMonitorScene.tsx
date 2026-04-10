import React from 'react';
import SceneLayout from '../SceneLayout';
import { SCENES } from '../../constants';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  ArrowRight,
  Bell,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Edit,
  Eye,
  FileText,
  Loader2,
  Plus,
  Power,
  Search,
  Send,
  Settings,
  ShieldAlert,
  Trash2,
  TrendingDown,
  TrendingUp,
  XCircle,
} from 'lucide-react';
import {
  PageHeader,
  WorkbenchPanel,
  MetricCard,
  FlowRow,
  MiniTrend,
  InsightStrip,
  AiNote,
  ActionQueueCard,
} from '../ProductPrimitives';
import { useDemo } from '../../demo/DemoContext';
import { ActionBar } from '../../demo/DemoComponents';
import { SAMPLES } from '../../demo/chainLoan/data';
import { TrendLineChart, DonutChart, DistributionBarChart, CHART_COLORS } from '../Charts';
import { cn } from '@/lib/utils';

/* ══════════════════════════════════════════════════════════════════════════
   Static data for the scene
   ══════════════════════════════════════════════════════════════════════════ */

const MONITORING_RULES = [
  { id: 'mr-01', name: '逾期 15 天以上触发预警', type: '逾期' as const, threshold: '15 天', trigger: '连续 1 次', status: '启用' as const, hitRate: '6.2%', hitCount: 50, lastTriggered: '2小时前' },
  { id: 'mr-02', name: '还款金额下降 30% 触发预警', type: '还款异常' as const, threshold: '30%', trigger: '连续 2 个月', status: '启用' as const, hitRate: '3.8%', hitCount: 20, lastTriggered: '1天前' },
  { id: 'mr-03', name: '对公账户连续 3 周净流出', type: '流水异常' as const, threshold: '3 周', trigger: '连续 3 周', status: '启用' as const, hitRate: '2.1%', hitCount: 12, lastTriggered: '3天前' },
  { id: 'mr-04', name: '物流签收延迟 ≥ 3 笔/10天', type: '流水异常' as const, threshold: '3 笔/10天', trigger: '10 天窗口', status: '启用' as const, hitRate: '1.5%', hitCount: 8, lastTriggered: '5天前' },
  { id: 'mr-05', name: '单一客户集中度 > 55%', type: '还款异常' as const, threshold: '55%', trigger: '月度快照', status: '启用' as const, hitRate: '4.0%', hitCount: 14, lastTriggered: '2天前' },
  { id: 'mr-06', name: '连续 2 个月未开票', type: '流水异常' as const, threshold: '2 个月', trigger: '连续 2 月', status: '禁用' as const, hitRate: '0.8%', hitCount: 3, lastTriggered: '2周前' },
  { id: 'mr-07', name: '回款周期拉长 > 40%', type: '逾期' as const, threshold: '40%', trigger: '连续 1 次', status: '启用' as const, hitRate: '5.5%', hitCount: 28, lastTriggered: '6小时前' },
  { id: 'mr-08', name: '授信使用率骤降 > 50%', type: '流水异常' as const, threshold: '50%', trigger: '连续 1 月', status: '启用' as const, hitRate: '1.2%', hitCount: 5, lastTriggered: '1周前' },
];

const DISPOSAL_TASKS = [
  { id: 'dt-01', name: '瑞泰新能源材料', reason: '逾期 18 天 + 物流延迟', status: '待处理' as const, priority: '高' as const, dueDate: '2026-04-10', manager: '王敏', template: '逾期催收通知' },
  { id: 'dt-02', name: '王子新材料', reason: '连续 4 周净流出', status: '待处理' as const, priority: '高' as const, dueDate: '2026-04-10', manager: '陈立', template: '异常排查通知' },
  { id: 'dt-03', name: '新宙邦科技', reason: '客户集中度偏高 62%', status: '处理中' as const, priority: '中' as const, dueDate: '2026-04-12', manager: '李雪婷', template: '额度调整通知' },
  { id: 'dt-04', name: '驰远物流服务', reason: '运单频次近期下降', status: '处理中' as const, priority: '中' as const, dueDate: '2026-04-13', manager: '王敏', template: '履约排查通知' },
  { id: 'dt-05', name: '裕同包装科技', reason: '到期前 7 天预提醒', status: '待处理' as const, priority: '低' as const, dueDate: '2026-04-15', manager: '张三', template: '到期提醒通知' },
  { id: 'dt-06', name: '佳利包装', reason: '证据覆盖率不足', status: '已完成' as const, priority: '低' as const, dueDate: '2026-04-05', manager: '张三', template: '补充材料通知' },
  { id: 'dt-07', name: '科陆储能技术', reason: '到期前 15 天预提醒', status: '已完成' as const, priority: '低' as const, dueDate: '2026-04-01', manager: '李雪婷', template: '到期提醒通知' },
];

const RULE_EFFECT_DATA = [
  { name: '逾期 15 天', triggers: 50, conversion: 60, accuracy: 71 },
  { name: '还款下降 30%', triggers: 20, conversion: 40, accuracy: 55 },
  { name: '净流出 3 周', triggers: 12, conversion: 58, accuracy: 68 },
  { name: '物流延迟', triggers: 8, conversion: 50, accuracy: 52 },
  { name: '集中度 > 55%', triggers: 14, conversion: 45, accuracy: 63 },
  { name: '回款拉长 40%', triggers: 28, conversion: 65, accuracy: 78 },
  { name: '授信使用骤降', triggers: 5, conversion: 30, accuracy: 42 },
];

const TREND_7D = [
  { name: '4/4', rate: 4.1 },
  { name: '4/5', rate: 4.2 },
  { name: '4/6', rate: 4.3 },
  { name: '4/7', rate: 4.2 },
  { name: '4/8', rate: 4.4 },
  { name: '4/9', rate: 4.5 },
  { name: '4/10', rate: 4.5 },
];

const STATUS_TASK_STYLE = {
  '待处理': { bg: 'bg-[#FEF2F2]', text: 'text-[#DC2626]', border: 'border-[#FCA5A5]' },
  '处理中': { bg: 'bg-[#FFF7ED]', text: 'text-[#C2410C]', border: 'border-[#FED7AA]' },
  '已完成': { bg: 'bg-[#ECFDF3]', text: 'text-[#047857]', border: 'border-[#A7F3D0]' },
};

/* ══════════════════════════════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════════════════════════════ */

interface Props { activeModule: string; onModuleChange: (id: string) => void }

export default function RiskMonitorScene({ activeModule, onModuleChange }: Props) {
  const scene = SCENES.find(s => s.id === 'risk-monitor')!;
  const { active, riskSimulated, currentSample, selectSample, selectedSampleId } = useDemo();

  const [taskStatusFilter, setTaskStatusFilter] = React.useState('all');
  const [effectRange, setEffectRange] = React.useState('30');

  const filteredTasks = DISPOSAL_TASKS.filter(t => taskStatusFilter === 'all' || t.status === taskStatusFilter);

  const renderContent = () => {
    switch (activeModule) {

      /* ════════════════════════════════════════════════════════════════════
         PAGE 1: 预警总览 (DEFAULT)
         ════════════════════════════════════════════════════════════════════ */
      case 'warning':
      default:
        return (
          <div className="space-y-4">
            {/* Header */}
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShieldAlert size={14} className="text-[#DC2626]" />
                <span className="text-[13px] font-semibold text-[#0F172A]">预警总览</span>
                <span className="text-[11px] text-[#94A3B8]">数据口径: 全量 · 截至 {new Date().toLocaleDateString('zh-CN')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 text-[#DC2626] border-[#FCA5A5]" onClick={() => onModuleChange('signals')}>
                  <Eye size={10} /> 查看风险资产
                </Button>
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 text-[#2563EB] border-[#BFDBFE]" onClick={() => onModuleChange('signals')}>
                  <Settings size={10} /> 设置预警规则
                </Button>
              </div>
            </div>

            {/* Stats cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricCard label="风险资产" value="50 户" detail="占在营比 4.5%" tone="red" />
              <MetricCard label="逾期率" value="4.5%" detail="+0.2% 近 7 天" tone="amber" />
              <MetricCard label="高风险" value="5 户" detail="需紧急介入" tone="red" />
              <MetricCard label="待处置任务" value={`${DISPOSAL_TASKS.filter(t => t.status === '待处理').length} 个`} detail="含高优先级" tone="amber" />
            </div>

            {/* Risk level distribution (donut) + overdue trend (line) */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 space-y-3">
                <div className="text-[13px] font-semibold text-[#0F172A]">风险等级分布</div>
                <div className="grid grid-cols-[1fr_1fr] gap-4 items-center">
                  <DonutChart
                    data={[
                      { name: '低风险', value: 30, color: CHART_COLORS.emerald },
                      { name: '中风险', value: 15, color: CHART_COLORS.amber },
                      { name: '高风险', value: 5, color: CHART_COLORS.red },
                    ]}
                    height={160}
                    innerRadius={40}
                    outerRadius={62}
                    centerLabel="风险户"
                    centerValue="50"
                  />
                  <div className="space-y-3">
                    {[
                      { label: '低风险', count: 30, pct: '60%', color: CHART_COLORS.emerald, dots: 5 },
                      { label: '中风险', count: 15, pct: '30%', color: CHART_COLORS.amber, dots: 3 },
                      { label: '高风险', count: 5, pct: '10%', color: CHART_COLORS.red, dots: 1 },
                    ].map(r => (
                      <div key={r.label} className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: r.color }} />
                        <span className="text-[11px] text-[#64748B] flex-1">{r.label}</span>
                        <span className="text-[12px] font-semibold text-[#0F172A]">{r.count} 户</span>
                        <span className="text-[10px] text-[#94A3B8]">{r.pct}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 space-y-3">
                <div className="text-[13px] font-semibold text-[#0F172A]">逾期率趋势（近 7 天）</div>
                <TrendLineChart
                  data={TREND_7D.map(d => ({ name: d.name, actual: d.rate, threshold: 5 }))}
                  lines={[
                    { key: 'actual', color: CHART_COLORS.red, label: '逾期率 (%)' },
                    { key: 'threshold', color: CHART_COLORS.amber, label: '阈值线', dashed: true },
                  ]}
                  height={160}
                />
              </div>
            </div>

            {/* Risk level trend line chart (30 day) */}
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 space-y-3">
              <div className="text-[13px] font-semibold text-[#0F172A]">风险等级变化趋势（近 30 天）</div>
              <TrendLineChart
                data={[
                  { name: '第 1 周', low: 28, mid: 12, high: 3 },
                  { name: '第 2 周', low: 29, mid: 13, high: 4 },
                  { name: '第 3 周', low: 30, mid: 14, high: 4 },
                  { name: '第 4 周', low: 30, mid: 15, high: 5 },
                ]}
                lines={[
                  { key: 'low', color: CHART_COLORS.emerald, label: '低风险' },
                  { key: 'mid', color: CHART_COLORS.amber, label: '中风险' },
                  { key: 'high', color: CHART_COLORS.red, label: '高风险' },
                ]}
                height={180}
              />
            </div>

            {/* Risk watch list */}
            <WorkbenchPanel title="风险关注清单" badge={<Badge className="bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] text-[10px]">{SAMPLES.filter(s => s.riskFlags.length > 0).length} 家关注</Badge>}>
              <div className="divide-y divide-[#F1F5F9]">
                {SAMPLES.filter(s => s.riskFlags.length > 0).map(s => (
                  <button key={s.id} onClick={() => selectSample(s.id)} className={cn('w-full flex items-center justify-between py-2.5 px-2 -mx-2 text-left rounded-lg transition-colors', s.id === selectedSampleId ? 'bg-[#EFF6FF]' : 'hover:bg-[#F8FAFC]')}>
                    <div className="min-w-0">
                      <div className={cn('text-[12px] font-medium truncate', s.id === selectedSampleId ? 'text-[#2563EB]' : 'text-[#0F172A]')}>{s.shortName}</div>
                      <div className="text-[10px] text-[#94A3B8]">{s.roleInChain} · {s.riskFlags.join('、')}</div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className={cn('text-[9px] border', s.riskStatus === '中度预警' ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]' : s.riskStatus === '观察' ? 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]' : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]')}>{s.riskStatus}</Badge>
                      <span className="text-[11px] font-medium text-[#0F172A]">{s.currentLimit}</span>
                    </div>
                  </button>
                ))}
              </div>
            </WorkbenchPanel>

            {active && <ActionBar />}
          </div>
        );

      /* ════════════════════════════════════════════════════════════════════
         PAGE 2: 监控指标 (Rule Engine)
         ════════════════════════════════════════════════════════════════════ */
      case 'signals':
        return (
          <div className="space-y-4">
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings size={14} className="text-[#2563EB]" />
                <span className="text-[13px] font-semibold text-[#0F172A]">监控指标</span>
                <span className="text-[11px] text-[#94A3B8]">共 {MONITORING_RULES.length} 条规则</span>
              </div>
              <Button size="sm" className="h-7 text-[10px] gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white">
                <Plus size={10} /> 添加规则
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricCard label="启用规则" value={`${MONITORING_RULES.filter(r => r.status === '启用').length} 条`} detail="正在生效" tone="green" />
              <MetricCard label="禁用规则" value={`${MONITORING_RULES.filter(r => r.status === '禁用').length} 条`} detail="暂停监控" tone="slate" />
              <MetricCard label="本月总触发" value={`${MONITORING_RULES.reduce((s, r) => s + r.hitCount, 0)} 次`} detail="所有启用规则" tone="amber" />
              <MetricCard label="平均命中率" value={`${(MONITORING_RULES.reduce((s, r) => s + parseFloat(r.hitRate), 0) / MONITORING_RULES.length).toFixed(1)}%`} detail="基于在营资产" tone="blue" />
            </div>

            {/* Rule table */}
            <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
              <div className="grid grid-cols-[1fr_80px_100px_80px_70px_80px_100px] gap-0 px-4 py-2.5 border-b border-[#E2E8F0] bg-[#F8FAFC] text-[10px] font-medium text-[#94A3B8] uppercase tracking-wider">
                <div>规则名称</div><div>阈值</div><div>触发条件</div><div>状态</div><div>命中率</div><div>触发次数</div><div>操作</div>
              </div>
              {MONITORING_RULES.map(rule => (
                <div key={rule.id} className="grid grid-cols-[1fr_80px_100px_80px_70px_80px_100px] gap-0 px-4 py-3 border-b border-[#F1F5F9] last:border-b-0 items-center hover:bg-[#FAFBFF] transition-colors">
                  <div>
                    <div className="text-[12px] font-medium text-[#0F172A]">{rule.name}</div>
                    <div className="text-[10px] text-[#94A3B8] mt-0.5">类型: {rule.type} · 最近触发: {rule.lastTriggered}</div>
                  </div>
                  <div className="text-[11px] font-mono text-[#334155]">{rule.threshold}</div>
                  <div className="text-[11px] text-[#64748B]">{rule.trigger}</div>
                  <div>
                    <Badge className={cn('text-[9px] border', rule.status === '启用' ? 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]' : 'bg-[#F8FAFC] text-[#94A3B8] border-[#E2E8F0]')}>
                      {rule.status === '启用' ? <><Power size={8} className="mr-0.5" /> 启用</> : '禁用'}
                    </Badge>
                  </div>
                  <div className="text-[11px] font-semibold text-[#0F172A]">{rule.hitRate}</div>
                  <div className="text-[11px] text-[#64748B]">{rule.hitCount} 次/月</div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" className="h-6 text-[10px] px-1.5 text-[#2563EB]"><Edit size={10} /></Button>
                    <Button variant="ghost" size="sm" className="h-6 text-[10px] px-1.5 text-[#94A3B8]"><Trash2 size={10} /></Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add rule hint */}
            <div className="rounded-lg border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-4 text-center">
              <div className="text-[11px] text-[#94A3B8]">点击"添加规则"可配置新的监控指标</div>
              <div className="mt-1 text-[10px] text-[#CBD5E1]">支持逾期、还款异常、流水异常等多种规则类型 · 配置阈值和触发条件后即时生效</div>
            </div>

            {active && <ActionBar />}
          </div>
        );

      /* ════════════════════════════════════════════════════════════════════
         PAGE 3: 处置动作 (Disposal Tasks)
         ════════════════════════════════════════════════════════════════════ */
      case 'actions':
        return (
          <div className="space-y-4">
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle size={14} className="text-[#C2410C]" />
                <span className="text-[13px] font-semibold text-[#0F172A]">处置任务下发</span>
                <span className="text-[11px] text-[#94A3B8]">共 {DISPOSAL_TASKS.length} 个任务</span>
              </div>
              <Button variant="ghost" size="sm" className="h-7 text-[10px] text-[#64748B] gap-1"><Search size={10} /> 搜索</Button>
            </div>

            {/* Architecture boundary notice */}
            <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-2.5 flex items-center gap-2 text-[11px] text-[#94A3B8]">
              <Send size={12} className="shrink-0" />
              <span>本系统仅生成处置策略与任务，实际催收触达（短信/电话/企微）由 CRM 系统或客服平台执行并留痕。</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricCard label="待下发" value={`${DISPOSAL_TASKS.filter(t => t.status === '待处理').length} 个`} detail="含高优先级" tone="red" />
              <MetricCard label="已推送CRM" value={`${DISPOSAL_TASKS.filter(t => t.status === '处理中').length} 个`} detail="CRM跟进中" tone="amber" />
              <MetricCard label="CRM已完成" value={`${DISPOSAL_TASKS.filter(t => t.status === '已完成').length} 个`} detail="近 30 天" tone="green" />
              <MetricCard label="平均处置时长" value="2.4 天" detail="从下发到CRM反馈完成" tone="blue" />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_260px] gap-4">
              {/* Left: Task list */}
              <div className="space-y-3">
                {/* Filter bar */}
                <div className="flex items-center gap-2">
                  {[
                    { value: 'all', label: '全部' },
                    { value: '待处理', label: '待下发' },
                    { value: '处理中', label: '已推送CRM' },
                    { value: '已完成', label: 'CRM已完成' },
                  ].map(opt => (
                    <button key={opt.value} onClick={() => setTaskStatusFilter(opt.value)} className={cn('px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors border', taskStatusFilter === opt.value ? 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]' : 'text-[#64748B] border-[#E2E8F0] hover:bg-[#F8FAFC]')}>
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Task cards */}
                <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
                  {filteredTasks.map(task => {
                    const st = STATUS_TASK_STYLE[task.status];
                    return (
                      <div key={task.id} className="px-4 py-3 border-b border-[#F1F5F9] last:border-b-0 hover:bg-[#FAFBFF] transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge className={cn('text-[9px] border', st.bg, st.text, st.border)}>
                              {task.status === '待处理' ? <Clock size={8} className="mr-0.5" /> : task.status === '处理中' ? <Loader2 size={8} className="mr-0.5" /> : <CheckCircle2 size={8} className="mr-0.5" />}
                              {task.status === '待处理' ? '待下发' : task.status === '处理中' ? '已推送CRM' : 'CRM已完成'}
                            </Badge>
                            <span className="text-[12px] font-medium text-[#0F172A]">{task.name}</span>
                            {task.priority === '高' && <Badge className="bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5] text-[9px]">高优</Badge>}
                          </div>
                          <span className="text-[10px] text-[#94A3B8]">{task.manager} · 截止 {task.dueDate}</span>
                        </div>
                        <div className="mt-1.5 text-[11px] text-[#64748B]">原因: {task.reason}</div>
                        <div className="mt-2 flex items-center gap-2">
                          {task.status === '待处理' && (
                            <>
                              <Button variant="outline" size="sm" className="h-6 text-[10px] px-2 gap-1 text-[#DC2626] border-[#FCA5A5]"><Send size={9} /> 生成催收任务推送CRM</Button>
                              <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2 gap-1 text-[#64748B]"><Eye size={9} /> 查看详情</Button>
                            </>
                          )}
                          {task.status === '处理中' && (
                            <div className="flex items-center gap-2">
                              <Badge className="bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE] text-[9px]">已为{task.manager}在CRM创建催收跟进任务</Badge>
                              <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2 gap-1 text-[#64748B]"><Eye size={9} /> 查看详情</Button>
                            </div>
                          )}
                          {task.status === '已完成' && (
                            <div className="flex items-center gap-2">
                              <Badge className="bg-[#ECFDF3] text-[#047857] border-[#A7F3D0] text-[9px]">CRM反馈: 处置完成</Badge>
                              <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2 gap-1 text-[#64748B]"><Eye size={9} /> 查看详情</Button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {filteredTasks.length === 0 && <div className="text-center py-10 text-[#94A3B8] text-xs">无匹配任务</div>}
                </div>
              </div>

              {/* Right: Task template & dispatch panel */}
              <div className="space-y-4">
                <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 space-y-3">
                  <div className="text-[12px] font-semibold text-[#0F172A]">任务模板（推送至CRM/企微）</div>
                  {[
                    { name: '逾期催收跟进', desc: '生成CRM催收跟进任务', target: '→ CRM' },
                    { name: '异常排查跟进', desc: '生成CRM异常排查任务', target: '→ CRM' },
                    { name: '额度调整通知', desc: '生成企微通知任务', target: '→ 企微' },
                    { name: '到期提醒跟进', desc: '生成CRM到期跟进任务', target: '→ CRM' },
                  ].map(t => (
                    <div key={t.name} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5 hover:bg-[#EFF6FF] transition-colors cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <FileText size={10} className="text-[#64748B]" />
                          <span className="text-[11px] font-medium text-[#0F172A]">{t.name}</span>
                        </div>
                        <Badge className="bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE] text-[9px]">{t.target}</Badge>
                      </div>
                      <div className="mt-0.5 text-[10px] text-[#94A3B8]">{t.desc}</div>
                    </div>
                  ))}
                </div>

                <div className="rounded-xl border border-[#E2E8F0] bg-white p-4 space-y-3">
                  <div className="text-[12px] font-semibold text-[#0F172A]">批量下发</div>
                  <Button variant="outline" size="sm" className="w-full h-8 text-[10px] gap-1.5 text-[#DC2626] border-[#FCA5A5]">
                    <Send size={10} /> 批量推送催收任务至CRM
                  </Button>
                  <Button variant="outline" size="sm" className="w-full h-8 text-[10px] gap-1.5 text-[#2563EB] border-[#BFDBFE]">
                    <ArrowRight size={10} /> 转入贷后经营
                  </Button>
                </div>
              </div>
            </div>

            {active && <ActionBar />}
          </div>
        );

      /* ════════════════════════════════════════════════════════════════════
         PAGE 4: 规则效果 (Rule Effectiveness)
         ════════════════════════════════════════════════════════════════════ */
      case 'quality':
        return (
          <div className="space-y-4">
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp size={14} className="text-[#2563EB]" />
                <span className="text-[13px] font-semibold text-[#0F172A]">规则效果</span>
                <span className="text-[11px] text-[#94A3B8]">数据口径: 近 {effectRange} 天</span>
              </div>
              <select className="h-7 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-2 text-[11px] text-[#334155]" value={effectRange} onChange={e => setEffectRange(e.target.value)}>
                <option value="7">近 7 天</option>
                <option value="30">近 30 天</option>
                <option value="90">近 90 天</option>
              </select>
            </div>

            {/* Metric cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricCard label="总触发次数" value={`${RULE_EFFECT_DATA.reduce((s, d) => s + d.triggers, 0)} 次`} detail="+10% 较上周期" tone="blue" />
              <MetricCard label="平均转化率" value={`${Math.round(RULE_EFFECT_DATA.reduce((s, d) => s + d.conversion, 0) / RULE_EFFECT_DATA.length)}%`} detail="触发→确认风险" tone="amber" />
              <MetricCard label="平均准确率" value={`${Math.round(RULE_EFFECT_DATA.reduce((s, d) => s + d.accuracy, 0) / RULE_EFFECT_DATA.length)}%`} detail="预警后确认为真" tone="green" />
              <MetricCard label="有效规则数" value={`${MONITORING_RULES.filter(r => r.status === '启用').length} 条`} detail="-1 条较上周期" tone="slate" />
            </div>

            {/* Charts: trigger bar + conversion line */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 space-y-3">
                <div className="text-[13px] font-semibold text-[#0F172A]">各规则触发次数</div>
                <DistributionBarChart
                  data={RULE_EFFECT_DATA.map(d => ({ name: d.name, value: d.triggers, color: CHART_COLORS.blue }))}
                  height={200}
                />
              </div>
              <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 space-y-3">
                <div className="text-[13px] font-semibold text-[#0F172A]">各规则转化率与准确率</div>
                <TrendLineChart
                  data={RULE_EFFECT_DATA.map(d => ({ name: d.name, conversion: d.conversion, accuracy: d.accuracy }))}
                  lines={[
                    { key: 'conversion', color: CHART_COLORS.blue, label: '转化率 (%)' },
                    { key: 'accuracy', color: CHART_COLORS.emerald, label: '准确率 (%)' },
                  ]}
                  height={200}
                />
              </div>
            </div>

            {/* Rule detail breakdown */}
            <WorkbenchPanel title="规则效果明细">
              <div className="space-y-3">
                {RULE_EFFECT_DATA.map(d => (
                  <div key={d.name} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[12px] font-medium text-[#0F172A]">{d.name}</span>
                      <div className="flex items-center gap-3 text-[10px] text-[#94A3B8]">
                        <span>触发 {d.triggers} 次</span>
                        <span>转化 {d.conversion}%</span>
                        <span>准确 {d.accuracy}%</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <div className="text-[9px] text-[#94A3B8] mb-1">触发量</div>
                        <div className="h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden"><div className="h-full rounded-full bg-[#2563EB]" style={{ width: `${(d.triggers / 50) * 100}%` }} /></div>
                      </div>
                      <div>
                        <div className="text-[9px] text-[#94A3B8] mb-1">转化率</div>
                        <div className="h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden"><div className="h-full rounded-full bg-[#F59E0B]" style={{ width: `${d.conversion}%` }} /></div>
                      </div>
                      <div>
                        <div className="text-[9px] text-[#94A3B8] mb-1">准确率</div>
                        <div className="h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden"><div className="h-full rounded-full bg-[#16A34A]" style={{ width: `${d.accuracy}%` }} /></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </WorkbenchPanel>

            {/* Asset quality trend */}
            <div className="rounded-xl border border-[#E2E8F0] bg-white p-5 space-y-3">
              <div className="text-[13px] font-semibold text-[#0F172A]">资产质量趋势</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: '不良率', value: '0.82%', change: '-0.05%', good: true },
                  { label: '关注类占比', value: '2.41%', change: '-0.18%', good: true },
                  { label: '逾期 30+ 天', value: '0.34%', change: '+0.02%', good: false },
                ].map(item => (
                  <div key={item.label} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-4 text-center">
                    <div className="text-[10px] text-[#94A3B8]">{item.label}</div>
                    <div className="mt-1 text-2xl font-semibold text-[#0F172A]">{item.value}</div>
                    <div className={cn('mt-1 text-xs font-medium', item.good ? 'text-[#16A34A]' : 'text-[#DC2626]')}>{item.change}</div>
                  </div>
                ))}
              </div>
            </div>

            <AiNote action="优化低效规则">
              "授信使用骤降" 规则准确率仅 42%，建议调整阈值或增加复合触发条件以降低误报率。
            </AiNote>

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
