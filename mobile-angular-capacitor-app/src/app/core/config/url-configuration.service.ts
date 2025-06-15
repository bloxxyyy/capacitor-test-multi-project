import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UrlConfigurationService {
  readonly accountAuthentication = '/account-authentication';
  readonly createAccountPath = '/account-authentication/create-new-account';
  readonly loginPath = '/account-authentication/login';
  readonly forbidden = '/forbidden';
  readonly accountOverview = '/account-overview';
}
