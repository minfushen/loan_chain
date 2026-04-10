import {
  Blocks,
  Building2,
  BriefcaseBusiness,
  ChartNetwork,
  DatabaseZap,
  FileCheck2,
  Handshake,
} from 'lucide-react';
import { Scene } from './types';

export const SCENES: Scene[] = [
  {
    id: 'cockpit',
    title: '全局控制台',
    icon: Blocks,
    modules: [
      { id: 'overview', title: '经营总览' },
      { id: 'mvp', title: '作战面板' },
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
    title: '合作方管理',
    icon: Handshake,
    modules: [
      { id: 'ecosystem', title: '接入总览' },
      { id: 'sources', title: '数据来源' },
      { id: 'templates', title: '银行模板' },
      { id: 'delivery', title: '实施路径' },
    ],
  },
];
