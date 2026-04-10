import React from 'react';
import SceneLayout from '../SceneLayout';
import { SCENES } from '../../constants';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  ChevronRight,
  Filter,
  Search,
  Settings,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDemo } from '../../demo/DemoContext';

/* ══════════════════════════════════════════════════════════════════
   Data
   ══════════════════════════════════════════════════════════════════ */

const STANDARD_RULES = [
  { id: 'SM-001', name: '税票连续经营客群', desc: '连续开票≥6个月 + 税票金额稳定', scope: '基础准入', status: '启用' as const, source: ['税票数据'], hit: '28%', owner: '产品策略组' },
  { id: 'SM-002', name: '流水稳定经营客群', desc: '月均对公流水≥50万 + 波动率<30%', scope: '基础准入', status: '启用' as const, source: ['对公流水'], hit: '22%', owner: '产品策略组' },
  { id: 'SM-003', name: '经营关系稳定客群', desc: '高频交易对手≥3家 + 连续交易≥4个月', scope: '关系识别', status: '启用' as const, source: ['对公流水', '交易频次'], hit: '18%', owner: '张明远' },
  { id: 'SM-004', name: '代发工资客群', desc: '代发工资人数≥10人 + 连续≥6个月', scope: '公私联动', status: '启用' as const, source: ['代发工资'], hit: '15%', owner: '李雪婷' },
  { id: 'SM-005', name: '结算归集客群', desc: '结算账户归集率≥60% + 月活≥4次', scope: '基础准入', status: '灰度' as const, source: ['对公流水', '结算数据'], hit: '—', owner: '王敏' },
];

const LONG_TAIL_RULES = [
  { id: 'LT-001', name: '脱核链贷场景', desc: '链主未确权 + 三流交叉验证通过 + 关系强度≥70', scope: '准入 + 补审', status: '启用' as const, source: ['对公流水', '物流', '回款'], hit: '12.6%', owner: '王敏' },
  { id: 'LT-002', name: '物流服务贷场景', desc: '运单频次≥20笔/月 + 结算周期≤21天', scope: '准入', status: '试运行' as const, source: ['运单数据', '对公流水'], hit: '8.4%', owner: '陈立' },
  { id: 'LT-003', name: '园区场景贷', desc: '入驻产业园区 + 园区协同数据可用', scope: '准入 + 增强', status: '灰度' as const, source: ['园区数据', '对公流水'], hit: '—', owner: '张明远' },
  { id: 'LT-004', name: '季节性经营场景', desc: '经营存在明显季节波动 + 峰值销售可验证', scope: '准入 + 贷中', status: '灰度' as const, source: ['税票数据', '对公流水'], hit: '—', owner: '李雪婷' },
];

const PRODUCTS = [
  { id: 'P-001', name: '信用快贷', target: '存量代发/结算/按揭客户', limit: '10–50万', rate: '5.8%–6.5%', term: '12个月', rulePackage: '基础准入 + 公私联动', status: '已上线' as const },
  { id: 'P-002', name: '数据贷', target: '税票流水达标小微', limit: '50–200万', rate: '6.2%–7.5%', term: '6–12个月', rulePackage: '税票融合 + 图谱评分', status: '已上线' as const },
  { id: 'P-003', name: '订单微贷', target: '脱核链贷场景主体', limit: '30–150万', rate: '7.0%–8.2%', term: '6个月', rulePackage: '产业数据 + 经营实质 + 脱核补审', status: '试运行' as const },
  { id: 'P-004', name: '运费贷', target: '链上物流服务主体', limit: '20–100万', rate: '6.8%–7.8%', term: '3–6个月', rulePackage: '运单频次 + 结算验证', status: '试运行' as const },
];

const APPROVAL_RULES = [
  { id: 'R-001', name: '高频对手规则', category: '基础' as const, trigger: '月均交易≥3笔 & 连续4月', scope: '关系识别', status: '启用' as const, owner: '张明远', hitRate: '18.4%', fpRate: '3.2%', action: '关系候选加分 → 进入候选池' },
  { id: 'R-005', name: '集中度规则', category: '基础' as const, trigger: '最大对手占比≤55%', scope: '准入 + 贷中', status: '启用' as const, owner: '王敏', hitRate: '6.1%', fpRate: '8.2%', action: '降额 → 贷中监控' },
  { id: 'R-006', name: '快进快出排除', category: '排除' as const, trigger: '3日内进出差<5%', scope: '风险排除', status: '启用' as const, owner: '陈立', hitRate: '3.8%', fpRate: '6.1%', action: '候选降级 → 标记异常' },
  { id: 'R-008', name: '断票规则', category: '准入' as const, trigger: '连续未开票≥2个月', scope: '准入', status: '启用' as const, owner: '王敏', hitRate: '4.2%', fpRate: '4.2%', action: '自动拒件' },
  { id: 'R-009', name: '脱核补审规则', category: '准入' as const, trigger: '未获得链主直接确权', scope: '准入', status: '启用' as const, owner: '王敏', hitRate: '12.6%', fpRate: '11.2%', action: '进入人工补审 → 调取证据包' },
  { id: 'R-010', name: '回款周期规则', category: '贷中' as const, trigger: '回款周期拉长>40%', scope: '贷中', status: '启用' as const, owner: '陈立', hitRate: '3.5%', fpRate: '15.3%', action: '临时收缩额度 → 生成复核' },
  { id: 'R-012', name: '资金外流规则', category: '贷中' as const, trigger: '连续3周净流出', scope: '贷中', status: '灰度' as const, owner: '陈立', hitRate: '—', fpRate: '—', action: '生成排查任务 → 人工复核' },
];

