# De-core Chain Loan Demo Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在当前“普惠资产引擎”原型中实现一条可操作、可交互、可演示的完整脱核链贷业务流程，从合作方接入、客群识别、预授信、审批、风险预警到贷后恢复经营全部可点击走通。

**Architecture:** 保留现有七个一级导航和 SceneLayout 架构，在其上增加一套全局 `demo case` 状态层和一组共享演示组件。通过一个固定的新能源产业链案例，把“合作方管理 -> 客群池 -> 授信资产池 -> 产品与审批 -> 风险监控 -> 贷后经营”串成单一剧情流，避免页面之间仍然只是概念展示。

**Tech Stack:** React 19, TypeScript, Vite, Motion, Tailwind CSS, shadcn/base-ui

---

## File Structure

### New demo domain files

- Create: `/Users/admin/Documents/test007/硅基工作台/src/demo/chainLoan/types.ts`
  责任：定义脱核链贷 demo 的领域类型、流程阶段、证据对象、动作枚举、审批状态、预警状态。

- Create: `/Users/admin/Documents/test007/硅基工作台/src/demo/chainLoan/data.ts`
  责任：提供固定案例数据，包括链主、三级供应商、物流平台、订单、发票、结算、物流履约、额度建议、风险事件。

- Create: `/Users/admin/Documents/test007/硅基工作台/src/demo/chainLoan/reducer.ts`
  责任：管理 demo 的状态流转逻辑，例如开始演示、查看证据、生成预授信、进入补审、批准授信、模拟风险、恢复经营。

- Create: `/Users/admin/Documents/test007/硅基工作台/src/demo/chainLoan/context.tsx`
  责任：提供全局 Context 和 hooks，让各场景页共享同一个案例状态。

### New shared demo components

- Create: `/Users/admin/Documents/test007/硅基工作台/src/components/demo/DemoStepper.tsx`
  责任：展示完整脱核链贷流程步骤，并高亮当前节点。

- Create: `/Users/admin/Documents/test007/硅基工作台/src/components/demo/CaseSummaryCard.tsx`
  责任：在多个页面重复展示当前案例概要，包括企业名称、额度、阶段、风险状态。

- Create: `/Users/admin/Documents/test007/硅基工作台/src/components/demo/ActionBar.tsx`
  责任：承载主操作按钮，例如“开始案例”“生成预授信”“批准授信”“模拟风险事件”等。

- Create: `/Users/admin/Documents/test007/硅基工作台/src/components/demo/EvidenceDrawer.tsx`
  责任：展示订单、发票、回款、物流四类经营证据。

- Create: `/Users/admin/Documents/test007/硅基工作台/src/components/demo/RiskEventPanel.tsx`
  责任：展示风险事件详情、处置建议和联动动作。

### Files to modify

- Modify: `/Users/admin/Documents/test007/硅基工作台/src/App.tsx`
  责任：挂载 demo context，并在全局导航层暴露“演示模式”状态。

- Modify: `/Users/admin/Documents/test007/硅基工作台/src/components/ProductPrimitives.tsx`
  责任：补充适合 demo 页复用的区块，如状态条、证据标签、流程提示等轻量 primitive。

- Modify: `/Users/admin/Documents/test007/硅基工作台/src/components/scenes/PartnerManagementScene.tsx`
  责任：作为 demo 起点，展示生态关系图和“开始案例”入口。

- Modify: `/Users/admin/Documents/test007/硅基工作台/src/components/scenes/CustomerPoolScene.tsx`
  责任：展示案例主体如何被识别出来，并支持查看经营证据。

- Modify: `/Users/admin/Documents/test007/硅基工作台/src/components/scenes/AssetPoolScene.tsx`
  责任：展示案例从线索进入预授信池、补审队列和资产池的状态变化。

- Modify: `/Users/admin/Documents/test007/硅基工作台/src/components/scenes/ProductApprovalScene.tsx`
  责任：展示规则命中、审批建议、人工补审和批准授信动作。

- Modify: `/Users/admin/Documents/test007/硅基工作台/src/components/scenes/RiskMonitorScene.tsx`
  责任：支持模拟风险事件，并联动额度收缩与复核。

