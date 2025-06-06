import { TestBed } from '@angular/core/testing';
import { Preferences } from '@capacitor/preferences';
import { LocalStorageService } from '../app/shared/services/local-storage.service';

jest.mock('@capacitor/preferences', () => ({
  Preferences: {
    set: jest.fn(),
    get: jest.fn(),
    remove: jest.fn(),
  },
}));

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LocalStorageService],
    });
    service = TestBed.inject(LocalStorageService);

    jest.clearAllMocks();
  });

  describe('setStoredData', () => {
    it('should call Preferences.set with the correct key and value', async () => {
      const key = 'accountId';
      const value = 'test-value';

      await service.setStoredData(key, value);

      expect(Preferences.set).toHaveBeenCalledWith({ key, value });
      expect(Preferences.set).toHaveBeenCalledTimes(1);
    });

    it('should not call Preferences.set if key is falsy', async () => {
      await service.setStoredData('', 'value');
      await service.setStoredData(null as unknown as string, 'value');
      await service.setStoredData(undefined as unknown as string, 'value');

      expect(Preferences.set).not.toHaveBeenCalled();
    });
  });

  describe('getStoredData', () => {
    it('should call Preferences.get and return the value if key provided', async () => {
      const key = 'accountId';
      const returnedValue = 'stored-value';

      (Preferences.get as jest.Mock).mockResolvedValue({ value: returnedValue });

      const result = await service.getStoredData(key);

      expect(Preferences.get).toHaveBeenCalledWith({ key });
      expect(result).toBe(returnedValue);
    });

    it('should return null and not call Preferences.get if key is falsy', async () => {
      const result1 = await service.getStoredData('');
      const result2 = await service.getStoredData(null as unknown as string);
      const result3 = await service.getStoredData(undefined as unknown as string);

      expect(Preferences.get).not.toHaveBeenCalled();
      expect(result1).toBeNull();
      expect(result2).toBeNull();
      expect(result3).toBeNull();
    });
  });

  describe('removeStoredData', () => {
    it('should call Preferences.remove with a filled in key', async () => {
      const key = 'accountId';

      await service.removeStoredData(key);

      expect(Preferences.remove).toHaveBeenCalledWith({ key });
      expect(Preferences.remove).toHaveBeenCalledTimes(1);
    });

    it('should not call Preferences.remove if key is falsy', async () => {
      await service.removeStoredData('');
      await service.removeStoredData(null as unknown as string);
      await service.removeStoredData(undefined as unknown as string);

      expect(Preferences.remove).not.toHaveBeenCalled();
    });
  });
});
