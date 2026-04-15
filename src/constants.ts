import {
  Blocks,
  BriefcaseBusiness,
  ChartNetwork,
  ClipboardCheck,
  DatabaseZap,
  FileSearch,
  ScanSearch,
  Settings2,
  Sparkles,
} from 'lucide-react';
import { Scene } from './types';

export const SCENES: Scene[] = [
  {
    id: 'cockpit',
    title: '今日工作台',
    icon: Blocks,
    modules: [
      { id: 'overview', title: '今日总览' },
      { id: 'task-center', title: '任务中心' },
      { id: 'notifications', title: '消息通知' },
      { id: 'my-focus', title: '我的关注' },
      { id: 'ai-brief', title: 'AI 建议' },
    ],
  },
  {
    id: 'smart-identify',
    title: '智能识别',
    icon: ScanSearch,
    modules: [
      { id: 'file-import', title: '名单导入' },
      { id: 'feed', title: '智能筛选' },
      { id: 'list', title: '候选资产' },
      { id: 'graph', title: '关系图谱' },
      { id: 'linked', title: '公私联动' },
    ],
  },
  {
    id: 'smart-due-diligence',
    title: '智能尽调',
    icon: FileSearch,
    modules: [
      { id: 'material', title: '材料解析' },
      { id: 'evidence', title: '证据核验' },
      { id: 'dd-report', title: '尽调报告' },
      { id: 'report-center', title: '报告中心' },
    ],
  },
  {
    id: 'smart-approval',
    title: '智能审批',
    icon: ClipboardCheck,
    modules: [
      { id: 'matching', title: '产品匹配' },
      { id: 'flow', title: '预审与推单' },
      { id: 'review', title: '补审作业' },
      { id: 'summary', title: '审批摘要' },
    ],
  },
  {
    id: 'asset-pool',
    title: '授信资产池',
    icon: DatabaseZap,
    modules: [
      { id: 'dashboard', title: '资产经营看板' },
      { id: 'activated', title: '在营资产' },
      { id: 'risk-assets', title: '风险监控' },
      { id: 'repayment', title: '还款表现' },
    ],
  },
  {
    id: 'smart-monitor',
    title: '智能监控',
    icon: ChartNetwork,
    modules: [
      { id: 'warning', title: '预警总览' },
      { id: 'signals', title: '指标监测' },
      { id: 'probe', title: '风险识别' },
      { id: 'actions', title: '处置作业' },
      { id: 'quality', title: '规则评估' },
    ],
  },
  {
    id: 'smart-operation',
    title: '智能经营',
    icon: BriefcaseBusiness,
    modules: [
      { id: 'operations', title: '经营总览' },
      { id: 'layers', title: '客户分层' },
      { id: 'revenue', title: '经营动作' },
      { id: 'recovery', title: '客户恢复' },
      { id: 'playbook', title: '经营模板' },
    ],
  },
  {
    id: 'strategy-config',
    title: '策略与配置',
    icon: Settings2,
    modules: [
      { id: 'standard', title: '基础规则' },
      { id: 'long-tail', title: '场景策略' },
      { id: 'product-config', title: '产品策略配置' },
      { id: 'approval-rules', title: '审批策略' },
      { id: 'risk-disposal', title: '风险处置策略' },
      { id: 'report-template', title: '报告模板配置' },
      { id: 'data-source', title: '数据源配置' },
    ],
  },
  {
    id: 'agent-workbench',
    title: '智能体作业',
    icon: Sparkles,
    modules: [
      { id: 'agent-demo', title: '智能体作业详情' },
      { id: 'human-boundary', title: '人机协作边界' },
    ],
  },
];
