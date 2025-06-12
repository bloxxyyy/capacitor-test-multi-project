import { inject, Injectable } from '@angular/core';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { LocalStorageKey } from '../../shared/enums/local-storage-key';

@Injectable({
  providedIn: 'root',
})
export class AccountIdRepository {
  private localStorageService = inject(LocalStorageService);

  private _accountId: string | null = null;

  async hasAccountId(): Promise<boolean> {
    const accountId = await this.getAccountId();
    return accountId !== null;
  }

  async setAccount(id: string): Promise<void> {
    if (await this.hasAccountId()) {
      await this.unsetAccount();
    }

    await this.localStorageService.setStoredData(LocalStorageKey.AccountId, id);
    this._accountId = id;
  }

  async unsetAccount(): Promise<void> {
    this._accountId = null;
    await this.localStorageService.removeStoredData(LocalStorageKey.AccountId);
  }

  async getAccountId(): Promise<string | null> {
    if (this._accountId !== null) {
      return this._accountId;
    }

    this._accountId = await this.localStorageService.getStoredData(LocalStorageKey.AccountId);
    return this._accountId;
  }
}
