# Tailwind v4 与 Figma Design Tokens 映射

本仓库使用 **Tailwind CSS v4**（`@tailwindcss/vite`），主题在 **`src/index.css`** 的 `@import "tailwindcss"` 与 **`@theme inline`**、`**:root`** 变量中维护，**没有**传统的 `tailwind.config.ts` 里 `theme.extend` 写法。

下文中的 **`tailwind.config.ts`（完整配置）** 仅作设计侧参考；若直接迁入会与本项目 **shadcn + oklch 语义色** 冲突，不建议整文件替换。

---

## 与本项目对齐的方式

1. **颜色 / 间距 / 圆角**：在 `src/index.css` 的 `@theme inline { ... }` 中增加 `--color-*` 或 `--radius-*`，Tailwind 会自动生成 `bg-*`、`text-*`、`rounded-*` 等工具类。  
2. **已有语义**：优先使用现有变量，例如 `--background`、`--foreground`、`--muted-foreground`、`--card`、`--border`、`--brand`、`--success`、`--warning`、`--danger`、`--ai` 等（见 `index.css` `:root`）。  
3. **插件**：你提供的 `tailwindcss-animate`、`@tailwindcss/typography` 等为 **v3 常见栈**；当前项目已用 **`tw-animate-css`** 与 **`shadcn/tailwind.css`**，新增插件前需确认与 Vite + TW4 兼容。

---

## Figma Token → 推荐 Tailwind 类名（当前仓库）

| Figma / 文档 Token | 含义 | 本项目优先使用 |
|--------------------|------|------------------|
| color.bg.default `#F8FAFC` | 页面大背景 | `bg-slate-50` 或保持 `body` 上 `bg-background`（现为偏白 oklch）；若需严格 slate-50，可在组件局部使用 `bg-slate-50` |
| color.surface.card | 卡片白底 | `bg-card` |
| color.border.default | 默认边框 | `border-border` |
| color.text.primary | 主文案 | `text-foreground` |
| color.text.secondary | 次级文案 | `text-muted-foreground` |
| color.text.tertiary | 更弱辅助 | 可用 `text-muted-foreground/80` 或扩展 `--text-tertiary`（见下） |
| 品牌强调 | 主操作/链接 | `text-brand`、`bg-brand`、`border-brand` |
| 成功 / 警告 / 危险 | 语义状态 | `bg-success`、`text-warning`、`border-danger` 等（已在 `@theme` 映射） |
| AI 区块 | AI 面板强调 | `bg-ai-subtle`、`text-ai`、`border-ai` |
| radius.default `8px` | 卡片圆角 | `rounded-lg`（`--radius: 0.625rem` ≈ 10px）或 `rounded-md`；需 8px 可设 token 或 `rounded-lg` 视设计稿微调 |
| radius.pill | Badge | `rounded-full` |
| spacing 8pt | gap / padding | `gap-2`（8）、`gap-3`（12）、`p-4`（16）、`p-6`（24） |

---

## 文档中的 `tailwind.config.ts` 与 CSS 变量

- 文档里 `colors.background: 'hsl(var(--background))'` 等形式适用于 **HSL 通道变量**；本仓库 **`--background` 等为 oklch(...)**，若改为 hsl 需整站替换，**不推荐**。  
- `globals.css` 片段里的 `@tailwind base/components/utilities` 在 **v4** 中已由 `@import "tailwindcss"` 覆盖，勿重复堆叠。

---

## 可选：扩展三级文案色（示例）

若要与 Figma `text.tertiary` 严格一致，可在 `index.css` 的 `@theme inline` 与 `:root` 中增量添加（示例，非必须）：

```css
/* @theme inline 内增加 */
--color-text-tertiary: var(--text-tertiary);

/* :root 内增加 */
--text-tertiary: oklch(0.704 0.04 256); /* 接近 #94A3B8 */
```

即可使用 `text-text-tertiary`（注意命名与 Tailwind 生成的 `text-*` 规则一致）。

---

## 组件示例（对齐现有栈）

使用 **shadcn 风格** 与已有语义色，而不是文档里的 `.card` / `.btn` 自定义类（除非你在 `@layer components` 中自行定义）：

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export function MaterialCard({ name, statusText, source, uploadedAt }: Props) {
  return (
    <Card className="shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-semibold">{name}</CardTitle>
        <Badge variant="secondary">{statusText}</Badge>
      </CardHeader>
      <CardContent className="space-y-2">
        <p className="text-sm text-muted-foreground">来源: {source}</p>
        <p className="text-xs text-muted-foreground/80">{uploadedAt}</p>
        <div className="flex gap-2 pt-2">
          <Button variant="outline" className="flex-1">查看详情</Button>
          <Button className="flex-1 bg-brand text-brand-foreground hover:bg-brand/90">验证</Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

---

## 依赖说明

文档建议安装 `@tailwindcss/typography`、`tailwindcss-animate` 等；**当前 `package.json` 未包含**这些包。若确有需要：

- 查阅 [Tailwind v4 插件文档](https://tailwindcss.com/docs/installation) 再添加，避免与 `@tailwindcss/vite` 重复配置 postcss。

---

## 相关文件

| 文件 | 作用 |
|------|------|
| `src/index.css` | Tailwind 入口、`@theme inline`、`:root` / `.dark` 变量 |
| `vite.config.ts` | `@` → 仓库根目录别名 |
| `docs/design/figma-layout-prototype-guide.md` | Figma 骨架与交互说明 |
