import {
  Blocks,
  Building2,
  BriefcaseBusiness,
  ChartNetwork,
  DatabaseZap,
  FileCheck2,
  Settings2,
} from 'lucide-react';
import { Scene } from './types';

export const SCENES: Scene[] = [
  {
    id: 'cockpit',
    title: '今日工作台',
    icon: Blocks,
    modules: [
      { id: 'overview', title: '工作台' },
      { id: 'todo', title: '待办任务' },
      { id: 'risk-alert', title: '风险预警' },
      { id: 'data-overview', title: '数据概览' },
    ],
  },
  {
    id: 'customer-pool',
    title: '候选资产池',
    icon: Building2,
    modules: [
      { id: 'feed', title: '智能推荐流' },
      { id: 'filter-flow', title: '条件筛选流' },
      { id: 'field-flow', title: '外勤录入流' },
      { id: 'list', title: '候选资产列表' },
      { id: 'pre-credit', title: '预授信池' },
      { id: 'review-queue', title: '补审队列' },
      { id: 'graph', title: '关系图谱' },
      { id: 'linked', title: '公私联动验证' },
    ],
  },
  {
    id: 'product-approval',
    title: '产品与审批',
    icon: FileCheck2,
    modules: [
      { id: 'matching', title: '产品匹配' },
      { id: 'flow', title: '预审与推单' },
      { id: 'summary', title: '审批摘要' },
      { id: 'review', title: '补审作业' },
    ],
  },
  {
    id: 'asset-pool',
    title: '授信资产池',
    icon: DatabaseZap,
    modules: [
      { id: 'activated', title: '在营资产列表' },
      { id: 'risk-assets', title: '风险资产' },
      { id: 'repayment', title: '还款状态看板' },
      { id: 'pipeline', title: '转化看板' },
    ],
  },
  {
    id: 'risk-monitor',
    title: '风险监控',
    icon: ChartNetwork,
    modules: [
      { id: 'warning', title: '预警总览' },
      { id: 'signals', title: '监控指标' },
      { id: 'actions', title: '处置任务下发' },
      { id: 'quality', title: '规则效果' },
    ],
  },
  {
    id: 'post-loan',
    title: '贷后经营',
    icon: BriefcaseBusiness,
    modules: [
      { id: 'operations', title: '贷后总览' },
      { id: 'layers', title: '客户分层' },
      { id: 'revenue', title: '增收动作' },
      { id: 'playbook', title: '动作模板' },
    ],
  },
  {
    id: 'partner-management',
    title: '数据与接入',
    icon: Settings2,
    modules: [
      { id: 'standard', title: '标准小微规则' },
      { id: 'long-tail', title: '长尾场景规则' },
      { id: 'product-config', title: '产品配置' },
      { id: 'approval-rules', title: '审批规则' },
      { id: 'due-diligence', title: '智能尽调工具' },
      { id: 'data-source', title: '数据源管理' },
    ],
  },
];
