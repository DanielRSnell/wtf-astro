import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { User, Settings, LogOut, Shield, Crown, Edit, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserAvatar } from '@/components/ui/UserAvatar';

export const UserMenu: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  if (!user || !profile) return null;

  // Get user initials from full name or email
  const getInitials = (fullName?: string, email?: string) => {
    if (fullName && fullName.trim()) {
      const names = fullName.trim().split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    
    if (email) {
      return email[0].toUpperCase();
    }
    
    return 'U';
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="w-4 h-4 text-yellow-500" />;
      case 'editor':
        return <Edit className="w-4 h-4 text-blue-500" />;
      case 'author':
        return <FileText className="w-4 h-4 text-green-500" />;
      default:
        return <Shield className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      case 'editor':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'author':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      <UserAvatar
        user={user}
        profile={profile}
        size="md"
        showName={true}
        showRole={true}
        clickable={true}
        onClick={() => setIsOpen(!isOpen)}
      />

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-card/90 backdrop-blur-xl border border-border/20 shadow-xl z-50">
            {/* User Info */}
            <div className="p-4 border-b border-border/20">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 border border-primary/30 flex items-center justify-center text-primary font-bold text-lg shadow-glow-primary/50">
                  {profile.avatar_url ? (
                    <img 
                      src={profile.avatar_url} 
                      alt={profile.full_name || profile.email}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    getInitials(profile.full_name, profile.email)
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-foreground truncate">
                    {profile.full_name || 'Unknown User'}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {profile.email}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className={cn(
                  "inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border",
                  getRoleBadgeColor(profile.role)
                )}>
                  {getRoleIcon(profile.role)}
                  <span className="capitalize">{profile.role}</span>
                </div>
                
                {profile.role === 'admin' && (
                  <div className="text-xs text-yellow-500 font-medium">
                    Full Access
                  </div>
                )}
              </div>
            </div>

            {/* Menu Items */}
            <div className="p-2">
              <a 
                href={profile.username ? `/user/${profile.username}` : `/user/${user.id}`}
                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-background/50 transition-colors text-left"
                onClick={() => setIsOpen(false)}
              >
                <User className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Profile</span>
              </a>
              
              <a 
                href="/settings"
                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-background/50 transition-colors text-left"
                onClick={() => setIsOpen(false)}
              >
                <Settings className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-foreground">Settings</span>
              </a>
              
              {(profile.role === 'admin' || profile.role === 'editor') && (
                <a 
                  href="/admin"
                  className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-background/50 transition-colors text-left"
                  onClick={() => setIsOpen(false)}
                >
                  <Shield className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">Admin Panel</span>
                </a>
              )}
              
              <hr className="my-2 border-border/20" />
              
              <button 
                onClick={handleSignOut}
                className="flex items-center gap-3 w-full p-3 rounded-lg hover:bg-destructive/10 transition-colors text-left group"
              >
                <LogOut className="w-4 h-4 text-muted-foreground group-hover:text-destructive" />
                <span className="text-sm text-foreground group-hover:text-destructive">Sign Out</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};