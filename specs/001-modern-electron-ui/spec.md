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

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->


### User Story 1 - 批量照片管理與座標寫入 (Priority: P1)
使用者可批量匯入、拖放照片，於左側側邊欄瀏覽縮圖並批量選取，並在地圖右下方座標面板點擊「寫入 GPS 座標至所選照片」，完成座標批次寫入。

**Why this priority**: 這是主要工作流程，直接提升生產力與精準度。

**Independent Test**: 可獨立測試匯入、選取、座標寫入流程，並驗證照片 EXIF GPS 資料正確。

**Acceptance Scenarios**:
1. **Given** 使用者已匯入多張照片，**When** 批量選取並點擊「寫入 GPS 座標」，**Then** 所有選取照片 EXIF GPS 欄位正確更新。
2. **Given** 匯入照片後，**When** 拖放至管理區，**Then** 縮圖顯示檔名與勾選框。

---

### User Story 2 - 地圖定位與座標精準操作 (Priority: P2)
使用者可於主視圖移動 OpenStreetMap 地圖，透過中心十字準星精準定位，並於座標面板即時顯示緯度經度。

**Why this priority**: 解決 GeoSetter 點擊不精準痛點，提升定位效率。

**Independent Test**: 可獨立測試地圖移動、座標即時顯示、準星定位。

**Acceptance Scenarios**:
1. **Given** 地圖載入完成，**When** 使用者移動地圖，**Then** 準星下方座標即時更新。
2. **Given** 地圖中心有十字準星，**When** 移動地圖，**Then** 準星位置不變，地圖內容移動。

---

### User Story 3 - EXIF 預覽與搜尋列 (Priority: P3)
使用者可點擊單張照片，於極窄抽屜面板快速預覽 EXIF 資訊，並於頂部搜尋列搜尋地圖位置。

**Why this priority**: 提供專業資訊與快速定位，提升使用體驗。

**Independent Test**: 可獨立測試 EXIF 預覽與地圖搜尋功能。

**Acceptance Scenarios**:
1. **Given** 點擊照片縮圖，**When** 抽屜面板展開，**Then** 顯示 EXIF 資訊。
2. **Given** 搜尋列可用，**When** 輸入地點並搜尋，**Then** 地圖自動移動至該位置。

---

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

- **FR-001**: 必須支援批量匯入、拖放照片，並於側邊欄顯示縮圖、檔名、勾選框。
- **FR-002**: 必須支援批量選取照片並寫入 GPS 座標至 EXIF。
  - EXIF 寫入失敗時，需顯示失敗訊息並允許單張重試。
  - 批量匯入/操作無明確上限，依系統資源自動調整。
- **FR-003**: 地圖主視圖需整合 OpenStreetMap，中心有固定十字準星，座標面板即時顯示緯度經度。
- **FR-004**: 座標面板需有「寫入 GPS 座標至所選照片」按鈕，並於操作後顯示進度或成功動畫覆蓋層。
- **FR-005**: 頂部需有搜尋列，支援地圖位置搜尋。
- **FR-006**: 點擊單張照片時，抽屜面板需顯示 EXIF 資訊。
- **FR-007**: 支援深色模式，配色與元件層次需符合設計規範。
- **FR-008**: 按鈕需有 hover 動效，縮圖選中需有高亮邊框。
- **FR-009**: 地圖載入失敗時，顯示離線提示。
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

- **SC-001**: 使用者可於 3 分鐘內完成批量匯入、座標寫入流程。
- **SC-002**: 90% 以上批量座標寫入操作成功，失敗有明確反饋。
- **SC-003**: 地圖定位誤差小於 10 公尺，座標顯示即時且準確。
- **SC-004**: 80% 以上使用者認為介面現代、操作直覺（問卷調查）。
- **SC-005**: EXIF 預覽功能可於 1 秒內顯示資訊。
