-- Create custom types
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('subscriber', 'author', 'editor', 'admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  username TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role user_role NOT NULL DEFAULT 'subscriber',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(email),
  UNIQUE(username)
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS handle_profiles_updated_at ON public.profiles;
CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Create function to generate semantic username
CREATE OR REPLACE FUNCTION public.generate_username(user_email TEXT)
RETURNS TEXT AS $$
DECLARE
  base_username TEXT;
  final_username TEXT;
  counter INTEGER := 1;
  random_suffix TEXT;
BEGIN
  -- Extract the part before @ from email
  base_username := split_part(user_email, '@', 1);
  
  -- Clean the username: lowercase, remove special chars, limit length
  base_username := lower(regexp_replace(base_username, '[^a-zA-Z0-9]', '', 'g'));
  base_username := left(base_username, 20);
  
  -- If empty after cleaning, use 'user'
  IF base_username = '' THEN
    base_username := 'user';
  END IF;
  
  -- Generate a random 6-digit suffix
  random_suffix := lpad(floor(random() * 1000000)::text, 6, '0');
  final_username := base_username || random_suffix;
  
  -- Ensure uniqueness by checking existing usernames
  WHILE EXISTS (SELECT 1 FROM public.profiles WHERE username = final_username) LOOP
    random_suffix := lpad(floor(random() * 1000000)::text, 6, '0');
    final_username := base_username || random_suffix;
    counter := counter + 1;
    
    -- Prevent infinite loop
    IF counter > 100 THEN
      final_username := 'user' || extract(epoch from now())::bigint::text;
      EXIT;
    END IF;
  END LOOP;
  
  RETURN final_username;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to automatically create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  generated_username TEXT;
BEGIN
  -- Generate a semantic username
  generated_username := public.generate_username(NEW.email);
  
  INSERT INTO public.profiles (id, email, username, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    generated_username,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email)
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can view their own profile
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile (but not role - that requires admin)
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Simple function to prevent role escalation 
CREATE OR REPLACE FUNCTION public.check_role_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Prevent users from changing their own role to admin
  IF OLD.role != NEW.role AND NEW.role = 'admin' AND auth.uid() = NEW.id THEN
    RAISE EXCEPTION 'Cannot change your own role to admin';
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to prevent role escalation
DROP TRIGGER IF EXISTS prevent_role_change ON public.profiles;
CREATE TRIGGER prevent_role_change
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.check_role_change();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;