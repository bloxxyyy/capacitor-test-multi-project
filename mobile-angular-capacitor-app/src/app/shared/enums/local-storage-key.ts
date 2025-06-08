/*
 * using keys in local storage could potentionally use keys from other apps.
 * so we use a prefix to avoid conflicts with other apps.
 */
export enum LocalStorageKey {
  HasBiometricEnabled = 'MyAppPrefix-hasBiometricEnabled',
  OnReopen = 'MyAppPrefix-biometric',
  AccountId = 'MyAppPrefix-accountId',
  AccountRoles = 'MyAppPrefix-accountRoles',
}
