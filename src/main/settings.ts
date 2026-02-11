import Store from 'electron-store';
import type { AppSettings } from '@shared/types';

// 初始化 electron-store
const store = new Store<AppSettings>({
  name: 'geotag-settings',
  defaults: {
    theme: 'dark',
    windowSize: {
      width: 1400,
      height: 900,
    },
    defaultCenter: {
      lat: 25.033,
      lng: 121.5654,
    },
  },
});

export function getSetting<K extends keyof AppSettings>(
  key: K
): AppSettings[K] | undefined {
  return store.get(key);
}

export function setSetting<K extends keyof AppSettings>(
  key: K,
  value: AppSettings[K]
): void {
  store.set(key, value);
}

export function getAllSettings(): AppSettings {
  return store.store;
}

export function resetSettings(): void {
  store.clear();
}

export default store;
