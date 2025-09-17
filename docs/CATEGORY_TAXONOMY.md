# WordPress Resource Category Taxonomy

This document defines the complete category taxonomy used for organizing WordPress resources in the project.

## Primary Categories (Valid for Routing)

These categories are defined in the Zod schema and have corresponding page routes:

### 1. **themes**
- **Route**: `/wordpress-themes/`
- **Description**: General WordPress themes
- **Count**: 17 resources
- **Subcategories**:
  - `modular-design` - Themes with modular/component-based architecture
  - `user-friendly` - Beginner-friendly themes

### 2. **performance**
- **Route**: `/wordpress-performance/`
- **Description**: Performance optimization plugins and tools
- **Count**: 22 resources
- **Subcategories**:
  - `caching` - Cache management plugins
  - `image-optimization` - Image compression and optimization
  - `asset-optimization` - CSS/JS optimization
  - `database-optimization` - Database cleanup and optimization
  - `performance-focused` - General performance enhancement

### 3. **seo**
- **Route**: `/wordpress-seo/`
- **Description**: SEO plugins and tools
- **Count**: 8 resources
- **Subcategories**:
  - `technical-seo` - Schema markup, sitemaps, etc.

### 4. **security**
- **Route**: `/wordpress-security/`
- **Description**: Security plugins and services
- **Count**: 1 resource
- **Subcategories**: None currently

### 5. **wordpress-hosting**
- **Route**: `/wordpress-hosting/`
- **Description**: WordPress-specific hosting services
- **Count**: 17 resources
- **Subcategories**:
  - `cloud-vps` - Cloud Virtual Private Server hosting
  - `managed-wordpress` - Fully managed WordPress hosting
  - `managed-vps` - Managed VPS solutions
  - `shared-hosting` - Traditional shared hosting
  - `platform-as-a-service` - PaaS solutions
  - `jamstack` - Static site generation platforms
  - `headless-wordpress` - Headless/decoupled hosting
  - `developer-focused` - Developer-centric platforms
  - `european` - EU-based hosting (GDPR compliant)
  - `enterprise` - Enterprise-grade hosting
  - `control-panel` - Hosting with custom control panels

### 6. **woocommerce-themes**
- **Route**: `/woocommerce-themes/`
- **Description**: WooCommerce-optimized themes
- **Count**: 9 resources
- **Subcategories**: None currently

### 7. **woocommerce-plugins**
- **Route**: `/woocommerce-plugins/`
- **Description**: WooCommerce extensions and addons
- **Count**: 2 resources
- **Subcategories**: None currently

### 8. **woocommerce-hosting**
- **Route**: `/woocommerce-hosting/`
- **Description**: WooCommerce-optimized hosting
- **Count**: 3 resources
- **Subcategories**: Uses same as wordpress-hosting

### 9. **wordpress-blocks**
- **Route**: `/wordpress-blocks/`
- **Description**: Gutenberg block plugins and libraries
- **Count**: 6 resources
- **Subcategories**:
  - `block-editor` - Block editor enhancements

### 10. **wordpress-pagebuilder**
- **Route**: `/wordpress-pagebuilder/`
- **Description**: Visual page builders and site builders
- **Count**: 8 resources
- **Subcategories**:
  - `visual-design` - Visual/drag-drop focused builders
  - `developer-tools` - Code-level control builders
  - `development-tools` - Development-focused builders
  - `block-editor` - Gutenberg-based builders
  - `professional-tools` - Professional/agency tools
  - `enterprise-tools` - Enterprise-grade builders
  - `application-builder` - App-like builders

### 11. **forms**
- **Route**: `/wordpress-forms/`
- **Description**: Form builder plugins
- **Count**: 6 resources
- **Subcategories**:
  - `user-friendly` - Beginner-friendly form builders
  - `professional-tools` - Professional/advanced form builders
  - `enterprise-tools` - Enterprise-grade form solutions
  - `application-builder` - Forms with app-building capabilities
  - `modular-design` - Extensible/modular form builders
  - `block-editor` - Gutenberg-native form builders

### 12. **automation**
- **Route**: `/wordpress-automation/`
- **Description**: Automation and workflow plugins
- **Count**: 0 resources (category exists but no resources yet)
- **Subcategories**: None currently

### 13. **admin**
- **Route**: `/wordpress-admin/`
- **Description**: Admin tools and enhancements
- **Count**: 0 resources (category exists but no resources yet)
- **Subcategories**: None currently

### 14. **hosting** (Legacy/Duplicate)
- **Note**: This is a duplicate of `wordpress-hosting` kept for backwards compatibility
- **Should use**: `wordpress-hosting` instead
- **Count**: 21 resources (overlaps with wordpress-hosting)

## Subcategory Usage Guidelines

### Purpose of Subcategories
- **Organization**: Help organize resources within primary categories
- **Filtering**: Enable more granular filtering in UI
- **SEO**: Provide additional context for search engines
- **User Navigation**: Help users find specific types of resources

### How to Use Subcategories
1. Every resource MUST have at least one valid primary category
2. Subcategories are optional and used for additional organization
3. Multiple subcategories can be applied to a single resource
4. Subcategories don't have their own routes - they're filters within primary categories

### Example Category Structure
```yaml
# Correct usage
category: ["performance", "caching", "asset-optimization"]
# Primary: performance (valid for routing)
# Subcategories: caching, asset-optimization (for organization)

# Another example
category: ["wordpress-hosting", "managed-wordpress", "cloud-vps"]
# Primary: wordpress-hosting (valid for routing)  
# Subcategories: managed-wordpress, cloud-vps (for filtering)
```

## Category Assignment Rules

1. **Performance Plugins**: Should use `performance` as primary
   - Add relevant subcategories: `caching`, `image-optimization`, `asset-optimization`, `database-optimization`

2. **Hosting Services**: Should use `wordpress-hosting` as primary
   - For WooCommerce-specific: Also add `woocommerce-hosting`
   - Add hosting type subcategories: `cloud-vps`, `managed-wordpress`, etc.

3. **Themes**: Should use `themes` as primary
   - For WooCommerce-ready: Also add `woocommerce-themes`
   
4. **Page Builders**: Should use `wordpress-pagebuilder` as primary
   - Add builder type subcategories: `visual-design`, `developer-tools`, etc.

5. **SEO Plugins**: Should use `seo` as primary
   - Add `technical-seo` for schema/technical tools

## Maintenance Notes

- This taxonomy is enforced by the Zod schema in `/src/content/config.ts`
- Page routes are defined in `/src/pages/` directory structure
- The resource-hub component automatically maps categories to routes
- Regular audits should ensure all resources have valid primary categories

## Statistics (Last Updated: Current Session)

- Total Resources: 90
- Categories in Use: 12 (of 14 defined)
- Most Popular: Performance (22 resources)
- Least Used: Security (1 resource)
- Empty Categories: automation, admin
- New Form Plugins Added: 6 (WPForms, Gravity Forms, Ninja Forms, etc.)

## Future Considerations

- Consider consolidating `hosting` and `wordpress-hosting` 
- May need subcategories for `security` as more resources are added
- `wordpress-forms` category awaits form plugin reviews
- `automation` category awaits workflow plugin reviews
- `admin` category awaits admin tool reviews