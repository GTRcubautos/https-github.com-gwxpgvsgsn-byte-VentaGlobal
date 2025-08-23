import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 font-semibold uppercase tracking-wider",
  {
    variants: {
      variant: {
        default: "btn-neon",
        destructive:
          "bg-red-600 text-white hover:bg-red-700 border-2 border-red-500 hover:shadow-[0_0_20px_rgba(220,38,127,0.3)]",
        outline:
          "border-2 border-green-500 bg-transparent text-green-400 hover:bg-green-500/20 hover:text-green-300 shadow-[0_0_10px_rgba(34,197,94,0.2)]",
        secondary:
          "bg-gray-800 text-white border-2 border-gray-600 hover:bg-gray-700 hover:border-gray-500",
        ghost: "text-green-400 hover:bg-green-500/20 hover:text-green-300",
        link: "text-green-400 underline-offset-4 hover:underline hover:text-green-300 normal-case tracking-normal",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 rounded-md px-4 text-xs",
        lg: "h-12 rounded-md px-10 text-lg",
        icon: "h-10 w-10",
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
