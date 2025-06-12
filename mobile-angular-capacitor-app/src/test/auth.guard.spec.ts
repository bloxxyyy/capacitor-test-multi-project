import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { UserRole } from '../app/core/enums/user-role';
import { TestBed } from '@angular/core/testing';
import { AuthorizationService } from '../app/core/services/authorization.service';
import { AccountService } from '../app/core/services/account.service';
import { UrlConfigurationService } from '../app/core/config/url-configuration.service';
import { requiresAuthenticationGuard } from '../app/core/guards/authentication/requires-authentication.guard';

describe('authorizationGuard', () => {
  let mockAuthStateService: jest.Mocked<AccountService>;
  let mockAuthorizationService: jest.Mocked<AuthorizationService>;
  let mockRouter: jest.Mocked<Router>;
  let mockUrlConfigService: jest.Mocked<UrlConfigurationService>;

  beforeEach(() => {
    mockAuthStateService = {
      isAuthenticated: jest.fn(),
      hasAccountId: jest.fn(),
      hasAccountRoles: jest.fn(),
    } as unknown as jest.Mocked<AccountService>;

    mockAuthorizationService = {
      hasAnyRequiredRole: jest.fn(),
    } as unknown as jest.Mocked<AuthorizationService>;

    mockRouter = {
      createUrlTree: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    mockUrlConfigService = {
      accountAuthentication: '/some-custom-auth-url',
      forbidden: '/some-forbidden-url',
    } as unknown as jest.Mocked<UrlConfigurationService>;

    TestBed.configureTestingModule({
      providers: [
        { provide: AccountService, useValue: mockAuthStateService },
        { provide: AuthorizationService, useValue: mockAuthorizationService },
        { provide: Router, useValue: mockRouter },
        { provide: UrlConfigurationService, useValue: mockUrlConfigService },
      ],
    });
  });

  async function runGuard(requiredRoles: UserRole[] = [], currentUrl = '/some-url') {
    const guard = requiresAuthenticationGuard(requiredRoles);
    const fakeRoute = {} as ActivatedRouteSnapshot;
    const fakeState = { url: currentUrl } as RouterStateSnapshot;
    return await TestBed.runInInjectionContext(() => guard(fakeRoute, fakeState));
  }

  it('redirects to accountAuthentication if user not authenticated and not already on that URL', async () => {
    mockAuthStateService.hasAccountId.mockResolvedValue(false);
    mockRouter.createUrlTree.mockReturnValue({} as UrlTree);

    const result = await runGuard([], '/not-authenticated-url');

    expect(mockAuthStateService.hasAccountId).toHaveBeenCalled();
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([
      mockUrlConfigService.accountAuthentication,
    ]);
    expect(result).toEqual({});
  });

  it('allows navigation if user not authenticated and already on accountAuthentication URL', async () => {
    mockAuthStateService.hasAccountId.mockResolvedValue(false);

    const result = await runGuard([], `${mockUrlConfigService.accountAuthentication}/sub-path`);

    expect(mockAuthStateService.hasAccountId).toHaveBeenCalled();
    expect(mockRouter.createUrlTree).not.toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('redirects to forbidden if user authenticated but lacks required role and not already on forbidden URL', async () => {
    mockAuthStateService.hasAccountId.mockResolvedValue(true);
    mockAuthorizationService.hasAnyRequiredRole.mockResolvedValue(false);
    mockRouter.createUrlTree.mockReturnValue({} as UrlTree);

    const requiredRoles = [UserRole.User];
    const result = await runGuard(requiredRoles, '/protected-resource');

    expect(mockAuthStateService.hasAccountId).toHaveBeenCalled();
    expect(mockAuthorizationService.hasAnyRequiredRole).toHaveBeenCalledWith(requiredRoles);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([mockUrlConfigService.forbidden]);
    expect(result).toEqual({});
  });

  it('allows navigation if user authenticated but lacks role and already on forbidden URL', async () => {
    mockAuthStateService.hasAccountId.mockResolvedValue(true);
    mockAuthorizationService.hasAnyRequiredRole.mockResolvedValue(false);

    const result = await runGuard([UserRole.User], `${mockUrlConfigService.forbidden}/deep`);

    expect(mockAuthStateService.hasAccountId).toHaveBeenCalled();
    expect(mockAuthorizationService.hasAnyRequiredRole).toHaveBeenCalledWith([UserRole.User]);
    expect(mockRouter.createUrlTree).not.toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('allows navigation if user authenticated and has required roles', async () => {
    mockAuthStateService.hasAccountId.mockResolvedValue(true);
    mockAuthorizationService.hasAnyRequiredRole.mockResolvedValue(true);

    const result = await runGuard([UserRole.User], '/some-url');

    expect(mockAuthStateService.hasAccountId).toHaveBeenCalled();
    expect(mockAuthorizationService.hasAnyRequiredRole).toHaveBeenCalledWith([UserRole.User]);
    expect(mockRouter.createUrlTree).not.toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('allows navigation if user authenticated and no roles are required', async () => {
    mockAuthStateService.hasAccountId.mockResolvedValue(true);

    const result = await runGuard([], '/some-url');

    expect(mockAuthStateService.hasAccountId).toHaveBeenCalled();
    expect(mockAuthorizationService.hasAnyRequiredRole).toHaveBeenCalled();
    expect(mockRouter.createUrlTree).not.toHaveBeenCalled();
    expect(result).toBe(true);
  });
});
