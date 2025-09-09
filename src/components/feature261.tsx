import { Badge } from "@/components/ui/badge";
import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { Calendar, Globe, LocateIcon, WifiIcon } from "lucide-react";
import type { FeaturesContent } from "@/lib/content";

interface Feature261Props {
  "data-theme"?: string;
  content?: FeaturesContent;
}


const Feature261 = ({ "data-theme": dataTheme, content }: Feature261Props) => {
  const getIcon = (iconName: string) => {
    const iconMap: Record<string, any> = {
      globe: Globe,
      wifi: WifiIcon,
      locate: LocateIcon,
      calendar: Calendar
    };
    return iconMap[iconName.toLowerCase()] || Globe;
  };

  const getSizeClass = (size: string) => {
    return size === "large" ? "col-span-3 lg:col-span-2" : "col-span-3 lg:col-span-1";
  };

  const getThemeGradients = (theme: string) => {
    const gradientMap: Record<string, JSX.Element> = {
      primary: (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-card/60 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-muted/10 to-primary/10" />
        </div>
      ),
      secondary: (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/15 via-transparent to-primary/15" />
          <div className="absolute inset-0 bg-gradient-to-t from-card/40 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-muted/8 to-secondary/8" />
        </div>
      ),
      accent: (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-muted/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-card/50 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-bl from-transparent via-primary/5 to-secondary/10" />
        </div>
      ),
      muted: (
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 via-transparent to-primary/25" />
          <div className="absolute inset-0 bg-gradient-to-t from-card/70 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-muted/12 to-primary/8" />
        </div>
      )
    };
    return gradientMap[theme] || gradientMap.primary;
  };

  if (!content) {
    return null;
  }
  return (
    <section className="bg-background py-32 text-foreground" data-theme={dataTheme}>
      <div className="container">
        <div className="mx-auto max-w-6xl space-y-16">
          <div className="space-y-4 text-center">
            <Badge variant="outline" className="bg-card/60 backdrop-blur-xl border-border/20">
              {content.header.badge}
            </Badge>
            <h2 className="text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
              {content.header.title}
            </h2>
            <p className="text-muted-foreground mx-auto max-w-2xl text-lg tracking-tight md:text-xl">
              {content.header.subtitle}
            </p>
          </div>
          
          <BentoGrid className="auto-rows-[20rem] grid-cols-1 gap-4 md:grid-cols-3">
            {content.features.map((feature, idx) => {
              const IconComponent = getIcon(feature.icon);
              return (
                <BentoCard 
                  key={idx} 
                  Icon={IconComponent}
                  name={feature.name}
                  description={feature.description}
                  href={feature.href}
                  cta={feature.cta}
                  className={getSizeClass(feature.size)}
                  background={getThemeGradients(feature.theme)}
                />
              );
            })}
          </BentoGrid>
        </div>
      </div>
    </section>
  );
};

export { Feature261 };
