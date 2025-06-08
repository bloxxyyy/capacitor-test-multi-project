import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { UrlConfigurationService } from '../../../core/config/url-configuration.service';
import { UserRole } from '../../../core/enums/user-role';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  private authenticationService = inject(AuthenticationService);
  private router = inject(Router);
  private urlConfig = inject(UrlConfigurationService);

  async ngOnInit(): Promise<void> {
    const hasAccountId = await this.authenticationService.hasAccountId();
    const hasBiometricEnabled = await this.authenticationService.hasBiometricEnabled();
    const isReopenedApp = await this.authenticationService.isReopenedApp();

    if (hasAccountId && hasBiometricEnabled && isReopenedApp) {
      console.log('Biometric login is enabled, logging in automatically...');
      await this.onLogin();
    }
  }

  async onLogin(): Promise<void> {
    await this.authenticationService.login('111111', true, [UserRole.User]);
    await this.router.navigate([this.urlConfig.accountOverview]);
  }
}
