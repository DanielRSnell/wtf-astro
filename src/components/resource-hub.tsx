import { FileText, Server, Palette, Shield, Zap, Globe, FormInput, Workflow, Settings } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { LinkListWithRecommendation } from "./ui/link-list-with-recommendation";
import type { CollectionEntry } from 'astro:content';

interface ResourceCategory {
  id: string;
  name: string;
  slug: string;
  icon: React.ComponentType<any>;
  count: number;
  links: Array<{
    title: string;
    href?: string;
    description?: string;
  }>;
  recommendation: {
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
  };
  runnerUp?: {
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
  };
  honorableMention?: {
    title: string;
    subtitle?: string;
    description?: string;
    href?: string;
    badge?: string;
  };
}

interface ResourceHubProps {
  "data-theme"?: string;
  title?: string;
  description?: string;
  activeCategory?: string;
  className?: string;
  resources?: CollectionEntry<'wordpress-resource'>[];
  categories?: CollectionEntry<'wordpress-category'>[];
  reviews?: CollectionEntry<'wordpress-review'>[];
}

const ResourceHub = ({
  "data-theme": dataTheme,
  title = "Resource Hub",
  description = "Curated recommendations for WordPress themes, hosting, plugins, and tools to help you build better websites faster.",
  activeCategory = "themes",
  className,
  resources = [],
  categories = [],
  reviews = []
}: ResourceHubProps) => {
  const [selectedCategory, setSelectedCategory] = useState(activeCategory);

  // Create category data from content collections
  const categoryIconMap: Record<string, React.ComponentType<any>> = {
    themes: Palette,
    hosting: Server,
    security: Shield,
    performance: Zap,
    'woocommerce-themes': Palette,
    'woocommerce-plugins': Server,
    seo: Globe,
    forms: FormInput,
    automation: Workflow,
    admin: Settings
  };

  const categoryData: ResourceCategory[] = categories.map(cat => {
    // Handle both string and array categories
    const categoryResources = resources.filter(r => {
      const resourceCategory = r.data.category;
      if (Array.isArray(resourceCategory)) {
        return resourceCategory.includes(cat.data.category);
      }
      return resourceCategory === cat.data.category;
    });
    
    const categoryReviews = reviews.filter(r => {
      const reviewCategory = r.data.category;
      if (Array.isArray(reviewCategory)) {
        return reviewCategory.includes(cat.data.category);
      }
      return reviewCategory === cat.data.category;
    });
    
    // Find recommendations based on category data
    const topRecommendation = categoryResources.find(r => r.data.slug === cat.data.topRecommendation?.slug);
    const runnerUp = categoryResources.find(r => r.data.slug === cat.data.runnerUp?.slug);
    const honorableMention = categoryResources.find(r => r.data.slug === cat.data.honorableMention?.slug);

    // Calculate average rating for each resource
    const resourcesWithRatings = categoryResources.map(resource => {
      const ratings = resource.data.ratings || [];
      const avgRating = ratings.length > 0 
        ? ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length 
        : 0;
      return { ...resource, avgRating };
    });

    // Sort resources by average rating (highest first)
    const sortedResources = resourcesWithRatings.sort((a, b) => b.avgRating - a.avgRating);

    // Generate links from sorted resources with rating badges
    // Use wordpress- prefix for all categories except woocommerce ones
    const categoryPath = cat.data.category.startsWith('woocommerce-') 
      ? cat.data.category
      : `wordpress-${cat.data.category}`;
    
    const resourceLinks = sortedResources.slice(0, 10).map(resource => ({
      title: resource.data.title,
      href: `/${categoryPath}/${resource.data.slug}`,
      description: resource.data.description,
      badge: resource.avgRating > 0 ? resource.avgRating.toFixed(1) : undefined
    }));
    
    // Convert review posts to links format
    const reviewLinks = categoryReviews.map(review => ({
      title: review.data.title,
      href: `/wordpress-reviews/${review.data.slug}`,
      description: review.data.description
    }));
    
    // Combine resource links and review links
    const allLinks = [...resourceLinks, ...reviewLinks].slice(0, 10);

    return {
      id: cat.data.category,
      name: cat.data.title,
      slug: cat.data.category,
      icon: categoryIconMap[cat.data.category] || FileText,
      count: categoryResources.length,
      links: allLinks.length > 0 ? allLinks : [],
      recommendation: topRecommendation ? {
        title: topRecommendation.data.title,
        subtitle: topRecommendation.data.subtitle,
        description: topRecommendation.data.description,
        href: `/${categoryPath}/${topRecommendation.data.slug}`,
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
        href: `/${categoryPath}/${runnerUp.data.slug}`,
        badge: runnerUp.data.badge,
        ratings: runnerUp.data.ratings
      } : undefined,
      honorableMention: honorableMention ? {
        title: honorableMention.data.title,
        subtitle: honorableMention.data.subtitle,
        description: honorableMention.data.description,
        href: `/${categoryPath}/${honorableMention.data.slug}`,
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
            <LinkListWithRecommendation
              title={activeData.name}
              subtitle={`(${activeData.name.toLowerCase()} reviews, comparisons, and recommendations)`}
              links={activeData.links}
              recommendation={activeData.recommendation}
              runnerUp={activeData.runnerUp}
              honorableMention={activeData.honorableMention}
              layout="standalone"
              showCard={false}
              data-theme={dataTheme}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export { ResourceHub };