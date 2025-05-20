// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config

export default defineConfig({
	site: 'http://localhost:4321/harry-blog/',  // 👈 加上這行
	base: '/harry-blog/',
});
