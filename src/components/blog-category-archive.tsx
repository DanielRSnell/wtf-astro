import { FileText } from "lucide-react";
import { motion } from "framer-motion";

import { DotPattern } from "@/components/magicui/dot-pattern";
import type { CollectionEntry } from "astro:content";
import { cn } from "@/lib/utils";

export type BlogPost = CollectionEntry<'blog'>;

interface BlogCategoryArchiveProps {
  "data-theme"?: string;
  posts?: BlogPost[];
  categories?: Array<{
    name: string;
    slug: string;
    count: number;
  }>;
  activeCategory?: string;
  title?: string;
  description?: string;
}

const BlogCategoryArchive = ({ 
  "data-theme": dataTheme, 
  posts = [], 
  categories = [], 
  activeCategory,
  title = "Blog Posts",
  description = "Latest news and updates from our blog."
}: BlogCategoryArchiveProps) => {
  // Get unique categories from posts if not provided separately
  const allCategories = categories.length > 0 ? categories : [];
  
  // Calculate total posts count from all categories
  const totalPostsCount = allCategories.reduce((total, category) => total + category.count, 0);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 20,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    }
  };
  
  // Helper functions
  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  const getReadingTime = (readTime?: number): string => {
    return readTime ? `${readTime} min read` : '5 min read';
  };
  
  // If no posts provided, show empty state or fallback
  if (posts.length === 0) {
    return (
      <section className="relative bg-background py-32 text-foreground overflow-hidden" data-theme={dataTheme}>
        {/* Dot Pattern Background */}
        <DotPattern
          className={cn(
            "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
            "absolute inset-0 h-full w-full"
          )}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background pointer-events-none" />
        
        <div className="container relative z-10 text-center">
          <FileText className="h-14 w-14 text-primary mx-auto mb-4" strokeWidth={1.5} />
          <h2 className="text-2xl font-bold text-foreground mb-2">No blog posts yet</h2>
          <p className="text-muted-foreground">Check back soon for insightful articles!</p>
        </div>
      </section>
    );
  }

  return (
    <div className="bg-background text-foreground" data-theme={dataTheme}>
      {/* Header Section with Dot Pattern */}
      <section className="relative pt-40 pb-20 overflow-hidden" style={{ paddingTop: '10rem' }}>
        {/* Dot Pattern Background */}
        <DotPattern
          className={cn(
            "[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
            "absolute inset-0 h-full w-full"
          )}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background pointer-events-none" />
        
        <div className="container relative z-10">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {title}
              </span>
            </h1>
            <p className="text-muted-foreground text-lg lg:text-xl max-w-2xl mx-auto">
              {description}
            </p>
          </div>
          
          {/* Category Navigation */}
          <nav className="flex flex-wrap items-center justify-center gap-3">
            <a 
              href="/blog" 
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-5 py-1.5 text-sm font-medium transition-all duration-300 hover:scale-105 bg-gradient-to-r from-background via-muted/20 to-background shadow-lg hover:shadow-xl border border-border/50",
                !activeCategory 
                  ? "ring-2 ring-primary/20 border-primary/30" 
                  : "hover:border-muted-foreground/30"
              )}
            >
              <span>All</span>
              <span className={cn(
                "inline-flex items-center justify-center min-w-[1.5rem] h-6 rounded-full text-xs font-semibold",
                !activeCategory
                  ? "bg-gradient-to-r from-primary via-primary to-primary/80 text-primary-foreground shadow-lg"
                  : "bg-gradient-to-r from-muted-foreground/20 to-muted-foreground/10 text-muted-foreground"
              )}>
{totalPostsCount}
              </span>
            </a>
            {allCategories.slice(0, 8).map((category) => (
              <a
                key={category.slug}
                href={`/blog/category/${category.slug}`}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-5 py-1.5 text-sm font-medium transition-all duration-300 hover:scale-105 bg-gradient-to-r from-background via-muted/20 to-background shadow-lg hover:shadow-xl border border-border/50",
                  activeCategory === category.slug
                    ? "ring-2 ring-primary/20 border-primary/30"
                    : "hover:border-muted-foreground/30"
                )}
              >
                <span>{category.name}</span>
                <span className={cn(
                  "inline-flex items-center justify-center min-w-[1.5rem] h-6 rounded-full text-xs font-semibold",
                  activeCategory === category.slug
                    ? "bg-gradient-to-r from-primary via-primary to-primary/80 text-primary-foreground shadow-lg"
                    : "bg-gradient-to-r from-muted-foreground/20 to-muted-foreground/10 text-muted-foreground"
                )}>
                  {category.count}
                </span>
              </a>
            ))}
          </nav>
        </div>
      </section>

      {/* Posts Grid Section */}
      <section className="py-16">
        <div className="container">
          <motion.div 
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {posts.map((post, index) => {
              const categoryName = post.data.category.charAt(0).toUpperCase() + post.data.category.slice(1).replace('-', ' ');
              
              return (
                <motion.article 
                  key={post.slug} 
                  className="group"
                  variants={cardVariants}
                >
                  <a
                    href={`/blog/${post.slug}`}
                    className="block h-full overflow-hidden rounded-2xl bg-card/60 backdrop-blur-xl border border-border/20 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10"
                    data-astro-transition-scope={`blog-card-${post.slug}`}
                  >
                    {/* High-fidelity gradient background using theme colors */}
                    <div className="absolute inset-0">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
                      <div className="absolute inset-0 bg-gradient-to-t from-card/40 via-transparent to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-muted/5 to-primary/3" />
                    </div>
                    
                    {/* Featured image if available */}
                    {post.data.image && (
                      <div className="relative z-10 h-48 overflow-hidden">
                        <img 
                          src={post.data.image.src} 
                          alt={post.data.image.alt}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          style={{ viewTransitionName: `blog-image-${post.slug}` }}
                        />
                        {/* Image overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                      </div>
                    )}
                  
                    {/* Content */}
                    <div className="relative z-10 p-6 flex flex-col h-full">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 backdrop-blur-sm border border-primary/20">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        </span>
                        <span className="text-xs font-medium text-primary uppercase tracking-widest">
                          {categoryName}
                        </span>
                        {post.data.featured && (
                          <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                            <span className="text-xs font-medium text-primary">Featured</span>
                          </div>
                        )}
                      </div>
                      
                      <h2 
                        className="text-xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors duration-300 mb-3 line-clamp-2" 
                        style={{ viewTransitionName: `blog-title-${post.slug}` }}
                      >
                        {post.data.title}
                      </h2>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-6 line-clamp-3 flex-1">
                        {post.data.description}
                      </p>
                      
                      {/* Bottom meta */}
                      <div className="flex items-center gap-2 text-xs text-muted-foreground pt-4 border-t border-border/10">
                        <span>{getReadingTime(post.data.readTime)}</span>
                        <span>•</span>
                        <span>{formatDate(post.data.date)}</span>
                        <span>•</span>
                        <span className="truncate">{post.data.author}</span>
                      </div>
                    </div>
                    
                    {/* Subtle border highlight */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </a>
                </motion.article>
              );
            })}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export { BlogCategoryArchive };