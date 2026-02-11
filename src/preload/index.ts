import { contextBridge, ipcRenderer } from 'electron';
import type { ElectronAPI } from '@shared/types';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
const electronAPI: ElectronAPI = {
  // Photo API
  importPhotos: () => ipcRenderer.invoke('photo:import'),
  getPhotoThumbnail: (photoPath: string) =>
    ipcRenderer.invoke('photo:getThumbnail', photoPath),

  // GPS API
  writeGpsToPhotos: (photoIds: string[], lat: number, lng: number) =>
    ipcRenderer.invoke('gps:write', { photoIds, lat, lng }),

  // EXIF API
  readExif: (photoPath: string) => ipcRenderer.invoke('exif:read', photoPath),

  // Settings API
  getSetting: (key: string) => ipcRenderer.invoke('settings:get', key),
  setSetting: (key: string, value: unknown) =>
    ipcRenderer.invoke('settings:set', { key, value }),

  // Event listeners
  on: (channel: string, callback: (...args: unknown[]) => void) => {
    ipcRenderer.on(channel, (_event, ...args) => callback(...args));
  },

  off: (channel: string, callback: (...args: unknown[]) => void) => {
    ipcRenderer.removeListener(channel, callback);
  },
};

contextBridge.exposeInMainWorld('electron', electronAPI);
