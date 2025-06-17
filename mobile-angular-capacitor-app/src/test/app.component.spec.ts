import { render } from '@testing-library/angular';
import { provideZonelessChangeDetection } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppComponent } from '../app/app.component';
import { AppLifecycleService } from '../app/core/services/app-lifecycle.service';
import { UserVerificationService } from '../app/core/services/user-verification.service';
import { AccountIdRepository } from '../app/core/repositories/accountId.repository';

describe('AppComponent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the router outlet', async () => {
    const { fixture } = await render(AppComponent, {
      imports: [RouterOutlet],
      providers: [provideZonelessChangeDetection()],
    });

    const routerOutletElement = fixture.nativeElement.querySelector('router-outlet');

    expect(routerOutletElement).toBeInTheDocument();
  });

  it('should call onStartup from AppLifecycleService', async () => {
    const onStartupSpy = jest.spyOn(AppLifecycleService.prototype, 'onStartup');

    await render(AppComponent, {
      imports: [RouterOutlet],
      providers: [
        provideZonelessChangeDetection(),
        {
          provide: UserVerificationService,
          useValue: {
            verifyWithBiometrics: jest.fn(),
            wasManuallyPaused: false,
          },
        },
        {
          provide: AccountIdRepository,
          useValue: {
            hasAccountId: jest.fn().mockResolvedValue(false),
          },
        },
      ],
    });

    expect(onStartupSpy).toHaveBeenCalled();
  });
});
