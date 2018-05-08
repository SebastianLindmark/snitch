import { Component, OnInit } from '@angular/core';
import { CurrentUserService } from '../_services/current-user.service';
import { User } from '../_models/user';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  public pressedLogIn = true;
  public activateSignInComponent = false;

  public closeWindow = false;

  public loggedIn = false;
  public user = new User(undefined,undefined,undefined);

  constructor(private currentUser :CurrentUserService) { }


  ngOnInit() {
    this.currentUser.registerState().subscribe(result => {
      this.loggedIn = result.loggedIn;
      if(result.loggedIn){
        this.user = result.user;
      }
    });
  }

  clickedLogIn(){
    this.pressedLogIn = true;
    this.closeWindow = false;
    this.activateSignInComponent = true;
  }

  clickedSignUp(){
    this.pressedLogIn = false;
    this.closeWindow = false;
    this.activateSignInComponent = true;
  }

}