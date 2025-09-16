# Content Projects Tracker

*Systematic tracking of all internal links and content dependencies across the site to prevent 404s and maintain content consistency.*

## Project Status Legend
- 🔴 **Not Started** - Article not created
- 🟡 **In Progress** - Article being written
- 🟢 **Complete** - Article published and live
- ⚪ **Placeholder** - Temporary placeholder page needed

---

## Blog Articles (`/src/content/blog/`)

| Article Title | File Path | Status | Priority | Dependencies | Content Focus |
|---------------|-----------|---------|----------|--------------|---------------|
| Editor Empathy and the Gutenberg Revolution | `src/content/blog/editor-empathy-gutenberg.mdx` | 🟢 | High | None | How Gutenberg solves content creation workflow problems, Editor Empathy concept |
| The Complete 2025 WordPress Block Plugins Review | `src/content/blog/wordpress-block-plugins-2025-review.mdx` | 🟢 | High | Greenshift review, Greenlight review | Comprehensive review of all major block plugins: Greenshift, Greenlight, Kadence, GenerateBlocks, Spectra, Essential Blocks |

---

## WordPress Resources (`/src/content/wordpress-resource/`)

### Theme Reviews
| Article Title | File Path | Status | Priority | Dependencies | Content Focus |
|---------------|-----------|---------|----------|--------------|---------------|
| Greenshift Blocks Review | `src/content/wordpress-resource/greenshift.mdx` | 🟢 | High | None | Comprehensive Greenshift review, CSS fundamentals, Figma integration |
| Greenlight Builder Review | `src/content/wordpress-resource/greenlight-builder.mdx` | 🟢 | High | None | FSE-native solution, single Elements block architecture, performance focus |
| Kadence Blocks Review | `src/content/wordpress-resource/kadence-blocks.mdx` | 🔴 | Medium | None | Kadence Blocks analysis, Elementor-style controls |
| Kadence Theme Review | `src/content/wordpress-resource/kadence.mdx` | 🔴 | Medium | None | Kadence theme analysis, performance, WooCommerce features |
| Spectra Review | `src/content/wordpress-resource/spectra.mdx` | 🔴 | Medium | None | Spectra/Ultimate Addons review, Divi-like interface |
| Essential Blocks Review | `src/content/wordpress-resource/essential-blocks.mdx` | 🔴 | Low | None | Essential Blocks review, simplified controls |

### Theme Comparisons
| Article Title | File Path | Status | Priority | Dependencies | Content Focus |
|---------------|-----------|---------|----------|--------------|---------------|
| Astra vs Blocksy: Complete Analysis | `src/content/wordpress-resource/astra-vs-blocksy.mdx` | 🔴 | Medium | Blocksy review | Head-to-head comparison, performance, features |
| GeneratePress vs Blocksy: Developer Perspective | `src/content/wordpress-resource/generatepress-vs-blocksy.mdx` | 🔴 | Medium | Blocksy review | Developer-focused comparison, plugin reduction |

---

## Guides (`/src/content/guides/`)

### Security & Performance
| Article Title | File Path | Status | Priority | Dependencies | Content Focus |
|---------------|-----------|---------|----------|--------------|---------------|
| WooCommerce Security Best Practices | `src/content/guides/woocommerce-security.mdx` | 🔴 | Medium | None | Security implementation, best practices |
| Performance Optimization for Online Stores | `src/content/guides/ecommerce-performance.mdx` | 🔴 | Medium | None | Ecommerce-specific performance optimization |
| WordPress Performance Optimization Guide | `src/content/guides/wordpress-performance.mdx` | 🔴 | Medium | None | General WordPress performance |
| Core Web Vitals for Developers | `src/content/guides/core-web-vitals.mdx` | 🔴 | Medium | None | Core Web Vitals optimization, technical implementation |
| WordPress Speed Optimization | `src/content/guides/wordpress-speed-optimization.mdx` | 🔴 | Low | Performance guide | Speed-specific optimization techniques |
| WooCommerce Performance Tuning | `src/content/guides/woocommerce-performance.mdx` | 🔴 | Low | Ecommerce performance | WooCommerce-specific tuning |

