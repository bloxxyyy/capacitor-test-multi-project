import { inject } from '@angular/core';
import { CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { UserRole } from '../../enums/user-role';
import { AuthenticationStateService } from '../../services/auth-state.service';
import { AuthorizationService } from '../../services/authorization.service';
import { UrlConfigurationService } from '../../config/url-configuration.service';

export function authorizationGuard(requiredRoles: UserRole[] = []): CanActivateFn {
  return (_route, state: RouterStateSnapshot) => {
    const authState = inject(AuthenticationStateService);
    const authorization = inject(AuthorizationService);
    const router = inject(Router);
    const urlConfig = inject(UrlConfigurationService);

    const targetUrl = state.url;

    if (!authState.isAuthenticated()) {
      if (!targetUrl.startsWith(urlConfig.accountAuthentication)) {
        return router.createUrlTree([urlConfig.accountAuthentication]);
      }

      return true;
    }

    if (requiredRoles.length && !authorization.hasAnyRole(requiredRoles)) {
      if (!targetUrl.startsWith(urlConfig.forbidden)) {
        return router.createUrlTree([urlConfig.forbidden]);
      }

      return true;
    }

    return true;
  };
}
