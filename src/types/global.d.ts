declare global {
  interface Window {
    showAuthModal?: (mode?: 'signin' | 'signup') => void;
    hideAuthModal?: () => void;
  }
}

export {};