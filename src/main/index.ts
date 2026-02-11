import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { getSetting, setSetting } from './settings';
import type { AppSettings } from '@shared/types';

// 取得 ESM 模式下的 __dirname 替代方案
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow: BrowserWindow | null = null;

const createWindow = () => {
  const preloadPath = path.join(__dirname, '../preload/index.cjs');

  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    webPreferences: {
      preload: preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
    backgroundColor: '#101822',
    titleBarStyle: 'default',
    show: false,
  });

  // Log any preload errors
  mainWindow.webContents.on('preload-error', (event, preloadPath, error) => {
    console.error('[main] ❌ PRELOAD ERROR:');
    console.error('[main] preloadPath:', preloadPath);
    console.error('[main] error:', error);
  });

  // Load the app
  if (process.env.VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(process.env.VITE_DEV_SERVER_URL);
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../../dist/index.html'));
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
};

// Register IPC handlers
function registerIpcHandlers() {
  // Settings handlers
  ipcMain.handle('settings:get', async (_event, key: string) => {
    return getSetting(key as keyof AppSettings);
  });

  ipcMain.handle('settings:set', async (_event, { key, value }) => {
    setSetting(key as keyof AppSettings, value);
  });

  // Photo handlers
  ipcMain.handle('photo:import', async () => {
    const { importPhotos } = await import('./photoImport');
    return await importPhotos();
  });

  ipcMain.handle('photo:getThumbnail', async (_event, photoPath: string) => {
    const { generateThumbnail } = await import('./photoImport');
    return await generateThumbnail(photoPath);
  });

  // GPS handlers
  ipcMain.handle('gps:write', async (event, { photoIds, lat, lng }) => {
    const { batchWriteGps } = await import('./gpsWriter');
    
    // TODO: Get photo paths from photoIds
    // For now, assume photoIds are actually file paths
    const photoPaths = photoIds as string[];
    
    const result = await batchWriteGps(
      photoPaths,
      { lat, lng },
      (completed, total) => {
        // Send progress update to renderer
        event.sender.send('gps:writeProgress', {
          completed,
          total,
          failed: 0,
        });
      }
    );

    return result;
  });

  // EXIF handlers
  ipcMain.handle('exif:read', async (_event, photoPath: string) => {
    const { readExif } = await import('./exifReader');
    return await readExif(photoPath);
  });
}

app.whenReady().then(() => {
  registerIpcHandlers();
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
