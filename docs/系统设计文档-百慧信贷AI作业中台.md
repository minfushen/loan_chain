# 百慧 — 信贷 AI 作业中台 系统设计文档

> 版本：v0.7.5 · 日期：2026-04-14 · 状态：可交互高保真原型

---

## 1. 文档概述

### 1.1 目的

本文档描述「百慧」信贷 AI 作业中台的前端技术架构、组件体系、状态管理、数据流和设计系统。面向前端工程师和技术负责人。

### 1.2 技术栈概览

| 类别 | 技术 | 版本 |
|------|------|------|
| UI 框架 | React | 19.x |
| 类型系统 | TypeScript | 5.8.x |
| 构建工具 | Vite | 6.x |
| 样式 | Tailwind CSS | 4.x |
| UI 组件库 | shadcn/ui + Radix | 最新 |
| 动画 | Motion (Framer Motion) | 12.x |
| 图表 | Recharts | 3.x |
| 图标 | Lucide React | 0.546+ |
| 状态管理 | React Context + useState | 内置 |
| 包管理 | npm | — |

---

## 2. 架构总览

### 2.1 分层架构

```
┌─────────────────────────────────────────────────────────┐
│                    App Shell（App.tsx）                   │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────────┐  │
│  │ TopBar   │  │ LeftNav  │  │ Main Content Area    │  │
│  │ (header) │  │ (148px)  │  │ (SceneRouter)        │  │
│  └──────────┘  └──────────┘  └──────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Footer StatusBar (24px)                          │   │
│  └──────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│                  DemoProvider (Context)                   │
├─────────────────────────────────────────────────────────┤
│                  Scene Components (14 个)                 │
│  ┌─────────────┐ ┌──────────────┐ ┌─────────────────┐  │
│  │ CockpitScene│ │ SmartIdentify │ │ SmartDueDiligenc│  │
│  │ AssetPool   │ │ SmartMonitor  │ │ SmartOperation  │  │
│  │ StrategyConf│ │ SmartApproval │ │ ...             │  │
│  └─────────────┘ └──────────────┘ └─────────────────┘  │
├─────────────────────────────────────────────────────────┤
│              Shared Components & Primitives               │
│  SceneLayout · ProductPrimitives · Charts · UI Kit        │
├─────────────────────────────────────────────────────────┤
│                  Data Layer                               │
│  DemoContext · chainLoan/data.ts · DemoComponents         │
└─────────────────────────────────────────────────────────┘
```

### 2.2 目录结构

```
src/
├── App.tsx                            # 应用壳：顶栏 + 左侧导航 + 路由 + 底栏
├── main.tsx                           # 入口：DemoProvider 包裹 + 错误边界
├── constants.ts                       # 8 个一级场景 + 37 个二级模块定义
├── types.ts                           # SceneId · Module · Scene 类型
├── index.css                          # Tailwind 4 入口 + 自定义 token
├── RootErrorBoundary.tsx              # 根级错误边界
├── lib/
│   └── utils.ts                       # cn() 工具函数（clsx + tailwind-merge）
├── components/
│   ├── ui/                            # shadcn/ui 基础组件
│   │   ├── badge.tsx
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── input.tsx
│   │   ├── scroll-area.tsx
│   │   └── separator.tsx
│   ├── SceneLayout.tsx                # 统一场景骨架（二级导航 + AI Copilot）
│   ├── ProductPrimitives.tsx          # 60+ 业务组件库
│   ├── Charts.tsx                     # Recharts 封装（MiniAreaChart / DonutChart）
│   └── scenes/
│       ├── CockpitScene.tsx           # 今日工作台（5 模块）
│       ├── SmartIdentifyScene.tsx     # 智能识别入口（5 模块）
│       ├── CustomerPoolScene.tsx      # 智能识别内容
│       ├── SmartDueDiligenceScene.tsx # 智能尽调（4 模块）
│       ├── SmartApprovalScene.tsx     # 智能审批入口
│       ├── ProductApprovalScene.tsx   # 智能审批内容（4 模块 + Layout 槽位）
│       ├── approval/
│       │   └── ApprovalSharedUi.tsx   # AI 引导卡 / MicroPulse / 打字机
│       ├── AssetPoolScene.tsx         # 授信资产池入口
│       ├── RiskMonitorScene.tsx       # 智能监控内容（5 模块）
│       ├── SmartMonitorScene.tsx      # 智能监控入口
│       ├── SmartOperationScene.tsx    # 智能经营入口
│       ├── PostLoanScene.tsx          # 智能经营内容（5 模块）
│       ├── StrategyConfigScene.tsx    # 策略与配置入口
│       └── PartnerManagementScene.tsx # 策略与配置内容（6 模块）
└── demo/
    ├── DemoContext.tsx                # 全局演示状态（React Context）
    ├── DemoComponents.tsx             # SceneHero / ActionBar / EvidenceDrawer
    └── chainLoan/
        └── data.ts                    # 5 样本数据 + 业务辅助函数
```

