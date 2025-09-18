// Vanilla JS Auth Module - No React dependencies
// This handles all client-side authentication logic

class AuthManager {
  constructor() {
    this.user = null;
    this.profile = null;
    this.loading = true;
    this.listeners = new Set();
    this.supabaseUrl = null;
    this.supabaseAnonKey = null;
    this.initialized = false;
  }

  // Initialize auth with environment variables
  async init() {
    if (this.initialized) return;
    
    // Get Supabase config from meta tags or window object
    this.supabaseUrl = window.SUPABASE_URL || document.querySelector('meta[name="supabase-url"]')?.content;
    this.supabaseAnonKey = window.SUPABASE_ANON_KEY || document.querySelector('meta[name="supabase-anon-key"]')?.content;
    
    if (!this.supabaseUrl || !this.supabaseAnonKey) {
      console.warn('Supabase not configured. Auth features disabled.');
      this.loading = false;
      this.notifyListeners();
      return;
    }

    this.initialized = true;
    await this.checkSession();
  }

  // Check current session
  async checkSession() {
    this.loading = true;
    this.notifyListeners();

    try {
      const response = await fetch('/api/auth/session', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        this.user = data.user || null;
        this.profile = data.profile || null;
      } else {
        this.user = null;
        this.profile = null;
      }
    } catch (error) {
      console.error('Error checking session:', error);
      this.user = null;
      this.profile = null;
    }

    this.loading = false;
    this.notifyListeners();
  }

  // Sign in with email and password
  async signIn(email, password) {
    if (!this.initialized) await this.init();
    
    try {
      const response = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (response.ok) {
        this.user = data.user;
        this.profile = data.profile;
        this.notifyListeners();
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Sign in failed' };
      }
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message };
    }
  }

  // Sign up with email and password
  async signUp(email, password, fullName = '') {
    if (!this.initialized) await this.init();
    
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password, fullName })
      });

      const data = await response.json();
      
      if (response.ok) {
        return { success: true, message: 'Please check your email to confirm your account' };
      } else {
        return { success: false, error: data.error || 'Sign up failed' };
      }
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message };
    }
  }

  // Sign out
  async signOut() {
    try {
      const response = await fetch('/api/auth/signout', {
        method: 'POST',
        credentials: 'include'
      });

      if (response.ok) {
        this.user = null;
        this.profile = null;
        this.notifyListeners();
        
        // Redirect to home or login page
        window.location.href = '/';
        return { success: true };
      } else {
        return { success: false, error: 'Sign out failed' };
      }
    } catch (error) {
      console.error('Sign out error:', error);
      return { success: false, error: error.message };
    }
  }

  // Subscribe to auth state changes
  subscribe(callback) {
    this.listeners.add(callback);
    // Immediately call with current state
    callback({
      user: this.user,
      profile: this.profile,
      loading: this.loading
    });

    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  // Notify all listeners of state change
  notifyListeners() {
    this.listeners.forEach(callback => {
      callback({
        user: this.user,
        profile: this.profile,
        loading: this.loading
      });
    });
  }

  // Get current auth state
  getState() {
    return {
      user: this.user,
      profile: this.profile,
      loading: this.loading
    };
  }
}

// Create singleton instance
const authManager = new AuthManager();

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => authManager.init());
} else {
  authManager.init();
}

// Export for use in other modules
window.authManager = authManager;

export default authManager;