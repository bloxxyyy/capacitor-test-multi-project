import { inject, Injectable } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { UserRole } from '../enums/user-role';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  private authenticationStateService = inject(AuthenticationService);

  async hasAnyRequiredRole(roles: UserRole[] | string[]): Promise<boolean> {
    if (!roles?.length) return false;
    const accountRoles = await this.authenticationStateService.getAccountRoles();
    const userRoles = accountRoles.map(String);
    return roles.some((role) => userRoles.includes(String(role)));
  }
}
