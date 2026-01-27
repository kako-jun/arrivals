import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: process.env.SITE_URL || 'https://arrivals.example.app',
  base: '/landing',
  trailingSlash: 'always',
  integrations: [sitemap()],
  build: {
    assets: '_assets',
  },
});