---

## 3. 核心组件设计

### 3.1 App Shell（App.tsx）

**职责**：应用级布局框架 + 场景路由 + 全局 UI。

```
┌─── App() ────────────────────────────────┐
│  <DemoProvider>                           │
│    <AppShell>                             │
│      <header> TopBar                      │
│      <div flex>                           │
│        <nav> LeftNav (SCENES map)         │
│        <main>                             │
│          <AnimatePresence mode="wait">    │
│            <motion.div key={scene}>       │
│              {renderScene()}              │
│            </motion.div>                  │
│          </AnimatePresence>               │
│        </main>                            │
│      </div>                               │
│      <footer> StatusBar                  │
│      <EvidenceDrawer />                   │
│    </AppShell>                            │
│  </DemoProvider>                          │
└───────────────────────────────────────────┘
```

**场景路由机制**：

```typescript
const [activeScene, setActiveScene] = useState<SceneId>('cockpit');
const [activeModule, setActiveModule] = useState<string>('overview');

// 场景切换时自动重置到该场景的第一个模块
const handleSceneChange = (id: SceneId) => {
  setActiveScene(id);
  const scene = SCENES.find(s => s.id === id);
  setActiveModule(scene?.modules[0]?.id ?? '');
};
```

**场景渲染**：

```typescript
const renderScene = () => {
  const props = { activeModule, onModuleChange: setActiveModule };
  switch (activeScene) {
    case 'cockpit': return <CockpitScene {...props} />;
    case 'smart-identify': return <SmartIdentifyScene {...props} />;
    // ... 8 个场景
  }
};
```

### 3.2 SceneLayout

**职责**：统一场景骨架，提供二级导航 + 页面定位层 + 内容区 + 浮动 AI Copilot。

**Props 接口**：

```typescript
interface SceneLayoutProps {
  title: string;                    // 场景标题
  modules: Module[];                // 二级模块列表
  activeModule: string;            // 当前激活模块 ID
  onModuleChange: (id: string) => void;
  contextSlot?: React.ReactNode;   // 案件条/主链阶段等全局上下文
  sampleBar?: React.ReactNode;     // 样本切换条
  aiPanel?: React.ReactNode;       // 浮动 AI Copilot 内容
  children: React.ReactNode;       // 主内容区
  pageSubtitleOverride?: string;   // 覆盖模块副标题
  kpiSlot?: React.ReactNode;       // KPI 摘要层
  stickyActionSlot?: React.ReactNode; // 固定底部动作栏
}
```

**布局分区**：

```
┌─── SceneLayout ─────────────────────────────────┐
│ ┌──────────┬──────────────────────────────────┐ │
│ │ Sidebar  │ Content Area                      │ │
│ │ (208px)  │ ┌──────────────────────────────┐ │ │
│ │          │ │ header (定位层)               │ │ │
│ │ 场景标题  │ │   面包屑                      │ │ │
│ │ ──────── │ │   contextSlot (可选)           │ │ │
│ │ 模块按钮  │ │   页面标题 + 副标题            │ │ │
│ │ · 模块A  │ │   kpiSlot (可选)               │ │ │
│ │ · 模块B← │ │   sampleBar (可选)             │ │ │
│ │ · 模块C  │ ├──────────────────────────────┤ │ │
│ │ · 模块D  │ │ ScrollArea                    │ │ │
│ │          │ │   {children}                  │ │ │
│ │          │ │   ──── 声明 ────               │ │ │
│ │          │ ├──────────────────────────────┤ │ │
│ │          │ │ stickyActionSlot (可选)        │ │ │
│ │          │ └──────────────────────────────┘ │ │
│ └──────────┴──────────────────────────────────┘ │
│                                         🧠 ← AI │
└─────────────────────────────────────────────────┘
```

**二级导航特性**：
- 可折叠（spring 动画，collapsed 状态切换）
- 支持分组（module.category 字段）
- 当前模块高亮（bg-primary + text-primary-foreground）
- 可访问性：aria-current="page"、aria-label

