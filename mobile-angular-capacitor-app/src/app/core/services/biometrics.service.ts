import { inject, Injectable } from '@angular/core';
import { NativeBiometric } from '@capgo/capacitor-native-biometric';
import { AccountBiometricsRepository } from '../repositories/accountBiometrics.repository';

@Injectable({
  providedIn: 'root',
})
export class BiometricsService {
  private accountBiometricsRepository = inject(AccountBiometricsRepository);

  async tryVerifyWithBiometrics(): Promise<boolean> {
    const hasBiometricsEnabled = await this.hasBiometricEnabled();
    if (!hasBiometricsEnabled) {
      return false;
    }

    const biometricsInstance = await NativeBiometric.isAvailable();
    if (!biometricsInstance.isAvailable) return false;

    const isVerified = await NativeBiometric.verifyIdentity({
      title: 'Verify Identity',
      useFallback: true,
      maxAttempts: 3,
    })
      .then(() => true)
      .catch(() => false);

    return isVerified;
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
