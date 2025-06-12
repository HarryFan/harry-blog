---
title: '🚀 網站最佳化大揭密：GA4資料追蹤與前端效能提升的奇妙旅程'
pubDate: 2025-06-12
description: '探索如何透過 GA4 資料追蹤與前端效能優化技術，讓您的網站跑得更快、更聰明，同時提升使用者體驗和轉換率。'
tags: ['GA4', '前端優化', '效能調校', '網站分析', 'SEO', 'Vue3', '網站開發']
heroImage: '/ga4-frontend-optimization-cover.png'
coverImage: '/ga4-frontend-optimization-cover.png'
---

## 🤔 前言：為什麼我的網站要最佳化？工程師的 OS

哈囉，大家好！身為一個前端工程師，每天除了跟程式碼奮鬥，心裡總有個小劇場：「我做的網站，大家用得順嗎？老闆會滿意嗎？」 你知道嗎？一個網站如果跑得卡卡
的、找不到重點，使用者可能滑一下就「掰掰」，老闆的摳摳也就跟著「飛走了」。這時候，「資料」和「效能」就像我們的神隊友，能幫我們看清問題，讓網站煥然一新
！

今天，我想跟大家分享最近我在一個 Vue 3 單頁應用程式 (SPA) 專案中，如何透過 Google Analytics 4 (GA4) 這位資料分析專家，以及一些前端效能最佳化的實用技巧
，讓網站變得更聰明、更有效率的故事。準備好了嗎？一起來看看這趟探索之旅吧！

## 🕵️‍♂️ 資料偵探辦案中：GA4 如何成為我的神隊友？

以前我們用舊版 GA，就像拿著放大鏡看東西，雖然能看到一些蛛絲馬跡，但總覺得少了點什麼。現在有了 GA4，它更像是一個全方位的偵探，不再只看「有多少人來過」
，而是更專注在「使用者在網站上做了些什麼」。

### 1. 📊 打造你的專屬「事件」情報網

在 SPA 這種「一頁到底」的網站，使用者點選不同功能時，網址列可能會變，但瀏覽器其實沒有真的「重新整理頁面」。所以，我們得主動告訴 GA4：「嘿！使用者現在
逛到『商品頁』囉！」、「他剛剛點了『加入購物車』按鈕喔！」

我們寫了一個像這樣的中央情報中心 (`trackEvent` 函數)，之後不管想追蹤什麼千奇百怪的行為，都透過它來回報給 GA4，是不是很有效率？

```javascript
// 簡單說，就是一個統一的「事件通報中心」函數
export const trackEvent = (eventName, eventParams = {}) => {
  if (typeof window.gtag === 'function') {
    // 確認 GA4 已經準備就緒
    window.gtag('event', eventName, {
      // 發送事件給 GA4
      ...eventParams, // 其他補充資訊，例如：商品名稱、價格等等
      send_to: window.gaId, // 確保情報送到正確的 GA4 基地
      debug_mode: !import.meta.env.PROD, // 開發模式下，可以看到更詳細的追蹤資訊
    });
  }
};
```

### 2. 👥 描繪使用者輪廓：自訂你想看的資料維度

光知道使用者點了什麼還不夠，我們想更深入了解「哪些人」在「做哪些事」。GA4 的「自訂維度與指標」就像給了我們很多空白標籤，可以自己定義想看的資訊，例如：

- **使用者足跡地圖**：追蹤使用者是從哪個廣告點進來的，逛了哪些頁面，最後有沒有買單。
- **購物轉換漏斗分析**：有多少人看了商品？多少人放進購物車？又有多少人成功結帳？找出哪個步驟客人流失最多。
- **VIP 客戶雷達**：找出那些經常光顧、消費力強的忠實客戶，針對他們做更精準的行銷活動。

### 3. 💰 讓廣告預算花在刀口上：整合 Google Ads 轉換追蹤

如果公司有在 Google 投放廣告，那每一塊錢都希望能帶來實際效益。我們把 GA4 跟 Google Ads 串接起來，這樣就能一清二楚地知道，哪個廣告真的有帶來客人，哪些
只是在浪費預算。

```javascript
// 通知 Google Ads：「報告！有人買東西了，這是你廣告的功勞喔！」
export const trackConversion = (conversionType, additionalData = {}) => {
  if (typeof window.gtag !== 'function') return; // GA4 罷工中，稍後再試

  // 先設定好不同的「轉換事件」代碼，例如「完成購買」是一個代碼，「註冊會員」又是另一個
  const conversionEvents = {
    purchase: 'AW-123456789/AbC-D_EFGHiJKL-MnOpqRstUv', // 完成購買的識別碼
    signup: 'AW-123456789/XyZ-123456', // 註冊會員的識別碼
  };

  if (conversionEvents[conversionType]) {
    // 如果是我們定義好的重要轉換行為
    window.gtag('event', 'conversion', {
      // 就發送一個「轉換」事件
      send_to: conversionEvents[conversionType], // 告訴 Google Ads 這是哪個轉換事件
      value: additionalData.value || 0, // 這次轉換的價值（例如：訂單金額）
      currency: additionalData.currency || 'TWD', // 使用的幣別
      transaction_id: additionalData.transactionId || '', // 訂單編號，避免重複計算轉換
    });
  }
};
```

