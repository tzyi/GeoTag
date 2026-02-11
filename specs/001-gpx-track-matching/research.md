# Phase 0 Research: GPX Track Matching UI

## Unknowns Clarification

1. **圖層切換（街道圖/衛星圖）技術選擇**
   - Decision: 使用 Leaflet + Mapbox/OSM，並以 React 封裝（react-leaflet）。
   - Rationale: Leaflet 支援多圖層切換，React 生態成熟，易整合。
   - Alternatives: Google Maps API（授權限制）、OpenLayers（較重）。

2. **EXIF 寫入與 Locked 標示 UI 流程**
   - Decision: EXIF 寫入後，縮圖透明度降低並顯示 Locked 圖標（shadcn/ui Icon/Badge）。
   - Rationale: 防止重複操作，視覺明確。
   - Alternatives: 僅顯示文字（不直觀）、完全隱藏（不友善）。

3. **照片標記拖拽與偏移量即時顯示**
   - Decision: 地圖標記設為 draggable，拖動時右側面板即時顯示新座標與偏移量。
   - Rationale: 提升精細調整體驗。
   - Alternatives: 僅顯示座標（無偏移量）、拖拽後才顯示（不即時）。

4. **時間偏移滑桿設計與集體標記移動**
   - Decision: 在 GPX 控制區加入滑桿，拖動時所有照片標記沿軌跡線集體滑動。
   - Rationale: 解決相機/GPS 時間不一致，提升批量效率。
   - Alternatives: 僅手動輸入（不直觀）、無集體移動（效率低）。

5. **無障礙元件選擇（對話框、下拉選單）**
   - Decision: 優先採用 shadcn/ui，若需更細緻則補用 Radix UI。
   - Rationale: shadcn/ui 提供現代化設計與無障礙，Radix UI 可補足細節。
   - Alternatives: MUI（風格不符）、Ant Design（較重）。

6. **Markdown 編輯器與語法高亮**
   - Decision: CodeMirror 6 + react-markdown，支援 Markdown 編輯與渲染。
   - Rationale: CodeMirror 6 現代、可擴充，react-markdown易整合。
   - Alternatives: Monaco Editor（較重）、Quill（不支援 Markdown 高亮）。

7. **GPX 檔案解析與狀態管理**
   - Decision: shared/ 內建 GPX 解析邏輯，狀態管理採用 React Context + Zustand。
   - Rationale: 分離主程式與渲染程式，狀態管理彈性。
   - Alternatives: Redux（較重）、MobX（較舊）。

8. **異常情境提示設計**
   - Decision: 使用 shadcn/ui Alert/Dialog，錯誤時彈出提示。
   - Rationale: 無障礙、現代化。
   - Alternatives: 原生 alert（不美觀）、Toast（不適合阻斷操作）。

## Best Practices

- Tailwind CSS 3+ 用於所有 UI 樣式，確保響應式與深色模式。
- 地圖元件封裝為 React component，支援 draggable、圖層切換、標記縮圖。
- 所有互動元件（按鈕、滑桿、Badge、Dialog）皆採用 shadcn/ui。
- EXIF 寫入流程與狀態標示嚴格分離，防止重複操作。
- Markdown 編輯器與渲染分離，支援語法高亮與即時預覽。

## Integration Patterns

- 主程式（main/）負責 GPX/EXIF 檔案操作與 IPC 溝通。
- 渲染程式（renderer/）負責 UI、地圖、照片牆、微調、圖層切換。
- shared/ 提供 GPX 解析、狀態管理、型別。

---

所有 NEEDS CLARIFICATION 已解決，技術選型與 UI 流程明確。
