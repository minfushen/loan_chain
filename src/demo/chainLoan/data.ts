export type DemoStage =
  | 'ecosystem'
  | 'identified'
  | 'pre_credit'
  | 'manual_review'
  | 'approved'
  | 'risk_alert'
  | 'post_loan_recovery';

export type EvidenceType = 'order' | 'invoice' | 'settlement' | 'logistics';

export interface PartnerNode {
  id: string;
  label: string;
  role: string;
  description: string;
  tier?: string;
}

export interface PartnerLink {
  source: string;
  target: string;
  relation: string;
}

export interface CompanyProfile {
  id: string;
  companyName: string;
  shortName: string;
  industry: string;
  chainName: string;
  borrowerRole: string;
  annualSalesRange: string;
  establishedYear: string;
  region: string;
  legalRep: string;
  employeeCount: number;
  hasInternalSettlement: boolean;
  internalProducts: string[];
  accountManager: string;
}

export interface DemoEvidence {
  id: string;
  type: EvidenceType;
  title: string;
  summary: string;
  metricLabel: string;
  metricValue: string;
  detailPoints: string[];
}

export interface RuleHit {
  id: string;
  name: string;
  result: 'pass' | 'warn' | 'manual_review' | 'risk';
  reason: string;
}

export interface CreditRecommendation {
  productName: string;
  recommendedLimit: string;
  recommendedTerm: string;
  recommendedPricing: string;
  repaymentMethod: string;
  useCase: string;
  approvalNote: string;
}

export interface RiskEvent {
  id: string;
  name: string;
  triggeredAt: string;
  severity: 'medium' | 'high';
  triggerRules: string[];
  summary: string;
  impact: {
    receivableCycle: string;
    fulfillmentDelay: string;
    exposureAdjustment: string;
  };
  suggestedActions: string[];
}

export interface RecoveryPlan {
  recoveredAt: string;
  recoverySignals: string[];
  recoveryDecision: string;
  restoredLimit: string;
  followUpActions: string[];
}

export interface DemoTimelineItem {
  id: string;
  stage: DemoStage;
  title: string;
  description: string;
}

export interface ChainLoanDemoCase {
  id: string;
  title: string;
  subtitle: string;
  defaultStage: DemoStage;
  company: CompanyProfile;
  ecosystem: {
    summary: string;
    nodes: PartnerNode[];
    links: PartnerLink[];
  };
  businessContext: {
    financingNeed: string;
    repaymentSource: string;
    deCoreReason: string;
  };
  identificationSignals: string[];
  evidence: DemoEvidence[];
  ruleHits: RuleHit[];
  credit: CreditRecommendation;
  riskEvent: RiskEvent;
  recovery: RecoveryPlan;
  timeline: DemoTimelineItem[];
}

export const CHAIN_LOAN_STAGE_LABELS: Record<DemoStage, string> = {
  ecosystem: '生态接入',
  identified: '客群识别',
  pre_credit: '预授信',
  manual_review: '人工补审',
  approved: '审批通过',
  risk_alert: '风险预警',
  post_loan_recovery: '贷后恢复',
};

