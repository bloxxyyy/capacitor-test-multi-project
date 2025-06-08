import { Component, OnInit } from '@angular/core';
import { NativeBiometric } from "@capgo/capacitor-native-biometric";

@Component({
  selector: 'app-authentication-dashboard',
  imports: [],
  templateUrl: './authentication-dashboard.component.html',
  styleUrl: './authentication-dashboard.component.scss',
})
export class AuthenticationDashboardComponent implements OnInit {

  ngOnInit(): void {
    this.performBiometricVerification();
  }

  async performBiometricVerification() {
    const result = await NativeBiometric.isAvailable();

    if(!result.isAvailable) return;

    //const isFaceID = result.biometryType == BiometryType.FACE_ID;

    const verified = await NativeBiometric.verifyIdentity({
      reason: "For easy log in",
      title: "Log in",
      subtitle: "Maybe add subtitle here?",
      description: "Maybe a description too?",
    })
      .then(() => true)
      .catch(() => false);

    if(!verified) return;

    NativeBiometric.setCredentials({
      username: "usernameTest",
      password: "passwordTest",
      server: "www.example.com",
    }).then();

    const credentials = await NativeBiometric.getCredentials({
      server: "www.example.com",
    });

    console.log('Biometric credentials:', credentials);

    //await this.router.navigate(['/login']);

  }

}
