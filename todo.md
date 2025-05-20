# ✍️ 部落格網站開發任務清單

## 🔧 專案初始化

- [ ] 確認 `astro.config.mjs` 中 `site` 設定為 `https://harryfan.github.io/harry-blog/`
- [ ] 設定 `base` 為 `/harry-blog/`
- [ ] 確認 `.github/workflows/deploy.yml` 已正確設置

## 📝 文章管理

- [ ] 設計文章列表頁，顯示文章標題、摘要與發佈日期
- [ ] 為每篇文章建立 Markdown 檔案，包含：
  - [ ] 標題與摘要
  - [ ] 發佈日期與作者
  - [ ] 文章內容
- [ ] 設定文章分類與標籤功能（可選）

## 🎨 樣式與互動

- [ ] 整合 Tailwind CSS 進行快速樣式設計
- [ ] 設計響應式佈局，適應各種裝置
- [ ] 加入搜尋與分類篩選功能（可選）

## 🚀 部署與測試

- [ ] 執行 `git add . && git commit -m "deploy: 更新部落格" && git push`
- [ ] 確認 GitHub Actions 部署成功
- [ ] 測試文章列表與詳細頁面是否正常顯示