export const CHAIN_LOAN_DEMO_CASE: ChainLoanDemoCase = {
  id: 'battery-packaging-tier3-001',
  title: '新能源电池产业链脱核链贷演示',
  subtitle: '三级包装材料供应商订单微贷',
  defaultStage: 'ecosystem',
  company: {
    id: 'cmp-yutong-001',
    companyName: '常州衡远包装材料有限公司',
    shortName: '衡远包装',
    industry: '新能源包装材料',
    chainName: '新能源电池产业链',
    borrowerRole: '三级包装材料供应商',
    annualSalesRange: '680万',
    establishedYear: '2018',
    region: '江苏常州',
    legalRep: '周海峰',
    employeeCount: 27,
    hasInternalSettlement: true,
    internalProducts: ['对公结算账户', '企业网银', '法人个人理财账户'],
    accountManager: '王敏',
  },
  ecosystem: {
    summary:
      '链主企业并未对该借款主体进行直接确权，但通过二级模组供应商订单、物流平台履约数据、银行内部回款流水，可以识别出其稳定经营与真实交易背景。',
    nodes: [
      {
        id: 'anchor',
        label: '宁川新能源',
        role: '链主企业',
        description: '动力电池制造龙头，决定整条链的采购需求节奏',
      },
      {
        id: 'tier2',
        label: '盛拓模组科技',
        role: '二级供应商',
        tier: '二级',
        description: '向链主供货的电池模组企业，向衡远包装稳定采购包装材料',
      },
      {
        id: 'borrower',
        label: '衡远包装',
        role: '借款主体',
        tier: '三级',
        description: '为模组企业提供高频周转箱、缓冲包装和回收包装服务',
      },
      {
        id: 'logistics',
        label: '驰远物流',
        role: '物流数据方',
        description: '提供发货、签收、回单和运输延迟数据',
      },
      {
        id: 'bank',
        label: '本行结算账户',
        role: '内部数据方',
        description: '提供订单回款、资金归集和法人公私联动数据',
      },
    ],
    links: [
      { source: 'anchor', target: 'tier2', relation: '采购需求传导' },
      { source: 'tier2', target: 'borrower', relation: '稳定订单采购' },
      { source: 'borrower', target: 'logistics', relation: '发货与签收履约' },
      { source: 'borrower', target: 'bank', relation: '回款与资金沉淀' },
    ],
  },
  businessContext: {
    financingNeed: '需要 120 万流动资金采购新批次环保缓冲材料，并覆盖 45 天账期内的现金流缺口。',
    repaymentSource: '主要依赖二级模组供应商的回款，以及链主带动下的持续性订单滚动。',
    deCoreReason:
      '本案例不依赖链主企业直接确权，也不要求链主出具付款承诺，而是基于订单、结算、物流和履约数据识别其真实经营信用。',
  },
  identificationSignals: [
    '近 90 天来自盛拓模组科技的高频小额订单持续发生，未出现订单中断。',
    '回款主要进入本行对公账户，资金路径清晰，可穿透到法人个人账户沉淀。',
    '物流平台回单显示发货与签收链条闭环，历史履约稳定。',
    '发票集中度可控，未出现对单一客户过度依赖。',
    '企业主个人账户在我行有持续理财和按揭行为，形成公私联动画像。',
  ],
  evidence: [
    {
      id: 'order-001',
      type: 'order',
      title: '近 90 天订单稳定',
      summary: '二级模组供应商向衡远包装持续发出高频小额订单，符合微型供应链场景特征。',
      metricLabel: '订单总额',
      metricValue: '386万',
      detailPoints: [
        '近 90 天累计订单 48 笔，平均每笔 8.04 万元。',
        '最近一次订单时间为 2026-03-28，无明显断单。',
        '订单产品集中在可循环周转箱与缓冲包装材料。',
      ],
    },
    {
      id: 'invoice-001',
      type: 'invoice',
      title: '发票结构健康',
      summary: '开票连续，客户集中度处于可控区间，未出现异常废票。',
      metricLabel: '最大客户占比',
      metricValue: '42%',
      detailPoints: [
        '近 12 个月连续开票，无连续两个月断票情况。',
        '近 6 个月作废发票金额占比 3.8%，显著低于预警阈值。',
        '前两大客户开票合计占比 67%，集中但未失衡。',
      ],
    },
    {
      id: 'settlement-001',
      type: 'settlement',
      title: '回款路径清晰',
      summary: '主要回款均进入本行对公账户，可追踪到订单和开票节点。',
      metricLabel: '平均回款周期',
      metricValue: '34 天',
      detailPoints: [
        '近 6 个月月均回款 58 万元，资金沉淀稳定。',
        '对公账户净流入为正，未出现持续异常外流。',
        '法人个人账户与企业账户之间转账频率合理，未见明显挪用迹象。',
      ],
    },
    {
      id: 'logistics-001',
      type: 'logistics',
      title: '履约数据连续',
      summary: '物流平台数据显示，发货、签收和回单链路完整，履约真实性较强。',
      metricLabel: '签收率',
      metricValue: '98.6%',
      detailPoints: [
        '近 90 天共发运 61 车次，平均每周 5 至 6 车次。',
        '签收准时率 94%，未出现系统性延迟。',
        '物流平台数据与订单、回款时间能够形成交叉验证。',
      ],
    },
  ],
  ruleHits: [
    {
      id: 'rule-order-stability',
      name: '订单稳定性规则',
      result: 'pass',
      reason: '近 90 天订单持续、金额波动可解释，满足预授信基础准入。',
    },
    {
      id: 'rule-invoice-health',
      name: '开票连续性规则',
      result: 'pass',
      reason: '近 12 个月无断票异常，废票率低于阈值。',
    },
    {
      id: 'rule-concentration',
      name: '客户集中度规则',
      result: 'warn',
      reason: '最大客户占比 42%，仍可接受，但需持续监控前两大客户变化。',
    },
    {
      id: 'rule-decore-review',
      name: '脱核场景人工补审规则',
      result: 'manual_review',
      reason: '未取得链主直接确权，需由审批人确认替代性经营证据充足。',
    },
  ],
  credit: {
    productName: '订单微贷',
    recommendedLimit: '120万',
    recommendedTerm: '6个月',
    recommendedPricing: '年化 7.2% - 7.8%',
    repaymentMethod: '按月付息，到期还本',
    useCase: '采购环保缓冲材料、覆盖 45 天账期内的周转需求',
    approvalNote:
      '建议给予 120 万订单微贷额度，要求回款归集至本行结算账户，并保留物流履约数据持续接入。',
  },
  riskEvent: {
    id: 'risk-001',
    name: '回款周期拉长 + 物流履约延迟',
    triggeredAt: '2026-05-12 10:20',
    severity: 'medium',
    triggerRules: [
      '回款周期由 34 天拉长至 49 天',
      '近 10 天出现连续 3 笔物流延迟签收',
      '对公账户周净流出连续两周扩大',
    ],
    summary:
      '系统判断该主体经营并未中断，但现金流承压和履约延迟同时出现，需临时收缩风险敞口并进入人工复核。',
    impact: {
      receivableCycle: '34 天 -> 49 天',
      fulfillmentDelay: '10 天内连续 3 笔延迟签收',
      exposureAdjustment: '额度临时收缩 20%',
    },
    suggestedActions: [
      '立即触发人工复核任务，核查延迟原因是否来自上游生产节奏变化。',
      '临时收缩可用额度 20%，保留已投放授信不抽贷。',
      '要求客户补充最新订单与运输回单，验证经营连续性。',
    ],
  },
  recovery: {
    recoveredAt: '2026-05-29 16:40',
    recoverySignals: [
      '补充上传两笔新订单，总额 96 万元。',
      '物流平台显示后续 11 车次履约恢复正常，签收率回升至 100%。',
      '回款归集恢复，最近 7 天净流入转正。',
    ],
    recoveryDecision: '恢复至原额度的 90%，并进入重点经营观察池 30 天。',
    restoredLimit: '108万',
    followUpActions: [
      '保留回款归集要求，继续监控回款周期变化。',
      '30 天后若无新增异常，恢复完整 120 万额度。',
      '纳入续贷观察名单，下一周期优先评估提额空间。',
    ],
  },
  timeline: [
    {
      id: 'tl-1',
      stage: 'ecosystem',
      title: '生态接入',
      description: '接入新能源电池产业链合作方、物流平台与内部结算数据。',
    },
    {
      id: 'tl-2',
      stage: 'identified',
      title: '客群识别',
      description: '识别衡远包装为可经营的三级供应商主体。',
    },
    {
      id: 'tl-3',
      stage: 'pre_credit',
      title: '生成预授信',
      description: '基于订单、发票、回款和物流证据生成 120 万预授信建议。',
    },
    {
      id: 'tl-4',
      stage: 'manual_review',
      title: '人工补审',
      description: '因脱核场景未获得链主直接确权，进入人工补审。',
    },
    {
      id: 'tl-5',
      stage: 'approved',
      title: '审批通过',
      description: '审批人认可替代性经营证据，批准订单微贷额度。',
    },
    {
      id: 'tl-6',
      stage: 'risk_alert',
      title: '触发风险预警',
      description: '回款周期拉长与物流延迟同时出现，系统发起额度收缩与人工复核。',
    },
    {
      id: 'tl-7',
      stage: 'post_loan_recovery',
      title: '恢复经营',
      description: '补充订单与回款恢复后，额度部分恢复并进入续贷观察。',
    },
  ],
};

// ── 多样本数据结构 ──────────────────────────────────

export type SegmentTag = 'A可授信' | 'B可做但需处理' | 'C待观察' | 'D风险经营中';
export type SampleStage = 'identified' | 'pre_credit' | 'manual_review' | 'approved' | 'risk_alert' | 'recovery';
export type ApprovalStatus = '待预授信' | '待补审' | '已批准' | '已降额' | '恢复中';
export type SampleRiskStatus = '正常' | '观察' | '中度预警' | '恢复中';

// 贷款路径：信用流贷 / 抵押贷款 / 混合（最高优先级）
export type LoanPath = 'credit_flow' | 'collateral' | 'hybrid';

// 抵押物类型优先级：房产 > 设备 > 存货
export type CollateralType = '房产' | '设备' | '存货' | '应收账款质押';

export interface CollateralInfo {
  type: CollateralType;
  /** 评估价值，如 "280万" */
  estimatedValue: string;
  /** 抵押率，如 0.7 表示 70% */
  ltvRatio: number;
  /** 产权风险 */
  propertyRisk: '清晰' | '待核验' | '有瑕疵';
  /** 是否已完成抵押登记 */
  registered: boolean;
  /** 备注 */
  note: string;
}

