---
title: '讓 Claude Code 接手你正在用的 Chrome，當你的瀏覽器自動化助手'
description: '透過 chrome-cdp-skill 這個 Claude Code Skill，Claude 可以接手你「現在正開著、已經登入好」的那個 Chrome，幫你彙整分頁資訊、抓 DOM、截圖、填表單、做前端除錯。安裝一行指令，啟用撥一個開關，不到五分鐘。'
pubDate: 2026-06-19
---

先講結論：你不用再為了讓 AI 幫你做事，特地另外開一個乾淨的瀏覽器、重新登入一次帳號。裝上 chrome-cdp-skill 這個 Claude Code Skill 之後，Claude 可以直接接手你現在開著、而且已經登入好的那個 Chrome，幫你彙整分頁上的資訊、抓 DOM、截圖、填表單、點按鈕。安裝就一行指令，啟用就在 Chrome 裡撥一個開關，前後不到五分鐘。

要先講清楚定位：它動的是**你自己**那個瀏覽器、你自己已經登入的頁面，重點是把你手邊原本要手動做的事自動化掉，不是叫它去繞過授權攻別人的網站。請在你有權限存取的內容上使用，這點很重要。

這篇我從「為什麼要用」一路寫到「實際裝起來、用 Claude Code 跑第一個任務」，最後是安全注意事項——這段很重要，用之前請務必看完。

## 它到底解決了什麼

以前用 Playwright、Selenium、Puppeteer 這類工具，每次都會開一個全新、乾淨、什麼登入狀態都沒有的瀏覽器。所以只要你要爬的網站需要登入，帳密、OAuth、驗證碼就全部得自己想辦法處理，光想就累。

Chrome CDP（Chrome DevTools Protocol）的做法完全相反——它直接連上你正在用的那個 Chrome。差別在哪：

- **登入狀態和 Cookie 都還在**：你已經登入的 Gmail、GitHub、公司內部系統，Claude 直接就看得到，不用再登一次。
- **看到的是當下的真實畫面**：不是重新整理過的乾淨頁面，就是你工作到一半的那個狀態。
- **可以一次處理很多分頁**：列出所有開著的分頁、截圖、抓結構、跨分頁比對，都做得到。
- **不用裝一堆肥依賴**：chrome-cdp-skill 只要 Node.js 22+，不用 `npm install`，也不用 Puppeteer 或 Playwright。

這裡有個地方很多人會誤會：CDP 連的是你本來就開著的 Chrome，省下的是「再多開一個瀏覽器」的成本，不是「比 headless 更省記憶體」。你那個開了幾十個分頁的 Chrome，本身一樣很吃資源。講白一點，它幫你省的是重複啟動瀏覽器跟重新登入的麻煩，不是記憶體。

## 平常可以拿來做什麼

**前端除錯**：工程師可以叫 Claude 抓 DOM、看 console、截全頁圖，幫忙看自己開發中的 UI 是哪裡壞掉。這大概是最直接、也最不會踩到別人的用法。

**自動化你自己的日常流程**：一次讀好幾個你開著的分頁，幫你彙整報表、整理你自己後台的數據，或是把一篇你正在讀的長文濃縮完直接貼進你的編輯器。

**整理你已登入服務裡的資訊**：像是把你自己 GitHub 的未讀通知、你自己信箱的待辦、你自己訂單頁面的狀態，抓出來整理成清單，省去人工複製貼上。

**社群跟內容輔助**：看你自己經營的社群頁面當下的狀態，幫你草擬回覆或發文。

> 共通前提：上面這些都是在操作**你自己有權限的頁面**。要去抓公開或第三方網站的資料前，先確認對方的服務條款跟 `robots.txt` 允不允許，別把這工具拿去做你本來就不該做的事。

## 怎麼裝

### 先準備好這些

- Node.js 22 以上（就只有這一個執行時依賴）
- 已經裝好 Claude Code
- 一個 Chromium 核心的瀏覽器，Chrome、Chromium、Brave、Edge、Vivaldi 都行（macOS、Linux、Windows 都可以）

先確認 Node 版本：

```bash
node --version
# 需要 v22.x.x 以上
```

### 第一步：安裝 Skill

chrome-cdp-skill 的核心其實就是 `skills/chrome-cdp/` 這個資料夾。你只要把它放到 Claude Code 會載入 skill 的地方就行了。

**方法 A：直接 clone 到 Claude Code 的 skills 目錄**

```bash
cd ~/.claude/skills
git clone https://github.com/pasky/chrome-cdp-skill.git
```

clone 完，把 `chrome-cdp-skill/skills/chrome-cdp/` 這個子目錄搬到 `~/.claude/skills/` 底下，讓 Claude Code 能直接掃到裡面的 `SKILL.md`；或者看你 Claude Code 的版本，直接保留 clone 下來的結構也可以。

**方法 B：用 pi 套件管理器裝（如果你有在用 pi）**

```bash
pi install git:github.com/pasky/chrome-cdp-skill@v1.0.1
```

