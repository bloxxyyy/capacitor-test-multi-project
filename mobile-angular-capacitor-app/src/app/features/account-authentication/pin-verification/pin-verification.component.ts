import { Component, inject } from '@angular/core';
import { UserVerificationService } from '../../../core/services/user-verification.service';

@Component({
  selector: 'app-pin-verification',
  imports: [],
  templateUrl: './pin-verification.component.html',
  styleUrl: './pin-verification.component.scss',
})
export class PinVerificationComponent {
  private userVerificationService = inject(UserVerificationService);

  onVerifyWithPin() {
    this.userVerificationService.verifyWithPin();
  }
}
