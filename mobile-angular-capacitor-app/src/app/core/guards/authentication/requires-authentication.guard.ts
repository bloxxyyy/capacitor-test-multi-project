import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRole } from '../../enums/user-role';
import { AccountRolesRepository } from '../../repositories/accountRoles.repository';
import { UrlConfigurationService } from '../../config/url-configuration.service';
import { AccountIdRepository } from '../../repositories/accountId.repository';
import { BiometricsService } from '../../services/biometrics.service';

export function requiresAuthenticationGuard(requiredRoles: UserRole[] = []): CanActivateFn {
  return async () => {
    const accountIdRepo = inject(AccountIdRepository);
    const accountRolesRepo = inject(AccountRolesRepository);
    const router = inject(Router);
    const urlConfigurationService = inject(UrlConfigurationService);
    const biometricsService = inject(BiometricsService);

    // First check if we already made an account, else we always have to login or create and account first.
    const hasAccountId = await accountIdRepo.hasAccountId();
    if (!hasAccountId) {
      const accountAuthenticationUrl = urlConfigurationService.accountAuthentication;
      return router.createUrlTree([accountAuthenticationUrl]);
    }

    // Next check if we have done biometrics for this openedAndForground app session
    const appResumedFromBackground = biometricsService.isAppResumedFromBackground();
    if (appResumedFromBackground) {
      const loginUrl = urlConfigurationService.loginPath;
      return router.createUrlTree([loginUrl]);
    }

    // Next check if there are roles required
    if (requiredRoles.length < 1) return true;

    // Next check if we have the required roles to go to this component
    const hasAnyRequiredRole = await accountRolesRepo.hasAnyRequiredRole(requiredRoles);

    if (!hasAnyRequiredRole) {
      const forbiddenUrl = urlConfigurationService.forbidden;
      return router.createUrlTree([forbiddenUrl]);
    }

    return true;
  };
}
