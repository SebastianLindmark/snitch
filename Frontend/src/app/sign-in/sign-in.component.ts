import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../_services/authentication.service'


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

  constructor(private authentication : AuthenticationService) { }

  displaySignIn = true;

  public activePage = "active";

  signUpTab(){
    this.displaySignIn = false;
  }

  signInTab(){
    this.displaySignIn = true;
  }

  

  logIn(){
    this.authentication.login(this.username,this.password).subscribe(data => {
      console.log("Successfully logged in user");
    },
  
    error => {
      console.log("Could not retreive user");
    }

  );
  }

  ngOnInit() {
  }

}
