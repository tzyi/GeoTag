# Data Model: GPX Track Matching

## Entities

### GPXTrack
- id: string
- name: string
- startTime: Date
- endTime: Date
- distance: number
- points: GPXPoint[]
- filePath: string

### GPXPoint
- lat: number
- lon: number
- ele: number
- time: Date

### Photo
- id: string
- fileName: string
- thumbnailUrl: string
- takenAt: Date
- exifStatus: 'pending' | 'locked'
- matchedPoint: GPXPoint | null
- adjustedLat: number | null
- adjustedLon: number | null
- offsetSeconds: number | null

### MatchedMarker
- photoId: string
- lat: number
- lon: number
- draggable: boolean
- offset: number
- thumbnailUrl: string

## Relationships
- Photo 對應唯一 GPXPoint（matchedPoint），可手動微調（adjustedLat/adjustedLon）
- GPXTrack 包含多個 GPXPoint
- MatchedMarker 代表地圖上的照片標記，與 Photo 關聯

## Validation Rules
- EXIF 寫入後 exifStatus = 'locked'，不可重複
- 拖拽標記超出軌跡線時 offset > threshold，需提示
- 匹配僅限拍攝時間落於 GPXTrack 時間範圍

## State Transitions
- Photo: 'pending' → 'locked'（EXIF 寫入）
- MatchedMarker: draggable → fixed（確認 EXIF）
- Photo: 'locked' → 'pending'（重設回軌跡點）
