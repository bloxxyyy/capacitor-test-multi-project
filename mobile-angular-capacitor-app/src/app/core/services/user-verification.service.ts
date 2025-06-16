import { inject, Injectable } from '@angular/core';
import { BiometricsService } from './biometrics.service';
import { Router } from '@angular/router';
import { UrlConfigurationService } from '../config/url-configuration.service';

@Injectable({
  providedIn: 'root',
})
export class UserVerificationService {
  private biometricsService = inject(BiometricsService);
  private router = inject(Router);
  private urlConfig = inject(UrlConfigurationService);

  private previousRoute: string | null = null;
  private hasTriedVerifyingWithBiometrics = false;

  public wasManuallyPaused = false;

  async verifyWithBiometrics() {
    if (this.hasTriedVerifyingWithBiometrics) {
      return;
    }

    const hasVerifiedWithBiometrics = await this.biometricsService.tryVerifyWithBiometrics();
    if (hasVerifiedWithBiometrics) {
      return;
    }

    this.hasTriedVerifyingWithBiometrics = true;
    this.previousRoute = this.router.url;
    this.router.navigate([this.urlConfig.pinVerification]);
  }

  async verifyWithPin() {
    let route = this.urlConfig.accountOverview;

    this.hasTriedVerifyingWithBiometrics = false;

    if (this.previousRoute) {
      route = this.previousRoute;
      this.previousRoute = null;
    }

    this.wasManuallyPaused = false;
    this.router.navigateByUrl(route);
  }
}
