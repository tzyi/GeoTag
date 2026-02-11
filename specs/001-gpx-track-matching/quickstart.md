# Quickstart: GPX Track Matching UI

## 安裝與啟動

1. 安裝依賴：
   ```sh
   npm install
   ```
2. 啟動開發環境：
   ```sh
   npm run electron:dev
   ```

## 主要技術
- React 18+、TypeScript 4.x
- Electron 30+
- Tailwind CSS 3+
- shadcn/ui（無障礙元件）、Radix UI
- react-markdown、CodeMirror 6
- Vite、Vitest、Playwright for Electron

## 功能流程
1. 匯入照片與 GPX 軌跡
2. 地圖自動標記匹配照片，縮圖顯示狀態
3. 拖拽標記微調，右側即時顯示座標與偏移
4. EXIF 寫入與 Locked 標示
5. 時間偏移滑桿集體移動標記
6. 地圖圖層切換（街道/衛星）

## 測試
- 單元測試：`npm run test`
- E2E 測試：`npm run test:e2e`

## 目錄結構
```
src/
├── main/        # Electron 主程式
├── renderer/    # React UI
├── shared/      # GPX 解析、狀態管理
```

## IPC 溝通
- 主程式負責檔案與 EXIF 操作
- 渲染程式負責 UI 與互動
- shared 提供共用邏輯

---
如需自訂 UI 樣式，請參考 docs/ui/02-gpx 內設計範例。
