import { inject, Injectable } from '@angular/core';
import { UserRole } from '../enums/user-role';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { LocalStorageKey } from '../../shared/enums/local-storage-key';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
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

  async hasAccountId(): Promise<boolean> {
    const accountId = await this.localStorageService.getStoredData(LocalStorageKey.AccountId);
    return !!accountId;
  }

  async login(roles: UserRole[] = [UserRole.User]): Promise<void> {
    const testAccountId = 'test-account-id';

    await this.localStorageService.setStoredData(LocalStorageKey.AccountId, testAccountId);
    await this.localStorageService.setStoredData(
      LocalStorageKey.AccountRoles,
      JSON.stringify(roles)
    );
  }

  async logout(): Promise<void> {
    await this.localStorageService.removeStoredData(LocalStorageKey.AccountId);
    await this.localStorageService.removeStoredData(LocalStorageKey.AccountRoles);
    await this.localStorageService.setStoredData(
      LocalStorageKey.AccountRoles,
      JSON.stringify([UserRole.Guest])
    );
  }
}
