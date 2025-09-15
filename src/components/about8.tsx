import { type SVGProps, useId } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { AboutContent } from "@/lib/content";
import danielImage from "@/assets/daniel.jpg";
import { BeforeAfterCards } from "@/components/ui/before-after-cards";

interface About8Props {
  "data-theme"?: string;
  content?: AboutContent;
}

export const About8 = ({ "data-theme": dataTheme, content }: About8Props) => {
  const getThemeGradients = (theme: string) => {
    const gradientMap: Record<string, string[]> = {
      primary: ["from-primary/10 via-transparent to-secondary/10", "from-card/60 via-transparent to-transparent"],
      secondary: ["from-secondary/10 via-transparent to-primary/10", "from-card/60 via-transparent to-transparent"],
      accent: ["from-primary/8 via-transparent to-muted/15", "from-card/60 via-transparent to-transparent"]
    };
    return gradientMap[theme] || gradientMap.primary;
  };

  if (!content) {
    return null; // Component requires content to be passed from page level
  }
  return (
    <section className="bg-background py-32 text-foreground w-full" data-theme={dataTheme}>
      {/* Hero Section */}
      <section className="relative container max-w-5xl py-10 md:py-12 lg:py-15">
        <div className="">
          <h1 className="text-4xl font-semibold tracking-tight md:text-5xl lg:text-6xl">
            {content.hero.title}
          </h1>
          <p className="mt-4 max-w-2xl text-2xl text-muted-foreground md:text-3xl">
            {content.hero.subtitle}
          </p>
        </div>
        {/* Background decoration */}
        <>
          <div className="absolute inset-0 z-[-1] -translate-y-1/2 blur-[100px] will-change-transform">
            <div className="bg-gradient-1/25 absolute top-0 right-0 h-[400px] w-[800px] -translate-x-1/5 rounded-full" />
            <div className="bg-gradient-2/10 absolute top-0 right-0 size-[400px] rounded-full" />
          </div>
          <div className="absolute -inset-40 z-[-1] [mask-image:radial-gradient(circle_at_center,black_0%,black_20%,transparent_80%)]">
            <PlusSigns className="h-full w-full text-foreground/[0.05]" />
          </div>
        </>
      </section>

      {/* Stats Section */}
      <section className="container max-w-5xl">
        <div className="group relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-xl border border-border/20 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 py-8">
          {/* High-fidelity gradient background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
            <div className="absolute inset-0 bg-gradient-to-t from-card/40 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-muted/5 to-primary/3" />
          </div>
          
          {/* Content */}
          <div className="relative z-10 px-6">
            <h2 className="font-mono text-sm font-semibold tracking-widest text-primary uppercase">
              {content.stats.sectionTitle}
            </h2>
            <div className="mt-6 grid grid-cols-2 gap-8 md:grid-cols-4">
              {content.stats.items.map((stat, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="text-4xl font-medium tracking-tight md:text-5xl lg:text-6xl group-hover:text-primary transition-colors duration-300">
                    {stat.value}
                  </h3>
                  <p className="font-medium text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Subtle border highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </section>

      {/* Mission Section */}
      <section className="container max-w-5xl py-10 md:py-12 lg:py-15">
        <div className="group relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-xl border border-border/20 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 p-8">
          {/* High-fidelity gradient background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/8 via-transparent to-primary/8" />
            <div className="absolute inset-0 bg-gradient-to-t from-card/50 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-muted/5 to-secondary/5" />
          </div>
          
          {/* Content */}
          <div className="relative z-10 max-w-2xl space-y-5 md:space-y-8 lg:space-y-10">
            {content.mission.paragraphs.map((paragraph, index) => (
              index === 1 ? (
                <h2 key={index} className="text-2xl font-medium tracking-tight md:text-3xl group-hover:text-primary transition-colors duration-300">
                  {paragraph}
                </h2>
              ) : (
                <p key={index} className="text-lg text-muted-foreground leading-relaxed">
                  {paragraph}
                </p>
              )
            ))}
          </div>
          
          {/* Subtle border highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </section>

      {/* Performance Showcase Section */}
      <section className="container max-w-5xl py-10 md:py-12 lg:py-15">
        <BeforeAfterCards
          title="Real Client Transformations"
          subtitle="Actual performance improvements from recent WooCommerce optimization projects"
          beforeTitle="Before Optimization"
          afterTitle="After WooThatsFast"
          beforeAccent="red"
          afterAccent="green"
          data-theme={dataTheme}
          beforeContent={
            <div className="space-y-6">
              {/* Core Web Vitals Before */}
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-3">Core Web Vitals</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Performance Score</span>
                    <span className="text-2xl font-bold text-red-500">42/100</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">LCP (Largest Contentful Paint)</span>
                      <span className="font-medium text-red-500">4.8s</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">FID (First Input Delay)</span>
                      <span className="font-medium text-red-500">250ms</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">CLS (Cumulative Layout Shift)</span>
                      <span className="font-medium text-red-500">0.35</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Load Times Before */}
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-3">Page Load Metrics</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Full Page Load</span>
                    <span className="font-medium text-red-500">7.2s</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Time to First Byte</span>
                    <span className="font-medium text-red-500">1.8s</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">JavaScript Execution</span>
                    <span className="font-medium text-red-500">3.4s</span>
                  </div>
                </div>
              </div>

              {/* Business Impact Before */}
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-3">Business Metrics</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Bounce Rate</span>
                    <span className="font-medium text-red-500">68%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Cart Abandonment</span>
                    <span className="font-medium text-red-500">78%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Mobile Conversion</span>
                    <span className="font-medium text-red-500">0.8%</span>
                  </div>
                </div>
              </div>
            </div>
          }
          afterContent={
            <div className="space-y-6">
              {/* Core Web Vitals After */}
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-3">Core Web Vitals</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Performance Score</span>
                    <span className="text-2xl font-bold text-green-500">98/100</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">LCP (Largest Contentful Paint)</span>
                      <span className="font-medium text-green-500">0.8s</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">FID (First Input Delay)</span>
                      <span className="font-medium text-green-500">12ms</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">CLS (Cumulative Layout Shift)</span>
                      <span className="font-medium text-green-500">0.02</span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Load Times After */}
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-3">Page Load Metrics</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Full Page Load</span>
                    <span className="font-medium text-green-500">0.9s</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Time to First Byte</span>
                    <span className="font-medium text-green-500">45ms</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">JavaScript Execution</span>
                    <span className="font-medium text-green-500">280ms</span>
                  </div>
                </div>
              </div>

              {/* Business Impact After */}
              <div>
                <h4 className="text-lg font-semibold text-foreground mb-3">Business Metrics</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Bounce Rate</span>
                    <span className="font-medium text-green-500">32%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Cart Abandonment</span>
                    <span className="font-medium text-green-500">45%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Mobile Conversion</span>
                    <span className="font-medium text-green-500">3.2%</span>
                  </div>
                </div>
              </div>
            </div>
          }
        />
      </section>

      {/* CoreAPI Section */}
      <section className="container">
        <div className="group relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-xl border border-border/20 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 p-8 mr-0 ml-auto max-w-2xl">
          {/* High-fidelity gradient background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/8 via-transparent to-secondary/12" />
            <div className="absolute inset-0 bg-gradient-to-t from-card/50 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-muted/8 to-primary/5" />
          </div>
          
          {/* Content */}
          <div className="relative z-10 space-y-5 md:space-y-8 lg:space-y-10">
            {content.coreApi.paragraphs.map((paragraph, index) => (
              index === 1 ? (
                <h2 key={index} className="text-2xl font-medium tracking-tight md:text-3xl group-hover:text-primary transition-colors duration-300">
                  {paragraph}
                </h2>
              ) : (
                <p key={index} className="text-lg text-muted-foreground leading-relaxed">
                  {paragraph}
                </p>
              )
            ))}
          </div>
          
          {/* Subtle border highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </section>

      {/* Founding Team Section */}
      <section className="container py-10 md:py-12 lg:py-15">
        <div className="group relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-xl border border-border/20 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 p-8">
          {/* High-fidelity gradient background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-primary/15" />
            <div className="absolute inset-0 bg-gradient-to-t from-card/60 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-muted/8 to-secondary/8" />
          </div>
          
          {/* Content */}
          <div className="relative z-10 grid gap-5 md:grid-cols-2 md:gap-10 lg:gap-16">
            <div className="order-2 md:order-1 space-y-6">
              <h2 className="text-4xl font-semibold tracking-tight md:text-4xl group-hover:text-primary transition-colors duration-300">
                {content.foundingTeam.title}
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {content.foundingTeam.description}
              </p>
            </div>
            <div className="order-1 md:order-2 relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 min-h-[400px]">
              {/* Daniel Snell's image */}
              <img 
                src={danielImage.src} 
                alt="Daniel Snell - Founder of WooThatsFast" 
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20" />
              <div className="absolute inset-0 bg-gradient-to-t from-card/40 via-transparent to-transparent" />
            </div>
          </div>
          
          {/* Subtle border highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </section>
    </section>
  );
};

interface PlusSignsProps extends SVGProps<SVGSVGElement> {
  className?: string;
}

const PlusSigns = ({ className, ...props }: PlusSignsProps) => {
  const GAP = 16;
  const STROKE_WIDTH = 1;
  const PLUS_SIZE = 6;
  const id = useId();
  const patternId = `plus-pattern-${id}`;

  return (
    <svg width={GAP * 2} height={GAP * 2} className={className} {...props}>
      <defs>
        <pattern
          id={patternId}
          x="0"
          y="0"
          width={GAP}
          height={GAP}
          patternUnits="userSpaceOnUse"
        >
          <line
            x1={GAP / 2}
            y1={(GAP - PLUS_SIZE) / 2}
            x2={GAP / 2}
            y2={(GAP + PLUS_SIZE) / 2}
            stroke="currentColor"
            strokeWidth={STROKE_WIDTH}
          />
          <line
            x1={(GAP - PLUS_SIZE) / 2}
            y1={GAP / 2}
            x2={(GAP + PLUS_SIZE) / 2}
            y2={GAP / 2}
            stroke="currentColor"
            strokeWidth={STROKE_WIDTH}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
};
