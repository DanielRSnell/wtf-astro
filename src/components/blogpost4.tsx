import { Clock, Home } from "lucide-react";
import type { ReactNode } from "react";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface Blogpost4Props {
  "data-theme"?: string;
  title: string;
  description: string;
  author: string;
  date: string;
  category: string;
  tags: string[];
  readTime: number;
  image?: {
    src: string;
    alt: string;
  };
  breadcrumbItems?: BreadcrumbItem[];
  children: ReactNode;
  sidebar?: ReactNode;
}

const Blogpost4 = ({ 
  "data-theme": dataTheme, 
  title, 
  description, 
  author, 
  date, 
  category,
  tags,
  readTime,
  image,
  breadcrumbItems = [],
  children,
  sidebar 
}: Blogpost4Props) => {
  return (
    <section className="bg-background py-32 text-foreground" data-theme={dataTheme}>
      <div className="container">
        {breadcrumbItems.length > 0 && (
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbItems.map((item, index) => (
                <div key={index} className="flex items-center">
                  {index > 0 && <BreadcrumbSeparator />}
                  <BreadcrumbItem>
                    {index === 0 ? (
                      <BreadcrumbLink href={item.href}>
                        <Home className="h-4 w-4" />
                      </BreadcrumbLink>
                    ) : index === breadcrumbItems.length - 1 ? (
                      <BreadcrumbPage>{item.label}</BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </div>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        )}
        
        {/* Featured image if available */}
        {image && (
          <div className="relative mt-8 mb-8 h-64 md:h-96 overflow-hidden rounded-2xl">
            <img 
              src={image.src} 
              alt={image.alt}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent" />
          </div>
        )}
        
        <h1 className="mb-6 mt-7 max-w-4xl text-3xl font-semibold md:text-5xl leading-tight">
          {title}
        </h1>
        
        {description && (
          <p className="mb-8 max-w-3xl text-lg text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
        
        <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border">
              <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${author}`} />
            </Avatar>
            <span>
              <span className="font-medium">{author}</span>
              <span className="text-muted-foreground ml-1">on {date}</span>
            </span>
          </div>

          <span className="text-muted-foreground flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {readTime} min. read
          </span>
          
          <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 backdrop-blur-sm border border-primary/20">
            <div className="h-2 w-2 rounded-full bg-primary" />
          </div>
          <span className="text-xs font-medium text-primary uppercase tracking-widest">
            {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
          </span>
        </div>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {tags.map((tag) => (
              <span key={tag} className="inline-flex items-center rounded-full bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
                #{tag}
              </span>
            ))}
          </div>
        )}
        <Separator className="mb-16 mt-8" />
        <div className="relative grid grid-cols-12 gap-6 lg:grid">
          <div className="col-span-12 lg:col-span-8">
            <div className="prose prose-lg dark:prose-invert max-w-none">
              {children}
            </div>
          </div>
          <div className="sticky top-8 col-span-3 col-start-10 hidden h-fit lg:block">
            {sidebar}
          </div>
        </div>
      </div>
    </section>
  );
};

export { Blogpost4 };
