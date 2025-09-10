import React from 'react';
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { cn } from "@/lib/utils";

interface GradientButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  href?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

const GradientButton = ({ 
  children, 
  variant = "secondary", 
  size = "md", 
  className, 
  onClick,
  href,
  type = "button",
  disabled = false 
}: GradientButtonProps) => {
  const getSizeClasses = (size: string) => {
    switch (size) {
      case "sm":
        return "h-9 px-6 text-sm";
      case "lg":
        return "h-14 px-10 text-lg";
      default:
        return "h-12 px-8 text-base";
    }
  };

  const baseClasses = cn(
    "font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] inline-flex items-center justify-center gap-2",
    getSizeClasses(size),
    className
  );

  // If href is provided, render as a link-style button
  if (href) {
    return (
      <a href={href} className="inline-block">
        <ShimmerButton
          variant={variant}
          shimmerSize="0.1em"
          shimmerDuration="2.5s"
          borderRadius="9999px"
          className={baseClasses}
        >
          {children}
        </ShimmerButton>
      </a>
    );
  }

  // Regular button
  return (
    <ShimmerButton
      variant={variant}
      shimmerSize="0.1em"
      shimmerDuration="2.5s"
      borderRadius="9999px"
      className={baseClasses}
      onClick={onClick}
      type={type}
      disabled={disabled}
    >
      {children}
    </ShimmerButton>
  );
};

export { GradientButton };