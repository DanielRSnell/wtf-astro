import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string(),
    date: z.date(),
    category: z.string(),
    tags: z.array(z.string()),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    image: z.object({
      src: z.string(),
      alt: z.string()
    }).optional(),
    readTime: z.number().optional()
  })
});

const wordpressResource = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string(),
    category: z.enum(['themes', 'hosting', 'security', 'performance']),
    slug: z.string(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    badge: z.string().optional(),
    href: z.string().url(),
    image: z.object({
      src: z.string(),
      alt: z.string()
    }).optional(),
    ratings: z.array(z.object({
      name: z.string(),
      value: z.number().min(0).max(5),
      maxValue: z.number().optional().default(5)
    })).optional(),
    pros: z.array(z.string()).optional(),
    cons: z.array(z.string()).optional(),
    pricing: z.object({
      free: z.boolean().default(false),
      startingPrice: z.string().optional(),
      priceNote: z.string().optional()
    }).optional(),
    metadata: z.object({
      author: z.string(),
      lastUpdated: z.date(),
      publishDate: z.date(),
      readTime: z.number().optional()
    })
  })
});

const wordpressCategoryIndex = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(['themes', 'hosting', 'security', 'performance']),
    subtitle: z.string().optional(),
    count: z.number(),
    topRecommendation: z.object({
      slug: z.string(),
      badge: z.string().optional()
    }),
    runnerUp: z.object({
      slug: z.string(),
      badge: z.string().optional()
    }).optional(),
    honorableMention: z.object({
      slug: z.string(),
      badge: z.string().optional()
    }).optional(),
    links: z.array(z.object({
      title: z.string(),
      href: z.string().optional(),
      description: z.string().optional()
    }))
  })
});

const wordpressReview = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string(),
    category: z.enum(['themes', 'hosting', 'security', 'performance']),
    slug: z.string(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    badge: z.string().optional(),
    overallRating: z.number().min(0).max(5),
    totalReviews: z.number().optional(),
    ratings: z.array(z.object({
      name: z.string(),
      value: z.number().min(0).max(5),
      maxValue: z.number().optional().default(5)
    })),
    metadata: z.object({
      author: z.string(),
      publishDate: z.date(),
      lastUpdated: z.date().optional(),
      readTime: z.number().optional()
    })
  })
});

export const collections = {
  blog,
  'wordpress-resource': wordpressResource,
  'wordpress-category': wordpressCategoryIndex,
  'wordpress-review': wordpressReview
};