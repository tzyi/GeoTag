// Script to build preload script
const fs = require('fs');
const path = require('path');

const preloadContent = `"use strict";

const { contextBridge, ipcRenderer } = require("electron");

try {
  const electronAPI = {
    importPhotos: () => ipcRenderer.invoke("photo:import"),
    getPhotoThumbnail: (photoPath) => ipcRenderer.invoke("photo:getThumbnail", photoPath),
    writeGpsToPhotos: (photoIds, lat, lng) => ipcRenderer.invoke("gps:write", { photoIds, lat, lng }),
    readExif: (photoPath) => ipcRenderer.invoke("exif:read", photoPath),
    getSetting: (key) => ipcRenderer.invoke("settings:get", key),
    setSetting: (key, value) => ipcRenderer.invoke("settings:set", { key, value }),
    on: (channel, callback) => { ipcRenderer.on(channel, (_event, ...args) => callback(...args)); },
    off: (channel, callback) => { ipcRenderer.removeListener(channel, callback); },
  };
  contextBridge.exposeInMainWorld("electron", electronAPI);
} catch (error) {
  console.error("[preload] ERROR:", error);
}
`;

const preloadDir = path.join(__dirname, 'dist-electron', 'preload');
if (!fs.existsSync(preloadDir)) {
  fs.mkdirSync(preloadDir, { recursive: true });
}

fs.writeFileSync(path.join(preloadDir, 'index.cjs'), preloadContent, 'utf8');
console.log('✓ Preload script created successfully');
