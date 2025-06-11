import { Routes } from '@angular/router';

export const ACCOUNT_OVERVIEW_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'account-overview-dashboard',
    pathMatch: 'full',
  },
  {
    path: 'account-overview-dashboard',
    loadComponent: () =>
      import('../../features/account-overview/account-overview-dashboard/account-overview-dashboard.component').then(
        (m) => m.AccountOverviewDashboardComponent
      ),
  },
];
