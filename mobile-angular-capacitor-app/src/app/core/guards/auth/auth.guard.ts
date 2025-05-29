import { inject } from '@angular/core';
import { CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationStateService } from '../../services/auth/auth-state.service';
import { AuthorizationService } from '../../services/auth/authorization/authorization.service';
import { UserRole } from '../../enums/user-role';

export function authorizationGuard(requiredRoles: UserRole[] = []): CanActivateFn {
  return (_route, state: RouterStateSnapshot) => {
    const authState = inject(AuthenticationStateService);
    const authorization = inject(AuthorizationService);
    const router = inject(Router);

    const targetUrl = state.url;

    if (!authState.isAuthenticated()) {
      if (!targetUrl.startsWith('/account-authentication')) {
        return router.createUrlTree(['/account-authentication']);
      }

      return true;
    }

    if (requiredRoles.length && !authorization.hasAnyRole(requiredRoles)) {
      if (!targetUrl.startsWith('/forbidden')) {
        return router.createUrlTree(['/forbidden']);
      }

      return true;
    }

    return true;
  };
}
