# research.md

## 決策與研究彙整

### 語言/版本
- 決策：TypeScript (strict mode)、React 18+、Electron 30+、Node.js 18+
- 理由：完全符合專案憲章現代化、型別安全、跨平台桌面需求。
- 替代方案：JavaScript（缺乏型別安全）、舊版 Electron（安全性與 API 支援較差）

### 主要依賴
- 決策：React 18+、Vite、React Router 6、Zustand、Leaflet.js、react-leaflet、Tailwind CSS 3+、Radix UI 或 shadcn/ui、react-markdown、CodeMirror 6、better-sqlite3、electron-store、Fuse.js、electron-builder
- 理由：每項依賴皆針對 UI、效能、桌面整合、資料持久化、搜尋最佳化。
- 替代方案：Redux（較重）、MUI/AntD（不符設計風格）、低版本依賴（安全性/維護性較差）

### 儲存方案
- 決策：本地 .md 檔案（Node.js fs）、SQLite（better-sqlite3）、electron-store（設定）
- 理由：.md 檔案利於備份與同步，SQLite 適合元資料查詢，electron-store 管理設定簡單。
- 替代方案：僅用 SQLite（不利於檔案同步）、僅用檔案（查詢慢）、雲端儲存（違反離線需求）

### 測試策略
- 決策：不需要測試（依據 /speckit.plan 決策）
- 理由：專案明確標示不需測試，聚焦於功能實現與 UI/UX。
- 替代方案：Vitest/Playwright（如未來需求變更可補充）

### 效能與限制
- 決策：啟動 < 3 秒、記憶體 < 500MB、JS bundle < 2MB、嚴格分離主/渲染程序、contextIsolation、CSP、支援離線
- 理由：完全對應憲章與 /speckit.plan 要求，兼顧安全、效能、用戶體驗。
- 替代方案：放寬限制（違反憲章）、不分離主/渲染（有安全疑慮）

### 專案結構
- 決策：/src/main, /src/renderer, /src/preload, /src/shared
- 理由：明確分離 Electron 主/渲染/Preload/共用型別，易於維護與擴展。
- 替代方案：單一 src/（不利於安全與維護）

---

本 research.md 已解決所有 NEEDS CLARIFICATION，無需額外研究任務。