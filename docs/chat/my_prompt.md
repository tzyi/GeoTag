# My Prompt

# constitution
```
/speckit.constitution 建立專注於以下原則的專案憲章:

**技術架構**
- 使用 React 18+ 搭配 TypeScript 開發前端介面
- 使用 Electron 30+ 作為桌面應用程式框架,目標平台為 Windows 11
- 主程序(Main Process)與渲染程序(Renderer Process)嚴格分離
- 使用 IPC (Inter-Process Communication) 進行程序間通訊

**程式碼品質**
- 所有程式碼必須使用 TypeScript,啟用 strict 模式
- 元件採用函數式元件搭配 React Hooks
- 遵循單一職責原則,每個元件專注於單一功能

**安全性原則**
- 渲染程序必須啟用 contextIsolation
- 禁用 nodeIntegration,透過 preload script 暴露安全的 API
- 所有外部資源載入需經過 CSP (Content Security Policy) 驗證

**使用者體驗**
- 應用程式啟動時間不超過 3 秒
- 支援 Windows 原生視窗控制(最小化、最大化、關閉)
- 提供系統托盤整合功能

**開發與測試標準**
- 使用 Vite 作為開發伺服器和建構工具
- 單元測試覆蓋率至少 80%,使用 Vitest
- E2E 測試使用 Playwright for Electron

**效能要求**
- 應用程式記憶體使用不超過 500MB
- 渲染程序的 JavaScript bundle 大小不超過 2MB
- 支援離線運作模式


```

# specifiy

```
/speckit.specify 打造一個現代化的 Electron 桌面應用程式介面，風格仿效 Adobe Lightroom 或高度簡約的攝影工具。

[佈局與結構]

左側側邊欄 (40%)：一個「批量照片管理區」。包含頂部的「匯入照片」按鈕、支援拖放的區塊，以及下方可捲動的照片縮圖網格（Grid View）。每張縮圖需顯示檔名，並在右上角有圓形勾選框（Checkbox）供批量選取。

右側主視圖 (60%)：整合「OpenStreetMap 全螢幕地圖」。地圖中心需有一個顯眼的十字準星或可拖動的 Pin 針。
OpenStreetMap可參考https://www.openstreetmap.org/

操作浮層/底欄：在地圖右下方設計一個懸浮的「座標設定面板」，顯示當前選取的緯度與經度數值，並包含一個醒目的「寫入 GPS 座標至所選照片」按鈕（建議使用深色背景搭配亮色文字，具有強烈呼應感）。

[視覺風格]

配色方案：深色模式（Dark Mode），背景使用深灰（#121212），元件使用較淺的灰色（#1E1E1E）做出層次。

字體與細節：使用無襯線字體（如 Inter 或 Roboto），細緻的邊框（Border-gray-800），以及 8px 的圓角設計。

互動感：選中的照片縮圖需有藍色高亮邊框；按鈕在 Hover 時需有輕微縮放或亮度變化。

[功能邏輯]

頂部需有一個簡潔的搜尋列，讓使用者可以搜尋地圖位置。

整體介面需呈現出專業、冷靜且高效的生產力工具質感，徹底擺脫 GeoSetter 的舊時代視窗感。

批次狀態反饋：
在「寫入座標」按鈕點擊後，建議在左側照片縮圖上增加一個「進度條」或「成功勾選」的動畫覆蓋層，讓使用者知道哪些照片已成功寫入。

地圖十字準星：
GeoSetter 的痛點是點擊座標不夠精準。建議在 UI 中心設計一個固定的十字準星，讓使用者透過「移動地圖」來對準位置，而非「點擊地圖」，這在操作上會更直覺。

EXIF 預覽區：
在左右兩欄之間，可以設計一個極窄的抽屜式面板，點擊單張照片時可以快速查看原始 EXIF 資訊（如拍攝時間、相機型號），這對攝影師確認照片序列非常有幫助。

文件請用繁體中文撰寫，並確保內容清晰、具體且易於開發團隊理解與實現。
```


# Plan

```
/speckit.plan /speckit.plan 使用以下技術棧和架構決策:

**前端框架與工具**
- React 18+ 搭配 TypeScript (strict mode)
- Vite 作為建構工具和開發伺服器
- React Router 6 處理多頁面導航
- Zustand 用於全域狀態管理(筆記列表、當前編輯筆記)

**Electron 架構**
- Electron 30+ 作為桌面應用框架
- 主程序(Main Process)負責檔案系統操作、系統托盤、視窗管理
- 渲染程序(Renderer Process)負責 UI 渲染
- 使用 contextBridge 暴露安全的 IPC API,禁用 nodeIntegration
- electron-builder 用於打包 Windows 安裝程式

**地圖**
- 使用 Leaflet.js 與 OpenStreetMap 作為地圖解決方案
- react-leaflet 用於在 React 中整合 Leaflet 地圖

**UI 與樣式**
- 請幫我參考 /docs/ui/batch_gps_writing_progress_view/code.html 與 /docs/ui/professional_photo_gps_tagger_dashboard/code.html 的設計,打造一個專業且現代化的使用者介面
- Tailwind CSS 3+ 用於樣式設計
- Radix UI 或 shadcn/ui 提供無障礙元件(對話框、下拉選單)
- react-markdown 用於 Markdown 渲染
- CodeMirror 6 作為編輯器,支援 Markdown 語法高亮

**資料持久化**
- 使用 Node.js fs 模組將筆記儲存為 .md 檔案在本地端
- 儲存路徑: `%USERPROFILE%\Documents\MyNotes\`
- 使用 SQLite (better-sqlite3) 儲存筆記元資料(標題、建立時間、修改時間)
- 全文搜尋使用 Fuse.js 實作模糊搜尋

**系統整合**
- electron-store 管理應用程式設定(主題、視窗大小、上次開啟的筆記)
- 系統托盤使用 Electron Tray API
- 匯出 PDF 使用 Electron printToPDF API

**開發**
- ESLint + Prettier 用於程式碼品質
- 不需要測試

**專案結構**
- /src/main - 主程序程式碼
- /src/renderer - 渲染程序程式碼(React 應用)
- /src/preload - Preload 腳本(contextBridge)
- /src/shared - 共用型別定義和常數

```

- 最後產出以下文件:
    Implementation Plan: plan.md
    研究決策：specs/main/research.md
    資料模型：specs/main/data-model.md
    API 合約：specs/main/contracts/openapi.yaml
    快速開始：specs/main/quickstart.md



# implement

```
/speckit.implement UI樣式請參考 /docs/ui/batch_gps_writing_progress_view/code.html 與 /docs/ui/professional_photo_gps_tagger_dashboard/code.html，且直到/specs/001-modern-electron-ui/tasks.md中的34個任務都完成，才可以停止實作階段。
```