### Theme Selection & Development
| Article Title | File Path | Status | Priority | Dependencies | Content Focus |
|---------------|-----------|---------|----------|--------------|---------------|
| Complete WordPress Theme Comparison | `src/content/guides/wordpress-theme-comparison.mdx` | 🔴 | Medium | Theme reviews | Comprehensive theme comparison methodology |
| Theme Selection Guide for Developers | `src/content/guides/developer-theme-guide.mdx` | 🔴 | Medium | None | Developer-focused theme selection criteria |
| Best WordPress Themes for Developers | `src/content/guides/best-wordpress-themes-developers.mdx` | 🔴 | Low | Theme reviews | Curated list with developer criteria |

### Block Editor & Development
| Article Title | File Path | Status | Priority | Dependencies | Content Focus |
|---------------|-----------|---------|----------|--------------|---------------|
| Gutenberg vs Page Builders | `src/content/guides/gutenberg-vs-page-builders.mdx` | 🔴 | Medium | None | Technical comparison, performance analysis |
| Block Editor Best Practices | `src/content/guides/block-editor-best-practices.mdx` | 🔴 | Low | None | Development best practices for Gutenberg |

---

## Content Dependencies Map

### High-Priority Chain (Prevent 404s)
1. **Greenshift Review** → Enables all Greenshift links in Blocksy review
2. **Editor Empathy Blog Post** → Referenced prominently in Blocksy review
3. **Greenshift vs GenerateBlocks Comparison** → Key technical comparison linked multiple times

### Medium-Priority Chain (Complete Theme Ecosystem)
1. **Theme Comparison Reviews** (Astra, GeneratePress vs Blocksy)
2. **Performance Guides** (WooCommerce Security, Ecommerce Performance)
3. **Developer Guides** (Theme Selection, WordPress Theme Comparison)

### Low-Priority Chain (Content Depth)
1. **Additional Block Plugin Reviews** (Kadence, Spectra, Essential Blocks)
2. **Detailed Performance Guides** (Speed Optimization, Core Web Vitals)
3. **Advanced Development Guides** (Block Editor Best Practices)

---

## Content Creation Workflow

### Step 1: Content Planning
- [ ] Review existing internal links in target article
- [ ] Identify new internal link opportunities
- [ ] Update this tracker with new dependencies
- [ ] Prioritize based on 404 risk and user flow

### Step 2: Content Creation
- [ ] Create article following daniel-snell-persona guidelines
- [ ] Use contentCreator MCP for research and fact-checking
- [ ] Include appropriate internal linking structure
- [ ] Add to content-review-template.md process

### Step 3: Dependency Management
- [ ] Update status in this tracker
- [ ] Review all articles that link to new content
- [ ] Test internal links for accuracy
- [ ] Update any placeholder content

### Step 4: Content Maintenance
- [ ] Regular audit of internal links
- [ ] Update articles when dependencies change
- [ ] Monitor for new linking opportunities
- [ ] Maintain content freshness and accuracy

---

## Notes for Content Creators

### Internal Linking Strategy
- **Theme reviews** should cross-reference each other
- **Guides** should link to relevant theme reviews
- **Blog posts** should connect to both guides and reviews
- **Comparison articles** should reference individual reviews

### Content Standards
- Follow daniel-snell-persona.md for voice and perspective
- Use content-review-template.md for structure consistency
- Research with contentCreator MCP for authoritative sources
- Focus on developer workflow and plugin reduction benefits

### Placeholder Management
- Create temporary placeholder pages for high-priority links
- Include "Coming Soon" content with newsletter signup
- Implement redirects when final content is published
- Monitor analytics for 404 traffic to prioritize creation

---

**Last Updated**: September 16, 2025
**Latest Addition**: Greenlight Builder Review (Complete)
**Next Review**: When new internal links are added to existing content