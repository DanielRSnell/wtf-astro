import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string(),
    date: z.union([z.date(), z.string()]),
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
    category: z.union([
      z.string(),
      z.array(z.string())
    ]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    badge: z.string().optional(),
    href: z.string().url().optional(),
    review_status: z.enum(['complete', 'active', 'backlog', 'skip']).optional(),
    review_reason: z.string().optional(),
    testing_progress: z.object({
      completion: z.number().min(0).max(100),
      current_phase: z.string().optional()
    }).optional(),
    subscribe_cta: z.string().optional(),
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
      free: z.union([z.boolean(), z.string()]).optional(),
      startingPrice: z.string().optional(),
      priceNote: z.string().optional()
    }).optional(),
    pricingPlans: z.array(z.object({
      name: z.string(),
      price: z.string(),
      billingCycle: z.string().optional(),
      features: z.array(z.string()),
      recommended: z.boolean().default(false),
      href: z.string().url().optional(),
      badge: z.string().optional()
    })).optional(),
    metadata: z.object({
      author: z.string(),
      lastUpdated: z.union([z.date(), z.string()]),
      publishDate: z.union([z.date(), z.string()]),
      readTime: z.number().optional()
    }).optional()
  })
});

const wordpressCategoryIndex = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.string(),
    subtitle: z.string().optional(),
    count: z.number(),
    topRecommendation: z.object({
      slug: z.string(),
      badge: z.string().optional()
    }).optional(),
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
    })).optional()
  })
});

const wordpressReview = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string(),
    category: z.union([
      z.string(),
      z.array(z.string())
    ]),
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
      publishDate: z.union([z.date(), z.string()]),
      lastUpdated: z.union([z.date(), z.string()]).optional(),
      readTime: z.number().optional()
    })
  })
});

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    hero: z.object({
      badge: z.string().optional(),
      title: z.string().optional(),
      description: z.string().optional()
    }).optional(),
    servicesSection: z.object({
      title: z.string(),
      subtitle: z.string()
    }).optional(),
    processTimeline: z.object({
      header: z.object({
        badge: z.string(),
        title: z.string(),
        subtitle: z.string()
      }),
      steps: z.array(z.object({
        title: z.string(),
        description: z.string(),
        icon: z.string(),
        reverse: z.boolean()
      }))
    }).optional()
  })
});

const services = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    icon: z.string(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    features: z.array(z.string()).optional(),
    pricing: z.object({
      starting: z.string(),
      note: z.string().optional()
    }).optional()
  })
});

const guides = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    badge: z.string().optional(),
    category: z.string().optional(),
    level: z.string().optional(),
    duration: z.string().optional(),
    lessons: z.union([
      z.number(),
      z.array(z.object({
        id: z.string(),
        title: z.string(),
        duration: z.string().optional()
      }))
    ]).optional(),
    updatedDate: z.string().optional(),
    sections: z.array(z.object({
      id: z.string(),
      title: z.string(),
      description: z.string().optional(),
      lessons: z.number()
    })).optional(),
    // For section files
    section: z.string().optional(),
    order: z.number().optional(),
    // Prerelease support
    prerelease: z.boolean().optional(),
    expectedDate: z.string().optional(),
    // Additional optional fields
    author: z.string().optional(),
    featured: z.boolean().optional(),
    image: z.string().optional(),
    tags: z.array(z.string()).optional(),
    slug: z.string().optional()
  })
});

// Define categories collection
const categoriesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
  })
});

// Define wordpress collection
const wordpressCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
  })
});

export const collections = {
  blog,
  pages,
  categories: categoriesCollection,
  wordpress: wordpressCollection,
  'wordpress-resource': wordpressResource,
  'wordpress-category': wordpressCategoryIndex,
  'wordpress-review': wordpressReview,
  services,
  guides
};