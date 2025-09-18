// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';
import netlify from '@astrojs/netlify';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  adapter: netlify(),
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      noExternal: ['@supabase/ssr', '@supabase/supabase-js', '@supabase/auth-ui-react']
    }
  },
  integrations: [
    mdx(),
    react({
      experimentalReactChildren: true
    }), 
    sitemap()
  ]
});