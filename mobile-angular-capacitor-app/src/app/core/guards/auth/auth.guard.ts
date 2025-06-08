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
    const isAuthenticated = await authenticationStateService.hasAccountId();
    const accountAuthenticationUrl = urlConfigurationService.accountAuthentication;
    const loginPageUrl = urlConfigurationService.loginPath;
    const appReopened = await authenticationStateService.isReopenedApp();

    if (!isAuthenticated) {
      if (!targetUrl.startsWith(accountAuthenticationUrl)) {
        return router.createUrlTree([accountAuthenticationUrl]);
      }

      return true;
    }

    if (targetUrl.startsWith(accountAuthenticationUrl)) {
      console.warn('User is already authenticated, redirecting to account overview or login page.');
      console.warn('Target URL:', targetUrl);
      console.warn('Login Page URL:', loginPageUrl);
      console.warn('App Reopened:', appReopened);
      if (targetUrl === loginPageUrl && appReopened) {
        return true;
      }
      console.warn('Redirecting to account overview.');
      return router.createUrlTree([urlConfigurationService.accountOverview]);
    }

    const hasAnyRequiredRole = await authorizationService.hasAnyRequiredRole(requiredRoles);

    if (requiredRoles.length && !hasAnyRequiredRole) {
      const forbiddenUrl = urlConfigurationService.forbidden;

      if (!targetUrl.startsWith(forbiddenUrl)) {
        return router.createUrlTree([forbiddenUrl]);
      }

      return true;
    }

    return true;
  };
}
