import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { UrlConfigurationService } from './core/config/url-configuration.service';
import { AppLifecycleService } from './core/services/app-lifecycle.service';
import { AccountIdRepository } from './core/repositories/accountId.repository';
import { BiometricsService } from './core/services/biometrics.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  styles: [``],
})
export class AppComponent implements OnInit {
  private lifecycleService = inject(AppLifecycleService);
  private accountService = inject(AccountIdRepository);
  private urlConfig = inject(UrlConfigurationService);
  private router = inject(Router);
  private biometricsService = inject(BiometricsService);

  ngOnInit() {
    this.biometricsService.setAppResumedFromBackground();

    this.lifecycleService.lifecycle$
      .pipe(filter((event) => event === 'foreground'))
      .subscribe(async () => {
        const hasAccountId = await this.accountService.hasAccountId();

        if (hasAccountId) {
          this.biometricsService.setAppResumedFromBackground();
          const loginUrl = this.urlConfig.loginPath;
          await this.router.navigate([loginUrl]);
        }
      });
  }
}
