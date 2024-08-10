import { NgModule } from "@angular/core";
import { SharedModule } from "./core/core/shared/shared.module";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserModule } from "@angular/platform-browser";
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from "@angular/common/http";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MainLayoutModule } from "./core/main-layout/main-layout.module";
import { AuthInterceptor } from "./core/core/handler/auth.interceptor";
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { CoreModule } from "./core/core/core.module";
import { ErrorInterceptor } from "./core/core/handler/error.interceptor";

@NgModule({
    declarations: [AppComponent],
    bootstrap: [AppComponent],
    imports: [
      BrowserModule,
      BrowserAnimationsModule,
      AppRoutingModule,
      SharedModule,
      MainLayoutModule,
      CoreModule
    ],
    providers: [
      MessageService,
      { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
      provideHttpClient(withInterceptorsFromDi()),
      { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
    ]
})
export class AppModule {
  constructor(private primengConfig: PrimeNGConfig){
    this.primengConfig.setTranslation({
      accept: 'Sim',
      reject: 'Não',
    });
  }
}