export interface ChainLoanSample {
  id: string;
  companyName: string;
  shortName: string;
  chainName: string;
  roleInChain: string;
  segmentTag: SegmentTag;
  stage: SampleStage;
  productType: string;
  annualSales: string;
  recommendedLimit: string;
  currentLimit: string;
  approvalStatus: ApprovalStatus;
  riskStatus: SampleRiskStatus;
  relationStrength: number;
  authenticityScore: number;
  evidenceCoverage: number;
  mainChainPath: string[];
  keyCounterparty: string;
  orderCount90d: number;
  orderAmount90d: string;
  invoiceContinuityMonths: number;
  maxCustomerConcentration: string;
  avgReceivableCycle: string;
  logisticsStatus: string;
  accountFlowStatus: string;
  riskFlags: string[];
  reviewReason: string;
  aiSummary: string;
  nextAction: string;
  uiState: {
    badgeTone: 'blue' | 'green' | 'amber' | 'red' | 'slate';
    priority: 'high' | 'medium' | 'low';
    featured: boolean;
  };
  agentHints: {
    confidence: number;
    suggestedAgent: string;
    suggestedAction: string;
  };
  // 贷款路径与抵押物信息（可选，信用流贷时为 undefined）
  loanPath: LoanPath;
  collateral?: CollateralInfo;
}

export const SAMPLES: ChainLoanSample[] = [
  {
    id: 'sample-hengyuan',
    companyName: '常州衡远包装材料有限公司',
    shortName: '衡远包装',
    chainName: '新能源电池产业链',
    roleInChain: '三级包装材料供应商',
    segmentTag: 'A可授信',
    stage: 'manual_review',
    productType: '订单微贷',
    annualSales: '680万',
    recommendedLimit: '120万',
    currentLimit: '120万',
    approvalStatus: '待补审',
    riskStatus: '正常',
    relationStrength: 87,
    authenticityScore: 92,
    evidenceCoverage: 90,
    mainChainPath: ['宁川新能源', '盛拓模组科技', '衡远包装'],
    keyCounterparty: '盛拓模组科技',
    orderCount90d: 22,
    orderAmount90d: '156万',
    invoiceContinuityMonths: 11,
    maxCustomerConcentration: '42%',
    avgReceivableCycle: '34天',
    logisticsStatus: '签收稳定',
    accountFlowStatus: '月均净流入 12.6万',
    riskFlags: [],
    reviewReason: '未获得链主直接确权，需人工核验订单-物流-回款闭环',
    aiSummary: '订单、物流、回款三流匹配度高，可进入人工补审并建议授信 120 万。',
    nextAction: '进入补审作业',
    uiState: { badgeTone: 'blue', priority: 'high', featured: true },
    agentHints: { confidence: 92, suggestedAgent: '预授信引擎', suggestedAction: '生成预授信方案' },
    loanPath: 'credit_flow',
  },
  {
    id: 'sample-jiali',
    companyName: '溧阳佳利包装材料有限公司',
    shortName: '佳利包装',
    chainName: '新能源电池产业链',
    roleInChain: '疑似三级包装供应商',
    segmentTag: 'C待观察',
    stage: 'identified',
    productType: '订单微贷',
    annualSales: '420万',
    recommendedLimit: '60万',
    currentLimit: '0',
    approvalStatus: '待预授信',
    riskStatus: '观察',
    relationStrength: 48,
    authenticityScore: 52,
    evidenceCoverage: 46,
    mainChainPath: ['宁川新能源', '盛拓模组科技', '佳利包装'],
    keyCounterparty: '盛拓模组科技',
    orderCount90d: 8,
    orderAmount90d: '49万',
    invoiceContinuityMonths: 6,
    maxCustomerConcentration: '58%',
    avgReceivableCycle: '41天',
    logisticsStatus: '运单记录不连续',
    accountFlowStatus: '经营流水波动偏大',
    riskFlags: ['证据覆盖不足', '物流佐证不完整'],
    reviewReason: '链路存在，但订单、发票、回款匹配度不足，不建议直接进入补审',
    aiSummary: '存在产业链关系线索，但经营实质证据不足，建议保留在线索池继续观察。',
    nextAction: '进入观察池',
    uiState: { badgeTone: 'slate', priority: 'low', featured: false },
    agentHints: { confidence: 48, suggestedAgent: '识别引擎', suggestedAction: '补充物流与回款数据后复评' },
    loanPath: 'credit_flow',
  },
  {
    id: 'sample-chiyuan',
    companyName: '无锡驰远物流服务有限公司',
    shortName: '驰远物流',
    chainName: '新能源电池产业链',
    roleInChain: '链上物流服务主体',
    segmentTag: 'B可做但需处理',
    stage: 'pre_credit',
    productType: '运费贷 / 服务贷',
    annualSales: '510万',
    recommendedLimit: '80万',
    currentLimit: '80万',
    approvalStatus: '待预授信',
    riskStatus: '正常',
    relationStrength: 74,
    authenticityScore: 81,
    evidenceCoverage: 76,
    mainChainPath: ['宁川新能源', '盛拓模组科技', '驰远物流'],
    keyCounterparty: '盛拓模组科技',
    orderCount90d: 61,
    orderAmount90d: '34万',
    invoiceContinuityMonths: 10,
    maxCustomerConcentration: '46%',
    avgReceivableCycle: '21天',
    logisticsStatus: '签收稳定、时效正常',
    accountFlowStatus: '结算频次高，回款规律',
    riskFlags: ['产品需差异化匹配'],
    reviewReason: '主体真实，但业务模式偏服务履约，不适合直接套用包装类订单贷',
    aiSummary: '运单频次与结算表现稳定，更适合匹配运费贷或服务贷产品。',
    nextAction: '进入产品匹配',
    uiState: { badgeTone: 'amber', priority: 'medium', featured: false },
    agentHints: { confidence: 76, suggestedAgent: '产品匹配引擎', suggestedAction: '匹配运费贷产品方案' },
    loanPath: 'credit_flow',
  },
  {
    id: 'sample-ruixin',
    companyName: '苏州锐信新材料有限公司',
    shortName: '锐信新材',
    chainName: '新能源电池产业链',
    roleInChain: '二级辅料供应商',
    segmentTag: 'B可做但需处理',
    stage: 'approved',
    productType: '订单微贷',
    annualSales: '920万',
    recommendedLimit: '150万',
    currentLimit: '110万',
    approvalStatus: '已降额',
    riskStatus: '观察',
    relationStrength: 83,
    authenticityScore: 88,
    evidenceCoverage: 84,
    mainChainPath: ['宁川新能源', '盛拓模组科技', '锐信新材'],
    keyCounterparty: '盛拓模组科技',
    orderCount90d: 18,
    orderAmount90d: '208万',
    invoiceContinuityMonths: 12,
    maxCustomerConcentration: '62%',
    avgReceivableCycle: '36天',
    logisticsStatus: '履约正常',
    accountFlowStatus: '回款稳定',
    riskFlags: ['客户集中度偏高'],
    reviewReason: '交易真实，但单一客户依赖过高，需根据集中度规则收缩敞口',
    aiSummary: '主体可授信，但集中度超过阈值，建议由 150 万下调至 110 万。',
    nextAction: '进入在营观察',
    uiState: { badgeTone: 'amber', priority: 'medium', featured: false },
    agentHints: { confidence: 82, suggestedAgent: '规则引擎', suggestedAction: '执行集中度规则收缩' },
    loanPath: 'credit_flow',
  },
  {
    id: 'sample-ruifeng',
    companyName: '昆山瑞丰辅料有限公司',
    shortName: '瑞丰辅料',
    chainName: '新能源电池产业链',
    roleInChain: '三级辅料供应商',
    segmentTag: 'D风险经营中',
    stage: 'recovery',
    productType: '订单微贷',
    annualSales: '560万',
    recommendedLimit: '90万',
    currentLimit: '72万',
    approvalStatus: '恢复中',
    riskStatus: '中度预警',
    relationStrength: 79,
    authenticityScore: 84,
    evidenceCoverage: 78,
    mainChainPath: ['宁川新能源', '盛拓模组科技', '瑞丰辅料'],
    keyCounterparty: '盛拓模组科技',
    orderCount90d: 12,
    orderAmount90d: '87万',
    invoiceContinuityMonths: 9,
    maxCustomerConcentration: '51%',
    avgReceivableCycle: '49天',
    logisticsStatus: '近 10 天 3 笔延迟',
    accountFlowStatus: '连续 4 周净流出',
    riskFlags: ['回款周期拉长', '物流履约延迟', '账户净流出'],
    reviewReason: '前期已授信，后续出现回款与履约恶化，需收缩额度并进入恢复观察',
    aiSummary: '风险已从经营波动演化为中度预警，建议额度由 90 万收缩至 72 万并启动恢复经营。',
    nextAction: '进入恢复作业',
    uiState: { badgeTone: 'red', priority: 'high', featured: true },
    agentHints: { confidence: 68, suggestedAgent: '预警引擎', suggestedAction: '启动额度收缩 + 恢复观察' },
    loanPath: 'credit_flow',
  },
  // ── 抵押贷款样本：三流数据薄弱但有房产抵押，业务优先级高 ──
  {
    id: 'sample-mingde',
    companyName: '南京明德机械制造有限公司',
    shortName: '明德机械',
    chainName: '工程机械配套产业链',
    roleInChain: '零部件加工商',
    segmentTag: 'A可授信',
    stage: 'pre_credit',
    productType: '抵押贷款',
    annualSales: '310万',
    recommendedLimit: '200万',
    currentLimit: '0',
    approvalStatus: '待预授信',
    riskStatus: '正常',
    relationStrength: 38,
    authenticityScore: 44,
    evidenceCoverage: 32,
    mainChainPath: ['徐工集团', '明德机械'],
    keyCounterparty: '徐工集团',
    orderCount90d: 4,
    orderAmount90d: '22万',
    invoiceContinuityMonths: 3,
    maxCustomerConcentration: '71%',
    avgReceivableCycle: '62天',
    logisticsStatus: '数据不完整',
    accountFlowStatus: '流水较少，季节性波动',
    riskFlags: ['三流数据不足'],
    reviewReason: '经营数据薄弱，但持有厂房房产可作抵押，产权清晰，LTV 70%，业务优先级高',
    aiSummary: '三流数据覆盖不足，但企业主名下厂房评估价值 280 万，产权清晰无查封，抵押率 70%，建议走抵押贷款路径直接进入审批。',
    nextAction: '核验抵押物产权',
    uiState: { badgeTone: 'green', priority: 'high', featured: true },
    agentHints: { confidence: 88, suggestedAgent: '抵押评估引擎', suggestedAction: '发起抵押物产权核验' },
    loanPath: 'collateral',
    collateral: {
      type: '房产',
      estimatedValue: '280万',
      ltvRatio: 0.70,
      propertyRisk: '清晰',
      registered: false,
      note: '南京江宁区厂房，建筑面积 620㎡，无共有人，无查封记录，待办理抵押登记',
    },
  },
  // ── 混合路径样本：既有三流数据又有设备抵押，最高优先级 ──
  {
    id: 'sample-haoyu',
    companyName: '常熟浩宇精密零件有限公司',
    shortName: '浩宇精密',
    chainName: '新能源电池产业链',
    roleInChain: '精密结构件供应商',
    segmentTag: 'A可授信',
    stage: 'pre_credit',
    productType: '抵押+订单混合贷',
    annualSales: '760万',
    recommendedLimit: '300万',
    currentLimit: '0',
    approvalStatus: '待预授信',
    riskStatus: '正常',
    relationStrength: 78,
    authenticityScore: 82,
    evidenceCoverage: 75,
    mainChainPath: ['宁川新能源', '盛拓模组科技', '浩宇精密'],
    keyCounterparty: '盛拓模组科技',
    orderCount90d: 16,
    orderAmount90d: '134万',
    invoiceContinuityMonths: 10,
    maxCustomerConcentration: '55%',
    avgReceivableCycle: '28天',
    logisticsStatus: '签收稳定',
    accountFlowStatus: '月均净流入 18.4万',
    riskFlags: [],
    reviewReason: '三流数据良好，同时持有数控设备可作抵押，双重保障，建议走混合路径最大化授信额度',
    aiSummary: '经营数据扎实，三流匹配度高；同时持有数控加工设备评估价值 180 万，LTV 65%。混合路径可将授信额度提升至 300 万，建议优先推进。',
    nextAction: '进入混合授信评估',
    uiState: { badgeTone: 'blue', priority: 'high', featured: true },
    agentHints: { confidence: 95, suggestedAgent: '混合授信引擎', suggestedAction: '生成混合授信方案' },
    loanPath: 'hybrid',
    collateral: {
      type: '设备',
      estimatedValue: '180万',
      ltvRatio: 0.65,
      propertyRisk: '清晰',
      registered: true,
      note: '5台数控加工中心，设备新旧程度良好，已完成动产抵押登记',
    },
  },
];

