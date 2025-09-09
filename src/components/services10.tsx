"use client";

import {
  ArrowRight,
  CheckCircle,
  Code,
  Cog,
  PenTool,
  Shrub,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ServicesContent } from "@/lib/content";

interface Services10Props {
  "data-theme"?: string;
  content?: ServicesContent;
}

const Services10 = ({ "data-theme": dataTheme, content }: Services10Props) => {
  const getIcon = (iconName: string) => {
    const iconMap: Record<string, any> = {
      cog: Cog,
      "pen-tool": PenTool,
      code: Code,
      shrub: Shrub
    };
    return iconMap[iconName.toLowerCase()] || Cog;
  };

  if (!content) {
    return null;
  }

  return (
    <section className="bg-background py-32 text-foreground" data-theme={dataTheme}>
      <div className="container">
        <div className="mx-auto max-w-6xl space-y-16">
          <div className="space-y-4 text-center">
            <Badge variant="outline" className="bg-background">
              {content.header.badge}
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
              {content.header.title}
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg tracking-tight md:text-xl">
              {content.header.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {content.services.map((service, index) => {
              const IconComponent = getIcon(service.icon);
              return (
              <div
                key={index}
                className="group relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-xl border border-border/20 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10"
              >
                {/* High-fidelity gradient background using theme colors */}
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
                  <div className="absolute inset-0 bg-gradient-to-t from-card/40 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-muted/5 to-primary/3" />
                </div>
                
                {/* Content */}
                <div className="relative z-10 p-8">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 backdrop-blur-sm border border-primary/20">
                        <IconComponent className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold group-hover:text-primary transition-colors duration-300">
                          {service.title}
                        </h3>
                        <div className="text-muted-foreground mt-1 text-sm">
                          {service.duration}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-muted-foreground mt-6 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="mt-6 space-y-4">
                    <div>
                      <h4 className="mb-3 text-sm font-medium">
                        What's included:
                      </h4>
                      <ul className="space-y-2">
                        {service.items.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className="flex items-center gap-3 text-sm"
                          >
                            <CheckCircle className="h-4 w-4 flex-shrink-0 text-green-600" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-muted/50 rounded-lg p-4">
                      <h4 className="mb-2 text-sm font-medium">
                        Deliverables:
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {service.deliverables.map((deliverable, delivIndex) => (
                          <Badge
                            key={delivIndex}
                            variant="secondary"
                            className="text-xs"
                          >
                            {deliverable}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="border-border mt-8 border-t pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-lg font-semibold">
                          {service.price}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          Custom quotes available
                        </div>
                      </div>
                      <Button
                        size="sm"
                        variant={service.featured ? "default" : "outline"}
                        className="transition-all group-hover:shadow-md"
                      >
                        Get Started
                        <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Subtle border highlight */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              );
            })}
          </div>

          <div className="group relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-xl border border-border/20 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 p-8 text-center">
            {/* High-fidelity gradient background using theme colors */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
              <div className="absolute inset-0 bg-gradient-to-t from-card/40 via-transparent to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-muted/5 to-primary/3" />
            </div>
            
            {/* Content */}
            <div className="relative z-10">
              <h3 className="mb-2 text-xl font-semibold group-hover:text-primary transition-colors duration-300">
                {content.customSolution.title}
              </h3>
              <p className="text-muted-foreground mb-6">
                {content.customSolution.subtitle}
              </p>
              <Button
                size="lg"
                className="from-primary to-primary/80 bg-gradient-to-r"
              >
                {content.customSolution.cta}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            
            {/* Subtle border highlight */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        </div>
      </div>
    </section>
  );
};

export { Services10 };
