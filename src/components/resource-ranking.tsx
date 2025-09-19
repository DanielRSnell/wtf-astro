import { FileText, Server, Palette, Shield, Zap, Globe } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { CollectionEntry } from 'astro:content';

interface ResourceRankingProps {
  "data-theme"?: string;
  title?: string;
  description?: string;
  className?: string;
  resources?: CollectionEntry<'wordpress-resource'>[];
}

const ResourceRanking = ({
  "data-theme": dataTheme,
  title = "WordPress Theme Rankings",
  description = "The top-ranked WordPress themes based on our comprehensive analysis and user feedback.",
  className,
  resources = []
}: ResourceRankingProps) => {
  // Filter to only themes and sort by rating
  const themeResources = resources
    .filter(r => {
      const categories = Array.isArray(r.data.category) 
        ? r.data.category 
        : [r.data.category];
      return categories.includes('themes');
    })
    .map(resource => {
      // Calculate average rating
      const ratings = resource.data.ratings || [];
      const avgRating = ratings.length > 0 
        ? ratings.reduce((sum, rating) => sum + rating.value, 0) / ratings.length
        : 0;
      
      return {
        ...resource,
        avgRating
      };
    })
    .sort((a, b) => b.avgRating - a.avgRating);

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-500 to-yellow-600 text-white"; // Gold
      case 2:
        return "bg-gradient-to-r from-gray-400 to-gray-500 text-white"; // Silver
      case 3:
        return "bg-gradient-to-r from-orange-600 to-orange-700 text-white"; // Bronze
      default:
        return "bg-gradient-to-r from-primary/20 to-secondary/20 text-foreground border border-border/20";
    }
  };

  const getCrownIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return "👑"; // Gold crown
      case 2:
        return "🥈"; // Silver medal
      case 3:
        return "🥉"; // Bronze medal
      default:
        return null;
    }
  };

  const StarRating = ({ rating, maxRating = 5 }: { rating: number; maxRating?: number }) => {
    return (
      <div className="flex items-center">
        {Array.from({ length: maxRating }, (_, i) => (
          <svg
            key={i}
            className={`w-4 h-4 ${
              i < Math.floor(rating)
                ? 'text-primary fill-current'
                : 'text-muted-foreground/30'
            }`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  return (
    <section className={cn("bg-background py-32 text-foreground", className)} data-theme={dataTheme}>
      <div className="container max-w-7xl mx-auto px-6">
        <div className="space-y-12">
          
          {/* Header Section */}
          <header className="text-left">
            <div className="flex items-center gap-4 mb-6">
              <Palette className="h-14 w-14 text-primary" strokeWidth={1.5} />
              <h1 className="text-4xl font-extrabold lg:text-5xl">
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  {title}
                </span>
              </h1>
            </div>
            <p className="text-muted-foreground text-lg max-w-3xl mb-8">
              {description}
            </p>
            
            {/* Separator */}
            <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent w-full max-w-2xl" />
          </header>

          {/* Rankings List */}
          <div className="w-full">
            <div className="grid gap-6">
              {themeResources.map((resource, index) => {
                const rank = index + 1;
                const crownIcon = getCrownIcon(rank);
                
                return (
                  <a
                    key={resource.data.slug}
                    href={`/wordpress-themes/${resource.data.slug}`}
                    className="group relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-xl border border-border/20 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 p-8 block"
                  >
                    {/* Layered gradient backgrounds */}
                    <div className="absolute inset-0">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
                      <div className="absolute inset-0 bg-gradient-to-t from-card/40 via-transparent to-transparent" />
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10 flex items-start gap-6">
                      {/* Ranking Badge */}
                      <div className={cn(
                        "flex items-center justify-center w-16 h-16 rounded-2xl font-bold text-xl flex-shrink-0",
                        getRankBadgeColor(rank)
                      )}>
                        {crownIcon ? (
                          <span className="text-2xl">{crownIcon}</span>
                        ) : (
                          <span>{rank}</span>
                        )}
                      </div>

                      {/* Theme Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
                                {resource.data.title}
                              </h3>
                              {resource.data.badge && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                  {resource.data.badge}
                                </span>
                              )}
                            </div>
                            {resource.data.subtitle && (
                              <p className="text-lg text-muted-foreground mb-3">
                                {resource.data.subtitle}
                              </p>
                            )}
                          </div>

                          {/* Overall Rating */}
                          <div className="flex items-center gap-3 text-right">
                            <StarRating rating={resource.avgRating} />
                            <span className="text-2xl font-bold text-foreground">
                              {resource.avgRating.toFixed(1)}
                            </span>
                            <span className="text-sm text-muted-foreground">
                              ({resource.data.ratings?.length || 0} ratings)
                            </span>
                          </div>
                        </div>

                        <p className="text-muted-foreground mb-6 line-clamp-2 text-base">
                          {resource.data.description}
                        </p>

                        {/* Detailed Ratings */}
                        {resource.data.ratings && resource.data.ratings.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {resource.data.ratings.map((rating) => (
                              <div key={rating.name} className="text-center">
                                <div className="text-sm text-muted-foreground mb-1">
                                  {rating.name}
                                </div>
                                <div className="text-lg font-semibold text-foreground">
                                  {rating.value.toFixed(1)}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Arrow */}
                      <div className="flex-shrink-0">
                        <svg 
                          className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors duration-300" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Hover border highlight */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </a>
                );
              })}
            </div>

            {/* View All Link */}
            <div className="mt-12 text-center">
              <a
                href="/wordpress-themes"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-colors group"
              >
                View All WordPress Themes
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export { ResourceRanking };