export function getSample(id: string): ChainLoanSample | undefined {
  return SAMPLES.find((s) => s.id === id);
}

export function getSamplesByStage(stage: SampleStage): ChainLoanSample[] {
  return SAMPLES.filter((s) => s.stage === stage);
}

export function getFeaturedSamples(): ChainLoanSample[] {
  return SAMPLES.filter((s) => s.uiState.featured);
}

export const SAMPLE_YUTONG = SAMPLES[0];
export const SAMPLE_WANGZI = SAMPLES[1];
export const SAMPLE_ZHONGWAIYUN = SAMPLES[2];
export const SAMPLE_XINZHOUBANG = SAMPLES[3];
export const SAMPLE_RUITAI = SAMPLES[4];

/** @deprecated Use SAMPLE_YUTONG */
export const SAMPLE_HENGYUAN = SAMPLE_YUTONG;
/** @deprecated Use SAMPLE_WANGZI */
export const SAMPLE_JIALI = SAMPLE_WANGZI;
/** @deprecated Use SAMPLE_ZHONGWAIYUN */
export const SAMPLE_CHIYUAN = SAMPLE_ZHONGWAIYUN;
/** @deprecated Use SAMPLE_XINZHOUBANG */
export const SAMPLE_RUIXIN = SAMPLE_XINZHOUBANG;
/** @deprecated Use SAMPLE_RUITAI */
export const SAMPLE_RUIFENG = SAMPLE_RUITAI;

