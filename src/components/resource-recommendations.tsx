import { Star, Award, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface Rating {
  name: string;
  value: number;
  maxValue?: number;
}

interface RecommendationCard {
  title: string;
  subtitle?: string;
  description?: string;
  href?: string;
  badge?: string;
  ratings?: Rating[];
}

interface ResourceRecommendationsProps {
  topRecommendation?: RecommendationCard;
  runnerUp?: RecommendationCard;
  honorableMention?: RecommendationCard;
  className?: string;
  "data-theme"?: string;
}

const ResourceRecommendations = ({
  topRecommendation,
  runnerUp,
  honorableMention,
  className,
  "data-theme": dataTheme,
}: ResourceRecommendationsProps) => {
  
  const RecommendationCard = ({ 
    recommendation, 
    type 
  }: { 
    recommendation: RecommendationCard; 
    type: 'top' | 'runner-up' | 'honorable';
  }) => {
    const isTop = type === 'top';
    const isRunnerUp = type === 'runner-up';
    
    const Icon = isTop ? Award : isRunnerUp ? Star : TrendingUp;
    const label = isTop ? "Top Pick" : isRunnerUp ? "Runner Up" : "Honorable Mention";
    const iconColor = isTop ? "text-yellow-500" : isRunnerUp ? "text-blue-500" : "text-purple-500";
    const borderColor = isTop ? "border-yellow-500/20" : isRunnerUp ? "border-blue-500/20" : "border-purple-500/20";
    const bgGradient = isTop 
      ? "from-yellow-500/10 to-transparent" 
      : isRunnerUp 
        ? "from-blue-500/10 to-transparent" 
        : "from-purple-500/10 to-transparent";
    
    // Calculate average rating
    const avgRating = recommendation.ratings && recommendation.ratings.length > 0
      ? recommendation.ratings.reduce((sum, r) => sum + r.value, 0) / recommendation.ratings.length
      : 0;
    
    return (
      <a
        href={recommendation.href || "#"}
        className={cn(
          "group relative flex flex-col h-full",
          "rounded-2xl bg-card/60 backdrop-blur-xl border transition-all duration-500",
          "hover:shadow-2xl hover:shadow-primary/10 hover:scale-[1.02]",
          borderColor,
          "hover:border-primary/30"
        )}
      >
        {/* Background gradient */}
        <div className={cn(
          "absolute inset-0 rounded-2xl bg-gradient-to-br opacity-50",
          bgGradient
        )} />
        
        <div className="relative z-10 p-6 flex flex-col h-full">
          {/* Header with Icon and Label */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Icon className={cn("w-5 h-5", iconColor)} />
              <span className={cn("text-xs font-semibold uppercase tracking-wide", iconColor)}>
                {label}
              </span>
            </div>
            {avgRating > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10">
                <Star className="w-3 h-3 text-primary fill-current" />
                <span className="text-xs font-medium text-primary">{avgRating.toFixed(1)}</span>
              </div>
            )}
          </div>
          
          {/* Title and Subtitle */}
          <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
            {recommendation.title}
          </h3>
          
          {recommendation.subtitle && (
            <p className="text-sm text-muted-foreground mb-3">
              {recommendation.subtitle}
            </p>
          )}
          
          {/* Description */}
          {recommendation.description && (
            <p className="text-sm text-muted-foreground/80 leading-relaxed flex-1 line-clamp-2">
              {recommendation.description}
            </p>
          )}
          
          {/* Badge */}
          {recommendation.badge && (
            <div className="mt-4">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                {recommendation.badge}
              </span>
            </div>
          )}
        </div>
        
        {/* Hover effect */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </a>
    );
  };

  if (!topRecommendation && !runnerUp && !honorableMention) {
    return null;
  }

  return (
    <section className={cn("py-12 bg-background", className)} data-theme={dataTheme}>
      <div className="container max-w-7xl mx-auto px-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Our Recommendations
          </h2>
          <p className="text-muted-foreground">
            Based on extensive testing and real-world usage
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {topRecommendation && (
            <RecommendationCard recommendation={topRecommendation} type="top" />
          )}
          {runnerUp && (
            <RecommendationCard recommendation={runnerUp} type="runner-up" />
          )}
          {honorableMention && (
            <RecommendationCard recommendation={honorableMention} type="honorable" />
          )}
        </div>
      </div>
    </section>
  );
};

export { ResourceRecommendations };