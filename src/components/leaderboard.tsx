import { FileText, Server, Palette, Shield, Zap, Globe, Crown, Star } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { CollectionEntry } from 'astro:content';

interface RankedResource {
  rank: number;
  title: string;
  subtitle?: string;
  description?: string;
  href?: string;
  badge?: string;
  rating?: number;
  ratings?: Array<{
    name: string;
    value: number;
    maxValue?: number;
  }>;
}

interface LeaderboardCategory {
  id: string;
  name: string;
  slug: string;
  icon: React.ComponentType<any>;
  count: number;
  rankedItems: RankedResource[];
}

interface LeaderboardProps {
  "data-theme"?: string;
  title?: string;
  description?: string;
  activeCategory?: string;
  className?: string;
  resources?: CollectionEntry<'wordpress-resource'>[];
  categories?: CollectionEntry<'wordpress-category'>[];
  reviews?: CollectionEntry<'wordpress-review'>[];
}

const Leaderboard = ({
  "data-theme": dataTheme,
  title = "WordPress Leaderboard",
  description = "The top-ranked WordPress themes, plugins, and tools based on our comprehensive analysis and user feedback.",
  activeCategory = "themes",
  className,
  resources = [],
  categories = [],
  reviews = []
}: LeaderboardProps) => {
  const [selectedCategory, setSelectedCategory] = useState(activeCategory);

  // Create category data from content collections
  const categoryIconMap: Record<string, React.ComponentType<any>> = {
    themes: Palette,
    hosting: Server,
    security: Shield,
    performance: Zap,
    seo: Globe
  };

  const categoryData: LeaderboardCategory[] = categories.map(cat => {
    const categoryResources = resources.filter(r => r.data.category === cat.data.category);
    
    // Sort resources by rating (highest first) and create ranked list
    const sortedResources = categoryResources
      .map(resource => {
        const avgRating = resource.data.ratings 
          ? resource.data.ratings.reduce((sum, rating) => sum + rating.value, 0) / resource.data.ratings.length 
          : 0;
        return { resource, avgRating };
      })
      .sort((a, b) => {
        // Featured items get priority
        if (a.resource.data.featured && !b.resource.data.featured) return -1;
        if (!a.resource.data.featured && b.resource.data.featured) return 1;
        // Then sort by rating
        return b.avgRating - a.avgRating;
      });

    const rankedItems: RankedResource[] = sortedResources.map((item, index) => ({
      rank: index + 1,
      title: item.resource.data.title,
      subtitle: item.resource.data.subtitle,
      description: item.resource.data.description,
      href: `/wordpress-${cat.data.category}/${item.resource.data.slug}`,
      badge: item.resource.data.badge,
      rating: item.avgRating,
      ratings: item.resource.data.ratings
    }));

    return {
      id: cat.data.category,
      name: cat.data.title,
      slug: cat.data.category,
      icon: categoryIconMap[cat.data.category] || FileText,
      count: categoryResources.length,
      rankedItems
    };
  });

  const activeData = categoryData.find(cat => cat.id === selectedCategory) || categoryData[0];

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

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-4 w-4" />;
    if (rank <= 3) return <Star className="h-4 w-4" />;
    return <span className="text-sm font-bold">{rank}</span>;
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={cn(
          'h-4 w-4',
          i < Math.floor(rating) ? 'text-yellow-500 fill-current' : 'text-muted-foreground/30'
        )}
      />
    ));
  };

  return (
    <section 
      className={cn("bg-background py-32 text-foreground", className)} 
      data-theme={dataTheme}
    >
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl mb-4">
            {title}
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl text-lg tracking-tight md:text-xl">
            {description}
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex justify-center mb-12">
          <div className="flex flex-wrap gap-2 p-2 rounded-2xl bg-card/60 backdrop-blur-xl border border-brand">
            {categoryData.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300",
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "text-muted-foreground hover:text-foreground hover:bg-card/80"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {category.name}
                  <span className="ml-1 text-xs opacity-75">({category.count})</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Leaderboard */}
        {activeData && (
          <div className="max-w-4xl mx-auto">
            <div className="space-y-4">
              {activeData.rankedItems.map((item, index) => (
                <a
                  key={index}
                  href={item.href}
                  className="group relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-xl border border-brand hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 p-6 block"
                >
                  {/* Background gradient */}
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
                    <div className="absolute inset-0 bg-gradient-to-t from-card/40 via-transparent to-transparent" />
                  </div>
                  
                  <div className="relative z-10 flex items-center gap-6">
                    {/* Rank Badge */}
                    <div className={cn(
                      "flex items-center justify-center h-16 w-16 rounded-2xl font-bold flex-shrink-0",
                      getRankBadgeColor(item.rank)
                    )}>
                      {getRankIcon(item.rank)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 mb-1">
                            {item.title}
                          </h3>
                          {item.subtitle && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {item.subtitle}
                            </p>
                          )}
                        </div>
                        
                        {/* Badge */}
                        {item.badge && (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium ml-4">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                            {item.badge}
                          </span>
                        )}
                      </div>
                      
                      {/* Rating */}
                      {item.rating && item.rating > 0 && (
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex">
                            {renderStars(item.rating)}
                          </div>
                          <span className="text-sm font-medium text-foreground">
                            {item.rating.toFixed(1)}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            ({item.ratings?.length || 0} ratings)
                          </span>
                        </div>
                      )}
                      
                      {/* Description */}
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  
                  {/* Hover border highlight */}
                  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </a>
              ))}
            </div>

            {/* View All Link */}
            <div className="text-center mt-12">
              <a
                href={`/wordpress-${activeData.slug}`}
                className="inline-flex items-center gap-2 px-6 py-3 bg-card/60 backdrop-blur-xl border border-brand rounded-xl font-medium hover:bg-card/80 transition-colors"
              >
                View All {activeData.name}
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export { Leaderboard };