- Modify: `/Users/admin/Documents/test007/硅基工作台/src/components/scenes/PostLoanScene.tsx`
  责任：展示风险后的恢复经营、续贷建议和重新进入经营池。

---

### Task 1: 建立脱核链贷 demo 的领域模型与全局状态

**Files:**
- Create: `/Users/admin/Documents/test007/硅基工作台/src/demo/chainLoan/types.ts`
- Create: `/Users/admin/Documents/test007/硅基工作台/src/demo/chainLoan/data.ts`
- Create: `/Users/admin/Documents/test007/硅基工作台/src/demo/chainLoan/reducer.ts`
- Create: `/Users/admin/Documents/test007/硅基工作台/src/demo/chainLoan/context.tsx`

- [ ] **Step 1: 定义 demo 核心类型**

在 `types.ts` 中定义最小但完整的流程对象：

```ts
export type DemoStage =
  | 'ecosystem'
  | 'identified'
  | 'pre_credit'
  | 'manual_review'
  | 'approved'
  | 'risk_alert'
  | 'post_loan_recovery';

export type EvidenceType = 'order' | 'invoice' | 'settlement' | 'logistics';

export interface ChainLoanEvidence {
  id: string;
  type: EvidenceType;
  title: string;
  summary: string;
  value: string;
}

export interface ChainLoanCase {
  id: string;
  name: string;
  chainName: string;
  borrowerRole: string;
  creditLimit: string;
  currentStage: DemoStage;
  approved: boolean;
  riskTriggered: boolean;
  evidence: ChainLoanEvidence[];
}
```

- [ ] **Step 2: 固定一个单案例 demo 数据**

在 `data.ts` 中建立唯一案例：

```ts
export const chainLoanDemoCase: ChainLoanCase = {
  id: 'case_battery_packaging_001',
  name: '常州衡远包装材料有限公司',
  chainName: '新能源电池产业链',
  borrowerRole: '三级包装材料供应商',
  creditLimit: '120万',
  currentStage: 'ecosystem',
  approved: false,
  riskTriggered: false,
  evidence: [
    {
      id: 'ev_order_001',
      type: 'order',
      title: '近90天订单稳定',
      summary: '来自二级模组供应商的高频小额订单持续发生',
      value: '累计订单额 386万',
    },
  ],
};
```

- [ ] **Step 3: 编写 reducer 管理状态流转**

在 `reducer.ts` 中定义动作：

```ts
export type ChainLoanDemoAction =
  | { type: 'start_demo' }
  | { type: 'view_evidence' }
  | { type: 'generate_pre_credit' }
  | { type: 'send_manual_review' }
  | { type: 'approve_credit' }
  | { type: 'trigger_risk' }
  | { type: 'recover_case' };
```

和 reducer 主体：

```ts
export function chainLoanDemoReducer(
  state: ChainLoanCase,
  action: ChainLoanDemoAction,
): ChainLoanCase {
  switch (action.type) {
    case 'start_demo':
      return { ...state, currentStage: 'identified' };
    case 'generate_pre_credit':
      return { ...state, currentStage: 'pre_credit' };
    case 'send_manual_review':
      return { ...state, currentStage: 'manual_review' };
    case 'approve_credit':
      return { ...state, currentStage: 'approved', approved: true };
    case 'trigger_risk':
      return { ...state, currentStage: 'risk_alert', riskTriggered: true };
    case 'recover_case':
      return { ...state, currentStage: 'post_loan_recovery' };
    default:
      return state;
  }
}
```

- [ ] **Step 4: 提供 context 和 hook**

在 `context.tsx` 中暴露：

```ts
export function ChainLoanDemoProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(chainLoanDemoReducer, chainLoanDemoCase);
  return (
    <ChainLoanDemoContext.Provider value={{ state, dispatch }}>
      {children}
    </ChainLoanDemoContext.Provider>
  );
}

export function useChainLoanDemo() {
  const context = React.useContext(ChainLoanDemoContext);
  if (!context) throw new Error('useChainLoanDemo must be used within ChainLoanDemoProvider');
  return context;
}
```