**浮动 AI Copilot 实现**：

```
触发条件：aiPanel prop 非空
├── 固定触发按钮（fixed, right-5 bottom-8, 44px 圆形, Brain 图标）
├── AnimatePresence
│   ├── 半透明遮罩（bg-black/20, fixed inset-0）
│   └── 侧边面板（fixed right-0, w-[380px], spring 滑入）
│       ├── 头部（Brain 图标 + "AI 助手" + 关闭按钮）
│       └── ScrollArea > {aiPanel} 内容
```

### 3.3 ProductPrimitives（组件库）

60+ 业务组件，按功能分为以下类别：

#### 布局组件

| 组件 | 用途 |
|------|------|
| `PageHeader` | 页面标题 + 副标题 + 操作区 |
| `PageShell` | 页面壳：KPI条 + 主区 + AI区 + 动作栏 |
| `WorkbenchPanel` | 带标题栏的内容面板 |
| `WorkbenchSplit` | 左右分栏工作台 |
| `SectionShell` | 内容区段容器 |
| `PanelCard` | 可折叠面板卡片 |

#### 数据展示组件

| 组件 | 用途 |
|------|------|
| `MetricCard` | 指标卡（标签 + 数值 + 说明 + 图标 + tone） |
| `KpiBar` | 3-5 项 KPI 水平排列 |
| `StatusPill` | 状态标签（normal/watch/risk） |
| `FlowRow` | 进度行（标签 + 数值 + 百分比条） |
| `MiniTrend` | 迷你趋势条 |
| `GovBar` | 治理信息条 |
| `AiTag` | AI 标签（标签 + 置信度） |

#### 流程驱动组件

| 组件 | 用途 |
|------|------|
| `FlowProgress` | 水平步骤指示器（完成/当前/待完成 三态） |
| `Stepper` | 垂直步骤条 |
| `AiInsight` | AI 上下文提示条（info/warning/success/danger 四种 tone） |
| `DecisionCard` | 决策卡片（置信度环形图 + 原因列表 + 对比选择） |
| `ChecklistPanel` | 检查清单面板 |

#### AI 组件

| 组件 | 用途 |
|------|------|
| `AiNote` | AI 注释块 |
| `AiBar` | AI 结论条（结论 + 置信度 + 指标） |
| `AiJudgmentBlock` | AI 判断块（结论 + 依据 + 动作建议） |
| `AgentCapabilityCard` | Agent 能力卡片 |
| `InsightStrip` | 洞察条 |
| `ActionSuggestionCard` | 动作建议卡 |
| `SignalCard` | 信号卡片 |
| `TimelineInsightCard` | 时间线洞察卡 |
| `ConfidenceCard` | 置信度卡片 |

#### 样本组件

| 组件 | 用途 |
|------|------|
| `SampleSwitcher` | 样本切换下拉（支持 compact 模式） |
| `SelectedSampleSummary` | 当前样本摘要 |
| `SampleHero` | 样本信息头（名称 + 角色 + KPI + 状态） |
| `StageStrip` | 阶段进度条 |
| `SceneQuestion` | 场景核心问题 |

#### 交互组件

| 组件 | 用途 |
|------|------|
| `StickyActionBar` | 固定底部动作栏 |
| `DecisionPanel` | 决策面板（对比选择 + 确认） |
| `ActionQueueCard` | 动作队列卡片 |
| `TimelineRail` | 时间线轨道 |

### 3.4 场景组件模式

所有场景组件遵循统一的实现模式：

```typescript
export default function XxxScene({ activeModule, onModuleChange }: Props) {
  const scene = SCENES.find(s => s.id === 'xxx')!;
  const { /* DemoContext hooks */ } = useDemo();

  // 局部状态
  const [filter, setFilter] = useState('...');

  // 计算数据
  const derivedData = useMemo(() => ..., []);

  // renderAiPanel — 浮动 AI 引导
  const renderAiPanel = () => {
    const guides: Record<string, string> = { ... };
    const nextSteps: Record<string, { label: string; target: string }[]> = { ... };
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-1.5">
          <Sparkles size={12} className="text-primary" />
          <span>{guides[activeModule]}</span>
        </div>
        <p>{guides[activeModule]}</p>
        {steps.map(s => (
          <Button onClick={() => onModuleChange(s.target)}>...</Button>
        ))}
      </div>
    );
  };

  // renderContent — 模块路由
  const renderContent = () => {
    switch (activeModule) {
      case 'module-a': return <ModuleA />;
      case 'module-b': return <ModuleB />;
      default: return <DefaultModule />;
    }
  };

  // 统一输出
  return (
    <SceneLayout
      title={scene.title}
      modules={scene.modules}
      activeModule={activeModule}
      onModuleChange={onModuleChange}
      aiPanel={renderAiPanel()}
    >
      {renderContent()}
    </SceneLayout>
  );
}
```

