import { BrowserModule } from '@angular/platform-browser';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginModule } from './login/login.module';
import { MainModule } from './main/main.module';
import { AdminModule } from './admin/admin.module';
import { _404Module } from './404/404.module';
import { InitApp } from './_helpers/app.initializer';
import { AuthenService } from './_core/services/authen.service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { LoginService } from './_core/services/login.service';
import { WebSocketService } from './_core/services/websocket.service';
import { WebSocketHandler } from 'src/assets/js/websocket/WSMediator';
import { ApiUrlConstants } from './_core/common/api-url.constants';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    LoginModule,
    MainModule,
    AdminModule,
    _404Module,
    BrowserAnimationsModule,
    MatDialogModule,
    FormsModule,
  ],
  
  providers: [
    {provide:APP_INITIALIZER, useFactory: InitApp, multi:true, deps: [AuthenService]},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi:true},
    {provide:HTTP_INTERCEPTORS, useClass:ErrorInterceptor, multi:true},
    {
      provide: MatDialogRef,
      useValue: {}
    },
    //fakeBackendProvider
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(private loginService: LoginService){
    loginService.OLS.subscribe(_ => WebSocketHandler.EstablishConnect(ApiUrlConstants.WS_URL));
  }
}