- [ ] **Step 5: 运行类型检查确认新领域层无报错**

Run: `npm run lint`

Expected: `tsc --noEmit` exits successfully with no TypeScript errors

---

### Task 2: 搭建可复用的演示组件层

**Files:**
- Create: `/Users/admin/Documents/test007/硅基工作台/src/components/demo/DemoStepper.tsx`
- Create: `/Users/admin/Documents/test007/硅基工作台/src/components/demo/CaseSummaryCard.tsx`
- Create: `/Users/admin/Documents/test007/硅基工作台/src/components/demo/ActionBar.tsx`
- Create: `/Users/admin/Documents/test007/硅基工作台/src/components/demo/EvidenceDrawer.tsx`
- Create: `/Users/admin/Documents/test007/硅基工作台/src/components/demo/RiskEventPanel.tsx`
- Modify: `/Users/admin/Documents/test007/硅基工作台/src/components/ProductPrimitives.tsx`

- [ ] **Step 1: 创建流程步骤条**

`DemoStepper.tsx` 显示固定六步：

```ts
const steps = [
  '生态接入',
  '客群识别',
  '预授信',
  '审批通过',
  '风险预警',
  '贷后恢复',
];
```

要求：

- 支持根据 `currentStage` 高亮
- 横向显示
- 适合所有场景页顶部复用

- [ ] **Step 2: 创建案例摘要卡**

`CaseSummaryCard.tsx` 展示：

- 企业名
- 所属产业链
- 主体角色
- 当前额度
- 当前阶段
- 风险状态

- [ ] **Step 3: 创建通用动作条**

`ActionBar.tsx` 提供统一底部操作区：

```tsx
<ActionBar
  primaryLabel="生成预授信"
  onPrimaryClick={...}
  secondaryLabel="查看经营证据"
  onSecondaryClick={...}
/>
```

- [ ] **Step 4: 创建证据抽屉**

`EvidenceDrawer.tsx` 展示订单、发票、回款、物流证据卡，最少支持：

- 打开 / 关闭
- 列表展示四类证据
- 显示摘要和关键数值

- [ ] **Step 5: 创建风险事件面板**

`RiskEventPanel.tsx` 显示：

- 风险事件名称
- 触发原因
- 建议动作
- 当前是否已处置

- [ ] **Step 6: 运行构建确认组件层可编译**

Run: `npm run build`

Expected: Vite production build succeeds

---

### Task 3: 在应用入口挂载 demo provider 并暴露演示模式

**Files:**
- Modify: `/Users/admin/Documents/test007/硅基工作台/src/App.tsx`

- [ ] **Step 1: 用 provider 包裹应用内容**

把 `App` 中的主结构包裹到：

```tsx
<ChainLoanDemoProvider>
  ...
</ChainLoanDemoProvider>
```

- [ ] **Step 2: 顶部增加“脱核链贷演示中”状态**

在现有 badge 区域新增演示状态标签，例如：

```tsx
<Badge className="hidden xl:flex bg-[#FFF7ED] text-[#C2410C] border border-[#FED7AA] gap-1">
  脱核链贷演示中
</Badge>
```

- [ ] **Step 3: 为后续场景页预留统一 demo 提示区域**

确保各页面顶部已具备空间放入 `DemoStepper` 和 `CaseSummaryCard`。

- [ ] **Step 4: 运行类型检查**

Run: `npm run lint`

Expected: `tsc --noEmit` exits successfully with no TypeScript errors

---

### Task 4: 把合作方管理页改成案例入口页

**Files:**
- Modify: `/Users/admin/Documents/test007/硅基工作台/src/components/scenes/PartnerManagementScene.tsx`

- [ ] **Step 1: 在默认模块加入 DemoStepper 和 CaseSummaryCard**

在默认视图顶部加入：

```tsx
<DemoStepper />
<CaseSummaryCard />
```

- [ ] **Step 2: 增加产业链生态关系图块**

新加一个区块，至少包含四个节点：

