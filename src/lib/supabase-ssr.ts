import { createServerClient, type CookieOptions } from '@supabase/ssr';
import type { AstroCookies } from 'astro';

export function createSupabaseSSR(cookies: AstroCookies) {
  return createServerClient(
    import.meta.env.PUBLIC_SUPABASE_URL!,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookies.set(name, value, {
            ...options,
            httpOnly: false,
            secure: true,
            sameSite: 'lax',
          });
        },
        remove(name: string, options: CookieOptions) {
          cookies.delete(name, {
            ...options,
          });
        },
      },
    }
  );
}