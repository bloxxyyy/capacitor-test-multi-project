import { inject } from '@angular/core';
import { CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { UserRole } from '../../enums/user-role';
import { AuthenticationService } from '../../services/authentication.service';
import { AuthorizationService } from '../../services/authorization.service';
import { UrlConfigurationService } from '../../config/url-configuration.service';

export function authorizationGuard(requiredRoles: UserRole[] = []): CanActivateFn {
  return async (_route, state: RouterStateSnapshot) => {
    const authenticationStateService = inject(AuthenticationService);
    const authorizationService = inject(AuthorizationService);
    const router = inject(Router);
    const urlConfigurationService = inject(UrlConfigurationService);

    const targetUrl = state.url;
    const isAuthenticated = await authenticationStateService.isAuthenticated();

    if (!isAuthenticated) {
      const accountAuthenticationUrl = urlConfigurationService.accountAuthentication;

      if (!targetUrl.startsWith(accountAuthenticationUrl)) {
        return router.createUrlTree([accountAuthenticationUrl]);
      }

      return true;
    }

    if (requiredRoles.length && !authorizationService.hasAnyRole(requiredRoles)) {
      const forbiddenUrl = urlConfigurationService.forbidden;

      if (!targetUrl.startsWith(forbiddenUrl)) {
        return router.createUrlTree([forbiddenUrl]);
      }

      return true;
    }

    return true;
  };
}
