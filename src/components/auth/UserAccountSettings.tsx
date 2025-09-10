import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthProvider';
import { User, Shield, Save, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface UserAccountSettingsProps {
  userId: string;
}

export const UserAccountSettings: React.FC<UserAccountSettingsProps> = ({ userId }) => {
  const { user, profile, updateProfile, loading } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
  });
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.full_name || '',
        email: profile.email || '',
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage('');
    setError('');

    try {
      const { error } = await updateProfile({
        full_name: formData.fullName,
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage('Profile updated successfully!');
      }
    } catch (err) {
      setError('An unexpected error occurred');
    }

    setIsUpdating(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-16" data-theme="bright-dark">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto">
            <div className="animate-pulse rounded-2xl bg-card/30 h-96 flex items-center justify-center">
              <div className="text-muted-foreground">Loading...</div>
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
            <p className="text-muted-foreground mb-8">You need to be signed in to access account settings.</p>
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

  // Check if this is the current user's settings
  const isOwnSettings = user.id === userId;

  if (!isOwnSettings) {
    return (
      <div className="min-h-screen pt-24 pb-16" data-theme="bright-dark">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-bold text-foreground mb-4">Access Denied</h1>
            <p className="text-muted-foreground mb-8">You can only access your own account settings.</p>
            <a 
              href={`/user/${user.id}/settings`}
              className="inline-flex items-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              Go to Your Settings
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16" data-theme="bright-dark">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          {/* Back Navigation */}
          <div className="mb-6">
            <a 
              href={`/user/${user.id}`}
              className="inline-flex items-center space-x-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Profile</span>
            </a>
          </div>

          {/* Settings Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-2">Account Settings</h1>
            <p className="text-muted-foreground">Manage your account information and preferences.</p>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive">
              {error}
            </div>
          )}

          {message && (
            <div className="mb-6 p-4 rounded-lg bg-success/10 border border-success/20 text-success">
              {message}
            </div>
          )}

          {/* Settings Sections */}
          <div className="space-y-6">
            {/* Profile Information */}
            <div className="group relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-xl border border-border/20">
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
              </div>
              <div className="relative z-10 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Profile Information</h2>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-2">
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      disabled
                      className="w-full px-4 py-3 rounded-lg bg-muted border border-border text-muted-foreground cursor-not-allowed"
                      placeholder="Email cannot be changed"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Email address cannot be changed. Contact support if you need to update your email.
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="flex items-center space-x-2 bg-primary text-primary-foreground py-3 px-6 rounded-lg font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>{isUpdating ? 'Saving...' : 'Save Changes'}</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Account Information */}
            <div className="group relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-xl border border-border/20">
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-primary/5" />
              </div>
              <div className="relative z-10 p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="p-2 rounded-lg bg-secondary/10">
                    <Shield className="w-5 h-5 text-secondary" />
                  </div>
                  <h2 className="text-2xl font-bold text-foreground">Account Information</h2>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-border/20">
                    <span className="text-foreground">User ID</span>
                    <span className="text-muted-foreground font-mono text-sm">{user.id}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/20">
                    <span className="text-foreground">Account Type</span>
                    <span className="text-muted-foreground capitalize">{profile?.role || 'subscriber'}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-border/20">
                    <span className="text-foreground">Member Since</span>
                    <span className="text-muted-foreground">
                      {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-foreground">Account Status</span>
                    <span className="text-success">Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="group relative overflow-hidden rounded-2xl bg-card/60 backdrop-blur-xl border border-destructive/20">
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-br from-destructive/5 via-transparent to-destructive/10" />
              </div>
              <div className="relative z-10 p-8">
                <h2 className="text-2xl font-bold text-destructive mb-4">Danger Zone</h2>
                <p className="text-muted-foreground mb-6">
                  These actions cannot be undone. Please be careful.
                </p>
                <button
                  className="bg-destructive text-destructive-foreground py-2 px-4 rounded-lg font-medium hover:bg-destructive/90 transition-colors"
                  onClick={() => alert('Account deletion is not yet implemented')}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};