- 链主企业
- 二级供应商
- 三级包装材料供应商（当前案例）
- 物流平台

并明确说明：当前授信对象不是核心企业直接供应商，而是更深层链上主体。

- [ ] **Step 3: 增加“开始案例”主按钮**

点击后执行：

```ts
dispatch({ type: 'start_demo' });
```

并提示用户下一步去“客群池”查看识别过程。

- [ ] **Step 4: 增加“进入客群池”导航按钮**

按钮文案建议：

- `开始脱核链贷演示`
- `下一步：查看客户识别`

---

### Task 5: 把客群池页改成“识别原因 + 证据查看”页

**Files:**
- Modify: `/Users/admin/Documents/test007/硅基工作台/src/components/scenes/CustomerPoolScene.tsx`

- [ ] **Step 1: 在 `long-tail` 模块中绑定固定案例**

把当前“长尾客群”模块改为案例主视图，展示：

- 企业名称
- 所属链条
- 角色
- 年销售额范围
- 为什么能被识别

- [ ] **Step 2: 加入“识别原因卡”**

至少显示四个识别信号：

- 高频订单稳定
- 回款链条清晰
- 物流履约连续
- 上下游关系稳定

- [ ] **Step 3: 接入 EvidenceDrawer**

增加按钮：

```tsx
<Button onClick={() => setEvidenceOpen(true)}>查看经营证据</Button>
```

打开证据抽屉后，展示固定案例的四类证据。

- [ ] **Step 4: 增加“生成预授信”按钮**

点击后执行：

```ts
dispatch({ type: 'generate_pre_credit' });
```

并在 UI 上提示下一步进入“授信资产池”。

---

### Task 6: 把授信资产池页改成状态流转页

**Files:**
- Modify: `/Users/admin/Documents/test007/硅基工作台/src/components/scenes/AssetPoolScene.tsx`

- [ ] **Step 1: 在默认视图中高亮案例当前所在状态**

要求最少有四个状态列：

- 识别中
- 预授信池
- 补审队列
- 在营资产

案例卡片根据 `currentStage` 动态落在对应区块。

- [ ] **Step 2: 在 `pre-credit` 模块展示额度建议**

展示：

- 建议额度：120 万
- 产品名称：订单微贷
- 数据依据：订单 + 回款 + 物流履约

- [ ] **Step 3: 增加“提交补审”按钮**

点击后执行：

```ts
dispatch({ type: 'send_manual_review' });
```

并把案例状态移动到补审队列。

- [ ] **Step 4: 在 `review` 模块里显示人工补审说明**

明确告诉演示对象：

- 为什么进入补审
- 审批人会看到哪些经营实质证据
- 为什么这类客户最值得产品化支持

---

### Task 7: 把产品与审批页改成可批准授信的页面

**Files:**
- Modify: `/Users/admin/Documents/test007/硅基工作台/src/components/scenes/ProductApprovalScene.tsx`

- [ ] **Step 1: 在 `workflow` 模块中展示审批三栏**

建议布局：

- 左栏：经营证据摘要
- 中栏：规则命中情况
- 右栏：额度与产品建议

- [ ] **Step 2: 增加规则命中清单**

例如：

- 订单稳定性满足准入
- 回款集中度可控
- 物流履约连续
- 非核心确权模式下需人工补审

- [ ] **Step 3: 增加“批准授信”主按钮**

点击后执行：

```ts
dispatch({ type: 'approve_credit' });
```

并同步显示：

- 授信额度 120 万
- 产品已生效
- 下一步进入风险监控

- [ ] **Step 4: 增加“退回补充材料”次按钮**

此按钮不需要复杂状态，只需要在原型里展示另一条可能动作，增强真实感。

---

### Task 8: 把风险监控页改成可模拟风险事件的页面

**Files:**
- Modify: `/Users/admin/Documents/test007/硅基工作台/src/components/scenes/RiskMonitorScene.tsx`

- [ ] **Step 1: 在默认视图中接入案例当前风险状态**

显示：

- 当前是否已触发风险
- 当前额度是否收缩
- 当前动作建议

