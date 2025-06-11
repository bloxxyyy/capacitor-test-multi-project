import { Routes } from '@angular/router';
import { requiresNotAuthenticatedGuard } from '../guards/authentication/requires-not-authenticated.guard';

export const AUTHENTICATION_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'authentication-dashboard',
    pathMatch: 'full',
  },
  {
    path: 'authentication-dashboard',
    canActivate: [requiresNotAuthenticatedGuard()],
    loadComponent: () =>
      import('../../features/account-authentication/authentication-dashboard/authentication-dashboard.component').then(
        (m) => m.AuthenticationDashboardComponent
      ),
  },
  {
    path: 'create-new-account',
    canActivate: [requiresNotAuthenticatedGuard()],
    loadComponent: () =>
      import('../../features/account-authentication/create-new-account/create-new-account.component').then(
        (m) => m.CreateNewAccountComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () => import('../../features/account-authentication/login/login.component').then((m) => m.LoginComponent),
  },
];
