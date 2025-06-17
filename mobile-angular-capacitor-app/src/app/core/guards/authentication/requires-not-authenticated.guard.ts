import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountIdRepository } from '../../repositories/accountId.repository';
import { UrlConfigurationService } from '../../config/url-configuration.service';

export function requiresNotAuthenticatedGuard(): CanActivateFn {
  return async () => {
    const authenticationStateService = inject(AccountIdRepository);
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