---

## 4. 状态管理

### 4.1 DemoContext

全局状态通过 React Context 实现，提供演示流程控制。

**Context 接口**：

```typescript
interface DemoContextValue {
  // 全局状态
  active: boolean;                // 演示是否激活
  stage: DemoStage;               // 当前阶段
  selectedSampleId: string;       // 当前选中样本 ID
  evidenceDrawerOpen: boolean;    // 证据抽屉开关

  // 派生状态
  stageIndex: number;             // 阶段在 STAGE_ORDER 中的索引
  stageLabel: string;             // 阶段中文名
  currentSample: ChainLoanSample; // 当前样本完整数据

  // 样本级状态
  riskSimulated: boolean;         // 是否模拟了风险事件
  recoveryComplete: boolean;      // 是否完成恢复
  currentStage: DemoStage;        // 样本当前阶段

  // 操作方法
  selectSample: (id: string) => void;
  startDemo: () => void;
  advanceStage: () => void;
  advanceCurrentSampleStage: () => void;
  setStage: (stage: DemoStage) => void;
  toggleEvidenceDrawer: () => void;
  simulateRisk: () => void;
  simulateRiskForCurrentSample: () => void;
  completeRecovery: () => void;
  completeRecoveryForCurrentSample: () => void;
  resetDemo: () => void;
  setNavigate: (fn: NavigateFn) => void;
  navigate: (sceneId: SceneId, moduleId?: string) => void;
}
```

**状态流转**：

```
DemoState {
  active: boolean
  stage: DemoStage
  selectedSampleId: string
  evidenceDrawerOpen: boolean
  sampleStates: Record<sampleId, {
    stage: DemoStage
    riskSimulated: boolean
    recoveryComplete: boolean
  }>
}
```

**不可变更新模式**：

所有 setState 操作使用展开运算符创建新对象：

```typescript
const advanceStage = useCallback(() => {
  setState(prev => {
    const newSampleStates = { ...prev.sampleStates };
    const ss = { ...(newSampleStates[sid] ?? defaultState) };
    ss.stage = nextStage;
    newSampleStates[sid] = ss;
    return { ...prev, stage: nextStage, sampleStates: newSampleStates };
  });
}, []);
```

### 4.2 场景局部状态

各场景组件使用 `useState` / `useMemo` 管理局部状态：

| 场景 | 局部状态 | 用途 |
|------|---------|------|
| CockpitScene | taskTagFilter | 任务来源标签筛选 |
| CockpitScene | readNotificationIds | 已读通知 ID 集合 |
| SceneLayout | collapsed | 二级导航折叠状态 |
| SceneLayout | aiPanelOpen | AI Copilot 展开状态 |

### 4.3 阶段与场景映射

```typescript
const STAGE_SCENE_MAP: Record<DemoStage, { sceneId: SceneId; moduleId: string }> = {
  ecosystem:        { sceneId: 'smart-identify',      moduleId: 'file-import' },
  identified:       { sceneId: 'smart-identify',      moduleId: 'feed' },
  pre_credit:       { sceneId: 'smart-due-diligence', moduleId: 'material' },
  manual_review:    { sceneId: 'smart-approval',      moduleId: 'review' },
  approved:         { sceneId: 'smart-approval',      moduleId: 'summary' },
  risk_alert:       { sceneId: 'smart-monitor',       moduleId: 'warning' },
  post_loan_recovery: { sceneId: 'smart-operation',   moduleId: 'operations' },
};
```

阶段推进时自动导航到对应场景：

```typescript
const target = STAGE_SCENE_MAP[nextStage];
setTimeout(() => navigate(target.sceneId, target.moduleId), 0);
```

---

## 5. 数据模型

### 5.1 类型系统

