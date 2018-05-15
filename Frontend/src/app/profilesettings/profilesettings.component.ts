import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../_services/settings.service';
import { UserRequestService } from '../_services/user-request.service';
import { CurrentUserService } from '../_services/current-user.service';

@Component({
  selector: 'profilesettings',
  templateUrl: './profilesettings.component.html',
  styleUrls: ['./profilesettings.component.scss']
})
export class ProfilesettingsComponent implements OnInit {

  public username = "";

  constructor(private settings : SettingsService, private userService : UserRequestService, private currentUser : CurrentUserService) { }

  ngOnInit() {
  }

  changeUserName(){
    var updateUsername = this.settings.updateUser(this.username);
      updateUsername.subscribe( response => {
        if(response.success){
          localStorage.setItem('user-token', response.token);
          this.currentUser.loadUser(response.token);
        }
      },
      error => {

      });
  }
}
