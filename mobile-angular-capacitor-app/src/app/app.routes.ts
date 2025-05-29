import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'account-authentication',
    pathMatch: 'full',
  },
  {
    path: '**',
    loadComponent: () =>
      import('./no-page.component').then(m => m.NoPageComponent),
  },
  {
    path: 'account-authentication',
    loadChildren: () =>
      import('./features/account-authentication/account-authentication.routes').then(m => m.AUTHENTICATION_ROUTES),
  },
  {
    path: 'account-overview',
    loadChildren: () =>
      import('./features/account-overview/account-overview.routes').then(m => m.ACCOUNT_OVERVIEW_ROUTES),
  }
];
