import React from 'react';
import SceneLayout from '../SceneLayout';
import { SCENES } from '../../constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Database,
  Filter,
  Link2,
  Play,
  Search,
  ShieldCheck,
  Truck,
  Users,
  Wallet,
} from 'lucide-react';
import {
  PageHeader,
  WorkbenchPanel,
  MetricCard,
  FlowRow,
  StatusPill,
  EntitySummaryCard,
  ActionQueueCard,
  TimelineRail,
  InsightStrip,
  AiNote,
  SampleSwitcher,
  SelectedSampleSummary,
} from '../ProductPrimitives';
import { useDemo } from '../../demo/DemoContext';
import { DemoStepper, CaseSummaryCard, ActionBar } from '../../demo/DemoComponents';


interface PartnerManagementSceneProps {
  activeModule: string;
  onModuleChange: (id: string) => void;
}

const MATURITY_STEPS = ['数据打通', '存量唤醒', '标准授信', '场景扩展', '自动化运营'];

export default function PartnerManagementScene({ activeModule, onModuleChange }: PartnerManagementSceneProps) {
  const scene = SCENES.find((item) => item.id === 'partner-management')!;
  const { active, startDemo, currentSample, selectSample, selectedSampleId } = useDemo();

  const maturityIndex = 2;

  const renderContent = () => {
    switch (activeModule) {

      // ─── 数据来源 (数据接入台) ──────────────────────────────
      case 'sources':
        return (
          <div className="space-y-4">
            {active && <DemoStepper />}
            {active && <CaseSummaryCard />}

            <PageHeader
              title="数据接入台"
              subtitle="已接入: 14 项 · 待接入: 3 项"
              right={
                <>
                  <Button variant="ghost" size="sm" className="h-6 text-[10px] text-[#64748B] gap-1 px-2"><Search size={10} /> 搜索</Button>
                  <Button variant="ghost" size="sm" className="h-6 text-[10px] text-[#64748B] gap-1 px-2"><Filter size={10} /> 筛选</Button>
                </>
              }
            />

            {[
              {
                category: '银行内部数据', icon: Wallet, color: 'text-[#2563EB]', iconBg: 'bg-[#EFF6FF]',
                sources: [
                  { name: '对公结算流水', status: '已接入', quality: '优', freq: '实时', usage: '交易图谱 · 关系验证', modules: '客群识别 · 风险监控' },
                  { name: '代发工资数据', status: '已接入', quality: '优', freq: 'T+1', usage: '经营实质验证', modules: '客群识别 · 贷后经营' },
                  { name: '历史授信/还款', status: '已接入', quality: '良', freq: 'T+1', usage: '信用画像 · 续贷评估', modules: '预授信 · 贷后经营' },
                  { name: '公私联动数据', status: '已接入', quality: '良', freq: '周', usage: '经营增强验证', modules: '客群识别 · 审批' },
                  { name: '理财/按揭/存款', status: '已接入', quality: '良', freq: '月', usage: '法人画像 · 沉淀评估', modules: '贷后经营' },
                ],
              },
              {
                category: '产业链辅助数据', icon: Truck, color: 'text-[#16A34A]', iconBg: 'bg-[#F0FDF4]',
                sources: [
                  { name: '物流签收/回单', status: '已接入', quality: '良', freq: '实时', usage: '履约验证 · 风险监控', modules: '客群识别 · 风险监控' },
                  { name: '平台订单数据', status: '已接入', quality: '优', freq: '实时', usage: '订单稳定性评估', modules: '客群识别 · 预授信' },
                  { name: '仓储数据', status: '待接入', quality: '—', freq: '—', usage: '库存与周转验证', modules: '风险监控' },
                ],
              },
              {
                category: '公私联动数据', icon: Users, color: 'text-[#7C3AED]', iconBg: 'bg-[#F5F3FF]',
                sources: [
                  { name: '社保/公积金', status: '已接入', quality: '良', freq: '月', usage: '经营持续性验证', modules: '客群识别' },
                  { name: '水电燃气缴费', status: '已接入', quality: '中', freq: '月', usage: '经营场地验证', modules: '客群识别' },
                  { name: '通信缴费', status: '待接入', quality: '—', freq: '—', usage: '经营活跃验证', modules: '客群识别' },
                ],
              },
              {
                category: '替代性验证数据', icon: ShieldCheck, color: 'text-[#C2410C]', iconBg: 'bg-[#FFF7ED]',
                sources: [
                  { name: '税票数据', status: '已接入', quality: '优', freq: '月', usage: '开票连续性 · 集中度', modules: '客群识别 · 审批' },
                  { name: '工商登记信息', status: '已接入', quality: '良', freq: '季', usage: '主体真实性核验', modules: '准入' },
                  { name: '司法风险数据', status: '已接入', quality: '良', freq: '周', usage: '风险排除', modules: '风险监控' },
                  { name: '行业舆情', status: '待接入', quality: '—', freq: '—', usage: '行业风险预警', modules: '风险监控' },
                ],
              },
            ].map((group) => (
              <WorkbenchPanel
                key={group.category}
                title={group.category}
                icon={group.icon}
                badge={<Badge className="bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] text-[10px]">{group.sources.length} 项</Badge>}
              >
                <div className="rounded-lg border border-[#E2E8F0] overflow-hidden">
                  <table className="w-full text-[11px]">
                    <thead>
                      <tr className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
                        <th className="text-left px-3 py-2 font-medium text-[#64748B]">来源名称</th>
                        <th className="text-left px-3 py-2 font-medium text-[#64748B]">状态</th>
                        <th className="text-left px-3 py-2 font-medium text-[#64748B]">质量</th>
                        <th className="text-left px-3 py-2 font-medium text-[#64748B]">频率</th>
                        <th className="text-left px-3 py-2 font-medium text-[#64748B]">当前用途</th>
                        <th className="text-left px-3 py-2 font-medium text-[#64748B]">影响模块</th>
                      </tr>
                    </thead>
                    <tbody>
                      {group.sources.map((s) => (
                        <tr key={s.name} className="border-b border-[#E2E8F0] last:border-b-0">
                          <td className="px-3 py-2.5 font-medium text-[#0F172A]">{s.name}</td>
                          <td className="px-3 py-2.5">
                            <StatusPill state={s.status === '已接入' ? 'normal' : 'watch'} label={s.status} />
                          </td>
                          <td className="px-3 py-2.5 text-[#64748B]">{s.quality}</td>
                          <td className="px-3 py-2.5 text-[#64748B]">{s.freq}</td>
                          <td className="px-3 py-2.5 text-[#475569]">{s.usage}</td>
                          <td className="px-3 py-2.5 text-[#94A3B8]">{s.modules}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </WorkbenchPanel>
            ))}

            {active && <ActionBar />}
          </div>
        );

      // ─── 银行模板 (模板适配台) ──────────────────────────────
      case 'templates':
        return (
          <div className="space-y-4">
            {active && <DemoStepper />}
            {active && <CaseSummaryCard />}

            <PageHeader
              title="银行模板适配台"
              subtitle="模板总数: 3 套 · 累计落地: 10 家"
            />

            <div className="space-y-4">
              {[
                {
                  type: '股份行', strategy: '先深后广', focus: '标准授信 + 长尾场景',
                  dataPacks: ['对公结算流水', '税票数据', '物流签收', '公私联动'],
                  rulePacks: ['订单稳定性', '集中度', '经营闭环', '脱核补审'],
                  coverModules: ['客群识别', '预授信', '审批引擎', '风险监控', '贷后经营'],
                  complexity: '高', timeline: '6 个月', cases: '3 家已落地',
                },
                {
                  type: '城商行', strategy: '先粘后扩', focus: '本地经营 + 存量激活',
                  dataPacks: ['对公结算流水', '代发工资', '税票数据', '社保缴费'],
                  rulePacks: ['公私联动', '代发激活', '结算商户', '基础预警'],
                  coverModules: ['客群识别', '预授信', '贷后经营'],
                  complexity: '中', timeline: '4 个月', cases: '5 家已落地',
                },
                {
                  type: '农商行', strategy: '先线下后数字', focus: '熟人信用数字化',
                  dataPacks: ['对公结算流水', '代发工资', '历史还款'],
                  rulePacks: ['存量唤醒', '代发小微', '简单流水贷', '基础预警'],
                  coverModules: ['客群识别', '预授信'],
                  complexity: '低', timeline: '3 个月', cases: '2 家已落地',
                },
              ].map((tmpl) => (
                <WorkbenchPanel key={tmpl.type} title={tmpl.type}>
                  <div className="flex items-center gap-3 mb-4 flex-wrap">
                    <Badge className="bg-[#F8FAFC] text-[#475569] border border-[#E2E8F0] text-[10px]">{tmpl.cases}</Badge>
                    <Badge className={`text-[10px] border ${tmpl.complexity === '高' ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]' : tmpl.complexity === '中' ? 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]' : 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]'}`}>
                      复杂度: {tmpl.complexity}
                    </Badge>
                    <span className="text-[11px] text-[#64748B]">策略: {tmpl.strategy} · {tmpl.focus} · 预计 {tmpl.timeline}</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                      <div className="text-[10px] text-[#94A3B8] uppercase tracking-wide mb-2">启用数据包</div>
                      <div className="flex flex-wrap gap-1">
                        {tmpl.dataPacks.map((d) => (
                          <span key={d} className="rounded-full bg-white border border-[#E2E8F0] px-2 py-0.5 text-[10px] text-[#475569]">{d}</span>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                      <div className="text-[10px] text-[#94A3B8] uppercase tracking-wide mb-2">启用规则包</div>
                      <div className="flex flex-wrap gap-1">
                        {tmpl.rulePacks.map((r) => (
                          <span key={r} className="rounded-full bg-white border border-[#E2E8F0] px-2 py-0.5 text-[10px] text-[#475569]">{r}</span>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                      <div className="text-[10px] text-[#94A3B8] uppercase tracking-wide mb-2">覆盖模块</div>
                      <div className="flex flex-wrap gap-1">
                        {tmpl.coverModules.map((m) => (
                          <span key={m} className="rounded-full bg-[#EFF6FF] border border-[#BFDBFE] px-2 py-0.5 text-[10px] text-[#2563EB]">{m}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </WorkbenchPanel>
              ))}
            </div>

            {active && <ActionBar />}
          </div>
        );

      // ─── 实施路径 (交付推进台) ──────────────────────────────
      case 'delivery':
        return (
          <div className="space-y-4">
            {active && <DemoStepper />}
            {active && <CaseSummaryCard />}

            <PageHeader
              title="交付推进台"
              subtitle="当前阶段: 第三阶段 · 场景扩展 · 预计上线: 2026-06-30"
              right={
                <div className="flex items-center gap-1.5">
                  {MATURITY_STEPS.map((s, i) => (
                    <div key={s} className={`h-2 rounded-full transition-all ${i <= maturityIndex ? 'bg-[#2563EB] w-10' : 'bg-[#E2E8F0] w-6'}`} />
                  ))}
                </div>
              }
            />

            <WorkbenchPanel title="交付阶段时间轴">
              <div className="space-y-0">
                {[
                  {
                    phase: '第一阶段 · 数据打通', duration: '第 1-4 周', status: 'done' as const,
                    completed: ['银行内部数据对接 (结算、代发、按揭)', '规则引擎基础版部署', '存量唤醒包上线 · 产出首批预授信名单'],
                    pending: [] as string[],
                    risks: [] as string[],
                    scope: '存量唤醒 + 基础规则',
                    owner: '数据团队 + 产品团队',
                  },
                  {
                    phase: '第二阶段 · 标准授信', duration: '第 5-10 周', status: 'done' as const,
                    completed: ['税票流水数据接入', '标准数据授信包上线', '动账预警与额度联动'],
                    pending: [] as string[],
                    risks: [] as string[],
                    scope: '标准授信 + 预警联动',
                    owner: '风控团队 + 运营团队',
                  },
                  {
                    phase: '第三阶段 · 场景扩展', duration: '第 11-16 周', status: 'current' as const,
                    completed: ['产业平台数据接入 (物流)', '脱核链贷规则包上线'],
                    pending: ['仓储数据接入', '长尾场景金融包验收', '首个场景样板案例输出'],
                    risks: ['仓储数据供应商合同尚未签署', '脱核链贷补审通过率待验证'],
                    scope: '长尾场景 + 脱核链贷 + 样板案例',
                    owner: '产品团队 + 合作方',
                  },
                ].map((phase, idx) => (
                  <div key={phase.phase} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium shrink-0 ${
                        phase.status === 'done'
                          ? 'bg-[#ECFDF3] text-[#16A34A] border border-[#A7F3D0]'
                          : 'bg-[#EFF6FF] text-[#1890FF] border-2 border-[#1890FF]'
                      }`}>
                        {phase.status === 'done' ? <CheckCircle2 size={14} /> : idx + 1}
                      </div>
                      {idx < 2 && <div className={`w-px flex-1 min-h-[16px] ${phase.status === 'done' ? 'bg-[#A7F3D0]' : 'bg-[#E2E8F0]'}`} />}
                    </div>
                    <div className="pb-5 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-[#0F172A]">{phase.phase}</span>
                        <Badge className="bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] text-[10px]">{phase.duration}</Badge>
                        <StatusPill state={phase.status === 'done' ? 'normal' : 'info'} label={phase.status === 'done' ? '已完成' : '进行中'} />
                      </div>
                      <div className="mt-1 text-[11px] text-[#64748B]">上线范围: {phase.scope} · 责任: {phase.owner}</div>

                      {phase.completed.length > 0 && (
                        <div className="mt-3 space-y-1.5">
                          <div className="text-[10px] text-[#94A3B8] uppercase tracking-wide">已完成</div>
                          {phase.completed.map((t) => (
                            <div key={t} className="flex items-center gap-2 rounded-lg bg-[#F0FDF4] border border-[#A7F3D0] px-3 py-2">
                              <CheckCircle2 size={12} className="text-[#16A34A] shrink-0" />
                              <span className="text-[11px] text-[#334155]">{t}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {phase.pending.length > 0 && (
                        <div className="mt-3 space-y-1.5">
                          <div className="text-[10px] text-[#94A3B8] uppercase tracking-wide">待完成</div>
                          {phase.pending.map((t) => (
                            <div key={t} className="flex items-center gap-2 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-2">
                              <Clock3 size={12} className="text-[#94A3B8] shrink-0" />
                              <span className="text-[11px] text-[#475569]">{t}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {phase.risks.length > 0 && (
                        <div className="mt-3 space-y-1.5">
                          <div className="text-[10px] text-[#94A3B8] uppercase tracking-wide">风险点</div>
                          {phase.risks.map((r) => (
                            <div key={r} className="flex items-center gap-2 rounded-lg bg-[#FFF7ED] border border-[#FED7AA] px-3 py-2">
                              <AlertTriangle size={12} className="text-[#C2410C] shrink-0" />
                              <span className="text-[11px] text-[#92400E]">{r}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </WorkbenchPanel>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <WorkbenchPanel title="当前缺口">
                <div className="space-y-2">
                  {[
                    { gap: '仓储数据未接入', impact: '无法验证库存周转', priority: '高' },
                    { gap: '行业舆情未接入', impact: '缺少行业风险预警', priority: '中' },
                    { gap: '通信缴费未接入', impact: '经营活跃验证不完整', priority: '低' },
                  ].map((g) => (
                    <ActionQueueCard key={g.gap} action={g.gap} source={`影响: ${g.impact}`} priority={g.priority} />
                  ))}
                </div>
              </WorkbenchPanel>
              <WorkbenchPanel title="下一步动作">
                <div className="space-y-2">
                  {[
                    { action: '签署仓储数据合同', owner: '合作方', due: '本周' },
                    { action: '验收脱核链贷规则包', owner: '风控团队', due: '第 13 周' },
                    { action: '输出首个场景样板', owner: '产品团队', due: '第 15 周' },
                  ].map((a) => (
                    <ActionQueueCard key={a.action} action={a.action} source={`→ ${a.owner}`} sla={a.due} />
                  ))}
                </div>
              </WorkbenchPanel>
              <WorkbenchPanel title="预计上线范围">
                <div className="space-y-3">
                  {[
                    { module: '客群识别', status: '已上线', pct: 100 },
                    { module: '预授信 & 审批', status: '已上线', pct: 100 },
                    { module: '风险监控', status: '部分上线', pct: 75 },
                    { module: '脱核链贷', status: '验收中', pct: 60 },
                    { module: '贷后经营', status: '规划中', pct: 30 },
                  ].map((m) => (
                    <FlowRow key={m.module} label={m.module} value={m.status} percentage={m.pct} />
                  ))}
                </div>
              </WorkbenchPanel>
            </div>

            {active && <ActionBar />}
          </div>
        );

      // ─── 接入总览 (default) ──────────────────────────────────
      default:
        return (
          <div className="space-y-4">
            {active && <DemoStepper />}
            {active && <CaseSummaryCard />}

            {/* 合作接入流程条 */}
            <div className="flex items-center gap-1 rounded-lg border border-[#E2E8F0] bg-white px-4 py-3">
              {['需求评估', '合作签约', '数据接入', '场景扩展', '稳态运营'].map((step, i) => {
                const done = i < maturityIndex;
                const isActive = i === maturityIndex;
                return (
                  <React.Fragment key={step}>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium ${done ? 'bg-[#ECFDF3] text-[#047857]' : isActive ? 'bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]' : 'text-[#94A3B8]'}`}>
                      <span className={`w-4 h-4 rounded-full text-[9px] flex items-center justify-center font-bold ${done ? 'bg-[#047857] text-white' : isActive ? 'bg-[#2563EB] text-white' : 'bg-[#E2E8F0] text-[#94A3B8]'}`}>{done ? '✓' : i + 1}</span>
                      {step}
                    </div>
                    {i < 4 && <div className={`flex-1 h-px ${i < maturityIndex ? 'bg-[#047857]' : 'bg-[#E2E8F0]'}`} />}
                  </React.Fragment>
                );
              })}
            </div>

            <SelectedSampleSummary sample={currentSample} />

            {/* 合作生态摘要 */}
            <PageHeader
              title="合作生态摘要"
              right={
                <div className="flex items-center gap-2">
                  <span className="text-[10px] text-[#94A3B8]">合作成熟度</span>
                  <div className="flex items-center gap-1">
                    {MATURITY_STEPS.map((s, i) => (
                      <div key={s} className="flex items-center gap-1">
                        <div className={`h-5 rounded-full flex items-center justify-center px-2 text-[10px] font-medium ${i <= maturityIndex ? 'bg-[#2563EB] text-white' : 'bg-[#F1F5F9] text-[#94A3B8]'}`}>
                          {s}
                        </div>
                        {i < MATURITY_STEPS.length - 1 && <div className="w-2 h-px bg-[#E2E8F0]" />}
                      </div>
                    ))}
                  </div>
                </div>
              }
            />

            <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
              {[
                { role: '链主企业', name: '宁德时代', state: '未确权', stateType: 'watch' as const },
                { role: '桥接节点', name: '欣旺达', state: '已建联', stateType: 'info' as const },
                { role: '外部数据方', name: '中外运物流', state: '已接入', stateType: 'normal' as const },
                { role: '内部数据方', name: '本行结算账户', state: '已接入', stateType: 'normal' as const },
                { role: '借款主体', name: '裕同包装', state: '已识别', stateType: 'info' as const },
                { role: '成熟度', name: '第 3 阶段', state: '场景扩展', stateType: 'watch' as const },
              ].map((item) => (
                <EntitySummaryCard key={item.role} name={item.name} role={item.role} state={item.stateType} stateLabel={item.state} />
              ))}
            </div>

            {/* 主链路证明图 */}
            <WorkbenchPanel title="主链路证明图" icon={Link2}>
              <div className="flex items-center justify-center gap-0 overflow-x-auto py-4">
                {[
                  { name: '宁德时代', role: '链主 (未确权)', color: 'border-[#DDD6FE] bg-[#F5F3FF]', textColor: 'text-[#7C3AED]' },
                  null,
                  { name: '欣旺达', role: 'Tier-2 桥接', color: 'border-[#BFDBFE] bg-[#EFF6FF]', textColor: 'text-[#2563EB]' },
                  null,
                  { name: '裕同包装', role: 'Tier-3 借款主体', color: 'border-[#BAE6FD] bg-[#F0F9FF]', textColor: 'text-[#0369A1]' },
                ].map((node, i) => {
                  if (!node) {
                    return <ArrowRight key={`arrow-${i}`} size={20} className="text-[#94A3B8] mx-2 shrink-0" />;
                  }
                  return (
                    <div key={node.name} className={`rounded-xl border-2 ${node.color} px-5 py-3 text-center shrink-0 min-w-[140px]`}>
                      <div className={`text-sm font-semibold ${node.textColor}`}>{node.name}</div>
                      <div className="text-[10px] text-[#64748B] mt-1">{node.role}</div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-center gap-8 mt-2">
                {[
                  { name: '中外运物流', role: '物流数据', target: '裕同包装' },
                  { name: '本行结算账户', role: '内部数据', target: '裕同包装' },
                ].map((aux) => (
                  <div key={aux.name} className="flex items-center gap-2 rounded-lg border border-dashed border-[#A7F3D0] bg-[#F0FDF4] px-3 py-2">
                    <Database size={12} className="text-[#16A34A]" />
                    <div>
                      <div className="text-[11px] font-medium text-[#0F172A]">{aux.name}</div>
                      <div className="text-[9px] text-[#64748B]">{aux.role} → {aux.target}</div>
                    </div>
                  </div>
                ))}
              </div>

              <p className="mt-4 text-xs text-[#64748B] leading-5 text-center max-w-2xl mx-auto">
                链主企业并未对借款主体进行直接确权，但通过桥接节点{currentSample.keyCounterparty}的订单、物流平台履约数据与银行内部回款流水，可识别{currentSample.shortName}的稳定经营与真实交易背景。
              </p>

              <div className="mt-4">
                <SelectedSampleSummary sample={currentSample} />
              </div>
            </WorkbenchPanel>

            {/* 合作状态 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <WorkbenchPanel title="合作关系建立状态">
                <div className="space-y-2">
                  {[
                    { partner: '宁德时代', relation: '未直接确权', state: 'watch' as const },
                    { partner: '欣旺达', relation: '订单数据已获取', state: 'normal' as const },
                    { partner: '中外运物流', relation: 'API 已接入', state: 'normal' as const },
                    { partner: '本行结算', relation: '内部系统', state: 'normal' as const },
                  ].map((p) => (
                    <EntitySummaryCard key={p.partner} name={p.partner} role={p.relation} state={p.state} stateLabel={p.state === 'normal' ? '已建联' : '间接'} />
                  ))}
                </div>
              </WorkbenchPanel>

              <div className="space-y-4">
                <WorkbenchPanel title="当前缺口">
                  <div className="space-y-2">
                    {[
                      { gap: '链主确权缺失', action: '走脱核替代路径，通过订单/物流/结算数据间接验证' },
                      { gap: '仓储数据未接入', action: '正在推进数据方合同签署，预计第 14 周完成' },
                    ].map((g) => (
                      <InsightStrip key={g.gap} tone="warn">
                        <strong>{g.gap}</strong> — {g.action}
                      </InsightStrip>
                    ))}
                    <AiNote action="优先推进仓储数据接入">
                      成熟度 3/5，核心链路已可运营，仓储和通信为待补项
                    </AiNote>
                  </div>
                </WorkbenchPanel>

                <WorkbenchPanel title="下一步动作">
                  <div className="space-y-2">
                    <ActionQueueCard action="完成脱核链贷规则包验收" source="→ 风控团队" sla="第 13 周" />
                    <ActionQueueCard action="输出首个场景样板案例" source="→ 产品团队" sla="第 15 周" />
                  </div>
                </WorkbenchPanel>
              </div>
            </div>

            

            {/* 融资背景 */}
            <WorkbenchPanel title="融资背景">
              <div className="mb-3">
                <SampleSwitcher selectedId={selectedSampleId} onSelect={selectSample} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  ['融资需求', `${currentSample.shortName}，年营收 ${currentSample.annualSales}，需 ${currentSample.recommendedLimit} 短期运营资金`],
                  ['还款来源', `与${currentSample.keyCounterparty}的交易回款（${currentSample.avgReceivableCycle}账期），${currentSample.accountFlowStatus}`],
                  ['脱核原因', currentSample.reviewReason],
                ].map(([title, desc]) => (
                  <div key={title} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                    <div className="text-xs font-medium text-[#0F172A]">{title}</div>
                    <div className="mt-1.5 text-[11px] leading-5 text-[#64748B]">{desc}</div>
                  </div>
                ))}
              </div>
            </WorkbenchPanel>

            {/* Demo 启动 */}
            {!active ? (
              <div className="rounded-xl border-2 border-dashed border-[#BFDBFE] bg-[#EFF6FF] p-6 text-center">
                <div className="text-sm font-medium text-[#1890FF]">准备就绪</div>
                <p className="mt-1 text-xs text-[#64748B]">
                  产业链生态已接入，点击下方按钮开始脱核链贷全链路演示
                </p>
                <Button className="mt-4 bg-[#1890FF] hover:bg-[#0F76D1] gap-2" onClick={() => startDemo()}>
                  <Play size={14} />
                  开始脱核链贷演示
                </Button>
              </div>
            ) : (
              <ActionBar />
            )}
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
