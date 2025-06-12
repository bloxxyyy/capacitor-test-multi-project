import { Component, inject } from '@angular/core';
import { AuthenticationService } from '../../../core/services/authentication.service';

@Component({
  selector: 'app-account-overview-dashboard',
  imports: [],
  templateUrl: './account-overview-dashboard.component.html',
  styleUrl: './account-overview-dashboard.component.scss',
})
export class AccountOverviewDashboardComponent {
  private authenticationService = inject(AuthenticationService);

  async onLogout() {
    await this.authenticationService.onLogout();
  }
}
