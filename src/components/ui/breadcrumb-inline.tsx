import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface BreadcrumbItem {
  name: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbInlineProps {
  items: BreadcrumbItem[];
  className?: string;
}

const BreadcrumbInline: React.FC<BreadcrumbInlineProps> = ({ 
  items, 
  className
}) => {
  return (
    <nav 
      aria-label="Breadcrumb"
      className={cn("inline-flex items-center text-sm", className)}
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        
        return (
          <React.Fragment key={index}>
            {item.href && !isLast ? (
              <a
                href={item.href}
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
                aria-current={item.current ? 'page' : undefined}
              >
                {item.name}
              </a>
            ) : (
              <span
                className={cn(
                  isLast ? "text-foreground" : "text-muted-foreground"
                )}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.name}
              </span>
            )}
            
            {!isLast && (
              <ChevronRight className="h-4 w-4 mx-2 flex-shrink-0 text-muted-foreground/50" />
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export { BreadcrumbInline };
export type { BreadcrumbItem as BreadcrumbInlineItem };