> 補一句：這個 skill 設計成可以給很多種 agent 用（Claude Code、Cursor、Amp 等等），核心就是 `skills/chrome-cdp/` 這個目錄。不管你用哪種方式，只要這個目錄有被你的 agent 載入，就能用。

### 第二步：把 Chrome 的遠端除錯打開

這步是這個 skill 比傳統做法輕鬆的地方。你不用關掉 Chrome，也不用從終端機帶 `--remote-debugging-port=9222` 重開——那是舊做法了。

現在只要：

1. 在 Chrome 網址列輸入 `chrome://inspect/#remote-debugging`
2. 把頁面上那個開關撥開
3. 沒了，這樣就好。

CLI 會自動偵測你的瀏覽器跟對應的 debug port。

> 進階：如果你的瀏覽器把 `DevToolsActivePort` 存在比較奇怪的位置，設一個環境變數 `CDP_PORT_FILE` 指到那個檔案的完整路徑就行。

### 第三步：重啟 Claude Code

讓 Claude Code 重新掃一次、把 skill 載進來。你可以用 `/skills` 這類指令確認 `chrome-cdp` 有出現在清單裡。

## 用 Claude Code 操控瀏覽器

裝好以後，你其實不用記任何 CLI 指令——直接用講的叫 Claude 做事就好，它會自己去呼叫這個 skill。不過知道底下的指令在幹嘛還是有幫助，至少你想自己手動測的時候知道怎麼下。

### 底層 CLI 指令對照

| 指令 | 作用 |
| --- | --- |
| `cdp list` | 列出所有開著的分頁 |
| `cdp shot tab1` | 對指定分頁截圖 |
| `cdp snap tab1` | 抓該分頁的無障礙樹（accessibility tree） |
| `cdp html tab1 ".main"` | 抓指定 CSS selector 的 HTML |
| `cdp click tab1 ".button"` | 依 selector 點擊元素 |
| `cdp type tab1 "Hello AI"` | 在聚焦的元素輸入文字 |

### 實際對話範例

裝好之後，在 Claude Code 裡你可以直接這樣講：

**範例一：抓登入後才看得到的資料**

> 「我現在 Chrome 開著我的 GitHub notifications 分頁，幫我把所有未讀通知的標題和連結整理成一個清單。」

Claude 會自己列出分頁、找到那個 GitHub 分頁、抓結構、整理成清單給你，全程用你已經登入的 session，你不用給任何帳密。

**範例二：跨分頁比對**

> 「我開了三個分頁分別是三家飯店的訂房頁面，幫我比對它們的價格、可取消政策、含不含早餐，做成表格。」

**範例三：整理動態載入的後台資料**

> 「幫我打開我自己後台的訂單列表，往下滾動把所有載入的訂單編號和金額抓下來，存成 CSV。」

**範例四：自動填表單**

> 「這個分頁的表單，幫我把姓名填『Harry Fan』、email 填我的工作信箱，然後先不要送出，截圖給我確認。」

### 關於 daemon 的小知識

chrome-cdp 的設計是每個分頁都會留一個常駐的背景 daemon。好處是 Chrome 那個「允許偵錯」的彈窗，每個分頁只跳一次，而不是你每下一個指令就跳一次——所以就算你開了 100 多個分頁，它也跑得穩。Daemon 閒置 20 分鐘後會自己結束。

## 安全注意事項（請務必看完）

這個工具的優點跟風險其實是同一件事的兩面：它能存取你所有已經登入的 session，反過來說，任何能連上那個 debug 通道的程式，理論上也能完全控制你的瀏覽器——你的 Gmail、公司系統、銀行分頁全都算在內。

實際使用請守住這幾點：

- **只在你信得過的環境開**：不要在公共 Wi-Fi、共用電腦上開遠端除錯。用完就把 `chrome://inspect/#remote-debugging` 的開關撥回去關掉。
- **不要把 debug port 對外開放**：遠端除錯預設只綁 `127.0.0.1`（也就是本機）。千萬不要為了遠端存取，把它綁到 `0.0.0.0` 或對外網開放。
- **裝之前先看一下程式碼**：裝任何第三方 skill 之前，最好先翻一下它的腳本內容。Anthropic 管不到、也沒辦法保證第三方 skill 的行為。
- **危險操作先讓它停下來確認**：像範例四那樣，遇到送出表單、發訊息、刪除這種收不回來的動作，叫 Claude 先截圖或先把它要做的事列出來給你看，確認過再做。
- **重要帳號考慮另開一個 profile**：如果你會常常跑自動化，可以另外開一個 Chrome profile 專門做這件事，跟你平常的主 profile 分開，誤操作的風險會低很多。

## 講一句總結

chrome-cdp-skill 把 Chrome DevTools Protocol 這個底層能力，包成一個在 Claude Code 一行就裝好、一個開關就啟用的 skill，讓你用講的就能叫 Claude 接手你正在用的那個真實瀏覽器，幫你彙整、比對、填表單。它幫你省的是手動操作跟重複登入的時間——前提是你只動自己有權限的頁面，並把存取安全管好。

---

參考來源：[pasky/chrome-cdp-skill（GitHub）](https://github.com/pasky/chrome-cdp-skill)官方說明文件
