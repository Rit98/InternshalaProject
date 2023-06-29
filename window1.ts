import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

import { GrpcWebClientModule, GrpcWebClientSettings } from 'ngx-grpc-web';
import { CodeGeneratorClient } from './codegen_pb_service';

const grpcWebClientSettings: GrpcWebClientSettings = {
  host: environment.grpcBaseUrl,
  transport: window['__env'].grpcTransport,
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    GrpcWebClientModule.forRoot(grpcWebClientSettings),
  ],
  providers: [CodeGeneratorClient],
  bootstrap: [AppComponent],
})
export class AppModule {}
