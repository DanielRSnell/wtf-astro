import { Cpu, LayoutList, LocateFixed, Rocket, Users, TrendingUp } from "lucide-react";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import type { TimelineContent } from "@/lib/content";


const Timeline4 = ({ "data-theme": dataTheme, content }: Timeline4Props) => {
  const getIcon = (iconName: string) => {
    const iconMap: Record<string, any> = {
      "layout-list": LayoutList,
      "locate-fixed": LocateFixed,
      users: Users,
      cpu: Cpu,
      rocket: Rocket,
      "trending-up": TrendingUp
    };
    return iconMap[iconName.toLowerCase()] || LayoutList;
  };

  if (!content) {
    return null;
  }
  return (
    <section className="bg-background py-32 text-foreground" data-theme={dataTheme}>
      <div className="border-y">
        <div className="container flex flex-col gap-6 border-x py-4 max-lg:border-x lg:py-8">
          <Badge
            variant="outline"
            className="w-fit gap-1 bg-card px-3 text-sm font-normal tracking-tight shadow-sm"
          >
            <Rocket className="size-4" />
            <span>{content.header.badge}</span>
          </Badge>
          <h2 className="text-3xl leading-tight tracking-tight md:text-4xl lg:text-6xl">
            {content.header.title}
          </h2>
          <p className="max-w-[600px] tracking-[-0.32px] text-muted-foreground">
            {content.header.subtitle}
          </p>
        </div>
      </div>

      <div className="container overflow-hidden border-x">
        {content.steps.map((item, index) => {
          const IconComponent = getIcon(item.icon);
          return (
          <div key={index} className="relative py-16 first:pt-20 last:pb-20">
            {/* Timeline line */}
            <div
              className={`absolute left-1/2 top-0 w-[3px] h-full -translate-x-1/2 rounded-full ${index === content.steps.length - 1 ? "bg-gradient-to-b from-foreground/10 via-foreground/10 to-transparent" : "bg-foreground/10"}`}
            >
              {index === 0 && (
                <div className="h-16 w-[3px] -translate-y-full bg-gradient-to-b from-transparent to-foreground/10"></div>
              )}
            </div>

            {/* Content card */}
            <div 
              className={`group relative max-w-lg overflow-hidden rounded-2xl bg-card/60 backdrop-blur-xl border border-brand hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 ${item.reverse ? "lg:ml-auto lg:mr-24" : "lg:mr-auto lg:ml-24"}`}
            >
              {/* High-fidelity gradient background */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
                <div className="absolute inset-0 bg-gradient-to-t from-card/40 via-transparent to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-muted/5 to-primary/3" />
              </div>
              
              {/* Content */}
              <div className="relative z-10 p-8 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 backdrop-blur-sm border border-primary/20">
                    <IconComponent className="size-5 text-primary" />
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-2xl font-bold leading-tight text-foreground group-hover:text-primary transition-colors duration-300">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
                
                {/* Step indicator */}
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium">Step {index + 1}</span>
                  <span>•</span>
                  <span>{item.reverse ? "Advanced" : "Essential"}</span>
                </div>
              </div>
              
              {/* Subtle border highlight */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Central icon for timeline */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex h-16 w-16 items-center justify-center rounded-full bg-background border-4 border-primary/20 backdrop-blur-sm shadow-lg">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                <div className="h-2 w-2 rounded-full bg-primary" />
              </div>
            </div>
          </div>
          );
        })}
      </div>

      <div className="h-8 w-full border-y md:h-12 lg:h-[112px]">
        <div className="container h-full w-full border-x"></div>
      </div>
    </section>
  );
};

export { Timeline4 };

interface Timeline4Props {
  "data-theme"?: string;
  content?: TimelineContent;
}