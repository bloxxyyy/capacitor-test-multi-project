import { inject, Injectable } from '@angular/core';
import { App } from '@capacitor/app';
import { AccountIdRepository } from '../repositories/accountId.repository';
import { UserVerificationService } from './user-verification.service';

export type AppLifecycleEvent = 'startup' | 'foreground' | 'background';

@Injectable({
  providedIn: 'root',
})
export class AppLifecycleService {
  private resumedFromBackground = false;

  private userVerificationService = inject(UserVerificationService);
  private accountIdRepo = inject(AccountIdRepository);

  constructor() {
    this.registerLifecycleEvents();
    (async () => {
      await this.onStartup();
    })();
  }

  async onStartup() {
    const hasAccountId = await this.accountIdRepo.hasAccountId();
    if (hasAccountId) {
      this.userVerificationService.wasManuallyPaused = true;
      await this.userVerificationService.verifyWithBiometrics();
    }
  }

  private registerLifecycleEvents() {
    App.addListener('pause', () => {
      this.resumedFromBackground = true;
    });

    App.addListener('resume', async () => {
      if (this.userVerificationService.wasManuallyPaused) {
        this.userVerificationService.wasManuallyPaused = false;
        return; // was paused for biometrics, skip
      }

      if (this.resumedFromBackground) {
        this.resumedFromBackground = false;

        const hasAccountId = await this.accountIdRepo.hasAccountId();

        if (hasAccountId) {
          this.userVerificationService.wasManuallyPaused = true;
          await this.userVerificationService.verifyWithBiometrics();
        }
      }
    });
  }
}
