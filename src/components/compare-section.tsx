import { Star, ArrowRight, Zap, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RatingItem {
  name: string;
  value: number;
  maxValue?: number;
}

interface CompareItem {
  title: string;
  subtitle?: string;
  description: string;
  overallRating: number;
  ratings: RatingItem[];
  href?: string;
  badge?: string;
  accent?: string; // Brand name for color lookup
}

interface CompareSectionProps {
  title: string;
  subtitle?: string;
  itemA: CompareItem;
  itemB: CompareItem;
  className?: string;
  "data-theme"?: string;
}

// Brand color lookup utility
const getBrandColors = (brand?: string) => {
  const brandColors: Record<string, { 
    primary: string; 
    bg: string; 
    border: string; 
    shadow: string;
    ring: string;
  }> = {
    woocommerce: {
      primary: "text-[#96588a]",
      bg: "bg-gradient-to-br from-[#96588a]/10 via-[#96588a]/5 to-transparent",
      border: "border-[#96588a]/20 hover:border-[#96588a]/30",
      shadow: "hover:shadow-[#96588a]/10",
      ring: "hover:ring-[#96588a]/20"
    },
    surecart: {
      primary: "text-[#00824c]",
      bg: "bg-gradient-to-br from-[#00824c]/10 via-[#00824c]/5 to-transparent",
      border: "border-[#00824c]/20 hover:border-[#00824c]/30",
      shadow: "hover:shadow-[#00824c]/10", 
      ring: "hover:ring-[#00824c]/20"
    },
    blocksy: {
      primary: "text-primary",
      bg: "bg-gradient-to-br from-primary/10 via-primary/5 to-transparent",
      border: "border-primary/20 hover:border-primary/30",
      shadow: "hover:shadow-primary/10",
      ring: "hover:ring-primary/20"
    },
    generatepress: {
      primary: "text-orange-400",
      bg: "bg-gradient-to-br from-orange-400/10 via-orange-400/5 to-transparent",
      border: "border-orange-400/20 hover:border-orange-400/30",
      shadow: "hover:shadow-orange-400/10",
      ring: "hover:ring-orange-400/20"
    }
  };

  // Fallback to muted/foreground styling
  const fallback = {
    primary: "text-foreground",
    bg: "bg-gradient-to-br from-muted/10 via-background to-muted/5",
    border: "border-foreground/20 hover:border-foreground/30",
    shadow: "hover:shadow-foreground/10",
    ring: "hover:ring-foreground/20"
  };

  return brandColors[brand?.toLowerCase() || ""] || fallback;
};

const CompareSection = ({
  title,
  subtitle,
  itemA,
  itemB,
  className,
  "data-theme": dataTheme
}: CompareSectionProps) => {

  const RatingDisplay = ({ ratings, colorClass }: { ratings: RatingItem[]; colorClass: string }) => {
    return (
      <div className="space-y-2">
        {ratings.slice(0, 4).map((rating, index) => {
          const maxValue = rating.maxValue || 5;
          const filledStars = Math.floor(rating.value);
          const hasHalfStar = rating.value % 1 >= 0.5;
          const emptyStars = maxValue - filledStars - (hasHalfStar ? 1 : 0);

          return (
            <div key={index} className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">{rating.name}</span>
              <div className="flex items-center gap-1">
                {/* Filled stars */}
                {[...Array(filledStars)].map((_, i) => (
                  <Star key={`filled-${i}`} className={`h-3 w-3 ${colorClass} fill-current`} />
                ))}
                {/* Half star */}
                {hasHalfStar && (
                  <div className="relative">
                    <Star className="h-3 w-3 text-muted-foreground/30" />
                    <div className="absolute inset-0 overflow-hidden w-1/2">
                      <Star className={`h-3 w-3 ${colorClass} fill-current`} />
                    </div>
                  </div>
                )}
                {/* Empty stars */}
                {[...Array(emptyStars)].map((_, i) => (
                  <Star key={`empty-${i}`} className="h-3 w-3 text-muted-foreground/30" />
                ))}
                <span className="text-xs text-muted-foreground ml-1">
                  {rating.value.toFixed(1)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const CompareCard = ({ item, index }: { item: CompareItem; index: number }) => {
    const colors = getBrandColors(item.accent);
    
    const filledStars = Math.floor(item.overallRating);
    const hasHalfStar = item.overallRating % 1 >= 0.5;
    const emptyStars = 5 - filledStars - (hasHalfStar ? 1 : 0);

    return (
      <motion.div
        initial={{ opacity: 0, x: index === 0 ? -40 : 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, delay: index * 0.2 }}
        className="group relative"
      >
        <div className={cn(
          "relative overflow-hidden rounded-2xl backdrop-blur-sm transition-all duration-500 hover:shadow-2xl cursor-pointer p-6",
          colors.bg,
          colors.border,
          colors.shadow,
          `hover:ring-2 ${colors.ring}`
        )}>
          {/* Absolute link covering entire card */}
          {item.href && (
            <a 
              href={item.href}
              className="absolute inset-0 z-20"
              aria-label={`Compare ${item.title}`}
            />
          )}
          
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-background/5 via-transparent to-transparent" />
          
          <div className="relative z-10">
            {/* Badge */}
            {item.badge && (
              <div className={cn("inline-flex items-center gap-1 rounded-full px-3 py-1 mb-4", colors.bg)}>
                <div className={cn("h-1.5 w-1.5 rounded-full", colors.primary.replace('text-', 'bg-'))} />
                <span className={cn("text-xs font-medium", colors.primary)}>{item.badge}</span>
              </div>
            )}

            {/* Title & Subtitle */}
            <h3 className={cn("text-2xl font-bold mb-2 group-hover:transition-colors duration-300", colors.primary)}>
              {item.title}
            </h3>
            
            {item.subtitle && (
              <p className="text-sm font-medium text-muted-foreground mb-3">
                {item.subtitle}
              </p>
            )}

            {/* Overall Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {/* Filled stars */}
                {[...Array(filledStars)].map((_, i) => (
                  <Star key={`overall-filled-${i}`} className={cn("h-4 w-4 fill-current", colors.primary)} />
                ))}
                {/* Half star */}
                {hasHalfStar && (
                  <div className="relative">
                    <Star className="h-4 w-4 text-muted-foreground/30" />
                    <div className="absolute inset-0 overflow-hidden w-1/2">
                      <Star className={cn("h-4 w-4 fill-current", colors.primary)} />
                    </div>
                  </div>
                )}
                {/* Empty stars */}
                {[...Array(emptyStars)].map((_, i) => (
                  <Star key={`overall-empty-${i}`} className="h-4 w-4 text-muted-foreground/30" />
                ))}
              </div>
              <span className={cn("text-lg font-bold", colors.primary)}>
                {item.overallRating.toFixed(1)}
              </span>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              {item.description}
            </p>

            {/* Ratings */}
            <RatingDisplay ratings={item.ratings} colorClass={colors.primary} />
          </div>

          {/* Subtle border highlight */}
          <div className={cn("absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500", `via-${colors.primary.split('-')[1]}-${colors.primary.split('-')[2]}/50`)} />
        </div>
      </motion.div>
    );
  };

  return (
    <section className={cn("py-24 bg-background", className)} data-theme={dataTheme}>
      <div className="container max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Comparison Cards */}
        <div className="grid md:grid-cols-2 gap-8 items-stretch relative">
          <CompareCard item={itemA} index={0} />
          
          {/* VS Divider */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-30 hidden md:block">
            <motion.div
              className="flex items-center justify-center w-16 h-16 rounded-full bg-card/80 backdrop-blur-xl border border-foreground/20 shadow-2xl shadow-foreground/20"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <span className="text-xl font-bold text-foreground">VS</span>
            </motion.div>
          </div>
          
          <CompareCard item={itemB} index={1} />
        </div>
      </div>
    </section>
  );
};

export { CompareSection };