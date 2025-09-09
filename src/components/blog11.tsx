import { FileText } from "lucide-react";

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
          <div className="grid gap-4 md:grid-cols-2">
            {posts.slice(0, 6).map((post) => {
              const categoryName = post.data.category.charAt(0).toUpperCase() + post.data.category.slice(1).replace('-', ' ');
              
              return (
                <div key={post.slug} className="relative">
                  <a
                    href={`/blog/${post.slug}`}
                    className="group relative flex flex-col overflow-hidden rounded-2xl bg-card/60 backdrop-blur-xl border border-border/20 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 min-h-[400px] block"
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
                      <div className="relative z-10 h-32 overflow-hidden flex-shrink-0">
                        <img 
                          src={post.data.image.src} 
                          alt={post.data.image.alt}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          style={{ viewTransitionName: `blog-image-${post.slug}` }}
                        />
                      </div>
                    )}
                  
                    {/* Overlay gradient on top of image */}
                    {post.data.image && (
                      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/30 via-black/15 to-transparent z-20 pointer-events-none" />
                    )}
                  
                  {/* Content - grows to fill space */}
                  <div className="relative z-10 flex flex-col p-6 flex-1">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 backdrop-blur-sm border border-primary/20">
                          <div className="h-2 w-2 rounded-full bg-primary" />
                        </span>
                        <span className="text-xs font-medium text-primary uppercase tracking-widest">
                          {categoryName}
                        </span>
                      </div>
                      {post.data.featured && (
                        <div className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 mb-4">
                          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                          <span className="text-xs font-medium text-primary">Featured</span>
                        </div>
                      )}
                      
                      <h2 className="text-2xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors duration-300 mb-3" style={{ viewTransitionName: `blog-title-${post.slug}` }}>
                        {post.data.title}
                      </h2>
                      <p className="text-sm text-muted-foreground leading-relaxed">
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
