# Figma 布局原型搭建指南

基于视觉参考，以下方案可直接在 Figma 中落地为**像素级结构**。骨架同时适用于「智能尽调」与「智能审批」：替换主内容区组件即可复用。

---

## 一、画板与基础设置

| 设置项 | 参数 | 说明 |
|--------|------|------|
| Frame Size | `1440 × 900` | 标准桌面端 |
| Layout Grid | Columns: 12, Margin: 24, Gutter: 16 | 12 列栅格 |
| Base Unit | `8px` | 间距 / 圆角 / 字号遵循 8pt |
| Fill | `#F8FAFC` | 全局背景（Tailwind `slate-50`） |
| Font | Inter 或 SF Pro | 标题 600，正文 400，辅助 400 |

---

## 二、核心布局结构（Auto Layout）

### 1. 顶层容器 `Page-Container`

- Direction: Vertical  
- Gap: `16px`  
- Padding: `24px`  
- Alignment: Stretch  

内部顺序：`Header` → `MetricsBar` → `ContentArea`。

### 2. 头部区域 `Header`

- Direction: Horizontal  
- Gap: `16px`  
- Padding: `0`  
- Alignment: Space Between  
- Height: `56px`（Fixed）  

左侧：场景标题 + 样本切换（Segmented Control）。  
右侧：操作按钮（Save / Approve / Reject）+ 折叠侧栏。

### 3. 指标卡片栏 `MetricsBar`

- Direction: Horizontal  
- Gap: `12px`  
- Padding: `0`  
- Overflow: Hidden（或 Horizontal scroll 模拟滚动）  

每个 `MetricCard`：Padding `16px`，Radius `8px`，Fill `#FFFFFF`，Stroke `1px #E2E8F0`。  
内容：`Label 12/400` → `Value 20/600` → `Trend/Status 12`。

### 4. 主内容区 `ContentArea`

- Direction: Horizontal  
- Gap: `20px`  
- Alignment: Stretch  
- Min-Height: `600px`  

| 子区域 | 宽度策略 | Auto Layout | 说明 |
|--------|----------|-------------|------|
| MainPanel（约 70%） | Fill | Vertical, Gap 16 | 任务列表 + 材料/解析卡片 |
| AIPanel（约 30%） | Fixed `320px` | Vertical, Gap 12 | AI 判断 + 快捷操作（可收至 `48px`） |

---

## 三、组件架构与变体

### Card.Base

- Vertical, Padding `16px`, Gap `12px`, Radius `8px`  
- Fill `#FFFFFF`, Stroke `1px #E2E8F0`, Shadow `0 1px 2px rgba(0,0,0,0.05)`  
- Header：Horizontal, Space Between（标题 + Badge + 展开/折叠）  
- Content：Vertical, Gap 8；折叠时 Hidden  

可用 **Interactive Components**：On Click → 切换 Expanded / Collapsed。

### TaskItem

- Horizontal, Padding `12px 16px`, Gap `12px`, Radius `6px`  
- Hover：Fill `#F1F5F9`  
- 左：优先级圆点；中：任务名 + 来源标签；右：View / Process  

### AIPanel

- Vertical, Padding `16px`, Gap `16px`, Radius `8px`  
- Fill `#F8FAFC` 或 `#EFF6FF` 与主区区分  
- JudgmentBlock：背景 `#FEF3C7`，左边框 `3px #F59E0B`  
- TagGroup：Horizontal, Gap 6，Badge 圆角 pill  
- ActionGroup：Vertical, Gap 8，Secondary / Outline 按钮  

---

## 四、交互原型（Smart Animate）

| 场景 | 触发 | 动画 | 目标 |
|------|------|------|------|
| 卡片展开/折叠 | On Click | Smart Animate, Ease Out, 200ms | Expanded ↔ Collapsed |
| 侧栏折叠 | On Click | Smart Animate, Ease In Out, 250ms | 宽度 320 → 48px，内容隐藏 |
| 视图切换 | On Click | Dissolve, 300ms | Overview / Detail / Focus |
| 指标栏滚动 | Drag / Wheel | 无 | Overflow horizontal scroll |

可用 **Boolean** 属性控制显隐，减少变体数量。

---

## 五、Design Tokens（参考）

| Token | Value | 用途 |
|-------|-------|------|
| color.bg.default | `#F8FAFC` | 页面背景 |
| color.surface.card | `#FFFFFF` | 卡片/面板 |
| color.border.default | `#E2E8F0` | 1px 边框 |
| color.text.primary | `#0F172A` | 标题/重要数据 |
| color.text.secondary | `#64748B` | 正文/说明 |
| color.text.tertiary | `#94A3B8` | 辅助/时间 |
| spacing.unit | `8px` | 基础间距 |
| radius.default | `8px` | 卡片/按钮圆角 |
| radius.pill | `999px` | Badge |

与代码侧映射见同目录 [`tailwind-v4-token-mapping.md`](./tailwind-v4-token-mapping.md)。

---

## 六、Figma 搭建清单

1. 建 Frame `1440×900`，加 12 列网格  
2. 占位矩形搭骨架：Header / MetricsBar / MainPanel / AIPanel，设 Auto Layout  
3. 原子组件：Button、Badge、Tag、IconBtn，统一圆角与字号  
4. 组装 Card.Base，接 Interactive 折叠  
5. 原型连线：折叠、视图切换 Smart Animate  
6. Local Styles 或 Variables 绑定颜色与间距  
7. Dev Mode 导出标注，与仓库 `src/index.css` 中 `@theme` 对齐  

---

## 智能审批 vs 智能尽调（内容替换）

| 区域 | 智能尽调 | 智能审批 |
|------|----------|----------|
| MetricsBar | 材料解析率 / 异常数 / 尽调进度 | 产品匹配度 / 规则命中率 / 审批时效 |
| MainPanel | 材料核验 + 字段比对 | 授信方案对比 + 定价测算 + 合规检查 |
| AIPanel | 尽调结论 + 补件建议 | 审批意见 + 风险定价 + 一键推单 |
| Header Actions | 生成报告 / 标记异常 | 通过 / 拒绝 / 退回补件 / 调整额度 |

---

## 下一步建议

1. 在 Figma 中建 `SmartDueDiligence` 与 `SmartApproval` 两个 Frame，共用骨架。  
2. 高频块 **Create Main Component**。  
3. Dev Mode 核对 Auto Layout 与项目 Tailwind 类名。  
4. Variables 可导出为 JSON，再在 `src/index.css` 的 `@theme inline` 中增量对齐（见映射文档）。
