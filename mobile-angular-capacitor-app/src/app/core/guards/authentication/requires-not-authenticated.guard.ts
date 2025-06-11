import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';
import { UrlConfigurationService } from '../../config/url-configuration.service';

export function requiresNotAuthenticatedGuard(): CanActivateFn {
  return async (_route) => {
    const authenticationStateService = inject(AuthenticationService);
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
