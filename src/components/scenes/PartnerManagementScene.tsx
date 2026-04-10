import React from 'react';
import SceneLayout from '../SceneLayout';
import { SCENES } from '../../constants';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Database,
  FileCheck2,
  Layers,
  Lightbulb,
  Play,
  Rocket,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDemo } from '../../demo/DemoContext';
import { SceneHero, ActionBar } from '../../demo/DemoComponents';
import { DistributionBarChart, CHART_COLORS } from '../Charts';

interface PartnerManagementSceneProps {
  activeModule: string;
  onModuleChange: (id: string) => void;
}

/* ────────────────────────────────────────────────────────────────
   Shared layout primitives following the Figma spec
   ──────────────────────────────────────────────────────────────── */

function SceneHeader({ title, subtitle, tags }: { title: string; subtitle: string; tags: string[] }) {
  return (
    <div className="rounded-[20px] border border-border bg-card px-6 py-5 shadow-sm" style={{ minHeight: 96 }}>
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-lg font-bold text-foreground tracking-tight">{title}</h2>
          <p className="mt-1 text-[13px] text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {tags.map(t => (
            <Badge key={t} variant="secondary" className="text-[10px] rounded-full px-2.5">{t}</Badge>
          ))}
        </div>
      </div>
    </div>
  );
}

function JudgmentCard({ title, children, tone = 'blue' }: { title: string; children: React.ReactNode; tone?: 'blue' | 'green' | 'amber' }) {
  const bg = tone === 'green' ? 'bg-emerald-50 border-emerald-200' : tone === 'amber' ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200';
  const icon = tone === 'green' ? <CheckCircle2 size={14} className="text-emerald-600" /> : tone === 'amber' ? <Lightbulb size={14} className="text-amber-600" /> : <Sparkles size={14} className="text-blue-600" />;
  return (
    <Card className={cn('border shadow-sm', bg)} style={{ minHeight: 144 }}>
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-2">{icon}<span className="text-[13px] font-semibold text-foreground">{title}</span></div>
        <div className="text-[12px] leading-5 text-muted-foreground">{children}</div>
      </CardContent>
    </Card>
  );
}

