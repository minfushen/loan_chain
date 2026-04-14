import React from 'react';
import SceneLayout from '../SceneLayout';
import { SCENES } from '../../constants';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bell,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Download,
  Edit,
  Eye,
  FileCheck2,
  FileText,
  Layers,
  Loader2,
  Plus,
  Power,
  RefreshCw,
  Search,
  Send,
  Settings,
  Shield,
  ShieldAlert,
  Sparkles,
  Star,
  Trash2,
  TrendingDown,
  TrendingUp,
  UserCheck,
  XCircle,
  Zap,
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
  KpiBar,
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

export default function RiskMonitorScene({ activeModule, onModuleChange, sceneOverride }: Props & { sceneOverride?: string }) {
  const scene = SCENES.find(s => s.id === (sceneOverride || 'smart-monitor'))!;
  const { active, riskSimulated, currentSample, selectSample, selectedSampleId } = useDemo();

  const [taskStatusFilter, setTaskStatusFilter] = React.useState('all');
  const [effectRange, setEffectRange] = React.useState('30');
  const [selectedAlertId, setSelectedAlertId] = React.useState<string>('wa-01');
  const [alertLevelFilter, setAlertLevelFilter] = React.useState<string>('all');
  const [selectedMetricId, setSelectedMetricId] = React.useState<string>('mt-01');
  const [metricStatusFilter, setMetricStatusFilter] = React.useState<string>('all');
  const [selectedRiskObjId, setSelectedRiskObjId] = React.useState<string>('ro-01');
  const [riskLevelFilter, setRiskLevelFilter] = React.useState<string>('all');
  const [selectedDispTaskId, setSelectedDispTaskId] = React.useState<string>('dt-01');
  const [dispStatusFilter, setDispStatusFilter] = React.useState<string>('all');
  const [selectedRuleId, setSelectedRuleId] = React.useState<string>('rl-01');
  const [ruleEvalFilter, setRuleEvalFilter] = React.useState<string>('all');

  const riskSamples = SAMPLES.filter(s => s.riskFlags.length >= 2);
  const filteredTasks = DISPOSAL_TASKS.filter(t => taskStatusFilter === 'all' || t.status === taskStatusFilter);

  const renderContent = () => {
    switch (activeModule) {

      /* ════════════════════════════════════════════════════════════════════
         PAGE 1: 预警总览 (5 区工作台)
         ════════════════════════════════════════════════════════════════════ */
      case 'warning':
      default: {
        type AlertLevel = '一般预警' | '重点预警' | '高优先级预警' | '已升级风险';
        type AnomalyType = '指标波动异常' | '风险信号上升' | '还款异常' | '活跃下降' | '规则集中命中' | '待处理任务积压';
        type AlertTrend = '上升' | '持平' | '下降' | '波动';
        type AlertStatus = '新增' | '处理中' | '待确认' | '已升级' | '已关闭';
        type ObjType = '企业主体' | '在营资产' | '风险对象' | '规则命中对象' | '监控指标对象';
        type AlertType = '风险预警' | '指标预警' | '履约预警' | '活跃预警' | '规则异常预警';

        interface WarnTier { level: AlertLevel; count: number; objects: number; pct: number; trend: AlertTrend; mainType: AnomalyType; action: string }
        interface WarnObj {
          id: string; name: string; objType: ObjType; source: string; updatedAt: string;
          alertLevel: AlertLevel; alertType: AlertType; triggeredAt: string; impact: string; status: AlertStatus;
          suggestion: string; inDisposal: boolean; needConfirm: boolean;
        }
        interface AnomalyItem {
          name: string; type: AnomalyType; objects: number; severity: '高' | '中' | '低'; summary: string;
          status: string; targetPage: string; blocking: boolean;
        }

        const WARN_TIERS: WarnTier[] = [
          { level: '一般预警', count: 42, objects: 38, pct: 48, trend: '持平', mainType: '活跃下降', action: '持续观察' },
          { level: '重点预警', count: 25, objects: 20, pct: 29, trend: '上升', mainType: '风险信号上升', action: '下钻指标监测' },
          { level: '高优先级预警', count: 14, objects: 12, pct: 16, trend: '上升', mainType: '还款异常', action: '下钻风险识别' },
          { level: '已升级风险', count: 6, objects: 6, pct: 7, trend: '波动', mainType: '规则集中命中', action: '进入处置作业' },
        ];

        const WARN_OBJS: WarnObj[] = [
          { id: 'wa-01', name: '瑞泰新能源材料', objType: '企业主体', source: '风险探针', updatedAt: '1小时前', alertLevel: '高优先级预警', alertType: '风险预警', triggeredAt: '04/09 08:30', impact: '涉及余额 ¥260万', status: '新增', suggestion: '进入处置', inDisposal: false, needConfirm: false },
          { id: 'wa-02', name: '王子新材料', objType: '在营资产', source: '监控指标', updatedAt: '2小时前', alertLevel: '高优先级预警', alertType: '指标预警', triggeredAt: '04/09 07:15', impact: '净流出连续4周', status: '处理中', suggestion: '查看指标', inDisposal: true, needConfirm: false },
          { id: 'wa-03', name: '驰远物流服务', objType: '风险对象', source: '规则引擎', updatedAt: '3小时前', alertLevel: '重点预警', alertType: '履约预警', triggeredAt: '04/08 18:00', impact: '运单频次下降35%', status: '待确认', suggestion: '重点关注', inDisposal: false, needConfirm: true },
          { id: 'wa-04', name: '新宙邦科技', objType: '规则命中对象', source: '规则引擎', updatedAt: '5小时前', alertLevel: '重点预警', alertType: '规则异常预警', triggeredAt: '04/08 14:20', impact: '客户集中度62%', status: '处理中', suggestion: '查看风险', inDisposal: true, needConfirm: false },
          { id: 'wa-05', name: '盛拓模组科技', objType: '在营资产', source: '还款监控', updatedAt: '6小时前', alertLevel: '重点预警', alertType: '履约预警', triggeredAt: '04/08 10:00', impact: '回款金额连续下降', status: '新增', suggestion: '重点关注', inDisposal: false, needConfirm: true },
          { id: 'wa-06', name: '裕同包装科技', objType: '企业主体', source: '风险探针', updatedAt: '1天前', alertLevel: '一般预警', alertType: '活跃预警', triggeredAt: '04/07 09:30', impact: '活跃度下降15%', status: '新增', suggestion: '持续观察', inDisposal: false, needConfirm: false },
          { id: 'wa-07', name: '佳利包装', objType: '监控指标对象', source: '监控指标', updatedAt: '1天前', alertLevel: '一般预警', alertType: '指标预警', triggeredAt: '04/07 08:00', impact: '证据覆盖率不足', status: '已关闭', suggestion: '持续观察', inDisposal: false, needConfirm: false },
          { id: 'wa-08', name: '科陆储能技术', objType: '企业主体', source: '规则引擎', updatedAt: '2天前', alertLevel: '已升级风险', alertType: '风险预警', triggeredAt: '04/06 16:00', impact: '涉及余额 ¥180万', status: '已升级', suggestion: '进入处置', inDisposal: true, needConfirm: false },
        ];

        const ANOMALY_ITEMS: AnomalyItem[] = [
          { name: '还款预警集中上升', type: '还款异常', objects: 8, severity: '高', summary: '轻微逾期与持续逾期资产同步增加，回款节奏出现结构性波动', status: '待跟进', targetPage: '还款表现', blocking: true },
          { name: '风险信号升级加速', type: '风险信号上升', objects: 6, severity: '高', summary: '近7天已升级风险从4户增至6户，增速偏快', status: '已关注', targetPage: '风险监控', blocking: true },
          { name: '规则集中命中偏高', type: '规则集中命中', objects: 5, severity: '中', summary: '回款拉长规则与客户集中度规则交叉命中率偏高', status: '待分析', targetPage: '规则效果', blocking: false },
          { name: '待处理任务积压', type: '待处理任务积压', objects: 3, severity: '中', summary: '高优先级待处理任务在48小时内未闭环', status: '待推进', targetPage: '处置任务', blocking: true },
          { name: '活跃度下降趋势', type: '活跃下降', objects: 4, severity: '低', summary: '部分一般预警对象活跃度持续下降，可能转为重点预警', status: '观察中', targetPage: '指标监测', blocking: false },
        ];

        const LEVEL_STYLE: Record<AlertLevel, string> = {
          '一般预警': 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]',
          '重点预警': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
          '高优先级预警': 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
          '已升级风险': 'bg-[#450A0A] text-white border-[#991B1B]',
        };
        const STATUS_STYLE: Record<AlertStatus, string> = {
          '新增': 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
          '处理中': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
          '待确认': 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]',
          '已升级': 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]',
          '已关闭': 'bg-[#F0FDF4] text-[#047857] border-[#BBF7D0]',
        };
        const SEV_STYLE: Record<string, string> = {
          '高': 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]',
          '中': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
          '低': 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]',
        };
        const TR_ICON: Record<AlertTrend, typeof TrendingUp> = { '上升': TrendingUp, '持平': ArrowRight, '下降': TrendingDown, '波动': Zap };
        const TR_CLR: Record<AlertTrend, string> = { '上升': 'text-[#DC2626]', '持平': 'text-[#64748B]', '下降': 'text-[#047857]', '波动': 'text-[#F59E0B]' };

        const totalAlerts = WARN_TIERS.reduce((s, t) => s + t.count, 0);
        const highPriCount = WARN_OBJS.filter(o => o.alertLevel === '高优先级预警').length;
        const newCount = WARN_OBJS.filter(o => o.status === '新增').length;
        const pendingCount = WARN_OBJS.filter(o => o.status !== '已关闭' && o.status !== '已升级').length;
        const upgradedCount = WARN_OBJS.filter(o => o.status === '已升级').length;
        const confirmCount = WARN_OBJS.filter(o => o.needConfirm).length;

        const filteredAlerts = WARN_OBJS.filter(o => {
          if (alertLevelFilter === 'all') return true;
          if (alertLevelFilter === '高') return o.alertLevel === '高优先级预警' || o.alertLevel === '已升级风险';
          if (alertLevelFilter === '重点') return o.alertLevel === '重点预警';
          if (alertLevelFilter === '一般') return o.alertLevel === '一般预警';
          return true;
        });
        const activeAlert = filteredAlerts.find(a => a.id === selectedAlertId) ?? filteredAlerts[0] ?? WARN_OBJS[0];

        return (
          <div className="space-y-3">
            <div className="flex items-center justify-end gap-2 flex-wrap">
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#BFDBFE] text-[#2563EB]"><RefreshCw size={10} />刷新总览</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Layers size={10} />切换统计周期</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Download size={10} />导出预警概览</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Eye size={10} />查看监控规则</Button>
            </div>

            <KpiBar items={[
              { label: '预警总数', value: totalAlerts, hint: '纳入监控范围', tone: 'risk' },
              { label: '高优先级', value: highPriCount, hint: '建议优先处理', tone: highPriCount > 0 ? 'risk' : 'muted' },
              { label: '新增预警', value: newCount, hint: '本期新增', tone: newCount > 0 ? 'warn' : 'muted' },
              { label: '待处理', value: pendingCount, hint: '未完成处理/确认', tone: pendingCount > 0 ? 'warn' : 'muted' },
              { label: '已升级风险', value: upgradedCount, hint: '升级为重点风险', tone: upgradedCount > 0 ? 'risk' : 'muted' },
              { label: '需人工确认', value: confirmCount, hint: '边界信号需复核', tone: confirmCount > 0 ? 'warn' : 'muted' },
            ]} />

            {/* 2. Tier board */}
            <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#F1F5F9] bg-[#F8FAFC] flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-[#0F172A]">预警分层与趋势</span>
                  <span className="text-[9px] text-[#94A3B8] ml-2">优先查看高优先级预警与新增预警</span>
                </div>
                <Button variant="ghost" size="sm" className="h-6 text-[9px] text-[#64748B]">切换维度</Button>
              </div>
              <div className="p-3 space-y-1.5">
                {WARN_TIERS.map(tier => {
                  const TIcon = TR_ICON[tier.trend];
                  return (
                    <div key={tier.level} className="flex items-center gap-3 rounded-lg border border-[#F1F5F9] bg-[#FAFBFF] px-3 py-2 hover:bg-[#EFF6FF]/30 transition-colors cursor-pointer"
                      onClick={() => { setAlertLevelFilter(tier.level === '一般预警' ? '一般' : tier.level === '重点预警' ? '重点' : '高'); }}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge className={cn('text-[7px] border', LEVEL_STYLE[tier.level])}>{tier.level}</Badge>
                          <span className="text-[9px] text-[#64748B]">主要类型: {tier.mainType}</span>
                        </div>
                        <div className="text-[9px] text-[#94A3B8] mt-0.5">建议: {tier.action}</div>
                      </div>
                      <div className="text-right shrink-0 w-16">
                        <div className="text-[12px] font-bold text-[#0F172A]">{tier.count} 条</div>
                        <div className="text-[9px] text-[#64748B]">涉及 {tier.objects} 个对象</div>
                      </div>
                      <div className="shrink-0 w-10 text-right"><div className="text-[11px] font-bold text-[#0F172A]">{tier.pct}%</div></div>
                      <div className={cn('shrink-0 flex items-center gap-0.5 text-[9px]', TR_CLR[tier.trend])}>
                        <TIcon size={10} />{tier.trend}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3-column: Objects + Anomalies + AI */}
            <div className="grid grid-cols-[240px_1fr] gap-3" style={{ minHeight: 460 }}>

              {/* COL 1: Key alert objects */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-3 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                  <span className="text-[11px] font-semibold text-[#0F172A]">重点预警对象</span>
                  <p className="text-[9px] text-[#94A3B8] mt-0.5">重点关注预警等级与影响范围</p>
                </div>
                <div className="px-2 py-1.5 border-b border-[#F1F5F9] flex items-center gap-1.5">
                  <select className="h-5 rounded border border-[#E2E8F0] bg-[#F8FAFC] px-1 text-[9px] text-[#334155] flex-1" value={alertLevelFilter} onChange={e => setAlertLevelFilter(e.target.value)}>
                    <option value="all">全部等级</option><option value="高">高优/已升级</option><option value="重点">重点</option><option value="一般">一般</option>
                  </select>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {filteredAlerts.map(obj => {
                    const isActive = activeAlert?.id === obj.id;
                    return (
                      <div key={obj.id} onClick={() => setSelectedAlertId(obj.id)}
                        className={cn('px-3 py-2.5 border-b border-[#F1F5F9] cursor-pointer transition-all', isActive ? 'bg-[#EFF6FF] border-l-2 border-l-[#2563EB]' : 'hover:bg-[#FAFBFF]')}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[11px] font-semibold text-[#0F172A] truncate">{obj.name}</span>
                          <Badge className={cn('text-[7px] border', LEVEL_STYLE[obj.alertLevel])}>{obj.alertLevel}</Badge>
                        </div>
                        <div className="text-[9px] text-[#64748B] mb-1">{obj.objType} · {obj.source}</div>
                        <div className="flex items-center gap-1.5 mb-1 text-[8px]">
                          <Badge className={cn('text-[7px] border', STATUS_STYLE[obj.status])}>{obj.status}</Badge>
                          {obj.needConfirm && <Badge className="text-[7px] bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]">需确认</Badge>}
                        </div>
                        <div className="flex items-center justify-between text-[8px] text-[#94A3B8]">
                          <span>{obj.impact}</span>
                          <span>{obj.updatedAt}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1.5">
                          <Button variant="outline" size="sm" className="h-5 text-[8px] px-1.5 gap-0.5 border-[#BFDBFE] text-[#2563EB]" onClick={e => e.stopPropagation()}>详情</Button>
                          {obj.inDisposal ? (
                            <Badge className="text-[7px] bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]">处置中</Badge>
                          ) : (
                            <Button variant="ghost" size="sm" className="h-5 text-[8px] px-1 text-[#C2410C]" onClick={e => { e.stopPropagation(); onModuleChange('actions'); }}>处置</Button>
                          )}
                          <Button variant="ghost" size="sm" className="h-5 text-[8px] px-1 text-[#64748B]"><Star size={8} /></Button>
                        </div>
                      </div>
                    );
                  })}
                  {filteredAlerts.length === 0 && (
                    <div className="text-center py-8 space-y-1">
                      <CheckCircle2 size={18} className="text-[#A7F3D0] mx-auto" />
                      <div className="text-[10px] text-[#047857]">当前筛选下暂无预警</div>
                      <div className="text-[9px] text-[#94A3B8]">建议调整筛选条件</div>
                    </div>
                  )}
                </div>
              </div>

              {/* COL 2: Anomaly + detail */}
              <div className="space-y-3 overflow-hidden flex flex-col">
                {/* Active alert detail */}
                <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex-1 flex flex-col">
                  <div className="px-4 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC] flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#0F172A]">预警详情</span>
                    <div className="flex items-center gap-1.5">
                      <Badge className={cn('text-[7px] border', LEVEL_STYLE[activeAlert.alertLevel])}>{activeAlert.alertLevel}</Badge>
                      <Badge className={cn('text-[7px] border', STATUS_STYLE[activeAlert.status])}>{activeAlert.status}</Badge>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                    <div className="grid grid-cols-3 gap-x-3 gap-y-1 text-[9px] pb-2 border-b border-[#F1F5F9]">
                      <div><span className="text-[#94A3B8]">对象</span> <span className="text-[#0F172A] font-medium">{activeAlert.name}</span></div>
                      <div><span className="text-[#94A3B8]">类型</span> <span className="text-[#0F172A]">{activeAlert.objType}</span></div>
                      <div><span className="text-[#94A3B8]">来源</span> <span className="text-[#0F172A]">{activeAlert.source}</span></div>
                      <div><span className="text-[#94A3B8]">预警类型</span> <span className="text-[#0F172A]">{activeAlert.alertType}</span></div>
                      <div><span className="text-[#94A3B8]">触发时间</span> <span className="text-[#0F172A]">{activeAlert.triggeredAt}</span></div>
                      <div><span className="text-[#94A3B8]">影响范围</span> <span className="text-[#DC2626] font-medium">{activeAlert.impact}</span></div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-[10px] font-semibold text-[#0F172A]">处理信息</div>
                      <div className="grid grid-cols-3 gap-x-3 gap-y-1 text-[9px]">
                        <div><span className="text-[#94A3B8]">建议动作</span> <span className="text-[#0F172A] font-medium">{activeAlert.suggestion}</span></div>
                        <div><span className="text-[#94A3B8]">是否已处置</span> <span className={activeAlert.inDisposal ? 'text-[#C2410C]' : 'text-[#64748B]'}>{activeAlert.inDisposal ? '是' : '否'}</span></div>
                        <div><span className="text-[#94A3B8]">需人工确认</span> <span className={activeAlert.needConfirm ? 'text-[#7C3AED]' : 'text-[#64748B]'}>{activeAlert.needConfirm ? '是' : '否'}</span></div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 border-t border-[#F1F5F9] pt-2 flex-wrap">
                      <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#BFDBFE] text-[#2563EB]"><Eye size={9} />查看详情</Button>
                      <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#FCA5A5] text-[#DC2626]" onClick={() => onModuleChange('actions')}><Send size={9} />进入处置</Button>
                      <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]"><Star size={9} />重点关注</Button>
                      <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]" onClick={() => onModuleChange('signals')}><Activity size={9} />查看指标</Button>
                      <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]" onClick={() => onModuleChange('probe')}><Shield size={9} />查看风险</Button>
                      {activeAlert.needConfirm && <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#DDD6FE] text-[#7C3AED]"><UserCheck size={9} />人工确认</Button>}
                    </div>
                  </div>
                </div>

                {/* Anomaly & pending items */}
                <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
                  <div className="px-4 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC] flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-semibold text-[#0F172A]">异常关注与待处理</span>
                      <span className="text-[9px] text-[#94A3B8] ml-2">如异常持续增加建议进入处置推进</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 text-[9px] gap-1 text-[#64748B]"><Download size={9} />待处理清单</Button>
                  </div>
                  <div className="divide-y divide-[#F1F5F9] max-h-[200px] overflow-y-auto">
                    {ANOMALY_ITEMS.map(item => (
                      <div key={item.name} className="px-4 py-2.5 hover:bg-[#FAFBFF] transition-colors">
                        <div className="flex items-center justify-between mb-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-medium text-[#0F172A]">{item.name}</span>
                            <Badge className={cn('text-[7px] border', SEV_STYLE[item.severity])}>{item.severity}</Badge>
                            {item.blocking && <Badge className="text-[7px] bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]">阻塞</Badge>}
                          </div>
                          <span className="text-[8px] text-[#94A3B8]">{item.objects} 个对象</span>
                        </div>
                        <div className="text-[9px] text-[#64748B] mb-1">{item.summary}</div>
                        <div className="flex items-center gap-1.5">
                          <Badge className="text-[7px] bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]">{item.status}</Badge>
                          <Button variant="ghost" size="sm" className="h-5 text-[8px] px-1 text-[#2563EB]"
                            onClick={() => {
                              if (item.targetPage === '还款表现') onModuleChange('repayment');
                              else if (item.targetPage === '风险监控') onModuleChange('probe');
                              else if (item.targetPage === '规则效果') onModuleChange('quality');
                              else if (item.targetPage === '处置任务') onModuleChange('actions');
                              else if (item.targetPage === '指标监测') onModuleChange('signals');
                            }}>{item.targetPage} →</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {active && <ActionBar />}
          </div>
        );
      }

      /* ════════════════════════════════════════════════════════════════════
         PAGE 2: 指标监测 (5 区工作台)
         ════════════════════════════════════════════════════════════════════ */
      case 'signals': {
        type MetricLevel = '正常指标' | '轻微波动指标' | '异常指标' | '高关注指标';
        type WaveType = '上升异常' | '下降异常' | '持续波动' | '阈值突破' | '集中偏离';
        type MetricStatus = '正常' | '轻微波动' | '异常' | '高关注' | '待确认';
        type SeverityLvl = '低' | '中' | '高';
        type MetricType = '预警数量类指标' | '风险识别类指标' | '处置效率类指标' | '规则命中类指标' | '还款波动类指标' | '资产活跃类指标';
        type MetricTrend = '上升' | '持平' | '下降' | '波动';

        interface MetricTier { level: MetricLevel; count: number; pct: number; trend: MetricTrend; waveType: WaveType; impact: string; action: string }
        interface MonitorMetric {
          id: string; name: string; type: MetricType; module: string; period: string;
          currentVal: string; threshold: string; deviation: string; trend: MetricTrend; updatedAt: string;
          status: MetricStatus; severity: SeverityLvl; impact: string; suggestion: string;
          conclusion: string; historyNote: string; relatedRisk: string; toRiskIdent: boolean; toRuleEval: boolean; needConfirm: boolean;
        }

        const METRIC_TIERS: MetricTier[] = [
          { level: '正常指标', count: 18, pct: 45, trend: '持平', waveType: '持续波动', impact: '无直接影响', action: '持续观察' },
          { level: '轻微波动指标', count: 10, pct: 25, trend: '波动', waveType: '阈值突破', impact: '影响预警数量', action: '下钻异常详情' },
          { level: '异常指标', count: 8, pct: 20, trend: '上升', waveType: '上升异常', impact: '影响风险识别', action: '联动风险识别' },
          { level: '高关注指标', count: 4, pct: 10, trend: '上升', waveType: '集中偏离', impact: '影响处置优先级', action: '进入处置作业' },
        ];

        const METRIC_ITEMS: MonitorMetric[] = [
          { id: 'mt-01', name: '预警增长率', type: '预警数量类指标', module: '预警总览', period: '近 7 天', currentVal: '+18.5%', threshold: '≤10%', deviation: '超出 8.5pp', trend: '上升', updatedAt: '30分钟前', status: '高关注', severity: '高', impact: '预警数量持续增加，影响整体处置节奏', suggestion: '联动风险识别', conclusion: '当前指标在短期内出现明显偏离，已超出稳定波动范围', historyNote: '近 30 天从 8.2% 上升至 18.5%', relatedRisk: '可能导致处置任务积压', toRiskIdent: true, toRuleEval: false, needConfirm: false },
          { id: 'mt-02', name: '风险升级率', type: '风险识别类指标', module: '风险识别', period: '近 7 天', currentVal: '6.8%', threshold: '≤4%', deviation: '超出 2.8pp', trend: '上升', updatedAt: '1小时前', status: '异常', severity: '高', impact: '风险升级速度加快，涉及 6 个对象', suggestion: '进入风险识别', conclusion: '已形成明显异常，风险从中度向高度转化加速', historyNote: '上期 3.5%，本期 6.8%', relatedRisk: '关联高优先级预警上升', toRiskIdent: true, toRuleEval: true, needConfirm: false },
          { id: 'mt-03', name: '处置闭环时效', type: '处置效率类指标', module: '处置作业', period: '近 30 天', currentVal: '3.8 天', threshold: '≤2.5 天', deviation: '超时 1.3 天', trend: '上升', updatedAt: '2小时前', status: '异常', severity: '中', impact: '处置效率下降，部分任务 48 小时未闭环', suggestion: '进入处置作业', conclusion: '出现短期波动，处置积压增加', historyNote: '上月平均 2.1 天', relatedRisk: '可能导致风险进一步升级', toRiskIdent: false, toRuleEval: false, needConfirm: false },
          { id: 'mt-04', name: '规则命中集中度', type: '规则命中类指标', module: '规则评估', period: '近 7 天', currentVal: '72%', threshold: '≤50%', deviation: '超出 22pp', trend: '上升', updatedAt: '3小时前', status: '高关注', severity: '高', impact: '少数规则集中命中，可能存在规则冗余', suggestion: '进入规则评估', conclusion: '存在集中偏离，规则有效性需复核', historyNote: '上期 48%，本期 72%', relatedRisk: '规则判断质量下降', toRiskIdent: false, toRuleEval: true, needConfirm: true },
          { id: 'mt-05', name: '还款逾期率', type: '还款波动类指标', module: '还款表现', period: '近 7 天', currentVal: '4.5%', threshold: '≤3%', deviation: '超出 1.5pp', trend: '上升', updatedAt: '4小时前', status: '异常', severity: '中', impact: '轻微逾期与持续逾期同步增加', suggestion: '联动风险识别', conclusion: '出现短期波动，逾期资产扩面', historyNote: '近 30 天从 2.8% 升至 4.5%', relatedRisk: '影响资产质量和回款节奏', toRiskIdent: true, toRuleEval: false, needConfirm: false },
          { id: 'mt-06', name: '资产活跃度', type: '资产活跃类指标', module: '在营资产', period: '近 30 天', currentVal: '78%', threshold: '≥85%', deviation: '低于 7pp', trend: '下降', updatedAt: '5小时前', status: '轻微波动', severity: '低', impact: '部分对象活跃度持续下降', suggestion: '持续观察', conclusion: '该指标存在轻微波动，尚未形成持续异常', historyNote: '上月 84%，本月 78%', relatedRisk: '可能影响后续识别质量', toRiskIdent: false, toRuleEval: false, needConfirm: false },
          { id: 'mt-07', name: '回款周期偏离', type: '还款波动类指标', module: '还款表现', period: '近 30 天', currentVal: '+38%', threshold: '≤20%', deviation: '超出 18pp', trend: '上升', updatedAt: '6小时前', status: '高关注', severity: '高', impact: '涉及 12 户回款周期拉长', suggestion: '进入处置作业', conclusion: '已形成明显异常', historyNote: '连续 3 个月上升', relatedRisk: '直接影响还款表现与风险判断', toRiskIdent: true, toRuleEval: false, needConfirm: false },
          { id: 'mt-08', name: '预警误报率', type: '规则命中类指标', module: '规则评估', period: '近 30 天', currentVal: '22%', threshold: '≤15%', deviation: '超出 7pp', trend: '波动', updatedAt: '1天前', status: '轻微波动', severity: '中', impact: '可能增加人工确认成本', suggestion: '进入规则评估', conclusion: '存在边界波动待确认', historyNote: '上月 18%', relatedRisk: '影响规则判断质量', toRiskIdent: false, toRuleEval: true, needConfirm: true },
          { id: 'mt-09', name: '新增监控覆盖率', type: '预警数量类指标', module: '预警总览', period: '本月', currentVal: '92%', threshold: '≥90%', deviation: '达标', trend: '持平', updatedAt: '1天前', status: '正常', severity: '低', impact: '覆盖度良好', suggestion: '持续观察', conclusion: '当前指标表现稳定', historyNote: '连续 3 月保持 90% 以上', relatedRisk: '无', toRiskIdent: false, toRuleEval: false, needConfirm: false },
          { id: 'mt-10', name: '风险确认转化率', type: '风险识别类指标', module: '风险识别', period: '近 30 天', currentVal: '61%', threshold: '≥55%', deviation: '达标', trend: '持平', updatedAt: '2天前', status: '正常', severity: '低', impact: '转化效率正常', suggestion: '持续观察', conclusion: '当前指标表现稳定', historyNote: '上月 58%', relatedRisk: '无', toRiskIdent: false, toRuleEval: false, needConfirm: false },
        ];

        const LEVEL_MT: Record<MetricLevel, string> = {
          '正常指标': 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]',
          '轻微波动指标': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
          '异常指标': 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
          '高关注指标': 'bg-[#450A0A] text-white border-[#991B1B]',
        };
        const STATUS_MT: Record<MetricStatus, string> = {
          '正常': 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]',
          '轻微波动': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
          '异常': 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
          '高关注': 'bg-[#450A0A] text-white border-[#991B1B]',
          '待确认': 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]',
        };
        const SEV_MT: Record<SeverityLvl, string> = { '高': 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]', '中': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]', '低': 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]' };
        const TR_MT_ICON: Record<MetricTrend, typeof TrendingUp> = { '上升': TrendingUp, '持平': ArrowRight, '下降': TrendingDown, '波动': Zap };
        const TR_MT_CLR: Record<MetricTrend, string> = { '上升': 'text-[#DC2626]', '持平': 'text-[#64748B]', '下降': 'text-[#047857]', '波动': 'text-[#F59E0B]' };

        const totalMetrics = METRIC_TIERS.reduce((s, t) => s + t.count, 0);
        const normalCount = METRIC_TIERS[0].count;
        const abnormalCount = METRIC_ITEMS.filter(m => m.status === '异常').length;
        const waveCount = METRIC_ITEMS.filter(m => m.status === '轻微波动').length;
        const highCount = METRIC_ITEMS.filter(m => m.status === '高关注').length;
        const pendingMt = METRIC_ITEMS.filter(m => m.needConfirm || m.status === '异常' || m.status === '高关注').length;

        const filteredMetrics = METRIC_ITEMS.filter(m => {
          if (metricStatusFilter === 'all') return true;
          return m.status === metricStatusFilter;
        });
        const activeMt = filteredMetrics.find(m => m.id === selectedMetricId) ?? filteredMetrics[0] ?? METRIC_ITEMS[0];

        return (
          <div className="space-y-3">
            <div className="flex items-center justify-end gap-2 flex-wrap">
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#BFDBFE] text-[#2563EB]"><RefreshCw size={10} />刷新指标结果</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Layers size={10} />切换统计周期</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Download size={10} />导出指标清单</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Eye size={10} />查看监测规则</Button>
            </div>

            <KpiBar items={[
              { label: '监测指标总数', value: totalMetrics, hint: '纳入统一监测', tone: 'info' },
              { label: '正常指标', value: normalCount, hint: '处于正常区间', tone: 'normal' },
              { label: '异常指标', value: abnormalCount, hint: '偏离正常区间', tone: abnormalCount > 0 ? 'risk' : 'muted' },
              { label: '波动指标', value: waveCount, hint: '需持续观察', tone: waveCount > 0 ? 'warn' : 'muted' },
              { label: '高关注指标', value: highCount, hint: '建议优先跟踪', tone: highCount > 0 ? 'risk' : 'muted' },
              { label: '待处理指标', value: pendingMt, hint: '需确认或干预', tone: pendingMt > 0 ? 'warn' : 'muted' },
            ]} />

            {/* 2. Tier board */}
            <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#F1F5F9] bg-[#F8FAFC] flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-[#0F172A]">指标分层与趋势</span>
                  <span className="text-[9px] text-[#94A3B8] ml-2">重点关注阈值偏离程度与波动集中情况</span>
                </div>
                <Button variant="ghost" size="sm" className="h-6 text-[9px] text-[#64748B]">切换维度</Button>
              </div>
              <div className="p-3 space-y-1.5">
                {METRIC_TIERS.map(tier => {
                  const TIcon = TR_MT_ICON[tier.trend];
                  return (
                    <div key={tier.level} className="flex items-center gap-3 rounded-lg border border-[#F1F5F9] bg-[#FAFBFF] px-3 py-2 hover:bg-[#EFF6FF]/30 transition-colors cursor-pointer"
                      onClick={() => {
                        if (tier.level === '正常指标') setMetricStatusFilter('正常');
                        else if (tier.level === '轻微波动指标') setMetricStatusFilter('轻微波动');
                        else if (tier.level === '异常指标') setMetricStatusFilter('异常');
                        else setMetricStatusFilter('高关注');
                      }}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge className={cn('text-[7px] border', LEVEL_MT[tier.level])}>{tier.level}</Badge>
                          <span className="text-[9px] text-[#64748B]">{tier.waveType} · {tier.impact}</span>
                        </div>
                        <div className="text-[9px] text-[#94A3B8] mt-0.5">建议: {tier.action}</div>
                      </div>
                      <div className="text-right shrink-0 w-14">
                        <div className="text-[12px] font-bold text-[#0F172A]">{tier.count}</div>
                        <div className="text-[9px] text-[#64748B]">{tier.pct}%</div>
                      </div>
                      <div className={cn('shrink-0 flex items-center gap-0.5 text-[9px]', TR_MT_CLR[tier.trend])}>
                        <TIcon size={10} />{tier.trend}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3-column: List + Detail + AI */}
            <div className="grid grid-cols-[230px_1fr] gap-3" style={{ minHeight: 480 }}>

              {/* COL 1: Metric list */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-3 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                  <span className="text-[11px] font-semibold text-[#0F172A]">重点指标列表</span>
                  <p className="text-[9px] text-[#94A3B8] mt-0.5">关注当前值、趋势与异常等级</p>
                </div>
                <div className="px-2 py-1.5 border-b border-[#F1F5F9] flex items-center gap-1.5">
                  <select className="h-5 rounded border border-[#E2E8F0] bg-[#F8FAFC] px-1 text-[9px] text-[#334155] flex-1" value={metricStatusFilter} onChange={e => setMetricStatusFilter(e.target.value)}>
                    <option value="all">全部状态</option><option value="高关注">高关注</option><option value="异常">异常</option><option value="轻微波动">轻微波动</option><option value="正常">正常</option><option value="待确认">待确认</option>
                  </select>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {filteredMetrics.map(m => {
                    const isActive = activeMt?.id === m.id;
                    const TrIcon = TR_MT_ICON[m.trend];
                    return (
                      <div key={m.id} onClick={() => setSelectedMetricId(m.id)}
                        className={cn('px-3 py-2.5 border-b border-[#F1F5F9] cursor-pointer transition-all', isActive ? 'bg-[#EFF6FF] border-l-2 border-l-[#2563EB]' : 'hover:bg-[#FAFBFF]')}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[11px] font-semibold text-[#0F172A] truncate">{m.name}</span>
                          <Badge className={cn('text-[7px] border', STATUS_MT[m.status])}>{m.status}</Badge>
                        </div>
                        <div className="text-[9px] text-[#64748B] mb-0.5">{m.type} · {m.module}</div>
                        <div className="flex items-center justify-between text-[9px]">
                          <span className="font-mono text-[#0F172A] font-medium">{m.currentVal}</span>
                          <span className="text-[#94A3B8]">阈值 {m.threshold}</span>
                        </div>
                        <div className="flex items-center justify-between mt-0.5">
                          <div className={cn('flex items-center gap-0.5 text-[8px]', TR_MT_CLR[m.trend])}>
                            <TrIcon size={8} />{m.trend}
                          </div>
                          <Badge className={cn('text-[7px] border', SEV_MT[m.severity])}>{m.severity}</Badge>
                        </div>
                        <div className="flex items-center gap-1 mt-1.5">
                          <Button variant="outline" size="sm" className="h-5 text-[8px] px-1.5 gap-0.5 border-[#BFDBFE] text-[#2563EB]" onClick={e => e.stopPropagation()}>详情</Button>
                          <Button variant="ghost" size="sm" className="h-5 text-[8px] px-1 text-[#64748B]"><Star size={8} /></Button>
                          <Button variant="ghost" size="sm" className="h-5 text-[8px] px-1 text-[#64748B]"><TrendingUp size={8} /></Button>
                        </div>
                      </div>
                    );
                  })}
                  {filteredMetrics.length === 0 && (
                    <div className="text-center py-8 space-y-1">
                      <CheckCircle2 size={18} className="text-[#A7F3D0] mx-auto" />
                      <div className="text-[10px] text-[#047857]">当前筛选下暂无命中指标</div>
                      <div className="text-[9px] text-[#94A3B8]">建议调整筛选条件</div>
                    </div>
                  )}
                </div>
              </div>

              {/* COL 2: Metric detail */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-4 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC] flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#0F172A]">当前指标详情</span>
                  <div className="flex items-center gap-1.5">
                    <Badge className={cn('text-[7px] border', STATUS_MT[activeMt.status])}>{activeMt.status}</Badge>
                    <Badge className={cn('text-[7px] border', SEV_MT[activeMt.severity])}>{activeMt.severity}</Badge>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {/* Basic info */}
                  <div>
                    <div className="text-[10px] font-semibold text-[#0F172A] mb-1.5">指标信息</div>
                    <div className="grid grid-cols-3 gap-x-4 gap-y-1.5 text-[9px]">
                      <div><span className="text-[#94A3B8]">名称</span> <span className="text-[#0F172A] font-medium">{activeMt.name}</span></div>
                      <div><span className="text-[#94A3B8]">类型</span> <span className="text-[#0F172A]">{activeMt.type}</span></div>
                      <div><span className="text-[#94A3B8]">统计口径</span> <span className="text-[#0F172A]">{activeMt.module} / {activeMt.period}</span></div>
                    </div>
                  </div>

                  <div className="border-t border-[#F1F5F9] pt-2">
                    <div className="text-[10px] font-semibold text-[#0F172A] mb-1.5">指标表现</div>
                    <div className="grid grid-cols-3 gap-x-4 gap-y-1.5 text-[9px]">
                      <div><span className="text-[#94A3B8]">当前值</span> <span className="text-[#0F172A] font-mono font-bold text-[12px]">{activeMt.currentVal}</span></div>
                      <div><span className="text-[#94A3B8]">阈值</span> <span className="text-[#0F172A]">{activeMt.threshold}</span></div>
                      <div><span className="text-[#94A3B8]">偏离</span> <span className={activeMt.deviation === '达标' ? 'text-[#047857] font-medium' : 'text-[#DC2626] font-medium'}>{activeMt.deviation}</span></div>
                      <div className="col-span-3"><span className="text-[#94A3B8]">历史趋势</span> <span className="text-[#475569]">{activeMt.historyNote}</span></div>
                      <div><span className="text-[#94A3B8]">更新</span> <span className="text-[#64748B]">{activeMt.updatedAt}</span></div>
                    </div>
                  </div>

                  <div className="border-t border-[#F1F5F9] pt-2">
                    <div className="text-[10px] font-semibold text-[#0F172A] mb-1">异常结论</div>
                    <p className="text-[10px] text-[#475569] leading-4 bg-[#FAFBFF] rounded px-2 py-1.5 border border-[#F1F5F9]">{activeMt.conclusion}</p>
                  </div>

                  <div className="border-t border-[#F1F5F9] pt-2">
                    <div className="text-[10px] font-semibold text-[#0F172A] mb-1.5">影响与处理</div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[9px]">
                      <div className="col-span-2"><span className="text-[#94A3B8]">影响范围</span> <span className="text-[#0F172A]">{activeMt.impact}</span></div>
                      <div className="col-span-2"><span className="text-[#94A3B8]">关联风险</span> <span className="text-[#DC2626]">{activeMt.relatedRisk}</span></div>
                      <div><span className="text-[#94A3B8]">建议动作</span> <span className="text-[#0F172A] font-medium">{activeMt.suggestion}</span></div>
                      <div className="flex items-center gap-2">
                        {activeMt.toRiskIdent && <Badge className="text-[7px] bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]">→ 风险识别</Badge>}
                        {activeMt.toRuleEval && <Badge className="text-[7px] bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]">→ 规则评估</Badge>}
                        {activeMt.needConfirm && <Badge className="text-[7px] bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]">需人工确认</Badge>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 border-t border-[#F1F5F9] pt-2 flex-wrap">
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#BFDBFE] text-[#2563EB]"><TrendingUp size={9} />查看历史趋势</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#FCA5A5] text-[#DC2626]" onClick={() => onModuleChange('probe')}><Shield size={9} />进入风险识别</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#DDD6FE] text-[#7C3AED]" onClick={() => onModuleChange('quality')}><Settings size={9} />进入规则评估</Button>
                    {activeMt.needConfirm && <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#FED7AA] text-[#C2410C]"><UserCheck size={9} />标记人工确认</Button>}
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]" onClick={() => onModuleChange('actions')}><Send size={9} />加入处置作业</Button>
                  </div>
                </div>
              </div>
            </div>

            {active && <ActionBar />}
          </div>
        );
      }

      /* ════════════════════════════════════════════════════════════════════
         PAGE: 处置作业 (5 区工作台)
         ════════════════════════════════════════════════════════════════════ */
      case 'actions': {
        type DispStatus = '待处理' | '处理中' | '待确认' | '已升级' | '已关闭' | '已撤销';
        type DispPri = '高' | '中' | '低';
        type DispType = '预警处置' | '风险跟进' | '指标异常处理' | '履约异常跟进' | '规则边界确认' | '误报复核' | '升级处置任务';
        type ClosureStatus = '未闭环' | '部分闭环' | '已闭环' | '待复核';

        interface DispTask {
          id: string; name: string; type: DispType; sourcePage: string; objName: string; objType: string;
          status: DispStatus; priority: DispPri; triggeredAt: string; deadline: string; updatedAt: string;
          handler: string; suggestion: string; escalated: boolean; needConfirm: boolean;
          summary: string; conclusion: string; triggerReason: string; impact: string; blocking: boolean;
          progress: string; expectedClose: string; handleResult: string;
          followUps: { time: string; action: string; handler: string; note: string; result: string }[];
          closure: ClosureStatus; needTrack: boolean; toRuleEval: boolean;
        }

        const DISP_TASKS: DispTask[] = [
          { id: 'dt-01', name: '瑞泰新能源材料-多信号处置', type: '风险跟进', sourcePage: '风险识别', objName: '瑞泰新能源材料', objType: '企业主体', status: '待处理', priority: '高', triggeredAt: '04/09 09:00', deadline: '04/11', updatedAt: '30分钟前', handler: '王敏', suggestion: '立即处理', escalated: false, needConfirm: false, summary: '逾期18天+物流延迟+净流出，5项信号叠加', conclusion: '逾期规则+物流规则+净流出规则命中', triggerReason: '风险识别结果-多信号叠加', impact: '涉及余额¥260万，影响整体资产质量', blocking: true, progress: '待启动', expectedClose: '04/11', handleResult: '持续观察', followUps: [{ time: '04/09 09:05', action: '查看详情', handler: '系统', note: '自动创建任务', result: '异常持续' }], closure: '未闭环', needTrack: true, toRuleEval: false },
          { id: 'dt-02', name: '王子新材料-经营异常跟进', type: '指标异常处理', sourcePage: '指标监测', objName: '王子新材料', objType: '在营资产', status: '处理中', priority: '高', triggeredAt: '04/08 10:00', deadline: '04/11', updatedAt: '1小时前', handler: '陈立', suggestion: '继续跟进', escalated: false, needConfirm: false, summary: '连续4周净流出+授信骤降+客户集中度偏高', conclusion: '净流出规则+集中度规则命中', triggerReason: '指标异常-经营类信号叠加', impact: '影响经营判断与后续续贷', blocking: false, progress: '已联系客户经理排查', expectedClose: '04/11', handleResult: '已进入重点跟踪', followUps: [{ time: '04/08 11:00', action: '发起跟进', handler: '陈立', note: '已通知客户经理排查', result: '风险缓和' }, { time: '04/09 08:00', action: '补充说明', handler: '陈立', note: '客户反馈短期资金周转', result: '需持续观察' }], closure: '部分闭环', needTrack: true, toRuleEval: false },
          { id: 'dt-03', name: '驰远物流服务-履约边界确认', type: '规则边界确认', sourcePage: '风险识别', objName: '驰远物流服务', objType: '还款对象', status: '待确认', priority: '中', triggeredAt: '04/08 18:30', deadline: '04/12', updatedAt: '2小时前', handler: '李雪婷', suggestion: '人工确认', escalated: false, needConfirm: true, summary: '运单频次下降35%+回款周期拉长，信号边界', conclusion: '物流延迟规则命中，需判断是否为季节性波动', triggerReason: '风险识别-边界信号', impact: '影响还款跟踪与履约判断', blocking: false, progress: '等待人工确认', expectedClose: '04/12', handleResult: '已发起人工确认', followUps: [{ time: '04/09 07:00', action: '发起人工确认', handler: '系统', note: '自动发起确认请求', result: '需持续观察' }], closure: '未闭环', needTrack: true, toRuleEval: true },
          { id: 'dt-04', name: '新宙邦科技-规则集中命中复核', type: '误报复核', sourcePage: '规则评估', objName: '新宙邦科技', objType: '规则命中对象', status: '处理中', priority: '中', triggeredAt: '04/07 15:00', deadline: '04/13', updatedAt: '3小时前', handler: '王敏', suggestion: '进入规则评估', escalated: false, needConfirm: false, summary: '客户集中度62%+回款下降，规则交叉命中', conclusion: '集中度+还款规则命中，疑似规则冗余', triggerReason: '规则评估-命中集中度偏高', impact: '影响规则判断质量', blocking: false, progress: '规则评估分析中', expectedClose: '04/13', handleResult: '已进入重点跟踪', followUps: [{ time: '04/08 10:00', action: '查看详情', handler: '王敏', note: '排查规则交叉命中', result: '需持续观察' }], closure: '未闭环', needTrack: false, toRuleEval: true },
          { id: 'dt-05', name: '科陆储能技术-升级处置', type: '升级处置任务', sourcePage: '风险识别', objName: '科陆储能技术', objType: '企业主体', status: '已升级', priority: '高', triggeredAt: '04/06 16:30', deadline: '04/10', updatedAt: '1天前', handler: '张三', suggestion: '升级处理', escalated: true, needConfirm: false, summary: '逾期+净流出+发票断裂+集中度异常4信号叠加', conclusion: '多维信号已升级', triggerReason: '风险识别-高风险升级', impact: '涉及余额¥180万', blocking: true, progress: '已移交风控团队', expectedClose: '04/10', handleResult: '已升级处理', followUps: [{ time: '04/07 09:00', action: '升级处置', handler: '系统', note: '自动升级至风控', result: '异常持续' }, { time: '04/08 14:00', action: '补充说明', handler: '张三', note: '风控团队已介入', result: '需持续观察' }], closure: '部分闭环', needTrack: true, toRuleEval: false },
          { id: 'dt-06', name: '佳利包装-活跃下降复核', type: '误报复核', sourcePage: '指标监测', objName: '佳利包装', objType: '指标异常对象', status: '已关闭', priority: '低', triggeredAt: '04/05 10:00', deadline: '04/08', updatedAt: '2天前', handler: '李雪婷', suggestion: '关闭', escalated: false, needConfirm: false, summary: '活跃度下降但已恢复', conclusion: '已确认为季节性波动', triggerReason: '指标监测-活跃下降', impact: '影响有限', blocking: false, progress: '已确认误报', expectedClose: '04/08', handleResult: '已完成闭环', followUps: [{ time: '04/06 11:00', action: '查看详情', handler: '李雪婷', note: '排查活跃下降原因', result: '已确认误报' }, { time: '04/07 09:00', action: '标记误报', handler: '李雪婷', note: '确认为季节性波动', result: '已完成处理' }, { time: '04/07 09:05', action: '关闭任务', handler: '李雪婷', note: '标记闭环', result: '已完成处理' }], closure: '已闭环', needTrack: false, toRuleEval: true },
          { id: 'dt-07', name: '裕同包装科技-到期提醒', type: '预警处置', sourcePage: '预警总览', objName: '裕同包装科技', objType: '企业主体', status: '待处理', priority: '低', triggeredAt: '04/09 08:00', deadline: '04/15', updatedAt: '6小时前', handler: '张三', suggestion: '持续观察', escalated: false, needConfirm: false, summary: '到期前7天预提醒，活跃度轻微下降', conclusion: '暂无明显风险', triggerReason: '预警总览-到期提醒', impact: '可能影响后续识别质量', blocking: false, progress: '待启动', expectedClose: '04/15', handleResult: '持续观察', followUps: [], closure: '未闭环', needTrack: false, toRuleEval: false },
        ];

        const DST: Record<DispStatus, string> = {
          '待处理': 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]',
          '处理中': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
          '待确认': 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]',
          '已升级': 'bg-[#450A0A] text-white border-[#991B1B]',
          '已关闭': 'bg-[#F0FDF4] text-[#047857] border-[#BBF7D0]',
          '已撤销': 'bg-[#F8FAFC] text-[#94A3B8] border-[#E2E8F0]',
        };
        const DPR: Record<DispPri, string> = { '高': 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]', '中': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]', '低': 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]' };
        const CLS: Record<ClosureStatus, string> = { '未闭环': 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]', '部分闭环': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]', '已闭环': 'bg-[#F0FDF4] text-[#047857] border-[#BBF7D0]', '待复核': 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]' };

        const pendingDispCount = DISP_TASKS.filter(t => t.status === '待处理').length;
        const highPriDispCount = DISP_TASKS.filter(t => t.priority === '高').length;
        const inProgressCount = DISP_TASKS.filter(t => t.status === '处理中').length;
        const confirmDispCount = DISP_TASKS.filter(t => t.needConfirm || t.status === '待确认').length;
        const closedDispCount = DISP_TASKS.filter(t => t.closure === '已闭环').length;
        const overtimeCount = DISP_TASKS.filter(t => t.status !== '已关闭' && t.status !== '已撤销' && t.blocking).length;

        const filteredDisp = DISP_TASKS.filter(t => {
          if (dispStatusFilter === 'all') return true;
          return t.status === dispStatusFilter;
        });
        const activeDisp = filteredDisp.find(t => t.id === selectedDispTaskId) ?? filteredDisp[0] ?? DISP_TASKS[0];

        return (
          <div className="space-y-3">
            <div className="flex items-center justify-end gap-2 flex-wrap">
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#BFDBFE] text-[#2563EB]"><RefreshCw size={10} />刷新任务</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#FCA5A5] text-[#DC2626]"><Send size={10} />批量处置</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Download size={10} />导出任务清单</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Eye size={10} />查看处置规则</Button>
            </div>

            <KpiBar items={[
              { label: '待处理任务', value: pendingDispCount, hint: '等待进入处置流程', tone: pendingDispCount > 0 ? 'risk' : 'muted' },
              { label: '高优先级', value: highPriDispCount, hint: '建议优先处理', tone: highPriDispCount > 0 ? 'risk' : 'muted' },
              { label: '处理中', value: inProgressCount, hint: '已进入跟进流程', tone: inProgressCount > 0 ? 'warn' : 'muted' },
              { label: '待人工确认', value: confirmDispCount, hint: '需人工复核', tone: confirmDispCount > 0 ? 'warn' : 'muted' },
              { label: '已闭环', value: closedDispCount, hint: '已完成处理', tone: 'normal' },
              { label: '超时未处理', value: overtimeCount, hint: '需重点关注', tone: overtimeCount > 0 ? 'risk' : 'muted' },
            ]} />

            {/* 3-column: Task List + Detail/Follow-up + AI */}
            <div className="grid grid-cols-[220px_1fr] gap-3" style={{ minHeight: 500 }}>

              {/* COL 1: Task list */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-3 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                  <span className="text-[11px] font-semibold text-[#0F172A]">处置任务列表</span>
                  <p className="text-[9px] text-[#94A3B8] mt-0.5">优先处理高优先级与超时任务</p>
                </div>
                <div className="px-2 py-1.5 border-b border-[#F1F5F9]">
                  <select className="h-5 rounded border border-[#E2E8F0] bg-[#F8FAFC] px-1 text-[9px] text-[#334155] w-full" value={dispStatusFilter} onChange={e => setDispStatusFilter(e.target.value)}>
                    <option value="all">全部状态</option><option value="待处理">待处理</option><option value="处理中">处理中</option><option value="待确认">待确认</option><option value="已升级">已升级</option><option value="已关闭">已关闭</option>
                  </select>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {filteredDisp.map(task => {
                    const isActive = activeDisp?.id === task.id;
                    return (
                      <div key={task.id} onClick={() => setSelectedDispTaskId(task.id)}
                        className={cn('px-3 py-2.5 border-b border-[#F1F5F9] cursor-pointer transition-all', isActive ? 'bg-[#EFF6FF] border-l-2 border-l-[#2563EB]' : 'hover:bg-[#FAFBFF]')}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[10px] font-semibold text-[#0F172A] truncate flex-1">{task.objName}</span>
                          <Badge className={cn('text-[7px] border shrink-0 ml-1', DST[task.status])}>{task.status}</Badge>
                        </div>
                        <div className="text-[8px] text-[#64748B] mb-0.5 truncate">{task.type} · {task.sourcePage}</div>
                        <div className="flex items-center gap-1 mb-0.5">
                          <Badge className={cn('text-[7px] border', DPR[task.priority])}>{task.priority}</Badge>
                          <Badge className={cn('text-[7px] border', CLS[task.closure])}>{task.closure}</Badge>
                          {task.needConfirm && <Badge className="text-[7px] bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]">需确认</Badge>}
                        </div>
                        <div className="flex items-center justify-between text-[8px] text-[#94A3B8]">
                          <span>{task.handler}</span>
                          <span>截止 {task.deadline}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Button variant="outline" size="sm" className="h-5 text-[7px] px-1 gap-0.5 border-[#BFDBFE] text-[#2563EB]" onClick={e => e.stopPropagation()}>详情</Button>
                          {task.status === '待处理' && <Button variant="ghost" size="sm" className="h-5 text-[7px] px-1 text-[#C2410C]" onClick={e => e.stopPropagation()}>处理</Button>}
                          <Button variant="ghost" size="sm" className="h-5 text-[7px] px-1 text-[#64748B]"><Star size={7} /></Button>
                        </div>
                      </div>
                    );
                  })}
                  {filteredDisp.length === 0 && (
                    <div className="text-center py-8 space-y-1">
                      <CheckCircle2 size={18} className="text-[#A7F3D0] mx-auto" />
                      <div className="text-[10px] text-[#047857]">暂无待处理的处置任务</div>
                      <div className="text-[9px] text-[#94A3B8]">建议关注预警、风险与异常指标变化</div>
                    </div>
                  )}
                </div>
              </div>

              {/* COL 2: Detail + Follow-up */}
              <div className="space-y-3 flex flex-col overflow-hidden">
                {/* Detail */}
                <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex-1 flex flex-col">
                  <div className="px-4 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC] flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-[#0F172A]">当前处置详情</span>
                    <div className="flex items-center gap-1.5">
                      <Badge className={cn('text-[7px] border', DST[activeDisp.status])}>{activeDisp.status}</Badge>
                      <Badge className={cn('text-[7px] border', DPR[activeDisp.priority])}>{activeDisp.priority}优先级</Badge>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                    <div className="grid grid-cols-3 gap-x-3 gap-y-1 text-[9px] pb-2 border-b border-[#F1F5F9]">
                      <div><span className="text-[#94A3B8]">任务</span> <span className="text-[#0F172A] font-medium">{activeDisp.name}</span></div>
                      <div><span className="text-[#94A3B8]">类型</span> <span className="text-[#0F172A]">{activeDisp.type}</span></div>
                      <div><span className="text-[#94A3B8]">来源</span> <span className="text-[#0F172A]">{activeDisp.sourcePage}</span></div>
                      <div><span className="text-[#94A3B8]">对象</span> <span className="text-[#0F172A]">{activeDisp.objName}</span></div>
                      <div><span className="text-[#94A3B8]">对象类型</span> <span className="text-[#0F172A]">{activeDisp.objType}</span></div>
                      <div><span className="text-[#94A3B8]">触发</span> <span className="text-[#0F172A]">{activeDisp.triggeredAt}</span></div>
                    </div>
                    <div>
                      <div className="text-[9px] font-semibold text-[#0F172A] mb-1">异常问题</div>
                      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[9px]">
                        <div className="col-span-2"><span className="text-[#94A3B8]">摘要</span> <span className="text-[#0F172A]">{activeDisp.summary}</span></div>
                        <div className="col-span-2"><span className="text-[#94A3B8]">触发原因</span> <span className="text-[#0F172A]">{activeDisp.triggerReason}</span></div>
                        <div><span className="text-[#94A3B8]">影响</span> <span className="text-[#DC2626]">{activeDisp.impact}</span></div>
                        <div><span className="text-[#94A3B8]">阻塞后续</span> <span className={activeDisp.blocking ? 'text-[#DC2626] font-medium' : 'text-[#64748B]'}>{activeDisp.blocking ? '是' : '否'}</span></div>
                      </div>
                    </div>
                    <div className="border-t border-[#F1F5F9] pt-2">
                      <div className="text-[9px] font-semibold text-[#0F172A] mb-1">处理情况</div>
                      <div className="grid grid-cols-3 gap-x-3 gap-y-1 text-[9px]">
                        <div><span className="text-[#94A3B8]">责任人</span> <span className="text-[#0F172A]">{activeDisp.handler}</span></div>
                        <div><span className="text-[#94A3B8]">进度</span> <span className="text-[#0F172A]">{activeDisp.progress}</span></div>
                        <div><span className="text-[#94A3B8]">预计</span> <span className="text-[#0F172A]">{activeDisp.expectedClose}</span></div>
                        <div><span className="text-[#94A3B8]">结论</span> <span className="text-[#0F172A] font-medium">{activeDisp.handleResult}</span></div>
                        <div><span className="text-[#94A3B8]">建议</span> <span className="text-[#0F172A]">{activeDisp.suggestion}</span></div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 border-t border-[#F1F5F9] pt-2 flex-wrap">
                      <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#BFDBFE] text-[#2563EB]"><Edit size={9} />记录跟进</Button>
                      <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#DDD6FE] text-[#7C3AED]"><UserCheck size={9} />人工确认</Button>
                      <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#FCA5A5] text-[#DC2626]"><TrendingUp size={9} />升级处置</Button>
                      <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#BBF7D0] text-[#047857]"><XCircle size={9} />关闭任务</Button>
                      <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]"><Eye size={9} />来源依据</Button>
                    </div>
                  </div>
                </div>

                {/* Follow-up timeline */}
                <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden" style={{ maxHeight: 200 }}>
                  <div className="px-4 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC] flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-semibold text-[#0F172A]">跟进记录与闭环状态</span>
                      <Badge className={cn('text-[7px] border ml-2', CLS[activeDisp.closure])}>{activeDisp.closure}</Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-5 text-[8px] px-1 text-[#2563EB]">补充说明</Button>
                      <Button variant="ghost" size="sm" className="h-5 text-[8px] px-1 text-[#047857]">标记闭环</Button>
                      {activeDisp.toRuleEval && <Button variant="ghost" size="sm" className="h-5 text-[8px] px-1 text-[#7C3AED]" onClick={() => onModuleChange('quality')}>规则评估</Button>}
                    </div>
                  </div>
                  <div className="overflow-y-auto p-3 space-y-2" style={{ maxHeight: 140 }}>
                    {activeDisp.followUps.length > 0 ? activeDisp.followUps.map((fu, i) => (
                      <div key={i} className="flex gap-2">
                        <div className="flex flex-col items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-1 shrink-0" />
                          {i < activeDisp.followUps.length - 1 && <div className="w-px flex-1 bg-[#E2E8F0]" />}
                        </div>
                        <div className="flex-1 min-w-0 pb-1">
                          <div className="flex items-center gap-1.5 text-[9px]">
                            <span className="text-[#64748B]">{fu.time}</span>
                            <Badge className="text-[7px] bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]">{fu.action}</Badge>
                            <span className="text-[#94A3B8]">{fu.handler}</span>
                          </div>
                          <div className="text-[9px] text-[#0F172A] mt-0.5">{fu.note}</div>
                          <div className="text-[8px] text-[#94A3B8]">结果: {fu.result}</div>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-3 text-[9px] text-[#94A3B8]">暂无跟进记录</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {active && <ActionBar />}
          </div>
        );
      }

      /* ════════════════════════════════════════════════════════════════════
         PAGE 3: 风险识别 (5 区工作台)
         ════════════════════════════════════════════════════════════════════ */
      case 'probe': {
        type RiskLevel = '轻度风险信号' | '中度风险关注' | '高风险对象' | '边界待确认对象';
        type RiskType = '经营异常风险' | '履约异常风险' | '活跃下降风险' | '规则集中命中风险' | '多信号叠加风险' | '异常行为模式风险';
        type RiskObjStatus = '新识别' | '持续跟踪' | '待确认' | '已升级' | '已关闭';
        type RiskObjType = '企业主体' | '在营资产' | '还款对象' | '指标异常对象' | '规则命中对象';
        type RiskTrend = '上升' | '持平' | '下降' | '波动';

        interface RiskTier { level: RiskLevel; count: number; pct: number; trend: RiskTrend; mainType: RiskType; impact: string; action: string }
        interface RiskObj {
          id: string; name: string; objType: RiskObjType; source: string; updatedAt: string;
          riskLevel: RiskLevel; riskType: RiskType; triggeredAt: string; signalCount: number; status: RiskObjStatus;
          suggestion: string; inDisposal: boolean; needConfirm: boolean;
          conclusion: string; signals: string; overlap: string; recentChange: string; impact: string;
          ruleHits: string; relatedMetric: string; relatedAlert: string; toDisposal: boolean;
        }

        const RISK_TIERS: RiskTier[] = [
          { level: '轻度风险信号', count: 22, pct: 40, trend: '持平', mainType: '活跃下降风险', impact: '影响预警等级', action: '持续观察' },
          { level: '中度风险关注', count: 18, pct: 33, trend: '上升', mainType: '履约异常风险', impact: '影响处置优先级', action: '重点跟踪' },
          { level: '高风险对象', count: 9, pct: 16, trend: '上升', mainType: '多信号叠加风险', impact: '影响资产经营判断', action: '进入处置作业' },
          { level: '边界待确认对象', count: 6, pct: 11, trend: '波动', mainType: '异常行为模式风险', impact: '影响还款跟踪', action: '发起人工确认' },
        ];

        const RISK_OBJS: RiskObj[] = [
          { id: 'ro-01', name: '瑞泰新能源材料', objType: '企业主体', source: '指标监测+规则引擎', updatedAt: '30分钟前', riskLevel: '高风险对象', riskType: '多信号叠加风险', triggeredAt: '04/09 08:30', signalCount: 5, status: '新识别', suggestion: '进入处置', inDisposal: false, needConfirm: false, conclusion: '多维信号叠加，建议升级处理', signals: '逾期18天、物流延迟、净流出、回款下降、活跃度降', overlap: '5 项信号同期触发，叠加强度极高', recentChange: '近 7 天风险信号从 2 项增至 5 项', impact: '涉及余额 ¥260万，影响整体资产质量', ruleHits: '逾期规则+物流规则+净流出规则命中', relatedMetric: '预警增长率+还款逾期率异常', relatedAlert: '高优先级预警 wa-01', toDisposal: true },
          { id: 'ro-02', name: '王子新材料', objType: '在营资产', source: '指标监测', updatedAt: '1小时前', riskLevel: '高风险对象', riskType: '经营异常风险', triggeredAt: '04/09 07:15', signalCount: 3, status: '持续跟踪', suggestion: '重点跟踪', inDisposal: true, needConfirm: false, conclusion: '已形成较明显风险特征，建议重点跟踪', signals: '连续4周净流出、授信使用率骤降、客户集中度偏高', overlap: '3 项经营类信号叠加', recentChange: '净流出趋势持续，未见缓和迹象', impact: '影响经营判断与后续续贷', ruleHits: '净流出规则+集中度规则命中', relatedMetric: '资产活跃度下降', relatedAlert: '高优先级预警 wa-02', toDisposal: true },
          { id: 'ro-03', name: '驰远物流服务', objType: '还款对象', source: '还款监控', updatedAt: '2小时前', riskLevel: '中度风险关注', riskType: '履约异常风险', triggeredAt: '04/08 18:00', signalCount: 2, status: '待确认', suggestion: '人工确认', inDisposal: false, needConfirm: true, conclusion: '当前处于边界状态，需人工确认', signals: '运单频次下降35%、回款周期拉长', overlap: '2 项履约信号叠加', recentChange: '物流频次连续 2 周下降', impact: '影响还款跟踪与履约判断', ruleHits: '物流延迟规则命中', relatedMetric: '回款周期偏离+38%', relatedAlert: '重点预警 wa-03', toDisposal: false },
          { id: 'ro-04', name: '新宙邦科技', objType: '规则命中对象', source: '规则引擎', updatedAt: '3小时前', riskLevel: '中度风险关注', riskType: '规则集中命中风险', triggeredAt: '04/08 14:20', signalCount: 2, status: '持续跟踪', suggestion: '进入规则评估', inDisposal: true, needConfirm: false, conclusion: '已形成较明显风险特征，建议重点跟踪', signals: '客户集中度62%、回款金额下降', overlap: '2 项规则交叉命中', recentChange: '集中度持续上升', impact: '影响规则判断质量', ruleHits: '集中度规则+还款规则命中', relatedMetric: '规则命中集中度72%', relatedAlert: '重点预警 wa-04', toDisposal: false },
          { id: 'ro-05', name: '盛拓模组科技', objType: '在营资产', source: '还款监控', updatedAt: '5小时前', riskLevel: '中度风险关注', riskType: '履约异常风险', triggeredAt: '04/08 10:00', signalCount: 2, status: '新识别', suggestion: '重点跟踪', inDisposal: false, needConfirm: true, conclusion: '当前处于边界状态，需人工确认', signals: '回款金额连续下降、活跃度轻微下降', overlap: '履约+活跃信号叠加', recentChange: '回款连续 3 期下降', impact: '涉及余额 ¥85万', ruleHits: '还款下降规则命中', relatedMetric: '还款逾期率上升', relatedAlert: '重点预警 wa-05', toDisposal: false },
          { id: 'ro-06', name: '裕同包装科技', objType: '企业主体', source: '指标监测', updatedAt: '8小时前', riskLevel: '轻度风险信号', riskType: '活跃下降风险', triggeredAt: '04/07 09:30', signalCount: 1, status: '新识别', suggestion: '持续观察', inDisposal: false, needConfirm: false, conclusion: '当前风险信号轻微，建议持续观察', signals: '活跃度下降15%', overlap: '单一信号', recentChange: '近 2 周活跃度持续走低', impact: '可能影响后续识别质量', ruleHits: '暂无规则命中', relatedMetric: '资产活跃度78%', relatedAlert: '一般预警 wa-06', toDisposal: false },
          { id: 'ro-07', name: '科陆储能技术', objType: '企业主体', source: '多源综合', updatedAt: '1天前', riskLevel: '高风险对象', riskType: '多信号叠加风险', triggeredAt: '04/06 16:00', signalCount: 4, status: '已升级', suggestion: '进入处置', inDisposal: true, needConfirm: false, conclusion: '多维信号叠加，建议升级处理', signals: '逾期+净流出+发票断裂+集中度异常', overlap: '4 项信号交叉叠加', recentChange: '已从中度升级为高风险', impact: '涉及余额 ¥180万', ruleHits: '逾期+净流出+发票规则命中', relatedMetric: '多项指标异常', relatedAlert: '已升级风险 wa-08', toDisposal: true },
          { id: 'ro-08', name: '佳利包装', objType: '指标异常对象', source: '指标监测', updatedAt: '2天前', riskLevel: '轻度风险信号', riskType: '活跃下降风险', triggeredAt: '04/07 08:00', signalCount: 1, status: '已关闭', suggestion: '持续观察', inDisposal: false, needConfirm: false, conclusion: '当前风险信号轻微，建议持续观察', signals: '证据覆盖率不足', overlap: '单一信号', recentChange: '已恢复稳定', impact: '影响有限', ruleHits: '暂无', relatedMetric: '指标已恢复', relatedAlert: '一般预警 wa-07', toDisposal: false },
        ];

        const RLVL: Record<RiskLevel, string> = {
          '轻度风险信号': 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]',
          '中度风险关注': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
          '高风险对象': 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
          '边界待确认对象': 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]',
        };
        const RSTATUS: Record<RiskObjStatus, string> = {
          '新识别': 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
          '持续跟踪': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
          '待确认': 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]',
          '已升级': 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]',
          '已关闭': 'bg-[#F0FDF4] text-[#047857] border-[#BBF7D0]',
        };
        const RTR_ICON: Record<RiskTrend, typeof TrendingUp> = { '上升': TrendingUp, '持平': ArrowRight, '下降': TrendingDown, '波动': Zap };
        const RTR_CLR: Record<RiskTrend, string> = { '上升': 'text-[#DC2626]', '持平': 'text-[#64748B]', '下降': 'text-[#047857]', '波动': 'text-[#F59E0B]' };

        const totalRiskObjs = RISK_TIERS.reduce((s, t) => s + t.count, 0);
        const newRiskCount = RISK_OBJS.filter(o => o.status === '新识别').length;
        const highRiskCount = RISK_OBJS.filter(o => o.riskLevel === '高风险对象').length;
        const borderCount = RISK_OBJS.filter(o => o.riskLevel === '边界待确认对象' || o.needConfirm).length;
        const pendingDisp = RISK_OBJS.filter(o => o.toDisposal && !o.inDisposal).length;
        const needConfirmRisk = RISK_OBJS.filter(o => o.needConfirm).length;

        const filteredRiskObjs = RISK_OBJS.filter(o => {
          if (riskLevelFilter === 'all') return true;
          if (riskLevelFilter === '高') return o.riskLevel === '高风险对象';
          if (riskLevelFilter === '中') return o.riskLevel === '中度风险关注';
          if (riskLevelFilter === '轻') return o.riskLevel === '轻度风险信号';
          if (riskLevelFilter === '边界') return o.needConfirm;
          return true;
        });
        const activeRO = filteredRiskObjs.find(o => o.id === selectedRiskObjId) ?? filteredRiskObjs[0] ?? RISK_OBJS[0];

        return (
          <div className="space-y-3">
            <div className="flex items-center justify-end gap-2 flex-wrap">
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#BFDBFE] text-[#2563EB]"><RefreshCw size={10} />刷新识别结果</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Layers size={10} />切换识别口径</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Download size={10} />导出风险对象</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Eye size={10} />查看识别规则</Button>
            </div>

            <KpiBar items={[
              { label: '识别对象总数', value: totalRiskObjs, hint: '完成识别判断', tone: 'info' },
              { label: '新增风险对象', value: newRiskCount, hint: '本期新识别', tone: newRiskCount > 0 ? 'warn' : 'muted' },
              { label: '高风险对象', value: highRiskCount, hint: '建议优先处理', tone: highRiskCount > 0 ? 'risk' : 'muted' },
              { label: '边界风险对象', value: borderCount, hint: '需进一步确认', tone: borderCount > 0 ? 'warn' : 'muted' },
              { label: '待处置对象', value: pendingDisp, hint: '待进入处置流程', tone: pendingDisp > 0 ? 'warn' : 'muted' },
              { label: '需人工确认', value: needConfirmRisk, hint: '复杂信号需复核', tone: needConfirmRisk > 0 ? 'warn' : 'muted' },
            ]} />

            {/* 2. Risk tier board */}
            <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#F1F5F9] bg-[#F8FAFC] flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-semibold text-[#0F172A]">风险分层与识别趋势</span>
                  <span className="text-[9px] text-[#94A3B8] ml-2">重点关注多信号叠加与风险上升趋势</span>
                </div>
                <Button variant="ghost" size="sm" className="h-6 text-[9px] text-[#64748B]">切换维度</Button>
              </div>
              <div className="p-3 space-y-1.5">
                {RISK_TIERS.map(tier => {
                  const TIcon = RTR_ICON[tier.trend];
                  return (
                    <div key={tier.level} className="flex items-center gap-3 rounded-lg border border-[#F1F5F9] bg-[#FAFBFF] px-3 py-2 hover:bg-[#EFF6FF]/30 transition-colors cursor-pointer"
                      onClick={() => {
                        if (tier.level === '轻度风险信号') setRiskLevelFilter('轻');
                        else if (tier.level === '中度风险关注') setRiskLevelFilter('中');
                        else if (tier.level === '高风险对象') setRiskLevelFilter('高');
                        else setRiskLevelFilter('边界');
                      }}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <Badge className={cn('text-[7px] border', RLVL[tier.level])}>{tier.level}</Badge>
                          <span className="text-[9px] text-[#64748B]">{tier.mainType} · {tier.impact}</span>
                        </div>
                        <div className="text-[9px] text-[#94A3B8] mt-0.5">建议: {tier.action}</div>
                      </div>
                      <div className="text-right shrink-0 w-14">
                        <div className="text-[12px] font-bold text-[#0F172A]">{tier.count}</div>
                        <div className="text-[9px] text-[#64748B]">{tier.pct}%</div>
                      </div>
                      <div className={cn('shrink-0 flex items-center gap-0.5 text-[9px]', RTR_CLR[tier.trend])}>
                        <TIcon size={10} />{tier.trend}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3-column: List + Detail + AI */}
            <div className="grid grid-cols-[230px_1fr] gap-3" style={{ minHeight: 480 }}>

              {/* COL 1: Risk object list */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-3 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                  <span className="text-[11px] font-semibold text-[#0F172A]">风险对象列表</span>
                  <p className="text-[9px] text-[#94A3B8] mt-0.5">关注风险等级、类型与建议动作</p>
                </div>
                <div className="px-2 py-1.5 border-b border-[#F1F5F9] flex items-center gap-1.5">
                  <select className="h-5 rounded border border-[#E2E8F0] bg-[#F8FAFC] px-1 text-[9px] text-[#334155] flex-1" value={riskLevelFilter} onChange={e => setRiskLevelFilter(e.target.value)}>
                    <option value="all">全部等级</option><option value="高">高风险</option><option value="中">中度关注</option><option value="轻">轻度信号</option><option value="边界">边界/待确认</option>
                  </select>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {filteredRiskObjs.map(obj => {
                    const isActive = activeRO?.id === obj.id;
                    return (
                      <div key={obj.id} onClick={() => setSelectedRiskObjId(obj.id)}
                        className={cn('px-3 py-2.5 border-b border-[#F1F5F9] cursor-pointer transition-all', isActive ? 'bg-[#EFF6FF] border-l-2 border-l-[#2563EB]' : 'hover:bg-[#FAFBFF]')}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[11px] font-semibold text-[#0F172A] truncate">{obj.name}</span>
                          <Badge className={cn('text-[7px] border', RLVL[obj.riskLevel])}>{obj.riskLevel}</Badge>
                        </div>
                        <div className="text-[9px] text-[#64748B] mb-0.5">{obj.objType} · {obj.source}</div>
                        <div className="flex items-center gap-1.5 mb-0.5 text-[8px]">
                          <Badge className={cn('text-[7px] border', RSTATUS[obj.status])}>{obj.status}</Badge>
                          <span className="text-[#94A3B8]">信号 {obj.signalCount} 项</span>
                          {obj.needConfirm && <Badge className="text-[7px] bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]">需确认</Badge>}
                        </div>
                        <div className="flex items-center justify-between text-[8px] text-[#94A3B8]">
                          <span>{obj.riskType}</span>
                          <span>{obj.updatedAt}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1.5">
                          <Button variant="outline" size="sm" className="h-5 text-[8px] px-1.5 gap-0.5 border-[#BFDBFE] text-[#2563EB]" onClick={e => e.stopPropagation()}>详情</Button>
                          <Button variant="ghost" size="sm" className="h-5 text-[8px] px-1 text-[#64748B]"><Star size={8} /></Button>
                          {!obj.inDisposal && obj.toDisposal && (
                            <Button variant="ghost" size="sm" className="h-5 text-[8px] px-1 text-[#DC2626]" onClick={e => { e.stopPropagation(); onModuleChange('actions'); }}>处置</Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {filteredRiskObjs.length === 0 && (
                    <div className="text-center py-8 space-y-1">
                      <CheckCircle2 size={18} className="text-[#A7F3D0] mx-auto" />
                      <div className="text-[10px] text-[#047857]">当前筛选下暂无命中对象</div>
                      <div className="text-[9px] text-[#94A3B8]">建议调整筛选条件</div>
                    </div>
                  )}
                </div>
              </div>

              {/* COL 2: Risk detail + basis */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-4 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC] flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#0F172A]">当前风险详情</span>
                  <div className="flex items-center gap-1.5">
                    <Badge className={cn('text-[7px] border', RLVL[activeRO.riskLevel])}>{activeRO.riskLevel}</Badge>
                    <Badge className={cn('text-[7px] border', RSTATUS[activeRO.status])}>{activeRO.status}</Badge>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  <div>
                    <div className="text-[10px] font-semibold text-[#0F172A] mb-1.5">对象与风险信息</div>
                    <div className="grid grid-cols-3 gap-x-4 gap-y-1.5 text-[9px]">
                      <div><span className="text-[#94A3B8]">对象</span> <span className="text-[#0F172A] font-medium">{activeRO.name}</span></div>
                      <div><span className="text-[#94A3B8]">类型</span> <span className="text-[#0F172A]">{activeRO.objType}</span></div>
                      <div><span className="text-[#94A3B8]">来源</span> <span className="text-[#0F172A]">{activeRO.source}</span></div>
                      <div><span className="text-[#94A3B8]">首次触发</span> <span className="text-[#0F172A]">{activeRO.triggeredAt}</span></div>
                      <div><span className="text-[#94A3B8]">更新</span> <span className="text-[#64748B]">{activeRO.updatedAt}</span></div>
                      <div><span className="text-[#94A3B8]">信号数</span> <span className="text-[#DC2626] font-bold">{activeRO.signalCount} 项</span></div>
                    </div>
                  </div>

                  <div className="border-t border-[#F1F5F9] pt-2">
                    <div className="text-[10px] font-semibold text-[#0F172A] mb-1">风险结论</div>
                    <p className="text-[10px] text-[#475569] leading-4 bg-[#FAFBFF] rounded px-2 py-1.5 border border-[#F1F5F9]">{activeRO.conclusion}</p>
                  </div>

                  <div className="border-t border-[#F1F5F9] pt-2">
                    <div className="text-[10px] font-semibold text-[#0F172A] mb-1.5">风险表现</div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[9px]">
                      <div className="col-span-2"><span className="text-[#94A3B8]">主要信号</span> <span className="text-[#0F172A]">{activeRO.signals}</span></div>
                      <div><span className="text-[#94A3B8]">叠加情况</span> <span className="text-[#DC2626] font-medium">{activeRO.overlap}</span></div>
                      <div><span className="text-[#94A3B8]">近阶段变化</span> <span className="text-[#0F172A]">{activeRO.recentChange}</span></div>
                      <div className="col-span-2"><span className="text-[#94A3B8]">影响范围</span> <span className="text-[#0F172A]">{activeRO.impact}</span></div>
                    </div>
                  </div>

                  <div className="border-t border-[#F1F5F9] pt-2">
                    <div className="text-[10px] font-semibold text-[#0F172A] mb-1.5">识别依据</div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-[9px]">
                      <div className="col-span-2"><span className="text-[#94A3B8]">命中规则</span> <span className="text-[#0F172A]">{activeRO.ruleHits}</span></div>
                      <div><span className="text-[#94A3B8]">关联指标</span> <span className="text-[#0F172A]">{activeRO.relatedMetric}</span></div>
                      <div><span className="text-[#94A3B8]">关联预警</span> <span className="text-[#0F172A]">{activeRO.relatedAlert}</span></div>
                      <div><span className="text-[#94A3B8]">建议动作</span> <span className="text-[#0F172A] font-medium">{activeRO.suggestion}</span></div>
                      <div className="flex items-center gap-1.5">
                        {activeRO.toDisposal && <Badge className="text-[7px] bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]">→ 处置作业</Badge>}
                        {activeRO.needConfirm && <Badge className="text-[7px] bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]">需人工确认</Badge>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 border-t border-[#F1F5F9] pt-2 flex-wrap">
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#BFDBFE] text-[#2563EB]"><Eye size={9} />查看识别明细</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]" onClick={() => onModuleChange('signals')}><Activity size={9} />查看关联指标</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]" onClick={() => onModuleChange('quality')}><Settings size={9} />查看关联规则</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#FCA5A5] text-[#DC2626]" onClick={() => onModuleChange('actions')}><Send size={9} />进入处置作业</Button>
                    {activeRO.needConfirm && <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#DDD6FE] text-[#7C3AED]"><UserCheck size={9} />标记人工确认</Button>}
                  </div>
                </div>
              </div>
            </div>

            {active && <ActionBar />}
          </div>
        );
      }

      /* ════════════════════════════════════════════════════════════════════
         PAGE: 规则评估 (5 区工作台)
         ════════════════════════════════════════════════════════════════════ */
      case 'quality': {
        type RuleEvalConclusion = '表现良好' | '基本稳定' | '待观察' | '待优化' | '需复核';
        type RuleType = '预警规则' | '指标规则' | '风险识别规则' | '履约监测规则' | '组合判断规则';
        type ProblemTag = '命中不足' | '误报偏高' | '边界过多' | '波动较大' | '场景覆盖不足' | '无';
        type TierLevel = '高成效规则' | '稳定规则' | '待观察规则' | '待优化规则' | '高误报规则';
        type TierTrend = '上升' | '持平' | '下降' | '波动';
        type Validity = '有效支撑识别' | '基本有效' | '识别作用有限' | '误报偏高需调整' | '暂不能稳定使用';

        interface RuleTier { level: TierLevel; count: number; pct: number; trend: TierTrend; mainProblem: string; impact: string; action: string }
        interface EvalRule {
          id: string; name: string; type: RuleType; scene: string; enabled: boolean; updatedAt: string;
          hits: number; effectiveHits: number; falsePositives: number; hitRate: number; fpRate: number;
          conclusion: RuleEvalConclusion; problem: ProblemTag; suggestion: string;
          validity: Validity; trendDesc: string; coverageDesc: string;
          relatedAlert: string; relatedRisk: string; relatedDisposal: string; humanFeedback: string;
          needOptimize: boolean; needConfirm: boolean;
        }

        const RULE_TIERS: RuleTier[] = [
          { level: '高成效规则', count: 12, pct: 32, trend: '持平', mainProblem: '无明显问题', impact: '稳定支撑预警质量', action: '继续观察' },
          { level: '稳定规则', count: 10, pct: 27, trend: '持平', mainProblem: '部分场景覆盖不足', impact: '基本支撑风险识别', action: '继续观察' },
          { level: '待观察规则', count: 7, pct: 19, trend: '上升', mainProblem: '识别不稳定', impact: '影响处置效率', action: '持续跟踪' },
          { level: '待优化规则', count: 5, pct: 13, trend: '上升', mainProblem: '命中不足+边界过多', impact: '影响风险识别准确性', action: '优先优化' },
          { level: '高误报规则', count: 3, pct: 8, trend: '波动', mainProblem: '误报偏高+反馈闭环不足', impact: '影响人工复核负担', action: '发起人工复核' },
        ];

        const EVAL_RULES: EvalRule[] = [
          { id: 'rl-01', name: '逾期天数超阈值规则', type: '预警规则', scene: '逾期监控', enabled: true, updatedAt: '30分钟前', hits: 48, effectiveHits: 42, falsePositives: 6, hitRate: 87, fpRate: 12, conclusion: '表现良好', problem: '无', suggestion: '继续观察', validity: '有效支撑识别', trendDesc: '近 30 天命中稳定，有效率持续 >85%', coverageDesc: '覆盖逾期场景 92%', relatedAlert: '关联预警 15 条', relatedRisk: '关联风险对象 8 个', relatedDisposal: '已产生处置任务 5 个', humanFeedback: '人工确认通过率 88%', needOptimize: false, needConfirm: false },
          { id: 'rl-02', name: '净流出连续异常规则', type: '指标规则', scene: '经营异常', enabled: true, updatedAt: '1小时前', hits: 35, effectiveHits: 28, falsePositives: 7, hitRate: 80, fpRate: 20, conclusion: '基本稳定', problem: '误报偏高', suggestion: '调整口径', validity: '基本有效', trendDesc: '近 30 天误报率从 15% 升至 20%', coverageDesc: '覆盖经营异常场景 78%', relatedAlert: '关联预警 9 条', relatedRisk: '关联风险对象 5 个', relatedDisposal: '已产生处置任务 3 个', humanFeedback: '人工确认通过率 72%', needOptimize: true, needConfirm: false },
          { id: 'rl-03', name: '授信使用率骤降规则', type: '风险识别规则', scene: '风险识别', enabled: true, updatedAt: '2小时前', hits: 22, effectiveHits: 9, falsePositives: 13, hitRate: 41, fpRate: 59, conclusion: '待优化', problem: '误报偏高', suggestion: '优先优化', validity: '误报偏高需调整', trendDesc: '近 30 天误报率持续偏高', coverageDesc: '覆盖授信骤降场景 60%', relatedAlert: '关联预警 4 条', relatedRisk: '关联风险对象 3 个', relatedDisposal: '未产生处置任务', humanFeedback: '人工确认通过率仅 42%', needOptimize: true, needConfirm: true },
          { id: 'rl-04', name: '物流频次下降规则', type: '履约监测规则', scene: '履约异常', enabled: true, updatedAt: '3小时前', hits: 18, effectiveHits: 14, falsePositives: 4, hitRate: 78, fpRate: 22, conclusion: '基本稳定', problem: '边界过多', suggestion: '补充反馈样本', validity: '基本有效', trendDesc: '近 30 天边界判断增多', coverageDesc: '覆盖物流异常场景 75%', relatedAlert: '关联预警 6 条', relatedRisk: '关联风险对象 4 个', relatedDisposal: '已产生处置任务 2 个', humanFeedback: '人工确认通过率 76%', needOptimize: false, needConfirm: true },
          { id: 'rl-05', name: '客户集中度偏高规则', type: '组合判断规则', scene: '风险识别', enabled: true, updatedAt: '5小时前', hits: 30, effectiveHits: 24, falsePositives: 6, hitRate: 80, fpRate: 20, conclusion: '表现良好', problem: '无', suggestion: '继续观察', validity: '有效支撑识别', trendDesc: '近 30 天有效率稳定在 80%', coverageDesc: '覆盖集中度场景 85%', relatedAlert: '关联预警 8 条', relatedRisk: '关联风险对象 6 个', relatedDisposal: '已产生处置任务 4 个', humanFeedback: '人工确认通过率 82%', needOptimize: false, needConfirm: false },
          { id: 'rl-06', name: '回款金额连续下降规则', type: '预警规则', scene: '还款监控', enabled: true, updatedAt: '8小时前', hits: 15, effectiveHits: 11, falsePositives: 4, hitRate: 73, fpRate: 27, conclusion: '待观察', problem: '波动较大', suggestion: '持续跟踪', validity: '基本有效', trendDesc: '近 30 天有效率波动较大', coverageDesc: '覆盖回款下降场景 68%', relatedAlert: '关联预警 5 条', relatedRisk: '关联风险对象 3 个', relatedDisposal: '已产生处置任务 1 个', humanFeedback: '暂无人工反馈', needOptimize: false, needConfirm: false },
          { id: 'rl-07', name: '发票断裂判断规则', type: '风险识别规则', scene: '经营异常', enabled: true, updatedAt: '1天前', hits: 8, effectiveHits: 3, falsePositives: 5, hitRate: 38, fpRate: 62, conclusion: '需复核', problem: '命中不足', suggestion: '发起人工复核', validity: '暂不能稳定使用', trendDesc: '近 30 天命中数极少，误报率高', coverageDesc: '覆盖发票异常场景 35%', relatedAlert: '关联预警 1 条', relatedRisk: '关联风险对象 1 个', relatedDisposal: '未产生处置任务', humanFeedback: '人工确认通过率仅 30%', needOptimize: true, needConfirm: true },
          { id: 'rl-08', name: '活跃度持续下降规则', type: '指标规则', scene: '指标监测', enabled: true, updatedAt: '2天前', hits: 12, effectiveHits: 4, falsePositives: 8, hitRate: 33, fpRate: 67, conclusion: '待优化', problem: '场景覆盖不足', suggestion: '调整口径', validity: '识别作用有限', trendDesc: '近 30 天有效命中仅 4 次', coverageDesc: '覆盖活跃下降场景 40%', relatedAlert: '关联预警 2 条', relatedRisk: '关联风险对象 2 个', relatedDisposal: '未产生处置任务', humanFeedback: '暂无人工反馈', needOptimize: true, needConfirm: false },
        ];

        const ECLR: Record<RuleEvalConclusion, string> = {
          '表现良好': 'bg-[#F0FDF4] text-[#047857] border-[#BBF7D0]',
          '基本稳定': 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
          '待观察': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
          '待优化': 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]',
          '需复核': 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]',
        };
        const TLVL: Record<TierLevel, string> = {
          '高成效规则': 'bg-[#F0FDF4] text-[#047857] border-[#BBF7D0]',
          '稳定规则': 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
          '待观察规则': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
          '待优化规则': 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]',
          '高误报规则': 'bg-[#450A0A] text-white border-[#991B1B]',
        };

        const totalRules = EVAL_RULES.length;
        const highEffRules = EVAL_RULES.filter(r => r.conclusion === '表现良好').length;
        const toOptRules = EVAL_RULES.filter(r => r.needOptimize).length;
        const highFpRules = EVAL_RULES.filter(r => r.fpRate >= 50).length;
        const lowHitRules = EVAL_RULES.filter(r => r.hitRate < 50).length;
        const needReviewRules = EVAL_RULES.filter(r => r.needConfirm).length;

        const filteredRules = EVAL_RULES.filter(r => {
          if (ruleEvalFilter === 'all') return true;
          return r.conclusion === ruleEvalFilter;
        });
        const activeRule = filteredRules.find(r => r.id === selectedRuleId) ?? filteredRules[0] ?? EVAL_RULES[0];

        return (
          <div className="space-y-3">
            <div className="flex items-center justify-end gap-2 flex-wrap">
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#BFDBFE] text-[#2563EB]"><RefreshCw size={10} />刷新评估结果</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Clock size={10} />切换统计周期</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Download size={10} />导出规则评估</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 border-[#E2E8F0] text-[#475569]"><Eye size={10} />查看评估口径</Button>
            </div>

            <KpiBar items={[
              { label: '启用规则总数', value: totalRules, hint: '纳入监控体系的规则', tone: 'info' },
              { label: '高成效规则', value: highEffRules, hint: '命中有效、质量较高', tone: 'normal' },
              { label: '待优化规则', value: toOptRules, hint: '存在明显优化空间', tone: toOptRules > 0 ? 'warn' : 'muted' },
              { label: '高误报规则', value: highFpRules, hint: '误报水平较高', tone: highFpRules > 0 ? 'risk' : 'muted' },
              { label: '低命中规则', value: lowHitRules, hint: '覆盖作用有限', tone: lowHitRules > 0 ? 'warn' : 'muted' },
              { label: '需人工复核', value: needReviewRules, hint: '存在边界判断或争议', tone: needReviewRules > 0 ? 'warn' : 'muted' },
            ]} />

            {/* 2. Rule tier board */}
            <div className="rounded-lg border border-[#E2E8F0] bg-white p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-semibold text-[#0F172A]">规则分层与成效趋势</span>
                <span className="text-[9px] text-[#94A3B8]">优先查看高误报与待优化规则的变化</span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {RULE_TIERS.map(tier => (
                  <div key={tier.level} className={cn('rounded-lg border p-2.5 space-y-1', TLVL[tier.level])}>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-semibold">{tier.level}</span>
                      <span className="text-[12px] font-bold">{tier.count}</span>
                    </div>
                    <div className="h-1 rounded-full bg-black/10 overflow-hidden"><div className="h-full rounded-full bg-current opacity-50" style={{ width: `${tier.pct}%` }} /></div>
                    <div className="text-[8px] opacity-80">占比 {tier.pct}% · {tier.trend === '上升' ? '↑' : tier.trend === '下降' ? '↓' : tier.trend === '波动' ? '~' : '→'}{tier.trend}</div>
                    <div className="text-[8px] opacity-70">主要: {tier.mainProblem}</div>
                    <div className="text-[8px] opacity-60">{tier.impact}</div>
                    <div className="text-[8px] font-medium mt-0.5">→ {tier.action}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3-column: Rule List + Detail + AI */}
            <div className="grid grid-cols-[220px_1fr] gap-3" style={{ minHeight: 480 }}>

              {/* COL 1: Rule list */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-3 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC]">
                  <span className="text-[11px] font-semibold text-[#0F172A]">规则列表</span>
                  <p className="text-[9px] text-[#94A3B8] mt-0.5">关注命中效果与误报情况</p>
                </div>
                <div className="px-2 py-1.5 border-b border-[#F1F5F9]">
                  <select className="h-5 rounded border border-[#E2E8F0] bg-[#F8FAFC] px-1 text-[9px] text-[#334155] w-full" value={ruleEvalFilter} onChange={e => setRuleEvalFilter(e.target.value)}>
                    <option value="all">全部结论</option><option value="表现良好">表现良好</option><option value="基本稳定">基本稳定</option><option value="待观察">待观察</option><option value="待优化">待优化</option><option value="需复核">需复核</option>
                  </select>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {filteredRules.map(rule => {
                    const isActive = activeRule?.id === rule.id;
                    return (
                      <div key={rule.id} onClick={() => setSelectedRuleId(rule.id)}
                        className={cn('px-3 py-2.5 border-b border-[#F1F5F9] cursor-pointer transition-all', isActive ? 'bg-[#EFF6FF] border-l-2 border-l-[#2563EB]' : 'hover:bg-[#FAFBFF]')}>
                        <div className="flex items-center justify-between mb-0.5">
                          <span className="text-[10px] font-semibold text-[#0F172A] truncate flex-1">{rule.name}</span>
                          <Badge className={cn('text-[7px] border shrink-0 ml-1', ECLR[rule.conclusion])}>{rule.conclusion}</Badge>
                        </div>
                        <div className="text-[8px] text-[#64748B] mb-0.5">{rule.type} · {rule.scene}</div>
                        <div className="flex items-center gap-1 text-[8px]">
                          <span className="text-[#0F172A]">命中{rule.hits}</span>
                          <span className="text-[#047857]">有效{rule.effectiveHits}</span>
                          <span className="text-[#DC2626]">误报{rule.falsePositives}</span>
                        </div>
                        <div className="flex items-center gap-1 mt-0.5">
                          {rule.problem !== '无' && <Badge className="text-[7px] bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]">{rule.problem}</Badge>}
                          {rule.needConfirm && <Badge className="text-[7px] bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]">需复核</Badge>}
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Button variant="outline" size="sm" className="h-5 text-[7px] px-1 gap-0.5 border-[#BFDBFE] text-[#2563EB]" onClick={e => e.stopPropagation()}>详情</Button>
                          <Button variant="ghost" size="sm" className="h-5 text-[7px] px-1 text-[#64748B]"><Star size={7} /></Button>
                        </div>
                      </div>
                    );
                  })}
                  {filteredRules.length === 0 && (
                    <div className="text-center py-8 space-y-1">
                      <CheckCircle2 size={18} className="text-[#A7F3D0] mx-auto" />
                      <div className="text-[10px] text-[#047857]">当前筛选条件下暂无命中规则</div>
                      <div className="text-[9px] text-[#94A3B8]">建议调整筛选条件后重试</div>
                    </div>
                  )}
                </div>
              </div>

              {/* COL 2: Detail & evaluation basis */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden flex flex-col">
                <div className="px-4 py-2 border-b border-[#F1F5F9] bg-[#F8FAFC] flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-[#0F172A]">规则详情与评估依据</span>
                  <div className="flex items-center gap-1.5">
                    <Badge className={cn('text-[7px] border', ECLR[activeRule.conclusion])}>{activeRule.conclusion}</Badge>
                    {activeRule.enabled && <Badge className="text-[7px] bg-[#F0FDF4] text-[#047857] border-[#BBF7D0]">启用中</Badge>}
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                  {/* Rule info */}
                  <div className="grid grid-cols-3 gap-x-3 gap-y-1 text-[9px] pb-2 border-b border-[#F1F5F9]">
                    <div><span className="text-[#94A3B8]">规则</span> <span className="text-[#0F172A] font-medium">{activeRule.name}</span></div>
                    <div><span className="text-[#94A3B8]">类型</span> <span className="text-[#0F172A]">{activeRule.type}</span></div>
                    <div><span className="text-[#94A3B8]">场景</span> <span className="text-[#0F172A]">{activeRule.scene}</span></div>
                    <div><span className="text-[#94A3B8]">更新</span> <span className="text-[#0F172A]">{activeRule.updatedAt}</span></div>
                    <div><span className="text-[#94A3B8]">有效性</span> <span className="text-[#0F172A]">{activeRule.validity}</span></div>
                    {activeRule.problem !== '无' && <div><span className="text-[#94A3B8]">问题</span> <span className="text-[#DC2626]">{activeRule.problem}</span></div>}
                  </div>

                  {/* Performance */}
                  <div>
                    <div className="text-[9px] font-semibold text-[#0F172A] mb-1.5">成效表现</div>
                    <div className="grid grid-cols-5 gap-2 mb-2">
                      {[
                        { label: '命中', value: activeRule.hits, max: 50, color: '#2563EB' },
                        { label: '有效', value: activeRule.effectiveHits, max: 50, color: '#047857' },
                        { label: '误报', value: activeRule.falsePositives, max: 50, color: '#DC2626' },
                        { label: '有效率', value: activeRule.hitRate, max: 100, color: '#2563EB', suffix: '%' },
                        { label: '误报率', value: activeRule.fpRate, max: 100, color: activeRule.fpRate >= 50 ? '#DC2626' : '#F59E0B', suffix: '%' },
                      ].map(m => (
                        <div key={m.label}>
                          <div className="text-[8px] text-[#94A3B8]">{m.label}</div>
                          <div className="text-[12px] font-bold text-[#0F172A]">{m.value}{m.suffix || ''}</div>
                          <div className="h-1 rounded-full bg-[#F1F5F9] overflow-hidden mt-0.5"><div className="h-full rounded-full" style={{ width: `${(m.value / m.max) * 100}%`, backgroundColor: m.color }} /></div>
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[9px]">
                      <div><span className="text-[#94A3B8]">趋势</span> <span className="text-[#0F172A]">{activeRule.trendDesc}</span></div>
                      <div><span className="text-[#94A3B8]">覆盖</span> <span className="text-[#0F172A]">{activeRule.coverageDesc}</span></div>
                    </div>
                  </div>

                  {/* Evaluation basis */}
                  <div className="border-t border-[#F1F5F9] pt-2">
                    <div className="text-[9px] font-semibold text-[#0F172A] mb-1.5">评估依据</div>
                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[9px]">
                      <div><span className="text-[#94A3B8]">关联预警</span> <span className="text-[#0F172A]">{activeRule.relatedAlert}</span></div>
                      <div><span className="text-[#94A3B8]">关联风险</span> <span className="text-[#0F172A]">{activeRule.relatedRisk}</span></div>
                      <div><span className="text-[#94A3B8]">关联处置</span> <span className="text-[#0F172A]">{activeRule.relatedDisposal}</span></div>
                      <div><span className="text-[#94A3B8]">人工反馈</span> <span className={activeRule.humanFeedback.includes('暂无') ? 'text-[#94A3B8]' : 'text-[#0F172A]'}>{activeRule.humanFeedback}</span></div>
                    </div>
                  </div>

                  {/* Optimization suggestion */}
                  <div className="border-t border-[#F1F5F9] pt-2">
                    <div className="text-[9px] font-semibold text-[#0F172A] mb-1">优化建议</div>
                    <p className="text-[9px] text-[#475569] leading-4">
                      {activeRule.fpRate >= 50
                        ? '建议优先优化高误报条件或补充边界反馈样本，以提升规则在当前场景下的识别稳定性。'
                        : activeRule.hitRate < 50
                          ? '该规则当前命中不足，建议扩展识别口径或补充场景覆盖，并结合人工反馈校准判断条件。'
                          : '该规则当前命中表现稳定，能够持续支撑预警与风险识别，建议继续观察其后续场景覆盖情况。'
                      }
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5 border-t border-[#F1F5F9] pt-2 flex-wrap">
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#BFDBFE] text-[#2563EB]"><Eye size={9} />关联结果</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]"><FileCheck2 size={9} />人工反馈</Button>
                    {activeRule.needOptimize && <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#FCA5A5] text-[#DC2626]"><Settings size={9} />发起优化</Button>}
                    {activeRule.needConfirm && <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#DDD6FE] text-[#7C3AED]"><UserCheck size={9} />人工确认</Button>}
                    <Button variant="outline" size="sm" className="h-6 text-[9px] gap-1 border-[#E2E8F0] text-[#475569]"><Plus size={9} />加入优化清单</Button>
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

  const renderAiPanel = () => {
    const titles: Record<string, string> = {
      warning: 'AI 预警规则引导',
      signals: 'AI 信号捕获引导',
      actions: 'AI 风险处置引导',
      probe: 'AI 风险探针引导',
      quality: 'AI 质量巡检引导',
    };
    const guides: Record<string, string> = {
      warning: '当前步骤：预警规则。配置和管理风险预警规则，系统实时监控触发条件。关注高优先级预警，及时响应阻断信号。',
      signals: '当前步骤：信号捕获。实时捕获来自工商、司法、舆情等多维度风险信号，自动关联至存量客户。重点处理强关联信号。',
      actions: '当前步骤：风险处置。对触发预警的主体执行风险排查与处置动作，生成处置方案。优先处理阻断类预警。',
      probe: '当前步骤：风险探针。通过深度探针对目标主体进行穿透式风险扫描，识别隐蔽关联和交叉违约风险。',
      quality: '当前步骤：质量巡检。定期巡检存量资产质量，监控逾期、违约和评级变动。关注批量异常指标。',
    };
    const nextSteps: Record<string, { label: string; target: string }[]> = {
      warning: [{ label: '查看信号捕获', target: 'signals' }, { label: '风险处置', target: 'actions' }],
      signals: [{ label: '风险处置', target: 'actions' }, { label: '风险探针', target: 'probe' }],
      actions: [{ label: '风险探针', target: 'probe' }, { label: '质量巡检', target: 'quality' }],
      probe: [{ label: '质量巡检', target: 'quality' }, { label: '返回信号捕获', target: 'signals' }],
      quality: [{ label: '返回预警规则', target: 'warning' }, { label: '风险探针', target: 'probe' }],
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
    <SceneLayout title={scene.title} modules={scene.modules} activeModule={activeModule} onModuleChange={onModuleChange} aiPanel={renderAiPanel()}>
      {renderContent()}
    </SceneLayout>
  );
}
