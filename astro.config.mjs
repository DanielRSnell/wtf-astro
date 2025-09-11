// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import react from '@astrojs/react';
import netlify from '@astrojs/netlify';

import playformInline from '@playform/inline';

// https://astro.build/config
export default defineConfig({
  adapter: netlify(),
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react(), playformInline()]
});