// ── Per-sample derived data generators ──────────────────

export function getRuleHitsForSample(sample: ChainLoanSample): RuleHit[] {
  const concentration = parseInt(sample.maxCustomerConcentration);
  const hits: RuleHit[] = [
    {
      id: 'rule-order-stability',
      name: '订单稳定性规则',
      result: sample.orderCount90d >= 15 ? 'pass' : sample.orderCount90d >= 8 ? 'warn' : 'risk',
      reason: `近 90 天 ${sample.orderCount90d} 笔订单，金额 ${sample.orderAmount90d}${sample.orderCount90d >= 15 ? '，持续稳定' : '，波动偏大'}。`,
    },
    {
      id: 'rule-invoice-health',
      name: '开票连续性规则',
      result: sample.invoiceContinuityMonths >= 10 ? 'pass' : sample.invoiceContinuityMonths >= 6 ? 'warn' : 'risk',
      reason: `连续开票 ${sample.invoiceContinuityMonths} 个月${sample.invoiceContinuityMonths >= 10 ? '，无断票异常' : '，连续性不足'}。`,
    },
    {
      id: 'rule-concentration',
      name: '客户集中度规则',
      result: concentration <= 45 ? 'pass' : concentration <= 55 ? 'warn' : 'risk',
      reason: `最大客户占比 ${sample.maxCustomerConcentration}${concentration <= 45 ? '，在可接受范围内' : '，需持续监控'}。`,
    },
    {
      id: 'rule-decore-review',
      name: '脱核场景人工补审规则',
      result: sample.evidenceCoverage >= 85 ? 'pass' : 'manual_review',
      reason: sample.evidenceCoverage >= 85
        ? '替代性经营证据覆盖充分，可自动通过。'
        : '未取得链主直接确权，需审批人确认替代性经营证据是否充足。',
    },
  ];
  if (sample.riskFlags.length > 0) {
    hits.push({
      id: 'rule-risk-flags',
      name: '风险标识规则',
      result: sample.riskFlags.length >= 3 ? 'risk' : 'warn',
      reason: `存在 ${sample.riskFlags.length} 项风险标识：${sample.riskFlags.join('、')}。`,
    });
  }
  return hits;
}

export function getRiskEventForSample(sample: ChainLoanSample): RiskEvent {
  const hasRisk = sample.riskFlags.length > 0;
  return {
    id: `risk-${sample.id}`,
    name: hasRisk ? sample.riskFlags.slice(0, 2).join(' + ') : '尚无风险事件',
    triggeredAt: '2026-05-12 10:20',
    severity: sample.riskFlags.length >= 3 ? 'high' : 'medium',
    triggerRules: hasRisk
      ? sample.riskFlags.map((f) => `已命中：${f}`)
      : ['暂无触发规则'],
    summary: sample.riskFlags.length >= 2
      ? `系统检测到${sample.shortName}出现多重经营异常信号，需临时收缩风险敞口并进入人工复核。`
      : `${sample.shortName}当前经营状态基本正常，持续监控中。`,
    impact: {
      receivableCycle: sample.avgReceivableCycle,
      fulfillmentDelay: sample.logisticsStatus,
      exposureAdjustment: sample.currentLimit !== sample.recommendedLimit
        ? `额度从 ${sample.recommendedLimit} 调整至 ${sample.currentLimit}`
        : '未调整',
    },
    suggestedActions: [
      `立即触发人工复核任务，核查${sample.shortName}异常原因。`,
      `临时收缩可用额度至 ${sample.currentLimit}，保留已投放授信不抽贷。`,
      `要求客户补充最新订单与运输回单，验证经营连续性。`,
    ],
  };
}

export function getEvidenceForSample(sample: ChainLoanSample): DemoEvidence[] {
  return [
    {
      id: `${sample.id}-order`,
      type: 'order',
      title: '订单数据',
      summary: `${sample.shortName}近 90 天交易 ${sample.orderCount90d} 笔，累计金额 ${sample.orderAmount90d}。`,
      metricLabel: '90天订单量',
      metricValue: `${sample.orderCount90d} 笔`,
      detailPoints: [
        `近 90 天累计订单 ${sample.orderCount90d} 笔，金额 ${sample.orderAmount90d}。`,
        `关键交易对手：${sample.keyCounterparty}。`,
        `订单${sample.orderCount90d >= 15 ? '频次稳定，无异常中断' : '频次偏低，需持续观察'}。`,
      ],
    },
    {
      id: `${sample.id}-invoice`,
      type: 'invoice',
      title: '发票数据',
      summary: `连续开票 ${sample.invoiceContinuityMonths} 个月，经营连续性${sample.invoiceContinuityMonths >= 10 ? '良好' : '一般'}。`,
      metricLabel: '连续开票',
      metricValue: `${sample.invoiceContinuityMonths} 月`,
      detailPoints: [
        `连续开票 ${sample.invoiceContinuityMonths} 个月。`,
        `年度销售规模 ${sample.annualSales}。`,
        `客户集中度 ${sample.maxCustomerConcentration}。`,
      ],
    },
    {
      id: `${sample.id}-settlement`,
      type: 'settlement',
      title: '资金结算',
      summary: `${sample.accountFlowStatus}，回款周期 ${sample.avgReceivableCycle}。`,
      metricLabel: '回款周期',
      metricValue: sample.avgReceivableCycle,
      detailPoints: [
        `账户流水状态：${sample.accountFlowStatus}。`,
        `平均回款周期 ${sample.avgReceivableCycle}。`,
        `链路：${sample.mainChainPath.join(' → ')}。`,
      ],
    },
    {
      id: `${sample.id}-logistics`,
      type: 'logistics',
      title: '物流履约',
      summary: `物流状态：${sample.logisticsStatus}。`,
      metricLabel: '履约状态',
      metricValue: sample.logisticsStatus,
      detailPoints: [
        `物流履约状态：${sample.logisticsStatus}。`,
        `关系强度 ${sample.relationStrength}%，真实性得分 ${sample.authenticityScore}%。`,
        `证据覆盖度 ${sample.evidenceCoverage}%。`,
      ],
    },
  ];
}

// ── 演示声明 ──────────────────────────────────────
export const DEMO_DISCLAIMER = '本演示所有企业名称、供应链关系、授信状态与风险状态均为虚构示例，不代表真实商业关系。';

// ── 演示操作文案 ──────────────────────────────────

export const CHAIN_LOAN_DEMO_ACTION_COPY = {
  ecosystem: {
    primary: '开始脱核链贷演示',
    secondary: '查看生态关系',
  },
  identified: {
    primary: '生成预授信',
    secondary: '查看经营证据',
  },
  pre_credit: {
    primary: '提交人工补审',
    secondary: '查看额度建议',
  },
  manual_review: {
    primary: '批准授信',
    secondary: '退回补充材料',
  },
  approved: {
    primary: '模拟风险事件',
    secondary: '查看放款后监控',
  },
  risk_alert: {
    primary: '恢复经营',
    secondary: '查看风险处置',
  },
  post_loan_recovery: {
    primary: '推荐续贷',
    secondary: '加入重点经营池',
  },
} as const;

