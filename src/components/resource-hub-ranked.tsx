import { FileText, Server, Palette, Shield, Zap, Globe, Trophy, Medal, Award } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { CollectionEntry } from 'astro:content';

interface ResourceCategory {
  id: string;
  name: string;
  slug: string;
  icon: React.ComponentType<any>;
  count: number;
  rankedList: Array<{
    title: string;
    subtitle?: string;
    description?: string;
    href?: string;
    badge?: string;
    ratings?: Array<{
      name: string;
      value: number;
      maxValue?: number;
    }>;
    avgRating?: number;
  }>;
  recommendation: {
    title: string;
    subtitle?: string;
    description?: string;
    editorsNote?: string;
    level?: string;
    href?: string;
    badge?: string;
    ratings?: Array<{
      name: string;
      value: number;
      maxValue?: number;
    }>;
  };
  runnerUp?: {
    title: string;
    subtitle?: string;
    description?: string;
    editorsNote?: string;
    level?: string;
    href?: string;
    badge?: string;
    ratings?: Array<{
      name: string;
      value: number;
      maxValue?: number;
    }>;
  };
  honorableMention?: {
    title: string;
    subtitle?: string;
    description?: string;
    editorsNote?: string;
    level?: string;
    href?: string;
    badge?: string;
  };
}

interface ResourceHubRankedProps {
  "data-theme"?: string;
  title?: string;
  description?: string;
  activeCategory?: string;
  className?: string;
  count?: number;
  resources?: CollectionEntry<'wordpress-resource'>[];
  categories?: CollectionEntry<'wordpress-category'>[];
  reviews?: CollectionEntry<'wordpress-review'>[];
}

