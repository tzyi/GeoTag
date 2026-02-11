# quickstart.md

## 快速開始

1. 安裝 Node.js 18+、Git、Yarn (或 npm)
2. 下載專案原始碼
3. 安裝依賴：
   ```sh
   yarn install
   # 或 npm install
   ```
4. 啟動開發模式：
   ```sh
   yarn dev
   # 或 npm run dev
   ```
5. 打包 Windows 安裝程式：
   ```sh
   yarn build && yarn dist
   # 或 npm run build && npm run dist
   ```
6. 執行應用程式，開始批量照片 GPS 標註

## 目錄結構
- /src/main      Electron 主程序
- /src/renderer  React 應用
- /src/preload   Preload 腳本
- /src/shared    共用型別

## 主要指令
- `yarn dev`：啟動 Electron + React 開發模式
- `yarn build`：建構前端
- `yarn dist`：打包 Windows 安裝檔

---

如遇問題，請參考 README 或聯絡開發團隊。
