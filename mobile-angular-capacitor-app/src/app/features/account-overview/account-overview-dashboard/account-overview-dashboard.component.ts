import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UrlConfigurationService } from '../../../core/config/url-configuration.service';
import { AccountIdRepository } from '../../../core/repositories/accountId.repository';
import { AccountRolesRepository } from '../../../core/repositories/accountRoles.repository';

@Component({
  selector: 'app-account-overview-dashboard',
  imports: [],
  templateUrl: './account-overview-dashboard.component.html',
  styleUrl: './account-overview-dashboard.component.scss',
})
export class AccountOverviewDashboardComponent {
  private accountIdRepo = inject(AccountIdRepository);
  private accountRoleRepo = inject(AccountRolesRepository);
  private router = inject(Router);
  private urlConfig = inject(UrlConfigurationService);

  async onLogout() {
    await this.accountIdRepo.unsetAccount();
    await this.accountRoleRepo.unsetAccountRoles();
    await this.router.navigate([this.urlConfig.accountAuthentication]);
  }
}
