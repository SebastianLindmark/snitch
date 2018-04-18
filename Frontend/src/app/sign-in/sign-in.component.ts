import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from '../_services/authentication.service'
import { User } from '../_models/user';
import { CurrentUserService } from '../_services/current-user.service';


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

  constructor(private authentication : AuthenticationService, private currentUser : CurrentUserService) { }

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
      this.currentUser.registerState().subscribe(user => {console.log("Received logged in user " + user.username)});
      this.currentUser.setUser(data);
    },
  
    error => {
      console.log("Could not retreive user");
    }

  );
  }

  ngOnInit() {
  }

}
