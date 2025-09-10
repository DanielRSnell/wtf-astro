import React from 'react';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  user: {
    email: string;
  };
  profile: {
    full_name?: string;
    username?: string;
    email: string;
    role?: string;
    avatar_url?: string;
  };
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  showRole?: boolean;
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
}

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

export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  profile,
  size = 'md',
  showName = true,
  showRole = true,
  clickable = false,
  onClick,
  className
}) => {
  const sizeClasses = {
    sm: {
      avatar: 'w-8 h-8',
      text: 'text-xs',
      container: 'p-2',
      name: 'text-sm',
      role: 'text-xs'
    },
    md: {
      avatar: 'w-10 h-10',
      text: 'text-sm',
      container: 'p-3',
      name: 'text-sm',
      role: 'text-xs'
    },
    lg: {
      avatar: 'w-12 h-12',
      text: 'text-base',
      container: 'p-4',
      name: 'text-base',
      role: 'text-sm'
    }
  };

  const Component = clickable ? 'button' : 'div';

  return (
    <Component
      onClick={clickable ? onClick : undefined}
      className={cn(
        "group relative overflow-hidden rounded-xl bg-card/40 backdrop-blur-sm border border-border/30 hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10",
        clickable && "hover:scale-[1.02] cursor-pointer",
        sizeClasses[size].container,
        className
      )}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative flex items-center gap-3">
        <div className="relative">
          <div className={cn(
            "rounded-full bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 border-2 border-primary/40 flex items-center justify-center text-primary font-bold shadow-lg group-hover:shadow-primary/20 transition-all duration-300",
            sizeClasses[size].avatar,
            sizeClasses[size].text
          )}>
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
          {/* Glow ring on hover */}
          <div className="absolute inset-0 rounded-full border-2 border-primary/0 group-hover:border-primary/30 transition-colors duration-300"></div>
        </div>
        
        {(showName || showRole) && (
          <div className="hidden md:block text-left">
            {showName && (
              <div className={cn(
                "font-semibold text-foreground group-hover:text-primary transition-colors duration-300",
                sizeClasses[size].name
              )}>
                {profile.full_name || profile.username || profile.email.split('@')[0]}
              </div>
            )}
            {showRole && (
              <div className={cn(
                "text-muted-foreground/80 capitalize",
                sizeClasses[size].role
              )}>
                {profile.role || 'member'}
              </div>
            )}
          </div>
        )}
      </div>
    </Component>
  );
};