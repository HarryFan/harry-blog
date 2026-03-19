---
title: '把協作當成系統設計：我們的 CLAUDE.md 與最小改動原則'
pubDate: 2026-03-19
description: '重來一次比寫程式更耗力。用 CLAUDE.md 把規則寫到專案根目錄，讓人與 AI 都在同一套框架下協作。'
---

`CLAUDE.md` 一定要放在「專案根目錄（repository root）」而且要跟 `README.md`、`package.json` 同一層。

```text
my-project/
├─ CLAUDE.md
├─ README.md
├─ package.json
├─ pnpm-lock.yaml
├─ src/
├─ docs/
└─ specs/
```

老實說，這套做法不是一開始就規劃好的。它是很多次多人協作、反覆改需求、處理 merge conflict，以及一次又一次看到「明明專案裡已經有現成做法，卻還是重寫一套」之後，慢慢逼出來的。

最後我得到一個很直接的結論：真正拖慢專案的，從來不是寫程式，而是不斷重來、不斷修正理解、不斷重複造輪子。

在多人協作裡，最耗能的事情通常不是技術，而是這些狀況：

- 每個人對「應該怎麼做」的理解不同
- 改需求時，很難快速判斷影響範圍
- Code review 變成在討論風格、習慣，而不是問題本身
- 同樣的提醒，要一再重複對人、對 AI 說

如果這些原則只靠默契或對話傳遞，它一定會失真。所以我選擇把它們寫成一份 `CLAUDE.md`，放在專案根目錄，讓它變成：人、AI、與 code review 都共同遵守的協作規則。

透過 OpenSpec，把需求先整理成結構化的規格，再用 `CLAUDE.md` 明確限制「可以做什麼、不能做什麼」。結果是：

- 討論次數變少
- 誤解發生得更早（不會寫到一半才發現方向錯了）
- 前期溝通時間實際少了約 30～50%

最大的改變其實是一個工作順序的轉換：改需求時，我先確認「哪些不用動」，而不是急著想「要加什麼」。因為規則要求：

- 先列出最小必要改動的檔案
- 先確認影響範圍
- 嚴禁順便重構或整理

這讓改需求變成一個「可預期的小調整」，而不是一次高風險的重構。

在像 Vben Admin 這種後台框架裡，「自己再寫一套」往往不是效率，而是技術債的開始。我們把「框架優先、禁止重複造輪子」寫成明確規則後：

- 多數功能只需要調整既有組件或設定
- 很少再出現自製 table / modal / form
- 專案風格與維護方式更一致

因為它把很多原本「不好意思講」的事情，變成：不是你對我，而是大家一起遵守同一份規則。Review 時我不需要說「我覺得你這樣寫不太好」，我只需要說「這裡不符合 CLAUDE.md 裡的最小改動或重用原則」。

## CLAUDE.md（放在專案根目錄）

