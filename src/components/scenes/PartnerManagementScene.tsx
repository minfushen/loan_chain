import React from 'react';
import SceneLayout from '../SceneLayout';
import { SCENES } from '../../constants';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  CheckCircle2,
  ChevronRight,
  Clock,
  Database,
  Edit,
  Eye,
  FileText,
  FileImage,
  Filter,
  Globe,
  Layers,
  Plus,
  RefreshCw,
  Search,
  Send,
  Settings,
  Sparkles,
  Trash2,
  Upload,
  X,
  Zap,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useDemo } from '../../demo/DemoContext';
import { MetricCard, WorkbenchPanel, AiNote } from '../ProductPrimitives';

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

/* ─── Data-source requirement levels ─── */
const DS_LEVELS = { required: '必须', recommended: '推荐', optional: '可选' } as const;
type DSLevel = keyof typeof DS_LEVELS;
const DS_LEVEL_STYLE: Record<DSLevel, string> = {
  required: 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]',
  recommended: 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
  optional: 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]',
};

type SceneDataSource = { name: string; level: DSLevel; desc: string };
type SceneRule = { field: string; operator: string; value: string };

interface SceneItem {
  id: string;
  name: string;
  desc: string;
  scope: string;
  status: '启用' | '试运行' | '灰度';
  priority: number;
  owner: string;
  hit: string;
  rules: SceneRule[];
  dataSources: SceneDataSource[];
}

