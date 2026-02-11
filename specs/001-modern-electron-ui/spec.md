# Feature Specification: 現代化 Electron 桌面攝影工具 UI

**Feature Branch**: `001-modern-electron-ui`  
**Created**: 2026-02-11  
**Status**: Draft  
**Input**: User description: 「打造一個現代化的 Electron 桌面應用程式介面，風格仿效 Adobe Lightroom 或高度簡約的攝影工具。」
## Clarifications

### Session 2026-02-11
- Q: 批量匯入/操作的最大照片數量上限為何？→ A: 無明確上限，依系統資源自動調整。
- Q: 地圖 API 失敗時，應如何處理？→ A: 允許使用者手動輸入 GPS 經緯度。
- Q: EXIF 寫入失敗時，應如何回饋與處理？→ A: 顯示失敗訊息並允許單張重試。




### Edge Cases

- 匯入非照片檔案時，系統應提示錯誤並拒絕匯入。
- 批量寫入座標時，若部分照片無法寫入，應顯示失敗狀態並允許重試。
  - 失敗時，顯示失敗訊息並允許單張重試。
- 地圖載入失敗時，顯示離線提示並允許重載。
- 地圖載入失敗時，允許使用者手動輸入 GPS 經緯度。
- EXIF 資訊缺失時，抽屜面板顯示「無資料」。

### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.
-->

- What happens when [boundary condition]?
- How does system handle [error scenario]?

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->



### Functional Requirements

- 必須支援批量匯入、拖放照片，並於側邊欄顯示縮圖、檔名、勾選框。
- 必須支援批量選取照片並寫入 GPS 座標至 EXIF。
  - EXIF 寫入失敗時，需顯示失敗訊息並允許單張重試。
  - 批量匯入/操作無明確上限，依系統資源自動調整。
- 地圖主視圖需整合 OpenStreetMap，中心有固定十字準星，座標面板即時顯示緯度經度。
- 座標面板需有「寫入 GPS 座標至所選照片」按鈕，並於操作後顯示進度或成功動畫覆蓋層。
- 頂部需有搜尋列，支援地圖位置搜尋。
- 點擊單張照片時，抽屜面板需顯示 EXIF 資訊。
- 支援深色模式，配色與元件層次需符合設計規範。
- 按鈕需有 hover 動效，縮圖選中需有高亮邊框。
- 地圖載入失敗時，顯示離線提示。
  - 地圖載入失敗時，需允許使用者手動輸入 GPS 經緯度。

### Key Entities *(include if feature involves data)*


### Key Entities

- **照片 (Photo)**：檔名、路徑、EXIF 資訊（GPS、拍攝時間、相機型號）、縮圖、選取狀態、寫入狀態。
  - 批量匯入/操作數量無明確上限，依系統資源自動調整。
- **地圖座標 (MapCoordinate)**：緯度、經度、來源（地圖中心、搜尋結果）。
- **批次操作狀態 (BatchStatus)**：進度、成功/失敗、動畫覆蓋層。

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->



### Measurable Outcomes

- 使用者可於 3 分鐘內完成批量匯入、座標寫入流程。
- 90% 以上批量座標寫入操作成功，失敗有明確反饋。
- 地圖定位誤差小於 10 公尺，座標顯示即時且準確。
- 80% 以上使用者認為介面現代、操作直覺（問卷調查）。
- EXIF 預覽功能可於 1 秒內顯示資訊。
