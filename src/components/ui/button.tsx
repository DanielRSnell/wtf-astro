import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:scale-105 active:scale-100",
        destructive:
          "bg-gradient-to-r from-destructive to-destructive/90 text-white shadow-lg shadow-destructive/20 hover:shadow-xl hover:shadow-destructive/30 hover:scale-105 active:scale-100",
        outline:
          "border-2 border-border/40 bg-card/60 backdrop-blur-xl hover:bg-card/80 hover:border-primary/40 hover:text-primary shadow-sm",
        secondary:
          "bg-gradient-to-r from-secondary/90 to-secondary text-secondary-foreground shadow-lg hover:shadow-xl hover:scale-105 active:scale-100",
        ghost:
          "hover:bg-muted/50 hover:text-primary backdrop-blur-sm",
        link: "text-primary underline-offset-4 hover:underline hover:text-primary/80",
        premium:
          "relative overflow-hidden bg-gradient-to-r from-primary via-primary/80 to-primary text-primary-foreground shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:scale-105 active:scale-100 before:absolute before:inset-0 before:bg-gradient-to-r before:from-white/0 before:via-white/20 before:to-white/0 before:translate-x-[-200%] hover:before:translate-x-[200%] before:transition-transform before:duration-700",
        glow:
          "relative bg-gradient-to-r from-primary to-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-[0_0_2rem_0] hover:shadow-primary/40 hover:scale-105 active:scale-100",
      },
      size: {
        default: "h-10 px-5 py-2.5 has-[>svg]:px-4",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 text-xs",
        lg: "h-12 rounded-lg px-8 has-[>svg]:px-6 text-base",
        xl: "h-14 rounded-xl px-10 has-[>svg]:px-8 text-lg",
        icon: "size-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
