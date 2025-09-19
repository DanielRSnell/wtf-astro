import { BookOpen, Clock, User, ArrowRight, Layers } from "lucide-react";
import { cn } from "@/lib/utils";

interface GuideCard {
  title: string;
  description: string;
  category: string;
  image?: string; // Optional custom image
  gradient: string; // CSS gradient for background
  lessonsCount: number;
  duration: string; // e.g., "2h 30m"
  level: "Beginner" | "Intermediate" | "Advanced";
  href: string;
  author?: string;
}

interface GuidesCardsProps {
  title?: string;
  subtitle?: string;
  guides: GuideCard[];
  className?: string;
  "data-theme"?: string;
  showHeader?: boolean;
}

const GuidesCards = ({
  title,
  subtitle,
  guides,
  className,
  "data-theme": dataTheme,
  showHeader = true
}: GuidesCardsProps) => {


  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "text-green-400 bg-green-400/10";
      case "Intermediate": 
        return "text-yellow-400 bg-yellow-400/10";
      case "Advanced":
        return "text-red-400 bg-red-400/10";
      default:
        return "text-muted-foreground bg-muted/10";
    }
  };

  const GuideCard = ({ guide, index }: { guide: GuideCard; index: number }) => {
    const CARD_OFFSET = 16;
    const SCALE_FACTOR = 0.04;

    return (
      <div
        className="group relative"
        style={{ height: '520px' }}
      >
        <a href={guide.href} className="block relative">
          {/* Background Cards for Stacked Effect */}
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-background to-foreground/5 ring-1 ring-foreground/10 shadow-lg transition-all duration-300 group-hover:-top-2 group-hover:-right-2"
            style={{
              transform: `scale(${1 - SCALE_FACTOR * 2})`,
              transformOrigin: "top left",
              zIndex: 1,
              top: `-${CARD_OFFSET * 2}px`,
              right: `-${CARD_OFFSET * 2}px`,
            }}
          />
          <div
            className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-background to-foreground/8 ring-1 ring-foreground/10 shadow-xl transition-all duration-300 group-hover:-top-1 group-hover:-right-1"
            style={{
              transform: `scale(${1 - SCALE_FACTOR})`,
              transformOrigin: "top left",
              zIndex: 2,
              top: `-${CARD_OFFSET}px`,
              right: `-${CARD_OFFSET}px`,
            }}
          />
          
          {/* Main Card with Full Content */}
          <div
            className="relative rounded-2xl bg-card backdrop-blur-xl hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 overflow-hidden flex flex-col"
            style={{ zIndex: 3, height: '100%' }}
          >
            {/* Header Image */}
            <div className="relative h-48">
              <div 
                className="absolute inset-0"
                style={{ background: guide.gradient }}
              />
              {guide.image ? (
                <img 
                  src={guide.image} 
                  alt={guide.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-80"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <BookOpen className="w-8 h-8 text-white" />
                  </div>
                </div>
              )}
              
              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <div className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-sm text-white text-xs font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {guide.category}
                </div>
              </div>

              {/* Lesson Count */}
              <div className="absolute top-4 right-4">
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-black/30 backdrop-blur-sm text-white text-xs">
                  <Layers className="w-3 h-3" />
                  <span>{guide.lessonsCount}</span>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="relative p-6 flex-1 flex flex-col">
              <div className="absolute -inset-px rounded-b-2xl bg-gradient-to-br from-foreground/5 to-50% pointer-events-none" />
              
              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                {guide.title}
              </h3>

              <p className="text-sm text-muted-foreground leading-relaxed mb-6 flex-1 line-clamp-3">
                {guide.description}
              </p>

              {/* Meta Info */}
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    <span>{guide.lessonsCount} Lessons</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{guide.duration}</span>
                  </div>
                </div>
                <div className={cn("px-2 py-1 rounded-full text-xs font-medium", getLevelColor(guide.level))}>
                  {guide.level}
                </div>
              </div>

              {/* Author */}
              {guide.author && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{guide.author}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />
                </div>
              )}
            </div>

            {/* Hover Effects */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            {/* Shimmer Effect */}
            <div className="absolute inset-0 -top-4 -bottom-4 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 group-hover:translate-x-full transition-all duration-700 ease-out transform -translate-x-full skew-x-12 pointer-events-none" />
          </div>
        </a>
      </div>
    );
  };

  return (
    <section className={cn("py-24 bg-background", className)} data-theme={dataTheme}>
      <div className="container max-w-7xl mx-auto px-6">
        {/* Header */}
        {showHeader && (title || subtitle) && (
          <div className="text-center mb-16 animate-in fade-in slide-in-from-top-8 duration-600">
            {title && (
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        {/* Guides Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4 auto-rows-fr">
          {guides.map((guide, index) => (
            <GuideCard key={index} guide={guide} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export { GuidesCards };