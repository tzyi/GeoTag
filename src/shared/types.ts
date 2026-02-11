/**
 * 共用型別定義
 * 供主程序、渲染程序和 Preload 腳本使用
 */

// Photo 照片資料模型
export interface Photo {
  id: string;
  fileName: string;
  filePath: string;
  selected: boolean;
  exif: ExifData | null;
  gps: GpsCoordinates | null;
  status: PhotoStatus;
  thumbnail?: string; // Base64 encoded thumbnail
}

// EXIF 資訊
export interface ExifData {
  dateTime?: string;
  cameraModel?: string;
  cameraMake?: string;
  iso?: string;
  focalLength?: string;
  aperture?: string;
  shutterSpeed?: string;
  orientation?: number;
  width?: number;
  height?: number;
  [key: string]: string | boolean | undefined | number; // Allow additional EXIF fields
}

// GPS 座標
export interface GpsCoordinates {
  lat: number;
  lng: number;
}

// 照片處理狀態
export type PhotoStatus = 'idle' | 'writing' | 'success' | 'error';

// 批次寫入進度
export interface BatchProgress {
  total: number;
  completed: number;
  failed: number;
  current?: string; // Current photo being processed
}

// 應用程式設定
export interface AppSettings {
  theme: 'dark' | 'light';
  windowSize: {
    width: number;
    height: number;
  };
  lastOpenedPhoto?: string;
  defaultCenter?: GpsCoordinates;
}

// IPC 通道名稱常數
export const IPC_CHANNELS = {
  PHOTO_IMPORT: 'photo:import',
  PHOTO_GET_THUMBNAIL: 'photo:getThumbnail',
  GPS_WRITE: 'gps:write',
  GPS_WRITE_PROGRESS: 'gps:writeProgress',
  EXIF_READ: 'exif:read',
  SETTINGS_GET: 'settings:get',
  SETTINGS_SET: 'settings:set',
} as const;

// Electron API 型別 (for window.electron)
export interface ElectronAPI {
  // Photo API
  importPhotos: () => Promise<Photo[]>;
  getPhotoThumbnail: (photoPath: string) => Promise<string>;

  // GPS API
  writeGpsToPhotos: (
    photoIds: string[],
    lat: number,
    lng: number
  ) => Promise<{ success: string[]; failed: string[] }>;

  // EXIF API
  readExif: (photoPath: string) => Promise<ExifData | null>;

  // Settings API
  getSetting: <K extends keyof AppSettings>(key: K) => Promise<AppSettings[K] | undefined>;
  setSetting: <K extends keyof AppSettings>(key: K, value: AppSettings[K]) => Promise<void>;

  // Event listeners
  on: (channel: string, callback: (...args: unknown[]) => void) => void;
  off: (channel: string, callback: (...args: unknown[]) => void) => void;
}

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
