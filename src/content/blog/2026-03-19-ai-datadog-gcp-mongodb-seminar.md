---
title: 'AI 驅動的次世代數位體驗平台：Datadog × Google Cloud × MongoDB × 17LIVE'
pubDate: 2026-03-19
description: '從可觀測性、資料平台到 Agentic AI 的實戰拼圖：三家廠商與 17LIVE 如何把 AI 應用「養大養穩」。'
heroImage: '/blog-placeholder-2.jpg'
---

台北萬豪的下午三點，窗外光線斜斜打進來，場內還在消化剛才的下午茶。這是一場三家廠商聯合辦的技術 Seminar，主題是「AI 驅動的次世代數位體驗平台」。Datadog、Google Cloud、MongoDB，加上壓軸的 17LIVE 實戰分享——聽起來像是各說各話的產品介紹場，但坐完整場下來，卻有種意外的完整感。

三家公司講的其實是同一件事，只是從不同角落切入：你的 AI 應用要跑得穩、跑得久，光靠語言模型是不夠的。可觀測性、資料架構、智慧應用，缺一塊都是跛腳。

Datadog 的工程師開場沒有廢話，直接借用 Google SRE 的可靠性金字塔——最底層是 Monitoring，往上一路到 Product——然後丟出今天的核心命題：可靠性是建立在可觀測性的基礎之上的。聽起來像廢話，但往下展開就不是了。

他們描述了一個非常真實的客戶場景：GCP 上的 ToC AI 服務公司，GKE 跑核心服務、Serverless 處理 API、Vertex AI 負責 LLM、資料庫掛著 MongoDB Atlas。架構圖畫出來很漂亮，但出事的時候就變成一張蜘蛛網：DBA 看到慢查詢、SRE 看到 Pod CPU 飆高、前端收到使用者說「頁面一直轉圈」。三組人看到三件不同的事，卻在描述同一個問題——只是沒有人知道。排查就變成了人工拼圖。

## Datadog：把全鏈路觀察串成一條線

- Integrations 打破資料孤島；GCP、K8s、Serverless、第三方服務開箱即看
- Database Monitoring 直擊 MongoDB：Slow Query、Explain Plan、未用索引檢出
- APM × RUM 串起前後端，用戶點擊一路追到上游 403
- Bits AI SRE 自動化排查與建議，縮短 MTTR，讓新人也能獨立處理 Incident

## MongoDB：把「正確的資料」丟給模型

- Atlas Vector Search + Voyage AI：更好的 Embedding 與 Reranker，降低幻覺
- Hybrid Search 結合語意與關鍵字；資料與搜尋放在同一平台，架構更簡
- Shared Codebook：離線用大模型向量化、線上用 nano 模型查詢，成本降
- 真實案例：Novo Nordisk 將 19 週法規流程縮到 1 週，每日多出千萬美金潛在營收

## Google Cloud：Agentic AI 與企業級落地

- Gemini 3.1 Pro 與 Flash‑Lite：更高性價比模型組合
- Embedding 2 支援多模態（含音訊），語意檢索更接近真實意圖
- ADK 提供 Single/Sequential/Parallel/Loop/Hierarchy/Network 六種 Agent Pattern
- Gemini Enterprise：在企業 VPC 內運行，透過 Connector 串接內部系統

幾個亮點：

- 模型升級策略：新一代常定位於「取代上一代的上個等級」，如 3.1 Flash‑Lite 能替代 2.5 Flash，能力更好、價格更低。
- Embedding 2 多模態（含音訊）：不再只把聲音轉文字，直接向量化聲音與影片，保留語調、停頓、情緒等「字面看不到」的訊息。
- Agentic Patterns：從單步到多代理協作（Hierarchy/Network），ADK 直接支援多種工作流，不必從零刻。
- Enterprise 部署：VPC 內運行 + Connector 串企業內部系統，合規與資料安全到位。

## 17LIVE 實戰：被幾萬人同時壓的真實世界

- 架構：Akamai CDN → CLB/Envoy → 五大服務域 → MongoDB/Redis/MySQL
- 兩種 Spike：可預期活動流量與突發互動流量；Redis 扛快取、MongoDB 快速重算排行榜
- Incident 協作：Agentic Incident Coordinators 自動更新狀態，避免「太多廚師在廚房」
- 預測擴縮：Vertex AI 預測高峰時間，GKE 提前擴容、活動後自動回縮
- 「說實話的朋友」：用 Vector Search 輔助主播理解自身長處與相鄰內容領域

更多實戰細節：

- ANR 追根究柢：串 Crash/ANR/Streaming/User 行為到 BigQuery 與 Vertex AI，查根因而非只處理症狀。
- 流量極端瞬間的治理：預熱擴容 + 快取策略 + 排行榜重算，兼顧體驗與正確性。

## 給前端工程師的啟發

- 可觀測性不只後端：體驗從前端開始，根因常在後端；要看整條鏈路
- Agentic Patterns = 更大的 async 流程控制：把人從「逐步執行者」翻成「定義者」
- 多模態 Embedding 的內容工作流想像：文件、圖像、影片、音訊統一進向量空間

---

來源：<https://uneven-tarantula-5e0.notion.site/AI-Datadog-GCP-MongoDB-Seminar-32748a1740bf8052aff5f2856042090f?pvs=143>
