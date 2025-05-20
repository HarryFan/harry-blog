// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config

export default defineConfig({
	base: '/harry-blog/', // 子路徑部署
});
