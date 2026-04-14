/**
 * PoC 主链测试样本数据
 * 对应 名单导入测试_新能源链_20260413.csv 中的 15 条企业
 * 覆盖主链各关键节点：识别 → 尽调 → 审批 → 监控 → 经营
 *
 * 使用方式：将 POC_SAMPLES 合并到 SAMPLES 数组，或单独用于测试页面
 */

import type { ChainLoanSample } from '../chainLoan/data';

export const POC_SAMPLES: ChainLoanSample[] = [

  // ── 第一组：核心主链验证 ──────────────────────────────

  // #1 衡远包装 — 标准主链最优路径（已在 SAMPLES 中，此处作为参考）
  // 见 data.ts SAMPLES[0]

  // #3 驰远物流 — 产品差异化（运费贷）
  // 见 data.ts SAMPLES[2]

  // #4 锐信新材 — 集中度规则触发降额
  // 见 data.ts SAMPLES[3]

  // #6 鑫达精密 — 高质量主体，快速通道
  {
    id: 'poc-xinda-precision',
    companyName: '常熟鑫达精密零件有限公司',
    shortName: '鑫达精密',
    chainName: '新能源电池产业链',
    roleInChain: '二级精密零件供应商',
    segmentTag: 'A可授信',
    stage: 'pre_credit',
    productType: '订单微贷',
    annualSales: '1860万',
    recommendedLimit: '200万',
    currentLimit: '200万',
    approvalStatus: '待预授信',
    riskStatus: '正常',
    relationStrength: 91,
    authenticityScore: 94,
    evidenceCoverage: 93,
    mainChainPath: ['宁川新能源', '盛拓模组科技', '鑫达精密'],
    keyCounterparty: '盛拓模组科技',
    orderCount90d: 31,
    orderAmount90d: '412万',
    invoiceContinuityMonths: 12,
    maxCustomerConcentration: '38%',
    avgReceivableCycle: '28天',
    logisticsStatus: '签收稳定，时效优秀',
    accountFlowStatus: '月均净流入 38万',
    riskFlags: [],
    reviewReason: '三流匹配度高，证据覆盖充分，建议直接进入预审',
    aiSummary: '订单、发票、回款、物流四流高度匹配，主体经营真实性强，建议直接进入预审通道。',
    nextAction: '进入预审',
    uiState: { badgeTone: 'green', priority: 'high', featured: true },
    agentHints: { confidence: 94, suggestedAgent: '预授信引擎', suggestedAction: '生成预授信方案并直接推单' },
  },

  // ── 第二组：异常处理验证 ──────────────────────────────

  // #2 佳利包装 — 证据不足，进入观察池
  // 见 data.ts SAMPLES[1]

  // #5 瑞丰辅料 — 风险预警 → 恢复经营
  // 见 data.ts SAMPLES[4]

  // #9 顺达包装 — 字段校验异常，待修正
  {
    id: 'poc-shunda-packaging',
    companyName: '扬州顺达包装制品有限公司',
    shortName: '顺达包装',
    chainName: '新能源电池产业链',
    roleInChain: '三级包装制品供应商',
    segmentTag: 'C待观察',
    stage: 'identified',
    productType: '订单微贷',
    annualSales: '310万',
    recommendedLimit: '40万',
    currentLimit: '0',
    approvalStatus: '待预授信',
    riskStatus: '观察',
    relationStrength: 41,
    authenticityScore: 38,
    evidenceCoverage: 35,
    mainChainPath: ['宁川新能源', '盛拓模组科技', '顺达包装'],
    keyCounterparty: '盛拓模组科技',
    orderCount90d: 5,
    orderAmount90d: '22万',
    invoiceContinuityMonths: 4,
    maxCustomerConcentration: '71%',
    avgReceivableCycle: '52天',
    logisticsStatus: '运单记录不完整',
    accountFlowStatus: '流水数据缺失',
    riskFlags: ['证据覆盖严重不足', '客户集中度过高', '开票连续性不足'],
    reviewReason: '新进入链条，经营证据严重不足，需补充材料后才能进入识别',
    aiSummary: '链路关系存在但经营证据极度不足，建议暂停推进，要求补充完整材料后重新评估。',
    nextAction: '补充材料',
    uiState: { badgeTone: 'slate', priority: 'low', featured: false },
    agentHints: { confidence: 28, suggestedAgent: '识别引擎', suggestedAction: '暂停推进，要求补充材料' },
  },

  // ── 第三组：边界场景验证 ──────────────────────────────

  // #7 绿能新材 — 成立时间短，待人工确认
  {
    id: 'poc-lvneng-materials',
    companyName: '南京绿能新材料科技有限公司',
    shortName: '绿能新材',
    chainName: '新能源电池产业链',
    roleInChain: '三级新材料供应商',
    segmentTag: 'B可做但需处理',
    stage: 'identified',
    productType: '订单微贷',
    annualSales: '480万',
    recommendedLimit: '60万',
    currentLimit: '0',
    approvalStatus: '待预授信',
    riskStatus: '观察',
    relationStrength: 68,
    authenticityScore: 72,
    evidenceCoverage: 65,
    mainChainPath: ['宁川新能源', '盛拓模组科技', '绿能新材'],
    keyCounterparty: '盛拓模组科技',
    orderCount90d: 14,
    orderAmount90d: '86万',
    invoiceContinuityMonths: 8,
    maxCustomerConcentration: '55%',
    avgReceivableCycle: '38天',
    logisticsStatus: '履约基本正常',
    accountFlowStatus: '月均净流入 9万，增长趋势明显',
    riskFlags: ['成立时间不足3年'],
    reviewReason: '经营数据向好但成立时间仅6年，需人工确认经营连续性与实控人背景',
    aiSummary: '订单增长趋势明显，但成立时间较短，建议人工核验实控人背景与经营连续性后再推进。',
    nextAction: '人工确认',
    uiState: { badgeTone: 'amber', priority: 'medium', featured: false },
    agentHints: { confidence: 65, suggestedAgent: '识别引擎', suggestedAction: '触发人工确认流程' },
  },

  // #8 华盛电子 — 发票连续性通过，正向路径
  {
    id: 'poc-huasheng-electronics',
    companyName: '镇江华盛电子元器件有限公司',
    shortName: '华盛电子',
    chainName: '新能源电池产业链',
    roleInChain: '三级电子元器件供应商',
    segmentTag: 'A可授信',
    stage: 'pre_credit',
    productType: '订单微贷',
    annualSales: '720万',
    recommendedLimit: '100万',
    currentLimit: '100万',
    approvalStatus: '待预授信',
    riskStatus: '正常',
    relationStrength: 82,
    authenticityScore: 86,
    evidenceCoverage: 84,
    mainChainPath: ['宁川新能源', '盛拓模组科技', '华盛电子'],
    keyCounterparty: '盛拓模组科技',
    orderCount90d: 19,
    orderAmount90d: '168万',
    invoiceContinuityMonths: 12,
    maxCustomerConcentration: '44%',
    avgReceivableCycle: '31天',
    logisticsStatus: '签收稳定',
    accountFlowStatus: '月均净流入 16万',
    riskFlags: [],
    reviewReason: '发票连续12个月，三流匹配良好，建议进入预授信',
    aiSummary: '发票连续性达标，订单与回款匹配度高，主体经营真实，建议进入预授信流程。',
    nextAction: '进入预审',
    uiState: { badgeTone: 'blue', priority: 'high', featured: false },
    agentHints: { confidence: 86, suggestedAgent: '预授信引擎', suggestedAction: '生成预授信方案' },
  },

  // #10 明辉化工 — 在营提额申请
  {
    id: 'poc-minghui-chemical',
    companyName: '泰州明辉化工材料有限公司',
    shortName: '明辉化工',
    chainName: '新能源电池产业链',
    roleInChain: '二级化工材料供应商',
    segmentTag: 'A可授信',
    stage: 'approved',
    productType: '订单微贷',
    annualSales: '1420万',
    recommendedLimit: '180万',
    currentLimit: '150万',
    approvalStatus: '已批准',
    riskStatus: '正常',
    relationStrength: 88,
    authenticityScore: 91,
    evidenceCoverage: 89,
    mainChainPath: ['宁川新能源', '盛拓模组科技', '明辉化工'],
    keyCounterparty: '盛拓模组科技',
    orderCount90d: 26,
    orderAmount90d: '356万',
    invoiceContinuityMonths: 12,
    maxCustomerConcentration: '41%',
    avgReceivableCycle: '29天',
    logisticsStatus: '履约优秀',
    accountFlowStatus: '月均净流入 42万，持续增长',
    riskFlags: [],
    reviewReason: '已授信150万，近期订单增长明显，主动申请提额至180万',
    aiSummary: '在营表现优秀，订单持续增长，回款稳定，建议支持提额申请至180万。',
    nextAction: '进入提额审批',
    uiState: { badgeTone: 'green', priority: 'medium', featured: false },
    agentHints: { confidence: 91, suggestedAgent: '经营引擎', suggestedAction: '发起提额审批流程' },
  },

  // #14 东方配件 — 订单下滑预警
  {
    id: 'poc-dongfang-parts',
    companyName: '盐城东方新能源配件有限公司',
    shortName: '东方配件',
    chainName: '新能源电池产业链',
    roleInChain: '三级配件供应商',
    segmentTag: 'B可做但需处理',
    stage: 'risk_alert',
    productType: '订单微贷',
    annualSales: '680万',
    recommendedLimit: '90万',
    currentLimit: '72万',
    approvalStatus: '已降额',
    riskStatus: '中度预警',
    relationStrength: 76,
    authenticityScore: 79,
    evidenceCoverage: 74,
    mainChainPath: ['宁川新能源', '盛拓模组科技', '东方配件'],
    keyCounterparty: '盛拓模组科技',
    orderCount90d: 9,
    orderAmount90d: '61万',
    invoiceContinuityMonths: 10,
    maxCustomerConcentration: '53%',
    avgReceivableCycle: '44天',
    logisticsStatus: '近期2笔延迟签收',
    accountFlowStatus: '连续3周净流出',
    riskFlags: ['订单量下滑超20%', '回款周期拉长'],
    reviewReason: '近90天订单量较上季度下滑22%，回款周期拉长，触发订单稳定性预警',
    aiSummary: '订单下滑与回款拉长同时出现，建议临时收缩额度并启动人工复核，核查上游采购节奏变化。',
    nextAction: '进入风险处置',
    uiState: { badgeTone: 'red', priority: 'high', featured: true },
    agentHints: { confidence: 62, suggestedAgent: '预警引擎', suggestedAction: '触发额度收缩 + 人工复核' },
  },

  // ── 第四组：数据质量验证 ──────────────────────────────

  // #11 联合物流 — 运单数据完整，快速通过
  {
    id: 'poc-lianhe-logistics',
    companyName: '徐州联合物流配送有限公司',
    shortName: '联合物流',
    chainName: '新能源电池产业链',
    roleInChain: '链上配送服务商',
    segmentTag: 'B可做但需处理',
    stage: 'pre_credit',
    productType: '运费贷',
    annualSales: '390万',
    recommendedLimit: '50万',
    currentLimit: '50万',
    approvalStatus: '待预授信',
    riskStatus: '正常',
    relationStrength: 71,
    authenticityScore: 78,
    evidenceCoverage: 73,
    mainChainPath: ['宁川新能源', '盛拓模组科技', '联合物流'],
    keyCounterparty: '盛拓模组科技',
    orderCount90d: 84,
    orderAmount90d: '28万',
    invoiceContinuityMonths: 11,
    maxCustomerConcentration: '48%',
    avgReceivableCycle: '18天',
    logisticsStatus: '运单数据完整，签收率99%',
    accountFlowStatus: '结算频次高，回款规律',
    riskFlags: ['产品需差异化匹配'],
    reviewReason: '运单数据完整，但业务模式为配送服务，需匹配运费贷产品',
    aiSummary: '运单频次高，履约数据完整，更适合运费贷产品，建议进入产品匹配流程。',
    nextAction: '进入产品匹配',
    uiState: { badgeTone: 'amber', priority: 'medium', featured: false },
    agentHints: { confidence: 74, suggestedAgent: '产品匹配引擎', suggestedAction: '匹配运费贷产品方案' },
  },

  // #12 海通包装 — 物流数据需核实（地处偏远）
  {
    id: 'poc-haitong-packaging',
    companyName: '连云港海通包装材料有限公司',
    shortName: '海通包装',
    chainName: '新能源电池产业链',
    roleInChain: '三级包装材料供应商',
    segmentTag: 'C待观察',
    stage: 'identified',
    productType: '订单微贷',
    annualSales: '340万',
    recommendedLimit: '45万',
    currentLimit: '0',
    approvalStatus: '待预授信',
    riskStatus: '观察',
    relationStrength: 58,
    authenticityScore: 61,
    evidenceCoverage: 54,
    mainChainPath: ['宁川新能源', '盛拓模组科技', '海通包装'],
    keyCounterparty: '盛拓模组科技',
    orderCount90d: 11,
    orderAmount90d: '58万',
    invoiceContinuityMonths: 9,
    maxCustomerConcentration: '62%',
    avgReceivableCycle: '43天',
    logisticsStatus: '物流数据不完整，部分运单无法核实',
    accountFlowStatus: '流水数据基本正常',
    riskFlags: ['物流佐证不完整', '地域核实难度高'],
    reviewReason: '地处连云港，物流平台覆盖不完整，部分运单无法通过系统核实，需外勤补充',
    aiSummary: '订单和发票数据基本正常，但物流履约证据不完整，建议安排外勤核实后再推进。',
    nextAction: '安排外勤核实',
    uiState: { badgeTone: 'slate', priority: 'low', featured: false },
    agentHints: { confidence: 52, suggestedAgent: '识别引擎', suggestedAction: '触发外勤核实任务' },
  },

  // #13 新锐精密 — 回款周期偏长，进入人工确认
  {
    id: 'poc-xinrui-precision',
    companyName: '淮安新锐精密制造有限公司',
    shortName: '新锐精密',
    chainName: '新能源电池产业链',
    roleInChain: '二级精密制造供应商',
    segmentTag: 'B可做但需处理',
    stage: 'pre_credit',
    productType: '订单微贷',
    annualSales: '1180万',
    recommendedLimit: '160万',
    currentLimit: '160万',
    approvalStatus: '待预授信',
    riskStatus: '观察',
    relationStrength: 79,
    authenticityScore: 83,
    evidenceCoverage: 80,
    mainChainPath: ['宁川新能源', '盛拓模组科技', '新锐精密'],
    keyCounterparty: '盛拓模组科技',
    orderCount90d: 16,
    orderAmount90d: '298万',
    invoiceContinuityMonths: 12,
    maxCustomerConcentration: '47%',
    avgReceivableCycle: '58天',
    logisticsStatus: '履约正常',
    accountFlowStatus: '月均净流入 22万，但回款周期偏长',
    riskFlags: ['回款周期超过阈值（58天）'],
    reviewReason: '订单和发票数据良好，但回款周期58天超过45天阈值，需人工确认账期合理性',
    aiSummary: '主体经营真实，但回款周期偏长，建议人工确认账期安排是否合理，再决定是否进入预审。',
    nextAction: '人工确认账期',
    uiState: { badgeTone: 'amber', priority: 'medium', featured: false },
    agentHints: { confidence: 72, suggestedAgent: '规则引擎', suggestedAction: '触发回款周期人工确认' },
  },

  // #15 华宇塑料 — 材料不足，停留在材料解析
  {
    id: 'poc-huayu-plastic',
    companyName: '宿迁华宇塑料制品有限公司',
    shortName: '华宇塑料',
    chainName: '新能源电池产业链',
    roleInChain: '三级塑料制品供应商',
    segmentTag: 'C待观察',
    stage: 'identified',
    productType: '订单微贷',
    annualSales: '260万',
    recommendedLimit: '30万',
    currentLimit: '0',
    approvalStatus: '待预授信',
    riskStatus: '观察',
    relationStrength: 44,
    authenticityScore: 42,
    evidenceCoverage: 38,
    mainChainPath: ['宁川新能源', '盛拓模组科技', '华宇塑料'],
    keyCounterparty: '盛拓模组科技',
    orderCount90d: 6,
    orderAmount90d: '31万',
    invoiceContinuityMonths: 5,
    maxCustomerConcentration: '68%',
    avgReceivableCycle: '47天',
    logisticsStatus: '运单记录不完整',
    accountFlowStatus: '流水数据缺失，无法核实',
    riskFlags: ['成立时间不足3年', '材料严重缺失', '证据覆盖不足'],
    reviewReason: '成立仅3年，缺少法人身份证、合同影像和发票材料，无法进入证据核验',
    aiSummary: '成立时间短，关键材料严重缺失，当前无法推进尽调，建议要求补充完整材料后重新评估。',
    nextAction: '补充材料',
    uiState: { badgeTone: 'slate', priority: 'low', featured: false },
    agentHints: { confidence: 25, suggestedAgent: '识别引擎', suggestedAction: '暂停推进，要求补充材料' },
  },
];

