import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../../services/account.service';
import { UrlConfigurationService } from '../../config/url-configuration.service';

export function requiresNotAuthenticatedGuard(): CanActivateFn {
  return async () => {
    const authenticationStateService = inject(AccountService);
    const router = inject(Router);
    const urlConfigurationService = inject(UrlConfigurationService);

    const hasAccountId = await authenticationStateService.hasAccountId();
    if (hasAccountId) {
      const forbiddenUrl = urlConfigurationService.forbidden;
      return router.createUrlTree([forbiddenUrl]);
    }

    return true;
  };
}
