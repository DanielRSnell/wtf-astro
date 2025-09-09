import { Clock, Gauge, Eye, TrendingUp, AlertTriangle, CheckCircle, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { BeforeAfterCards } from "@/components/ui/before-after-cards";

interface CoreWebVitalsComparisonProps {
  "data-theme"?: string;
}

interface MetricData {
  name: string;
  description: string;
  icon: any;
  unit: string;
  before: {
    value: number;
    score: "poor" | "needs-improvement" | "good";
  };
  after: {
    value: number;
    score: "poor" | "needs-improvement" | "good";
  };
  improvement: number;
}

const CoreWebVitalsComparison = ({ "data-theme": dataTheme }: CoreWebVitalsComparisonProps) => {
  const metrics: MetricData[] = [
    {
      name: "Page Load Time",
      description: "Total time from request to fully loaded page",
      icon: Zap,
      unit: "s",
      before: { value: 8.4, score: "poor" },
      after: { value: 2.1, score: "good" },
      improvement: 75
    },
    {
      name: "Largest Contentful Paint",
      description: "Time until the largest content element is rendered",
      icon: Eye,
      unit: "s",
      before: { value: 4.2, score: "poor" },
      after: { value: 1.8, score: "good" },
      improvement: 57
    },
    {
      name: "First Input Delay",
      description: "Time from user interaction to browser response",
      icon: Clock,
      unit: "ms",
      before: { value: 180, score: "poor" },
      after: { value: 45, score: "good" },
      improvement: 75
    },
    {
      name: "Cumulative Layout Shift",
      description: "Visual stability during page load",
      icon: Gauge,
      unit: "",
      before: { value: 0.25, score: "poor" },
      after: { value: 0.05, score: "good" },
      improvement: 80
    }
  ];

  const getScoreColor = (score: string) => {
    switch (score) {
      case "good":
        return "text-[var(--success)]";
      case "needs-improvement":
        return "text-[var(--warning)]";
      case "poor":
        return "text-[var(--danger)]";
      default:
        return "text-muted-foreground";
    }
  };

  const getScoreGlow = (score: string) => {
    switch (score) {
      case "good":
        return "[text-shadow:var(--glow-success)]";
      case "needs-improvement":
        return "[text-shadow:var(--glow-warning)]";
      case "poor":
        return "[text-shadow:var(--glow-danger)]";
      default:
        return "";
    }
  };

  const getScoreBg = (score: string) => {
    switch (score) {
      case "good":
        return "bg-[var(--success)]/10 border-[var(--success)]/20";
      case "needs-improvement":
        return "bg-[var(--warning)]/10 border-[var(--warning)]/20";
      case "poor":
        return "bg-[var(--danger)]/10 border-[var(--danger)]/20";
      default:
        return "bg-muted/10 border-border/20";
    }
  };

  // Before content - poor performance metrics
  const beforeContent = (
    <div className="space-y-0 divide-y divide-border/20">
      {metrics.map((metric, index) => {
        const IconComponent = metric.icon;
        return (
          <div key={index} className="flex items-center justify-between p-4 first:pt-0 last:pb-0">
            <div className="flex items-center gap-3">
              <IconComponent className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-semibold text-foreground text-sm">{metric.name}</div>
                <div className="text-xs text-muted-foreground">{metric.description}</div>
              </div>
            </div>
            <div className="text-right">
              <div className={cn("text-xl font-bold", getScoreColor(metric.before.score), getScoreGlow(metric.before.score))}>
                {metric.before.value}
                <span className="text-sm font-normal ml-1">{metric.unit}</span>
              </div>
              <div className={cn("text-xs px-2 py-1 rounded-full border inline-block mt-1", getScoreBg(metric.before.score))}>
                {metric.before.score.replace('-', ' ')}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  // After content - optimized performance metrics
  const afterContent = (
    <div className="space-y-0 divide-y divide-border/20">
      {metrics.map((metric, index) => {
        const IconComponent = metric.icon;
        return (
          <div key={index} className="flex items-center justify-between p-4 first:pt-0 last:pb-0">
            <div className="flex items-center gap-3">
              <IconComponent className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-semibold text-foreground text-sm">{metric.name}</div>
                <div className="text-xs text-muted-foreground">{metric.description}</div>
              </div>
            </div>
            <div className="text-right">
              <div className={cn("text-xl font-bold", getScoreColor(metric.after.score), getScoreGlow(metric.after.score))}>
                {metric.after.value}
                <span className="text-sm font-normal ml-1">{metric.unit}</span>
              </div>
              <div className={cn("text-xs px-2 py-1 rounded-full border inline-block mt-1", getScoreBg(metric.after.score))}>
                {metric.after.score.replace('-', ' ')}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <section className="py-32 bg-background text-foreground" data-theme={dataTheme}>
      <div className="container max-w-7xl mx-auto px-6">
        {/* Main Before/After Cards */}
        <BeforeAfterCards
          title="Core Web Vitals Performance Boost"
          subtitle="Experience the dramatic improvement in Core Web Vitals scores after implementing our performance optimizations. Real metrics, real results."
          beforeTitle="Before Optimization"
          afterTitle="After Optimization"
          beforeIcon={
            <div className="relative">
              <AlertTriangle className="h-6 w-6 text-[var(--danger)] [filter:drop-shadow(var(--glow-danger))]" />
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--danger)] to-[var(--danger)]/60 rounded-full blur-sm opacity-30 -z-10" />
            </div>
          }
          afterIcon={
            <div className="relative">
              <CheckCircle className="h-6 w-6 text-[var(--success)] [filter:drop-shadow(var(--glow-success))]" />
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--success)] to-[var(--success)]/60 rounded-full blur-sm opacity-30 -z-10" />
            </div>
          }
          beforeAccent="red"
          afterAccent="green"
          beforeContent={beforeContent}
          afterContent={afterContent}
          className="mb-16"
          data-theme={dataTheme}
        />

        {/* Improvement Summary */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-green-500/10 border border-green-500/20 backdrop-blur-sm mb-6">
            <TrendingUp className="h-5 w-5 text-green-500" />
            <span className="font-semibold text-green-500">Average 71% Performance Improvement</span>
          </div>
          <p className="text-lg text-muted-foreground">
            Transforming user experience through optimized Core Web Vitals
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export { CoreWebVitalsComparison };