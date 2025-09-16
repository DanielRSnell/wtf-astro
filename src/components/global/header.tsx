import { Menu, X, ChevronDown, LogIn, UserPlus, Zap, Code, Package, BookOpen, FileText, Shield, Search, Gauge, Server, Palette, Plug, Bot, Lock } from "lucide-react";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ShimmerButton } from "@/components/magicui/shimmer-button";
import { AuthProvider, useAuth } from "@/components/auth/AuthProvider";
import { UserMenu } from "@/components/auth/UserMenu";
import { AuthModal } from "@/components/auth/AuthModal";
import { MegaMenu, type MegaMenuSection } from "@/components/ui/mega-menu";

interface HeaderProps {
  "data-theme"?: string;
}

const AuthButtons = () => {
  const { user, profile, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');

  const handleSignIn = () => {
    setAuthMode('signin');
    setShowAuthModal(true);
  };

  const handleSignUp = () => {
    setAuthMode('signup');
    setShowAuthModal(true);
  };

  // Show loading state while auth is being checked
  if (loading) {
    return (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-muted/30 animate-pulse"></div>
        <div className="hidden md:block">
          <div className="w-20 h-4 bg-muted/30 rounded animate-pulse mb-1"></div>
          <div className="w-16 h-3 bg-muted/30 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  if (user) {
    return <UserMenu />;
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <button
          onClick={handleSignIn}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors"
        >
          <LogIn className="w-4 h-4" />
          Sign In
        </button>
        
        <ShimmerButton
          onClick={handleSignUp}
          variant="secondary"
          className="shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 py-1.5 px-4 flex items-center gap-2"
          shimmerSize="0.08em"
          shimmerDuration="2.5s"
        >
          <UserPlus className="w-4 h-4" />
          Sign Up
        </ShimmerButton>
      </div>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </>
  );
};

const HeaderContent = ({ "data-theme": dataTheme }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const { loading } = useAuth();

  // Set up interaction detection
  useEffect(() => {
    const handleFirstInteraction = () => {
      setHasInteracted(true);
      document.removeEventListener('mousemove', handleFirstInteraction);
      document.removeEventListener('scroll', handleFirstInteraction);
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };

    document.addEventListener('mousemove', handleFirstInteraction);
    document.addEventListener('scroll', handleFirstInteraction);
    document.addEventListener('click', handleFirstInteraction);
    document.addEventListener('keydown', handleFirstInteraction);
    document.addEventListener('touchstart', handleFirstInteraction);

    return () => {
      document.removeEventListener('mousemove', handleFirstInteraction);
      document.removeEventListener('scroll', handleFirstInteraction);
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
    };
  }, []);

  // Trigger animation when auth loading completes AND user has interacted
  useEffect(() => {
    if (hasInteracted && !loading && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [hasInteracted, loading, hasAnimated]);

  // Services mega menu data
  const servicesSections: MegaMenuSection[] = [
    {
      title: "Core Services",
      items: [
        {
          title: "Speed Optimization",
          href: "/services/speed-optimization",
          description: "Sub-second load times for WooCommerce",
          icon: <Zap className="h-4 w-4" />,
          badge: "Popular"
        },
        {
          title: "Custom Development",
          href: "/services/custom-development",
          description: "Bespoke WooCommerce solutions",
          icon: <Code className="h-4 w-4" />
        },
        {
          title: "Performance Audit",
          href: "/services/speed-optimization#packages",
          description: "Comprehensive site analysis",
          icon: <Gauge className="h-4 w-4" />
        }
      ]
    },
    {
      title: "Packages",
      items: [
        {
          title: "Consultation Package",
          href: "/services/speed-optimization#packages",
          description: "$297 - Expert speed strategy",
          icon: <Package className="h-4 w-4" />
        },
        {
          title: "Quick Package",
          href: "/services/speed-optimization#packages",
          description: "$497 - Essential optimizations",
          icon: <Package className="h-4 w-4" />
        },
        {
          title: "Full Package",
          href: "/services/speed-optimization#packages",
          description: "$997 - Complete transformation",
          icon: <Package className="h-4 w-4" />,
          badge: "Best Value"
        }
      ]
    }
  ];

  // WordPress Resources mega menu data  
  const wpResourcesSections: MegaMenuSection[] = [
    {
      title: "WordPress Guides",
      items: [
        {
          title: "WordPress Themes",
          href: "/wordpress-themes",
          description: "Theme reviews and comparisons",
          icon: <Palette className="h-4 w-4" />
        },
        {
          title: "WordPress SEO",
          href: "/wordpress-seo",
          description: "SEO optimization guides",
          icon: <Search className="h-4 w-4" />,
          badge: "Updated"
        },
        {
          title: "WordPress Security",
          href: "/wordpress-security",
          description: "Security best practices",
          icon: <Shield className="h-4 w-4" />
        },
        {
          title: "WordPress Performance",
          href: "/wordpress-performance",
          description: "Speed optimization tips",
          icon: <Gauge className="h-4 w-4" />
        }
      ]
    },
    {
      title: "WordPress Tools",
      items: [
        {
          title: "WordPress Hosting",
          href: "/wordpress-hosting",
          description: "Hosting reviews and guides",
          icon: <Server className="h-4 w-4" />,
          badge: "2024"
        },
        {
          title: "WordPress Forms",
          href: "/wordpress-forms",
          description: "Form plugin comparisons",
          icon: <FileText className="h-4 w-4" />
        },
        {
          title: "WordPress Admin",
          href: "/wordpress-admin",
          description: "Admin customization guides",
          icon: <Lock className="h-4 w-4" />
        },
        {
          title: "WordPress Automation",
          href: "/wordpress-automation",
          description: "Workflow automation tools",
          icon: <Bot className="h-4 w-4" />
        }
      ]
    },
  ];

  // WooCommerce Resources mega menu data
  const wooResourcesSections: MegaMenuSection[] = [
    {
      title: "WooCommerce Essentials",
      items: [
        {
          title: "WooCommerce Themes",
          href: "/woocommerce-themes",
          description: "Premium eCommerce themes",
          icon: <Palette className="h-4 w-4" />,
          badge: "Top Picks"
        },
        {
          title: "WooCommerce Plugins",
          href: "/woocommerce-plugins",
          description: "Essential plugin reviews",
          icon: <Plug className="h-4 w-4" />
        },
        {
          title: "WooCommerce Hosting",
          href: "/woocommerce-hosting",
          description: "Performance hosting solutions",
          icon: <Server className="h-4 w-4" />,
          badge: "Fast"
        }
      ]
    },
    {
      title: "Speed & Performance",
      items: [
        {
          title: "Speed Optimization Guide",
          href: "/services/speed-optimization",
          description: "Make WooCommerce lightning fast",
          icon: <Zap className="h-4 w-4" />
        },
        {
          title: "Performance Tips",
          href: "/blog",
          description: "Latest optimization techniques",
          icon: <Gauge className="h-4 w-4" />
        }
      ]
    }
  ];

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-[9999]" 
      data-theme={dataTheme}
      style={{ 
        transform: hasAnimated ? 'translateY(0)' : 'translateY(-100%)',
        opacity: hasAnimated ? 1 : 0,
        transition: hasInteracted ? 'transform 0.6s ease-out, opacity 0.6s ease-out' : 'none'
      }}
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

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-x-6">
            {/* Main Navigation */}
            <nav className="flex items-center gap-x-6">
              <MegaMenu 
                trigger="Services"
                sections={servicesSections}
                featured={{
                  title: "Free Speed Audit",
                  description: "Get a detailed performance report and optimization roadmap for your WooCommerce store.",
                  href: "/contact"
                }}
              />
              
              <MegaMenu 
                trigger="Resources"
                sections={[...wpResourcesSections, ...wooResourcesSections]}
              />
              
              <a 
                href="/compare" 
                className="text-sm font-semibold text-foreground hover:text-primary transition-colors duration-300"
              >
                Compare
              </a>
              
              <a 
                href="/blog" 
                className="text-sm font-semibold text-foreground hover:text-primary transition-colors duration-300"
              >
                Blog
              </a>
              
              <a 
                href="/contact" 
                className="text-sm font-semibold text-foreground hover:text-primary transition-colors duration-300"
              >
                Contact
              </a>
            </nav>
            
            {/* Divider */}
            <div className="h-6 w-px bg-border/50"></div>
            
            {/* Auth Section */}
            <AuthButtons />
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden">
            <div className="absolute inset-x-0 top-full bg-gradient-to-b from-background/95 via-muted/60 to-background/95 backdrop-blur-xl border-b border-border/50 shadow-2xl max-h-[85vh] overflow-y-auto">
              <div className="space-y-2 px-6 py-6">
                {/* Services Section */}
                <div className="pb-2">
                  <h3 className="px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider">Services</h3>
                  <a 
                    href="/services/speed-optimization" 
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/50 hover:text-primary transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Speed Optimization
                  </a>
                  <a 
                    href="/services/custom-development" 
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/50 hover:text-primary transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Custom Development
                  </a>
                </div>
                
                {/* WordPress Resources Section */}
                <div className="pb-2 border-t border-border/40 pt-2">
                  <h3 className="px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider">WordPress Resources</h3>
                  <a 
                    href="/wordpress-themes" 
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/50 hover:text-primary transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    WordPress Themes
                  </a>
                  <a 
                    href="/wordpress-seo" 
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/50 hover:text-primary transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    WordPress SEO
                  </a>
                  <a 
                    href="/wordpress-hosting" 
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/50 hover:text-primary transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    WordPress Hosting
                  </a>
                </div>
                
                {/* WooCommerce Resources Section */}
                <div className="pb-2 border-t border-border/40 pt-2">
                  <h3 className="px-3 py-1 text-xs font-semibold text-primary uppercase tracking-wider">WooCommerce Resources</h3>
                  <a 
                    href="/woocommerce-themes" 
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/50 hover:text-primary transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    WooCommerce Themes
                  </a>
                  <a 
                    href="/woocommerce-plugins" 
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/50 hover:text-primary transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    WooCommerce Plugins
                  </a>
                  <a 
                    href="/woocommerce-hosting" 
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-muted/50 hover:text-primary transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    WooCommerce Hosting
                  </a>
                </div>
                
                {/* Other Links */}
                <div className="border-t border-border/40 pt-2">
                  <a 
                    href="/compare" 
                    className="block rounded-lg px-3 py-2 text-base font-semibold text-foreground hover:bg-muted/50 hover:text-primary transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Compare
                  </a>
                  <a 
                    href="/blog" 
                    className="block rounded-lg px-3 py-2 text-base font-semibold text-foreground hover:bg-muted/50 hover:text-primary transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Blog
                  </a>
                  <a 
                    href="/contact" 
                    className="block rounded-lg px-3 py-2 text-base font-semibold text-foreground hover:bg-muted/50 hover:text-primary transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Contact
                  </a>
                </div>
                
                {/* Mobile Auth */}
                <div className="pt-4 border-t border-border/40">
                  <div onClick={() => setIsMobileMenuOpen(false)}>
                    <AuthButtons />
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

const Header = ({ "data-theme": dataTheme }: HeaderProps) => {
  return (
    <AuthProvider>
      <HeaderContent data-theme={dataTheme} />
    </AuthProvider>
  );
};

export { Header };