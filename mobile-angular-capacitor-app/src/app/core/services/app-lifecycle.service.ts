import { inject, Injectable } from '@angular/core';
import { App } from '@capacitor/app';
import { BiometricsService } from './biometrics.service';
import { Router } from '@angular/router';
import { UrlConfigurationService } from '../config/url-configuration.service';
import { AccountIdRepository } from '../repositories/accountId.repository';

export type AppLifecycleEvent = 'startup' | 'foreground' | 'background';

@Injectable({
  providedIn: 'root',
})
export class AppLifecycleService {
  private wasManuallyPaused = false;
  private resumedFromBackground = false;

  private biometricsService = inject(BiometricsService);
  private accountIdRepo = inject(AccountIdRepository);
  private router = inject(Router);
  private urlConfig = inject(UrlConfigurationService);

  constructor() {
    this.registerLifecycleEvents();
  }

  private registerLifecycleEvents() {
    App.addListener('pause', () => {
      this.resumedFromBackground = true;
    });

    App.addListener('resume', async () => {

      if (this.wasManuallyPaused) {
        this.wasManuallyPaused = false;
        return; // was paused for biometrics, skip
      }

      if (this.resumedFromBackground) {
        this.resumedFromBackground = false;

        const hasAccountId = await this.accountIdRepo.hasAccountId();

        if (hasAccountId) {
          this.wasManuallyPaused = true;
          const isVerifiedWithBiometrics = await this.biometricsService.tryVerifyWithBiometrics();

          if (isVerifiedWithBiometrics) {
            console.log('App resumed from background and biometrics verified successfully.');
            await this.router.navigate([this.urlConfig.accountOverview]);
          }

          if (!isVerifiedWithBiometrics) {
            console.log('App resumed from background but biometrics verification failed.');
            await this.router.navigate([this.urlConfig.loginPath]);
          }
        }
      }
    });3
  }
}
