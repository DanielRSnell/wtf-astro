import { User, Users, Quote, MessageCircle, Heart, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface PerspectivePoint {
  text: string;
  description?: string;
  emphasis?: boolean; // Highlights important points
}

interface PerspectiveComparisonProps {
  title: string;
  subtitle?: string;
  topic: string; // What's being compared (e.g., "GenerateBlocks")
  personalPerspective: {
    title?: string;
    intro?: string;
    points: PerspectivePoint[];
    author?: string;
    authorTitle?: string;
  };
  communityPerspective: {
    title?: string;
    intro?: string;
    points: PerspectivePoint[];
    source?: string; // e.g., "Based on 500+ reviews"
  };
  className?: string;
  "data-theme"?: string;
}

const PerspectiveComparison = ({
  title,
  subtitle,
  topic,
  personalPerspective,
  communityPerspective,
  className,
  "data-theme": dataTheme
}: PerspectiveComparisonProps) => {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const PerspectivePoint = ({ point, type }: { point: PerspectivePoint; type: "personal" | "community" }) => {
    const isPersonal = type === "personal";
    const accentColor = isPersonal ? "text-blue-500" : "text-purple-500";
    const bgColor = isPersonal ? "from-blue-500/5 via-sky-500/5 to-blue-500/5" : "from-purple-500/5 via-violet-500/5 to-purple-500/5";
    const borderColor = isPersonal ? "border-blue-500/20 hover:border-blue-500/30" : "border-purple-500/20 hover:border-purple-500/30";
    const shadowColor = isPersonal ? "hover:shadow-blue-500/10" : "hover:shadow-purple-500/10";

    return (
      <motion.div
        variants={itemVariants}
        className={cn(
          "group relative p-4 rounded-xl bg-gradient-to-r border transition-all duration-300 hover:shadow-lg",
          bgColor,
          borderColor,
          shadowColor,
          point.emphasis && "ring-1 ring-opacity-20",
          point.emphasis && isPersonal && "ring-blue-500",
          point.emphasis && !isPersonal && "ring-purple-500"
        )}
      >
        {point.emphasis && (
          <div className="absolute -top-2 -right-2">
            <div className={cn(
              "flex h-6 w-6 items-center justify-center rounded-full text-white text-xs font-bold",
              isPersonal ? "bg-blue-500" : "bg-purple-500"
            )}>
              !
            </div>
          </div>
        )}
        
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <div className={cn(
              "h-2 w-2 rounded-full",
              isPersonal ? "bg-blue-500" : "bg-purple-500"
            )} />
          </div>
          <div className="flex-1">
            <p className={cn(
              "font-medium mb-1",
              point.emphasis ? accentColor : "text-foreground"
            )}>
              {point.text}
            </p>
            {point.description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {point.description}
              </p>
            )}
          </div>
        </div>
      </motion.div>
    );
  };

  return (
    <section className={cn("py-24 bg-background", className)} data-theme={dataTheme}>
      <div className="container max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-6">
              {subtitle}
            </p>
          )}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
            <div className="h-2 w-2 rounded-full bg-primary" />
            <span className="text-sm font-medium text-primary">Analyzing: {topic}</span>
          </div>
        </motion.div>

        {/* Perspective Grid */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Personal Perspective */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative"
          >
            {/* Personal Header */}
            <div className="flex items-start gap-4 mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 border border-blue-500/20">
                <User className="h-6 w-6 text-blue-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-blue-500 mb-1">
                  {personalPerspective.title || "Personal Perspective"}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Individual experience and hands-on testing
                </p>
                {personalPerspective.author && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Quote className="h-3 w-3" />
                    <span>{personalPerspective.author}</span>
                    {personalPerspective.authorTitle && (
                      <span className="text-xs">• {personalPerspective.authorTitle}</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Personal Intro */}
            {personalPerspective.intro && (
              <motion.div
                variants={itemVariants}
                className="mb-6 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10"
              >
                <p className="text-sm text-foreground leading-relaxed italic">
                  "{personalPerspective.intro}"
                </p>
              </motion.div>
            )}

            {/* Personal Points */}
            <div className="space-y-4">
              {personalPerspective.points.map((point, index) => (
                <PerspectivePoint 
                  key={index} 
                  point={point} 
                  type="personal" 
                />
              ))}
            </div>
          </motion.div>

          {/* Community Perspective */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative"
          >
            {/* Community Header */}
            <div className="flex items-start gap-4 mb-8">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 border border-purple-500/20">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-bold text-purple-500 mb-1">
                  {communityPerspective.title || "Community Perspective"}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Collective wisdom from user experiences
                </p>
                {communityPerspective.source && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="h-3 w-3" />
                    <span>{communityPerspective.source}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Community Intro */}
            {communityPerspective.intro && (
              <motion.div
                variants={itemVariants}
                className="mb-6 p-4 rounded-xl bg-purple-500/5 border border-purple-500/10"
              >
                <div className="flex items-start gap-3">
                  <MessageCircle className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-foreground leading-relaxed">
                    {communityPerspective.intro}
                  </p>
                </div>
              </motion.div>
            )}

            {/* Community Points */}
            <div className="space-y-4">
              {communityPerspective.points.map((point, index) => (
                <PerspectivePoint 
                  key={index} 
                  point={point} 
                  type="community" 
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Bottom Insights */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 via-secondary/10 to-primary/10 border border-primary/20">
            <Heart className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">
              Both perspectives provide valuable insights for informed decisions
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export { PerspectiveComparison };