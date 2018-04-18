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
import { CurrentUserService } from './_services/current-user.service';
import { UserObserverExampleComponent } from './user-observer-example/user-observer-example.component';


@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    GoogleSignInComponent,
    SignInComponent,
    UserObserverExampleComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    FormsModule,
    HttpClientModule
  ],
  providers: [AuthenticationService,HttpClient, CurrentUserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