```md
# 專案開發指引

## 專案架構說明
本專案基於 **Vben Admin** 框架開發，是一個多人協作的後台管理系統。

### 🔧 框架重用原則
⚠️ **禁止重複造輪子** - Vben Admin 已提供大量開箱即用的功能和組件。

**開發前必須檢查**：
1. **組件庫優先**：
   - 檢查 `src/components/` 是否已有相似組件
   - 查看 Vben Admin 官方文檔確認內建功能
   - 優先使用框架提供的 hooks、utils、組件

2. **調整而非重寫**：
   - 如果現有組件 80% 符合需求，調整它而不是新建
   - 使用組件的配置選項和插槽來定制
   - 通過 props 和 events 擴展功能

3. **常見已有功能**（請勿重複實現）：
   - 表單驗證、表格操作、彈窗管理
   - 權限控制、路由守衛、標籤頁管理
   - 請求封裝、錯誤處理、loading 狀態
   - 主題切換、國際化、布局組件
   - 工具函數：日期處理、樹形數據、深拷貝等

**原則**：先搜尋、再調整、最後才考慮新建。減少不必要的程式碼。

---

## 開發原則
⚠️ **所有開發工作都必須遵循** `.claude/development-principles.md` 中定義的 YAGNI 原則和最小改動原則。

核心原則：
- 只修改完成任務「絕對必要」的文件
- 先分析、列出改動清單，等待確認後再執行
- 嚴禁「順便」優化、重構或改變代碼風格
- 記住：**最好的代碼是寫得最少的代碼**

詳細內容請參閱：`.claude/development-principles.md`

---

## Model Usage Strategy (Token Efficiency)

為降低 token 消耗並提升協作效率，本專案採用「模型分工」策略。

### 可使用較低成本模型的情境（如 Gemini）

僅限於 **前處理、分析、整理類任務**，包括但不限於：

- 條列既有程式碼結構
- 搜尋與彙整既有元件 / hooks / utils
- 列出可能重用的 Vben Admin 能力
- 產出「計畫修改的檔案清單」
- 產出「每個檔案預計修改內容說明」
- 將需求整理為結構化清單（不涉及設計決策）

### 強制限制

- 低成本模型 **不得**：
  - 產出實際實作代碼
  - 做架構設計或重構決策
  - 新增功能或提出實作方案
  - 違反本文件中任何開發原則

- 所有輸出必須：
  - 嚴格遵守本 `CLAUDE.md` 中的規範
  - 僅作為「輔助分析結果」，而非最終決策

### 必須使用 Claude 的情境

以下情境 **必須由 Claude 處理**：

- `/openspec:proposal` 的最終內容確認
- `/openspec:apply` 的實作與修改
- `/openspec:archive` 的規格收斂
- 任何涉及：
  - 實際程式碼修改
  - 設計選擇
  - Scope 判斷
  - 取捨與風險評估

### 原則

> 低成本模型負責「整理與檢索」  
> Claude 負責「判斷與執行」

不得自行切換角色或越權執行。

---

# OpenSpec Instructions

These instructions are for AI assistants working in this project.

Always open `@/openspec/AGENTS.md` when the request:
- Mentions planning or proposals (words like proposal, spec, change, plan)
- Introduces new capabilities, breaking changes, architecture shifts, or big performance/security work
- Sounds ambiguous and you need the authoritative spec before coding

Use `@/openspec/AGENTS.md` to learn:
- How to create and apply change proposals
- Spec format and conventions
- Project structure and guidelines

Keep this managed block so 'openspec update' can refresh the instructions.
```

## .claude/development-principles.md

