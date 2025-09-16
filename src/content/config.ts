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
    category: z.union([
      z.enum(['themes', 'hosting', 'security', 'performance', 'seo', 'woocommerce-themes', 'woocommerce-plugins', 'forms', 'automation', 'admin', 'wordpress-hosting', 'woocommerce-hosting', 'wordpress-blocks', 'wordpress-pagebuilder']),
      z.array(z.enum(['themes', 'hosting', 'security', 'performance', 'seo', 'woocommerce-themes', 'woocommerce-plugins', 'forms', 'automation', 'admin', 'wordpress-hosting', 'woocommerce-hosting', 'wordpress-blocks', 'wordpress-pagebuilder']))
    ]),
    slug: z.string(),
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
      free: z.boolean().default(false),
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
    })).max(3).optional(),
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
    category: z.enum(['themes', 'hosting', 'security', 'performance', 'seo', 'woocommerce-themes', 'woocommerce-plugins', 'forms', 'automation', 'admin', 'wordpress-hosting', 'woocommerce-hosting', 'wordpress-blocks', 'wordpress-pagebuilder']),
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
    }))
  })
});

const wordpressReview = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string(),
    category: z.union([
      z.enum(['themes', 'hosting', 'security', 'performance', 'seo', 'woocommerce-themes', 'woocommerce-plugins', 'forms', 'automation', 'admin', 'wordpress-hosting', 'woocommerce-hosting']),
      z.array(z.enum(['themes', 'hosting', 'security', 'performance', 'seo', 'woocommerce-themes', 'woocommerce-plugins', 'forms', 'automation', 'admin', 'wordpress-hosting', 'woocommerce-hosting']))
    ]),
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

const services = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    slug: z.string(),
    icon: z.string(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    hero: z.object({
      title: z.string(),
      subtitle: z.string(),
      badge: z.string().optional()
    }),
    benefits: z.array(z.object({
      title: z.string(),
      description: z.string(),
      icon: z.string().optional()
    })),
    packages: z.array(z.object({
      name: z.string(),
      price: z.string(),
      loadTime: z.string().optional(),
      description: z.string(),
      features: z.array(z.string()),
      buttonText: z.string(),
      highlighted: z.boolean().default(false)
    })).optional(),
    testimonials: z.array(z.object({
      author: z.string(),
      business: z.string().optional(),
      quote: z.string(),
      metric: z.string().optional()
    })).optional(),
    process: z.array(z.object({
      step: z.number(),
      title: z.string(),
      description: z.string()
    })).optional(),
    features: z.array(z.object({
      title: z.string(),
      description: z.string(),
      highlight: z.boolean().default(false)
    })).optional(),
    pricing: z.object({
      starting: z.string(),
      note: z.string().optional()
    }).optional(),
    cta: z.object({
      title: z.string(),
      subtitle: z.string(),
      buttonText: z.string(),
      buttonLink: z.string()
    })
  })
});

export const collections = {
  blog,
  'wordpress-resource': wordpressResource,
  'wordpress-category': wordpressCategoryIndex,
  'wordpress-review': wordpressReview,
  services
};