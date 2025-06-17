import { Component, inject } from '@angular/core';
import { AuthenticationService } from '../../../core/services/authentication.service';
@Component({
  selector: 'app-create-new-account',
  imports: [],
  templateUrl: './create-new-account.component.html',
  styleUrl: './create-new-account.component.scss',
})
export class CreateNewAccountComponent {
  private authenticationService = inject(AuthenticationService);

  async onCreateAccount(): Promise<void> {
    await this.authenticationService.onCreateAccount();
  }
}
