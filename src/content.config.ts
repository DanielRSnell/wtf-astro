import { defineCollection, z } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string(),
    date: z.date(),
    category: z.string(),
    tags: z.array(z.string()),
    featured: z.boolean().optional(),
    draft: z.boolean().optional(),
    image: z.object({
      src: z.string(),
      alt: z.string()
    }).optional(),
    readTime: z.number().optional()
  })
});

const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
  })
});

const categoriesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
  })
});

export const collections = {
  'blog': blogCollection,
  'pages': pagesCollection,
  'categories': categoriesCollection
};