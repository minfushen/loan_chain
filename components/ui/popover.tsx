'use client';

import * as React from 'react';
import { Popover as PopoverPrimitive } from '@base-ui/react';
import { cn } from '@/lib/utils';

/* ─── Popover ────────────────────────────────────────────────────
   基于 @base-ui/react Popover 封装，与 shadcn/ui 风格对齐。
   用法：
     <Popover trigger={<Button>打开</Button>}>
       <div>内容</div>
     </Popover>
   ──────────────────────────────────────────────────────────────── */

interface PopoverProps {
  trigger: React.ReactElement;
  children: React.ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  className?: string;
}

export function Popover({
  trigger,
  children,
  side = 'bottom',
  align = 'start',
  className,
}: PopoverProps) {
  return (
    <PopoverPrimitive.Root>
      <PopoverPrimitive.Trigger render={trigger} />
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Positioner side={side} align={align} sideOffset={6}>
          <PopoverPrimitive.Popup
            className={cn(
              'z-50 w-64 rounded-lg border border-border bg-popover p-3 text-popover-foreground shadow-md',
              'origin-(--transform-origin)',
              'data-[starting-style]:opacity-0 data-[starting-style]:scale-95',
              'data-[ending-style]:opacity-0 data-[ending-style]:scale-95',
              'transition-[opacity,transform] duration-150',
              className,
            )}
          >
            {children}
          </PopoverPrimitive.Popup>
        </PopoverPrimitive.Positioner>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}

export { PopoverPrimitive };
