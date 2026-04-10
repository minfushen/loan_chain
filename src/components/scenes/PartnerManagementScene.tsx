import React, { useState } from 'react';
import SceneLayout from '../SceneLayout';
import { SCENES } from '../../constants';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Database,
  Eye,
  FileCheck2,
  Filter,
  Layers,
  Lightbulb,
  Link2,
  Loader2,
  PauseCircle,
  Play,
  Search,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDemo } from '../../demo/DemoContext';

/* ══════════════════════════════════════════════════════════════════
   Shared Primitives
   ══════════════════════════════════════════════════════════════════ */

function MetricStrip({ items }: { items: { label: string; value: number | string; tone?: 'default' | 'green' | 'amber' | 'red' }[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {items.map(m => {
        const border = m.tone === 'red' ? 'border-red-200' : m.tone === 'amber' ? 'border-amber-200' : m.tone === 'green' ? 'border-emerald-200' : 'border-border';
        const valColor = m.tone === 'red' ? 'text-red-600' : m.tone === 'amber' ? 'text-amber-600' : m.tone === 'green' ? 'text-emerald-600' : 'text-foreground';
        return (
          <div key={m.label} className={cn('rounded-xl border bg-card px-4 py-3 shadow-sm', border)}>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{m.label}</div>
            <div className={cn('text-xl font-bold mt-0.5', valColor)}>{m.value}</div>
          </div>
        );
      })}
    </div>
  );
}

function SectionShell({ title, subtitle, right, children, className }: { title: string; subtitle?: string; right?: React.ReactNode; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-[20px] border border-border bg-card p-5 shadow-sm', className)}>
      <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
        <div>
          <div className="text-[14px] font-semibold text-foreground">{title}</div>
          {subtitle && <div className="mt-0.5 text-[11px] text-muted-foreground leading-4">{subtitle}</div>}
        </div>
        {right}
      </div>
      {children}
    </div>
  );
}

function TodoItem({ text, priority, module }: { text: string; priority: '高' | '中' | '低'; module: string }) {
  const pColor = priority === '高' ? 'bg-red-100 text-red-700 border-red-200' : priority === '中' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200';
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 shadow-sm hover:shadow-md transition-shadow">
      <Badge className={cn('text-[9px] border shrink-0', pColor)}>{priority}</Badge>
      <div className="flex-1 min-w-0">
        <div className="text-[12px] font-medium text-foreground truncate">{text}</div>
        <div className="text-[10px] text-muted-foreground mt-0.5">影响: {module}</div>
      </div>
      <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2 shrink-0"><ArrowRight size={10} /></Button>
    </div>
  );
}

function ImpactRow({ problem, impact, action }: { problem: string; impact: string; action: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50/30 px-4 py-3 shadow-sm">
      <AlertTriangle size={14} className="text-amber-500 mt-0.5 shrink-0" />
      <div className="flex-1 min-w-0 space-y-1">
        <div className="text-[12px] font-semibold text-foreground">{problem}</div>
        <div className="text-[11px] text-muted-foreground">影响: {impact}</div>
        <div className="text-[11px] text-primary font-medium">建议: {action}</div>
      </div>
    </div>
  );
}

function StatusDot({ state }: { state: 'running' | 'pending' | 'error' | 'disabled' }) {
  const cfg = { running: { cls: 'bg-emerald-500', label: '运行中' }, pending: { cls: 'bg-amber-500', label: '待校验' }, error: { cls: 'bg-red-500', label: '异常' }, disabled: { cls: 'bg-slate-300', label: '待启用' } };
  const c = cfg[state];
  return (<div className="flex items-center gap-1.5"><div className={cn('w-2 h-2 rounded-full', c.cls)} /><span className="text-[10px] text-muted-foreground">{c.label}</span></div>);
}

function MatrixCell({ state }: { state: 'core' | 'assist' | 'enhance' | 'missing' }) {
  const cfg = { core: { bg: 'bg-blue-600', label: '核心' }, assist: { bg: 'bg-blue-300', label: '辅助' }, enhance: { bg: 'bg-amber-300', label: '增强' }, missing: { bg: 'bg-slate-200', label: '—' } };
  const c = cfg[state];
  return (
    <div className="flex items-center justify-center">
      <div className={cn('w-full py-1 rounded text-center text-[9px] font-medium', c.bg, state === 'missing' ? 'text-muted-foreground' : 'text-white')}>{c.label}</div>
    </div>
  );
}

