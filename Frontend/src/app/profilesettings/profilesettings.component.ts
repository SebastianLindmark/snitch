import { Component, OnInit } from '@angular/core';
import { SettingsService } from '../_services/settings.service';

@Component({
  selector: 'profilesettings',
  templateUrl: './profilesettings.component.html',
  styleUrls: ['./profilesettings.component.scss']
})
export class ProfilesettingsComponent implements OnInit {

  public username = "";

  constructor(private settings : SettingsService) { }

  ngOnInit() {
  }

  changeUserName(){
      var streamKeyFunction = this.settings.getStreamKey();
      streamKeyFunction.subscribe(response => {
        console.log(response);
      },
      error => {
        console.log(error);
        console.log("not retreive key");
      }
    );
  }
}
