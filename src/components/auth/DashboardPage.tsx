import React from 'react';
import { useAuth } from './AuthProvider';
import { User, Activity, Settings, ArrowLeft } from 'lucide-react';

export const DashboardPage: React.FC = () => {
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
            <p className="text-muted-foreground mb-8">You need to be signed in to access your dashboard.</p>
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

  // Get user display info
  const displayName = profile?.full_name || user.email?.split('@')[0] || 'User';
  const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div className="min-h-screen pt-24 pb-16" data-theme="bright-dark">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          {/* Dashboard Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {displayName}! Here's what's happening.</p>
          </div>

          {/* Dashboard Grid */}
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
                <p className="text-sm text-muted-foreground">Your account is set up and ready</p>
              </div>
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Recent Activity */}
            <div className="group relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-xl border border-border/20 hover:border-secondary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-secondary/10">
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5" />
                <div className="absolute inset-0 bg-gradient-to-t from-card/40 via-transparent to-transparent" />
              </div>
              <div className="relative z-10 p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 rounded-lg bg-secondary/10">
                    <Activity className="w-5 h-5 text-secondary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Recent Activity</h3>
                </div>
                <p className="text-2xl font-bold text-secondary mb-2">0</p>
                <p className="text-sm text-muted-foreground">No recent activity</p>
              </div>
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>

            {/* Quick Actions */}
            <div className="group relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-xl border border-border/20 hover:border-accent/30 transition-all duration-500 hover:shadow-2xl hover:shadow-accent/10">
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5" />
                <div className="absolute inset-0 bg-gradient-to-t from-card/40 via-transparent to-transparent" />
              </div>
              <div className="relative z-10 p-6">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 rounded-lg bg-accent/10">
                    <Settings className="w-5 h-5 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
                </div>
                <div className="space-y-2">
                  <a href="/settings" className="block text-sm text-primary hover:text-primary/80 transition-colors">
                    Account Settings
                  </a>
                  <a href="/settings" className="block text-sm text-primary hover:text-primary/80 transition-colors">
                    Privacy Settings
                  </a>
                </div>
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
                  <h2 className="text-2xl font-bold text-foreground mb-4">Welcome to Your Dashboard</h2>
                  <div className="prose prose-neutral dark:prose-invert max-w-none">
                    <p className="text-muted-foreground mb-4">
                      This is your personal dashboard where you can manage your account, view your activity, 
                      and access all the tools you need.
                    </p>
                    <p className="text-muted-foreground">
                      Get started by exploring the navigation menu or checking out your account settings.
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
                  <h3 className="text-lg font-semibold text-foreground mb-4">Profile Summary</h3>
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
                    <div className="pt-3 border-t border-border/20">
                      <p className="text-xs text-muted-foreground">
                        Member since {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Recently'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="group relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-xl border border-border/20">
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-secondary/5" />
                </div>
                <div className="relative z-10 p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-4">Quick Links</h3>
                  <div className="space-y-2">
                    <a href="/settings" className="block p-2 rounded-lg text-sm text-foreground hover:bg-primary/10 transition-colors">
                      Account Settings
                    </a>
                    <a href="/settings" className="block p-2 rounded-lg text-sm text-foreground hover:bg-primary/10 transition-colors">
                      Privacy & Security
                    </a>
                    <a href="/" className="flex items-center space-x-2 p-2 rounded-lg text-sm text-foreground hover:bg-primary/10 transition-colors">
                      <ArrowLeft className="w-4 h-4" />
                      <span>Back to Home</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};