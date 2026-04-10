import React from 'react';
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
  FileCheck2,
  Layers,
  Lightbulb,
  Link2,
  Loader2,
  PauseCircle,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDemo } from '../../demo/DemoContext';

/* ────────────────────────────────────────────────────────────────
   Shared layout primitives — 遵循统一 Figma 布局规范
   ──────────────────────────────────────────────────────────────── */

function SceneHeader({ title, subtitle, judgment }: { title: string; subtitle: string; judgment: string }) {
  return (
    <div className="rounded-[20px] border border-border bg-card px-6 py-5 shadow-sm" style={{ minHeight: 96 }}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-bold text-foreground tracking-tight">{title}</h2>
          <p className="mt-1 text-[13px] text-muted-foreground leading-5">{subtitle}</p>
        </div>
      </div>
      <div className="mt-3 flex items-start gap-2 rounded-xl border border-primary/20 bg-primary/5 px-4 py-2.5">
        <Sparkles size={14} className="text-primary mt-0.5 shrink-0" />
        <p className="text-[12px] leading-5 text-foreground">{judgment}</p>
      </div>
    </div>
  );
}

function SectionShell({ title, subtitle, children, className }: { title: string; subtitle?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('rounded-[20px] border border-border bg-card p-5 shadow-sm', className)}>
      <div className="mb-4">
        <div className="text-[14px] font-semibold text-foreground">{title}</div>
        {subtitle && <div className="mt-0.5 text-[11px] text-muted-foreground leading-4">{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}

function DataAssetCard({ title, source, coverage, modules }: { title: string; source: string; coverage: string; modules: string }) {
  return (
    <Card className="border border-border shadow-sm hover:shadow-md transition-shadow" style={{ minHeight: 180 }}>
      <CardContent className="p-5 space-y-3">
        <div className="text-[13px] font-semibold text-foreground">{title}</div>
        <div className="space-y-2 text-[11px]">
          <div><span className="text-muted-foreground">来源系统</span><p className="mt-0.5 text-foreground leading-4">{source}</p></div>
          <div><span className="text-muted-foreground">当前覆盖</span><p className="mt-0.5 text-foreground leading-4">{coverage}</p></div>
          <div className="flex items-start gap-1.5">
            <span className="text-muted-foreground shrink-0">支撑模块</span>
            <div className="flex flex-wrap gap-1 mt-0.5">
              {modules.split(' / ').map(m => (
                <Badge key={m} variant="secondary" className="text-[9px] rounded-full px-1.5 py-0">{m}</Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function EnhancedDataCard({ title, source, status, modules }: { title: string; source: string; status: string; modules: string }) {
  return (
    <Card className="border border-dashed border-amber-300 bg-amber-50/30 shadow-sm" style={{ minHeight: 160 }}>
      <CardContent className="p-5 space-y-2.5">
        <div className="text-[13px] font-semibold text-foreground">{title}</div>
        <div className="space-y-1.5 text-[11px]">
          <div><span className="text-muted-foreground">来源系统: </span><span className="text-foreground">{source}</span></div>
          <div><span className="text-muted-foreground">当前状态: </span><span className="text-foreground">{status}</span></div>
          <div><span className="text-muted-foreground">支撑模块: </span><span className="text-foreground">{modules}</span></div>
        </div>
      </CardContent>
    </Card>
  );
}

function CoverageRow({ module, desc }: { module: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-muted/20 px-4 py-3">
      <CheckCircle2 size={14} className="text-emerald-500 mt-0.5 shrink-0" />
      <div>
        <div className="text-[12px] font-semibold text-foreground">{module}</div>
        <div className="mt-0.5 text-[11px] text-muted-foreground leading-4">{desc}</div>
      </div>
    </div>
  );
}

function StatusDot({ state }: { state: 'running' | 'pending' | 'disabled' }) {
  const cls = state === 'running' ? 'bg-emerald-500' : state === 'pending' ? 'bg-amber-500' : 'bg-slate-300';
  const label = state === 'running' ? '运行中' : state === 'pending' ? '待启用' : '未接入';
  return (
    <div className="flex items-center gap-1.5">
      <div className={cn('w-2 h-2 rounded-full', cls)} />
      <span className="text-[10px] text-muted-foreground">{label}</span>
    </div>
  );
}

function CapabilityLayerCard({ title, desc, tone }: { title: string; desc: string; tone: 'blue' | 'green' | 'amber' }) {
  const border = tone === 'blue' ? 'border-blue-200' : tone === 'green' ? 'border-emerald-200' : 'border-amber-200';
  const bg = tone === 'blue' ? 'bg-blue-50/50' : tone === 'green' ? 'bg-emerald-50/50' : 'bg-amber-50/50';
  const dot = tone === 'blue' ? 'bg-blue-500' : tone === 'green' ? 'bg-emerald-500' : 'bg-amber-500';
  return (
    <Card className={cn('border shadow-sm', border, bg)} style={{ minHeight: 120 }}>
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <div className={cn('w-2.5 h-2.5 rounded-full', dot)} />
          <span className="text-[13px] font-semibold text-foreground">{title}</span>
        </div>
        <p className="text-[11px] leading-5 text-muted-foreground">{desc}</p>
      </CardContent>
    </Card>
  );
}

function BusinessModuleCard({ title, data, source, role }: { title: string; data: string; source: string; role: string }) {
  return (
    <Card className="border border-border shadow-sm hover:shadow-md transition-shadow" style={{ minHeight: 200 }}>
      <CardContent className="p-5 space-y-3">
        <div className="text-[14px] font-bold text-foreground">{title}</div>
        <div className="space-y-2 text-[11px]">
          <div><span className="text-muted-foreground">主要数据</span><p className="mt-0.5 text-foreground leading-4">{data}</p></div>
          <div><span className="text-muted-foreground">来源系统</span><p className="mt-0.5 text-foreground leading-4">{source}</p></div>
          <div><span className="text-muted-foreground">当前作用</span><p className="mt-0.5 text-foreground leading-4">{role}</p></div>
        </div>
      </CardContent>
    </Card>
  );
}

function GapRow({ name, domain, source, modules, severity, action }: { name: string; domain: string; source: string; modules: string; severity: '高' | '中' | '低'; action: string }) {
  const sev = severity === '高' ? 'bg-red-100 text-red-700 border-red-200' : severity === '中' ? 'bg-amber-100 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200';
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
        <span className="text-[13px] font-semibold text-foreground">{name}</span>
        <Badge className={cn('text-[10px] border', sev)}>{severity}</Badge>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[11px] mb-2.5">
        <div><span className="text-muted-foreground">数据域</span><div className="text-foreground">{domain}</div></div>
        <div><span className="text-muted-foreground">来源系统</span><div className="text-foreground">{source}</div></div>
        <div><span className="text-muted-foreground">影响模块</span><div className="text-foreground">{modules}</div></div>
        <div><span className="text-muted-foreground">下一步</span><div className="text-foreground font-medium">{action}</div></div>
      </div>
    </div>
  );
}

function KanbanColumn({ title, icon, items, tone }: { title: string; icon: React.ReactNode; items: string[]; tone: 'slate' | 'blue' | 'amber' | 'green' }) {
  const headerBg = tone === 'green' ? 'bg-emerald-50' : tone === 'blue' ? 'bg-blue-50' : tone === 'amber' ? 'bg-amber-50' : 'bg-slate-50';
  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      <div className={cn('px-4 py-2.5 flex items-center gap-2', headerBg)}>
        {icon}
        <span className="text-[12px] font-semibold text-foreground">{title}</span>
        <Badge variant="secondary" className="text-[9px] ml-auto">{items.length}</Badge>
      </div>
      <div className="p-3 space-y-2">
        {items.map(item => (
          <div key={item} className="rounded-lg border border-border bg-muted/20 px-3 py-2 text-[11px] text-foreground leading-4">{item}</div>
        ))}
      </div>
    </div>
  );
}

function ImpactCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm" style={{ minHeight: 100 }}>
      <div className="flex items-start gap-2.5">
        <AlertTriangle size={14} className="text-amber-500 mt-0.5 shrink-0" />
        <div>
          <div className="text-[12px] font-semibold text-foreground">{title}</div>
          <p className="mt-1 text-[11px] text-muted-foreground leading-4">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function SystemNotice({ text }: { text: string }) {
  return (
    <div className="rounded-[20px] border border-border bg-muted/30 px-6 py-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="w-6 h-6 rounded-lg bg-muted flex items-center justify-center shrink-0 mt-0.5">
          <Lightbulb size={12} className="text-muted-foreground" />
        </div>
        <div>
          <div className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider mb-1">系统提示</div>
          <p className="text-[12px] leading-5 text-foreground">{text}</p>
        </div>
      </div>
    </div>
  );
}

function ConclusionBar({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-primary/20 bg-primary/5 px-5 py-3.5">
      <div className="flex items-start gap-2">
        <Sparkles size={13} className="text-primary mt-0.5 shrink-0" />
        <p className="text-[12px] leading-5 text-foreground font-medium">{text}</p>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Main Component
   ──────────────────────────────────────────────────────────────── */

interface PartnerManagementSceneProps {
  activeModule: string;
  onModuleChange: (id: string) => void;
}

export default function PartnerManagementScene({ activeModule, onModuleChange }: PartnerManagementSceneProps) {
  const scene = SCENES.find((item) => item.id === 'partner-management')!;
  const { active } = useDemo();

  const renderContent = () => {
    switch (activeModule) {

      /* ═══════════════════════════════════════════════════════════
         页面 2：接入管理
         ═══════════════════════════════════════════════════════════ */
      case 'ingestion':
        return (
          <div className="space-y-6">
            <SceneHeader
              title="接入管理"
              subtitle="查看各类数据源的接入方式、运行状态、更新频率、责任归属及当前待处理事项。"
              judgment="当前系统以行内数据接入为主，外部增强数据按收益优先级逐步纳入统一接入管理。"
            />

            {/* 模块 1：接入运行摘要 */}
            <SectionShell title="接入运行摘要">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: '内部核心数据接入', source: 'CRM / 核心账务 / 对公结算 / 统一信贷平台', status: '已形成基础接入闭环，支撑识别、审批与风险监控主流程', icon: <Database size={14} className="text-blue-600" />, tone: 'border-blue-200 bg-blue-50/30' },
                  { title: '外部增强数据接入', source: '物流协同 / 场景平台 / 文件导入 / API 接口', status: '按业务价值分批接入，优先支持补审提效与关系补强', icon: <Zap size={14} className="text-amber-600" />, tone: 'border-amber-200 bg-amber-50/30' },
                  { title: '文档与材料接入', source: '补审材料库 / 文档管理平台', status: '支持按客户、按样本、按场景补充证据材料', icon: <FileCheck2 size={14} className="text-emerald-600" />, tone: 'border-emerald-200 bg-emerald-50/30' },
                ].map(s => (
                  <Card key={s.title} className={cn('border shadow-sm', s.tone)} style={{ minHeight: 160 }}>
                    <CardContent className="p-5 space-y-2.5">
                      <div className="flex items-center gap-2">{s.icon}<span className="text-[13px] font-semibold text-foreground">{s.title}</span></div>
                      <div className="text-[11px]"><span className="text-muted-foreground">来源系统: </span><span className="text-foreground">{s.source}</span></div>
                      <div className="text-[11px]"><span className="text-muted-foreground">当前状态: </span><span className="text-foreground">{s.status}</span></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </SectionShell>

            {/* 模块 2：数据源台账 */}
            <SectionShell title="数据源台账" subtitle="当前已纳入管理的数据源清单与运行状态">
              <div className="rounded-xl border border-border overflow-hidden">
                <table className="w-full text-[11px]">
                  <thead>
                    <tr className="bg-muted/40 border-b border-border">
                      {['数据源名称', '数据域', '来源系统', '接入方式', '更新频率', '状态', '负责人', '影响模块'].map(h => (
                        <th key={h} className="text-left px-3 py-2.5 font-medium text-muted-foreground">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { name: '客户主档同步', domain: '客户主数据', source: 'CRM / MDM', method: '批量同步', freq: '每日', state: 'running' as const, owner: '数据团队', modules: '客群识别 / 资产池 / 审批' },
                      { name: '对公流水同步', domain: '账户与流水', source: '核心账务 / 对公结算', method: '批量同步 + 增量', freq: '日内 / T+1', state: 'running' as const, owner: '数据团队', modules: '识别 / 审批 / 风险监控' },
                      { name: '回款记录同步', domain: '回款与现金流', source: '核心账务 / 回款监测', method: '批量同步', freq: 'T+1', state: 'running' as const, owner: '数据团队', modules: '审批 / 风险监控 / 贷后' },
                      { name: '授信台账同步', domain: '存量授信', source: '统一信贷平台', method: '批量同步', freq: '每日', state: 'running' as const, owner: '信贷团队', modules: '资产池 / 审批 / 风险监控' },
                      { name: '预警记录同步', domain: '风险与监测', source: '风险监控平台', method: '事件推送', freq: '实时', state: 'running' as const, owner: '风控团队', modules: '风险监控 / 贷后' },
                      { name: '物流签收补充', domain: '替代性证据', source: '物流协同接口', method: '文件导入 / 接口', freq: '按场景', state: 'pending' as const, owner: '合作方', modules: '补审作业 / 风险监控' },
                      { name: '订单材料补充', domain: '替代性证据', source: '补审材料库', method: '文件导入', freq: '按批次', state: 'running' as const, owner: '客户经理', modules: '补审作业' },
                    ].map(row => (
                      <tr key={row.name} className="border-b border-border last:border-b-0 hover:bg-muted/20">
                        <td className="px-3 py-2.5 font-medium text-foreground">{row.name}</td>
                        <td className="px-3 py-2.5 text-muted-foreground">{row.domain}</td>
                        <td className="px-3 py-2.5 text-muted-foreground">{row.source}</td>
                        <td className="px-3 py-2.5 text-muted-foreground">{row.method}</td>
                        <td className="px-3 py-2.5 text-muted-foreground">{row.freq}</td>
                        <td className="px-3 py-2.5"><StatusDot state={row.state} /></td>
                        <td className="px-3 py-2.5 text-muted-foreground">{row.owner}</td>
                        <td className="px-3 py-2.5 text-muted-foreground">{row.modules}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SectionShell>

            {/* 模块 3：接入方式说明 */}
            <SectionShell title="接入方式说明">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { method: '文件导入', desc: '适用于试点阶段和补审场景，快速补充批量材料与增强数据', icon: <FileCheck2 size={14} /> },
                  { method: '批量同步', desc: '适用于行内核心系统，保障客户主数据、流水、授信台账的稳定更新', icon: <Database size={14} /> },
                  { method: '接口直连', desc: '适用于需持续运行的增强数据，提升接入时效性与自动化程度', icon: <Link2 size={14} /> },
                  { method: '周期任务', desc: '适用于风险监测、标签更新和定期经营分析类数据', icon: <Loader2 size={14} /> },
                ].map(m => (
                  <Card key={m.method} className="border border-border shadow-sm" style={{ minHeight: 140 }}>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2 text-primary">{m.icon}<span className="text-[13px] font-semibold text-foreground">{m.method}</span></div>
                      <p className="text-[11px] leading-5 text-muted-foreground">{m.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </SectionShell>

            {/* 模块 4：当前待办 */}
            <SectionShell title="当前待办">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: '高优先级待办', desc: '优先处理对补审效率和识别可信度影响最大的接入项', items: ['回款数据口径统一', '交易对手关系映射补全', '物流签收接口联调'], tone: 'border-red-200 bg-red-50/30' as const },
                  { title: '待验证接入项', desc: '关注已接通但尚未完成口径校验和稳定性验证的数据源', items: ['公私联动数据校验', '代发工资更新稳定性'], tone: 'border-amber-200 bg-amber-50/30' as const },
                  { title: '待启用接入项', desc: '对已具备接入条件但尚未纳入生产使用的数据能力进行排期管理', items: ['仓储周转数据', '司法风险排查接口', '行业舆情数据'], tone: 'border-slate-200 bg-slate-50/30' as const },
                ].map(g => (
                  <Card key={g.title} className={cn('border shadow-sm', g.tone)}>
                    <CardContent className="p-4">
                      <div className="text-[13px] font-semibold text-foreground mb-1">{g.title}</div>
                      <p className="text-[11px] text-muted-foreground mb-3">{g.desc}</p>
                      <div className="space-y-1.5">
                        {g.items.map(item => (
                          <div key={item} className="flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-[11px] text-foreground">
                            <ChevronRight size={10} className="text-muted-foreground shrink-0" />{item}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </SectionShell>

            <SystemNotice text={'当前「数据与接入」模块以行内数据底座为主，重点展示已可用数据资产、接入状态、能力支撑关系和关键缺口；外部增强数据按场景逐步纳入，不作为系统启动前提。'} />
          </div>
        );

      /* ═══════════════════════════════════════════════════════════
         页面 3：能力映射
         ═══════════════════════════════════════════════════════════ */
      case 'capability-map':
        return (
          <div className="space-y-6">
            <SceneHeader
              title="能力映射"
              subtitle="查看不同数据域如何支撑客群识别、产品审批、风险监控和贷后经营等核心业务能力。"
              judgment="内部数据支撑基础识别与经营判断，替代性证据支撑补审链路，外部增强数据主要用于提升判断效率和覆盖范围。"
            />

            {/* 模块 1：能力分层 */}
            <SectionShell title="能力分层">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <CapabilityLayerCard
                  tone="blue"
                  title="基础识别能力"
                  desc="由客户主数据、账户流水、公私联动关系和存量授信信息支撑，用于完成潜客发现与基础筛选"
                />
                <CapabilityLayerCard
                  tone="green"
                  title="补强审批能力"
                  desc="由回款与现金流、订单、物流、回单等替代性证据支撑，用于增强审批与补审判断"
                />
                <CapabilityLayerCard
                  tone="amber"
                  title="增强效率能力"
                  desc="由外部协同数据和场景增强数据支撑，用于提升识别置信度、补审效率与复制推广能力"
                />
              </div>
            </SectionShell>

            {/* 模块 2：业务模块映射 */}
            <SectionShell title="业务模块映射" subtitle="从业务能力视角，展示每个核心模块的数据依赖与当前作用">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <BusinessModuleCard
                  title="客群识别"
                  data="客户主数据 / 账户与流水 / 公私联动与交易对手关系"
                  source="CRM / 核心账务 / 统一信贷平台"
                  role="识别潜在客户、发现桥接主体、形成候选客户池"
                />
                <BusinessModuleCard
                  title="授信资产池"
                  data="客户主数据 / 存量授信与还款表现 / 基础经营数据"
                  source="CRM / 统一信贷平台 / 授信管理系统"
                  role="判断客户当前池位、流转状态与后续动作入口"
                />
                <BusinessModuleCard
                  title="产品与审批"
                  data="账户与流水 / 回款与现金流 / 存量授信 / 补审材料"
                  source="核心账务 / 回款监测 / 统一信贷平台 / 文档管理平台"
                  role="支撑产品匹配、额度建议、补审判断与审批结论解释"
                />
                <BusinessModuleCard
                  title="风险监控"
                  data="交易流水 / 回款异常 / 预警记录 / 履约线索"
                  source="核心账务 / 风险监控平台 / 预警系统"
                  role="识别贷中异常、触发风险预警和处置建议"
                />
                <BusinessModuleCard
                  title="贷后经营"
                  data="还款表现 / 风险观察 / 客户经营状态 / 恢复记录"
                  source="贷后管理系统 / 风险监控平台 / 统一信贷平台"
                  role="支撑恢复观察、分层经营和后续客户价值管理"
                />
              </div>
            </SectionShell>

            {/* 模块 3：当前能力限制 */}
            <SectionShell title="当前能力限制">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: '当前不可用能力', desc: '因关键数据缺失或更新不稳定，暂无法稳定支撑的能力项', tone: 'border-red-200 bg-red-50/30', items: ['仓储周转验证', '行业舆情预警', '跨链路自动复制'] },
                  { title: '当前部分可用能力', desc: '已具备基础运行条件，但仍依赖人工补充或增强数据补强的能力项', tone: 'border-amber-200 bg-amber-50/30', items: ['物流履约验证', '三流交叉验证', '关系推断增强'] },
                  { title: '当前增强能力', desc: '在引入物流、回单、场景协同数据后，可进一步提升识别、补审和复制效率的能力项', tone: 'border-emerald-200 bg-emerald-50/30', items: ['补审自动化辅助', '识别置信度评分', '场景快速复制'] },
                ].map(g => (
                  <Card key={g.title} className={cn('border shadow-sm', g.tone)}>
                    <CardContent className="p-4">
                      <div className="text-[13px] font-semibold text-foreground mb-1">{g.title}</div>
                      <p className="text-[11px] text-muted-foreground mb-3 leading-4">{g.desc}</p>
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

            {/* 模块 4：页面结论 */}
            <ConclusionBar text={'当前能力映射应持续强调「数据支撑业务模块」的关系，而不是停留在数据本身的清单展示。'} />

            <SystemNotice text={'当前「数据与接入」模块以行内数据底座为主，重点展示已可用数据资产、接入状态、能力支撑关系和关键缺口；外部增强数据按场景逐步纳入，不作为系统启动前提。'} />
          </div>
        );

      /* ═══════════════════════════════════════════════════════════
         页面 4：推进与缺口
         ═══════════════════════════════════════════════════════════ */
      case 'gaps':
        return (
          <div className="space-y-6">
            <SceneHeader
              title="推进与缺口"
              subtitle="查看当前数据与接入推进状态、关键阻塞点、业务影响范围及下一步优先任务。"
              judgment="当前系统已具备基础运行能力，下一阶段重点是补齐关键缺口、提升数据稳定性并推动高价值增强项落地。"
            />

            {/* 模块 1：推进状态 */}
            <SectionShell title="推进状态">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: '当前总体推进状态', desc: '内部核心数据已形成基础支撑能力，增强数据处于按场景推进阶段', icon: <TrendingUp size={14} className="text-blue-600" />, tone: 'border-blue-200 bg-blue-50/30' },
                  { title: '当前最大阻塞点', desc: '影响补审效率、关系识别准确性或风险监控完整性的关键缺口需优先处理', icon: <ShieldAlert size={14} className="text-red-600" />, tone: 'border-red-200 bg-red-50/30' },
                  { title: '当前建议动作', desc: '优先补齐对识别、补审和风险监控影响最大的高价值数据项', icon: <ArrowRight size={14} className="text-emerald-600" />, tone: 'border-emerald-200 bg-emerald-50/30' },
                ].map(s => (
                  <Card key={s.title} className={cn('border shadow-sm', s.tone)} style={{ minHeight: 120 }}>
                    <CardContent className="p-5">
                      <div className="flex items-center gap-2 mb-2">{s.icon}<span className="text-[13px] font-semibold text-foreground">{s.title}</span></div>
                      <p className="text-[11px] leading-5 text-muted-foreground">{s.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </SectionShell>

            {/* 模块 2：缺口清单 */}
            <SectionShell title="缺口清单" subtitle="当前影响业务运行质量的关键数据缺口">
              <div className="space-y-3">
                <GapRow
                  name="交易对手关系覆盖不足"
                  domain="公私联动与交易对手关系"
                  source="统一信贷平台 / 流水分析平台"
                  modules="客群识别 / 审批补强"
                  severity="高"
                  action="补充高频交易对手映射与桥接关系识别口径"
                />
                <GapRow
                  name="回款数据稳定性不足"
                  domain="回款与现金流"
                  source="核心账务 / 回款监测系统"
                  modules="产品与审批 / 风险监控"
                  severity="高"
                  action="统一回款口径并提升更新稳定性"
                />
                <GapRow
                  name="物流履约线索未纳入统一接入"
                  domain="替代性证据"
                  source="物流协同接口"
                  modules="补审作业 / 风险监控"
                  severity="中"
                  action="完成试点场景接入验证"
                />
                <GapRow
                  name="仓储周转数据缺失"
                  domain="替代性证据"
                  source="仓储管理系统"
                  modules="风险监控"
                  severity="中"
                  action="评估接入价值并确认合作方"
                />
                <GapRow
                  name="行业舆情数据未接入"
                  domain="外部增强"
                  source="舆情服务商"
                  modules="风险监控"
                  severity="低"
                  action="纳入第二阶段增强计划"
                />
              </div>
            </SectionShell>

            {/* 模块 3：任务推进看板 */}
            <SectionShell title="任务推进看板">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <KanbanColumn
                  title="待启动"
                  icon={<PauseCircle size={13} className="text-slate-500" />}
                  tone="slate"
                  items={['仓储数据合作方评估', '行业舆情接口选型', '司法风险接口采购']}
                />
                <KanbanColumn
                  title="推进中"
                  icon={<Loader2 size={13} className="text-blue-500" />}
                  tone="blue"
                  items={['物流签收接口联调', '回款口径统一治理', '交易对手映射补全']}
                />
                <KanbanColumn
                  title="待验证"
                  icon={<AlertTriangle size={13} className="text-amber-500" />}
                  tone="amber"
                  items={['公私联动数据质量校验', '代发工资更新稳定性验证']}
                />
                <KanbanColumn
                  title="已完成"
                  icon={<CheckCircle2 size={13} className="text-emerald-500" />}
                  tone="green"
                  items={['客户主档日批同步', '对公流水增量更新', '授信台账每日同步', '预警事件推送', '订单材料导入通道']}
                />
              </div>
            </SectionShell>

            {/* 模块 4：业务影响评估 */}
            <SectionShell title="业务影响评估" subtitle="缺口对各核心业务模块的影响分析">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <ImpactCard title="对客群识别的影响" desc="关系映射、交易对手和主数据覆盖不足会直接影响潜客发现质量" />
                <ImpactCard title="对产品审批的影响" desc="回款、证据材料和授信历史不完整会影响产品匹配和补审结论可信度" />
                <ImpactCard title="对风险监控的影响" desc="交易与预警数据不稳定会影响异常识别时效与处置建议准确性" />
                <ImpactCard title="对贷后经营的影响" desc="还款表现和恢复观察数据缺口会降低客户分层与后续经营判断效果" />
              </div>
            </SectionShell>

            {/* 模块 5：页面结论 */}
            <ConclusionBar text={'推进与缺口页应突出「缺口影响了什么业务、谁来推进、下一步做什么」，而不是只展示项目进度本身。'} />

            <SystemNotice text={'当前「数据与接入」模块以行内数据底座为主，重点展示已可用数据资产、接入状态、能力支撑关系和关键缺口；外部增强数据按场景逐步纳入，不作为系统启动前提。'} />
          </div>
        );

      /* ═══════════════════════════════════════════════════════════
         页面 1：数据总览 (default)
         ═══════════════════════════════════════════════════════════ */
      default:
        return (
          <div className="space-y-6">
            <SceneHeader
              title="数据总览"
              subtitle="查看当前已接入的数据资产、主要来源系统、覆盖范围及其对业务模块的支撑情况。"
              judgment="当前系统已基于行内核心数据形成基础识别与审批支撑能力，外部增强数据按场景逐步补充。"
            />

            {/* 模块 1：内部数据资产 */}
            <SectionShell title="内部数据资产" subtitle="优先展示可直接支撑业务运行的内部数据域，并明确其主要来源系统与业务作用">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                <DataAssetCard
                  title="客户主数据"
                  source="CRM / 客户主数据平台"
                  coverage="对公客户主档、行业标签、客户归属已形成统一视图"
                  modules="客群识别 / 授信资产池 / 产品与审批"
                />
                <DataAssetCard
                  title="账户与流水"
                  source="核心账务系统 / 对公结算系统"
                  coverage="近 12 个月对公账户流水、交易频率与活跃度数据可用"
                  modules="客群识别 / 产品匹配 / 风险监控"
                />
                <DataAssetCard
                  title="回款与现金流"
                  source="核心账务系统 / 回款监测系统 / 现金管理系统"
                  coverage="核心回款记录、回款周期与回流表现已可分析"
                  modules="产品与审批 / 风险监控 / 贷后经营"
                />
                <DataAssetCard
                  title="存量授信与还款表现"
                  source="统一信贷平台 / 授信管理系统 / 贷后管理系统"
                  coverage="授信额度、用信情况、还款表现和历史审批结论可回溯"
                  modules="授信资产池 / 产品与审批 / 风险监控"
                />
                <DataAssetCard
                  title="公私联动与交易对手关系"
                  source="统一信贷平台 / CRM / 流水分析平台"
                  coverage="高频交易对手、公私联动和关系线索已形成初步映射"
                  modules="客群识别 / 产品与审批 / 知识图谱关系识别"
                />
                <DataAssetCard
                  title="风险与贷后监测"
                  source="风险监控平台 / 预警系统 / 贷后管理系统"
                  coverage="预警记录、异常交易、贷后观察状态可统一查看"
                  modules="风险监控 / 贷后经营"
                />
              </div>
            </SectionShell>

            {/* 模块 2：增强数据资产 */}
            <SectionShell title="增强数据资产" subtitle="展示当前已接入或计划引入的替代性证据与外部增强数据，并明确其不是系统启动前提">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <EnhancedDataCard
                  title="订单与合同材料"
                  source="补审材料库 / 文档管理平台"
                  status="按样本或批次补充，不作为全量前置依赖"
                  modules="产品与审批 / 补审作业"
                />
                <EnhancedDataCard
                  title="物流与履约线索"
                  source="物流协同接口 / 文件导入"
                  status="用于补强履约真实性，按场景接入"
                  modules="产品与审批 / 风险监控"
                />
                <EnhancedDataCard
                  title="回单与协同证明"
                  source="回单归档平台 / 场景协同导入"
                  status="用于增强回款链路验证，不作为基础识别前提"
                  modules="补审作业 / 风险监控"
                />
              </div>
            </SectionShell>

            {/* 模块 3：业务覆盖情况 */}
            <SectionShell title="业务覆盖情况" subtitle="从业务模块视角展示数据支撑状态，而不是只罗列数据清单">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <CoverageRow module="客群识别" desc="当前已由客户主数据、账户流水、公私联动关系支撑基础识别能力" />
                <CoverageRow module="产品与审批" desc="当前已由账户流水、回款数据、存量授信与补审材料支撑产品匹配与补审判断" />
                <CoverageRow module="风险监控" desc="当前已由账户交易、回款异常、预警记录支撑贷中监测与异常识别" />
                <CoverageRow module="贷后经营" desc="当前已由还款表现、风险观察和客户经营状态支撑恢复观察与后续经营" />
              </div>
            </SectionShell>

            {/* 模块 4：当前提醒 */}
            <ConclusionBar text="当前重点不是继续扩充数据种类，而是优先提升关键数据覆盖率和更新稳定性，确保识别结果能够稳定进入审批与经营链路。" />

            <SystemNotice text={'当前「数据与接入」模块以行内数据底座为主，重点展示已可用数据资产、接入状态、能力支撑关系和关键缺口；外部增强数据按场景逐步纳入，不作为系统启动前提。'} />
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
