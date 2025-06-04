import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { AuthorizationService } from './authorization.service';
import { AuthenticationStateService } from '../auth-state.service';

describe('AuthorizationService', () => {
  let service: AuthorizationService;
  let mockAuthStateService: jest.Mocked<AuthenticationStateService>;

  beforeEach(() => {
    mockAuthStateService = {
      userRoles: jest.fn(),
    } as unknown as jest.Mocked<AuthenticationStateService>;

    TestBed.configureTestingModule({
      providers: [
        AuthorizationService,
        { provide: AuthenticationStateService, useValue: mockAuthStateService },
        provideZonelessChangeDetection(),
      ],
    });

    service = TestBed.inject(AuthorizationService);
  });

  it('should return true when user has a specified role', () => {
    mockAuthStateService.userRoles.mockReturnValue(['TestRole']);

    const result = service.hasAnyRole(['TestRole', 'TestRole2']);

    expect(result).toBe(true);
    expect(mockAuthStateService.userRoles).toHaveBeenCalledTimes(1);
  });

  it('should return false when user has none of the specified roles', () => {
    mockAuthStateService.userRoles.mockReturnValue(['TestRole']);

    const result = service.hasAnyRole(['TestRole2']);

    expect(result).toBe(false);
    expect(mockAuthStateService.userRoles).toHaveBeenCalledTimes(1);
  });

  it('should return false when hasAnyRole has no determined role', () => {
    mockAuthStateService.userRoles.mockReturnValue([]);

    const result = service.hasAnyRole([]);

    expect(result).toBe(false);
    expect(mockAuthStateService.userRoles).toHaveBeenCalledTimes(0);
  });
});
