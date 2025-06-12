import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountIdRepository } from '../../../core/repositories/accountId.repository';
import { UrlConfigurationService } from '../../../core/config/url-configuration.service';
import { BiometricsService } from '../../../core/services/biometrics.service';
import { AuthenticationService } from '../../../core/services/authentication.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private accountIdRepo = inject(AccountIdRepository);
  private router = inject(Router);
  private urlConfig = inject(UrlConfigurationService);
  private biometricsService = inject(BiometricsService);
  private authenticationService = inject(AuthenticationService);

  async ngOnInit(): Promise<void> {
    const hasAccountId = await this.accountIdRepo.hasAccountId();
    const hasBiometricEnabled = await this.biometricsService.hasBiometricEnabled();
    const isReopenedApp = this.biometricsService.isAppResumedFromBackground();

    if (hasAccountId && hasBiometricEnabled && isReopenedApp) {
      const isVerifiedWithBiometrics = await this.biometricsService.tryVerifyWithBiometrics();
      if (isVerifiedWithBiometrics) {
        await this.router.navigate([this.urlConfig.accountOverview]);
      }
    }
  }

  async onLogin(): Promise<void> {
    await this.authenticationService.onLogin();
  }
}
