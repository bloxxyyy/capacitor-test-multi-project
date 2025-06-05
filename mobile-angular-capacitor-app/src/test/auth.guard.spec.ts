import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthenticationStateService } from '../app/core/services/auth-state.service';
import { AuthorizationService } from '../app/core/services/authorization.service';
import { UrlConfigurationService } from '../app/core/config/url-configuration.service';
import { UserRole } from '../app/core/enums/user-role';
import { authorizationGuard } from '../app/core/guards/auth/auth.guard';
import { TestBed } from '@angular/core/testing';

describe('authorizationGuard', () => {
  let mockAuthStateService: jest.Mocked<AuthenticationStateService>;
  let mockAuthorizationService: Partial<jest.Mocked<AuthorizationService>>;
  let mockRouter: Partial<jest.Mocked<Router>>;
  let mockUrlConfigService: jest.Mocked<UrlConfigurationService>;

  beforeEach(() => {
    mockAuthStateService = {
      isAuthenticated: jest.fn(),
    } as unknown as jest.Mocked<AuthenticationStateService>;

    mockAuthorizationService = {
      hasAnyRole: jest.fn(),
    } as Partial<jest.Mocked<AuthorizationService>>;

    mockRouter = {
      createUrlTree: jest.fn(),
    } as Partial<jest.Mocked<Router>>;

    mockUrlConfigService = {
      accountAuthentication: '/some-custom-auth-url',
      forbidden: '/some-forbidden-url',
    } as unknown as jest.Mocked<UrlConfigurationService>;

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthenticationStateService, useValue: mockAuthStateService },
        { provide: AuthorizationService, useValue: mockAuthorizationService },
        { provide: Router, useValue: mockRouter },
        { provide: UrlConfigurationService, useValue: mockUrlConfigService },
      ],
    });
  });

  function runGuard(requiredRoles: UserRole[] = [], url = '/some-url') {
    const guard = authorizationGuard(requiredRoles);

    const fakeRoute = {} as ActivatedRouteSnapshot;
    const fakeState = { url } as RouterStateSnapshot;

    return TestBed.runInInjectionContext(() => guard(fakeRoute, fakeState));
  }

  it('redirects to accountAuthentication if user not authenticated and not already on that URL', () => {
    mockAuthStateService.isAuthenticated.mockReturnValue(false);
    mockRouter.createUrlTree?.mockReturnValue({} as UrlTree);

    const result = runGuard([], '/not-authenticated-url');

    expect(mockAuthStateService.isAuthenticated).toHaveBeenCalled();
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([
      mockUrlConfigService.accountAuthentication,
    ]);
    expect(result).toEqual({});
  });

  it('allows navigation if user not authenticated and already on accountAuthentication URL', () => {
    mockAuthStateService.isAuthenticated.mockReturnValue(false);

    const result = runGuard([], `${mockUrlConfigService.accountAuthentication}/some-path`);

    expect(mockAuthStateService.isAuthenticated).toHaveBeenCalled();
    expect(mockRouter.createUrlTree).not.toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('redirects to forbidden if user authenticated but lacks required role and not already on forbidden URL', () => {
    mockAuthStateService.isAuthenticated.mockReturnValue(true);
    mockAuthorizationService.hasAnyRole?.mockReturnValue(false);
    mockRouter.createUrlTree?.mockReturnValue({} as UrlTree);

    const requiredRoles = [UserRole.User];
    const result = runGuard(requiredRoles, '/some-protected-url');

    expect(mockAuthorizationService.hasAnyRole).toHaveBeenCalledWith(requiredRoles);
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith([mockUrlConfigService.forbidden]);
    expect(result).toEqual({});
  });

  it('allows navigation if user authenticated but lacks role and already on forbidden URL', () => {
    mockAuthStateService.isAuthenticated.mockReturnValue(true);
    mockAuthorizationService.hasAnyRole?.mockReturnValue(false);

    const requiredRoles = [UserRole.User];
    const result = runGuard(requiredRoles, `${mockUrlConfigService.forbidden}/page`);

    expect(mockAuthorizationService.hasAnyRole).toHaveBeenCalledWith(requiredRoles);
    expect(mockRouter.createUrlTree).not.toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('allows navigation if user authenticated and has required roles', () => {
    mockAuthStateService.isAuthenticated.mockReturnValue(true);
    mockAuthorizationService.hasAnyRole?.mockReturnValue(true);

    const requiredRoles = [UserRole.User];
    const result = runGuard(requiredRoles, '/some-url');

    expect(mockAuthorizationService.hasAnyRole).toHaveBeenCalledWith(requiredRoles);
    expect(mockRouter.createUrlTree).not.toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('allows navigation if  user authenticated and no roles are required', () => {
    mockAuthStateService.isAuthenticated.mockReturnValue(true);

    const result = runGuard([], '/some-url');

    expect(mockAuthorizationService.hasAnyRole).not.toHaveBeenCalled();
    expect(mockRouter.createUrlTree).not.toHaveBeenCalled();
    expect(result).toBe(true);
  });
});
