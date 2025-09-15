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
          "absolute left-1/2 -translate-x-1/2 top-full pt-2 transition-all duration-200",
          isOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-2"
        )}
      >
        <div className="w-screen max-w-7xl">
          <div className="group relative overflow-hidden rounded-2xl bg-card/95 backdrop-blur-xl border border-border/30 shadow-2xl">
            {/* Background gradients */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
              <div className="absolute inset-0 bg-gradient-to-t from-card/60 via-transparent to-transparent" />
            </div>

            <div className="relative z-10 grid grid-cols-12 gap-6 p-8">
              {/* Main sections */}
              <div className={cn(
                "col-span-12",
                featured ? "lg:col-span-8" : "lg:col-span-12"
              )}>
                <div className={cn(
                  "grid gap-8",
                  sections.length === 1 ? "grid-cols-1" : 
                  sections.length === 2 ? "grid-cols-1 md:grid-cols-2" :
                  "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
                )}>
                  {sections.map((section, sectionIdx) => (
                    <div key={sectionIdx}>
                      <h3 className="mb-4 text-sm font-semibold text-primary uppercase tracking-wider">
                        {section.title}
                      </h3>
                      <ul className="space-y-3">
                        {section.items.map((item, itemIdx) => (
                          <li key={itemIdx}>
                            <a
                              href={item.href}
                              className="group/item flex items-start gap-3 rounded-lg p-2 hover:bg-muted/50 transition-all duration-200"
                            >
                              {item.icon && (
                                <div className="mt-0.5 text-muted-foreground group-hover/item:text-primary transition-colors">
                                  {item.icon}
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium text-foreground group-hover/item:text-primary transition-colors">
                                    {item.title}
                                  </span>
                                  {item.badge && (
                                    <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
                                      {item.badge}
                                    </span>
                                  )}
                                </div>
                                {item.description && (
                                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                                    {item.description}
                                  </p>
                                )}
                              </div>
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Featured section */}
              {featured && (
                <div className="col-span-12 lg:col-span-4">
                  <div className="h-full rounded-xl bg-gradient-to-br from-primary/10 via-transparent to-secondary/10 p-6 border border-border/20">
                    <h3 className="mb-3 text-lg font-semibold text-foreground">
                      {featured.title}
                    </h3>
                    <p className="mb-4 text-sm text-muted-foreground">
                      {featured.description}
                    </p>
                    <a
                      href={featured.href}
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      Learn more
                      <ChevronDown className="h-4 w-4 -rotate-90" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Hover accent line */}
            <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
          </div>
        </div>
      </div>
    </div>
  );
};