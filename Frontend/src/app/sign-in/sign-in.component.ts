import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {AuthenticationService} from '../_services/authentication.service'
import {UIRouterModule} from "@uirouter/angular";
import { User } from '../_models/user';
import { CurrentUserService } from '../_services/current-user.service';

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
  @Output() closeEvent: any = new EventEmitter<boolean>();

  public username = "";
  public email = "";
  public password = "";
  public passwordAgain = "";
  public submitted = false;

  constructor(private authentication : AuthenticationService, private currentUser : CurrentUserService) { }


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

  passwordMatches(){
    return this.password == this.passwordAgain
  }

  logIn(){
    this.authentication.login(this.username,this.password).subscribe(data => {
      this.currentUser.setUser(data);
      this.closeEvent.emit(true);
    },
  
    error => {
      console.log("not retreive user");
    }
  );
  }


  register(){

    this.authentication.register(this.username,this.email,this.password).subscribe(data => {
      this.currentUser.setUser(data);
      this.closeEvent.emit(true);
    },
  
    error => {
      console.log("Could not retreive user");
    }
  );
  }


  ngOnInit() {
  }

}
