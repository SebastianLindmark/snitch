import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { SignInComponent } from './sign-in/sign-in.component';
import { BrowseComponent } from './browse/browse.component';

import { AuthenticationService } from './_services/authentication.service';
import { HttpClient,HttpClientModule } from '@angular/common/http';
import { HelpComponent } from './help/help.component';
import { FooterComponent } from './footer/footer.component';
import { CurrentUserService } from './_services/current-user.service';
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
import { UserRequestService } from './_services/user-request.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { JwtInterceptorService } from './_services/jwt-interceptor.service';
import { SettingsService } from './_services/settings.service';
import { StreamsettingsComponent } from './streamsettings/streamsettings.component';
import { ChannelGuardService } from './channel-guard.service';
import { ActivatedRouteSnapshot, ActivatedRoute } from '@angular/router';
import { BrowseService } from './_services/browse.service';
import { GameCollectionComponent } from './game-collection/game-collection.component';
import { LivesettingsComponent } from './livesettings/livesettings.component';
import { VodRequestService } from './_services/vod-request.service';
import { VideoPlayerService } from './_services/video-player.service';
import { FollowerRequestService } from './_services/follower-request.service';


@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    SignInComponent,
    BrowseComponent,
    HelpComponent,
    FooterComponent,
    SearchbarComponent,
    UserComponent,
    SettingsComponent,
    Tabs,
    Tab,
    ProfilesettingsComponent,
    ChatComponent,
    PageNotFoundComponent,
    StreamsettingsComponent,
    GameCollectionComponent,
    LivesettingsComponent,

  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    FormsModule,
    HttpClientModule,
    RoutingModule
  ],
  providers: [BrowseService, AuthenticationService, SettingsService, HttpClient, CurrentUserService, AuthGuardService, ChannelGuardService, JwtHelper, UserRequestService,VodRequestService,VideoPlayerService, FollowerRequestService, {
    provide: HTTP_INTERCEPTORS,
    useClass: JwtInterceptorService,
    multi: true
  }],
  bootstrap: [AppComponent]
  
})
export class AppModule { }
