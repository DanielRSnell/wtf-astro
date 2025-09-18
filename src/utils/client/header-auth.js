// Header Auth UI Handler - Vanilla JS
// Manages the auth UI in the header without React

class HeaderAuth {
  constructor() {
    this.container = null;
    this.unsubscribe = null;
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    // Find or create the auth container in the header
    this.container = document.getElementById('header-auth-container');
    
    if (!this.container) {
      console.warn('Header auth container not found');
      return;
    }

    // Subscribe to auth state changes
    this.unsubscribe = window.authManager.subscribe((state) => {
      this.render(state);
    });
  }

  render(state) {
    if (!this.container) return;

    const { user, profile, loading } = state;

    if (loading) {
      this.container.innerHTML = this.renderLoading();
    } else if (user) {
      this.container.innerHTML = this.renderUserMenu(user, profile);
      this.attachUserMenuListeners();
    } else {
      this.container.innerHTML = this.renderAuthButtons();
      this.attachAuthButtonListeners();
    }
  }

  renderLoading() {
    return `
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-full bg-muted/30 animate-pulse"></div>
        <div class="hidden md:block">
          <div class="w-20 h-4 bg-muted/30 rounded animate-pulse mb-1"></div>
          <div class="w-16 h-3 bg-muted/30 rounded animate-pulse"></div>
        </div>
      </div>
    `;
  }

  renderAuthButtons() {
    return `
      <div class="flex items-center gap-3">
        <button
          id="header-signin-btn"
          class="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors"
        >
          <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          Sign In
        </button>
        
        <button
          id="header-signup-btn"
          class="shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 py-1.5 px-4 flex items-center gap-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
        >
          <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
          </svg>
          Sign Up
        </button>
      </div>
    `;
  }

  renderUserMenu(user, profile) {
    const displayName = profile?.full_name || user.email?.split('@')[0] || 'User';
    const avatarUrl = profile?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=random`;
    
    return `
      <div class="relative">
        <button
          id="user-menu-trigger"
          class="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-muted transition-colors"
        >
          <img
            src="${avatarUrl}"
            alt="${displayName}"
            class="h-8 w-8 rounded-full border border-border"
          />
          <div class="hidden md:block text-left">
            <div class="text-sm font-medium text-foreground">${displayName}</div>
            <div class="text-xs text-muted-foreground">${user.email}</div>
          </div>
          <svg class="w-4 h-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
        
        <!-- Dropdown Menu -->
        <div
          id="user-menu-dropdown"
          class="hidden absolute right-0 mt-2 w-56 rounded-md border border-border bg-background shadow-lg"
        >
          <div class="p-2">
            <a
              href="/dashboard"
              class="flex items-center gap-2 rounded-sm px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
            >
              <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
              </svg>
              Dashboard
            </a>
            
            <a
              href="/profile"
              class="flex items-center gap-2 rounded-sm px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
            >
              <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              Profile
            </a>
            
            <a
              href="/settings"
              class="flex items-center gap-2 rounded-sm px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
            >
              <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </a>
            
            <div class="my-1 h-px bg-border"></div>
            
            <button
              id="signout-btn"
              class="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors"
            >
              <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </div>
    `;
  }

  attachAuthButtonListeners() {
    const signinBtn = document.getElementById('header-signin-btn');
    const signupBtn = document.getElementById('header-signup-btn');
    
    if (signinBtn) {
      signinBtn.addEventListener('click', () => {
        window.authModal.open('signin');
      });
    }
    
    if (signupBtn) {
      signupBtn.addEventListener('click', () => {
        window.authModal.open('signup');
      });
    }
  }

  attachUserMenuListeners() {
    const trigger = document.getElementById('user-menu-trigger');
    const dropdown = document.getElementById('user-menu-dropdown');
    const signoutBtn = document.getElementById('signout-btn');
    
    if (trigger && dropdown) {
      // Toggle dropdown on click
      trigger.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('hidden');
      });
      
      // Close dropdown when clicking outside
      document.addEventListener('click', () => {
        dropdown.classList.add('hidden');
      });
      
      // Prevent dropdown from closing when clicking inside
      dropdown.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
    
    if (signoutBtn) {
      signoutBtn.addEventListener('click', async () => {
        await window.authManager.signOut();
      });
    }
  }

  destroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}

// Create singleton instance
const headerAuth = new HeaderAuth();

// Make it globally available
window.headerAuth = headerAuth;

export default headerAuth;