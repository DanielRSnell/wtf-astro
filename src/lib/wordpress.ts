export interface WordPressPost {
  title: string;
  content: string;
  excerpt: string;
  date: Date;
  slug: string;
  status: string;
  author: {
    id: number;
    name: string;
    avatar_urls?: Record<string, string>;
  } | null;
  categories: number[];
  tags: number[];
  featured_media: {
    id: number;
    source_url: string;
    alt_text?: string;
    media_details?: {
      width: number;
      height: number;
    };
  } | null;
  link: string;
}

export interface WordPressCategory {
  id: number;
  name: string;
  slug: string;
  description?: string;
  count: number;
}

export interface WordPressTag {
  id: number;
  name: string;
  slug: string;
  description?: string;
  count: number;
}

export interface WordPressAuthor {
  id: number;
  name: string;
  avatar_urls?: Record<string, string>;
  description?: string;
  slug: string;
}

// WordPress REST API utility functions
export class WordPressAPI {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = `${baseURL}/wp-json/wp/v2`;
  }

  async getPosts(): Promise<WordPressPost[]> {
    try {
      const response = await fetch(`${this.baseURL}/posts?_embed`, {
        headers: { 'User-Agent': 'Astro WordPress Integration' }
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      const posts = await response.json();
      
      return posts.map((post: any) => ({
        title: post.title.rendered,
        content: post.content.rendered,
        excerpt: post.excerpt.rendered,
        date: new Date(post.date),
        slug: post.slug,
        status: post.status,
        author: post._embedded?.author?.[0] || null,
        categories: post.categories,
        tags: post.tags,
        featured_media: post._embedded?.['wp:featuredmedia']?.[0] || null,
        link: post.link
      }));
    } catch (error) {
      console.error('Failed to fetch WordPress posts:', error);
      return [];
    }
  }

  async getCategories(): Promise<WordPressCategory[]> {
    try {
      const response = await fetch(`${this.baseURL}/categories`, {
        headers: { 'User-Agent': 'Astro WordPress Integration' }
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch WordPress categories:', error);
      return [];
    }
  }

  async getTags(): Promise<WordPressTag[]> {
    try {
      const response = await fetch(`${this.baseURL}/tags`, {
        headers: { 'User-Agent': 'Astro Content Loader' }
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch WordPress tags:', error);
      return [];
    }
  }

  async getAuthors(): Promise<WordPressAuthor[]> {
    try {
      const response = await fetch(`${this.baseURL}/users`, {
        headers: { 'User-Agent': 'Astro Content Loader' }
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch WordPress authors:', error);
      return [];
    }
  }

  async getCategoryById(id: number, categories?: WordPressCategory[]): Promise<WordPressCategory | null> {
    if (categories) {
      return categories.find(cat => cat.id === id) || null;
    }
    
    try {
      const response = await fetch(`${this.baseURL}/categories/${id}`);
      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch category ${id}:`, error);
      return null;
    }
  }

  async getTagById(id: number, tags?: WordPressTag[]): Promise<WordPressTag | null> {
    if (tags) {
      return tags.find(tag => tag.id === id) || null;
    }
    
    try {
      const response = await fetch(`${this.baseURL}/tags/${id}`);
      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch tag ${id}:`, error);
      return null;
    }
  }
}

// Helper functions for working with WordPress content in components
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
}

export function getExcerpt(content: string, maxLength: number = 160): string {
  const plainText = content.replace(/<[^>]*>/g, '');
  return plainText.length > maxLength 
    ? plainText.substring(0, maxLength).trim() + '...'
    : plainText;
}

export function getReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}