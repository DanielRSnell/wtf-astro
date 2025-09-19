import React from 'react';
import { Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator
} from './breadcrumb';

export interface BreadcrumbItemData {
  name: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbWrapperProps {
  items: BreadcrumbItemData[];
  className?: string;
  showHome?: boolean;
  homeLabel?: string;
  homeHref?: string;
}

const BreadcrumbWrapper: React.FC<BreadcrumbWrapperProps> = ({ 
  items, 
  className,
  showHome = true,
  homeLabel = "Home",
  homeHref = "/"
}) => {
  const allItems = showHome 
    ? [{ name: homeLabel, href: homeHref }, ...items]
    : items;

  return (
    <div className={cn("py-4", className)}>
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-xl bg-card/30 backdrop-blur-sm border border-border/10 px-6 py-3">
          {/* Gradient overlay */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-secondary/5" />
          </div>

          <Breadcrumb className="relative z-10">
            <BreadcrumbList>
              {allItems.map((item, index) => {
                const isLast = index === allItems.length - 1;
                const isFirst = index === 0;
                
                return (
                  <React.Fragment key={index}>
                    <BreadcrumbItem>
                      {/* Home icon for first item */}
                      {isFirst && showHome && (
                        <Home className="h-4 w-4 text-muted-foreground mr-2" />
                      )}
                      
                      {/* Breadcrumb link or page */}
                      {item.href && !isLast ? (
                        <BreadcrumbLink 
                          href={item.href}
                          className="hover:text-primary transition-colors duration-200"
                        >
                          {!isFirst && item.name}
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage>
                          {!isFirst && item.name}
                        </BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    
                    {/* Separator */}
                    {!isLast && <BreadcrumbSeparator />}
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>

          {/* Hover highlight */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        </div>
      </div>
    </div>
  );
};

// Generate breadcrumb schema data
export const generateBreadcrumbSchema = (
  items: BreadcrumbItemData[], 
  baseUrl: string = '',
  showHome: boolean = true,
  homeLabel: string = 'Home',
  homeHref: string = '/'
) => {
  const allItems = showHome 
    ? [{ name: homeLabel, href: homeHref }, ...items]
    : items;

  return {
    "@type": "BreadcrumbList",
    "itemListElement": allItems.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.href ? {
        "@type": "Thing",
        "@id": `${baseUrl}${item.href}`
      } : undefined
    }))
  };
};

export { BreadcrumbWrapper };
export type { BreadcrumbItemData, BreadcrumbWrapperProps };