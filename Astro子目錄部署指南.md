# 🚀 Astro 子目錄部署指南 (harry-blog)

## 📝 部署前準備

1. 確保 `astro.config.mjs` 中的設定正確：
   ```javascript
   export default defineConfig({
     site: 'https://harryfan.github.io',
     base: '/harry-blog/',
     build: {
       assets: 'assets',
       assetsPrefix: '/harry-blog/'
     },
     vite: {
       base: '/harry-blog/'
     }
   });
   ```

2. 確保所有靜態資源路徑使用 `${import.meta.env.BASE_URL}` 前綴

## 🛠️ 部署步驟

### 1. 安裝依賴
```bash
npm install --save-dev gh-pages
```

### 2. 建置專案
```bash
npm run build
```

### 3. 部署到 GitHub Pages
```bash
npm run deploy
```

## 🔍 常見問題

### 1. 資源載入失敗 (404 錯誤)
- 確認所有資源路徑都使用 `${import.meta.env.BASE_URL}`
- 檢查 `public` 目錄下的資源是否正確複製

### 2. 字體無法載入
- 確認 `global.css` 中的字體路徑包含 `/harry-blog/` 前綴
- 檢查字體檔案是否位於 `public/fonts/` 目錄

### 3. 路由問題
- 確保所有內部連結使用 `${import.meta.env.BASE_URL}path` 格式
- 避免使用絕對路徑 `/path`

## 🔄 自動化部署 (GitHub Actions)

1. 在專案根目錄創建 `.github/workflows/deploy.yml`
2. 添加以下配置：

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - name: Deploy
        uses: JamesIves/github-pages-deploy-action@v4
        with:
          folder: dist
          branch: gh-pages
```

## 📦 靜態資源處理

### 圖片
- 將圖片放在 `public/images` 目錄
- 在代碼中引用：`${import.meta.env.BASE_URL}images/example.jpg`

### 字體
- 將字體放在 `public/fonts` 目錄
- 在 CSS 中引用：`url('/harry-blog/fonts/font.woff2')`

## 🔧 開發環境設置

1. 克隆倉庫
2. 安裝依賴：`npm install`
3. 啟動開發服務器：`npm run dev`
4. 訪問：`http://localhost:4321/harry-blog/`

## 📝 注意事項

- 部署前務必測試 `npm run build` 和 `npm run preview`
- 確保 GitHub Pages 設置為使用 `gh-pages` 分支
- 清除瀏覽器緩存以獲取最新版本