function SideSummaryCard({ title, items, action, onAction }: { title: string; items: { label: string; value: string }[]; action?: string; onAction?: () => void }) {
  return (
    <Card className="border border-border shadow-sm" style={{ minHeight: 144 }}>
      <CardContent className="p-5">
        <div className="text-[13px] font-semibold text-foreground mb-3">{title}</div>
        <div className="space-y-2">
          {items.map(i => (
            <div key={i.label} className="flex items-center justify-between text-[12px]">
              <span className="text-muted-foreground">{i.label}</span>
              <span className="font-medium text-foreground">{i.value}</span>
            </div>
          ))}
        </div>
        {action && (
          <Button size="sm" className="w-full mt-4 h-8 text-[12px]" onClick={onAction}>
            {action} <ArrowRight size={12} className="ml-1" />
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

function SectionShell({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[20px] border border-border bg-card p-5 shadow-sm">
      <div className="mb-4">
        <div className="text-[14px] font-semibold text-foreground">{title}</div>
        {subtitle && <div className="mt-0.5 text-[11px] text-muted-foreground">{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}

function ConditionCard({ title, items, tone }: { title: string; items: string[]; tone: 'green' | 'blue' | 'amber' }) {
  const border = tone === 'green' ? 'border-emerald-200' : tone === 'blue' ? 'border-blue-200' : 'border-amber-200';
  const dot = tone === 'green' ? 'bg-emerald-500' : tone === 'blue' ? 'bg-blue-500' : 'bg-amber-500';
  return (
    <Card className={cn('border shadow-sm', border)} style={{ minHeight: 156 }}>
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2.5">
          <div className={cn('w-2 h-2 rounded-full', dot)} />
          <span className="text-[12px] font-semibold text-foreground">{title}</span>
        </div>
        <div className="space-y-1.5">
          {items.map(item => (
            <div key={item} className="flex items-start gap-2 text-[11px] text-muted-foreground">
              <CheckCircle2 size={11} className="text-emerald-500 mt-0.5 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

const InfoCard: React.FC<{ title: string; subtitle: string; icon: React.ReactNode }> = ({ title, subtitle, icon }) => {
  return (
    <Card className="border border-border shadow-sm hover:shadow-md transition-shadow" style={{ minHeight: 164 }}>
      <CardContent className="p-5 flex flex-col h-full">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">{icon}</div>
          <span className="text-[13px] font-semibold text-foreground">{title}</span>
        </div>
        <p className="text-[11px] leading-5 text-muted-foreground flex-1">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

function SuggestionBar({ text, strong }: { text: string; strong?: boolean }) {
  return (
    <div className={cn(
      'flex items-center gap-3 rounded-xl border px-4 py-3',
      strong ? 'border-primary/30 bg-primary/5' : 'border-border bg-card shadow-sm',
    )} style={{ minHeight: 56 }}>
      <div className={cn('w-5 h-5 rounded flex items-center justify-center shrink-0', strong ? 'bg-primary' : 'bg-muted')}>
        <Sparkles size={10} className={strong ? 'text-white' : 'text-muted-foreground'} />
      </div>
      <p className="flex-1 text-[12px] text-foreground leading-5">{text}</p>
      <ChevronRight size={14} className="text-muted-foreground shrink-0" />
    </div>
  );
}

function VerticalFlowCard({ steps }: { steps: string[] }) {
  return (
    <Card className="border border-border shadow-sm" style={{ minHeight: 320 }}>
      <CardContent className="p-5">
        <div className="text-[12px] font-semibold text-foreground mb-4">试点输出路径</div>
        <div className="space-y-0">
          {steps.map((step, i) => (
            <div key={step} className="flex items-start gap-3">
              <div className="flex flex-col items-center">
                <div className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0',
                  i === steps.length - 1 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground',
                )}>{i + 1}</div>
                {i < steps.length - 1 && <div className="w-px h-6 bg-border" />}
              </div>
              <div className="text-[12px] text-foreground pt-1">{step}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function ComparisonColumn({ title, items, tone }: { title: string; items: { label: string; value: string }[]; tone: 'blue' | 'green' | 'amber' }) {
  const border = tone === 'green' ? 'border-emerald-200' : tone === 'blue' ? 'border-blue-200' : 'border-amber-200';
  const headerBg = tone === 'green' ? 'bg-emerald-50' : tone === 'blue' ? 'bg-blue-50' : 'bg-amber-50';
  return (
    <Card className={cn('border shadow-sm', border)} style={{ minHeight: 220 }}>
      <div className={cn('px-4 py-3 rounded-t-xl', headerBg)}>
        <div className="text-[13px] font-semibold text-foreground">{title}</div>
      </div>
      <CardContent className="p-4 space-y-3">
        {items.map(i => (
          <div key={i.label}>
            <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{i.label}</div>
            <div className="mt-0.5 text-[12px] text-foreground font-medium">{i.value}</div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

/* ────────────────────────────────────────────────────────────────
   Main Component
   ──────────────────────────────────────────────────────────────── */

export default function PartnerManagementScene({ activeModule, onModuleChange }: PartnerManagementSceneProps) {
  const scene = SCENES.find((item) => item.id === 'partner-management')!;
  const { active, startDemo, currentSample } = useDemo();

  const renderContent = () => {
    switch (activeModule) {

      /* ═══════════════════════════════════════════════════════════
         页面 2：数据能力
         ═══════════════════════════════════════════════════════════ */
      case 'capability':
        return (
          <div className="space-y-6">
            {active && <SceneHero question="数据从哪来、能力分几层、每层解决什么" />}

            {/* Screen 1: Header + Hero */}
            <SceneHeader
              title="数据能力"
              subtitle="解释产品的数据能力分层：内部数据是基础、替代证据是补强、外部数据是增强"
              tags={['内部数据基础', '替代证据补强', '外部数据增强']}
            />

            <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <JudgmentCard title="内部数据是基础能力来源" tone="blue">
                  银行对公结算、代发工资、历史授信等内部数据是最优先的数据来源，无需外部采购即可构建识别与评估能力。
                </JudgmentCard>
                <JudgmentCard title="替代性证据用于补强判断" tone="green">
                  税票连续性、物流签收、回款闭环等数据用于弥补链主不确权场景下的证据缺口，提升补审通过率。
                </JudgmentCard>
                <JudgmentCard title="外部数据用于增强效率" tone="amber">
                  工商、司法、行业舆情等外部数据用于提高识别精度和监控效率，但不是启动前提。
                </JudgmentCard>
              </div>
              <Card className="border border-border shadow-sm" style={{ minHeight: 160 }}>
                <CardContent className="p-5">
                  <div className="text-[13px] font-semibold text-foreground mb-4">数据能力分层</div>
                  <div className="space-y-2">
                    {[
                      { layer: '基础层', desc: '银行内部结算/代发/历史信贷', color: 'bg-blue-500' },
                      { layer: '补强层', desc: '税票/物流/回款闭环替代证据', color: 'bg-emerald-500' },
                      { layer: '增强层', desc: '工商/司法/行业舆情外部数据', color: 'bg-amber-500' },
                    ].map(l => (
                      <div key={l.layer} className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2.5">
                        <div className={cn('w-3 h-3 rounded', l.color)} />
                        <div>
                          <div className="text-[12px] font-semibold text-foreground">{l.layer}</div>
                          <div className="text-[10px] text-muted-foreground">{l.desc}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Screen 2: 内部识别能力 */}
            <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
              <SectionShell title="内部识别能力" subtitle="仅依托银行内部数据即可完成的识别动作">
                <div className="space-y-3">
                  {[
                    { name: '潜客发现', desc: '通过对公结算流水中的高频对手方关系，发现产业链上的潜在借款主体', source: '对公结算、代发工资' },
                    { name: '关系推断', desc: '根据多维度交易行为推断企业在产业链中的角色和层级', source: '结算流水、公私联动' },
                    { name: '经营初筛', desc: '基于交易频次、金额稳定性和账户活跃度进行基础经营评估', source: '历史授信、账户流水' },
                  ].map(c => (
                    <div key={c.name} className="rounded-xl border border-border bg-muted/20 px-4 py-3.5" style={{ minHeight: 120 }}>
                      <div className="text-[13px] font-semibold text-foreground">{c.name}</div>
                      <p className="mt-1 text-[11px] leading-5 text-muted-foreground">{c.desc}</p>
                      <div className="mt-2 text-[10px] text-primary font-medium">数据源: {c.source}</div>
                    </div>
                  ))}
                </div>
              </SectionShell>
              <Card className="border border-border shadow-sm" style={{ minHeight: 420 }}>
                <CardContent className="p-5">
                  <div className="text-[12px] font-semibold text-foreground mb-4">识别链路图</div>
                  <div className="space-y-0">
                    {['银行内部数据', '行为特征提取', '关系图谱推断', '经营初筛评估', '预筛结论输出'].map((step, i) => (
                      <div key={step} className="flex items-start gap-3">
                        <div className="flex flex-col items-center">
                          <div className={cn('w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0', i === 4 ? 'bg-primary text-white' : 'bg-muted text-muted-foreground')}>{i + 1}</div>
                          {i < 4 && <div className="w-px h-8 bg-border" />}
                        </div>
                        <div className="pt-1.5 text-[12px] text-foreground">{step}</div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Screen 3: 替代性证据补强 */}
            <SectionShell title="替代性证据补强" subtitle="用于弥补链主不确权场景下的证据缺口">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {[
                  { name: '订单线索补强', desc: '通过平台订单数据验证交易真实性和稳定性，覆盖订单频次与金额' },
                  { name: '物流履约补强', desc: '通过物流签收回单验证货物交付履约，提供物理层面的交易佐证' },
                  { name: '回款闭环补强', desc: '通过银行结算流水验证回款路径与周期，形成资金层面的闭环证据' },
                ].map(c => (
                  <Card key={c.name} className="border border-border shadow-sm" style={{ minHeight: 150 }}>
                    <CardContent className="p-4">
                      <div className="text-[12px] font-semibold text-foreground mb-1.5">{c.name}</div>
                      <p className="text-[11px] leading-5 text-muted-foreground">{c.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="rounded-xl border border-primary/20 bg-primary/5 px-5 py-3.5" style={{ minHeight: 120 }}>
                <div className="text-[13px] font-semibold text-foreground mb-1">三流交叉验证</div>
                <p className="text-[11px] leading-5 text-muted-foreground">订单数据 × 物流数据 × 回款数据，三者交叉匹配度越高，经营真实性越强</p>
                <div className="mt-3 rounded-lg border border-primary/20 bg-card px-3 py-2 text-[11px] text-primary font-medium">
                  <Lightbulb size={12} className="inline mr-1.5" />
                  证据越强，越支持补审通过，但不替代补审本身
                </div>
              </div>
            </SectionShell>

            {/* Screen 4: 外部数据增强 */}
            <div className="grid grid-cols-1 xl:grid-cols-[7fr_5fr] gap-6">
              <SectionShell title="外部数据增强" subtitle="提升识别效率和监控精度，但非启动必需项">
                <div className="space-y-3">
                  {[
                    { name: '识别置信度增强', desc: '工商登记数据验证主体真实性，税务数据增强经营持续性判断' },
                    { name: '补审效率增强', desc: '司法风险数据快速排除高风险主体，减少人工复核负担' },
                    { name: '复制推广增强', desc: '行业舆情数据支持跨链路快速复制，缩短新场景的冷启动周期' },
                  ].map(c => (
                    <div key={c.name} className="rounded-xl border border-border bg-muted/20 px-4 py-3.5">
                      <div className="text-[12px] font-semibold text-foreground">{c.name}</div>
                      <p className="mt-1 text-[11px] leading-5 text-muted-foreground">{c.desc}</p>
                    </div>
                  ))}
                </div>
              </SectionShell>
              <Card className="border border-border shadow-sm" style={{ minHeight: 360 }}>
                <CardContent className="p-5">
                  <div className="text-[12px] font-semibold text-foreground mb-3">增强效果预估</div>
                  <DistributionBarChart
                    data={[
                      { name: '识别精度', value: 28, color: CHART_COLORS.blue },
                      { name: '补审效率', value: 35, color: CHART_COLORS.emerald },
                      { name: '复制速度', value: 42, color: CHART_COLORS.violet },
                    ]}
                    height={240}
                  />
                  <div className="mt-2 text-center text-[10px] text-muted-foreground">示意数据 · 接入后预计提升幅度 (%)</div>
                </CardContent>
              </Card>
            </div>

            {/* Screen 5: 数据作用分层对照 */}
            <SectionShell title="数据作用分层" subtitle="三类数据在业务中的角色对照">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ComparisonColumn title="内部数据" tone="blue" items={[
                  { label: '主要作用', value: '客群发现 · 关系推断 · 经营评估' },
                  { label: '进入阶段', value: '客群识别 · 预授信 · 贷后监控' },
                  { label: '是否为启动前提', value: '是 · 无内部数据无法启动' },
                ]} />
                <ComparisonColumn title="替代性证据" tone="green" items={[
                  { label: '主要作用', value: '补强判断 · 提升补审通过率' },
                  { label: '进入阶段', value: '补审作业 · 风险监控' },
                  { label: '是否为启动前提', value: '否 · 但影响补审质量' },
                ]} />
                <ComparisonColumn title="外部增强数据" tone="amber" items={[
                  { label: '主要作用', value: '提效率 · 降误判 · 快复制' },
                  { label: '进入阶段', value: '全流程可选增强' },
                  { label: '是否为启动前提', value: '否 · 可后置引入' },
                ]} />
              </div>
            </SectionShell>

            {/* Screen 6: Footer */}
            <div className="space-y-3">
              <SuggestionBar text="建议首批试点仅使用内部数据 + 税票/物流替代证据，外部增强数据在第二阶段引入" strong />
              <SuggestionBar text="三流交叉验证是脱核链贷的核心证据能力，应优先确保订单、物流、回款三路数据的可用性" />
            </div>

            {active && <ActionBar />}
          </div>
        );

      /* ═══════════════════════════════════════════════════════════
         页面 3：合作接入
         ═══════════════════════════════════════════════════════════ */
      case 'integration':
        return (
          <div className="space-y-6">
            {active && <SceneHero question="接谁、怎么接、为什么值得接" />}

            {/* Screen 1: Header + Hero */}
            <SceneHeader
              title="合作接入"
              subtitle="合作接入的策略、角色分层、方式选择与优先级排序"
              tags={['先内后外', '先轻后重', '按收益排序']}
            />

            <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <JudgmentCard title="优先跑通内部数据闭环" tone="blue">
                  银行内部数据足以支撑第一阶段的客群识别和预授信，不需要等外部数据接入后才启动。
                </JudgmentCard>
                <JudgmentCard title="合作接入应按业务收益排序" tone="green">
                  每一个接入动作都应回答"接了以后改善什么"，不应为了"数据丰富度"而盲目接入。
                </JudgmentCard>
                <JudgmentCard title="接入方式可分阶段推进" tone="amber">
                  从文件导入到API直连，接入方式随业务成熟度逐步升级，避免前期过度投入。
                </JudgmentCard>
              </div>
              <SideSummaryCard
                title="接入原则"
                items={[
                  { label: '优先级', value: '先内后外' },
                  { label: '复杂度', value: '先轻后重' },
                  { label: '验证路径', value: '先试点后扩展' },
                  { label: '决策标准', value: '以收益定优先级' },
                ]}
              />
            </div>

            {/* Screen 2: 合作角色分层 */}
            <SectionShell title="合作角色分层" subtitle="按职责类型分为三类合作方">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { role: '数据提供方', duty: '提供物流签收、平台订单、仓储周转等产业链数据', required: '视场景而定', phase: '试点阶段可轻量接入' },
                  { role: '业务协同方', duty: '参与链路验证、提供产业知识、协助样板输出', required: '是 · 至少 1 家', phase: '试点阶段必须参与' },
                  { role: '实施支持方', duty: '负责系统集成、数据对接、规则配置等技术交付', required: '视交付模式而定', phase: '扩展阶段按需引入' },
                ].map(r => (
                  <Card key={r.role} className="border border-border shadow-sm" style={{ minHeight: 220 }}>
                    <CardContent className="p-5">
                      <div className="text-[14px] font-bold text-foreground mb-3">{r.role}</div>
                      <div className="space-y-3">
                        <div><div className="text-[10px] text-muted-foreground uppercase tracking-wider">主要职责</div><div className="mt-0.5 text-[12px] text-foreground">{r.duty}</div></div>
                        <div><div className="text-[10px] text-muted-foreground uppercase tracking-wider">是否必需</div><div className="mt-0.5 text-[12px] text-foreground">{r.required}</div></div>
                        <div><div className="text-[10px] text-muted-foreground uppercase tracking-wider">参与阶段</div><div className="mt-0.5 text-[12px] text-foreground">{r.phase}</div></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </SectionShell>

            {/* Screen 3: 接入方式 */}
            <SectionShell title="接入方式" subtitle="从轻量导入到系统直连，分阶段推进">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {[
                  { method: '轻量导入', desc: 'Excel / CSV 文件批量导入，适合试点阶段快速验证', cost: '低', cycle: '1-2 周' },
                  { method: '周期同步', desc: 'SFTP / 定时推送，适合稳定合作方的周期性数据更新', cost: '中', cycle: '2-4 周' },
                  { method: '系统直连', desc: 'API 实时对接，适合成熟合作方的生产级数据通道', cost: '高', cycle: '4-8 周' },
                ].map((m, i) => (
                  <div key={m.method} className="flex items-stretch gap-0">
                    <Card className="border border-border shadow-sm flex-1" style={{ minHeight: 160 }}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold">{i + 1}</div>
                          <span className="text-[13px] font-semibold text-foreground">{m.method}</span>
                        </div>
                        <p className="text-[11px] leading-5 text-muted-foreground mb-3">{m.desc}</p>
                        <div className="flex items-center gap-3 text-[10px]">
                          <span className="text-muted-foreground">成本: <span className="font-medium text-foreground">{m.cost}</span></span>
                          <span className="text-muted-foreground">周期: <span className="font-medium text-foreground">{m.cycle}</span></span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </SectionShell>

            {/* Screen 4: 接入优先级建议 */}
            <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
              <SectionShell title="接入优先级建议">
                <div className="space-y-3">
                  {[
                    { priority: '第一优先级', name: '内部数据闭环', desc: '对公结算、代发工资、历史信贷 → 构建识别基础能力', badge: 'P0' },
                    { priority: '第二优先级', name: '高价值补审数据', desc: '物流签收、税票连续性、平台订单 → 提升补审通过率', badge: 'P1' },
                    { priority: '第三优先级', name: '复制型增强接入', desc: '工商信息、司法风险、行业舆情 → 加速跨链路复制', badge: 'P2' },
                  ].map(p => (
                    <Card key={p.priority} className="border border-border shadow-sm" style={{ minHeight: 124 }}>
                      <CardContent className="p-4">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Badge className="text-[10px] px-1.5">{p.badge}</Badge>
                          <span className="text-[12px] font-semibold text-foreground">{p.priority}: {p.name}</span>
                        </div>
                        <p className="text-[11px] leading-5 text-muted-foreground">{p.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </SectionShell>
              <Card className="border border-border shadow-sm" style={{ minHeight: 220 }}>
                <CardContent className="p-5">
                  <div className="text-[12px] font-semibold text-foreground mb-4">评估规则</div>
                  <div className="space-y-3">
                    {[
                      '是否改善识别质量',
                      '是否改善补审效率',
                      '是否具备模板化复用',
                      '是否增加过高接入成本',
                    ].map((rule, i) => (
                      <div key={rule} className="flex items-center gap-2.5 text-[12px]">
                        <div className={cn('w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold', i === 3 ? 'bg-destructive/10 text-destructive' : 'bg-primary/10 text-primary')}>{i + 1}</div>
                        <span className="text-foreground">{rule}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Screen 5: 接入收益判断 */}
            <SectionShell title="接入收益判断" subtitle="每一次接入都应回答：接了改善什么">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {[
                  { type: '识别收益', desc: '提升潜客发现数量和关系推断准确率，扩大候选池覆盖', value: '+35% 候选识别量' },
                  { type: '补审收益', desc: '增强三流交叉验证的证据厚度，提升补审通过率', value: '+12% 补审通过率' },
                  { type: '复制收益', desc: '缩短新链路场景冷启动周期，加速产品覆盖范围', value: '-40% 冷启动周期' },
                ].map(b => (
                  <Card key={b.type} className="border border-border shadow-sm" style={{ minHeight: 148 }}>
                    <CardContent className="p-4">
                      <div className="text-[13px] font-semibold text-foreground mb-1.5">{b.type}</div>
                      <p className="text-[11px] leading-5 text-muted-foreground">{b.desc}</p>
                      <div className="mt-2.5 text-[12px] font-bold text-primary">{b.value}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="rounded-xl border-2 border-primary/30 bg-primary/5 px-5 py-3.5 text-center" style={{ minHeight: 72 }}>
                <p className="text-[13px] font-medium text-foreground">
                  应强调"为什么接、接了带来什么收益"，而不是"我们能接多少"
                </p>
              </div>
            </SectionShell>

            {/* Screen 6: Footer */}
            <div className="space-y-3">
              <SuggestionBar text="第一阶段仅需完成内部数据闭环 + 1 家物流数据方接入，即可启动试点" strong />
              <SuggestionBar text="每个接入决策都应附带收益预估和退出条件，避免无效投入" />
            </div>

            {active && <ActionBar />}
          </div>
        );

      /* ═══════════════════════════════════════════════════════════
         页面 1：启动条件 (default)
         ═══════════════════════════════════════════════════════════ */
      default:
        return (
          <div className="space-y-6">
            {active && <SceneHero question="能不能先启动、需要什么最低条件、先跑什么" />}

            {/* Screen 1: Header + Hero */}
            <SceneHeader
              title="启动条件"
              subtitle="描述产品启动所需的最低数据条件、启动策略和试点输出"
              tags={['试点可启动', '内部数据优先', '外部接入非前置']}
            />

            <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <JudgmentCard title="当前方案可先行启动" tone="blue">
                  依托银行内部结算、代发和历史授信数据，无需等待外部数据接入，即可完成首批客群识别与预授信。
                </JudgmentCard>
                <JudgmentCard title="建议先跑最小试点闭环" tone="green">
                  选择 1 条成熟产业链（如新能源电池链），跑通"识别 → 预授信 → 补审 → 放款"的最小闭环。
                </JudgmentCard>
                <JudgmentCard title="外部增强可后置引入" tone="amber">
                  物流签收、税票连续性等替代证据可在试点跑通后逐步引入，工商/司法等外部数据为第二阶段增强项。
                </JudgmentCard>
              </div>
              <SideSummaryCard
                title="启动摘要"
                items={[
                  { label: '数据就绪度', value: '基础层已满足' },
                  { label: '试点链路', value: '新能源电池链' },
                  { label: '预计样本', value: '126 户候选' },
                  { label: '预计周期', value: '4-6 周出结果' },
                ]}
                action="开始试点"
                onAction={() => startDemo()}
              />
            </div>

            {/* Screen 2: 最低启动条件 */}
            <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
              <SectionShell title="最低启动条件" subtitle="按必须/建议/增强三级分组">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ConditionCard title="必需条件" tone="green" items={[
                    '对公结算流水已接入',
                    '代发工资数据已接入',
                    '历史授信/还款数据可用',
                    '规则引擎基础版已部署',
                  ]} />
                  <ConditionCard title="建议具备" tone="blue" items={[
                    '税票连续性数据已接入',
                    '物流签收数据已接入',
                    '公私联动数据可交叉',
                  ]} />
                  <ConditionCard title="增强条件" tone="amber" items={[
                    '工商登记信息',
                    '司法风险排查',
                    '行业舆情数据',
                    '仓储周转数据',
                  ]} />
                </div>
              </SectionShell>
              <Card className="border border-border shadow-sm" style={{ minHeight: 220 }}>
                <CardContent className="p-5">
                  <div className="text-[13px] font-semibold text-foreground mb-4">启动成熟度</div>
                  {[
                    { label: '内部数据就绪', pct: 95 },
                    { label: '替代证据就绪', pct: 72 },
                    { label: '外部增强就绪', pct: 35 },
                  ].map(p => (
                    <div key={p.label} className="mb-3">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="text-muted-foreground">{p.label}</span>
                        <span className="font-medium text-foreground">{p.pct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-muted overflow-hidden">
                        <div className="h-full rounded-full bg-primary/70 transition-all" style={{ width: `${p.pct}%` }} />
                      </div>
                    </div>
                  ))}
                  <p className="mt-4 text-[10px] text-muted-foreground leading-4">
                    内部数据就绪度 &gt; 90% 即可启动试点，替代证据和外部数据可在试点进行中逐步补全。
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Screen 3: 行内现有数据基础 */}
            <SectionShell title="行内现有数据基础" subtitle="无需外部采购即可使用的银行内部数据资产">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {([
                  { name: '对公账户与结算流水', desc: '覆盖企业主要交易对手、结算频次、金额分布和账户活跃度', icon: <Database size={16} /> as React.ReactNode },
                  { name: '存量客户经营行为', desc: '代发工资规模、按揭/理财持有、账户沉淀等多维度经营画像', icon: <TrendingUp size={16} /> as React.ReactNode },
                  { name: '公私联动关系线索', desc: '企业法人的个人金融行为与企业经营行为的交叉关系', icon: <Layers size={16} /> as React.ReactNode },
                  { name: '业务标签与行业线索', desc: '已有客户分类标签、行业归属、历史授信表现等结构化信息', icon: <FileCheck2 size={16} /> as React.ReactNode },
                ]).map(d => (
                  <InfoCard key={d.name} title={d.name} subtitle={d.desc} icon={d.icon} />
                ))}
              </div>
            </SectionShell>

            {/* Screen 4: 试点输出结果 */}
            <div className="grid grid-cols-1 xl:grid-cols-[2fr_1fr] gap-6">
              <SectionShell title="试点启动后可形成的输出" subtitle="首批试点 4-6 周内的核心交付件">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { name: '潜在客户名单', desc: '基于内部数据识别的产业链潜在借款主体清单，附置信度评分' },
                    { name: '候选关系线索', desc: '交易对手方关系图谱中的候选链路，含角色标注和关系强度' },
                    { name: '预授信候选池', desc: '通过规则引擎初筛后的预授信名单，含推荐额度和匹配产品' },
                    { name: '补审优先级建议', desc: '按证据覆盖度和关系强度排序的补审队列，附 AI 建议' },
                  ].map(o => (
                    <Card key={o.name} className="border border-border shadow-sm" style={{ minHeight: 148 }}>
                      <CardContent className="p-4">
                        <div className="text-[12px] font-semibold text-foreground mb-1.5">{o.name}</div>
                        <p className="text-[11px] leading-5 text-muted-foreground">{o.desc}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </SectionShell>
              <VerticalFlowCard steps={['内部数据接入', '候选识别', '关系初筛', '预授信候选', '补审承接']} />
            </div>

            {/* Screen 5: Footer */}
            <div className="space-y-3">
              <div className="text-[13px] font-semibold text-foreground">下一步建议</div>
              <SuggestionBar text="选择新能源电池产业链作为首批试点，4-6 周内跑通识别 → 预授信 → 补审最小闭环" strong />
              <SuggestionBar text="试点期间同步推进物流签收和税票数据接入，为第二阶段扩展做准备" />
              <div className="rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-[11px] text-muted-foreground">
                提示: 外部增强数据（工商、司法、舆情）建议在试点验证后再评估接入价值
              </div>
            </div>

            {!active ? (
              <div className="rounded-[20px] border-2 border-dashed border-primary/30 bg-primary/5 p-8 text-center">
                <Rocket size={24} className="mx-auto text-primary mb-2" />
                <div className="text-sm font-semibold text-foreground">启动条件已满足</div>
                <p className="mt-1 text-[12px] text-muted-foreground max-w-md mx-auto">
                  银行内部数据就绪度 95%，可立即启动新能源电池产业链试点演示
                </p>
                <Button className="mt-4 gap-2" onClick={() => startDemo()}>
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
