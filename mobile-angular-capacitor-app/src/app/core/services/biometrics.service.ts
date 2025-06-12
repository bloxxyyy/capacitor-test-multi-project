import { computed, inject, Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { NativeBiometric } from '@capgo/capacitor-native-biometric';
import { AccountBiometricsRepository } from '../repositories/accountBiometrics.repository';

@Injectable({
  providedIn: 'root',
})
export class BiometricsService {
  private accountBiometricsRepository = inject(AccountBiometricsRepository);

  private readonly _appResumedFromBackground: WritableSignal<boolean> = signal(false);
  public readonly isAppResumedFromBackground: Signal<boolean> = computed(() =>
    this._appResumedFromBackground()
  );

  appResumedFromBackground(): void {
    // add a routing here to go back to last page when done.
    this._appResumedFromBackground.set(true);
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

  async enableUseOfBiometrics(): Promise<void> {
    await this.accountBiometricsRepository.enableUseOfBiometrics();
  }

  async hasBiometricEnabled(): Promise<boolean> {
    return await this.accountBiometricsRepository.getBiometricsEnabled();
  }

  async disableUseOfBiometrics(): Promise<void> {
    await this.accountBiometricsRepository.disableUseOfBiometrics();
  }
}
