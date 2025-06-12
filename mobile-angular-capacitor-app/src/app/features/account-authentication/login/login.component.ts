import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AccountIdRepository } from '../../../core/repositories/accountId.repository';
import { UrlConfigurationService } from '../../../core/config/url-configuration.service';
import { UserRole } from '../../../core/enums/user-role';
import { BiometricsService } from '../../../core/services/biometrics.service';
import { AccountRolesRepository } from '../../../core/repositories/accountRoles.repository';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private accountIdRepo = inject(AccountIdRepository);
  private accountRoleRepo = inject(AccountRolesRepository);
  private router = inject(Router);
  private urlConfig = inject(UrlConfigurationService);
  private biometricsService = inject(BiometricsService);

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
    await this.accountIdRepo.setAccount("test-account-id");
    await this.accountRoleRepo.setAccountRoles([UserRole.User]);
    await this.router.navigate([this.urlConfig.accountOverview]);
  }
}
