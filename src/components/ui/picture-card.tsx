import { cn } from "@/lib/utils";

interface PictureCardProps {
  name: string;
  role: string;
  imageSrc: string;
  className?: string;
}

const PictureCard = ({ name, role, imageSrc, className }: PictureCardProps) => {
  return (
    <div className={cn(
      role 
        ? "inline-flex items-center gap-3 rounded-full bg-card/60 backdrop-blur-xl border border-border/20 pl-2 pr-4 py-2"
        : "inline-flex items-center rounded-full p-1 bg-card/60 backdrop-blur-xl border border-border/20",
      "shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]",
      className
    )}>
      <div className="relative">
        <img 
          src={imageSrc} 
          alt={name}
          className={role ? "w-8 h-8 rounded-lg object-cover border-2 border-primary/20" : "w-16 h-16 rounded-lg object-cover border-2 border-primary/20"}
        />
        <div className="absolute -inset-0.5 rounded-lg bg-gradient-to-r from-primary/20 to-secondary/20 blur opacity-60" />
      </div>
      {role && (
        <div className="text-sm">
          <span className="text-foreground font-medium">Hey, I'm {name}</span>
          <span className="text-muted-foreground">, {role}</span>
        </div>
      )}
    </div>
  );
};

export { PictureCard };