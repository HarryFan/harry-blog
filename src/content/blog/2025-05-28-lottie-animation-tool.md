---
title: '原來如此！我居然錯過了這個動畫神器這麼久😳'
pubDate: 2025-05-28
description: '探索 Lottie 動畫工具如何簡化網頁動畫開發，從設計到實現的完整指南'
tags: ['動畫神器', 'Lottie教學', 'Vue前端開發', '免費動畫', '網頁動效']
heroImage: '/stagewise-full.BxTLA-IW.png'
---

最近在做官網動畫時，無意間發現一個超像發現新大陸的寶藏工具 —— **Lottie**。

以前一直以為，網頁動畫要不是用 CSS 搞半天，不然就得拜託設計師用 AE 弄影片、轉 MP4、轉 GIF，整個超痛苦又重。

但這次我真的要說一句：

👉 **原來 Lottie 不只是給設計師用的，它根本就是動畫界的 CDN 啊！**

<video width="100%" controls>
  <source src="/videos/螢幕錄影_2025-05-22_上午8.51.25.mov" type="video/mp4">
  您的瀏覽器不支援 video 標籤。
</video>

---

## ✅ 原來 Lottie 有這些優勢我都不知道：

1. **有成千上萬個免費動畫可以用**

   👉 [LottieFiles](https://lottiefiles.com/) 裡面超多開源動畫，品質都很高，幾乎想得到的都有！

2. **根本不用會 AE！**

   雖然 Lottie 的來源動畫通常是從 After Effects 輸出，但我發現有個工具叫 [**LottieLab**](https://www.lottielab.com/)，完全可以在瀏覽器編輯動畫、改顏色
   、加互動，而且還可以輸出成 JSON、GIF、MP4！

3. **開發端整合爆簡單！**

   只要裝一個套件 `@lottiefiles/lottie-player`，在 Vue、React、甚至原生 HTML 裡都能直接用 Web Component 播放動畫，還能設定 loop、autoplay、speed！

---

## 😳 原本還以為要去學 Canvas / WebGL...

身為前端我一度以為，要做出炫炮動畫一定得學 canvas 或 WebGL，那種數學一堆又超吃效能的技術。但結果發現：

👉 **只用 Lottie 生態系，速度快、品質高、動畫檔案還超輕量！**

尤其像下面這些情境，用 Lottie 簡直剛剛好：

- 行銷頁面的動畫 banner、CTA 動效
- SaaS 登入頁或 Loading 動畫
- App onboarding 過場動畫
- 官網 Hero Section 的視覺吸引動畫
- 聯絡表單送出時的小互動動畫

這些**不需要 3D、即時計算**的動畫類型，用 Lottie 做真的是性價比超高。

---

## 🎯 不同角色的使用組合推薦

| 身份                  | 建議工具組合                  | 特點                                   |
| --------------------- | ----------------------------- | -------------------------------------- |
| 前端工程師            | `lottie-player` + LottieFiles | 無腦套用開源動畫，開發效率爆表         |
| 設計師                | AE + Bodymovin / LottieLab    | 自己做動畫，完整保有細節與控制權       |
| UI 設計師（用 Figma） | Phase + LottieFiles           | 用 Figma 動畫轉出，直接傳給開發        |
| 自媒體接案者          | LottieLab + JSON + GIF 輸出   | 可以當社群貼圖、Loading 特效，應用很廣 |

---

## 💰 那費用呢？免費嗎？

- **LottieFiles**：免費瀏覽與下載素材
- **LottieLab**：提供免費版，可線上編輯 Lottie 動畫，高階功能如串流、團隊協作需訂閱付費
- **Phase（Figma 動畫插件）**：目前基本功能免費
- **lottie-player 套件**：完全免費，可直接安裝使用

---

## 🔧 我怎麼用在實戰專案裡？

我現在已經把這整合進我的 Vue 3 專案裡了，還加上了 Tailwind CSS 做 UI，打造一個「**vue-lottie-ui-starter**」樣板專案，只要一行 HTML 就能播放動畫，完全
無痛整合！

```html
<lottie-player src="https://assets10.lottiefiles.com/packages/lf20_tll0j4bb.json" background="transparent" speed="1" loop autoplay />
```

---

## 結語：拜託早點讓我知道這個啊！

Lottie 真的讓我重新認識了「動畫不只是設計師的事」，

對前端來說，它就像是從 Photoshop 進入到 Canva 的感覺，**門檻降超多，效果卻一樣強大！**

如果你跟我一樣還沒玩過，真的推薦馬上開一個 Lottie 專案來玩玩！

---

📌 推薦資源：

- 🔗 [LottieFiles 免費動畫素材](https://lottiefiles.com/)
- 🔧 [LottieLab 線上動畫編輯](https://www.lottielab.com/)
- 🎨 [Phase 插件（Figma 導出動畫）](https://www.phase.com/zh-TW)

#動畫神器 #Lottie 教學 #Vue 前端開發 #免費動畫 #網頁動效 #原來如此 #發現新大陸 #前端必學工具 #不用 WebGL 也能炫

## 範例專案

https://github.com/HarryFan/vue-lottie-ui-starter

## 我是 Harry, 與您分享前端的路上會用到的一些技巧及觀念

<div style="text-align: center;">
  <img
    src="/images/harry-fan.webp"
    alt="Harry Fan"
    style="max-width: 300px; border-radius: 50%; margin: 0 auto; display: block;"
  />
  <p style="font-style: italic; margin-top: 10px;">(手上拿的不是衛生紙，是烤鴨三吃)</p>
</div>

每個人看事情的觀點及角度、生命歷程都不一樣，一切以你思考過後得到的想法為主。

歡迎之後有其他前端聚會可以邀請我參加，只要我時間允許，歡迎告訴我活動訊息。

我的連絡電子信箱：harry750110@gmail.com Line：harryvan 臉書：Harris Fan

---

> 參考來源：[Lottie 動畫神器](https://uneven-tarantula-5e0.notion.site/1fb48a1740bf80e5995ff4f28d37e0f0)
