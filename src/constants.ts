import {
  Blocks,
  Building2,
  BriefcaseBusiness,
  ChartNetwork,
  DatabaseZap,
  FileCheck2,
} from 'lucide-react';
import { Scene } from './types';

export const SCENES: Scene[] = [
  {
    id: 'cockpit',
    title: '今日工作台',
    icon: Blocks,
    modules: [
      { id: 'overview', title: '工作台' },
    ],
  },
  {
    id: 'customer-pool',
    title: '客群识别',
    icon: Building2,
    modules: [
      { id: 'internal', title: '关系候选池' },
      { id: 'graph', title: '关系图谱' },
      { id: 'linked', title: '公私联动验证' },
      { id: 'standard', title: '标准小微规则' },
      { id: 'long-tail', title: '长尾场景规则' },
    ],
  },
  {
    id: 'asset-pool',
    title: '授信资产池',
    icon: DatabaseZap,
    modules: [
      { id: 'pipeline', title: '转化看板' },
      { id: 'pre-credit', title: '预授信池' },
      { id: 'review', title: '补审队列' },
      { id: 'activated', title: '在营资产' },
    ],
  },
  {
    id: 'product-approval',
    title: '产品与审批',
    icon: FileCheck2,
    modules: [
      { id: 'config', title: '产品配置' },
      { id: 'rules', title: '审批规则' },
      { id: 'matching', title: '产品匹配' },
      { id: 'review', title: '补审作业' },
    ],
  },
  {
    id: 'risk-monitor',
    title: '风险监控',
    icon: ChartNetwork,
    modules: [
      { id: 'warning', title: '预警总览' },
      { id: 'signals', title: '监控指标' },
      { id: 'actions', title: '处置动作' },
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
    icon: DatabaseZap,
    modules: [
      { id: 'workbench', title: '接入工作台' },
      { id: 'sources', title: '数据源配置' },
      { id: 'capability-map', title: '能力映射' },
      { id: 'gaps', title: '推进与缺口' },
    ],
  },
];
