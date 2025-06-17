import { Routes } from '@angular/router';
import { UserRole } from '../enums/user-role';
import { requiresAuthenticationGuard } from '../guards/authentication/requires-authentication.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'account-overview',
    pathMatch: 'full',
  },
  {
    path: 'account-authentication',
    loadChildren: () =>
      import('./account-authentication.routes').then((m) => m.AUTHENTICATION_ROUTES),
  },
  {
    path: 'account-overview',
    canActivate: [requiresAuthenticationGuard([UserRole.User])],
    loadChildren: () => import('./account-overview.routes').then((m) => m.ACCOUNT_OVERVIEW_ROUTES),
  },
  {
    path: 'forbidden',
    loadComponent: () =>
      import('../../features/no-page/no-page.component').then((m) => m.NoPageComponent),
  },
  {
    path: '**',
    loadComponent: () =>
      import('../../features/no-page/no-page.component').then((m) => m.NoPageComponent),
  },
];
