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
    companyName: '深圳市裕同包装科技股份有限公司',
    shortName: '裕同包装',
    industry: '新能源包装材料',
    chainName: '新能源电池产业链',
    borrowerRole: '三级包装材料供应商',
    annualSalesRange: '680万',
    establishedYear: '2018',
    region: '广东深圳',
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
        label: '宁德时代',
        role: '链主企业',
        description: '动力电池制造龙头，决定整条链的采购需求节奏',
      },
      {
        id: 'tier2',
        label: '欣旺达',
        role: '二级供应商',
        tier: '二级',
        description: '向链主供货的电池模组企业，向裕同包装稳定采购包装材料',
      },
      {
        id: 'borrower',
        label: '裕同包装',
        role: '借款主体',
        tier: '三级',
        description: '为模组企业提供高频周转箱、缓冲包装和回收包装服务',
      },
      {
        id: 'logistics',
        label: '中外运物流',
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
    '近 90 天来自欣旺达的高频小额订单持续发生，未出现订单中断。',
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
      summary: '二级模组供应商向裕同包装持续发出高频小额订单，符合微型供应链场景特征。',
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
      description: '识别裕同包装为可经营的三级供应商主体。',
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
}

export const SAMPLES: ChainLoanSample[] = [
  {
    id: 'sample-hengyuan',
    companyName: '深圳市裕同包装科技股份有限公司',
    shortName: '裕同包装',
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
    mainChainPath: ['宁德时代', '欣旺达', '裕同包装'],
    keyCounterparty: '欣旺达',
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
  },
  {
    id: 'sample-jiali',
    companyName: '深圳王子新材料股份有限公司',
    shortName: '王子新材',
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
    mainChainPath: ['宁德时代', '欣旺达', '王子新材'],
    keyCounterparty: '欣旺达',
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
  },
  {
    id: 'sample-chiyuan',
    companyName: '中外运物流有限公司',
    shortName: '中外运物流',
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
    mainChainPath: ['宁德时代', '欣旺达', '中外运物流'],
    keyCounterparty: '欣旺达',
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
  },
  {
    id: 'sample-ruixin',
    companyName: '深圳新宙邦科技股份有限公司',
    shortName: '新宙邦',
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
    mainChainPath: ['宁德时代', '欣旺达', '新宙邦'],
    keyCounterparty: '欣旺达',
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
  },
  {
    id: 'sample-ruifeng',
    companyName: '江苏瑞泰新能源材料股份有限公司',
    shortName: '瑞泰新能源',
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
    mainChainPath: ['宁德时代', '欣旺达', '瑞泰新能源'],
    keyCounterparty: '欣旺达',
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
export const DEMO_DISCLAIMER = '企业名称为公开可检索主体，供应链关系、授信状态与风险状态为演示化示例。';

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
