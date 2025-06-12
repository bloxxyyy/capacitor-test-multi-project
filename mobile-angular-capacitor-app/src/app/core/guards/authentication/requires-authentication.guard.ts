import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRole } from '../../enums/user-role';
import { AccountRolesRepository } from '../../repositories/accountRoles.repository';
import { UrlConfigurationService } from '../../config/url-configuration.service';
import { AccountIdRepository } from '../../repositories/accountId.repository';
import { BiometricsService } from '../../services/biometrics.service';

export function requiresAuthenticationGuard(requiredRoles: UserRole[] = []): CanActivateFn {
  return async () => {
    const authenticationStateService = inject(AccountIdRepository);
    const authorizationService = inject(AccountRolesRepository);
    const router = inject(Router);
    const urlConfigurationService = inject(UrlConfigurationService);
    const biometricsService = inject(BiometricsService);

    // First check if we already made an account, else we always have to login or create and account first.
    const hasAccountId = await authenticationStateService.hasAccountId();
    if (!hasAccountId) {
      const accountAuthenticationUrl = urlConfigurationService.accountAuthentication;
      return router.createUrlTree([accountAuthenticationUrl]);
    }

    // Next check if we have done biometrics for this openedAndForground app session
    const appReopened = biometricsService.isAppResumedFromBackground();
    if (appReopened) {
      const loginUrl = urlConfigurationService.loginPath;
      return router.createUrlTree([loginUrl]);
    }

    // Next check if there are roles required
    if (requiredRoles.length < 1) return true;

    // Next check if we have the required roles to go to this component
    const hasAnyRequiredRole = await authorizationService.hasAnyRequiredRole(requiredRoles);

    if (!hasAnyRequiredRole) {
      const forbiddenUrl = urlConfigurationService.forbidden;
      return router.createUrlTree([forbiddenUrl]);
    }

    return true;
  };
}
