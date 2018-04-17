import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  public username = "";
  public email = "";
  public password = "";
  public passwordAgain = "";

  displaySignIn = true;

  public activePage = "active";

  signUpTab(){
    this.displaySignIn = false;
  }

  signInTab(){
    this.displaySignIn = true;
  }

  constructor() { }

  logIn(value){

  }

  ngOnInit() {
  }

}
