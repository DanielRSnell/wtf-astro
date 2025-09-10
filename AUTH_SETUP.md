# Authentication Setup Guide

This project includes a complete authentication system built with Supabase, featuring user registration, login, role-based access control, and profile management.

## 🚀 Quick Start

### 1. Database Setup

Run the SQL schema in your Supabase SQL Editor:

```bash
# Execute the contents of supabase/schema.sql in your Supabase dashboard
```

This will create:
- `profiles` table with user data and roles
- Row Level Security (RLS) policies
- Automatic profile creation triggers
- Role-based access functions

### 2. Environment Variables

Your `.env` file is already configured with:

```bash
PUBLIC_SUPABASE_URL=https://ugqbxwlsnqkxyqcheygf.supabase.co
PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]
DATABASE_URL=postgresql://postgres:!umbralShared@db.ugqbxwlsnqkxyqcheygf.supabase.co:5432/postgres
```

## 🛡️ User Roles & Permissions

The system supports 4 user roles with hierarchical permissions:

- **Subscriber** (Level 1) - Basic user access
- **Author** (Level 2) - Can create content
- **Editor** (Level 3) - Can edit others' content
- **Admin** (Level 4) - Full system access

### Role Hierarchy
Higher-level roles inherit permissions from lower levels. For example, an Admin has all Editor, Author, and Subscriber permissions.

## 🔧 Components

### AuthProvider
Wraps your app with authentication context:

```tsx
import { AuthProvider } from '@/components/auth/AuthProvider';

<AuthProvider>
  <YourApp />
</AuthProvider>
```

### useAuth Hook
Access authentication state anywhere:

```tsx
import { useAuth } from '@/components/auth/AuthProvider';

const { user, profile, signIn, signUp, signOut } = useAuth();
```

### ProtectedRoute
Protect components based on user roles:

```tsx
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

<ProtectedRoute requiredRole="editor">
  <AdminPanel />
</ProtectedRoute>
```

### useRole Hook
Check user permissions:

```tsx
import { useRole } from '@/components/auth/ProtectedRoute';

const { hasRole, isRole, currentRole } = useRole();

if (hasRole('admin')) {
  // Show admin features
}
```

## 📝 Forms & UI

### AuthForm
Complete login/register form:

```tsx
import { AuthForm } from '@/components/auth/AuthForm';

<AuthForm 
  mode="signin" // or "signup"
  onToggleMode={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
/>
```

### AuthModal
Modal wrapper for auth forms:

```tsx
import { AuthModal } from '@/components/auth/AuthModal';

<AuthModal 
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  initialMode="signin"
/>
```

### UserMenu
User profile dropdown menu:

```tsx
import { UserMenu } from '@/components/auth/UserMenu';

<UserMenu /> // Shows user info, role badge, and sign out
```

## 🔒 Security Features

### Row Level Security (RLS)
- Users can only view/edit their own profiles
- Admins can view/edit all profiles
- Automatic role enforcement at database level

### Role-Based Access Control
- Hierarchical permission system
- Component-level protection
- Route-level protection
- API endpoint protection

### Data Validation
- Email format validation
- Password strength requirements
- Profile data sanitization
- SQL injection prevention

## 🎯 Usage Examples

### Protecting a Page
```astro
---
// In your .astro page
export const prerender = false; // Enable SSR for auth
---

<script>
  import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
  import { AdminDashboard } from '@/components/AdminDashboard';
  
  <ProtectedRoute requiredRole="admin">
    <AdminDashboard />
  </ProtectedRoute>
</script>
```

### Conditional Rendering
```tsx
import { useRole } from '@/components/auth/ProtectedRoute';

const MyComponent = () => {
  const { hasRole, currentRole } = useRole();
  
  return (
    <div>
      <h1>Welcome!</h1>
      {hasRole('author') && <CreatePostButton />}
      {hasRole('admin') && <AdminPanel />}
      <p>Your role: {currentRole}</p>
    </div>
  );
};
```

### Profile Management
```tsx
import { useAuth } from '@/components/auth/AuthProvider';

const ProfileSettings = () => {
  const { profile, updateProfile } = useAuth();
  
  const handleUpdate = async (data) => {
    const { error } = await updateProfile(data);
    if (!error) {
      // Profile updated successfully
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        defaultValue={profile?.full_name} 
        name="full_name"
        placeholder="Full Name" 
      />
      <button type="submit">Update Profile</button>
    </form>
  );
};
```

## 🛠️ Database Schema

### profiles Table
```sql
- id: UUID (Primary Key, references auth.users)
- email: TEXT (Unique, not null)
- full_name: TEXT
- avatar_url: TEXT
- role: user_role ENUM ('subscriber', 'author', 'editor', 'admin')
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
```

### Automatic Features
- Profile created automatically on user signup
- Role defaults to 'subscriber'
- Updated timestamps managed automatically
- Email sync with Supabase auth

## 🔧 Customization

### Adding New Roles
1. Update the `user_role` enum in your database
2. Update the `roleHierarchy` in `src/lib/supabase.ts`
3. Update the TypeScript types

### Styling
All components use your existing design system:
- Tailwind CSS classes
- CSS custom properties for theming
- Consistent with your glassmorphism design

### Adding Custom Fields
1. Add columns to the `profiles` table
2. Update the TypeScript interface in `src/lib/supabase.ts`
3. Update the RLS policies if needed

## 📋 Next Steps

1. **Run the SQL schema** in your Supabase dashboard
2. **Test authentication** by signing up a new user
3. **Set user roles** via Supabase dashboard or admin panel
4. **Customize permissions** based on your app needs
5. **Add protected content** using the provided components

## 🐛 Troubleshooting

### Common Issues
- **"Missing Supabase environment variables"**: Check your `.env` file
- **RLS policy errors**: Ensure you ran the complete SQL schema
- **Role not updating**: Check the database directly in Supabase dashboard
- **TypeScript errors**: Make sure all imports use the correct paths

### Support
- Check Supabase docs: https://supabase.com/docs
- Review the component source code for examples
- Test authentication flows in development mode

Your authentication system is now fully configured and ready to use! 🎉