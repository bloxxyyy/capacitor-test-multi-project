import { inject, Injectable } from '@angular/core';
import { UserRole } from '../enums/user-role';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { LocalStorageKey } from '../../shared/enums/local-storage-key';

@Injectable({
  providedIn: 'root',
})
export class AccountRolesRepository {

  private localStorageService = inject(LocalStorageService);

  private _accountRoles: UserRole[] | null = null;

  async setAccountRoles(userRoles: UserRole[]) {

    if ((await this.getAccountRoles()).length > 0) {
      await this.unsetAccountRoles();
    }

    await this.localStorageService.setStoredData(
      LocalStorageKey.AccountRoles,
      JSON.stringify(userRoles)
    );

    this._accountRoles = userRoles;
  }

  async unsetAccountRoles() {
    await this.localStorageService.removeStoredData(LocalStorageKey.AccountRoles);
    this._accountRoles = null;
  }

  async hasAnyRequiredRole(roles: UserRole[]): Promise<boolean> {
    if (!roles?.length) return false;
    const accountRoles = await this.getAccountRoles();
    return roles.some((role) => accountRoles.includes(role));
  }

  async getAccountRoles(): Promise<UserRole[]> {
    if (this._accountRoles !== null) {
      return this._accountRoles;
    }

    const rolesJson = await this.localStorageService.getStoredData(LocalStorageKey.AccountRoles);
    if (!rolesJson) {
      this._accountRoles = [];
      return this._accountRoles;
    }

    try {
      this._accountRoles = JSON.parse(rolesJson) as UserRole[];
      return this._accountRoles;
    } catch (error) {
      this._accountRoles = [];
      return this._accountRoles;
    }
  }
}
