import { Component, inject } from '@angular/core';
import { BiometricsService } from '../../../core/services/biometrics.service';
import { UrlConfigurationService } from '../../../core/config/url-configuration.service';
import { Router } from '@angular/router';
import { AccountIdRepository } from '../../../core/repositories/accountId.repository';
import { AccountRolesRepository } from '../../../core/repositories/accountRoles.repository';
import { UserRole } from '../../../core/enums/user-role';

@Component({
  selector: 'app-create-new-account',
  imports: [],
  templateUrl: './create-new-account.component.html',
  styleUrl: './create-new-account.component.scss',
})
export class CreateNewAccountComponent {
  private biometricsService = inject(BiometricsService);
  private router = inject(Router);
  private urlConfig = inject(UrlConfigurationService);
  private accountIdRepo = inject(AccountIdRepository);
  private accountRoleRepo = inject(AccountRolesRepository);

  async onCreateAccount(): Promise<void> {
    await this.biometricsService.enableUseOfBiometrics();
    await this.accountIdRepo.setAccount("new-account-id");
    await this.accountRoleRepo.setAccountRoles([UserRole.User]);
    await this.router.navigate([this.urlConfig.accountOverview]);
  }
}
