import { Component, OnInit, ViewChild } from '@angular/core';
import { BrowseService } from '../_services/browse.service';
import { UserRequestService } from '../_services/user-request.service';
import { CurrentUserService } from '../_services/current-user.service';

@Component({
  selector: 'app-livesettings',
  templateUrl: './livesettings.component.html',
  styleUrls: ['./livesettings.component.scss']
})
export class LivesettingsComponent implements OnInit {

  private games = [];
  private gameInput;
  private titleInput;
  private updatedProfile = false;

  @ViewChild('gameName') gameNameElement;

  constructor(private currentUserService: CurrentUserService, private userProfileService: UserRequestService, private gameService: BrowseService) {

  }

  ngOnInit() {

    this.currentUserService.registerState().subscribe(response => {
      if (response.loggedIn) {
        var username = response.user.username;        
        this.loadProfile(username);
      }

    })
  }

  loadProfile(username) {
    this.userProfileService.getUserProfile(username).subscribe(response => {
      this.gameInput = response.result.game;
      this.titleInput = response.result.title;
    })
  }

  formSubmit() {
    this.gameService.loadGame(this.gameInput).subscribe(response => {

      this.gameNameElement.control.setErrors(null);

      if (response === null) {
        this.gameNameElement.control.setErrors({ 'incorrect': true })
      } else {
        this.updateProfile()
      }
    })
  }

  updateProfile() {
    this.userProfileService.updateUserProfile(this.titleInput, this.gameInput).subscribe(response => {
      this.updatedProfile = response.success;
    })
  }


}
