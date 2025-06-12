import { computed, inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { LocalStorageKey } from '../../shared/enums/local-storage-key';
import { NativeBiometric } from '@capgo/capacitor-native-biometric';

@Injectable({
  providedIn: 'root',
})
export class BiometricsService {
  private localStorageService = inject(LocalStorageService);

  private _hasBiometricsEnabled: boolean | null = null;

  private readonly _appResumedFromBackground: WritableSignal<boolean> = signal(false);
  public readonly isAppResumedFromBackground: Signal<boolean> = computed(() =>
    this._appResumedFromBackground()
  );

  async enableUseOfBiometrics(): Promise<void> {
    this._hasBiometricsEnabled = true;
    await this.localStorageService.setStoredData(LocalStorageKey.HasBiometricEnabled, 'true');
  }

  async tryVerifyWithBiometrics(): Promise<boolean> {
    const result = await NativeBiometric.isAvailable();

    if (!result.isAvailable) return false;

    const verified = await NativeBiometric.verifyIdentity({
      title: 'Verify Identity',
      useFallback: true,
      maxAttempts: 3,
    })
      .then(() => true)
      .catch(() => false);

    if (!verified) return false;
    this._appResumedFromBackground.set(false);
    return true;
  }

  async hasBiometricEnabled(): Promise<boolean> {
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
