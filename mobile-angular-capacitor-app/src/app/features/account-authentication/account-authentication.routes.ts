import { Routes } from '@angular/router';

export const AUTHENTICATION_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'authentication-dashboard',
    pathMatch: 'full',
  },
  {
    path: 'authentication-dashboard',
    loadComponent: () =>
      import('./authentication-dashboard/authentication-dashboard.component').then(
        (m) => m.AuthenticationDashboardComponent
      ),
  },
  {
    path: 'create-new-account',
    loadComponent: () =>
      import('./create-new-account/create-new-account.component').then(
        (m) => m.CreateNewAccountComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent),
  },
];
