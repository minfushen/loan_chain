# Product Prototype Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 将当前“硅基工作台”原型从综合工作台重构为“数字普惠 2.0 资产生成系统”产品骨架，使信息架构、一级导航和核心页面叙事与正式产品方案一致。

**Architecture:** 保留现有 React + Vite + SceneLayout 架构，替换顶层场景定义与页面内容，优先完成新的一级菜单、首页驾驶舱和六个核心业务页面的静态产品骨架。通过复用现有 UI 组件和布局模式控制改动范围，同时让原型从“功能清单”转向“资产生成链路”表达。

**Tech Stack:** React 19, TypeScript, Vite, Motion, lucide-react, shadcn/base-ui, Tailwind CSS

---

### Task 1: 对齐顶层信息架构

**Files:**
- Modify: `/Users/admin/Documents/test007/硅基工作台/src/types.ts`
- Modify: `/Users/admin/Documents/test007/硅基工作台/src/constants.ts`

- [ ] **Step 1: 更新场景枚举与模块类型**

将 `SceneId` 从旧的业务工作台场景改为新的资产生成链路：

```ts
export type SceneId =
  | 'cockpit'
  | 'customer-pool'
  | 'asset-pool'
  | 'product-approval'
  | 'risk-monitor'
  | 'post-loan'
  | 'partner-management';
```

- [ ] **Step 2: 重写 `SCENES` 配置**

把旧的 `home/acquisition/retention/risk/tools/data` 替换为：

```ts
{ id: 'cockpit', title: '场景驾驶舱', ... }
{ id: 'customer-pool', title: '客群池', ... }
{ id: 'asset-pool', title: '授信资产池', ... }
{ id: 'product-approval', title: '产品与审批', ... }
{ id: 'risk-monitor', title: '风险监控', ... }
{ id: 'post-loan', title: '贷后经营', ... }
{ id: 'partner-management', title: '合作方管理', ... }
```

- [ ] **Step 3: 为每个场景补充新的模块定义**

示例：

```ts
modules: [
  { id: 'overview', title: '资产总览', description: '数字普惠 2.0 总览' },
  { id: 'mvp', title: 'MVP 路线', description: '第一阶段产品切入' },
]
```

---

### Task 2: 替换顶层应用路由与导航

**Files:**
- Modify: `/Users/admin/Documents/test007/硅基工作台/src/App.tsx`

- [ ] **Step 1: 替换默认场景**

把默认场景从旧首页切到新驾驶舱：

```ts
const [activeScene, setActiveScene] = useState<SceneId>('cockpit');
```

- [ ] **Step 2: 替换页面导入**

用新页面组件替换旧页面组件导入。

- [ ] **Step 3: 更新 `renderScene` 分发逻辑**

按新 `SceneId` 返回新的场景页面。

- [ ] **Step 4: 更新导航标题与搜索占位文案**

让顶部导航和全局文案与“资产生成系统”定位一致，例如：

```tsx
<span className="font-bold text-xl tracking-tight text-[#0F172A]">
  普惠资产引擎
</span>
```

和：

```tsx
placeholder="搜索银行模板、场景包、规则..."
```

---

### Task 3: 新建产品化场景页面

**Files:**
- Create: `/Users/admin/Documents/test007/硅基工作台/src/components/scenes/CockpitScene.tsx`
- Create: `/Users/admin/Documents/test007/硅基工作台/src/components/scenes/CustomerPoolScene.tsx`
- Create: `/Users/admin/Documents/test007/硅基工作台/src/components/scenes/AssetPoolScene.tsx`
- Create: `/Users/admin/Documents/test007/硅基工作台/src/components/scenes/ProductApprovalScene.tsx`
- Create: `/Users/admin/Documents/test007/硅基工作台/src/components/scenes/RiskMonitorScene.tsx`
- Create: `/Users/admin/Documents/test007/硅基工作台/src/components/scenes/PostLoanScene.tsx`
- Create: `/Users/admin/Documents/test007/硅基工作台/src/components/scenes/PartnerManagementScene.tsx`

- [ ] **Step 1: 创建场景驾驶舱**

展示产品定位、目标银行、三层架构、MVP 路线和首批标杆客户建议。

- [ ] **Step 2: 创建客群池页面**

展示“内部存量、公私联动、标准小微、长尾场景”四类客群，以及识别逻辑和价值说明。

- [ ] **Step 3: 创建授信资产池页面**

展示“识别中、预授信、人工补审、已转资产”四类资产状态，突出资产生成链路。

- [ ] **Step 4: 创建产品与审批页面**

展示核心引擎、场景包和规则引擎如何组合成产品与审批能力。

- [ ] **Step 5: 创建风险监控页面**

展示动账预警、发票异常、集中度、回款恶化和关系异动等风险前置信号。

- [ ] **Step 6: 创建贷后经营页面**

展示提额、续贷、风险恢复、分层迁移和运营动作建议。

- [ ] **Step 7: 创建合作方管理页面**

展示链主、平台方、政府数据方、物流方等合作对象，以及数据接入和场景包适配关系。

---

### Task 4: 清理旧原型表达，统一产品语言

**Files:**
- Modify: `/Users/admin/Documents/test007/硅基工作台/src/App.tsx`
- Modify: `/Users/admin/Documents/test007/硅基工作台/src/components/SceneLayout.tsx`
- Modify: `/Users/admin/Documents/test007/硅基工作台/src/index.css`

- [ ] **Step 1: 清理旧的“客户经理工作台”口径**

移除或替换首页、页脚、导航中偏个人工作台的表达。

- [ ] **Step 2: 统一页面口径**

把页面文案统一为：

- 资产生成
- 客群识别
- 规则引擎
- 动态预警
- 场景包
- 银行模板

- [ ] **Step 3: 微调视觉语义**

保留当前视觉风格，但加强“产品方案 / 引擎 / 系统”感，减少“个人办公台”感。

---

### Task 5: 验证构建可用

**Files:**
- Verify: `/Users/admin/Documents/test007/硅基工作台/src/App.tsx`
- Verify: `/Users/admin/Documents/test007/硅基工作台/src/components/scenes/*.tsx`

- [ ] **Step 1: 运行类型检查**

Run: `npm run lint`

Expected: PASS with no TypeScript errors

- [ ] **Step 2: 运行生产构建**

Run: `npm run build`

Expected: PASS and emit Vite production bundle

- [ ] **Step 3: 人工检查新的一级菜单与页面结构**

确认：

- 顶部菜单已经替换为新的七个一级导航
- 默认页为“场景驾驶舱”
- 每个页面都有清晰的系统产品表达
- 不再依赖旧的“拉新 / 存量 / 风险 / 工具”叙事
