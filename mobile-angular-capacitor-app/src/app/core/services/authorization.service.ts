import { inject, Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { UserRole } from '../enums/user-role';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  private authenticationStateService = inject(AuthenticationService);

  hasAnyRole(roles: UserRole[] | string[]): boolean {
    if (!roles?.length) return false;
    const userRoles = (this.authenticationStateService.userRoles() ?? []).map(String);
    return roles.some((role) => userRoles.includes(String(role)));
  }
}
