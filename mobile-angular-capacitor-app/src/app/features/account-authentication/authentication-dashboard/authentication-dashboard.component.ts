import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UrlConfigurationService } from '../../../core/config/url-configuration.service';

@Component({
  selector: 'app-authentication-dashboard',
  imports: [],
  templateUrl: './authentication-dashboard.component.html',
  styleUrl: './authentication-dashboard.component.scss',
})
export class AuthenticationDashboardComponent {
  private router = inject(Router);
  private urlConfig = inject(UrlConfigurationService);

  async navigateToCreateAccount(): Promise<void> {
    await this.router.navigateByUrl(this.urlConfig.createAccountPath);
  }

  async navigateToLogin(): Promise<void> {
    await this.router.navigateByUrl(this.urlConfig.loginPath);
  }
}
