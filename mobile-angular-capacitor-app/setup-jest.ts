import '@testing-library/jest-dom';
import { setupZonelessTestEnv } from 'jest-preset-angular/setup-env/zoneless';

setupZonelessTestEnv();

// Considering we dont want jest to run the actual Capacitor plugins, we mock them here.
jest.mock('@capgo/capacitor-native-biometric', () => ({
  CapacitorNativeBiometric: {
    isAvailable: jest.fn().mockResolvedValue({ value: true }),
    verifyIdentity: jest.fn().mockResolvedValue({ verified: true }),
  },
}));