// ── 智能体演示专用数据类型 ────────────────────────────────

export type AgentTriggerReason =
  | 'public_private_mixing'   // 公私混用
  | 'cashflow_negative'       // 现金流为负
  | 'concentration_high'      // 客户集中度超阈值
  | 'low_confidence'          // 置信度不足
  | 'missing_evidence';       // 证据缺失

export type AgentRouteDecision = 'rule_engine_pass' | 'agent_required' | 'manual_required';
export type AgentProgressStage = 'receive' | 'collect' | 'analyze' | 'conclude' | 'await_human';

export interface AgentReasoningStep {
  step: number;
  label: string;
  tool: string;
  input: string;
  output: string;
  confidence?: number;
  flagged?: boolean;
}

// 关键证据摘要条目（用于证据摘要区，不需要展开推理日志）
export interface AgentEvidenceSummary {
  icon: 'clock' | 'tag' | 'users' | 'trending' | 'shield' | 'check';
  label: string;
  value: string;
  highlight?: boolean; // 是否为最关键证据
}

// 快捷问答预置条目
export interface AgentQuickQA {
  q: string;
  a: string;
}

export interface AgentAnomalyCase {
  id: string;
  triggerReason: AgentTriggerReason;
  ruleEngineVerdict: string;
  ruleEngineAction: string;
  // 规则无法直接决策的原因（中间冲突栏）
  ruleGapReason: string;
  agentVerdict: string;
  agentAction: string;
  evidenceKey: string;
  confidenceBefore: number;
  confidenceAfter: number;
  // 当前进度阶段
  currentStage: AgentProgressStage;
  // 关键证据摘要（3-5条）
  evidenceSummary: AgentEvidenceSummary[];
  // 待确认事项
  pendingConfirms: string[];
  // 快捷问答
  quickQA: AgentQuickQA[];
  decisionAgentSteps: AgentReasoningStep[];
  reviewAgentSteps: AgentReasoningStep[];
  humanBoundary: 'auto' | 'agent_assist' | 'must_human';
  finalRecommendation: string;
  supplementRequired?: string;
}

export interface AgentDemoCase {
  id: string;
  companyName: string;
  shortName: string;
  legalPerson: string;
  chainName: string;
  roleInChain: string;
  scene: string;
  requestedLimit: string;
  annualSales: string;
  routeDecision: AgentRouteDecision;
  routeReason: string;
  // 任务状态标签
  taskStatus: '智能体初判已完成，等待人工确认' | '智能体分析中' | '等待补充材料' | '已完成';
  // 风险等级
  riskLevel: 'low' | 'medium' | 'high';
  anomaly: AgentAnomalyCase;
}

// ── 三个智能体作业详情用例 ────────────────────────────────────

