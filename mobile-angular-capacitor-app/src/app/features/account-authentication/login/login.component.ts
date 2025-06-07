import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { UrlConfigurationService } from '../../../core/config/url-configuration.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private authService = inject(AuthenticationService);
  private router = inject(Router);
  private urlConfig = inject(UrlConfigurationService);

  async onLogin(): Promise<void> {
    await this.authService.login();
    await this.router.navigate([this.urlConfig.accountOverview]);
  }
}
