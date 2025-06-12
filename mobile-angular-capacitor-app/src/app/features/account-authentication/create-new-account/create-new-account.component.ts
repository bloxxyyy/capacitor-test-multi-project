import { Component, inject } from '@angular/core';
import { BiometricsService } from '../../../core/services/biometrics.service';
import { UrlConfigurationService } from '../../../core/config/url-configuration.service';
import { Router } from '@angular/router';
import { UserRole } from '../../../core/enums/user-role';
import { AccountService } from '../../../core/services/account.service';

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
  private accountService = inject(AccountService);

  async onCreateAccount() : Promise<void> {
    await this.biometricsService.enableUseOfBiometrics();
    await this.accountService.setAccount([UserRole.User]);
    await this.router.navigate([this.urlConfig.accountOverview]);
  }
}
