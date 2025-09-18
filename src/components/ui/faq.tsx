import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FAQItem {
  q: string;
  a: string;
}

interface FAQProps {
  items: FAQItem[];
  title?: string;
  className?: string;
}

const FAQ: React.FC<FAQProps> = ({ items, title = "Frequently Asked Questions", className }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={cn("py-16", className)}>
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-12 text-center text-3xl font-bold tracking-tight text-foreground">
          {title}
        </h2>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="group relative overflow-hidden rounded-xl bg-card/60 backdrop-blur-xl border border-border/20 hover:border-primary/30 transition-all duration-300"
            >
              {/* Gradient background */}
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
              </div>

              <button
                onClick={() => toggleItem(index)}
                className="relative z-10 w-full px-6 py-5 text-left transition-colors duration-200"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-lg font-semibold text-foreground pr-2">
                    {item.q}
                  </h3>
                  <ChevronDown
                    className={cn(
                      "h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform duration-300",
                      openIndex === index && "rotate-180 text-primary"
                    )}
                  />
                </div>
              </button>

              <div
                className={cn(
                  "relative z-10 grid transition-all duration-300",
                  openIndex === index ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
              >
                <div className="overflow-hidden">
                  <div className="px-6 pb-5 text-muted-foreground">
                    {item.a}
                  </div>
                </div>
              </div>

              {/* Hover border highlight */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export { FAQ };
export type { FAQItem, FAQProps };