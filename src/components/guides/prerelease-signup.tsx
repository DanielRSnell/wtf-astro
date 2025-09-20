import React, { useState } from 'react';
import { Mail, Bell, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PrereleaseSignupProps {
  guideTitle: string;
  guideDescription: string;
  expectedDate?: string;
}

export const PrereleaseSignup: React.FC<PrereleaseSignupProps> = ({
  guideTitle,
  guideDescription,
  expectedDate
}) => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);

    try {
      // The form submission will be automatically tracked by the global analytics
      // via the form submit event listener in base.astro

      // Store in localStorage for backup
      const signups = JSON.parse(localStorage.getItem('guideSignups') || '{}');
      if (!signups[guideTitle]) {
        signups[guideTitle] = [];
      }
      signups[guideTitle].push({ email, date: new Date().toISOString() });
      localStorage.setItem('guideSignups', JSON.stringify(signups));

      // Track specific event with Umami
      if (window.umami) {
        window.umami.track('prerelease-signup', {
          guide: guideTitle,
          email: email.split('@')[1] // domain only for privacy
        });
      }

      // Small delay for user experience
      await new Promise(resolve => setTimeout(resolve, 500));

      setIsSubmitted(true);
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[500px] flex items-center justify-center px-4 py-16">
        <div className="max-w-md w-full text-center">
          {/* Success Icon */}
          <div className="mb-6 flex justify-center">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Bell className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          {/* Success Message */}
          <h3 className="text-2xl font-bold text-foreground mb-2">
            You're all set!
          </h3>
          <p className="text-muted-foreground mb-6">
            We'll send an email to <span className="font-medium text-foreground">{email}</span> when "{guideTitle}" is ready.
          </p>
          
          {/* Action Button */}
          <button
            onClick={() => {
              setIsSubmitted(false);
              setEmail('');
            }}
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            Use a different email →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[500px] flex items-center justify-center px-4 py-16">
      <div className="max-w-xl w-full">
        {/* Main Content */}
        <div className="text-center mb-10">
          {/* Badge */}
          {expectedDate && (
            <div className="mb-6 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/60 border border-border/40">
              <Clock className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-xs font-medium text-muted-foreground">Expected {expectedDate}</span>
            </div>
          )}
          
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {guideTitle}
          </h1>
          
          {/* Description */}
          <p className="text-lg text-muted-foreground leading-relaxed">
            {guideDescription}
          </p>
        </div>

        {/* Email Signup Form */}
        <div className="relative">
          {/* Subtle background */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 rounded-2xl" />
          
          <div className="relative bg-card/40 backdrop-blur-sm border border-brand rounded-2xl p-8">
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Be the first to know
            </h3>
            <p className="text-sm text-muted-foreground mb-6">
              Get notified when this guide is available.
            </p>

            <form
              onSubmit={handleSubmit}
              name="prerelease-signup"
              className="space-y-4"
            >
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/60" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-11 pr-4 py-3 rounded-lg bg-background/60 border border-border/40 text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 focus:bg-background/80 transition-all"
                  required
                />
              </div>
              
              <Button
                type="submit"
                variant="default"
                size="lg"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Subscribing...' : 'Get Early Access'}
              </Button>
            </form>

            <p className="mt-4 text-xs text-muted-foreground text-center">
              No spam. Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};