import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export const UserDropdown: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (!user) return null;

  const initials = (profile?.full_name || user.email || 'U')
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-card/60 transition-colors group"
      >
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-primary font-semibold text-sm">{initials}</span>
        </div>
        <ChevronDown 
          className={cn(
            "w-4 h-4 text-muted-foreground transition-transform duration-200",
            isOpen && "rotate-180"
          )} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 z-50">
          <div className="relative overflow-hidden rounded-2xl bg-card/90 backdrop-blur-xl border border-border/20 shadow-2xl">
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
            </div>
            
            <div className="relative z-10">
              {/* User Info Header */}
              <div className="p-4 border-b border-border/20">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-semibold">{initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {profile?.full_name || 'User'}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {user.email}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {profile?.role || 'subscriber'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <a
                  href="/id"
                  className="flex items-center space-x-3 px-4 py-3 text-foreground hover:bg-primary/10 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </a>
                
                <a
                  href="/settings"
                  className="flex items-center space-x-3 px-4 py-3 text-foreground hover:bg-primary/10 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </a>
                
                <div className="border-t border-border/20 my-2" />
                
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-destructive hover:bg-destructive/10 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};