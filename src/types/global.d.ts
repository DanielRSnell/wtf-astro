declare global {
  interface Window {
    showAuthModal?: (mode?: 'signin' | 'signup') => void;
    hideAuthModal?: () => void;
    umami?: {
      track: (eventName: string, eventData?: Record<string, any>) => void;
    };
  }
}

export {};