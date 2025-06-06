import { inject, Injectable, Signal, signal } from '@angular/core';
import { UserRole } from '../enums/user-role';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { LocalStorageKey } from '../../shared/enums/local-storage-key';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private localStorageService = inject(LocalStorageService);

  private userRolesSignal = signal<UserRole[] | string[]>([UserRole.Guest]);

  get userRoles(): Signal<UserRole[] | string[]> {
    return this.userRolesSignal.asReadonly();
  }

  async isAuthenticated(): Promise<boolean> {
    const accountId = await this.localStorageService.getStoredData(LocalStorageKey.AccountId);
    return !!accountId;
  }

  async login(roles: UserRole[] = [UserRole.User]): Promise<void> {
    const testAccountId = 'test-account-id';

    await this.localStorageService.setStoredData(LocalStorageKey.AccountId, testAccountId);

    this.userRolesSignal.set(roles);
  }

  async logout(): Promise<void> {
    await this.localStorageService.removeStoredData(LocalStorageKey.AccountId);
    this.userRolesSignal.set([UserRole.Guest]);
  }
}
