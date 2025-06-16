import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UrlConfigurationService {
  readonly accountAuthentication = '/account-authentication';
  readonly createAccountPath = '/account-authentication/create-new-account';
  readonly loginPath = '/account-authentication/login';
  readonly pinVerification = '/account-authentication/pin-verification';
  readonly forbidden = '/forbidden';
  readonly accountOverview = '/account-overview';
  readonly accountSettings = '/account-overview/account-overview-settings';
}
