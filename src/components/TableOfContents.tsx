import { useState, useEffect } from "react";

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

  useEffect(() => {
    // Parse markdown content to extract h2 headings only
    const headingRegex = /^(#{2})\s+(.+)$/gm;
    const tocItems: TOCItem[] = [];
    let match;
    let headingIndex = 0;
    
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
      
      headingIndex++;
    }
    
    setToc(tocItems);
    
    // Add IDs to actual DOM headings after content is rendered
    setTimeout(() => {
      const headings = document.querySelectorAll(".prose h2");
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

  if (toc.length === 0) return null;

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="rounded-2xl bg-card/60 backdrop-blur-xl border border-border/20 p-6">
      <h3 className="text-sm font-medium text-foreground mb-6">On this page</h3>
      <nav className="prose prose-sm dark:prose-invert max-w-none">
        <ul className="space-y-3 list-none pl-0 m-0">
          {toc.map((item) => (
            <li key={item.id} className="m-0">
              <button
                onClick={() => handleClick(item.id)}
                className={`block w-full text-left py-2 px-3 rounded-lg transition-all duration-200 hover:bg-muted/50 ${
                  activeId === item.id
                    ? "text-primary bg-primary/10 font-medium"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {item.title}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export { TableOfContents };