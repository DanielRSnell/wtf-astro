// Auth Modal Handler - Vanilla JS
// Handles the authentication modal UI without React

class AuthModal {
  constructor() {
    this.modal = null;
    this.isOpen = false;
    this.mode = 'signin'; // 'signin' or 'signup'
    this.init();
  }

  init() {
    // Create modal HTML structure
    this.createModal();
    this.attachEventListeners();
  }

  createModal() {
    const modalHTML = `
      <div id="auth-modal" class="fixed inset-0 z-50 hidden">
        <!-- Backdrop -->
        <div class="auth-modal-backdrop fixed inset-0 bg-background/80 backdrop-blur-sm"></div>
        
        <!-- Modal Content -->
        <div class="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
          <!-- Close Button -->
          <button class="auth-modal-close absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          <!-- Modal Header -->
          <div class="flex flex-col space-y-1.5 text-center sm:text-left">
            <h2 class="auth-modal-title text-lg font-semibold leading-none tracking-tight">
              Welcome Back
            </h2>
            <p class="auth-modal-description text-sm text-muted-foreground">
              Sign in to your account to continue
            </p>
          </div>

          <!-- Auth Form -->
          <form id="auth-form" class="space-y-4">
            <!-- Full Name (signup only) -->
            <div id="fullname-field" class="space-y-2 hidden">
              <label for="fullname" class="text-sm font-medium leading-none">
                Full Name
              </label>
              <input
                type="text"
                id="fullname"
                name="fullname"
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="John Doe"
              />
            </div>

            <!-- Email Field -->
            <div class="space-y-2">
              <label for="email" class="text-sm font-medium leading-none">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="name@example.com"
              />
            </div>

            <!-- Password Field -->
            <div class="space-y-2">
              <label for="password" class="text-sm font-medium leading-none">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                placeholder="••••••••"
              />
            </div>

            <!-- Error Message -->
            <div id="auth-error" class="hidden rounded-md bg-destructive/10 p-3 text-sm text-destructive"></div>

            <!-- Success Message -->
            <div id="auth-success" class="hidden rounded-md bg-green-500/10 p-3 text-sm text-green-600"></div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="auth-submit-btn inline-flex w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground ring-offset-background transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            >
              <span class="auth-submit-text">Sign In</span>
              <span class="auth-loading hidden">
                <svg class="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </span>
            </button>
          </form>

          <!-- Toggle Mode -->
          <div class="text-center text-sm">
            <span class="auth-toggle-text text-muted-foreground">Don't have an account?</span>
            <button type="button" class="auth-toggle-btn ml-1 underline hover:text-primary">
              Sign up
            </button>
          </div>
        </div>
      </div>
    `;

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    this.modal = document.getElementById('auth-modal');
  }

  attachEventListeners() {
    // Close button
    this.modal.querySelector('.auth-modal-close').addEventListener('click', () => this.close());
    
    // Backdrop click
    this.modal.querySelector('.auth-modal-backdrop').addEventListener('click', () => this.close());
    
    // Toggle between signin/signup
    this.modal.querySelector('.auth-toggle-btn').addEventListener('click', () => this.toggleMode());
    
    // Form submission
    const form = this.modal.querySelector('#auth-form');
    form.addEventListener('submit', (e) => this.handleSubmit(e));

    // ESC key to close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.close();
      }
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    const fullName = form.fullname?.value || '';
    
    // Clear previous messages
    this.hideError();
    this.hideSuccess();
    
    // Show loading state
    this.setLoading(true);
    
    try {
      let result;
      
      if (this.mode === 'signin') {
        result = await window.authManager.signIn(email, password);
      } else {
        result = await window.authManager.signUp(email, password, fullName);
      }
      
      if (result.success) {
        if (this.mode === 'signin') {
          // Close modal and reload page on successful signin
          this.close();
          window.location.reload();
        } else {
          // Show success message for signup
          this.showSuccess(result.message || 'Sign up successful! Please check your email.');
          form.reset();
        }
      } else {
        this.showError(result.error || 'Authentication failed');
      }
    } catch (error) {
      this.showError(error.message || 'An unexpected error occurred');
    } finally {
      this.setLoading(false);
    }
  }

  toggleMode() {
    this.mode = this.mode === 'signin' ? 'signup' : 'signin';
    
    const title = this.modal.querySelector('.auth-modal-title');
    const description = this.modal.querySelector('.auth-modal-description');
    const submitText = this.modal.querySelector('.auth-submit-text');
    const toggleText = this.modal.querySelector('.auth-toggle-text');
    const toggleBtn = this.modal.querySelector('.auth-toggle-btn');
    const fullnameField = this.modal.querySelector('#fullname-field');
    
    if (this.mode === 'signin') {
      title.textContent = 'Welcome Back';
      description.textContent = 'Sign in to your account to continue';
      submitText.textContent = 'Sign In';
      toggleText.textContent = "Don't have an account?";
      toggleBtn.textContent = 'Sign up';
      fullnameField.classList.add('hidden');
    } else {
      title.textContent = 'Create Account';
      description.textContent = 'Sign up for a new account to get started';
      submitText.textContent = 'Sign Up';
      toggleText.textContent = 'Already have an account?';
      toggleBtn.textContent = 'Sign in';
      fullnameField.classList.remove('hidden');
    }
    
    // Clear any error/success messages
    this.hideError();
    this.hideSuccess();
  }

  open(mode = 'signin') {
    this.mode = mode;
    if (mode === 'signup') {
      this.toggleMode();
    }
    
    this.modal.classList.remove('hidden');
    this.isOpen = true;
    
    // Focus first input
    setTimeout(() => {
      const firstInput = this.mode === 'signup' 
        ? this.modal.querySelector('#fullname')
        : this.modal.querySelector('#email');
      firstInput?.focus();
    }, 100);
  }

  close() {
    this.modal.classList.add('hidden');
    this.isOpen = false;
    
    // Reset form
    this.modal.querySelector('#auth-form').reset();
    this.hideError();
    this.hideSuccess();
  }

  showError(message) {
    const errorEl = this.modal.querySelector('#auth-error');
    errorEl.textContent = message;
    errorEl.classList.remove('hidden');
  }

  hideError() {
    const errorEl = this.modal.querySelector('#auth-error');
    errorEl.classList.add('hidden');
  }

  showSuccess(message) {
    const successEl = this.modal.querySelector('#auth-success');
    successEl.textContent = message;
    successEl.classList.remove('hidden');
  }

  hideSuccess() {
    const successEl = this.modal.querySelector('#auth-success');
    successEl.classList.add('hidden');
  }

  setLoading(loading) {
    const submitBtn = this.modal.querySelector('.auth-submit-btn');
    const submitText = this.modal.querySelector('.auth-submit-text');
    const loadingIcon = this.modal.querySelector('.auth-loading');
    
    if (loading) {
      submitBtn.disabled = true;
      submitText.classList.add('hidden');
      loadingIcon.classList.remove('hidden');
    } else {
      submitBtn.disabled = false;
      submitText.classList.remove('hidden');
      loadingIcon.classList.add('hidden');
    }
  }
}

// Create singleton instance
const authModal = new AuthModal();

// Make it globally available
window.authModal = authModal;

export default authModal;