## 🚀 網站加速三部曲：讓你的網站「飛」起來！

資料分析幫我們找出問題點，但如果網站慢得像烏龜，使用者根本沒耐心體驗我們精心設計的功能。所以，接下來就是前端工程師的拿手好戲——網站加速！

### 1️⃣ 第一步：程式碼「化整為零」，需要時才呼叫

想像一下，你走進一家大賣場，總不希望一進門，所有貨架上的商品都瞬間堆到你面前吧？網站也是一樣的道理。使用者可能一開始只需要看首頁，我們就先把首頁的程式
碼給他；等他想看商品頁的時候，再把商品頁的程式碼送過去。這就是所謂的「程式碼分割」(Code Splitting) 和「懶載入」(Lazy Loading)。

在 Vue 3，我們可以這樣實作：

```javascript
// 路由設定檔，規劃網站的交通動線，哪個網址對應到哪個頁面
const routes = [
  {
    path: '/product/:id', // 例如：商品詳細頁的路徑
    // 當使用者點到這個路徑時，才去下載 ProductDetail.vue 這個頁面的程式碼
    component: () => import('@/views/ProductDetail.vue'),
    meta: { preload: true }, // 小技巧：如果是非常重要的頁面，可以考慮讓瀏覽器偷偷先下載一部分
  },
  {
    path: '/about', // 例如：「關於我們」頁面的路徑
    // webpackChunkName 可以幫打包後的程式碼檔案取個容易辨識的名字，方便管理
    component: () => import(/* webpackChunkName: "about" */ '@/views/AboutView.vue'),
  },
];
```

### 2️⃣ 第二步：圖片「瘦身」大作戰，美觀又不佔頻寬

吸睛的圖片很重要，但過大的圖片檔案卻是拖慢網站速度的頭號戰犯之一。我們的圖片最佳化策略包含：

1.  **量身打造，提供最適尺寸**：手機用戶就給他手機版的小圖，電腦螢幕大的用戶才給高解析大圖。用 `<picture>` 標籤和 `srcset` 屬性就能輕鬆搞定。
2.  **滑到再載入，節省用戶流量**：使用者還沒看到的圖片，先不用急著下載。等他快滑到圖片位置時，再悄悄載入，這就是「圖片懶載入」。
3.  **自動壓縮，精簡檔案大小**：在網站上線前，透過工具自動幫圖片「減肥」，去掉不必要的資訊，讓檔案變得更小巧。

```html
<!-- 範例：一張圖片，多種尺寸，還會自動懶載入 -->
<picture>
  <!-- 當螢幕寬度大於 1024px 時，優先使用這張大尺寸圖片 -->
  <source media="(min-width: 1024px)" srcset="/images/hero-large.jpg 1x, /images/hero-large@2x.jpg 2x" />
  <!-- 當螢幕寬度大於 640px 時，優先使用這張中尺寸圖片 -->
  <source media="(min-width: 640px)" srcset="/images/hero-medium.jpg 1x, /images/hero-medium@2x.jpg 2x" />
  <!-- 其他情況或手機上，就用這張小尺寸圖片 -->
  <img src="/images/hero-small.jpg" srcset="/images/hero-small.jpg 1x, /images/hero-small@2x.jpg 2x" alt="一張非常重要的形象圖" loading="lazy" />
  <!-- 加上這個屬性，瀏覽器就會自動幫我們做圖片懶載入 -->
</picture>
```

### 3️⃣ 第三步：網站「健康檢查」不可少，時刻監控核心效能指標

最佳化不是一次性的任務，我們還需要持續監控網站的「健康狀況」。Google 提出了一些「網站核心體驗指標」(Core Web Vitals)，像是網站主要內容的載入速度
(LCP)、使用者首次互動的延遲時間 (FID)、頁面視覺的穩定性 (CLS) 等。我們把這些指標也納入 GA4 的追蹤範圍，隨時掌握網站的表現是不是在最佳狀態。

```javascript
// 監控網站的「健康指數」
export const trackWebVitals = () => {
  if (typeof window.gtag !== 'function') return; // GA4 沒啟動，今天休息

  // 一個小幫手函數，幫我們把監測到的資料回報給 GA4
  const trackMetric = (name, value, id) => {
    window.gtag('event', name, {
      // 事件名稱直接用指標的名稱，例如 LCP、FID
      event_category: 'Web Vitals', // 在 GA4 裡做個分類，方便查看報告
      value: Math.round(name === 'CLS' ? value * 1000 : value), // 把數值稍微處理一下，方便閱讀
      event_label: id, // 每個指標都會有一個獨特的 ID
      non_interaction: true, // 告訴 GA4 這不是使用者主動的互動，不要影響跳出率等資料的計算
    });
  };

  // 使用 web-vitals 這個好用的函式庫來幫我們收集這些效能資料
  webVitals({
    getCLS: trackMetric.bind(null, 'CLS'),
    getFID: trackMetric.bind(null, 'FID'),
    getLCP: trackMetric.bind(null, 'LCP'),
    getFCP: trackMetric.bind(null, 'FCP'), // First Contentful Paint，使用者看到第一個內容出現的時間
    getTTFB: trackMetric.bind(null, 'TTFB'), // Time to First Byte，瀏覽器收到伺服器第一個位元組的時間
  });
};
```

