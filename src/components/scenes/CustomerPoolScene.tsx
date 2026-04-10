import React, { useState, useRef, useEffect } from 'react';
import SceneLayout from '../SceneLayout';
import { SCENES } from '../../constants';
import {
  ArrowLeft,
  ArrowRightLeft,
  Bot,
  Briefcase,
  Building2,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  CircleDot,
  ClipboardPaste,
  Download,
  Eye,
  FileSearch,
  FileSpreadsheet,
  FileText,
  Filter,
  Link2,
  MapPin,
  MessageSquare,
  MoreHorizontal,
  Network,
  Phone,
  Plus,
  Search,
  ShieldCheck,
  Sparkles,
  SlidersHorizontal,
  Upload,
  Users,
  UserPlus,
  Wallet,
  X,
  TrendingUp,
  TrendingDown,
  Zap,
  Clock,
  Camera,
  FileImage,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Smartphone,
  ArrowRight,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useDemo } from '../../demo/DemoContext';
import { SceneHero, ActionBar } from '../../demo/DemoComponents';
import { SAMPLES, type ChainLoanSample } from '../../demo/chainLoan/data';
import { SampleSwitcher, SelectedSampleSummary, AiJudgmentBlock } from '../ProductPrimitives';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';

/* ══════════════════════════════════════════════════════════════════
   Types & Data
   ══════════════════════════════════════════════════════════════════ */

type SourceType = 'system' | 'filter' | 'field';
type StageType = 'identified' | 'pre_credit' | 'manual_review' | 'approved' | 'vetoed';
type Urgency = 'hot' | 'warm' | 'cold';

type HitFeatureType = 'tag' | 'graph' | 'model';
interface HitFeature { type: HitFeatureType; label: string }

interface CandidateRow {
  id: string;
  shortName: string;
  fullName: string;
  sources: { type: SourceType; label: string }[];
  matchReason: string;
  stage: StageType;
  bizScore: number;
  personScore: number;
  updatedAgo: string;
  locked: boolean;
  lockReason?: string;
  sampleId?: string;
  stageUpgraded?: boolean;
  stageUpgradeFrom?: string;
  hitFeatures?: HitFeature[];
}

const HIT_FEATURE_STYLE: Record<HitFeatureType, { bg: string; text: string; border: string; prefix: string }> = {
  tag: { bg: 'bg-[#EFF6FF]', text: 'text-[#2563EB]', border: 'border-[#BFDBFE]', prefix: '标签命中' },
  graph: { bg: 'bg-[#F0FDF4]', text: 'text-[#16A34A]', border: 'border-[#A7F3D0]', prefix: '图谱命中' },
  model: { bg: 'bg-[#FFF7ED]', text: 'text-[#C2410C]', border: 'border-[#FED7AA]', prefix: '模型命中' },
};

const STAGE_STYLES: Record<StageType, { label: string; border: string; bg: string; text: string; icon?: string }> = {
  identified: { label: '已识别', border: '#A9AEB8', bg: '#F2F3F5', text: '#646A73' },
  pre_credit: { label: '预授信', border: '#1677FF', bg: '#E8F3FF', text: '#1677FF' },
  manual_review: { label: '补审', border: '#722ED1', bg: '#F3E8FF', text: '#722ED1' },
  approved: { label: '已批准', border: '#00B42A', bg: '#E8FFEA', text: '#00B42A' },
  vetoed: { label: '一票否决', border: '#F53F3F', bg: '#FFECE8', text: '#F53F3F', icon: '❌' },
};

const SOURCE_ICON: Record<SourceType, React.ReactNode> = {
  system: <Bot size={10} />,
  filter: <Search size={10} />,
  field: <UserPlus size={10} />,
};

const CANDIDATES: CandidateRow[] = [
  { id: 'c1', shortName: '衡远包装', fullName: '常州衡远包装材料有限公司', sources: [{ type: 'system', label: '系统推荐' }, { type: 'field', label: '跑楼补全' }], matchReason: '代发稳定 + 法人身份已补全，公私交叉验证通过', stage: 'approved', bizScore: 5, personScore: 5, updatedAgo: '10分钟前', locked: false, sampleId: 'sample-hengyuan', stageUpgraded: true, stageUpgradeFrom: '预授信', hitFeatures: [{ type: 'tag', label: '高新制造' }, { type: 'graph', label: '宁川新能源二级供应商' }, { type: 'model', label: '预授信通过' }] },
  { id: 'c2', shortName: '佳利包装', fullName: '溧阳佳利包装材料有限公司', sources: [{ type: 'system', label: '系统推荐' }], matchReason: '经营流水波动偏大，物流佐证不完整', stage: 'identified', bizScore: 3, personScore: 1, updatedAgo: '1小时前', locked: false, sampleId: 'sample-jiali', hitFeatures: [{ type: 'graph', label: '宁川新能源疑似三级供应商' }] },
  { id: 'c3', shortName: '驰远物流', fullName: '无锡驰远物流服务有限公司', sources: [{ type: 'field', label: '跑楼录入' }], matchReason: '运单频次高，缺法人征信', stage: 'identified', bizScore: 3, personScore: 0, updatedAgo: '昨天', locked: true, lockReason: '法人征信未校验，无法自动推进', sampleId: 'sample-chiyuan', hitFeatures: [{ type: 'graph', label: '链上物流服务节点' }, { type: 'tag', label: '高频运单' }] },
  { id: 'c4', shortName: '锐信新材', fullName: '苏州锐信新材料有限公司', sources: [{ type: 'filter', label: '储能摸排' }], matchReason: '注资 500 万 + 成立 5 年，集中度偏高', stage: 'pre_credit', bizScore: 4, personScore: 1, updatedAgo: '1小时前', locked: false, sampleId: 'sample-ruixin', hitFeatures: [{ type: 'tag', label: '新材料制造' }, { type: 'graph', label: '宁川新能源二级辅料供应商' }, { type: 'model', label: '预授信通过（集中度预警）' }] },
  { id: 'c5', shortName: '瑞丰辅料', fullName: '昆山瑞丰辅料有限公司', sources: [{ type: 'system', label: '系统推荐' }], matchReason: '近期回款恶化，物流延迟', stage: 'pre_credit', bizScore: 4, personScore: 4, updatedAgo: '2小时前', locked: false, sampleId: 'sample-ruifeng', hitFeatures: [{ type: 'tag', label: '辅料制造' }, { type: 'graph', label: '宁川新能源三级供应商' }, { type: 'model', label: '风险预警中' }] },
  { id: 'c6', shortName: '盛拓模组', fullName: '盛拓模组科技有限公司', sources: [{ type: 'system', label: '系统推荐' }, { type: 'filter', label: '新能源方案' }], matchReason: '二级供应商，桥接节点角色', stage: 'pre_credit', bizScore: 5, personScore: 3, updatedAgo: '3小时前', locked: false, stageUpgraded: true, stageUpgradeFrom: '已识别', hitFeatures: [{ type: 'graph', label: '桥接节点·核心企业直接供应商' }, { type: 'tag', label: '新能源模组' }] },
  { id: 'c7', shortName: '金利达新材', fullName: '金利达新材料有限公司', sources: [{ type: 'field', label: '跑楼录入' }], matchReason: '上游原材料供应商，交易关系稳定', stage: 'identified', bizScore: 4, personScore: 2, updatedAgo: '昨天', locked: false, hitFeatures: [{ type: 'tag', label: '原材料供应' }] },
  { id: 'c8', shortName: '常州永信化工', fullName: '常州永信化工有限公司', sources: [{ type: 'filter', label: '化工摸排' }], matchReason: '胶水辅料供应商，交易笔数较少', stage: 'identified', bizScore: 2, personScore: 0, updatedAgo: '2天前', locked: true, lockReason: '法人征信未校验，无法自动推进', hitFeatures: [{ type: 'tag', label: '化工辅料' }] },
  { id: 'c9', shortName: '某某新能源电子', fullName: '某某储能电子有限公司', sources: [{ type: 'filter', label: '储能摸排' }], matchReason: '注资 500 万 + 5 年，法人为新户', stage: 'pre_credit', bizScore: 4, personScore: 1, updatedAgo: '1小时前', locked: false, hitFeatures: [{ type: 'tag', label: '储能电子' }, { type: 'model', label: '预授信通过' }] },
  { id: 'c10', shortName: '某某农业发展', fullName: '某某农业发展有限公司', sources: [{ type: 'field', label: '跑楼录入' }], matchReason: '征信查询结果异常，存在逾期', stage: 'vetoed', bizScore: 2, personScore: 0, updatedAgo: '今天', locked: true, lockReason: '征信逾期，一票否决', hitFeatures: [{ type: 'tag', label: '涉农经营' }] },
  { id: 'c11', shortName: '科陆储能', fullName: '深圳科陆储能技术有限公司', sources: [{ type: 'system', label: '系统推荐' }, { type: 'filter', label: '新能源方案' }], matchReason: '二级供应商，桥接节点角色，多源融合，行业特征匹配', stage: 'pre_credit', bizScore: 5, personScore: 4, updatedAgo: '3小时前', locked: false, stageUpgraded: true, stageUpgradeFrom: '已识别', hitFeatures: [{ type: 'tag', label: '储能技术' }, { type: 'graph', label: '核心企业二级供应商' }, { type: 'model', label: '多源融合高置信' }] },
  { id: 'c12', shortName: '顺丰达物流', fullName: '深圳顺丰达物流有限公司', sources: [{ type: 'field', label: '外勤录入' }], matchReason: '缺失法人身份证，无法解锁公私联动验证', stage: 'identified', bizScore: 2, personScore: 0, updatedAgo: '1天前', locked: true, lockReason: '法人身份信息缺失，无法解锁公私联动验证', hitFeatures: [{ type: 'tag', label: '物流服务' }] },
  { id: 'c13', shortName: '王子包装', fullName: '东莞王子包装印刷厂', sources: [{ type: 'system', label: '系统推荐' }, { type: 'field', label: '跑楼补全' }], matchReason: '代发稳定 + 法人身份已补全，公私交叉验证通过', stage: 'approved', bizScore: 5, personScore: 5, updatedAgo: '10分钟前', locked: false, stageUpgraded: true, stageUpgradeFrom: '预授信', hitFeatures: [{ type: 'tag', label: '包装印刷' }, { type: 'graph', label: '核心企业三级供应商' }, { type: 'model', label: '预授信通过' }] },
  { id: 'c14', shortName: '佛山盛拓模组', fullName: '佛山盛拓模组有限公司', sources: [{ type: 'system', label: '系统推荐' }, { type: 'system', label: '代发异常' }], matchReason: '代发工资人数激增 30%，但近月对公流水骤降，异动矛盾需人工核实', stage: 'manual_review', bizScore: 4, personScore: 3, updatedAgo: '6小时前', locked: false, hitFeatures: [{ type: 'tag', label: '新能源模组' }, { type: 'model', label: '异动矛盾·需人工核实' }] },
];

/* ── Feed data ── */

interface FeedItem {
  id: string;
  shortName: string;
  fullName: string;
  urgency: Urgency;
  timestamp: string;
  anomalySummary: string;
  featureTags: string[];
  bizScore: number;
  personScore: number;
  stage: StageType;
  sampleId?: string;
  stageUpgraded?: boolean;
  stageUpgradeFrom?: string;
}

