import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UrlConfigurationService {
  readonly accountAuthentication = '/account-authentication';
  readonly forbidden = '/forbidden';
  readonly accountOverview = '/account-overview';
}