const CATEGORY_STYLES: Record<string, string> = {
  '基础': 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
  '排除': 'bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]',
  '增强': 'bg-[#F0FDF4] text-[#047857] border-[#A7F3D0]',
  '准入': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
  '贷中': 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]',
};

/* ══════════════════════════════════════════════════════════════════
   Rule Card
   ══════════════════════════════════════════════════════════════════ */

const RuleCard: React.FC<{ rule: { id: string; name: string; desc: string; scope: string; status: string; source: string[]; hit: string; owner: string } }> = ({ rule }) => {
  return (
    <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden hover:shadow-sm transition-shadow">
      <div className="px-4 py-2.5 flex items-center gap-2 border-b border-[#F1F5F9]">
        <div className={`w-2 h-2 rounded-full shrink-0 ${rule.status === '启用' ? 'bg-[#16A34A]' : rule.status === '试运行' ? 'bg-[#F59E0B]' : 'bg-[#CBD5E1]'}`} />
        <span className="text-[11px] text-[#94A3B8] font-mono">{rule.id}</span>
        <span className="text-[13px] font-semibold text-[#0F172A]">{rule.name}</span>
        <Badge className="bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] text-[9px]">{rule.scope}</Badge>
        <div className="flex-1" />
        <Badge className={`text-[9px] border ${rule.status === '启用' ? 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]' : rule.status === '试运行' ? 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]' : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]'}`}>{rule.status}</Badge>
      </div>
      <div className="px-4 py-2.5 grid grid-cols-[1fr_auto_auto] gap-4 items-center">
        <div className="text-[11px] text-[#64748B] leading-4">{rule.desc}</div>
        <div className="flex flex-wrap gap-1">
          {rule.source.map(s => (<span key={s} className="bg-[#F1F5F9] border border-[#E2E8F0] rounded px-1.5 py-0.5 text-[9px] text-[#475569]">{s}</span>))}
        </div>
        <div className="text-right">
          <div className="text-[10px] text-[#94A3B8]">命中率</div>
          <div className="text-sm font-semibold text-[#0F172A]">{rule.hit}</div>
        </div>
      </div>
      <div className="px-4 py-1.5 bg-[#FAFBFC] border-t border-[#F1F5F9] text-[10px] text-[#94A3B8]">
        负责人: {rule.owner}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════════════════════ */

interface Props { activeModule: string; onModuleChange: (id: string) => void }

export default function PartnerManagementScene({ activeModule, onModuleChange }: Props) {
  const scene = SCENES.find(s => s.id === 'partner-management')!;

  const renderContent = () => {
    switch (activeModule) {

      /* ═══════════════════════════════════════════════════════════
         PAGE 1: 标准小微规则 (DEFAULT)
         ═══════════════════════════════════════════════════════════ */
      case 'standard':
      default:
        return (
          <div className="space-y-4">
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 flex items-center justify-between text-[11px] text-[#94A3B8]">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-[#0F172A]">标准小微识别规则</span>
                <span>配置口径: 全量标准小微规则</span>
                <span>最后更新: 2026-04-08</span>
                <span>负责人: 产品策略组</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-[#ECFDF3] text-[#047857] border-[#A7F3D0] text-[10px]">启用 {STANDARD_RULES.filter(r => r.status === '启用').length}</Badge>
                <Badge className="bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] text-[10px]">灰度 {STANDARD_RULES.filter(r => r.status === '灰度').length}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { label: '规则总数', value: `${STANDARD_RULES.length}`, desc: `启用 ${STANDARD_RULES.filter(r => r.status === '启用').length} · 灰度 ${STANDARD_RULES.filter(r => r.status === '灰度').length}` },
                { label: '综合命中率', value: '21.3%', desc: '日均命中 160+ 户' },
                { label: '候选池贡献', value: '68%', desc: '标准规则贡献候选中 68%' },
              ].map(m => (
                <div key={m.label} className="rounded-lg border border-[#E2E8F0] bg-white p-3">
                  <div className="text-[10px] text-[#94A3B8]">{m.label}</div>
                  <div className="mt-0.5 text-xl font-bold text-[#0F172A]">{m.value}</div>
                  <div className="mt-0.5 text-[10px] text-[#64748B]">{m.desc}</div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {STANDARD_RULES.map(rule => <RuleCard key={rule.id} rule={rule} />)}
            </div>
          </div>
        );

      /* ═══════════════════════════════════════════════════════════
         PAGE 2: 长尾场景规则
         ═══════════════════════════════════════════════════════════ */
      case 'long-tail':
        return (
          <div className="space-y-4">
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 flex items-center justify-between text-[11px] text-[#94A3B8]">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-[#0F172A]">长尾场景规则</span>
                <span>配置口径: 场景化扩展规则</span>
                <span>最后更新: 2026-04-08</span>
                <span>负责人: 风控策略组</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-[#ECFDF3] text-[#047857] border-[#A7F3D0] text-[10px]">启用 {LONG_TAIL_RULES.filter(r => r.status === '启用').length}</Badge>
                <Badge className="bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA] text-[10px]">试运行 {LONG_TAIL_RULES.filter(r => r.status === '试运行').length}</Badge>
                <Badge className="bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] text-[10px]">灰度 {LONG_TAIL_RULES.filter(r => r.status === '灰度').length}</Badge>
              </div>
            </div>
            <div className="rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-3 text-[12px] text-[#2563EB] flex items-center gap-2">
              <Sparkles size={14} className="shrink-0" />
              <span>长尾场景规则覆盖标准小微规则未能识别的差异化客群，通常需要更强的证据链或人工补审。</span>
            </div>
            <div className="space-y-2">
              {LONG_TAIL_RULES.map(rule => <RuleCard key={rule.id} rule={rule} />)}
            </div>
          </div>
        );

      /* ═══════════════════════════════════════════════════════════
         PAGE 3: 产品配置
         ═══════════════════════════════════════════════════════════ */
      case 'product-config':
        return (
          <div className="space-y-4">
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 flex items-center justify-between text-[11px] text-[#94A3B8]">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-[#0F172A]">产品配置台</span>
                <span>配置口径: 全量产品</span>
                <span>最后更新: 2026-04-06</span>
                <span>负责人: 产品策略组</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-[#ECFDF3] text-[#047857] border-[#A7F3D0] text-[10px]">已上线 {PRODUCTS.filter(p => p.status === '已上线').length}</Badge>
                <Badge className="bg-[#EFF6FF] text-[#1890FF] border-[#BFDBFE] text-[10px]">试运行 {PRODUCTS.filter(p => p.status === '试运行').length}</Badge>
              </div>
            </div>
            <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
              <div className="grid grid-cols-[60px_1fr_1fr_100px_100px_80px_1fr_80px] gap-0 px-4 py-2.5 border-b border-[#E2E8F0] bg-[#F8FAFC] text-[10px] font-medium text-[#94A3B8] uppercase tracking-wider">
                <div>编号</div><div>产品名称</div><div>适用客群</div><div>额度区间</div><div>定价</div><div>期限</div><div>绑定规则包</div><div>状态</div>
              </div>
              {PRODUCTS.map(p => (
                <div key={p.id} className="grid grid-cols-[60px_1fr_1fr_100px_100px_80px_1fr_80px] gap-0 px-4 py-3 border-b border-[#F1F5F9] last:border-b-0 items-center hover:bg-[#FAFBFF] transition-colors">
                  <span className="text-[11px] text-[#94A3B8] font-mono">{p.id}</span>
                  <span className="text-[13px] font-medium text-[#0F172A]">{p.name}</span>
                  <span className="text-[11px] text-[#64748B]">{p.target}</span>
                  <span className="text-[11px] text-[#334155] font-medium">{p.limit}</span>
                  <span className="text-[11px] text-[#334155]">{p.rate}</span>
                  <span className="text-[11px] text-[#334155]">{p.term}</span>
                  <div className="flex flex-wrap gap-1">
                    {p.rulePackage.split(' + ').map(r => (
                      <span key={r} className="bg-[#F1F5F9] border border-[#E2E8F0] rounded px-1.5 py-0.5 text-[10px] text-[#475569]">{r}</span>
                    ))}
                  </div>
                  <Badge className={`text-[9px] border w-fit ${p.status === '已上线' ? 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]' : 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]'}`}>{p.status}</Badge>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              {[
                { label: '已上线产品', value: PRODUCTS.filter(p => p.status === '已上线').length.toString(), desc: '正式运营中' },
                { label: '试运行产品', value: PRODUCTS.filter(p => p.status === '试运行').length.toString(), desc: '灰度验证中' },
                { label: '绑定规则包', value: '4 套', desc: '覆盖全场景' },
                { label: '适用客群覆盖', value: '4 类', desc: '存量 + 标准 + 长尾' },
              ].map(m => (
                <div key={m.label} className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-3">
                  <div className="text-[10px] text-[#94A3B8]">{m.label}</div>
                  <div className="mt-0.5 text-xl font-bold text-[#0F172A]">{m.value}</div>
                  <div className="mt-0.5 text-[10px] text-[#64748B]">{m.desc}</div>
                </div>
              ))}
            </div>
          </div>
        );

      /* ═══════════════════════════════════════════════════════════
         PAGE 4: 审批规则
         ═══════════════════════════════════════════════════════════ */
      case 'approval-rules':
        return (
          <div className="space-y-4">
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 flex items-center justify-between text-[11px] text-[#94A3B8]">
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-[#0F172A]">审批规则台</span>
                <span>数据口径: 近 30 天</span>
                <span>最后更新: 2026-04-08</span>
                <span>负责人: 风控策略组</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-6 text-[10px] text-[#64748B] gap-1 px-2"><Search size={10} /> 搜索规则</Button>
                <Button variant="ghost" size="sm" className="h-6 text-[10px] text-[#64748B] gap-1 px-2"><Filter size={10} /> 筛选</Button>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: '规则总数', value: `${APPROVAL_RULES.length}`, detail: `启用 ${APPROVAL_RULES.filter(r => r.status === '启用').length} · 灰度 ${APPROVAL_RULES.filter(r => r.status === '灰度').length}`, color: 'text-[#0F172A]' },
                { label: '近 30 天命中', value: `${APPROVAL_RULES.reduce((s, r) => s + (parseFloat(r.hitRate) || 0), 0).toFixed(1)}%`, detail: '综合命中率', color: 'text-[#2563EB]' },
                { label: '拦截/降级', value: '179', detail: '占命中 7.5%', color: 'text-[#DC2626]' },
                { label: '进入补审', value: '318', detail: '通过率 72%', color: 'text-[#C2410C]' },
                { label: '平均误伤率', value: '5.5%', detail: '目标 < 8%', color: 'text-[#047857]' },
              ].map(s => (
                <div key={s.label} className="rounded-lg border border-[#E2E8F0] bg-white p-3">
                  <div className="text-[10px] text-[#94A3B8]">{s.label}</div>
                  <div className={`mt-0.5 text-xl font-bold ${s.color}`}>{s.value}</div>
                  <div className="mt-0.5 text-[10px] text-[#64748B]">{s.detail}</div>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {APPROVAL_RULES.map(rule => (
                <div key={rule.id} className="rounded-lg border border-[#E5E7EB] bg-white overflow-hidden">
                  <div className="px-4 py-2.5 flex items-center gap-2 border-b border-[#F1F5F9]">
                    <div className={`w-2 h-2 rounded-full shrink-0 ${rule.status === '启用' ? 'bg-[#16A34A]' : 'bg-[#CBD5E1]'}`} />
                    <span className="text-[11px] text-[#94A3B8] font-mono">{rule.id}</span>
                    <span className="text-[13px] font-semibold text-[#0F172A]">{rule.name}</span>
                    <Badge className={`text-[9px] border ${CATEGORY_STYLES[rule.category] ?? 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]'}`}>{rule.category}</Badge>
                    <Badge className="bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] text-[9px]">{rule.scope}</Badge>
                    <div className="flex-1" />
                    <span className="text-[10px] text-[#94A3B8]">{rule.owner}</span>
                  </div>
                  <div className="px-4 py-2 bg-[#FAFBFC] border-b border-[#F1F5F9]">
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="text-[#94A3B8] shrink-0">触发:</span>
                      <span className="text-[#334155]">{rule.trigger}</span>
                      <span className="text-[#94A3B8] mx-1">→</span>
                      <span className="font-medium text-[#0F172A]">{rule.action}</span>
                    </div>
                  </div>
                  <div className="px-4 py-2.5 grid grid-cols-3 gap-3 text-center">
                    <div><div className="text-[10px] text-[#94A3B8]">命中率</div><div className="mt-0.5 text-sm font-semibold text-[#0F172A]">{rule.hitRate}</div></div>
                    <div><div className="text-[10px] text-[#94A3B8]">误伤率</div><div className={cn('mt-0.5 text-sm font-semibold', rule.fpRate !== '—' && parseFloat(rule.fpRate) > 10 ? 'text-[#DC2626]' : 'text-[#0F172A]')}>{rule.fpRate}</div></div>
                    <div><div className="text-[10px] text-[#94A3B8]">状态</div><div className="mt-0.5"><Badge className={`text-[9px] border ${rule.status === '启用' ? 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]' : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]'}`}>{rule.status}</Badge></div></div>
                  </div>
                </div>
              ))}
            </div>
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
