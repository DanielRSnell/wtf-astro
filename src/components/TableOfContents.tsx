import { useState, useEffect, useRef } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface TOCItem {
  id: string;
  title: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
}

const TableOfContents = ({ content }: TableOfContentsProps) => {
  const [toc, setToc] = useState<TOCItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Inject scrollbar styles
  useEffect(() => {
    const styleId = 'toc-scrollbar-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        :root {
          --scrollbar-track: rgba(156, 163, 175, 0.1);
          --scrollbar-thumb: rgba(34, 197, 94, 0.3);
          --scrollbar-thumb-hover: rgba(34, 197, 94, 0.5);
          --scrollbar-thumb-active: rgba(34, 197, 94, 0.7);
        }
        
        [data-theme="bright-dark"] {
          --scrollbar-track: rgba(71, 85, 105, 0.1);
          --scrollbar-thumb: rgba(34, 197, 94, 0.3);
          --scrollbar-thumb-hover: rgba(34, 197, 94, 0.5);
          --scrollbar-thumb-active: rgba(34, 197, 94, 0.7);
        }
        
        .toc-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: var(--scrollbar-thumb) var(--scrollbar-track);
        }
        
        .toc-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .toc-scrollbar::-webkit-scrollbar-track {
          background: var(--scrollbar-track);
          border-radius: 3px;
        }
        
        .toc-scrollbar::-webkit-scrollbar-thumb {
          background: var(--scrollbar-thumb);
          border-radius: 3px;
          transition: background 0.2s;
        }
        
        .toc-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--scrollbar-thumb-hover);
        }
        
        .toc-scrollbar::-webkit-scrollbar-thumb:active {
          background: var(--scrollbar-thumb-active);
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  useEffect(() => {
    // Parse markdown content to extract h2 and h3 headings
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const tocItems: TOCItem[] = [];
    let match;
    
    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const title = match[2].trim();
      const id = title.toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
      
      tocItems.push({
        id,
        title,
        level
      });
    }
    
    setToc(tocItems);
    
    // Add IDs to actual DOM headings after content is rendered
    setTimeout(() => {
      const headings = document.querySelectorAll(".prose h2, .prose h3");
      headings.forEach((heading, index) => {
        if (!heading.id && index < tocItems.length) {
          heading.id = tocItems[index].id;
        }
      });
    }, 100);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-100px 0px -66%",
        threshold: 0
      }
    );

    toc.forEach((item) => {
      const element = document.getElementById(item.id);
      if (element) {
        observer.observe(element);
      }
    });

    return () => observer.disconnect();
  }, [toc]);

  useEffect(() => {
    // Track scroll progress
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (scrolled / maxHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (toc.length === 0) return null;

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Check if content would overflow
  const hasOverflow = toc.length > 8;

  return (
    <div className="rounded-2xl bg-card/60 backdrop-blur-xl border border-border/20 overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3 border-b border-border/10 flex items-center justify-between">
        <h3 className="text-sm font-medium text-foreground">On this page</h3>
        {hasOverflow && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-muted-foreground hover:text-foreground transition-colors p-1"
            aria-label={isCollapsed ? "Expand" : "Collapse"}
          >
            <ChevronDown 
              className={`h-4 w-4 transition-transform duration-200 ${
                isCollapsed ? '-rotate-90' : ''
              }`} 
            />
          </button>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-border/20">
        <div 
          className="h-full bg-primary transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* TOC Content */}
      {!isCollapsed && (
        <div 
          ref={contentRef}
          className="overflow-y-auto p-4 toc-scrollbar"
          style={{ 
            maxHeight: hasOverflow ? '400px' : 'none'
          }}
        >
          <nav className="space-y-1">
            {toc.map((item) => (
              <button
                key={item.id}
                onClick={() => handleClick(item.id)}
                className={`block w-full text-left transition-all duration-200 hover:bg-muted/50 rounded-lg ${
                  item.level === 3 ? 'ml-4 text-xs py-1.5 px-3' : 'text-sm py-2 px-3'
                } ${
                  activeId === item.id
                    ? "text-primary bg-primary/10 font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="line-clamp-2">
                  {item.level === 3 && (
                    <span className="inline-block w-2 h-2 rounded-full bg-border/50 mr-2" />
                  )}
                  {item.title}
                </span>
              </button>
            ))}
          </nav>
        </div>
      )}
    </div>
  );
};

export { TableOfContents };