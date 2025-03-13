import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium hover:bg-slate-100 hover:text-slate-500 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-slate-100 data-[state=on]:text-slate-900 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 focus-visible:border-slate-950 focus-visible:ring-slate-950/50 focus-visible:ring-[3px] outline-none transition-[color,box-shadow] aria-invalid:ring-red-500/20 dark:aria-invalid:ring-red-500/40 aria-invalid:border-red-500 dark:hover:bg-slate-800 dark:hover:text-slate-400 dark:data-[state=on]:bg-slate-800 dark:data-[state=on]:text-slate-50 dark:focus-visible:border-slate-300 dark:focus-visible:ring-slate-300/50 dark:aria-invalid:ring-red-900/20 dark:dark:aria-invalid:ring-red-900/40 dark:aria-invalid:border-red-900",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline:
          "border border-slate-200 bg-transparent shadow-xs hover:bg-slate-100 hover:text-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 dark:hover:text-slate-50",
        outline2:
          "border border-slate-200 bg-slate-100 shadow-xs hover:bg-slate-300 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:hover:bg-slate-600 dark:hover:text-slate-50 cursor-pointer",
        metricIcon:
          "border border-slate-400 bg-slate-100 shadow-xs hover:bg-slate-100 hover:text-slate-900 hover:border-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:hover:bg-slate-600 dark:hover:text-slate-50 text-slate-400 data-[state=on]:text-slate-400 data-[state=on]:hover:text-slate-900 data-[state=on]:hover:border-slate-900 data-[state=on]:dark:hover:bg-slate-600 cursor-pointer",
      },
      size: {
        default: "h-9 px-2 min-w-9",
        sm: "h-8 px-1.5 min-w-8",
        lg: "h-10 px-2.5 min-w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Toggle({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Toggle, toggleVariants }