## 🌟 讓 Google 愛上我：SEO 最佳化實戰分享

網站做得再棒，如果 Google 大神找不到，那也是英雄無用武之地。所以，SEO (搜尋引擎最佳化) 也是我們努力的重點項目。

### 1. 📝 讓每個頁面都有專屬「識別證」：動態 Meta Tags

SPA 網站常常所有頁面都共用同一個 HTML 骨架，這樣 Google 可能會「霧煞煞」，搞不清楚每個頁面的主題是什麼。我們利用 Vue Router 的「導航守衛」這個酷功能，
在每次切換頁面時，動態更新頁面的標題 (`<title>`) 和網頁描述 (`<meta name="description">`) 等重要資訊，就像幫每個頁面都準備一張獨一無二的「數位識別證」
。

### 常見迷思：CSR 應用程式也能做好 SEO！

過去很多人以為只有 SSR (Server-Side Rendering) 才能做好 SEO，但這次專案經驗證明，現代的 CSR (Client-Side Rendering) 應用程式也能輕鬆應對搜尋引擎優化。
特別是 Vite + Vue3 的組合，提供了極佳的開發體驗和效能表現，讓我們能輕鬆實現動態 Meta Tags、預渲染等 SEO 最佳實踐。

```javascript
// 在 Vue Router 每次完成換頁動作後，執行一些事情
router.afterEach(to => {
  // 拿到新頁面預先設定好的標題，如果沒有就給它一個預設標題
  const title = to.meta.title || '這是我的網站預設標題';
  document.title = `${title} | 我的網站名稱`; // 更新瀏覽器頁籤上顯示的標題

  // 同樣的道理，更新其他重要的 meta 標籤，例如網頁描述、分享到社群媒體時的預覽圖、標準網址等
  updateMetaTags({
    title: title,
    description: to.meta.description || '這是我的網站預設描述',
    image: to.meta.image || '/default-og-image.jpg', // 設定分享時的預覽圖片
    url: window.location.href, // 設定標準的頁面網址
  });
});
```

### 2. 🚀 為 Google 搜尋引擎開「快速通道」：預渲染關鍵頁面

雖然 Google 搜尋引擎越來越厲害，看得懂 JavaScript 動態產生的內容，但有時候還是主動幫它一把比較穩當。對於那些我們希望在搜尋結果中能有亮眼表現的「重點頁
面」(例如首頁、產品列表頁)，我們可以使用「預渲染」(Prerendering) 技術。簡單來說，就是在網站打包上線前，先把這些頁面「預先畫好」變成靜態的 HTML 檔案，
這樣 Google 爬蟲一來就能馬上看懂頁面內容，不用辛苦地等 JavaScript 執行完畢。

```javascript
// vite.config.js (如果是使用 Vite 作為建置工具的專案設定檔)
export default {
  plugins: [
    vue(),
    // PrerenderSPAPlugin 這個好用的工具可以幫我們完成預渲染的工作
    PrerenderSPAPlugin({
      staticDir: path.join(__dirname, 'dist'), // 告訴它打包後的檔案會放在哪個資料夾
      routes: ['/', '/about', '/products', '/contact'], // 指定哪些路徑的頁面需要被預渲染
      renderer: new PrerenderSPAPlugin.PuppeteerRenderer({
        // 設定在頁面觸發一個叫做 'render-event' 的事件之後才開始進行渲染
        // 這樣可以確保頁面上的動態內容都已經載入完成
        renderAfterDocumentEvent: 'render-event',
      }),
    }),
  ],
};
```

## 🎯 後記：專業成長與未來展望

這次專案讓我對現代網頁開發有了更深入的認識，特別是在 GA4 資料分析與前端效能優化的實務應用上。透過這次經驗，我不僅累積了寶貴的技術資產，也磨練了問題解
決與團隊協作的能力。

在技術快速演進的今天，持續學習與自我提升是工程師不可或缺的素養。我期待能將這些經驗應用於未來的專案中，並持續探索更多創新的技術解決方案。

如果您對這個專案有任何想法或合作機會，歡迎隨時與我聯繫。感謝您的閱讀！

---

<div style="text-align: center;">
  <img
    src="/images/harry-fan.webp"
    alt="Harry Fan"
    style="max-width: 300px; border-radius: 50%; margin: 0 auto; display: block;"
  />
  <h3>Harry Fan</h3>
  <p>前端工程師 | 網站效能優化愛好者</p>
  <p>熱愛探索新技術，專注於打造流暢的使用者體驗</p>
</div>
