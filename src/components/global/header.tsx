import { Menu, X, ChevronDown } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ShimmerButton } from "@/components/magicui/shimmer-button";

interface HeaderProps {
  "data-theme"?: string;
}

const Header = ({ "data-theme": dataTheme }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-[9999]" 
      data-theme={dataTheme}
    >
      {/* Glassmorphism Header */}
      <div className="relative">
        {/* Background with enhanced glassmorphism */}
        <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-muted/50 to-background/85 backdrop-blur-2xl border-b border-border/60 shadow-2xl shadow-background/20" />
        {/* Subtle overlay for extra depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/10 to-transparent" />
        
        <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
          {/* Logo */}
          <div className="flex lg:flex-1">
            <a href="/" className="-m-1.5 p-1.5 transition-transform duration-200 hover:scale-105">
              <span className="sr-only">WooThatsFast</span>
              <div className="relative">
                <h1 className="text-xl font-bold bg-gradient-to-r from-muted-foreground via-foreground to-muted-foreground/70 bg-clip-text text-transparent drop-shadow-lg">
                  WooThatsFast
                </h1>
                {/* Glow effect */}
                <div className="absolute inset-0 text-xl font-bold bg-gradient-to-r from-muted-foreground via-foreground to-muted-foreground/70 bg-clip-text text-transparent blur-sm opacity-30 -z-10">
                  WooThatsFast
                </div>
              </div>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden">
            <button 
              type="button" 
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-foreground hover:text-primary transition-colors duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Desktop Navigation and CTA grouped together */}
          <div className="hidden lg:flex lg:items-center lg:gap-x-8">
            <a 
              href="/blog" 
              className="text-sm font-semibold text-foreground hover:text-primary transition-colors duration-300"
            >
              Blog
            </a>
            <a 
              href="#features" 
              className="text-sm font-semibold text-foreground hover:text-primary transition-colors duration-300"
            >
              Features
            </a>
            <a 
              href="#about" 
              className="text-sm font-semibold text-foreground hover:text-primary transition-colors duration-300"
            >
              About
            </a>
            <a 
              href="#contact" 
              className="text-sm font-semibold text-foreground hover:text-primary transition-colors duration-300"
            >
              Contact
            </a>
            
            {/* CTA Button */}
            <ShimmerButton
              variant="secondary"
              className="shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 py-1.5 px-6"
              shimmerSize="0.08em"
              shimmerDuration="2.5s"
            >
              Get Started →
            </ShimmerButton>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className="absolute inset-x-0 top-full bg-gradient-to-b from-background/95 via-muted/60 to-background/95 backdrop-blur-xl border-b border-border/50 shadow-2xl">
              <div className="space-y-2 px-6 py-6">
                <a 
                  href="/blog" 
                  className="block rounded-lg px-3 py-2 text-base font-semibold text-foreground hover:bg-muted/50 hover:text-primary transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Blog
                </a>
                <a 
                  href="#features" 
                  className="block rounded-lg px-3 py-2 text-base font-semibold text-foreground hover:bg-muted/50 hover:text-primary transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Features
                </a>
                <a 
                  href="#about" 
                  className="block rounded-lg px-3 py-2 text-base font-semibold text-foreground hover:bg-muted/50 hover:text-primary transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  About
                </a>
                <a 
                  href="#contact" 
                  className="block rounded-lg px-3 py-2 text-base font-semibold text-foreground hover:bg-muted/50 hover:text-primary transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact
                </a>
                
                {/* Mobile CTA */}
                <div className="pt-4 border-t border-border/40">
                  <div onClick={() => setIsMobileMenuOpen(false)}>
                    <ShimmerButton
                      variant="secondary"
                      className="w-full shadow-xl hover:shadow-2xl py-2.5"
                      shimmerSize="0.08em"
                      shimmerDuration="2.5s"
                    >
                      Get Started →
                    </ShimmerButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export { Header };