/**
 * 完整的 PoC 测试样本（包含原有 5 条 + 新增 10 条）
 * 可替换 data.ts 中的 SAMPLES 用于 PoC 演示
 */
export const ALL_POC_SAMPLES_IDS = [
  // 原有 5 条（覆盖核心主链）
  'sample-hengyuan',   // 衡远包装 — 补审 → 批准
  'sample-jiali',      // 佳利包装 — 观察池
  'sample-chiyuan',    // 驰远物流 — 运费贷
  'sample-ruixin',     // 锐信新材 — 降额
  'sample-ruifeng',    // 瑞丰辅料 — 风险恢复
  // 新增 10 条（覆盖边界场景）
  'poc-xinda-precision',    // 鑫达精密 — 快速通道
  'poc-shunda-packaging',   // 顺达包装 — 字段异常
  'poc-lvneng-materials',   // 绿能新材 — 成立时间短
  'poc-huasheng-electronics', // 华盛电子 — 发票连续性
  'poc-minghui-chemical',   // 明辉化工 — 提额申请
  'poc-dongfang-parts',     // 东方配件 — 订单下滑预警
  'poc-lianhe-logistics',   // 联合物流 — 运单数据
  'poc-haitong-packaging',  // 海通包装 — 物流核实
  'poc-xinrui-precision',   // 新锐精密 — 回款周期
  'poc-huayu-plastic',      // 华宇塑料 — 材料缺失
];
