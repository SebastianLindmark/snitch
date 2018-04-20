import { Component, OnInit } from '@angular/core';
import { CurrentUserService } from '../_services/current-user.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  public pressedLogIn = true;
  public activateSignInComponent = false;
  
  public closeWindow = false;
  constructor(private currentUser :CurrentUserService) { }

  ngOnInit() {
    this.currentUser.registerState().subscribe(user => {});
  }

  clickedLogIn(){
    this.pressedLogIn = true;
    this.activateSignInComponent = true;
  }

  clickedSignUp(){
    this.pressedLogIn = false;
    this.activateSignInComponent = true;
  }

}