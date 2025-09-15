import { useState } from 'react';
import { Search, Filter, Star, Users, DollarSign, ChevronRight } from 'lucide-react';
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
}

const ResourceDirectory = ({
  'data-theme': dataTheme,
  category,
  title,
  description,
  resources,
  relatedPosts = [],
  baseUrl
}: ResourceDirectoryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'rating' | 'popular' | 'name' | 'price'>('rating');
  const [filterBy, setFilterBy] = useState<'all' | 'free' | 'premium' | 'featured'>('all');

  // Calculate average rating for each resource
  const resourcesWithRatings = resources.map(resource => {
    const avgRating = resource.data.ratings 
      ? resource.data.ratings.reduce((sum, rating) => sum + rating.value, 0) / resource.data.ratings.length 
      : 0;
    return { ...resource, avgRating };
  });

  // Filter and sort resources
  const filteredResources = resourcesWithRatings
    .filter(resource => {
      const matchesSearch = resource.data.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           resource.data.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filterBy === 'all' || 
                           (filterBy === 'featured' && resource.data.featured) ||
                           (filterBy === 'free' && resource.data.pricing?.free) ||
                           (filterBy === 'premium' && !resource.data.pricing?.free);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.avgRating - a.avgRating;
        case 'name':
          return a.data.title.localeCompare(b.data.title);
        case 'popular':
          return b.data.featured ? 1 : -1;
        case 'price':
          return (a.data.pricing?.startingPrice || '').localeCompare(b.data.pricing?.startingPrice || '');
        default:
          return 0;
      }
    });

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
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              {description}
            </p>
          
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={`Search ${category}...`}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-card/60 backdrop-blur-xl border border-brand text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <select
                className="px-4 py-3 rounded-xl bg-card/60 backdrop-blur-xl border border-brand text-foreground focus:outline-none focus:border-primary/50"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
              >
                <option value="rating">Sort by Rating</option>
                <option value="popular">Most Popular</option>
                <option value="name">Name A-Z</option>
                <option value="price">Price</option>
              </select>
              
              <select
                className="px-4 py-3 rounded-xl bg-card/60 backdrop-blur-xl border border-brand text-foreground focus:outline-none focus:border-primary/50"
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as any)}
              >
                <option value="all">All {title}</option>
                <option value="featured">Featured</option>
                <option value="free">Free</option>
                <option value="premium">Premium</option>
              </select>
            </div>
          </div>
        </div>
      </div>
      </section>

      {/* Main Content Section */}
      <section className="py-16">
        <div className="container">
          {/* Results Count */}
          <div className="mb-8">
            <p className="text-muted-foreground">
              Showing {filteredResources.length} of {resources.length} {category}
              {searchTerm && ` for "${searchTerm}"`}
            </p>
          </div>

          {/* Resource Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-16">
          {filteredResources.map((resource) => (
            <a
              key={resource.data.slug}
              href={`${baseUrl}/${resource.data.slug}`}
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