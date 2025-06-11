import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { UrlConfigurationService } from './core/config/url-configuration.service';
import { AppLifecycleService } from './core/services/app-lifecycle.service';
import { AuthenticationService } from './core/services/authentication.service';
import { LocalStorageKey } from './shared/enums/local-storage-key';
import { LocalStorageService } from './shared/services/local-storage.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  styles: [``],
})
export class AppComponent implements OnInit {
  private lifecycleService = inject(AppLifecycleService);
  private authService = inject(AuthenticationService);
  private urlConfig = inject(UrlConfigurationService);
  private localStorage = inject(LocalStorageService);
  private router = inject(Router);

  ngOnInit() {
    this.lifecycleService.lifecycle$
      .pipe(filter(event => event === 'foreground' || event === 'startup'))
      .subscribe(async () => {
        const hasAccountId = await this.authService.hasAccountId();

        if (hasAccountId) {
          await this.localStorage.setStoredData(LocalStorageKey.OnReopen, 'true');
          const loginUrl = this.urlConfig.loginPath;
          await this.router.navigate([loginUrl]);
        }
      });
  }
}