function KanbanColumn({ title, icon, items, tone }: { title: string; icon: React.ReactNode; items: { text: string; owner: string }[]; tone: 'slate' | 'blue' | 'amber' | 'green' }) {
  const hBg = tone === 'green' ? 'bg-emerald-50' : tone === 'blue' ? 'bg-blue-50' : tone === 'amber' ? 'bg-amber-50' : 'bg-slate-50';
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className={cn('px-4 py-2.5 flex items-center gap-2', hBg)}>
        {icon}
        <span className="text-[12px] font-semibold text-foreground">{title}</span>
        <Badge variant="secondary" className="text-[9px] ml-auto">{items.length}</Badge>
      </div>
      <div className="p-3 space-y-2">
        {items.map(item => (
          <div key={item.text} className="rounded-lg border border-border bg-muted/20 px-3 py-2">
            <div className="text-[11px] text-foreground leading-4">{item.text}</div>
            <div className="text-[9px] text-muted-foreground mt-1">{item.owner}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SystemHint({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 px-5 py-3">
      <p className="text-[11px] text-muted-foreground leading-4">{text}</p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════════════════════ */

interface Props { activeModule: string; onModuleChange: (id: string) => void }

export default function PartnerManagementScene({ activeModule, onModuleChange }: Props) {
  const scene = SCENES.find(s => s.id === 'partner-management')!;
  const { active } = useDemo();
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  const renderContent = () => {
    switch (activeModule) {

      /* ═══════════════════════════════════════════════════════════
         页面 2：数据源配置
         ═══════════════════════════════════════════════════════════ */
      case 'sources': {
        const allSources = [
          { name: '客户主档', domain: '客户主数据', source: 'CRM / MDM', method: '批量同步', freq: '每日', required: true, state: 'running' as const, impact: '客群识别 / 资产池 / 审批', next: '维护中' },
          { name: '对公账户与流水', domain: '账户与流水', source: '核心账务 / 对公结算', method: '批量同步 + 增量', freq: '日内 / T+1', required: true, state: 'running' as const, impact: '识别 / 审批 / 风险监控', next: '维护中' },
          { name: '回款与现金流', domain: '回款与现金流', source: '核心账务 / 回款监测', method: '批量同步', freq: 'T+1', required: true, state: 'running' as const, impact: '审批 / 风险监控 / 贷后', next: '口径统一中' },
          { name: '存量授信与还款表现', domain: '存量授信', source: '统一信贷平台 / 授信管理', method: '批量同步', freq: '每日', required: true, state: 'running' as const, impact: '资产池 / 审批 / 风险监控', next: '维护中' },
          { name: '公私联动 / 交易对手', domain: '公私联动', source: '统一信贷 / CRM / 流水分析', method: '批量同步', freq: '周', required: true, state: 'pending' as const, impact: '客群识别 / 审批 / 图谱', next: '口径待统一' },
          { name: '风险与贷后监测', domain: '风险监测', source: '风险监控平台 / 预警系统', method: '事件推送', freq: '实时', required: true, state: 'running' as const, impact: '风险监控 / 贷后', next: '维护中' },
          { name: '订单与合同材料', domain: '替代证据', source: '补审材料库 / 文档管理', method: '文件导入', freq: '按批次', required: false, state: 'running' as const, impact: '补审作业', next: '维护中' },
          { name: '物流签收数据', domain: '替代证据', source: '物流协同接口', method: '接口 / 文件导入', freq: '按场景', required: false, state: 'disabled' as const, impact: '补审 / 风险监控', next: '接口联调中' },
          { name: '回单与协同证明', domain: '替代证据', source: '回单归档平台', method: '文件导入', freq: '按场景', required: false, state: 'disabled' as const, impact: '补审 / 风险监控', next: '待启用' },
          { name: '工商登记信息', domain: '外部增强', source: '征信 / 工商接口', method: '接口直连', freq: '按需', required: false, state: 'disabled' as const, impact: '准入排查', next: '待评估' },
          { name: '司法风险数据', domain: '外部增强', source: '司法接口', method: '接口直连', freq: '周', required: false, state: 'disabled' as const, impact: '风险监控', next: '待采购' },
        ];
        const filtered = sourceFilter === 'all' ? allSources : sourceFilter === 'required' ? allSources.filter(s => s.required) : allSources.filter(s => !s.required);

        return (
          <div className="space-y-6">
            <SystemHint text="当前页面展示系统运行所需的最小数据资源包与增强数据项，以及各数据源的接入方式与配置状态。" />

            {/* A. 最小内部数据资源包 */}
            <SectionShell title="最小内部数据资源包" subtitle="脱核链贷运行所需的必备数据域，缺任何一项将影响主流程">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {allSources.filter(s => s.required).map(s => (
                  <div key={s.name} className="rounded-xl border border-blue-200 bg-blue-50/30 px-4 py-3 shadow-sm">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[12px] font-semibold text-foreground">{s.name}</span>
                      <Badge className="text-[9px] bg-blue-100 text-blue-700 border-blue-200 border">必需</Badge>
                    </div>
                    <div className="text-[10px] text-muted-foreground space-y-0.5">
                      <div>来源: {s.source}</div>
                      <div>接入: {s.method} · {s.freq}</div>
                      <div>支撑: {s.impact}</div>
                    </div>
                    <div className="mt-2"><StatusDot state={s.state} /></div>
                  </div>
                ))}
              </div>
            </SectionShell>

            {/* B. 增强数据资源包 */}
            <SectionShell title="增强数据资源包" subtitle="非启动前提，按场景和收益优先级逐步引入">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
                {allSources.filter(s => !s.required).map(s => (
                  <div key={s.name} className="rounded-xl border border-dashed border-amber-300 bg-amber-50/20 px-4 py-3 shadow-sm">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[12px] font-semibold text-foreground">{s.name}</span>
                      <Badge className="text-[9px] bg-amber-100 text-amber-700 border-amber-200 border">增强</Badge>
                    </div>
                    <div className="text-[10px] text-muted-foreground space-y-0.5">
                      <div>来源: {s.source}</div>
                      <div>接入: {s.method} · {s.freq}</div>
                      <div>支撑: {s.impact}</div>
                    </div>
                    <div className="mt-2"><StatusDot state={s.state} /></div>
                  </div>
                ))}
              </div>
            </SectionShell>

            {/* C. 数据源配置台账 */}
            <SectionShell
              title="数据源配置台账"
              right={
                <div className="flex items-center gap-2">
                  {[{ id: 'all', label: '全部' }, { id: 'required', label: '必需' }, { id: 'enhanced', label: '增强' }].map(f => (
                    <Button key={f.id} variant={sourceFilter === f.id ? 'default' : 'outline'} size="sm" className="h-6 text-[10px] px-2.5" onClick={() => setSourceFilter(f.id)}>{f.label}</Button>
                  ))}
                </div>
              }
            >
              <div className="rounded-xl border border-border overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="bg-muted/40 border-b border-border">
                      {['数据源', '数据域', '来源系统', '接入方式', '频率', '必需/增强', '状态', '影响业务', '下一步', '操作'].map(h => (
                        <th key={h} className="text-left px-3 py-2.5 font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(row => (
                      <tr key={row.name} className="border-b border-border last:border-b-0 hover:bg-muted/20">
                        <td className="px-3 py-2.5 font-medium text-foreground whitespace-nowrap">{row.name}</td>
                        <td className="px-3 py-2.5 text-muted-foreground">{row.domain}</td>
                        <td className="px-3 py-2.5 text-muted-foreground">{row.source}</td>
                        <td className="px-3 py-2.5 text-muted-foreground">{row.method}</td>
                        <td className="px-3 py-2.5 text-muted-foreground">{row.freq}</td>
                        <td className="px-3 py-2.5"><Badge className={cn('text-[9px] border', row.required ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-amber-100 text-amber-700 border-amber-200')}>{row.required ? '必需' : '增强'}</Badge></td>
                        <td className="px-3 py-2.5"><StatusDot state={row.state} /></td>
                        <td className="px-3 py-2.5 text-muted-foreground">{row.impact}</td>
                        <td className="px-3 py-2.5 text-foreground font-medium">{row.next}</td>
                        <td className="px-3 py-2.5">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" className="h-5 text-[9px] px-1.5"><Eye size={10} className="mr-0.5" />详情</Button>
                            <Button variant="ghost" size="sm" className="h-5 text-[9px] px-1.5"><Play size={10} className="mr-0.5" />校验</Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionShell>
          </div>
        );
      }

      /* ═══════════════════════════════════════════════════════════
         页面 3：能力映射
         ═══════════════════════════════════════════════════════════ */
      case 'capability-map': {
        type S = 'core' | 'assist' | 'enhance' | 'missing';
        const matrix: { data: string; cols: S[] }[] = [
          { data: '客户主档',     cols: ['core',    'assist',  'missing', 'missing', 'missing'] },
          { data: '对公流水',     cols: ['core',    'core',    'assist',  'core',    'missing'] },
          { data: '回款数据',     cols: ['missing', 'core',    'core',    'core',    'assist']  },
          { data: '授信台账',     cols: ['assist',  'core',    'assist',  'assist',  'core']    },
          { data: '风险预警',     cols: ['missing', 'missing', 'missing', 'core',    'core']    },
          { data: '公私联动',     cols: ['core',    'assist',  'assist',  'missing', 'missing'] },
          { data: '订单材料',     cols: ['missing', 'assist',  'core',    'missing', 'missing'] },
          { data: '物流签收',     cols: ['missing', 'missing', 'enhance', 'enhance', 'missing'] },
          { data: '回单证明',     cols: ['missing', 'missing', 'enhance', 'enhance', 'missing'] },
        ];
        const bizCols = ['客群识别', '产品匹配', '补审作业', '风险监控', '贷后经营'];

        return (
          <div className="space-y-6">
            <SystemHint text="本页从数据域与业务能力的交叉关系出发，展示当前哪些能力已具备、哪些依赖补强、缺失会影响什么。" />

            {/* A. 能力矩阵 */}
            <SectionShell title="业务能力矩阵" subtitle="数据域 × 业务模块的支撑关系">
              <div className="rounded-xl border border-border overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="bg-muted/40 border-b border-border">
                      <th className="text-left px-3 py-2.5 font-medium text-muted-foreground w-28">数据域</th>
                      {bizCols.map(c => <th key={c} className="text-center px-2 py-2.5 font-medium text-muted-foreground">{c}</th>)}
                    </tr>
                  </thead>
                  <tbody>
                    {matrix.map(row => (
                      <tr key={row.data} className="border-b border-border last:border-b-0">
                        <td className="px-3 py-2 font-medium text-foreground whitespace-nowrap">{row.data}</td>
                        {row.cols.map((s, i) => <td key={i} className="px-2 py-2"><MatrixCell state={s} /></td>)}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center gap-4 mt-3 text-[10px] text-muted-foreground">
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-blue-600" />核心支撑</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-blue-300" />辅助支撑</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-amber-300" />可选增强</div>
                <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-slate-200" />暂未覆盖</div>
              </div>
            </SectionShell>

            {/* B. 缺失影响说明 */}
            <SectionShell title="缺失影响说明" subtitle="如果缺少某类数据，对业务的具体影响">
              <div className="space-y-3">
                <ImpactRow problem="缺少回款数据" impact="补审可信度下降，风险监控中回款异常检测失效" action="统一回款口径，确保 T+1 更新稳定" />
                <ImpactRow problem="缺少物流签收" impact="履约真实性补强不足，三流验证缺一环" action="完成物流协同接口联调，试点场景优先" />
                <ImpactRow problem="缺少交易对手映射" impact="链条识别关系强度下降，桥接主体发现困难" action="补充高频对手映射口径，对接流水分析平台" />
                <ImpactRow problem="缺少回单证明" impact="资金回流验证不完整，贷后恢复判断依据不足" action="纳入试点场景补审材料库" />
              </div>
            </SectionShell>

            {/* C. 当前能力成熟度 */}
            <SectionShell title="当前能力成熟度">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                {[
                  { cap: '基础识别', status: '已具备', tone: 'green' as const, desc: '客户主档 + 流水 + 公私联动已可支撑潜客发现' },
                  { cap: '产品匹配', status: '已具备', tone: 'green' as const, desc: '流水 + 回款 + 授信台账已可支撑产品推荐' },
                  { cap: '脱核补审', status: '需补强', tone: 'amber' as const, desc: '依赖订单/物流/回单等替代证据补强' },
                  { cap: '风险监控', status: '已具备', tone: 'green' as const, desc: '交易 + 预警 + 回款异常已可基础监控' },
                  { cap: '恢复经营', status: '待完善', tone: 'amber' as const, desc: '还款表现可用，恢复观察依赖贷后数据完善' },
                ].map(c => {
                  const border = c.tone === 'green' ? 'border-emerald-200' : 'border-amber-200';
                  const badge = c.tone === 'green' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' : 'bg-amber-100 text-amber-700 border-amber-200';
                  return (
                    <Card key={c.cap} className={cn('border shadow-sm', border)}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[12px] font-semibold text-foreground">{c.cap}</span>
                          <Badge className={cn('text-[9px] border', badge)}>{c.status}</Badge>
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-4">{c.desc}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </SectionShell>
          </div>
        );
      }

      /* ═══════════════════════════════════════════════════════════
         页面 4：推进与缺口
         ═══════════════════════════════════════════════════════════ */
      case 'gaps':
        return (
          <div className="space-y-6">
            <SystemHint text="本页展示数据与接入的推进阶段、已完成项、当前缺口分类、任务台账和阻塞影响，面向实施与交付协同。" />

            {/* A. 当前阶段摘要 */}
            <SectionShell title="当前阶段摘要">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { phase: '基础数据底座', status: '已完成', icon: <CheckCircle2 size={14} className="text-emerald-600" />, desc: '客户主档、对公流水、授信台账、风险预警已形成稳定接入', tone: 'border-emerald-200 bg-emerald-50/30' },
                  { phase: '场景增强数据', status: '推进中', icon: <Loader2 size={14} className="text-blue-600" />, desc: '物流签收、订单材料、回款口径统一等增强项按场景推进', tone: 'border-blue-200 bg-blue-50/30' },
                  { phase: '风险与贷后补强', status: '规划中', icon: <PauseCircle size={14} className="text-slate-500" />, desc: '恢复观察、回单协同、仓储周转等数据待评估接入价值', tone: 'border-slate-200 bg-slate-50/30' },
                ].map(p => (
                  <Card key={p.phase} className={cn('border shadow-sm', p.tone)}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">{p.icon}<span className="text-[13px] font-semibold text-foreground">{p.phase}</span></div>
                      <Badge variant="secondary" className="text-[9px] mb-2">{p.status}</Badge>
                      <p className="text-[11px] text-muted-foreground leading-4">{p.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </SectionShell>

            {/* B. 已完成项 */}
            <SectionShell title="已完成项">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
                {['客户主档日批同步', '对公流水增量更新', '回款记录 T+1 同步', '授信台账每日同步', '风险预警实时推送', '订单材料导入通道'].map(item => (
                  <div key={item} className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50/30 px-3 py-2">
                    <CheckCircle2 size={12} className="text-emerald-500 shrink-0" />
                    <span className="text-[11px] text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </SectionShell>

            {/* C. 当前缺口 */}
            <SectionShell title="当前缺口" subtitle="按影响的业务域分类">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { category: '识别缺口', items: ['交易对手映射覆盖不足', '公私联动口径待统一'], tone: 'border-blue-200 bg-blue-50/30' },
                  { category: '审批缺口', items: ['物流签收接口未启用', '回单协同数据待引入', '回款口径不统一'], tone: 'border-amber-200 bg-amber-50/30' },
                  { category: '风险缺口', items: ['仓储周转数据缺失', '行业舆情未接入', '司法风险接口待采购'], tone: 'border-red-200 bg-red-50/30' },
                ].map(g => (
                  <Card key={g.category} className={cn('border shadow-sm', g.tone)}>
                    <CardContent className="p-4">
                      <div className="text-[13px] font-semibold text-foreground mb-3">{g.category}</div>
                      <div className="space-y-1.5">
                        {g.items.map(item => (
                          <div key={item} className="flex items-center gap-2 text-[11px] text-foreground">
                            <CircleDot size={10} className="text-muted-foreground shrink-0" />{item}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </SectionShell>

            {/* D. 推进任务台账 */}
            <SectionShell title="推进任务台账">
              <div className="rounded-xl border border-border overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="bg-muted/40 border-b border-border">
                      {['任务项', '所属阶段', '优先级', '状态', '责任人', '预计完成'].map(h => (
                        <th key={h} className="text-left px-3 py-2.5 font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { task: '回款口径统一治理', phase: '增强', priority: '高' as const, status: '推进中', owner: '数据团队', eta: '第 14 周' },
                      { task: '交易对手映射补全', phase: '基础', priority: '高' as const, status: '推进中', owner: '数据团队', eta: '第 15 周' },
                      { task: '物流签收接口联调', phase: '增强', priority: '高' as const, status: '推进中', owner: '合作方', eta: '第 14 周' },
                      { task: '公私联动口径校验', phase: '基础', priority: '中' as const, status: '待验证', owner: '数据团队', eta: '第 16 周' },
                      { task: '代发工资稳定性验证', phase: '基础', priority: '中' as const, status: '待验证', owner: '数据团队', eta: '第 15 周' },
                      { task: '仓储数据合作方评估', phase: '增强', priority: '低' as const, status: '待启动', owner: '产品团队', eta: '第 18 周' },
                      { task: '司法风险接口采购', phase: '增强', priority: '低' as const, status: '待启动', owner: '采购', eta: '第 20 周' },
                    ].map(row => {
                      const pColor = row.priority === '高' ? 'bg-red-100 text-red-700 border-red-200' : row.priority === '中' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200';
                      const sColor = row.status === '推进中' ? 'text-blue-600' : row.status === '待验证' ? 'text-amber-600' : 'text-muted-foreground';
                      return (
                        <tr key={row.task} className="border-b border-border last:border-b-0 hover:bg-muted/20">
                          <td className="px-3 py-2.5 font-medium text-foreground">{row.task}</td>
                          <td className="px-3 py-2.5 text-muted-foreground">{row.phase}</td>
                          <td className="px-3 py-2.5"><Badge className={cn('text-[9px] border', pColor)}>{row.priority}</Badge></td>
                          <td className={cn('px-3 py-2.5 font-medium', sColor)}>{row.status}</td>
                          <td className="px-3 py-2.5 text-muted-foreground">{row.owner}</td>
                          <td className="px-3 py-2.5 text-muted-foreground">{row.eta}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </SectionShell>

            {/* E. 阻塞影响 */}
            <SectionShell title="阻塞影响" subtitle="当前缺口对业务主流程的实际阻塞评估">
              <div className="space-y-3">
                <ImpactRow problem="回款口径不统一" impact="补审建议准确度下降，风险回款异常检测误差增大" action="本周内完成口径统一方案评审" />
                <ImpactRow problem="物流签收接口未启用" impact="三流验证缺一环，补审通过率受限" action="联调完成后优先在试点场景启用" />
                <ImpactRow problem="交易对手映射不完整" impact="桥接主体识别遗漏，链路关系强度评估偏低" action="扩大对公流水对手方解析范围" />
              </div>
              <div className="mt-4 rounded-xl border border-border bg-muted/20 px-4 py-3">
                <div className="flex items-start gap-2 text-[11px] text-muted-foreground">
                  <Lightbulb size={12} className="mt-0.5 shrink-0" />
                  <span>暂不影响主流程的缺口（仓储周转、行业舆情、司法风险）可后置到第二阶段，不阻塞当前试点运行。</span>
                </div>
              </div>
            </SectionShell>
          </div>
        );

      /* ═══════════════════════════════════════════════════════════
         页面 1：接入工作台 (default)
         ═══════════════════════════════════════════════════════════ */
      default:
        return (
          <div className="space-y-6">
            <SystemHint text="当前系统已具备行内数据底座，增强数据按收益优先级分批接入。" />

            {/* A. 接入状态摘要 */}
            <MetricStrip items={[
              { label: '已接入', value: 11, tone: 'default' },
              { label: '运行中', value: 7, tone: 'green' },
              { label: '待校验', value: 2, tone: 'amber' },
              { label: '待启用', value: 4, tone: 'default' },
              { label: '影响业务', value: 3, tone: 'red' },
            ]} />

            {/* B. 当前待办 */}
            <SectionShell title="当前待办" subtitle="按优先级排列，优先处理影响主流程的接入问题">
              <div className="space-y-2">
                <TodoItem text="回款口径不统一，影响补审建议与风险监控准确度" priority="高" module="产品与审批 / 风险监控" />
                <TodoItem text="物流签收接口联调未完成，三流验证缺一环" priority="高" module="补审作业 / 风险监控" />
                <TodoItem text="交易对手映射覆盖不足，链路识别关系强度偏低" priority="高" module="客群识别 / 审批补强" />
                <TodoItem text="公私联动数据口径待统一，交叉验证质量波动" priority="中" module="客群识别" />
                <TodoItem text="代发工资更新稳定性待验证" priority="中" module="客群识别" />
                <TodoItem text="仓储周转数据评估合作方" priority="低" module="风险监控" />
              </div>
            </SectionShell>

            {/* C. 影响业务 */}
            <SectionShell title="影响业务" subtitle="当前接入问题对核心业务流程的直接影响">
              <div className="space-y-3">
                <ImpactRow
                  problem="回款口径不统一"
                  impact="补审建议准确度下降，风险回款异常检测误差增大"
                  action="统一回款口径，确保 T+1 更新稳定"
                />
                <ImpactRow
                  problem="物流签收接口未启用"
                  impact="履约真实性补强不足，补审三流验证只覆盖两流"
                  action="完成接口联调，试点场景优先启用"
                />
                <ImpactRow
                  problem="交易对手映射覆盖不足"
                  impact="桥接主体识别遗漏，链路关系强度判断偏低"
                  action="扩大对公流水对手方解析范围，补充映射口径"
                />
              </div>
            </SectionShell>

            {/* D. 重点数据源运行列表 */}
            <SectionShell title="重点数据源运行状态" subtitle="仅展示影响主流程的关键数据源">
              <div className="rounded-xl border border-border overflow-x-auto">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="bg-muted/40 border-b border-border">
                      {['数据源', '状态', '最近同步', '影响业务', '下一步动作', '操作'].map(h => (
                        <th key={h} className="text-left px-3 py-2.5 font-medium text-muted-foreground whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: '回款与现金流', state: 'running' as const, sync: '今日 06:30', impact: '审批 / 风险监控 / 贷后', next: '口径统一治理中' },
                      { name: '公私联动 / 交易对手', state: 'pending' as const, sync: '上周四', impact: '客群识别 / 审批 / 图谱', next: '口径待统一' },
                      { name: '物流签收', state: 'disabled' as const, sync: '—', impact: '补审作业 / 风险监控', next: '接口联调中' },
                      { name: '客户主档', state: 'running' as const, sync: '今日 05:00', impact: '识别 / 资产池 / 审批', next: '运行正常' },
                      { name: '对公流水', state: 'running' as const, sync: '今日 07:15', impact: '识别 / 审批 / 风险监控', next: '运行正常' },
                      { name: '存量授信台账', state: 'running' as const, sync: '今日 06:00', impact: '资产池 / 审批 / 风险', next: '运行正常' },
                    ].map(row => (
                      <tr key={row.name} className="border-b border-border last:border-b-0 hover:bg-muted/20">
                        <td className="px-3 py-2.5 font-medium text-foreground whitespace-nowrap">{row.name}</td>
                        <td className="px-3 py-2.5"><StatusDot state={row.state} /></td>
                        <td className="px-3 py-2.5 text-muted-foreground">{row.sync}</td>
                        <td className="px-3 py-2.5 text-muted-foreground">{row.impact}</td>
                        <td className="px-3 py-2.5 text-foreground font-medium">{row.next}</td>
                        <td className="px-3 py-2.5">
                          <Button variant="ghost" size="sm" className="h-5 text-[9px] px-1.5"><Eye size={10} className="mr-0.5" />详情</Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionShell>
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
