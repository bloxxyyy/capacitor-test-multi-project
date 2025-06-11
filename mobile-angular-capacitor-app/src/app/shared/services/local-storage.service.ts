import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { LocalStorageKey } from '../enums/local-storage-key';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  async setStoredData(key: LocalStorageKey | string, value: string): Promise<void> {
    if (!key) return;
    await Preferences.remove({ key })
    await Preferences.set({ key, value });
  }

  async getStoredData(key: LocalStorageKey | string): Promise<string | null> {
    if (!key) return null;
    const { value } = await Preferences.get({ key });
    return value;
  }

  async removeStoredData(key: LocalStorageKey | string): Promise<void> {
    if (!key) return;
    await Preferences.remove({ key });
  }
}
