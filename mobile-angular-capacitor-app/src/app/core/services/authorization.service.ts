import { inject, Injectable } from '@angular/core';
import { AuthenticationStateService } from './auth-state.service';
import { UserRole } from '../enums/user-role';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  private authState = inject(AuthenticationStateService);

  hasAnyRole(roles: UserRole[] | string[]): boolean {
    if (!roles?.length) return false;
    const userRoles = (this.authState.userRoles() ?? []).map(String);
    return roles.some((role) => userRoles.includes(String(role)));
  }
}
