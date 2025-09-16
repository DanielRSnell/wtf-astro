# Blocksy Components - Design System Guide

## Documentation Organization

All project documentation files (except this CLAUDE.mdx file) are located in the `./docs` directory. This includes:
- Technical setup guides (AUTH_MODAL_USAGE.md, COMMENTS_SETUP.md, CONTENT_REVIEW_SYSTEM.md)
- Content management documentation (content-projects.md, content-review-template.md)
- Persona and agent files (daniel-snell-persona.md, daniel-snell-content-reviewer.md)
- Any other project-related markdown files

When looking for or creating documentation, refer to the `./docs` folder.

## Design Direction & High-Fidelity Standards

This project follows a premium, enterprise-grade design aesthetic inspired by modern platforms like Bright. The focus is on creating sophisticated, high-fidelity UI components that automatically adapt to theme variations.

### Key Design Principles

1. **Theme-First Architecture**
   - All components must support `data-theme` prop for seamless theme switching
   - Use CSS custom properties with oklch color space for consistent theming
   - Components automatically inherit theme colors via `bg-background`, `text-foreground`, etc.

2. **Glassmorphism & Depth**
   - Use `bg-card/60 backdrop-blur-xl` for premium glass effects
   - Layer multiple subtle gradients for depth: `from-primary/5 via-transparent to-secondary/5`
   - Add `border border-border/20` with hover states `hover:border-primary/30`

3. **High-Fidelity Visual Hierarchy**
   - Sophisticated shadow systems: `hover:shadow-2xl hover:shadow-primary/10`
   - Gradient accents and dividers using theme-compliant colors
   - Smooth transitions with `transition-all duration-500`

4. **Typography & Spacing**
   - Consistent font weights and tracking
   - Proper spacing hierarchy using Tailwind's spacing scale
   - Text colors follow theme system: `text-foreground`, `text-muted-foreground`, `text-primary`

### Component Enhancement Guidelines

When increasing component fidelity:

1. **Remove Static Images**: Replace with gradient-based designs and iconography
2. **Apply Theme Colors**: Only use theme-compliant colors, avoid hardcoded colors
3. **Add Glassmorphism**: Implement backdrop-blur and layered gradient backgrounds
4. **Enhance Interactions**: Add hover states, smooth transitions, and visual feedback
5. **Improve Accessibility**: Maintain proper contrast ratios within theme constraints

### Theme System

Available themes:
- `bright-dark`: Premium dark theme matching Bright website aesthetic
- `retro-light`: Light retro theme
- `retro-dark`: Dark retro theme  
- `dark`: Standard dark theme

### Example High-Fidelity Component Structure

```tsx
<div className="group relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-xl border border-border/20 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10">
  {/* Layered gradient backgrounds */}
  <div className="absolute inset-0">
    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
    <div className="absolute inset-0 bg-gradient-to-t from-card/40 via-transparent to-transparent" />
  </div>
  
  {/* Content with proper z-index */}
  <div className="relative z-10 p-8">
    {/* Content here */}
  </div>
  
  {/* Hover border highlight */}
  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
</div>
```

### Layout Considerations

- Grid background patterns applied at layout level in `base.astro`
- Components use `overflow-x-hidden` to prevent horizontal scroll
- Consistent container max-widths and padding
- Proper responsive behavior across all breakpoints

This design system ensures all components maintain premium quality and consistent theming throughout the application.

---

## Animation Guidelines

### No Framer Motion Dependency

This project **does not use framer-motion** as a dependency. The framer-motion library has been removed from the project to reduce bundle size and maintain performance.

**For animations, use:**
- **CSS Animations**: Standard CSS `@keyframes` and `animation` properties
- **CSS Transitions**: Use `transition` properties for hover states and interactions
- **Tailwind Animation Classes**: Built-in classes like `animate-spin`, `animate-pulse`, `animate-bounce`
- **Custom CSS Animations**: Create keyframe animations in CSS for complex motion

**Animation Best Practices:**
- Keep animations performant using `transform` and `opacity` properties
- Use `transition-all duration-300` for smooth hover effects
- Implement animations directly in CSS rather than JavaScript libraries
- Maintain consistency with the design system's timing and easing curves