const RankedList = ({ 
  title, 
  subtitle, 
  rankedList,
  recommendation,
  runnerUp,
  honorableMention,
  "data-theme": dataTheme 
}: {
  title: string;
  subtitle?: string;
  rankedList: ResourceCategory['rankedList'];
  recommendation: ResourceCategory['recommendation'];
  runnerUp?: ResourceCategory['runnerUp'];
  honorableMention?: ResourceCategory['honorableMention'];
  "data-theme"?: string;
}) => {
  const getRankBadgeStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          background: "bg-card/60 backdrop-blur-xl",
          border: "border border-yellow-500/30",
          text: "text-yellow-400",
          glow: "shadow-lg shadow-yellow-500/20"
        };
      case 2:
        return {
          background: "bg-card/60 backdrop-blur-xl",
          border: "border border-gray-400/30",
          text: "text-gray-300",
          glow: "shadow-lg shadow-gray-400/20"
        };
      case 3:
        return {
          background: "bg-card/60 backdrop-blur-xl",
          border: "border border-orange-500/30",
          text: "text-orange-400",
          glow: "shadow-lg shadow-orange-500/20"
        };
      default:
        return {
          background: "bg-card/60 backdrop-blur-xl",
          border: "border border-border/30",
          text: "text-foreground",
          glow: "shadow-lg shadow-foreground/10"
        };
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return Trophy; // Gold trophy
      case 2:
        return Medal; // Silver medal
      case 3:
        return Award; // Bronze award
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
    <div className="grid gap-8 lg:grid-cols-3" data-theme={dataTheme}>
      {/* Left Column - Ranked List */}
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">{title}</h2>
          {subtitle && (
            <p className="text-muted-foreground">{subtitle}</p>
          )}
        </div>

        <div className="space-y-4">
          {rankedList.map((item, index) => {
            const rank = index + 1;
            const RankIcon = getRankIcon(rank);
            
            return (
              <a
                key={item.title}
                href={item.href || '#'}
                className="group relative overflow-hidden rounded-xl bg-card/60 backdrop-blur-xl border border-brand hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 p-4 sm:p-6 block"
              >
                {/* Simple gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-secondary/3" />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Mobile: Stacked Layout, Desktop: Horizontal */}
                  <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6">
                    {/* Glass Ranking Badge */}
                    <div className={cn(
                      "flex items-center justify-center w-12 h-12 rounded-xl font-semibold text-sm flex-shrink-0 transition-all duration-300 sm:mt-0",
                      getRankBadgeStyle(rank).background,
                      getRankBadgeStyle(rank).border,
                      getRankBadgeStyle(rank).text,
                      getRankBadgeStyle(rank).glow
                    )}>
                      {RankIcon ? (
                        <RankIcon className="w-5 h-5" strokeWidth={2} />
                      ) : (
                        <span>{rank}</span>
                      )}
                    </div>

                    {/* Main content */}
                    <div className="flex-1 min-w-0">
                      {/* Title and Badge Row */}
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                        <div className="flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                            <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                              {item.title}
                            </h3>
                            {item.badge && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 text-primary text-xs font-medium w-fit">
                                <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                                {item.badge}
                              </span>
                            )}
                          </div>
                          {item.subtitle && (
                            <p className="text-sm text-muted-foreground mb-2">
                              {item.subtitle}
                            </p>
                          )}
                        </div>
                        
                        {/* Rating Display - Mobile: Full width, Desktop: Right aligned */}
                        {item.avgRating && (
                          <div className="flex items-center justify-between sm:justify-end gap-2">
                            <div className="flex items-center gap-2">
                              <StarRating rating={item.avgRating} />
                              <span className="text-base sm:text-lg font-bold text-foreground">
                                {item.avgRating.toFixed(1)}
                              </span>
                            </div>
                            {/* Arrow - Mobile: Inline, Desktop: Separate */}
                            <div className="sm:hidden">
                              <svg 
                                className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" 
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {item.description && (
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      
                      {/* Clean Detailed Ratings */}
                      {item.ratings && item.ratings.length > 0 && (
                        <div className="flex items-center gap-2 sm:gap-4 flex-wrap text-xs sm:text-sm">
                          {item.ratings.map((rating, index) => (
                            <div key={rating.name} className="flex items-center gap-1">
                              <span className="text-muted-foreground">
                                {rating.name}:
                              </span>
                              <span className="font-semibold text-foreground">
                                {rating.value.toFixed(1)}
                              </span>
                              {index < item.ratings.length - 1 && (
                                <span className="text-muted-foreground/50 ml-2 sm:ml-3">•</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Desktop Arrow */}
                    <div className="hidden sm:flex flex-shrink-0">
                      <svg 
                        className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {/* Right Column - Recommendations */}
      <div>
        <div className="space-y-6 sticky top-24">
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
                <svg className="h-4 w-4 text-primary fill-current" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
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
            
            {recommendation.editorsNote && (
              <div className="mb-4">
                <div className="text-xs font-medium text-muted-foreground mb-1">Editor's Note</div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {recommendation.editorsNote}
                </p>
              </div>
            )}

            {recommendation.level && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-secondary/10 text-secondary text-xs font-medium mb-4">
                {recommendation.level}
              </span>
            )}
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
                  <svg className="h-3.5 w-3.5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
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
              
              {runnerUp.editorsNote && (
                <div className="mb-3">
                  <div className="text-xs font-medium text-muted-foreground mb-1">Editor's Note</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {runnerUp.editorsNote}
                  </p>
                </div>
              )}

              {runnerUp.level && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-secondary/10 text-secondary text-xs font-medium">
                  {runnerUp.level}
                </span>
              )}
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
                  <svg className="h-3 w-3 text-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
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
              
              {honorableMention.editorsNote && (
                <div className="mb-3">
                  <div className="text-xs font-medium text-muted-foreground mb-1">Editor's Note</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {honorableMention.editorsNote}
                  </p>
                </div>
              )}

              {honorableMention.level && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-secondary/10 text-secondary text-xs font-medium">
                  {honorableMention.level}
                </span>
              )}
            </div>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};

const ResourceHubRanked = ({
  "data-theme": dataTheme,
  title = "Resource Hub",
  description = "Curated recommendations for WordPress themes, hosting, plugins, and tools to help you build better websites faster.",
  activeCategory = "themes",
  className,
  count = 10,
  resources = [],
  categories = [],
  reviews = []
}: ResourceHubRankedProps) => {
  const [selectedCategory, setSelectedCategory] = useState(activeCategory);

  // Create category data from content collections
  const categoryIconMap: Record<string, React.ComponentType<any>> = {
    themes: Palette,
    hosting: Server,
    security: Shield,
    performance: Zap,
    seo: Globe
  };

  const categoryData: ResourceCategory[] = categories.map(cat => {
    const categoryResources = resources.filter(r => r.data.category === cat.data.category);
    const categoryReviews = reviews.filter(r => r.data.category === cat.data.category);
    
    // Find recommendations based on category data
    const topRecommendation = categoryResources.find(r => r.data.slug === cat.data.topRecommendation?.slug);
    const runnerUp = categoryResources.find(r => r.data.slug === cat.data.runnerUp?.slug);
    const honorableMention = categoryResources.find(r => r.data.slug === cat.data.honorableMention?.slug);

    // Create ranked list from resources sorted by rating
    const rankedList = categoryResources
      .map(resource => {
        const ratings = resource.data.ratings || [];
        const avgRating = ratings.length > 0 
          ? ratings.reduce((sum, rating) => sum + rating.value, 0) / ratings.length
          : 0;
        
        return {
          title: resource.data.title,
          subtitle: resource.data.subtitle,
          description: resource.data.description,
          href: `/wordpress-${cat.data.category}/${resource.data.slug}`,
          badge: resource.data.badge,
          ratings: resource.data.ratings,
          avgRating
        };
      })
      .sort((a, b) => b.avgRating - a.avgRating)
      .slice(0, count);

    return {
      id: cat.data.category,
      name: cat.data.title,
      slug: cat.data.category,
      icon: categoryIconMap[cat.data.category] || FileText,
      count: cat.data.count || categoryResources.length,
      rankedList: rankedList,
      recommendation: topRecommendation ? {
        title: topRecommendation.data.title,
        subtitle: topRecommendation.data.subtitle,
        description: topRecommendation.data.description,
        editorsNote: cat.data.topRecommendation?.editorsNote,
        level: cat.data.topRecommendation?.level,
        href: `/wordpress-${cat.data.category}/${topRecommendation.data.slug}`,
        badge: topRecommendation.data.badge,
        ratings: topRecommendation.data.ratings
      } : {
        title: "Coming Soon",
        description: "More recommendations coming soon",
        href: "#"
      },
      runnerUp: runnerUp ? {
        title: runnerUp.data.title,
        subtitle: runnerUp.data.subtitle,
        description: runnerUp.data.description,
        editorsNote: cat.data.runnerUp?.editorsNote,
        level: cat.data.runnerUp?.level,
        href: `/wordpress-${cat.data.category}/${runnerUp.data.slug}`,
        badge: runnerUp.data.badge,
        ratings: runnerUp.data.ratings
      } : undefined,
      honorableMention: honorableMention ? {
        title: honorableMention.data.title,
        subtitle: honorableMention.data.subtitle,
        description: honorableMention.data.description,
        editorsNote: cat.data.honorableMention?.editorsNote,
        level: cat.data.honorableMention?.level,
        href: `/wordpress-${cat.data.category}/${honorableMention.data.slug}`,
        badge: honorableMention.data.badge
      } : undefined
    };
  });

  const activeData = categoryData.find(cat => cat.id === selectedCategory) || categoryData[0];

  return (
    <section className={cn("bg-background py-32 text-foreground", className)} data-theme={dataTheme}>
      <div className="container max-w-7xl mx-auto px-6">
        <div className="space-y-12">
          
          {/* Header Section */}
          <header className="text-left">
            <div className="flex items-center gap-4 mb-6">
              <FileText className="h-14 w-14 text-primary" strokeWidth={1.5} />
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

          {/* Category Tabs */}
          <div className="flex flex-col gap-8">
            <nav className="w-full">
              <div className="flex flex-wrap items-center gap-3">
                {categoryData.map((category) => {
                  const Icon = category.icon;
                  const isActive = selectedCategory === category.id;
                  
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={cn(
                        "flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300",
                        "hover:bg-card/60 hover:backdrop-blur-xl hover:border hover:border-border/20",
                        "hover:shadow-lg hover:scale-105",
                        isActive 
                          ? "bg-primary/10 text-primary border border-primary/20 font-medium shadow-lg scale-105" 
                          : "text-muted-foreground hover:text-primary bg-card/30 border border-border/10"
                      )}
                    >
                      <Icon className={cn(
                        "h-5 w-5 flex-shrink-0",
                        isActive ? "text-primary" : "text-muted-foreground"
                      )} />
                      <span className="font-medium">
                        {category.name}
                      </span>
                      <span className="text-xs opacity-75">
                        ({category.count})
                      </span>
                    </button>
                  );
                })}
              </div>
            </nav>

          </div>

          {/* Main Content Area */}
          <div className="w-full">
            <RankedList
              title={activeData.name}
              subtitle={`(${activeData.name.toLowerCase()} reviews, comparisons, and recommendations)`}
              rankedList={activeData.rankedList}
              recommendation={activeData.recommendation}
              runnerUp={activeData.runnerUp}
              honorableMention={activeData.honorableMention}
              data-theme={dataTheme}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export { ResourceHubRanked };