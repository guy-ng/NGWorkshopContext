import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// The root and the bare service paths are meta-refresh redirects, and thank-you is noindex.
const excludedFromSitemap = new Set([
  '/',
  '/he/thank-you/', '/en/thank-you/',
  '/he/camunda/', '/en/camunda/',
  '/he/vibe-coding-rescue/', '/en/vibe-coding-rescue/',
]);

export default defineConfig({
  site: 'https://ngworkshop.co.il',
  output: 'static',
  integrations: [mdx(), sitemap({ filter: (page) => !excludedFromSitemap.has(new URL(page).pathname) })],
  i18n: {
    defaultLocale: 'he',
    locales: ['he', 'en'],
    routing: { prefixDefaultLocale: true },
  },
});