```typescript
// 场景标识（8 个值联合类型）
type SceneId = 'cockpit' | 'smart-identify' | 'smart-due-diligence' |
  'smart-approval' | 'asset-pool' | 'smart-monitor' |
  'smart-operation' | 'strategy-config';

// 模块
interface Module {
  id: string;
  title: string;
  icon?: LucideIcon;
  description?: string;
  category?: string;
}

// 场景
interface Scene {
  id: SceneId;
  title: string;
  icon: LucideIcon;
  modules: Module[];
}

// 阶段枚举
type DemoStage = 'ecosystem' | 'identified' | 'pre_credit' |
  'manual_review' | 'approved' | 'risk_alert' | 'post_loan_recovery';

// 分层标签
type SegmentTag = 'A可授信' | 'B可做但需处理' | 'C待观察' | 'D风险经营中';

// 审批状态
type ApprovalStatus = '待预授信' | '待补审' | '已批准' | '已降额' | '恢复中';

// 风险状态
type SampleRiskStatus = '正常' | '观察' | '中度预警' | '恢复中';
```

### 5.2 数据生成函数

数据层提供样本级派生数据生成函数，避免冗余存储：

```typescript
// 根据样本数据动态生成规则命中结果
getRuleHitsForSample(sample: ChainLoanSample): RuleHit[]

// 根据样本风险标识生成风险事件
getRiskEventForSample(sample: ChainLoanSample): RiskEvent

// 根据样本指标生成四流证据
getEvidenceForSample(sample: ChainLoanSample): DemoEvidence[]
```

**设计原则**：规则判断逻辑内置于生成函数，根据样本指标（订单数、开票月数、集中度、证据覆盖度）自动计算 pass/warn/risk/manual_review 结果。

---

## 6. UI 设计系统

### 6.1 色彩 Token

基于 Tailwind CSS 4 自定义 token：

```css
/* 品牌色系 */
--color-primary: #2563EB;       /* 主蓝 */
--color-primary-foreground: #FFFFFF;

/* 状态色系 */
--state-normal: #16A34A;        /* 正常-绿 */
--state-watch: #F59E0B;         /* 观察-黄 */
--state-risk: #DC2626;          /* 风险-红 */

/* 中性色系 */
--color-foreground: #0F172A;    /* 主文字 */
--color-muted: #F1F5F9;         /* 次背景 */
--color-muted-foreground: #64748B; /* 次文字 */
--color-border: #E2E8F0;        /* 边框 */
```

### 6.2 状态色彩映射

```typescript
const STATE_COLORS = {
  normal: { bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', border: 'border-emerald-200' },
  watch:  { bg: 'bg-amber-50',   text: 'text-amber-700',   dot: 'bg-amber-500',   border: 'border-amber-200' },
  risk:   { bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-500',     border: 'border-red-200' },
};
```

### 6.3 排版规范

| 用途 | 字号 | 字重 | 行高 |
|------|------|------|------|
| 一级导航项 | 13px | medium (500) | — |
| 二级导航项 | 12px | normal (400) | — |
| 页面标题 | 15px | semibold (600) | snug |
| 页面副标题 | 12px | normal (400) | relaxed |
| 面包屑 | 11px | — | — |
| 正文内容 | 12-13px | — | relaxed |
| 辅助信息 | 10-11px | — | — |
| 声明文案 | 10px | — | — |

### 6.4 间距规范

| 场景 | 值 |
|------|-----|
| 页面内边距 | p-6 (24px) |
| 面板内边距 | px-4 / p-5 |
| 卡片内边距 | px-3.5 py-3 |
| 元素间距 | gap-2.5 (10px) |
| 模块间距 | space-y-4 / space-y-5 |
| 分隔线 | border-b border-border/40 |

### 6.5 圆角规范

| 元素 | 值 |
|------|-----|
| 卡片 | rounded-lg (8px) |
| 大卡片 | rounded-xl (12px) |
| 按钮 | rounded-lg |
| Badge | 圆角由组件控制 |
| 指标卡 | rounded-xl |
| 面板 | rounded-xl |

### 6.6 阴影规范

| 层级 | 值 |
|------|-----|
| 卡片 | shadow-sm |
| 悬浮卡片 | shadow-md |
| AI Copilot 侧栏 | shadow-[-8px_0_24px_rgba(0,0,0,0.08)] |
| Sticky 动作栏 | shadow-[0_-4px_12px_rgba(0,0,0,0.06)] |
| 触发按钮 | shadow-lg |

---

## 7. 动画设计

### 7.1 页面切换

```typescript
// 场景切换（App.tsx）
<motion.div
  key={activeScene}
  initial={{ opacity: 0, x: 6 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: -4 }}
  transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
/>

// 模块切换（SceneLayout）
<motion.div
  key={activeModule}
  initial={{ opacity: 0, y: 6 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -4 }}
  transition={{ duration: 0.18, ease: 'easeOut' }}
/>
```

