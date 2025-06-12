import { inject, Injectable } from '@angular/core';
import { UserRole } from '../enums/user-role';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { LocalStorageKey } from '../../shared/enums/local-storage-key';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {
  private localStorageService = inject(LocalStorageService);

  async getAccountRoles(): Promise<UserRole[] | string[]> {
    const rolesJson = await this.localStorageService.getStoredData(LocalStorageKey.AccountRoles);

    if (!rolesJson) {
      return [] as UserRole[] | string[];
    }

    try {
      return JSON.parse(rolesJson) as UserRole[] | string[];
    } catch (error) {
      console.error('Error parsing account roles:', error);
      return [] as UserRole[] | string[];
    }
  }

  async hasAnyRequiredRole(roles: UserRole[] | string[]): Promise<boolean> {
    if (!roles?.length) return false;
    const accountRoles = await this.getAccountRoles();
    const userRoles = accountRoles.map(String);
    return roles.some((role) => userRoles.includes(String(role)));
  }
}
