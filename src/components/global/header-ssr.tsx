import { Menu, X, LogIn, UserPlus, User, Settings, LogOut } from "lucide-react";
import React, { useState } from "react";
import { GradientButton } from "@/components/ui/gradient-button";
import { UserAvatar } from "@/components/ui/UserAvatar";
import { AuthProvider, useAuth } from "@/components/auth/AuthProvider";
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { UserProfile } from '@/lib/supabase';

interface HeaderProps {
  "data-theme"?: string;
}

const AuthButtons = () => {
  const { user, profile, loading } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

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

  if (user && profile) {
    return (
      <div className="relative">
        <UserAvatar
          user={user}
          profile={profile}
          size="md"
          showName={true}
          showRole={true}
          clickable={true}
          onClick={() => setShowUserMenu(!showUserMenu)}
        />
        
        {showUserMenu && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-card/95 backdrop-blur-xl border border-border/50 rounded-lg shadow-xl py-2 z-50">
            <a
              href={profile.username ? `/user/${profile.username}` : `/user/${user.id}`}
              className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted/50 transition-colors"
              onClick={() => setShowUserMenu(false)}
            >
              <User className="w-4 h-4" />
              Profile
            </a>
            <a
              href="/settings"
              className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted/50 transition-colors"
              onClick={() => setShowUserMenu(false)}
            >
              <Settings className="w-4 h-4" />
              Settings
            </a>
            <hr className="my-2 border-border/50" />
            <form action="/api/auth/signout" method="POST" className="w-full">
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted/50 transition-colors w-full text-left"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </form>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <a
        href="/login"
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors"
      >
        <LogIn className="w-4 h-4" />
        Sign In
      </a>
      
      <GradientButton
        href="/register"
        size="sm"
      >
        <UserPlus className="w-4 h-4" />
        Sign Up
      </GradientButton>
    </div>
  );
};

const HeaderContent = ({ "data-theme": dataTheme }: HeaderProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const { loading } = useAuth();

  // Trigger animation when auth loading completes
  React.useEffect(() => {
    if (!loading && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [loading, hasAnimated]);

  return (
    <header 
      className="fixed top-0 left-0 right-0 z-[9999]" 
      data-theme={dataTheme}
      style={{ 
        animation: hasAnimated ? 'slide-down 0.6s ease-out forwards' : 'none',
        transform: hasAnimated ? 'translateY(0)' : 'translateY(-100%)',
        opacity: hasAnimated ? 1 : 0
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
            
            {/* Auth Buttons */}
            <AuthButtons />
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
  const [shouldLoadAuth, setShouldLoadAuth] = useState(false);

  React.useEffect(() => {
    const handleFirstInteraction = () => {
      setShouldLoadAuth(true);
      // Remove listeners after first interaction
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

  if (!shouldLoadAuth) {
    // Show static header without auth until first interaction
    return (
      <header 
        className="fixed top-0 left-0 right-0 z-[9999]" 
        data-theme={dataTheme}
        style={{ 
          transform: 'translateY(-100%)',
          opacity: 0
        }}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-muted/50 to-background/85 backdrop-blur-2xl border-b border-border/60 shadow-2xl shadow-background/20" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-muted/10 to-transparent" />
        </div>
      </header>
    );
  }

  return (
    <AuthProvider>
      <HeaderContent data-theme={dataTheme} />
    </AuthProvider>
  );
};

export { Header };