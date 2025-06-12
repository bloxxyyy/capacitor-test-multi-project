import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from '../../../core/services/account.service';
import { UrlConfigurationService } from '../../../core/config/url-configuration.service';
import { UserRole } from '../../../core/enums/user-role';
import { BiometricsService } from '../../../core/services/biometrics.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private authenticationService = inject(AccountService);
  private router = inject(Router);
  private urlConfig = inject(UrlConfigurationService);
  private biometricsService = inject(BiometricsService);

  async ngOnInit(): Promise<void> {
    const hasAccountId = await this.authenticationService.hasAccountId();
    const hasBiometricEnabled = await this.biometricsService.hasBiometricEnabled();
    const isReopenedApp = this.biometricsService.isAppBackOnForeground();

    if (hasAccountId && hasBiometricEnabled && isReopenedApp) {

      const isVerifiedWithBiometrics = await this.biometricsService.tryVerifyWithBiometrics();
      if (isVerifiedWithBiometrics) {
        await this.onLogin();
      }

    }
  }

  async onLogin(): Promise<void> {
    await this.authenticationService.setAccount([UserRole.User]);
    await this.router.navigate([this.urlConfig.accountOverview]);
  }
}
