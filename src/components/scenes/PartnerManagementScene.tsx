import React from 'react';
import SceneLayout from '../SceneLayout';
import { SCENES } from '../../constants';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Brain,
  CheckCircle,
  CheckCircle2,
  ChevronRight,
  Clock,
  Copy,
  Database,
  Download,
  Edit,
  Eye,
  FileText,
  FileImage,
  Filter,
  GitBranch,
  Globe,
  Layers,
  Play,
  Plus,
  Power,
  RefreshCw,
  Search,
  Send,
  Settings,
  Shield,
  Sparkles,
  Trash2,
  TrendingUp,
  Upload,
  Users,
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
  { id: 'SM-001', name: '税票连续经营客群', desc: '连续开票≥6个月 + 税票金额稳定', scope: '全行', ruleType: '准入' as const, status: '启用' as const, source: ['税票数据'], hit: '28%', owner: '产品策略组', priority: 1, version: 'v3.2', effectDate: '2026-03-01' },
  { id: 'SM-002', name: '流水稳定经营客群', desc: '月均对公流水≥50万 + 波动率<30%', scope: '全行', ruleType: '准入' as const, status: '启用' as const, source: ['对公流水'], hit: '22%', owner: '产品策略组', priority: 2, version: 'v2.8', effectDate: '2026-02-15' },
  { id: 'SM-003', name: '经营关系稳定客群', desc: '高频交易对手≥3家 + 连续交易≥4个月', scope: '全行', ruleType: '评分' as const, status: '启用' as const, source: ['对公流水', '交易频次'], hit: '18%', owner: '张明远', priority: 3, version: 'v2.1', effectDate: '2026-03-10' },
  { id: 'SM-004', name: '代发工资客群', desc: '代发工资人数≥10人 + 连续≥6个月', scope: '全行', ruleType: '标签' as const, status: '启用' as const, source: ['代发工资'], hit: '15%', owner: '李雪婷', priority: 4, version: 'v1.5', effectDate: '2026-01-20' },
  { id: 'SM-005', name: '结算归集客群', desc: '结算账户归集率≥60% + 月活≥4次', scope: '分支机构', ruleType: '计算' as const, status: '灰度' as const, source: ['对公流水', '结算数据'], hit: '—', owner: '王敏', priority: 5, version: 'v1.0', effectDate: '—' },
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
  sceneType: '营销' | '风控' | '挽回';
  status: '启用' | '试运行' | '灰度';
  priority: number;
  owner: string;
  hit: string;
  outputAction: string;
  rules: SceneRule[];
  dataSources: SceneDataSource[];
}

const SCENES_DATA: SceneItem[] = [
  {
    id: 'LT-001', name: '脱核链上小微规则', desc: '链主未确权场景下，基于三流交叉验证识别可授信小微企业', scope: '准入 + 补审', sceneType: '风控', status: '启用', priority: 1, owner: '王敏', hit: '12.6%', outputAction: '推送至补审',
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
    id: 'LT-002', name: '涉农小微规则', desc: '面向农业产业链上下游，基于农业经营数据识别可授信小微农户/合作社', scope: '准入', sceneType: '营销', status: '启用', priority: 2, owner: '陈立', hit: '9.2%', outputAction: '推送至候选池',
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
    id: 'LT-003', name: '本地商圈小微规则', desc: '面向本地商圈聚集区域，基于商圈交易数据识别活跃经营小微商户', scope: '准入 + 增强', sceneType: '营销', status: '试运行', priority: 3, owner: '张明远', hit: '8.4%', outputAction: '推送至候选池',
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
    id: 'LT-004', name: '物流服务贷场景', desc: '面向链上物流/运输服务主体，基于运单频次与结算数据识别', scope: '准入', sceneType: '营销', status: '试运行', priority: 4, owner: '陈立', hit: '8.4%', outputAction: '推送至审批',
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
    id: 'LT-005', name: '季节性经营场景', desc: '面向季节性强的行业（旅游、农产品等），识别峰值经营期可授信主体', scope: '准入 + 贷中', sceneType: '挽回', status: '灰度', priority: 5, owner: '李雪婷', hit: '—', outputAction: '预警观察',
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
  { id: 'P-001', name: '信用快贷', productType: '贷款' as const, target: '存量代发/结算/按揭客户', clientTiers: ['L1', 'L2'], limit: '10–50万', rate: '5.8%–6.5%', term: '12个月', repayMethod: '等额本息', rulePackage: '基础准入 + 公私联动', matchRule: '代发≥6月 & 流水≥30万', status: '已上线' as const, version: 'v2.3' },
  { id: 'P-002', name: '数据贷', productType: '贷款' as const, target: '税票流水达标小微', clientTiers: ['L2', 'L3'], limit: '50–200万', rate: '6.2%–7.5%', term: '6–12个月', repayMethod: '先息后本', rulePackage: '税票融合 + 图谱评分', matchRule: '税票≥6月 & 流水≥50万', status: '已上线' as const, version: 'v1.8' },
  { id: 'P-003', name: '订单微贷', productType: '供应链金融' as const, target: '脱核链贷场景主体', clientTiers: ['L3', 'L4'], limit: '30–150万', rate: '7.0%–8.2%', term: '6个月', repayMethod: '到期一次性', rulePackage: '产业数据 + 经营实质 + 脱核补审', matchRule: '三流匹配 & 关系强度≥70', status: '试运行' as const, version: 'v1.0' },
  { id: 'P-004', name: '运费贷', productType: '供应链金融' as const, target: '链上物流服务主体', clientTiers: ['L3'], limit: '20–100万', rate: '6.8%–7.8%', term: '3–6个月', repayMethod: '等额本息', rulePackage: '运单频次 + 结算验证', matchRule: '运单≥20笔/月 & 结算≤21天', status: '试运行' as const, version: 'v1.0' },
];

const APPROVAL_FLOWS = [
  { id: 'AF-001', name: '小微授信审批流程', approvalType: '混合' as const, trigger: '授信申请提交', nodes: ['客户经理初审', 'AI 预审', '风控经理复核', '分行审批'], roles: ['客户经理', 'AI', '风控经理', '分行长'], sla: 24, autoPass: false, status: '启用' as const, owner: '风控策略组', version: 'v2.1' },
  { id: 'AF-002', name: '快贷自动审批流程', approvalType: '自动' as const, trigger: '额度≤30万 & 评分≥80', nodes: ['AI 自动审批', '系统放款'], roles: ['AI', '系统'], sla: 1, autoPass: true, status: '启用' as const, owner: '产品策略组', version: 'v1.5' },
  { id: 'AF-003', name: '大额人工审批流程', approvalType: '人工' as const, trigger: '额度>100万', nodes: ['客户经理初审', '支行风控', '分行风控', '总行审批'], roles: ['客户经理', '支行风控', '分行风控', '总行'], sla: 72, autoPass: false, status: '启用' as const, owner: '风控策略组', version: 'v3.0' },
  { id: 'AF-004', name: '补审快速通道', approvalType: '混合' as const, trigger: '补审材料齐全', nodes: ['AI 材料核验', '风控经理确认'], roles: ['AI', '风控经理'], sla: 8, autoPass: false, status: '启用' as const, owner: '王敏', version: 'v1.2' },
  { id: 'AF-005', name: '脱核链贷专项审批', approvalType: '人工' as const, trigger: '脱核场景 & 未确权', nodes: ['客户经理初审', 'AI 证据核验', '产业链风控', '分行审批'], roles: ['客户经理', 'AI', '产业链风控', '分行长'], sla: 48, autoPass: false, status: '试运行' as const, owner: '陈立', version: 'v1.0' },
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

/* ── Report Template Data ── */

const REPORT_TEMPLATES = [
  { id: 'TPL-001', name: '标准尽调报告', scope: '全场景通用', chapters: 8, status: '启用' as const, lastUpdated: '2026-04-06', creator: '产品策略组', desc: '适用于全场景的通用尽调报告，包含企业基本信息、经营验证、风险扫描等标准章节', format: 'PDF · Word · HTML' },
  { id: 'TPL-002', name: '脱核链贷专项报告', scope: '脱核链上场景', chapters: 10, status: '启用' as const, lastUpdated: '2026-04-08', creator: '王敏', desc: '针对链主未确权场景，强化产业链关系证明与三流交叉验证章节', format: 'PDF · Word' },
  { id: 'TPL-003', name: '涉农小微报告', scope: '涉农场景', chapters: 7, status: '试运行' as const, lastUpdated: '2026-04-05', creator: '陈立', desc: '面向农业产业链上下游小微企业，含农业资质、补贴记录等专项章节', format: 'PDF · Word' },
  { id: 'TPL-004', name: '物流服务贷报告', scope: '物流服务场景', chapters: 6, status: '草稿' as const, lastUpdated: '2026-04-09', creator: '张明远', desc: '适用于链上物流/运输主体，侧重运单频次与结算数据验证', format: 'PDF' },
];

const REPORT_CHAPTERS = [
  { id: 'CH-01', name: '企业基本信息', required: true, modules: ['工商注册', '法人信息', '股东结构'], condition: '始终显示', desc: '企业工商登记、法人身份、股权结构等基础信息' },
  { id: 'CH-02', name: '经营实质验证', required: true, modules: ['三流交叉验证', '订单匹配', '物流履约'], condition: '始终显示', desc: '通过订单-物流-回款三流匹配验证经营真实性' },
  { id: 'CH-03', name: '财务指标', required: true, modules: ['营收规模', '流水分析', '税票验证'], condition: '始终显示', desc: '基于对公流水和税票数据评估财务健康度' },
  { id: 'CH-04', name: '产业链关系', required: true, modules: ['链路证明', '关系强度', '交易对手'], condition: '链贷场景启用', desc: '产业链上下游关系图谱与交易对手分析' },
  { id: 'CH-05', name: '风险扫描', required: true, modules: ['司法诉讼', '行政处罚', '舆情监控'], condition: '始终显示', desc: '涉诉、处罚、负面舆情等外部风险扫描' },
  { id: 'CH-06', name: '征信概要', required: false, modules: ['征信评分', '信贷记录', '担保情况'], condition: '征信数据已接入时显示', desc: '央行征信评分、历史信贷与对外担保摘要' },
  { id: 'CH-07', name: 'AI 综合评估', required: true, modules: ['置信度', '关键判断', '建议动作'], condition: '始终显示', desc: 'AI 模型综合评估结论、置信度与建议' },
  { id: 'CH-08', name: '附件清单', required: false, modules: ['影像材料', '合同扫描', '外勤采集件'], condition: '有附件时显示', desc: '外勤采集的照片、合同扫描件等附件列表' },
];

const REPORT_CONTENT_MODULES = [
  { id: 'MOD-01', name: '工商注册', source: '工商注册信息', type: '结构化表格', chapter: 'CH-01', desc: '企业名称、注册号、法人、注册资本、成立日期等' },
  { id: 'MOD-02', name: '法人信息', source: '工商注册信息 + 征信', type: '信息卡', chapter: 'CH-01', desc: '法人姓名、身份证、关联企业、历史变更' },
  { id: 'MOD-03', name: '三流交叉验证', source: '对公流水 + 物流运单 + 回款记录', type: '可视化图表', chapter: 'CH-02', desc: '订单→物流→回款三流时序匹配度分析' },
  { id: 'MOD-04', name: '订单匹配', source: '订单/合同数据', type: '列表 + 匹配率', chapter: 'CH-02', desc: '近 90 天订单清单及与发票、物流的匹配关系' },
  { id: 'MOD-05', name: '营收规模', source: '对公流水 + 税票', type: '趋势图 + 数值', chapter: 'CH-03', desc: '年化营收、月均流水、税票连续性等关键指标' },
  { id: 'MOD-06', name: '链路证明', source: '知识图谱', type: '关系图 + 文字摘要', chapter: 'CH-04', desc: '链主→桥接→目标企业的关系路径与强度' },
  { id: 'MOD-07', name: '司法诉讼', source: '裁判文书网', type: '列表 + 摘要', chapter: 'CH-05', desc: '涉诉案件列表、金额、角色、判决状态' },
  { id: 'MOD-08', name: '征信评分', source: '央行征信', type: '评分卡 + 趋势', chapter: 'CH-06', desc: '征信评分、信贷余额、逾期记录、担保情况' },
  { id: 'MOD-09', name: '置信度', source: 'AI 模型输出', type: '评分卡', chapter: 'CH-07', desc: 'AI 综合置信度评分及各维度分项得分' },
  { id: 'MOD-10', name: '建议动作', source: 'AI 模型输出', type: '结论卡', chapter: 'CH-07', desc: 'AI 给出的下一步建议（进入补审/观察/拒绝等）' },
];

const REPORT_DISPLAY_RULES = [
  { id: 'DR-01', rule: '征信数据未接入', action: '隐藏征信概要章节', scope: '全模板', priority: '高' as const },
  { id: 'DR-02', rule: '非链贷场景', action: '隐藏产业链关系章节', scope: '标准尽调报告', priority: '高' as const },
  { id: 'DR-03', rule: '置信度 < 60%', action: '标红 AI 综合评估 + 插入风险提示横幅', scope: '全模板', priority: '中' as const },
  { id: 'DR-04', rule: '无附件材料', action: '隐藏附件清单章节', scope: '全模板', priority: '低' as const },
  { id: 'DR-05', rule: '客户集中度 > 55%', action: '在经营实质章节插入集中度预警段落', scope: '全模板', priority: '中' as const },
  { id: 'DR-06', rule: '涉诉金额 > 50万', action: '风险扫描章节标红 + 提升至第二章节', scope: '全模板', priority: '高' as const },
  { id: 'DR-07', rule: '外勤材料不完整', action: '附件清单章节插入补充采集提示', scope: '全模板', priority: '低' as const },
];

const TPL_STATUS_STYLE = {
  '启用': 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]',
  '试运行': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
  '草稿': 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]',
};

