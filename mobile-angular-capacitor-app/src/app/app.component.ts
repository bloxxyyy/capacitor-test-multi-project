import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { App } from '@capacitor/app';
import { AuthenticationService } from './core/services/authentication.service';
import { UrlConfigurationService } from './core/config/url-configuration.service';
import { LocalStorageKey } from './shared/enums/local-storage-key';
import { LocalStorageService } from './shared/services/local-storage.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  styles: [``],
})
export class AppComponent implements OnInit {
  private authenticationStateService = inject(AuthenticationService);
  private urlConfigurationService = inject(UrlConfigurationService);
  private localStorageService = inject(LocalStorageService);
  private router = inject(Router);

  ngOnInit() {
    registerAppActivationHandler(async () => {
      const hasAccountId = await this.authenticationStateService.hasAccountId();
      await this.localStorageService.setStoredData(LocalStorageKey.OnReopen, 'true');

      if (hasAccountId) {
        const loginUrl = this.urlConfigurationService.loginPath;
        console.log('Navigating to account authentication URL:', loginUrl);
        this.router.navigate([loginUrl]);
      }

      return null;
    });
  }
}

export const registerAppActivationHandler = (handler: (source: 'startup' | 'resume') => void) => {
  App.getLaunchUrl().then(() => {
    handler('startup');
  });

  App.addListener('resume', () => {
    handler('resume');
  });
};
