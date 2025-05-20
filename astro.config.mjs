// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // 設定站點 URL（不含子目錄路徑）
  site: 'https://harryfan.github.io',
  
  // 設定基礎路徑，必須前後都有斜線
  base: '/harry-blog/',
  
  // 設定資源檔案處理
  build: {
    // 使用固定名稱的資源目錄，避免雜湊值導致路徑問題
    assets: 'assets',
    // 確保靜態資源路徑正確
    assetsPrefix: '/harry-blog/'
  },
  
  // Vite 配置
  vite: {
    base: '/harry-blog/',
    build: {
      rollupOptions: {
        output: {
          // 使用固定名稱的輸出檔案
          entryFileNames: 'assets/[name].js',
          chunkFileNames: 'assets/[name].js',
          // 處理公共資源
          assetFileNames: ({ name }) => {
            if (/\.(woff|woff2|ttf|eot|svg|png|jpg|jpeg|gif|ico|webp)$/i.test(name ?? '')) {
              return 'assets/[name][extname]';
            }
            return 'assets/[name]-[hash][extname]';
          }
        }
      }
    }
  },
  
  // 整合插件
  integrations: [
    mdx(),
    sitemap({
      // 確保 sitemap 中的 URL 包含正確的 base 路徑
      customPages: ['https://harryfan.github.io/harry-blog/']
    })
  ]
});
