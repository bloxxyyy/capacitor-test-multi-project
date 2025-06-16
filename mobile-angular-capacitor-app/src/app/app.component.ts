import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppLifecycleService } from './core/services/app-lifecycle.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  styles: [``],
})
export class AppComponent {
  constructor() {
    inject(AppLifecycleService);
  }
}
