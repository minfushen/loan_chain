# Cursor Composer 工作流 · 百慧设计规范落地

> **Cursor** 的 Composer（Agent）模式适合多文件上下文、自动生成 diff 与批量替换，与 **P0 → P1 → P2** 改造节奏一致。本文档与项目根目录 **`.cursorrules`** 配套使用：规则由 `.cursorrules` 自动注入，下文为**人工操作步骤**与**可粘贴 Prompt 模板**。

---

## 一、项目级配置（必做）

已在仓库根目录提供 **`.cursorrules`**，无需重复创建。若在其他分支或新克隆仓库中丢失，可从版本控制恢复或复制该文件。

---

## 二、Composer 模式使用流程

| 步骤 | Cursor 操作 | 说明 |
|------|---------------|------|
| 1 | `Cmd/Ctrl + I` 打开 Composer | 选用 Agent / 多文件编辑能力 |
| 2 | 输入 `@Codebase`，必要时 `@Folder src/components` | 限定在本仓库结构，避免虚构路径 |
| 3 | 粘贴下文「第三节」对应模板 | 写清目标文件、范围、验收标准 |
| 4 | 生成 diff 后逐文件审查 | 仅接受符合 `.cursorrules` 的变更 |
| 5 | 终端执行 `npm run dev` | 核对布局、交互与演示导航 |

**提示**：大文件先用 `@File src/components/scenes/某场景.tsx` 缩小上下文，再补 `@Codebase` 查类型与常量。

---

## 三、核心 Prompt 模板（可直接复制）

以下路径已按**本仓库**调整（非 `src/pages/...`）。候选资产列表主逻辑在 **`SmartIdentifyScene.tsx`** 的 `list` 模块分支中。

### 模板 1：P0 骨架搭建（以候选资产列表为例）

```text
@Codebase @File src/components/scenes/SmartIdentifyScene.tsx
@File src/components/SceneLayout.tsx
@File src/components/ProductPrimitives.tsx

请将「候选资产列表」对应 UI 区块重构为百慧 5 层工作台骨架：
1. 顶部：面包屑区（沿用 SceneLayout 页头）+ 标题 + KPI Summary Bar（3–5 项指标）
2. 中部：三栏 Master-Detail（左约 25% 列表 / 中约 50% 详情 / 右约 25% 决策区）
3. 右侧：Decision Panel 固定结构：判断 → 依据（2–4 条）→ 风险 → 建议 → 主按钮
4. 底部：Sticky Action Bar（主按钮 1 个，次按钮 ≤2）
5. 样式：使用 Tailwind 语义类与 CSS 变量（如 bg-card、border-border、text-muted-foreground、bg-primary），禁止新增随意硬编码 #RRGGBB
6. 状态：当前选中样本与现有 DemoContext 一致；若本任务引入路由，须将选中 ID 与 filter 同步到 URL query

保留原有 mock 数据与 navigate 行为，优先改结构与布局，少动业务判断逻辑。
```

### 模板 2：交互反馈与状态兜底（P1）

```text
@File src/components/ProductPrimitives.tsx
（若已拆分：@File src/components/decision-panel/DecisionPanel.tsx 等）

为决策区 / KPI 条等可交互区块补全状态：
1. Hover：背景微亮或边框强调（如 hover:bg-muted/50、hover:border-primary/30）
2. Focus：ring-2 ring-ring/20 outline-none，支持键盘导航
3. Active：可点击主按钮 scale-[0.99] 与 transition
4. Disabled：opacity-50 cursor-not-allowed pointer-events-none
5. Loading / Empty / Error：各区块预留占位与引导文案（如「暂无可推进主体，请先完成名单导入」）

尽量保持对外 Props 不变；若必须扩展，在类型上加可选字段并给默认值。
```

### 模板 3：Design Tokens 与硬编码清理（P2）

```text
@Folder src/components/
@File src/index.css

扫描 src/components 下 .tsx 与相关 .css：
1. 将新增或明显的硬编码颜色（#2563eb 等）改为语义类或 var(--primary) 等已有变量
2. 将零散 magic margin/padding 统一为 Tailwind 间距刻度或项目内已有模式
3. 主按钮在单屏主路径上保持唯一强样式；次要操作用 outline/ghost 降级
4. 输出按文件的改造要点列表，便于逐条审阅

注意：本项目使用 Tailwind 4 + @theme inline，无独立 tailwind.config.ts 时以 index.css 为准。
```

---

## 四、安全落地 Checklist

| 风险 | 应对策略 |
|------|----------|
| 批量替换破坏逻辑 | 坚持预览 diff；数据流、navigate、DemoContext 变更需单独过目 |
| Props 断裂 | Prompt 中写明「保留原有 Props」「不改数据获取路径」 |
| 类名与构建 | 保存后本地 `npm run dev`；必要时 `npx tsc --noEmit` |
| 路由/状态丢失 | 引入 URL 后测试刷新、前进后退、多标签 |
| 性能回退 | Profiler 查看列表+详情重渲染；列表项考虑 memo |

---

## 五、建议执行顺序

1. 确认根目录存在 **`.cursorrules`**
2. Composer：`@Codebase` → 粘贴**模板 1** → 审查 diff → `git commit`
3. 使用**模板 2 / 模板 3** 做 P1、P2 与令牌清理

---

## 与原文的差异说明

| 原文 | 本仓库 |
|------|--------|
| `src/pages/Identification/CandidateList.tsx` | `src/components/scenes/SmartIdentifyScene.tsx`（`list` 模块） |
| `tailwind.config.ts`、`src/styles/tokens.css` | `src/index.css`（Tailwind 4 + `@theme inline`） |
| URL query 同步 | 当前为 state；引入路由后按 `.cursorrules` 补齐 |

若你希望将「今日工作台 / 智能识别」等更多场景逐页套入同一套 Prompt，可复制模板 1 并替换 `@File` 为目标场景文件。
