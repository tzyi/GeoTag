# Clarifications
### Session 2026-02-11
- Q: 每張照片與軌跡點的唯一性與 EXIF 寫入狀態如何處理？ → A: 每張照片僅能對應一個軌跡點，EXIF 寫入後不可重複，重設回軌跡點後可再次執行 EXIF 寫入。

# Feature Specification: GPX 軌跡匹配工作流擴充

**Feature Branch**: `001-gpx-track-matching`
**Created**: 2026-02-11
**Status**: Draft
**Input**: User description: "擴充 GPX 軌跡匹配工作流，包含地圖視覺化、手動微調、時間偏移補償、EXIF 狀態標示、圖層切換等 UI 功能。"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - 匯入 GPX 並自動匹配照片 (Priority: P1)

使用者在側邊欄點擊「匯入 GPX 軌跡」按鈕，選擇 GPX 檔案後，系統自動將拍攝時間落於軌跡範圍內的照片標記於地圖軌跡線上，並於縮圖右上角顯示綠色打勾標籤。

**Why this priority**: 這是批量標記照片地理位置的核心流程，直接提升效率。

**Independent Test**: 匯入 GPX 後，照片自動標記並顯示匹配狀態。

**Acceptance Scenarios**:

1. **Given** 使用者已匯入照片，**When** 匯入 GPX 檔案，**Then** 符合時間範圍的照片自動標記於地圖軌跡線上。
2. **Given** 照片已自動匹配，**When** 點擊縮圖，**Then** 地圖自動平移至對應座標。

---

### User Story 2 - 手動微調與 EXIF 寫入 (Priority: P2)

使用者可拖動地圖上的照片標記，右側面板即時顯示修正後座標與偏移量。浮動工具列提供「確認更新 EXIF」與「重設回軌跡點」功能。已寫入 EXIF 的照片縮圖透明度降低或顯示 Locked 圖標。

**Why this priority**: 提供精細調整與防止重複操作，提升準確度與安全性。

**Independent Test**: 拖動標記後可即時預覽座標變化並執行 EXIF 寫入。

**Acceptance Scenarios**:

1. **Given** 照片標記可拖拽，**When** 拖動標記，**Then** 右側即時顯示修正座標與偏移量。
2. **Given** 已微調座標，**When** 點擊「確認更新 EXIF」，**Then** 照片 EXIF 寫入並標示為 Locked。

---

### User Story 3 - 時間偏移補償與地圖圖層切換 (Priority: P3)

使用者可在 GPX 匯入區調整「時間偏移滑桿」，照片標記集體沿軌跡線滑動。地圖右上角可切換街道圖與衛星圖，協助精確定位。

**Why this priority**: 解決相機與 GPS 時間不一致問題，並提升地圖細緻度。

**Independent Test**: 調整滑桿後照片標記集體移動，切換圖層後地圖顯示不同視圖。

**Acceptance Scenarios**:

1. **Given** 匯入 GPX 並有照片標記，**When** 調整時間偏移滑桿，**Then** 標記集體沿軌跡線移動。
2. **Given** 地圖顯示軌跡，**When** 切換圖層，**Then** 地圖視圖即時切換。

---

### Edge Cases

- 匯入 GPX 檔案格式錯誤時，系統應提示並阻止操作。
- 照片拍攝時間完全不在軌跡範圍內，系統應顯示無匹配結果。
- EXIF 寫入失敗時，應顯示錯誤訊息並允許重試。
- 拖動標記超出軌跡線時，系統應提示偏移過大。

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: 系統必須允許使用者匯入 GPX 軌跡檔案，並解析軌跡段資訊（時間起訖、總里程）。
- **FR-002**: 系統必須根據 GPX 軌跡自動匹配照片，並於地圖上標記匹配成功照片。
- **FR-003**: 照片標記必須可拖拽，並即時顯示修正座標與偏移量。
- **FR-004**: 系統必須提供「確認更新 EXIF」與「重設回軌跡點」功能。
- **FR-005**: 系統必須於側邊欄顯示照片匹配狀態（綠色打勾、Locked 圖標、透明度調整）。
- **FR-006**: 系統必須提供「時間偏移滑桿」調整功能，並即時反映於地圖標記。
- **FR-007**: 地圖必須支援圖層切換（街道圖/衛星圖）。
- **FR-008**: 匯入錯誤、EXIF 寫入失敗、拖拽超出軌跡等異常情境必須有明確提示。


### Key Entities

- **GPXTrack**：代表匯入的軌跡，包含時間起訖、座標點、總里程。
- **Photo**：代表照片，包含拍攝時間、縮圖、EXIF 狀態、座標。
	- 唯一性：每張照片僅能對應一個軌跡點。
	- EXIF 狀態：寫入後標示 Locked，不可重複寫入，重設回軌跡點後可再次執行 EXIF 寫入。
- **MatchedMarker**：代表地圖上標記，包含照片縮圖、座標、拖拽狀態、偏移量。

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 90% 以上照片可於 1 分鐘內自動完成地理位置匹配。
- **SC-002**: 使用者可於 10 秒內完成手動微調並寫入 EXIF。
- **SC-003**: 異常情境（匯入錯誤、EXIF 寫入失敗等）提示率達 100%。
- **SC-004**: 80% 以上用戶認為地圖圖層切換與時間偏移補償功能提升操作便利性。

### Assumptions

- 假設使用者已熟悉照片匯入流程。
- 假設 GPX 檔案格式為標準 XML。
- 假設地圖元件支援拖拽與圖層切換。
- **FR-007**: System MUST retain user data for [NEEDS CLARIFICATION: retention period not specified]
