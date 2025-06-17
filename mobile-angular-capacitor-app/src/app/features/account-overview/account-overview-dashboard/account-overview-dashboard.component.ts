import { Component, inject } from '@angular/core';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { Router } from '@angular/router';
import { UrlConfigurationService } from '../../../core/config/url-configuration.service';

@Component({
  selector: 'app-account-overview-dashboard',
  imports: [],
  templateUrl: './account-overview-dashboard.component.html',
  styleUrl: './account-overview-dashboard.component.scss',
})
export class AccountOverviewDashboardComponent {
  private authenticationService = inject(AuthenticationService);
  private urlConfig = inject(UrlConfigurationService);
  private router = inject(Router);

  async onLogout() {
    await this.authenticationService.onLogout();
  }

  onSettings() {
    const settingsUrl = this.urlConfig.accountSettings;
    this.router.navigate([settingsUrl]);
  }
}
