import { motion } from "framer-motion";
import { TrendingDown, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface BeforeAfterCardsProps {
  title: string;
  subtitle?: string;
  beforeTitle?: string;
  afterTitle?: string;
  beforeIcon?: React.ReactNode;
  afterIcon?: React.ReactNode;
  beforeContent: React.ReactNode;
  afterContent: React.ReactNode;
  beforeAccent?: "red" | "orange" | "yellow" | "neutral";
  afterAccent?: "green" | "blue" | "purple" | "neutral";
  className?: string;
  "data-theme"?: string;
}

const BeforeAfterCards = ({
  title,
  subtitle,
  beforeTitle = "Before",
  afterTitle = "After", 
  beforeIcon,
  afterIcon,
  beforeContent,
  afterContent,
  beforeAccent = "red",
  afterAccent = "green",
  className,
  "data-theme": dataTheme
}: BeforeAfterCardsProps) => {
  
  // Accent color mappings
  const accentColors = {
    red: {
      primary: "text-red-500",
      secondary: "text-red-400", 
      bg: "bg-red-500/10",
      border: "border-red-500/20",
      hover: "hover:border-red-500/40",
      shadow: "hover:shadow-red-500/10",
      gradient: "from-red-500/10 via-transparent to-red-500/5",
      highlight: "via-red-500/30"
    },
    orange: {
      primary: "text-orange-500",
      secondary: "text-orange-400",
      bg: "bg-orange-500/10", 
      border: "border-orange-500/20",
      hover: "hover:border-orange-500/40",
      shadow: "hover:shadow-orange-500/10",
      gradient: "from-orange-500/10 via-transparent to-orange-500/5",
      highlight: "via-orange-500/30"
    },
    yellow: {
      primary: "text-yellow-500",
      secondary: "text-yellow-400",
      bg: "bg-yellow-500/10",
      border: "border-yellow-500/20", 
      hover: "hover:border-yellow-500/40",
      shadow: "hover:shadow-yellow-500/10",
      gradient: "from-yellow-500/10 via-transparent to-yellow-500/5",
      highlight: "via-yellow-500/30"
    },
    green: {
      primary: "text-green-500",
      secondary: "text-green-400",
      bg: "bg-green-500/10",
      border: "border-green-500/20",
      hover: "hover:border-green-500/40", 
      shadow: "hover:shadow-green-500/10",
      gradient: "from-green-500/10 via-transparent to-green-500/5",
      highlight: "via-green-500/30"
    },
    blue: {
      primary: "text-blue-500",
      secondary: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
      hover: "hover:border-blue-500/40",
      shadow: "hover:shadow-blue-500/10", 
      gradient: "from-blue-500/10 via-transparent to-blue-500/5",
      highlight: "via-blue-500/30"
    },
    purple: {
      primary: "text-purple-500",
      secondary: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
      hover: "hover:border-purple-500/40",
      shadow: "hover:shadow-purple-500/10",
      gradient: "from-purple-500/10 via-transparent to-purple-500/5", 
      highlight: "via-purple-500/30"
    },
    neutral: {
      primary: "text-muted-foreground",
      secondary: "text-muted-foreground/80",
      bg: "bg-muted/10",
      border: "border-border/20",
      hover: "hover:border-border/40",
      shadow: "hover:shadow-muted/10",
      gradient: "from-muted/10 via-transparent to-muted/5",
      highlight: "via-muted/30"
    }
  };

  const beforeColors = accentColors[beforeAccent];
  const afterColors = accentColors[afterAccent];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className={cn("w-full", className)} data-theme={dataTheme}>
      {/* Header */}
      {(title || subtitle) && (
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {title && (
            <h2 className="text-3xl lg:text-4xl font-bold mb-4 bg-gradient-to-r from-foreground via-foreground/90 to-muted-foreground bg-clip-text text-transparent">
              {title}
            </h2>
          )}
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </motion.div>
      )}

      {/* Cards */}
      <motion.div
        className="grid gap-8 lg:grid-cols-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Before Card */}
        <motion.div
          className="relative group"
          variants={cardVariants}
        >
          <div className={cn(
            "relative overflow-hidden rounded-3xl bg-card/60 backdrop-blur-xl border border-border/30 transition-all duration-700 hover:shadow-2xl p-8",
            beforeColors.hover,
            beforeColors.shadow
          )}>
            {/* Background gradients */}
            <div className={cn("absolute inset-0 bg-gradient-to-br", beforeColors.gradient)} />
            <div className="absolute inset-0 bg-gradient-to-t from-card/20 via-transparent to-transparent" />
            
            {/* Header */}
            <div className="relative z-10 flex items-center gap-4 mb-6">
              {beforeIcon && (
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl backdrop-blur-sm border", beforeColors.bg, beforeColors.border)}>
                  {beforeIcon}
                </div>
              )}
              {!beforeIcon && (
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl backdrop-blur-sm border", beforeColors.bg, beforeColors.border)}>
                  <TrendingDown className={cn("h-6 w-6", beforeColors.primary)} />
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold text-foreground">{beforeTitle}</h3>
                <div className={cn("h-1 w-16 rounded-full mt-2 bg-gradient-to-r", `from-${beforeAccent}-500/60`, "to-transparent")} />
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10">
              {beforeContent}
            </div>

            {/* Subtle border highlight */}
            <div className={cn("absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700", beforeColors.highlight)} />
          </div>
        </motion.div>

        {/* After Card */}
        <motion.div
          className="relative group"
          variants={cardVariants}
        >
          <div className={cn(
            "relative overflow-hidden rounded-3xl bg-card/60 backdrop-blur-xl border border-border/30 transition-all duration-700 hover:shadow-2xl p-8",
            afterColors.hover,
            afterColors.shadow
          )}>
            {/* Background gradients */}
            <div className={cn("absolute inset-0 bg-gradient-to-br", afterColors.gradient)} />
            <div className="absolute inset-0 bg-gradient-to-t from-card/20 via-transparent to-transparent" />
            
            {/* Header */}
            <div className="relative z-10 flex items-center gap-4 mb-6">
              {afterIcon && (
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl backdrop-blur-sm border", afterColors.bg, afterColors.border)}>
                  {afterIcon}
                </div>
              )}
              {!afterIcon && (
                <div className={cn("flex h-12 w-12 items-center justify-center rounded-2xl backdrop-blur-sm border", afterColors.bg, afterColors.border)}>
                  <TrendingUp className={cn("h-6 w-6", afterColors.primary)} />
                </div>
              )}
              <div>
                <h3 className="text-xl font-bold text-foreground">{afterTitle}</h3>
                <div className={cn("h-1 w-16 rounded-full mt-2 bg-gradient-to-r", `from-${afterAccent}-500/60`, "to-transparent")} />
              </div>
            </div>

            {/* Content */}
            <div className="relative z-10">
              {afterContent}
            </div>

            {/* Subtle border highlight */}
            <div className={cn("absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700", afterColors.highlight)} />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export { BeforeAfterCards };