export const AGENT_DEMO_CASES: AgentDemoCase[] = [
  {
    id: 'agent-case-chenjihua',
    companyName: '苏州晨辉五金配件有限公司',
    shortName: '晨辉五金',
    legalPerson: '陈建华',
    chainName: '工程机械配套产业链',
    roleInChain: '二级零部件供应商',
    scene: '订单微贷',
    requestedLimit: '120万',
    annualSales: '580万',
    routeDecision: 'agent_required',
    routeReason: '命中"公私混用"异常规则，置信度 83%，低于 85% 阈值，规则引擎无法判断意图，路由至决策智能体',
    taskStatus: '智能体初判已完成，等待人工确认',
    riskLevel: 'medium',
    anomaly: {
      id: 'anomaly-public-private',
      triggerReason: 'public_private_mixing',
      ruleEngineVerdict: '法人个人账户与对公账户存在高频资金往来，触发公私混用预警',
      ruleEngineAction: '案件标红，建议拒绝授信，移交人工复核',
      ruleGapReason: '规则仅能识别往来频次异常，无法判断业务背景真实性。需结合行业结算习惯、交易对手身份、回款周期做补充分析，因此转由智能体执行关联判断。',
      agentVerdict: '44次转账集中于月末回款周期，对手方固定为3家产业链上游企业，摘要关键词78%为货款/结算，72%概率为正常资金归集行为',
      agentAction: '建议通过，补充法人身份证明及资金归集说明函后可直接进入预审',
      evidenceKey: '陈建华个人账户近6个月44次转账，累计205万，转入对公账户，时间集中月末25-31日',
      confidenceBefore: 83,
      confidenceAfter: 91,
      currentStage: 'await_human',
      evidenceSummary: [
        { icon: 'clock', label: '转账时间分布', value: '44笔集中于每月25-31日（回款周期末）', highlight: true },
        { icon: 'tag', label: '摘要关键词', value: '78%含"货款/结算/回款"，消费类流出占比 < 5%' },
        { icon: 'users', label: '固定对手方', value: '盛拓模组、宁川新能源关联方等3家产业链上游企业' },
        { icon: 'trending', label: '三流匹配率', value: '87%，回款路径清晰可追溯' },
        { icon: 'shield', label: '历史案例匹配', value: '与资金归集型案例匹配度 68%，非挪用特征明显' },
      ],
      pendingConfirms: [
        '是否采纳智能体建议（倾向：正常资金归集）',
        '是否要求客户补充法人资金归集说明函',
        '是否需要转人工复核异常转账样本',
      ],
      quickQA: [
        { q: '为什么建议通过？', a: '44笔转账全部集中于月末回款窗口，与产业链结算周期高度吻合；78%摘要含货款/结算关键词；对手方固定为3家上游企业，无消费类异常流出。综合判断为正常归集行为。' },
        { q: '规则和智能体冲突在哪里？', a: '规则引擎只看到"个人账户→对公账户高频转账"这一表象，触发公私混用预警。智能体补充了时间分布、摘要语义、对手方身份三个维度，发现这是产业链回款归集的典型模式，而非挪用。' },
        { q: '置信度为何从83%升到91%？', a: '审核智能体完成多假设验证后，挪用假设支持度仅18%（无消费类流出），归集假设支持度72%。补充说明函可进一步消除剩余不确定性，因此置信度提升至91%。' },
        { q: '是否仍存在潜在风险？', a: '仍存在约9%的不确定性，主要来自：说明函尚未提交、部分转账摘要信息不完整。建议在补充说明函后再最终确认，或降额至80万作为保守方案。' },
      ],
      decisionAgentSteps: [
        { step: 1, label: '任务分解', tool: 'task_decompose', input: '公私混用预警 + 授信申请材料', output: '识别3个子任务：转账意图分析、对手方核验、时间模式识别' },
        { step: 2, label: '主体核验', tool: 'entity_verify', input: '陈建华身份证 + 企业工商信息', output: '法人与企业主体一致，无异常关联企业', confidence: 96 },
        { step: 3, label: '财务分析', tool: 'financial_analyze', input: '近6个月对公账户流水', output: '月均净流入 14.2万，回款规律，无持续净流出', confidence: 88 },
        { step: 4, label: '风险扫描', tool: 'risk_scan', input: '44次个人→对公转账记录', output: '⚠ 触发公私混用规则，但转账摘要78%含"货款/结算"关键词', confidence: 72, flagged: true },
        { step: 5, label: '三流验证', tool: 'triple_flow_verify', input: '订单+发票+回款路径', output: '三流匹配率 87%，回款路径：盛拓模组→陈建华个人账户→晨辉五金对公账户', confidence: 87 },
        { step: 6, label: '反思输出', tool: 'reflect_output', input: '以上5步推理结果', output: '综合判断：资金归集概率72%，建议补充说明函，置信度83%，触发审核智能体', confidence: 83 },
      ],
      reviewAgentSteps: [
        { step: 1, label: '异常分类', tool: 'anomaly_classify', input: '公私混用预警 + 决策智能体推理结果', output: '分类：资金归集型（非挪用型），历史案例匹配度 68%' },
        { step: 2, label: '多假设验证', tool: 'hypothesis_verify', input: '转账时间分布 + 对手方信息', output: '假设A（归集）：月末集中，对手方固定，支持度 72%\n假设B（挪用）：无消费类流出，支持度 18%' },
        { step: 3, label: '补充核实请求', tool: 'supplement_request', input: '假设A需要的证明材料', output: '请求：法人身份证明 + 资金归集说明函（1份）' },
        { step: 4, label: '双路径输出', tool: 'dual_path_output', input: '验证结论', output: '路径A（推荐）：补充说明函后通过，置信度提升至91%\n路径B（备选）：降额至80万，无需补充材料' },
      ],
      humanBoundary: 'agent_assist',
      finalRecommendation: '补充法人资金归集说明函（1份）后，建议按原额度 120 万通过预审',
      supplementRequired: '法人陈建华签字的资金归集说明函（说明个人账户代收货款后转入对公账户的原因）',
    },
  },
  {
    id: 'agent-case-zhangweimin',
    companyName: '无锡鑫达电子元器件有限公司',
    shortName: '鑫达电子',
    legalPerson: '张伟民',
    chainName: '消费电子产业链',
    roleInChain: '三级电子元器件供应商',
    scene: '税票贷',
    requestedLimit: '80万',
    annualSales: '420万',
    routeDecision: 'agent_required',
    routeReason: '命中"现金流恶化"规则，Q3净流出 -10,809元，置信度 81%，低于 85% 阈值，路由至决策智能体',
    taskStatus: '智能体初判已完成，等待人工确认',
    riskLevel: 'low',
    anomaly: {
      id: 'anomaly-cashflow-negative',
      triggerReason: 'cashflow_negative',
      ruleEngineVerdict: '2025Q3净现金流为负（-10,809元），触发现金流恶化规则',
      ruleEngineAction: '评级降为C类，建议降额50%至40万，附加月度监控条件',
      ruleGapReason: '规则仅对单季度净流出做绝对值判断，无法区分"季末集中缴税"与"经营持续恶化"。需结合纳税周期、流出对手方、跨季度趋势做综合判断。',
      agentVerdict: 'Q3负值由季末集中缴税（增值税季报8,640元）+ 电费托收（2,169元）构成，Q1/Q2/Q4均为正流入，季节性特征显著，非经营恶化',
      agentAction: '维持原评级B类，建议按原额度80万通过，附加季度现金流监控条件',
      evidenceKey: '2025年9月22日大额流出：增值税季报缴纳8,640元 + 电费托收2,169元，合计10,809元',
      confidenceBefore: 81,
      confidenceAfter: 93,
      currentStage: 'await_human',
      evidenceSummary: [
        { icon: 'clock', label: '流出时间戳', value: '9月22日单日集中流出，与增值税季报截止日完全吻合', highlight: true },
        { icon: 'tag', label: '流出科目', value: '税务局8,640元（增值税季报）+ 供电局2,169元（电费托收）' },
        { icon: 'trending', label: '跨季度对比', value: 'Q1 +18,420 / Q2 +22,180 / Q3 -10,809 / Q4 +19,650，季节性规律明显' },
        { icon: 'check', label: '三流匹配率', value: '91%，Q3开票金额正常，订单无断单' },
        { icon: 'shield', label: '历史案例匹配', value: '季节性税务型案例匹配度 84%，经营恶化假设支持度仅 7%' },
      ],
      pendingConfirms: [
        '是否采纳智能体建议（维持B类评级，按80万通过）',
        '是否附加季度现金流自动监控条件',
        '是否需要客户提供纳税证明作为备案材料',
      ],
      quickQA: [
        { q: '为什么Q3为负不代表经营恶化？', a: 'Q3流出的10,809元完全由两笔固定支出构成：增值税季报8,640元（税务局）+ 电费托收2,169元（供电局）。这两笔均为周期性必要支出，与经营状况无关。Q1/Q2/Q4均为正流入，趋势健康。' },
        { q: '规则为何会误判？', a: '规则引擎对单季度净流出做绝对值判断，无法区分"季末集中缴税"与"持续经营恶化"。这是规则的覆盖盲区——它看到了负数，但不知道负数的原因。' },
        { q: '置信度为何从81%升到93%？', a: '审核智能体完成时间戳分析后，流出时间与增值税季报截止日完全吻合，对手方为税务局和供电局（非经营性流出），经营恶化假设支持度仅7%。证据链完整，置信度大幅提升。' },
        { q: '附加监控条件的意义是什么？', a: '虽然本次判断为季节性波动，但季度现金流监控可以在未来真正出现经营恶化时及时预警，是一个低成本的风险对冲手段，不影响本次授信决策。' },
      ],
      decisionAgentSteps: [
        { step: 1, label: '任务分解', tool: 'task_decompose', input: 'Q3现金流异常 + 税票贷申请', output: '识别2个子任务：流出原因分析、季节性模式识别' },
        { step: 2, label: '主体核验', tool: 'entity_verify', input: '企业工商信息 + 纳税记录', output: '增值税一般纳税人，季报缴税周期：1/4/7/10月，与异常时间吻合', confidence: 97 },
        { step: 3, label: '财务分析', tool: 'financial_analyze', input: '近4个季度现金流数据', output: 'Q1: +18,420元 / Q2: +22,180元 / Q3: -10,809元 / Q4: +19,650元，季节性波动明显', confidence: 94 },
        { step: 4, label: '风险扫描', tool: 'risk_scan', input: 'Q3流出明细', output: '⚠ 9月22日两笔流出：税务局8,640元（增值税季报）+ 供电局2,169元（电费托收）', confidence: 96, flagged: true },
        { step: 5, label: '三流验证', tool: 'triple_flow_verify', input: '发票+订单+流水', output: '三流匹配率 91%，Q3开票金额正常，订单无断单，仅现金流受税款影响', confidence: 91 },
        { step: 6, label: '反思输出', tool: 'reflect_output', input: '以上5步推理结果', output: '季末缴税导致短期负值，非经营恶化，置信度提升至93%，建议维持原评级', confidence: 93 },
      ],
      reviewAgentSteps: [
        { step: 1, label: '异常分类', tool: 'anomaly_classify', input: '现金流负值 + 决策智能体推理', output: '分类：季节性税务型（非经营恶化型），历史案例匹配度 84%' },
        { step: 2, label: '多假设验证', tool: 'hypothesis_verify', input: '流出时间 + 对手方 + 金额', output: '假设A（季末缴税）：时间/对手方/金额三项完全吻合，支持度 93%\n假设B（经营恶化）：Q1-Q4趋势不支持，支持度 7%' },
        { step: 3, label: '补充核实请求', tool: 'supplement_request', input: '验证结论', output: '无需补充材料，现有证据已充分支撑结论' },
        { step: 4, label: '双路径输出', tool: 'dual_path_output', input: '验证结论', output: '路径A（推荐）：维持B类评级，按80万通过，附加季度监控\n路径B（保守）：通过但降额至60万' },
      ],
      humanBoundary: 'agent_assist',
      finalRecommendation: '维持B类评级，建议按原额度 80 万通过，附加季度现金流自动监控条件',
    },
  },
  {
    id: 'agent-case-lixiufang',
    companyName: '常熟鸿泰包装印刷有限公司',
    shortName: '鸿泰包装',
    legalPerson: '李秀芳',
    chainName: '新能源电池产业链',
    roleInChain: '三级包装印刷供应商',
    scene: '订单微贷',
    requestedLimit: '120万',
    annualSales: '640万',
    routeDecision: 'agent_required',
    routeReason: '命中"客户集中度超阈值"规则（72% > 70%），置信度 86%，边界案例，路由至决策智能体',
    taskStatus: '智能体初判已完成，等待人工确认',
    riskLevel: 'medium',
    anomaly: {
      id: 'anomaly-concentration-high',
      triggerReason: 'concentration_high',
      ruleEngineVerdict: '最大客户集中度72%，超过阈值70%，触发集中度规则',
      ruleEngineAction: '机械降额至96万（原120万×80%），附加集中度监控',
      ruleGapReason: '规则对集中度做绝对值判断，无法区分"主动集中风险"与"产业链结构性绑定"。需结合链主关系、合同稳定性、回款规律做综合判断。',
      agentVerdict: '72%集中度来自盛拓模组（宁川新能源二级供应商），属产业链结构性绑定，近12个月回款周期标准差仅3.2天，链主更换供应商成本高，绑定关系稳定',
      agentAction: '维持120万，附加回款归集条件（回款须进入本行对公账户）',
      evidenceKey: '盛拓模组为宁川新能源指定供应商，鸿泰包装为其唯一包装材料供应商，合同期至2027年',
      confidenceBefore: 86,
      confidenceAfter: 92,
      currentStage: 'await_human',
      evidenceSummary: [
        { icon: 'users', label: '链主绑定关系', value: '鸿泰包装为盛拓模组唯一指定包装供应商，合同期至2027年', highlight: true },
        { icon: 'clock', label: '回款稳定性', value: '近12个月回款周期标准差仅3.2天，高度稳定' },
        { icon: 'trending', label: '三流匹配率', value: '94%，12个月无断单，发票集中度与订单集中度一致' },
        { icon: 'shield', label: '替代风险评估', value: '链主更换供应商成本高，产业链结构性绑定，非主动集中' },
        { icon: 'check', label: '历史案例匹配', value: '产业链结构性集中案例匹配度 76%，风险性集中假设支持度 12%' },
      ],
      pendingConfirms: [
        '是否采纳智能体建议（维持120万，不降额）',
        '是否附加回款须进入本行对公账户条件',
        '是否要求补充盛拓模组供货合同复印件',
      ],
      quickQA: [
        { q: '集中度72%为何不降额？', a: '72%集中度来自产业链结构性绑定，而非主动集中风险。鸿泰包装是盛拓模组的唯一指定供应商（合同至2027年），链主更换供应商的成本极高。这与"客户流失导致集中"的风险场景本质不同。' },
        { q: '规则为何会机械降额？', a: '规则引擎只看集中度数值（72% > 70%），无法判断集中的原因是"产业链绑定"还是"客户过度依赖"。这是规则的覆盖盲区——它看到了超阈值，但不知道背后的产业链结构。' },
        { q: '回款稳定性如何支撑判断？', a: '近12个月回款周期标准差仅3.2天，说明盛拓模组的付款行为极度规律。这是链主绑定关系稳定的最直接证据——如果关系不稳定，回款周期会有明显波动。' },
        { q: '附加回款归集条件的意义？', a: '要求回款进入本行对公账户，可以实时监控回款是否正常到账，一旦盛拓模组出现付款异常可立即预警。这是在维持额度的同时，对集中度风险的有效对冲。' },
      ],
      decisionAgentSteps: [
        { step: 1, label: '任务分解', tool: 'task_decompose', input: '集中度超阈值预警 + 订单微贷申请', output: '识别3个子任务：集中度成因分析、链主绑定稳定性评估、替代风险评估' },
        { step: 2, label: '主体核验', tool: 'entity_verify', input: '企业工商 + 合同信息', output: '与盛拓模组签订长期供货合同（2024-2027），唯一指定供应商条款', confidence: 95 },
        { step: 3, label: '财务分析', tool: 'financial_analyze', input: '近12个月回款数据', output: '月均回款 53.3万，回款周期 28±3.2天，标准差极低，回款高度稳定', confidence: 93 },
        { step: 4, label: '风险扫描', tool: 'risk_scan', input: '客户集中度结构', output: '⚠ 集中度72%超阈值，但盛拓模组为宁川新能源产业链核心节点，替换成本高', confidence: 88, flagged: true },
        { step: 5, label: '三流验证', tool: 'triple_flow_verify', input: '订单+发票+回款', output: '三流匹配率 94%，订单连续12个月无断单，发票集中度与订单集中度一致', confidence: 94 },
        { step: 6, label: '反思输出', tool: 'reflect_output', input: '以上5步推理结果', output: '产业链结构性集中，非主动集中风险，建议维持120万，置信度92%', confidence: 92 },
      ],
      reviewAgentSteps: [
        { step: 1, label: '异常分类', tool: 'anomaly_classify', input: '集中度超阈值 + 决策智能体推理', output: '分类：产业链结构性集中（非风险性集中），历史案例匹配度 76%' },
        { step: 2, label: '多假设验证', tool: 'hypothesis_verify', input: '合同结构 + 回款稳定性 + 替代风险', output: '假设A（结构性绑定）：合同/回款/产业链三项支持，支持度 88%\n假设B（风险性集中）：无替代客户开发迹象，支持度 12%' },
        { step: 3, label: '补充核实请求', tool: 'supplement_request', input: '验证结论', output: '建议补充：盛拓模组供货合同复印件（确认唯一供应商条款）' },
        { step: 4, label: '双路径输出', tool: 'dual_path_output', input: '验证结论', output: '路径A（推荐）：维持120万，附加回款归集条件\n路径B（保守）：降额至108万（90%），无需补充材料' },
      ],
      humanBoundary: 'agent_assist',
      finalRecommendation: '维持原额度 120 万，附加回款须进入本行对公账户条件，建议补充供货合同复印件',
      supplementRequired: '盛拓模组与鸿泰包装供货合同复印件（确认唯一供应商条款及合同期限）',
    },
  },
];