- [ ] **Step 2: 增加“模拟风险事件”按钮**

点击后执行：

```ts
dispatch({ type: 'trigger_risk' });
```

风险事件固定为：

- 回款周期拉长
- 物流履约延迟

- [ ] **Step 3: 用 RiskEventPanel 展示事件详情**

要求包含：

- 触发时间
- 触发原因
- 系统建议动作
- 当前是否已执行降额 / 复核

- [ ] **Step 4: 明确下一步进入贷后经营**

增加按钮或提示：

- `查看恢复经营建议`

---

### Task 9: 把贷后经营页改成“恢复经营与续贷建议”页

**Files:**
- Modify: `/Users/admin/Documents/test007/硅基工作台/src/components/scenes/PostLoanScene.tsx`

- [ ] **Step 1: 展示风险后恢复逻辑**

说明：

- 客户补充了新的订单证明
- 回款链条恢复
- 物流延迟已解除

- [ ] **Step 2: 增加“恢复经营”主按钮**

点击后执行：

```ts
dispatch({ type: 'recover_case' });
```

- [ ] **Step 3: 展示恢复后动作建议**

至少包括：

- 恢复部分额度
- 进入重点经营池
- 推荐续贷 / 提额观察

- [ ] **Step 4: 用文案完成全流程闭环**

页面底部明确写出：

`该案例已完成从生态接入、识别、授信、风险预警到贷后恢复经营的完整脱核链贷演示闭环。`

---

### Task 10: 做统一演示串联与最终验证

**Files:**
- Modify: `/Users/admin/Documents/test007/硅基工作台/src/App.tsx`
- Modify: `/Users/admin/Documents/test007/硅基工作台/src/components/scenes/PartnerManagementScene.tsx`
- Modify: `/Users/admin/Documents/test007/硅基工作台/src/components/scenes/CustomerPoolScene.tsx`
- Modify: `/Users/admin/Documents/test007/硅基工作台/src/components/scenes/AssetPoolScene.tsx`
- Modify: `/Users/admin/Documents/test007/硅基工作台/src/components/scenes/ProductApprovalScene.tsx`
- Modify: `/Users/admin/Documents/test007/硅基工作台/src/components/scenes/RiskMonitorScene.tsx`
- Modify: `/Users/admin/Documents/test007/硅基工作台/src/components/scenes/PostLoanScene.tsx`

- [ ] **Step 1: 统一所有页面顶部显示 DemoStepper + CaseSummaryCard**

目标：无论切到哪个页面，演示对象都能立即知道当前案例走到哪一步。

- [ ] **Step 2: 统一所有页面底部显示下一步动作**

目标：讲解者不需要口头解释“接下来去哪”，页面自己给出路径提示。

- [ ] **Step 3: 跑一次完整手动演示**

按以下顺序点击：

1. 合作方管理 -> 开始脱核链贷演示
2. 客群池 -> 查看经营证据 -> 生成预授信
3. 授信资产池 -> 提交补审
4. 产品与审批 -> 批准授信
5. 风险监控 -> 模拟风险事件
6. 贷后经营 -> 恢复经营

Expected:

- 每一步状态变化清晰
- 页面之间有连续叙事
- 没有“只能看不能点”的断点

- [ ] **Step 4: 运行最终检查**

Run: `npm run lint`

Expected: PASS

Run: `npm run build`

Expected: PASS

---

## Spec Coverage Check

本计划覆盖了用户要的三件事：

- 文件级 implementation plan：已明确新增文件、修改文件与职责
- 可操作：每一步都有具体按钮动作与状态流转
- 可交互演示完整脱核链贷流程：已串起合作方接入、客户识别、预授信、审批、风险预警、贷后恢复六步

## Notes

- 当前 repo 没有现成测试框架，本计划以 `npm run lint`、`npm run build` 和完整手动演示作为主验证方式。
- 如果后续要进一步增强稳定性，可以在第二阶段为 `src/demo/chainLoan/reducer.ts` 增加纯函数单元测试，但不建议把这件事放在本次演示闭环之前。
