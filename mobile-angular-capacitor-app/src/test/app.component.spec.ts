import { render } from '@testing-library/angular';
import { provideZonelessChangeDetection } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppComponent } from '../app/app.component';

describe('AppComponent', () => {
  it('should render the router outlet', async () => {
    const { fixture } = await render(AppComponent, {
      imports: [RouterOutlet],
      providers: [provideZonelessChangeDetection()],
    });

    const routerOutletElement = fixture.nativeElement.querySelector('router-outlet');

    expect(routerOutletElement).toBeInTheDocument();
  });
});