const PRIORITY_STYLE = {
  '高': 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]',
  '中': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
  '低': 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]',
};

/* ══════════════════════════════════════════════════════════════════
   Shared Components
   ══════════════════════════════════════════════════════════════════ */

const RULE_TYPE_STYLE: Record<string, string> = {
  '准入': 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
  '评分': 'bg-[#F0FDF4] text-[#047857] border-[#A7F3D0]',
  '计算': 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]',
  '标签': 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]',
};

const RuleCard: React.FC<{ rule: typeof STANDARD_RULES[number] }> = ({ rule }) => (
  <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden hover:shadow-sm transition-shadow">
    <div className="px-4 py-2.5 flex items-center gap-2 border-b border-[#F1F5F9]">
      <div className={`w-2 h-2 rounded-full shrink-0 ${rule.status === '启用' ? 'bg-[#16A34A]' : rule.status === '试运行' ? 'bg-[#F59E0B]' : 'bg-[#CBD5E1]'}`} />
      <span className="text-[11px] text-[#94A3B8] font-mono">{rule.id}</span>
      <span className="text-[13px] font-semibold text-[#0F172A]">{rule.name}</span>
      <Badge className={cn('text-[9px] border', RULE_TYPE_STYLE[rule.ruleType] ?? 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]')}>{rule.ruleType}</Badge>
      <Badge className="bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] text-[9px]">{rule.scope}</Badge>
      <div className="flex-1" />
      <span className="text-[9px] text-[#94A3B8] font-mono">{rule.version}</span>
      <Badge className={`text-[9px] border ${rule.status === '启用' ? 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]' : rule.status === '试运行' ? 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]' : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]'}`}>{rule.status}</Badge>
    </div>
    <div className="px-4 py-2.5 grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center">
      <div className="text-[11px] text-[#64748B] leading-4">{rule.desc}</div>
      <div className="flex flex-wrap gap-1">
        {rule.source.map(s => <span key={s} className="bg-[#F1F5F9] border border-[#E2E8F0] rounded px-1.5 py-0.5 text-[9px] text-[#475569]">{s}</span>)}
      </div>
      <div className="text-right">
        <div className="text-[10px] text-[#94A3B8]">优先级</div>
        <div className="text-sm font-semibold text-[#0F172A]">P{rule.priority}</div>
      </div>
      <div className="text-right">
        <div className="text-[10px] text-[#94A3B8]">命中率</div>
        <div className="text-sm font-semibold text-[#0F172A]">{rule.hit}</div>
      </div>
    </div>
    <div className="px-4 py-1.5 bg-[#FAFBFC] border-t border-[#F1F5F9] flex items-center justify-between text-[10px] text-[#94A3B8]">
      <span>负责人: {rule.owner}</span>
      <div className="flex items-center gap-3">
        <span>生效: {rule.effectDate}</span>
        <div className="flex items-center gap-1">
          <button className="hover:text-[#2563EB] transition-colors"><Copy size={10} /></button>
          <button className="hover:text-[#2563EB] transition-colors"><Play size={10} /></button>
          <button className="hover:text-[#2563EB] transition-colors"><Edit size={10} /></button>
        </div>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════════════════════ */

interface Props { activeModule: string; onModuleChange: (id: string) => void }

export default function PartnerManagementScene({ activeModule, onModuleChange, sceneOverride }: Props & { sceneOverride?: string }) {
  const scene = SCENES.find(s => s.id === (sceneOverride || 'strategy-config'))!;

  const [sceneSearch, setSceneSearch] = React.useState('');
  const [selectedSceneId, setSelectedSceneId] = React.useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const [newSceneName, setNewSceneName] = React.useState('');
  const [selectedTplId, setSelectedTplId] = React.useState<string | null>(null);

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
            {/* Page Header */}
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield size={14} className="text-[#2563EB]" />
                <span className="text-sm font-semibold text-[#0F172A]">基础规则</span>
                <span className="text-[11px] text-[#94A3B8]">系统级通用规则 · 准入 / 评分 / 计算 / 标签</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 text-[#64748B] border-[#E2E8F0]"><Download size={10} />导出</Button>
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 text-[#64748B] border-[#E2E8F0]"><Upload size={10} />导入</Button>
                <Button size="sm" className="h-7 text-[10px] gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white"><Plus size={10} />新建规则</Button>
              </div>
            </div>

            {/* Rule Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: '规则总数', value: `${STANDARD_RULES.length}`, desc: `准入 ${STANDARD_RULES.filter(r => r.ruleType === '准入').length} · 评分 ${STANDARD_RULES.filter(r => r.ruleType === '评分').length} · 计算 ${STANDARD_RULES.filter(r => r.ruleType === '计算').length} · 标签 ${STANDARD_RULES.filter(r => r.ruleType === '标签').length}` },
                { label: '启用 / 灰度', value: `${STANDARD_RULES.filter(r => r.status === '启用').length} / ${STANDARD_RULES.filter(r => r.status === '灰度').length}`, desc: '适用范围: 全行 + 分支机构' },
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

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 text-[#2563EB] border-[#BFDBFE]"><Play size={10} />规则测试</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 text-[#7C3AED] border-[#DDD6FE]"><GitBranch size={10} />版本管理</Button>
              <div className="flex-1" />
              <div className="flex items-center gap-2 text-[10px] text-[#94A3B8]">
                <Badge className="bg-[#ECFDF3] text-[#047857] border-[#A7F3D0] text-[10px]">启用 {STANDARD_RULES.filter(r => r.status === '启用').length}</Badge>
                <Badge className="bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] text-[10px]">灰度 {STANDARD_RULES.filter(r => r.status === '灰度').length}</Badge>
                <span>最后更新: 2026-04-08</span>
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

            {/* Rule List */}
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
                <span className="text-[13px] font-semibold text-[#0F172A]">策略编排</span>
                <span className="text-[11px] text-[#94A3B8]">{selectedScene.name}</span>
                <Badge className={cn('text-[9px] border', selectedScene.sceneType === '营销' ? 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]' : selectedScene.sceneType === '风控' ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]' : 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]')}>{selectedScene.sceneType}</Badge>
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
                  <div>
                    <div className="text-[10px] text-[#94A3B8] uppercase tracking-wider mb-1">输出动作</div>
                    <div className="flex items-center gap-1.5">
                      <Zap size={11} className="text-[#C2410C]" />
                      <div className="text-[12px] font-semibold text-[#0F172A]">{selectedScene.outputAction}</div>
                    </div>
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
                <span className="text-[13px] font-semibold text-[#0F172A]">场景策略</span>
                <span className="text-[11px] text-[#94A3B8]">面向业务场景的策略配置中心 · 组合基础规则形成决策逻辑</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-[#ECFDF3] text-[#047857] border-[#A7F3D0] text-[10px]">启用 {SCENES_DATA.filter(r => r.status === '启用').length}</Badge>
                <Badge className="bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA] text-[10px]">试运行 {SCENES_DATA.filter(r => r.status === '试运行').length}</Badge>
                <Badge className="bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] text-[10px]">灰度 {SCENES_DATA.filter(r => r.status === '灰度').length}</Badge>
              </div>
            </div>

            <div className="rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-3 text-[12px] text-[#2563EB] flex items-center gap-2">
              <Sparkles size={14} className="shrink-0" />
              <span>场景策略通过组合基础规则形成完整的业务决策逻辑，支持营销、风控、客户挽回等多业务场景。每个场景可独立配置触发条件、决策逻辑与输出动作。</span>
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
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <MetricCard label="场景总数" value={`${SCENES_DATA.length}`} detail={`营销 ${SCENES_DATA.filter(s => s.sceneType === '营销').length} · 风控 ${SCENES_DATA.filter(s => s.sceneType === '风控').length} · 挽回 ${SCENES_DATA.filter(s => s.sceneType === '挽回').length}`} tone="blue" />
              <MetricCard label="综合命中率" value="9.8%" detail="场景规则贡献候选中 32%" tone="green" />
              <MetricCard label="数据源覆盖" value={`${new Set(SCENES_DATA.flatMap(s => s.dataSources.map(d => d.name))).size} 类`} detail="跨场景数据源" tone="slate" />
              <MetricCard label="缺失数据源" value="2 项" detail="影响 1 个灰度场景" tone="amber" />
              <MetricCard label="策略冲突" value="0" detail="冲突检测通过" tone="green" />
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 text-[#7C3AED] border-[#DDD6FE]"><Play size={10} />模拟运行</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 text-[#C2410C] border-[#FED7AA]"><AlertTriangle size={10} />冲突检测</Button>
              <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 text-[#64748B] border-[#E2E8F0]"><GitBranch size={10} />版本管理</Button>
            </div>

            {/* Scene List */}
            <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
              <div className="grid grid-cols-[40px_1fr_60px_1fr_1fr_60px_80px_100px] gap-0 px-4 py-2.5 border-b border-[#E2E8F0] bg-[#F8FAFC] text-[10px] font-medium text-[#94A3B8] uppercase tracking-wider">
                <div>编号</div><div>场景名称</div><div>类型</div><div>触发条件</div><div>输出动作</div><div>优先级</div><div>状态</div><div>操作</div>
              </div>
              {filteredScenes.map(s => {
                const sceneTypeStyle = s.sceneType === '营销' ? 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]' : s.sceneType === '风控' ? 'bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]' : 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]';
                return (
                <div key={s.id} className="grid grid-cols-[40px_1fr_60px_1fr_1fr_60px_80px_100px] gap-0 px-4 py-3 border-b border-[#F1F5F9] last:border-b-0 items-center hover:bg-[#FAFBFF] transition-colors">
                  <span className="text-[11px] text-[#94A3B8] font-mono">{s.id.replace('LT-', '')}</span>
                  <div>
                    <div className="text-[12px] font-medium text-[#0F172A]">{s.name}</div>
                    <div className="text-[10px] text-[#94A3B8] mt-0.5 line-clamp-1">{s.desc}</div>
                  </div>
                  <Badge className={cn('text-[9px] border w-fit', sceneTypeStyle)}>{s.sceneType}</Badge>
                  <div className="text-[10px] text-[#64748B] leading-4 line-clamp-2 pr-2">
                    {s.rules.slice(0, 2).map(r => `${r.field}${r.operator}${r.value}`).join('，')}{s.rules.length > 2 ? '…' : ''}
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap size={9} className="text-[#C2410C] shrink-0" />
                    <span className="text-[10px] text-[#334155]">{s.outputAction}</span>
                  </div>
                  <div className="text-[11px] font-semibold text-[#0F172A] text-center">P{s.priority}</div>
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
                );
              })}
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
            {/* Page Header */}
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Settings size={14} className="text-[#7C3AED]" />
                <span className="text-sm font-semibold text-[#0F172A]">产品策略配置</span>
                <span className="text-[11px] text-[#94A3B8]">金融产品的策略参数与差异化匹配规则管理</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 text-[#64748B] border-[#E2E8F0]"><GitBranch size={10} />版本管理</Button>
                <Button size="sm" className="h-7 text-[10px] gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white"><Plus size={10} />新增产品</Button>
              </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <MetricCard label="已上线" value={PRODUCTS.filter(p => p.status === '已上线').length.toString()} detail="正式运营中" tone="green" />
              <MetricCard label="试运行" value={PRODUCTS.filter(p => p.status === '试运行').length.toString()} detail="灰度验证中" tone="amber" />
              <MetricCard label="产品类型" value={`${new Set(PRODUCTS.map(p => p.productType)).size} 种`} detail="贷款 · 供应链金融" tone="blue" />
              <MetricCard label="客户层级覆盖" value="L1–L4" detail="全层级差异化推荐" tone="slate" />
              <MetricCard label="绑定规则包" value="4 套" detail="覆盖全场景" tone="blue" />
            </div>

            {/* Product Table */}
            <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
              <div className="grid grid-cols-[50px_90px_70px_1fr_70px_90px_80px_70px_80px_1fr_60px] gap-0 px-3 py-2.5 border-b border-[#E2E8F0] bg-[#F8FAFC] text-[10px] font-medium text-[#94A3B8] uppercase tracking-wider">
                <div>编号</div><div>产品名称</div><div>类型</div><div>适用客群</div><div>层级</div><div>额度区间</div><div>定价</div><div>期限</div><div>还款方式</div><div>匹配规则</div><div>状态</div>
              </div>
              {PRODUCTS.map(p => (
                <div key={p.id} className="grid grid-cols-[50px_90px_70px_1fr_70px_90px_80px_70px_80px_1fr_60px] gap-0 px-3 py-3 border-b border-[#F1F5F9] last:border-b-0 items-center hover:bg-[#FAFBFF] transition-colors">
                  <span className="text-[10px] text-[#94A3B8] font-mono">{p.id}</span>
                  <span className="text-[12px] font-medium text-[#0F172A]">{p.name}</span>
                  <Badge className={cn('text-[9px] border w-fit', p.productType === '贷款' ? 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]' : 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]')}>{p.productType}</Badge>
                  <span className="text-[10px] text-[#64748B]">{p.target}</span>
                  <div className="flex gap-0.5">{p.clientTiers.map(t => <span key={t} className="bg-[#F1F5F9] border border-[#E2E8F0] rounded px-1 py-0.5 text-[9px] text-[#475569]">{t}</span>)}</div>
                  <span className="text-[10px] text-[#334155] font-medium">{p.limit}</span>
                  <span className="text-[10px] text-[#334155]">{p.rate}</span>
                  <span className="text-[10px] text-[#334155]">{p.term}</span>
                  <span className="text-[10px] text-[#64748B]">{p.repayMethod}</span>
                  <span className="text-[9px] text-[#64748B] font-mono">{p.matchRule}</span>
                  <div className="flex items-center gap-1">
                    <Badge className={`text-[9px] border w-fit ${p.status === '已上线' ? 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]' : 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]'}`}>{p.status}</Badge>
                  </div>
                </div>
              ))}
            </div>

            {/* Product Detail Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {PRODUCTS.map(p => (
                <div key={p.id} className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden hover:shadow-sm transition-shadow">
                  <div className="px-4 py-3 flex items-center gap-3 border-b border-[#F1F5F9]">
                    <div className="w-8 h-8 rounded-lg bg-[#F3E8FF] flex items-center justify-center"><Settings size={14} className="text-[#7C3AED]" /></div>
                    <div className="flex-1">
                      <div className="text-[13px] font-semibold text-[#0F172A]">{p.name}</div>
                      <div className="text-[10px] text-[#94A3B8]">{p.target}</div>
                    </div>
                    <Badge className={cn('text-[9px] border', p.productType === '贷款' ? 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]' : 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]')}>{p.productType}</Badge>
                    <Badge className={`text-[9px] border ${p.status === '已上线' ? 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]' : 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]'}`}>{p.status}</Badge>
                  </div>
                  <div className="px-4 py-2.5 grid grid-cols-4 gap-2">
                    {[
                      { label: '额度', value: p.limit },
                      { label: '利率', value: p.rate },
                      { label: '期限', value: p.term },
                      { label: '还款', value: p.repayMethod },
                    ].map(f => (
                      <div key={f.label}>
                        <div className="text-[9px] text-[#94A3B8]">{f.label}</div>
                        <div className="text-[11px] font-medium text-[#334155]">{f.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 bg-[#FAFBFC] border-t border-[#F1F5F9] flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {p.rulePackage.split(' + ').map(r => <span key={r} className="bg-white border border-[#E2E8F0] rounded px-1.5 py-0.5 text-[9px] text-[#475569]">{r}</span>)}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-[9px] text-[#94A3B8] font-mono">{p.version}</span>
                      <Button variant="ghost" size="sm" className="h-6 text-[10px] px-1.5 gap-1 text-[#2563EB]"><Edit size={9} /></Button>
                      <Button variant="ghost" size="sm" className="h-6 text-[10px] px-1.5 gap-1 text-[#64748B]"><Copy size={9} /></Button>
                      <Button variant="ghost" size="sm" className="h-6 text-[10px] px-1.5 gap-1 text-[#64748B]"><Power size={9} /></Button>
                    </div>
                  </div>
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
            {/* Page Header */}
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CheckCircle size={14} className="text-[#047857]" />
                <span className="text-sm font-semibold text-[#0F172A]">审批策略</span>
                <span className="text-[11px] text-[#94A3B8]">配置授信与业务审批规则、流程与权限</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 text-[#64748B] border-[#E2E8F0]"><Activity size={10} />审批日志</Button>
                <Button size="sm" className="h-7 text-[10px] gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white"><Plus size={10} />新建流程</Button>
              </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <MetricCard label="审批流程" value={`${APPROVAL_FLOWS.length}`} detail={`自动 ${APPROVAL_FLOWS.filter(f => f.approvalType === '自动').length} · 混合 ${APPROVAL_FLOWS.filter(f => f.approvalType === '混合').length} · 人工 ${APPROVAL_FLOWS.filter(f => f.approvalType === '人工').length}`} tone="blue" />
              <MetricCard label="审批规则" value={`${APPROVAL_RULES.length}`} detail={`启用 ${APPROVAL_RULES.filter(r => r.status === '启用').length} · 灰度 ${APPROVAL_RULES.filter(r => r.status === '灰度').length}`} tone="slate" />
              <MetricCard label="平均 SLA" value={`${Math.round(APPROVAL_FLOWS.reduce((s, f) => s + f.sla, 0) / APPROVAL_FLOWS.length)}h`} detail="含自动审批" tone="green" />
              <MetricCard label="30天通过率" value="72%" detail="318 件通过" tone="green" />
              <MetricCard label="平均误伤率" value="5.5%" detail="目标 < 8%" tone="amber" />
            </div>

            {/* Section 1: Approval Flows */}
            <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <GitBranch size={13} className="text-[#2563EB]" />
                  <span className="text-[12px] font-semibold text-[#0F172A]">审批流程</span>
                  <span className="text-[10px] text-[#94A3B8]">{APPROVAL_FLOWS.length} 条流程</span>
                </div>
                <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1 px-2 text-[#7C3AED] border-[#DDD6FE]"><Brain size={10} />可视化设计器</Button>
              </div>
              {APPROVAL_FLOWS.map(flow => {
                const typeStyle = flow.approvalType === '自动' ? 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]' : flow.approvalType === '混合' ? 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]' : 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]';
                return (
                  <div key={flow.id} className="px-4 py-3.5 border-b border-[#F1F5F9] last:border-b-0 hover:bg-[#FAFBFF] transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] text-[#94A3B8] font-mono">{flow.id}</span>
                      <span className="text-[13px] font-semibold text-[#0F172A]">{flow.name}</span>
                      <Badge className={cn('text-[9px] border', typeStyle)}>{flow.approvalType}</Badge>
                      <Badge className={`text-[9px] border ${flow.status === '启用' ? 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]' : 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]'}`}>{flow.status}</Badge>
                      {flow.autoPass && <Badge className="text-[9px] bg-[#F0FDF4] text-[#047857] border-[#A7F3D0]">自动通过</Badge>}
                      <div className="flex-1" />
                      <span className="text-[10px] text-[#94A3B8]">{flow.owner} · {flow.version}</span>
                    </div>
                    <div className="flex items-center gap-2 mb-2 text-[11px]">
                      <span className="text-[#94A3B8] shrink-0">触发:</span>
                      <span className="text-[#334155]">{flow.trigger}</span>
                      <span className="text-[#94A3B8] mx-1">·</span>
                      <span className="text-[#94A3B8]">SLA: <span className="text-[#0F172A] font-semibold">{flow.sla}h</span></span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {flow.nodes.map((node, i) => (
                        <React.Fragment key={node}>
                          {i > 0 && <ArrowRight size={10} className="text-[#CBD5E1] shrink-0" />}
                          <div className="flex items-center gap-1 rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-2 py-1">
                            <span className="text-[10px] text-[#334155]">{node}</span>
                            <span className="text-[9px] text-[#94A3B8]">({flow.roles[i]})</span>
                          </div>
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Section 2: Approval Rules (existing) */}
            <div className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden">
              <div className="px-4 py-2.5 border-b border-[#E2E8F0] bg-[#F8FAFC] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield size={13} className="text-[#C2410C]" />
                  <span className="text-[12px] font-semibold text-[#0F172A]">审批规则配置</span>
                  <span className="text-[10px] text-[#94A3B8]">{APPROVAL_RULES.length} 条规则</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="h-6 text-[10px] text-[#64748B] gap-1 px-2"><Search size={10} /> 搜索</Button>
                  <Button variant="ghost" size="sm" className="h-6 text-[10px] text-[#64748B] gap-1 px-2"><Filter size={10} /> 筛选</Button>
                </div>
              </div>
              <div className="divide-y divide-[#F1F5F9]">
                {APPROVAL_RULES.map(rule => (
                  <div key={rule.id} className="px-4 py-3 hover:bg-[#FAFBFF] transition-colors">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${rule.status === '启用' ? 'bg-[#16A34A]' : 'bg-[#CBD5E1]'}`} />
                      <span className="text-[11px] text-[#94A3B8] font-mono">{rule.id}</span>
                      <span className="text-[12px] font-semibold text-[#0F172A]">{rule.name}</span>
                      <Badge className={`text-[9px] border ${CATEGORY_STYLES[rule.category] ?? 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]'}`}>{rule.category}</Badge>
                      <Badge className="bg-[#F8FAFC] text-[#64748B] border border-[#E2E8F0] text-[9px]">{rule.scope}</Badge>
                      <div className="flex-1" />
                      <span className="text-[10px] text-[#94A3B8]">{rule.owner}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px]">
                      <span className="text-[#94A3B8] shrink-0">触发:</span>
                      <span className="text-[#334155]">{rule.trigger}</span>
                      <span className="text-[#94A3B8] mx-1">→</span>
                      <span className="font-medium text-[#0F172A]">{rule.action}</span>
                      <div className="flex-1" />
                      <span className="text-[10px] text-[#94A3B8]">命中 {rule.hitRate}</span>
                      <span className="text-[10px] text-[#94A3B8]">·</span>
                      <span className={cn('text-[10px]', rule.fpRate !== '—' && parseFloat(rule.fpRate) > 10 ? 'text-[#DC2626]' : 'text-[#94A3B8]')}>误伤 {rule.fpRate}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Permission Matrix */}
            <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 space-y-3">
              <div className="text-[12px] font-semibold text-[#0F172A] flex items-center gap-2"><Users size={13} className="text-[#64748B]" /> 审批权限管理</div>
              <div className="rounded-lg border border-[#E2E8F0] overflow-hidden">
                <div className="grid grid-cols-4 gap-0 px-3 py-2 border-b border-[#E2E8F0] bg-[#F8FAFC] text-[10px] font-medium text-[#94A3B8] uppercase tracking-wider">
                  <div>角色</div><div>审批权限</div><div>额度上限</div><div>SLA 管理</div>
                </div>
                {[
                  { role: '客户经理', perm: '初审提交', limit: '—', sla: '查看' },
                  { role: '支行风控', perm: '初审 + 复核', limit: '≤50万', sla: '查看' },
                  { role: '分行风控', perm: '复核 + 终审', limit: '≤200万', sla: '配置' },
                  { role: '总行审批', perm: '全量终审', limit: '不限', sla: '管理' },
                ].map(r => (
                  <div key={r.role} className="grid grid-cols-4 gap-0 px-3 py-2.5 border-b border-[#F1F5F9] last:border-b-0 text-[11px] items-center">
                    <span className="font-medium text-[#0F172A]">{r.role}</span>
                    <span className="text-[#64748B]">{r.perm}</span>
                    <span className="text-[#334155]">{r.limit}</span>
                    <span className="text-[#64748B]">{r.sla}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      /* ════════════════════════════════════════════════════════════════════
         PAGE 5: 报告模板
         配置尽调报告的章节、模块、显示条件、文案口径、导出格式
         ════════════════════════════════════════════════════════════════════ */
      case 'report-template': {
        const selectedTpl = REPORT_TEMPLATES.find(t => t.id === selectedTplId);

        if (selectedTpl) {
          const tplChapters = REPORT_CHAPTERS.slice(0, selectedTpl.chapters);
          const tplModules = REPORT_CONTENT_MODULES.filter(m => tplChapters.some(ch => ch.id === m.chapter));
          return (
            <div className="space-y-4">
              {/* ── Header with back ── */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 flex items-center gap-3">
                <button onClick={() => setSelectedTplId(null)} className="flex items-center gap-1 text-[11px] text-[#2563EB] hover:text-[#1D4ED8] transition-colors"><ArrowLeft size={12} /> 返回模板列表</button>
                <div className="w-px h-4 bg-[#E2E8F0]" />
                <span className="text-[13px] font-semibold text-[#0F172A]">{selectedTpl.name}</span>
                <Badge className={`text-[9px] border ${TPL_STATUS_STYLE[selectedTpl.status]}`}>{selectedTpl.status}</Badge>
                <div className="flex-1" />
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 text-[#64748B] border-[#E2E8F0]"><Eye size={10} />预览</Button>
                <Button size="sm" className="h-7 text-[10px] gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white"><CheckCircle size={10} />保存模板</Button>
              </div>

              {/* ── 1. 基础信息 ── */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 space-y-3">
                <div className="text-[12px] font-semibold text-[#0F172A] flex items-center gap-2"><FileText size={13} className="text-[#2563EB]" /> 基础信息</div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { label: '模板名称', value: selectedTpl.name, editable: true },
                    { label: '适用范围', value: selectedTpl.scope, editable: true },
                    { label: '导出格式', value: selectedTpl.format, editable: true },
                  ].map(f => (
                    <div key={f.label} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5">
                      <div className="text-[10px] text-[#94A3B8] mb-1">{f.label}</div>
                      <div className="flex items-center justify-between">
                        <div className="text-[12px] font-medium text-[#0F172A]">{f.value}</div>
                        {f.editable && <button className="text-[#94A3B8] hover:text-[#2563EB]"><Edit size={10} /></button>}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5">
                  <div className="text-[10px] text-[#94A3B8] mb-1">模板说明</div>
                  <div className="text-[11px] text-[#475569] leading-4">{selectedTpl.desc}</div>
                </div>
                <div className="flex items-center gap-4 text-[10px] text-[#94A3B8]">
                  <span>创建人: {selectedTpl.creator}</span>
                  <span>最后更新: {selectedTpl.lastUpdated}</span>
                  <span>章节数: {selectedTpl.chapters}</span>
                  <span>编号: {selectedTpl.id}</span>
                </div>
              </div>

              {/* ── 2. 章节结构 ── */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-[12px] font-semibold text-[#0F172A] flex items-center gap-2"><Layers size={13} className="text-[#7C3AED]" /> 章节结构 <span className="text-[10px] text-[#94A3B8] font-normal">（{tplChapters.length} 章 · 拖拽可调整顺序）</span></div>
                  <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1 px-2 text-[#2563EB] border-[#BFDBFE]"><Plus size={9} /> 添加章节</Button>
                </div>
                <div className="space-y-1.5">
                  {tplChapters.map((ch, idx) => (
                    <div key={ch.id} className="flex items-center gap-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-3 hover:border-[#BFDBFE] transition-colors group">
                      <div className="text-[#CBD5E1] cursor-grab group-hover:text-[#94A3B8]">⠿</div>
                      <div className="w-6 h-6 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center text-[10px] font-bold shrink-0">{idx + 1}</div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12px] font-medium text-[#0F172A]">{ch.name}</div>
                        <div className="text-[10px] text-[#94A3B8] mt-0.5">{ch.desc}</div>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {ch.modules.map(m => <span key={m} className="bg-white border border-[#E2E8F0] rounded px-1.5 py-0.5 text-[9px] text-[#475569]">{m}</span>)}
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1.5 shrink-0">
                        {ch.required ? <Badge className="text-[9px] bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5]">必选</Badge> : <Badge className="text-[9px] bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]">可选</Badge>}
                        <span className="text-[9px] text-[#94A3B8]">{ch.condition}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <button className="text-[#94A3B8] hover:text-[#2563EB]"><Edit size={10} /></button>
                        <button className="text-[#94A3B8] hover:text-[#DC2626]"><Trash2 size={10} /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── 3. 内容模块 ── */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-[12px] font-semibold text-[#0F172A] flex items-center gap-2"><Settings size={13} className="text-[#2563EB]" /> 内容模块 <span className="text-[10px] text-[#94A3B8] font-normal">（{tplModules.length} 个模块）</span></div>
                  <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1 px-2 text-[#2563EB] border-[#BFDBFE]"><Plus size={9} /> 添加模块</Button>
                </div>
                <div className="rounded-lg border border-[#E2E8F0] overflow-hidden">
                  <div className="grid grid-cols-[50px_100px_1fr_1fr_120px_40px] gap-0 px-3 py-2 border-b border-[#E2E8F0] bg-[#F8FAFC] text-[10px] font-medium text-[#94A3B8] uppercase tracking-wider">
                    <div>编号</div><div>模块名称</div><div>说明</div><div>数据来源</div><div>呈现方式</div><div></div>
                  </div>
                  {tplModules.map(m => (
                    <div key={m.id} className="grid grid-cols-[50px_100px_1fr_1fr_120px_40px] gap-0 px-3 py-2.5 border-b border-[#F1F5F9] last:border-b-0 items-center hover:bg-[#FAFBFF] transition-colors">
                      <span className="text-[10px] text-[#94A3B8] font-mono">{m.id}</span>
                      <span className="text-[11px] font-medium text-[#0F172A]">{m.name}</span>
                      <span className="text-[10px] text-[#64748B] pr-2">{m.desc}</span>
                      <div className="flex flex-wrap gap-1">
                        {m.source.split(' + ').map(s => <span key={s} className="bg-[#F1F5F9] border border-[#E2E8F0] rounded px-1.5 py-0.5 text-[9px] text-[#475569]">{s.trim()}</span>)}
                      </div>
                      <Badge className="text-[9px] bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] w-fit">{m.type}</Badge>
                      <button className="text-[#94A3B8] hover:text-[#2563EB]"><Edit size={10} /></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── 4. 显示规则 ── */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-[12px] font-semibold text-[#0F172A] flex items-center gap-2"><Filter size={13} className="text-[#C2410C]" /> 显示规则 <span className="text-[10px] text-[#94A3B8] font-normal">（{REPORT_DISPLAY_RULES.length} 条）</span></div>
                  <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1 px-2 text-[#2563EB] border-[#BFDBFE]"><Plus size={9} /> 添加规则</Button>
                </div>
                <div className="rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-2.5 text-[11px] text-[#2563EB] flex items-center gap-2">
                  <Sparkles size={12} className="shrink-0" />
                  显示规则控制报告生成时章节和模块的条件化显隐。优先级高的规则先执行。
                </div>
                <div className="space-y-1.5">
                  {REPORT_DISPLAY_RULES.map(dr => (
                    <div key={dr.id} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5 flex items-center gap-3 hover:border-[#BFDBFE] transition-colors">
                      <span className="text-[10px] text-[#94A3B8] font-mono shrink-0">{dr.id}</span>
                      <Badge className={cn('text-[9px] border shrink-0', PRIORITY_STYLE[dr.priority])}>{dr.priority}</Badge>
                      <div className="flex-1 min-w-0">
                        <div className="text-[11px] text-[#0F172A]">
                          <span className="font-medium text-[#C2410C]">当 {dr.rule}</span>
                          <span className="text-[#94A3B8] mx-1.5">→</span>
                          <span className="text-[#334155]">{dr.action}</span>
                        </div>
                      </div>
                      <Badge className="text-[9px] bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0] shrink-0">{dr.scope}</Badge>
                      <button className="text-[#94A3B8] hover:text-[#2563EB] shrink-0"><Edit size={10} /></button>
                      <button className="text-[#94A3B8] hover:text-[#DC2626] shrink-0"><Trash2 size={10} /></button>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── 5. 模板预览 ── */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-[12px] font-semibold text-[#0F172A] flex items-center gap-2"><Eye size={13} className="text-[#047857]" /> 模板预览</div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1 px-2 text-[#64748B] border-[#E2E8F0]"><FileImage size={9} />PDF</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1 px-2 text-[#64748B] border-[#E2E8F0]"><FileText size={9} />Word</Button>
                    <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1 px-2 text-[#64748B] border-[#E2E8F0]"><Globe size={9} />HTML</Button>
                  </div>
                </div>
                <div className="rounded-lg border border-[#E2E8F0] bg-white p-6 min-h-[280px] shadow-inner">
                  <div className="max-w-lg mx-auto space-y-5">
                    <div className="text-center space-y-1.5 pb-4 border-b border-[#E2E8F0]">
                      <div className="text-[15px] font-bold text-[#0F172A]">{selectedTpl.name}</div>
                      <div className="text-[10px] text-[#94A3B8]">目标企业: 常州衡远包装材料有限公司 · 生成时间: 2026-04-09 14:30</div>
                      <div className="text-[10px] text-[#94A3B8]">模板版本: v1.2 · {selectedTpl.chapters} 个章节 · {tplModules.length} 个内容模块</div>
                    </div>
                    {tplChapters.map((ch, idx) => {
                      const mods = REPORT_CONTENT_MODULES.filter(m => m.chapter === ch.id);
                      return (
                        <div key={ch.id} className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center text-[9px] font-bold">{idx + 1}</div>
                            <div className="text-[12px] font-semibold text-[#0F172A]">{ch.name}</div>
                            {!ch.required && <span className="text-[9px] text-[#94A3B8] italic">[{ch.condition}]</span>}
                          </div>
                          {mods.length > 0 ? mods.map(m => (
                            <div key={m.id} className="ml-7 rounded border border-dashed border-[#E2E8F0] bg-[#FAFBFC] px-3 py-2">
                              <div className="flex items-center gap-2 text-[10px]">
                                <span className="font-medium text-[#475569]">{m.name}</span>
                                <span className="text-[#CBD5E1]">·</span>
                                <span className="text-[#94A3B8]">{m.type}</span>
                              </div>
                              <div className="mt-1.5 space-y-1">
                                <div className="rounded bg-[#E2E8F0]/50 h-2.5 w-full" />
                                <div className="rounded bg-[#E2E8F0]/50 h-2.5 w-4/5" />
                                <div className="rounded bg-[#E2E8F0]/50 h-2.5 w-3/5" />
                              </div>
                            </div>
                          )) : (
                            <div className="ml-7 rounded border border-dashed border-[#E2E8F0] bg-[#FAFBFC] px-3 py-2">
                              <div className="space-y-1">
                                <div className="rounded bg-[#E2E8F0]/50 h-2.5 w-full" />
                                <div className="rounded bg-[#E2E8F0]/50 h-2.5 w-3/4" />
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                    <div className="text-center text-[10px] text-[#94A3B8] pt-3 border-t border-[#E2E8F0]">— 报告结束 —</div>
                  </div>
                </div>
              </div>
            </div>
          );
        }

        /* ── 模板列表（主页） ── */
        return (
          <div className="space-y-4">
            <div className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText size={14} className="text-[#7C3AED]" />
                <span className="text-[13px] font-semibold text-[#0F172A]">报告模板</span>
                <span className="text-[11px] text-[#94A3B8]">配置尽调报告的章节结构、内容模块、显示规则与导出格式</span>
              </div>
              <Button size="sm" className="h-7 text-[10px] gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white"><Plus size={10} />新建模板</Button>
            </div>

            <AiNote>报告模板决定了尽调报告的章节顺序、内容模块组合和条件显隐。支持自动生成与订阅，修改模板后新生成的报告自动应用最新配置。</AiNote>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricCard label="模板总数" value={`${REPORT_TEMPLATES.length}`} detail={`启用 ${REPORT_TEMPLATES.filter(t => t.status === '启用').length}`} tone="blue" />
              <MetricCard label="章节类型" value={`${REPORT_CHAPTERS.length} 种`} detail="可自由组合" tone="slate" />
              <MetricCard label="显示规则" value={`${REPORT_DISPLAY_RULES.length} 条`} detail="条件化显隐" tone="amber" />
              <MetricCard label="导出格式" value="3 种" detail="PDF · Word · HTML" tone="green" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {REPORT_TEMPLATES.map(t => (
                <div key={t.id} className="rounded-lg border border-[#E2E8F0] bg-white overflow-hidden hover:shadow-sm hover:border-[#BFDBFE] transition-all cursor-pointer" onClick={() => setSelectedTplId(t.id)}>
                  <div className="px-4 py-3 flex items-center gap-3 border-b border-[#F1F5F9]">
                    <div className="w-8 h-8 rounded-lg bg-[#F3E8FF] flex items-center justify-center"><FileText size={14} className="text-[#7C3AED]" /></div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-semibold text-[#0F172A]">{t.name}</div>
                      <div className="text-[10px] text-[#94A3B8] mt-0.5">{t.desc}</div>
                    </div>
                    <Badge className={`text-[9px] border shrink-0 ${TPL_STATUS_STYLE[t.status]}`}>{t.status}</Badge>
                  </div>
                  <div className="px-4 py-2.5 grid grid-cols-4 gap-2">
                    {[
                      { label: '适用', value: t.scope },
                      { label: '章节', value: `${t.chapters} 章` },
                      { label: '格式', value: t.format.split(' · ').length + ' 种' },
                      { label: '更新', value: t.lastUpdated.replace('2026-', '') },
                    ].map(f => (
                      <div key={f.label}>
                        <div className="text-[9px] text-[#94A3B8]">{f.label}</div>
                        <div className="text-[11px] font-medium text-[#334155]">{f.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 bg-[#FAFBFC] border-t border-[#F1F5F9] flex items-center justify-between">
                    <span className="text-[10px] text-[#94A3B8]">{t.creator} · {t.id}</span>
                    <div className="flex items-center gap-1 text-[#2563EB]">
                      <span className="text-[10px] font-medium">配置</span>
                      <ChevronRight size={12} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Usage Statistics & Subscription */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 space-y-3">
                <div className="text-[12px] font-semibold text-[#0F172A] flex items-center gap-2"><TrendingUp size={13} className="text-[#2563EB]" /> 使用频率统计</div>
                <div className="space-y-2">
                  {[
                    { name: '标准尽调报告', count: 47, pct: 58 },
                    { name: '脱核链贷专项报告', count: 18, pct: 22 },
                    { name: '涉农小微报告', count: 12, pct: 15 },
                    { name: '物流服务贷报告', count: 4, pct: 5 },
                  ].map(t => (
                    <div key={t.name} className="flex items-center gap-3">
                      <span className="text-[11px] text-[#334155] w-36 shrink-0">{t.name}</span>
                      <div className="flex-1 h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
                        <div className="h-full rounded-full bg-[#2563EB]" style={{ width: `${t.pct}%` }} />
                      </div>
                      <span className="text-[10px] text-[#64748B] w-16 text-right">{t.count} 份</span>
                    </div>
                  ))}
                </div>
                <div className="text-[10px] text-[#94A3B8] border-t border-[#F1F5F9] pt-2">统计周期: 近 30 天 · 总计 81 份报告</div>
              </div>

              <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 space-y-3">
                <div className="text-[12px] font-semibold text-[#0F172A] flex items-center gap-2"><Clock size={13} className="text-[#7C3AED]" /> 自动生成与订阅</div>
                <div className="space-y-2">
                  {[
                    { name: '月度经营报告', freq: '每月 1 日', subscribers: 12, status: '启用' },
                    { name: '周度风险报告', freq: '每周一', subscribers: 8, status: '启用' },
                    { name: '日度异常报告', freq: '每日 08:00', subscribers: 5, status: '启用' },
                  ].map(s => (
                    <div key={s.name} className="flex items-center gap-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2.5">
                      <div className="flex-1">
                        <div className="text-[11px] font-medium text-[#0F172A]">{s.name}</div>
                        <div className="text-[10px] text-[#94A3B8]">{s.freq} · {s.subscribers} 人订阅</div>
                      </div>
                      <Badge className="text-[9px] bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]">{s.status}</Badge>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 w-full text-[#2563EB] border-[#BFDBFE]"><Plus size={10} />添加订阅规则</Button>
              </div>
            </div>
          </div>
        );
      }

      /* ════════════════════════════════════════════════════════════════════
         PAGE 6: 智能尽调工具
         通用数据工具 — 非结构化数据 → 结构化报告
         跨模块调用入口：候选资产池/推荐流/筛选流均可一键触发
         ════════════════════════════════════════════════════════════════════ */
      case 'due-diligence': {
        const DD_REPORTS = [
          { id: 'dd1', company: '常州衡远包装材料有限公司', shortName: '衡远包装', status: 'completed' as const, createdAt: '今天 09:45', creator: '张三经理', source: '候选资产池', confidence: 96, highlights: ['订单-物流-回款三流匹配', '关系强度87%', '置信度92%'], riskFlags: [] as string[] },
          { id: 'dd2', company: '溧阳佳利包装材料有限公司', shortName: '佳利包装', status: 'processing' as const, createdAt: '今天 10:20', creator: '系统自动', source: '智能筛选', confidence: 0, highlights: [], riskFlags: [] as string[] },
          { id: 'dd3', company: '苏州锐信新材料有限公司', shortName: '锐信新材', status: 'completed' as const, createdAt: '昨天 16:30', creator: '李四经理', source: '智能筛选', confidence: 88, highlights: ['二级辅料供应商', '交易真实', '集中度偏高62%'], riskFlags: ['客户集中度偏高'] },
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
                <span>支持来源: 候选资产池 · 智能筛选 · 外勤录入 · 手动输入</span>
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
          { id: 'ds1', name: '工商注册信息', type: '数据库' as const, provider: '国家企业信用信息公示系统', auth: '证书认证', status: 'connected' as const, quota: '10,000/月', used: '6,240', updateFreq: '实时', quality: 98, lastSync: '2026-04-09 08:45', modules: ['候选资产池', '智能尽调'] },
          { id: 'ds2', name: '税务发票数据', type: 'API' as const, provider: '税务数据平台', auth: 'API Key', status: 'connected' as const, quota: '5,000/月', used: '3,180', updateFreq: 'T+1', quality: 95, lastSync: '2026-04-09 06:00', modules: ['标准小微规则', '智能尽调'] },
          { id: 'ds3', name: '司法诉讼信息', type: 'API' as const, provider: '中国裁判文书网', auth: 'API Key', status: 'connected' as const, quota: '8,000/月', used: '2,560', updateFreq: '实时', quality: 92, lastSync: '2026-04-09 09:12', modules: ['风险监控', '智能尽调'] },
          { id: 'ds4', name: '物流运单数据', type: 'API' as const, provider: '物流信息平台', auth: '用户名密码', status: 'connected' as const, quota: '3,000/月', used: '1,890', updateFreq: 'T+1', quality: 89, lastSync: '2026-04-09 06:00', modules: ['候选资产池', '授信资产池'] },
          { id: 'ds5', name: '征信报告', type: 'API' as const, provider: '央行征信中心', auth: '证书认证', status: 'quota_low' as const, quota: '500/月', used: '462', updateFreq: '实时', quality: 99, lastSync: '2026-04-09 09:30', modules: ['产品与审批', '风险监控'] },
          { id: 'ds6', name: '舆情监控', type: 'API' as const, provider: '舆情数据服务商', auth: 'API Key', status: 'connected' as const, quota: '不限', used: '—', updateFreq: '实时', quality: 85, lastSync: '2026-04-09 09:35', modules: ['风险监控'] },
          { id: 'ds7', name: '区块链交易数据', type: 'API' as const, provider: '—', auth: '—', status: 'not_purchased' as const, quota: '—', used: '—', updateFreq: '—', quality: 0, lastSync: '—', modules: ['长尾场景规则'] },
          { id: 'ds8', name: '农产品交易流水', type: '文件' as const, provider: '—', auth: '—', status: 'not_purchased' as const, quota: '—', used: '—', updateFreq: '—', quality: 0, lastSync: '—', modules: ['长尾场景规则'] },
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
                <span className="text-[13px] font-semibold text-[#0F172A]">数据源配置</span>
                <span className="text-[11px] text-[#94A3B8]">数据接入、字段映射、同步调度与质量监控</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 text-[#64748B] border-[#E2E8F0]"><AlertTriangle size={10} />异常告警</Button>
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 text-[#2563EB] border-[#BFDBFE]"><RefreshCw size={10} />连通性测试</Button>
                <Button size="sm" className="h-7 text-[10px] gap-1 bg-[#2563EB] hover:bg-[#1D4ED8] text-white"><Plus size={10} />新增数据源</Button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <MetricCard label="已接入数据源" value={`${DATA_SOURCES.filter(d => d.status === 'connected').length} 个`} detail="运行正常" tone="green" />
              <MetricCard label="配额不足" value={`${DATA_SOURCES.filter(d => d.status === 'quota_low').length} 个`} detail="需扩容或续购" tone="amber" />
              <MetricCard label="未采购" value={`${DATA_SOURCES.filter(d => d.status === 'not_purchased').length} 个`} detail="影响部分规则" tone="red" />
              <MetricCard label="本月调用量" value="14,332 次" detail="较上月 +8%" tone="blue" />
            </div>

            <div className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden">
              <div className="grid grid-cols-[1fr_50px_120px_80px_100px_70px_70px_60px_60px] gap-0 px-4 py-2.5 border-b border-[#E2E8F0] bg-[#F8FAFC] text-[10px] font-medium text-[#94A3B8] uppercase tracking-wider">
                <div>数据源</div><div>类型</div><div>供应商</div><div>认证方式</div><div>状态</div><div>配额</div><div>已用</div><div>质量</div><div>操作</div>
              </div>
              {DATA_SOURCES.map(ds => {
                const sc = dsStatusConfig[ds.status];
                const qualityColor = ds.quality >= 95 ? 'text-[#047857]' : ds.quality >= 85 ? 'text-[#2563EB]' : ds.quality > 0 ? 'text-[#C2410C]' : 'text-[#94A3B8]';
                return (
                  <div key={ds.id} className={cn('grid grid-cols-[1fr_50px_120px_80px_100px_70px_70px_60px_60px] gap-0 px-4 py-3 border-b border-[#F1F5F9] last:border-b-0 items-center transition-colors', ds.status === 'not_purchased' ? 'bg-[#FEF2F2]/30' : 'hover:bg-[#FAFBFF]')}>
                    <div>
                      <div className="text-[12px] font-medium text-[#0F172A]">{ds.name}</div>
                      <div className="text-[10px] text-[#94A3B8]">{ds.updateFreq} · {ds.lastSync !== '—' ? `同步 ${ds.lastSync.split(' ')[1]}` : '—'}</div>
                    </div>
                    <Badge className={cn('text-[9px] border w-fit', ds.type === 'API' ? 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]' : ds.type === '数据库' ? 'bg-[#F5F3FF] text-[#7C3AED] border-[#DDD6FE]' : 'bg-[#F8FAFC] text-[#64748B] border-[#E2E8F0]')}>{ds.type}</Badge>
                    <div className="text-[10px] text-[#64748B]">{ds.provider}</div>
                    <div className="text-[10px] text-[#64748B]">{ds.auth}</div>
                    <div className={cn('text-[10px] font-medium', sc.text)}>{sc.label}</div>
                    <div className="text-[10px] text-[#334155] font-mono">{ds.quota}</div>
                    <div className="text-[10px] text-[#334155] font-mono">{ds.used}</div>
                    <div className={cn('text-[11px] font-semibold', qualityColor)}>{ds.quality > 0 ? `${ds.quality}%` : '—'}</div>
                    <div>
                      {ds.status === 'connected' && <Button variant="ghost" size="sm" className="h-6 text-[9px] px-1.5 text-[#64748B]"><Eye size={9} /></Button>}
                      {ds.status === 'quota_low' && <Button variant="outline" size="sm" className="h-6 text-[9px] px-1.5 text-[#C2410C] border-[#FED7AA]">扩容</Button>}
                      {ds.status === 'not_purchased' && <Button variant="outline" size="sm" className="h-6 text-[9px] px-1.5 text-[#DC2626] border-[#FCA5A5]">申请</Button>}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Field Mapping & Quality Monitoring */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Field Mapping */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 space-y-3">
                <div className="text-[12px] font-semibold text-[#0F172A] flex items-center gap-2"><Layers size={13} className="text-[#2563EB]" /> 字段映射配置</div>
                <div className="rounded-lg border border-[#BFDBFE] bg-[#EFF6FF] px-3 py-2.5 text-[11px] text-[#2563EB] flex items-center gap-2">
                  <Sparkles size={12} className="shrink-0" />
                  字段映射确保外部数据源字段与系统内部模型对齐，避免数据丢失或错误解析。
                </div>
                <div className="space-y-1.5">
                  {[
                    { source: '企业名称', target: 'companyName', ds: '工商注册信息', status: '已映射' },
                    { source: '统一社会信用代码', target: 'creditCode', ds: '工商注册信息', status: '已映射' },
                    { source: '发票金额', target: 'invoiceAmount', ds: '税务发票数据', status: '已映射' },
                    { source: '运单编号', target: 'waybillNo', ds: '物流运单数据', status: '已映射' },
                    { source: '诉讼金额', target: 'litigationAmount', ds: '司法诉讼信息', status: '待确认' },
                  ].map(f => (
                    <div key={f.source} className="flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2">
                      <span className="text-[11px] text-[#334155] w-28 shrink-0">{f.source}</span>
                      <ArrowRight size={10} className="text-[#CBD5E1] shrink-0" />
                      <span className="text-[10px] text-[#2563EB] font-mono">{f.target}</span>
                      <div className="flex-1" />
                      <span className="text-[9px] text-[#94A3B8]">{f.ds}</span>
                      <Badge className={cn('text-[9px] border', f.status === '已映射' ? 'bg-[#ECFDF3] text-[#047857] border-[#A7F3D0]' : 'bg-[#FFF7ED] text-[#C2410C] border-[#FED7AA]')}>{f.status}</Badge>
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" className="h-7 text-[10px] gap-1 w-full text-[#2563EB] border-[#BFDBFE]"><Settings size={10} />映射配置</Button>
              </div>

              {/* Data Quality Monitoring */}
              <div className="rounded-lg border border-[#E2E8F0] bg-white p-4 space-y-3">
                <div className="text-[12px] font-semibold text-[#0F172A] flex items-center gap-2"><Activity size={13} className="text-[#047857]" /> 数据质量监控</div>
                <div className="space-y-2">
                  {DATA_SOURCES.filter(d => d.quality > 0).map(ds => (
                    <div key={ds.id} className="flex items-center gap-3">
                      <span className="text-[11px] text-[#334155] w-28 shrink-0">{ds.name}</span>
                      <div className="flex-1 h-2 rounded-full bg-[#F1F5F9] overflow-hidden">
                        <div className={cn('h-full rounded-full', ds.quality >= 95 ? 'bg-[#047857]' : ds.quality >= 85 ? 'bg-[#2563EB]' : 'bg-[#C2410C]')} style={{ width: `${ds.quality}%` }} />
                      </div>
                      <span className={cn('text-[10px] font-semibold w-10 text-right', ds.quality >= 95 ? 'text-[#047857]' : ds.quality >= 85 ? 'text-[#2563EB]' : 'text-[#C2410C]')}>{ds.quality}%</span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-[#F1F5F9] pt-2 space-y-1.5">
                  <div className="text-[10px] text-[#94A3B8]">质量评分维度: 完整性 · 准确性 · 时效性 · 一致性</div>
                  {DATA_SOURCES.filter(d => d.quality > 0 && d.quality < 90).length > 0 && (
                    <div className="rounded-lg bg-[#FFF7ED] border border-[#FED7AA] px-3 py-2 text-[10px] text-[#C2410C]">
                      <AlertTriangle size={10} className="inline mr-1" />
                      {DATA_SOURCES.filter(d => d.quality > 0 && d.quality < 90).map(d => d.name).join('、')} 质量评分低于 90%，建议检查数据源配置。
                    </div>
                  )}
                </div>

                {/* Sync Schedule */}
                <div className="border-t border-[#F1F5F9] pt-3">
                  <div className="text-[11px] font-medium text-[#0F172A] mb-2">同步调度</div>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: '实时同步', value: `${DATA_SOURCES.filter(d => d.updateFreq === '实时').length} 个`, desc: '工商、司法、征信、舆情' },
                      { label: 'T+1 批量', value: `${DATA_SOURCES.filter(d => d.updateFreq === 'T+1').length} 个`, desc: '税务、物流' },
                    ].map(s => (
                      <div key={s.label} className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2">
                        <div className="text-[10px] text-[#94A3B8]">{s.label}</div>
                        <div className="text-[12px] font-semibold text-[#0F172A]">{s.value}</div>
                        <div className="text-[9px] text-[#94A3B8]">{s.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
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
