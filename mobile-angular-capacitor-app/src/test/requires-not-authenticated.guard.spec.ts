import { TestBed } from '@angular/core/testing';
import { UrlConfigurationService } from '../app/core/config/url-configuration.service';
import { requiresNotAuthenticatedGuard } from '../app/core/guards/authentication/requires-not-authenticated.guard';
import { AccountIdRepository } from '../app/core/repositories/accountId.repository';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';

describe('requiresNotAuthenticatedGuard (zoneless)', () => {
  let mockAccountIdRepository: jest.Mocked<AccountIdRepository>;
  let mockUrlConfigurationService: UrlConfigurationService;

  const mockRoute = {} as ActivatedRouteSnapshot;
  const mockState = { url: '/test' } as RouterStateSnapshot;

  beforeEach(() => {
    mockAccountIdRepository = {
      hasAccountId: jest.fn(),
    } as unknown as jest.Mocked<AccountIdRepository>;

    mockUrlConfigurationService = {
      forbidden: '/forbidden',
    } as UrlConfigurationService;

    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: AccountIdRepository, useValue: mockAccountIdRepository },
        { provide: UrlConfigurationService, useValue: mockUrlConfigurationService },
      ],
    });
  });

  it('should allow access when not authenticated', async () => {
    // Arrange
    mockAccountIdRepository.hasAccountId.mockResolvedValue(false);

    // Act
    const guardFn = requiresNotAuthenticatedGuard();
    const result = await TestBed.runInInjectionContext(() => guardFn(mockRoute, mockState));

    // Assert
    expect(result).toBe(true);
    expect(mockAccountIdRepository.hasAccountId).toHaveBeenCalledTimes(1);
  });

  it('should redirect to forbidden route when authenticated', async () => {
    // Arrange
    mockAccountIdRepository.hasAccountId.mockResolvedValue(true);

    // Act
    const guardFn = requiresNotAuthenticatedGuard();
    const result = await TestBed.runInInjectionContext(() => guardFn(mockRoute, mockState));

    // Assert
    expect(result).toBeInstanceOf(UrlTree);
    expect((result as UrlTree).toString()).toBe('/forbidden');
  });
});
