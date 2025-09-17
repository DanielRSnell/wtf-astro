# Category Recommendations Guide

## Overview

Category recommendations (Top Pick, Runner Up, Honorable Mention) are managed through the `wordpress-category` content collection, NOT by modifying individual category pages or components.

## How Recommendations Work

The system uses a content-driven approach where recommendations are defined in MDX files within `/src/content/wordpress-category/`. The `ResourceHub` component automatically reads these configurations and displays them in the recommendation cards.

## Setting Category Recommendations

### 1. Locate the Category File

Navigate to the appropriate category file in `/src/content/wordpress-category/`:
- `themes.mdx` - WordPress Themes
- `wordpress-hosting.mdx` - WordPress Hosting
- `performance.mdx` - Performance Plugins
- `seo.mdx` - SEO Plugins
- `forms.mdx` - Form Plugins
- etc.

### 2. Update the Frontmatter

Edit the frontmatter section of the MDX file to set recommendations using resource slugs:

```yaml
---
title: "WordPress Hosting"
description: "Premium managed WordPress hosting solutions..."
category: "wordpress-hosting"
subtitle: "Managed hosting optimized for WordPress"
count: 8
topRecommendation:
  slug: "spinupwp"           # Must match a resource slug
  badge: "Developer's Choice" # Display badge text
runnerUp:
  slug: "rocket-net"         # Must match a resource slug
  badge: "Managed Excellence" # Display badge text
honorableMention:
  slug: "vultr"              # Must match a resource slug
  badge: "Best Infrastructure" # Display badge text
links:
  - title: "SpinupWP Control Panel"
    href: "/wordpress-hosting/spinupwp"
    description: "Automated WordPress server management"
  # ... more links
---
```

### 3. Important Rules

1. **Slugs must match exactly** - The slug in recommendations MUST match the slug defined in the corresponding resource file in `/src/content/wordpress-resource/`
2. **Resources must exist** - Only reference resources that actually exist in the collection
3. **Category must be valid** - The resource must belong to the category you're setting recommendations for
4. **Badges are optional** - But recommended for visual distinction

## How It's Displayed

The `ResourceHub` component (used on the home page and category hub pages) automatically:
1. Reads the category configuration
2. Finds the matching resources by slug
3. Displays them in the recommendation cards on the right side
4. Shows the badge text and ratings from the resource data

## Example: WordPress Hosting Recommendations

Current configuration in `/src/content/wordpress-category/wordpress-hosting.mdx`:

```yaml
topRecommendation:
  slug: "spinupwp"
  badge: "Developer's Choice"
runnerUp:
  slug: "rocket-net"
  badge: "Managed Excellence"
honorableMention:
  slug: "vultr"
  badge: "Best Infrastructure"
```

This displays:
- **Top Pick**: SpinupWP with "Developer's Choice" badge
- **Runner Up**: Rocket.net with "Managed Excellence" badge
- **Honorable Mention**: Vultr with "Best Infrastructure" badge

## Common Mistakes to Avoid

### ❌ DON'T: Add custom sections to category pages
```astro
<!-- WRONG: Don't add custom recommendation sections -->
<section class="recommendations">
  <div class="top-pick">SpinupWP...</div>
</section>
```

### ❌ DON'T: Modify the ResourceHub component
```tsx
// WRONG: Don't hardcode recommendations in components
const recommendations = {
  hosting: { top: 'spinupwp' }
}
```

### ✅ DO: Update the category MDX file
```yaml
# CORRECT: Update the frontmatter in the category file
topRecommendation:
  slug: "spinupwp"
  badge: "Developer's Choice"
```

## Adding New Categories

When adding a new category:

1. Create the category file: `/src/content/wordpress-category/[category-name].mdx`
2. Define the frontmatter with recommendations
3. Ensure resources exist for the recommended slugs
4. The ResourceHub will automatically display them

## Troubleshooting

### Recommendations Not Showing

1. **Check slug spelling** - Must match exactly with resource slug
2. **Verify resource exists** - Check `/src/content/wordpress-resource/`
3. **Confirm category match** - Resource must have the category in its categories array
4. **Clear cache** - Restart dev server if changes don't appear

### Wrong Resource Displayed

- Double-check the slug in the category file
- Ensure no duplicate slugs exist
- Verify the resource has the correct category assigned

## Technical Details

The recommendation system works through:
1. `wordpress-category` collection defines recommendations via slugs
2. `ResourceHub` component reads category data
3. Component finds resources by matching slugs
4. Displays in `LinkListWithRecommendation` component

The data flow:
```
wordpress-category/*.mdx (configuration)
    ↓
ResourceHub.tsx (reads config)
    ↓
Matches resources by slug
    ↓
LinkListWithRecommendation.tsx (displays cards)
```

## Best Practices

1. **Review before changing** - Recommendations are highly visible
2. **Use descriptive badges** - Help users understand why it's recommended
3. **Keep updated** - Review recommendations quarterly
4. **Match user needs** - Consider different user segments (developers vs beginners)
5. **Test locally** - Always preview changes before committing

---

*Last updated: January 2025*