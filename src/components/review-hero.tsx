import React from "react";
import { Star, Calendar, User, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/magicui/dot-pattern";

interface RatingItem {
  name: string;
  value: number;
  maxValue?: number;
}

export interface BreadcrumbItem {
  name: string;
  href?: string;
  current?: boolean;
}

interface ReviewHeroProps {
  title: string;
  subtitle?: string;
  description: string;
  overallRating: number;
  totalReviews?: number;
  publishDate?: string;
  author?: string;
  badge?: string;
  ratings: RatingItem[];
  alignment?: "left" | "center";
  className?: string;
  "data-theme"?: string;
  breadcrumbItems?: BreadcrumbItem[];
}

const ReviewHero = ({
  title,
  subtitle,
  description,
  overallRating,
  totalReviews = 0,
  publishDate,
  author,
  badge,
  ratings,
  alignment = "left",
  className,
  "data-theme": dataTheme,
  breadcrumbItems
}: ReviewHeroProps) => {

  const RatingDisplay = ({ ratings }: { ratings: RatingItem[] }) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {ratings.map((rating, index) => {
          const maxValue = rating.maxValue || 5;
          const filledStars = Math.floor(rating.value);
          const hasHalfStar = rating.value % 1 >= 0.5;
          const emptyStars = maxValue - filledStars - (hasHalfStar ? 1 : 0);

          return (
            <div
              key={index}
              className="text-center"
            >
              <div className="mb-2">
                <div className="flex items-center justify-center gap-0.5 mb-1">
                  {/* Filled stars */}
                  {[...Array(filledStars)].map((_, i) => (
                    <Star key={`filled-${i}`} className="h-4 w-4 text-primary fill-current" />
                  ))}
                  {/* Half star */}
                  {hasHalfStar && (
                    <div className="relative">
                      <Star className="h-4 w-4 text-muted-foreground/30" />
                      <div className="absolute inset-0 overflow-hidden w-1/2">
                        <Star className="h-4 w-4 text-primary fill-current" />
                      </div>
                    </div>
                  )}
                  {/* Empty stars */}
                  {[...Array(emptyStars)].map((_, i) => (
                    <Star key={`empty-${i}`} className="h-4 w-4 text-muted-foreground/30" />
                  ))}
                </div>
                <div className="text-lg font-bold text-primary">
                  {rating.value.toFixed(1)}
                </div>
              </div>
              <div className="text-sm font-medium text-foreground">
                {rating.name}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  const OverallRatingDisplay = () => {
    const filledStars = Math.floor(overallRating);
    const hasHalfStar = overallRating % 1 >= 0.5;
    const emptyStars = 5 - filledStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          {/* Filled stars */}
          {[...Array(filledStars)].map((_, i) => (
            <Star key={`overall-filled-${i}`} className="h-6 w-6 text-primary fill-current" />
          ))}
          {/* Half star */}
          {hasHalfStar && (
            <div className="relative">
              <Star className="h-6 w-6 text-muted-foreground/30" />
              <div className="absolute inset-0 overflow-hidden w-1/2">
                <Star className="h-6 w-6 text-primary fill-current" />
              </div>
            </div>
          )}
          {/* Empty stars */}
          {[...Array(emptyStars)].map((_, i) => (
            <Star key={`overall-empty-${i}`} className="h-6 w-6 text-muted-foreground/30" />
          ))}
        </div>
        <div className="text-3xl font-bold text-primary">
          {overallRating.toFixed(1)}
        </div>
        {totalReviews > 0 && (
          <div className="text-sm text-muted-foreground">
            ({totalReviews.toLocaleString()} reviews)
          </div>
        )}
      </div>
    );
  };

  return (
    <section className={cn("relative py-24 bg-background overflow-hidden", className)} data-theme={dataTheme}>
      {/* Dot Pattern Background - matching Hero24 style */}
      <div className="absolute inset-0 overflow-hidden">
        <DotPattern
          glow={true}
          className="text-primary/60 fill-primary/60"
          width={32}
          height={32}
          cx={2}
          cy={2}
          cr={2}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background/80 pointer-events-none" />
        
        {/* Blur elements for visual consistency */}
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      </div>
      
      <div className="container max-w-6xl mx-auto px-6 relative z-10">
        {/* Header Section */}
        <div
          className={cn("mb-12", alignment === "center" ? "text-center" : "text-left")}
        >
          {/* Badge */}
          {badge && (
            <div
              className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 mb-6"
            >
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-sm font-medium text-primary">{badge}</span>
            </div>
          )}
          
          {/* Breadcrumb */}
          {breadcrumbItems && breadcrumbItems.length > 0 && (
            <div className="mb-4">
              <nav aria-label="Breadcrumb" className="flex items-center text-sm">
                {breadcrumbItems.map((item, index) => {
                  const isLast = index === breadcrumbItems.length - 1;
                  return (
                    <React.Fragment key={index}>
                      {item.href && !isLast ? (
                        <a
                          href={item.href}
                          className="text-muted-foreground hover:text-primary transition-colors duration-200"
                          aria-current={item.current ? 'page' : undefined}
                        >
                          {item.name}
                        </a>
                      ) : (
                        <span
                          className={cn(
                            isLast ? "text-foreground" : "text-muted-foreground"
                          )}
                          aria-current={isLast ? 'page' : undefined}
                        >
                          {item.name}
                        </span>
                      )}
                      {!isLast && (
                        <ChevronRight className="h-4 w-4 mx-2 flex-shrink-0 text-muted-foreground/50" />
                      )}
                    </React.Fragment>
                  );
                })}
              </nav>
            </div>
          )}
          
          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4">
            {title}
          </h1>
          
          {/* Subtitle */}
          {subtitle && (
            <p className="text-xl text-muted-foreground mb-6">
              {subtitle}
            </p>
          )}
          
          {/* Meta Info */}
          <div className={cn(
            "flex items-center gap-6 text-sm text-muted-foreground mb-8",
            alignment === "center" ? "justify-center" : "justify-start"
          )}>
            {author && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span>By {author}</span>
              </div>
            )}
            {publishDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{publishDate}</span>
              </div>
            )}
          </div>
          
          {/* Overall Rating */}
          <div
            className={cn(
              "flex mb-8",
              alignment === "center" ? "justify-center" : "justify-start"
            )}
          >
            <OverallRatingDisplay />
          </div>
          
          {/* Description */}
          <p
            className={cn(
              "text-lg text-muted-foreground leading-relaxed mb-8",
              alignment === "center" ? "max-w-3xl mx-auto" : "max-w-4xl"
            )}
          >
            {description}
          </p>
          
        </div>
        
        {/* Rating Breakdown */}
        <div
          className="relative overflow-hidden rounded-3xl bg-card/60 backdrop-blur-xl border border-border/30 p-8"
        >
          {/* Background gradients */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-secondary/3" />
          <div className="absolute inset-0 bg-gradient-to-t from-card/20 via-transparent to-transparent" />
          
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">
              Detailed Ratings
            </h2>
            <RatingDisplay ratings={ratings} />
          </div>
          
          {/* Subtle border highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        </div>
      </div>
    </section>
  );
};

export { ReviewHero };