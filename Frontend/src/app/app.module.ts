import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { GoogleSignInComponent } from './google-sign-in/google-sign-in.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { AuthenticationService } from './_services/authentication.service';
import { HttpClient,HttpClientModule } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    GoogleSignInComponent,
    SignInComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    FormsModule,
    HttpClientModule
  ],
  providers: [AuthenticationService,HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
