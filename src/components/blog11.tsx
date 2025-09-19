import { FileText, Code, Palette, Zap, Globe, Shield, Settings, Layers } from "lucide-react";

import { Separator } from "@/components/ui/separator";
import type { CollectionEntry } from "astro:content";

export type BlogPost = CollectionEntry<'blog'>;

interface Blog11Props {
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

const Blog11 = ({ 
  "data-theme": dataTheme, 
  posts = [], 
  categories = [], 
  activeCategory,
  title = "Blog Posts",
  description = "Insightful articles on web development, design trends, and digital strategy to help you grow your online presence."
}: Blog11Props) => {
  // Get unique categories from posts if not provided separately
  const allCategories = categories.length > 0 ? categories : [];
  
  // Beautiful gradients for blog cards
  const gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Purple
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', // Pink
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', // Blue
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', // Green
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', // Warm
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)', // Deep blue
    'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)', // Sunset
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', // Soft
  ];

  // Category to icon mapping
  const categoryIcons: Record<string, React.ComponentType<any>> = {
    'development': Code,
    'design': Palette,
    'performance': Zap,
    'seo': Globe,
    'security': Shield,
    'wordpress': Settings,
    'tutorial': FileText,
    'news': Globe,
    'default': Layers
  };

  // Get icon for category
  const getCategoryIcon = (category: string): React.ComponentType<any> => {
    const normalizedCategory = category.toLowerCase().replace(/\s+/g, '-');
    return categoryIcons[normalizedCategory] || categoryIcons['default'];
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
      <section className="bg-background py-32 text-foreground" data-theme={dataTheme}>
        <div className="container text-center">
          <FileText className="h-14 w-14 text-primary mx-auto mb-4" strokeWidth={1.5} />
          <h2 className="text-2xl font-bold text-foreground mb-2">No blog posts yet</h2>
          <p className="text-muted-foreground">Check back soon for insightful articles!</p>
        </div>
      </section>
    );
  }
  return (
    <section className="bg-background py-32 text-foreground" data-theme={dataTheme}>
      <div className="container">
        <div className="relative mx-auto flex max-w-7xl flex-col gap-20 lg:flex-row">
          <header className="top-10 flex h-fit flex-col items-center gap-5 text-center lg:sticky lg:max-w-80 lg:items-start lg:gap-8 lg:text-left">
            <FileText className="h-14 w-14 text-primary" strokeWidth={1.5} />
            <h1 className="text-4xl font-extrabold lg:text-5xl">
              <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {title}
              </span>
            </h1>
            <p className="text-muted-foreground lg:text-xl">
              {description}
            </p>
            <Separator />
            <nav>
              <ul className="flex flex-wrap items-center justify-center gap-4 lg:flex-col lg:items-start lg:gap-2">
                <li className="font-medium">
                  <a 
                    href="/blog" 
                    className={`transition-colors duration-200 ${
                      !activeCategory ? 'text-primary' : 'hover:text-primary'
                    }`}
                  >
                    All ({posts.length})
                  </a>
                </li>
                {allCategories.slice(0, 6).map((category) => (
                  <li key={category.slug} className={activeCategory === category.slug ? 'text-primary font-medium' : 'text-muted-foreground hover:text-primary'}>
                    <a 
                      href={`/blog/category/${category.slug}`} 
                      className="transition-colors duration-200"
                    >
                      {category.name} ({category.count})
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </header>
          <div className="grid gap-x-4 gap-y-8 md:grid-cols-2">
            {posts.slice(0, 6).map((post, index) => {
              const categoryName = post.data.category.charAt(0).toUpperCase() + post.data.category.slice(1).replace('-', ' ');
              const Icon = getCategoryIcon(post.data.category);
              const gradient = gradients[index % gradients.length];
              
              return (
                <div key={post.slug} className="relative h-full">
                  <a
                    href={`/blog/${post.slug}`}
                    className="group relative flex flex-col overflow-hidden rounded-2xl bg-card/60 backdrop-blur-xl border border-brand hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 h-full block"
                    data-astro-transition-scope={`blog-card-${post.slug}`}
                    style={{ minHeight: '450px' }}
                  >
                    {/* High-fidelity gradient background using theme colors */}
                    <div className="absolute inset-0">
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
                      <div className="absolute inset-0 bg-gradient-to-t from-card/40 via-transparent to-transparent" />
                      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-muted/5 to-primary/3" />
                    </div>
                    
                    {/* Gradient header with icon instead of image */}
                    <div className="relative h-48 flex-shrink-0">
                      <div 
                        className="absolute inset-0"
                        style={{ background: gradient }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                          <Icon className="w-10 h-10 text-white" />
                        </div>
                      </div>
                      
                      {/* Category badge in top left */}
                      <div className="absolute top-4 left-4">
                        <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-sm text-white text-xs font-medium">
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                          {categoryName}
                        </div>
                      </div>
                    </div>
                  
                  {/* Content - grows to fill space */}
                  <div className="relative z-10 flex flex-col p-6 flex-1">
                    <div className="flex-1">
                      {post.data.featured && (
                        <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 mb-4">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          <span className="text-xs font-medium text-primary">Featured</span>
                        </div>
                      )}
                      
                      <h2 className="text-2xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors duration-300 mb-3 line-clamp-2" style={{ viewTransitionName: `blog-title-${post.slug}` }}>
                        {post.data.title}
                      </h2>
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {post.data.description}
                      </p>
                    </div>
                    
                    {/* Bottom meta - Always at bottom */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-6 pt-4 border-t border-border/10 flex-shrink-0">
                      <span>{getReadingTime(post.data.readTime)}</span>
                      <span>•</span>
                      <span>{formatDate(post.data.date)}</span>
                      <span>•</span>
                      <span>{post.data.author}</span>
                    </div>
                  </div>
                  
                    {/* Subtle border highlight */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Blog11 };
