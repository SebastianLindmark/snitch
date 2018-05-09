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
import { HelpComponent } from './help/help.component';
import { FooterComponent } from './footer/footer.component';
import { CurrentUserService } from './_services/current-user.service';
import { UserObserverExampleComponent } from './user-observer-example/user-observer-example.component';
import { RepeatValidatorDirective } from './repeat-validator.directive';
import { SearchbarComponent } from './searchbar/searchbar.component';
import { UserComponent } from './user/user.component';
import { SettingsComponent } from './settings/settings.component';
import { Tabs } from './tabs/tabs.component';
import { Tab } from './tab/tab.component';
import { ProfilesettingsComponent } from './profilesettings/profilesettings.component'
import { ChatComponent } from './chat/chat.component';
import { RoutingModule } from './routing.module';
import { AuthGuardService } from './authguard.service'
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { JwtHelper } from 'angular2-jwt';
import {UserRequestService} from './_services/user-request.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptorService } from './_services/jwt-interceptor.service';
import { SettingsService } from './_services/settings.service';
import { StreamsettingsComponent } from './streamsettings/streamsettings.component';
import { ChannelGuardService } from './channel-guard.service';
import { ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';


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
    UserComponent,
    SettingsComponent,
    Tabs,
    Tab,
    ProfilesettingsComponent,
    ChatComponent,
    PageNotFoundComponent,
    StreamsettingsComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    FormsModule,
    HttpClientModule,
    RoutingModule
  ],
  providers: [AuthenticationService, SettingsService, HttpClient, CurrentUserService, AuthGuardService, ChannelGuardService, JwtHelper, UserRequestService, {
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
  
})
export class AppModule { }
