import { MoveRight } from "lucide-react";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { GradientButton } from "@/components/ui/gradient-button";

interface ServiceHeroProps {
  "data-theme"?: string;
  title: string;
  subtitle: string;
  badge?: string;
  primaryCta?: {
    text: string;
    href: string;
  };
  secondaryCta?: {
    text: string;
    href: string;
  };
}

const ServiceHero = ({ 
  "data-theme": dataTheme, 
  title,
  subtitle,
  badge,
  primaryCta = { text: "View Packages", href: "#packages" },
  secondaryCta = { text: "Get Free Consultation", href: "/contact" }
}: ServiceHeroProps) => {
  return (
    <section 
      className="relative bg-background py-32 text-foreground" 
      data-theme={dataTheme}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        {/* Dot pattern background */}
        <DotPattern
          glow={true}
          className="text-primary opacity-80"
          width={30}
          height={30}
          cx={1}
          cy={1}
          cr={2}
        />
        
        {/* Gradient overlay for smooth blend */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background pointer-events-none" />
        
        {/* Original blur elements matching Hero24 */}
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
      </div>
      
      <div className="container relative">
        <div className="text-center max-w-4xl mx-auto">
          {badge && (
            <div className="inline-flex items-center gap-2 rounded-full bg-card/60 backdrop-blur-xl border border-border/20 px-4 py-2 mb-6">
              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs tracking-widest text-muted-foreground font-medium uppercase">
                {badge}
              </span>
            </div>
          )}
          
          <h1 className="text-4xl font-bold tracking-tight text-balance lg:text-6xl mb-6 leading-tight bg-gradient-to-r from-foreground via-foreground/60 to-foreground bg-clip-text text-transparent">
            {title}
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
            {subtitle}
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
            {primaryCta && (
              <GradientButton 
                variant="secondary" 
                size="lg"
                href={primaryCta.href}
              >
                {primaryCta.text}
                <MoveRight className="ml-2" strokeWidth={1.5} />
              </GradientButton>
            )}
            {secondaryCta && (
              <a 
                href={secondaryCta.href}
                className="text-muted-foreground hover:text-primary transition-colors duration-200 underline underline-offset-4 decoration-muted-foreground/30 hover:decoration-primary/50"
              >
                {secondaryCta.text}
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export { ServiceHero };