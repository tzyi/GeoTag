# data-model.md

## 主要實體

### Photo (照片)
- id: string (唯一識別)
- fileName: string (檔名)
- filePath: string (完整路徑)
- selected: boolean (是否被選取)
- exif: ExifData (EXIF 資訊)
- gps: { lat: number, lng: number } | null (GPS 座標)
- status: 'idle' | 'writing' | 'success' | 'error' (批次寫入狀態)

### ExifData (EXIF 資訊)
- dateTime: string (拍攝時間)
- cameraModel: string (相機型號)
- ...其他常見 EXIF 欄位

### AppSetting (應用程式設定)
- theme: 'dark' | 'light'
- windowSize: { width: number, height: number }
- lastOpenedPhoto: string | null

### Note (筆記)
- id: string
- title: string
- content: string (Markdown)
- createdAt: string
- updatedAt: string

## 關聯
- Photo 與 ExifData 一對一
- AppSetting 為單例
- Note 為多筆

## 驗證規則
- fileName 不可為空
- GPS 座標需為合法數值
- Markdown content 可為空

## 狀態轉換
- Photo.status: idle → writing → success/error
