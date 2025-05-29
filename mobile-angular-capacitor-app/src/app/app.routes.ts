import { Routes } from '@angular/router';
import { authorizationGuard } from './core/guards/authorization/authorization.guard';
import { UserRole } from './core/enums/user-role';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'account-authentication',
    pathMatch: 'full',
  },
  {
    path: 'account-authentication',
    canActivate: [authorizationGuard([UserRole.Guest])],
    loadChildren: () =>
      import('./features/account-authentication/account-authentication.routes').then(
        (m) => m.AUTHENTICATION_ROUTES
      ),
  },
  {
    path: 'account-overview',
    canActivate: [authorizationGuard([UserRole.User])],
    loadChildren: () =>
      import('./features/account-overview/account-overview.routes').then(
        (m) => m.ACCOUNT_OVERVIEW_ROUTES
      ),
  },
  {
    path: 'forbidden',
    loadComponent: () => import('./no-page.component').then((m) => m.NoPageComponent),
  },
  {
    path: '**',
    loadComponent: () => import('./no-page.component').then((m) => m.NoPageComponent),
  },
];
