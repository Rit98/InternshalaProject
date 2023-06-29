import { Component } from '@angular/core';
import { CodeGeneratorClient, CodeRequest } from '../codegen_pb_service';

@Component({
  selector: 'app-code-generation',
  template: `
    <button (click)="generateCode()">Generate Code</button>
  `,
})
export class CodeGenerationComponent {
  constructor(private codeGeneratorClient: CodeGeneratorClient) {}

  generateCode() {
    const request = new CodeRequest();
    this.codeGeneratorClient.generateCode(request, null, (err, response) => {
      if (err) {
        console.log('Error:', err.message);
        return;
      }
      console.log('Generated Code:', response.getCode());
    });
  }
}
