import { NgModule } from "@angular/core";
import { SharedModule } from "../shared/shared.module";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserModule } from "@angular/platform-browser";
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MainLayoutModule } from "./core/main-layout/main-layout.module";
import { AuthInterceptor } from "./core/core/auth.interceptor";
import { PrimeNGConfig } from 'primeng/api';

@NgModule({
    declarations: [AppComponent],
    bootstrap: [AppComponent],
    imports: [
      BrowserModule,
      BrowserAnimationsModule,
      AppRoutingModule,
      SharedModule,
      MainLayoutModule
    ],
    providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    provideHttpClient(withInterceptorsFromDi())] })
export class AppModule {
  constructor(private primengConfig: PrimeNGConfig){
    this.primengConfig.setTranslation({
      accept: 'Sim',
      reject: 'Não',
    });
  }
}
