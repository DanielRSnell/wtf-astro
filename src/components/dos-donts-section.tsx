import { Check, X, CheckCircle, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DosDontsItem {
  text: string;
  description?: string;
}

interface DosDontsSectionProps {
  title: string;
  subtitle?: string;
  dos: DosDontsItem[];
  donts: DosDontsItem[];
  className?: string;
  "data-theme"?: string;
}

const DosDontsSection = ({
  title,
  subtitle,
  dos,
  donts,
  className,
  "data-theme": dataTheme
}: DosDontsSectionProps) => {

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
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const DoItem = ({ item, index }: { item: DosDontsItem; index: number }) => (
    <motion.div
      variants={itemVariants}
      className="group flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-green-500/5 via-emerald-500/5 to-green-500/5 border border-green-500/20 hover:border-green-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10"
    >
      <div className="flex-shrink-0 mt-0.5">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/10 border border-green-500/20">
          <Check className="h-3.5 w-3.5 text-green-500" />
        </div>
      </div>
      <div className="flex-1">
        <p className="font-medium text-foreground mb-1">
          {item.text}
        </p>
        {item.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {item.description}
          </p>
        )}
      </div>
    </motion.div>
  );

  const DontItem = ({ item, index }: { item: DosDontsItem; index: number }) => (
    <motion.div
      variants={itemVariants}
      className="group flex items-start gap-3 p-4 rounded-xl bg-gradient-to-r from-red-500/5 via-rose-500/5 to-red-500/5 border border-red-500/20 hover:border-red-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/10"
    >
      <div className="flex-shrink-0 mt-0.5">
        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20">
          <X className="h-3.5 w-3.5 text-red-500" />
        </div>
      </div>
      <div className="flex-1">
        <p className="font-medium text-foreground mb-1">
          {item.text}
        </p>
        {item.description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {item.description}
          </p>
        )}
      </div>
    </motion.div>
  );

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
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Dos and Don'ts Grid */}
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Dos Column */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Dos Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 border border-green-500/20">
                <CheckCircle className="h-5 w-5 text-green-500 fill-current" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-green-500">Do's</h3>
                <p className="text-sm text-muted-foreground">Best practices to follow</p>
              </div>
            </div>

            {/* Dos List */}
            <div className="space-y-4">
              {dos.map((item, index) => (
                <DoItem key={index} item={item} index={index} />
              ))}
            </div>
          </motion.div>

          {/* Don'ts Column */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Don'ts Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 border border-red-500/20">
                <XCircle className="h-5 w-5 text-red-500 fill-current" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-red-500">Don'ts</h3>
                <p className="text-sm text-muted-foreground">Common mistakes to avoid</p>
              </div>
            </div>

            {/* Don'ts List */}
            <div className="space-y-4">
              {donts.map((item, index) => (
                <DontItem key={index} item={item} index={index} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export { DosDontsSection };