const FEED_ITEMS: FeedItem[] = [
  { id: 'f1', shortName: '衡远包装', fullName: '常州衡远包装材料有限公司', urgency: 'hot', timestamp: '42分钟前', anomalySummary: '外勤补全法人身份证后，公私联动评分从 62 跃升至 85，三流匹配度 92%，阶段自动提升', featureTags: ['代发稳定', '公私联动通过', '三流匹配高'], bizScore: 5, personScore: 5, stage: 'approved', sampleId: 'sample-hengyuan', stageUpgraded: true, stageUpgradeFrom: '预授信' },
  { id: 'f2', shortName: '瑞丰辅料', fullName: '昆山瑞丰辅料有限公司', urgency: 'hot', timestamp: '1.5小时前', anomalySummary: '近 2 月对公余额骤降 42%，疑似垫资行为。物流签收延迟 3 笔，回款周期拉长至 49 天', featureTags: ['流水异动', '物流延迟', '回款恶化'], bizScore: 4, personScore: 4, stage: 'pre_credit', sampleId: 'sample-ruifeng' },
  { id: 'f3', shortName: '锐信新材', fullName: '苏州锐信新材料有限公司', urgency: 'warm', timestamp: '3小时前', anomalySummary: '客户集中度达 62%，超过标准阈值 55%。建议额度由 150 万下调至 110 万，进入观察', featureTags: ['集中度偏高', '建议降额', '储能链'], bizScore: 4, personScore: 1, stage: 'pre_credit', sampleId: 'sample-ruixin' },
  { id: 'f4', shortName: '盛拓模组', fullName: '盛拓模组科技有限公司', urgency: 'warm', timestamp: '5小时前', anomalySummary: '桥接节点识别完成：上游宁川新能源，下游衡远包装等 3 家。交易笔数 48，关系强度 92', featureTags: ['桥接节点', '关系强度高', '新能源链'], bizScore: 5, personScore: 3, stage: 'pre_credit', stageUpgraded: true, stageUpgradeFrom: '已识别' },
  { id: 'f5', shortName: '佳利包装', fullName: '溧阳佳利包装材料有限公司', urgency: 'warm', timestamp: '6小时前', anomalySummary: '存在链路线索但经营实质证据不足：运单不连续、流水波动偏大。建议保留观察', featureTags: ['证据不足', '物流不连续', '待观察'], bizScore: 3, personScore: 1, stage: 'identified', sampleId: 'sample-jiali' },
  { id: 'f6', shortName: '驰远物流', fullName: '无锡驰远物流服务有限公司', urgency: 'cold', timestamp: '1天前', anomalySummary: '运单频次高达月均 61 笔，但缺失法人征信。产品需差异化匹配运费贷', featureTags: ['运单频次高', '缺法人征信', '适配运费贷'], bizScore: 3, personScore: 0, stage: 'identified', sampleId: 'sample-chiyuan' },
  { id: 'f7', shortName: '常州永信化工', fullName: '常州永信化工有限公司', urgency: 'cold', timestamp: '2天前', anomalySummary: '胶水辅料供应商，交易笔数仅 15，金额 89 万。关系强度 76，达到门槛但偏低', featureTags: ['交易偏少', '辅料供应商'], bizScore: 2, personScore: 0, stage: 'identified' },
  { id: 'f8', shortName: '某某储能电子', fullName: '某某储能电子有限公司', urgency: 'cold', timestamp: '3天前', anomalySummary: '储能方案摸排命中：注资 500 万 + 成立 5 年，法人为新户，个人维度待补', featureTags: ['储能方案', '法人新户', '待补全'], bizScore: 4, personScore: 1, stage: 'pre_credit' },
  { id: 'f9', shortName: '王子包装', fullName: '东莞王子包装印刷厂', urgency: 'hot', timestamp: '10分钟前', anomalySummary: '外勤补全法人身份证后，公私联动评分跃升，代发工资连续 18 个月、42 人，三流匹配度 94%，阶段自动提升至已批准', featureTags: ['代发稳定', '公私联动通过', '三流匹配高', '融合提升'], bizScore: 5, personScore: 5, stage: 'approved', stageUpgraded: true, stageUpgradeFrom: '预授信' },
  { id: 'f10', shortName: '佛山盛拓模组', fullName: '佛山盛拓模组有限公司', urgency: 'hot', timestamp: '6小时前', anomalySummary: '代发工资人数激增 30%（28→36 人），但近月对公流水骤降 41%，异动信号矛盾。疑似业务扩张与资金回笼脱节，需人工核实经营真实性', featureTags: ['代发异常', '流水骤降', '异动矛盾', '需人工核实'], bizScore: 4, personScore: 3, stage: 'manual_review' },
  { id: 'f11', shortName: '科陆储能', fullName: '深圳科陆储能技术有限公司', urgency: 'warm', timestamp: '3小时前', anomalySummary: '多源融合识别完成：系统推荐 + 新能源方案摸排双重命中。行业特征匹配度高，处于二级供应商桥接位置，交易笔数 35，关系强度 88', featureTags: ['多源融合', '桥接节点', '行业匹配', '新能源链'], bizScore: 5, personScore: 4, stage: 'pre_credit', stageUpgraded: true, stageUpgradeFrom: '已识别' },
  { id: 'f12', shortName: '顺丰达物流', fullName: '深圳顺丰达物流有限公司', urgency: 'cold', timestamp: '1天前', anomalySummary: '外勤录入基本工商信息，但法人身份证缺失导致无法解锁公私联动验证。运单频次中等，阶段锁死在"已识别"', featureTags: ['外勤录入', '信息不完整', '阶段锁死', '缺法人身份'], bizScore: 2, personScore: 0, stage: 'identified' },
];

const URGENCY_STYLES: Record<Urgency, { borderColor: string; label: string; dotColor: string; opacity: string }> = {
  hot:  { borderColor: '#F53F3F', label: '紧急', dotColor: 'bg-[#F53F3F]', opacity: 'opacity-100' },
  warm: { borderColor: '#FF7D00', label: '关注', dotColor: 'bg-[#FF7D00]', opacity: 'opacity-100' },
  cold: { borderColor: '#E5E6EB', label: '',      dotColor: 'bg-[#C9CDD4]', opacity: 'opacity-60' },
};

/* ══════════════════════════════════════════════════════════════════
   Micro-Components
   ══════════════════════════════════════════════════════════════════ */

function ConfidenceDots({ score, label, showHint }: { score: number; label: string; showHint?: boolean }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-[10px] text-[#646A73] w-3 shrink-0">{label}</span>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className={cn('w-[6px] h-[6px] rounded-full border', i <= score ? 'bg-[#00B42A] border-[#00B42A]' : 'bg-white border-[#E5E6EB]')} />
        ))}
      </div>
      {showHint && score === 0 && (
        <span className="text-[8px] text-[#FF7D00] ml-1">补充法人信息可解锁</span>
      )}
    </div>
  );
}

function StageBadge({ stage }: { stage: StageType }) {
  const s = STAGE_STYLES[stage];
  return (
    <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded" style={{ borderLeft: `3px solid ${s.border}`, background: s.bg, color: s.text }}>
      {s.icon && <span className="text-[9px]">{s.icon}</span>}{s.label}
    </span>
  );
}

function StageUpgradeBadge({ from, to }: { from: string; to: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{ background: 'linear-gradient(135deg, #FFF7E8 0%, #FFFBE8 100%)', border: '1px solid #FFD700', color: '#B8860B' }}>
      <Sparkles size={9} />阶段提升：{from}→{to}
    </span>
  );
}

const SourceTag: React.FC<{ type: SourceType; label: string }> = ({ type, label }) => {
  return (
    <span className="inline-flex items-center gap-1 text-[11px] px-1.5 py-0.5 rounded" style={{ background: '#E8F3FF', color: '#1677FF' }}>
      {SOURCE_ICON[type]}{label}
    </span>
  );
};

/* ══════════════════════════════════════════════════════════════════
   Smart Feed Flow (P1 improvement #1 + #4)
   ══════════════════════════════════════════════════════════════════ */

