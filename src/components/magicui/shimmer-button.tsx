import React from "react";
import type { CSSProperties, ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

export interface ShimmerButtonProps extends ComponentPropsWithoutRef<"button"> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
}

export const ShimmerButton = React.forwardRef<
  HTMLButtonElement,
  ShimmerButtonProps
>(
  (
    {
      shimmerColor,
      shimmerSize = "0.05em",
      shimmerDuration = "3s",
      borderRadius = "100px",
      background,
      className,
      children,
      variant = "primary",
      ...props
    },
    ref,
  ) => {
    // Variant-based defaults
    const variantDefaults = {
      primary: {
        shimmerColor: shimmerColor || "rgba(255, 255, 255, 0.8)",
        background: background || "linear-gradient(135deg, var(--primary), var(--secondary))",
        textColor: "text-primary-foreground",
        borderStyle: "border-0"
      },
      secondary: {
        shimmerColor: shimmerColor || "rgba(255, 255, 255, 0.6)",
        background: background || "linear-gradient(135deg, var(--background), var(--muted))",
        textColor: "text-foreground",
        borderStyle: "border-0"
      },
      outline: {
        shimmerColor: shimmerColor || "rgba(255, 255, 255, 0.4)",
        background: background || "transparent",
        textColor: "text-foreground hover:text-primary-foreground",
        borderStyle: "border border-border hover:border-primary"
      }
    };

    const currentVariant = variantDefaults[variant];
    return (
      <button
        style={
          {
            "--spread": "90deg",
            "--shimmer-color": currentVariant.shimmerColor,
            "--radius": borderRadius,
            "--speed": shimmerDuration,
            "--cut": shimmerSize,
            "--bg": currentVariant.background,
          } as CSSProperties
        }
        className={cn(
          "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap px-6 py-3 [background:var(--bg)] [border-radius:var(--radius)]",
          "transform-gpu transition-all duration-300 ease-in-out active:translate-y-px",
          "shadow-lg hover:shadow-2xl hover:shadow-primary/20",
          currentVariant.textColor,
          currentVariant.borderStyle,
          className,
        )}
        ref={ref}
        {...props}
      >
        {/* spark container */}
        <div
          className={cn(
            "-z-30 blur-[2px]",
            "absolute inset-0 overflow-visible [container-type:size]",
          )}
        >
          {/* spark */}
          <div className="absolute inset-0 h-[100cqh] animate-shimmer-slide [aspect-ratio:1] [border-radius:0] [mask:none]">
            {/* spark before */}
            <div className="absolute -inset-full w-auto rotate-0 animate-spin-around [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] [translate:0_0]" />
          </div>
        </div>
        {children}

        {/* Highlight */}
        <div
          className={cn(
            "insert-0 absolute size-full",

            "rounded-full px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_rgba(255,255,255,0.12)]",

            // transition
            "transform-gpu transition-all duration-300 ease-in-out",

            // on hover
            "group-hover:shadow-[inset_0_-6px_10px_rgba(255,255,255,0.25)]",

            // on click
            "group-active:shadow-[inset_0_-10px_10px_rgba(255,255,255,0.25)]",
          )}
        />

        {/* backdrop */}
        <div
          className={cn(
            "absolute -z-20 [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)]",
          )}
        />
      </button>
    );
  },
);

ShimmerButton.displayName = "ShimmerButton";
