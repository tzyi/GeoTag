---
description: "Task list for GeoTag 批量照片 GPS 標註主功能"
---

# Tasks: GeoTag 批量照片 GPS 標註主功能

**Input**: Design documents from `/specs/main/`
**Prerequisites**: plan.md, research.md, data-model.md, quickstart.md, contracts/openapi.yaml

**Tests**: 本專案依決策不需自動化測試，僅以功能驗收為主。

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [ ] T001 建立專案目錄結構（src/main, src/renderer, src/preload, src/shared）
- [ ] T002 初始化 TypeScript + React + Electron + Vite 專案
- [ ] T003 [P] 安裝並設定主要依賴（Zustand, Leaflet.js, Tailwind CSS, electron-store 等）
- [ ] T004 [P] 設定 ESLint、Prettier、TypeScript strict mode
- [ ] T005 設定 Electron 主/渲染/Preload 分離與 IPC 安全機制

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

- [ ] T006 實作共用型別於 src/shared/types.ts
- [ ] T007 [P] 實作 SQLite 與 electron-store 設定存取於 src/main/db.ts, src/main/settings.ts
- [ ] T008 [P] 實作 Preload script 並暴露 IPC API 於 src/preload/index.ts
- [ ] T009 設定 CSP、contextIsolation、禁用 nodeIntegration 於 Electron 設定

---

## Phase 3: US1 - 批量匯入與照片管理

**Goal**: 支援批量匯入、拖放照片，側邊欄顯示縮圖、檔名、勾選框
**Test Criteria**: 可拖放多張照片，側邊欄正確顯示所有匯入照片資訊

- [ ] T010 [US1] 實作照片資料模型與狀態管理於 src/shared/types.ts, src/renderer/store/photoStore.ts
- [ ] T011 [P] [US1] 實作批量匯入 API 與 IPC 處理於 src/main/photoImport.ts, src/preload/photoApi.ts
- [ ] T012 [P] [US1] 實作拖放匯入 UI 元件於 src/renderer/components/PhotoDropzone.tsx
- [ ] T013 [P] [US1] 實作側邊欄縮圖/檔名/勾選框 UI 於 src/renderer/components/PhotoSidebar.tsx
- [ ] T014 [US1] 整合匯入流程與 UI 狀態於 src/renderer/App.tsx

---

## Phase 4: US2 - 批量 GPS 寫入與進度顯示

**Goal**: 批量選取照片並寫入 GPS 至 EXIF，顯示進度/動畫/失敗可重試
**Test Criteria**: 可選取多張照片，GPS 寫入成功/失敗有明確回饋，進度動畫正確

- [ ] T015 [US2] 實作批量 GPS 寫入 API 與 IPC 處理於 src/main/gpsWriter.ts, src/preload/gpsApi.ts
- [ ] T016 [P] [US2] 實作 GPS 寫入進度狀態管理於 src/renderer/store/batchStatusStore.ts
- [ ] T017 [P] [US2] 實作 GPS 寫入 UI 與動畫覆蓋層於 src/renderer/components/GpsWritePanel.tsx
- [ ] T018 [US2] 實作單張重試與失敗訊息顯示於 src/renderer/components/PhotoSidebar.tsx

---

## Phase 5: US3 - 地圖主視圖與座標面板

**Goal**: 整合 OpenStreetMap，中心十字準星，座標面板即時顯示緯度經度，支援搜尋
**Test Criteria**: 地圖可拖曳、搜尋定位，座標即時顯示，中心準星正確

- [ ] T019 [US3] 實作地圖主視圖元件（react-leaflet）於 src/renderer/components/MapView.tsx
- [ ] T020 [P] [US3] 實作中心十字準星與座標面板於 src/renderer/components/MapCrosshair.tsx, src/renderer/components/CoordinatePanel.tsx
- [ ] T021 [P] [US3] 實作地圖搜尋列於 src/renderer/components/MapSearchBar.tsx
- [ ] T022 [US3] 整合地圖與 GPS 寫入流程於 src/renderer/App.tsx

---

## Phase 6: US4 - EXIF 預覽與抽屜面板

**Goal**: 點擊單張照片顯示 EXIF 資訊，缺失時顯示「無資料」
**Test Criteria**: 點擊照片可於抽屜面板即時顯示 EXIF，無資料時顯示提示

- [ ] T023 [US4] 實作 EXIF 解析與 IPC API 於 src/main/exifReader.ts, src/preload/exifApi.ts
- [ ] T024 [P] [US4] 實作 EXIF 抽屜面板 UI 於 src/renderer/components/ExifDrawer.tsx
- [ ] T025 [US4] 整合 EXIF 預覽與照片選取於 src/renderer/App.tsx

---

## Phase 7: US5 - 深色模式與互動動效

**Goal**: 支援深色模式、按鈕 hover 動效、縮圖高亮
**Test Criteria**: 可切換深/淺色，按鈕 hover/縮圖選中有明顯動效

- [ ] T026 [US5] 實作深色/淺色主題切換於 src/renderer/theme.ts, src/renderer/App.tsx
- [ ] T027 [P] [US5] 實作按鈕 hover 動效與縮圖高亮於 src/renderer/components/Button.tsx, PhotoSidebar.tsx

---

## Phase 8: US6 - 地圖/EXIF 失敗處理與手動輸入

**Goal**: 地圖載入失敗顯示離線提示，允許手動輸入 GPS，EXIF 寫入失敗可重試
**Test Criteria**: 地圖/EXIF 失敗時有明確提示，允許手動輸入與重試

- [ ] T028 [US6] 實作地圖載入失敗提示與重載於 src/renderer/components/MapView.tsx
- [ ] T029 [P] [US6] 實作手動輸入 GPS 座標面板於 src/renderer/components/CoordinatePanel.tsx
- [ ] T030 [US6] 實作 EXIF 寫入失敗重試流程於 src/renderer/components/GpsWritePanel.tsx

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: 最後修飾、效能優化、CSP/安全檢查、文件補全

- [ ] T031 優化啟動效能與記憶體佔用於 src/main, src/renderer
- [ ] T032 補全 README 與使用說明於 README.md
- [ ] T033 [P] 補全型別與註解於 src/shared/types.ts
- [ ] T034 [P] 檢查 CSP、contextIsolation、nodeIntegration 設定於 Electron config

---

## Dependencies

- Phase 1 → Phase 2 → US1 → US2/US3/US4/US5/US6（US2~US6 可大部分平行）→ Polish

## Parallel Execution Examples

- T003, T004, T007, T008 可平行於基礎設置
- US1: T011, T012, T013 可平行
- US2: T016, T017 可平行
- US3: T020, T021 可平行
- US5: T027 可平行
- US6: T029 可平行
- Polish: T033, T034 可平行

## Implementation Strategy

- 先完成 Phase 1~2（基礎設置）
- 以 US1（批量匯入/管理）為 MVP，確保可獨立驗收
- 其餘 user story 依優先順序分階段交付，允許平行開發
- 每階段皆可獨立測試與驗收
