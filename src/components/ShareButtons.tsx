import { Facebook, Linkedin, Twitter } from "lucide-react";
import { useState, useEffect } from "react";

interface ShareButtonsProps {
  title: string;
}

const ShareButtons = ({ title }: ShareButtonsProps) => {
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  if (!currentUrl) return null;

  return (
    <div className="mt-4 flex gap-2">
      <a
        href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(currentUrl)}`}
        className="inline-flex rounded-full border bg-background/50 p-2 transition-colors hover:bg-muted"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Twitter className="h-4 w-4" />
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
        className="inline-flex rounded-full border bg-background/50 p-2 transition-colors hover:bg-muted"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Facebook className="h-4 w-4" />
      </a>
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`}
        className="inline-flex rounded-full border bg-background/50 p-2 transition-colors hover:bg-muted"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Linkedin className="h-4 w-4" />
      </a>
    </div>
  );
};

export { ShareButtons };