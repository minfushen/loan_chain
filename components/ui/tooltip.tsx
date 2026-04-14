'use client';

import * as React from 'react';
import { Tooltip as TooltipPrimitive } from '@base-ui/react';
import { cn } from '@/lib/utils';

/* ─── Tooltip ────────────────────────────────────────────────────
   基于 @base-ui/react Tooltip 封装，与 shadcn/ui 风格对齐。
   在应用根包一层 TooltipProvider（见 main.tsx），以便多实例共享 delay / 相邻瞬显。
   用法：
     <Tooltip content="说明文字">
       <span>触发元素</span>
     </Tooltip>
   ──────────────────────────────────────────────────────────────── */

export const TooltipProvider = TooltipPrimitive.Provider;

interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
  side?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export function Tooltip({
  content,
  children,
  side = 'top',
  className,
}: TooltipProps) {
  return (
    <TooltipPrimitive.Root>
      <TooltipPrimitive.Trigger render={children} />
      <TooltipPrimitive.Portal>
        <TooltipPrimitive.Positioner side={side} sideOffset={6}>
          <TooltipPrimitive.Popup
            className={cn(
              // 基础样式
              'z-50 max-w-[220px] rounded-md bg-foreground px-2.5 py-1.5 text-[11px] leading-snug text-background shadow-md',
              // 入场/离场动画（Tailwind v4 data-* 变体）
              'origin-(--transform-origin)',
              'data-[starting-style]:opacity-0 data-[starting-style]:scale-95',
              'data-[ending-style]:opacity-0 data-[ending-style]:scale-95',
              'transition-[opacity,transform] duration-100 ease-out',
              className,
            )}
          >
            {content}
            <TooltipPrimitive.Arrow className="data-[side=bottom]:top-[-4px] data-[side=top]:bottom-[-4px] data-[side=left]:right-[-4px] data-[side=right]:left-[-4px] size-2 fill-foreground" />
          </TooltipPrimitive.Popup>
        </TooltipPrimitive.Positioner>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}