const SCENES_DATA: SceneItem[] = [
  {
    id: 'LT-001', name: '脱核链上小微规则', desc: '链主未确权场景下，基于三流交叉验证识别可授信小微企业', scope: '准入 + 补审', status: '启用', priority: 1, owner: '王敏', hit: '12.6%',
    rules: [
      { field: '链主确权', operator: '=', value: '未确权' },
      { field: '三流交叉验证', operator: '=', value: '通过' },
      { field: '关系强度', operator: '≥', value: '70' },
      { field: '订单匹配度', operator: '≥', value: '80%' },
    ],
    dataSources: [
      { name: '对公流水', level: 'required', desc: '核心回款与交易验证' },
      { name: '物流运单', level: 'required', desc: '履约真实性佐证' },
      { name: '回款记录', level: 'required', desc: '回款闭环验证' },
      { name: '订单/合同', level: 'recommended', desc: '补强交易真实性' },
      { name: '发票数据', level: 'optional', desc: '增强证据链完整性' },
    ],
  },
  {
    id: 'LT-002', name: '涉农小微规则', desc: '面向农业产业链上下游，基于农业经营数据识别可授信小微农户/合作社', scope: '准入', status: '启用', priority: 2, owner: '陈立', hit: '9.2%',
    rules: [
      { field: '行业', operator: '=', value: '农业/农产品加工' },
      { field: '年营收', operator: '≥', value: '50万' },
      { field: '经营年限', operator: '≥', value: '2年' },
      { field: '农业资质', operator: '=', value: '持有' },
    ],
    dataSources: [
      { name: '农业营业执照', level: 'required', desc: '资质真实性验证' },
      { name: '农产品交易流水', level: 'required', desc: '经营规模与稳定性' },
      { name: '补贴发放记录', level: 'recommended', desc: '政策合规性佐证' },
      { name: '土地承包合同', level: 'optional', desc: '经营规模补强' },
    ],
  },
  {
    id: 'LT-003', name: '本地商圈小微规则', desc: '面向本地商圈聚集区域，基于商圈交易数据识别活跃经营小微商户', scope: '准入 + 增强', status: '试运行', priority: 3, owner: '张明远', hit: '8.4%',
    rules: [
      { field: '行业', operator: '∈', value: '零售/餐饮/生活服务' },
      { field: '年营收', operator: '≥', value: '30万' },
      { field: '商圈活跃度', operator: '≥', value: '中等' },
      { field: '经营年限', operator: '≥', value: '1年' },
    ],
    dataSources: [
      { name: '商圈交易数据', level: 'required', desc: 'POS/聚合支付活跃度' },
      { name: '对公流水', level: 'required', desc: '经营规模与回款验证' },
      { name: '门店租约', level: 'recommended', desc: '经营稳定性佐证' },
      { name: '评价/口碑数据', level: 'optional', desc: '经营质量补强' },
    ],
  },
  {
    id: 'LT-004', name: '物流服务贷场景', desc: '面向链上物流/运输服务主体，基于运单频次与结算数据识别', scope: '准入', status: '试运行', priority: 4, owner: '陈立', hit: '8.4%',
    rules: [
      { field: '运单频次', operator: '≥', value: '20笔/月' },
      { field: '结算周期', operator: '≤', value: '21天' },
      { field: '服务连续性', operator: '≥', value: '6个月' },
    ],
    dataSources: [
      { name: '运单数据', level: 'required', desc: '运输频次与履约验证' },
      { name: '对公流水', level: 'required', desc: '结算周期与稳定性' },
      { name: '车辆/资质', level: 'recommended', desc: '运力真实性验证' },
    ],
  },
  {
    id: 'LT-005', name: '季节性经营场景', desc: '面向季节性强的行业（旅游、农产品等），识别峰值经营期可授信主体', scope: '准入 + 贷中', status: '灰度', priority: 5, owner: '李雪婷', hit: '—',
    rules: [
      { field: '经营季节性', operator: '=', value: '明显' },
      { field: '峰值销售额', operator: '≥', value: '可验证' },
      { field: '淡季存续', operator: '=', value: '无中断' },
    ],
    dataSources: [
      { name: '税票数据', level: 'required', desc: '季节性波动验证' },
      { name: '对公流水', level: 'required', desc: '经营连续性' },
      { name: '行业周期数据', level: 'optional', desc: '行业季节性参照' },
    ],
  },
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
   Shared Components
   ══════════════════════════════════════════════════════════════════ */

const RuleCard: React.FC<{ rule: { id: string; name: string; desc: string; scope: string; status: string; source: string[]; hit: string; owner: string } }> = ({ rule }) => (
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
        {rule.source.map(s => <span key={s} className="bg-[#F1F5F9] border border-[#E2E8F0] rounded px-1.5 py-0.5 text-[9px] text-[#475569]">{s}</span>)}
      </div>
      <div className="text-right">
        <div className="text-[10px] text-[#94A3B8]">命中率</div>
        <div className="text-sm font-semibold text-[#0F172A]">{rule.hit}</div>
      </div>
    </div>
    <div className="px-4 py-1.5 bg-[#FAFBFC] border-t border-[#F1F5F9] text-[10px] text-[#94A3B8]">负责人: {rule.owner}</div>
  </div>
);

/* ══════════════════════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════════════════════ */

interface Props { activeModule: string; onModuleChange: (id: string) => void }

export default function PartnerManagementScene({ activeModule, onModuleChange }: Props) {
  const scene = SCENES.find(s => s.id === 'partner-management')!;

  const [sceneSearch, setSceneSearch] = React.useState('');
  const [selectedSceneId, setSelectedSceneId] = React.useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const [newSceneName, setNewSceneName] = React.useState('');

  const filteredScenes = SCENES_DATA.filter(s => sceneSearch === '' || s.name.includes(sceneSearch) || s.desc.includes(sceneSearch));
  const selectedScene = SCENES_DATA.find(s => s.id === selectedSceneId);

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

            {/* Data source requirement tiers with connectivity probe */}
            <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 space-y-3">
              <div className="text-[12px] font-semibold text-[#0F172A] flex items-center gap-2"><Database size={13} className="text-[#2563EB]" /> 数据源要求</div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {[
                  { level: '必须', items: [
                    { name: '企业名称', probe: 'connected' as const },
                    { name: '法人信息', probe: 'connected' as const },
                    { name: '注册信息', probe: 'connected' as const },
                  ], style: 'border-[#FCA5A5] bg-[#FEF2F2]' },
                  { level: '推荐', items: [
                    { name: '代发流水', probe: 'connected' as const },
                    { name: '成立年限', probe: 'connected' as const },
                    { name: '对公流水', probe: 'connected' as const },
                  ], style: 'border-[#FED7AA] bg-[#FFF7ED]' },
                  { level: '可选', items: [
                    { name: '税务数据', probe: 'connected' as const },
                    { name: '行业标签', probe: 'connected' as const },
                    { name: '评价口碑', probe: 'quota_low' as const },
                  ], style: 'border-[#E2E8F0] bg-[#F8FAFC]' },
                ].map(g => (
                  <div key={g.level} className={`rounded-lg border ${g.style} p-3`}>
                    <div className="text-[11px] font-semibold text-[#0F172A] mb-2">{g.level}</div>
                    <div className="space-y-1">
                      {g.items.map(i => (
                        <div key={i.name} className="flex items-center gap-1.5 text-[10px] text-[#475569]">
                          <span className="shrink-0">{i.probe === 'connected' ? '🟢' : i.probe === 'quota_low' ? '🟡' : '🔴'}</span>
                          {i.name}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
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
         PAGE 2: 长尾场景规则 — 场景管理 + 场景规则配置
         ═══════════════════════════════════════════════════════════ */
      case 'long-tail': {
        if (selectedScene) {
          /* ── 场景规则配置（Detail View） ── */
          const ruleSummary = selectedScene.rules.map(r => `${r.field}${r.operator}${r.value}`).join('，');
          const requiredDS = selectedScene.dataSources.filter(d => d.level === 'required');
          const recommendedDS = selectedScene.dataSources.filter(d => d.level === 'recommended');
          const optionalDS = selectedScene.dataSources.filter(d => d.level === 'optional');
          return (
            <div className="space-y-4">
              {/* Back + Header */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 flex items-center gap-3">
                <button onClick={() => setSelectedSceneId(null)} className="flex items-center gap-1 text-[11px] text-[#2563EB] hover:text-[#1D4ED8] transition-colors">
                  <ArrowLeft size={12} /> 返回场景列表
                </button>
                <div className="w-px h-4 bg-[#E2E8F0]" />
                <span className="text-[13px] font-semibold text-[#0F172A]">场景规则配置</span>
                <span className="text-[11px] text-[#94A3B8]">{selectedScene.name}</span>
                <div className="flex-1" />
                <Badge className={`text-[9px] border ${selectedScene.status === '启用' ? 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]' : selectedScene.status === '试运行' ? 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]' : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]'}`}>{selectedScene.status}</Badge>
              </div>

              {/* Three-column layout */}
              <div className="grid grid-cols-1 xl:grid-cols-[200px_1fr_1fr] gap-4">

                {/* Left: Scene Info */}
                <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 space-y-4 h-fit">
                  <div>
                    <div className="text-[10px] text-[#94A3B8] uppercase tracking-wider mb-1">场景名称</div>
                    <div className="text-[13px] font-semibold text-[#0F172A]">{selectedScene.name}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#94A3B8] uppercase tracking-wider mb-1">场景描述</div>
                    <div className="text-[11px] text-[#475569] leading-4">{selectedScene.desc}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#94A3B8] uppercase tracking-wider mb-1">适用范围</div>
                    <Badge className="bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] text-[10px]">{selectedScene.scope}</Badge>
                  </div>
                  <div>
                    <div className="text-[10px] text-[#94A3B8] uppercase tracking-wider mb-1">优先级</div>
                    <div className="text-[12px] font-semibold text-[#0F172A]">P{selectedScene.priority}</div>
                    <div className="text-[10px] text-[#64748B] mt-0.5">优先于标准小微规则</div>
                  </div>
                  <div className="border-t border-[#F1F5F9] pt-3">
                    <div className="text-[10px] text-[#94A3B8]">负责人: {selectedScene.owner}</div>
                    <div className="text-[10px] text-[#94A3B8]">命中率: {selectedScene.hit}</div>
                    <div className="text-[10px] text-[#94A3B8]">编号: {selectedScene.id}</div>
                  </div>
                </div>

                {/* Center: Rule Config */}
                <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-[12px] font-semibold text-[#0F172A] flex items-center gap-2"><Settings size={13} className="text-[#2563EB]" /> 规则配置</div>
                    <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1 px-2 text-[#2563EB] border-[#BFDBFE]"><Plus size={9} /> 添加条件</Button>
                  </div>

                  <div className="space-y-2">
                    {selectedScene.rules.map((r, idx) => (
                      <div key={idx} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5 flex items-center gap-3">
                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-[#EFF6FF] text-[#2563EB] text-[9px] font-bold shrink-0">{idx + 1}</div>
                        <div className="flex-1 grid grid-cols-3 gap-2 text-[11px]">
                          <div className="rounded border border-[#E2E8F0] bg-white px-2 py-1 text-[#0F172A] font-medium">{r.field}</div>
                          <div className="rounded border border-[#E2E8F0] bg-white px-2 py-1 text-center text-[#64748B]">{r.operator}</div>
                          <div className="rounded border border-[#E2E8F0] bg-white px-2 py-1 text-[#2563EB] font-medium">{r.value}</div>
                        </div>
                        <button className="text-[#94A3B8] hover:text-[#DC2626] transition-colors"><Trash2 size={12} /></button>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-[#F1F5F9] pt-3">
                    <div className="text-[10px] text-[#94A3B8] uppercase tracking-wider mb-2">规则摘要（实时预览）</div>
                    <div className="rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] px-3 py-2.5 text-[11px] text-[#2563EB] leading-5">{ruleSummary}</div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Button size="sm" className="h-7 text-[10px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white gap-1"><CheckCircle2 size={10} /> 保存规则</Button>
                    <Button variant="ghost" size="sm" className="h-7 text-[10px] text-[#64748B]">重置</Button>
                  </div>
                </div>

                {/* Right: Data Source Requirements */}
                <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-[12px] font-semibold text-[#0F172A] flex items-center gap-2"><Database size={13} className="text-[#2563EB]" /> 数据源要求</div>
                    <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1 px-2 text-[#2563EB] border-[#BFDBFE]"><Plus size={9} /> 添加数据源</Button>
                  </div>

                  {[
                    { label: '必须', items: requiredDS, level: 'required' as DSLevel },
                    { label: '推荐', items: recommendedDS, level: 'recommended' as DSLevel },
                    { label: '可选', items: optionalDS, level: 'optional' as DSLevel },
                  ].filter(g => g.items.length > 0).map(group => (
                    <div key={group.label}>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={cn('text-[9px] border', DS_LEVEL_STYLE[group.level])}>{group.label}</Badge>
                        <span className="text-[10px] text-[#94A3B8]">{group.items.length} 项</span>
                      </div>
                      <div className="space-y-1.5">
                        {group.items.map(ds => {
                          const probeStatus = (['对公流水', '物流运单', '税票数据', '农业营业执照', '商圈交易数据', '运单数据'].includes(ds.name))
                            ? 'connected' as const
                            : (['农产品交易流水', '季节性价格指数'].includes(ds.name))
                              ? 'quota_low' as const
                              : 'not_purchased' as const;
                          const probeIcon = probeStatus === 'connected' ? '🟢' : probeStatus === 'quota_low' ? '🟡' : '🔴';
                          const probeLabel = probeStatus === 'connected' ? '已接入且有余量' : probeStatus === 'quota_low' ? '已接入但配额不足' : '外数平台未采购此接口';
                          return (
                            <div key={ds.name} className={cn('rounded-lg border px-3 py-2 flex items-center gap-3', probeStatus === 'not_purchased' ? 'border-[#FCA5A5] bg-[#FEF2F2]/50' : 'border-[#E2E8F0] bg-[#F8FAFC]')}>
                              <Database size={11} className="text-[#94A3B8] shrink-0" />
                              <div className="flex-1">
                                <div className="text-[11px] font-medium text-[#0F172A]">{ds.name}</div>
                                <div className="text-[10px] text-[#94A3B8]">{ds.desc}</div>
                              </div>
                              <button className="shrink-0 flex items-center gap-1 rounded border border-[#E2E8F0] bg-white px-2 py-1 text-[10px] hover:bg-[#F8FAFC] transition-colors" title={probeLabel}>
                                <span>{probeIcon}</span>
                                <span className={cn('text-[9px]', probeStatus === 'connected' ? 'text-[#047857]' : probeStatus === 'quota_low' ? 'text-[#C2410C]' : 'text-[#DC2626]')}>{probeLabel}</span>
                              </button>
                              <select className="h-6 rounded border border-[#E2E8F0] bg-white px-1.5 text-[10px] text-[#64748B]" defaultValue={ds.level}>
                                <option value="required">必须</option>
                                <option value="recommended">推荐</option>
                                <option value="optional">可选</option>
                              </select>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}

                  <div className="border-t border-[#F1F5F9] pt-3 space-y-2">
                    {requiredDS.some(ds => !['对公流水', '物流运单', '税票数据', '农业营业执照', '商圈交易数据', '运单数据', '农产品交易流水', '季节性价格指数'].includes(ds.name)) && (
                      <div className="rounded-lg bg-[#FEF2F2] border border-[#FCA5A5] px-3 py-2.5 text-[11px] text-[#DC2626] leading-5">
                        <span className="font-medium">底层平台无此数据，规则无法生效。</span> 必须数据源中存在外数平台未采购接口（🔴），请联系数据管理部门采购后再启用规则。
                      </div>
                    )}
                    <div className="rounded-lg bg-[#FFF7ED] border border-[#FED7AA] px-3 py-2.5 text-[11px] text-[#C2410C] leading-5">
                      <span className="font-medium">缺失提示：</span>若企业缺少标记为"必须"的数据源，该场景规则将自动跳过，不对该企业生效。
                    </div>
                  </div>

                  <div className="border-t border-[#F1F5F9] pt-3">
                    <div className="text-[10px] text-[#94A3B8] uppercase tracking-wider mb-2">数据源摘要（实时预览）</div>
                    <div className="rounded-lg bg-[#EFF6FF] border border-[#BFDBFE] px-3 py-2.5 text-[11px] text-[#2563EB] leading-5">
                      {selectedScene.dataSources.filter(d => d.level === 'required').map(d => d.name).join('、')}（必须）
                      {recommendedDS.length > 0 && <span className="text-[#94A3B8]">｜{recommendedDS.map(d => d.name).join('、')}（推荐）</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        /* ── 场景管理（List View） ── */
        return (
          <div className="space-y-4">
            {/* Header */}
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Layers size={14} className="text-[#2563EB]" />
                <span className="text-[13px] font-semibold text-[#0F172A]">长尾场景规则</span>
                <span className="text-[11px] text-[#94A3B8]">共 {SCENES_DATA.length} 个场景</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-[#ECFDF3] text-[#047857] border-[#A7F3D0] text-[10px]">启用 {SCENES_DATA.filter(r => r.status === '启用').length}</Badge>
                <Badge className="bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA] text-[10px]">试运行 {SCENES_DATA.filter(r => r.status === '试运行').length}</Badge>
                <Badge className="bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] text-[10px]">灰度 {SCENES_DATA.filter(r => r.status === '灰度').length}</Badge>
              </div>
            </div>

            <div className="rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-3 text-[12px] text-[#2563EB] flex items-center gap-2">
              <Sparkles size={14} className="shrink-0" />
              <span>长尾场景规则覆盖标准小微规则未能识别的差异化客群，每个场景可独立配置规则参数与数据源要求。</span>
            </div>

            {/* Search + Add */}
            <div className="flex items-center gap-3">
              <div className="flex-1 flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-3 py-2">
                <Search size={13} className="text-[#94A3B8] shrink-0" />
                <input
                  type="text"
                  className="flex-1 bg-transparent text-[12px] text-[#334155] placeholder:text-[#CBD5E1] outline-none"
                  placeholder='搜索场景名称（如"脱核链上""涉农"）...'
                  value={sceneSearch}
                  onChange={e => setSceneSearch(e.target.value)}
                />
                {sceneSearch && <button onClick={() => setSceneSearch('')} className="text-[#94A3B8] hover:text-[#64748B]"><X size={12} /></button>}
              </div>
              <Button size="sm" className="h-9 text-[11px] gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white" onClick={() => setShowAddDialog(true)}>
                <Plus size={12} /> 添加场景
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricCard label="场景总数" value={`${SCENES_DATA.length}`} detail={`启用 ${SCENES_DATA.filter(s => s.status === '启用').length} · 试运行 ${SCENES_DATA.filter(s => s.status === '试运行').length}`} tone="blue" />
              <MetricCard label="综合命中率" value="9.8%" detail="场景规则贡献候选中 32%" tone="green" />
              <MetricCard label="数据源覆盖" value={`${new Set(SCENES_DATA.flatMap(s => s.dataSources.map(d => d.name))).size} 类`} detail="跨场景数据源" tone="slate" />
              <MetricCard label="缺失数据源" value="2 项" detail="影响 1 个灰度场景" tone="amber" />
            </div>

            {/* Scene List */}
            <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
              <div className="grid grid-cols-[40px_1fr_1fr_1fr_80px_100px] gap-0 px-4 py-2.5 border-b border-[#E2E8F0] bg-[#F8FAFC] text-[10px] font-medium text-[#94A3B8] uppercase tracking-wider">
                <div>编号</div><div>场景名称</div><div>规则摘要</div><div>数据源要求</div><div>状态</div><div>操作</div>
              </div>
              {filteredScenes.map(s => (
                <div key={s.id} className="grid grid-cols-[40px_1fr_1fr_1fr_80px_100px] gap-0 px-4 py-3 border-b border-[#F1F5F9] last:border-b-0 items-center hover:bg-[#FAFBFF] transition-colors">
                  <span className="text-[11px] text-[#94A3B8] font-mono">{s.id.replace('LT-', '')}</span>
                  <div>
                    <div className="text-[12px] font-medium text-[#0F172A]">{s.name}</div>
                    <div className="text-[10px] text-[#94A3B8] mt-0.5 line-clamp-1">{s.desc}</div>
                  </div>
                  <div className="text-[10px] text-[#64748B] leading-4 line-clamp-2 pr-2">
                    {s.rules.slice(0, 2).map(r => `${r.field}${r.operator}${r.value}`).join('，')}{s.rules.length > 2 ? '…' : ''}
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {s.dataSources.filter(d => d.level === 'required').slice(0, 2).map(d => (
                      <span key={d.name} className="bg-[#FEF2F2] border border-[#FCA5A5] rounded px-1.5 py-0.5 text-[9px] text-[#DC2626]">{d.name}</span>
                    ))}
                    {s.dataSources.filter(d => d.level === 'required').length > 2 && <span className="text-[9px] text-[#94A3B8]">+{s.dataSources.filter(d => d.level === 'required').length - 2}</span>}
                  </div>
                  <div>
                    <Badge className={`text-[9px] border ${s.status === '启用' ? 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]' : s.status === '试运行' ? 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]' : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]'}`}>{s.status}</Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="outline" size="sm" className="h-6 text-[10px] px-2 gap-1 text-[#2563EB] border-[#BFDBFE]" onClick={() => setSelectedSceneId(s.id)}>
                      <Edit size={9} /> 配置
                    </Button>
                    <Button variant="ghost" size="sm" className="h-6 text-[10px] px-1.5 text-[#94A3B8]"><Trash2 size={10} /></Button>
                  </div>
                </div>
              ))}
              {filteredScenes.length === 0 && <div className="text-center py-10 text-[#94A3B8] text-xs">无匹配场景</div>}
            </div>

            {/* Add-scene dialog overlay */}
            {showAddDialog && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30" onClick={() => setShowAddDialog(false)}>
                <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-lg w-[420px] p-5 space-y-4" onClick={e => e.stopPropagation()}>
                  <div className="flex items-center justify-between">
                    <span className="text-[14px] font-semibold text-[#0F172A]">添加新场景</span>
                    <button onClick={() => setShowAddDialog(false)} className="text-[#94A3B8] hover:text-[#64748B]"><X size={16} /></button>
                  </div>
                  <div>
                    <label className="text-[10px] text-[#94A3B8] uppercase tracking-wider mb-1 block">场景名称</label>
                    <input
                      type="text"
                      className="w-full h-9 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-3 text-[12px] text-[#334155] placeholder:text-[#CBD5E1] outline-none focus:border-[#2563EB]"
                      placeholder="例如：跨境电商小微规则"
                      value={newSceneName}
                      onChange={e => setNewSceneName(e.target.value)}
                    />
                  </div>
                  <div className="text-[10px] text-[#94A3B8]">创建后可进入场景详情配置规则参数与数据源要求。</div>
                  <div className="flex items-center justify-end gap-2 pt-2">
                    <Button variant="outline" size="sm" className="h-8 text-[11px] text-[#64748B] border-[#E2E8F0]" onClick={() => setShowAddDialog(false)}>取消</Button>
                    <Button size="sm" className="h-8 text-[11px] bg-[#2563EB] hover:bg-[#1D4ED8] text-white" onClick={() => { setShowAddDialog(false); setNewSceneName(''); }}>保存</Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      }

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
                    {p.rulePackage.split(' + ').map(r => <span key={r} className="bg-[#F1F5F9] border border-[#E2E8F0] rounded px-1.5 py-0.5 text-[10px] text-[#475569]">{r}</span>)}
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

      /* ════════════════════════════════════════════════════════════════════
         PAGE 5: 智能尽调工具
         通用数据工具 — 非结构化数据 → 结构化报告
         跨模块调用入口：候选资产池/推荐流/筛选流均可一键触发
         ════════════════════════════════════════════════════════════════════ */
      case 'due-diligence': {
        const DD_REPORTS = [
          { id: 'dd1', company: '常州衡远包装材料有限公司', shortName: '衡远包装', status: 'completed' as const, createdAt: '今天 09:45', creator: '张三经理', source: '候选资产池', confidence: 96, highlights: ['订单-物流-回款三流匹配', '关系强度87%', '置信度92%'], riskFlags: [] as string[] },
          { id: 'dd2', company: '溧阳佳利包装材料有限公司', shortName: '佳利包装', status: 'processing' as const, createdAt: '今天 10:20', creator: '系统自动', source: '智能推荐流', confidence: 0, highlights: [], riskFlags: [] as string[] },
          { id: 'dd3', company: '苏州锐信新材料有限公司', shortName: '锐信新材', status: 'completed' as const, createdAt: '昨天 16:30', creator: '李四经理', source: '条件筛选流', confidence: 88, highlights: ['二级辅料供应商', '交易真实', '集中度偏高62%'], riskFlags: ['客户集中度偏高'] },
          { id: 'dd4', company: '无锡驰远物流服务有限公司', shortName: '驰远物流', status: 'completed' as const, createdAt: '昨天 14:10', creator: '张三经理', source: '外勤录入', confidence: 81, highlights: ['运单频次高', '结算周期短21天'], riskFlags: ['法人征信待补全'] },
          { id: 'dd5', company: '昆山瑞丰辅料有限公司', shortName: '瑞丰辅料', status: 'failed' as const, createdAt: '2天前', creator: '王五经理', source: '候选资产池', confidence: 0, highlights: [], riskFlags: ['外数接口超时，请重试'] },
        ];

        const ddStatusConfig = {
          completed: { label: '已生成', bg: 'bg-[#ECFDF3]', text: 'text-[#047857]', border: 'border-[#A7F3D0]' },
          processing: { label: 'AI解析中', bg: 'bg-[#EFF6FF]', text: 'text-[#2563EB]', border: 'border-[#BFDBFE]' },
          failed: { label: '生成失败', bg: 'bg-[#FEF2F2]', text: 'text-[#DC2626]', border: 'border-[#FCA5A5]' },
        };

        return (
          <div className="space-y-4">
            {/* Header */}
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Sparkles size={14} className="text-[#7C3AED]" />
                <span className="text-[13px] font-semibold text-[#0F172A]">智能尽调工具</span>
                <span className="text-[11px] text-[#94A3B8]">一键生成企业尽调报告 · 跨模块通用</span>
              </div>
            </div>

            {/* New report trigger */}
            <div className="rounded-xl border-2 border-dashed border-[#BFDBFE] bg-[#EFF6FF]/50 p-5">
              <div className="text-[13px] font-semibold text-[#0F172A] mb-3">发起尽调</div>
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-end">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] text-[#94A3B8] uppercase tracking-wider mb-1 block">企业名称 / 统一社会信用代码</label>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" size={13} />
                      <input className="w-full h-9 rounded-md border border-[#E2E8F0] bg-white pl-8 pr-3 text-[12px] text-[#334155] placeholder:text-[#94A3B8]" placeholder="输入企业名称或注册号，也可从已有企业列表选择..." />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-[#94A3B8] uppercase tracking-wider mb-1 block">补充材料（可选）</label>
                    <Button variant="outline" size="sm" className="h-9 w-full text-[11px] gap-1.5 text-[#64748B] border-[#E2E8F0] border-dashed justify-start"><Upload size={12} />上传照片/文件（营业执照、合同等）</Button>
                  </div>
                </div>
                <Button size="sm" className="h-9 px-5 text-[12px] gap-1.5 bg-[#7C3AED] hover:bg-[#6D28D9] text-white shrink-0"><Zap size={12} />一键生成尽调报告</Button>
              </div>
              <div className="mt-3 flex items-center gap-4 text-[10px] text-[#94A3B8]">
                <span>支持来源: 候选资产池 · 智能推荐流 · 条件筛选流 · 外勤录入 · 手动输入</span>
                <span>·</span>
                <span>AI将自动调用工商、税务、司法、征信等外数接口</span>
              </div>
            </div>

            {/* Pipeline steps */}
            <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-4 py-3 flex items-center gap-6">
              {[
                { icon: Search, label: '企业识别', desc: '匹配工商注册信息' },
                { icon: Globe, label: '外数调用', desc: '税务/司法/征信/舆情' },
                { icon: Sparkles, label: 'AI分析', desc: '经营画像+风险扫描' },
                { icon: FileText, label: '报告生成', desc: '结构化尽调报告' },
              ].map((step, i) => (
                <React.Fragment key={step.label}>
                  {i > 0 && <ArrowRight size={14} className="text-[#CBD5E1] shrink-0" />}
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-[#F3E8FF] text-[#7C3AED] flex items-center justify-center shrink-0"><step.icon size={13} /></div>
                    <div>
                      <div className="text-[11px] font-medium text-[#0F172A]">{step.label}</div>
                      <div className="text-[9px] text-[#94A3B8]">{step.desc}</div>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricCard label="累计尽调" value={`${DD_REPORTS.filter(r => r.status === 'completed').length + 47} 份`} detail="本月 +12" tone="blue" />
              <MetricCard label="AI 解析中" value={`${DD_REPORTS.filter(r => r.status === 'processing').length} 份`} detail="平均 2 分钟" tone="amber" />
              <MetricCard label="平均置信度" value="89%" detail="高于阈值" tone="green" />
              <MetricCard label="外数调用成功率" value="96%" detail="本月无异常" tone="green" />
            </div>

            {/* Report list */}
            <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
                <span className="text-[12px] font-semibold text-[#0F172A]">尽调报告列表</span>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-7 text-[10px] text-[#64748B] gap-1"><RefreshCw size={10} />刷新</Button>
                  <Button variant="ghost" size="sm" className="h-7 text-[10px] text-[#64748B] gap-1"><Filter size={10} />筛选</Button>
                </div>
              </div>
              {DD_REPORTS.map(report => {
                const sc = ddStatusConfig[report.status];
                return (
                  <div key={report.id} className="px-4 py-3.5 border-b border-[#F1F5F9] last:border-b-0 hover:bg-[#FAFBFF] transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge className={cn('text-[9px] border', sc.bg, sc.text, sc.border)}>
                          {report.status === 'processing' && <RefreshCw size={8} className="mr-0.5 animate-spin" />}
                          {sc.label}
                        </Badge>
                        <span className="text-[12px] font-medium text-[#0F172A]">{report.shortName}</span>
                        <span className="text-[10px] text-[#94A3B8]">{report.company}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[10px] text-[#94A3B8]">
                        <Badge className="bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] text-[9px]">{report.source}</Badge>
                        <span>{report.creator}</span>
                        <span>{report.createdAt}</span>
                      </div>
                    </div>

                    {report.status === 'completed' && (
                      <div className="mt-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-3">
                        <div className="flex items-center gap-4 mb-2">
                          <div className="flex items-center gap-1 text-[10px]">
                            <span className="text-[#94A3B8]">置信度:</span>
                            <span className={cn('font-semibold', report.confidence >= 80 ? 'text-[#047857]' : 'text-[#C2410C]')}>{report.confidence}%</span>
                          </div>
                          {report.riskFlags.length > 0 && report.riskFlags.map(f => (
                            <Badge key={f} className="bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5] text-[9px]">{f}</Badge>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {report.highlights.map(h => (
                            <span key={h} className="inline-flex items-center rounded px-2 py-0.5 text-[9px] border bg-white text-[#334155] border-[#E2E8F0]">{h}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    {report.status === 'failed' && (
                      <div className="mt-2 rounded-lg border border-[#FCA5A5] bg-[#FEF2F2] px-3 py-2 text-[10px] text-[#DC2626]">
                        {report.riskFlags[0]}
                      </div>
                    )}

                    <div className="mt-2 flex items-center gap-2">
                      {report.status === 'completed' && (
                        <>
                          <Button variant="outline" size="sm" className="h-6 text-[10px] px-2.5 gap-1 text-[#7C3AED] border-[#DDD6FE]"><Eye size={9} />查看报告</Button>
                          <Button variant="outline" size="sm" className="h-6 text-[10px] px-2.5 gap-1 text-[#2563EB] border-[#BFDBFE]"><Send size={9} />推送至补审</Button>
                          <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2 gap-1 text-[#64748B]"><FileText size={9} />导出PDF</Button>
                        </>
                      )}
                      {report.status === 'processing' && (
                        <span className="text-[10px] text-[#2563EB] flex items-center gap-1"><Clock size={10} />预计 2 分钟内完成...</span>
                      )}
                      {report.status === 'failed' && (
                        <Button variant="outline" size="sm" className="h-6 text-[10px] px-2.5 gap-1 text-[#DC2626] border-[#FCA5A5]"><RefreshCw size={9} />重新生成</Button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }

      /* ════════════════════════════════════════════════════════════════════
         PAGE 6: 数据源管理
         外数平台接入状态、连通性检测、配额管理
         ════════════════════════════════════════════════════════════════════ */
      case 'data-source': {
        const DATA_SOURCES = [
          { id: 'ds1', name: '工商注册信息', provider: '国家企业信用信息公示系统', status: 'connected' as const, quota: '10,000/月', used: '6,240', updateFreq: '实时', modules: ['候选资产池', '智能尽调'] },
          { id: 'ds2', name: '税务发票数据', provider: '税务数据平台', status: 'connected' as const, quota: '5,000/月', used: '3,180', updateFreq: 'T+1', modules: ['标准小微规则', '智能尽调'] },
          { id: 'ds3', name: '司法诉讼信息', provider: '中国裁判文书网', status: 'connected' as const, quota: '8,000/月', used: '2,560', updateFreq: '实时', modules: ['风险监控', '智能尽调'] },
          { id: 'ds4', name: '物流运单数据', provider: '物流信息平台', status: 'connected' as const, quota: '3,000/月', used: '1,890', updateFreq: 'T+1', modules: ['候选资产池', '授信资产池'] },
          { id: 'ds5', name: '征信报告', provider: '央行征信中心', status: 'quota_low' as const, quota: '500/月', used: '462', updateFreq: '实时', modules: ['产品与审批', '风险监控'] },
          { id: 'ds6', name: '舆情监控', provider: '舆情数据服务商', status: 'connected' as const, quota: '不限', used: '—', updateFreq: '实时', modules: ['风险监控'] },
          { id: 'ds7', name: '区块链交易数据', provider: '—', status: 'not_purchased' as const, quota: '—', used: '—', updateFreq: '—', modules: ['长尾场景规则'] },
          { id: 'ds8', name: '农产品交易流水', provider: '—', status: 'not_purchased' as const, quota: '—', used: '—', updateFreq: '—', modules: ['长尾场景规则'] },
        ];

        const dsStatusConfig = {
          connected: { label: '🟢 已接入', text: 'text-[#047857]' },
          quota_low: { label: '🟡 配额不足', text: 'text-[#C2410C]' },
          not_purchased: { label: '🔴 未采购', text: 'text-[#DC2626]' },
        };

        return (
          <div className="space-y-4">
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Database size={14} className="text-[#2563EB]" />
                <span className="text-[13px] font-semibold text-[#0F172A]">数据源管理</span>
                <span className="text-[11px] text-[#94A3B8]">外数平台接入状态与配额管理</span>
              </div>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 text-[#2563EB] border-[#BFDBFE]"><RefreshCw size={10} />全量连通性测试</Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricCard label="已接入数据源" value={`${DATA_SOURCES.filter(d => d.status === 'connected').length} 个`} detail="运行正常" tone="green" />
              <MetricCard label="配额不足" value={`${DATA_SOURCES.filter(d => d.status === 'quota_low').length} 个`} detail="需扩容或续购" tone="amber" />
              <MetricCard label="未采购" value={`${DATA_SOURCES.filter(d => d.status === 'not_purchased').length} 个`} detail="影响部分规则" tone="red" />
              <MetricCard label="本月调用量" value="14,332 次" detail="较上月 +8%" tone="blue" />
            </div>

            <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden">
              <div className="grid grid-cols-[1fr_140px_100px_80px_80px_140px_60px] gap-0 px-4 py-2.5 border-b border-[#E2E8F0] bg-[#F8FAFC] text-[10px] font-medium text-[#94A3B8] uppercase tracking-wider">
                <div>数据源</div><div>供应商</div><div>状态</div><div>配额</div><div>已用</div><div>关联模块</div><div>操作</div>
              </div>
              {DATA_SOURCES.map(ds => {
                const sc = dsStatusConfig[ds.status];
                return (
                  <div key={ds.id} className={cn('grid grid-cols-[1fr_140px_100px_80px_80px_140px_60px] gap-0 px-4 py-3 border-b border-[#F1F5F9] last:border-b-0 items-center transition-colors', ds.status === 'not_purchased' ? 'bg-[#FEF2F2]/30' : 'hover:bg-[#FAFBFF]')}>
                    <div>
                      <div className="text-[12px] font-medium text-[#0F172A]">{ds.name}</div>
                      <div className="text-[10px] text-[#94A3B8]">{ds.updateFreq} 更新</div>
                    </div>
                    <div className="text-[10px] text-[#64748B]">{ds.provider}</div>
                    <div className={cn('text-[10px] font-medium', sc.text)}>{sc.label}</div>
                    <div className="text-[11px] text-[#334155] font-mono">{ds.quota}</div>
                    <div className="text-[11px] text-[#334155] font-mono">{ds.used}</div>
                    <div className="flex flex-wrap gap-1">
                      {ds.modules.slice(0, 2).map(m => (
                        <span key={m} className="rounded px-1.5 py-0.5 text-[9px] bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0]">{m}</span>
                      ))}
                      {ds.modules.length > 2 && <span className="text-[9px] text-[#94A3B8]">+{ds.modules.length - 2}</span>}
                    </div>
                    <div>
                      {ds.status === 'connected' && <Button variant="ghost" size="sm" className="h-6 text-[9px] px-1.5 text-[#64748B]"><Eye size={9} /></Button>}
                      {ds.status === 'quota_low' && <Button variant="outline" size="sm" className="h-6 text-[9px] px-1.5 text-[#C2410C] border-[#FED7AA]">扩容</Button>}
                      {ds.status === 'not_purchased' && <Button variant="outline" size="sm" className="h-6 text-[9px] px-1.5 text-[#DC2626] border-[#FCA5A5]">申请</Button>}
                    </div>
                  </div>
                );
              })}
            </div>
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
