import {
  Blocks,
  BriefcaseBusiness,
  ChartNetwork,
  ClipboardCheck,
  DatabaseZap,
  FileSearch,
  ScanSearch,
  Settings2,
} from 'lucide-react';
import { Scene } from './types';

export const SCENES: Scene[] = [
  {
    id: 'cockpit',
    title: '今日工作台',
    icon: Blocks,
    modules: [
      { id: 'overview', title: '工作首页' },
      { id: 'todo', title: '待办任务' },
      { id: 'risk-alert', title: '风险提醒' },
      { id: 'my-customers', title: '我的客户' },
    ],
  },
  {
    id: 'smart-identify',
    title: '智能识别',
    icon: ScanSearch,
    modules: [
      { id: 'import', title: '名单导入' },
      { id: 'feed', title: '智能推荐流' },
      { id: 'filter-flow', title: '条件筛选流' },
      { id: 'list', title: '候选资产列表' },
      { id: 'graph', title: '关系图谱' },
      { id: 'linked', title: '公私联动验证' },
    ],
  },
  {
    id: 'smart-due-diligence',
    title: '智能尽调',
    icon: FileSearch,
    modules: [
      { id: 'field-entry', title: '外勤录入' },
      { id: 'material', title: '材料采集' },
      { id: 'evidence', title: '证据核验' },
      { id: 'dd-report', title: '智能尽调' },
      { id: 'report-gen', title: '报告生成' },
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
      { id: 'pipeline', title: '转化看板' },
      { id: 'activated', title: '在营资产列表' },
      { id: 'risk-assets', title: '风险资产' },
      { id: 'repayment', title: '还款状态看板' },
    ],
  },
  {
    id: 'smart-monitor',
    title: '智能监控',
    icon: ChartNetwork,
    modules: [
      { id: 'warning', title: '预警总览' },
      { id: 'signals', title: '监控指标' },
      { id: 'probe', title: '风险探针' },
      { id: 'actions', title: '处置任务' },
      { id: 'quality', title: '规则效果' },
    ],
  },
  {
    id: 'smart-operation',
    title: '智能经营',
    icon: BriefcaseBusiness,
    modules: [
      { id: 'operations', title: '经营总览' },
      { id: 'layers', title: '客户分层' },
      { id: 'revenue', title: '增收动作' },
      { id: 'recovery', title: '恢复经营' },
      { id: 'playbook', title: '动作模板' },
    ],
  },
  {
    id: 'strategy-config',
    title: '策略与配置',
    icon: Settings2,
    modules: [
      { id: 'standard', title: '标准规则' },
      { id: 'long-tail', title: '场景规则' },
      { id: 'product-config', title: '产品配置' },
      { id: 'approval-rules', title: '审批规则' },
      { id: 'data-source', title: '数据源管理' },
    ],
  },
];
