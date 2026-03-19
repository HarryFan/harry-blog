---
title: '3 分鐘串好 Telegram Bot：GDG Taipei「Build with AI」活動筆記'
pubDate: 2026-03-19
description: '從零到通：用 Gemini CLI＋MCP 打造自動摘要推播的 Telegram Bot，並把資安與成本控制編進工作流。'
heroImage: '/blog-placeholder-4.jpg'
---

我以為 Telegram Bot 是工程師才碰得到的東西。
結果昨晚花了不到三分鐘就串好了。
然後我坐在那邊發呆了五分鐘。

我是做前端的，平常的世界就是 HTML、CSS、JavaScript 這三本柱。後端怎麼跑、API 怎麼串、Bot 怎麼建——那些對我來說一直像是隔壁部門的事，聽得懂幾個關鍵字，但真的要動手就卡住。Telegram Bot 更是如此，用過很多，從來沒想過自己可以做一個。

直到昨晚去了 GDG Taipei 的 Build with AI 2026 系列活動，才發現那扇門根本沒鎖。我只是從來沒走過去試試看而已。

講師 Jimmy Liao 是 Google AI GDE，一開場就問了一個很扎心的問題：你每天到底被多少資訊淹沒？Hacker News、Medium、Reddit、各種技術 newsletter——每天少說一百篇文章在等你，但根本沒時間一篇一篇看，更別說整理成一句話發給同事。重要的東西就這樣靜靜地被時間流沖走。

他給的解法很直接：讓 AI 自動抓 RSS、生成繁中摘要、直接推播到 Telegram。全程不用人盯，24 小時自己跑。

但在講「怎麼做」之前，他先回答了一個問題——現在市面上有一類工具，標榜「你說目標、我負責全部」，聽起來像請了一個不用睡覺的工程師助理。Jimmy 直接點出幾個真實地雷：

- AI 很難分辨「指令」和「資料」，萬一處理到惡意內容，可能直接被挾持執行任意程式碼
- API Key 常常明文躺在設定檔裡，被偷走你甚至不知道
- 一旦 AI 跑進無限迴圈，Token 費用像水龍頭沒關一樣往外流，等你發現帳單已經炸了

他的結論一針見血：「定義邊界，再讓 AI 衝刺。你的新角色不是寫扣機器，而是懂資安的 Agent 架構師。」

整場課圍繞著 Gemini CLI，一個可以在 terminal 裡直接跟 Gemini 對話、用自然語言操作整個開發流程的工具。Skills 是按需載入的能力模組，不佔 context window。你只要說「幫我看剛才改了什麼、順便寫 commit message」，它自己知道要跑 git diff、分析變更、輸出標準格式——以前要手動做的事，說一句話就解決。

Hooks 是我覺得最精彩的概念。Agent 要寫檔案之前，可以強制它先跑測試，測試沒過就直接擋住。每次 AI 回應之後，自動記錄 token 用量，超過預算就警告。比起「拜託 AI 不要亂動」，把防線硬編進工作流裡，踏實多了。

MCP 讓你用自然語言呼叫外部服務。設定好 GitHub MCP server 之後，直接說「幫我列出所有 open PR」就好，不需要自己寫 API 呼叫，未來想接 Notion、Slack 都不用動核心程式碼。

Checkpointing 解決一個很現實的焦慮：Agent 改壞了怎麼辦？每次修改檔案時自動建立 snapshot，出事就 /restore 一鍵回去，完全不影響自己的 git repo。

Headless Mode 才是真正自動化的那一塊。接上 Cron Job，每天早上八點自己跑，完全不用人介入。

## 3 分鐘串好 Telegram Bot

設定流程簡單到有點不真實：

1. 去找 @BotFather、輸入 `/newbot`、取個名字，幾十秒就拿到 Token
2. 再找 @userinfobot 拿到自己的 Chat ID
3. 把這兩組數字填進 `.env`，完成

講師特別提醒一個很容易踩的坑：一定要自己先去跟 Bot 說 Start，否則發訊息會一直收到 `chat not found`，找半天找不到原因。

Hands-on 結束，我感受到一個很誠實的落差：Streamlit 跑起來之後，你還是要手動按「Fetch」、手動按「Summarize」、手動按「Publish」，訊息才會出現在 Telegram。跟心中「全自動新聞助手」的想像，中間還差一段。

後來想清楚了：那個 UI 本來就只是「讓你看懂流程在幹嘛」的爆炸圖，幫你認識每個零件在哪裡。真正的自動化要靠 Headless Mode 接上 Cron Job 才算完整。這個 repo 更像一個骨架搭好的起點，剩下的要自己補。這也是我下一步想動手的地方。

## 我想到的五個實戰場景

乍看之下今天學的東西跟 WordPress 案子有點距離。但仔細想一想，Telegram Bot 能做的事，其實可以直接插進 WP 的工作流裡：

- 表單通知：Contact Form 7 / Gravity Forms 送出即時推播，不用賭 email
- 站點健康監測：WP 異常或伺服器沒回應，自動推播警報
- 訂單事件：WooCommerce 新訂單／付款成功／退款申請即時追蹤
- 新文發布：文章發布後生成摘要推播至頻道
- 週報自動化：每週一早上自動抓後台數據，整理 KPI 推給客戶

對我來說，今晚最大的收穫不是哪個指令或哪個架構，而是那種「原來可以這樣」的感覺。Telegram Bot 不再神秘，自動化不再是隔壁部門的事，那些之前覺得「那是後端在做的東西」，現在至少知道從哪裡開始摸。每樣東西都還有很多細節要補，但「我知道怎麼開始」這件事本身，就已經是很大的成長了。

Build with AI 今年在台北預計辦 15 場，下一場排進去就對了。

每個人看事情的觀點及角度、生命歷程都不一樣，一切以你思考過後得到的想法為主。歡迎之後有其他前端聚會可以邀請我參加，只要我時間允許，歡迎告訴我活動訊息
我的連絡電子信箱：harry750110@gmail.comLine：harryvan
臉書：Harris Fan

---

來源：<https://uneven-tarantula-5e0.notion.site/Telegram-GDG-Build-with-AI-4-31f48a1740bf80a9b1b6c9dd1909bbde?pvs=143>