function SmartFeedFlow() {
  const [query, setQuery] = useState('');
  const [parsedEntities, setParsedEntities] = useState<string[]>([]);
  const { selectSample, navigate } = useDemo();

  const handleQuery = () => {
    if (!query.trim()) { setParsedEntities([]); return; }
    const entities: string[] = [];
    if (query.includes('比亚迪')) entities.push('比亚迪');
    if (query.includes('宁川') || query.includes('新能源')) entities.push('宁川新能源');
    if (query.includes('储能')) entities.push('储能');
    if (query.includes('开票')) entities.push('近3月开票增加');
    if (query.includes('代发')) entities.push('代发异常');
    if (query.includes('流水')) entities.push('流水异动');
    if (entities.length === 0) entities.push(query.trim());
    setParsedEntities(entities);
  };

  return (
    <div className="space-y-4">
      {/* Natural language query bar */}
      <div className="rounded-xl border border-[#E5E6EB] bg-white p-4 space-y-3">
        <div className="flex items-center gap-2">
          <MessageSquare size={14} className="text-[#1677FF]" />
          <span className="text-[13px] font-semibold text-[#1D2129]">智能提问</span>
          <span className="text-[10px] text-[#86909C]">用自然语言描述你要找的企业特征</span>
        </div>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#C9CDD4]" size={14} />
            <Input
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleQuery()}
              placeholder="例如：找近三月给比亚迪开票增加的企业"
              className="pl-9 h-9 text-[12px] bg-[#F7F8FA] border-[#E5E6EB] focus:bg-white"
            />
          </div>
          <Button size="sm" className="h-9 bg-[#1677FF] hover:bg-[#0E5FC2] text-[12px] gap-1" onClick={handleQuery}>
            <Zap size={12} />解析查询
          </Button>
        </div>
        {parsedEntities.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-[#86909C]">识别实体:</span>
            {parsedEntities.map(e => (
              <Badge key={e} className="text-[10px] bg-[#E8F3FF] text-[#1677FF] border-[#BEDAFF]">[{e}]</Badge>
            ))}
            <button className="text-[10px] text-[#86909C] hover:text-[#4E5969]" onClick={() => { setQuery(''); setParsedEntities([]); }}>清除</button>
          </div>
        )}
        <div className="flex gap-2 flex-wrap">
          {['近三月流水异动企业', '代发异常 + 储能链', '有开票无回款', '缺法人身份的高置信度企业'].map(suggestion => (
            <button key={suggestion} onClick={() => { setQuery(suggestion); }} className="text-[10px] px-2 py-1 rounded-full border border-[#E5E6EB] text-[#86909C] hover:border-[#1677FF] hover:text-[#1677FF] transition-colors">
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Feed timeline */}
      <div className="relative">
        <div className="absolute left-[19px] top-0 bottom-0 w-px bg-[#E5E6EB]" />
        <div className="space-y-3">
          {FEED_ITEMS.map(item => {
            const urgStyle = URGENCY_STYLES[item.urgency];
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn('relative pl-10', urgStyle.opacity)}
              >
                {/* Timeline dot */}
                <div className={cn('absolute left-3 top-4 w-3 h-3 rounded-full border-2 border-white shadow-sm', urgStyle.dotColor)} />

                {/* Card */}
                <div
                  className={cn(
                    'rounded-xl border bg-white p-4 transition-all hover:shadow-md cursor-pointer',
                    item.urgency === 'hot' ? 'border-[#F53F3F]/40 shadow-sm' : item.urgency === 'warm' ? 'border-[#FF7D00]/30' : 'border-[#E5E6EB]',
                  )}
                  style={item.urgency === 'hot' ? { borderLeftWidth: 3, borderLeftColor: '#F53F3F' } : item.urgency === 'warm' ? { borderLeftWidth: 3, borderLeftColor: '#FF7D00' } : undefined}
                  onClick={() => item.sampleId && selectSample(item.sampleId)}
                >
                  {/* Header */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-semibold text-[#1D2129]">{item.shortName}</span>
                      <StageBadge stage={item.stage} />
                      {item.stageUpgraded && item.stageUpgradeFrom && (
                        <StageUpgradeBadge from={item.stageUpgradeFrom} to={STAGE_STYLES[item.stage].label} />
                      )}
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={cn('text-[10px]', item.urgency === 'hot' ? 'text-[#F53F3F] font-semibold' : item.urgency === 'warm' ? 'text-[#FF7D00]' : 'text-[#C9CDD4]')}>
                        <Clock size={9} className="inline mr-0.5" />{item.timestamp}
                      </span>
                      {urgStyle.label && (
                        <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: urgStyle.borderColor + '15', color: urgStyle.borderColor }}>{urgStyle.label}</span>
                      )}
                    </div>
                  </div>

                  {/* Anomaly summary */}
                  <p className="text-[12px] text-[#4E5969] leading-5 mb-2.5">{item.anomalySummary}</p>

                  {/* Feature tags */}
                  <div className="flex items-center gap-1.5 flex-wrap mb-3">
                    {item.featureTags.map(tag => (
                      <span key={tag} className={cn(
                        'text-[10px] px-1.5 py-0.5 rounded',
                        tag.includes('异动') || tag.includes('恶化') || tag.includes('延迟') || tag.includes('偏高')
                          ? 'bg-[#FFECE8] text-[#F53F3F] border border-[#FFCCC7]'
                          : tag.includes('通过') || tag.includes('匹配高') || tag.includes('稳定') || tag.includes('强度高')
                            ? 'bg-[#E8FFEA] text-[#00B42A] border border-[#AFF0B5]'
                            : 'bg-[#F2F3F5] text-[#646A73] border border-[#E5E6EB]',
                      )}>{tag}</span>
                    ))}
                  </div>

                  {/* Bottom: confidence + actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <ConfidenceDots score={item.bizScore} label="企" />
                      <ConfidenceDots score={item.personScore} label="人" showHint />
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2 text-[#7C3AED] hover:bg-[#F3E8FF] gap-1" onClick={e => { e.stopPropagation(); navigate('partner-management', 'due-diligence'); }}>
                        <FileSearch size={9} />一键尽调
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2 text-[#86909C] gap-1">
                        <Eye size={9} />详情
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2 text-[#86909C] gap-1 md:hidden">
                        <Phone size={9} />拨打
                      </Button>
                      <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2 text-[#86909C] gap-1 md:hidden">
                        <MapPin size={9} />导航
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   P2: Advanced Filter Drawer
   ══════════════════════════════════════════════════════════════════ */

function FilterDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [tags, setTags] = useState<string[]>(['行业:储能', '注册资本:≥500万']);
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.3 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black z-40" onClick={onClose} />
          <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', damping: 26, stiffness: 200 }} className="fixed right-0 top-0 h-full w-[480px] bg-white z-50 shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E6EB]">
              <span className="text-[14px] font-semibold text-[#1D2129]">条件筛选</span>
              <button onClick={onClose}><X size={16} className="text-[#86909C]" /></button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
              {tags.length > 0 && (
                <div>
                  <div className="text-[11px] text-[#86909C] mb-2">已选条件</div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(t => (
                      <span key={t} className="inline-flex items-center gap-1 text-[12px] bg-[#E8F3FF] text-[#1677FF] rounded px-2 py-1">
                        {t}<button onClick={() => setTags(prev => prev.filter(x => x !== t))}><X size={10} /></button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <div className="text-[12px] font-semibold text-[#1D2129] mb-3">基础属性</div>
                <div className="space-y-3">
                  {[
                    { label: '所属行业', options: ['请选择行业', '新能源', '储能', '包装材料', '物流'] },
                    { label: '成立年限', options: ['全部', '≥ 3 年', '≥ 5 年', '≥ 10 年'] },
                    { label: '注册资本', options: ['全部', '≥ 100 万', '≥ 500 万', '≥ 1000 万'] },
                  ].map(f => (
                    <div key={f.label} className="flex items-center gap-3">
                      <span className="text-[12px] text-[#4E5969] w-20 shrink-0">{f.label}</span>
                      <select className="flex-1 h-8 rounded border border-[#E5E6EB] px-2 text-[12px] text-[#1D2129] bg-white">{f.options.map(o => <option key={o}>{o}</option>)}</select>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <div className="text-[12px] font-semibold text-[#1D2129] mb-3">增信属性</div>
                <div className="space-y-3">
                  {[
                    { label: '本行关系', options: ['全部', '代发工资客户', '按揭客户', '对公结算客户'] },
                    { label: '资质标签', options: ['全部', '专精特新', '高新技术企业', '小巨人'] },
                  ].map(f => (
                    <div key={f.label} className="flex items-center gap-3">
                      <span className="text-[12px] text-[#4E5969] w-20 shrink-0">{f.label}</span>
                      <select className="flex-1 h-8 rounded border border-[#E5E6EB] px-2 text-[12px] text-[#1D2129] bg-white">{f.options.map(o => <option key={o}>{o}</option>)}</select>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-[11px] text-[#86909C]">（可动态添加 AND/OR 条件组）</div>
            </div>
            <div className="flex items-center justify-between px-5 py-3 border-t border-[#E5E6EB]">
              <Button variant="ghost" size="sm" className="text-[12px] text-[#86909C]" onClick={() => setTags([])}>清空所有</Button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-[12px]">保存为方案</Button>
                <Button size="sm" className="text-[12px] bg-[#1677FF] hover:bg-[#0E5FC2]" onClick={onClose}>筛选</Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ══════════════════════════════════════════════════════════════════
   P3: Field Import Modal (with fusion result summary)
   ══════════════════════════════════════════════════════════════════ */

function ImportModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const preview = [
    { name: '衡远包装', idCard: '3204****1234', credit: '正常', status: 'ok' as const, fusion: '合并' },
    { name: '某某电子', idCard: '4403****567X', credit: '逾期', status: 'downgrade' as const, fusion: '新增' },
    { name: '某某农业', idCard: '3201****9012', credit: '未查', status: 'locked' as const, fusion: '新增' },
    { name: '某某贸易', idCard: '3101****345□', credit: '错误', status: 'blocked' as const, fusion: '—' },
  ];
  const statusStyle = { ok: { icon: '🟢', label: '正常' }, downgrade: { icon: '🟡', label: '降级' }, locked: { icon: '🔒', label: '锁死' }, blocked: { icon: '❌', label: '拦截' } };

  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[720px] max-h-[80vh] bg-white rounded-xl shadow-2xl z-50 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E5E6EB]">
          <span className="text-[14px] font-semibold text-[#1D2129]">导入外勤名单</span>
          <button onClick={() => { onClose(); setStep(1); }}><X size={16} className="text-[#86909C]" /></button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
          {step === 1 && (
            <div>
              <div className="text-[12px] text-[#86909C] mb-3">Step 1: 选择方式</div>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => setStep(2)} className="rounded-xl border-2 border-dashed border-[#C9CDD4] hover:border-[#1677FF] p-6 text-center transition-colors group">
                  <FileSpreadsheet size={28} className="mx-auto text-[#86909C] group-hover:text-[#1677FF] mb-2" />
                  <div className="text-[13px] font-semibold text-[#1D2129]">上传 Excel 文件</div>
                  <div className="text-[11px] text-[#86909C] mt-1">支持 xlsx，拖拽上传</div>
                  <div className="mt-3 text-[11px] text-[#1677FF] flex items-center justify-center gap-1"><Download size={10} />下载标准模板</div>
                </button>
                <button onClick={() => setStep(2)} className="rounded-xl border-2 border-dashed border-[#C9CDD4] hover:border-[#1677FF] p-6 text-center transition-colors group">
                  <ClipboardPaste size={28} className="mx-auto text-[#86909C] group-hover:text-[#1677FF] mb-2" />
                  <div className="text-[13px] font-semibold text-[#1D2129]">粘贴企业名单</div>
                  <div className="text-[11px] text-[#86909C] mt-1">每行一个名称...</div>
                </button>
              </div>
            </div>
          )}
          {step === 2 && (
            <div>
              <div className="text-[12px] text-[#86909C] mb-2">Step 2: 解析与融合预览</div>
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 size={14} className="text-[#00B42A]" />
                <span className="text-[12px] text-[#1D2129]">成功解析 <strong>18</strong> 家，发现 <strong className="text-[#F53F3F]">2</strong> 个问题</span>
              </div>
              <div className="rounded-lg border border-[#E5E6EB] overflow-hidden">
                <table className="w-full text-[12px]">
                  <thead><tr className="bg-[#F7F8FA] border-b border-[#E5E6EB]">{['企业名', '法人身份(脱敏)', '征信', '状态', '融合'].map(h => (<th key={h} className="text-left px-3 py-2 font-medium text-[#86909C]">{h}</th>))}</tr></thead>
                  <tbody>
                    {preview.map(row => {
                      const st = statusStyle[row.status];
                      return (
                        <tr key={row.name} className={cn('border-b border-[#F2F3F5] last:border-b-0', row.status === 'blocked' ? 'bg-red-50/50' : '')}>
                          <td className="px-3 py-2.5 font-medium text-[#1D2129]">{row.name}</td>
                          <td className="px-3 py-2.5 text-[#4E5969] font-mono text-[11px]">{row.idCard}</td>
                          <td className="px-3 py-2.5 text-[#4E5969]">{row.credit}</td>
                          <td className="px-3 py-2.5"><span className="text-[11px]">{st.icon} {st.label}</span></td>
                          <td className="px-3 py-2.5">
                            {row.fusion !== '—' ? (
                              <Badge className={cn('text-[10px]', row.fusion === '合并' ? 'bg-[#E8F3FF] text-[#1677FF] border-[#BEDAFF]' : 'bg-[#E8FFEA] text-[#00B42A] border-[#AFF0B5]')}>{row.fusion === '合并' ? '🔗 合并' : '🆕 新增'}</Badge>
                            ) : <span className="text-[#C9CDD4]">—</span>}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 rounded-lg bg-[#FFF7E8] border border-[#FF7D00] px-3 py-2 text-[11px] text-[#D25F00]">
                ⚠️ 第 4 行身份证校验码错误，末位应为 4。
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-[#E8FFEA] mx-auto flex items-center justify-center mb-3">
                  <CheckCircle2 size={24} className="text-[#00B42A]" />
                </div>
                <div className="text-[15px] font-semibold text-[#1D2129]">融合入库完成</div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {[
                  { label: '合并', value: '5', color: '#1677FF', bg: '#E8F3FF', icon: '🔗' },
                  { label: '新增', value: '12', color: '#00B42A', bg: '#E8FFEA', icon: '🆕' },
                  { label: '拦截', value: '1', color: '#F53F3F', bg: '#FFECE8', icon: '❌' },
                  { label: '阶段提升', value: '3', color: '#FF7D00', bg: '#FFF7E8', icon: '✨' },
                ].map(s => (
                  <div key={s.label} className="rounded-lg p-3 text-center" style={{ background: s.bg }}>
                    <div className="text-[16px]">{s.icon}</div>
                    <div className="text-[20px] font-bold mt-1" style={{ color: s.color }}>{s.value}</div>
                    <div className="text-[11px] text-[#86909C]">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="rounded-lg bg-[#FFF7E8] border border-[#FFD700] px-3 py-2 text-[11px] text-[#B8860B]">
                <Sparkles size={10} className="inline mr-1" />
                3 家企业因外勤补全信息后阶段自动提升：衡远包装（预授信→已批准）、盛拓模组（已识别→预授信）、金利达新材（已识别→预授信）
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between px-5 py-3 border-t border-[#E5E6EB]">
          {step === 2 ? (
            <>
              <Button variant="ghost" size="sm" className="text-[12px] text-[#86909C]" onClick={() => setStep(1)}>← 重新上传</Button>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-[12px]">仅导正常 (17)</Button>
                <Button size="sm" className="text-[12px] bg-[#1677FF] hover:bg-[#0E5FC2]" onClick={() => setStep(3)}>融合入库 (18)</Button>
              </div>
            </>
          ) : step === 3 ? (
            <div className="ml-auto">
              <Button size="sm" className="text-[12px] bg-[#1677FF] hover:bg-[#0E5FC2]" onClick={() => { onClose(); setStep(1); }}>完成</Button>
            </div>
          ) : (
            <div className="ml-auto">
              <Button variant="ghost" size="sm" className="text-[12px] text-[#86909C]" onClick={onClose}>取消</Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════════
   P4: Enterprise Detail View
   ══════════════════════════════════════════════════════════════════ */

function EnterpriseDetail({ candidate, onBack }: { candidate: CandidateRow; onBack: () => void }) {
  const sections = ['基础画像', '公私联动', '推算依据', 'AI判断'] as const;
  const [activeSection, setActiveSection] = useState<string>(sections[0]);
  const contentRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const isFused = candidate.sources.length > 1;

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const onScroll = () => {
      for (const sec of sections) {
        const ref = sectionRefs.current[sec];
        if (ref) {
          const rect = ref.getBoundingClientRect();
          const containerRect = el.getBoundingClientRect();
          if (rect.top >= containerRect.top - 20 && rect.top < containerRect.top + 200) { setActiveSection(sec); break; }
        }
      }
    };
    el.addEventListener('scroll', onScroll);
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (sec: string) => { sectionRefs.current[sec]?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };

  return (
    <div className="space-y-0">
      <div className="flex items-center gap-3 mb-4">
        <Button variant="ghost" size="sm" className="h-7 text-[12px] text-[#86909C] gap-1" onClick={onBack}><ArrowLeft size={12} />返回候选池</Button>
        <span className="text-[14px] font-semibold text-[#1D2129]">{candidate.fullName}</span>
        <StageBadge stage={candidate.stage} />
        {candidate.stageUpgraded && candidate.stageUpgradeFrom && (
          <StageUpgradeBadge from={candidate.stageUpgradeFrom} to={STAGE_STYLES[candidate.stage].label} />
        )}
      </div>

      {isFused && (
        <div className="rounded-lg px-4 py-2.5 mb-4" style={{ background: '#FFF7E8', border: '1px solid #FF7D00' }}>
          <span className="text-[12px] text-[#D25F00]">✨ 系统检测到今日外勤录入了法人身份信息，已完成公私交叉验证，阶段由"已识别"自动提升至"预授信"。</span>
        </div>
      )}

      <div className="flex rounded-xl border border-[#E5E6EB] overflow-hidden bg-white" style={{ minHeight: 520 }}>
        <div className="w-[180px] shrink-0 border-r border-[#F2F3F5] bg-[#FAFBFC] py-4">
          {sections.map(sec => (
            <button key={sec} onClick={() => scrollTo(sec)} className={cn('w-full text-left px-4 py-2.5 text-[12px] transition-colors', activeSection === sec ? 'bg-[#1677FF] text-white font-semibold' : 'text-[#4E5969] hover:bg-[#F2F3F5]')}>● {sec}</button>
          ))}
        </div>
        <div ref={contentRef} className="flex-1 overflow-y-auto p-6 space-y-8">
          <div ref={el => { sectionRefs.current['基础画像'] = el; }}>
            <div className="text-[13px] font-semibold text-[#1D2129] mb-3">基础画像与来源</div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] text-[#86909C]">来源:</span>
              {candidate.sources.map(s => <SourceTag key={s.label} type={s.type} label={s.label} />)}
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[{ label: '企业简称', value: candidate.shortName },{ label: '全称', value: candidate.fullName },{ label: '行业', value: '新能源包装材料' },{ label: '注册资本', value: '500 万' },{ label: '成立年限', value: '6 年' },{ label: '所在地区', value: '江苏常州' }].map(item => (
                <div key={item.label} className="text-[12px]"><span className="text-[#86909C]">{item.label}</span><div className="mt-0.5 text-[#1D2129] font-medium">{item.value}</div></div>
              ))}
            </div>
            <div className="mt-4 space-y-1.5">
              <div><span className="text-[10px] text-[#86909C] mr-2">企业置信度</span><ConfidenceDots score={candidate.bizScore} label="企" /></div>
              <div><span className="text-[10px] text-[#86909C] mr-2">法人置信度</span><ConfidenceDots score={candidate.personScore} label="人" showHint /></div>
            </div>
          </div>

          <div ref={el => { sectionRefs.current['公私联动'] = el; }}>
            <div className="text-[13px] font-semibold text-[#1D2129] mb-3">公私联动交叉验证</div>
            <div className="flex rounded-lg border border-[#E5E6EB] overflow-hidden">
              <div className="flex-1 p-4 space-y-2">
                <div className="text-[12px] font-semibold text-[#1D2129] mb-2">企业维度</div>
                {[{ l: '行业', v: '包装材料' }, { l: '营收', v: '680 万' }, { l: '对公', v: '本行结算账户' }, { l: '置信度', v: '' }].map(r => (
                  <div key={r.l} className="flex items-center justify-between text-[12px]">
                    <span className="text-[#86909C]">{r.l}</span>
                    {r.v ? <span className="text-[#1D2129]">{r.v}</span> : <ConfidenceDots score={candidate.bizScore} label="企" />}
                  </div>
                ))}
              </div>
              <div className="w-px" style={{ borderLeft: '1px dashed #E5E6EB' }} />
              <div className="flex-1 p-4 space-y-2">
                <div className="text-[12px] font-semibold text-[#1D2129] mb-2">法人维度</div>
                {[{ l: '身份', v: '34岁 男' }, { l: '籍贯', v: '江苏常州' }, { l: '本行', v: '按揭客户' }, { l: '置信度', v: '' }].map(r => (
                  <div key={r.l} className="flex items-center justify-between text-[12px]">
                    <span className="text-[#86909C]">{r.l}</span>
                    {r.v ? <span className="text-[#1D2129]">{r.v}</span> : <ConfidenceDots score={candidate.personScore} label="人" showHint />}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center gap-2 text-[12px]"><CheckCircle2 size={12} className="text-[#00B42A]" /><span className="text-[#1D2129]">籍贯与注册地一致（本地化经营）</span></div>
              <div className="flex items-center gap-2 text-[12px]"><CheckCircle2 size={12} className="text-[#00B42A]" /><span className="text-[#1D2129]">法人按揭客户（以私带公切入点）</span></div>
            </div>
          </div>

          <div ref={el => { sectionRefs.current['推算依据'] = el; }}>
            <div className="text-[13px] font-semibold text-[#1D2129] mb-3">推算依据白盒</div>
            {[
              { title: '已使用信息 (+55分)', items: [{ sign: '+', text: '代发工资连续 14 个月，27 人', color: '#00B42A' }, { sign: '+', text: '对公月均结算 58 万', color: '#00B42A' }, { sign: '+', text: '法人理财余额 42 万', color: '#00B42A' }, { sign: '+', text: '物流平台签收闭环', color: '#00B42A' }] },
              { title: '未提供信息（影响置信度）', items: [{ sign: '−', text: '未提供近期合同原件', color: '#F53F3F' }, { sign: '−', text: '缺少仓储周转数据', color: '#F53F3F' }] },
              { title: '推算链路回溯', items: [{ sign: '→', text: '对公流水 → 交易对手图谱 → 关系强度评分 → 经营足迹验证 → 综合置信度', color: '#1677FF' }] },
            ].map(section => (
              <details key={section.title} className="rounded-lg border border-[#E5E6EB] mb-2 overflow-hidden">
                <summary className="px-4 py-2.5 text-[12px] font-medium text-[#1D2129] cursor-pointer bg-[#FAFBFC] hover:bg-[#F2F3F5]">▶ {section.title}</summary>
                <div className="px-4 py-3 space-y-1.5 bg-white font-mono text-[11px]">
                  {section.items.map(item => (<div key={item.text} className="flex items-start gap-2"><span className="font-bold w-3 shrink-0" style={{ color: item.color }}>{item.sign}</span><span className="text-[#1D2129]">{item.text}</span></div>))}
                </div>
              </details>
            ))}
          </div>

          <div ref={el => { sectionRefs.current['AI判断'] = el; }}>
            <div className="text-[13px] font-semibold text-[#1D2129] mb-3">AI 判断与下一步</div>
            <div className="rounded-lg border border-[#1677FF] bg-[#E8F3FF] p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-[#1677FF] text-white text-[10px]">预授信</Badge>
                <span className="text-[12px] text-[#1D2129]">经营状态稳定，具备基础准入条件</span>
              </div>
              <p className="text-[11px] text-[#4E5969] leading-5 mb-3">订单、物流、回款三流匹配度高，代发工资与社保连续，公私联动评分 85，综合置信度 92%。建议进入产品匹配阶段。</p>
              <Button size="sm" className="bg-[#1677FF] hover:bg-[#0E5FC2] text-[12px] gap-1"><ArrowRightLeft size={12} />进入产品匹配</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Existing: Relation Graph (preserved, abbreviated for readability)
   ══════════════════════════════════════════════════════════════════ */

interface CounterpartyNode { id: string; name: string; direction: 'upstream' | 'downstream' | 'service'; txCount: number; txAmount: string; months: number; cycleDays: string; concentration: string; keywords: string[]; status: 'stable' | 'attention' | 'new'; relationStrength: number; evidenceSources: string[]; isMainChain: boolean; }

const COUNTERPARTY_NODES: CounterpartyNode[] = [
  { id: 'cp-1', name: '盛拓模组科技', direction: 'downstream', txCount: 48, txAmount: '386万', months: 14, cycleDays: '30-35天', concentration: '42%', keywords: ['包装箱', '材料款', '周转箱'], status: 'stable', relationStrength: 92, evidenceSources: ['对公流水', '增值税发票', '物流签收'], isMainChain: true },
  { id: 'cp-2', name: '金利达新材料', direction: 'upstream', txCount: 22, txAmount: '156万', months: 11, cycleDays: '15-20天', concentration: '28%', keywords: ['原材料', '采购款', 'EPE'], status: 'stable', relationStrength: 88, evidenceSources: ['对公流水', '增值税发票', '采购合同'], isMainChain: true },
  { id: 'cp-3', name: '驰远物流', direction: 'service', txCount: 61, txAmount: '34万', months: 18, cycleDays: '周结', concentration: '—', keywords: ['运费', '物流费'], status: 'stable', relationStrength: 85, evidenceSources: ['对公流水', '运单签收', '物流轨迹'], isMainChain: false },
  { id: 'cp-4', name: '常州永信化工', direction: 'upstream', txCount: 15, txAmount: '89万', months: 8, cycleDays: '30天', concentration: '16%', keywords: ['胶水', '材料款'], status: 'stable', relationStrength: 76, evidenceSources: ['对公流水', '增值税发票'], isMainChain: false },
  { id: 'cp-5', name: '瑞丰辅料', direction: 'downstream', txCount: 12, txAmount: '67万', months: 6, cycleDays: '45天', concentration: '12%', keywords: ['缓冲材料', '货款'], status: 'new', relationStrength: 61, evidenceSources: ['对公流水', '发票'], isMainChain: false },
  { id: 'cp-6', name: '溧阳宏达机械', direction: 'downstream', txCount: 8, txAmount: '38万', months: 4, cycleDays: '不规律', concentration: '7%', keywords: ['加工费', '服务费'], status: 'attention', relationStrength: 42, evidenceSources: ['对公流水'], isMainChain: false },
  { id: 'cp-7', name: '苏州汇能塑胶', direction: 'upstream', txCount: 18, txAmount: '112万', months: 9, cycleDays: '30天', concentration: '19%', keywords: ['塑料粒子', '原材料'], status: 'stable', relationStrength: 80, evidenceSources: ['对公流水', '增值税发票', '物流签收'], isMainChain: true },
  { id: 'cp-8', name: '顺捷报关行', direction: 'service', txCount: 24, txAmount: '18万', months: 12, cycleDays: '月结', concentration: '—', keywords: ['报关费', '代理费'], status: 'stable', relationStrength: 72, evidenceSources: ['对公流水', '报关单据'], isMainChain: false },
  { id: 'cp-9', name: '无锡创达电气', direction: 'downstream', txCount: 6, txAmount: '29万', months: 3, cycleDays: '45-60天', concentration: '5%', keywords: ['电气箱', '包装'], status: 'new', relationStrength: 38, evidenceSources: ['对公流水'], isMainChain: false },
];

function ScoreBar({ value, color }: { value: number; color: string }) { return (<div className="flex items-center gap-2"><div className="flex-1 h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden"><div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} /></div><span className="text-xs font-semibold text-[#0F172A] w-7 text-right">{value}</span></div>); }

const DIR_THEME = { upstream: { fill: '#FFF7ED', stroke: '#F97316', text: '#9A3412', label: '上游供应商', edgeLabel: '采购付款' }, downstream: { fill: '#EFF6FF', stroke: '#3B82F6', text: '#1E40AF', label: '下游采购方', edgeLabel: '销售收款' }, service: { fill: '#ECFDF5', stroke: '#10B981', text: '#065F46', label: '服务/物流', edgeLabel: '服务支付' } } as const;
const STATUS_DOT = { stable: '#10B981', attention: '#F59E0B', new: '#3B82F6' } as const;

interface NodePos { x: number; y: number; node: CounterpartyNode }

function chainLayout(nodes: CounterpartyNode[], W: number, H: number): { positions: NodePos[]; cx: number; cy: number } {
  const groups = { upstream: nodes.filter(n => n.direction === 'upstream'), downstream: nodes.filter(n => n.direction === 'downstream'), service: nodes.filter(n => n.direction === 'service') };
  const cx = W * 0.42, cy = H * 0.42; const result: NodePos[] = [];
  const upMain = groups.upstream.filter(n => n.isMainChain); const upAux = groups.upstream.filter(n => !n.isMainChain);
  upMain.forEach((n, i) => { const spacing = 80; const baseY = cy - ((upMain.length - 1) * spacing) / 2; result.push({ x: cx - 190, y: baseY + i * spacing, node: n }); });
  upAux.forEach((n, i) => { const spacing = 80; const baseY = cy - ((upAux.length - 1) * spacing) / 2; result.push({ x: cx - 310, y: baseY + i * spacing, node: n }); });
  const downMain = groups.downstream.filter(n => n.isMainChain); const downAux = groups.downstream.filter(n => !n.isMainChain);
  downMain.forEach((n, i) => { const spacing = 80; const baseY = cy - ((downMain.length - 1) * spacing) / 2; result.push({ x: cx + 200, y: baseY + i * spacing, node: n }); });
  downAux.forEach((n, i) => { const spacing = 72; const baseY = cy - ((downAux.length - 1) * spacing) / 2; result.push({ x: cx + 310, y: baseY + i * spacing, node: n }); });
  groups.service.forEach((n, i) => { const spacing = 140; const baseX = cx - ((groups.service.length - 1) * spacing) / 2; result.push({ x: baseX + i * spacing, y: cy + 180, node: n }); });
  return { positions: result, cx, cy };
}

function RelationGraph() {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [hoveredId, setHoveredId] = React.useState<string | null>(null);
  const W = 780, H = 480;
  const { positions, cx, cy } = chainLayout(COUNTERPARTY_NODES, W, H);
  const { currentSample } = useDemo();
  const centerName = currentSample.shortName;
  const selected = selectedId ? COUNTERPARTY_NODES.find(n => n.id === selectedId) ?? null : null;
  const mainChainCount = COUNTERPARTY_NODES.filter(n => n.isMainChain).length;
  const avgStrength = Math.round(COUNTERPARTY_NODES.reduce((s, n) => s + n.relationStrength, 0) / COUNTERPARTY_NODES.length);
  const strongCount = COUNTERPARTY_NODES.filter(n => n.relationStrength >= 70).length;
  const nodeR = 30;
  const strengthColor = (v: number) => v >= 80 ? '#10B981' : v >= 60 ? '#3B82F6' : v >= 40 ? '#F59E0B' : '#EF4444';
  const strengthLabel = (v: number) => v >= 80 ? '强' : v >= 60 ? '中' : v >= 40 ? '弱' : '极弱';
  const chainMasterX = cx + 420, chainMasterY = cy;

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-[#E2E8F0] bg-white p-3.5">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-3.5 flex-1 min-w-0">
            <div className="flex items-center gap-2"><div className="w-6 h-6 rounded bg-[#7C3AED] flex items-center justify-center"><Network size={13} className="text-white" /></div><div className="text-[12px]"><span className="text-[#94A3B8]">链主</span><span className="ml-1.5 font-semibold text-[#7C3AED]">宁川新能源</span><span className="ml-1 text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200 font-medium">未确权</span></div></div>
            <div className="text-[#CBD5E1]">→</div>
            <div className="text-[12px]"><span className="text-[#94A3B8]">Tier-2</span><span className="ml-1.5 font-semibold text-[#3B82F6]">盛拓模组科技</span><span className="ml-1 text-[10px] text-[#64748B]">· 桥接</span></div>
            <div className="text-[#CBD5E1]">→</div>
            <div className="text-[12px]"><span className="text-[#94A3B8]">Tier-3 借款主体</span><span className="ml-1.5 font-bold text-[#0F172A]">{centerName}</span></div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="text-center"><div className="text-[15px] font-bold text-emerald-600">{strongCount}/{COUNTERPARTY_NODES.length}</div><div className="text-[9px] text-[#94A3B8]">强关系</div></div>
            <div className="text-center"><div className="text-[15px] font-bold text-[#2563EB]">{mainChainCount}</div><div className="text-[9px] text-[#94A3B8]">主链节点</div></div>
            <div className="text-center"><div className="text-[15px] font-bold" style={{ color: strengthColor(avgStrength) }}>{avgStrength}</div><div className="text-[9px] text-[#94A3B8]">平均强度</div></div>
            <div className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${avgStrength >= 70 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>证据{avgStrength >= 70 ? '充分' : '一般'}</div>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-[#F1F5F9] text-[11px] text-[#64748B] leading-5">链主<span className="font-semibold text-[#7C3AED]">宁川新能源</span>未对借款主体进行确权。本图谱基于银行内部结算流水、发票、物流等数据，推断<span className="font-semibold text-[#0F172A]">{centerName}</span>处于新能源电池产业链 Tier-3 层级，经营关系真实，具备脱核授信条件。</div>
      </div>
      <div className="rounded-xl border border-[#E5E7EB] bg-white overflow-hidden flex" style={{ minHeight: 460 }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="flex-1">
          <defs>
            <filter id="ns"><feDropShadow dx="0" dy="1" stdDeviation="2.5" floodOpacity="0.07" /></filter>
            <filter id="ng"><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
            {Object.entries(DIR_THEME).map(([k, t]) => (<marker key={k} id={`a-${k}`} viewBox="0 0 8 6" refX="8" refY="3" markerWidth="7" markerHeight="5" orient="auto-start-reverse"><path d="M0,0.5 L7.5,3 L0,5.5Z" fill={t.stroke} opacity="0.5" /></marker>))}
            <marker id="a-chain" viewBox="0 0 8 6" refX="8" refY="3" markerWidth="7" markerHeight="5" orient="auto-start-reverse"><path d="M0,0.5 L7.5,3 L0,5.5Z" fill="#7C3AED" opacity="0.4" /></marker>
          </defs>
          <pattern id="gr" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0 L0 0 0 28" fill="none" stroke="#F1F5F9" strokeWidth="0.4" /></pattern>
          <rect width={W} height={H} fill="url(#gr)" />
          <text x={cx - 285} y={22} textAnchor="middle" fontSize={9} fill="#9A3412" opacity={0.4} fontWeight={600}>上游原材料</text>
          <text x={cx + 220} y={22} textAnchor="middle" fontSize={9} fill="#1E40AF" opacity={0.4} fontWeight={600}>下游采购方</text>
          <text x={cx} y={H - 12} textAnchor="middle" fontSize={9} fill="#065F46" opacity={0.4} fontWeight={600}>服务 / 物流方</text>
          <line x1={cx - 380} y1={cy} x2={cx + 380} y2={cy} stroke="#CBD5E1" strokeWidth={1} strokeDasharray="6 4" opacity={0.2} />
          {(() => { const shengtuo = positions.find(p => p.node.id === 'cp-1'); if (!shengtuo) return null; const sx = shengtuo.x + nodeR + 4, sy = shengtuo.y; const ex = chainMasterX - 26, ey = chainMasterY; return (<g opacity={0.35}><path d={`M${sx},${sy} Q${(sx + ex) / 2},${sy - 30} ${ex},${ey}`} fill="none" stroke="#7C3AED" strokeWidth={1.5} strokeDasharray="6 4" markerEnd="url(#a-chain)" /><text x={(sx + ex) / 2} y={sy - 36} textAnchor="middle" fontSize={7.5} fill="#7C3AED" opacity={0.7} fontWeight={500}>采购需求传导</text></g>); })()}
          {positions.map(({ x, y, node }) => { const t = DIR_THEME[node.direction]; const active = hoveredId === node.id || selectedId === node.id; const dimmed = (hoveredId || selectedId) && hoveredId !== node.id && selectedId !== node.id; const dx = x - cx, dy = y - cy; const d = Math.sqrt(dx * dx + dy * dy); const ux = dx / d, uy = dy / d; const sx2 = cx + ux * 34, sy2 = cy + uy * 34; const ex2 = x - ux * (nodeR + 2), ey2 = y - uy * (nodeR + 2); const mx = (sx2 + ex2) / 2, my = (sy2 + ey2) / 2; const curveFactor = node.isMainChain ? 10 : 20; const qx = mx + (-uy) * curveFactor, qy = my + ux * curveFactor; const mEnd = node.direction === 'upstream' ? '' : `url(#a-${node.direction})`; const mStart = node.direction === 'upstream' ? `url(#a-${node.direction})` : ''; const pid = `e-${node.id}`; const edgeW = node.isMainChain ? (active ? 2.5 : 1.8) : (active ? 2 : 1); return (<g key={pid} opacity={dimmed ? 0.08 : active ? 1 : node.isMainChain ? 0.5 : 0.25} style={{ transition: 'opacity 0.25s' }}><path id={pid} d={`M${sx2},${sy2} Q${qx},${qy} ${ex2},${ey2}`} fill="none" stroke={t.stroke} strokeWidth={edgeW} strokeDasharray={node.isMainChain ? 'none' : '4 3'} markerEnd={mEnd} markerStart={mStart} filter={active ? 'url(#ng)' : undefined} />{active && (<text className="select-none" dy={-5} fill={t.text} fontSize={8} fontWeight={600} opacity={0.85}><textPath href={`#${pid}`} startOffset="50%" textAnchor="middle">{t.edgeLabel} · {node.txAmount} · {node.txCount}笔</textPath></text>)}</g>); })}
          <g><circle cx={chainMasterX} cy={chainMasterY} r={32} fill="#7C3AED" filter="url(#ns)" /><circle cx={chainMasterX} cy={chainMasterY} r={32} fill="none" stroke="#6D28D9" strokeWidth={2} strokeDasharray="5 3" /><text x={chainMasterX} y={chainMasterY - 6} textAnchor="middle" fill="white" fontSize={10.5} fontWeight={700} className="select-none">宁川新能源</text><text x={chainMasterX} y={chainMasterY + 7} textAnchor="middle" fill="#E9D5FF" fontSize={7.5} fontWeight={500} className="select-none">链主 · 未确权</text></g>
          <g filter="url(#ns)"><circle cx={cx} cy={cy} r={34} fill="#EFF6FF" /><circle cx={cx} cy={cy} r={34} fill="none" stroke="#3B82F6" strokeWidth={2} /><text x={cx} y={cy - 7} textAnchor="middle" fill="#1E3A5F" fontSize={11.5} fontWeight={700} className="select-none">{centerName}</text><text x={cx} y={cy + 6} textAnchor="middle" fill="#64748B" fontSize={7.5} className="select-none">Tier-3 · 借款主体</text><text x={cx} y={cy + 17} textAnchor="middle" fill="#2563EB" fontSize={7} fontWeight={600} className="select-none">脱核授信对象</text></g>
          {positions.map(({ x, y, node }) => { const t = DIR_THEME[node.direction]; const active = hoveredId === node.id || selectedId === node.id; const dimmed = (hoveredId || selectedId) && hoveredId !== node.id && selectedId !== node.id; const sColor = strengthColor(node.relationStrength); const shortName = node.name.length > 5 ? node.name.slice(0, 5) : node.name; return (<g key={node.id} opacity={dimmed ? 0.15 : 1} style={{ transition: 'opacity 0.25s', cursor: 'pointer' }} onClick={() => setSelectedId(p => p === node.id ? null : node.id)} onMouseEnter={() => setHoveredId(node.id)} onMouseLeave={() => setHoveredId(null)}>{active && <circle cx={x} cy={y} r={nodeR + 5} fill={t.stroke} opacity={0.08} />}<circle cx={x} cy={y} r={nodeR} fill={t.fill} stroke={node.isMainChain ? t.stroke : t.stroke + '80'} strokeWidth={node.isMainChain ? (active ? 2.5 : 1.8) : (active ? 2 : 1)} filter="url(#ns)" /><text x={x} y={y - 2} textAnchor="middle" fill={t.text} fontSize={10} fontWeight={600} className="select-none">{shortName}</text><text x={x} y={y + 10} textAnchor="middle" fill={sColor} fontSize={7.5} fontWeight={700} className="select-none">{node.relationStrength}</text><circle cx={x + nodeR - 4} cy={y - nodeR + 4} r={3.5} fill={STATUS_DOT[node.status]} stroke="white" strokeWidth={1.2} />{node.isMainChain && <circle cx={x - nodeR + 4} cy={y - nodeR + 4} r={3} fill="#2563EB" stroke="white" strokeWidth={1} />}</g>); })}
          <g transform={`translate(12, ${H - 42})`}><g><circle cx={5} cy={5} r={4} fill="#7C3AED" opacity={0.5} /><text x={13} y={9} fontSize={8} fill="#64748B">链主(未确权)</text></g>{Object.entries(DIR_THEME).map(([, t], i) => (<g key={t.label} transform={`translate(${(i + 1) * 82}, 0)`}><circle cx={5} cy={5} r={4} fill={t.stroke} opacity={0.7} /><text x={13} y={9} fontSize={8} fill="#64748B">{t.label}</text></g>))}<g transform="translate(328, 0)"><line x1={0} y1={5} x2={14} y2={5} stroke="#64748B" strokeWidth={1.5} /><text x={18} y={9} fontSize={8} fill="#64748B">主链</text></g><g transform="translate(372, 0)"><line x1={0} y1={5} x2={14} y2={5} stroke="#64748B" strokeWidth={1} strokeDasharray="3 2" /><text x={18} y={9} fontSize={8} fill="#64748B">辅助</text></g></g>
        </svg>
        <div className="w-[270px] flex-shrink-0 border-l border-[#F1F5F9] bg-[#FAFBFC] overflow-y-auto" style={{ maxHeight: 460 }}>
          {selected ? (
            <div className="p-3 space-y-2.5">
              <div className="flex items-center justify-between"><div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: DIR_THEME[selected.direction].stroke }} /><span className="text-[12px] font-semibold text-[#0F172A]">{selected.name}</span></div><button onClick={() => setSelectedId(null)} className="text-[10px] text-[#94A3B8] hover:text-[#64748B]">×</button></div>
              <div className="rounded-lg bg-white border border-[#E2E8F0] p-2.5"><div className="flex items-center justify-between mb-2"><span className="text-[10px] text-[#94A3B8]">节点角色</span><span className="text-[11px] font-semibold" style={{ color: DIR_THEME[selected.direction].text }}>{DIR_THEME[selected.direction].label}</span></div><div className="flex items-center justify-between mb-1.5"><span className="text-[10px] text-[#94A3B8]">关系强度</span><div className="flex items-center gap-1.5"><span className="text-[13px] font-bold" style={{ color: strengthColor(selected.relationStrength) }}>{selected.relationStrength}</span><span className="text-[9px] px-1.5 py-0.5 rounded-full font-semibold" style={{ color: strengthColor(selected.relationStrength), backgroundColor: strengthColor(selected.relationStrength) + '15' }}>{strengthLabel(selected.relationStrength)}</span></div></div><div className="h-1.5 rounded-full bg-[#F1F5F9] overflow-hidden"><div className="h-full rounded-full transition-all" style={{ width: `${selected.relationStrength}%`, backgroundColor: strengthColor(selected.relationStrength) }} /></div><div className="flex items-center justify-between mt-2 text-[10px]"><span className="text-[#94A3B8]">链路位置</span><span className="font-medium text-[#334155]">{selected.isMainChain ? '主链节点' : '辅助节点'}</span></div></div>
              <div className="rounded-lg bg-white border border-[#E2E8F0] p-2.5"><p className="text-[10px] text-[#94A3B8] mb-2">交易指标</p><div className="grid grid-cols-2 gap-2">{[{ label: '交易笔数', value: `${selected.txCount}笔`, bold: true },{ label: '活跃月数', value: `${selected.months}个月`, bold: true },{ label: '交易金额', value: selected.txAmount, bold: true },{ label: '月均频次', value: `${(selected.txCount / selected.months).toFixed(1)}笔`, bold: false },{ label: '账期/结算', value: selected.cycleDays, bold: false },{ label: '集中度', value: selected.concentration, bold: false }].map(m => (<div key={m.label} className="text-[11px]"><div className="text-[9px] text-[#94A3B8]">{m.label}</div><div className={`${m.bold ? 'font-semibold text-[#0F172A]' : 'font-medium text-[#334155]'}`}>{m.value}</div></div>))}</div></div>
              <div className="rounded-lg bg-white border border-[#E2E8F0] p-2.5"><p className="text-[10px] text-[#94A3B8] mb-1.5">证据来源</p><div className="flex flex-wrap gap-1">{selected.evidenceSources.map(src => (<span key={src} className="text-[10px] px-1.5 py-0.5 rounded bg-[#F1F5F9] border border-[#E2E8F0] text-[#334155]">{src}</span>))}</div><div className="mt-2 flex flex-wrap gap-1">{selected.keywords.map(kw => (<span key={kw} className="text-[9px] px-1.5 py-0.5 rounded border" style={{ borderColor: DIR_THEME[selected.direction].stroke + '30', backgroundColor: DIR_THEME[selected.direction].fill, color: DIR_THEME[selected.direction].text }}>{kw}</span>))}</div></div>
              <div className="rounded-lg bg-white border border-[#E2E8F0] p-2.5"><p className="text-[10px] text-[#94A3B8] mb-1.5">六维验证</p><div className="space-y-1.5">{[{ dim: '连续性', pass: selected.months >= 6 },{ dim: '周期性', pass: selected.cycleDays !== '不规律' },{ dim: '对应性', pass: selected.evidenceSources.length >= 2 },{ dim: '语义性', pass: true },{ dim: '集中度', pass: selected.concentration !== '—' && parseFloat(selected.concentration) <= 55 },{ dim: '波动性', pass: selected.status !== 'attention' }].map(v => (<div key={v.dim} className="flex items-center gap-1.5 text-[10px]">{v.pass ? <CheckCircle2 size={10} className="text-emerald-500 flex-shrink-0" /> : <AlertTriangle size={10} className="text-amber-500 flex-shrink-0" />}<span className="text-[#334155]">{v.dim}</span></div>))}</div></div>
            </div>
          ) : (
            <div className="p-3 space-y-2.5">
              <p className="text-[11px] font-semibold text-[#0F172A]">节点列表</p>
              <p className="text-[10px] text-[#94A3B8]">点击图中节点或下方条目查看详情</p>
              {[...COUNTERPARTY_NODES].sort((a, b) => b.relationStrength - a.relationStrength).map(n => { const t = DIR_THEME[n.direction]; return (<button key={n.id} onClick={() => setSelectedId(n.id)} className="w-full text-left rounded-lg bg-white border border-[#E2E8F0] p-2 hover:border-[#CBD5E1] hover:shadow-sm transition-all"><div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: t.stroke }} /><span className="text-[11px] font-medium text-[#0F172A] flex-1 truncate">{n.name}</span><span className="text-[10px] font-bold" style={{ color: strengthColor(n.relationStrength) }}>{n.relationStrength}</span>{n.isMainChain && <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] flex-shrink-0" />}</div><div className="flex items-center gap-3 mt-1 text-[9px] text-[#94A3B8] ml-4"><span>{t.label}</span><span>{n.txAmount} · {n.txCount}笔</span><span>{n.months}月</span></div></button>); })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════
   Main Component
   ══════════════════════════════════════════════════════════════════ */

export default function CustomerPoolScene({ activeModule, onModuleChange }: { activeModule: string; onModuleChange: (id: string) => void }) {
  const scene = SCENES.find((item) => item.id === 'customer-pool')!;
  const { active, selectSample, selectedSampleId, navigate } = useDemo();
  const [filterOpen, setFilterOpen] = useState(false);
  const [importOpen, setImportOpen] = useState(false);
  const [detailCandidate, setDetailCandidate] = useState<CandidateRow | null>(null);
  const [sourceFilter, setSourceFilter] = useState<'all' | SourceType>('all');
  const [stageFilter, setStageFilter] = useState<'all' | StageType>('all');
  const [page, setPage] = useState(1);
  const perPage = 8;

  const filtered = CANDIDATES.filter(c => {
    if (sourceFilter !== 'all' && !c.sources.some(s => s.type === sourceFilter)) return false;
    if (stageFilter !== 'all' && c.stage !== stageFilter) return false;
    return true;
  });
  const totalPages = Math.ceil(filtered.length / perPage);
  const paged = filtered.slice((page - 1) * perPage, page * perPage);

  const stats = {
    system: CANDIDATES.filter(c => c.sources.some(s => s.type === 'system')).length,
    systemNew: 15, systemSub: '代发异常 8',
    filter: CANDIDATES.filter(c => c.sources.some(s => s.type === 'filter')).length,
    filterSub: '储能方案 50',
    field: CANDIDATES.filter(c => c.sources.some(s => s.type === 'field')).length,
    fieldSub: '今日跑楼 15',
  };

  const renderCandidateTable = () => {
    if (detailCandidate) return <EnterpriseDetail candidate={detailCandidate} onBack={() => setDetailCandidate(null)} />;
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          {[
            { type: 'system' as SourceType, icon: <Bot size={16} className="text-[#1677FF]" />, title: '系统推荐', main: `新增 ${stats.systemNew}`, sub: stats.systemSub, highlight: true },
            { type: 'filter' as SourceType, icon: <Search size={16} className="text-[#1677FF]" />, title: '条件筛选', main: `命中 ${stats.filter + 120}`, sub: stats.filterSub, highlight: false },
            { type: 'field' as SourceType, icon: <UserPlus size={16} className="text-[#1677FF]" />, title: '外勤录入', main: `录入 ${stats.field + 23}`, sub: stats.fieldSub, highlight: false },
          ].map(card => (
            <button key={card.type} onClick={() => { setSourceFilter(prev => prev === card.type ? 'all' : card.type); setPage(1); }} className={cn('rounded-xl border bg-white p-4 text-left transition-all hover:shadow-md', sourceFilter === card.type ? 'border-[#1677FF] ring-1 ring-[#1677FF]/20' : 'border-[#E5E6EB]')}>
              <div className="flex items-center gap-2 mb-2">{card.icon}<span className="text-[13px] font-semibold text-[#1D2129]">{card.title}</span>{card.highlight && <span className="w-2 h-2 rounded-full bg-[#F53F3F]" />}</div>
              <div className="text-[18px] font-bold text-[#1D2129]">{card.main}</div>
              <div className="text-[11px] text-[#86909C] mt-0.5">{card.sub}</div>
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between gap-3 rounded-xl border border-[#E5E6EB] bg-white px-4 py-2.5 shadow-inner">
          <div className="flex items-center gap-2">
            <select value={sourceFilter} onChange={e => { setSourceFilter(e.target.value as any); setPage(1); }} className="h-8 rounded border border-[#E5E6EB] px-2 text-[12px] text-[#1D2129] bg-white"><option value="all">来源: 全部</option><option value="system">系统推荐</option><option value="filter">条件筛选</option><option value="field">外勤录入</option></select>
            <select value={stageFilter} onChange={e => { setStageFilter(e.target.value as any); setPage(1); }} className="h-8 rounded border border-[#E5E6EB] px-2 text-[12px] text-[#1D2129] bg-white"><option value="all">阶段: 全部</option><option value="identified">已识别</option><option value="pre_credit">预授信</option><option value="manual_review">补审</option><option value="approved">已批准</option><option value="vetoed">一票否决</option></select>
            <div className="relative"><Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#C9CDD4]" size={13} /><Input placeholder="搜索企业名称..." className="pl-8 h-8 w-48 text-[12px] bg-white border-[#E5E6EB]" /></div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 text-[12px] text-[#4E5969] border-[#E5E6EB] gap-1" onClick={() => setFilterOpen(true)}><SlidersHorizontal size={12} />高级筛选</Button>
            <Button variant="outline" size="sm" className="h-8 text-[12px] text-[#1677FF] border-[#BEDAFF] gap-1" onClick={() => setImportOpen(true)}><Upload size={12} />导入名单</Button>
          </div>
        </div>
        <div className="rounded-xl border border-[#E5E6EB] bg-white overflow-hidden">
          <Table>
            <TableHeader><TableRow className="bg-[#F7F8FA] hover:bg-[#F7F8FA]"><TableHead className="text-[11px] font-medium text-[#86909C] h-9 pl-4 w-8">□</TableHead><TableHead className="text-[11px] font-medium text-[#86909C] h-9">企业简称</TableHead><TableHead className="text-[11px] font-medium text-[#86909C] h-9">命中特征</TableHead><TableHead className="text-[11px] font-medium text-[#86909C] h-9">来源标签</TableHead><TableHead className="text-[11px] font-medium text-[#86909C] h-9">阶段</TableHead><TableHead className="text-[11px] font-medium text-[#86909C] h-9">双维置信度</TableHead><TableHead className="text-[11px] font-medium text-[#86909C] h-9">更新</TableHead><TableHead className="text-[11px] font-medium text-[#86909C] h-9 pr-4 text-right">操作</TableHead></TableRow></TableHeader>
            <TableBody>
              {paged.map(c => {
                const isLocked = c.locked;
                return (
                  <TableRow key={c.id} className={cn('cursor-pointer transition-colors group', isLocked ? 'text-[#A9AEB8]' : 'hover:bg-[#F7F8FA]', c.sampleId === selectedSampleId && 'bg-[#E8F3FF] hover:bg-[#E8F3FF]')} onClick={() => { if (c.sampleId) selectSample(c.sampleId); setDetailCandidate(c); }}>
                    <TableCell className="pl-4 py-2.5"><input type="checkbox" className="w-3.5 h-3.5 rounded border-[#C9CDD4]" /></TableCell>
                    <TableCell className="py-2.5">
                      <div className="flex items-center gap-2"><span className={cn('text-[13px] font-medium', isLocked ? 'text-[#A9AEB8]' : 'text-[#1D2129]')}>{c.shortName}</span>{c.stageUpgraded && c.stageUpgradeFrom && <StageUpgradeBadge from={c.stageUpgradeFrom} to={STAGE_STYLES[c.stage].label} />}</div>
                      <div className="text-[11px] text-[#86909C] mt-0.5 max-w-[240px] line-clamp-2 group-hover:line-clamp-none" title={c.matchReason}>↳ {c.matchReason}</div>
                    </TableCell>
                    <TableCell className="py-2.5">
                      <div className="flex flex-wrap gap-1">
                        {(c.hitFeatures || []).slice(0, 3).map(f => {
                          const s = HIT_FEATURE_STYLE[f.type];
                          return <span key={f.label} className={cn('inline-flex items-center rounded px-1.5 py-0.5 text-[9px] border', s.bg, s.text, s.border)}>[{s.prefix}] {f.label}</span>;
                        })}
                      </div>
                    </TableCell>
                    <TableCell className="py-2.5"><div className="flex flex-wrap gap-1">{c.sources.map(s => <SourceTag key={s.label} type={s.type} label={s.label} />)}</div></TableCell>
                    <TableCell className="py-2.5"><StageBadge stage={c.stage} /></TableCell>
                    <TableCell className="py-2.5"><div className="space-y-0.5"><ConfidenceDots score={c.bizScore} label="企" /><ConfidenceDots score={c.personScore} label="人" showHint /></div></TableCell>
                    <TableCell className="py-2.5"><div className={cn('text-[11px]', isLocked ? 'text-[#C9CDD4]' : 'text-[#86909C]')}>{c.updatedAgo}</div>{isLocked && <div className="mt-1" title={c.lockReason}><Button variant="ghost" size="sm" className="h-5 text-[9px] px-1.5 text-[#A9AEB8] cursor-not-allowed" disabled>推进</Button></div>}</TableCell>
                    <TableCell className="py-2.5 pr-4 text-right"><Button variant="ghost" size="sm" className="h-6 text-[9px] px-2 gap-1 text-[#7C3AED] hover:bg-[#F3E8FF]" onClick={e => { e.stopPropagation(); navigate('partner-management', 'due-diligence'); }}><FileSearch size={10} />尽调</Button></TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between text-[12px] text-[#86909C]">
          <span>共 {filtered.length + 238} 条</span>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" disabled={page <= 1} onClick={() => setPage(p => p - 1)}><ChevronLeft size={14} /></Button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(p => (<Button key={p} variant={p === page ? 'default' : 'ghost'} size="sm" className={cn('h-7 w-7 p-0 text-[12px]', p === page && 'bg-[#1677FF] text-white')} onClick={() => setPage(p)}>{p}</Button>))}
            {totalPages > 5 && <span>...</span>}
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}><ChevronRight size={14} /></Button>
          </div>
        </div>
        <FilterDrawer open={filterOpen} onClose={() => setFilterOpen(false)} />
        <ImportModal open={importOpen} onClose={() => setImportOpen(false)} />
      </div>
    );
  };

  const renderContent = () => {
    switch (activeModule) {
      case 'feed':
      default:
        return <SmartFeedFlow />;

      case 'filter-flow':
        return (
          <div className="space-y-4">
            <div className="rounded-xl border border-[#E5E6EB] bg-white p-5 space-y-4">
              <div className="flex items-center gap-2"><Filter size={15} className="text-[#1677FF]" /><span className="text-[14px] font-semibold text-[#1D2129]">条件筛选流</span><span className="text-[10px] text-[#86909C]">基于规则主动筛选候选线索</span></div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { name: '储能方案摸排', count: 50, rule: '注册资本≥500万 + 成立≥5年 + 储能行业', status: '运行中' },
                  { name: '新能源供应商筛选', count: 38, rule: '新能源产业链 + 对公流水活跃 + 交易对手匹配', status: '运行中' },
                  { name: '化工辅料供应链', count: 22, rule: '化工行业 + 上游供应商 + 关系强度≥60', status: '暂停' },
                ].map(s => (
                  <div key={s.name} className="rounded-xl border border-[#E5E6EB] bg-white p-4 hover:shadow-md transition-all cursor-pointer">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[13px] font-semibold text-[#1D2129]">{s.name}</span>
                      <span className={cn('text-[10px] px-1.5 py-0.5 rounded-full font-medium', s.status === '运行中' ? 'bg-[#E8FFEA] text-[#00B42A]' : 'bg-[#F2F3F5] text-[#86909C]')}>{s.status}</span>
                    </div>
                    <div className="text-[20px] font-bold text-[#1D2129] mb-1">命中 {s.count}</div>
                    <div className="text-[11px] text-[#86909C]">{s.rule}</div>
                  </div>
                ))}
              </div>
              <div className="pt-3 border-t border-[#F2F3F5]">
                <div className="text-[12px] font-medium text-[#1D2129] mb-2">最近命中线索</div>
                <div className="space-y-2">
                  {CANDIDATES.filter(c => c.sources.some(s => s.type === 'filter')).slice(0, 5).map(c => (
                    <div key={c.id} className="flex items-center justify-between rounded-lg border border-[#F2F3F5] px-3 py-2 hover:bg-[#F7F8FA] cursor-pointer">
                      <div className="flex items-center gap-3">
                        <span className="text-[12px] font-medium text-[#1D2129]">{c.shortName}</span>
                        <div className="flex gap-1">{c.sources.filter(s => s.type === 'filter').map(s => <SourceTag key={s.label} type={s.type} label={s.label} />)}</div>
                        <StageBadge stage={c.stage} />
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" className="h-6 text-[9px] px-2 gap-1 text-[#7C3AED] hover:bg-[#F3E8FF]" onClick={e => { e.stopPropagation(); navigate('partner-management', 'due-diligence'); }}><FileSearch size={10} />一键尽调</Button>
                        <span className="text-[10px] text-[#86909C]">{c.updatedAgo}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 'field-flow': {
        const fieldCandidates = CANDIDATES.filter(c => c.sources.some(s => s.type === 'field'));

        const FIELD_TASKS = [
          { id: 'ft1', company: '常州衡远包装材料有限公司', shortName: '衡远包装', type: '纸质合同影像', uploadTime: '今天 09:32', uploader: '张三经理', device: 'PAD', status: 'pending' as const, aiResult: { name: '常州衡远包装材料有限公司', regCapital: '500万', legalPerson: '王某某', bizScope: '包装材料生产、销售', confidence: 96 }, conflicts: [] as string[] },
          { id: 'ft2', company: '无锡驰远物流服务有限公司', shortName: '驰远物流', type: '营业执照拍照', uploadTime: '今天 10:15', uploader: '张三经理', device: 'PAD', status: 'pending' as const, aiResult: { name: '无锡驰远物流服务有限公司', regCapital: '300万', legalPerson: '李某某', bizScope: '道路货物运输', confidence: 91 }, conflicts: ['法人姓名与征信系统不一致'] },
          { id: 'ft3', company: '金利达新材料有限公司', shortName: '金利达新材', type: '现场走访记录', uploadTime: '昨天 15:40', uploader: '李四经理', device: '手机', status: 'reviewed' as const, aiResult: { name: '金利达新材料有限公司', regCapital: '800万', legalPerson: '陈某某', bizScope: '新材料研发、生产', confidence: 88 }, conflicts: [] as string[] },
          { id: 'ft4', company: '顺丰达物流有限公司', shortName: '顺丰达物流', type: '纸质合同影像', uploadTime: '昨天 14:20', uploader: '王五经理', device: 'PAD', status: 'rejected' as const, aiResult: { name: '深圳顺丰达物流有限公司', regCapital: '200万', legalPerson: '—', bizScope: '未能完整解析', confidence: 42 }, conflicts: ['影像模糊，法人信息缺失', '经营范围未能解析'] },
          { id: 'ft5', company: '东莞王子包装印刷厂', shortName: '王子包装', type: '营业执照拍照', uploadTime: '2天前', uploader: '张三经理', device: 'PAD', status: 'pooled' as const, aiResult: { name: '东莞王子包装印刷厂', regCapital: '350万', legalPerson: '赵某某', bizScope: '包装印刷', confidence: 94 }, conflicts: [] as string[] },
        ];

        const statusConfig = {
          pending: { label: '待复核', bg: 'bg-[#FFF7ED]', text: 'text-[#C2410C]', border: 'border-[#FED7AA]' },
          reviewed: { label: '已复核', bg: 'bg-[#EFF6FF]', text: 'text-[#2563EB]', border: 'border-[#BFDBFE]' },
          rejected: { label: '退回重采', bg: 'bg-[#FEF2F2]', text: 'text-[#DC2626]', border: 'border-[#FCA5A5]' },
          pooled: { label: '已入池', bg: 'bg-[#ECFDF3]', text: 'text-[#047857]', border: 'border-[#A7F3D0]' },
        };

        return (
          <div className="space-y-4">
            {/* Header */}
            <div className="rounded-xl border border-[#E5E6EB] bg-white px-5 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Camera size={15} className="text-[#1677FF]" />
                <span className="text-[14px] font-semibold text-[#1D2129]">外勤录入流</span>
                <span className="text-[10px] text-[#86909C]">移动采集 → AI解析 → 入池复核</span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 text-[12px] text-[#4E5969] border-[#E5E6EB] gap-1"><RefreshCw size={12} />刷新任务</Button>
                <Button size="sm" className="h-8 text-[12px] bg-[#1677FF] hover:bg-[#0E5FC2] gap-1" onClick={() => setImportOpen(true)}><Upload size={12} />导入外勤名单</Button>
              </div>
            </div>

            {/* Pipeline strip */}
            <div className="rounded-lg border border-[#E5E6EB] bg-[#F7F8FA] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-6">
                {[
                  { icon: Smartphone, label: 'PAD/手机采集', desc: '现场拍照上传', active: true },
                  { icon: Sparkles, label: 'AI自动解析', desc: 'OCR + 字段提取', active: true },
                  { icon: AlertCircle, label: '冲突检测', desc: '与行内数据比对', active: true },
                  { icon: CheckCircle, label: '复核入池', desc: '确认后进入候选列表', active: false },
                ].map((step, i) => (
                  <React.Fragment key={step.label}>
                    {i > 0 && <ArrowRight size={14} className="text-[#C9CDD4] shrink-0" />}
                    <div className="flex items-center gap-2">
                      <div className={cn('w-7 h-7 rounded-full flex items-center justify-center shrink-0', step.active ? 'bg-[#E8F3FF] text-[#1677FF]' : 'bg-[#F2F3F5] text-[#C9CDD4]')}>
                        <step.icon size={13} />
                      </div>
                      <div>
                        <div className={cn('text-[11px] font-medium', step.active ? 'text-[#1D2129]' : 'text-[#A9AEB8]')}>{step.label}</div>
                        <div className="text-[9px] text-[#86909C]">{step.desc}</div>
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { label: '待复核', value: `${FIELD_TASKS.filter(t => t.status === 'pending').length}`, color: '#C2410C', desc: '需人工确认' },
                { label: '今日采集', value: '15', color: '#1677FF', desc: 'PAD端上传' },
                { label: '本周新增', value: '42', color: '#00B42A', desc: '累计入池' },
                { label: 'AI解析成功率', value: '89%', color: '#722ED1', desc: '置信度 > 80%' },
                { label: '数据冲突率', value: '12%', color: '#F53F3F', desc: '需人工核实' },
              ].map(m => (
                <div key={m.label} className="rounded-lg border border-[#E5E6EB] bg-white p-3 text-center">
                  <div className="text-[18px] font-bold" style={{ color: m.color }}>{m.value}</div>
                  <div className="text-[11px] font-medium text-[#1D2129]">{m.label}</div>
                  <div className="text-[9px] text-[#86909C]">{m.desc}</div>
                </div>
              ))}
            </div>

            {/* Main content: task list + preview */}
            <div className="grid grid-cols-1 xl:grid-cols-[1fr_380px] gap-4">
              {/* Left: Task list */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {(['all', 'pending', 'reviewed', 'rejected', 'pooled'] as const).map(f => (
                    <button key={f} className={cn('px-3 py-1.5 rounded-md text-[11px] font-medium transition-colors border', f === 'all' ? 'bg-[#E8F3FF] text-[#1677FF] border-[#BEDAFF]' : 'text-[#4E5969] border-[#E5E6EB] hover:bg-[#F7F8FA]')}>
                      {f === 'all' ? '全部' : statusConfig[f].label}
                    </button>
                  ))}
                </div>

                <div className="rounded-xl border border-[#E5E6EB] bg-white overflow-hidden">
                  {FIELD_TASKS.map(task => {
                    const sc = statusConfig[task.status];
                    const hasConflict = task.conflicts.length > 0;
                    return (
                      <div key={task.id} className={cn('px-4 py-3.5 border-b border-[#F2F3F5] last:border-b-0 hover:bg-[#FAFBFF] transition-colors', hasConflict && task.status === 'pending' && 'bg-[#FEF2F2]/30')}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge className={cn('text-[9px] border', sc.bg, sc.text, sc.border)}>{sc.label}</Badge>
                            <span className="text-[12px] font-medium text-[#1D2129]">{task.shortName}</span>
                            <span className="text-[10px] text-[#86909C]">·</span>
                            <span className="text-[10px] text-[#86909C]">{task.type}</span>
                            {hasConflict && <Badge className="bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5] text-[9px] gap-0.5"><AlertTriangle size={8} />数据冲突</Badge>}
                          </div>
                          <div className="flex items-center gap-3 text-[10px] text-[#86909C]">
                            <span className="flex items-center gap-1">{task.device === 'PAD' ? <Smartphone size={10} /> : <Camera size={10} />}{task.device}</span>
                            <span>{task.uploader}</span>
                            <span>{task.uploadTime}</span>
                          </div>
                        </div>

                        {/* AI extraction preview */}
                        <div className="mt-2 rounded-lg border border-[#E5E6EB] bg-[#F7F8FA] p-3">
                          <div className="flex items-center gap-1.5 mb-2">
                            <Sparkles size={10} className="text-[#722ED1]" />
                            <span className="text-[10px] font-medium text-[#722ED1]">AI提取结果</span>
                            <span className="text-[9px] text-[#86909C] ml-auto">置信度: <span className={cn('font-semibold', task.aiResult.confidence >= 80 ? 'text-[#00B42A]' : task.aiResult.confidence >= 60 ? 'text-[#FF7D00]' : 'text-[#F53F3F]')}>{task.aiResult.confidence}%</span></span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-1 text-[10px]">
                            <div><span className="text-[#86909C]">企业名称:</span> <span className="text-[#1D2129] font-medium">{task.aiResult.name}</span></div>
                            <div><span className="text-[#86909C]">注册资本:</span> <span className="text-[#1D2129]">{task.aiResult.regCapital}</span></div>
                            <div><span className="text-[#86909C]">法定代表人:</span> <span className="text-[#1D2129]">{task.aiResult.legalPerson}</span></div>
                            <div><span className="text-[#86909C]">经营范围:</span> <span className="text-[#1D2129]">{task.aiResult.bizScope}</span></div>
                          </div>
                        </div>

                        {/* Conflict alerts */}
                        {hasConflict && (
                          <div className="mt-2 rounded-lg border border-[#FCA5A5] bg-[#FEF2F2] px-3 py-2 space-y-1">
                            {task.conflicts.map((c, i) => (
                              <div key={i} className="flex items-center gap-1.5 text-[10px] text-[#DC2626]">
                                <AlertTriangle size={10} className="shrink-0" />
                                <span>{c}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="mt-2.5 flex items-center gap-2">
                          {task.status === 'pending' && (
                            <>
                              <Button size="sm" className="h-6 text-[10px] px-2.5 gap-1 bg-[#1677FF] hover:bg-[#0E5FC2] text-white"><CheckCircle size={9} /> 确认入池</Button>
                              {hasConflict && <Button variant="outline" size="sm" className="h-6 text-[10px] px-2.5 gap-1 text-[#C2410C] border-[#FED7AA]"><AlertCircle size={9} /> 标记冲突待核实</Button>}
                              <Button variant="outline" size="sm" className="h-6 text-[10px] px-2.5 gap-1 text-[#F53F3F] border-[#FCA5A5]"><X size={9} /> 退回重采</Button>
                              <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2 gap-1 text-[#4E5969]"><Eye size={9} /> 查看影像</Button>
                            </>
                          )}
                          {task.status === 'reviewed' && (
                            <>
                              <Button size="sm" className="h-6 text-[10px] px-2.5 gap-1 bg-[#00B42A] hover:bg-[#009A29] text-white"><CheckCircle size={9} /> 一键入池</Button>
                              <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2 gap-1 text-[#4E5969]"><Eye size={9} /> 查看详情</Button>
                            </>
                          )}
                          {task.status === 'rejected' && (
                            <div className="flex items-center gap-2">
                              <Badge className="bg-[#FEF2F2] text-[#DC2626] border-[#FCA5A5] text-[9px]">已退回，等待客户经理重新采集</Badge>
                              <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2 gap-1 text-[#4E5969]"><Eye size={9} /> 查看原因</Button>
                            </div>
                          )}
                          {task.status === 'pooled' && (
                            <div className="flex items-center gap-2">
                              <Badge className="bg-[#ECFDF3] text-[#047857] border-[#A7F3D0] text-[9px]">已进入候选资产列表</Badge>
                              <Button variant="ghost" size="sm" className="h-6 text-[10px] px-2 gap-1 text-[#4E5969]"><Eye size={9} /> 查看详情</Button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right: Summary panel */}
              <div className="space-y-4">
                {/* Data source pipeline */}
                <div className="rounded-xl border border-[#E5E6EB] bg-white p-4 space-y-3">
                  <div className="text-[12px] font-semibold text-[#1D2129] flex items-center gap-1.5"><FileImage size={13} className="text-[#1677FF]" />采集渠道统计</div>
                  <div className="space-y-2">
                    {[
                      { channel: 'PAD端拍照', count: 28, percent: 67 },
                      { channel: '手机端上传', count: 9, percent: 21 },
                      { channel: 'PC端影像导入', count: 5, percent: 12 },
                    ].map(ch => (
                      <div key={ch.channel} className="flex items-center gap-3">
                        <span className="text-[10px] text-[#4E5969] w-24 shrink-0">{ch.channel}</span>
                        <div className="flex-1 h-2 rounded-full bg-[#F2F3F5] overflow-hidden">
                          <div className="h-full rounded-full bg-[#1677FF]" style={{ width: `${ch.percent}%` }} />
                        </div>
                        <span className="text-[10px] font-medium text-[#1D2129] w-10 text-right">{ch.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent pooled */}
                <div className="rounded-xl border border-[#E5E6EB] bg-white p-4 space-y-3">
                  <div className="text-[12px] font-semibold text-[#1D2129]">最近入池（外勤来源）</div>
                  <div className="space-y-2">
                    {fieldCandidates.filter(c => !c.locked).slice(0, 4).map(c => (
                      <div key={c.id} className="flex items-center justify-between rounded-lg border border-[#F2F3F5] px-3 py-2 hover:bg-[#F7F8FA] cursor-pointer" onClick={() => setDetailCandidate(c)}>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-medium text-[#1D2129]">{c.shortName}</span>
                          <StageBadge stage={c.stage} />
                        </div>
                        <span className="text-[10px] text-[#86909C]">{c.updatedAgo}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Downstream entry */}
                <div className="rounded-xl border border-[#E5E6EB] bg-white p-4 space-y-3">
                  <div className="text-[12px] font-semibold text-[#1D2129]">下游功能衔接</div>
                  <div className="space-y-1.5">
                    {[
                      { label: '候选资产列表', desc: '查看全部候选企业', moduleId: 'list' },
                      { label: '预授信池', desc: '查看已通过预授信', moduleId: 'pre-credit' },
                      { label: '补审队列', desc: '查看待补审企业', moduleId: 'review-queue' },
                    ].map(entry => (
                      <button key={entry.moduleId} className="w-full flex items-center justify-between rounded-lg border border-[#E5E6EB] bg-[#F7F8FA] px-3 py-2.5 hover:bg-[#E8F3FF] transition-colors text-left">
                        <div>
                          <div className="text-[11px] font-medium text-[#1D2129]">{entry.label}</div>
                          <div className="text-[9px] text-[#86909C]">{entry.desc}</div>
                        </div>
                        <ArrowRight size={12} className="text-[#86909C]" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <ImportModal open={importOpen} onClose={() => setImportOpen(false)} />
          </div>
        );
      }

      case 'list':
        return renderCandidateTable();

      case 'pre-credit': {
        const preCreditList = CANDIDATES.filter(c => c.stage === 'pre_credit');
        return (
          <div className="space-y-4">
            <div className="rounded-xl border border-[#E5E6EB] bg-white p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2"><ShieldCheck size={15} className="text-[#1677FF]" /><span className="text-[14px] font-semibold text-[#1D2129]">预授信池</span><Badge className="text-[10px] bg-[#E8F3FF] text-[#1677FF] border-[#BEDAFF]">{preCreditList.length} 户</Badge></div>
              </div>
              <div className="text-[12px] text-[#4E5969] leading-5">系统已通过置信度评分、关系强度、经营证据等维度初筛，以下企业具备基础授信条件，等待进入产品匹配或补审流程。</div>
              <div className="space-y-2">
                {preCreditList.map(c => (
                  <div key={c.id} className="flex items-center justify-between rounded-xl border border-[#E5E6EB] px-4 py-3 hover:shadow-md transition-all cursor-pointer" onClick={() => setDetailCandidate(c)}>
                    <div className="flex items-center gap-4">
                      <div><div className="text-[13px] font-semibold text-[#1D2129]">{c.shortName}</div><div className="text-[11px] text-[#86909C] mt-0.5">{c.fullName}</div></div>
                      <div className="flex gap-1">{c.sources.map(s => <SourceTag key={s.label} type={s.type} label={s.label} />)}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="space-y-0.5"><ConfidenceDots score={c.bizScore} label="企" /><ConfidenceDots score={c.personScore} label="人" showHint /></div>
                      <Button size="sm" className="h-7 text-[11px] bg-[#1677FF] hover:bg-[#0E5FC2]">进入匹配</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }

      case 'review-queue': {
        const reviewList = CANDIDATES.filter(c => c.stage === 'manual_review');
        return (
          <div className="space-y-4">
            <div className="rounded-xl border border-[#E5E6EB] bg-white p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2"><FileText size={15} className="text-[#722ED1]" /><span className="text-[14px] font-semibold text-[#1D2129]">补审队列</span><Badge className="text-[10px] bg-[#F3E8FF] text-[#722ED1] border-[#D3ADF7]">{reviewList.length} 户待审</Badge></div>
              </div>
              <div className="text-[12px] text-[#4E5969] leading-5">以下企业存在异动矛盾、证据不完整或规则命中需人工核验等情况，需由审批人完成补审判断。</div>
              <div className="space-y-2">
                {reviewList.length > 0 ? reviewList.map(c => (
                  <div key={c.id} className="flex items-center justify-between rounded-xl border border-[#722ED1]/20 bg-[#F3E8FF]/20 px-4 py-3 hover:shadow-md transition-all cursor-pointer" onClick={() => setDetailCandidate(c)}>
                    <div className="flex items-center gap-4">
                      <div><div className="text-[13px] font-semibold text-[#1D2129]">{c.shortName}</div><div className="text-[11px] text-[#86909C] mt-0.5">↳ {c.matchReason}</div></div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="space-y-0.5"><ConfidenceDots score={c.bizScore} label="企" /><ConfidenceDots score={c.personScore} label="人" showHint /></div>
                      <Button size="sm" className="h-7 text-[11px] bg-[#722ED1] hover:bg-[#531DAB] text-white">进入补审</Button>
                    </div>
                  </div>
                )) : (
                  <div className="text-center py-8 text-[12px] text-[#86909C]">当前无待补审企业</div>
                )}
                {CANDIDATES.filter(c => c.stage === 'identified' && c.locked).map(c => (
                  <div key={c.id} className="flex items-center justify-between rounded-xl border border-[#E5E6EB] px-4 py-3 opacity-50">
                    <div className="flex items-center gap-4">
                      <div><div className="text-[13px] font-medium text-[#A9AEB8]">{c.shortName}</div><div className="text-[11px] text-[#C9CDD4] mt-0.5">↳ {c.lockReason}</div></div>
                    </div>
                    <StageBadge stage="identified" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      }

      case 'graph':
        return (<div className="space-y-4">{active && <SceneHero question="谁该进入资产池、依据是什么" />}<RelationGraph />{active && <ActionBar />}</div>);

      case 'linked':
        return (
          <div className="rounded-xl border border-[#E5E6EB] bg-white p-5 space-y-4">
            <div className="flex items-center gap-2"><Link2 size={15} className="text-[#1677FF]" /><span className="text-[14px] font-semibold text-[#1D2129]">公私联动验证</span></div>
            <div className="text-[12px] text-[#4E5969] leading-5">将企业对公信息与法人个人信息交叉验证，发现以私带公切入点和经营真实性信号。</div>
            <div className="grid grid-cols-2 gap-4">
              {CANDIDATES.filter(c => c.bizScore >= 4 && c.personScore >= 3).slice(0, 4).map(c => (
                <div key={c.id} className="rounded-xl border border-[#E5E6EB] p-4 hover:shadow-md transition-all cursor-pointer" onClick={() => setDetailCandidate(c)}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[13px] font-semibold text-[#1D2129]">{c.shortName}</span>
                    <StageBadge stage={c.stage} />
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-1 space-y-1"><div className="text-[10px] text-[#86909C]">企业维度</div><ConfidenceDots score={c.bizScore} label="企" /></div>
                    <div className="flex-1 space-y-1"><div className="text-[10px] text-[#86909C]">法人维度</div><ConfidenceDots score={c.personScore} label="人" showHint /></div>
                  </div>
                  {c.bizScore >= 4 && c.personScore >= 4 && <div className="mt-2 flex items-center gap-1 text-[10px] text-[#00B42A]"><CheckCircle2 size={10} />公私联动验证通过</div>}
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
