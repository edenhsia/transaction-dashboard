# Retail Lab Transaction Dashboard

一個以零售門市金流管理為情境打造的響應式後台 Demo。專案將交易、分店與終端設備資料整理成可操作的營運資訊，讓使用者不只看到數字，也能從異常摘要直接追查相關交易。

[線上 Demo](https://retail-lab-dashboard.pages.dev/) · [原始碼](https://github.com/edenhsia/transaction-dashboard)

**Demo 說明**

- 無需登入即可操作
- 交易資料由 Mock Service Worker（MSW）模擬，基準日為 2026/10/27
- 設備狀態僅保存在目前瀏覽器

## 專案目標

零售營運人員通常需要在大量交易中快速回答三個問題：

- 近期交易表現相較前期是成長還是下降？
- 是否有成功率異常或需要關注的分店？
- 發現問題後，能否立即找到相關交易與設備？

因此本專案除了呈現 KPI 與圖表，也加入前期比較、規則式營運摘要，以及帶入篩選條件的交易追查流程。

## 核心功能

### 數據總覽

- 支援近 7、30、90 天期間切換。
- 顯示成功交易總額、交易筆數、成功率與平均交易金額。
- 將本期與相同長度的前一期比較；金額與筆數使用百分比，成功率使用百分點。
- 以規則產生營運摘要，指出交易總額、成功率與分店表現的變化。
- 可從分店異常摘要直接前往已套用日期、分店與失敗狀態的交易列表。
- 使用趨勢圖、狀態分布圖與分店比較圖呈現交易概況。

### 交易管理

- 依日期、分店、交易狀態與交易編號篩選。
- 將篩選條件與分頁同步到 URL，支援重新整理、返回與分享查詢結果。
- 提供伺服器式分頁流程與交易明細頁。
- 支援依目前篩選條件匯出 CSV，並處理試算表公式注入風險。

### 設備管理

- 查看各分店終端設備的啟用狀態。
- 啟用或停用設備，並以 Toast 回饋操作結果。
- 停用設備前顯示確認對話框，降低誤操作風險。
- Demo 狀態儲存在 `localStorage`，重新進入頁面仍會保留。

### 使用體驗

- 響應式側邊導覽與頁面配置。
- Loading skeleton、empty、error 與 retry 狀態。
- 以 TanStack Query 管理 API 狀態、快取與 mutation。
- 路由層級程式碼分割與動態頁面標題。

## 資料流程

```text
Vue pages and components
          ↓
TanStack Query composables
          ↓
Service layer (Fetch API)
          ↓
MSW request handlers
          ↓
Mock transaction, branch and device data
```

Dashboard 的統計、前期比較與營運摘要由 MSW handler 計算，用來模擬正式系統應由後端負責的聚合邏輯；Vue 端只處理資料格式與畫面呈現。未來替換成真實 API 時，可以保留相同的 response contract。

## 技術選擇

| 類別         | 技術                               |
| ------------ | ---------------------------------- |
| Framework    | Vue 3、TypeScript、Vite            |
| UI           | PrimeVue、PrimeIcons、Tailwind CSS |
| Server state | TanStack Query                     |
| Routing      | Vue Router                         |
| Charts       | Chart.js                           |
| API mocking  | Mock Service Worker                |
| Quality      | ESLint、Prettier、vue-tsc          |

## 專案結構

```text
src/
├── components/     # 共用 UI、Dashboard 與交易元件
├── composables/    # TanStack Query 查詢與 mutation
├── constants/      # 交易狀態與顯示設定
├── data/           # Demo JSON 資料
├── layouts/        # 後台共用版型
├── mocks/          # MSW handlers 與 browser worker
├── services/       # API contract 與 fetch functions
├── utils/          # 格式化與 CSV 匯出
└── views/          # Dashboard、交易與設備頁面
```

## 本機執行

需求：Node.js 20.19 以上或 22.12 以上、pnpm 10。

```bash
pnpm install
pnpm dev
```

建立 production bundle：

```bash
pnpm build
```

檢查程式碼：

```bash
pnpm lint
pnpm format:check
```

## 設計與實作重點

- **比較口徑一致：** 選擇近 7 天時比較前 7 天，近 30 天則比較前 30 天。
- **百分比與百分點分開：** 一般數值呈現相對變化率；成功率直接呈現兩期差距。
- **摘要可採取行動：** 異常分店摘要會帶入 MID、失敗狀態與日期範圍，減少重複篩選。
- **商業邏輯不放在畫面層：** 聚合與摘要規則位於 mock API，元件維持展示職責。
- **安全匯出：** CSV 欄位會處理可能被試算表解讀為公式的內容。

## 目前限制

- 使用靜態 Demo 資料，沒有連接正式後端或資料庫。
- 沒有登入、角色權限與稽核紀錄。
- 設備狀態只保存在目前瀏覽器的 `localStorage`。
- 營運摘要採規則式判斷，並非預測模型或 AI 分析。

## Available Scripts

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `pnpm dev`          | 啟動本機開發伺服器                   |
| `pnpm build`        | 執行型別檢查並建立 production bundle |
| `pnpm preview`      | 預覽 production build                |
| `pnpm lint`         | 執行 ESLint                          |
| `pnpm format`       | 使用 Prettier 格式化專案             |
| `pnpm format:check` | 檢查格式但不修改檔案                 |
