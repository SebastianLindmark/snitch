import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {AuthenticationService} from '../_services/authentication.service'
import {UIRouterModule} from "@uirouter/angular";
import { User } from '../_models/user';
import { CurrentUserService } from '../_services/current-user.service';
declare const gapi: any;

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
  @Output() closeEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  public username = "";
  public email = "";
  public password = "";
  public passwordAgain = "";

  constructor(private authentication : AuthenticationService, private currentUser : CurrentUserService) { }


  public activePage = "active";

  signUpTab(){
    this.displaySignIn = false;
  }

  signInTab(){
    this.displaySignIn = true;
  }

  public closeThisComponent(){
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
      this.logIn();
    },

    error => {
      console.log("Could not register user");
      console.log(error);
    }
  );
  }


<<<<<<< HEAD
  public auth2: any;
  public googleInit() {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: '160715832214-50hk5tjj9355otgtqjb4lsjsfhgem2r5.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });
      this.attachSignin(document.getElementById('googleBtn'));
    });
  }



  public attachSignin(element) {
    this.auth2.attachClickHandler(element, {},
      (googleUser) => {

        let profile = googleUser.getBasicProfile();
        console.log('Token || ' + googleUser.getAuthResponse().id_token);
        console.log('ID: ' + profile.getId());
        console.log('Name: ' + profile.getName());
        console.log('Image URL: ' + profile.getImageUrl());
        console.log('Email: ' + profile.getEmail());
        //YOUR CODE HERE
      }, (error) => {
        alert(JSON.stringify(error, undefined, 2));
      });

  }


=======
>>>>>>> 71f808a70821bef5e4a2f0ef01f68d494c193e79
  ngOnInit() {
    this.googleInit();
  }



}
