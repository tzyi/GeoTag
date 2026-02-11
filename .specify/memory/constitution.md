# GeoTag Constitution

## Core Principles

### I. 技術架構
- 前端介面必須使用 React 18+ 搭配 TypeScript 開發。
- 桌面應用程式框架採用 Electron 30+，目標平台為 Windows 11。
- 主程序(Main Process)與渲染程序(Renderer Process)嚴格分離。
- 程序間通訊必須使用 IPC (Inter-Process Communication)。

**Rationale**: 確保技術選型現代化、架構清晰、平台相容性高。

### II. 程式碼品質
- 所有程式碼必須使用 TypeScript，並啟用 strict 模式。
- 元件採用函數式元件搭配 React Hooks。
- 每個元件必須遵循單一職責原則，專注於單一功能。

**Rationale**: 提升維護性、可測試性與可讀性。

### III. 安全性原則
- 渲染程序必須啟用 contextIsolation。
- 禁用 nodeIntegration，僅透過 preload script 暴露安全 API。
- 所有外部資源載入需經過 CSP (Content Security Policy) 驗證。

**Rationale**: 降低攻擊面，確保應用程式安全。

### IV. 使用者體驗
- 應用程式啟動時間不得超過 3 秒。
- 必須支援 Windows 原生視窗控制(最小化、最大化、關閉)。
- 提供系統托盤整合功能。

**Rationale**: 提升啟動效率與操作便利性，符合平台使用習慣。

### V. 開發與測試標準
- 使用 Vite 作為開發伺服器和建構工具。
- 單元測試覆蓋率至少 80%，使用 Vitest。
- E2E 測試必須使用 Playwright for Electron。

**Rationale**: 確保開發流程高效、測試全面。

### VI. 效能要求
- 應用程式記憶體使用不得超過 500MB。
- 渲染程序的 JavaScript bundle 大小不得超過 2MB。
- 必須支援離線運作模式。

**Rationale**: 保證資源使用效率，提升穩定性與可用性。

## 附加約束
- 所有技術選型、架構設計、測試流程必須符合上述原則。
- 專案文件、規格、任務分配需明確標示原則對應。

## 開發流程與品質審查
- 所有 Pull Request 必須檢查憲章原則符合性。
- 測試覆蓋率與效能指標需於 CI/CD 流程中自動驗證。
- 重大架構或原則變更需經團隊討論並修訂憲章。

## Governance
- 憲章優先於其他開發慣例，所有決策以憲章為準。
- 憲章修訂需經團隊共識，並記錄修訂日期與版本。
- 每次修訂需同步更新相關模板與文件，並進行合規性檢查。

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): 初次制定日期待確認 | **Last Amended**: 2026-02-11

<!--
Sync Impact Report
- Version change: N/A → 1.0.0
- Modified principles: 全部由模板佔位符改為具體原則
- Added sections: 附加約束、開發流程與品質審查
- Removed sections: 無
- Templates requiring updates: plan-template.md ✅, spec-template.md ✅, tasks-template.md ✅
- Follow-up TODOs: RATIFICATION_DATE 待補
-->
