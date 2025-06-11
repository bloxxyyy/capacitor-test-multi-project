import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { UrlConfigurationService } from '../../../core/config/url-configuration.service';
import { UserRole } from '../../../core/enums/user-role';
import { NativeBiometric } from '@capgo/capacitor-native-biometric';

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

      const isVerifiedWithBiometrics = await this.tryVerifyWithBiometrics();
      if (isVerifiedWithBiometrics) {
        await this.onLogin();
      }

    }
  }

   async tryVerifyWithBiometrics() : Promise<boolean> {
    const result = await NativeBiometric.isAvailable();

    if(!result.isAvailable) return false;

    const verified = await NativeBiometric.verifyIdentity({
      title: "Verify Identity",
      useFallback: true,
      maxAttempts: 3,
    })
      .then(() => true)
      .catch(() => false);

    if(!verified) return false;
    return true;
  }

  async onLogin(): Promise<void> {
    await this.authenticationService.login('111111', true, [UserRole.User]);
    await this.router.navigate([this.urlConfig.accountOverview]);
  }
}
