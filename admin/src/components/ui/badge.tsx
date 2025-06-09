
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 font-montserrat tracking-wide",
  {
    variants: {
      variant: {
        default: "border-transparent bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-800 hover:from-emerald-200 hover:to-teal-200",
        secondary: "border-transparent bg-gradient-to-r from-gray-100 to-slate-100 text-gray-700 hover:from-gray-200 hover:to-slate-200",
        destructive: "border-transparent bg-gradient-to-r from-red-100 to-rose-100 text-red-800 hover:from-red-200 hover:to-rose-200",
        outline: "border-emerald-200 text-emerald-700 bg-white/80 backdrop-blur-sm hover:bg-emerald-50",
        success: "border-transparent bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 hover:from-green-200 hover:to-emerald-200",
        warning: "border-transparent bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-800 hover:from-yellow-200 hover:to-amber-200",
        info: "border-transparent bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 hover:from-blue-200 hover:to-indigo-200",
        premium: "border-transparent bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 hover:from-purple-200 hover:to-indigo-200",
      },
      size: {
        default: "px-3 py-1 text-xs",
        sm: "px-2 py-0.5 text-xs",
        lg: "px-4 py-2 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant, size }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
