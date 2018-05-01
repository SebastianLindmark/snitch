import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { GoogleSignInComponent } from './google-sign-in/google-sign-in.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { BrowseComponent } from './browse/browse.component';

import { AuthenticationService } from './_services/authentication.service';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import {UIRouterModule} from "@uirouter/angular";
import { HelpComponent } from './help/help.component';
import { FooterComponent } from './footer/footer.component';
import { CurrentUserService } from './_services/current-user.service';
import { UserObserverExampleComponent } from './user-observer-example/user-observer-example.component';
import { RepeatValidatorDirective } from './repeat-validator.directive';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { UserComponent } from './user/user.component'

let browseState = { name: 'browse', url: '/browse',  component: BrowseComponent };
let helpState = { name: 'help', url: '/help',  component: HelpComponent };
let userState = { name: 'user', url: '/:user', component: UserComponent };

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    GoogleSignInComponent,
    SignInComponent,
    BrowseComponent,
    HelpComponent,
    FooterComponent,
    UserObserverExampleComponent,
    RepeatValidatorDirective,
    SearchbarComponent,
    UserComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    FormsModule,
    HttpClientModule,
    UIRouterModule.forRoot({states : [browseState, helpState, userState], useHash: true})
  ],
  providers: [AuthenticationService,HttpClient, CurrentUserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
