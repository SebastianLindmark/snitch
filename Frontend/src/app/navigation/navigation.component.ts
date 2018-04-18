import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  public pressedLogIn = true;
  public activateSignInComponent = false;
  constructor() { }

  ngOnInit() {

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
