// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config

export default defineConfig({
  // For production
  site: 'https://harryfan.github.io/harry-blog/',
  
  // For local development (uncomment when developing locally)
  // site: 'http://localhost:4321/harry-blog/',
  
  base: '/harry-blog/',
});
