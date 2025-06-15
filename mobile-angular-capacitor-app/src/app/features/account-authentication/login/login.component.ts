import { Component, inject } from '@angular/core';
import { AuthenticationService } from '../../../core/services/authentication.service';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private authenticationService = inject(AuthenticationService);

  async onLoginWithAccountInformation(): Promise<void> {
    await this.authenticationService.onLoginWithAccountInformation();
  }
}
