import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { UrlConfigurationService } from '../config/url-configuration.service';
import { AccountIdRepository } from '../repositories/accountId.repository';
import { AccountRolesRepository } from '../repositories/accountRoles.repository';
import { BiometricsService } from './biometrics.service';
import { UserRole } from '../enums/user-role';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {

  private accountIdRepo = inject(AccountIdRepository);
  private accountRoleRepo = inject(AccountRolesRepository);
  private biometricsService = inject(BiometricsService);
  private router = inject(Router);
  private urlConfig = inject(UrlConfigurationService);

  async onLogout() {
    await this.accountIdRepo.unsetAccount();
    await this.accountRoleRepo.unsetAccountRoles();
    await this.biometricsService.disableUseOfBiometrics();
    await this.router.navigate([this.urlConfig.accountAuthentication]);
  }

  async onLoginWithAccountInformation(): Promise<void> {
    await this.accountIdRepo.setAccount('test-account-id');
    await this.accountRoleRepo.setAccountRoles([UserRole.User]);
    await this.biometricsService.enableUseOfBiometrics();
    await this.router.navigate([this.urlConfig.accountOverview]);
  }

  async onCreateAccount(): Promise<void> {
    await this.biometricsService.enableUseOfBiometrics();
    await this.accountIdRepo.setAccount('test-account-id');
    await this.accountRoleRepo.setAccountRoles([UserRole.User]);
    await this.router.navigate([this.urlConfig.accountOverview]);
  }
}