### 7.2 AI Copilot 动画

```typescript
// 遮罩淡入
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.15 }}
/>

// 面板弹簧滑入
<motion.aside
  initial={{ x: 380, opacity: 0 }}
  animate={{ x: 0, opacity: 1 }}
  exit={{ x: 380, opacity: 0 }}
  transition={{ type: 'spring', stiffness: 360, damping: 32 }}
/>
```

### 7.3 侧边栏折叠

```typescript
<motion.aside
  initial={false}
  animate={{ width: collapsed ? 0 : 208 }}
  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
/>
```

### 7.4 微交互

| 交互 | 效果 |
|------|------|
| 按钮 hover | bg 变化 + transition-colors |
| 按钮点击 | active:scale-[0.99] |
| AI 触发按钮 hover | scale-105 |
| AI 触发按钮 click | scale-95 |
| 卡片 hover | shadow-md / border-primary/30 |
| 导航项 hover | bg 变化 |

---

## 8. 路由与导航

### 8.1 导航架构

```
App Shell
├── 一级导航（左侧固定）
│   ├── handleSceneChange(id: SceneId)
│   └── 自动重置 activeModule 到第一个模块
├── 二级导航（SceneLayout 内侧边栏）
│   ├── onModuleChange(id: string)
│   └── 可折叠
└── 跨场景导航（DemoContext.navigate）
    ├── navigate(sceneId, moduleId?)
    └── 来自业务逻辑的跳转（任务点击、快捷入口等）
```

### 8.2 导航注入机制

DemoContext 通过注入方式获取 App Shell 的导航函数：

```typescript
// App.tsx 中注入
useEffect(() => {
  setNavigate(navigateToScene);
}, [setNavigate, navigateToScene]);

// 场景组件中使用
const { navigate } = useDemo();
navigate('smart-monitor', 'warning');
```

---

## 9. 图表系统

### 9.1 Charts.tsx 组件

| 组件 | 用途 | 参数 |
|------|------|------|
| `MiniAreaChart` | 迷你面积趋势图 | data, color, height |
| `DonutChart` | 环形分布图 | data[], height, innerRadius, outerRadius, centerLabel, centerValue |

### 9.2 配色常量

```typescript
const CHART_COLORS = {
  blue: '#2563EB',
  emerald: '#10B981',
  amber: '#F59E0B',
  red: '#DC2626',
  violet: '#7C3AED',
  slate: '#64748B',
};
```

---

## 10. 错误处理

### 10.1 根级错误边界

`RootErrorBoundary.tsx` 包裹整个应用，捕获未处理的渲染错误。

### 10.2 Context 空值守卫

```typescript
export function useDemo(): DemoContextValue {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error('useDemo must be used within DemoProvider');
  return ctx;
}
```

---

## 11. 构建与部署

### 11.1 开发

```bash
npm install
npm run dev          # Vite dev server, port 3000
npm run build        # 生产构建到 dist/
npm run preview      # 预览生产构建
npx tsc --noEmit     # 类型检查
```

### 11.2 Vite 配置要点

- React 插件：`@vitejs/plugin-react`
- Tailwind 4 插件：`@tailwindcss/vite`
- 路径别名：`@/` → `src/`
- 开发端口：3000，host 0.0.0.0

### 11.3 部署目标

当前为纯前端原型，可部署至任何静态托管服务：
- Vercel / Netlify（推荐）
- GitHub Pages
- OSS 静态托管

---

## 12. 关键设计决策

### 12.1 为什么用 React Context 而非 Redux

- 原型阶段状态量有限（1 个全局 Context + 少量局部 state）
- DemoContext 读写频率低（用户操作驱动，非高频事件）
- 避免引入额外依赖和样板代码

### 12.2 为什么用浮动 AI Copilot 而非固定侧栏

- 内容区获得完整宽度，提升信息密度
- 用户可按需展开，不干扰主要工作流
- 统一交互模式（所有场景一致体验）
- 移动端友好（浮动模式不占水平空间）

### 12.3 为什么场景组件用 switch/case 而非路由库

- 原型无需 URL 路由（单页应用，状态驱动）
- 减少依赖（无 react-router）
- 场景切换由状态控制，URL 无需同步
- DemoContext 阶段推进需精确控制场景跳转

### 12.4 为什么数据生成用函数而非预计算

- 5 个样本 × 37 个模块，预计算所有派生数据冗余
- 函数式生成按需计算，保持数据一致性
- 规则变更只需修改生成函数，无需更新所有样本数据
