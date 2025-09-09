# Blocksy Components - Design System Guide

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