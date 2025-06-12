import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UrlConfigurationService } from '../../../core/config/url-configuration.service';
import { AccountService } from '../../../core/services/account.service';

@Component({
  selector: 'app-account-overview-dashboard',
  imports: [],
  templateUrl: './account-overview-dashboard.component.html',
  styleUrl: './account-overview-dashboard.component.scss',
})
export class AccountOverviewDashboardComponent {

  private accountService = inject(AccountService);
  private router = inject(Router);
  private urlConfig = inject(UrlConfigurationService);

  async onLogout() {
    await this.accountService.unsetAccount();
    await this.router.navigate([this.urlConfig.accountAuthentication]);
  }
}
