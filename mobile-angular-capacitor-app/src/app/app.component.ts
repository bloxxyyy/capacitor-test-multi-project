import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppLifecycleService } from './core/services/app-lifecycle.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`,
  styles: [``],
})
export class AppComponent {

  // This service is used to handle app lifecycle events such as pause and resume for biometric authentication.
  constructor(_ : AppLifecycleService) { }

}
