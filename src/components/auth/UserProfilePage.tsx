import React from 'react';
import { useAuth } from './AuthProvider';
import { User, Activity, Settings, ArrowLeft, Shield } from 'lucide-react';

interface UserProfilePageProps {
  userId: string;
}

export const UserProfilePage: React.FC<UserProfilePageProps> = ({ userId }) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16" data-theme="bright-dark">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-card/30 rounded-lg w-1/3"></div>
              <div className="h-4 bg-card/20 rounded w-1/2"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="h-32 bg-card/30 rounded-2xl"></div>
                <div className="h-32 bg-card/30 rounded-2xl"></div>
                <div className="h-32 bg-card/30 rounded-2xl"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen pt-24 pb-16" data-theme="bright-dark">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-8">You need to be signed in to view profiles.</p>
            <a 
              href="/auth" 
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Check if this is the current user's own profile
  const isOwnProfile = user.id === userId;

  // For now, we'll only show the user's own profile since we don't have other user data
  if (!isOwnProfile) {
    return (
      <div className="min-h-screen pt-24 pb-16" data-theme="bright-dark">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Profile Not Found</h1>
            <p className="text-muted-foreground mb-8">This profile is not available or you don't have permission to view it.</p>
            <a 
              href={`/user/${user.id}`}
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Go to Your Profile
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Get user display info
  const displayName = profile?.full_name || user.email?.split('@')[0] || 'User';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen pt-24 pb-16" data-theme="bright-dark">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Back Navigation */}
          <div className="mb-6">
            <a 
              href="/" 
              className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </a>
          </div>

          {/* Profile Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">
                  {isOwnProfile ? 'Your Profile' : `${displayName}'s Profile`}
                </h1>
                <p className="text-muted-foreground">
                  {isOwnProfile ? 'Manage your account and view your activity' : 'User profile and activity'}
                </p>
              </div>
              {isOwnProfile && (
                <a 
                  href={`/user/${user.id}/settings`}
                  className="inline-flex items-center space-x-2 bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  <span>Settings</span>
                </a>
              )}
            </div>
          </div>

          {/* Profile Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Profile Status */}
            <div className="group relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-xl border border-border/20 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10">
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
                <div className="absolute inset-0 bg-gradient-to-t from-card/40 via-transparent to-transparent" />
              </div>
              <div className="relative z-10 p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Profile Status</h3>
                </div>
                <p className="text-2xl font-bold text-primary mb-2">Active</p>
                <p className="text-sm text-muted-foreground">Account is verified and active</p>
              </div>
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Account Role */}
            <div className="group relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-xl border border-border/20 hover:border-secondary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-secondary/10">
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5" />
                <div className="absolute inset-0 bg-gradient-to-t from-card/40 via-transparent to-transparent" />
              </div>
              <div className="relative z-10 p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 rounded-lg bg-secondary/10">
                    <Shield className="w-5 h-5 text-secondary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Account Role</h3>
                </div>
                <p className="text-2xl font-bold text-secondary mb-2 capitalize">{profile?.role || 'subscriber'}</p>
                <p className="text-sm text-muted-foreground">Current access level</p>
              </div>
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Recent Activity */}
            <div className="group relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-xl border border-border/20 hover:border-accent/30 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/10">
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5" />
                <div className="absolute inset-0 bg-gradient-to-t from-card/40 via-transparent to-transparent" />
              </div>
              <div className="relative z-10 p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Activity className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
                </div>
                <p className="text-2xl font-bold text-accent mb-2">0</p>
                <p className="text-sm text-muted-foreground">No recent activity</p>
              </div>
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Panel */}
            <div className="lg:col-span-2">
              <div className="group relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-xl border border-border/20">
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
                </div>
                <div className="relative z-10 p-8">
                  <h2 className="text-2xl font-bold text-foreground mb-4">
                    {isOwnProfile ? 'Welcome to Your Profile' : `About ${displayName}`}
                  </h2>
                  <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <p className="text-muted-foreground mb-4">
                      {isOwnProfile 
                        ? 'This is your personal profile where you can view your account information and activity.'
                        : 'This user profile shows public information and activity.'
                      }
                    </p>
                    <p className="text-muted-foreground">
                      {isOwnProfile 
                        ? 'Use the settings button to manage your account preferences.'
                        : 'Contact the user directly for more information.'
                      }
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Summary */}
              <div className="group relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-xl border border-border/20">
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5" />
                </div>
                <div className="relative z-10 p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Profile Info</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold">{initials}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{displayName}</p>
                        <p className="text-sm text-muted-foreground capitalize">{profile?.role || 'subscriber'}</p>
                      </div>
                    </div>
                    <div className="pt-3 border-t border-border/20 space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Email:</span>
                        <span className="text-foreground">{isOwnProfile ? user.email : 'Private'}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Member since:</span>
                        <span className="text-foreground">
                          {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Recently'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links - Only show for own profile */}
              {isOwnProfile && (
                <div className="group relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-xl border border-border/20">
                  <div className="absolute inset-0">
                    <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-secondary/5" />
                  </div>
                  <div className="relative z-10 p-6">
                    <h3 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h3>
                    <div className="space-y-2">
                      <a href={`/user/${user.id}/settings`} className="block p-2 rounded-lg text-sm text-foreground hover:bg-primary/10 transition-colors">
                        Account Settings
                      </a>
                      <a href="/" className="flex items-center space-x-2 p-2 rounded-lg text-sm text-foreground hover:bg-primary/10 transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Home</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};