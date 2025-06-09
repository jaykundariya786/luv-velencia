
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-semibold ring-offset-background transition-all duration-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 tracking-wide relative overflow-hidden group",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-700 text-white hover:from-emerald-700 hover:via-emerald-800 hover:to-teal-800 shadow-xl hover:shadow-2xl hover:-translate-y-1 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/10 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
        destructive: "bg-gradient-to-r from-red-500 via-red-600 to-rose-600 text-white hover:from-red-600 hover:via-red-700 hover:to-rose-700 shadow-lg hover:shadow-xl hover:-translate-y-0.5",
        outline: "border-2 border-emerald-500 text-emerald-600 bg-white/80 backdrop-blur-sm hover:bg-emerald-500 hover:text-white hover:border-emerald-600 hover:-translate-y-0.5 hover:shadow-lg transition-all duration-300",
        secondary: "bg-gradient-to-r from-slate-100 via-slate-200 to-gray-200 text-slate-700 hover:from-slate-200 hover:via-slate-300 hover:to-gray-300 hover:-translate-y-0.5 shadow-md hover:shadow-lg",
        ghost: "text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-lg transition-colors duration-200",
        link: "text-emerald-600 underline-offset-4 hover:underline hover:text-emerald-700",
        gold: "bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-500 text-slate-800 hover:from-amber-500 hover:via-yellow-600 hover:to-amber-600 shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-bold",
        success: "bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 shadow-lg hover:shadow-xl hover:-translate-y-0.5",
        warning: "bg-gradient-to-r from-orange-400 via-amber-500 to-yellow-500 text-white hover:from-orange-500 hover:via-amber-600 hover:to-yellow-600 shadow-lg hover:shadow-xl hover:-translate-y-0.5",
        premium: "bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 text-white hover:from-purple-700 hover:via-indigo-700 hover:to-blue-700 shadow-xl hover:shadow-2xl hover:-translate-y-1 relative before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/20 before:to-transparent before:opacity-0 hover:before:opacity-100 before:transition-opacity before:duration-300",
      },
      size: {
        default: "h-12 px-8 py-3 text-sm",
        sm: "h-9 rounded-lg px-4 text-xs",
        lg: "h-14 rounded-xl px-10 text-base font-bold",
        icon: "h-11 w-11 rounded-xl",
        xl: "h-16 px-12 text-lg font-bold rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
