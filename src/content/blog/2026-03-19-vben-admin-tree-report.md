---
title: '🧩 用 Vben Admin 做多層樹狀報表：我踩了七個坑'
pubDate: 2026-03-19
description: '從 API 改版到 AntDV Table 展開機制，再到大資料量效能：一篇把樹狀報表踩坑與優化全走完的實戰筆記。'
heroImage: '/blog-placeholder-3.jpg'
---

這兩週我在 Vben Admin 上做一張複雜的組織樹狀報表：節點可展開子層、可切換彙總口徑、底部有總計列。資料量大到「幾十個父節點 × 每個下面幾十個子節點」，需求看起來沒什麼，實作起來坑踩了一個又一個。

如果你只想解「資料量大、展開卡頓」，可以直接跳到「坑 7」。前面幾個坑比較偏新舊 API 切換、資料結構與 UI 框架機制的互相踩踏。

## TL;DR

- API 從「懶載入子節點」改成「一次回完整樹」時，舊邏輯幾乎要重寫
- AntDV Table 的 tree-data 展開和 row expand 是兩套系統，混用會變黑盒
- 大資料量樹狀表格：互動效能關鍵是「改讀法，不改資料」，展開成本才能做到 O(1)

## 背景：API 改版讓資料結構整個變了

舊版是懶載入：使用者展開哪個節點，才去呼叫 API 拿子資料。

新版 API 直接一次回傳完整樹：

- 父節點
  - `list[]`: 各幣種 / 細項子資料
  - `childList[]`: 子組織（每個也有自己的 `list[]`）

看起來只是資料結構調整，實際上是整張表的渲染、展開、彙總、效能策略都會跟著變。

## 坑 1：console 有資料，表格卻白白一片

原因：舊版每個樹節點本身就有明細數值；新版節點本身只有彙總，明細在 `node.list[]` 裡。原本的 `formatData` 完全沒處理 `list[]`，產出來的列就是空殼。

解法：在格式化階段把每個節點的 `list[]` 展平成子列（加上 `__level`、`parentKey` 等 meta），掛到節點的 `children` 下，讓 AntDV Table 的 tree-data 能渲染。

## 坑 2：旁邊沒箭頭，使用者不知道可以展開

舊版靠 `hasSub` 欄位判斷有沒有子節點；新版 API 把 `hasSub` 改成回傳 `null`，判斷邏輯永遠是 `false`。

解法：改成 `node.children?.length > 0` 做 fallback。前端格式化後只要有子列就顯示箭頭，問題解掉。

## 坑 3：特定查詢條件下，父節點名稱欄是空的

例如只查某個幣種時，某些父節點名稱欄直接空白。

原因：新 API 的父節點層沒有直接帶 `code/name`，而是出現在 `list[0]` 裡；當查詢條件讓 `list[]` 變空，就讀不到名稱。

解法：做一個 lookup map，補名稱的優先順序：

1. 節點本身有就直接用
2. fallback 到 `node.list[0].code`
3. 最後去 lookup map（從其他查詢結果緩存）

## 坑 4：頁面初次載入後馬上查詢，有時候結果是空的，重查才有

這是一個 race condition：查詢函式依賴另一個非同步初始化（例如組織樹選單），但兩個幾乎同時發起，查詢先跑完時選單還沒 ready，查詢條件就缺了。

解法：在 `search()` 開頭加 guard，確保依賴資料已載入才繼續。

```ts
await until(orgTreeOptions).toBeTruthy();
```

## 坑 5：子節點有數據，父節點欄位卻全是 0

原因：新 API 設計是父節點聚合欄位由前端從 `list[]` 加總，後端沒有幫你算好塞在父節點上。

解法：格式化階段對每個父節點遍歷 `list[]`，把業績欄位加總後回填到節點：

```ts
const aggregated: Record<string, number> = {};

for (const item of node.list ?? []) {
  for (const field of METRIC_FIELDS) {
    aggregated[field] = (aggregated[field] ?? 0) + (item?.[field] ?? 0);
  }
}

Object.assign(node, aggregated);
```

## 坑 6：想把展開箭頭放到名稱欄，結果箭頭跑位或根本不出現

我試著設定 `expandIconColumnIndex`，結果箭頭跑到序號欄，或根本不出現。搞很久才弄清楚：AntDV Table 的 tree-data 展開（`children`）和 row expand（`expandedRowKeys` / `rowExpandable`）是兩套獨立的機制，混用時行為很難預測，文件也不會告訴你它們怎麼共存。

最後解法：完全繞過 tree-data，把 AntDV Table 當純渲染引擎，樹狀展開邏輯自己管。

```vue
<!-- 禁用 tree-data，讓 antdv 不認識 children -->
<a-table :childrenColumnName="'__no_children'" />
```

```ts
const displayDataSource = computed(() => {
  const result: Row[] = [];

  for (const row of dataSource.value) {
    result.push(row);
    if (expandedRowKeys.value.has(row.key)) {
      result.push(...(row.children ?? []));
    }
  }

  return result;
});
```

