import { inject, Injectable } from '@angular/core';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { LocalStorageKey } from '../../shared/enums/local-storage-key';

@Injectable({
  providedIn: 'root',
})
export class AccountBiometricsRepository {
  private localStorageService = inject(LocalStorageService);

  private _hasBiometricsEnabled: boolean | null = null;

  async enableUseOfBiometrics(): Promise<void> {
    this._hasBiometricsEnabled = true;
    await this.localStorageService.setStoredData(LocalStorageKey.HasBiometricEnabled, 'true');
  }

  async disableUseOfBiometrics(): Promise<void> {
    this._hasBiometricsEnabled = false;
    await this.localStorageService.setStoredData(LocalStorageKey.HasBiometricEnabled, 'false');
  }

  async getBiometricsEnabled(): Promise<boolean> {
    if (this._hasBiometricsEnabled !== null) {
      return this._hasBiometricsEnabled;
    }

    const data: string | null = await this.localStorageService.getStoredData(
      LocalStorageKey.HasBiometricEnabled
    );

    if (data === null) {
      this._hasBiometricsEnabled = false;
      return this._hasBiometricsEnabled;
    }

    this._hasBiometricsEnabled = data === 'true';
    return this._hasBiometricsEnabled;
  }
}
