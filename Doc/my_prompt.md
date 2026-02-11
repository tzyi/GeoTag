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