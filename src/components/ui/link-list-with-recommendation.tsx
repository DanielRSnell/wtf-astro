import { ExternalLink, Star, ArrowRight, Medal, Award } from "lucide-react";
import { cn } from "@/lib/utils";

interface LinkItem {
  title: string;
  href?: string;
  description?: string;
  badge?: string;
}

interface RatingItem {
  name: string;
  value: number; // 1-5 rating
  maxValue?: number; // defaults to 5
}

interface LinkListWithRecommendationProps {
  title: string;
  description?: string;
  subtitle?: string;
  links: LinkItem[];
  recommendation: {
    title: string;
    subtitle?: string;
    description?: string;
    href?: string;
    badge?: string;
    ratings?: RatingItem[];
  };
  runnerUp?: {
    title: string;
    subtitle?: string;
    description?: string;
    href?: string;
    badge?: string;
    ratings?: RatingItem[];
  };
  honorableMention?: {
    title: string;
    subtitle?: string;
    description?: string;
    href?: string;
    badge?: string;
    ratings?: RatingItem[];
  };
  className?: string;
  "data-theme"?: string;
  layout?: "standalone" | "grid";
  showCard?: boolean;
}

const LinkListWithRecommendation = ({
  title,
  description,
  subtitle,
  links,
  recommendation,
  runnerUp,
  honorableMention,
  className,
  "data-theme": dataTheme,
  layout = "standalone",
  showCard = true
}: LinkListWithRecommendationProps) => {

  const RatingDisplay = ({ ratings, colorClass = "text-primary" }: { ratings: RatingItem[]; colorClass?: string }) => {
    if (!ratings || ratings.length === 0) return null;

    return (
      <div className="space-y-2 mb-4">
        {ratings.map((rating, index) => {
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
                  {rating.value.toFixed(1)}/{maxValue}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    );
  };


  return (
    <div className={cn("w-full", className)} data-theme={dataTheme}>
      <div className={cn(
        "relative overflow-hidden transition-all duration-700",
        showCard ? "rounded-3xl bg-card/60 backdrop-blur-xl border border-border/30 hover:border-border/50 p-8" : ""
      )}>
        {/* Background gradients - only show when card is enabled */}
        {showCard && (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
            <div className="absolute inset-0 bg-gradient-to-t from-card/20 via-transparent to-transparent" />
          </>
        )}
        
        <div className={cn(
          showCard ? "relative z-10" : "",
          "grid gap-8",
          layout === "standalone" ? "lg:grid-cols-2" : "grid-cols-1"
        )}>
          {/* Left side - Link List */}
          <div>
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                {title}
              </h2>
              <div className="h-1 w-12 rounded-full bg-gradient-to-r from-primary to-primary/60 mb-3" />
              {subtitle && (
                <p className="text-muted-foreground text-sm mb-2">
                  {subtitle}
                </p>
              )}
              {description && (
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {description}
                </p>
              )}
            </div>

            {/* Links */}
            <div className="flex flex-col gap-4">
              {links.map((link, index) => (
                <div
                  key={index}
                  className="group"
                >
                  <a
                    href={link.href}
                    className="flex items-center justify-between hover:text-primary transition-colors duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-r from-primary to-primary/60 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground group-hover:text-primary transition-colors duration-200">
                            {link.title}
                          </span>
                          {link.badge && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5">
                              <Star className="h-2.5 w-2.5 text-primary fill-current" />
                              <span className="text-xs font-semibold text-primary">{link.badge}</span>
                            </span>
                          )}
                        </div>
                        {link.description && (
                          <div className="text-xs text-muted-foreground mt-1">
                            {link.description}
                          </div>
                        )}
                      </div>
                    </div>
                    {link.href && (
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-200 flex-shrink-0" />
                    )}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Recommendations */}
          <div className="relative">
            <div className={cn(
              "space-y-6",
              layout === "standalone" ? "sticky top-8" : ""
            )}>
              {/* Top Recommendation */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent backdrop-blur-sm border border-primary/20 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:ring-2 hover:ring-primary/20 cursor-pointer p-6">
                {/* Background glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />
                
                {/* Absolute link covering entire card */}
                {recommendation.href && (
                  <a 
                    href={recommendation.href}
                    className="absolute inset-0 z-20"
                    aria-label={`Learn more about ${recommendation.title}`}
                  />
                )}
                
                <div className="relative z-10">
                  {/* Header with star */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 backdrop-blur-sm border border-primary/20">
                      <Star className="h-4 w-4 text-primary fill-current" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-primary">Top Recommendation</div>
                    </div>
                  </div>

                  {/* Badge if provided */}
                  {recommendation.badge && (
                    <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 mb-4">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="text-xs font-medium text-primary">{recommendation.badge}</span>
                    </div>
                  )}

                  {/* Recommendation content */}
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-300">
                    {recommendation.title}
                  </h3>
                  
                  {recommendation.subtitle && (
                    <p className="text-sm font-medium text-muted-foreground mb-3">
                      {recommendation.subtitle}
                    </p>
                  )}
                  
                  {recommendation.description && (
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {recommendation.description}
                    </p>
                  )}

                  {/* Ratings */}
                  <RatingDisplay ratings={recommendation.ratings} colorClass="text-primary" />
                </div>

                {/* Subtle border highlight */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Runner Up */}
              {runnerUp && (
                <div className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-500/5 via-transparent to-orange-400/5 backdrop-blur-sm border border-orange-400/20 hover:border-orange-400/30 transition-all duration-500 hover:shadow-lg hover:shadow-orange-400/5 hover:ring-2 hover:ring-orange-400/20 cursor-pointer p-5">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-400/3 via-transparent to-transparent" />
                  
                  {/* Absolute link covering entire card */}
                  {runnerUp.href && (
                    <a 
                      href={runnerUp.href}
                      className="absolute inset-0 z-20"
                      aria-label={`View details about ${runnerUp.title}`}
                    />
                  )}
                  
                  <div className="relative z-10">
                    {/* Header with medal */}
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-400/10 backdrop-blur-sm border border-orange-400/20">
                        <Medal className="h-3.5 w-3.5 text-orange-400" />
                      </div>
                      <div className="text-xs font-semibold text-orange-400">Runner Up</div>
                    </div>

                    {/* Badge if provided */}
                    {runnerUp.badge && (
                      <div className="inline-flex items-center gap-1 rounded-full bg-orange-400/10 px-2.5 py-0.5 mb-3">
                        <div className="h-1 w-1 rounded-full bg-orange-400" />
                        <span className="text-xs font-medium text-orange-400">{runnerUp.badge}</span>
                      </div>
                    )}

                    <h4 className="text-lg font-bold text-foreground mb-1 group-hover:text-orange-400 transition-colors duration-300">
                      {runnerUp.title}
                    </h4>
                    
                    {runnerUp.subtitle && (
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        {runnerUp.subtitle}
                      </p>
                    )}
                    
                    {runnerUp.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                        {runnerUp.description}
                      </p>
                    )}

                    {/* Ratings */}
                    <RatingDisplay ratings={runnerUp.ratings} colorClass="text-orange-400" />
                  </div>
                </div>
              )}

              {/* Honorable Mention */}
              {honorableMention && (
                <div className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-muted/10 via-background to-muted/5 backdrop-blur-sm border-2 border-foreground/20 hover:border-foreground/30 transition-all duration-500 hover:shadow-lg hover:shadow-foreground/10 hover:ring-2 hover:ring-foreground/20 cursor-pointer p-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 via-transparent to-muted/3" />
                  
                  {/* Absolute link covering entire card */}
                  {honorableMention.href && (
                    <a 
                      href={honorableMention.href}
                      className="absolute inset-0 z-20"
                      aria-label={`Check out ${honorableMention.title}`}
                    />
                  )}
                  
                  <div className="relative z-10">
                    {/* Header with award */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-foreground/10 backdrop-blur-sm border border-foreground/20">
                        <Award className="h-3 w-3 text-foreground" />
                      </div>
                      <div className="text-xs font-semibold text-foreground">Honorable Mention</div>
                    </div>

                    {/* Badge if provided */}
                    {honorableMention.badge && (
                      <div className="inline-flex items-center gap-1 rounded-full bg-foreground/10 px-2 py-0.5 mb-2">
                        <div className="h-1 w-1 rounded-full bg-foreground" />
                        <span className="text-xs font-medium text-foreground">{honorableMention.badge}</span>
                      </div>
                    )}

                    <h5 className="text-base font-bold text-foreground mb-1 group-hover:text-foreground/80 transition-colors duration-300">
                      {honorableMention.title}
                    </h5>
                    
                    {honorableMention.subtitle && (
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        {honorableMention.subtitle}
                      </p>
                    )}
                    
                    {honorableMention.description && (
                      <p className="text-xs text-muted-foreground leading-relaxed mb-3">
                        {honorableMention.description}
                      </p>
                    )}

                    {/* Ratings */}
                    <RatingDisplay ratings={honorableMention.ratings} colorClass="text-foreground" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { LinkListWithRecommendation };