import { TestBed } from '@angular/core/testing';
import { AuthorizationService } from './authorization.service';
import { AuthenticationStateService } from '../auth-state.service';

describe('AuthorizationService', () => {
  let service: AuthorizationService;
  let mockAuthStateService: jasmine.SpyObj<AuthenticationStateService>;

  beforeEach(() => {
    mockAuthStateService = jasmine.createSpyObj<AuthenticationStateService>('AuthenticationStateService', ['userRoles']);

    TestBed.configureTestingModule({
      providers: [
        AuthorizationService,
        { provide: AuthenticationStateService, useValue: mockAuthStateService },
      ],
    });

    service = TestBed.inject(AuthorizationService);
  });

  it('should return true when user has a specified role', () => {
    mockAuthStateService.userRoles.and.returnValue(["TestRole"]);

    const result = service.hasAnyRole(["TestRole", "TestRole2"]);

    expect(result).toBeTrue();
  });

  it('should return false when user has none of the specified roles', () => {
    mockAuthStateService.userRoles.and.returnValue(["TestRole"]);

    const result = service.hasAnyRole(["TestRole2"]);

    expect(result).toBeFalse();
  });

  it('should return false when hasAnyRole has no determined role', () => {
    mockAuthStateService.userRoles.and.returnValue([]);

    const result = service.hasAnyRole([]);

    expect(result).toBeFalse();
  });
});
