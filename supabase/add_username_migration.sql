-- Migration to add username column to existing profiles table
-- Run this AFTER updating the schema.sql and applying it

-- Add username column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'profiles' AND column_name = 'username'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN username TEXT;
  END IF;
END $$;

-- Generate usernames for existing users without them
DO $$
DECLARE
  profile_record RECORD;
  generated_username TEXT;
BEGIN
  FOR profile_record IN 
    SELECT id, email FROM public.profiles WHERE username IS NULL OR username = ''
  LOOP
    generated_username := public.generate_username(profile_record.email);
    UPDATE public.profiles 
    SET username = generated_username 
    WHERE id = profile_record.id;
  END LOOP;
END $$;

-- Make username NOT NULL and add unique constraint
ALTER TABLE public.profiles ALTER COLUMN username SET NOT NULL;
DROP INDEX IF EXISTS profiles_username_key;
CREATE UNIQUE INDEX profiles_username_key ON public.profiles(username);