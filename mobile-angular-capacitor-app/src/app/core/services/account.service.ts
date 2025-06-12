import { inject, Injectable } from '@angular/core';
import { UserRole } from '../enums/user-role';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { LocalStorageKey } from '../../shared/enums/local-storage-key';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private localStorageService = inject(LocalStorageService);

  async hasAccountId(): Promise<boolean> {
    const accountId = await this.localStorageService.getStoredData(LocalStorageKey.AccountId);
    return !!accountId;
  }

  async setAccount(roles: UserRole[] = [UserRole.User]): Promise<void> {
    // If we already had an account, as in we only wanted to go through biometrics - we wont need a new accountId.
    const accountId = await this.localStorageService.getStoredData(LocalStorageKey.AccountId);
    if (accountId) {
      return;
    }

    const testAccountId = 'test-account-id';
    await this.localStorageService.setStoredData(LocalStorageKey.AccountId, testAccountId);
    await this.localStorageService.setStoredData(
      LocalStorageKey.AccountRoles,
      JSON.stringify(roles)
    );
  }

  async unsetAccount(): Promise<void> {
    await this.localStorageService.removeStoredData(LocalStorageKey.AccountId);
    await this.localStorageService.removeStoredData(LocalStorageKey.AccountRoles);

    await this.localStorageService.setStoredData(
      LocalStorageKey.AccountRoles,
      JSON.stringify([UserRole.Guest])
    );
  }
}
