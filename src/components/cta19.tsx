import { FileCode, Layers, Headphones } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { GradientButton } from "@/components/ui/gradient-button";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import type { CtaContent } from "@/lib/content";

interface Cta19Props {
  "data-theme"?: string;
  content?: CtaContent;
}

const Cta19 = ({ "data-theme": dataTheme, content }: Cta19Props) => {
  const getIcon = (iconName: string) => {
    const iconMap: Record<string, any> = {
      "file-code": FileCode,
      layers: Layers,
      headphones: Headphones
    };
    return iconMap[iconName.toLowerCase()] || FileCode;
  };

  const getCTAVariant = (type: string): "primary" | "secondary" | "outline" => {
    return type === "primary" ? "primary" : type === "outline" ? "outline" : "secondary";
  };

  if (!content) {
    return null;
  }
  return (
    <section className="relative bg-background py-32 text-foreground" data-theme={dataTheme}>
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-secondary/5 blur-3xl" />
      </div>
      
      <div className="container relative">
        <div className="group relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-xl border border-border/20 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 flex flex-col lg:flex-row">
          {/* Layered gradient backgrounds */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
            <div className="absolute inset-0 bg-gradient-to-t from-card/40 via-transparent to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-muted/5 to-primary/3" />
          </div>
          
          <div className="relative z-10 grow px-8 py-8 lg:px-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-card/60 backdrop-blur-xl border border-border/20 px-4 py-2 mb-6">
              {content.badge.showIndicator && <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />}
              <span className="text-xs tracking-widest text-muted-foreground font-medium uppercase">
                {content.badge.text}
              </span>
            </div>
            <div className="max-w-xl">
              <h2 className="text-3xl font-semibold text-foreground md:text-4xl leading-tight">
                {content.title}
              </h2>
              <p className="mt-4 text-muted-foreground md:text-lg leading-relaxed">
                {content.subtitle}
              </p>
            </div>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
              <GradientButton 
                variant={getCTAVariant(content.buttons.primary.type)}
                size="md"
              >
                {content.buttons.primary.text}
              </GradientButton>
              <Button variant="link" className="text-foreground hover:text-primary transition-colors duration-300 px-0 h-auto font-medium">
                {content.buttons.secondary.text}
              </Button>
            </div>
          </div>
          <div className="relative z-10 flex grow basis-5/12 flex-col justify-between border-t border-l border-border/20 lg:border-t-0 lg:border-l lg:border-l-border/20">
            {content.links.map((link, index) => {
              const IconComponent = getIcon(link.icon);
              const gradientVariation = index === 0 ? 
                "from-primary/5 via-transparent to-secondary/5" : 
                "from-secondary/5 via-transparent to-primary/5";
              
              return (
                <div key={index}>
                  <a
                    href="#"
                    className="group/link relative flex h-full items-center px-9 py-6 transition-all duration-300 hover:bg-primary/5 lg:justify-center overflow-hidden"
                  >
                    {/* Hover gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${gradientVariation} opacity-0 group-hover/link:opacity-100 transition-opacity duration-300`} />
                    
                    <div className="relative z-10 flex gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 backdrop-blur-sm border border-primary/20 group-hover/link:bg-primary/20 transition-colors duration-300">
                        <IconComponent
                          className="size-6 text-primary"
                          strokeWidth={1.5}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-semibold text-foreground group-hover/link:text-primary transition-colors duration-300 md:text-xl">
                          {link.title}
                        </h3>
                        <p className="max-w-lg text-muted-foreground md:text-lg leading-relaxed">
                          {link.description}
                        </p>
                      </div>
                    </div>
                    
                    {/* Subtle border highlight */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover/link:opacity-100 transition-opacity duration-500" />
                  </a>
                  {index < content.links.length - 1 && <Separator className="bg-border/20" />}
                </div>
              );
            })}
          </div>
          
          {/* Main container border highlight */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </div>
    </section>
  );
};

export { Cta19 };
