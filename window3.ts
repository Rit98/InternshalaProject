import { Component } from '@angular/core';
import { CodeGeneratorClient, CodeVerificationRequest } from '../codegen_pb_service

@Component({
  selector: 'app-code-verification',
  template: `
    <input type="text" [(ngModel)]="code" (input)="verifyCode()" maxlength="1">
    <!-- Repeat the input element above for a total of 6 inputs -->

    <p>{{ verificationResult }}</p>
  `,
})
export class CodeVerificationComponent {
  code: string = '';
  verificationResult: string = '';

  constructor(private codeGeneratorClient: CodeGeneratorClient) {}

  verifyCode() {
    if (this.code.length === 6) {
      const request = new CodeVerificationRequest();
      request.setCode(this.code);

      this.codeGeneratorClient.verifyCode(request, null, (err, response) => {
        if (err) {
          console.log('Error:', err.message);
          this.verificationResult = 'Code verification failed';
          return;
        }
        this.verificationResult = response.getMessage();
      });
    }
  }
}