```md
# 開發原則 (Development Principles)

## 專案背景
本專案基於 **Vben Admin** 框架開發，是一個多人協作的後台管理系統。

## 框架重用原則 - 禁止重複造輪子

### 開發前檢查清單
在實現任何功能前，**必須先檢查** Vben Admin 是否已提供相關功能：

1. **組件庫優先**：
   - 檢查 `src/components/` 目錄
   - 查閱 Vben Admin 官方文檔
   - 搜尋現有的 hooks、utils、組件

2. **調整而非重寫**：
   - 現有組件符合 80% 需求 → 調整配置
   - 使用組件的 props、slots、events 擴展
   - 避免複製貼上後修改（維護噩夢）

3. **Vben 已提供的常見功能**（請勿重複實現）：
   - 表單系統：驗證、動態表單、表單聯動
   - 表格系統：排序、篩選、分頁、導出
   - 彈窗管理：Modal、Drawer 組件
   - 權限系統：路由守衛、按鈕權限、數據權限
   - 標籤頁管理：多標籤、緩存、拖拽排序
   - 請求封裝：攔截器、錯誤處理、loading
   - 布局系統：側邊欄、頂欄、主題切換
   - 工具函數：日期處理、樹形數據、深拷貝等

### 決策流程
需要實現功能
    ↓
檢查 Vben 是否已有 ────→ 有 ────→ 直接使用或調整配置
    ↓ 沒有
檢查 src/components/ ───→ 有類似 ─→ 調整現有組件
    ↓ 沒有
確認無法重用 ─────────→ 新建（最後手段）

**原則：先搜尋、再調整、最後才新建。**

---

## 遵循 YAGNI (You Aren't Gonna Need It) 原則

### 1. 最小改動原則
- 只修改完成任務「絕對必要」的文件
- 不做任何「順便」的優化、重構或改進
- 不修改格式、不調整 import 順序、不改變現有代碼風格

### 2. 先分析後動手
- 先告訴我你計劃修改哪些文件
- 先告訴我每個文件具體要改什麼
- 等我確認後再開始修改

### 3. 嚴格禁止
- ❌ 修改不相關的文件
- ❌ 「順便」重構現有代碼
- ❌ 添加「可能以後用得上」的功能
- ❌ 改變現有的代碼結構

### 4. 執行步驟
- **Step 1**: 分析問題，列出最小必要改動
- **Step 2**: 向我確認改動範圍
- **Step 3**: 只修改確認過的部分
- **Step 4**: 完成後自我檢查是否有多餘改動

---

**記住：最好的代碼是寫得最少的代碼。**

---

## Model Usage Strategy (Token Efficiency)

為降低 token 消耗並提升協作效率，本專案採用「模型分工」策略。

### 可使用較低成本模型的情境（如 Gemini）

僅限於 **前處理、分析、整理類任務**，包括但不限於：

- 條列既有程式碼結構
- 搜尋與彙整既有元件 / hooks / utils
- 列出可能重用的 Vben Admin 能力
- 產出「計畫修改的檔案清單」
- 產出「每個檔案預計修改內容說明」
- 將需求整理為結構化清單（不涉及設計決策）

### 強制限制

- 低成本模型 **不得**：
  - 產出實際實作代碼
  - 做架構設計或重構決策
  - 新增功能或提出實作方案
  - 違反本文件中任何開發原則

- 所有輸出必須：
  - 嚴格遵守本 `CLAUDE.md` 中的規範
  - 僅作為「輔助分析結果」，而非最終決策

### 必須使用 Claude 的情境

以下情境 **必須由 Claude 處理**：

- `/openspec:proposal` 的最終內容確認
- `/openspec:apply` 的實作與修改
- `/openspec:archive` 的規格收斂
- 任何涉及：
  - 實際程式碼修改
  - 設計選擇
  - Scope 判斷
  - 取捨與風險評估

### 原則

> 低成本模型負責「整理與檢索」  
> Claude 負責「判斷與執行」

不得自行切換角色或越權執行。
```

## 在 Vben Admin 專案裡談 YAGNI 的真正意思

在一般 Vue 專案裡談 YAGNI，有時會被誤解成「先不要想那麼遠」。但在 Vben Admin 這種高度封裝、已有完整規範的後台框架裡，YAGNI 的意義其實更清楚，也更務實。因為在 Vben 裡，「未來」早就被框架替你想過一次了。

Vben Admin 不是一個空白框架，它已經幫你處理好：

- CRUD 頁面的典型流程
- Table / Form / Modal / Drawer 的組合方式
- 權限、路由、選單、快取的慣用解法
- request / loading / error handling 的一致做法
- hooks、utils、schema 的使用模式

這些本來就來自無數真實後台專案的需求總和。所以在 Vben 專案裡：你以為你在「為未來設計」，其實很可能只是重複做了一次 Vben 已經做過的事。

你一定不陌生這些句子：

- 「這個 Table 我自己包一個，之後比較好擴充」
- 「這個流程先抽一層，未來可能會用到」
- 「Vben 那個太複雜，我先寫一個簡單版」

在一般專案裡可能合理；但在 Vben 底下，幾乎都是在製造平行系統。結果通常是：同一種功能有兩套寫法、新人不知道該用哪一套、AI 也搞不清楚該遵循哪個 pattern、後期維護成本急速上升。

把話講白一點：Vben 的設計哲學，本身就很 YAGNI。它不是要你每次都發明新架構、每個需求都客製到極致，而是要你：在既有規範內解決 80～90% 的問題，真的不行，再「最小幅度」擴充。

---

來源：<https://uneven-tarantula-5e0.notion.site/CLAUDE-md-vben-admin-2e148a1740bf807f9ef5f1617f3b9e74>