**Example Animation Patterns:**
```css
/* Hover animations */
.hover-lift {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}
.hover-lift:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

/* Fade in animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

If framer-motion is imported in any component, it should be removed and replaced with CSS-based animations.

---

## Content Management System

### Content Projects Tracker

The project uses a systematic content tracking system to prevent 404s and maintain content consistency across all internal links.

**File**: `content-projects.md`

This tracker manages:
- All internal link dependencies
- Content creation priorities
- File paths and content requirements
- Status tracking with visual indicators
- Content creation workflow

### Content Creation Workflow

**Step 1: Before Adding Internal Links**
1. Check `content-projects.md` for existing planned content
2. Add new articles to tracker with appropriate priority
3. Consider content dependencies and user flow impact

**Step 2: Content Creation Process**
1. Follow `daniel-snell-persona.md` for voice and perspective
2. Use `content-review-template.md` for structure consistency
3. Research with contentCreator MCP for authoritative sources
4. Update content-projects.md status during creation

**Step 3: Internal Link Management**
1. Create placeholder pages for high-priority links if needed
2. Test all internal links before publishing
3. Update tracker when content goes live
4. Monitor for new linking opportunities in existing content

### Content Standards

**Voice & Perspective**: All content follows the daniel-snell-persona guidelines:
- Developer-focused technical perspective
- Plugin reduction and maintainability focus
- Performance and speed optimization priority
- Business value through technical decisions

**Research Requirements**:
- Use contentCreator MCP for comprehensive research
- Include authoritative sources and citations
- Verify technical claims with official documentation
- Maintain accuracy on evolving technologies

**Internal Linking Strategy**:
- Theme reviews cross-reference each other
- Guides link to relevant theme reviews
- Blog posts connect guides and reviews
- Comparison articles reference individual reviews

### File Organization

**Content Types & Locations**:
- Blog articles: `/src/content/blog/`
- WordPress resources: `/src/content/wordpress-resource/`
- Guides: `/src/content/guides/`

**Content Dependencies**:
- High-priority: Prevent 404s on existing links
- Medium-priority: Complete content ecosystem
- Low-priority: Add content depth and authority

### Maintenance Process

**Regular Tasks**:
1. Audit internal links quarterly
2. Update content-projects.md when adding new internal links
3. Monitor analytics for 404 traffic to prioritize creation
4. Review content freshness and technical accuracy

**When Adding New Articles**:
1. Scan for internal link opportunities
2. Add new dependencies to content-projects.md
3. Consider impact on existing content
4. Update cross-references in related articles

This system ensures content quality, prevents 404s, and maintains the site's authority through comprehensive internal linking.

### Content Schema Requirements

**Blog Collection (`/src/content/blog/`)**:
```yaml
title: string (required)
description: string (required)
author: string (required)
date: date (required) # Note: use 'date' not 'publishDate'
category: string (required)
tags: array of strings (required)
featured: boolean (optional, default: false)
draft: boolean (optional, default: false)
image: object (optional)
  src: string (required when image object present)
  alt: string (required when image object present)
readTime: number (optional)
```

**Important Schema Notes**:
- Blog posts use `date` field, not `publishDate`
- When including an `image` object, both `src` and `alt` are required
- SEO metadata is not part of the collection schema (handle in layout)
- Always validate against schema before publishing

---

## Daniel Snell Content Reviewer Agent

### Agent Usage Requirements

**For all review articles** (WordPress themes, plugins, tools), you **MUST** use the `daniel-snell-content-reviewer` agent to ensure consistency with the established framework and quality standards.

### When to Use the Agent

**Required for:**
- WordPress theme reviews
- Plugin reviews and comparisons
- Tool and service reviews
- Any content following the content-review-template.md structure

**Agent Integration:**
The `daniel-snell-content-reviewer` agent has access to:
- `content-review-template.md` - Complete review article framework
- `daniel-snell-persona.md` - Voice, perspective, and writing guidelines
- ContentCreator MCP - For comprehensive research and fact-checking
- All necessary tools for content creation and internal linking

### Agent Workflow

**Step 1: Initial Discovery**
The agent will ask the user discovery questions from the template to understand:
- Product focus and scope
- Target audience and use case
- Competitive landscape priorities
- Technical emphasis areas

**Step 2: Research & Planning**
The agent will use ContentCreator MCP to research:
- Product overview and positioning
- Technical architecture and performance
- Plugin ecosystem impact
- Competitive analysis
- User experience across skill levels

**Step 3: Content Creation**
The agent will create the review following:
- daniel-snell-persona voice and perspective
- content-review-template.md structure
- Plugin reduction philosophy
- Developer-focused technical analysis
- Comprehensive internal linking strategy

**Step 4: Quality Assurance**
The agent will verify:
- All template sections completed
- Technical claims validated
- Internal links added to content-projects.md
- SEO optimization without quality compromise

### Example Agent Usage

```
Use the daniel-snell-content-reviewer agent to create a comprehensive review of [Product Name].
Focus on [specific aspects user wants emphasized] and target [audience type].
```

### Integration with Content Management

**Content Projects Integration:**
- Agent automatically updates content-projects.md with new dependencies
- Tracks internal links and content ecosystem connections
- Plans related content opportunities

**Quality Standards:**
- Maintains daniel-snell-persona consistency
- Follows plugin reduction methodology
- Ensures technical accuracy through research validation
- Builds site authority through comprehensive analysis

### Agent Benefits

**Consistency**: Every review follows the same proven framework that made the Blocksy review successful

**Quality**: Built-in research validation and technical accuracy checking

**Efficiency**: Automated discovery process and structured content creation

**Authority**: Comprehensive coverage with proper sourcing and internal linking

**SEO**: Optimized structure and content organization for search visibility

This agent ensures all review content maintains the high standards established in the Blocksy review while scaling content creation efficiently.