```vue
<template #bodyCell="{ column, record }">
  <template v-if="column.key === 'name'">
    <span :style="{ paddingLeft: `${record.__level * 16}px` }">
      <RightOutlined v-if="record.hasChildren" @click="toggle(record)" />
      {{ record.name }}
    </span>
  </template>
</template>
```

多寫了一些 code，但行為完全可預期，不用再賭框架內部黑盒。

## 坑 7：展開卡頓（真正會把主執行緒打爆的那種）

這坑很有趣：測試環境只跑一週資料，點展開就已經卡；我心裡想：上線後要跑幾個月甚至幾年的累積資料，放著不處理一定出事。

卡頓的原因通常是「展開」每次都做了太多昂貴的事，例如：

- 全樹走訪回填（對所有父節點重寫欄位）
- 強制整表重繪（讓框架以為整個 `dataSource` 都變了）
- 總計重算（對整個資料做 `reduce`）

資料量一大，這三步疊起來足以卡死主執行緒。

解法核心：把「回填資料」改為「讀取策略」。展開/收合時，不再改資料，只改讀法。

```ts
const getDisplayMetric = (record: Row, field: string) => {
  if (record.hasSubOrg && record._displayMetrics) {
    const metrics = expandedKeys.value.has(record.key)
      ? record._displayMetrics.expanded
      : record._displayMetrics.collapsed;
    return metrics?.[field] ?? record?.[field];
  }

  return record?.[field];
};
```

展開/收合只改 `expandedKeys`（一個 `Set`），完全不碰 `dataSource`。這樣互動成本就能做到 O(1)：你改的只是一個集合，不是在遍歷整張表。

另外，總計也不需要跟著重算：總計永遠是最上層彙總值，展開收合不該影響它。加個 `totalDirty` 旗標，避免不必要的重算：

```ts
const totalDirty = ref(true);

const refreshTotal = () => {
  if (!totalDirty.value) return;
  summariesList.value = computeTotal(getTotalSourceRows());
  totalDirty.value = false;
};
```

## 做完坑 7 之後，我又再往前推了一把

以下幾個方向不一定每個人都需要，但在「資料量真的很大」的場景，會很有感：

### 1) 查詢加快取：同條件重查不閃爍

同樣條件短時間重查，先秒回舊結果，背景再去拉新的；命中快取時不強制清空展開狀態，避免畫面閃爍。TTL 預設 60 秒，最多留 5 筆，超過就淘汰。

另外，`JSON.stringify` 有個小陷阱：物件 key 順序不同會讓快取 miss。可以用「排序後再序列化」的 `stableSerialize`：

```ts
const stableSerialize = (input: unknown): string => {
  if (input === null || input === undefined) return String(input);
  if (typeof input !== 'object') return JSON.stringify(input);
  if (Array.isArray(input)) return `[${input.map(stableSerialize).join(',')}]`;

  const obj = input as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return `{${keys.map((k) => `${JSON.stringify(k)}:${stableSerialize(obj[k])}`).join(',')}}`;
};
```

### 2) 查詢可中止，舊結果不會蓋掉新畫面

用 `AbortController` 主動中止舊查詢，但中止不一定每次都成功，再搭一個 `requestSeq` 序號保底：晚到的舊回應直接丟掉。

### 3) 後處理合併成單次遞迴

原本「key 對應表構建」和「_parentKey 回填」是兩趟遍歷，合併成一次遞迴，少走一次全樹。

### 4) 慢查詢提示，不綁表格 loading

大資料量頁面，切換 loading 狀態本身也會觸發額外重排。所以查詢不再讓按鈕或表格進 loading，改成只記錄 `isSearching`，超過 2 秒才跳提示：

```ts
slowTimer = setTimeout(() => {
  if (isSearching.value) message.warning('查詢耗時較長，請稍候');
}, 2000);
```

### 5) 再次查詢前先卸載舊列表（大資料量才啟用）

當列表筆數超過門檻（例如 500 筆），使用者再次查詢時先清空 `dataSource` 和展開狀態，卸載表格一個 tick，讓點擊體感更乾脆。小資料量不啟用，避免不必要閃爍。

### 6) 篩選條件延後生效

例如「顯示商戶子級序號」這種勾選選項，改成勾選當下只更新 pending 狀態，查詢時才真正套用，避免勾選瞬間就觸發 columns/computed 整表重算。

### 7) 全展開用全頁遮罩，一般查詢不用

「全展開 / 全收合」這種大動作用遮罩（`position: fixed; inset: 0`）擋住誤觸，加 `cursor: wait` 給明確回饋。一般查詢改用慢查詢提示，不用表格 loading，減少不必要重排。

### 8) 匯出防連點

匯出不顯示 loading，但用 `exportInProgress` 擋住重複點擊，避免短時間觸發多次下載。

### 9) 用 content-visibility 跳過畫面外列的排版

