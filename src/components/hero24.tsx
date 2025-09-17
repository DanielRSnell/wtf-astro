import { Expand, Globe, MoveRight, Rocket, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { RocketLogo } from "@/components/ui/rocket-logo";
import { GradientButton } from "@/components/ui/gradient-button";
import { PictureCard } from "@/components/ui/picture-card";

import type { HeroContent } from "@/lib/content";
import danielImage from "@/assets/daniel.jpg";

interface Hero24Props {
  "data-theme"?: string;
  content?: HeroContent;
}

const Hero24 = ({ "data-theme": dataTheme, content }: Hero24Props) => {
  const getIcon = (iconName: string) => {
    const iconMap: Record<string, any> = {
      globe: Globe,
      rocket: Rocket, 
      expand: Expand,
      wrench: Wrench
    };
    return iconMap[iconName.toLowerCase()] || Globe;
  };

  const getThemeGradients = (theme: string) => {
    const gradientMap: Record<string, string[]> = {
      primary: ["from-primary/5 via-transparent to-secondary/5", "from-card/40 via-transparent to-transparent", "from-transparent via-muted/5 to-primary/3"],
      secondary: ["from-secondary/8 via-transparent to-primary/8", "from-card/50 via-transparent to-transparent", "from-transparent via-muted/5 to-secondary/5"],
      accent: ["from-primary/10 via-transparent to-muted/20", "from-card/50 via-transparent to-transparent", "from-transparent via-primary/5 to-secondary/10"],
      muted: ["from-secondary/10 via-transparent to-primary/15", "from-card/60 via-transparent to-transparent", "from-transparent via-muted/12 to-primary/8"]
    };
    return gradientMap[theme] || gradientMap.primary;
  };

  const getCTAVariant = (type: string): "primary" | "secondary" | "outline" => {
    return type === "primary" ? "primary" : type === "outline" ? "outline" : "secondary";
  };

  if (!content) {
    return null; // Component requires content to be passed from page level
  }
  return (
    <section 
      className="relative bg-background py-32 text-foreground" 
      data-theme={dataTheme}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Dot pattern background - increased visibility */}
        <DotPattern
          glow={true}
          className="text-primary/60 fill-primary/60"
          width={32}
          height={32}
          cx={2}
          cy={2}
          cr={2}
        />
        
        {/* Gradient overlay for smooth blend */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background/80 pointer-events-none" />
        
        {/* Original blur elements */}
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
      </div>
      
      <div className="container relative">
        <div className="text-center">
          <RocketLogo 
            size="lg"
            className="mx-auto mb-5 md:mb-6 lg:mb-7"
          />
          <div className="inline-flex items-center gap-2 rounded-full bg-card/60 backdrop-blur-xl border border-border/20 px-4 py-2 mb-6">
            {content.badge.showIndicator && <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />}
            <span className="text-xs tracking-widest text-muted-foreground font-medium uppercase">
              {content.badge.text}
            </span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-balance lg:text-6xl mb-6 leading-tight bg-gradient-to-r from-foreground via-foreground/60 to-foreground bg-clip-text text-transparent capitalize">
            Hey I'm {content.hero.name} <PictureCard 
              name={content.hero.name}
              role=""
              imageSrc={danielImage.src}
              className="inline-flex mx-2"
            /> and I build lightning fast WooCommerce Stores That Convert.
          </h1>
          <div className="flex justify-center">
            <GradientButton
              variant={getCTAVariant(content.cta.type)}
              size="lg"
            >
              {content.cta.text}
              <MoveRight className="ml-2" strokeWidth={1.5} />
            </GradientButton>
          </div>
        </div>
        <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {content.features.map((feature, index) => {
            const IconComponent = getIcon(feature.icon);
            const gradients = getThemeGradients(feature.theme);
            return (
              <div key={index} className="group relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-xl border-brand hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 p-6">
                {/* High-fidelity gradient background */}
                <div className="absolute inset-0">
                  {gradients.map((gradient, gradIndex) => (
                    <div key={gradIndex} className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
                  ))}
                </div>
                
                {/* Content */}
                <div className="relative z-10 flex flex-col gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 backdrop-blur-sm border border-primary/20">
                    <IconComponent className="size-6 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-base font-semibold text-foreground group-hover:text-primary transition-colors duration-300 mb-2">
                      {feature.title}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
                
                {/* Subtle border highlight */}
                <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export { Hero24 };
