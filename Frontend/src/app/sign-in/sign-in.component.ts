import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {AuthenticationService} from '../_services/authentication.service'


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  private displaySignIn = false;

  @Input() 
  set showLogIn(showLogIn: boolean) {
    this.displaySignIn = showLogIn;
  }

  @Input() close: boolean;
  @Output() closeEvent = new EventEmitter<boolean>();

  public username = "";
  public email = "";
  public password = "";
  public passwordAgain = "";

  constructor(private authentication : AuthenticationService) { }



  public activePage = "active";

  signUpTab(){
    this.displaySignIn = false;
  }

  signInTab(){
    this.displaySignIn = true;
  }

  closeThisComponent(){
    console.log("hello!");
     this.closeEvent.emit(true);
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