DOM 一多，瀏覽器光是 layout 就很吃力。對 `tbody tr` 加 `content-visibility: auto`，讓瀏覽器跳過畫面外 row 的排版與繪製；搭配 `contain-intrinsic-size` 給預估高度，避免捲動跳動。

### 10) 開發期加效能打點：先量測再優化

用 `performance.now()` 在幾個關鍵節點打時間戳，最後 `console.table` 一次輸出各段耗時。Network 長就往後端與回傳資料量查；Scripting 長就往前端格式化與遍歷查；Rendering 長就往 DOM 量查。不量直接動手很容易優化錯方向。

## 最後整理：我從這張表學到的幾件事

- API 改版前先畫資料結構對照表（欄位搬移、彙總責任轉移），會省非常多 debug 時間
- AntDV Table 有兩套展開機制，不要混用；需要自訂就直接選 row expand + 自己平鋪資料
- 展開切換的效能關鍵是「改讀法，不改資料」，互動成本才不會隨資料量線性增長
- 總計和顯示口徑要分開維護：展開後總計縮小會讓使用者以為資料有問題
- Vue 大資料表格用 `shallowRef` / `markRaw` 很重要：深層 proxy 化在上萬節點會很可觀

## shallowRef 是大資料表格的標配

Vue 的 `ref()` 會對物件做深層 proxy，千筆樹狀資料下這個成本很可觀。改用 `shallowRef` 搭配必要時的 `markRaw`，可以把響應式成本壓到最低。

資料量小的時候感覺不出來，節點數一上萬，光是第一次建立 proxy 的時間就會讓「明明拿到資料卻遲遲不渲染」，很容易被誤判成 API 問題。

主資料源、查找快取的 `Map`、展開狀態的 `Set`，這幾類都可以換成 `shallowRef`。`shallowRef` 只追蹤 `.value` 的替換，不深層追蹤物件內部的變更。對 `Set/Map` 這類資料，建議用「不可變更新」（`new Set(old)` 整包替換 `.value`）讓視圖更新；如果你選擇原地 mutate（例如 `expandedKeys.value.add(...)`），就需要手動 `triggerRef()` 通知重繪。

格式化完成後，也可以對每個樹節點 `markRaw(node)`，讓 Vue 完全跳過這些物件的 proxy 化。

## 這輪優化後，我整理的幾個通用方向

### Latest-wins + Cancelation

所有涉及非同步查詢的基本功：新的一次永遠覆蓋舊的一次，搭配 `AbortController` 主動中止、`requestSeq` 保底丟棄晚到回應。

### 改讀法不改資料

不只是這篇的解法，也是大資料 UI 的通用思路：把昂貴的計算從「每次互動」搬到「查詢階段一次做完」，互動時只切換讀取策略。資料量越大，這個設計的報酬越明顯。

### Chunking / Yielding（分批讓出主執行緒）

任何可能跑上千次迴圈的工作都該考慮：全展開、索引重建、後處理——用 `requestAnimationFrame` 或 `await nextFrame()` 分段，主執行緒不會被一次佔死，UI 還能回應。

### Web Worker（把重活丟到背景執行緒）

如果 `formatData` 或大量聚合仍然很吃時間，下一步就是 Worker。但要注意：Worker 和主執行緒之間靠 `postMessage` 傳資料，大資料的序列化成本本身就不小。搬過去之前，先用 `performance.now()` 量一下 `formatData` 實際跑了多久，幾十毫秒等級就先不用急著動。

### 虛擬捲動

`content-visibility` 是讓瀏覽器跳過畫面外元素的 layout 和 paint，DOM 還在；虛擬捲動是根本不 mount 畫面外的 DOM。資料量再大一個量級的話，才需要認真考慮換虛擬捲動。

### Progressive UX

門檻大概是：150ms 以內不提示、超過 1 秒才考慮遮罩、超過 2 秒才提示使用者「還在跑」。遮罩應該只留給「誤觸成本很高」的操作，一般查詢改用慢查詢提示就夠了。

### 先量測再優化

用 `performance.now()` 把耗時拆成 Network / formatData / post-process / first paint 幾段，每段的問題方向不一樣：Network 長往後端查，Scripting 長往前端格式化查，Rendering 長往 DOM 量查。不量直接動手很容易優化到沒有瓶頸的地方。

就這樣。「一張表格」的需求，同時牽涉到框架機制、API 資料設計、Vue 響應式效能三個層面，任何一層沒搞清楚都會卡很久。

如果你也在做類似的東西，歡迎留言。

每個人看事情的觀點及角度、生命歷程都不一樣，一切以你思考過後得到的想法為主。歡迎之後有其他前端聚會可以邀請我參加，只要我時間允許，歡迎告訴我活動訊息
我的連絡電子信箱：harry750110@gmail.comLine：harryvan
臉書：Harris Fan

---

參考來源：<https://uneven-tarantula-5e0.notion.site/Vben-Admin-2c548a1740bf80899bc5c8c8b0db3226?pvs=73>
