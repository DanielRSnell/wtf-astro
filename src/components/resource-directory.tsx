import { useState } from 'react';
import { Star, Award, TrendingUp, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DotPattern } from '@/components/magicui/dot-pattern';
import type { CollectionEntry } from 'astro:content';

interface ResourceDirectoryProps {
  'data-theme'?: string;
  category: string;
  title: string;
  description: string;
  resources: CollectionEntry<'wordpress-resource'>[];
  relatedPosts?: CollectionEntry<'blog'>[];
  baseUrl: string;
  categoryData?: CollectionEntry<'wordpress-category'>;
}

const ResourceDirectory = ({
  'data-theme': dataTheme,
  category,
  title,
  description,
  resources,
  relatedPosts = [],
  baseUrl,
  categoryData
}: ResourceDirectoryProps) => {

  // Calculate average rating for each resource
  const resourcesWithRatings = resources.map(resource => {
    const avgRating = resource.data.ratings 
      ? resource.data.ratings.reduce((sum, rating) => sum + rating.value, 0) / resource.data.ratings.length 
      : 0;
    return { ...resource, avgRating };
  });

  // Sort resources by rating
  const sortedResources = resourcesWithRatings
    .sort((a, b) => b.avgRating - a.avgRating);
  
  // Get top recommendations - handle both cases where slug might be in the data
  const topRecommendation = categoryData?.data?.topRecommendation 
    ? resources.find(r => {
        // The slug in Astro collections is at the root level, not in data
        return r.slug === categoryData.data.topRecommendation?.slug;
      })
    : null;
  const runnerUp = categoryData?.data?.runnerUp 
    ? resources.find(r => {
        return r.slug === categoryData.data.runnerUp?.slug;
      })
    : null;
  const honorableMention = categoryData?.data?.honorableMention
    ? resources.find(r => {
        return r.slug === categoryData.data.honorableMention?.slug;
      })
    : null;
  
  // Debug logging to see what we're getting
  if (typeof window !== 'undefined') {
    console.log('CategoryData:', categoryData);
    console.log('Resources count:', resources.length);
    console.log('Looking for:', {
      top: categoryData?.data?.topRecommendation?.slug,
      runner: categoryData?.data?.runnerUp?.slug,
      mention: categoryData?.data?.honorableMention?.slug
    });
    console.log('Found:', {
      top: topRecommendation?.data?.title,
      runner: runnerUp?.data?.title,
      mention: honorableMention?.data?.title
    });
    console.log('Resource slugs:', resources.map(r => r.slug));
  }

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
    <div className="bg-background text-foreground" data-theme={dataTheme}>
      {/* Hero Section with Dot Pattern */}
      <section className="relative py-32">
        {/* Background decorative elements */}
        <div className="absolute inset-0">
          {/* Dot pattern background */}
          <DotPattern
            glow={true}
            className="text-primary opacity-80"
            width={30}
            height={30}
            cx={1}
            cy={1}
            cr={2}
          />
          
          {/* Gradient overlay for smooth blend */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />
          
          {/* Original blur elements matching Hero24 */}
          <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        </div>
        
        <div className="container relative">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground/60 to-foreground bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              {description}
            </p>
        </div>
      </div>
      </section>

      {/* Top Recommendations Section */}
      {(topRecommendation || runnerUp || honorableMention) && (
        <section className="py-16 border-b border-border/20">
          <div className="container">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Our Top Picks
            </h2>
            <p className="text-muted-foreground mb-8">
              Based on extensive testing and real-world usage
            </p>
            
            <div className="grid md:grid-cols-3 gap-6">
              {/* Top Pick Card */}
              {topRecommendation && (
                <a
                  href={`${baseUrl}/${topRecommendation.slug}`}
                  className="group relative flex flex-col h-full rounded-2xl bg-card/60 backdrop-blur-xl border border-yellow-500/20 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:scale-[1.02]"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-yellow-500/10 to-transparent opacity-50" />
                  <div className="relative z-10 p-6 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-yellow-500" />
                        <span className="text-xs font-semibold uppercase tracking-wide text-yellow-500">Top Pick</span>
                      </div>
                      {topRecommendation.data.ratings && topRecommendation.data.ratings.length > 0 && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10">
                          <Star className="w-3 h-3 text-primary fill-current" />
                          <span className="text-xs font-medium text-primary">
                            {(topRecommendation.data.ratings.reduce((sum, r) => sum + r.value, 0) / topRecommendation.data.ratings.length).toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {topRecommendation.data.title}
                    </h3>
                    {topRecommendation.data.subtitle && (
                      <p className="text-sm text-muted-foreground mb-3">{topRecommendation.data.subtitle}</p>
                    )}
                    <p className="text-sm text-muted-foreground/80 leading-relaxed flex-1 line-clamp-2">
                      {topRecommendation.data.description}
                    </p>
                    {topRecommendation.data.badge && (
                      <div className="mt-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                          {topRecommendation.data.badge}
                        </span>
                      </div>
                    )}
                  </div>
                </a>
              )}
              
              {/* Runner Up Card */}
              {runnerUp && (
                <a
                  href={`${baseUrl}/${runnerUp.slug}`}
                  className="group relative flex flex-col h-full rounded-2xl bg-card/60 backdrop-blur-xl border border-blue-500/20 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:scale-[1.02]"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/10 to-transparent opacity-50" />
                  <div className="relative z-10 p-6 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Star className="w-5 h-5 text-blue-500" />
                        <span className="text-xs font-semibold uppercase tracking-wide text-blue-500">Runner Up</span>
                      </div>
                      {runnerUp.data.ratings && runnerUp.data.ratings.length > 0 && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10">
                          <Star className="w-3 h-3 text-primary fill-current" />
                          <span className="text-xs font-medium text-primary">
                            {(runnerUp.data.ratings.reduce((sum, r) => sum + r.value, 0) / runnerUp.data.ratings.length).toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {runnerUp.data.title}
                    </h3>
                    {runnerUp.data.subtitle && (
                      <p className="text-sm text-muted-foreground mb-3">{runnerUp.data.subtitle}</p>
                    )}
                    <p className="text-sm text-muted-foreground/80 leading-relaxed flex-1 line-clamp-2">
                      {runnerUp.data.description}
                    </p>
                    {runnerUp.data.badge && (
                      <div className="mt-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                          {runnerUp.data.badge}
                        </span>
                      </div>
                    )}
                  </div>
                </a>
              )}
              
              {/* Honorable Mention Card */}
              {honorableMention && (
                <a
                  href={`${baseUrl}/${honorableMention.slug}`}
                  className="group relative flex flex-col h-full rounded-2xl bg-card/60 backdrop-blur-xl border border-purple-500/20 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:scale-[1.02]"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-500/10 to-transparent opacity-50" />
                  <div className="relative z-10 p-6 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-purple-500" />
                        <span className="text-xs font-semibold uppercase tracking-wide text-purple-500">Honorable Mention</span>
                      </div>
                      {honorableMention.data.ratings && honorableMention.data.ratings.length > 0 && (
                        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10">
                          <Star className="w-3 h-3 text-primary fill-current" />
                          <span className="text-xs font-medium text-primary">
                            {(honorableMention.data.ratings.reduce((sum, r) => sum + r.value, 0) / honorableMention.data.ratings.length).toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {honorableMention.data.title}
                    </h3>
                    {honorableMention.data.subtitle && (
                      <p className="text-sm text-muted-foreground mb-3">{honorableMention.data.subtitle}</p>
                    )}
                    <p className="text-sm text-muted-foreground/80 leading-relaxed flex-1 line-clamp-2">
                      {honorableMention.data.description}
                    </p>
                    {honorableMention.data.badge && (
                      <div className="mt-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/20 text-primary">
                          {honorableMention.data.badge}
                        </span>
                      </div>
                    )}
                  </div>
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {/* All Resources Section */}
      <section className="py-16">
        <div className="container">
          {/* Section Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">
              All {title}
            </h2>
            <p className="text-muted-foreground">
              Browse our complete collection of {resources.length} carefully reviewed {category.toLowerCase()}
            </p>
          </div>

          {/* Resource Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {sortedResources.map((resource) => (
            <a
              key={resource.slug}
              href={`${baseUrl}/${resource.slug}`}
              className="group relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-xl border border-brand hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 p-6 block"
            >
              {/* Background gradient */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
                <div className="absolute inset-0 bg-gradient-to-t from-card/40 via-transparent to-transparent" />
              </div>
              
              {/* Content */}
              <div className="relative z-10">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300 mb-2">
                      {resource.data.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {resource.data.subtitle}
                    </p>
                  </div>
                  {resource.data.featured && (
                    <Badge variant="secondary" className="ml-2">
                      Featured
                    </Badge>
                  )}
                </div>
                
                {/* Rating */}
                {resource.data.ratings && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex">
                      {renderStars(resource.avgRating)}
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {resource.avgRating.toFixed(1)}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({resource.data.ratings.length} ratings)
                    </span>
                  </div>
                )}
                
                {/* Description */}
                <p className="text-sm text-muted-foreground mb-6 line-clamp-3">
                  {resource.data.description}
                </p>
                
                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    {resource.data.pricing?.free ? (
                      <span className="text-green-400 font-medium">Free</span>
                    ) : resource.data.pricing?.startingPrice ? (
                      <span className="font-medium">{resource.data.pricing.startingPrice}</span>
                    ) : (
                      <span>Custom Pricing</span>
                    )}
                  </div>
                  
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                </div>
              </div>
              
              {/* Hover border highlight */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </a>
          ))}
        </div>

        {/* Related Posts Section */}
        {relatedPosts.length > 0 && (
          <div className="border-t border-border/20 pt-16">
            <h2 className="text-3xl font-bold mb-8">Related Articles & Guides</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.slice(0, 6).map((post) => (
                <a
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-xl border border-brand hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 p-6 block"
                >
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">
                        {post.data.category}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {new Date(post.data.date).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors duration-300 mb-2">
                      {post.data.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {post.data.description}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{post.data.readTime || 5} min read</span>
                      <ChevronRight className="h-4 w-4 group-hover:text-primary transition-colors duration-300" />
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}
        </div>
      </section>
    </div>
  );
};

export { ResourceDirectory };