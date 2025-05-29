import { Injectable, Signal, signal } from '@angular/core';
import { UserRole } from '../../enums/user-role';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationStateService {
  private isAuthenticatedSignal = signal(false);
  private userRolesSignal = signal<UserRole[]>([UserRole.Guest]);

  get isAuthenticated(): Signal<boolean> {
    return this.isAuthenticatedSignal.asReadonly();
  }

  get userRoles(): Signal<UserRole[]> {
    return this.userRolesSignal.asReadonly();
  }

  login(roles: UserRole[] = [UserRole.User]) {
    this.isAuthenticatedSignal.set(true);
    this.userRolesSignal.set(roles);
  }

  logout() {
    this.isAuthenticatedSignal.set(false);
    this.userRolesSignal.set([UserRole.Guest]);
  }
}
