# Global Auth Modal Usage

The auth modal is now globally accessible from anywhere in the application through window functions.

## Available Functions

### `window.showAuthModal(mode?: 'signin' | 'signup')`
Opens the authentication modal.

**Parameters:**
- `mode` (optional): Either 'signin' or 'signup'. Defaults to 'signin'.

**Examples:**
```javascript
// Open sign in modal (default)
window.showAuthModal();

// Open sign in modal explicitly
window.showAuthModal('signin');

// Open sign up modal
window.showAuthModal('signup');
```

### `window.hideAuthModal()`
Closes the authentication modal.

**Example:**
```javascript
window.hideAuthModal();
```

## Usage in Components

### React/TypeScript Components
```tsx
const handleSignInClick = () => {
  if (window.showAuthModal) {
    window.showAuthModal('signin');
  } else {
    // Fallback if modal not available
    window.location.href = '/auth';
  }
};
```

### Vanilla JavaScript
```javascript
document.getElementById('sign-in-button').addEventListener('click', () => {
  if (window.showAuthModal) {
    window.showAuthModal('signin');
  }
});
```

### Astro Components
```astro
<button onclick="window.showAuthModal && window.showAuthModal('signin')">
  Sign In
</button>
```

## How It Works

1. The `AuthButtons` component in the header exposes the modal functions globally when it mounts.
2. These functions control the auth modal state directly.
3. The modal appears as an overlay on top of the current page.
4. Users can sign in or sign up without leaving the current page.

## Benefits

- **Seamless UX**: Users don't lose their place on the site
- **Context Preservation**: Comments, forms, and other interactions remain visible
- **Consistent Experience**: Same auth flow from anywhere in the app
- **Fallback Support**: Automatically falls back to `/auth` page if modal unavailable

## Integration Points

Currently integrated in:
- Comments section (voting, replying, posting)
- Header navigation (sign in/sign up buttons)
- Can be easily added to any other component requiring authentication