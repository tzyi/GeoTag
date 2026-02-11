# Implementation Plan: [FEATURE]

**Branch**: `[###-feature-name]` | **Date**: [DATE] | **Spec**: [link]
**Input**: Feature specification from `/specs/[###-feature-name]/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

[Extract from feature spec: primary requirement + technical approach from research]

## Technical Context

<!--
  ACTION REQUIRED: Replace the content in this section with the technical details
  for the project. The structure here is presented in advisory capacity to guide
  the iteration process.
-->

**Language/Version**: React 18+, TypeScript 4.x, Electron 30+（主程式/渲染程式）
**Primary Dependencies**: Tailwind CSS 3+, Radix UI 或 shadcn/ui（無障礙元件）、react-markdown、CodeMirror 6、Vite、Vitest、Playwright for Electron
**Storage**: N/A（僅前端狀態管理，照片與 GPX 檔案由主程式處理）
**Testing**: Vitest（單元）、Playwright for Electron（E2E）
**Target Platform**: Windows 11（桌面應用）、Electron 30+
**Project Type**: 單一桌面應用（src/main, src/renderer, src/shared）
**Performance Goals**: 地圖渲染流暢（>60fps）、批量匹配 1 分鐘內完成 90% 照片
**Constraints**: contextIsolation、禁用 nodeIntegration、CSP 驗證、EXIF 寫入不可重複
**Scale/Scope**: 單一主功能流（GPX 匹配、手動微調、EXIF 寫入、圖層切換），約 3-5 UI 畫面

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

GATE CHECK（設計後）：
- 前端 React 18+、TypeScript、strict 模式 ✅
- Electron 30+，主程式/渲染程式分離 ✅
- IPC、contextIsolation、禁用 nodeIntegration ✅
- CSP 驗證 ✅
- 單一職責原則、Hooks、元件分離 ✅
- Vite、Vitest、Playwright for Electron ✅
- Windows 11 原生視窗控制 ✅
- 啟動時間 <3 秒、地圖渲染流暢 ✅
- EXIF 寫入不可重複，Locked 標示 ✅

設計階段所有憲法規則皆符合，無違規需追蹤。

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)
<!--
  ACTION REQUIRED: Replace the placeholder tree below with the concrete layout
  for this feature. Delete unused options and expand the chosen structure with
  real paths (e.g., apps/admin, packages/something). The delivered plan must
  not include Option labels.
-->

```text
src/
├── main/        # Electron 主程式（GPX/EXIF 處理、IPC）
├── renderer/    # React UI（地圖、照片牆、微調、圖層切換）
├── shared/      # 共用邏輯（GPX 解析、狀態管理、型別）
```

**Structure Decision**: 採用單一桌面應用結構，主程式負責檔案與 EXIF 操作，渲染程式負責 UI 與互動，shared 提供共用邏輯與型別。
├── models/
├── services/
├── cli/
└── lib/

tests/
├── contract/
├── integration/
└── unit/

# [REMOVE IF UNUSED] Option 2: Web application (when "frontend" + "backend" detected)
backend/
├── src/
│   ├── models/
│   ├── services/
│   └── api/
└── tests/

frontend/
├── src/
│   ├── components/
│   ├── pages/
│   └── services/
└── tests/

# [REMOVE IF UNUSED] Option 3: Mobile + API (when "iOS/Android" detected)
api/
└── [same as backend above]

ios/ or android/
└── [platform-specific structure: feature modules, UI flows, platform tests]
```

**Structure Decision**: [Document the selected structure and reference the real
directories captured above]

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
