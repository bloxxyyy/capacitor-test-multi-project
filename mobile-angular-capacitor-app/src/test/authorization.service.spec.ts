import { TestBed } from '@angular/core/testing';
import { AuthorizationService } from '../app/core/services/authorization.service';
import { AuthenticationService } from '../app/core/services/authentication.service';
import { UserRole } from '../app/core/enums/user-role';

describe('AuthorizationService', () => {
  let service: AuthorizationService;
  let mockAuthService: jest.Mocked<AuthenticationService>;

  beforeEach(() => {
    mockAuthService = {
      getAccountRoles: jest.fn(),
    } as unknown as jest.Mocked<AuthenticationService>;

    TestBed.configureTestingModule({
      providers: [
        AuthorizationService,
        { provide: AuthenticationService, useValue: mockAuthService },
      ],
    });

    service = TestBed.inject(AuthorizationService);
  });

  it('should return true when user has at least one required role', async () => {
    mockAuthService.getAccountRoles.mockResolvedValue([UserRole.User, 'Admin']);

    const result = await service.hasAnyRequiredRole(['Admin', 'Manager']);

    expect(result).toBe(true);
    expect(mockAuthService.getAccountRoles).toHaveBeenCalledTimes(1);
  });

  it('should return false when user has none of the required roles', async () => {
    mockAuthService.getAccountRoles.mockResolvedValue(['User']);

    const result = await service.hasAnyRequiredRole(['Admin']);

    expect(result).toBe(false);
    expect(mockAuthService.getAccountRoles).toHaveBeenCalledTimes(1);
  });

  it('should return false if no roles are required', async () => {
    const result = await service.hasAnyRequiredRole([]);

    expect(result).toBe(false);
    expect(mockAuthService.getAccountRoles).not.toHaveBeenCalled();
  });
});
