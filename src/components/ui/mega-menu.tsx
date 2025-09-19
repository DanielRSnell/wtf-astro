import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MegaMenuItem {
  title: string;
  href: string;
  description?: string;
  icon?: React.ReactNode;
  badge?: string;
}

export interface MegaMenuSection {
  title: string;
  items: MegaMenuItem[];
}

export interface MegaMenuProps {
  trigger: string;
  sections: MegaMenuSection[];
  className?: string;
  featured?: {
    title: string;
    description: string;
    href: string;
    image?: string;
  };
}

export const MegaMenu = ({ trigger, sections, className, featured }: MegaMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={menuRef}
    >
      <button
        className={cn(
          "flex items-center gap-1 text-sm font-semibold text-foreground hover:text-primary transition-colors duration-300",
          isOpen && "text-primary",
          className
        )}
      >
        {trigger}
        <ChevronDown 
          className={cn(
            "h-4 w-4 transition-transform duration-200",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {/* Mega Menu Dropdown */}
      <div
        className={cn(
          "absolute left-1/2 -translate-x-1/2 top-full pt-2 transition-all duration-200 z-50",
          isOpen ? "opacity-100 visible translate-y-0 pointer-events-auto" : "opacity-0 invisible -translate-y-2 pointer-events-none"
        )}
      >
        <div className="w-[800px] max-w-[90vw]">
          <div className="group relative overflow-hidden rounded-xl bg-card/98 backdrop-blur-xl border border-border/40 shadow-2xl">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/3 via-transparent to-secondary/3" />

            <div className="relative z-10 p-3">
              {/* Simple 3-column grid without headers */}
              <div className="grid grid-cols-3 gap-0.5">
                {sections.flatMap(section => section.items).map((item, idx) => (
                  <a
                    key={idx}
                    href={item.href}
                    className="group/item flex items-center gap-2 rounded-md px-3 py-2 hover:bg-primary/10 transition-all duration-200"
                  >
                    {item.icon && (
                      <div className="text-muted-foreground group-hover/item:text-primary transition-colors flex-shrink-0">
                        {item.icon}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-medium text-foreground group-hover/item:text-primary transition-colors truncate">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 text-[10px] font-medium rounded bg-primary/15 text-primary flex-shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </div>
                    </div>
                  </a>
                ))}
              </div>

              {/* Featured section - more compact */}
              {featured && (
                <div className="mt-3 p-3 rounded-lg bg-gradient-to-r from-primary/10 via-primary/5 to-secondary/10 border border-border/20">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-semibold text-foreground mb-1">
                        {featured.title}
                      </h3>
                      <p className="text-xs text-muted-foreground">
                        {featured.description}
                      </p>
                    </div>
                    <a
                      href={featured.href}
                      className="ml-4 inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-primary/10 hover:bg-primary/20 text-primary rounded-md transition-colors"
                    >
                      View
                      <ChevronDown className="h-3 w-3 -rotate-90" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Top accent line */}
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
};